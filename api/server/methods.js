import { Meteor } from 'meteor/meteor';
import { check, Match } from 'meteor/check';

import { Messages } from '../collections.js';

Meteor.methods({
	
	'sendMessage'(data) {

		check(data, {
			message: String, //the message to send
      name: Match.Optional(String) //if the user already has a name
		});
    
    if (data.message=="") {
      throw new Meteor.Error("message-empty", "Your message is empty");
    }
    
    let userName = (data.name && data.name!="") ? data.name : "Anonymous";
    
    const matchName = data.message.match(/^My name is (.*)/i);
    
    if (matchName && matchName[1]!="") {
      userName = matchName[1];
      Messages.insert({
        name: "Chat Bot",
        message: "Hey everyone, " + userName + " is here!",
        createdAt: new Date(),
        announcement: true
      });
    } else {
      Messages.insert({
        name: userName,
        message: data.message,
        createdAt: new Date()
      });
    }
    
    return {
      name: userName
    };
		
	}
  
});