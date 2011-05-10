/* A simple notepad app build on the Express framework for NodeJS.  You can
 * write, save, and retrieve notes.
 * 
 * Requirments:
 *   npm install express
 *   npm install ejs
 *
 * To run:
 *   node express_server.js
 */
var express = require('express');
var app = express.createServer();

var cradle = require('cradle');
var db = new(cradle.Connection)('mertonium.iriscouch.com').database('notez');

var controllers = require('./notes.controllers.js');
var controller = new controllers.NotesController(db)

app.use(express.bodyParser());
app.set('view options', {
    layout: false
});

app.get('/notes', function(req, res) {
    context = controller.retrieve(req, res);
    res.render('notepad.ejs', context);
});

app.post('/save_note', function(req, res) {
    context = controller.update(req, res);
    res.redirect('notes?id=' + context.note_id);
});

app.listen(3000);
console.log('Server running at http://localhost:3000/');
