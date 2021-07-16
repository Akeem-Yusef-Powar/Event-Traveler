const { Console } = require('console');
const fs = require('fs');

exports.login = function(req,res){  // when user logs in, get saved trips and owned trips for user profile page
        const userName = req.body.username;
        const passWord = req.body.password;


        var sqlUser = "SELECT * FROM user_table WHERE username = ? AND BINARY password = ?"
        database.query(sqlUser,[userName,passWord], function(err,userData){
            if(err){
                throw err
            } else if (userData == '') {
                res.render('loginpage.ejs',{errorMessage:"Invalid credentials"});
            } else {
                req.session.loggedin = true;
                req.session.secret = req.body.username; // user req.session.secret to get logged in username
                getRecRequests(userName,function(recReq){
                getUserProfile(userName, function (userData) { // get user table data to display in profile
                    getMyTrips(userName, function (getMyTripData) { // get my trip data to display in list
                        getSavedTrips(userName, function (getSavedTripData) { // get user saved trips data
                            getFriendsList(userName, function (friends) {
                                getUsersList(userName, function (users) {
                                    res.render('userProfile.ejs', { data: userData, trip: getSavedTripData, myTrip: getMyTripData, friends1: friends, users1: users ,recReq1:recReq}); // render the profile page with the corrct data

                                });
                            });
                        });
                    });
                });
                });
            }
        });

};

exports.register = function(req,res){  // handle error messages and submission for register page, error messgaes eplain code

    const fn = req.body.firstname;
    const ln = req.body.lastname;
    const email = req.body.email;
    const userName = req.body.username;
    const passWord = req.body.password;
    const conPassword = req.body.conpassword;

    var sqlState = "SELECT * FROM user_table WHERE username = ?"
        database.query(sqlState,[userName], function(err,data){
            if(err) throw err
            if(data != ''){

                res.render('registerpage.ejs',{error:"Username is already registered"});

            } else if (fn == '' || ln == ''){

                res.render('registerpage.ejs',{error:"please register First and Lastname"});

            }else if (!/\S+@\S+\.\S+/.test(email)){
                res.render('registerpage.ejs',{error:"Invalid E-mail format"});

            } else if (userName == '' || passWord == ''){

                res.render('registerpage.ejs',{error:"Please enter a Username and a Password"});


            }else if(passWord != conPassword){

                res.render('registerpage.ejs',{error:"Passwords do no match"});

            }else {

                var sqlState = "INSERT INTO user_table (firstname,lastname,emailaddress,username,password) VALUES (?,?,?,?,?)"
                database.query(sqlState,[fn,ln,email,userName,passWord], function(err,data){
                    if(err){

                        console.log('error inputing into database');

                    }else {

                        req.session.loggedin = true;
                        req.session.secret = req.body.username; // log user in
                        var sqlState = "INSERT INTO friends_table(friend_one,friend_two,status) VALUES (?,?,'x')"
                        database.query(sqlState, [userName, userName], function (err, data) {
                            if (err) {

                                console.log('error inputing into database');}
                        });
                        getRecRequests(userName, function (recReq) {
                            getUserProfile(userName, function (userData) { // get user table data to display in profile
                                getMyTrips(userName, function (getMyTripData) { // get my trip data to display in list
                                    getSavedTrips(userName, function (getSavedTripData) { // get user saved trips data
                                        getFriendsList(userName, function (friends) {
                                            getUsersList(userName, function (users) {
                                                res.render('userProfile.ejs', { data: userData, trip: getSavedTripData, myTrip: getMyTripData, friends1: friends, users1: users, recReq1: recReq }); // render the profile page with the corrct data

                                            });
                                        });
                                    });
                                });
                            });
                        });
                    }
                });
            }

        });

};

exports.uploadUserPhoto = function(req,res){ // if accpted file, save it to directory as imgName, put name in database then render changes
var userName=req.session.secret;

    if(!req.files){
        console.log('no file')
        return;
    }
        var file = req.files.photo;
        var imgName = req.session.secret + 'ProfilePic'; // save file as this name

    if(file.mimetype == "image/jpeg" ||file.mimetype == "image/png"||file.mimetype == "image/gif"){ // if right type

        file.mv('public/uploads/images/'+imgName, function(err) { // save to this folder in the server directory
            if(err) throw err

            var sqlState = 'UPDATE user_table SET profilepic = ? WHERE username = ?'; // put file name into database
            database.query(sqlState,[imgName,req.session.secret], function(err,data){
                if(err){
                    throw err
                } else {
                    getRecRequests(userName, function (recReq) {
                        getUserProfile(userName, function (userData) { // get user table data to display in profile
                            getMyTrips(userName, function (getMyTripData) { // get my trip data to display in list
                                getSavedTrips(userName, function (getSavedTripData) { // get user saved trips data
                                    getFriendsList(userName, function (friends) {
                                        getUsersList(userName, function (users) {
                                            res.render('userProfile.ejs', { data: userData, trip: getSavedTripData, myTrip: getMyTripData, friends1: friends, users1: users, recReq1: recReq }); // render the profile page with the corrct data

                                        });
                                    });
                                });
                            });
                        });
                    });
                        }

            });
        });

    } else {

        // show file not supported error
    }

};

exports.editBio = function(req,res){ // same as photo except with bio

   var bio = req.body.bio;
   var userName = req.session.secret;

   if(bio == '')
    return;

   var sqlState = "UPDATE user_table SET bio = ? WHERE username = ?"
   database.query(sqlState,[bio,userName], function(err,data){
       if(err){
           // handle error
       }
   });
    getRecRequests(userName, function (recReq) {
        getUserProfile(userName, function (userData) { // get user table data to display in profile
            getMyTrips(userName, function (getMyTripData) { // get my trip data to display in list
                getSavedTrips(userName, function (getSavedTripData) { // get user saved trips data
                    getFriendsList(userName, function (friends) {
                        getUsersList(userName, function (users) {
                            res.render('userProfile.ejs', { data: userData, trip: getSavedTripData, myTrip: getMyTripData, friends1: friends, users1: users, recReq1: recReq }); // render the profile page with the corrct data

                        });
                    });
                });
            });
        });
    });

};

exports.savedTripsPage = function(req,res){ // display user saved trips with details of trips as a table

    var sqlState = "SELECT * FROM trips_table x JOIN saved_trips_table y ON y.tripID = x.tripID WHERE y.username = ? "
    database.query(sqlState,[req.session.secret],function(err,savedTripsData){
        if(savedTripsData.length == 0 ){
            res.render('saved_trips.ejs', {tripData:savedTripsData});
        } else{
            // format date
            res.render('saved_trips.ejs', {tripData:savedTripsData});

        }
    });
};

exports.myTripsPage = function(req,res){ // display user saved trips with details of trips as a table

    var sqlState = "SELECT * FROM trips_table  WHERE username = ? "
    database.query(sqlState,[req.session.secret],function(err,savedTripsData){
        if(savedTripsData.length == 0 ){
            res.render('saved_trips.ejs', {tripData:savedTripsData});
        } else{

            res.render('saved_trips.ejs', {tripData:savedTripsData});

        }
    });
};


