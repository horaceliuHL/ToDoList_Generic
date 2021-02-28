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
        listElement.setAttribute("class", "todo_button_item");
        listElement.appendChild(document.createTextNode(newList.name));
        listsElement.appendChild(listElement);

        // SETUP THE HANDLER FOR WHEN SOMEONE MOUSE CLICKS ON OUR LIST
        let thisController = this.controller;
        let clicked = 0;
        let timer;
        listElement.addEventListener('click', function(e) {
            listElement.style.userSelect = 'none';
            clicked++;
            if (clicked == 1){
                timer = setTimeout(function(){
                    thisController.handleLoadList(newList.id);
                    document.getElementById(newListId).style.backgroundColor = "#ffc819";
                }, 200);
            } else if (clicked == 2){
                clearTimeout(timer);
                clicked = 0;
                console.log("double clicked!");
                listElement.setAttribute("contentEditable", "true");
                // listElement.childNodes[0].innerHTML = listElement.textContent;
                // console.log(listsElement)
            }
            thisController.handleResetTransactions();
        })
        listElement.onblur = function () {
            listElement.style.contentEditable = false;
            thisController.handleChangeListName(listElement.textContent, newList.id);
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
        // WE'LL BE ADDING THE LIST ITEMS TO OUR WORKSPACE
        let itemsListDiv = document.getElementById("todo-list-items-div");

        // GET RID OF ALL THE ITEMS
        this.clearItemsList();

        for (let i = 0; i < list.items.length; i++) {
            // NOW BUILD ALL THE LIST ITEMS
            let listItem = list.items[i];
            let listItemElement = "<div id='todo-list-item-" + listItem.id + "' class='list-item-card2'>"
                                + "<div id='todo-description-" + listItem.id + "' class='task-col1'>" + listItem.description + "</div>"
                                + "<div id='todo-date-" + listItem.id + "' class='due-date-col1'>" + listItem.dueDate + "</div>"
                                + "<input id='todo-date1-" + listItem.id + "' class='due-date-col1' type='date' style='display:none'>"
                                + "<div id='todo-status-" + listItem.id + "' class='status-col1'>" + listItem.status + "</div>"
                                + "<select id='todo-status1-" + listItem.id + "' class='status-col1' style='display:none'><option value='complete'>complete</option><option value='incomplete'>incomplete</option></select>"
                                + "<div class='list-controls-col'>"
                                + " <div id='todo-up-" + listItem.id + "' class='list-item-control material-icons'>keyboard_arrow_up</div>"
                                + " <div id='todo-down-" + listItem.id + "' class='list-item-control material-icons'>keyboard_arrow_down</div>"
                                + " <div id='todo-close-" + listItem.id + "' class='list-item-control material-icons'>close</div>"
                                + " <div class='list-item-control'></div>"
                                + " <div class='list-item-control'></div>"
                                + "</div>"
                                + "</div>"
                                + "<div style='border-bottom: thin'></div>";
                                
            itemsListDiv.innerHTML += listItemElement;
        }

        for (let i = 0; i < list.items.length; i++){
            let controller = this.controller;
            let listItem = list.items[i];

            let desc = document.getElementById("todo-description-" + listItem.id);
            let tempTask;
            desc.onclick = function () { tempTask = desc.innerHTML; desc.contentEditable = true; }
            desc.onblur = function() { 
                desc.contentEditable = false; 
                controller.handleChangeTask(tempTask, desc.textContent, i);
            }

            let date1 = document.getElementById("todo-date1-" + listItem.id);
            let date = document.getElementById("todo-date-" + listItem.id);
            let oldDate;
            let storeDateTemp;
            date.onclick = function () {
                oldDate = date.innerHTML;
                date.style.display = 'none';
                date1.style.display = '';
            }
            date1.addEventListener('change', (e) => {
                storeDateTemp = e.target.value;
            })
            date1.onblur = function(){
                date1.style.display = 'none';
                date.innerHTML = storeDateTemp;
                date.style.display = ''
                controller.handleChangeDate(oldDate, storeDateTemp, i)
            }

            let status1 = document.getElementById("todo-status1-" + listItem.id);
            let status = document.getElementById("todo-status-" + listItem.id);
            let oldStatus;
            let storeStatusTemp;
            status.onclick = function() {
                oldStatus = status.innerHTML;
                storeStatusTemp = status.innerHTML;
                status.style.display = 'none';
                status1.value = status.textContent;
                status1.style.display = '';
            }
            status1.addEventListener('change', (e) => {
                storeStatusTemp = e.target.value;
            })
            status1.onblur = function() {
                status1.style.display = 'none';
                status.innerHTML = storeStatusTemp;
                status.style.display = '';
                controller.handleStatusChange(oldStatus, storeStatusTemp, i);
                // list.items[i].setStatus(storeStatusTemp);
            }

            let moveUp = document.getElementById("todo-up-" + listItem.id);
            moveUp.onclick = function () {
                controller.handleMoveItemUp(listItem);
            }

            let moveDown = document.getElementById("todo-down-" + listItem.id);
            moveDown.onclick = function () {
                controller.handleMoveItemDown(listItem);
            }

            let deleteItem = document.getElementById("todo-close-" + listItem.id);
            deleteItem.onclick = function () {
                controller.handleDeleteItem(listItem);
            }

        }
        
    }

    // THE VIEW NEEDS THE CONTROLLER TO PROVIDE PROPER RESPONSES
    setController(initController) {
        this.controller = initController;
    }
}