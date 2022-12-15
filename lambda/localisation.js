module.exports = {
    en: {
        translation: {
            WELCOME_MSG: `<amazon:emotion name='excited' intensity='medium'>Welcome to CoTra {{user}}! This is our first time together and I can't wait to begin! We are going to be great friends. </amazon:emotion> Just say "help" and I will give you an explanation of our training.`, 
            WELCOME_BACK_MSG: `Welcome back {{user}}, <amazon:emotion name='excited' intensity='low'> it\'s time for your training! </amazon:emotion> Please, feel free to tell me if you are a new user! `,
            EXPL_MSG:  `I am going to give you two numbers and I will ask you the sum of them. Be aware to remember at each step the last number I give you. <amazon:emotion name='excited' intensity='medium'> Let\'s start. </amazon:emotion>`,
            SUM_MSG: `Which is the the sum of `,
            CORRECT_MSG: `<amazon:emotion name='excited' intensity='high'> Correct! </amazon:emotion>`,
            INCORRECT_MSG: `<amazon:emotion name='disappointed' intensity='low'> Incorrect. </amazon:emotion>`,
            INFO_MSG:`Here it is the explanation for the cognitive training : it must be performed 20 times. I am going to give you two numbers and you will have to make the sum of them and remember the last number I said. In the following step, I will tell you a new number. Make the sum of the new number and the one you memorized from the previous step. At the end of the training, you will get your final session score. If you want to listen the tutorial again, say "help". Otherwise, when you are ready, say "Numbers". <amazon:emotion name='excited' intensity='medium'> Good luck! </amazon:emotion>`,
            NEXT_MSG: `Your next number is `,
            SCORE_MSG: `Your score is `,
            FALL_MSG: `sorry, I don\'t know about that. Please try again.`,
            NONUMBER_MSG: `You did not say a number. <amazon:emotion name='excited' intensity='medium'>Try again!</amazon:emotion> `,
            ASK_REMINDER_MSG: `Would you like to setup a reminder to do another training in five minutes?`,
            MOTIVATIONAL_MSG1: `<amazon:emotion name='excited' intensity='medium'>Last time we scored {{punti}} points, let's try to do better today! Say "numbers" if you are ready or else ask for help for an explanation. </amazon:emotion>`,
            MOTIVATIONAL_MSG2:`<amazon:emotion name='excited' intensity='medium'>Last time we scored {{punti}} points, keep doing like this! Say "numbers" if you are ready or else ask for help for an explanation. </amazon:emotion>`,
            MOTIVATIONAL_MSG3: `<amazon:emotion name='excited' intensity='medium'>Last time we haven't completed our training. I hope we can do better today! Let's start! Say "numbers" if you are ready or else ask for help for an explanation. </amazon:emotion>`,
            WILL_NOT_SET_REMINDER_MSG: `I will not set a reminder for your training. Goodbye.`,
            ASK_PERMISSIONS_MSG: `I need permissions to create reminders! Please go to the app and give those permissions.`,
            REMINDER_MSG: `Hey, it's time for your training!`,
            REMINDER_CREATED_MSG: `Reminder created! See you soon.`,
            MISSING_PERMISSIONS_MSG: `Missing permissions.`,
            UNSUPPORTED_DEVICE_MSG: `Unsupported device.`,
            GENERIC_ERROR_MSG: `Generic error.`,
            NEWUSER_MSG:`<amazon:emotion name='excited' intensity='low'> Ok! I'm always pleased to meet someone new. In order to register a new user I have to restart, please call me again in a couple of seconds.</amazon:emotion>`,
            GOODBYE_MSG:"Goodbye!"
            }
    },
    it: {
        translation: {
            WELCOME_MSG:`<amazon:emotion name='excited' intensity='medium'>Benvenuto/a a CoTra {{user}}! É la nostra prima volta insieme e non vedo l'ora di iniziare! Diventeremo ottimi amici. </amazon:emotion> Ti basta chiedere "aiuto" e ti darò una spiegazione dell'allenamento che porteremo avanti insieme.`,
            WELCOME_BACK_MSG: `Bentornato {{user}}! <amazon:emotion name='excited' intensity='low'> É arrivata l\'ora dell\'allenamento! </amazon:emotion> Dimmi pure se sei un nuovo utente! `,
            EXPL_MSG: `Ora ti dirò due numeri e te ne chiederò la somma. Attenzione: Ricordati l'ultimo numero che ti ho detto ogni volta. <amazon:emotion name='excited' intensity='medium'> Iniziamo! </amazon:emotion>`,
            SUM_MSG: ` Qual è la somma di `,
            CORRECT_MSG:`<amazon:emotion name='excited' intensity='high'> Corretto! </amazon:emotion>`,
            INCORRECT_MSG: `<amazon:emotion name='disappointed' intensity='low'> Sbagliato. </amazon:emotion>`,
            INFO_MSG: `Questa è la spiegazione del training cognitivo: dovrà essere ripetuto 20 volte. Ti dirò due numeri e dovrai sommarli. Attenzione! Ricordati l'ultimo numero che ti ho detto. Allo step successivo ti dirò un nuovo numero. Dovrai fare la somma con il numero memorizzato allo step precedente. Alla fine del training, riceverai il tuo punteggio di oggi. Se vuoi riascoltare la spiegazione, di "aiuto" di nuovo. Altrimenti per iniziare, di 'Numeri'. <amazon:emotion name='excited' intensity='medium'> Buona fortuna! </amazon:emotion>`,
            NEXT_MSG: `Il tuo prossimo numero è `,
            SCORE_MSG: `Il tuo punteggio è `,
            ASK_REMINDER_MSG: `Vuoi un promemoria per ricordarti di fare un nuovo training fra cinque minuti?`,
            FALL_MSG: `Scusa, non ho capito. Per favore prova di nuovo`,
            NONUMBER_MSG: `Non hai detto un numero.<amazon:emotion name='excited' intensity='medium'> Riprova! </amazon:emotion>`,
            MOTIVATIONAL_MSG1: `<amazon:emotion name='excited' intensity='medium'>La scorsa volta abbiamo totalizzato {{punti}} punti, proviamo a fare meglio oggi! Pronuncia "numeri" se sei pronto o chiedi "aiuto" se hai bisogno di una spiegazione. </amazon:emotion>`,
            MOTIVATIONAL_MSG2:`<amazon:emotion name='excited' intensity='medium'>La scorsa volta abbiamo totalizzato {{punti}} punti, continuiamo così anche oggi! Pronuncia "numeri" se sei pronto o chiedi "aiuto" se hai bisogno di una spiegazione. </amazon:emotion>`,
            MOTIVATIONAL_MSG3: `<amazon:emotion name='excited' intensity='medium'>La scorsa volta non abbiamo completato l'esercizio. Spero che oggi andrà meglio! Iniziamo! Pronuncia "numeri" se sei pronto o chiedi "aiuto" se hai bisogno di una spiegazione. </amazon:emotion>`,
            WILL_NOT_SET_REMINDER_MSG: `Non imposterò un reminder per il tuo allenamento. Arrivederci`,
            ASK_PERMISSIONS_MSG: `Ho bisogno di permessi per creare i promemoria! Per favore vai nell'app per darmi i permessi.`,
            REMINDER_MSG: `Hey, è ora per il tuo allenamento! Arrivederci.`,
            REMINDER_CREATED_MSG: `Promemoria creato! A presto.`,
            MISSING_PERMISSIONS_MSG: `Permessi mancanti.`,
            UNSUPPORTED_DEVICE_MSG: `Dispositivo non supportato.`,
            GENERIC_ERROR_MSG: `Errore generico.`,
            NEWUSER_MSG:`<amazon:emotion name='excited' intensity='low'>Ok! Mi fa sempre piacere conoscere qualcuno di nuovo. Tuttavia per registrare un nuovo utente ho bisogno di riavviarmi, perfavore riattivami tra un paio di secondi.</amazon:emotion>`,
            GOODBYE_MSG: "Arrivederci!"
        }
    }
}