exports.createTrip = function(req,res){

    var userName = req.session.secret;
    const journals = req.body.journal;
    //const events = req.body.event;
    const tripTitle = req.body.title;
    const start = req.body.dateStart;
    const end = req.body.dateEnd;
    const tripTags = req.body.tags;
    const tripPrice = req.body.price;
    var date;
    var arraydate=new Array();
/*
    console.log(events)
    console.log(req.body.event.length);

    for(var i = 0; i < req.body.event.length; i++){
        if(req.body.event[i] != ''){
            console.log(req.body.event[i]);
        }
    }
*/
    var file = req.files.userPhoto;
        
            if(req.files.userPhoto.length > 7){
        console.log('Limit reached')
        return;
    }

    for(var i = 0; i < req.files.userPhoto.length; i++){ // loop though uploaded files

        var userImgName = tripTitle+ userName + i;//rename file

        if(file[i].mimetype == "image/jpeg" ||file[i].mimetype == "image/png"||file[i].mimetype == "image/gif"){
             file[i].mv('public/uploads/trips/'+userImgName, function(err) { // save to this folder in the server directory
                 if(err) throw err
            });


        }
        try {
            var ExifImage = require('exif').ExifImage;
            new ExifImage({ image: 'public/uploads/trips/' + userImgName }, function (error, exifData) {
                if (error)
                    console.log('Error: ' + error.message);
                else
                    date= exifData.image.ModifyDate;
                    arraydate.push(date);
                console.log(arraydate);

            });
        } catch (error) {
            console.log('Error: ' + error.message);
        }
    };

    database.query("INSERT INTO trips_table(trip_title,trip_pic,trip_start,trip_end, username, trip_price, trip_journals,trip_tags) VALUES (?,?,?,?,?,?,?,?)",
     [tripTitle,tripTitle+userName+'0',start,end, userName, tripPrice, journals,tripTags], function(err, data){
        if(err){
            console.log(err);

        }else{

            var sqlSavePhoto = "SELECT tripID FROM trips_table WHERE trip_title = ? AND username = ?"


            database.query(sqlSavePhoto,[tripTitle,userName],function(err,tripIDForPhotos){
                var datenow;



                        for (var i = 0; i < req.files.userPhoto.length; i++) {
                            var name = tripTitle + userName + i;

                            try {
                                var ExifImage = require('exif').ExifImage;
                                new ExifImage({ image: 'public/uploads/trips/' + name }, function (error, exifData) {
                                    if (error)
                                        console.log('Error: ' + error.message);
                                    else
                                        this.date = exifData.image.ModifyDate;
                                    arraydate.push(date);



                                });
                            } catch (error) {
                                console.log('Error: ' + error.message);
                            }


                            saveToPhotTable(tripIDForPhotos[0].tripID, name, arraydate[i], function (nothingReturned) { });


                            console.log('uploaded');

                           }

                for(var i = 0; i < req.body.event.length; i++){
                    if(req.body.event[i] != ''){
                        saveEventDescription(tripIDForPhotos[0].tripID,req.body.event[i],i,function(nothingReturned){});
                    }

                    console.log('events added');
                }

                getRecRequests(userName, function (recReq) {
                    getUserProfile(userName, function (userData) { // get user table data to display in profile
                        getMyTrips(userName, function (getMyTripData) { // get my trip data to display in list
                            getSavedTrips(userName, function (getSavedTripData) { // get user saved trips data
                                getFriendsList(userName, function (friends) {
                                    getUsersList(userName, function (users) {
                                        res.render('userProfile.ejs', { data: userData, trip: getSavedTripData, myTrip: getMyTripData, friends1: friends, users1: users, recReq1: recReq }); // render the profile page with the corrct data

                                    });
                                });
                            });
                        });
                    });
                });

            });
        }

     });

};

exports.postComment = function (req,res){

var tripID = '68';
var username = 'aj';
var comment = 'Make sure to stop off in kabukicho and see the robo resturant (eat first, the food provided sucks). Do not blindly follow the touts '
let date = new Date();
var dateTime = '0'+date.getDate()+'-0'+date.getMonth()+'-'+date.getFullYear()+' '+date.getHours()+':'+date.getMinutes();
/* add to database
var sqlAddComment = "INSERT INTO comment_table (tripID, username, comment, time) VALUES (?,?,?,?)"
database.query(sqlAddComment,[tripID,username,comment,dateTime],function(err,nothingToReturn){
        if(err) throw err

        console.log('comment added')
});
*/

getComments(tripID,function(commentData){ // get from database
        console.log(commentData)
});

getEvents(tripID,function(events){
    console.log(events)
});

};


exports.editTripForm = function(req, res){
    var newTitle = req.body.newTitle;
    var newDate = req.body.newDate;
  // var newScore = req.body.newScore;
  //  var newPrice = req.body.newPrice;
    var newJournal = req.body.newJournal;
    var newEvent = req.body.newEvent;
    var userName = req.session.secret;

    database.query("UPDATE trips_table SET trip_date = ?, trip_journals = ?, trip_events = ? WHERE username = ? AND trip_title = ?", [newDate, newJournal, newEvent, userName, newTitle], function(err,data){
        if(err){
            console.log(err);
        }else{
            console.log("updated");

        }
    });

};



exports.savedTripsPage = function (req, res) { // display user saved trips with details of trips as a table

    var sqlState = "SELECT * FROM trips_table x JOIN saved_trips_table y ON y.tripID = x.tripID WHERE y.username = ? "
    database.query(sqlState, [req.session.secret], function (err, savedTripsData) {
        if (savedTripsData.length == 0) {
            res.render('saved_trips.ejs', { tripData: savedTripsData });
        } else {
            // format date
            res.render('saved_trips.ejs', { tripData: savedTripsData });

        }
    });

};


exports.searchTripsTable = function (req, res) { // navigation bar
    if (req.session.secret == undefined)
        req.session.secret = ' ' // so someone not signed in can see trips

    var sqlState = "SELECT * FROM trips_table WHERE username != ? ORDER BY trip_score DESC"
    database.query(sqlState, [req.session.secret], function (err, searchData) {
        res.render('search_trips.ejs', { tripData: searchData, search: "Search Trips", filter: "Filter By", order: "trip_score DESC" });
    });
};


exports.home = function (req, res) {
    userName = req.session.secret;
    if (req.session.secret == undefined || userName == ' ') {
        res.render('loginpage.ejs', { errorMessage: " " });

    } else {
        getRecRequests(userName, function (recReq) {
            getUserProfile(userName, function (userData) { // get user table data to display in profile
                getMyTrips(userName, function (getMyTripData) { // get my trip data to display in list
                    getSavedTrips(userName, function (getSavedTripData) { // get user saved trips data
                        getFriendsList(userName, function (friends) {
                            getUsersList(userName, function (users) {
                                res.render('userProfile.ejs', { data: userData, trip: getSavedTripData, myTrip: getMyTripData, friends1: friends, users1: users, recReq1: recReq }); // render the profile page with the corrct data

                            });
                        });
                    });
                });
            });
        });

    }

};

