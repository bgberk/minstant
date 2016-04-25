// set up the main template the the router will use to build pages
Router.configure({
  layoutTemplate: 'ApplicationLayout'
});
// specify the top level route, the page users see when they arrive at the site
Router.route('/lobby', function () {
  this.render("navbar", {to:"header"});
  this.render("lobby_page", {to:"main"});  
});

Router.route('/', function () {
  this.render("navbar", {to:"header"});
  this.render("entry", {to: "main"});
});

/*var mustBeSignedIn = function() {
  if (!(Meteor.user() || Meteor.loggingIn())) {
    Router.go('/')
  } else {
    this.next();
  }
};

var goToLobby = function() {
  if (Meteor.user()) {
    Router.go('/lobby');
  } else {
    this.next();
  }
};

Router.onBeforeAction(mustBeSignedIn, {except: ['/']});
Router.onBeforeAction(goToLobby, {only: ['/']})
*/

Router.onBeforeAction(function () {
// all properties available in the route function
// are also available here such as this.params
if (!Meteor.userId()) {
  // if the user is not logged in, render the login template
  this.render("navbar", {to:"header"});
  this.render("entry", {to: "main"});
} else {
  // otherwise don't hold up the rest of hooks or our route/action function
  // from running
  this.next();
}
});

// specify a route that allows the current user to chat to another users
Router.route('/chat/:_id', function () {
  // the user they want to chat to has id equal to 
  // the id sent in after /chat/... 
  var otherUserId = this.params._id;
  // find a chat that has two users that match current user id
  // and the requested user id
  var filter = {$or:[
              {user1Id:Meteor.userId(), user2Id:otherUserId}, 
              {user2Id:Meteor.userId(), user1Id:otherUserId}
              ]};
  var chat = Chats.findOne(filter);
  if (!chat){// no chat matching the filter - need to insert a new one
    Meteor.call('newChat', otherUserId);
    //chatId = Chats.insert({user1Id:Meteor.userId(), user2Id:otherUserId});
  }
  else {// there is a chat going already - use that. 
    chatId = chat._id;
  }
  if (chatId){// looking good, save the id to the session
    Session.set("chatId",chatId);
  }
  this.render("navbar", {to:"header"});
  this.render("chat_page", {to:"main"});  
});