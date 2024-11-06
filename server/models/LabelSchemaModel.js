const mongoose = require('mongoose');

const labelSchema = new mongoose.Schema({
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Owner',
        required: true,
    },
    type: { // image schema or patient schema
        type: String,
        required
    },
    labelData: [
        {
            labelQuestion: {
                type: String,
                required: true,
            },
            labelType: { // string, int, float, dropdown etc.
                type: String,
                required: true,
            },
            labelOptions: {
                type: [String],
                required: false,
            },
        }
    ] 
    });