exports.searchRequest = function (req,res){ // a lot of code that should be useless once we make the shift to html and js
var searchDestionation = '%'+req.body.search+'%';
var filterOption = '%'+req.body.filter+'%';
var sortBy = req.body.sort
var username = req.session.secret

if(req.body.search == '')
req.body.search = 'Search Trips'

if(req.body.filter == '')
req.body.filter = 'Filter By'

if(req.session.secret == undefined)
username = ' ' // so someone not signed in can see trips



console.log(searchDestionation+' '+filterOption+' '+sortBy);

    if(req.body.filter == 'Filter By' && req.body.search != 'Search Trips' && sortBy == 'trip_score DESC'){ // if search only
        console.log('1');
        var sqlUser = "SELECT * FROM trips_table WHERE trip_title LIKE ? AND username != ? ORDER BY trip_score DESC"
        database.query(sqlUser,[searchDestionation,req.session.secret], function(err,results){
            if (err) throw err
            if(results == ''){
                res.render('search_trips.ejs',{tripData: results, errorMessage: "Sorry, no Trips there yet. Go and tell us about it.", search: req.body.search, filter : req.body.filter, order:sortBy})
            } else {
                res.render('search_trips.ejs',{tripData: results, errorMessage: " ",search: req.body.search, filter : req.body.filter, order:sortBy})
            }

        });

    } else if (req.body.filter != 'Filter By' && req.body.search == 'Search Trips' && sortBy == 'trip_score DESC'){ // if filter only
        console.log('2');
        var sqlUser = "SELECT * FROM trips_table WHERE trip_tags LIKE ? AND username != ? ORDER BY trip_score DESC"
        database.query(sqlUser,[filterOption,username], function(err,results){
            if (err) throw err
            if(results == ''){
                res.render('search_trips.ejs',{tripData: results, errorMessage: "Sorry, no Trips by that filter.", search: req.body.search, filter : req.body.filter, order:sortBy})
            } else {
                res.render('search_trips.ejs',{tripData: results, errorMessage: " ",search: req.body.search, filter : req.body.filter, order:sortBy})
            }

        });


    }else if (req.body.filter != 'Filter By' && req.body.search != 'Search Trips' && sortBy == 'trip_score DESC'){ // if search and filter
        console.log('3');
        var sqlUser = "SELECT * FROM trips_table WHERE trip_title LIKE ? AND trip_tags LIKE ? AND username != ? ORDER BY trip_score DESC"
        database.query(sqlUser,[searchDestionation,filterOption,username], function(err,results){
            if (err) throw err
            if(results == ''){
                res.render('search_trips.ejs',{tripData: results, errorMessage: "Sorry, no Trips by that destination and filter, Go there, do that and tell us.", search: req.body.search, filter : req.body.filter, order:sortBy})
            } else {
                res.render('search_trips.ejs',{tripData: results, errorMessage: " ",search: req.body.search, filter : req.body.filter, order:sortBy})
            }

        });

    }else if (req.body.filter != 'Filter By' && req.body.search != 'Search Trips' && sortBy != 'trip_score DESC'){ // if all 3
        console.log('4');

        if(sortBy == 'trip_price DESC'){
            var sqlUser = "SELECT * FROM trips_table WHERE trip_title LIKE ? AND trip_tags LIKE ? AND username != ? ORDER BY trip_price DESC"
        }
        else if(sortBy == 'trip_price'){
            var sqlUser = "SELECT * FROM trips_table WHERE trip_title LIKE ? AND trip_tags LIKE ? AND username != ? ORDER BY trip_price"
        }
        else if(sortBy == 'trip_start DESC'){
            var sqlUser = "SELECT * FROM trips_table WHERE trip_title LIKE ? AND trip_tags LIKE ? AND username != ? ORDER BY trip_start DESC"
        }
        else if(sortBy == 'trip_score'){
            var sqlUser = "SELECT * FROM trips_table WHERE trip_title LIKE ? AND trip_tags LIKE ? AND username != ? ORDER BY trip_score"
        }
        else if (sortBy == 'trip_score DESC'){
            var sqlUser = "SELECT * FROM trips_table WHERE trip_title LIKE ? AND trip_tags LIKE ? AND username != ? ORDER BY trip_score DESC"
         }


        database.query(sqlUser,[searchDestionation,filterOption,username], function(err,results){
            if (err) throw err
            if(results == ''){
                res.render('search_trips.ejs',{tripData: results, errorMessage: "Sorry, no Trips by that destination, Go there, do that and tell us.", search: req.body.search, filter : req.body.filter, order:sortBy})
            } else {
                res.render('search_trips.ejs',{tripData: results, errorMessage: " ",search: req.body.search, filter : req.body.filter, order:sortBy})
            }

        });
    } else if(req.body.filter == 'Filter By' && req.body.search != 'Search Trips' && sortBy != 'trip_score DESC' ) { // if search and sort
        console.log('5');
        if(sortBy == 'trip_price DESC'){
            var sqlUser = "SELECT * FROM trips_table WHERE trip_title LIKE ? AND username != ? ORDER BY trip_price DESC"
        }
        else if(sortBy == 'trip_price'){
            var sqlUser = "SELECT * FROM trips_table WHERE trip_title LIKE ? AND username != ? ORDER BY trip_price"
        }
        else if(sortBy == 'trip_start DESC'){
            var sqlUser = "SELECT * FROM trips_table WHERE trip_title LIKE ? AND username != ? ORDER BY trip_start DESC"
        }
        else if(sortBy == 'trip_score'){
            var sqlUser = "SELECT * FROM trips_table WHERE trip_title LIKE ?  AND username != ?ORDER BY trip_score"
        }
        else if (sortBy == 'trip_score DESC'){
            var sqlUser = "SELECT * FROM trips_table WHERE trip_title LIKE ? AND trip_tags LIKE ? AND username != ? ORDER BY trip_score DESC"
         }


        database.query(sqlUser,[searchDestionation,username], function(err,results){
            if (err) throw err
            if(results == ''){
                res.render('search_trips.ejs',{tripData: results, errorMessage: "Sorry, no Trips by that destination, Go there, do that and tell us.", search: req.body.search, filter : req.body.filter, order:sortBy})
            } else {
                res.render('search_trips.ejs',{tripData: results, errorMessage: " ",search: req.body.search, filter : req.body.filter, order:sortBy})
            }

        });

    } else if(req.body.filter != 'Filter By' && req.body.search == 'Search Trips' && sortBy != 'trip_score DESC'){ // if filter and sort
        console.log('6');

        if(sortBy == 'trip_price DESC'){
            var sqlUser = "SELECT * FROM trips_table WHERE trip_tags LIKE ? AND username != ? ORDER BY trip_price DESC"
        }
        else if(sortBy == 'trip_price'){
            var sqlUser = "SELECT * FROM trips_table WHERE trip_tags LIKE ? AND username != ? ORDER BY trip_price"
        }
        else if(sortBy == 'trip_start DESC'){
            var sqlUser = "SELECT * FROM trips_table WHERE trip_tags LIKE ?  AND username != ? ORDER BY trip_start DESC"
        }
        else if(sortBy == 'trip_score'){
            var sqlUser = "SELECT * FROM trips_table WHERE trip_tags LIKE ? AND username != ? ORDER BY trip_score"
        }
        else if (sortBy == 'trip_score DESC'){
            var sqlUser = "SELECT * FROM trips_table WHERE trip_tags LIKE ? AND username != ? ORDER BY trip_score DESC"
         }


        database.query(sqlUser,[filterOption,username], function(err,results){
            if (err) throw err
            if(results == ''){
                res.render('search_trips.ejs',{tripData: results, errorMessage: "Sorry, no Trips by that destination and filter, Go there, do that and tell us.", search: req.body.search, filter : req.body.filter, order:sortBy})
            } else {
                res.render('search_trips.ejs',{tripData: results, errorMessage: " ",search: req.body.search, filter : req.body.filter, order:sortBy})
            }

        });


    } else if(req.body.filter == 'Filter By' && req.body.search == 'Search Trips' && sortBy != 'trip_score DESC' ) { // if sort only
        console.log('7');

        if(sortBy == 'trip_price DESC'){
            var sqlUser = "SELECT * FROM trips_table WHERE username != ? ORDER BY trip_price DESC"
        }

        else if(sortBy == 'trip_price'){
            var sqlUser = "SELECT * FROM trips_table ORDER BY trip_price"
        }

        else if(sortBy == 'trip_start DESC'){
            var sqlUser = "SELECT * FROM trips_table ORDER BY trip_start DESC"
        }

        if(sortBy == 'trip_score'){
            var sqlUser = "SELECT * FROM trips_table ORDER BY trip_score"
        }
        else if (sortBy == 'trip_score DESC'){
            var sqlUser = "SELECT * FROM trips_table ORDER BY trip_score DESC"
         }

        database.query(sqlUser,[username], function(err,results){
            if (err) throw err
            if(results == ''){
                res.render('search_trips.ejs',{tripData: results, errorMessage: "Sorry, no Trips by that destination and filter, Go there, do that and tell us.", search: req.body.search, filter : req.body.filter, order:sortBy})
            } else {
                res.render('search_trips.ejs',{tripData: results, errorMessage: " ",search: req.body.search, filter : req.body.filter, order:sortBy})
            }

        });
    }

};


