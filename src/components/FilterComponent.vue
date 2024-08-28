<template>
  <v-container>
    <v-row>
      <v-col
          v-for="genre in genres"
          :key="genre.id"
          cols="auto"
          class="text-center"
      >
        <v-list-item
            @click="toggleGenre(genre.id)"
            :class="['cursor-style', { 'selected-genre': selectedGenres.includes(genre.id) }]"
        >
          {{ genre.name }}
        </v-list-item>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="4">
        <v-select
            v-model="sortOrder"
            :items="['Без сортировки', 'По убыванию', 'По возрастанию']"
            label="Сортировать по рейтингу"
        ></v-select>
        <v-btn color="primary" @click="applyFilter">Применить фильтр</v-btn>
      </v-col>
      <v-col cols="8">
        <p>Выбранные жанры:</p>
        <v-chip
            v-for="genre in selectedGenres"
            :key="genre"
        >
          {{ getGenreNameById(genre) }}
        </v-chip>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "FilterComponent",
  data() {
    return {
      genres: [
        {id: 28, name: 'Боевик'},
        {id: 12, name: 'Приключения'},
        {id: 35, name: 'Комедия'},
        {id: 80, name: 'Криминал'},
        {id: 99, name: 'Документальный'},
        {id: 18, name: 'Драма'},
        {id: 10751, name: 'Семейный'},
        {id: 14, name: 'Фэнтези'},
        {id: 36, name: 'История'},
        {id: 27, name: 'Ужасы'},
        {id: 10402, name: 'Музыка'},
        {id: 9648, name: 'Мистика'},
        {id: 10749, name: 'Романтика'},
        {id: 878, name: 'Научная фантастика'},
        {id: 53, name: 'Триллер'},
        {id: 10752, name: 'Военный'},
        {id: 37, name: 'Вестерн'},
      ],
      sortOrder: 'Без сортировки',
      selectedGenres: []
    }
  },
  methods: {
    toggleGenre(id) {
      const index = this.selectedGenres.indexOf(id);
      if (index === -1) {
        this.selectedGenres.push(id);
      } else {
        this.selectedGenres.splice(index, 1);
      }
    },
    getGenreNameById(id) {
      const genre = this.genres.find(genre => genre.id === id);
      return genre ? genre.name : '';
    },
    applyFilter() {
      this.$emit('filter-applied', { sortOrder: this.sortOrder, selectedGenres: this.selectedGenres });
    }
  }
}
</script>

<style scoped>
.cursor-style {
  cursor: pointer;
}
.cursor-style:hover {
  text-decoration: underline;
}
.selected-genre {
  font-weight: bold;
  text-decoration: underline;
  color: #1976D2;
}

.selected-chip {
  font-weight: bold;
  text-decoration: underline;
  color: #19d24d;
}
</style>
