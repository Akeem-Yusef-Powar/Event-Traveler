const express = require('express')
var bodyParser = require('body-parser');

var path = require('path');
const app = express()
const mysql = require('mysql'); // for database
//var http = require('http').Server(app);
//var io = require('socket.io')(http);

// Channel server is listening on
// All clients can publish
var public_channel = "channel_public";
app.use(express.static('public'));

const { request } = require('http');
const session = require('express-session'); // for sessions
const { RSA_NO_PADDING } = require('constants');
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

// rendering pages
routes = require('./routes');
app.set('view engine', 'html');
app.set('views', path.join(__dirname+'/views'));
var engines= require("consolidate");
const { json } = require('body-parser');
routes=require('./routes');
app.set('views', path.join(__dirname + '/views'));
app.engine('html',engines.mustache);
app.set('view engine',"html");

// used for fileuploads
fileUpload = require('express-fileupload')
app.use(express.static(path.join(__dirname, 'uploads'))); // folder to get all pictures
app.use(fileUpload());


//------------------------ Connect to database -------------------------------------------
//sql connection - enter with correct db info
var connection = mysql.createConnection({
    host: 'event-traveler.cradlb8fiiit.us-east-2.rds.amazonaws.com',
    port: '3306',
    user: 'admin',
    password: 'IchNiSanYon'
});

// establish connection
connection.connect(function(err) {
    if (err) {
      console.error('Database connection failed: ' + err.stack);
      return;
    }
    console.log('Connected to database.');
});

// select schema to use in database
connection.query('USE Event_Traveler;');

global.database = connection; // so route files can access database connection

//--------------------- Create session -------------------------------------------

app.use(session({
    key: 'simpleSession',
    secret: 'aUser', // becomes username when logged in
    resave: true,
    saveUninitialized: true,
    cookie: {
        expires: 1000*60*60 // 1000 millisecs * 60 = 1 minutes, thrid parameter determines number of minutes (60 = 1 hour)
    }
}));

//-------------------------- Login ----------------------------------------

app.get('/',function(req,res){
    res.render('loginpage.ejs',{errorMessage:" "});
});

app.post('/loginForm',routes.login); // when getting login form request

//---------------  profile page functions -----------------------------------------
app.post('/getFriendsList', routes.FriendsList);
app.post('/getUsersList', routes.UsersList);
app.post("/getRecRequests",routes.RecRequest);
app.post('/userPhotoUpload',routes.uploadUserPhoto);
app.post('/editUserBio',routes.editBio);

app.post('/savedTripsPage', routes.savedTripsPage);
app.post('/searchRequest', routes.searchRequest);
app.post('/searchFriends', routes.searchFriends);
app.post("/friendsProfile", routes.friendsProfile);

//app.post("/addFrniends", routes.addFriends);
///////////////////////////////////////////////////////

app.post('/removeFriends', routes.removeFriends);


app.post('/requestFriends', routes.requestFriends);

//app.get("/friendsProfile", routes.friendsProfile);

app.post('/addFriends',routes.addFriends);
//dup call
//app.post('/addFriends', routes.addFriends);

app.get('/search-trips',routes.searchTripsTable);
app.get('/home',routes.home);

//app.post("/getUserCard",routes.UserCard)


//app.post('/savedTripsPage', routes.searchTripsTable); // test only no real functionality

//------------------------ Register user ----------------------------------------------------

app.get("/register",function(req,res){
    app.post('/getFriendsList', routes.FriendsList);
    res.render('registerpage.ejs', {error:" "});
});

app.post('/register',routes.register);

app.get('/search', routes.search);

                //res.end("searchFriend.html")
//------------------------ Itinerary -------------------------------------------------------

app.get("/itinerary", function(req, res){
    res.render('itinerary.html');
});
app.post("/trip-details", routes.displayTripData);



//-----------------------trip details --------------------------------------------------

app.post("/trip-details", routes.displayTripData);
app.post("/post_comment", routes.postComment);
app.post("/sortComment", routes.sortComment);
app.post("/like_trip", routes.likeTrip);
app.post("/save_trip", routes.saveTrip);
app.post("/editFromDetailsPage",routes.editThis);

app.post("/createTrip", routes.createTrip);

//---------------------------- edit trip link from user page  ---------------------------------------------

// edit trip process
app.get("/edit", routes.editTripSelection); // selection page
app.post("/editSelectedTrip", routes.editThis); // render specific trip
app.post("/editTrip", routes.editTripForm) // deal with submmited edit form
app.post("/cancelEditForm", routes.editTripSelection); // cancel button pressed of editTrip
app.post("/deleteSelectedTrip", routes.deleteTrip); // delete trip
//---------------------------------------- Logout ------------------------------------------
app.get("/FriendsFeed",  function (req, res) {
    res.render('friendsFeed.ejs')});
app.post("/FriendsFeed", routes.FriendsFeed)
app.get('/logout', function (req,res){
    if(req.session.loggedin){

        req.session.destroy();
        console.log("logged out");
        res.render('loginpage.ejs',{errorMessage:" Logged out"});

    } else {

        console.log("not signed in")
    }

});

/*app.get('/messages', function (req, res) {
    res.render(__dirname+'/views/index.ejs');
});

io.on('connection', function (socket) {
    socket.on(public_channel, function (message) {
        console.log(message);
        // var message = JSON.parse(msg);
        if (message.to && message.from) {
            console.log("Sending message from " + message.from + " to " + message.to);
            io.emit("channel_" + message.to, message);
        }
    });
});*/

//server config
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server started listening on port: ${PORT}`);
  });