// ---------------- trip_details page ---------------------

//--------------- render trip detaiil page ---------------------
exports.displayTripData = function (req, res){
    var pageTripID = req.body.click;
    console.log(pageTripID);
    var sqlState = "SELECT * FROM trips_table WHERE tripID = ? " // get trip entry
    database.query(sqlState,[pageTripID], function(err, data){
        if(data.length > 0){
            getEvents(pageTripID,function(getEventData){ // get  trip events
                getPhotos(pageTripID,function(getPhotos){ // get trip photos
                    getComments(pageTripID,function(getComments){ // get trip comments
                    res.render('trip_details.ejs', {tripData: data, eventData: getEventData, photo: getPhotos, commentData:getComments, errorMessage: '', noUserError: '' });
                    });
                });
            });
        }
    });

    //console.log(data);
}
// ------- like & save button (must be a user) ------------

exports.likeTrip = function(req,res){

    var tripID = req.body.tripID;
    var username = req.session.secret;
    var updatedScore;

    if(username == ' ' || username == undefined){ // if not a user
        var sqlState = "SELECT * FROM trips_table WHERE tripID = ? " // get trip entry
        database.query(sqlState,[tripID], function(err, data){
            getEvents(tripID,function(getEventData){ // get  trip events
                getPhotos(tripID,function(getPhotos){ // get trip photos
                    getComments(tripID,function(getComments){ // get trip comments
                    res.render('trip_details.ejs', {tripData: data, eventData: getEventData, photo: getPhotos, commentData:getComments, errorMessage: '', noUserError: 'must be a user to like' });
                    });
                });
            });
        });
    }

    var sqlMyTrips = "SELECT * FROM like_table  WHERE tripID = ?"
    database.query(sqlMyTrips,[tripID],function(err,ifLikedBefore){
        if(ifLikedBefore.length > 0){ //if already liked
            var sqlState = "SELECT * FROM trips_table WHERE tripID = ? " // get trip entry
            database.query(sqlState,[tripID], function(err, data){
                getEvents(tripID,function(getEventData){ // get  trip events
                    getPhotos(tripID,function(getPhotos){ // get trip photos
                        getComments(tripID,function(getComments){ // get trip comments
                        res.render('trip_details.ejs', {tripData: data, eventData: getEventData, photo: getPhotos, commentData:getComments, errorMessage: '', noUserError: 'already liked' });
                        });
                    });
                });
            });
        }else {
            var sqlGetScore = "SELECT trip_score FROM trips_table  WHERE tripID = ?"
            database.query(sqlGetScore,[tripID],function(err,tripScore){

                updatedScore =tripScore[0].trip_score +1;
                var sqlScoreUpdate = "UPDATE trips_table SET trip_score = ?  WHERE tripID = ?"
                database.query(sqlScoreUpdate,[updatedScore,tripID],function(err,noReturn){

                    var sqlLikeTableInsert = "INSERT like_table Values (?,?)"
                    database.query(sqlLikeTableInsert,[username,tripID],function(err,noReturn){

                            var sqlState = "SELECT * FROM trips_table WHERE tripID = ? " // get trip entry
                            database.query(sqlState,[tripID], function(err, data){
                                getEvents(tripID,function(getEventData){ // get  trip events
                                    getPhotos(tripID,function(getPhotos){ // get trip photos
                                        getComments(tripID,function(getComments){ // get trip comments
                                            res.render('trip_details.ejs', {tripData: data, eventData: getEventData, photo: getPhotos, commentData:getComments, errorMessage: '', noUserError:'Liked' });
                                        });
                                    });
                                });
                            });

                    });
                });
            });
        }
    });
};

