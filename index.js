const express = require('express');
const app = express();
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const ejs = require('ejs')
const signinRoutes = require('./src/routes/signinRoutes');
const signupRoutes = require('./src/routes/signupRoutes');
const dashboardRoutes = require('./src/routes/dashboardRoutes');
const routerFindUsers = require('./src/routes/getUsersRoutes');
const routerEmployers = require('./src/routes/employersRoutes');

const cookieParser = require('cookie-parser');
const jose = require('jose');


app.set('view engine', 'ejs')
app.use(express.static('public'))
dotenv.config();

app.set('port', process.env.PORT || 3000);


// Middlewares
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());


// routes
app.get('/', (req, res) => {
    res.render('index', {title: 'Sistems Proyect'})
})
app
const KunauthenticatedPaths = new Set([
    '/',
    '/signin',
    '/signup',
]);

app.use(async (req, res, next) => {
    if(req.method === 'GET' || KunauthenticatedPaths.has(req.path)){
        next();
        return;
    }
    const auth_token = req.cookies.auth_token;
    if(!auth_token){
        res
        .status(401)
        .redirect('/');
        return;
    }

    const encoder = new TextEncoder();
    const { payload } = await jose.jwtVerify(
        auth_token,
        encoder.encode(process.env.JWT_PRIVATE_KEY)
    )
    if(payload.signin){
        return next();
    }

})

app.get('/styles.css', function(req, res) {
    res.type('text/css');
    res.sendFile(__dirname + '/styles.css');
  });
app.use('/signin', signinRoutes);
app.use('/signup', signupRoutes);
app.use('/dashboard', dashboardRoutes);
app.use('/getValuesEmpleado', routerFindUsers);
app.use(routerEmployers);

app.listen(app.get('port'), () => {
    console.log(`server reuning in port  ${app.get('port')}`)
})