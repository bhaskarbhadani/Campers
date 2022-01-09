if(process.env.NODE_ENV !=="production"){
    require('dotenv').config();
}


const express=require('express');
const app=express();
const path=require('path');
const ejsMate=require('ejs-mate');
const mongoose=require('mongoose');
const flash=require('connect-flash');
const methodOverride= require('method-override');
const ExpressError=require('./utils/ExpressError');
const session=require('express-session');
const passport=require('passport');
const LocalStrategy=require('passport-local');
const User=require('./models/user');
const helmet=require('helmet');
const MongoDBStore =require('connect-mongo');
const dbUrl= process.env.DB_URL|| 'mongodb://localhost:27017/yelpcamp';

const campgroundsroutes=require('./routes/campground');
const reviewsroutes=require('./routes/review');
const userroutes=require('./routes/user');
const mongoSanitize = require('express-mongo-sanitize');


mongoose.connect(dbUrl,{
    useNewUrlParser:true,
    useUnifiedTopology:true,
});

const db= mongoose.connection;
db.on('error',console.error.bind(console,'connection error'));
db.once('open', ()=>{
    console.log('database connected');
})

app.engine('ejs',ejsMate);
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));

app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname,'public')));
app.use(mongoSanitize({
    replaceWith:'_'
}))

const secret= process.env.SECRET || 'thisisasecret';
const store= new MongoDBStore({
    mongoUrl: dbUrl,
    secret,
    touchAfter: 24*60*60
});

store.on('error',e=>{
    console.log('session error',e);
});

const sessionConfig={
    store,
    name: 'session',
    secret,
    resave:false,
    saveUninitialized:true,
    cookie:{
        httpOnly:true,
        expires:Date.now()+1000*60*60*24*7,
        maxage:1000*60*60*24*7
    }
}
app.use(session(sessionConfig));
app.use(flash());
app.use(helmet({contentSecurityPolicy:false}));


app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.currentUser=req.user;
    res.locals.success=req.flash('success');
    res.locals.error=req.flash('error');
    next();
})

app.get('/',(req,res)=>{
    res.render('home');
})
app.use('/campgrounds',campgroundsroutes);
app.use('/campgrounds/:id/reviews',reviewsroutes);
app.use('/',userroutes)


app.all('*',(req,res,next)=>{
    next(new ExpressError('Page Not Found',404));
})

app.use((err,req,res,next)=>{
    const {statusCode=500}=err;
    if(!err.message) err.message='Something went wrong';
    res.status(statusCode).render('error',{err});
})

const port = process.env.PORT ||3000;
app.listen(port,()=>{
  console.log(`Listening on port ${port}`);
})