exports.saveTrip = function (req,res){
var username = req.session.secret;
var tripID = req.body.tripID;

if(username == ' ' || username == undefined){
    var sqlState = "SELECT * FROM trips_table WHERE tripID = ? " // get trip entry
    database.query(sqlState,[tripID], function(err, data){
        getEvents(tripID,function(getEventData){ // get  trip events
            getPhotos(tripID,function(getPhotos){ // get trip photos
                getComments(tripID,function(getComments){ // get trip comments
                res.render('trip_details.ejs', {tripData: data, eventData: getEventData, photo: getPhotos, commentData:getComments, errorMessage: '', noUserError: 'must be a user to save' });
                });
            });
        });
    });
    return;
}

var sqlSavedTrips = "SELECT * FROM saved_trips_table  WHERE username = ? AND tripID = ?"
database.query(sqlSavedTrips,[username,tripID],function(err,savedTripsData){// get user saved trips data
    if(savedTripsData.length > 0){ // already saved
        var sqlState = "SELECT * FROM trips_table WHERE tripID = ? " // get trip entry
        database.query(sqlState,[tripID], function(err, data){
            getEvents(tripID,function(getEventData){ // get  trip events
                getPhotos(tripID,function(getPhotos){ // get trip photos
                    getComments(tripID,function(getComments){ // get trip comments
                    res.render('trip_details.ejs', {tripData: data, eventData: getEventData, photo: getPhotos, commentData:getComments, errorMessage: '', noUserError:'already saved' });
                    });
                });
            });
        });
    } else {
        var sqlSavedTrips = "INSERT INTO saved_trips_table VALUES (?,?)"
        database.query(sqlSavedTrips,[tripID, username],function(err,savedTripsData){// get user saved trips data
            var sqlState = "SELECT * FROM trips_table WHERE tripID = ? " // get trip entry
        database.query(sqlState,[tripID], function(err, data){
            getEvents(tripID,function(getEventData){ // get  trip events
                getPhotos(tripID,function(getPhotos){ // get trip photos
                    getComments(tripID,function(getComments){ // get trip comments
                    res.render('trip_details.ejs', {tripData: data, eventData: getEventData, photo: getPhotos, commentData:getComments, errorMessage: '', noUserError:'Saved' });
                    });
                });
            });
        });
        });
    }
});

};

// --------------- Comments functions --------------------
exports.postComment = function (req,res){

var tripID = req.body.tripID;
var username = req.session.secret;
var comment = req.body.comment;

var dateTime;
let date = new Date();
var hours, minutes, day, month;
if(date.getHours() < 10){
     hours = '0'+date.getHours();
} else {
    hours = date.getHours();
}

if(date.getMinutes() < 10) {
    minutes = ':0'+date.getMinutes();
}else {
    minutes = date.getMinutes();
}

if(date.getDate() < 10 ){
    day = '0'+date.getDate();
}else {
    day = date.getDate();
}

if(date.getMonth() < 10 ){
    month = '0'+date.getMonth();
}else {
    month = date.getMonth();
}

dateTime = day+'-'+month+'-'+date.getFullYear()+' '+hours+':'+minutes;

//console.log(tripID +' '+username+' '+comment+' '+ dateTime);

var sqlAddComment = "INSERT INTO comment_table (tripID, username, comment, time) VALUES (?,?,?,?)"
database.query(sqlAddComment,[tripID,username,comment,dateTime],function(err,nothingToReturn){
        if(err) {
            var sqlState = "SELECT * FROM trips_table WHERE tripID = ? " // get trip entry
            database.query(sqlState,[tripID], function(err, data){
                    getEvents(tripID,function(getEventData){ // get  trip events
                        getPhotos(tripID,function(getPhotos){ // get trip photos
                            getComments(tripID,function(getComments){ // get trip comments
                            res.render('trip_details.ejs', {tripData: data, eventData: getEventData, photo: getPhotos, commentData:getComments, errorMessage: "Must be a user to leave comments" , noUserError: ''});
                        });
                    });
                });
            });

        } else {
            var sqlState = "SELECT * FROM trips_table WHERE tripID = ? " // get trip entry
            database.query(sqlState,[tripID], function(err, data){
                    getEvents(tripID,function(getEventData){ // get  trip events
                        getPhotos(tripID,function(getPhotos){ // get trip photos
                            getComments(tripID,function(getComments){ // get trip comments
                                res.render('trip_details.ejs', {tripData: data, eventData: getEventData, photo: getPhotos, commentData:getComments, errorMessage: '' , noUserError:''});

                        });
                    });
                    });
            });
        }

});

/*
getComments(tripID,function(commentData){ // get from database
        console.log(commentData)
});

getEvents(tripID,function(events){
    console.log(events)
});
*/
};

exports.sortComment = function (req,res){

    var order = req.body.sortComment;
    var tripID = req.body.tripID;

    if(order == 'default'){
        console.log('default ' +order);
        var sqlState = "SELECT * FROM trips_table WHERE tripID = ? " // get trip entry
        database.query(sqlState,[tripID], function(err, data){
                getEvents(tripID,function(getEventData){ // get  trip events
                    getPhotos(tripID,function(getPhotos){ // get trip photos
                        getComments(tripID,function(getComments){ // get trip comments
                            res.render('trip_details.ejs', {tripData: data, eventData: getEventData, photo: getPhotos, commentData:getComments, errorMessage: '' , noUserError:''});
                        });
                    });
                });
        });
    } else {
        console.log('old ' +order);
        var sqlState = "SELECT * FROM trips_table WHERE tripID = ? " // get trip entry
        database.query(sqlState,[tripID], function(err, data){
                getEvents(tripID,function(getEventData){ // get  trip events
                    getPhotos(tripID,function(getPhotos){ // get trip photos
                        var sqlevent = "SELECT x.username, x.comment, x.time FROM comment_table x INNER JOIN trips_table y ON x.tripID = y.tripID WHERE x.tripID = ?"
                        database.query(sqlevent,[tripID],function(err,tripComment){
                            res.render('trip_details.ejs', {tripData: data, eventData: getEventData, photo: getPhotos, commentData:tripComment, errorMessage: '', noUserError:''});
                        });
                    });
                });
        });

    }

};

// ------ end trip details page ------------------------

