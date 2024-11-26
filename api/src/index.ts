import express, { Express, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";

import cocktails from './routes/cocktails';
import bars from './routes/bars';
import lists from './routes/lists';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(cors({
  origin: 'http://localhost:5173',
}));

// cocktails
app.route("/cocktails/:id")
  .get(async (req: Request, res: Response) => {
    res.send(await cocktails.getCocktail(+req.params.id));
  })
  .put((req:Request, res: Response) => {
    res.send("TODO - edit cocktail, will require session");
  });

app.route("/cocktails")
  .get(async (req: Request, res: Response) => {
    res.send(await cocktails.getCocktails());
  })
  .post((req:Request, res: Response) => {
    res.send("TODO - create cocktail, will require session");
  });

app.route("/liquors")
  .get(async (req: Request, res: Response) => {
    res.send(await cocktails.getLiquors());
  });

// bars
app.route("/bars/:id")
  .get(async (req: Request, res: Response) => {
    res.send(await bars.getBar(+req.params.id));
  })
  .put((req:Request, res: Response) => {
    res.send("TODO - edit bar info (currently no FE flow), will require session");
  });

app.route("/bars")
  .get(async (req: Request, res: Response) => {
    res.send(await bars.getBars());
  })
  .post((req:Request, res: Response) => {
    res.send("TODO - create bar, will require session");
  });

// lists : all routes require a session
app.route("/lists/:id")
// TODO: add middleware to check for auth'd session
  .get(async (req: Request, res: Response) => {
    res.send(await lists.getList(+req.params.id));
  })
  .put((req:Request, res: Response) => {
    res.send("TODO - edit list info - don't think we have a FE flow yet, will require session");
  })
  .delete((req:Request, res: Response) => {
    res.send("TODO - delete list, will require session");
  });

app.route("/lists")
// TODO: add middleware to check for auth'd session; pass user id into getLists call
  .get(async (req: Request, res: Response) => {
    res.send(await lists.getLists());
  })
  .post((req:Request, res: Response) => {
    res.send("TODO - create list, will require session");
  });

// listitem : all routes require a session
app.route("/listitems/:id")
  .delete((req:Request, res: Response) => {
    res.send("TODO - delete list item, will require session");
  });

app.route("/listitems")
  .post((req:Request, res: Response) => {
    res.send("TODO - create list item, will require session");
  });

// reviews
app.route("/reviews/:id")
  .put((req:Request, res: Response) => {
    res.send("TODO - edit review - don't think we have a FE flow yet, will require session");
  })
  .delete((req:Request, res: Response) => {
    res.send("TODO - delete review, will require session");
  });

app.route("/reviews")
  .post((req:Request, res: Response) => {
    res.send("TODO - create review, will require session");
  });

// users
app.route("/users/:id")
  .get((req: Request, res: Response) => {
    res.send("TODO - get user");
  });

app.route("/users")
  .post((req:Request, res: Response) => {
    res.send("TODO - create user");
  });

// composite routes
app.route("/cocktailsWithBars")
  .get(async (req: Request, res: Response) => {
    res.send(await cocktails.getCocktailsWithBars());
  })

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});