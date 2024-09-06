<template>
  <v-list-item link>
    <template v-slot:prepend>
      <v-icon icon="mdi-menu-left" size="x-small"></v-icon>
    </template>
    <v-list-item-title>Темы</v-list-item-title>
    <v-menu :location="'start'" activator="parent" open-on-hover submenu>
      <v-list>
        <v-list-item v-for="theme in themes" :key="theme.value" @click="changeTheme(theme.value)" link>
          <v-list-item-title>{{ theme.name }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-list-item>
</template>

<script setup>
import { ref, onMounted} from 'vue';
import { useTheme } from 'vuetify';
import Constants from '/src/constants.js';

const themes = ref([
  { name: 'Light', value: Constants.THEME_LIGHT },
  { name: 'Dark', value: Constants.THEME_DARK },
  { name: 'Blackguard', value: Constants.THEME_BLACKGUARD },
  { name: 'Polaris', value: Constants.THEME_POLARIS },
  { name: 'Nebula', value: Constants.THEME_NEBULA },
]);

const theme = useTheme();

function changeTheme(themeName) {
  theme.global.name.value = themeName;
  localStorage.setItem(Constants.LOCAL_STORAGE_SELECTED_THEME, themeName);
}

onMounted(() => {
  const savedTheme = localStorage.getItem(Constants.LOCAL_STORAGE_SELECTED_THEME);
  if (savedTheme) {
    theme.global.name.value = savedTheme;
  }
});
</script>

<style scoped>
</style>
