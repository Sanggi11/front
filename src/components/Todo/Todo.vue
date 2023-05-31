<template>
    <div id="app" class="container">
        <div v-if="user" class="user-section">
            Logged in as: {{ user.email }} <button @click="logout" class="logout-btn">Logout</button>
        </div>

        <div class="controls">
            <div class="search-section">
                <input v-model="searchTerm" placeholder="Search" class="input-field">
                <img src="../../assets/search.png" alt="search icon" class="search-icon" />
            </div>

            <div class="sort-section">
                <span>Sort By:</span>
                <select v-model="sortKey" class="select-field">
                    <option value="task">Task</option>
                    <option value="deadline">Deadline</option>
                    <option value="priority">Priority</option>
                    <option value="completed">Status</option>
                </select>
                <select v-model="sortOrder" class="select-field">
                    <option value="asc">Ascending</option>
                    <option value="desc">Descending</option>
                </select>
                Filter:
                <select v-model="priorityFilter" class="select-field">
                    <option>All</option>
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                </select>

                <select v-model="statusFilter" class="select-field">
                    <option>All</option>
                    <option>Completed</option>
                    <option>Uncompleted</option>
                </select>

                <select v-model="expiredFilter" class="select-field">
                    <option>All</option>
                    <option>Expired</option>
                    <option>Unexpired</option>
                </select>
            </div>



            <div class="add-task-section">
                <input v-model="newLabel" placeholder="Enter labels" class="input-field">
                <input v-model="newTask" placeholder="Enter new task" class="input-task" @keypress="checkKey">
                <input type="date" v-model="newDeadline" class="input-field">
                <select v-model="newPriority" class="select-field">
                    <option disabled value="">Please select a priority</option>
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                </select>
                <button @click="addTodo" :disabled="newTask.length === 0" class="add-btn">Add Todo</button>
            </div>
        </div>

        <div v-for="todo in paginatedTodos" :key="todo.id" class="todo-item">
            <div class="todo-content">
                <label class="switch">
                    <input type="checkbox" v-model="todo.completed">
                    <span class="slider round"></span>
                </label>
                <div v-if="editMode !== todo.id" class="todo-text">
                    <span v-for="label in todo.labels" :key="label" class="label">
                        <template v-if="label">{{ `[${label}]` }}</template>
                    </span>
                    <span :style="{ color: priorityColor(todo.priority) }">
                        {{ todo.task }} - {{ todo.deadline }} ({{ calculateDaysLeft(todo.deadline) }} days left) - {{
                            todo.priority }}
                    </span>
                    <span>
                        <button @click="editTodo(todo)" class="edit-btn">Edit</button>
                        <button @click="deleteTodo(todo)" class="delete-btn">Delete</button>
                    </span>
                </div>
                <div v-else class="edit-section">
                    <input v-model="editData.labels" placeholder="Edit labels" class="input-field">
                    <input v-model="editData.task" placeholder="Edit task" class="input-field">
                    <input type="date" v-model="editData.deadline" class="input-field">
                    <select v-model="editData.priority" class="select-field">
                        <option disabled value="">Please select a priority</option>
                        <option>Low</option>
                        <option>Medium</option>
                        <option>High</option>
                    </select>
                    <button @click="saveTodo" class="save-btn">Save</button>
                    <button @click="cancelEdit" class="cancel-btn">Cancel</button>
                </div>
            </div>
        </div>
        <div class="pagination">

            <button @click="prevPage" :disabled="currentPage === 0" class="prev-btn">Previous Page</button>
            <select v-model="itemsPerPage" class="select-field">
                <option value="10">10</option>
                <option value="50">50</option>
            </select>
            <button @click="nextPage" :disabled="currentPage >= pageCount - 1" class="next-btn">Next Page</button>
        </div>
    </div>
</template>
  
<script lang="ts">
interface TodoItem {
    id: number;
    firebaseId: string; // 추가된 부분
    task: string;
    deadline: string;
    priority: string;
    completed: boolean;
    [key: string]: any; // 추가된 인덱스 시그니처
}

import { onAuthStateChanged } from 'firebase/auth';
import { firebaseAuth } from '../../firebase';
import { ref, computed, onMounted } from 'vue';
import { User } from 'firebase/auth';
import { signOut } from 'firebase/auth'; // import signOut
import { useRouter } from 'vue-router'; // Import useRouter

import { getDocs, query, getFirestore, collection, addDoc, deleteDoc, doc, updateDoc } from "firebase/firestore";
const db = getFirestore();



