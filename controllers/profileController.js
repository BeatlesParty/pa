'use strict';
const User = require( '../models/User' );
const axios = require('axios');
var apikey = require('../config/apikey');
console.dir(apikey)


exports.update = ( req, res ) => {

  User.findOne(res.locals.user._id)
  .exec()
  .then((p) => {
    console.log("just found a profile")
    console.dir(p)
    p.userName = req.body.userName
    p.profilePicURL = req.body.profilePicURL
    p.zipcode = req.body.zipcode

    // make a call to zicode server to look up the city and state
    // and store them in the profile ....
    const apikey= "gjY3xWAsjuDuvulkybx5HP7Q4UJ3sSYCPONsEfR6eh8fNYznov7Isht2Gy1no96s"
    axios.get("https://www.zipcodeapi.com/rest/"+apikey+"/info.json/"+p.zipcode+"/degrees")
      .then(function (response) {
        // handle success
        console.log(response);
        console.dir(response);
        p.city = response.data.city
        p.state = response.data.state
        p.lastUpdate = new Date()
        p.save()
        .then(() => {
          res.redirect( '/profile' );
        })

      })
      .catch(function (error) {
        // handle error
        console.log(error);
      })
      .finally(function () {
        // always executed
      });
  })
};

exports.getAllProfiles = ( req, res ) => {
  //gconsle.log('in getAllSkills')
  User.find()
    .exec()
    .then( ( profiles ) => {
      res.render( 'profiles', {
        profiles:profiles, title:"Profiles"
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

// this displays all of the skills
exports.getOneProfile = ( req, res ) => {
  //gconsle.log('in getAllSkills')
  const id = req.params.id
  console.log('the id is '+id)
  User.findOne({_id:id})
    .exec()
    .then( ( profile ) => {
      res.render( 'showProfile', {
        profile:profile, title:"Profile"
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

exports.deleteForumPost = (req, res) => {
  console.log("in deleteForumPost")
  let deleteId = req.body.delete
  if (typeof(deleteId)=='string') {
      // you are deleting just one thing ...
      ForumPost.deleteOne({_id:deleteId})
           .exec()
           .then(()=>{res.redirect('/forum')})
           .catch((error)=>{res.send(error)})
  } else if (typeof(deleteId)=='object'){
      ForumPost.deleteMany({_id:{$in:deleteId}})
           .exec()
           .then(()=>{res.redirect('/forum')})
           .catch((error)=>{res.send(error)})
  } else if (typeof(deleteId)=='undefined'){
      //console.log("This is if they didn't select a skill")
      res.redirect('/forum')
  } else {
    //console.log("This shouldn't happen!")
    res.send(`unknown deleteId: ${deleteId} Contact the Developer!!!`)
  }

};
