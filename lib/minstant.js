Chats = new Mongo.Collection("chats");

Meteor.methods({
  'newChat': function(otherUserId){
    chatId = Chats.insert({user1Id:Meteor.userId(), user2Id:otherUserId});
  },

  'updateChat': function(chatId, chat){
    Chats.update(chatId, chat);
  },

  'addUser': function(email, username, password, avatar){
    Meteor.users.insert({profile:{username:username, avatar:avatar}, emails:[{address:email}],services:{ password:{"bcrypt" : "$2a$10$I3erQ084OiyILTv8ybtQ4ON6wusgPbMZ6.P33zzSDei.BbDL.Q4EO"}}});
    Meteor.loginWithPassword(username, password, function(err, res){
      if (err){
        console.log(err)
      } else {
        Router.go('/lobby');
      }
    });
  }
})