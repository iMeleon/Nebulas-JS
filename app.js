//define ui vars

const form = document.querySelector('#task-form');
const taskList = document.querySelector(".collection");
const clearBtn = document.querySelector('.clear-tasks');
const filter = document.querySelector('#filter');
const taskInput = document.querySelector('#task');
    var NebPay = require("nebpay");
    var nebPay = new NebPay();    
    var serialNumber; //transaction serial number
    var intervalQuery; //periodically query tx results
    var to = "n1nQ5FJYByrtXBg7nz2ntsou2cQZK9jXMUC"; 
    var nebulas = require("nebulas");
    var userAddress;
    Account = nebulas.Account;
    neb = new nebulas.Neb();
    neb.setRequest(new nebulas.HttpRequest("https://mainnet.nebulas.io"));

// load all event listeners
loadEventListeners();

//Load all event listeners

function loadEventListeners(){
    //add task event
document.addEventListener('DOMContentLoaded', getTasks);

    form.addEventListener('submit', addTask);

    taskList.addEventListener('click', removeTask);
   
    clearBtn.addEventListener('click', removeTasks);

    filter.addEventListener('keyup', filterTasks)


}

function getTasks(){
 
    userAddress = NasExtWallet.getUserAddress(function(addr){
        var userAddress = addr;

    console.log("xxxxxxxxxxxxxxxxxxxxx " + userAddress);
    var from = userAddress;
    var value = "0";
    var nonce = "0"
    var gas_price = "1000000"
    var gas_limit = "2000000"
    var callFunction = "get";
    var callArgs = '[]';
    var contract = {
        "function": callFunction,
        "args": callArgs
    }
   
    neb.api.call(from,to,value,nonce,gas_price,gas_limit,contract).then(function (resp) {
        cbSearch(resp)
    }).catch(function (err) {
        //cbSearch(err)
        console.log("error:" + err.message)
    })
});
}
function cbSearch(resp){

    console.log("ZASHEL3: " + JSON.parse(resp.result));
    tasks = JSON.parse(resp.result);
tasks.forEach(function(task){

    const li = document.createElement('li');
    li.className = 'collection-item';
    //create text node and append to li
    li.appendChild(document.createTextNode(task));
    //create new link element
    const link = document.createElement('a');
    link.className = 'delete-item secondary-content';
    //add icon
    link.innerHTML = "<i class='fa fa-remove'></i>";
    li.appendChild(link);
    //append li to ul

    taskList.appendChild(li);

})

}
function addTask(e){
    if(taskInput.value === ''){
    alert('Add a task');
    } else {
    let task = taskInput.value;
    var value = "0";
    var callFunction = "save" //the function name to be called
    var callArgs =  `["${task}"]`  //the parameter, it's format JSON string of parameter arrays, such as'["arg"]','["arg1","arg2]'        
    var options = {
        goods: {        //commodity description
            name: "example"
        },
        qrcode: {
            showQRCode: false,      //Whether to display QR code information
        },
    }
    serialNumber = nebPay.call(to, value, callFunction, callArgs, options);
    clearInterval(intervalQuery);
    intervalQuery = setInterval(function() {
        CBAdd();
    }, 7000); //it's recommended that the query frequency is between 10-15s.
}
    

e.preventDefault();
}
function CBAdd() {   
    nebPay.queryPayInfo(serialNumber)   
        .then(function (resp) {
            console.log("tx result: " + resp)   //resp is a JSON string
            var respObject = JSON.parse(resp)
            if(respObject.data.status === 1){
                const li = document.createElement('li');
                li.className = 'collection-item';
                li.appendChild(document.createTextNode(taskInput.value));
                const link = document.createElement('a');
                link.className = 'delete-item secondary-content';
                link.innerHTML = "<i class='fa fa-remove'></i>";
                li.appendChild(link);
                taskList.appendChild(li);
                taskInput.value = '';
                clearInterval(intervalQuery); //stop the periodically query 
            }
        })
        .catch(function (err) {
            console.log(err);
        });
}

function funcIntervalQuery() {   
    nebPay.queryPayInfo(serialNumber)
        .then(function (resp) {
            console.log("tx result: " + resp)   //resp is a JSON string
            var respObject = JSON.parse(resp)
            if(respObject.data.status === 1){
                //The transaction is successful 
                clearInterval(intervalQuery)    //stop the periodically query 
            }
        })
        .catch(function (err) {
            console.log(err);
        });
}

function removeTask(e){
   if(e.target.parentElement.classList.contains('delete-item')){ 
   let task = e.target.parentElement.parentElement.textContent;
   var value = "0";
   var callFunction = "delete" //the function name to be called
   var callArgs =  `["${task}"]`  //the parameter, it's format JSON string of parameter arrays, such as'["arg"]','["arg1","arg2]'        
   var options = {
       goods: {        //commodity description
           name: "example"
       },
       qrcode: {
           showQRCode: false,      //Whether to display QR code information
       },
   }
   serialNumber = nebPay.call(to, value, callFunction, callArgs, options);
   clearInterval(intervalQuery);
   intervalQuery = setInterval(function() {
       CBDelete(e);
   }, 5000); //it's recommended that the query frequency is between 10-15s.

}   
    }
function CBDelete(e) {   
    nebPay.queryPayInfo(serialNumber)   //search transaction result from server (result upload to server by app)
        .then(function (resp) {
            console.log("tx result: " + resp)   //resp is a JSON string
            var respObject = JSON.parse(resp)
            if(respObject.data.status === 1){
                e.target.parentElement.parentElement.remove();
                clearInterval(intervalQuery)    //stop the periodically query 
            }
        })
        .catch(function (err) {
            console.log(err);
        });
}

    function removeTasks(e){
       
      
        var value = "0";
        var callFunction = "deleteAll" //the function name to be called
        var callArgs =  `[]`  //the parameter, it's format JSON string of parameter arrays, such as'["arg"]','["arg1","arg2]'        
        var options = {
            goods: {        //commodity description
                name: "example"
            },
            qrcode: {
                showQRCode: false,      //Whether to display QR code information
            },
        }
        serialNumber = nebPay.call(to, value, callFunction, callArgs, options);
        clearInterval(intervalQuery);
        //Set a periodically query
        intervalQuery = setInterval(function() {
            nebPay.queryPayInfo(serialNumber)   //search transaction result from server (result upload to server by app)
            .then(function (resp) {
                console.log("tx result: " + resp)   //resp is a JSON string
                var respObject = JSON.parse(resp)
                if(respObject.data.status === 1){
                    while (taskList.firstChild){
                        taskList.removeChild(taskList.firstChild)
                    }            
                    clearInterval(intervalQuery)    //stop the periodically query 
                }
            })
            .catch(function (err) {
                console.log(err);
            });
        }, 5000); //it's recommended that the query frequency is between 10-15s.
       
      

   
}

function filterTasks(e){
const text = e.target.value.toLowerCase();
document.querySelectorAll('.collection-item').forEach(function(task){
    const item = task.firstChild.textContent;
    if(item.toLowerCase().indexOf(text) != -1){
        task.style.display = 'block';
    } else {
        task.style.display = 'none';
    }
  
});

}