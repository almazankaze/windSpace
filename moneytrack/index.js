window.indexedDB = window.indexedDB || window.mozIndexedDB || 
window.webkitIndexedDB || window.msIndexedDB;

//prefixes of window.IDB objects
window.IDBTransaction = window.IDBTransaction || 
window.webkitIDBTransaction || window.msIDBTransaction;
window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || 
window.msIDBKeyRange;

/////indexedDB setup/////
if (!window.indexedDB) {window.alert("error: DB not supported");}

const fundsData = [
    { id: "1", name: "Budget", balance: 150.00 },
    { id: "2", name: "Number1", balance: 555 },
    { id: "3", name: "Number2", balance: 555 }
];

var db;
var request = window.indexedDB.open("balanceDataBase", 1);

request.onerror = function(event) {
    console.log("error: ");
};

request.onsuccess = function(event) {
    db = request.result;
    console.log("success: "+ db);
};

request.onupgradeneeded = function(event) {
    var db = event.target.result;
    var objectStore = db.createObjectStore("funds", {keyPath: "id"});
    
    for (var i in fundsData) {
        objectStore.add(fundsData[i]);
    }
};

/////erases whats in the element/////
function clearMe(myId)
{
    document.getElementById(myId).innerHTML = "";
}

/////read data from indexedDB/////
function readData() {
    var transaction = db.transaction(["funds"]);
    var objectStore = transaction.objectStore("funds");
    var request = objectStore.get("1");
    
    request.onerror = function(event) {
        alert("Unable to retrieve data from database!");
    };
    
    request.onsuccess = function(event) {

        if(request.result) {
            
            clearMe("moneyText");
            $("#moneyText").append("<br>" + "$ " + request.result.balance);
        } 
        else {
            alert("Couldn't be found in your database!");
        }
    };
}

//checks for empty space in textbox
function isEmpty(str) {
    return str.replace(/^\s+|\s+$/gm,'').length == 0;
}

//keeps user from inputting letters
function validate(evt) {
  var theEvent = evt || window.event;
  var key = theEvent.keyCode || theEvent.which;
  key = String.fromCharCode( key );
  var regex = /[0-9]|\./;
  if( !regex.test(key) ) {
    theEvent.returnValue = false;
    if(theEvent.preventDefault) theEvent.preventDefault();
  }
}

/////adds funds to budget/////
function add() {
    
    if(isEmpty($("#addBalance").val())) {
            
        alert("Please type an amount to add.");
        return;
    }
    else {
        
        //get and convert entered value into a floating number
        var toAdd = $("#addBalance").val();
        toAdd = parseFloat(toAdd);
        
        var objectStore = db.transaction(["funds"], "readwrite").objectStore("funds");
        var request = objectStore.get("1");
        
        request.onerror = function(event) {
          // Handle errors!
        };
        
        request.onsuccess = function(event) {
          // Get the old value that we want to update
          var data = event.target.result;
          
          //convert data to a floating number
          var floatedData = parseFloat(request.result.balance);
          
          //add the two numbers
          toAdd = floatedData + toAdd;
          toAdd = toAdd.toFixed(2);
          
          if(data.balance > 10000) {
              
              alert("Can't add any more. You have reached the limit.");
          }
          else if(toAdd > 10000) {
              
              alert("Can't add that much at once. Try again");
          }
          else {
              // update the value(s) in the object that you want to change
              data.balance = toAdd;
              
              readData();
          }
        
          // Put this updated object back into the database.
          var requestUpdate = objectStore.put(data);
           requestUpdate.onerror = function(event) {
             // Do something with the error
           };
           requestUpdate.onsuccess = function(event) {
             // Success - the data is updated!
           };
        };
    }
}

/////subtracts funds from budget/////
function subtract() {
    
    if(isEmpty($("#subBalance").val())) {
            
        alert("Please type an amount to subtract.");
        return;
    }
    else {
        
        //get and convert entered value into a floating number
        var toSub = $("#subBalance").val();
        toSub = parseFloat(toSub);
        
        var objectStore = db.transaction(["funds"], "readwrite").objectStore("funds");
        var request = objectStore.get("1");
        
        request.onerror = function(event) {
          // Handle errors!
        };
        
        request.onsuccess = function(event) {
          // Get the old value that we want to update
          var data = event.target.result;
          
          //convert data to a floating number
          var floatedData = parseFloat(request.result.balance);
          
          //subtract the two numbers
          toSub = floatedData - toSub;
          toSub = toSub.toFixed(2);
          
          if(data.balance == 0) {
              
              alert("You have a balance of zero. Can't subtract from current balance.");
          }
          else if(toSub < 0) {
              
              alert("Can't subtract that much at once. Try again");
          }
          else {
              // update the value(s) in the object that you want to change
              data.balance = toSub;
              
              readData();
          }
        
          // Put this updated object back into the database.
          var requestUpdate = objectStore.put(data);
           requestUpdate.onerror = function(event) {
             // Do something with the error
           };
           requestUpdate.onsuccess = function(event) {
             // Success - the data is updated!
           };
        };
    }
}

/////when the edit button is presssed/////
function edit() {
    
    $("#moneyText").hide();
    $("#subtracting").hide();
    $("#editing").show();
    
    document.getElementById("newBalance").focus();
}

/////changes current budget/////
function updateBalance() {

    if(isEmpty($("#newBalance").val())) {
    
        $("#moneyText").show();
        $("#subtracting").show();
        $("#editing").hide();
        
        return;
    }
    else {
    
        var newBal = $("#newBalance").val();
        newBal = parseFloat(newBal);
        newBal = newBal.toFixed(2);
        
        var objectStore = db.transaction(["funds"], "readwrite").objectStore("funds");
        var request = objectStore.get("1");
        
        request.onerror = function(event) {
        // Handle errors!
        };
        
        request.onsuccess = function(event) {
            
            // Get the old value that we want to update
            var data = event.target.result;
            
            if(newBal > 10000) {
            
                alert("You can't enter more than 10000. Try again.");
            }
            else {
                
                // update the value(s) in the object that you want to change
                data.balance = newBal;
                readData();
                
                $("#moneyText").show();
                $("#subtracting").show();
                $("#editing").hide();
            }
            
            // Put this updated object back into the database.
            var requestUpdate = objectStore.put(data);
            
            requestUpdate.onerror = function(event) {
            // Do something with the error
            };
            requestUpdate.onsuccess = function(event) {
            // Success - the data is updated!
            };
        };
    }
}

//adding service worker code here
if ('serviceWorker' in navigator) {
navigator.serviceWorker
         .register('./service-worker.js')
         .then(function() { console.log('Service Worker Registered'); });
}