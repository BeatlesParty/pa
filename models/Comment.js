'use strict';
const mongoose = require( 'mongoose' );
const Schema = mongoose.Schema;

var commentSchema = Schema( {
  url: String,
  comments: String
} );

module.exports = mongoose.model( 'Comment', commentSchema );
