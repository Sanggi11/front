<template>
    <div class="login-container">
      <h2>Login</h2>
      <div class="button-container">
        <button @click="loginWithGoogle">Login with Google</button>
      </div>
      <p class="error-message" v-if="errorMessage">{{ errorMessage }}</p>
    </div>
  </template>
  
  <script lang="ts">
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';  // import useRouter
  import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
  import { firebaseAuth } from '../../firebase';
  
  export default {
    name: 'LoginComponent',
    setup() {
      const router = useRouter();  // get router instance
      const errorMessage = ref('');
  
      const loginWithGoogle = async () => {
        try {
          const provider = new GoogleAuthProvider();
          await signInWithPopup(firebaseAuth, provider);
          router.push('/todo');  // redirect to todo page
        } catch (error: any) {
          errorMessage.value = error.message;
        }
      };
      return {
        loginWithGoogle,
        errorMessage,
      };
    },
  };
  </script>
  
  <style scoped>
  .login-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: #f2f2f2;
  }
  
  .input-field {
    margin-bottom: 10px;
  }
  
  .button-container {
    display: flex;
    justify-content: space-between;
    width: 100%;
  }
  
  .error-message {
    color: red;
    margin-top: 10px;
  }
  </style>
  