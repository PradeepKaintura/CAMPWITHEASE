if(process.env.NODE_ENV !=="production"){
    require('dotenv').config();
}

/* console.log(process.env.SECRET) */
const express = require('express');
const path =require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash')
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const mongoSanitize = require('express-mongo-sanitize')

const userRoutes = require('./routes/users');
const campgroundRoutes = require('./routes/campgrounds');
const reviewsRoutes = require('./routes/reviews');
const ExpressMongoSanitize = require('express-mongo-sanitize');
const dbURL = process.env.DB_Link
const MongoDBStore = require("connect-mongo")(session);
/* mongodb://0.0.0.0:27017/camp-with-ease */

mongoose.connect('mongodb://0.0.0.0:27017/camp-with-ease',{
    useNewUrlParser : true,
    //useCreateIndex : true,
    useUnifiedTopology: true,
    //useFindAndModify: true
});


const db = mongoose.connection;
db.on("error",console.error.bind(console,"connection error"));
db.once("open",()=>{
    console.log("DATABASE CONNECTION");
});


const app = express();
app.use(express.static('uploads'))

app.engine('ejs',ejsMate);
app.set('view engine', 'ejs')
app.set('views',path.join(__dirname,'views'))

app.use(express.urlencoded({extended : true}));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname,'public')))
app.use(express.json())

app.use(mongoSanitize())

const store = new MongoDBStore({
    url : 'mongodb://0.0.0.0:27017/camp-with-ease',
    secret : 'hello',
    touchAfter : 24*60*60
})

store.on("error",function(e){
    console.log("Session store error",e)
})
const sessionConfig = {
    store,
    name: 'session',
    secret: 'hello',
    resave: false,
    saveUninitialized: true, 
    cookie:{
        httpOnly: true,
        expires: Date.now() +1000*60*60*24*7,
        maxAge : 1000*60*60*24*7
    }
}
app.use(session(sessionConfig))
app.use(flash())

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next)=>{
    //console.log(req.session)
   /*  console.log(req.body)  */
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})
/* 
app.get('/fakeUser',async(req,res)=>{
    const user = new User({email:'pk@gmail.com', username: 'PKKK'});
    const newUser = await User.register(user,'kbc');
    res.send(newUser);
})
 */

app.use('/',userRoutes);
app.use('/campgrounds',campgroundRoutes)
app.use('/campgrounds/:id/reviews', reviewsRoutes)

app.get('/',(req,res)=>{
    res.render('home');
});

/* app.post('/campgrounds/getData',(req,res)=>{
    let payload = req.body.payload;
    console.log(payload)
    
}) */

app.all('*',(req,res,next)=>{
    next(new ExpressError('Page Not Found',404))
});

app.use((err,req,res,next)=>{
    const {statusCode = 500} = err;
    if(!err.message) 
     err.message = "OH NOT"
    res.status(statusCode).render('error',{err})
});

const port = process.env.PORT || 3000;
app.listen(port, ()=>
{
    console.log(`serving on port ${port}`)
})
