require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
require("./db/conn");
const PORT = 6005;
const session = require("express-session");
const passport = require("passport");
const bcrypt = require("bcryptjs");
const OAuth2Strategy = require("passport-google-oauth2").Strategy;
const userdb = require("./models/userSchema");


const clientid = process.env.clientid;
const clientsecret = process.env.clientsecret;


app.use(cors({
    origin: process.env.frontendurl,
    methods: "GET,POST,PUT,DELETE",
    credentials: true
}));
app.use(express.json());

app.use(session({
    secret: "996593ufg87kgfgkkrur",
    resave: false,
    saveUninitialized: true,
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(
    new OAuth2Strategy({
        clientID: clientid,
        clientSecret: clientsecret,
        callbackURL: "/auth/google/callback",
        scope: ["profile", "email"]
    },
        async (accessToken, refreshToken, profile, done) => {
            try {
                let user = await userdb.findOne({ googleId: profile.id });

                if (!user) {
                    user = new userdb({
                        googleId: profile.id,
                        displayName: profile.displayName,
                        email: profile.emails[0].value,
                        image: profile.photos[0].value
                    });

                    await user.save();
                }

                return done(null, user)
            } catch (error) {
                return done(error, null)
            }
        }
    )
)

passport.serializeUser((user, done) => {
    done(null, user);
})

passport.deserializeUser((user, done) => {
    done(null, user);
});

app.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));

app.get("/auth/google/callback", passport.authenticate("google", {
    successRedirect: `${process.env.frontendurl}/dashboard`,
    failureRedirect: `${process.env.frontendurl}/login`
}))

app.post("/signup", async (req, res) => {
    const { name, email, password, } = req.body;

    try {
        let existingUser = await userdb.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new userdb({
            displayName: name,
            email,
            password: hashedPassword
        });

        await newUser.save();
        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error during registration", error });
    }
});

app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await userdb.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        req.login(user, (err) => {
            if (err) {
                return res.status(500).json({ message: "Login error" });
            }
            res.status(200).json({ message: "Login successful", user });
           
        });
    } catch (error) {
        res.status(500).json({ message: "Error during login", error });
    }
});


app.get("/login/sucess", async (req, res) => {

    if (req.user) {
        res.status(200).json({ message: "user Login", user: req.user })
        
    } else {
        res.status(400).json({ message: "Not Authorized" })
    }
})

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect(`${process.env.frontendurl}/login`);
}

app.get("/dashboard", ensureAuthenticated, (req, res) => {
    res.status(200).json({ message: "Welcome to the dashboard!" });
});

app.get("/logout", (req, res, next) => {
    req.logout(function (err) {
        if (err) { return next(err) }
        res.redirect(`${process.env.frontendurl}`);
    })
})

app.listen(PORT, () => {
    console.log(`server start at port no ${PORT}`)
})