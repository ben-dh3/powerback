const passport = require('./routes/api/middleware/passport');
const expressStaticGzip = require('express-static-gzip');
const rateLimit = require('express-rate-limit');
const serveStatic = require('serve-static');
const session = require('express-session');
const { SERVER } = require('./constants');
const mongoose = require('mongoose');
const express = require('express');
const routes = require('./routes');
require('dotenv').config();
// require('./polling')();
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.static('../public_html'));
app.use(express.json());
app.use(
  session({
    resave: true,
    saveUninitialized: true,
    secret: SERVER.SESSION_SECRET,
  })
);
app.use(passport.initialize());
app.use(passport.session());
// Serve up static assets
if (process.env.NODE_ENV === 'production')
  app.use(express.static('../static'));
app.use(routes);
app.use(
  '/',
  expressStaticGzip('../static', {
    enableBrotli: true,
    orderPreference: ['br', 'gzip'],
  })
);
app.use(
  serveStatic('public/ftp', {
    index: ['index.html.br', 'index.html.gz'],
  })
);

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Apply the rate limiting middleware to API calls only
app.use('/api', apiLimiter);

const createAccountLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // Limit each IP to 5 create account requests per `window` (here, per hour)
  message: 'New account limit reached. Please try again later.',
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

app.post('/users', createAccountLimiter, (req, res) => {
  //...
});

// Connect to the Mongo DB
mongoose
  .connect(
    process.env.NODE_ENV === 'production'
      ? SERVER.MONGODB_CONNECTION_STRING
      : 'mongodb://localhost/powerback',
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    }
  )
  .then(() => {
    console.log('Successfully connected to MongoDB Atlas!');
  })
  .catch((err) => console.error('MongoDB server error: ' + err));

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('../static'));
  const path = require('path');
  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, '..', 'static', 'index.html'))
  );
}

// Start the API server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`API Server now listening on PORT ${PORT}!`);
});
