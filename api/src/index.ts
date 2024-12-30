import express, { Express, Request, Response } from "express";
import cors from "cors";

import cocktails from './routes/cocktails';
import bars from './routes/bars';
import lists from './routes/lists';
import reviews from './routes/reviews';

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(cors({
  origin: 'http://localhost:5173',
}));

const PROD_PREFIX = "(/new/api)?";

// cocktails
app.route(PROD_PREFIX + "/cocktails/:cocktailId/reviews")
  .get(async (req: Request, res: Response) => {
    res.send(await reviews.getReviewsForCocktail(req.params.cocktailId));
  });

app.route(PROD_PREFIX + "/cocktails/:id")
  .get(async (req: Request, res: Response) => {
    res.send(await cocktails.getCocktail(req.params.id));
  })
  .put((req:Request, res: Response) => {
    res.send("TODO - edit cocktail, will require session");
  });


app.route(PROD_PREFIX + "/cocktails")
  .get(async (req: Request, res: Response) => {
    res.send(await cocktails.getCocktailsWithBars());
  })
  .post((req:Request, res: Response) => {
    res.send("TODO - create cocktail, will require session");
  });

app.route(PROD_PREFIX + "/liquors")
  .get(async (req: Request, res: Response) => {
    res.send(await cocktails.getLiquors());
  });

// bars
app.route(PROD_PREFIX + "/bars/:id/cocktails")
  .get(async (req: Request, res: Response) => {
    res.send(await bars.getBarCocktails(req.params.id));
  });

app.route(PROD_PREFIX + "/bars/:id")
  .get(async (req: Request, res: Response) => {
    res.send(await bars.getBar(req.params.id));
  })
  .put((req:Request, res: Response) => {
    res.send("TODO - edit bar info (currently no FE flow), will require session");
  });

app.route(PROD_PREFIX + "/bars")
  .get(async (req: Request, res: Response) => {
    res.send(await bars.getBars());
  })
  .post((req:Request, res: Response) => {
    res.send("TODO - create bar, will require session");
  });

// lists : all routes require a session
app.route(PROD_PREFIX + "/lists/:id")
// TODO: add middleware to check for auth'd session
  .get(async (req: Request, res: Response) => {
    res.send(await lists.getListWithCocktails(req.params.id));
  })
  .put((req:Request, res: Response) => {
    res.send("TODO - edit list info - don't think we have a FE flow yet, will require session");
  })
  .delete((req:Request, res: Response) => {
    res.send("TODO - delete list, will require session");
  });

app.route(PROD_PREFIX + "/lists")
// TODO: add middleware to check for auth'd session; pass user id into getLists call
  .get(async (req: Request, res: Response) => {
    res.send(await lists.getLists());
  })
  .post((req:Request, res: Response) => {
    res.send("TODO - create list, will require session");
  });

// listitem : all routes require a session
app.route(PROD_PREFIX + "/listitems/:id")
  .delete((req:Request, res: Response) => {
    res.send("TODO - delete list item, will require session");
  });

app.route(PROD_PREFIX + "/listitems")
  .post((req:Request, res: Response) => {
    res.send("TODO - create list item, will require session");
  });

// reviews
app.route(PROD_PREFIX + "/reviews/:id")
  .put((req:Request, res: Response) => {
    res.send("TODO - edit review - don't think we have a FE flow yet, will require session");
  })
  .delete((req:Request, res: Response) => {
    res.send("TODO - delete review, will require session");
  });

app.route(PROD_PREFIX + "/reviews")
  .post((req:Request, res: Response) => {
    res.send("TODO - create review, will require session");
  });

// users
app.route(PROD_PREFIX + "/users/:id")
  .get((req: Request, res: Response) => {
    res.send("TODO - get user");
  });

app.route(PROD_PREFIX + "/users")
  .post((req:Request, res: Response) => {
    res.send("TODO - create user");
  });

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});