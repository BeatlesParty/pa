'use strict';
const Comment = require( '../models/Comment' );

exports.saveComment = ( req, res ) => {
  //console.log("in saveComment!")
  //console.dir(req)
  let newComment = new Comment(
    {
    url: req.body.url,
    comments: req.body.comments
    }
  )

  //console.log("skill = "+newSkill)

  newComment.save()
    .then( () => {
      res.redirect( '/showComments' );
    } )
    .catch( error => {
      res.send( error );
    } );
};

exports.getAllComments = ( req, res ) => {
  //gconsle.log('in getAllSkills')
  Comment.find()
    .exec()
    .then( ( comments ) => {
      res.render( 'comments', {
        comments: comments, title:"Comments"
      } );
    } )
    .catch( ( error ) => {
      console.log( error.message );
      return [];
    } )
    .then( () => {
      //console.log( 'skill promise complete' );
    } );
};
