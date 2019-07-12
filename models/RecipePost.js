'use strict';
const mongoose = require( 'mongoose' );
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

  var recipePostSchema = Schema( {
  userId: ObjectId,
  userName: String,
  post: String,
  name: String,
  ingredient: String,
  createdAt: Date
} );

module.exports = mongoose.model( 'RecipePost', recipePostSchema );
