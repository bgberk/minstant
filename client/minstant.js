Meteor.subscribe('userList');
Meteor.subscribe('activeChats');

///
// helper functions 
/// 
Template.available_user_list.helpers({
	users:function(){
	  return Meteor.users.find({}, {sort: {username: 1}});
	},

	loggedIn:function(){
	return Meteor.users.find({'services.resume.loginTokens.hashedToken': {$exists: true}}).count();
	}
})

Template.available_user.helpers({
	getUsername:function(userId){
	  user = Meteor.users.findOne({_id:userId});
	  return user.profile.username;
	}, 

	isMyUser:function(userId){
	  if (userId == Meteor.userId()){
	    return true;
	  }
	  else {
	    return false;
	  }
	}
}) //end of available user helpers


Template.chat_page.helpers({
	messages:function(){
	  var chat = Chats.findOne({_id:Session.get("chatId")});
	  return chat.messages;
		}
})

Template.chat_message.helpers({
	other_user:function(sentBy){
	  var currentUser = Meteor.users.findOne({_id: Meteor.userId()});
	  var currentUsername = currentUser.profile.username;
	  if (currentUsername == sentBy) {
	    return true;
	  } else {
	    return false;
	  }
	} 
})

Template.chat_page.events({
	// this event fires when the user sends a message on the chat page
	'submit .js-send-chat':function(event){
	// stop the form from triggering a page reload
	event.preventDefault();
	// see if we can find a chat object in the database
	// to which we'll add the message
	var chat = Chats.findOne({_id:Session.get("chatId")});
	if (chat){// ok - we have a chat to use
	  var msgs = chat.messages; // pull the messages property
	  if (!msgs){// no messages yet, create a new array
	    msgs = [];
	  }
	  // is a good idea to insert data straight from the form
	  // (i.e. the user) into the database?? certainly not. 
	  // push adds the message to the end of the array
	  msgs.push({sentBy: Meteor.user().profile.username, avatar:Meteor.user().profile.avatar, text: event.target.chat.value});
	  // reset the form
	  event.target.chat.value = "";
	  // put the messages array onto the chat object
	  chat.messages = msgs;
	  // update the chat object in the database.
	  var chatId = chat._id;
	  Meteor.call('updateChat', chatId, chat);
	  //Chats.update(chat._id, chat);
		}
	}
});
