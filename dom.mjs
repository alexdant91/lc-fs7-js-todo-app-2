export const generateToDoItemHTML = ({id, title, completed}) => {
    return `
    <div>
      <span>${title} - ${completed ? "&#10004;" : "&#10761;"}</span>
      <button class="delete-todo" data-id="${id}">Delete</button> 
    </div>
    `
}