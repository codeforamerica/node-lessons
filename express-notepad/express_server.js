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
var conn = new(cradle.Connection)('mertonium.iriscouch.com');
var express = require('express');
var fbsdk = require('facebook-sdk');
var connect = require('connect');
var Step = require('step');

var app = express.createServer();
var db;
var notes = {};
var count = 1;
var fbid;
var facebook;

// Express app setup
app.use(express.bodyParser());
app.set('view options', {
    layout: false
});

// Load the db data
var dataLoader = function() {
    var db = conn.database('notez');
    db.all({ 'include_docs':'true' }, function(err, data) {
        if(err) {
            console.log(err);
        } else {
            console.log(data);
            for(i=0; i < data.length; i++) {
                notes[data[i].id] = data[i].doc;
            }
        }
        console.log(notes);
    });
};

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
                console.log(arguments);
                console.log('in loggedin');
                console.log('made it');
                
                // Load the user's notes
                db.all({ 'include_docs':'true' }, function(err, data) {
                    if(err) {
                        console.log(err);
                    } else {
                        console.log(data);
                        for(i=0; i < data.length; i++) {
                            notes[data[i].id] = data[i].doc;
                        }
                    }

                    // Direct to the notes page
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


/*
db.exists(function(req, res) { 
    if(!res) { 
        db.create(function(){}); 
    }
});
*/

//console.log(fakeNotes);

app.get('/notes', function(req, res) {
    var note_id = req.query.id || '';
    var fbid = req.query.fbid || '';
    console.log('fbid = '+fbid);
    if (note_id) {
        note = notes[note_id];
    } else {
        note = {title: '', content: ''};
    }
    
    res.render('notepad.ejs', {note: note, notes: notes, note_id: note_id});
});

app.post('/save_note', function(req, res) {
    note_id = req.body.note_id || count++;
    var note = {
        title: req.body.note_title,
        content: req.body.note_content
    };
    notes[note_id] = note;
    
    db.save(note_id.toString(), note, function (err, res) {
        if (err) {
            // Handle error
            console.log(err);
            console.log(res);
        } else {
            // Handle success
            console.log(res);
        }
    });
    
    res.redirect('notes?id=' + note_id);
});

app.listen(3000);
console.log('Server running at http://localhost:3000/');
