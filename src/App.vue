<template>
  <div>
    <v-card>
      <v-container>
        <v-row justify="space-between">
          <v-col cols="auto">
            <v-switch label="Светлая тема" inset @click="toggleTheme"></v-switch>
          </v-col>
          <v-col cols="auto">
            <v-tabs
                v-model="tab"
                align-tabs="center"
                color="blue darken-2"
            >
              <router-link :to="{name: 'main'}">
                <v-tab :value="1">Главная</v-tab>
              </router-link>
            </v-tabs>
          </v-col>
          <v-col cols="auto" v-if="!userStore.user">
            <v-btn class="color-login" @click="showModal = true">Войти</v-btn>
          </v-col>
          <v-col cols="auto" v-if="userStore.user">
            <v-btn class="color-logout" @click="logout">Выйти</v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
    <ModalForm
        :isVisible="showModal"
        @close="showModal = false"
        :isRegistration="isRegistration"
        @toggle-mode="toggleMode"
    >
      <template v-slot:header>
        <h3>{{ isRegistration ? 'Регистрация' : 'Авторизация' }}</h3>
      </template>
      <template v-slot:body>
        <component :is="isRegistration ? RegistrationForm : LoginForm"/>
      </template>
    </ModalForm>
    <RouterView/>
  </div>
</template>

<script setup>
import {useTheme} from 'vuetify'
import {ref, onMounted} from "vue";
import {useUserStore} from "@/store/UserStore.js";
import LoginForm from "@/components/auth/LoginForm.vue";
import ModalForm from "@/components/auth/ModalForm.vue";
import RegistrationForm from "@/components/auth/RegistrationForm.vue";
import {getAuth, signOut} from "firebase/auth";

const showModal = ref(false);
const isRegistration = ref(false);
const userStore = useUserStore();
const tab = ref();
const theme = useTheme();
const auth = getAuth();

const toggleTheme = () => {
  theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark';
}

const toggleMode = () => {
  isRegistration.value = !isRegistration.value;
}

const logout = async () => {
  try {
    await signOut(auth);
    userStore.setUser(null);
    showModal.value = true;
  } catch (error) {
    console.error("Ошибка выхода: ", error);
  }
}

onMounted(() => {
  const isUserLoggedIn = userStore.initUser();
  if (!isUserLoggedIn) {
    showModal.value = true;
  }
});
</script>

<style scoped>
.color-login {
  background-color: #3dae65;
}

.color-logout {
  background-color: #c52b3c;
}
</style>
