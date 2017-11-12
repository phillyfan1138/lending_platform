'use strict'
const functions = require('firebase-functions')
const origination=require('sequence_lending_app')
const am=require('./am')
const admin = require('firebase-admin')
admin.initializeApp(functions.config().firebase)

/**ran when app decision is written to loan */
//when loan app decision comes through, generate the schedule
exports.generateSchedule=functions.firestore.document('/loans/{loanId}').onWrite(event => {
    // Grab the current value of what was written to the Realtime Database.
    const {rate, term, amount} = event.data.data()
    const schedule=am.schedule(amount, rate, term)
    return admin.firestore().collection('payments').doc(event.params.loanId).set({schedule})
    //return event.data.ref.parent.parent.child(`/payments/${event.params.loanId}`).push(schedule)
})


//fund
exports.fundLoan=functions.firestore.document('/loans/{loanId}').onUpdate(event=>{
    const {wireId}=event.data.val()
    if(wireId){
        const {ledger, secret}=functions.config().sequence
        //id, amount, wireId, ledger, secret
        const {amount}=event.data.previous.data()
        return origination.create(event.params.loanId, amount, wireId, ledger, secret)
    }
    
})

/**end app decision is written to loan */

/**ran when app is submitted */
exports.appDecision=functions.firestore.document('/apps/{appId}').onWrite(event=>{
    //add decisioning logic here
    const {rate, term, amount, decision}=event.data.val()
    //decision is temporary!
    
    if(decision){
        event.data.ref.set({decision})
        return admin.firestore().collection('loans').push({rate, term, amount, appId:event.params.appId})
    }   
    return event.data.ref.set({decision})
    
})
/**end when app is submitted */

/**Ran when loan is viewed by customer */
//TODO!  Figure out how to execute functions at a specific time interval
//exports.processLoan=functions.database.ref('/payments/')

//listen for when loan is written

//exports.payBill=functions.database.ref('/payments/{loanId}')

//for testing

//exports.