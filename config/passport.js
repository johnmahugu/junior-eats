const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const keys = require("../config/keys");
const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.secretOrKey;

module.exports = (passport, instamobileDB) => {
  passport.use(
    new JwtStrategy(opts, (jwt_payload, done) => {
        instamobileDB.authorizeUser(jwt_payload.id, user => {
          if (user) {
            return done(null, user);
          }
          return done(null, false);
        })
    })
  );
};