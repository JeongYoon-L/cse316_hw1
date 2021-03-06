'use strict'

// IMPORT ALL THE THINGS NEEDED FROM OTHER JAVASCRIPT SOURCE FILES
import { jsTPS_Transaction } from "../../common/jsTPS.js"

// THIS TRANSACTION IS FOR ADDING A NEW ITEM TO A TODO LIST
export default class UpButton_Transaction extends jsTPS_Transaction {
    constructor(initModel, id) {
        super();
        this.model = initModel;
        this.id = id;
    }

    //todolist update
    doTransaction() {
        this.prev = this.model.updatePrev();

        this.model.up(this.id);
        this.model.view.viewList(this.model.currentList);
    
    }

    undoTransaction() {
        let id = this.model.objectToArray(this.prev);
        this.model.changeList(id);
        this.changedmodel= this.model.updateChange();
        this.model.view.viewList(this.model.currentList);
    }
}