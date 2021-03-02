'use strict'

// IMPORT ALL THE THINGS NEEDED FROM OTHER JAVASCRIPT SOURCE FILES
import { jsTPS_Transaction } from "../../common/jsTPS.js"

// THIS TRANSACTION IS FOR ADDING A NEW ITEM TO A TODO LIST
export default class Workspace_Transaction extends jsTPS_Transaction {
    constructor(initModel, futureModel) {
        super();
        this.model = initModel;
        this.fModel = futureModel;
    }

    //todolist update
    doTransaction() {
        this.prev = this.model.updatePrev();

        let id = this.model.objectToArray(this.fModel);
        this.model.changeList(id);
        this.changedmodel= this.model.updateChange();
    
    }

    undoTransaction() {
        let id = this.model.objectToArray(this.prev);
        this.model.changeList(id);
        this.changedmodel= this.model.updateChange();
    }
}