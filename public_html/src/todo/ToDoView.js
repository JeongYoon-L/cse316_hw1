'use strict'

/**
 * ToDoView
 * 
 * This class generates all HTML content for the UI.
 */
export default class ToDoView {
    constructor() {}

    // ADDS A LIST TO SELECT FROM IN THE LEFT SIDEBAR
    appendNewListToView(newList) {
        // GET THE UI CONTROL WE WILL APPEND IT TO
        let listsElement = document.getElementById("todo-lists-list");

        // MAKE AND ADD THE NODE
        let newListId = "todo-list-" + newList.id;
        let listElement = document.createElement("div");
        listElement.setAttribute("id", newListId);
        listElement.setAttribute("class", "todo_button-list");
        listElement.appendChild(document.createTextNode(newList.name));
        listsElement.appendChild(listElement);

        document.getElementById('add-list-button').disabled = false;
        document.getElementById('add-list-button').style.pointerEvents = "auto";
        document.getElementById('add-list-button').style.color = "#ffc800";
        
        // SETUP THE HANDLER FOR WHEN SOMEONE MOUSE CLICKS ON OUR LIST
        let thisController = this.controller;
        listElement.onmousedown = function() {
            thisController.handleLoadList(newList.id);
        }
    }

    // REMOVES ALL THE LISTS FROM THE LEFT SIDEBAR
    clearItemsList() {
        let itemsListDiv = document.getElementById("todo-list-items-div");
        // BUT FIRST WE MUST CLEAR THE WORKSPACE OF ALL CARDS BUT THE FIRST, WHICH IS THE ITEMS TABLE HEADER
        let parent = itemsListDiv;
        while (parent.firstChild) {
            parent.removeChild(parent.firstChild);
        }
    }

    // REFRESHES ALL THE LISTS IN THE LEFT SIDEBAR
    refreshLists(lists) {
        // GET THE UI CONTROL WE WILL APPEND IT TO
        let listsElement = document.getElementById("todo-lists-list");
        listsElement.innerHTML = "";

        for (let i = 0; i < lists.length; i++) {
            let list = lists[i];
            this.appendNewListToView(list);
        }
    }

    // LOADS THE list ARGUMENT'S ITEMS INTO THE VIEW
    viewList(list) {
        document.getElementById('add-list-button').disabled = true;
        document.getElementById('add-list-button').style.pointerEvents = "none";
        document.getElementById('add-list-button').style.color = "#322D2D";

        if((this.controller.model.tps.mostRecentTransaction == -1)){ 
            document.getElementById('undo-button').disabled = true;
            document.getElementById('undo-button').style.pointerEvents = "none";
            document.getElementById('undo-button').style.color = "#322D2D";
        }
        else{
            document.getElementById('undo-button').disabled = false;
            document.getElementById('undo-button').style.pointerEvents = "auto";
        }
        if((this.controller.model.tps.mostRecentTransaction+1) < this.controller.model.tps.numTransactions){
            document.getElementById('redo-button').disabled = false;
            document.getElementById('redo-button').style.pointerEvents = "auto";
            document.getElementById('redo-button').style.color = "#e9edf0";
        }
        else{
            document.getElementById('redo-button').disabled = true;
            document.getElementById('redo-button').style.pointerEvents = "none";
            document.getElementById('redo-button').style.color = "#322D2D";
        }

        // WE'LL BE ADDING THE LIST ITEMS TO OUR WORKSPACE
        let itemsListDiv = document.getElementById("todo-list-items-div");
        let length = 0;

        if(typeof(list) == "Object"){
            length = Object.keys(list).length;
        }
        else if(list == null){ // when click List X button
            length= 0;
        }
        else{
            length = list.items.length;
        }

        // GET RID OF ALL THE ITEMS
        this.clearItemsList();
        for (let i = 0; i < length; i++) {
            // NOW BUILD ALL THE LIST ITEMS
            let listItem = list.items[i];
            
            let listItemElement = "<div id='todo-list-item-" + listItem.id + "' class='list-item-card'>"
                                + "<div class='task-col' id = 'updateDescription-" + listItem.id + "' contentEditable='true' >" + listItem.description + "</div>"
                                + "<div class='due-date-col' id = 'updateDateDiv-" + listItem.id+ "' >" +listItem.dueDate + "</div>"
                                +"<input type='date' style='border:none; display:none ' id='updateDate-" + listItem.id +"' value= " + listItem.dueDate + " min='2010-01-01' max='2050-12-31'>" 
                                + "</input>"
                                

                                + "<div class='status-col' id='updateStatus-" + listItem.id + "' >"+ listItem.status +"</div>"
                                +"<select style='display: none;' class = 'statusbutton' id='drop-content-"+ listItem.id +"'  >"
                                +    "<option value = '"+ listItem.status+"' style= 'display:none;' >  "+ listItem.status + " </option>"
                                +    "<option value = 'complete' >complete </option>"
                                +    "<option value = 'incomplete' >incomplete </option>"
                                + "</select>"   

                                + "<div class='list-controls-col'>"
                                + " <div class='list-item-control material-icons hover_button' id='upbutton-" + listItem.id + "' >keyboard_arrow_up</div>"
                                + " <div class='list-item-control material-icons hover_button' id='downbutton-" + listItem.id + "' >keyboard_arrow_down</div>"
                                + " <div class='list-item-control material-icons hover_button' id='closebutton-" + listItem.id + "' >close</div>"
                                + "</div>";
            itemsListDiv.innerHTML += listItemElement;
            if(listItem.dueDate == ""){
                document.getElementById("updateDateDiv-"+ listItem.id).innerHTML = "No Date";
            }
        }

    if(list != null){    
        let self = this.controller;
        self.can();
    }

    if(list != null && list.items.length != 0){

    for(let m =0; m< list.items.length; m++){
        document.getElementById("upbutton-"+ list.items[m].id).disabled = false;
        document.getElementById("upbutton-"+ list.items[m].id).style.color = "#FFFFFF";
        document.getElementById("upbutton-"+ list.items[m].id).style.pointerEvents = "auto";
        
        if(list.items[m].status == "complete"){
            document.getElementById("updateStatus-"+ list.items[m].id).style.color = '#8ed4f8';
        }
        else if(list.items[m].status == "incomplete" ){
            document.getElementById("updateStatus-"+ list.items[m].id).style.color = '#ffc800';
        }
    }
        let m = list.items[0].id;
        document.getElementById("upbutton-"+ m).disabled = true;
        document.getElementById("upbutton-"+ m).style.color = "black";
        document.getElementById("upbutton-"+ m).style.pointerEvents = "none";

        let n = list.items[list.items.length-1].id;
        document.getElementById("downbutton-"+ n).disabled = true;
        document.getElementById("downbutton-"+ n).style.color = "black";
        document.getElementById("downbutton-"+ n).style.pointerEvents = "none";

    }


    }

    // THE VIEW NEEDS THE CONTROLLER TO PROVIDE PROPER RESPONSES
    setController(initController) {
        this.controller = initController;
    }
}