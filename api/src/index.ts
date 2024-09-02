import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";

import cocktails from './routes/cocktails/cocktails';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

// cocktails
app.route("/cocktails/:id")
  .get((req: Request, res: Response) => {
    res.send("TODO - get cocktail info");
  })
  .put((req:Request, res: Response) => {
    res.send("TODO - edit cocktail, will require session");
  });

app.route("/cocktails")
  .get((req: Request, res: Response) => {
    res.send(cocktails.getCocktails());
  })
  .post((req:Request, res: Response) => {
    res.send("TODO - create cocktail, will require session");
  });

// bars
app.route("/bars/:id")
  .get((req: Request, res: Response) => {
    res.send("TODO - get bar info");
  })
  .put((req:Request, res: Response) => {
    res.send("TODO - edit bar info (currently no FE flow), will require session");
  });

app.route("/bars")
  .get((req: Request, res: Response) => {
    res.send("TODO - get list of all bars");
  })
  .post((req:Request, res: Response) => {
    res.send("TODO - create bar, will require session");
  });

// lists : all routes require a session
app.route("/lists/:id")
  .get((req: Request, res: Response) => {
    res.send("TODO - get list details, will require session");
  })
  .put((req:Request, res: Response) => {
    res.send("TODO - edit list info - don't think we have a FE flow yet, will require session");
  })
  .delete((req:Request, res: Response) => {
    res.send("TODO - delete list info, will require session");
  });

app.route("/lists")
  .get((req: Request, res: Response) => {
    res.send('TODO - get all lists for logged in user, will require session');
  })
  .post((req:Request, res: Response) => {
    res.send("TODO - create list, will require session");
  });

// listitem : all routes require a session
app.route("/listitems")
  .post((req:Request, res: Response) => {
    res.send("TODO - bulk update list items (create AND delete possible), will require session");
  });

// reviews
app.route("/reviews/:id")
  .put((req:Request, res: Response) => {
    res.send("TODO - edit review - don't think we have a FE flow yet, will require session");
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

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});