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

app.use(express.bodyParser());
app.set('view options', {
    layout: false
})

var notes = {};
var count = 1;

app.get('/notes', function(req, res) {
    var note_id = req.query.id || '';
    
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
    
    res.redirect('notes?id=' + note_id);
});

app.listen(3000);
console.log('Server running at http://localhost:3000/');
