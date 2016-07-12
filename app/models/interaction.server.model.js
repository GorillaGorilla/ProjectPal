/**
 * Created by GB115151 on 29/04/2016.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
var InteractionSchema = new Schema({
    created: {
        type: Date,
        default: Date.now
    },
    description: {
        type: String,
        default: '',
        trim: true,
        required: 'Title cannot be blank'
    },
    creator: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    instigator: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    target: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    level: {
        type: Number,
        default: 1
    }
});
mongoose.model('Interaction', InteractionSchema);