import { NextFunction, Request, Response } from 'express';
// import cookieParser from 'cookie-parser';
import crypto from 'crypto';

const CSRF_TOKEN_COOKIE_NAME = 'cocktailist.token';

interface RequestWithCsrf extends Request {
  csrfToken?: String;
}

// generate CSRF token
const generateCSRFToken = (req: RequestWithCsrf, res: Response, next?: NextFunction) => {
  // expected to be used after login
  const csrfToken = crypto.randomBytes(16).toString('hex');
  console.log(csrfToken)

  res.cookie(CSRF_TOKEN_COOKIE_NAME, csrfToken,
    {
      httpOnly: false,
      maxAge: req.session.cookie.maxAge,
    }
  );

  if (next) {
    next();
  }
 }
 
 // validate CSRF token
 const validateCSRFToken = (req: Request, res: Response, next: NextFunction) => {
  const csrfToken = req.cookies[CSRF_TOKEN_COOKIE_NAME];

  if (req.header('X-CSRF-Token') === csrfToken) {
    console.log('matched!');
    next();
  } else {
    console.log('not matched');
    res.status(403).send('Invalid CSRF token');
  }
 }

 // validate there is an active logged-in session
 const isLoggedIn = (req: Request, res: Response, next: NextFunction) => {
  // @ts-ignore
  if (req.session.passport?.user.id) {
    next();
  } else {
    res.status(403).send('Requested feature requires a logged-in session.');
  }
};

 export {
  CSRF_TOKEN_COOKIE_NAME,
  generateCSRFToken,
  validateCSRFToken,
  isLoggedIn,
 };