exports.addFriends = function (req, res) {
    var friend_one = req.body.friend_one;
    var friend_two = req.body.friend_two;
    var userName=req.session.secret;

    database.query("INSERT INTO friends_table(friend_one,friend_two,status) VALUES (?,?,?)",[friend_one,friend_two,"f"] ,function (err, data) {

        if (err) {
            var sqlUsersList = "UPDATE friends_table SET friend_one = ?, friend_two = ?,status=? WHERE friend_one = ? AND friend_two = ?"
            database.query(sqlUsersList, [friend_one, friend_two, 'f', friend_one, friend_two]);
           console.log('true');


        }


    });
    database.query("INSERT INTO friends_table(friend_one,friend_two,status) VALUES (?,?,?)", [friend_two, friend_one, "f"], function (err, data) {

        if (err) {
            var sqlUsersList = "UPDATE friends_table SET friend_one = ?, friend_two = ?,status=? WHERE friend_one = ? AND friend_two = ?"
            database.query(sqlUsersList, [friend_two, friend_one, 'f', friend_two, friend_one]);
            console.log('true');

        }

    });



}
exports.removeFriends = function (req, res) {
    const userName = req.session.secret;

    var friend_one = userName;
    var friend_two = req.body.friend_two;

    console.log(userName);
    console.log(friend_two);
    var sqlUsersList = "UPDATE friends_table SET friend_one = ?, friend_two = ?,status=? WHERE friend_one = ? AND friend_two = ?"
    database.query(sqlUsersList, [friend_one, friend_two, 'x', friend_one, friend_two], function (err, data) {
        if (err) {
            var sqlUsersList1 = "UPDATE friends_table SET friend_one = ?, friend_two = ?,status=? WHERE friend_one = ? AND friend_two = ?"
            database.query(sqlUsersList1, [friend_two, friend_one, 'x', friend_two, friend_one]);
            console.log(err);
            //console.log('error inputing into database');

        } else {
            console.log('sucessfully inputted');
        }

    });
    var sqlUsersList1 = "UPDATE friends_table SET friend_one = ?, friend_two = ?,status=? WHERE friend_one = ? AND friend_two = ?"
    database.query(sqlUsersList1, [friend_two, friend_one, 'x', friend_two, friend_one], function (err, data) {
        if (err) {
            var sqlUsersList = "UPDATE friends_table SET friend_one = ?, friend_two = ?,status=? WHERE friend_one = ? AND friend_two = ?"
            database.query(sqlUsersList, [friend_one, friend_two, 'x', friend_one, friend_two]);
            console.log(err);
            //console.log('error inputing into database');

        } else {
            console.log('sucessfully inputted1');
        }


    });

    getRecRequests(userName, function (recReq) {
        getUserProfile(userName, function (userData) { // get user table data to display in profile
            getMyTrips(userName, function (getMyTripData) { // get my trip data to display in list
                getSavedTrips(userName, function (getSavedTripData) { // get user saved trips data
                    getFriendsList(userName, function (friends) {
                        getUsersList(userName, function (users) {
                            res.render('userProfile.ejs', { data: userData, trip: getSavedTripData, myTrip: getMyTripData, friends1: friends, users1: users, recReq1: recReq }); // render the profile page with the corrct data

                        });
                    });
                });
            });
        });
    });
}
exports.requestFriends = function (req, res) {


    var friend_two = req.body.friend_two;
    const userName=req.session.secret;
    var friend_one=userName;
        database.query("INSERT INTO friends_table(friend_one,friend_two,status) VALUES (?,?,'r')", [friend_one, friend_two], function (err, data) {

            if (err) {
                var sqlUsersList = "UPDATE friends_table SET friend_one = ?, friend_two = ?,status=? WHERE friend_one = ? AND friend_two = ?"
                database.query(sqlUsersList, [friend_one, friend_two, 'r', friend_one, friend_two]);


            } else {
                console.log(data);
            }

        });




}
exports.RecRequest = function (req, res) {

    var userName=req.session.secret;
    //database.query("SELECT * FROM user_table WHERE friend_two = ? && status=? VALUES(?, 'r')", [friend_one]);

    // console.log(addFriends(friend_one,friend_two));
    getRecRequests(userName, function (recReq) {
        getUserProfile(userName, function (userData) { // get user table data to display in profile
            getMyTrips(userName, function (getMyTripData) { // get my trip data to display in list
                getSavedTrips(userName, function (getSavedTripData) { // get user saved trips data
                    getFriendsList(userName, function (friends) {
                        getUsersList(userName, function (users) {
                            res.render('userProfile.ejs', { data: userData, trip: getSavedTripData, myTrip: getMyTripData, friends1: friends, users1: users, recReq1: recReq }); // render the profile page with the corrct data

                        });
                    });
                });
            });
        });
    });

}
exports.friendsProfile=function(req,res){
var userName=req.body.friendsName;
   console.log(userName);
getUserProfile(userName, function (userData) { // get user table data to display in profile
        getMyTrips(userName, function (getMyTripData) { // get my trip data to display in list

            getSavedTrips(userName, function (getSavedTripData) { //
                res.render('friendsProfile.ejs', { data: userData, trip: getSavedTripData, myTrip: getMyTripData }); // render the profile page with the corrct data
            });
        });
    });

            }

exports.searchFriends=function(req,res){
    var userName = '%' + req.query.key + '%';

    if (userName = "%undifined%") {
        userName = '%' + req.body.typeahead + '%';
    }
    database.query('SELECT * from user_table where username like  ?', [userName],

        function (err, rows) {

            if (err) throw err;
            var data = [];
            for (i = 0; i < rows.length; i++) {
                if(rows[i]==req.session.secret){
                    console.log("not pushing");
                    i++;
                }
                data.push(rows[i]);

                //res.end("searchFriend.html")
                //res.render("searchFriend.html", { data: data });
            }
            getFriendsList(userName, function (friends) {
            res.render("searchFriend.ejs", { data1: data, typeahead: userName ,friends1:friends});

        });
});

}


exports.search = function (req, res) {
    var userName = '%' + req.query.key + '%';
    console.log(userName);
    if (req.session.secret==''){
        res.render("loginpage.ejs");
    }

    var sqlState = "SELECT * FROM user_table WHERE username != ? "
    database.query(sqlState, [req.session.secret], function (err, searchData) {
        getFriendsList(userName, function (friends) {

        res.render('searchFriend.ejs', { data1: searchData, typeahead: userName, friends1: friends});
    });

    });

}

//----------------Edit trip ------------------------

// ------ display list of trips to edit
exports.editTripSelection = function(req,res){

    var sqlState = "SELECT * FROM trips_table  WHERE username = ? "
    database.query(sqlState,[req.session.secret],function(err,myTripData){
        res.render('editSelection.ejs',{tripData: myTripData});
    });

};

// display specific trip to edit
exports.editThis = function (req,res){
    var tripID = req.body.click;

    var sqlState = "SELECT username  FROM trips_table WHERE tripID= ?" // update entry in trips table
    database.query(sqlState,[tripID],function(err,hasPermission){

        if(req.session.secret != hasPermission[0].username || req.session.secret == undefined){
            var sqlState = "SELECT * FROM trips_table WHERE tripID = ? " // get trip entry
            database.query(sqlState,[tripID], function(err, data){
                if(data.length > 0){
                    getEvents(tripID,function(getEventData){ // get  trip events
                        getPhotos(tripID,function(getPhotos){ // get trip photos
                            getComments(tripID,function(getComments){ // get trip comments
                            res.render('trip_details.ejs', {tripData: data, eventData: getEventData, photo: getPhotos, commentData:getComments, errorMessage: '', noUserError: 'You do not have edit permission' });
                            });
                        });
                    });
                }
            });
        } else {

            var sqlState = "SELECT * FROM trips_table WHERE tripID = ? "
                database.query(sqlState,[tripID],function(err,tripData){
                    getEvents(tripID,function(getEventData){
                        getPhotos(tripID,function(photoData){
                            //console.log(tripData)
                            //console.log(getEventData)
                            res.render('editTrip.ejs',{tripData: tripData, eventData: getEventData, photo: photoData});
                        });
                    });
                });
        }
    });

};

