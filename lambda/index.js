/*
    CoTra Skill
    
    ###Authors : Filippo Castellani, Elisabetta Marini, Orith Halfon, Stefano Vannoni, Giulia Carpani
    ###Last Edit: 13th Dec 2022 by FC and SV
    ##For: [EHealth Methods & Applications]
    ###Scope:

    This module was created to work in the broader context of [Alexa SDK][1]
    In this script the main functions are described by means of the following rule:
    
    
    [1]:https://developer.amazon.com/en-US/alexa/devices/alexa-built-in/development-resources/sdk
    
*/

// Here we import the functions and the libraries necessary for the basic functionalities of Alexa
// --- core functionalities
const Alexa = require('ask-sdk-core');

// --- Storing and loading attributes by means of interceptors
//const util = require('./util.js');
const interceptors = require('./interceptors.js');

// Here we import the file containing all the strings necessary for the interationalization of the skill
const languageStrings = require('./localisation.js');

// Here we import the functions and the library used to build reminders
const logic = require('./logic.js');
const moment = require("moment-timezone");

const AWS = require("aws-sdk");
const ddbAdapter = require('ask-sdk-dynamodb-persistence-adapter');


// Only set to true this flag when debugging
var debugging = true;

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    handle(handlerInput){
        
        // Let's get the sessionAttributes
        let {attributesManager, requestEnvelope} = handlerInput;
        let sessionAttributes = attributesManager.getSessionAttributes();
        let {intent} = requestEnvelope.request;
        
        // Let's initialize the variables for the new training session
        let question_Counter=0;
        let correct_Counter=0;
        let sum = -1;
        let random2= -1;
        let random1= -1;
        let correctflag= false;
        let sentReminderRequestflag= false;
        let new_user= false;
        
        // debugging purposes
        if(debugging){console.log("These are the imported sessionAttributes" + JSON.stringify(sessionAttributes));}
        
        // let's overwrite any possible value contained in our important sessionAttributes
        sessionAttributes["Question_Counter"] = question_Counter;
        sessionAttributes["Correct_Counter"]= correct_Counter;
        sessionAttributes["Sum"] = sum;
        sessionAttributes["Random2"] = random2;
        sessionAttributes["Correctflag"] = correctflag;
        sessionAttributes["sentReminderRequest"] = sentReminderRequestflag;
        sessionAttributes["NewUser"] = new_user;
        
        
        // now, let's set those values permanently
        attributesManager.setSessionAttributes(sessionAttributes);
        
        // debugging purposes
        if(debugging){console.log("These are the sessionAttributes I am setting " + JSON.stringify(sessionAttributes));}
        
        //------------------------------------------------------------------------------------------------------------------------ Once we have performed all the initialization.
        //------------------------------------------------------------------------------------------------------------------------ let's move on onto the user identification phase.
        return CheckUserIntentHandler.handle(handlerInput);
        }
};

