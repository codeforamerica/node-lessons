/* A simple notepad app build on the Express framework for NodeJS.  You can
 * write, save, and retrieve notes.
 * 
 * Requirments:
 *   npm install express
 *   npm install ejs
 *   npm install cradle
 *
 * To run:
 *   node express_server.js
 */
var cradle = require('cradle');
var conn = new(cradle.Connection)('127.0.0.1','5984', {
    auth: { username: 'admin', password: 'admin' }});
var express = require('express');
var fbsdk = require('facebook-sdk');
var connect = require('connect');
var Step = require('step');

var app = express.createServer();
var db;
//var notes = {};
var count = 1;
var fbid;
var facebook;

var controllers = require('./notes.controllers.js');
var controller = new controllers.NotesController();

// Express app setup
app.use(express.bodyParser());
app.set('view options', {
    layout: false
});


// Setup the hompage to be the login screen
/*
app
*/

app.get('/', function(req, res) {
    // Begin Callback soup
    console.log('in fbsetup');
    // Do the facebook stuff
    facebook = new fbsdk.Facebook({
        appId: '144849692255128',
        secret:'cb633c55662fb7666e4653be3c09387d',
        request: req,
        response:res
    });
    
    
    console.log('in checkDb');
    // Are they logged in?
    if(facebook.getSession()) {
        console.log('already logged in');
        facebook.api('/me', function(me) {
            // Set the db (create if needed)
            fbid = me.id;
            console.log('fbid #1 = '+fbid);
            db = conn.database('notez-'+fbid);
            console.log('look at me');
            console.log('in setupDb');
            db.create(function(err) {
                console.log('in loggedin');
                console.log(err);
                
                console.log('made it');
                
                // Load the user's notes
                controller.init(db, function() { 
                    console.log('time to redirect');
                    res.redirect('notes?fbid='+fbid); 
                });
                
            });
        });
    } else {
        //  If the user is not logged in, just show them the login button.
        res.end('<a href="' + facebook.getLoginUrl() + '">Login</a>');
        console.log('click the link');
    }
});

app.get('/notes', function(req, res) {
    retr_context = controller.retrieve(req, res);
    index_context = controller.index(req, res);
    res.render('notepad.ejs', combine(retr_context, index_context));
});

app.post('/save_note', function(req, res) {
    controller.update(req, res, function(context) { 
        res.redirect('notes?id=' + context.note_id); 
    });
});

app.listen(3000);
console.log('Server running at http://localhost:3000/');


/* This is a simple combine method.  I don't know what pitfalls there are here
 * yet, I just want something that works.
 */
combine = function(first, other) {
    var combined_context = {},
        contexts = [first, other],
        context_index,
        curr_context,
        key;
    
    for (context_index in contexts) {
        curr_context = contexts[context_index];
        //console.log(curr_context);
        for (key in curr_context) {
            combined_context[key] = curr_context[key];
        }
    }
    
    //console.log(combined_context);
    return combined_context;
}
