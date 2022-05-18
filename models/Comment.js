const { Schema, model, Types } = require("mongoose");
const dateFormat = require("../utils/dateFormat");

const ReplySchema = new Schema(
  {
    // set custom id to avoid confusion with parent comment_id
    replyId: {
      type: Schema.Types.ObjectId,
      default: () => new Types.ObjectId
    },
    replyBody: {
      type: String,
    },
    writtenBy: {
      type: String,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      get: (createdAtVal) => dateFormat(createdAtVal),
    },
  },
  // ^ LET THIS SCHEMA KNOW IT CAN USE VIRTUALS PROPERTY
  {
    // ^ LET THIS SCHEMA KNOW IT CAN USE VIRTUALS /Getters PROPERTY
    toJSON: {
      getters: true,
    },
  }
);

const CommentSchema = new Schema(
  {
    writtenBy: {
      type: String,
    },
    commentBody: {
      type: String,
    },
    CreatedAt: {
      type: Date,
      default: Date.now,
      get: (createdAtVal) => dateFormat(createdAtVal),
    },
    replies: [ReplySchema],
  },
  {
    // ^ LET THIS SCHEMA KNOW IT CAN USE VIRTUALS /Getters PROPERTY
    toJSON: {
        virtuals: true,
      getters: true,
    },
    id: false
  }
);

const Comment = model("Comment", CommentSchema);

CommentSchema.virtual('replyCount').get(function(){
    return this.replies.length
})

module.exports = Comment;
