import express, { Express, NextFunction, Request, Response } from 'express';
import cors from 'cors';
import passport from 'passport';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import multer from 'multer';
import session from 'express-session';
import connectSession from 'connect-session-sequelize';

import { getDbInstance } from './db';
import { isLoggedIn, validateCSRFToken } from './middleware';
import cocktails from './routes/cocktails';
import bars from './routes/bars';
import lists from './routes/lists';
import reviews from './routes/reviews';
import auth from './routes/auth';

const app: Express = express();
const port = process.env.PORT || 3000;
const multerMiddleware = multer();

// passport configure auth stuff
auth.configureAuth();

// global middleware
app.use(cors({
  origin: ['http://localhost:5173', 'https://cocktailist.club'],
  credentials: true,
}));

app.use(bodyParser.json());

// configure session stuff on app
const SequelizeStore = connectSession(session.Store);
const sessionStore = new SequelizeStore({ db: getDbInstance() });

const expressSessionSettings = {
  name: 'cocktailist.sid',
  secret: process.env.SESSION_STORAGE_SECRET!,
  store: sessionStore,
  resave: false,
  saveUninitialized: false,
  cookie: {
    // 24 hours in ms
    maxAge: 86400000,
    secure: false,
  },
};

sessionStore.sync();

let cookieParserOptions = {};

// TODO: validate this later
if (app.get('env') === 'production') {
  console.log('production env setting!');
  
  app.set('trust proxy', 1) // trust first proxy
  expressSessionSettings.cookie.secure = true // serve secure cookies
}

app.use(cookieParser(process.env.COOKIE_PARSER_SECRET, cookieParserOptions));

app.use(session(expressSessionSettings));

app.use(passport.authenticate('session'));

// cocktails
app.route('/cocktails/:cocktailId/reviews')
  .get(async (req: Request, res: Response) => {
    try {
      res.send(await reviews.getReviewsForCocktail(req.params.cocktailId));
    } catch (e) {
      errorHandler(e, res);
    }
  })
  .post(isLoggedIn, validateCSRFToken, async (req:Request, res: Response) => {
    const reviewData = req.body;
    // @ts-ignore
    const userId = req.session.passport.user.id;
    
    try {
      res.send(await reviews.addReview(req.params.cocktailId, reviewData, userId));
    } catch (e) {
      errorHandler(e, res);
    }
  });

app.route('/cocktails/:id/lists')
  .get(isLoggedIn, async (req: Request, res: Response) => {
    // @ts-ignore
    const userId = req.session.passport.user.id;

    try {
      res.send(await lists.getListInfoForCocktail(req.params.id, userId));
    } catch (e) {
      errorHandler(e, res);
    }
  })
  .post(isLoggedIn, validateCSRFToken, async (req:Request, res: Response) => {
    const listsData = req.body;
    // @ts-ignore
    const userId = req.session.passport.user.id;
    
    try {
      res.send(await lists.updateListItems(listsData, req.params.id, userId));
    } catch (e) {
      errorHandler(e, res);
    }
  });

app.route('/cocktails/:id')
  .get(async (req: Request, res: Response) => {
    try {
      res.send(await cocktails.getCocktail(req.params.id));
    } catch (e) {
      errorHandler(e, res);
    }
  })
  .put(isLoggedIn, validateCSRFToken, multerMiddleware.single('img'), async (req:Request, res: Response) => {
    const cocktailData = req.body;
    const cocktailImage = req.file;
    
    try { 
      res.send(await cocktails.updateCocktail(req.params.id, cocktailData, cocktailImage));
    } catch (e) {
      errorHandler(e, res);
    }
  });
  // Should I let cocktails be deleted? if so, relationships have to be cleaned up too (reviews, listitems, imgs)

app.route('/cocktails')
  .get(async (req: Request, res: Response) => {
    try {
      const {page = 1, limit = 50}  = req.query;
      res.send(await cocktails.getCocktailsWithBars(+page, +limit));
    } catch (e) {
      errorHandler(e, res);
    }
  })
  .post(isLoggedIn, validateCSRFToken, multerMiddleware.single('img'), async (req:Request, res: Response) => {
    const cocktailData = req.body;
    const cocktailImage = req.file;

    try {
      res.send(await cocktails.addCocktail(cocktailData, cocktailImage));
    } catch (e) {
      errorHandler(e, res);
    }
  });

app.route('/liquors')
  .get(async (req: Request, res: Response) => {
    try {
      res.send(await cocktails.getLiquors());
    } catch (e) {
      errorHandler(e, res);
    }
  });

// bars
app.route('/bars/:id/cocktails')
  .get(async (req: Request, res: Response) => {
    try {
      res.send(await bars.getBarCocktails(req.params.id));
    } catch (e) {
      errorHandler(e, res);
    }
  });

