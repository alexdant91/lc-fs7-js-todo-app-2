export const generateToDoItemHTML = ({id, title, completed}) => {
    return `
    <div>
      <span>${title} - ${completed ? "&#10004;" : "&#10761;"}</span>
      <button class="update-completed-state" data-id="${id}">${completed ? "undo" : "complete"}</button>
      <button class="delete-todo" data-id="${id}">Delete</button> 
    </div>
    `
}