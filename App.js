const express = require('express');
const helmet = require('helmet');
const mongoose = require('mongoose');
const authRoute = require('./Routes/auth');
const bodyParser = require('body-parser');
const cors = require('cors');
const courseRoute = require('./Routes/courses');
const profileRoute = require('./Routes/profile');
const scrape = require('./Util/timer');
const logger = require('./Util/logger');
const scraper = require('./Util/scrape');

scrape.scrapeEvery12Hrs();
const app = express();
app.use(bodyParser.json());
app.use(helmet());
app.use(cors());
app.use(profileRoute);
app.use(authRoute);
app.use(courseRoute);

app.get("/", (req, res, next) => {
    res.status(200).send(`<h1> Available Routes </h1>
    <h2>For Profile Updates</h2>
    <ul>
    <li>PUT /profile/majorMinor/:uid</li>
    <li>PUT /profile/courseList/:uid</li>
    <li>PUT /profile/preferences/:uid</li>
    </ul>
    <h2>For Course Related Information</h2>
    <ul>
    <li>GET /home</li>
    <li>GET  /home/id/:id</li>
    <li>GET  /home/id/:id</li>
    <li>GET  /home/:prefix</li>
    <li>POST  /home/schedule</li> 
</ul>


`)
})
app.listen(process.env.PORT || 3000, async () => {
    await mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@cluster0.ua0zj.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`);
    console.log('info', 'Connected to MongoDB');
});
