import { Template } from 'meteor/templating';
import { Cookies } from 'meteor/mrt:cookies';
import { Messages } from '../api/collections.js';
import './main.html';
import './message.js';
import './loader.html';

Template.body.onCreated(function bodyOnCreated() {
  
  this.messagesSub = this.subscribe("messages"); //get messages
  
});

Template.body.onRendered(function bodyOnRendered() {
  
  const $messagesScroll = this.$('.messages-scroll');
  
  //this is used to auto-scroll to new messages whenever they come in
  
  let initialized = false;
  
  this.autorun(() => {
    if (this.messagesSub.ready()) {
      Messages.find({}, { fields: { _id: 1 } }).fetch();
      Tracker.afterFlush(() => {
        //only auto-scroll if near the bottom already
        if (!initialized || Math.abs($messagesScroll[0].scrollHeight - $messagesScroll.scrollTop() - $messagesScroll.outerHeight()) < 200) {
          initialized = true;
          $messagesScroll.stop().animate({
            scrollTop: $messagesScroll[0].scrollHeight
          });
        }
      });
    }
  });
  
});

Template.body.helpers({
  
  messages() {
    return Messages.find({}, { sort: { createdAt: 1 } }); //most recent at the bottom
  },
  
  hideHint() {
    return (Cookie.get("hideHint")=="true"); //convert from string to boolean
  }
  
});

Template.body.events({
  
  //send message
  
  'submit form'(event, instance) {
    
    event.preventDefault();
    
    const $el = $(event.currentTarget);
    const $input = $el.find('.message-input');
    
    const data = { message: $input.val() };
    const userName = Cookie.get("name");
    
    if (userName) {
      data.name = userName;
    }
    
    Meteor.call("sendMessage", data, (error, response) => {
      if (error) {
        alert(error.reason);
      } else {
        Cookie.set("name", response.name);
        $input.val("");
      }
    });
    
  },
  
  //hide hint in the top right corner
  
  'click .hide-hint-button'(event, instance) {
    
    //cookies only understand strings
    Cookie.set("hideHint", (Cookie.get("hideHint")=="true") ? "false" : "true");
    
  }
  
});