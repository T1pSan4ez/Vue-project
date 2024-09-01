<!-- components/NotFound.vue -->
<template>
  <v-container max-width="400px" class="text-center" v-instruction="'Похоже вы ввели неправильный адресс. Или не имеете доступа к этой странице!'">
    <h1>404 Страница не найдена</h1>
    <p class="mb-5">Попробуйте перейти на главную:</p>
    <router-link to="/">
      <v-btn :to="{ name: 'main' }" color="primary">Вернуться на главную</v-btn>
    </router-link>
  </v-container>
</template>

<script>
export default {
  name: "NotFound",
};
</script>

<style scoped>
.text-center {
  text-align: center;
  margin-top: 50px;
}
</style>
