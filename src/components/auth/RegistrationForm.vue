<template>
  <div>
    <form @submit.prevent="register">
      <v-text-field v-model="user.nickname" label="Никнейм"></v-text-field>
      <v-text-field v-model="user.email" label="E-mail регистрация"></v-text-field>
      <v-text-field v-model="user.password" label="Пароль" type="password"></v-text-field>
      <v-alert v-if="registerAlert" color="success" icon="$success" variant="outlined" class="mb-3">{{ registerAlert }}</v-alert>
      <v-alert v-if="registrationError" type="error" variant="outlined" class="mb-3">{{ registrationError }}</v-alert>
      <v-btn class="me-4" type="submit">Зарегистрироваться</v-btn>
    </form>
  </div>
</template>

<script>
import { AuthService } from "@/services/AuthService.js";
import router from "@/router/index.js";

export default {
  name: "RegisterForm",
  data() {
    return {
      user: {
        email: '',
        password: '',
        nickname: ''
      },
      registerAlert: null,
      registrationError: null,
    };
  },
  methods: {
    async register() {
      try {
        await AuthService.register(this.user.email, this.user.password, this.user.nickname);
        this.registerAlert = 'Аккаунт создан!';
        await router.push({name: 'home'});
        window.location.reload();
      } catch (error) {
        console.error('Ошибка регистрации:', error);
        this.registrationError = 'Неправильные данные или такой пользователь уже есть! Попробуйте снова!';
      }
    },
    clearError() {
      this.registrationError = null;
    },
  },
  watch: {
    'user.email': 'clearError',
    'user.nickname': 'clearError',
  },
};
</script>
