const dbConnection = require("../config/mongoConnection");
const data = require("../data/");
const users = data.users;
const polls = data.polls;
const votesAndMetrics =data.votesAndMetrics;
const bcrypt = require('bcryptjs');
//   THIS FILE IS JUST USED TO TEST THE VARIOUS DATA FUNCTIONS

//     return votesAndMetrics.countVote("d7795d57-4316-4d81-b166-c6804e13c960", 0,0,0,1 ,"7d643ba0-90cf-4be2-a8fe-f9fc9c02e553","M").then(() => {
//      return votesAndMetrics.countVote("9ab8f178-0287-408f-9b4a-baa4e959fdbf", 1,0,0,0 ,"7d643ba0-90cf-4be2-a8fe-f9fc9c02e553","M").then(() => {
//  });
//  });


// }, (error) => {
//     console.error(error);
// });
//});
// let poll1={}
//   return polls.updatePoll("74bd807d-8294-4325-b195-fa657dad41bb",poll1 )

  // return users.checkLogin("graffixnyc@gmail.com",bcrypt.hashSync("testingfornow") ).then((user) => {

  //       console.log(user.firstName);
  // });


  // return polls.getPollById("9d26c80a-c359-44f6-9d54-244b6b956a25" ).then((poll) => {

  //       console.log(poll.question);
  // });

 return users.updateUser("7d643ba0-90cf-4be2-a8fe-f9fc9c02e553","F").then(() => {

        //console.log(poll.question);
   });
//  return polls.searchPollsByKeyword("phone").then((polls) => {
//        if (!polls){

//        }else{
//         console.log(polls.length);
//        }
//   });

//  return polls.getPollsByCategory("Technology").then((polls) => {
//        if (!polls){

//        }else{
//         console.log(polls.length);
//        }
//   });
// b7f8fc28-9b41-4c4c-ab63-8a62214c58a5:74bd807d-8294-4325-b195-fa657dad41bb
// b7f8fc28-9b41-4c4c-ab63-8a62214c58a5:f350d60d-e065-4bb1-b173-af4903fff63a
// b7f8fc28-9b41-4c4c-ab63-8a62214c58a5:e4281c72-1a83-4a60-b8db-a5fa45efe9dc
