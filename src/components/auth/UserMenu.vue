<template>
  <div class="text-center">
    <v-menu>
      <template v-slot:activator="{ props }">
        <v-btn color="primary" dark v-bind="props">Кабинет</v-btn>
      </template>
      <v-list>
        <v-list-item :to="{ name: 'user' }">
          <v-list-item-title>Профиль</v-list-item-title>
        </v-list-item>
        <v-list-item :to="{ name: 'favorite' }">
          <v-list-item-title>Избранное</v-list-item-title>
        </v-list-item>
        <v-list-item @click="logout">
          <v-list-item-title>Выйти</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </div>
</template>

<script>
import { getAuth, signOut } from "firebase/auth";
import { useUserStore } from '@/store/UserStore.js';

export default {
  name: 'UserMenu',
  data() {
    return {
      auth: getAuth(),
      userStore: useUserStore()
    };
  },
  methods: {
    async logout() {
      try {
        await signOut(this.auth);
        this.userStore.clearUser();
        this.$router.push({name: 'main'});
      } catch (error) {
        console.error("Ошибка выхода: ", error);
      }
    }
  }
};
</script>
