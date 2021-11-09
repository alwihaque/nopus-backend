const express = require('express');
const helmet = require('helmet');
const mongoose = require('mongoose');
const authRoute = require('./Routes/auth');
const courseRoute = require('./Routes/courses');
const profileRoute = require('./Routes/profile');
const scrape = require('./Util/timer');
const logger = require('./Util/logger');


scrape.scrapeEvery12Hrs();
const app = express();
app.use(helmet());
app.use(express.json());
app.use(profileRoute);
app.use(authRoute);
app.use(courseRoute);


app.listen(process.env.PORT || 3000, async () => {
    await mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@cluster0.ua0zj.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`);
    logger.log('info', 'Connected to MongoDB');
});
