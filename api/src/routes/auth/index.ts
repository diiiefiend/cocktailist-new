import passport from 'passport';
import { Strategy } from 'passport-local';
import crypto from 'crypto';
import {dbConnect, models} from '../../db';

const configureAuth = () => {
  console.log('hi there');

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
}

export {
  configureAuth,
};
