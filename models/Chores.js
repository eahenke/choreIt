var mongoose = require('mongoose');

var ChoreSchema = new mongoose.Schema({
    body: String,
    complete: {type: Boolean, default: false},
    group: {type: mongoose.Schema.Types.ObjectId, ref: 'Group'}
})

ChoreSchema.methods.toggleComplete = function(cb) {
    this.complete = !this.complete;
    this.save(cb);
}

//Add an edit method

mongoose.model('Chore', ChoreSchema);