import TaskList from './tasklist.js'
import TaskBox from './taskbox.js'

customElements.define('task-list', TaskList);
customElements.define('task-box', TaskBox);

// creating the tasklist and taskbox elements and intitializing them.
const taskl = document.querySelector("TASK-LIST")
const taskb = document.querySelector("TASK-BOX")


taskb.newtaskCallback(addTasks);
taskl.changestatusCallback(update);
taskl.deleteTaskCallback(deleteTask);
taskl.addTaskCallback(taskb.show.bind(taskb));
init();


/**
	This function fetches a list of options that the TASKLIST component uses.
 */
async function getStatuses() {
    try {
        const response = await fetch("../TaskServices/api/services/allstatuses", {method: "GET"});
		const object = await response.json()

        if(object.responseStatus) {
            taskb.setStatusesList(object.allstatuses)
            taskl.setStatusesList(object.allstatuses)
			
        }
    } catch(e) {
        console.log(e.message)
    }
}
/**
	Function that fetches tasklist from database and passes them to the TASKLIST component to be displayed.
 */
async function showTasks() {
    try {
        const response = await fetch("../TaskServices/api/services/tasklist", {method: "GET"});
		const object = await response.json()

        if(object.responseStatus) {
            object.tasks.forEach((x) => taskl.showTask(x));
			taskl.enableAddTask();
			
        }
    } catch(e) {
		taskl.noTask()
        console.log(e.message)
    }
}
/**
*	Function that makes a POST request to the server, that will save the task in the database.
	@param {object} t - object that contains task title and status.
 */
async function addTasks(t) {
 
	const data = {
		'title': t.title,
		'status': t.status
	}

    const requestSettings = {
        "method" : "POST",
        "headers" : { "Content-Type": "application/json; charset=utf-8" },
        "body" : JSON.stringify(data),
        "cache" : "no-cache",
        "redirect" : "error"
        
    };
    try {
        const response = await fetch("../TaskServices/api/services/task", requestSettings);
        const object = await response.json();
        if(object.responseStatus) {
			taskl.showTask(object);
			document.location.reload();
		}
    } catch(e) {
        console.log(e.message)
    }
}

/**
	Updates the status of a task in the TaskList.
	@param {integer} id - id of the task to be updated.
	@param {string} status - the status that we want to change to.
 */
async function update(id,status) {
    const data = {
        "status" : status
    };

    const requestSettings = {
        "method" : "PUT",
        "headers" : { "Content-Type": "application/json; charset=utf-8" },
        "body" : JSON.stringify(data),
        "cache" : "no-cache",
        "redirect" : "error"
        
    };

    try {
        const response = await fetch(`../TaskServices/api/services/task/${id}`, requestSettings);
        const object = await response.json();
        if(object.responseStatus) taskl.updateTask(object);
    } catch(e) {
        console.log(e.message)
    }
}
/**
	Deletes a task from the database given its id number.
	@param {integer} id - id of the task to be deleted from the database.
 */
async function deleteTask(id) {

    try {
        const response = await fetch(`../TaskServices/api/services/task/${id}`, {method : "DELETE"});
        const object = await response.json();
        if(object.responseStatus)
        taskl.removeTask(object.id);
    } catch(e) {
        console.log(e.message)
    }
}
/**
	Init function.
 */
function init() {
    getStatuses();
    showTasks()
}