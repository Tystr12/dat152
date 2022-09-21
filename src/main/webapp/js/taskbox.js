export default class taskBox extends HTMLElement {
	// private attributes
    #shadow;
    #callback;

	/**Represents a TaskBox @constructor */
    constructor() {
        super();
        this.#shadow = this.attachShadow({ mode: 'closed' });
        this.#createHTML();
        this.#shadow.getElementById("addBtn").addEventListener("click", this.#newTask.bind(this))
        this.#shadow.getElementById("closeBtn").addEventListener("click", () => this.close())
    }
	/** Shows the taskbox modal. */
    show() {
        this.#shadow.querySelector("dialog").showModal()
    }
	
	/** Closes the dialog window. */	
   close () {
        this.#shadow.querySelector("dialog").close()

    }

	/**
		Sets statuses list in the dropdown select box.
		@param {array} names - array of statuses the new task can have.
	 */
    setStatusesList(names) {
        const elem = this.#shadow.querySelector("select");
        let out = "";
        names.forEach(x =>  out = out.concat(`<option value=${x}>${x}</option>`))
        elem.insertAdjacentHTML('beforeend',out);
    }
	
	/** Adds a new callback to the taskbox. @param {function} callback - callback to be added. */
    newtaskCallback(callback) {
        this.#callback = callback;
    }

	/** Creates a new task given the user input and saves the new task.
		@param {event} event - event that creates task.
	 */
    #newTask(event) {
        const task = {
            "title" : this.#shadow.getElementById("newTasktxt").value,
            "status" : this.#shadow.querySelector("select").value
        }
        if(this.#callback != null) this.#callback(task)
        
    }

   /** Contains the HTML that is attatched to the shadow document.*/
    #createHTML(){
        const html = `
            <label for="title">Title : </label>
            <input type="text" id="newTasktxt">
            <label for="status">Status : </label>
            <select id="select">
            </select>
            <button id=addBtn>Add task</button>
            <button id=closeBtn> X </button>


    `
    const wrapper = document.createElement('dialog');
    wrapper.id = "taskbox";
    wrapper.insertAdjacentHTML('beforeend', html);
    this.#shadow.appendChild(wrapper);
    return wrapper;
    }

}