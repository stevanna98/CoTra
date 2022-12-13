const Alexa = require('ask-sdk-core');
const i18n = require('i18next');
const languageStrings = require('./localisation.js')
/* 
    This interceptor loads persistent attributes and copies them to session attributes.
    It is performed only at the beginning of a new session for your skill.
*/
const LoadAttributesRequestInterceptor = {
    async process(handlerInput) {
        const {attributesManager, requestEnvelope} = handlerInput;
        const sessionAttributes = attributesManager.getSessionAttributes();
        // the "loaded" check is because the "new" session flag is lost if there's a one shot utterance that hits an intent with auto-delegate
        if (Alexa.isNewSession(requestEnvelope) || !sessionAttributes['loaded']){ //is this a new session? not loaded from db?
            const persistentAttributes = await attributesManager.getPersistentAttributes() || {};
            console.log('Loading from persistent storage: ' + JSON.stringify(persistentAttributes));
            persistentAttributes['loaded'] = true;
            //copy persistent attribute to session attributes
            attributesManager.setSessionAttributes(persistentAttributes); // ALL persistent attributtes are now session attributes
        }
    }
};

/*
   This interceptor saves session attributes as persistent attributes.
   It is performed only at the end of a session for your skill.
*/
//vogliamo salvare solo user, e due punteggi come persistent.

const SaveAttributesResponseInterceptor = {
    async process(handlerInput, response) {
        if (!response) return; // avoid intercepting calls that have no outgoing response due to errors
        
        const {attributesManager, requestEnvelope} = handlerInput;
        const sessionAttributes = attributesManager.getSessionAttributes();
        const shouldEndSession = (typeof response.shouldEndSession === "undefined" ? true : response.shouldEndSession); //is this a session end?
        // the "loaded" check is because the session "new" flag is lost if there's a one shot utterance that hits an intent with auto-delegate
        const loadedThisSession = sessionAttributes['loaded'];
        
        //if we deliberately require a saving
        const requestedSave = sessionAttributes['RequestedSave'];
        
        if (requestedSave||((shouldEndSession || Alexa.getRequestType(requestEnvelope)) === 'SessionEndedRequest') && loadedThisSession) { 
            // skill was stopped or timed out
            // limiting save of session attributes to the ones we want to make persistent
            console.log('Saving to persistent storage: CC = ' + JSON.stringify(sessionAttributes["Correct_Counter"]) 
            + ' and QC = '+ JSON.stringify(sessionAttributes["Question_Counter"])
            + ' and User = ' + JSON.stringify(sessionAttributes["User"]));
            
            sessionAttributes['RequestedSave']= false;
            attributesManager.setSessionAttributes(sessionAttributes);
            
            attributesManager.setPersistentAttributes({
                "User":sessionAttributes["User"],
                "LastScore":sessionAttributes["Correct_Counter"],
                "Attention":sessionAttributes["Question_Counter"]});
            await attributesManager.savePersistentAttributes();
        }
    }
};

// This request interceptor will log all incoming requests to this lambda
const LoggingRequestInterceptor = {
    process(handlerInput) {
        console.log(`Incoming request: ${JSON.stringify(handlerInput.requestEnvelope)}`);
    }
};

// This response interceptor will log all outgoing responses of this lambda
const LoggingResponseInterceptor = {
    process(handlerInput, response) {
        console.log(`Outgoing response: ${JSON.stringify(response)}`);
    }
};

const LocalisationRequestInterceptor = {
    process(handlerInput) {
        const localisationClient = i18n.init({
            lng: Alexa.getLocale(handlerInput.requestEnvelope),
            resources: languageStrings,
            returnObjects: true
        });
        localisationClient.localise = function localise() {
            const args = arguments;
            const value = i18n.t(...args);
            if (Array.isArray(value)) {
                return value[Math.floor(Math.random() * value.length)];
            }
            return value;
        };
        handlerInput.t = function translate(...args) {
            return localisationClient.localise(...args);
        }
    }
};

module.exports = {
    LoadAttributesRequestInterceptor,
    SaveAttributesResponseInterceptor,
    LoggingRequestInterceptor,
    LoggingResponseInterceptor,
    LocalisationRequestInterceptor
}
