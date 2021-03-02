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
        if(this.model.tps.mostRecentTransaction ==-1){
            document.getElementById('undo-button').disabled = true;
            document.getElementById('undo-button').style.pointerEvents = "none";
            document.getElementById('undo-button').style.backgroundColor = "#40454e";
            document.getElementById('undo-button').style.color = "#353a44";
        }
        else{
            document.getElementById('undo-button').disabled = false;
            document.getElementById('undo-button').style.pointerEvents = "auto";
            document.getElementById('undo-button').style.backgroundColor = "#353a44";
            document.getElementById('undo-button').style.color = "#e9edf0";
        }
        if(this.model.tps.numTransactions ==0){
            document.getElementById('redo-button').disabled = true;
            document.getElementById('redo-button').style.pointerEvents = "none";
            document.getElementById('redo-button').style.backgroundColor = "#40454e";
            document.getElementById('redo-button').style.color = "#353a44";
        }
        else{
            document.getElementById('redo-button').disabled = false;
            document.getElementById('redo-button').style.pointerEvents = "auto";
            document.getElementById('redo-button').style.backgroundColor = "#353a44";
            document.getElementById('redo-button').style.color = "#e9edf0";
        }

        document.getElementById('add-list-button').disabled = false;
        document.getElementById('add-list-button').style.pointerEvents = "auto";
        document.getElementById('add-list-button').style.backgroundColor = "#353a44";
        document.getElementById('add-list-button').style.color = "#ffc800";
        
        document.getElementById('add-item-button').disabled = true;
        document.getElementById('add-item-button').style.pointerEvents = "none";
        document.getElementById('add-item-button').style.backgroundColor = "#40454e";
        document.getElementById('add-item-button').style.color = "#353a44";

        document.getElementById('delete-list-button').disabled = true;
        document.getElementById('delete-list-button').style.pointerEvents = "none";
        document.getElementById('delete-list-button').style.backgroundColor = "#40454e";
        document.getElementById('delete-list-button').style.color = "#353a44";


        document.getElementById('close-list-button').disabled = true;
        document.getElementById('close-list-button').style.pointerEvents = "none";
        document.getElementById('close-list-button').style.backgroundColor = "#40454e";
        document.getElementById('close-list-button').style.color = "#353a44";


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
            var modal = document.getElementById('id01');
            modal.style.display = 'block';
            document.getElementById("confirmbtn").onclick = function(){
                appModel.removeCurrentList();
                modal.style.display = 'none';
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
            document.getElementById('undo-button').style.backgroundColor = "#40454e";
            document.getElementById('undo-button').style.color = "#353a44";
        }
        else{
            document.getElementById('undo-button').disabled = false;
            document.getElementById('undo-button').style.pointerEvents = "auto";
            document.getElementById('undo-button').style.backgroundColor = "#353a44";
            document.getElementById('undo-button').style.color = "#e9edf0";
        }
        if((appModel.tps.mostRecentTransaction+1) < appModel.tps.numTransactions){
            document.getElementById('redo-button').disabled = false;
            document.getElementById('redo-button').style.pointerEvents = "auto";
            document.getElementById('redo-button').style.backgroundColor = "#353a44";
            document.getElementById('redo-button').style.color = "#e9edf0";
        }
        else{
            document.getElementById('redo-button').disabled = true;
            document.getElementById('redo-button').style.pointerEvents = "none";
            document.getElementById('redo-button').style.backgroundColor = "#40454e";
            document.getElementById('redo-button').style.color = "#353a44";
        }

    }
    
    // PROVIDES THE RESPONSE TO WHEN A USER CLICKS ON A LIST TO LOAD
    handleLoadList(listId) {
        // UNLOAD THE CURRENT LIST AND INSTEAD LOAD THE CURRENT LIST
        this.model.loadList(listId);
    }

    can(){
        this.model.updateWorkspace();
    }

    
}