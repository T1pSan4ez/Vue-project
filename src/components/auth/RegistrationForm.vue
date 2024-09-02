<template>
  <div>
    <form @submit.prevent="register">
      <v-text-field
          v-model="user.nickname"
          label="Никнейм"
          :rules="[rules.required, rules.minLength(3)]"
          @input="clearMessages"
      ></v-text-field>

      <v-text-field
          v-model="user.email"
          label="E-mail регистрация"
          :rules="[rules.required, rules.email]"
          @input="clearMessages"
      ></v-text-field>

      <v-text-field
          v-model="user.password"
          label="Пароль"
          type="password"
          :rules="[rules.required, rules.minLength(6)]"
          @input="clearMessages"
      ></v-text-field>
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
      rules: {
        required: v => !!v || 'Поле обязательно для заполнения.',
        email: v => /.+@.+\..+/.test(v) || 'Введите корректный E-mail.',
        minLength: length => v => v.length >= length || `Минимальная длина ${length} символов.`,
      },
    };
  },
  methods: {
    async register() {
      try {
        await AuthService.register(this.user.email, this.user.password, this.user.nickname);
        this.registerAlert = 'Аккаунт создан!';
        this.registrationError = null;
        await router.push({name: 'home'});
        window.location.reload();
      } catch (error) {
        console.error('Ошибка регистрации:', error);
        this.registerAlert = null;
        this.registrationError = 'Неправильные данные или такой пользователь уже есть! Попробуйте снова!';
      }
    },
    clearMessages() {
      this.registerAlert = null;
      this.registrationError = null;
    },
  },
  watch: {
    'user.email': 'clearMessages',
    'user.nickname': 'clearMessages',
    'user.password': 'clearMessages',
  },
};
</script>
