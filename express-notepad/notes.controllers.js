/* A simple CRUD controller for notes (which only implements C, R, and U).
 */

NotesController = function() {
    
    var notes = {};
    var count = 1;
    var db;
    
    
    // TODO: A lot of work done here in the constructor.  This 
    // should be in a factory instead maybe.
    this.init = function(initdb, callback) {
        //console.log('in the init');
        db = initdb;
        db.all({ 'include_docs':'true' }, function(err, data) {
            if(err) {
                console.log(err);
            } else {
                //console.log(data);
                for(i=0; i < data.length; i++) {
                    notes[data[i].id] = data[i].doc;
                }
            }
            callback();
        });
    }
    
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
    this.update = function(req, res, callback) {
        var note_id = req.body.note_id || false;
        
        
        var note = {
            title: req.body.note_title,
            content: req.body.note_content
            
        };
        
        db.save(note_id, note, function (err, res) {
            if (err) {
                // Handle error
                console.log(err);
                console.log(res);
            } else {
                // Handle success
                console.log('res --> ');
                console.log(res.id);
                note_id = res.id;
                notes[note_id] = note;
            }
            var retObj = {
                note_id: note_id,
                note: note
            };
            
            callback(retObj);

        });
        
        
    };
};

exports.NotesController = NotesController;
