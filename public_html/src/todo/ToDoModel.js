'use strict'

import ToDoList from './ToDoList.js'
import ToDoListItem from './ToDoListItem.js'
import jsTPS from '../common/jsTPS.js'
import AddNewItem_Transaction from './transactions/AddNewItem_Transaction.js'
import ChangeTask_Transaction from './transactions/ChangeTask_Transaction.js'
import ChangeDate_Transaction from './transactions/ChangeDate_Transaction.js'
import ChangeStatus_Transaction from './transactions/ChangeStatus_Transaction.js';
import MoveItemUp_Transaction from './transactions/MoveItemUp_Transaction.js';
import MoveItemDown_Transaction from './transactions/MoveItemDown_Transaction.js';
import DeleteItem_Transaction from './transactions/DeleteItem_Transaction.js';

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
        if (this.tps.hasTransactionToRedo()){
            this.view.showRedo();
        } else {
            this.view.hideRedo();
        }
        if (this.tps.hasTransactionToUndo()){
            this.view.showUndo();
        } else {
            this.view.hideUndo();
        }
    }

    changeTaskTransaction(oldText, newText, id) {
        let transaction = new ChangeTask_Transaction(this, oldText, newText, id);
        this.tps.addTransaction(transaction);
        if (this.tps.hasTransactionToRedo()){
            this.view.showRedo();
        } else {
            this.view.hideRedo();
        }
        if (this.tps.hasTransactionToUndo()){
            this.view.showUndo();
        } else {
            this.view.hideUndo();
        }
    }

    changeTask(text, id){
        this.currentList.items[id].setDescription(text);
        this.view.viewList(this.currentList);
    }

    changeDateTransaction(oldDate, newDate, id){
        let transaction = new ChangeDate_Transaction(this, oldDate, newDate, id);
        this.tps.addTransaction(transaction);
        if (this.tps.hasTransactionToRedo()){
            this.view.showRedo();
        } else {
            this.view.hideRedo();
        }
        if (this.tps.hasTransactionToUndo()){
            this.view.showUndo();
        } else {
            this.view.hideUndo();
        }
    }

    changeDate(date, id){
        this.currentList.items[id].setDueDate(date);
        this.view.viewList(this.currentList);
    }

    changeStatusTransaction(oldStatus, newStatus, id){
        let transaction = new ChangeStatus_Transaction(this, oldStatus, newStatus, id);
        this.tps.addTransaction(transaction);
        if (this.tps.hasTransactionToRedo()){
            this.view.showRedo();
        } else {
            this.view.hideRedo();
        }
        if (this.tps.hasTransactionToUndo()){
            this.view.showUndo();
        } else {
            this.view.hideUndo();
        }
    }

    changeStatus(status, id){
        this.currentList.items[id].setStatus(status);
        this.view.viewList(this.currentList);
    }

    moveItemUpTransaction(item){
        let transaction = new MoveItemUp_Transaction(this, item);
        this.tps.addTransaction(transaction);
        if (this.tps.hasTransactionToRedo()){
            this.view.showRedo();
        } else {
            this.view.hideRedo();
        }
        if (this.tps.hasTransactionToUndo()){
            this.view.showUndo();
        } else {
            this.view.hideUndo();
        }
    }

    moveItemUp(item){
        // console.log(this.currentList.items);
        let index = this.currentList.getIndexOfItem(item);
        let tempItem = this.currentList.items[index];
        this.currentList.items.splice(index, 1);
        if (index === 0){
            this.currentList.items.splice(0, 0, tempItem);
        } else {
            this.currentList.items.splice(index - 1, 0, tempItem);
        }
        this.view.viewList(this.currentList);
    }

    moveItemDownTransaction(item){
        let transaction = new MoveItemDown_Transaction(this, item);
        this.tps.addTransaction(transaction);
        if (this.tps.hasTransactionToRedo()){
            this.view.showRedo();
        } else {
            this.view.hideRedo();
        }
        if (this.tps.hasTransactionToUndo()){
            this.view.showUndo();
        } else {
            this.view.hideUndo();
        }
    }

    moveItemDown(item){
        let index = this.currentList.getIndexOfItem(item);
        let tempItem = this.currentList.items[index];
        this.currentList.items.splice(index, 1);
        if (index === this.currentList.items.length - 1){
            this.currentList.items.splice(this.currentList.items.length, 0, tempItem);
        } else {
            this.currentList.items.splice(index + 1, 0, tempItem);
        }
        this.view.viewList(this.currentList);
    }

    deleteItemTransaction(item){
        let transaction = new DeleteItem_Transaction(this, item);
        this.tps.addTransaction(transaction);
        if (this.tps.hasTransactionToRedo()){
            this.view.showRedo();
        } else {
            this.view.hideRedo();
        }
        if (this.tps.hasTransactionToUndo()){
            this.view.showUndo();
        } else {
            this.view.hideUndo();
        }
    }

    deleteItem(item){
        let index = this.currentList.getIndexOfItem(item);
        this.currentList.items.splice(index, 1);
        this.view.viewList(this.currentList);
        return [item, index];
    }

    restoreItem(array){
        this.currentList.items.splice(array[1], 0, array[0]);
        // this.currentList = list;
        this.view.viewList(this.currentList);
    }

    resetTransactions(){
        this.tps = new jsTPS();
    }

    changeListName(name, id){
        let list;
        for (let i = 0; i < this.toDoLists.length; i++){
            if (this.toDoLists[i].id === id){
                list = this.toDoLists[i];
            }
        }
        list.setName(name);
        this.view.refreshLists(this.toDoLists);
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
        if (initName){
            newList.setName(initName);
            this.toDoLists.push(newList);
        } else {
            this.toDoLists.unshift(newList);
        }
        // this.view.appendNewListToView(newList);
        this.view.refreshLists(this.toDoLists);
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
        this.resetTransactions();
        let listIndex = -1;
        for (let i = 0; (i < this.toDoLists.length) && (listIndex < 0); i++) {
            if (this.toDoLists[i].id === listId)
                listIndex = i;
        }
        if (listIndex >= 0) {
            this.view.showTopControls();
            this.view.hideUndo();
            this.view.hideRedo();
            let listToLoad = this.toDoLists[listIndex];

            this.toDoLists = this.toDoLists.filter(item => item !== listToLoad)
            this.toDoLists.unshift(listToLoad)
            // this.toDoLists = this.toDoLists.reverse();
            // console.log(this.toDoLists);
            this.view.refreshLists(this.toDoLists);

            this.currentList = listToLoad;
            this.view.viewList(this.currentList);
            
        }
    }

    closeList() {
        this.resetTransactions();
        this.view.hideUndo();
        this.view.hideRedo();
        this.view.hideTopControls();
        this.view.showAddList();
        this.currentList = null;
        this.view.clearItemsList();
        this.view.refreshLists(this.toDoLists);
    }

    /**
     * Redo the current transaction if there is one.
     */
    redo() {
        if (this.tps.hasTransactionToRedo()) {
            this.tps.doTransaction();
            
        }
        if (this.tps.hasTransactionToRedo()){
            this.view.showRedo();
        } else {
            this.view.hideRedo();
        }
        if (this.tps.hasTransactionToUndo()){
            this.view.showUndo();
        } else {
            this.view.hideUndo();
        }
    }   

    /**
     * Remove the itemToRemove from the current list and refresh.
     */
    removeItem(itemToRemove) {
        this.currentList.removeItem(itemToRemove);
        this.nextListItemId -= 1;
        this.view.viewList(this.currentList);
    }

    /**
     * Finds and then removes the current list.
     */
    removeCurrentList() {
        this.resetTransactions();
        this.view.hideUndo();
        this.view.hideRedo();
        this.view.hideTopControls();
        this.view.showAddList();
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
            // console.log(this.currentList.items)
        }
        if (this.tps.hasTransactionToRedo()){
            this.view.showRedo();
        } else {
            this.view.hideRedo();
        }
        if (this.tps.hasTransactionToUndo()){
            this.view.showUndo();
        } else {
            this.view.hideUndo();
        }
    } 
    
}