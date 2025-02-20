import express, { Express, NextFunction, Request, Response } from 'express';
import cors from 'cors';
import passport from 'passport';
import bodyParser from 'body-parser';
import session from 'express-session';
import connectSession from 'connect-session-sequelize';

import { getDbInstance } from './db';
import cocktails from './routes/cocktails';
import bars from './routes/bars';
import lists from './routes/lists';
import reviews from './routes/reviews';
import { configureAuth } from './routes/auth';

const app: Express = express();
const port = process.env.PORT || 3000;

configureAuth();

app.use(cors({
  origin: ['http://localhost:5173', 'https://cocktailist.club'],
}));

app.use(bodyParser.json());

// session stuff
// const SequelizeStore = connectSession(session.Store);
// app.use(session({
//   secret: 'keyboard cat',
//   store: new SequelizeStore({ db: getDbInstance() }),
//   resave: false,
//   saveUninitialized: false,
// }));
// app.use(passport.authenticate('session'));

// cocktails
app.route('/cocktails/:cocktailId/reviews')
  .get(async (req: Request, res: Response) => {
    res.send(await reviews.getReviewsForCocktail(req.params.cocktailId));
  });

app.route('/cocktails/:id')
  .get(async (req: Request, res: Response) => {
    res.send(await cocktails.getCocktail(req.params.id));
  })
  .put((req:Request, res: Response) => {
    res.send('TODO - edit cocktail, will require session');
  });

app.route('/cocktails')
  .get(async (req: Request, res: Response) => {
    res.send(await cocktails.getCocktailsWithBars());
  })
  .post((req:Request, res: Response) => {
    res.send('TODO - create cocktail, will require session');
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
  .put((req:Request, res: Response) => {
    res.send('TODO - edit bar info (currently no FE flow), will require session');
  });

app.route('/bars')
  .get(async (req: Request, res: Response) => {
    res.send(await bars.getBars());
  })
  .post((req:Request, res: Response) => {
    res.send('TODO - create bar, will require session');
  });

// lists : all routes require a session
app.route('/lists/:id')
// TODO: add middleware to check for auth'd session
  .get(async (req: Request, res: Response) => {
    res.send(await lists.getListWithCocktails(req.params.id));
  })
  .put((req:Request, res: Response) => {
    res.send('TODO - edit list info - dont think we have a FE flow yet, will require session');
  })
  .delete((req:Request, res: Response) => {
    res.send('TODO - delete list, will require session');
  });

app.route('/lists')
// TODO: add middleware to check for auth'd session; pass user id into getLists call
  .get(async (req: Request, res: Response) => {
    res.send(await lists.getLists());
  })
  .post((req:Request, res: Response) => {
    res.send('TODO - create list, will require session');
  });

// listitem : all routes require a session
app.route('/listitems/:id')
  .delete((req:Request, res: Response) => {
    res.send('TODO - delete list item, will require session');
  });

app.route('/listitems')
  .post((req:Request, res: Response) => {
    res.send('TODO - create list item, will require session');
  });

// reviews
app.route('/reviews/:id')
  .put((req:Request, res: Response) => {
    res.send('TODO - edit review - dont think we have a FE flow yet, will require session');
  })
  .delete((req:Request, res: Response) => {
    res.send('TODO - delete review, will require session');
  });

app.route('/reviews')
  .post((req:Request, res: Response) => {
    res.send('TODO - create review, will require session');
  });

// users
app.route('/users/:id')
  .get((req: Request, res: Response) => {
    res.send('TODO - get user');
  });

app.route('/users')
  .post((req: Request, res: Response) => {
    res.send('TODO - create user');
  });

// session
app.route('/session')
  .post((req: Request, res: Response, next: NextFunction) => {
    passport.authenticate('local', function(err: any, user: any, info: any, status: any) {
      // if (err) { return next(err) }
      // if (!user) { return res.redirect('/signin') }
      // res.redirect('/account');
      console.log('err: ', err);
      console.log('user: ', user);
      console.log('info: ', info);
      console.log('status: ', status);
      res.send(info.message);
    })(req, res, next);
  });

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});