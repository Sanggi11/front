<template>
  <div class="login-container">
      <h2>Login</h2>
      <div class="button-container">
          <button class="google-btn" @click="loginWithGoogle">
              <img src="../../assets/btn_google_signin_dark_pressed_web@2x.png" alt="Google logo" /> <!-- Google 로고를 경로에 맞게 추가 -->
              Login with Google
          </button>
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
      background-color: #f8c7f1;
      font-family: Arial, sans-serif;
  }
  
  h2 {
      margin-bottom: 20px;
      color: #333;
  }
  
  .button-container {
      display: flex;
      justify-content: center;
      width: 100%;
  }
  
  .google-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #d163ce;
      color: white;
      border: none;
      border-radius: 4px;
      padding: 10px 20px;
      cursor: pointer;
      transition: background-color 0.3s ease;
  }
  
  .google-btn:hover {
      background-color: #2a75f3;
  }
  
  .google-btn img {
      margin-right: 10px;
      width: 20px;
  }
  
  .error-message {
      color: red;
      margin-top: 10px;
  }
  </style>
  