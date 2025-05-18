import { NextFunction, Request, Response } from 'express';
import passport from 'passport';
import { Strategy } from 'passport-local';
import crypto from 'crypto';

import { dbConnect, models } from '../../db';
import { CSRF_TOKEN_COOKIE_NAME, generateCSRFToken } from '../../middleware';

const CUSTOM_SESSION_COOKIE_NAME = 'cocktailist.activeSession';

const configureAuth = () => {
  // login logic (called from POST /login)
  passport.use('local', new Strategy(
    async (username: string, password: string, cb: any) => {
      console.log('im in here!');

      await dbConnect();
      // TODO: define User type
      const user: any = await models.user.scope('auth').findOne({
        where: {
          username,
        },
      });

      if (!user) {
        return cb(null, false, { message: 'Incorrect username or password.' });
      }

      const hashedPw = crypto.pbkdf2Sync(password, user.salt, 310000, 32, 'sha256');

      // validate hashedPw against db value
      if (!hashedPw || !crypto.timingSafeEqual(Buffer.from(user.password_digest, 'base64'), hashedPw)) {
        return cb(null, false, { message: 'Incorrect username or password.' });
      }

      return cb(null, user);
  }));

  // session stuff
  // this is used to attach user info to the active session
  passport.serializeUser((user: any, cb) => {
    process.nextTick(() => {
      console.log('in the serializeUser fn!');
      console.log(user);
      cb(null, { id: user.id, username: user.username });
    });
  });

  passport.deserializeUser((serializedUser: any, cb) => {
    process.nextTick(async () => {
      console.log('in the deserializeUser fn!');
      const id = serializedUser.id;

      console.log(serializedUser);

      await dbConnect();
      const user: any = await models.user.scope('auth').findByPk(id);
  
      if (!user) {
        return cb(null, false);
      }

      return cb(null, user);
    });
  });
}

const createUser = async (params: any) => {
  console.log(params);
  const {email, username, password} = params;

  if (!(email && username && password)) {
      return { user: null, error: 'Missing required fields' };
  }

  const salt = crypto.randomBytes(32).toString('base64');
  const hashedPwStr = crypto.pbkdf2Sync(password, salt, 310000, 32, 'sha256').toString('base64');
  
  await dbConnect();
  const user: any = await models.user.findOne({
      where: {
        email,
      },
    });

    if (user) {
      return { user: null, error: 'User with that email already exists!' };
    }

    try {
      const result = await models.user.create({
        username,
        email,
        password_digest: hashedPwStr,
        salt,
        // this column isn't used anymore
        session_token: 'PLACEHOLDER',
      });

      // set up a default list
      await models.list.create({
        name: 'to try',
        user_id: result.dataValues.id,
      });
      
      return { user: result, error: null};
    } catch (e) {
      // if the model fails validation, it ends up here
      return { user: null, error: e};
    }
}

const doPostLoginActions = (req: Request, res: Response, next: NextFunction) => {
  console.log('hello!');

  // @ts-ignore
  const passportObj = req.session.passport;
  console.log('the current passport object:');
  console.dir(passportObj);

  if (!passportObj) {
    throw new Error('no user attached!');
  }
  
  // set extra cookie that can be parsed by FE JS
  res.cookie(
    CUSTOM_SESSION_COOKIE_NAME,
    `username:${passportObj.user.username};id:${passportObj.user.id}`,
    {
      httpOnly: false,
      maxAge: req.session.cookie.maxAge,
      ...(process.env.ENV === 'production' ? {domain: 'cocktailist.club'} : {}),
    }
  );

  // set csrf token
  generateCSRFToken(req, res);

  const response = {
    status: 'success',
    ...passportObj,
  };

  res.send(response);  
}

const logout =  (req: Request, res: Response, next: NextFunction) => {
  const user = req.user;

  console.log('in logout function');
  console.log('current user: ', user);

  if (!user) {
    const errorMessage = 'No user associated with session!';
    console.error(errorMessage);
    return next(errorMessage);
  }

  req.logout(user, (err) => {
    if (err) { 
      console.error(err);
      return next(err);
    }

    res.clearCookie(CUSTOM_SESSION_COOKIE_NAME, {
      ...(process.env.ENV === 'production' ? {domain: 'cocktailist.club'} : {}),
    });
    res.clearCookie(CSRF_TOKEN_COOKIE_NAME, {
      ...(process.env.ENV === 'production' ? {domain: 'cocktailist.club'} : {}),
    });

    res.send({
      status: 'success',
      message: 'logged out'
    });
  });
}

const getUser = async (userId: string) => {
  await dbConnect();
  return await models.user.findByPk(userId);
};

export default {
  configureAuth,
  createUser,
  doPostLoginActions,
  logout,
  getUser,
};
