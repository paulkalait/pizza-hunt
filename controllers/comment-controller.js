const { Pizza, Comment } = require("../models");

// METHODS BELLOW

const commentController = {
  // add comment to pizza
  addComment({ params, body }, res) {
    console.log(body);
    Comment.create(body).then(({ _id }) => {
      return Pizza.findOneAndUpdate(
        {
          _id: params.pizzaId,
        },
        {
          // pushing the comments id to the specific pizza we want to update
          $push: { comments: _id },
        },
        {
          new: true,
        }
      )
        .then((dbPizzaData) => {
          if (!dbPizzaData) {
            res.status(404).json({ message: "No Pizza found with this ID" });
            return;
          }
          res.json(dbPizzaData);
        })
        .catch((err) => res.json(err));
    });
  },

  addReply({params, body}, res){
    // *updating the comment document
    Comment.findOneAndUpdate({
      _id: params.commentId
    },
    {
      $push: { replies: body}
    },
    {
      new: true
    })
    .then(dbPizzaData => {
      if(!dbPizzaData){
        res.status(404).json({message: 'No Pizza found with this Id'})
      }
      res.json(dbPizzaData)
    })
    .catch( err => res.json(err))
  },

  removeReply({ params}, req){
    Comment.findByOneAndUpdate({
      _id: params.commentId
    },
    {
      // where the replies matches the value of params.replyId
      $pull: { replies: { replyId: params.replyId}}
    },
    {
      new: true
    })
    .then(dbPizzaData => {
      res.json(dbPizzaData)
    })
    .catch( err => res.json(err))
  },



  // remove comment()
  removeComment({ params }, res) {
    Comment.findOneAndDelete({ _id: params.commentId })
      .then((deletedComment) => {
        if (!deletedComment) {
          return res
            .status(404)
            .json({ message: "no comment found with this id!" });
        }
        return Pizza.findOneAndUpdate(
          {
            _id: params.pizzaId,
          },
          {
            $pull: { comments: params.commentId },
          },
          {
            new: true,
          }
        );
      })
      .then((dbPizzaData) => {
        if (!dbPizzaData) {
          res.status.json({ message: "No Pizza found with this id" });
          return;
        }
        res.json(dbPizzaData);
      })
      .catch((err) => res.json(err));
  },


 
};

module.exports = commentController;
