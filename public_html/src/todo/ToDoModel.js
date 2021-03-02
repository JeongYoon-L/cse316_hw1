'use strict'

import ToDoList from './ToDoList.js'
import ToDoListItem from './ToDoListItem.js'
import jsTPS from '../common/jsTPS.js'
import AddNewItem_Transaction from './transactions/AddNewItem_Transaction.js'
import Workspace_Transaction from './transactions/Workspace_Transaction.js'
import UpButton_Transaction from './transactions/UpButton_Transaction.js'
import DownButton_Transaction from './transactions/DownButton_Transaction.js'

/**
 * ToDoModel
 * 
 * This class manages all the app data.
 */
export default class ToDoModel {
    constructor() {
        // THIS WILL STORE ALL OF OUR LISTS
        this.toDoLists = [];

        // THIS IS THE LIST CURRENTLY BEING EDITED
        this.currentList = null;

        // THIS WILL MANAGE OUR TRANSACTIONS
        this.tps = new jsTPS();

        // WE'LL USE THIS TO ASSIGN ID NUMBERS TO EVERY LIST
        this.nextListId = 0;

        // WE'LL USE THIS TO ASSIGN ID NUMBERS TO EVERY LIST ITEM
        this.nextListItemId = 0;
    }

    /**
     * addItemToCurrentList
     * 
     * This function adds the itemToAdd argument to the current list being edited.
     * 
     * @param {*} itemToAdd A instantiated item to add to the list.
     */
    addItemToCurrentList(itemToAdd) {
        this.currentList.push(itemToAdd);
    }

    /**
     * addNewItemToCurrentList
     * 
     * This function adds a brand new default item to the current list.
     */
    addNewItemToCurrentList() {
        let newItem = new ToDoListItem(this.nextListItemId++);
        this.addItemToList(this.currentList, newItem);
        return newItem;
    }

    /**
     * addItemToList
     * 
     * Function for adding a new item to the list argument using the provided data arguments.
     */
    addNewItemToList(list, initDescription, initDueDate, initStatus) {
        let newItem = new ToDoListItem(this.nextListItemId++);
        newItem.setDescription(initDescription);
        newItem.setDueDate(initDueDate);
        newItem.setStatus(initStatus);
        list.addItem(newItem);
        if (this.currentList) {
            this.view.refreshList(list);
        }
    }

    /**
     * addNewItemTransaction
     * 
     * Creates a new transaction for adding an item and adds it to the transaction stack.
     */
    addNewItemTransaction() {
        var self = this;
        for (let i = 0; i < this.toDoLists[0].items.length; i++) {
            if(document.getElementById("updateDate-"+this.toDoLists[0].items[i].id) != null){
            var text = document.getElementById("updateDate-"+this.toDoLists[0].items[i].id).value;
            this.toDoLists[0].items[i].dueDate = text;
            this.toDoLists[0].items[i].description = document.getElementById("updateDescription-"+this.toDoLists[0].items[i].id).innerHTML;
            this.toDoLists[0].items[i].status = document.getElementById("button-"+this.toDoLists[0].items[i].id).innerHTML;
            }    
        }
        this.currentList = this.toDoLists[0];

        let transaction = new AddNewItem_Transaction(this);
        this.tps.addTransaction(transaction);
        self.forColorModel();
    }

    addNewWorkspaceTransaction(){
        var self = this;
        let transaction = new Workspace_Transaction(this,self.currentObj(self.updatePrev()));
        this.tps.addTransaction(transaction);
        self.forColorModel();
        
    }

    addUpButton_Transaction(id){
        var self = this;
        let transaction = new UpButton_Transaction(this,id);
        this.tps.addTransaction(transaction);
        self.forColorModel();
    }
    addDownButton_Transaction(id){
        var self = this;
        let transaction = new DownButton_Transaction(this,id);
        this.tps.addTransaction(transaction);
        self.forColorModel();
    }

