<template>
  <v-app class="bg-card">
    <v-card class="bg-card">
      <v-container class="bg-container">
        <v-row class="d-flex align-center justify-space-between">
          <v-col cols="auto">
            <v-tabs v-model="tab" align-tabs="center" color="deep-orange" hide-slider>
              <router-link :to="{ name: 'main' }">
                <v-tab :value="1">Главная</v-tab>
              </router-link>
                <ThemeSelector />
            </v-tabs>
          </v-col>
          <v-col cols="auto" v-if="!userStore.user">
            <v-btn class="color-login" @click="toggleModal(true)">Войти</v-btn>
          </v-col>
          <v-col cols="auto" v-if="userStore.user">
            <UserMenu />
          </v-col>
        </v-row>
      </v-container>
    </v-card>
    <ModalForm :isVisible="modalState.isVisible" @close="toggleModal(false)" :isRegistration="modalState.isRegistration" @toggle-mode="toggleRegistration">
      <template v-slot:header>
        <h3>{{ modalState.isRegistration ? 'Регистрация' : 'Авторизация' }}</h3>
      </template>
      <template v-slot:body>
        <component :is="modalState.isRegistration ? RegistrationForm : LoginForm" />
      </template>
    </ModalForm>
    <RouterView />
  </v-app>
</template>

<script setup>
import {ref, onMounted} from "vue";
import {useUserStore} from "@/store/UserStore.js";
import ModalForm from "@/components/auth/ModalForm.vue";
import LoginForm from "@/components/auth/LoginForm.vue";
import RegistrationForm from "@/components/auth/RegistrationForm.vue";
import UserMenu from "@/components/auth/UserMenu.vue";
import ThemeSelector from "@/components/ThemeSelector.vue";

const userStore = useUserStore();
const tab = ref();
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
