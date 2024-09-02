<template>
  <div>
    <form @submit.prevent="login">
      <v-text-field v-model="user.email" label="E-mail логин"></v-text-field>
      <v-text-field v-model="user.password" label="Пароль" type="password"></v-text-field>
      <v-alert v-if="loginAlert" color="success" icon="$success" variant="outlined" class="mb-3">{{ loginAlert }}</v-alert>
      <v-alert v-if="loginError" type="error" variant="outlined" class="mb-3">{{ loginError }}</v-alert>
      <v-btn class="me-4" type="submit">Войти</v-btn>
    </form>
  </div>
</template>

<script>
import { AuthService } from "@/services/AuthService.js";
import router from "@/router/index.js";

export default {
  name: "LoginForm",
  data() {
    return {
      user: {
        email: '',
        password: ''
      },
      loginAlert: null,
      loginError: null,
    };
  },
  methods: {
    async login() {
      try {
        await AuthService.login(this.user.email, this.user.password);
        this.loginAlert = 'Добро пожаловать!';
        //await router.push({ name: 'home' });
        window.location.reload();
      } catch (error) {
        console.error('Ошибка входа:', error);
        this.loginError = 'Проверьте введенные данные!';
      }
    },
    clearError() {
      this.loginError = null;
    },
  },
  watch: {
    'user.email': 'clearError',
    'user.password': 'clearError',
  },
};
</script>
