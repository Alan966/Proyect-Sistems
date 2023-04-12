const express = require('express');
const app = express();
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const ejs = require('ejs')
const signinRoutes = require('./src/routes/signinRoutes');
const signupRoutes = require('./src/routes/signupRoutes');
const dashboardRoutes = require('./src/routes/dashboardRoutes');
app.set('view engine', 'ejs')
app.use(express.static('public'))
dotenv.config();

app.set('port', process.env.PORT || 3000);


// Middlewares
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());


// routes
app.get('/', (req, res) => {
    res.render('index', {title: 'Sistems Proyect'})
})
app
app.use('/signin', signinRoutes);
app.use('/signup', signupRoutes);
app.use('/dashboard', dashboardRoutes);

app.listen(app.get('port'), () => {
    console.log(`server reuning in port  ${app.get('port')}`)
})