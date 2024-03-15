import passport from "passport";
import {Strategy as LocalStrategy} from 'passport-local';
import {Strategy as JwtStrategy, ExtractJwt} from 'passport-jwt';
import {compareSync} from "bcrypt";
import {UserModel} from "../models/user.model";
import {generateToken} from "../middlewares/auth.middleware";
import config from "../config/config"

passport.use(new LocalStrategy(
    {usernameField: 'email'},
    async (email, password, done) => {
        try {
            const user = await UserModel.findOne({email: email});

            // Check email verification
            if (!user) {
                return done(null, false, {message: 'Incorrect email.'});
            }

            // Check password verification
            if (!compareSync(password, user.password)) {
                return done(null, false, {message: 'Incorrect password.'});
            }

            return done(null, user);
        } catch (err) {
            return done(err);
        }
    }
));

// JWT Strategy
passport.use(
    new JwtStrategy(
        {
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: config.secret,
        },
        (payload, done) => {
            UserModel.findById(payload.sub, (err: any, user: any) => {
                if (err) return done(err, false);
                if (user) return done(null, user);
                return done(null, false);
            });
        }
    )
);


//Persists user data inside session
passport.serializeUser((user, done) => {
    func(user);
    function func(user: any) {
        return done(null, user.id);
    };
});


//Fetches session details using session id
passport.deserializeUser(function (id, done) {
    UserModel.findById(id)
        .then(user => {
            done(null, user);
        })
        .catch(err => {
            done(err, null);
        });
});

export default passport;