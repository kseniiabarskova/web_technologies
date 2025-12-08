
document.addEventListener('DOMContentLoaded', function() { 

    const inputBox = document.getElementById('input-box'); 
    const categorySelect = document.getElementById('category'); 
    const filterButtons = document.querySelectorAll('.filter-btn'); 
    const listContainers = document.querySelectorAll('.list-container'); 
    
    let tasks = JSON.parse(localStorage.getItem('todoTasks')) || [];
    let currentFilter = 'all';
    

    init();
    
    function init() {
        renderTasks();
        setupEventListeners();
        updateCounters();
        setupDragAndDrop();
    }
    
    function setupEventListeners() {
    filterButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            filterButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentFilter = this.dataset.filter;
            renderTasks();
            
        });
    });
    inputBox.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addTask();
        }
    });
}
    function setupDragAndDrop() {
    listContainers.forEach(container => {
        container.addEventListener('dragover', function(e) {
            e.preventDefault();
        });
        
        container.addEventListener('drop', function(e) {
            e.preventDefault();
            
            const taskId = e.dataTransfer.getData('text/plain');
            const newCategory = this.dataset.category;
            
            const taskIndex = tasks.findIndex(t => t.id == taskId);
            if (taskIndex !== -1) {
                tasks[taskIndex].category = newCategory;
                saveTasks();
                renderTasks();
                updateCounters(); 
            }
        });
        
    });
}
    
    
    window.addTask = function() {
        const taskText = inputBox.value.trim();
        
        if (taskText === '') {
            alert('Задача не может быть пустой!');
            return;
        }
        
        const newTask = {
            id: Date.now().toString(),
            text: taskText,
            category: categorySelect.value,
            completed: false,
        };
        
        tasks.push(newTask);
        saveTasks();
        renderTasks();
        updateCounters();
        
        inputBox.value = '';
        inputBox.focus();
        
    }
    
    
    function toggleTask(id) { 
        const taskIndex = tasks.findIndex(t => t.id === id);
        if (taskIndex !== -1) {
            tasks[taskIndex].completed = !tasks[taskIndex].completed;
            saveTasks();
            renderTasks();
            updateCounters();
        
        }
    }
    
    function deleteTask(id) {
        tasks = tasks.filter(t => t.id !== id);
        saveTasks(); 
        renderTasks();
        updateCounters();
        
    }

    function editTask(id, newText) {
        const taskIndex = tasks.findIndex(t => t.id === id);
        if (taskIndex !== -1 && newText.trim() !== '') {
            tasks[taskIndex].text = newText.trim();
            saveTasks();
            renderTasks();
            updateCounters();
        }
    }
    
    function saveTasks() {
        localStorage.setItem('todoTasks', JSON.stringify(tasks));
        
    }
    

    function renderTasks() {
    
    listContainers.forEach(container => {
        container.innerHTML = '';
    });
    
    listContainers.forEach(container => {
        const category = container.dataset.category; 
        
        let categoryTasks = tasks.filter(task => task.category === category);
        
        if (currentFilter === 'active') {
            categoryTasks = categoryTasks.filter(task => !task.completed);
        } else if (currentFilter === 'completed') {
            categoryTasks = categoryTasks.filter(task => task.completed);
        }
        categoryTasks.forEach(task => {
            const li = createTaskElement(task);
            container.appendChild(li);
        });
        
    });
}
    
    
    function createTaskElement(task) {
    const li = document.createElement('li');
    li.className = task.completed ? 'task-item checked' : 'task-item';
    li.draggable = true;
    li.dataset.id = task.id;
    
    
    const checkbox = document.createElement('div');
    checkbox.className = 'custom-checkbox';
    
    if (task.completed) {
        checkbox.classList.add('checked');
        checkbox.innerHTML = '✓';
    }
    
    checkbox.addEventListener('click', function(e) {
        e.stopPropagation();
        toggleTask(task.id);
    });
    
    const taskText = document.createElement('div');
    taskText.className = 'task-text';
    taskText.textContent = task.text;
    
    taskText.addEventListener('dblclick', function(e) {
        e.stopPropagation();
        const currentText = this.textContent;
        
        const input = document.createElement('input');
        input.type = 'text';
        input.value = currentText;
        input.className = 'task-edit-input';
        
        this.parentNode.insertBefore(input, this);
        this.style.display = 'none';
        input.focus();
        
        
        const saveEdit = () => {
            if (input.value.trim() !== '' && input.value !== currentText) {
                editTask(task.id, input.value);
            } else {
                input.remove();
                this.style.display = 'block';
            }
        };
        
        
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                saveEdit();
            }
        });
    });
    
    
    const deleteBtn = document.createElement('span');
    deleteBtn.innerHTML = '×';
    deleteBtn.className = 'delete-btn';
    
    deleteBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        deleteTask(task.id);
    });
    
    li.addEventListener('dragstart', function(e) {
        e.dataTransfer.setData('text/plain', task.id);
        this.classList.add('dragging');
    });
    
    li.addEventListener('dragend', function() {
        this.classList.remove('dragging');
    });
    
    li.appendChild(checkbox);
    li.appendChild(taskText);
    li.appendChild(deleteBtn);
    
    return li;

}

    function updateCounters() {
        const totalTasks = tasks.length;
        const completedTasks = tasks.filter(t => t.completed).length;
        const activeTasks = totalTasks - completedTasks;
        

        const columns = {
            'left': 'Study',
            'center': 'Sport', 
            'right': 'Home'
        };
        
        for (const [id, name] of Object.entries(columns)) {
            const columnTasks = tasks.filter(t => t.category === id);
            const columnCompleted = columnTasks.filter(t => t.completed).length;
            const columnActive = columnTasks.length - columnCompleted;
            
            const columnHeader = document.querySelector(`#${id} h3`);
            if (columnHeader) {
                columnHeader.innerHTML = `${name} <small style="font-size: 0.8em; color: #888;">(${columnActive}/${columnTasks.length})</small>`;
            }
        }
        
        
    }
});