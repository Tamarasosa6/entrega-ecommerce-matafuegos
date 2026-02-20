const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const bcrypt = require('bcrypt');
const User = require('../models/user')

// ---------- REGISTER LOCAL ----------
passport.use(
    'register',
    new LocalStrategy(
        {
            usernameField: 'email',
            passReqToCallback: true
        },
        async (req, email, password, done) => {
            try {
                const exists = await User.findOne({ email });
                if (exists) return done(null, false);

                const hashedPassword = await bcrypt.hash(password, 10);

                const user = await User.create({
                    email,
                    password: hashedPassword
                });

                return done(null, user);
            } catch (error) {
                return done(error);
            }
        }
    )
);

// ---------- LOGIN LOCAL ----------
passport.use(
    'login',
    new LocalStrategy(
        { usernameField: 'email' },
        async (email, password, done) => {
            try {
                const user = await User.findOne({ email });
                if (!user) return done(null, false);

                const isValid = await bcrypt.compare(password, user.password);
                if (!isValid) return done(null, false);

                return done(null, user);
            } catch (error) {
                return done(error);
            }
        }
    )
);

// ---------- GITHUB ----------
passport.use(
    new GitHubStrategy(
        {
            clientID: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
            callbackURL: 'http://localhost:8080/auth/github/callback'
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                let user = await User.findOne({ githubId: profile.id });

                if (!user) {
                    user = await User.create({
                        githubId: profile.id,
                        email: profile.emails[0].value
                    });
                }

                return done(null, user);
            } catch (error) {
                return done(error);
            }
        }
    )
);

// ---------- SESIÓN ----------
passport.serializeUser((user, done) => {
    done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
    const user = await User.findById(id);
    done(null, user);
});
