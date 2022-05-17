const { Schema, model} = require('mongoose')

// Create schema for pizza model 
const PizzaSchema = new Schema({
    PizzaName: {
        type: String
    },
    createdBy: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    size: {
        type: String,
        default: 'Large'
    },
    toppings: []
})

// C reate the pizza model following the pizza schema outline
const Pizza = model('Pizza', PizzaSchema)

module.exports = { Pizza };