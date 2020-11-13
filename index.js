// agar file .env bisa di gunakan
require('dotenv').config() 

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');

const fileUpload = require('express-fileupload')
const cookieParser = require('cookie-parser')
const mongoose = require('mongoose');


// connection mongodb url 27017
mongoose.connect(process.env.MONGO_URL, {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(res => {
    console.log('Connected to MongoDB')
})
.catch(e => {
    console.log('Cannot connected to MongoDB')
})

// middleware express 
app.use(bodyParser.urlencoded({
    extended: true
})); // to support URL - encoded bodies
app.use(bodyParser.json()); // to support JSON-encode bodies
app.use(cookieParser());
app.use(express.static(__dirname + '/public'));
app.use(fileUpload({
    useTempFiles: true
}));

// cors error
app.use(cors());

//Routes
app.use('/v1', require('./src/routes/usersRoute'))
app.use('/v1', require('./src/routes/categoriesRoute'))
app.use('/v1', require('./src/routes/productsRoute'))
app.use('/v1', require('./src/routes/ordersRoute'))
app.use('/v1', require('./src/routes/upload'))

//endpoint default port 3001
app.use('/', (req, res) => {
    res.json({ msg: "REST API APRIL'S BAKERY" })
});

// listening port database
app.listen(process.env.PORT, (req, res) => {
    console.log(`Server is runing ${process.env.PORT}`)
});