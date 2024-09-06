<template>
  <v-app class="bg-card">
    <v-app-bar class="bg-card ">
      <v-container class="bg-container">
        <v-row class="justify-space-between">
          <v-col cols="auto">
            <v-btn :to="{ name: 'main' }" color="primary">Главная</v-btn>
            <v-btn :to="{ name: 'movie' }" color="primary">Фильмы</v-btn>
            <v-btn :to="{ name: 'tv-shows' }" color="primary">Сериалы</v-btn>
            <v-btn :to="{ name: 'cartoons' }" color="primary">Мультфильмы</v-btn>
          </v-col>
          <div  class="d-flex justify-end align-center">
            <div>
              <ThemeSelector />
            </div>
            <v-col cols="auto" v-if="!userStore.user">
              <v-btn class="color-login" @click="toggleModal(true)">Войти</v-btn>
            </v-col>
            <v-col cols="auto" v-if="userStore.user">
              <UserMenu />
            </v-col>
          </div>
        </v-row>
      </v-container>
    </v-app-bar>
    <ModalForm :isVisible="modalState.isVisible" @close="toggleModal(false)" :isRegistration="modalState.isRegistration" @toggle-mode="toggleRegistration">
      <template v-slot:header>
        <h3>{{ modalState.isRegistration ? 'Регистрация' : 'Авторизация' }}</h3>
      </template>
      <template v-slot:body>
        <component :is="modalState.isRegistration ? RegistrationForm : LoginForm" />
      </template>
    </ModalForm>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script setup>
import {ref, onMounted} from "vue";
import {useUserStore} from "@/store/UserStore.js";
import ModalForm from "@/components/auth/ModalForm.vue";
import LoginForm from "@/components/auth/LoginForm.vue";
import RegistrationForm from "@/components/auth/RegistrationForm.vue";
import UserMenu from "@/components/auth/UserMenu.vue";
import ThemeSelector from "@/components/auth/ThemeSelector.vue";

const userStore = useUserStore();
const modalState = ref({
  isVisible: false,
  isRegistration: false,
});

const toggleModal = (isVisible) => {
  modalState.value.isVisible = isVisible;
};

const toggleRegistration = () => {
  modalState.value.isRegistration = !modalState.value.isRegistration;
};

onMounted(() => {
  userStore.initUser();
});
</script>

<style scoped>
.color-login {
  background-color: #3dae65;
}

</style>
