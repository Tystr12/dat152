export default class taskList extends HTMLElement {
	// private attributes
    #shadow;
    #callbacks = new Map();
    #count = 0;
    #statuses = [];
	
	/** Represents a taskList. @constructor */
    constructor() {
        super();
        this.#shadow = this.attachShadow({ mode: 'closed' })
        this.#createHTML();
        this.#shadow.getElementById('addBtn').addEventListener("click", this.#addTask.bind(this));

    }
 
	/**
		Displays a task to the screen by inserting HTML code with task data.
		@param {object} task - the task that will be displayed.
	 */
    showTask(task) {

        this.#count++;

        if(this.#count == 1) {
            this.#shadow.querySelector("table").insertAdjacentHTML("afterbegin","<tr id=header><th>Task</th><th>Status</th></tr>")
        }
        const content = `<tr id='tr${task.id}'><td id=title${task.id}>${task.title}</td><td id='status${task.id}'>${task.status}</td>${this.#makeButtons(task.id)}</tr>`
        this.#shadow.getElementById("header").insertAdjacentHTML('afterend', content);
        this.#shadow.getElementById('topText').innerHTML = "Found " + this.#count + " tasks."
        this.#shadow.querySelector("select").addEventListener("click", this.#statusChanged.bind(this));
        this.#shadow.querySelector("button.remove").addEventListener("click",this.#deleteTask.bind(this))
        this.#setStatuses()


    }
	/**
		Helper function that is used in showTask() to create remove and modify buttons for each task.
		@param {integer} id - id of the task that we need to make buttons for.
	 */
    #makeButtons(id) {
        return "<td><select name='modify' id='status" + id + "'></select> <button class='remove' id='remove" + id + "'>Remove</button></td>"
    }
	
	/** 
		Displays the updated status of a task by inserting new html.
		@param {string} status - the updated status of the task.
	*/
    updateTask(status) {
        this.#shadow.getElementById("status" + status.id).innerHTML = status.status;

    }

	/** 
		Removes a task from the tasklist given its id.
		@param {integer} id - the id of the task that will be removed.
	*/
    removeTask(id) {
        const obj = this.#shadow.getElementById("tr" + id);
        obj.remove();
        this.#count--;
        if(this.#count === 0) {
            this.#shadow.getElementById('topText').innerHTML = "No tasks were found"
            this.#shadow.getElementById('header').remove();
        } else {
            this.#shadow.getElementById('topText').innerHTML = "Found " + this.#count + " tasks."
        }
    }
	/** Saves the list of statuses we get from the server. 
		@param {array} names - list of possible statuses from server.
	*/
    setStatusesList(names) {
        this.#statuses = names;
    }
	/**
		Sets the statuses in the dropdown select menu that we retrieved from the server.
	 */
    #setStatuses() {
        const elem = this.#shadow.querySelector("select");
        let out = "<option selected>&lt;modify&gt</option>";
        this.#statuses.forEach(x =>  out = out.concat(`<option value=${x}>${x}</option>`))
        elem.insertAdjacentHTML('beforeend',out);
    }
    
    
	/** Enables the add task button so it is clickable. */
    enableAddTask() {
        this.#shadow.getElementById('addBtn').disabled = false;
    }   
	/** Method that calls the saved callback for the add task button.
		@param {event} event - event
	 */
    #addTask(event) {
        if (this.#callbacks.get("addTask") != null) this.#callbacks.get("addTask")()
    }
	/**
		Adds a callback to the callbacks array.
		@param {function} func - callback function that will be added to the callbacks array.
	 */
    addTaskCallback(func) {
        this.#callbacks.set('addTask', func)
    }

	/**
		Checks if status of a task is changed after an event and displays the correct status of the task.
		@param {event} event - Event parameter that contains a new status.
	 */
    #statusChanged(event) {
        if(this.#callbacks.get("status") != null && event.target.value != '<modify>') {
            const id = event.target.id.slice(-1)
            const newStatus = event.target.value
            if (window.confirm(`Set '${this.#shadow.getElementById('title' + id).innerHTML} to ${newStatus}`))
                this.#callbacks.get("status")(id, newStatus)
        }
    }
	/**
		Maps a callback to a status.
		@param {function} func - callback function to be mapped.
	 */
    changestatusCallback(func) {
        this.#callbacks.set('status', func);
        }



	/**
		Deletes a task from the tasklist.
		@param {event} event - event that contains the id of the task to be deleted.
	 */
    #deleteTask(event) {
        if(this.#callbacks.get("delete") != null) {
            const id = event.target.id.slice(-1)
            if(window.confirm(`Delete task ${this.#shadow.getElementById('title' + id).innerHTML}`)) {
                this.#callbacks.get("delete")(id)
            }
        }
    }    
    
    /**
		Deletes callback from array.
		@param {function} func - callback function to be deleted from callback array.
	 */
    deleteTaskCallback(func){
        this.#callbacks.set('delete', func)
    }


	/** Checks if there are any tasks. 'If not displays no tasks were found.' */
    noTask() {
        if(this.#count == 0) {
            this.#shadow.getElementById('topText').innerHTML = "No tasks were found"
            return true
        }
        return false
    }

	/** Contains the HTML that is attatched to the shadow document. */
    #createHTML() {
        const wrapper = document.createElement('div');
        wrapper.id = "wrapper";
        const content = "<p id='topText'>Waiting for server data</p> <Button id='addBtn' Disabled>New Task</button> <table></table>"
        wrapper.insertAdjacentHTML('beforeend', content);
        this.#shadow.appendChild(wrapper);
    }

}