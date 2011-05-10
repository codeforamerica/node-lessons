var cradle = require('cradle');
var db = new(cradle.Connection)('mertonium.iriscouch.com').database('notez');
var express = require('express');
var app = express.createServer();

var notes = {};
var count = 1;

app.use(express.bodyParser());
app.set('view options', {
    layout: false
})

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
//console.log(fakeNotes);

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
