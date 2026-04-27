const taskList = document.getElementById('taskList');
const taskInput = document.getElementById('taskInput');

async function loadTasks() {
    const res = await fetch('/api/tasks');
    const tasks = await res.json();

    taskList.innerHTML = '';

    tasks.forEach(task => {
        const li = document.createElement('li');

        li.innerHTML = `
            <span class="${task.completed ? 'completed' : ''}">
                ${task.title}
            </span>

            <div class="actions">
                <button onclick="toggleTask(${task.id})">✓</button>
                <button class="delete" onclick="deleteTask(${task.id})">X</button>
            </div>
        `;

        taskList.appendChild(li);
    });
}

async function addTask() {
    const title = taskInput.value.trim();

    if (!title) return;

    await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title })
    });

    taskInput.value = '';
    loadTasks();
}

async function deleteTask(id) {
    await fetch(`/api/tasks/${id}`, {
        method: 'DELETE'
    });

    loadTasks();
}

async function toggleTask(id) {
    await fetch(`/api/tasks/${id}/toggle`, {
        method: 'PUT'
    });

    loadTasks();
}

loadTasks();