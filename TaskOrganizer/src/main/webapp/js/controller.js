import TaskList from './tasklist.js'
import TaskBox from './taskbox.js'

customElements.define('task-list', TaskList);
customElements.define('task-box', TaskBox);

const taskl = document.querySelector("TASK-LIST")
const taskb = document.querySelector("TASK-BOX")


taskb.newtaskCallback(addTasks);
taskl.changestatusCallback(update);
taskl.deleteTaskCallback(deleteTask);
taskl.addTaskCallback(taskb.show.bind(taskb));
init();



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

async function update(id,status) {
    const data = {
        "status" : status
    }




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


function init() {
    getStatuses();
    showTasks()
}