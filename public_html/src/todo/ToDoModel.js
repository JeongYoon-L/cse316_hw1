'use strict'

import ToDoList from './ToDoList.js'
import ToDoListItem from './ToDoListItem.js'
import jsTPS from '../common/jsTPS.js'
import AddNewItem_Transaction from './transactions/AddNewItem_Transaction.js'
import Workspace_Transaction from './transactions/Workspace_Transaction.js'
import UpButton_Transaction from './transactions/UpButton_Transaction.js'
import DownButton_Transaction from './transactions/DownButton_Transaction.js'
import DeleteItem_Transaction from './transactions/DeleteItem_Transaction.js'

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

        let transaction = new AddNewItem_Transaction(this);
        this.tps.addTransaction(transaction);
        var self = this;
        for (let i = 0; i < this.toDoLists[0].items.length; i++) {
            if(document.getElementById("updateDateDiv-"+this.toDoLists[0].items[i].id) != null){
            var text = document.getElementById("updateDateDiv-"+this.toDoLists[0].items[i].id).innerHTML;
            this.toDoLists[0].items[i].dueDate = text;
            this.toDoLists[0].items[i].description = document.getElementById("updateDescription-"+this.toDoLists[0].items[i].id).innerHTML;
            this.toDoLists[0].items[i].status = document.getElementById("updateStatus-"+this.toDoLists[0].items[i].id).innerHTML;
            }    
        }
        this.currentList = this.toDoLists[0];
        self.forColorModel();
    }

    /**
     * addNewWorkspaceTransaction
     * 
     * Creates a new transaction for editing an item(description, duedate, status) and adds it to the transaction stack.
     */
    addNewWorkspaceTransaction(){
        var self = this;
        let transaction = new Workspace_Transaction(this,self.currentObj(self.updatePrev()));
        this.tps.addTransaction(transaction);
        self.forColorModel();
        
    }

    /**
     * addUpButton_Transaction
     * 
     * @param id the item id that I clicked.
     * Creates a new transaction for editing an item(up button) and adds it to the transaction stack.
     */
    addUpButton_Transaction(id){
        var self = this;
        let transaction = new UpButton_Transaction(this,id);
        this.tps.addTransaction(transaction);
        self.forColorModel();
    }
    /**
     * addDownButton_Transaction
     * 
     *  @param id the item id that I clicked.
     * Creates a new transaction for editing an item(down button) and adds it to the transaction stack.
     */
    addDownButton_Transaction(id){
        var self = this;
        let transaction = new DownButton_Transaction(this,id);
        this.tps.addTransaction(transaction);
        self.forColorModel();
    }

    /**
     * deleteItemButton_Transaction
     * 
     * @param id the item id that I clicked.
     * Creates a new transaction for editing an item(delete button) and adds it to the transaction stack.
     */
    deleteItemButton_Transaction(id){
        var self = this;
        let transaction = new DeleteItem_Transaction(this,id);
        this.tps.addTransaction(transaction);
        self.forColorModel();
    }

    /**
     * forColorModel()
     * 
     * Button disable/able control after doing transaction work.
     */
    forColorModel(){
        if((this.tps.mostRecentTransaction == -1)){ 
            document.getElementById('undo-button').disabled = true;
            document.getElementById('undo-button').style.pointerEvents = "none";
            document.getElementById('undo-button').style.color = "#322D2D";
        }
        else{
            document.getElementById('undo-button').disabled = false;
            document.getElementById('undo-button').style.pointerEvents = "auto";
            document.getElementById('undo-button').style.color = "#e9edf0";
        }
        if((this.tps.mostRecentTransaction+1) < this.tps.numTransactions){
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
    /**
     * addNewList
     * 
     * This function makes a new list and adds it to the application. The list will
     * have initName as its name.
     * 
     * @param {*} initName The name of this to add.
     */
    addNewList(initName) { 
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

        this.tps = new jsTPS(); //initialize Transaction when loading new List
        let self = this;
        self.forColorModel();

        document.getElementById('add-list-button').disabled = true;
        document.getElementById('add-list-button').style.pointerEvents = "none";
        document.getElementById('add-list-button').style.color = "#322D2D";
        
        document.getElementById('add-item-button').disabled = false;
        document.getElementById('add-item-button').style.pointerEvents = "auto";
        document.getElementById('add-item-button').style.color = "#e9edf0";

        document.getElementById('delete-list-button').disabled = false;
        document.getElementById('delete-list-button').style.pointerEvents = "auto";
        document.getElementById('delete-list-button').style.color = "#e9edf0";


        document.getElementById('close-list-button').disabled = false;
        document.getElementById('close-list-button').style.pointerEvents = "auto";
        document.getElementById('close-list-button').style.color = "#e9edf0";

        let listIndex = -1;
        for (let i = 0; (i < this.toDoLists.length) && (listIndex < 0); i++) {
            if (this.toDoLists[i].id === listId)
                listIndex = i;
        }
        if (listIndex >= 0) {
            let listToLoad = this.toDoLists[listIndex];

            for (let i = 0; i < this.toDoLists[0].items.length; i++) {
                if(document.getElementById("updateDateDiv-"+this.toDoLists[0].items[i].id) != null){
                var text = document.getElementById("updateDateDiv-"+this.toDoLists[0].items[i].id).innerHTML;
                this.toDoLists[0].items[i].dueDate = text;
                this.toDoLists[0].items[i].description = document.getElementById("updateDescription-"+this.toDoLists[0].items[i].id).innerHTML;
                this.toDoLists[0].items[i].status = document.getElementById("updateStatus-"+this.toDoLists[0].items[i].id).innerHTML;
                }    
            }
        
            //move selected List on top
            this.toDoLists[listIndex] = this.toDoLists[0];
            this.toDoLists[0]= listToLoad
            this.view.refreshLists(this.toDoLists);

            this.currentList = listToLoad;
            this.view.viewList(this.currentList);

            document.getElementById('todo-list-'+ this.toDoLists[0].id ).style.backgroundColor = "#ffc800";
            document.getElementById('todo-list-'+ this.toDoLists[0].id ).style.color = "black";
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
        document.getElementById('add-item-button').style.color = "#322D2D";

        document.getElementById('delete-list-button').disabled = true;
        document.getElementById('delete-list-button').style.pointerEvents = "none";
        document.getElementById('delete-list-button').style.color = "#322D2D";

        document.getElementById('close-list-button').disabled = true;
        document.getElementById('close-list-button').style.pointerEvents = "none";
        document.getElementById('close-list-button').style.color = "#322D2D";
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

    /**
     * Get information about updated work in Workspace
     * 
     * if the information is not changed, I didn't add transaction. 
     * Transaction only works when the value change.
     */
    updateWorkspace(){

        let list = this.toDoLists[0];
        var self = this;
        for (let i = 0; i < list.items.length; i++) {

            document.getElementById("updateDescription-"+ list.items[i].id).addEventListener('blur' , function(){
                if(list.items[i].description != document.getElementById("updateDescription-"+ list.items[i].id).innerHTML &&document.getElementById("updateDescription-"+ list.items[i].id).innerHTML != null){
                    self.addNewWorkspaceTransaction();
                }
            });

            document.getElementById("updateDateDiv-"+ list.items[i].id).onclick = function(){
                document.getElementById("updateDateDiv-"+ list.items[i].id).style.display = "none";
                document.getElementById("updateDate-"+ list.items[i].id).style.display = "block";
                document.getElementById("updateDate-"+ list.items[i].id).focus();
            }

            document.getElementById("updateDate-"+ list.items[i].id).addEventListener('blur' , function(){
                if(list.items[i].dueDate != document.getElementById("updateDate-"+ list.items[i].id).value &&document.getElementById("updateDate-"+ list.items[i].id).value != null){
                    document.getElementById("updateDateDiv-"+ list.items[i].id).innerHTML = document.getElementById("updateDate-"+ list.items[i].id).value;    
                    self.addNewWorkspaceTransaction();
                }
                document.getElementById("updateDate-"+ list.items[i].id).style.display = "none";
                document.getElementById("updateDateDiv-"+ list.items[i].id).style.display = "block";
            });
            
            document.getElementById("updateStatus-"+ list.items[i].id).onclick = function(){
                document.getElementById("updateStatus-"+ list.items[i].id).style.display = "none";
                document.getElementById("drop-content-"+ list.items[i].id).style.display = "block";
                document.getElementById("drop-content-"+ list.items[i].id).focus();

            }
            
            document.getElementById("drop-content-"+ list.items[i].id).addEventListener('blur' , function(){
                if(list.items[i].status != document.getElementById("drop-content-"+ list.items[i].id).value &&document.getElementById("drop-content-"+ list.items[i].id).value != null){
                    self.addNewWorkspaceTransaction();
                }
                for(let i=0; i< list.items.length; i++){
                    if(list.items[i].status == "complete" && document.getElementById("updateStatus-"+ list.items[i].id) != null){
                        document.getElementById("updateStatus-"+ list.items[i].id).innerHTML = "complete";
                        document.getElementById("updateStatus-"+ list.items[i].id).style.color = '#8ed4f8';
                    }
                    else if(list.items[i].status == "incomplete" && document.getElementById("updateStatus-"+ list.items[i].id) != null ){
                        document.getElementById("updateStatus-"+ list.items[i].id).innerHTML = "incomplete";
                        document.getElementById("updateStatus-"+ list.items[i].id).style.color = '#ffc800';
                    }
                }
                document.getElementById("drop-content-"+ list.items[i].id).style.display = "none";
                document.getElementById("updateStatus-"+ list.items[i].id).style.display = "block";
            });

            document.getElementById("upbutton-"+ list.items[i].id).onclick = function(){
                self.addUpButton_Transaction(list.items[i].id);
            }
            document.getElementById("downbutton-"+ list.items[i].id).onclick = function(){
                self.addDownButton_Transaction(list.items[i].id);
            }
            document.getElementById("closebutton-"+ list.items[i].id).onclick = function(){
                self.deleteItemButton_Transaction(list.items[i].id);
            }
        }
    
    }

    /**
     * For changing order of items when click up button
     * @param {*} id 
     */
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

    /**
     * For changing order of items when click down button
     * @param {*} id 
     */
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

    /**
     * For changing order of items when click delete button
     * @param {*} id 
     */
    delete(id){
        let index =0;
        for(let j=0; j<this.toDoLists[0].items.length; j++){
            if(this.toDoLists[0].items[j].id == id){
                index = j;
            }
        }
        this.toDoLists[0].items.splice(index,1);
        this.currentList = this.toDoLists[0];
        this.view.viewList(this.curentList);
    }

    changeList(id){
        let changelist = this.toDoLists[id];
        if(id==0){
            this.view.viewList(changelist);
        }
        
    }

    /**
     * For updating todoLists when we edit some items. 
     */
    updateChange(){
        
        //update todolist      
        for (let i = 0; i < this.toDoLists[0].items.length; i++) {
            if(document.getElementById("updateDateDiv-"+this.toDoLists[0].items[i].id) != null){
            var text = document.getElementById("updateDateDiv-"+this.toDoLists[0].items[i].id).innerHTML;
            this.toDoLists[0].items[i].dueDate = text;
            this.toDoLists[0].items[i].description = document.getElementById("updateDescription-"+this.toDoLists[0].items[i].id).innerHTML;
            this.toDoLists[0].items[i].status = document.getElementById("drop-content-"+this.toDoLists[0].items[i].id).value;
            }    
        }
        this.currentList = this.toDoLists[0];
        return this.currentList;
    }

    currentObj(obj){
        for (let i = 0; i < this.toDoLists[0].items.length; i++) {
            if(document.getElementById("updateDateDiv-"+this.toDoLists[0].items[i].id) != null){
            obj.items[i].dueDate = document.getElementById("updateDateDiv-"+this.toDoLists[0].items[i].id).innerHTML;
            obj.items[i].description = document.getElementById("updateDescription-"+this.toDoLists[0].items[i].id).innerHTML;
            obj.items[i].status = document.getElementById("drop-content-"+this.toDoLists[0].items[i].id).value;
            }
        }
        return obj;
    }

    /**
     * Get previous todoList[0] with type obj
     */
    updatePrev(){
        let previousLists = this.deepCopy(this.toDoLists);
        return previousLists[0];
    }

    /**
     * Do deep copy of previous Lists.
     */
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

    /**
     * Changing obj type to Array to use for todoLists.
     * 
     * @param {*} obj 
     * @returns Current ID
     */
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

    /**
     * Initialize Workspace when click delete-list-button
     */
    initializeWorkSpace(){
        this.view.viewList(null);
        document.getElementById('todo-list-'+ this.toDoLists[0].id ).style.backgroundColor = "#353a44";
        document.getElementById('todo-list-'+ this.toDoLists[0].id ).style.color = "var(--swatch-text)";

        document.getElementById('add-list-button').disabled = false;
        document.getElementById('add-list-button').style.pointerEvents = "auto";
        document.getElementById('add-list-button').style.color = "var(--swatch-text-accent)";
        
        document.getElementById('add-item-button').disabled = true;
        document.getElementById('add-item-button').style.pointerEvents = "none";
        document.getElementById('add-item-button').style.color = "#322D2D";
        

        document.getElementById('delete-list-button').disabled = true;
        document.getElementById('delete-list-button').style.pointerEvents = "none";
        document.getElementById('delete-list-button').style.color = "#322D2D";


        document.getElementById('close-list-button').disabled = true;
        document.getElementById('close-list-button').style.pointerEvents = "none";
        document.getElementById('close-list-button').style.color = "#322D2D";

        document.getElementById('undo-button').disabled = true;
        document.getElementById('undo-button').style.pointerEvents = "none";
        document.getElementById('undo-button').style.color = "#322D2D";

        document.getElementById('redo-button').disabled = true;
        document.getElementById('redo-button').style.pointerEvents = "none";
        document.getElementById('redo-button').style.color = "#322D2D";

    }

}