import { Constants } from "./constants.mjs"
import { internalStorage } from "./internalStorage.mjs"
import { generateToDoItemHTML } from "./dom.mjs"

const $todoList = document.querySelector("#todo-list");

const state = {
    todos: []
}

const fetchToDos = async () => {
    try {
        const result = await fetch(Constants.API_TODOS_URL)
        const todos = await result.json()
        state.todos = [...todos].splice(0,10)
        internalStorage.set('state', state)
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

const init = async () => {
    await getStateFromMemory();
    renderTodos();
}
init()