const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const LocalStrategy = require('passport-local');
const User = require('./models/user.model');
const dotenv = require('dotenv');

dotenv.config();

const PORT = process.env.PORT || 5000;
const secret = process.env.SESSION_SECRET || 'adhere-globulin-carpet-abdias';

const app = express();

app.use(helmet());
app.use(cors({ credentials: true, origin: process.env.CLIENT_ORIGIN }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

mongoose
  .connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: true,
  })
  .then(() => {
    console.log(`Database is connected to ${process.env.DATABASE_URL}`);
  })
  .catch((error) => {
    console.log(error);
  });

const store = new MongoStore({
  mongooseConnection: mongoose.connection,
  ttl: 24 * 60 * 60,
});

app.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret,
    store,
    cookie: {
      secure: false,
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

passport.use(new LocalStrategy(User.authenticate()));

app.use('/uploads', express.static(__dirname + './../uploads'));
app.use('/api', require('./routes/api.route'));

app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use(function (error, req, res, next) {
  res.status(error.status || 500);
  res.json({ error: true, message: error.message });
});

app.listen(PORT, () => {
  console.log(`Application is up and running on port ${PORT}`);
});
