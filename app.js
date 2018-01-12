const express = require('express');
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
// const flash = require('req-flash');
const flash = require("connect-flash");
const app = express();
const static = express.static(__dirname + '/public');

// const configRoutes = require("./routes");

const exphbs = require('express-handlebars');

const Handlebars = require('handlebars');

// const data = require("./data");
// const usersData = data.users;

const handlebarsInstance = exphbs.create({
    defaultLayout: 'main',
    // Specify helpers which are only registered on this instance.
    helpers: {
        asJSON: (obj, spacing) => {
            if (typeof spacing === "number")
                return new Handlebars.SafeString(JSON.stringify(obj, null, spacing));
        
            return new Handlebars.SafeString(JSON.stringify(obj));
        },
        setChecked: (value, currentValue) => {
            if (value == currentValue) {
                return "checked"
            } else {
                return "";
            }
        }
        
    }
});

const rewriteUnsupportedBrowserMethods = (req, res, next) => {
    // If the user posts to the server with a property called _method, rewrite the request's method
    // To be that method; so if they post _method=PUT you can now allow browsers to POST to a route that gets
    // rewritten in this middleware to a PUT route
    if (req.body && req.body._method) {
        req.method = req.body._method;
        delete req.body._method;
    }

    // let the next middleware run:
    next();
};

// passport.use(new LocalStrategy(
//   function(username, password, done) {
//       return usersData.getUserByUsername(username).then((user) => {
//           if (!user) { 
//             return done(null, false, { message: 'Incorrect username' });
//           }
//           return usersData.isPasswordValid(user, password).then((result) => {
//             if (result === false)
//                 return done(null, false, { message: 'Incorrect password' });
//             else  
//                 return done(null, userinfo);
//             }, (err) => {
//                 if (err) { return done(err); } 
//           });
//       }, (err) => {
//          if (err) { return done(err); } 
//       });
//   }
// ));

// passport.serializeUser(function(user, done) {
//     done(null, user._id);
// });

// passport.deserializeUser(function(id, done) {
//    usersData.getUserById(id).then((user) => {
//     done(null, user);
//    }, (err) => {
//     done(err, null);
//    });
// });

app.use("/public", static);
app.use(cookieParser('keyboard cat'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({ secret: 'keyboard cat', 
  resave: false,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(rewriteUnsupportedBrowserMethods);

app.engine('handlebars', handlebarsInstance.engine);
app.set('view engine', 'handlebars');

require('./routes/index')(app, passport);
require('./routes/passport')(passport);

app.listen(3000, () => {
    console.log("We've now got a server!");
    console.log("Your routes will be running on http://localhost:3000");
});
