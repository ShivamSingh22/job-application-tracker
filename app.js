const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const reminderService = require('./services/reminderServices');

require('dotenv').config();

const userRoute = require('./routes/userRoute');
const profileRoute = require('./routes/profileRoute');
const jobRoute = require('./routes/jobRoute');

const sequelize = require('./util/database');

const bodyParser = require('body-parser');

const User = require('./models/userModel');
const JobApplication = require('./models/jobApplicationModel');

const app = express();
app.use(cors());
app.use(bodyParser.json({ extended: false }));

const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });

app.use(helmet());
app.use(morgan('combined', { stream: accessLogStream }));

app.use('/user', userRoute);
app.use('/profile', profileRoute);
app.use('/job-applications', jobRoute);

app.use((req, res, next) => {
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline';"
  );
  next();
});

// Create association
User.hasMany(JobApplication);
JobApplication.belongsTo(User);

sequelize
  .sync()
  .then(result => {
    console.log('Database & tables created!');
    app.listen(process.env.PORT || 3000, () => {
      console.log(`Listening on ${process.env.PORT || 3000}`);
      
      // Initialize the reminder service
      reminderService.checkAndSendReminders();
    });
  })
  .catch(err => {
    console.log(err);
  });
