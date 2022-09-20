export default class taskBox extends HTMLElement {

    #shadow;
    #callback;


    constructor() {
        super();
        this.#shadow = this.attachShadow({ mode: 'closed' });
        this.#createHTML();
        this.#shadow.getElementById("addBtn").addEventListener("click", this.#newTask.bind(this))
        this.#shadow.getElementById("closeBtn").addEventListener("click", () => this.close())
    }

    show() {
        this.#shadow.querySelector("dialog").showModal()
    }



   close () {
        this.#shadow.querySelector("dialog").close()

    }




    setStatusesList(names) {
        const elem = this.#shadow.querySelector("select");
        let out = "";
        names.forEach(x =>  out = out.concat(`<option value=${x}>${x}</option>`))
        elem.insertAdjacentHTML('beforeend',out);
    }

    newtaskCallback(callback) {
        this.#callback = callback;
    }


    #newTask(event) {
        const task = {
            "title" : this.#shadow.getElementById("newTasktxt").value,
            "status" : this.#shadow.querySelector("select").value
        }
        if(this.#callback != null) this.#callback(task)
        
    }

   
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