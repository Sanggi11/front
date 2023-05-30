<template>
    <div id="app" class="container">
        <div v-if="user" class="user-section">
            Logged in as: {{ user.email }} <button @click="logout" class="logout-btn">Logout</button>
        </div>

        <div class="controls">
            <input v-model="searchTerm" placeholder="Search" class="input-field">
        
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
            </div>

            <div class="add-task-section">
                <input v-model="newTask" placeholder="Enter new task" class="input-field" @keypress="checkKey">
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
                   {{ todo.task }} - {{ todo.deadline }} - {{ todo.priority }} 
                    <button @click="editTodo(todo)" class="edit-btn">Edit</button>
                </div>
                <div v-else class="edit-section">
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
            <button @click="nextPage" :disabled="currentPage >= pageCount - 1" class="next-btn">Next Page</button>
        </div>
    </div>
</template>
  
  <script lang="ts">
  interface TodoItem {
      id: number;
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
          // 추가된 정렬 설정
          const sortKey = ref('task');
          const sortOrder = ref('asc');
          const router = useRouter();
          const editMode = ref<number | null>(null);
          const editData = ref({} as TodoItem);
  
          // Pagination related
          const itemsPerPage = ref(5);
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
  
          const addTodo = () => {
              todos.value.push({
                  id: todos.value.length,
                  task: newTask.value,
                  deadline: newDeadline.value,
                  priority: newPriority.value,
                  completed: false  // 초기 완료 상태는 false
              });
  
              newTask.value = '';
              newDeadline.value = today;
              // newPriority.value = '';
          };
  
          onMounted(()=>{
              onAuthStateChanged(firebaseAuth,newUser => {
                  user.value = newUser;
              });
          });
  
          const sortedTodos = computed(() => {
              const priorityMap: { [key: string]: number } = { 'Low': 1, 'Medium': 2, 'High': 3 };
              const orderMultiplier = sortOrder.value === 'asc' ? 1 : -1;
              return todos.value
                  .filter(todo => todo.task.includes(searchTerm.value))
                  .sort((a, b) => {
                      if (sortKey.value === 'priority') {
                          return (priorityMap[a[sortKey.value]] - priorityMap[b[sortKey.value]]) * orderMultiplier;
                      }
                      return (a[sortKey.value] > b[sortKey.value] ? 1 : -1) * orderMultiplier;
                  });
          });
  
          const pageCount = computed(() => {
              return Math.ceil(sortedTodos.value.length / itemsPerPage.value);
          });
          
  
          const paginatedTodos = computed(() => {
              const start = currentPage.value * itemsPerPage.value;
              const end = start + itemsPerPage.value;
              return sortedTodos.value.slice(start, end);
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
              editData.value = { ...todo };
              editMode.value = todo.id;
          };
  
          const saveTodo = () => {
              if (editMode.value !== null) {
                  const index = todos.value.findIndex(todo => todo.id === editMode.value);
                  todos.value[index] = editData.value;
                  editMode.value = null;
              }
          };
  
          const cancelEdit = () => {
              editMode.value = null;
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
      padding: 10px;
      margin-bottom: 10px;
      border: 1px solid #d1d5db;
      border-radius: 5px;
  }
  
  .sort-section {
      display: flex;
      align-items: center;
      margin-bottom: 10px;
  }
  
  .select-field {
    padding: 10px;
    margin-bottom: 10px;
    margin-right: 10px;
    border: 1px solid #d1d5db;
    border-radius: 5px;
  }
  
  .add-task-section {
      display: flex;
  }
  
  .add-task-section > .input-field {
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

input:checked + .slider {
    background-color: #2196F3;
}

input:focus + .slider {
    box-shadow: 0 0 1px #2196F3;
}

input:checked + .slider:before {
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
  }
  
  .edit-btn, .save-btn, .cancel-btn {
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
  
  .prev-btn, .next-btn {
      padding: 10px;
      background-color: #3b82f6;
      color: #fff;
      border: none;
      border-radius: 5px;
      cursor: pointer;
  }
  </style>