app.route('/bars/:id')
  .get(async (req: Request, res: Response) => {
    try {
      res.send(await bars.getBar(req.params.id));
    } catch (e) {
      errorHandler(e, res);
    }
  })
  .put(isLoggedIn, validateCSRFToken, async (req:Request, res: Response) => {
    const barData = req.body;

    // TODO: currently not called
    try {
      res.send(await bars.updateBar(req.params.id, barData));
    } catch (e) {
      errorHandler(e, res);
    }
  });

app.route('/bars')
  .get(async (req: Request, res: Response) => {
    try {
      res.send(await bars.getBars());
    } catch (e) {
      errorHandler(e, res);
    }
  })
  .post(isLoggedIn, validateCSRFToken, async (req:Request, res: Response) => {
    const barData = req.body;
    
    // TODO: currently not called
    try {
      res.send(await bars.addBar(barData));
    } catch (e) {
      errorHandler(e, res);
    }
  });

// lists : all routes require a session
app.route('/lists/:id')
  .get(isLoggedIn, async (req: Request, res: Response) => {
    // @ts-ignore
    const userId = req.session.passport.user.id;

    try{
      res.send(await lists.getListWithCocktails(req.params.id, userId));
    } catch (e) {
      errorHandler(e, res);
    }
  })
  .put(isLoggedIn, validateCSRFToken, async (req:Request, res: Response) => {
    const listData = req.body;
    // @ts-ignore
    const userId = req.session.passport.user.id;
    
    // TODO: currently not called
    try {
      res.send(await lists.updateList(req.params.id, listData, userId));
    } catch (e) {
      errorHandler(e, res);
    }
  })
  .delete(isLoggedIn, validateCSRFToken, async (req:Request, res: Response) => {
    // @ts-ignore
    const userId = req.session.passport.user.id;

    try {
      res.send(await lists.deleteList(req.params.id, userId));
    } catch (e) {
      errorHandler(e, res);
    }
  });

app.route('/lists')
  .get(isLoggedIn, async (req: Request, res: Response) => {
    // @ts-ignore
    const userId = req.session.passport.user.id;
    
    try{
      res.send(await lists.getLists(userId));
    } catch (e) {
      errorHandler(e, res);
    }
  })
  .post(isLoggedIn, validateCSRFToken, async (req:Request, res: Response) => {
    const listData = req.body;
    // @ts-ignore
    const userId = req.session.passport.user.id;
    
    try {
      res.send(await lists.addList(listData, userId));
    } catch (e) {
      errorHandler(e, res);
    }
  });

// listitem : all routes require a session
app.route('/listitems/:id')
  .delete(isLoggedIn, validateCSRFToken, async (req:Request, res: Response) => {
    // @ts-ignore
    const userId = req.session.passport.user.id;

    try {
      res.send(await lists.deleteListItem(req.params.id, userId));
    } catch (e) {
      errorHandler(e, res);
    }
  });

// reviews
app.route('/reviews/:id')
  .put(isLoggedIn, validateCSRFToken, async (req:Request, res: Response) => {
    const reviewData = req.body;
    // @ts-ignore
    const userId = req.session.passport.user.id;
    
    try {
      res.send(await reviews.updateReview(req.params.id, reviewData, userId));
    } catch (e) {
      errorHandler(e, res);
    }
  })
  .delete(isLoggedIn, validateCSRFToken, async (req:Request, res: Response) => {
    // @ts-ignore
    const userId = req.session.passport.user.id;

    try {
      res.send(await reviews.deleteReview(req.params.id, userId));
    } catch (e) {
      errorHandler(e, res);
    }
  });

// users
app.route('/users/:id')
  .get(async (req: Request, res: Response) => {
    try {
      // TODO: currently not called
      res.send(await auth.getUser(req.params.id));
    } catch (e) {
      errorHandler(e, res);
    }
  });

app.route('/users')
  .post(async (req: Request, res: Response, next: NextFunction) => {
    console.log(req.body);
    const {user, error} = await auth.createUser(req.body);

    if (error || !user) { 
      console.error(error);
      return next(error || 'error'); 
    }

    // create new session
    req.login(user, (err) => {
      if (err) { 
        console.error(err);
        return next(err);
      }

      auth.doPostLoginActions(req, res, next);
    });
  });

  // should we allow deleting accounts?

// sessions
// uses the "local" strategy defined in auth.configureAuth
// expected payload: username, password
app.route('/login')
// passport.authenticate handles logging in
.post(passport.authenticate('local'), async (req: Request, res: Response, next: NextFunction) => {
  auth.doPostLoginActions(req, res, next);
});

app.route('/logout')
  .post((req: Request, res: Response, next: NextFunction) => {
    auth.logout(req, res, next);
  });

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});

// generic error handler
const errorHandler = (error: any, res: Response) => {
  console.error(error);
  res.status(403).send(error);
}