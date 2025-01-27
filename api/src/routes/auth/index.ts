import passport from 'passport';
import { Strategy } from 'passport-local';
import crypto from 'crypto';
import {dbConnect, models} from '../../db';

const configureAuth = () => {
  passport.use(new Strategy(async (username: string, password: string, cb: any) => {
    await dbConnect();
    // TODO: define User type
    const user: User = await models.user.findOne({
      where: {
        username,
      },
    });

    if (!user) {
      return cb(null, false, { message: 'Incorrect username or password.' });
    }

    // TODO: my current user model doesn't have a salt column...maybe I'll just repurpose the "session_token" col
    const hashedPw = crypto.pbkdf2Sync(password, user.session_token, 310000, 32, 'sha256');

    // I guess I'll repurpose the existing "password_digest" col for this
    if (!hashedPw || !crypto.timingSafeEqual(user.password_digest, hashedPw)) {
      return cb(null, false, { message: 'Incorrect username or password.' });
    }

    return cb(null, user);

  }));
}

export {
  configureAuth,
};
