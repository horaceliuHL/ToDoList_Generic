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
    }
    
    // PROVIDES THE RESPONSE TO WHEN A USER CLICKS ON A LIST TO LOAD
    handleLoadList(listId) {
        // UNLOAD THE CURRENT LIST AND INSTEAD LOAD THE CURRENT LIST
        this.model.loadList(listId);
    }
}