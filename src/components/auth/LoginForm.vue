<template>
<div>
  <form @submit.prevent="login">
    <v-text-field
        v-model="user.email"
        label="E-mail логин"
    ></v-text-field>
    <v-text-field
        v-model="user.password"
        label="Пароль"
        type="password"
    ></v-text-field>
    <v-alert
        class="mb-3"
        v-if="loginAlert"
        :title="'Успешно:'"
        :text="loginAlert"
        color="success"
        icon="$success"
        variant="outlined"
    ></v-alert>
    <v-alert
        class="mb-3"
        v-if="loginError"
        :title="'Ошибка входа:'"
        :text="loginError"
        type="error"
        variant="outlined"
    ></v-alert>
    <v-btn
        class="me-4"
        type="submit"
    >
      Войти
    </v-btn>
  </form>
</div>
</template>

<script>
import {signInWithEmailAndPassword} from "firebase/auth";
import {auth} from "@/main.js";
import {useUserStore} from "@/store/UserStore.js"
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
    }
  },
  methods: {
    async login() {
      try {
        const response = await signInWithEmailAndPassword(auth, this.user.email, this.user.password);
        const user = response.user;
        const store = useUserStore();
        store.setUser(user);

        this.loginAlert = 'Добро пожаловать!';

        await router.push({name: 'home'});
        window.location.reload();

        console.log(user);
      } catch (error) {
        console.error('Ошибка входа:', error);
        this.loginError = 'Проверьте введенные данные!';
      }
    },
    clearError() {
      this.loginError = null;
    }
  },
  watch: {
    'user.email': function () {
      this.clearError();
    },
    'user.password': function () {
      this.clearError();
    }
  }
}
</script>

<style scoped>

</style>