var mongoose = require('mongoose');
const log = require('simple-node-logger').createSimpleLogger('project.log');

module.exports = class DB{
    constructor(username, password){
        console.log("Connecting to DB with username and password "+username+ " "+password);
    }
}