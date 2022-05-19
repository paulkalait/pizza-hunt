const { response } = require("express");
const { ServerResponse } = require("http");

// create variable to hold db connection
let db ; 
// establish a connection to indexDB database called 'piiza_hunt' and set it to version 1 
const request = indexedDB.open('pizza_hunt', 1)

// add event listener
// this event will emit if the database version changes (nonexistant to version 1, v2, v3 , etc)
request.onupgradeneeded = function(event){
    // save a reference to the database
    const db = event.target.result
    // create an object store (table) called 'new_pizza', set it to have an auto increment primary key of sorts
    db.createObjectStore('new_pizza', {autoIncrement: true});
};

// upon a successufl
request.onsuccess = function(event){
    // when db is succefullt created with its object store(from onupgradedneeded event above) or simply establishing a connection, save reference to db in global variable
    db = event.target.result

    // check if app is online, if yes run uploadPizza() function to send all local db to api 
    if(navigator.online){
        // we havent created this yet but we will soon, so lets comment it out for now
        uploadPizza();
    }
}

request.onerror = function(event){
// log error here
console.log(event.target.errorCode)
}

// this function will be executed if we attempt to submit a new pizza and theres no internet conntection
function savedRecord(record) { 
    // open a new transaction with the database with read and write premissions
    const transaction = db.transaction(['new_pizza'], 'readwrite')


    // access the object store for 'new_pizza'
    const pizzaObjectStore = transaction.pizzaObjectStore('new_pizza')

    // add record to your store with add method
    pizzaObjectStore.add(record);
}

function uploadPizza(){
    // open a transaction on your db
    const transaction = db.transaction(['new_pizza'], 'readwrite')

    // access your object store
    const pizzaObjectStore = transaction.objectStore('new_pizza')

    // get all records from the store ans set to a variable
    const getAll = pizzaObjectStore.getAll()

    // upon a successful .getAll( execution, run this function
    getAll.onsuccess = function() { 
        // if there was data in idexedDb's stopre, lets send it to the api server
        if(getAll.result.length > 0){
            fetch(`/api/pizzas`, {
                method:'POST',
                body: JSON.stringify(getAll.result),
                headers: {
                    Accept: 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                }
            })
            .then(response => response.json())
            .then(ServerResponse => {
                if(ServerResponse){
                    throw new Error(ServerResponse)
                }
                // open one more transaction
                const transaction = db.transaction(['new_pizza'], 'readwrite')
                // access the new_pizza object store
                const pizzaObjectStore = transaction.objectStore('new_pizza')
                // clear all items in your store
                pizzaObjectStore.clear()
                
                alert('All saved pizza has been submitted')
            })
            .catch(err => {
                console.log(err)
            })
        }
    }
}

// listen for app coming back online
window.addEventListener('online', uploadPizza)