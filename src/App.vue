<template>
  <div>
    <v-card>
      <v-container>
        <v-row justify="space-between">
          <v-col cols="auto">
            <v-switch label="Темная тема" inset @click="toggleTheme"></v-switch>
          </v-col>

          <v-col cols="auto">
            <v-tabs
                v-model="tab"
                align-tabs="center"
                color="deep-purple-accent-4"
            >
              <router-link to="/CardsComponent">
                <v-tab :value="1">Главная</v-tab>
              </router-link>
              <router-link to="/CardsComponent">
                <v-tab :value="2">Фильмы</v-tab>
              </router-link>
              <router-link to="/CardsComponent">
                <v-tab :value="3">Сериалы</v-tab>
              </router-link>
              <router-link to="/CardsComponent">
                <v-tab :value="4">Мультфильмы</v-tab>
              </router-link>
              <router-link to="/CardsComponent">
                <v-tab :value="5">Аниме</v-tab>
              </router-link>
            </v-tabs>
          </v-col>

          <v-col cols="auto">
            <v-btn>Войти</v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-card>

    <RouterView/>
  </div>
</template>

<script>
import { useTheme } from 'vuetify'

export default {
  name: "App",
  data() {
    return {
      tab: null,
      logo: '@/assets/logoWeb.png',
    };
  },
  setup() {
    const theme = useTheme()
    function toggleTheme() {
      theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark'
    }
    return { toggleTheme }
  }
};
</script>


<style scoped>

</style>
