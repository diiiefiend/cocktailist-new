import passport from 'passport';
import { Strategy } from 'passport-local';
import crypto from 'crypto';
import {dbConnect, models} from '../../db';

const configureAuth = () => {
  // login stuff
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
  passport.serializeUser((user: any, cb) => {
    process.nextTick(() => {
      cb(null, { id: user.id, username: user.username });
    });
  });

  passport.deserializeUser((user: any, cb) => {
    process.nextTick(() => {
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

    const result = await models.user.create({
      username,
      email,
      password_digest: hashedPwStr,
      salt,
      // placeholder value?
      session_token: crypto.randomBytes(16).toString('base64'),
    });
    
    return { user: result, error: null};
}

export default {
  configureAuth,
  createUser,
};
