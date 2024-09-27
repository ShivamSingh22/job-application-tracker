const express = require('express');
const fs = require('fs');
const path = require('path');
const cors=require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

require('dotenv').config();

const sequelize = require('./util/database');

const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json({ extended: false }));

const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'),{flags : 'a'});

app.use(helmet());

app.use(morgan('combined',{stream: accessLogStream}));

app.use((req, res, next) => {
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline';"
  );
  next();
});

sequelize
.sync()
.then(result => {
    app.listen(process.env.PORT || 3000);
    console.log(`Listening on ${process.env.PORT}`);
    
})
.catch(err => {
    console.log(err);
})
