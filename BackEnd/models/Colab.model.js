const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ColabSchema = new Schema({
    sessionId: {
        type: String,
        required: true
    },
    Contributor: [
        {
            type: String
        }
    ],
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
});

const Colab = mongoose.model('Colab', ColabSchema);

module.exports = Colab;