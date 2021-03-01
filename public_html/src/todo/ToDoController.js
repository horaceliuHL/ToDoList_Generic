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

        // SETUP ALL THE EVENT HANDLERS SINCE THEY USE THE MODEL
        document.getElementById("add-list-button").onmousedown = function() {
            appModel.addNewList();
            // console.log(appModel.toDoLists.length);
            appModel.loadList(appModel.toDoLists[0].id);
            document.getElementById("todo-list-" + appModel.toDoLists[0].id).style.backgroundColor = "#ffc819";
            // console.log(appModel.toDoLists[0])
            
        }
        document.getElementById("undo-button").onmousedown = function() {
            appModel.undo();
        }
        document.getElementById("redo-button").onmousedown = function() {
            appModel.redo();
        }
        document.getElementById("delete-list-button").onmousedown = function() {
            var modal = document.querySelector(".modal");
            var closeButton = document.querySelector(".close-button");
            var confirmButton = document.querySelector(".confirm-button");
            var cancelButton = document.querySelector(".cancel-button");
            modal.classList.toggle("show-modal");
            closeButton.onclick = function () {
                modal.classList.toggle("show-modal");
            }
            confirmButton.onclick = function () {
                appModel.removeCurrentList();
                modal.classList.toggle("show-modal");
            }
            cancelButton.onclick = function() {
                modal.classList.toggle("show-modal");
            }
        }
        document.getElementById("add-item-button").onmousedown = function() {
            appModel.addNewItemTransaction();
        }  
        document.getElementById("close-list-button").onmousedown = function() {
            appModel.closeList();
        }
    }
    
    // PROVIDES THE RESPONSE TO WHEN A USER CLICKS ON A LIST TO LOAD
    handleLoadList(listId) {
        // UNLOAD THE CURRENT LIST AND INSTEAD LOAD THE CURRENT LIST
        this.model.loadList(listId);
    }

    handleChangeListName(name, id){
        this.model.changeListName(name, id);
    }

    handleChangeTask(oldText, newText, id){
        this.model.changeTaskTransaction(oldText, newText, id);
    }

    handleChangeDate(oldDate, newDate, id){
        this.model.changeDateTransaction(oldDate, newDate, id);
    }

    handleStatusChange(oldStatus, newStatus, id){
        this.model.changeStatusTransaction(oldStatus, newStatus, id);
    }

    handleMoveItemUp(item){
        this.model.moveItemUpTransaction(item);
    }

    handleMoveItemDown(item){
        this.model.moveItemDownTransaction(item);
    }

    handleDeleteItem(item){
        this.model.deleteItemTransaction(item);
    }

    handleResetTransactions(){
        this.model.resetTransactions();
    }
}