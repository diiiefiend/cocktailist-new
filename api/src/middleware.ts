import { NextFunction, Request, Response } from 'express';
// import cookieParser from 'cookie-parser';
import crypto from 'crypto';

interface RequestWithCsrf extends Request {
  csrfToken?: String;
}

// generate CSRF token middleware
const generateCSRFToken = (req: RequestWithCsrf, res: Response, next: NextFunction) => {
  const csrfToken = crypto.randomBytes(16).toString('hex');
  console.log(csrfToken)

  res.cookie('mycsrfToken', csrfToken);
  req.csrfToken = csrfToken;

  next();
 }
 
 // validate CSRF token middleware
 // expected to be used with a route where the request has a body (eg a PUT/POST)
 const validateCSRFToken = (req: Request, res: Response, next: NextFunction) => {
  const csrfToken = req.cookies.mycsrfToken;
  if (req.body?.csrfToken === csrfToken) {
    next();
  } else {
    res.status(403).send('Invalid CSRF token');
  }
 }

 // validate there is an active logged-in session
 const isLoggedIn = (req: Request, res: Response, next: NextFunction) => {
  // @ts-ignore
  if (req.session.passport?.user.id) {
    next();
  } else {
    res.status(403).send("Requested feature requires a logged-in session.");
  }
};

 export {
  generateCSRFToken,
  validateCSRFToken,
  isLoggedIn,
 };