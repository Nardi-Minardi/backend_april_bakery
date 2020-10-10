// agar file .env bisa di gunakan
require('dotenv').config() 

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require ('cors');

// import router dan mongodb
const Router = require('./src/routes');
const mongoose = require('mongoose');

// koneksi ke database mongodb url 27017
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(res => {
    console.log('Database terhubung')
})
.catch(e => {
    console.log('Database error, tidak terhubung')
})

// input value api dengan json dan x.www-from-urlencoded di postman
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());
app.use('/uploads', express.static('uploads'));
app.use(cors())

//endpoint default
app.use('/', Router, (req, res, next) => {
    res.send('Ini halaman route')
    next();
})

// listening port ke database
app.listen(process.env.PORT, (req, res) => {
    // memakai backtip agar bisa memanggil variable di dalam string
    console.log(`Server is runing ${process.env.PORT}`)
})