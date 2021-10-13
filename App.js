/*
    External Imports
 */
const express = require('express');
const helmet = require('helmet');
const mongoose = require('mongoose');

const authRoute = require('./Routes/auth');
const courseRoute = require('./Routes/courses');
const scrape = require('./Util/timer');


scrape.scrapeEvery12Hrs();
const app = express();
app.use(helmet());
app.use(express.json());
app.use(authRoute);
app.use(courseRoute);


app.listen(3000, async() => {
    await mongoose.connect('mongodb+srv://alwihaque:alwi1234@cluster0.ua0zj.mongodb.net/myFirstDatabase?retryWrites=true&w=majority');
    console.log('Connected');

});
