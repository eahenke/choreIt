var mongoose = require('mongoose');

var WeekSchema = new mongoose.Schema({
    title: String,
    // user: {mongoose.Schema.Types.ObjectId, ref: 'User'},
    username: String,
    chores: [{type: mongoose.Schema.Types.ObjectId, ref: 'Chore'}]
});

mongoose.model('Week', WeekSchema);