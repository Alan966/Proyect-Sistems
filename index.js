const express = require('express');
const app = express();
const cors = require('cors');
const morgan = require('morgan');
const ejs = require('ejs')
const signinRoutes = require('./src/routes/signinRoutes');
const signupRoutes = require('./src/routes/signupRoutes');
const dashboardRoutes = require('./src/routes/dashboardRoutes');
const routerFindUsers = require('./src/routes/getUsersRoutes');
const routerEmployers = require('./src/routes/employersRoutes');
const routerNotarias = require('./src/routes/notariasRoutes');
const routerFinanciamiento = require('./src/routes/financiamientoRoutes');
const routerGastosEscrituras = require('./src/routes/gastosEscriturasRouter');
const routerPagaresVehiculos = require('./src/routes/pagaresVehiculosRouter');
const routerPagaresMediano = require('./src/routes/pagaresMedianoRouter');

const cookieParser = require('cookie-parser');
const jose = require('jose');


app.set('view engine', 'ejs')
app.use(express.static('public'))

app.set('port', process.env.PORT || 3000);


// Middlewares
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());


// routes
app.get('/', (req, res) => {
    res.render('index', {title: 'Sistema de Recusos Humanos'})
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
    const header_token = req.headers.authorization;
    if(!auth_token || !header_token ){
        res
        .status(401)
        .redirect('/signin');
        return;
    }else if(auth_token){
        const encoder = new TextEncoder();
        const { payload } = await jose.jwtVerify(
            auth_token,
            encoder.encode(process.env.JWT_PRIVATE_KEY)
        )
        if(payload.signin){
            return next();
        }else{
            res
            .status(401)
            .redirect('/signin');
            return;
        }
    }else if(header_token){
        const token = header_token.split(' ')[1];
        const encoder = new TextEncoder();
        const { payload } = await jose.jwtVerify(
            token,
            encoder.encode(process.env.JWT_PRIVATE_KEY)
        )
        if(payload.signin){
            return next();
        }else{
            res
            .status(401)
            .redirect('/signin');
            return;
        }
    }

})

app.get('/styles.css', function(req, res) {
    res.type('text/css');
    res.sendFile(__dirname + '/styles.css');
  });
app.use('/signin', signinRoutes);
// app.use('/signup', signupRoutes);
app.use('/dashboard', dashboardRoutes);
app.use('/getValuesEmpleado', routerFindUsers);
app.use('/notarias', routerNotarias);
app.use(routerEmployers);
app.use('/financiamiento_escrituras', routerFinanciamiento);
app.use('/gastosEscrituras', routerGastosEscrituras);
app.use('/pagaresVehiculos', routerPagaresVehiculos);
app.use('/pagaresMediano', routerPagaresMediano);

app.listen(app.get('port'), () => {
    console.log(`server reuning in port  ${app.get('port')}`)
})