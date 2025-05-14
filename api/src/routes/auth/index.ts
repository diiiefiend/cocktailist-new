import { NextFunction, Request, Response } from 'express';
import passport from 'passport';
import { Strategy } from 'passport-local';
import crypto from 'crypto';
import {dbConnect, models} from '../../db';

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
      cb(null, { id: user.id, username: user.username });
    });
  });

  passport.deserializeUser((serializedUser: any, cb) => {
    process.nextTick(async () => {
      console.log('in the deserializeUser fn!');
      const id = serializedUser.id;

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
      
      return { user: result, error: null};
    } catch (e) {
      // if the model fails validation, it ends up here
      return { user: null, error: e};
    }
}

// uses the "local" strategy defined in auth.configureAuth
// expected payload: username, password
// expected to be chained with createNewSessionWithPassport on success
// TODO: figure out how to properly convert this to a promise later; currently this isn't used
const loginUser = (req: Request, res: Response, next: NextFunction) => {
  console.log('hello');
  passport.authenticate('local', function(err: any, user: any, info: any, status: any) {
    console.log('user: ', user);
    console.log('info: ', info);
    console.log('status: ', status);

    if (err) { 
      console.error(err);
      res.send(err);
    }
    
    if (!user) { res.send('no user found!') }

    next();
  });
}

const createNewSessionWithPassport = (req: Request, res: Response, next: NextFunction) => {
  // @ts-ignore
  const passportObj = req.session.passport;
  console.log('the current passport object:');
  console.dir(passportObj);

  // make new session after login
  req.session.regenerate((err) => {
    if (err) {
      console.error(err);
      return next(err);
    }
    // @ts-ignore
    req.session.passport = passportObj;
    req.session.save((err) => {
      if (err) {
        console.error(err);
        return next(err);
      }

      // set extra cookie that can be parsed by FE JS
      res.cookie(
        'cocktailist.activeSession',
        'true',
        {
          httpOnly: false,
          maxAge: req.session.cookie.maxAge,
        }
      );

      const response = {
        status: 'success',
        sessionInfo: req.session,
      };

      res.send(response);
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
  loginUser,
  createNewSessionWithPassport,
  getUser,
};
