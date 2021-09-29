const express = require('express');
const helmet = require('helmet');
const app = express();
const mongoose = require('mongoose');
const User = require('./Models/user');

app.use(helmet());
app.use(express.json());

app.post('/login', async (req, res, next) => {

        const user = await User.create({
            email: req.body.email,
            password: req.body.password
        });
        res.send(user);
})



app.listen(3000, async() => {
    await mongoose.connect('mongodb+srv://alwihaque:alwi1234@cluster0.ua0zj.mongodb.net/myFirstDatabase?retryWrites=true&w=majority');
    console.log('Connected');

});