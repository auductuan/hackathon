interface ITodoList {
    id: number;
    name: string;
    completed: boolean;
}

class TodoList implements ITodoList {
    todoList: ITodoList[];

    constructor(todoList: ITodoList[]) {
        this.todoList = todoList;
        this.renderJob(); 
    }

    renderJob(): void {
        const ulList = document.querySelector('.ul-list');
        if (!ulList) return;

        ulList.innerHTML = ''; 

        this.todoList.forEach(item => {
            const li = document.createElement('li');
            li.innerHTML = `
                <input type="checkbox">
                <i>${item.name}</i>
                <i class="fa-solid fa-pen"></i>
                <i class="fa-regular fa-trash-can" onclick="confirmDelete(${item.id})"></i><br>`;
            ulList.appendChild(li);
        });

        const completedCount = this.todoList.filter(item => item.completed).length;
        const totalCount = this.todoList.length;
        const completedText = document.createElement('i');
        completedText.innerHTML = `Công việc đã hoàn thành: <b>${completedCount}/${totalCount}</b>`;
        ulList.appendChild(completedText);
    }

    createJob(newJob: ITodoList): void {
        this.todoList.push(newJob);
        this.renderJob();
        this.saveToLocalStorage();
    }

    updateJob(id: number, completed: boolean): void {
        const jobToUpdate = this.todoList.find(item => item.id === id);
        if (jobToUpdate) {
            jobToUpdate.completed = completed;
            this.renderJob();
            this.saveToLocalStorage();
        } else {
            console.log('Không tìm thấy công việc.');
        }
    }

    deleteJob(id: number): void {
        const confirmed = confirm('Bạn có chắc chắn muốn xóa công việc?');
        if (confirmed) {
            this.todoList = this.todoList.filter(item => item.id !== id);
            this.renderJob();
            this.saveToLocalStorage();
        }
    }

    saveToLocalStorage(): void {
        localStorage.setItem('todoList', JSON.stringify(this.todoList));
    }
}

const savedData = localStorage.getItem('todoList');
const initialTodoList: ITodoList[] = savedData ? JSON.parse(savedData) : [];

const myTodoList = new TodoList(initialTodoList);

function confirmDelete(id: number): void {
    myTodoList.deleteJob(id);
}

document.getElementById('form')?.addEventListener('submit', function (event) {
    event.preventDefault(); 

    const inputElement = document.getElementById('newJobInput') as HTMLInputElement;
    const jobName = inputElement.value.trim();
    if (!jobName) {
        alert('Tên công việc không được để trống!');
        return;
    }

    const existingJob = myTodoList.todoList.find(item => item.name === jobName);
    if (existingJob) {
        alert('Tên công việc đã tồn tại!');
        return;
    }

    const newJob: ITodoList = {
        id: Date.now(),
        name: jobName,
        completed: false
    };

    myTodoList.createJob(newJob);

    inputElement.value = '';
});
