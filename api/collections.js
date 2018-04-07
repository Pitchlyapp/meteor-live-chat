import { Mongo } from 'meteor/mongo';

//declare the Mongo collections to use

export const Messages = new Mongo.Collection('messages');