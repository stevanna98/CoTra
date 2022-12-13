const moment = require("moment-timezone");

// For more info on reminders API look at
// https://developer.amazon.com/en-US/docs/alexa/smapi/alexa-reminders-api-reference.html

module.exports = {
    createReminder(currentDateTime, timezone, message, how_many, time_measure){
        // time_measure tells the time unit of measure (e.g. 'seconds','minutes','days')
        // how_many     tells the amount of units
        
        // Lets get funny
        // Create the reminder object
        const reminderRequest = {
            requestTime: currentDateTime.format('YYYY-MM-DDTHH:mm:ss'),
            trigger: {
                // here we specify that we are going to indicate the precise moment of time to set the reminder
                type: 'SCHEDULED_ABSOLUTE',
                // here we specify the time
                // lets add to the present moment how_many * time_measure
                scheduledTime: currentDateTime.add(how_many, time_measure).format('YYYY-MM-DDTHH:mm:00.000'),
                // RMK: we are discarding the seconds information
                timeZoneId: timezone
            },
            alertInfo: {
                //here we set the sentence that Alexa will say
                spokenInfo: {
                    content: [{
                        locale: 'en-US',
                        text: message
                    }]
                }
            },
            pushNotification: {
                status: 'ENABLED'
            }
        }
        
        return reminderRequest;
    }
}
