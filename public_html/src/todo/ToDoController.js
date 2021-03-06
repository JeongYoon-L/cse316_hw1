'use strict'

/**
 * ToDoController
 * 
 * This class serves as the event traffic manager, routing all
 * event handling responses.
 */
export default class ToDoController {    
    constructor() {}

    setModel(initModel) {
        this.model = initModel;
        let appModel = this.model;
        let self = this;
        
        //Initialize
        self.forColor();
        document.getElementById('add-list-button').disabled = false;
        document.getElementById('add-list-button').style.pointerEvents = "auto";
        document.getElementById('add-list-button').style.color = "#ffc800";
        
        document.getElementById('add-item-button').disabled = true;
        document.getElementById('add-item-button').style.pointerEvents = "none";
        document.getElementById('add-item-button').style.color = "#322D2D";        

        document.getElementById('delete-list-button').disabled = true;
        document.getElementById('delete-list-button').style.pointerEvents = "none";
        document.getElementById('delete-list-button').style.color = "#322D2D";


        document.getElementById('close-list-button').disabled = true;
        document.getElementById('close-list-button').style.pointerEvents = "none";
        document.getElementById('close-list-button').style.color = "#322D2D";


        // SETUP ALL THE EVENT HANDLERS SINCE THEY USE THE MODEL
        document.getElementById("add-list-button").onmousedown = function() {
            appModel.addNewList();
        }

        document.getElementById("undo-button").onmousedown = function() {
            appModel.undo();
            self.forColor();
        }

        document.getElementById("redo-button").onmousedown = function() {
            appModel.redo();
            self.forColor();
        }

        document.getElementById("delete-list-button").onmousedown = function() {
            var modal = document.getElementById("modal-overlay");
            modal.style.display = 'block';
            var modal1 = document.getElementById("id01");
            modal1.style.display = 'block';

            document.getElementById("confirmbtn").onclick = function(){
                appModel.initializeWorkSpace(); //initialize workspace
                appModel.removeCurrentList();
                modal.style.display = 'none';
                modal1.style.display = 'none';
            }
            document.getElementById("cancelbtn").onclick = function(){
                modal.style.display = 'none';
                modal1.style.display = 'none';
            }
            document.getElementsByClassName("close").onclick = function(){
                modal.style.display = 'none';
                modal1.style.display = 'none';
            }
        }

        document.getElementById("add-item-button").onmousedown = function() {
            appModel.addNewItemTransaction();
            self.forColor();
        }  
        document.getElementById("close-list-button").onmousedown = function() {
            appModel.initializeWorkSpace(); //initialize workspace
        }  
        
    }

    forColor(){
        let appModel = this.model;
        if((appModel.tps.mostRecentTransaction == -1)){ 
            document.getElementById('undo-button').disabled = true;
            document.getElementById('undo-button').style.pointerEvents = "none";
            document.getElementById('undo-button').style.color = "#322D2D";
        }
        else{
            document.getElementById('undo-button').disabled = false;
            document.getElementById('undo-button').style.pointerEvents = "auto";
            document.getElementById('undo-button').style.color = "#e9edf0";
        }
        if((appModel.tps.mostRecentTransaction+1) < appModel.tps.numTransactions){
            document.getElementById('redo-button').disabled = false;
            document.getElementById('redo-button').style.pointerEvents = "auto";
            document.getElementById('redo-button').style.color = "#e9edf0";
        }
        else{
            document.getElementById('redo-button').disabled = true;
            document.getElementById('redo-button').style.pointerEvents = "none";
            document.getElementById('redo-button').style.color = "#322D2D";
        }

    }
    

    // PROVIDES THE RESPONSE TO WHEN A USER CLICKS ON A LIST TO LOAD
    handleLoadList(listId) {
        // UNLOAD THE CURRENT LIST AND INSTEAD LOAD THE CURRENT LIST

        let self = this;
        if(this.model.toDoLists[0].id == listId && document.getElementById('todo-list-'+ listId ).style.color == "black"){
            this.model.loadList(listId);
            document.getElementById('todo-list-'+ listId).style.backgroundColor = "#ffc800";
            document.getElementById('todo-list-'+ listId ).style.color = "black";
            document.getElementById('todo-list-'+listId).contentEditable = true; // works in Chrome
            document.getElementById("todo-list-"+ listId).addEventListener('blur' , function(){
                self.model.toDoLists[0].name =document.getElementById("todo-list-"+ listId).innerHTML;                
            });

        }
        else{
            document.getElementById('todo-list-'+self.model.toDoLists[0].id).contentEditable = false;
            self.model.toDoLists[0].name =document.getElementById("todo-list-"+ self.model.toDoLists[0].id).innerHTML;                
            this.model.loadList(listId);
        }
    }

    can(){
        this.model.updateWorkspace();
    }
    
}