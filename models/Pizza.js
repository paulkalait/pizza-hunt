const { Schema, model} = require('mongoose')
const dateFormat = require('../utils/dateFormat')


// Create schema for pizza model 
const PizzaSchema = new Schema(
    {
    PizzaName: {
        type: String
    },
    createdBy: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now,
        // getter
        get: createdAtVal => dateFormat(createdAtVal)
    },
    size: {
        type: String,
        default: 'Large'
    },
    comments: [
        {
            type: Schema.Types.ObjectId,
            // The Comment.js file
            ref: 'Comment'
        }
    ],
    toppings: []
},
// ^ LET THIS SCHEMA KNOW IT CAN USE VIRTUALS PROPERTY
{
    toJSON: {
        virtuals: true,
        // line 17 for reference
        getters: true 
    },
    id: false
}
)

// GET TOTAL COUNRS OF COMMENTS AND REPLIES ON RETRIEVEL 
PizzaSchema.virtual('commentCount').get(function(){
    return this.comments.reduce((total, comment) => total + comment.replies.length + 1, 0)
})

// C reate the pizza model following the pizza schema outlinef
const Pizza = model('Pizza', PizzaSchema)

module.exports =  Pizza ;