const CheckUserIntentHandler = {
    canHandle(handlerInput){
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'CheckUserIntent';
    },
    handle(handlerInput) {  
    //---------------------------------------------------------------------------------------------------------------------------- The Lambda has already extracted the persistent attributes
    //---------------------------------------------------------------------------------------------------------------------------- but now we have to check if a user already exists or not.
    //----------------------------------------------------------------------------------------------------------------------------
    //---------------------------------------------------------------------------------------------------------------------------- The implementation follows this rationale:
    //---------------------------------------------------------------------------------------------------------------------------- By default the User variable is set to CotraName
    //---------------------------------------------------------------------------------------------------------------------------- (which in our implementation is used as "undefined")
    //---------------------------------------------------------------------------------------------------------------------------- (("CotraName" is basically "undefined")).
    let {attributesManager, requestEnvelope} = handlerInput;
    let sessionAttributes = attributesManager.getSessionAttributes();

    
    if(sessionAttributes["User"]==="CotraName") {
        //------------------------------------------------------------------------------------------------------------------------ CASES 1 & 2
    //---------------------------------------------------------------------------------------------------------------------------- 1. This either means that the skill was never used before.
    //---------------------------------------------------------------------------------------------------------------------------- 2. This could mean that a user has requested a new register procedure
    //----------------------------------------------------------------------------------------------------------------------------    (When this happens the User variable has been set once again to "CotraName").
    //----------------------------------------------------------------------------------------------------------------------------    Please have a look at UserResetIntentHandler.
         return handlerInput.responseBuilder
            .addDelegateDirective({
                name: 'RegisterUserIntent',
                confirmationStatus: 'NONE',
                slots: {}
            })
            .getResponse();
    }
    //----------------------------------------------------------------------------------------------------------------------------    For both cases 1 & 2 this IntentHandler will perform intent chaining to 
    //----------------------------------------------------------------------------------------------------------------------------    register the new user.
    else{
        //------------------------------------------------------------------------------------------------------------------------ CASE 3
    //---------------------------------------------------------------------------------------------------------------------------- 3. It could also  that the User variable is set to another value
    //----------------------------------------------------------------------------------------------------------------------------    so in this case the CheckUserIntent just returns a call to 
    //----------------------------------------------------------------------------------------------------------------------------    the MotivationalIntentHandler.
        return MotivationalIntentHandler.handle(handlerInput);
        }
    }
    //----------------------------------------------------------------------------------------------------------------------------    SIDENOTE: In order to perform these checks, a simple function would have been
    //----------------------------------------------------------------------------------------------------------------------------    more than enough but we're considering the possible uses of an utterance
    //----------------------------------------------------------------------------------------------------------------------------    to trigger this intent so we will keep this option open for future developments.
    
};

const MotivationalIntentHandler = {
    canHandle(handlerInput){
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'MotivationalIntent';
    },
    handle(handlerInput){
        //------------------------------------------------------------------------------------------------------------------------ This IntentHandler is meant to behave diffently depending on the last performances
        //------------------------------------------------------------------------------------------------------------------------ of the user during the past session.
        //------------------------------------------------------------------------------------------------------------------------
        //------------------------------------------------------------------------------------------------------------------------ The real purpose behind is to motivate the user to encourage him for the upcoming
        //------------------------------------------------------------------------------------------------------------------------ training and furthermore showing some more "human"-like interaction.
        
        let {attributesManager, requestEnvelope} = handlerInput;
        let sessionAttributes = attributesManager.getSessionAttributes();
        
        let lastscore = sessionAttributes["LastScore"];
        let attention_last = sessionAttributes["Attention"];
        let User = sessionAttributes["User"];
        
        let speakOutput;
        let speakOutput1 = handlerInput.t('WELCOME_BACK_MSG', {user: User});
        
        if ((attention_last == 3) && (lastscore < 3)){
                //----------------------------------------------------------------------------------------------------------------- Option 1. The user has completed the excercise during the last session
                //----------------------------------------------------------------------------------------------------------------- and so this mean that Alexa will challenge the user to do better.
            speakOutput = handlerInput.t('MOTIVATIONAL_MSG1', {punti: lastscore});
        }
        else if ((attention_last == 3) && (lastscore == 3)){
                //----------------------------------------------------------------------------------------------------------------- Option 2. The user has completed the excercise during the last session
                //----------------------------------------------------------------------------------------------------------------- and got the maximum score so Alexa will verbally reward and ask to do the same. 
            speakOutput = handlerInput.t('MOTIVATIONAL_MSG2', {punti: lastscore});
        }
        else if (attention_last < 3){
                //----------------------------------------------------------------------------------------------------------------- Option 3. The user has not completed the excercise during the last session
                //----------------------------------------------------------------------------------------------------------------- so Alexa will try to motivate and the user to get to the end. 
            speakOutput=handlerInput.t('MOTIVATIONAL_MSG3');
        }  
        
        return handlerInput.responseBuilder
         .speak(speakOutput1 + speakOutput)
         .reprompt(speakOutput)
         .getResponse();
    }
};


