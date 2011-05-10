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
    retr_context = controller.retrieve(req, res);
    index_context = controller.index(req, res);
    res.render('notepad.ejs', combine(retr_context, index_context));
});

app.post('/save_note', function(req, res) {
    context = controller.update(req, res);
    res.redirect('notes?id=' + context.note_id);
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
        console.log(curr_context);
        for (key in curr_context) {
            combined_context[key] = curr_context[key];
        }
    }
    
    console.log(combined_context);
    return combined_context;
}
