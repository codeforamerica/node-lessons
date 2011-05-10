/* A simple CRUD controller for notes (which only implements C, R, and U).
 */

NotesController = function(db) {
    
    var notes = {};
    var count = 1;
    
    // TODO: A lot of work done here in the constructor.  This 
    // should be in a factory instead maybe.
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
    
    /* List all of the known notes.
     *
     * @return The context for the set of notes.
     */
    this.index = function(req, res) {
        return {
            notes: notes
        };
    };
    
    /* Retrieve a given note. Gives an empty note if no id is provided.
     *
     * @return The context for the individual note.
     */
    this.retrieve = function(req, res) {
        var note_id = req.query.id || '';
        
        if (note_id) {
            note = notes[note_id];
        } else {
            note = {title: '', content: ''};
        }
        
        return {
            note: note, 
            note_id: note_id
        };
    };
    
    /* Update a given note. Creates a note with an auto-incremented id if no id
     * is provided.
     *
     * @return The context for the created note.
     */
    this.update = function(req, res) {
        var note_id = req.body.note_id || count++;
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
        
        return {
            note_id: note_id,
            note: note
        };
    };
};

exports.NotesController = NotesController;