const RegisterUserIntentHandler = {
    canHandle(handlerInput){
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'RegisterUserIntent';
    },
    handle(handlerInput){
        
        //------------------------------------------------------------------------------------------------------------------------- This IntentHandler simply saves the User value that has been just registered.
        //------------------------------------------------------------------------------------------------------------------------- After that Alexa will explain to the user how to navigate into the skill.
        
        // Let's get the sessionAttributes
        let {attributesManager, requestEnvelope} = handlerInput;
        let sessionAttributes = attributesManager.getSessionAttributes();
        let {intent} = requestEnvelope.request;
        
        // Let's set the new value for User
        let User = Alexa.getSlotValue(requestEnvelope, "User");
        sessionAttributes["User"] = User;
        attributesManager.setSessionAttributes(sessionAttributes);
        
        // Alexa will welcome the user
        let speakOutput = handlerInput.t("WELCOME_MSG", {user: User});
        
        // debugging purposes
        if(debugging){console.log("Im registering: " + User);}
        
        return handlerInput.responseBuilder
         .speak(speakOutput)
         .reprompt(speakOutput)
         .getResponse();
    }
};

const UserResetIntentHandler = {
     canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'UserResetIntent';
    },
    handle(handlerInput){
        
        //------------------------------------------------------------------------------------------------------------------------- Bookmark = CheckUserIntentHandler (CASE 2)
        //------------------------------------------------------------------------------------------------------------------------- This IntentHandler is used to reset to "CotraName" the value of the User attribute.
        //------------------------------------------------------------------------------------------------------------------------- As previously indicated in CheckUserIntentHandler this value means "undefined" user. 
        
        // Let's get the sessionAttributes
        let {attributesManager, requestEnvelope} = handlerInput;
        let sessionAttributes = attributesManager.getSessionAttributes();
        let {intent} = requestEnvelope.request;
        
        // Set the User value to "CotraName"
        let User = "CotraName";
        sessionAttributes["User"] = User;
        
        // Let's force the interceptor to save this value for the future by means of this flag
        sessionAttributes['RequestedSave']= true;
        sessionAttributes["NewUser"] = true;
        
        // Let's set the sessionAttributes
        attributesManager.setSessionAttributes(sessionAttributes);
        
        return CancelAndStopIntentHandler.handle(handlerInput);
    }
};



const SayTwoNumbersIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'SayTwoNumbersIntent';
    },
    handle(handlerInput) {
        let speakOutput;
        let random2;
        let random1;
        let sum;
        let question_Counter;
        let {attributesManager, requestEnvelope} = handlerInput;
        let sessionAttributes = attributesManager.getSessionAttributes();
        let {intent} = requestEnvelope.request;
        question_Counter = sessionAttributes["Question_Counter"];
        let correctflag = sessionAttributes["Correctflag"];
        
        //------------------------------------------------------------------------------------------------------------------------- This IntentHandler can behave in two different ways:
        if (question_Counter ==0) {
        //------------------------------------------------------------------------------------------------------------------------- CASE 1
        //------------------------------------------------------------------------------------------------------------------------- 1. This is the very first time that numbers are presented so two random numbers are generated
        //-------------------------------------------------------------------------------------------------------------------------    and presented to the user
            random1 = Math.floor(Math.random()*10);
            random2 = Math.floor(Math.random()*10);
            sum = random1 + random2;
            sessionAttributes["Random2"] = random2
            sessionAttributes["Sum"] = sum;

            speakOutput = handlerInput.t("EXPL_MSG")
            speakOutput += handlerInput.t("SUM_MSG") + random1 + "+" + random2;
        }
        else {
        //------------------------------------------------------------------------------------------------------------------------- CASE 2
        //------------------------------------------------------------------------------------------------------------------------- 2. This is not the first time and only one number is generated.
        //-------------------------------------------------------------------------------------------------------------------------    The value stored in Random2 is kept for future steps
            random1= sessionAttributes["Random2"]
            random2 = Math.floor(Math.random()*10);
            sum = random1 + random2;
            sessionAttributes["Sum"] = sum;
            if (correctflag) {
                speakOutput= handlerInput.t("CORRECT_MSG");
                
            }
            else {
                speakOutput= handlerInput.t("INCORRECT_MSG");
            }
            speakOutput += handlerInput.t("NEXT_MSG") + random2 ;
            sessionAttributes['Random2'] = random2;
        //-------------------------------------------------------------------------------------------------------------------------    REMARK: In scientific literature: when performing the PASAT, the correctness of the answer is 
        //-------------------------------------------------------------------------------------------------------------------------            usually not referred back to the user.
        //-------------------------------------------------------------------------------------------------------------------------            Despite that, we considered that this form of feed-back interaction might increase the
        //-------------------------------------------------------------------------------------------------------------------------            usability of the application. Furthermore it is very easy to remove such feed-back from
        //-------------------------------------------------------------------------------------------------------------------------            the code in order to be closer to what is done in clinical settings but we decided to 
        //-------------------------------------------------------------------------------------------------------------------------            keep it this way only for demonstrative purposes.
        }
        question_Counter++;
        sessionAttributes["Question_Counter"]= question_Counter;
        attributesManager.setSessionAttributes(sessionAttributes);
        
        return handlerInput.responseBuilder
         .speak(speakOutput)
         .reprompt(handlerInput.t("FALL_MSG"))
         .getResponse();
    }
 };
 

 
 const RegisterANumberIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'RegisterANumberIntent';
    },
    handle(handlerInput) {
        
        //------------------------------------------------------------------------------------------------------------------------- This IntentHandler records the user's answer and compares it with the expected one.
        //------------------------------------------------------------------------------------------------------------------------- Is also responsible of increasing the score value.
        
        // debugging purposes
        if(debugging){console.log("Alexa entered RegisterANumberIntentHandler");}
        
        // Let's get the sessionAttributes
        let {attributesManager, requestEnvelope} = handlerInput;
        let sessionAttributes = attributesManager.getSessionAttributes();
        let {intent} = requestEnvelope.request;
        
        // Let's initialize the flag variable representing the correctness of the user's answer
        let correctflag = false;
        let specialNumber = Alexa.getSlotValue(requestEnvelope, 'SpecialNumber');
        
        // Let's initialize the sum variable that will be compared with the user's answer
        let sum = sessionAttributes["Sum"];
        
        let sentReminderRequestflag = sessionAttributes["sentReminderRequest"];
        
        // here we inherit the counter from previous steps if any
        let correct_Counter = sessionAttributes["Correct_Counter"];
        
        // this is necessary to cope with some often occurring NLP mistakes in classifying the user's utterances
        // if removed might put you in a lot of trouble when trying to debug
        if(isNaN(specialNumber)){
            return FallbackIntentHandler.handle(handlerInput)}
            
        
        // let's check the user's answer
        if(specialNumber == sum){
            correct_Counter ++
            correctflag = true;
        }
            
        else {
            correctflag = false;
        }
        sessionAttributes["Correct_Counter"]= correct_Counter;
        sessionAttributes["Correctflag"]= correctflag;
        
        // Let's set the sessionAttributes
        attributesManager.setSessionAttributes(sessionAttributes);
        
        // debugging purposes
        if(debugging){console.log("Alexa is exiting RegisterANumberIntentHandler");}
        return CheckSumIntentHandler.handle(handlerInput);
    
        
    }  
};

const CheckSumIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'CheckSumIntent';
    },
    handle(handlerInput) {
        
        // debugging purposes
        if(debugging){console.log("Alexa is entering CheckSumIntentHandler");}
        
        let speakOutput;
        
        // Let's get the sessionAttributes
        let {attributesManager, requestEnvelope} = handlerInput;
        let sessionAttributes = attributesManager.getSessionAttributes();
        let question_Counter = sessionAttributes["Question_Counter"];
        let correct_Counter= sessionAttributes["Correct_Counter"];
        
        // Let's force the interceptor to save this value for the future by means of this flag
        sessionAttributes['RequestedSave']= true;
        attributesManager.setSessionAttributes(sessionAttributes);
        
        //------------------------------------------------------------------------------------------------------------------------- This IntentHandler checks whether or not the user has reached the end of the training.
        
        if (question_Counter < 3){
        //------------------------------------------------------------------------------------------------------------------------- CASE 1
        //------------------------------------------------------------------------------------------------------------------------- 1. The training has to keep going on so SayTwoNumbersIntentHandler is returned
            // debugging purposes
            if(debugging){console.log("Alexa is exiting CheckSumIntentHandler");}
            return SayTwoNumbersIntentHandler.handle(handlerInput);
        }
        else if (question_Counter === 3){
        //------------------------------------------------------------------------------------------------------------------------- CASE 2
        //------------------------------------------------------------------------------------------------------------------------- 2. The trainig must end
            let correctflag = sessionAttributes["Correctflag"];
            if (correctflag) {
                        //----------------------------------------------------------------------------------------------------------   Final feed-back is given to the user.
                speakOutput= handlerInput.t("CORRECT_MSG");
            }
            else {
                        //----------------------------------------------------------------------------------------------------------   Final feed-back is given to the user.
                speakOutput= handlerInput.t("INCORRECT_MSG");
            }
                        //----------------------------------------------------------------------------------------------------------   Final feed-back is given to the user.
            speakOutput += handlerInput.t('SCORE_MSG') + correct_Counter +'.';
            
            // here we set the sentence that Alexa will say along with a flag that Alexa has asked the user to set a reminder
            // REMARK this flag will be later on used to check if such reminder has to be set or not
            let speakReminder = handlerInput.t('ASK_REMINDER_MSG');
            
            // flag
            sessionAttributes["sentReminderRequest"]=true;
            
            speakOutput = speakOutput + ' ' + speakReminder;
            
            attributesManager.setSessionAttributes(sessionAttributes);
            
            // debugging purposes
            if(debugging){console.log("Alexa is exiting CheckSumIntentHandler");}
            return handlerInput.responseBuilder
             .speak(speakOutput)
             .reprompt(speakReminder)
             .getResponse();
        }
     }       
    
};

