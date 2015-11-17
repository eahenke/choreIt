var mongoose = require('mongoose');

var GroupSchema = new mongoose.Schema({
    title: String,
    // user: {mongoose.Schema.Types.ObjectId, ref: 'User'},
    username: String,
    date: {type: Date, default: Date.now},
    chores: [{type: mongoose.Schema.Types.ObjectId, ref: 'Chore'}]
});

mongoose.model('Group', GroupSchema);