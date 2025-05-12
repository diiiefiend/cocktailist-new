import express, { Express, NextFunction, Request, Response } from 'express';
import cors from 'cors';
import passport from 'passport';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
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

// passport configure auth stuff
auth.configureAuth();

// global middleware
app.use(cors({
  origin: ['http://localhost:5173', 'https://cocktailist.club'],
}));

app.use(cookieParser(process.env.COOKIE_PARSER_SECRET, {
  //@ts-ignore
  sameSite: 'strict'
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

// validate this later
if (app.get('env') === 'production') {
  app.set('trust proxy', 1) // trust first proxy
  expressSessionSettings.cookie.secure = true // serve secure cookies
}

app.use(session(expressSessionSettings));

app.use(passport.authenticate('session'));

// cocktails
app.route('/cocktails/:cocktailId/reviews')
  .get(async (req: Request, res: Response) => {
    res.send(await reviews.getReviewsForCocktail(req.params.cocktailId));
  });

app.route('/cocktails/:id')
  .get(async (req: Request, res: Response) => {
    res.send(await cocktails.getCocktail(req.params.id));
  })
  .put(isLoggedIn, validateCSRFToken, async (req:Request, res: Response) => {
    const cocktailData = req.body;
    res.send(await cocktails.updateCocktail(req.params.id, cocktailData));
  });
  // Should I let cocktails be deleted?

app.route('/cocktails')
  .get(async (req: Request, res: Response) => {
    res.send(await cocktails.getCocktailsWithBars());
  })
  .post(isLoggedIn, validateCSRFToken, async (req:Request, res: Response) => {
    const cocktailData = req.body;
    res.send(await cocktails.addCocktail(cocktailData));
  });

app.route('/liquors')
  .get(async (req: Request, res: Response) => {
    res.send(await cocktails.getLiquors());
  });

// bars
app.route('/bars/:id/cocktails')
  .get(async (req: Request, res: Response) => {
    res.send(await bars.getBarCocktails(req.params.id));
  });

app.route('/bars/:id')
  .get(async (req: Request, res: Response) => {
    res.send(await bars.getBar(req.params.id));
  })
  .put(isLoggedIn, validateCSRFToken, async (req:Request, res: Response) => {
    const barData = req.body;
    res.send(await bars.updateBar(req.params.id, barData));
  });

app.route('/bars')
  .get(async (req: Request, res: Response) => {
    res.send(await bars.getBars());
  })
  .post(isLoggedIn, validateCSRFToken, async (req:Request, res: Response) => {
    const barData = req.body;
    res.send(await bars.addBar(barData));
  });

// lists : all routes require a session
app.route('/lists/:id')
  .get(isLoggedIn, async (req: Request, res: Response) => {
    // @ts-ignore
    const userId = req.session.passport.user.id;

    res.send(await lists.getListWithCocktails(req.params.id, userId));
  })
  .put(isLoggedIn, validateCSRFToken, async (req:Request, res: Response) => {
    const listData = req.body;
    // @ts-ignore
    const userId = req.session.passport.user.id;
    
    res.send(await lists.updateList(req.params.id, listData, userId));
  })
  .delete(isLoggedIn, validateCSRFToken, async (req:Request, res: Response) => {
    // @ts-ignore
    const userId = req.session.passport.user.id;

    res.send(await lists.deleteList(req.params.id, userId));
  });

app.route('/lists')
  .get(isLoggedIn, async (req: Request, res: Response) => {
    console.log('Session:');
    console.dir(req.session);
    // @ts-ignore
    res.send(await lists.getLists(req.session.passport.user.id));
  })
  .post(isLoggedIn, validateCSRFToken, async (req:Request, res: Response) => {
    const listData = req.body;
    // @ts-ignore
    const userId = req.session.passport.user.id;
    
    res.send(await lists.addList(listData, userId));
  });

// listitem : all routes require a session
app.route('/listitems/:id')
  .delete(isLoggedIn, validateCSRFToken, (req:Request, res: Response) => {
    res.send('TODO - delete list item, will require session');
  });

app.route('/listitems')
  .post(isLoggedIn, validateCSRFToken, (req:Request, res: Response) => {
    res.send('TODO - create list item, will require session');
  });

// reviews
app.route('/reviews/:id')
  .put(isLoggedIn, validateCSRFToken, (req:Request, res: Response) => {
    res.send('TODO - edit review - dont think we have a FE flow yet, will require session');
  })
  .delete(isLoggedIn, validateCSRFToken, (req:Request, res: Response) => {
    res.send('TODO - delete review, will require session');
  });

app.route('/reviews')
  .post(isLoggedIn, validateCSRFToken, (req:Request, res: Response) => {
    res.send('TODO - create review, will require session');
  });

// users
app.route('/users/:id')
  .get((req: Request, res: Response) => {
    res.send('TODO - get user');
  });

app.route('/users')
  .post(async (req: Request, res: Response, next: NextFunction) => {
    console.log(req.body);
    const {user, error} = await auth.createUser(req.body);

    if (error || !user) { 
      console.error(error);
      return next(error || 'error'); 
    }

    req.login(user, (err) => {
      if (err) { 
        console.error(err);
        return next(err);
      }

      res.send('success!');
    });
  });

// sessions
// uses the "local" strategy defined in auth.configureAuth
// expected payload: username, password
app.route('/login')
  .post(passport.authenticate('local'), auth.createNewSessionWithPassport);

app.route('/logout')
  .post((req: Request, res: Response, next: NextFunction) => {
    req.logout((err) => {
      if (err) { 
        console.error(err);
        return next(err);
      }
      res.send('logged out');
    });
  });

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});