import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import compression from "compression";
import cors from "cors";
import session from "express-session";
import MongoStore from "connect-mongo";
import passport from "./config/passport";
import cofig from "./config/config"
import './config/db';
import * as path from 'path';
import * as dotenv from 'dotenv';
import connectDB from "./config/db";

dotenv.config();


const app = express();

// app.use(cors({credentials: true, origin: true}))
app.use(cors());
app.use((_req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', '*');

    next();
});

app.use(compression());
app.use(cookieParser());


app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());
connectDB();

app.use(session({
    secret: cofig.secret,
    resave: false,
    saveUninitialized:true,
    store: MongoStore.create({mongoUrl: process.env.MONGO_URI, collectionName: "sessions"}),
    cookie: {
        maxAge: cofig.jwt_expires_in
    }
}));
app.use(passport.initialize());
app.use(passport.session());

const PORT = process.env.PORT || 3050;

app.use('/api', require('./routes'));

console.log('MONGODB_CONNECT_URI:', process.env.MONGODB_CONNECT_URI);


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