export default {
    name: 'TodoComponent',
    setup() {
        const user = ref<User | null>(null);
        const todos = ref<TodoItem[]>([]);
        const newTask = ref('');
        const today = new Date().toISOString().split('T')[0];
        const newDeadline = ref(today);
        const newPriority = ref('Medium');
        const searchTerm = ref('');
        const sortKey = ref('task');
        const sortOrder = ref('asc');
        const router = useRouter();
        const editMode = ref<number | null>(null);
        const editData = ref({} as TodoItem);
        const newLabel = ref(''); // labels
        const priorityFilter = ref('All');
        const statusFilter = ref('All');
        const expiredFilter = ref('All');

        // Pagination related
        const itemsPerPage = ref(10); // Default value set to 10
        const currentPage = ref(0);



        const logout = async () => { // logout function
            try {
                await signOut(firebaseAuth);
                router.push('/login');
            } catch (error) {
                console.error(error);
            }
        };
        const checkKey = ($event: KeyboardEvent) => {
            // Check if the key pressed is enter (key code 13)
            if ($event.keyCode === 13) {
                addTodo();
            }
        };

        const addTodo = async () => {
            const todo = {
                id: todos.value.length,
                task: newTask.value,
                deadline: newDeadline.value,
                priority: newPriority.value,
                completed: false,  // 초기 완료 상태는 false
                labels: newLabel.value.split(','),
                firebaseId: '',
            };
            try {
                const docRef = await addDoc(collection(db, "todos"), todo);
                console.log("Document written with ID: ", docRef.id);
                const todoRef = doc(db, 'todos', docRef.id);
                await updateDoc(todoRef, { firebaseId: docRef.id });
                todo.firebaseId = docRef.id; // update the firebaseId of the todo
                todos.value.push(todo); // push the todo after it has been added to Firestore
            } catch (e) {
                console.error("Error adding document: ", e);
            }

            newTask.value = '';
            newDeadline.value = today;
            newLabel.value = '';
            // newPriority.value = '';
        };
        const deleteTodo = async (todo: TodoItem) => {
            // Firebase Firestore에서도 삭제
            const todoRef = doc(db, 'todos', todo.firebaseId);
            await deleteDoc(todoRef);
            const index = todos.value.findIndex(t => t.id === todo.id);
            if (index !== -1) {
                todos.value.splice(index, 1); // Remove the todo from local list after deleting it from Firestore
            }
        };
        const calculateDaysLeft = (deadline: string) => {
            const deadlineDate = new Date(deadline);
            const today = new Date();
            const timeDiff = deadlineDate.getTime() - today.getTime();
            const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
            return daysDiff >= 0 ? daysDiff : 0;
        };
        const priorityColor = (priority: string) => {
            if (priority === "High") return "red";
            if (priority === "Medium") return "orange";
            return "green"; // Low
        };
        onMounted(async () => {
            onAuthStateChanged(firebaseAuth, newUser => {
                user.value = newUser;
            });
            // Firestore에서 데이터를 가져옴
            const q = query(collection(db, "todos"));
            const querySnapshot = await getDocs(q);
            todos.value = querySnapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    id: data.firebaseId,
                    firebaseId: data.firebaseId,
                    task: data.task,
                    deadline: data.deadline,
                    priority: data.priority,
                    completed: data.completed,
                    labels: data.labels
                };
            });
        });

        const filteredTodos = computed(() => {
            return sortedTodos.value
                .filter(todo =>
                    (priorityFilter.value === 'All' || todo.priority === priorityFilter.value) &&
                    (statusFilter.value === 'All' || (statusFilter.value === 'Completed' ? todo.completed : !todo.completed)) &&
                    (expiredFilter.value === 'All' || (expiredFilter.value === 'Expired' ? isExpired(todo.deadline) : !isExpired(todo.deadline)))
                );
        });


        const sortedTodos = computed(() => {
            const priorityMap: { [key: string]: number } = { 'Low': 1, 'Medium': 2, 'High': 3 };
            const orderMultiplier = sortOrder.value === 'asc' ? 1 : -1;
            return todos.value
                .filter(todo => todo.task.includes(searchTerm.value) || todo.labels.join(',').includes(searchTerm.value))
                .sort((a, b) => {
                    if (sortKey.value === 'priority') {
                        return (priorityMap[a[sortKey.value]] - priorityMap[b[sortKey.value]]) * orderMultiplier;
                    }
                    return (a[sortKey.value] > b[sortKey.value] ? 1 : -1) * orderMultiplier;
                });
        });

        const pageCount = computed(() => {
            return Math.ceil(filteredTodos.value.length / itemsPerPage.value);
        });


        const paginatedTodos = computed(() => {
            const start = currentPage.value * itemsPerPage.value;
            const end = start + itemsPerPage.value;
            return filteredTodos.value.slice(start, end);
        });

        const prevPage = () => {
            if (currentPage.value > 0) {
                currentPage.value--;
            }
        };

        const nextPage = () => {
            if (currentPage.value < pageCount.value - 1) {
                currentPage.value++;
            }
        };

        const editTodo = (todo: TodoItem) => {
            editData.value = { ...todo, labels: todo.labels.join(',') };
            editMode.value = todo.id;
        };

        const saveTodo = async () => {
            if (editMode.value !== null) {
                const index = todos.value.findIndex(todo => todo.id === editMode.value);
                const updatedTodo = { ...editData.value, labels: editData.value.labels.split(',') };
                // Firebase Firestore에 업데이트
                const todoRef = doc(db, 'todos', todos.value[index].firebaseId);
                await updateDoc(todoRef, updatedTodo);
                todos.value[index] = updatedTodo; // Update the todo in local list after updating it in Firestore
                editMode.value = null;
            }
        };

        const cancelEdit = () => {
            editMode.value = null;
        };
        const isExpired = (deadline: string) => {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const deadlineDate = new Date(deadline);
            return deadlineDate < today;
        };



        return {
            user,
            todos,
            newTask,
            newDeadline,
            newPriority,
            searchTerm,
            sortKey,
            sortOrder,
            addTodo,
            sortedTodos,
            logout, // logout function
            currentPage,
            itemsPerPage,
            prevPage,
            nextPage,
            paginatedTodos,
            pageCount,
            editMode,
            editTodo,
            saveTodo,
            cancelEdit,
            editData,
            checkKey,
            deleteTodo,
            newLabel,
            priorityFilter,
            statusFilter,
            expiredFilter,
            priorityColor,
            calculateDaysLeft,
        };
    }
};
</script>
  

