<template>
  <div>
    <form @submit.prevent="register">
      <v-text-field
          v-model="user.email"
          label="E-mail регистрация"
      ></v-text-field>
      <v-text-field
          v-model="user.password"
          label="Пароль"
          type="password"
      ></v-text-field>
      <v-alert
          class="mb-3"
          v-if="registerAlert"
          :title="'Успешно:'"
          :text="registerAlert"
          color="success"
          icon="$success"
          variant="outlined"
      ></v-alert>
      <v-alert
          class="mb-3"
          v-if="registrationError"
          :title="'Ошибка регистрации:'"
          :text="registrationError"
          type="error"
          variant="outlined"
      ></v-alert>
      <v-btn
          class="me-4 "
          type="submit"
      >
        Зарегистрироваться
      </v-btn>
    </form>



  </div>
</template>


<script>
import {auth} from "@/main.js";
import {createUserWithEmailAndPassword} from "firebase/auth"
import {useUserStore} from "@/store/UserStore.js";
import router from "@/router/index.js";

export default {
  data() {
    return {
      user: {
        email: '',
        password: ''
      },
      registerAlert: null,
      registrationError: null
    }
  },
  methods: {
    async register() {
      try {
        const response = await createUserWithEmailAndPassword(auth, this.user.email, this.user.password);
        const user = response.user;
        const store = useUserStore();
        store.setUser(user);

        this.registerAlert = 'Аккаунт создан!';

        await router.push({name: 'home'});
        window.location.reload();

        console.log(user);
      } catch (error) {
        console.error('Ошибка регистрации:', error);
        this.registrationError = 'Ошибка сервера или такой пользователь уже есть! Попробуйте снова!';
      }
    },
    clearError() {
      this.registrationError = null;
    }
  },
  watch: {
    'user.email': function () {
      this.clearError();
    }
  }
}

</script>


<style scoped>

</style>