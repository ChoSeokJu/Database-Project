const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const db = require('./models/index');
const routes = require('./routes/index');

const app = express();

var today = new Date().toJSON().slice(0,10).replace(/-/g,'-');

const initial = () => {
  const { user } = db;
  const userInfo = {
    ID: 'admin',
    Gender: 0,
    Name: '관리자',
    Addr: 'admin',
    PhoneNo: 'admin',
    Bdate: today,
    Password: bcrypt.hashSync('admin'),
    UType: 2,
  };

  user
    .findOne({
      where: {
        ID: 'admin',
      },
    })
    .then((result) => {
      if (!result) {
        user.create(userInfo);
      }
    });
};

db.sequelize
  .sync()
  .then(() => {
    initial();
    console.log('✓ DB connection success.');
    console.log('  Press CTRL-C to stop\n');
  })
  .catch((err) => {
    console.error(err);
    console.log('✗ DB connection error. Please make sure DB is running.');
    process.exit();
  });

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const corsOptions = {
  exposedHeaders: ['Authorization'],
};

app.use(cors(corsOptions));

routes(app);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
