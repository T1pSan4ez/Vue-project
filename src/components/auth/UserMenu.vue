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

        <v-list-item link>
          <v-list-item-title>Темы</v-list-item-title>
          <template v-slot:append>
            <v-icon icon="mdi-menu-right" size="x-small"></v-icon>
          </template>

          <v-menu activator="parent" open-on-hover submenu>
            <v-list>
              <v-list-item v-for="theme in themes" :key="theme.value" @click="changeTheme(theme.value)" link>
                <v-list-item-title>{{ theme.name }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
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
import { useTheme } from 'vuetify';
import { getAuth, signOut } from "firebase/auth";
import { useUserStore } from '@/store/UserStore.js';

export default {
  name: 'UserMenu',
  data() {
    return {
      themes: [
        { name: 'Light', value: 'light' },
        { name: 'Dark', value: 'dark' },
        { name: 'Blackguard', value: 'blackguard' },
        { name: 'Polaris', value: 'polaris' },
        { name: 'Nebula', value: 'nebula' },
      ],
      theme: useTheme(),
      auth: getAuth(),
      userStore: useUserStore()
    };
  },
  methods: {
    changeTheme(themeName) {
      this.theme.global.name = themeName;
      localStorage.setItem('selectedTheme', themeName);
    },
    async logout() {
      try {
        await signOut(this.auth);
        this.userStore.clearUser();
        this.$router.push({ name: 'main' });
      } catch (error) {
        console.error("Ошибка выхода: ", error);
      }
    }
  },
  mounted() {
    const savedTheme = localStorage.getItem('selectedTheme');
    if (savedTheme) {
      this.theme.global.name = savedTheme;
    }
  }
};
</script>

ыке