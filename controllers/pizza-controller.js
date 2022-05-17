const { Pizza } = require('../models/Pizza')

const pizzaController = {
    // get all pizzas
    getAllPizza(req, res){
        Pizza.find({})
        .then(dbPizzaData => res.json(dbPizzaData))
        .catch(err => {
            console.log(err)
            res.status(400).json(err)
        })
    },
    // get One pizza by **ID 
    getPizzaById({ params}, res){
        // mongooses find one method
        Pizza.findOne({_id: params.id})
        .then(dbPizzaData => {
            // if no pizza is found, send 404 error
            if(!dbPizzaData){
                res.status(404).json({message: " No Pizza found with this Id"})
                return
            }
            res.json(dbPizzaData)
        })
        .catch(err => {
            console.log(err)
            res.status(400).json(err)
        })
    },
    // creating a mthod for handling POST /api/pizzas
    createPizza({body}, res){
        Pizza.create(body)
        .then(dbPizzaData => res.json(dbPizzaData))
        .catch(err => res.status(400).json(err))
    },

    // update pizza by id
    updatePizza({ params, body}, res){
                                                // instructing mongoose to return the new version of the document
        Pizza.findOneAndUpdate({_id: params.id}, body, {new: true})
        .then(dbPizzaData => {
            if(!dbPizzaData){
                res.status(404).json({message: 'No Pizza found with this ID! '})
                return
            }res.json(dbPizzaData)
        })
        .catch(err => res.status(400).json(err))
    },
    deletePizza({ params}, res){
        Pizza.findOneAndDelete({_id: params.id})
        .then(dbPizzaData => {
            if(!dbPizzaData){
                res.status(404).json({message: "No Pizza found with this id! "})
                return
            }
            res.json(dbPizzaData)
        })
        .catch(err => res.status(400).json(err))
    }
}



module.exports = pizzaController