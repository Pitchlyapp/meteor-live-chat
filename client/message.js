import { Template } from 'meteor/templating';
import moment from 'moment';
import './message.html';

Template.message.helpers({
  
  timestamp() {
    const sentTime = moment(this.createdAt);
    //if today, just show time, else if some other day, show date and time
    if (sentTime.isSame(new Date(), "day")) {
      return sentTime.format("h:mm a");
    }
    return sentTime.format("M/D/YY h:mm a");
  }
  
});