<style scoped>
.container {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
    font-family: 'Arial', sans-serif;
    background-color: #f5f7fa;
}


.user-section {
    align-self: flex-end;
    margin-bottom: 20px;
}

.logout-btn {
    margin-left: 10px;
    padding: 5px 10px;
    background-color: #dc2626;
    color: #fff;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}


.controls {
    width: 100%;
    display: flex;
    flex-direction: column;
    margin-bottom: 20px;
}

.input-field {
    width: 180px;
    padding: 10px;
    margin-bottom: 10px;
    margin-left: 10px;
    border: 1px solid #d1d5db;
    border-radius: 5px;
}

.input-task {
    padding: 10px;
    margin-bottom: 10px;
    margin-right: 10px;
    border: 5px solid #f788d5;
    border-radius: 5px;
}

.sort-section {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    align-self: center;
}

.select-field {
    width: 100px;
    padding: 10px;
    margin-bottom: 10px;
    margin-right: 10px;
    border: 1px solid #d1d5db;
    border-radius: 5px;
}

.add-task-section {
    display: flex;
}

.add-task-section>.input-field {
    flex: 1;
    margin-right: 10px;
}

.add-btn {
    padding: 10px;
    background-color: #10b981;
    color: #fff;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}

.todo-item {
    width: 100%;
    padding: 10px;
    border: 1px solid #d1d5db;
    border-radius: 5px;
    margin-bottom: 10px;
}

.todo-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.switch {
    position: relative;
    display: inline-block;
    width: 60px;
    height: 34px;
}

.switch input {
    opacity: 0;
    width: 0;
    height: 0;
}

.slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    transition: .4s;
}

.slider:before {
    position: absolute;
    content: "";
    height: 26px;
    width: 26px;
    left: 4px;
    bottom: 4px;
    background-color: white;
    transition: .4s;
}

input:checked+.slider {
    background-color: #2196F3;
}

input:focus+.slider {
    box-shadow: 0 0 1px #2196F3;
}

input:checked+.slider:before {
    transform: translateX(26px);
}

/* Rounded sliders */
.slider.round {
    border-radius: 34px;
}

.slider.round:before {
    border-radius: 50%;
}


.todo-text {
    flex: 1;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.edit-btn,
.save-btn,
.delete-btn,
.cancel-btn {
    margin-left: 10px;
    padding: 5px 10px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}

.edit-btn {
    background-color: #3b82f6;
    color: #fff;
}

.delete-btn {
    background-color: #ec2da9;
    color: #fff;
}

.save-btn {
    background-color: #10b981;
    color: #fff;
}

.cancel-btn {
    background-color: #dc2626;
    color: #fff;
}

.pagination {
    display: flex;
    justify-content: space-between;
    width: 100%;
    padding: 10px;
}

.prev-btn,
.next-btn {
    padding: 10px;
    background-color: #3b82f6;
    color: #fff;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}

.label {
    margin-right: 0.5px;
    margin-left: 15px;
    color: #888;
}

.search-section {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 50%;
    margin: auto;
}

.input-field {
    padding: 8px;
    margin-bottom: 10px;
    border: 1px solid #d1d5db;
    border-radius: 5px;
    flex-grow: 1;
}

.search-icon {
    margin-bottom: 10px;
    margin-left: -30px;
    height: 20px;
    width: 20px;
}
</style>