    forColorModel(){
        if((this.tps.mostRecentTransaction == -1)){ 
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
        if((this.tps.mostRecentTransaction+1) < this.tps.numTransactions){
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
    /**
     * addNewList
     * 
     * This function makes a new list and adds it to the application. The list will
     * have initName as its name.
     * 
     * @param {*} initName The name of this to add.
     */
    addNewList(initName) { //한글 새로운 사이드 리스트 추가시 일로옴 
        let newList = new ToDoList(this.nextListId++);
        if (initName)
            newList.setName(initName);
        this.toDoLists.push(newList);
        this.view.appendNewListToView(newList);
        return newList;
    }

    /**
     * Adds a brand new default item to the current list's items list and refreshes the view.
     */
    addNewItem() {
        let newItem = new ToDoListItem(this.nextListItemId++);
        this.currentList.items.push(newItem);
        this.view.viewList(this.currentList);
        return newItem;
    }

    /**
     * Makes a new list item with the provided data and adds it to the list.
     */
    loadItemIntoList(list, description, due_date, assigned_to, completed) {
        let newItem = new ToDoListItem();
        newItem.setDescription(description);
        newItem.setDueDate(due_date);
        newItem.setAssignedTo(assigned_to);
        newItem.setCompleted(completed);
        this.addItemToList(list, newItem);
    }

    /**
     * Load the items for the listId list into the UI.
     */
    loadList(listId) {

        document.getElementById('add-list-button').disabled = true;
        document.getElementById('add-list-button').style.pointerEvents = "none";
        document.getElementById('add-list-button').style.backgroundColor = "#40454e";
        document.getElementById('add-list-button').style.color = "#353a44";
        
        document.getElementById('add-item-button').disabled = false;
        document.getElementById('add-item-button').style.pointerEvents = "auto";
        document.getElementById('add-item-button').style.backgroundColor = "#353a44";
        document.getElementById('add-item-button').style.color = "#e9edf0";

        document.getElementById('delete-list-button').disabled = false;
        document.getElementById('delete-list-button').style.pointerEvents = "auto";
        document.getElementById('delete-list-button').style.backgroundColor = "#353a44";
        document.getElementById('delete-list-button').style.color = "#e9edf0";


        document.getElementById('close-list-button').disabled = false;
        document.getElementById('close-list-button').style.pointerEvents = "auto";
        document.getElementById('close-list-button').style.backgroundColor = "#353a44";
        document.getElementById('close-list-button').style.color = "#e9edf0";

        let listIndex = -1;
        for (let i = 0; (i < this.toDoLists.length) && (listIndex < 0); i++) {
            if (this.toDoLists[i].id === listId)
                listIndex = i;
        }
        if (listIndex >= 0) {
            let listToLoad = this.toDoLists[listIndex];

            //한글 문제3
            for (let i = 0; i < this.toDoLists[0].items.length; i++) {
                if(document.getElementById("updateDate-"+this.toDoLists[0].items[i].id) != null){
                var text = document.getElementById("updateDate-"+this.toDoLists[0].items[i].id).value;
                this.toDoLists[0].items[i].dueDate = text;
                this.toDoLists[0].items[i].description = document.getElementById("updateDescription-"+this.toDoLists[0].items[i].id).innerHTML;
                this.toDoLists[0].items[i].status = document.getElementById("button-"+this.toDoLists[0].items[i].id).innerHTML;
                }    
            }
        
            //한글 문제1
            this.toDoLists[listIndex] = this.toDoLists[0];
            this.toDoLists[0]= listToLoad
            this.view.refreshLists(this.toDoLists);

            this.currentList = listToLoad;
            this.view.viewList(this.currentList);
        }
    }
    /**
     * Redo the current transaction if there is one.
     */
    redo() {
        if (this.tps.hasTransactionToRedo()) {
            this.tps.doTransaction();
        }
    }   

    /**
     * Remove the itemToRemove from the current list and refresh.
     */
    removeItem(itemToRemove) {
        this.currentList.removeItem(itemToRemove);
        this.view.viewList(this.currentList);
    }

    /**
     * Finds and then removes the current list.
     */
    removeCurrentList() { 
        let indexOfList = -1;
        for (let i = 0; (i < this.toDoLists.length) && (indexOfList < 0); i++) {
            if (this.toDoLists[i].id === this.currentList.id) {
                indexOfList = i;
            }
        }
        this.toDoLists.splice(indexOfList, 1); 
        this.currentList = null;
        this.view.clearItemsList();
        this.view.refreshLists(this.toDoLists);
        
        
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
    }

    // WE NEED THE VIEW TO UPDATE WHEN DATA CHANGES.
    setView(initView) {
        this.view = initView;
    }

    /**
     * Undo the most recently done transaction if there is one.
     */
    undo() {
        if (this.tps.hasTransactionToUndo()) {
            this.tps.undoTransaction();
        }
    }

    updateWorkspace(){
        let list = this.toDoLists[0];
        var self = this;
        for (let i = 0; i < list.items.length; i++) {
            document.getElementById("updateDescription-"+ list.items[i].id).addEventListener('blur' , function(){
                self.addNewWorkspaceTransaction();
            });
            document.getElementById("updateDate-"+ list.items[i].id).addEventListener('blur' , function(){
                self.addNewWorkspaceTransaction();
            });
            document.getElementById("drop-content-"+ list.items[i].id).onchange = function(){
                self.addNewWorkspaceTransaction();
                for(let i=0; i< list.items.length; i++){
                    if(list.items[i].status == "complete"){
                        document.getElementById("button-"+ list.items[i].id).style.color = '#8ed4f8';
                    }
                    else if(list.items[i].status == "incomplete" ){
                        document.getElementById("button-"+ list.items[i].id).style.color = '#ffc800';
                    }
                }
                
            }

            document.getElementById("upbutton-"+ list.items[i].id).onclick = function(){
                self.addUpButton_Transaction(list.items[i].id);
            }
            document.getElementById("downbutton-"+ list.items[i].id).onclick = function(){
                self.addDownButton_Transaction(list.items[i].id);
            }
            document.getElementById("closebutton-"+ list.items[i].id).onclick = function(){
                self.addNewWorkspaceTransaction();
            }
        }
    
    }

    up(id){
        let index =0;
                let tmp = [];
                for(let j=0; j<this.toDoLists[0].items.length; j++){
                    if(this.toDoLists[0].items[j].id == id){
                        index = j;
                    }
                }
                if(index>0){
                    tmp = this.toDoLists[0].items[index-1];
                    this.toDoLists[0].items[index-1] = this.toDoLists[0].items[index];
                    this.toDoLists[0].items[index] = tmp;
                    this.currentList = this.toDoLists[0];
                    this.view.viewList(this.currentList);
                }
    }

    down(id){
        let index =0;
                let tmp = [];
                for(let j=0; j<this.toDoLists[0].items.length; j++){
                    if(this.toDoLists[0].items[j].id == id){
                        index = j;
                    }
                }
                if(index+1 !== this.toDoLists[0].items.length ){
                    tmp = this.toDoLists[0].items[index+1];
                    this.toDoLists[0].items[index+1] = this.toDoLists[0].items[index];
                    this.toDoLists[0].items[index] = tmp;
                    this.currentList = this.toDoLists[0];
                    this.view.viewList(this.currentList);
                }
    }

    changeList(id){
        let changelist = this.toDoLists[id];
        if(id==0){
            this.view.viewList(changelist);
        }
        
    }

    updateChange(){
        
        //update todolist      
        for (let i = 0; i < this.toDoLists[0].items.length; i++) {
            if(document.getElementById("updateDate-"+this.toDoLists[0].items[i].id) != null){
            var text = document.getElementById("updateDate-"+this.toDoLists[0].items[i].id).value;
            this.toDoLists[0].items[i].dueDate = text;
            this.toDoLists[0].items[i].description = document.getElementById("updateDescription-"+this.toDoLists[0].items[i].id).innerHTML;
            this.toDoLists[0].items[i].status = document.getElementById("drop-content-"+this.toDoLists[0].items[i].id).value;
            }    
        }
        this.currentList = this.toDoLists[0];
        return this.currentList;
    }

    updatePrev(){
        let previousLists = this.deepCopy(this.toDoLists);
        return previousLists[0];
    }
    currentObj(obj){
        for (let i = 0; i < this.toDoLists[0].items.length; i++) {
            if(document.getElementById("updateDate-"+this.toDoLists[0].items[i].id) != null){
            obj.items[i].dueDate = document.getElementById("updateDate-"+this.toDoLists[0].items[i].id).value;
            obj.items[i].description = document.getElementById("updateDescription-"+this.toDoLists[0].items[i].id).innerHTML;
            obj.items[i].status = document.getElementById("drop-content-"+this.toDoLists[0].items[i].id).value;
            }
        }
        return obj;
    }

    deepCopy(obj) {
        if (obj === null || typeof(obj) !== "object") {
          return obj;
        }
          
        let copy = {};
        for(let key in obj) {
          copy[key] = this.deepCopy(obj[key]);
        }
        return copy;
    }

    objectToArray(obj){
        let totalid=0;
        for(let i=0; i< this.toDoLists.length;i++){
            if(this.toDoLists[i].id == obj.id){
                totalid = i;
            }
        }

        length = Object.keys(obj.items).length;
        let description;
        let due_date;
        let status;
        let id;

        for(let i =0; i<length; i++){
            id = obj.items[i].id;    
            description = obj.items[i].description;
            due_date = obj.items[i].dueDate;
            status = obj.items[i].status;
            let loadItem = new ToDoListItem();
            loadItem.setID(id);
            loadItem.setDescription(description);
            loadItem.setDueDate(due_date);
            loadItem.setStatus(status);
        
            this.toDoLists[totalid].items[i] = loadItem;
        }

        
        return totalid;
    }

    initializeWorkSpace(){
        this.view.viewList(null);
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
    }
    
      
      

}