const ReminderCreatorIntentHandler = {
    canHandle(handlerInput) {
        const {attributesManager, requestEnvelope} = handlerInput;
        const sessionAttributes = attributesManager.getSessionAttributes();
        
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.YesIntent'  || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.NoIntent')
            && sessionAttributes["sentReminderRequest"] === true;
    },
    async handle(handlerInput) {
        
        const {attributesManager, requestEnvelope} = handlerInput;
        const sessionAttributes = attributesManager.getSessionAttributes();
        
        if (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.NoIntent'){
            sessionAttributes["sentReminderRequest"] = false;
            attributesManager.setSessionAttributes(sessionAttributes);
            
            return handlerInput.responseBuilder
                .speak(handlerInput.t('WILL_NOT_SET_REMINDER_MSG'))
                .getResponse();
        }
        
        //Create an instance of the reminderServiceClient
        const reminderServiceClient = handlerInput.serviceClientFactory.getReminderManagementServiceClient();
        
        //Check if permissions exist
        const {permissions} = handlerInput.requestEnvelope.context.System.user;
        if (!permissions){
            return handlerInput.responseBuilder
                .speak(handlerInput.t('ASK_PERMISSIONS_MSG'))
                .withAskForPermissionsConsentCard(['alexa::alerts:reminders:skill:readwrite'])
                .getResponse();
        }
        
        // Set timezone and get current date and time.
        // TODO For now we're setting this by hand but this parameter could be inherited from the requestEnvelope 
        const timezone = 'Europe/Rome';
        const currentDateTime = moment().tz(timezone);
        const message = handlerInput.t('REMINDER_MSG');
        
        const reminderRequest = logic.createReminder(currentDateTime, timezone, message,5,'minutes')
        sessionAttributes["sentReminderRequest"] = false;
        attributesManager.setSessionAttributes(sessionAttributes);
        
        // debugging purposes
        console.log(reminderRequest);
        
        //If everything goes well the "Reminder created" message should appear.
        //On the simulator it is not possible since we will always end in case 403.
        let speakOutput = handlerInput.t('REMINDER_CREATED_MSG');
        
        try {
            await reminderServiceClient.createReminder(reminderRequest);
        } catch(error){
            console.log(JSON.stringify(error));
            switch (error.statusCode) {
                case 401: // the user has to enable the permissions for reminders, let's attach a permissions card to the response
                    handlerInput.responseBuilder.withAskForPermissionsConsentCard(['alexa::alerts:reminders:skill:readwrite']);
                    speakOutput = handlerInput.t('MISSING_PERMISSIONS_MSG');
                    break;
                case 403: // devices such as the simulator do not support reminder management
                    speakOutput = handlerInput.t('UNSUPPORTED_DEVICE_MSG');
                    break;
                //case 405: METHOD_NOT_ALLOWED, please contact the Alexa team
                default:
                    speakOutput = handlerInput.t('GENERIC_ERROR_MSG');
                }
            }
            
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .withShouldEndSession(true)
            .getResponse();
    }
};


const HelpIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const {attributesManager, requestEnvelope} = handlerInput;
        const sessionAttributes = attributesManager.getSessionAttributes();
        let question_Counter = sessionAttributes["Question_Counter"];
        let speakOutput;
        if (question_Counter==0) {
            speakOutput= handlerInput.t("INFO_MSG");
            return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
        }
        else {
            return FallbackIntentHandler.handle(handlerInput)
        }
    }
};

const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent'
                || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const {attributesManager, requestEnvelope} = handlerInput;
        const sessionAttributes = attributesManager.getSessionAttributes();
        let new_user = sessionAttributes["NewUser"];
        let speakOutput;
        if (new_user == false){
            speakOutput = handlerInput.t("GOODBYE_MSG");
        }
        else {
            speakOutput= handlerInput.t("NEWUSER_MSG");
        }

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .withShouldEndSession(true)
            .getResponse();
    }
};
/* *
 * FallbackIntent triggers when a customer says something that doesn’t map to any intents in your skill
 * It must also be defined in the language model (if the locale supports it)
 * This handler can be safely added but will be ingnored in locales that do not support it yet 
 * */
const FallbackIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.FallbackIntent';
    },
    handle(handlerInput) {
        const speakOutput = handlerInput.t("FALL_MSG");

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};
/* *
 * SessionEndedRequest notifies that a session was ended. This handler will be triggered when a currently open 
 * session is closed for one of the following reasons: 1) The user says "exit" or "quit". 2) The user does not 
 * respond or says something that does not match an intent defined in your voice model. 3) An error occurs 
 * */
const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        console.log(`~~~~ Session ended: ${JSON.stringify(handlerInput.requestEnvelope)}`);
        // Any cleanup logic goes here.
        return handlerInput.responseBuilder.getResponse(); // notice we send an empty response
    }
};
/* *
 * The intent reflector is used for interaction model testing and debugging.
 * It will simply repeat the intent the user said. You can create custom handlers for your intents 
 * by defining them above, then also adding them to the request handler chain below 
 * */
const IntentReflectorHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest';
    },
    handle(handlerInput) {
        const {attributesManager, requestEnvelope} = handlerInput;
        const sessionAttributes = attributesManager.getSessionAttributes();
        if (sessionAttributes["sentReminderRequest"] == false){
             return FallbackIntentHandler.handle(handlerInput)
        }
        else{
            const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);
            const speakOutput = `You just triggered ${intentName}`;

            return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
        }
    }
};
/**
 * Generic error handling to capture any syntax or routing errors. If you receive an error
 * stating the request handler chain is not found, you have not implemented a handler for
 * the intent being invoked or included it in the skill builder below 
 * */
const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        const speakOutput = 'Sorry, I had trouble doing what you asked. Please try again.';
        console.log(`~~~~ Error handled: ${JSON.stringify(error)}`);

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};




/**
 * This handler acts as the entry point for your skill, routing all request and response
 * payloads to the handlers above. Make sure any new handlers or interceptors you've
 * defined are included below. The order matters - they're processed top to bottom 
 * */
exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        FallbackIntentHandler,
        RegisterUserIntentHandler,
        ReminderCreatorIntentHandler,
        UserResetIntentHandler,
        SayTwoNumbersIntentHandler,
        RegisterANumberIntentHandler,
        CheckSumIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler)
    .addErrorHandlers(
        ErrorHandler)
    .addRequestInterceptors(
        interceptors.LoadAttributesRequestInterceptor,
        interceptors.LoggingRequestInterceptor,
        interceptors.LocalisationRequestInterceptor)
    .addResponseInterceptors(
        interceptors.SaveAttributesResponseInterceptor,
        interceptors.LoggingResponseInterceptor)
    .withPersistenceAdapter(
        new ddbAdapter.DynamoDbPersistenceAdapter({
            tableName: process.env.DYNAMODB_PERSISTENCE_TABLE_NAME,
            createTable: false,
            dynamoDBClient: new AWS.DynamoDB({apiVersion: 'latest', region: process.env.DYNAMODB_PERSISTENCE_REGION})
        })
    )
    .withCustomUserAgent('sample/hello-world/v1.2')
    .withApiClient(new Alexa.DefaultApiClient())
    .lambda();