// edit submission form
exports.editTripForm = function(req, res){
    var userName = req.session.secret;
     // details to delete old stuff
     var tripID = req.body.tripID;

    // new details to update
    var newTitle = req.body.newTitle;
    var newStart;// new start/end defualt to "" on edit form
    var newEnd;
    var newPrice = req.body.newPrice; // other values defualt to datbase stored values
    var newJournal = req.body.newJournal;
    var newTags = req.body.newTags;
    var tripDisplayPic = newTitle+userName+0;; // pic saved in trip table as display pic,  newTitle is old title if not changed
    var arraydate=new Array();

    if(req.body.newStart == ""){ // if no new start / end date
        newStart = req.body.oldTripStart;
        console.log(' date blank' + newStart)

    } else {
        newStart = req.body.newStart;
        console.log(' date not blank')
    }

    if(req.body.newEnd == ""){
        newEnd = req.body.oldTripEnd;
    }else {
        newEnd = req.body.newEnd;
    }


/* // test to see arguments
    console.log(tripID+' '+newTitle+' '+newStart+' '+newEnd+' '+newPrice+' '+newJournal+' '+userName +' '+newTags);

    for(var i = 0; i < req.body.event.length; i++){

            console.log(i+' '+ req.body.eventID[i] +' '+ req.body.event[i]);
        }

/*/
    if(req.files){ // if photos were uplaoded
        var file = req.files.tripPhotos;

            getPhotos(tripID,function(photos){

                for(var i = 0; i < photos.length; i++){ // loop though old photos and remove them from server local folder
                    const filename = 'public/uploads/trips/'+req.body.oldTripTitle+userName+i;
                    try{
                        console.log("deleteing file : "+ filename);
                        fs.unlinkSync(filename)
                    } catch(err){
                        console.log("No files to delete");
                        break;
                    }
                }

            var sqlState = "DELETE FROM photo_table WHERE tripID= ?" // delete old pictures in database
            database.query(sqlState,[tripID],function(err,nothingToReturn){ if(err) throw err });

                for(var i = 0; i < req.files.tripPhotos.length; i++){ // loop though uploaded files and save them locally
                    var tripImgName = newTitle+ userName + i;//rename file
                        if(file[i].mimetype == "image/jpeg" ||file[i].mimetype == "image/png"||file[i].mimetype == "image/gif"){
                             file[i].mv('public/uploads/trips/'+tripImgName, function(err) { // save locally , extract data here
                                 if(err) throw err
                                 console.log("saving locally file : "+ tripImgName);
                             });


                            try {
                                var ExifImage = require('exif').ExifImage;
                                new ExifImage({ image: 'public/uploads/trips/' + tripImgName }, function (error, exifData) {
                                    if (error)
                                        console.log('Error: ' + error.message);
                                    else
                                        this.date = exifData.image.ModifyDate;
                                    arraydate.push(date);



                                });
                            } catch (error) {
                                console.log('Error: ' + error.message);
                            }


                            };




                                saveToPhotTable(tripID, tripImgName, "", function (nothingReturned) { // statment needs to be changed to account for photo data

                                });







                        }


            });

    }
    // reguardless of new photos uplaoded
    // new title will be old title if not changed
    // tripDisplayPic is dependant on title
    var sqlState = "UPDATE trips_table SET trip_title = ?, trip_pic = ?, trip_start = ?, trip_end = ?, trip_price = ?, trip_journals = ?, trip_tags = ? WHERE tripID= ?" // update entry in trips table
    database.query(sqlState,[newTitle,tripDisplayPic,newStart,newEnd,newPrice,newJournal,newTags,tripID],function(err,oldTripData){
        if(err) throw err

        if(!req.files && req.body.oldTripTitle !== newTitle){ //if no files && new title, rename exsiting files to match new title
            getPhotos(tripID,function(photos){ // rename existing photos
                for(var i = 0; i < photos.length; i++){
                    // update photo table in database
                    var newPhotoName = newTitle+userName+i;
                    var oldPhotoName = req.body.oldTripTitle+userName+i;
                    var sqlState = "UPDATE photo_table SET photo_name = ? WHERE photo_name = ? AND tripID = ? "
                    database.query(sqlState,[newPhotoName,oldPhotoName,tripID], function(err, noReturn){
                        if(err) throw err
                        //console.log(noReturn) // see if update happened

                    });

                    // remane local server file
                    var oldPath = __dirname+ '/public/uploads/trips/'+ req.body.oldTripTitle + userName + i;
                    var newPath = __dirname+ '/public/uploads/trips/' + newTitle + userName + i;
                    fs.rename(oldPath,newPath,()=>{ // (oldfile,newfile,callback)
                    console.log('renamed '+req.body.oldTripTitle+userName+i+' to '+newTitle+userName+i);
                    });
                }
            });
        }

        for(var i = 0; i < req.body.event.length; i++){ // add events if need be
            if(req.body.eventID[i] == undefined && req.body.event[i] !=''){ // if new event
                saveEventDescription(tripID,req.body.event[i],req.body.event.length+i,function(nothingReturned){}); // save new event description in table
            } else if(req.body.event[i] == ''){ // description removed == delete
                var sqlState = "DELETE FROM event_table WHERE eventID = ?"
                database.query(sqlState,[req.body.eventID[i]], function(err, data){ });


            }else{ // else update old event, done reguardless of update
                var sqlState = "UPDATE event_table SET description = ? WHERE eventID = ?"
                database.query(sqlState,[req.body.event[i],req.body.eventID[i]], function(err, data){ });
            }
        }

        var sqlState = "SELECT * FROM trips_table WHERE tripID = ? "  // render updated trip details page on success
        database.query(sqlState,[tripID], function(err, data){
            if(data.length > 0){
                getEvents(tripID,function(getEventData){
                    getPhotos(tripID,function(getPhotos){
                        getComments(tripID,function(getComments){
                        res.render('trip_details.ejs', {tripData: data, eventData: getEventData, photo: getPhotos, commentData:getComments, errorMessage: '', noUserError: '' });
                        });
                    });
                });
            }
        });

    });


};

exports.deleteEventDescription = function (req, res){
    var eventID = req.body.deleteEventID;
    var tripID = req.body.deleteTripID;

    //console.log('tripID: '+tripID)
    //console.log('eventID '+ eventID)

    var sqlState = "DELETE FROM event_table WHERE eventID = ?"
            database.query(sqlState,[eventID],function(err,noRetrun){
                if(err) throw err

                var sqlState = "SELECT * FROM trips_table WHERE tripID = ? "
                database.query(sqlState,[tripID],function(err,tripData){
                    getEvents(tripID,function(getEventData){
                        if(err) throw err
                        getPhotos(tripID,function(photoData){
                            if(err) throw err
                            //console.log(tripData)
                            //console.log(getEventData)
                            res.render('editTrip.ejs',{tripData: tripData, eventData: getEventData, photo: photoData});
                        });
                    });
                });
           });
};

