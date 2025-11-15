

class TodoList {
    constructor() {
        this.tasks = JSON.parse(localStorage.getItem('tasks')) ||[];
        this.currentFilter = 'all';
        this.init();
    }

    init() {
        this.render();
        this.setupEventListeners();
    }

    setupEventListeners() {
        const taskInput = document.getElementById('taskInput');
        const addButton = document.getElementById('addButton');
        const filterButtons = document.querySelectorAll('.filter-btn');
        const clearCompletedButton = document.getElementById('clearCompleted');
        const clearAllButton = document.getElementById('clearAll');

        taskInput.addEventListener('keypress', e => {
            if (e.key == 'Enter') {
                this.addTask();
            }
        });

        addButton.addEventListener('click', () => {
            this.addTask();
        });

        filterButtons.forEach(button => {
            button.addEventListener('click', (e)=>{
                const filter = e.target.getAttribute('data-filter');
                this.filterTask(filter, e.target);
            });
        });

        clearCompletedButton.addEventListener('click', () => {
            this.clearCompleted();
        });

        clearAllButton.addEventListener('click', () => {
            this.clearAll();
        });

        
    }
    
    addTask() {
            const taskInput = document.getElementById('taskInput');
            const text = taskInput.value.trim();

            if (text === '') {
                alert('Пожалуйста, введите текст задачи');
                return;
            }

            const task = {
                id: Date.now(),
                text: text,
                completed: false,
                createdAt: new Date().toLocaleDateString()
            };
            this.tasks.unshift(task);
            taskInput.value = '';
            this.saveToLocalStorage();
            this.render();
        }

        toggleTask(id) {
            this.tasks = this.tasks.map(task => 
                task.id === id ? { ...task, completed: !task.completed } : task
            );
            this.saveToLocalStorage();
            this.render();
        }


}

