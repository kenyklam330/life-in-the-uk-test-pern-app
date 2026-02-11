import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import dotenv from 'dotenv';
import pool from './database.js';

dotenv.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if user exists
        const checkUser = await pool.query(
          'SELECT * FROM users WHERE google_id = $1',
          [profile.id]
        );

        if (checkUser.rows.length > 0) {
          // Update last login
          await pool.query(
            'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE google_id = $1',
            [profile.id]
          );
          return done(null, checkUser.rows[0]);
        }

        // Create new user
        const newUser = await pool.query(
          `INSERT INTO users (google_id, email, name, picture) 
           VALUES ($1, $2, $3, $4) 
           RETURNING *`,
          [
            profile.id,
            profile.emails[0].value,
            profile.displayName,
            profile.photos[0]?.value || null,
          ]
        );

        return done(null, newUser.rows[0]);
      } catch (err) {
        console.error('Error in Google Strategy:', err);
        return done(err, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    done(null, user.rows[0]);
  } catch (err) {
    done(err, null);
  }
});

export default passport;
