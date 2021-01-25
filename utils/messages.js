const moment = require('moment')

function messageFormat(username, text) {
    return {
        text,
        username,
        timestamp: moment().format('HH:mm')
    }
}

module.exports = messageFormat 
