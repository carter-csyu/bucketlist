import createError from 'http-errors';
import express from 'express';
import session from 'express-session';
import path from 'path';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import connectMongo from 'connect-mongo';
import api from './routes';

const app = express();

const MongoStore = connectMongo(session); 

// setup middleware
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// connect mongodb
const db = mongoose.connection;
db.on('error', console.error);
db.once('open', () => {
  console.log('Connection to mongodb server');
});
mongoose.connect('mongodb://csyu:csyu@ds119436.mlab.com:19436/csyu', { useNewUrlParser: true });

app.use(session({
  secret: 'bucketlist$1',
  saveUninitialized: true, 
  resave: false,
  cookie: {
    maxAge: 1000 * 60 * 60 // 60 minute
  },
  store: new MongoStore({
    mongooseConnection: mongoose.connection
  })
}));
 
// routers
app.use('/', express.static(__dirname + './../public'));
app.use('/images', express.static(path.join(__dirname, 'uploads')));
app.use('/api', api);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, './../public/index.html'))
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  return res.status(500).json({
    error: -1,
    message: err.message
  });
});

module.exports = app;