// delete trip if owned
exports.deleteTrip = function (req,res){
    var deleteThis = req.body.click;
    var username = req.session.secret;


    var sqlState = "DELETE FROM trips_table WHERE tripID = ? AND username = ?"
    database.query(sqlState,[deleteThis,username],function(err,noRetrun){
        if(err) throw err

        var sqlState = "SELECT * FROM trips_table  WHERE username = ? "
        database.query(sqlState,[req.session.secret],function(err,myTripData){
            res.render('editSelection.ejs',{tripData: myTripData});
        });

    });



};
// ------------ end edit page -----------------------------


exports.FriendsList= function(req,res){
    var userName = req.session.secret;
            getUserProfile(userName, function (userData) { // get user table data to display in profile
                getMyTrips(userName, function (getMyTripData) { // get my trip data to display in list
                    getSavedTrips(userName, function (getSavedTripData) { // get user saved trips data
                        getFriendsList(userName, function (friends) {
                            getUsersList(userName, function (users) {
                            getRecRequests(userName,function(recReq){
                                res.render('userProfile.ejs', { data: userData, trip: getSavedTripData, myTrip: getMyTripData, friends1: friends, users1: users,recReq1:recReq }); // render the profile page with the corrct data

                            });
                        });
                    });
                });
            });
            });

        }


exports.FriendsFeed=function(req,res){
    var userName = req.session.secret
    getFriendsList(userName, function (friends) {
            for (var i=0;i<friends.length;i++){
                var sqlState = "SELECT tripID FROM like_table WHERE username = ? "
                database.query(sqlState, [tripID], function (err, tripData){
                    var sqlState1 = "SELECT trip_title FROM trips_table WHERE tripID= ? "
                    database.query(sqlState, [tripData[0]], function (err, trip) {
                   console.log(trip);

                        res.render('friendsFeed.ejs', { data: friends, trip: trip });
                    });

                });
            }


    });
}

exports.UsersList = function (req, res) {
    var userName = req.session.secret
            getUserProfile(userName, function (userData) { // get user table data to display in profile
                getMyTrips(userName, function (getMyTripData) { // get my trip data to display in list
                    getSavedTrips(userName, function (getSavedTripData) { // get user saved trips data
                        getFriendsList(userName, function (friends) {
                            getRecRequests(userName,function (recReq){
                            getUsersList(userName, function (users){
                            res.render('userProfile.ejs', { data: userData, trip: getSavedTripData, myTrip: getMyTripData, friends1: friends ,users1:users,recReq1:recReq}); // render the profile page with the corrct data
                        });
                    });
                    });
                });
           });
           });

        }





// called as a block when needed to render loginpage, see above examples

function getUserProfile(userName, callback){

    var sqlUser = "SELECT * FROM user_table WHERE username = ?"
    database.query(sqlUser,[userName], function(err,userData){
        callback(userData);
    });

}

function getFriendsList(userName,callback){
    var sqlFriendsList = "(SELECT friend_one,friend_two, status FROM Event_Traveler.friends_table WHERE friend_one =? AND status=? )UNION(SELECT friend_one,friend_two ,status FROM Event_Traveler.friends_table WHERE friend_two=? AND status=?)"
    var rFriends = [];
    database.query(sqlFriendsList, [userName, "f", userName, "f"], function (err, friends) {
        for (i = 0; i < friends.length; i++) {

            var tempFriend = friends[i].friend_two;
            if (friends.length % 2 == 0) {
                callback(friends);
                break;

            }
            else {
                for (j = i + 1; j < friends.length; j++) {
                    if (friends[i].friend_two == friends[j].friend_one && friends[i].friend_one == friends[j].friend_two) {
                        rFriends.push(friends[i]);
                       // rFriends.push(friends[j]);
                        console.log(rFriends);

                        break;
                    }


                }


            }

        }


        callback(rFriends);

    });
}


function getUsersList( userName,callback) {

    var sqlUsersList = "SELECT * FROM user_table "
    var friends1 = "SELECT * FROM friends_table WHERE friend_one=?"
    var friends2 = "SELECT * FROM friends_table WHERE friend_two=?"
    var test=[];
    database.query(sqlUsersList, [], function (err, users) {
        database.query(friends1, [userName], function (err, friends) {
            database.query(friends2, [userName], function (err, friends2) {
           for (i=0;i<users.length;i++){

           for (k = 0; k < friends2.length; k++) {
                   if (users[i].username == friends2[k].friend_one &&
                       friends2[k].status == "x") {

                       test.push(users[i])

                      }
                        }

        }
            //console.log(users);
            callback(test);
    });


});
    });
}
function getRecRequests(userName, callback) {
    var recReq=[];
    var sqlRecievedList = "SELECT * FROM friends_table WHERE friend_two = ? && status=? "
    database.query(sqlRecievedList, [userName,"r"],function (err,recReq) {
        callback(recReq);
    });
}


function getSavedTrips(userName,callback){
    var sqlSavedTrips = "SELECT trip_title,trip_pic FROM trips_table x JOIN saved_trips_table y ON y.tripID = x.tripID WHERE y.username = ? "
    database.query(sqlSavedTrips,[userName],function(err,savedTripsData){
        callback(savedTripsData);
    });
}

function getMyTrips(userName, callback){
                var sqlMyTrips = "SELECT trip_title,trip_pic FROM trips_table  WHERE username = ? "
                database.query(sqlMyTrips,[userName],function(err,myTripsData){
                    callback(myTripsData);
               });
}

function saveToPhotTable(tripID,photoName,date,callback){

    var sqlMyTrips = "INSERT INTO photo_table VALUES (?,?,?)"
    database.query(sqlMyTrips,[photoName,tripID,date],function(err,noData){
        callback(noData);
   });
}

function saveEventDescription(tripID,description,day,callback){
    var sqlevent = "INSERT INTO event_table (tripID, description,day) VALUES (?,?,?)"
    database.query(sqlevent,[tripID,description,day],function(err,noData){
        callback(noData);
   });

}
function getComments(tripID, callback){
    var sqlevent = "SELECT x.username, x.comment, x.time FROM comment_table x INNER JOIN trips_table y ON x.tripID = y.tripID WHERE x.tripID = ?"
    database.query(sqlevent,[tripID],function(err,commentDetails){
        if (err) throw err
        callback(commentDetails);
   });
}

function getEvents(tripID, callback){
    var sqlevent = "SELECT x.description, x.eventID FROM event_table x INNER JOIN trips_table y ON x.tripID = y.tripID WHERE x.tripID = ? ORDER BY day ASC"
    database.query(sqlevent,[tripID],function(err,commentDetails){
        if (err) throw err
        callback(commentDetails);
   });
}

function getPhotos(tripID, callback) {
    var sqlevent = "SELECT x.photo_name FROM photo_table x INNER JOIN trips_table y ON x.tripID = y.tripID   WHERE x.tripID = ? order by date"
    database.query(sqlevent, [tripID], function (err, tripPhoto) {
        if (err) throw err
        callback(tripPhoto);
    });
}

