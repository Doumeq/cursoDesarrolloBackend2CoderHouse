import passport from "passport";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import dotenv from "dotenv";
dotenv.config();

const cookieExtractor = (req) => {
  if (!req || !req.cookies) return null;
  return req.cookies[process.env.COOKIE_NAME || "authToken"] || null;
};

export const initPassport = () => {
  passport.use(
    "jwt",
    new JwtStrategy(
      {
        jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
        secretOrKey: process.env.JWT_SECRET
      },
      async (payload, done) => {
        try {
          return done(null, payload.user);
        } catch (err) {
          return done(err);
        }
      }
    )
  );
};
