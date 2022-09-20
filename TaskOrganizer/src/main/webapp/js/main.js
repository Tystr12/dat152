import TaskList from './tasklist.js'
import TaskBox from './taskbox.js'
customElements.define('task-list', TaskList);
customElements.define('task-box', TaskBox);

const taskl = document.querySelector("TASK-LIST")
const taskb = document.querySelector("TASK-BOX")



taskl.addTaskCallback(taskb.show.bind(this));
