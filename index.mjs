import { Constants } from "./constants.mjs"
import { internalStorage } from "./internalStorage.mjs"
import { generateToDoItemHTML } from "./dom.mjs"

const $todoList = document.querySelector("#todo-list");
const $title = document.querySelector('#title')
const $form = document.querySelector('#form')
const $completed = document.querySelector('#completed')

const state = {
    todos: [],
    form : {
        title:"",
        completed: false,
    }
}

const saveStateOnMemory = () =>{
    internalStorage.set('state', state)
}

const fetchToDos = async () => {
    try {
        const result = await fetch(Constants.API_TODOS_URL)
        const todos = await result.json()
        state.todos = [...todos].splice(0,10)
        saveStateOnMemory();
    }catch(e) {
        console.log(e)
    }
}

const getStateFromMemory = async () => {
    const memoryState = internalStorage.get('state')
    if(memoryState) {
        Object.entries(memoryState).forEach(([key, value]) => {
            state[key] = value
        })
    }else{
        await fetchToDos();
    }
}

const renderTodos = () => {
    const html = state.todos.map((todo) => generateToDoItemHTML(todo)).join("");
    $todoList.innerHTML = html;
}

const createToDo = () => {
    const newToDo = {
        id : new Date().getTime(),
        title : state.form.title,
        completed : state.form.completed,
    }
    state.todos.push(newToDo);
    saveStateOnMemory();
    renderTodos();
}

const setFormListener =  () => {
    $title.addEventListener('input', (event) =>{
        const value = event.target.value;
        state.form.title = value;
    })
    $completed.addEventListener('change', (event) =>{
        const value = event.target.value;
        state.form.completed = value == 'true';
    })
    $form.addEventListener('submit', (event) =>{
        event.preventDefault();
        if( state.form.title == "" || typeof state.form.completed != "boolean" ) {
            return;
        } 
        createToDo();
        $form.reset()
    })
}

const setToDoListener = () => {

    document.addEventListener("click", (event) => {
        if(event.target.classList.contains("delete-todo")){
            const id = event.target.dataset.id;
            
            const targetIndex = state.todos.findIndex((todo)=> todo.id == id);
            
            state.todos.splice(targetIndex, 1);

            saveStateOnMemory();
            renderTodos();
        }else if (event.target.classList.contains("update-completed-state")){
            const id = event.target.dataset.id;

            const targetIndex = state.todos.findIndex((todo) => todo.id == id);

            state.todos[targetIndex].completed = !state.todos[targetIndex].completed;
            saveStateOnMemory()
            renderTodos();
        }

    })



}

const init = async () => {
    await getStateFromMemory();
    renderTodos();
    setFormListener();
    setToDoListener();
}

init();