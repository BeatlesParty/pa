var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var apikey = require('./config/apikey');

// AUTHENTICATION MODULES
session = require("express-session"),
bodyParser = require("body-parser"),
User = require( './models/User' ),
flash = require('connect-flash')
// END OF AUTHENTICATION MODULES

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');


const mongoose = require( 'mongoose' );
mongoose.connect( 'mongodb://localhost/tankworld' );
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("we are connected!!!")
});

const  commentController = require('./controllers/commentController.js')
const profileController = require('./controllers/profileController')
const forumPostController = require('./controllers/forumPostController')

var taList = [
         "csjbs2018@gmail.com", // usual password!
          "vanio@brandeis.edu",
       "tjhickey@brandeis.edu",
   "katherinezyb@brandeis.edu",
      "yaeleiger@brandeis.edu",
       "rlederer@brandeis.edu",
          "aramk@brandeis.edu",
  "venusyixinsun@brandeis.edu",
            "lxt@brandeis.edu",
        "zqhuang@brandeis.edu",
        "mdodell@brandeis.edu",
  "luisandinojr1@brandeis.edu",
   "jerrypeng666@brandeis.edu",
    "irvingperez@brandeis.edu",
        "chungek@brandeis.edu",
        "richardli@brandeis.edu",
         "zepenghu@brandeis.edu"
]

// Authentication
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
// here we set up authentication with passport
const passport = require('passport')
const configPassport = require('./config/passport')
configPassport(passport)

var app = express();



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



/*************************************************************************
     HERE ARE THE AUTHENTICATION ROUTES
**************************************************************************/

app.use(session({ secret: 'zzbbyanana' }));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.urlencoded({ extended: false }));



const approvedLogins = ["tjhickey724@gmail.com","csjbs2018@gmail.com"];

// here is where we check on their logged in status
app.use((req,res,next) => {
  res.locals.title="YellowCartwheel"
  res.locals.loggedIn = false
  if (req.isAuthenticated()){
    if (req.user.googleemail.endsWith("@brandeis.edu") ||
          approvedLogins.includes(req.user.googleemail))
          {
            console.log("user has been Authenticated")
            res.locals.user = req.user
            res.locals.loggedIn = true
          }
    else {
      res.locals.loggedIn = false
    }
    console.log('req.user = ')
    console.dir(req.user)
    // here is where we can handle whitelisted logins ...
    if (req.user){
      if (req.user.googleemail=='richardli@brandeis.edu'){
        console.log("Owner has logged in")
        res.locals.status = 'Owner'
      } else if (taList.includes(req.user.googleemail)){
        console.log("An Administrater has logged in")
        res.locals.status = 'Admin'
      }else {
        console.log('A Visitor has logged in')
        res.locals.status = 'visitor'
      }
    }
  }
  next()
})



// here are the authentication routes

app.get('/loginerror', function(req,res){
  res.render('loginerror',{})
})

app.get('/login', function(req,res){
  res.render('login',{})
})



// route for logging out
app.get('/logout', function(req, res) {
        req.session.destroy((error)=>{console.log("Error in destroying session: "+error)});
        console.log("session has been destroyed")
        req.logout();
        res.redirect('/');
    });


// =====================================
// GOOGLE ROUTES =======================
// =====================================
// send to google to do the authentication
// profile gets us their basic information including their name
// email gets their emails
app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));


app.get('/login/authorized',
        passport.authenticate('google', {
                successRedirect : '/',
                failureRedirect : '/loginerror'
        })
      );


// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {
    console.log("checking to see if they are authenticated!")
    // if user is authenticated in the session, carry on
    res.locals.loggedIn = false
    if (req.isAuthenticated()){
      console.log("user has been Authenticated")
      res.locals.loggedIn = true
      return next();
    } else {
      console.log("user has not been authenticated...")
      res.redirect('/login');
    }
}

// we require them to be logged in to see their profile
app.get('/profile', isLoggedIn, function(req, res) {
        res.render('profile')/*, {
            user : req.user // get the user out of session and pass to template
        });*/
    });
    app.get('/editProfile',isLoggedIn, (req,res)=>{
      res.render('editProfile')
    })

    app.get('/profiles', isLoggedIn, profileController.getAllProfiles);
    app.get('/showProfile/:id', isLoggedIn, profileController.getOneProfile);


    app.post('/updateProfile',profileController.update);
  //add page for editprofile

  // add page for editProfile and views
  // add router for updateProfile and send browser to /profie

// END OF THE AUTHENTICATION ROUTES

app.use(function(req,res,next){
  console.log("about to look for routes!!!")
  //console.dir(req.headers)
  next()
});



app.get('/', function(req, res, next) {
  res.render('index',{title:"TankWorld Online"});
});

app.get('/feedback', function(req, res, next) {
  res.render('feedback',{title:"feedback"});
});

app.get('/D02', function(req, res, next) {
  res.render('D02',{title:"D02"});
});

app.get('/Q01', function(req, res, next) {
  res.render('Q01',{title:"Q01"});
});

app.get('/bmidemo', (req, res) => {
  res.render('bmidemo',{title:"Grid Demo"});
});

app.use(function(req,res,next){
  console.log("about to look for post routes!!!")
  next()
});

function processFormData(req,res,next){
  res.render('formdata',
     {title:"Form Data",url:req.body.url, comments:req.body.comments})
}

app.post('/processform', commentController.saveComment)

app.get('/showComments', commentController.getAllComments)
// app.use('/', indexRouter);  // this is how we use a router to handle the / path
// but here we are more direct

app.get('/showComment/:id', commentController.getOneComment)

//app.post('/feedback');
//app.post('/dataprocess', processFormData);
//app.post('/d02');

app.get('/forum',forumPostController.getAllForumPosts)

app.post('/forum',forumPostController.saveForumPost)

app.post('/forumDelete',forumPostController.deleteForumPost)
// catch 404 and forward to error handler

app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
