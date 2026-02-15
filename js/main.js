let inputTask = document.getElementById('input-task');
let submit = document.getElementById('submit');
let tasksList = document.getElementById('tasks-list');
let deleteCompletedBtn = document.getElementById('delete-completed');
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

window.onload = () => {
    tasks.forEach(task => createTask(task.text, task.completed));
    toggleDeleteCompletedBtn();
};

submit.onclick = () => {
    const taskText = inputTask.value.trim();
    if (!taskText) {
        alert('Please enter a task');
        return;
    }
    const taskObj = { text: taskText, completed: false };
    createTask(taskObj.text, taskObj.completed);
    tasks.push(taskObj);
    updateLocalStorage();
    inputTask.value = '';
    toggleDeleteCompletedBtn();
};

function createTask(text, completed) {
    const taskDiv = document.createElement('div');
    taskDiv.className = 'task';
    if (completed) taskDiv.classList.add('completed');

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = completed;
    checkbox.onchange = () => {
        taskDiv.classList.toggle('completed');
        updateTaskStatus(text, checkbox.checked);
        toggleDeleteCompletedBtn();
    };

    const taskTitle = document.createElement('h3');
    taskTitle.textContent = text;
    taskTitle.ondblclick = () => {
        const newText = prompt('Edit task:', text);
        if (newText && newText.trim() !== '') {
            updateTaskText(text, newText.trim());
            taskTitle.textContent = newText.trim();
        }
    };

    const deleteSpan = document.createElement('span');
    deleteSpan.className = 'del';
    deleteSpan.textContent = 'Delete';
    deleteSpan.onclick = () => {
        tasksList.removeChild(taskDiv);
        tasks = tasks.filter(t => t.text !== text);
        updateLocalStorage();
        toggleDeleteCompletedBtn();
    };

    taskDiv.appendChild(checkbox);
    taskDiv.appendChild(taskTitle);
    taskDiv.appendChild(deleteSpan);
    tasksList.appendChild(taskDiv);
}

function updateTaskStatus(text, status) {
    tasks = tasks.map(t => t.text === text ? { ...t, completed: status } : t);
    updateLocalStorage();
}

function updateTaskText(oldText, newText) {
    tasks = tasks.map(t => t.text === oldText ? { ...t, text: newText } : t);
    updateLocalStorage();
}

function updateLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function toggleDeleteCompletedBtn() {
    const completedTasks = tasks.filter(t => t.completed);
    deleteCompletedBtn.style.display = completedTasks.length >= 2 ? 'block' : 'none';
}

deleteCompletedBtn.onclick = () => {
    // deleteCompletedBtn.style.display = 'block';
    tasks = tasks.filter(t => !t.completed);
    updateLocalStorage();
    tasksList.innerHTML = '';
    tasks.forEach(task => createTask(task.text, task.completed));
    toggleDeleteCompletedBtn();
};