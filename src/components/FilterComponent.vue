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
            v-for="genreName in selectedGenreNames"
            :key="genreName"
            class="mr-2"
        >
          {{ genreName }}
        </v-chip>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { FilterStore } from '@/store/FilterStore';
import FirestoreService from '@/services/FirestoreService';

export default {
  name: "FilterComponent",
  data() {
    return {
      genres: [],
    };
  },
  computed: {
    filterStore() {
      return FilterStore();
    },
    selectedGenres() {
      return this.filterStore.selectedGenres;
    },
    sortOrder: {
      get() {
        return this.filterStore.sortOrder;
      },
      set(value) {
        this.filterStore.setSortOrder(value);
      },
    },
    selectedGenreNames() {
      return this.selectedGenres.map(id => {
        const genre = this.genres.find(genre => genre.id === id);
        return genre ? genre.name : '';
      });
    }
  },
  methods: {
    async loadGenres() {
      this.genres = await FirestoreService.getGenres();
    },
    toggleGenre(id) {
      const index = this.selectedGenres.indexOf(id);
      if (index === -1) {
        this.filterStore.setSelectedGenres([...this.selectedGenres, id]);
      } else {
        this.filterStore.setSelectedGenres(this.selectedGenres.filter(genreId => genreId !== id));
      }
    },
    applyFilter() {
      this.$emit('filter-applied', { sortOrder: this.sortOrder, selectedGenres: this.selectedGenres });
    }
  },
  mounted() {
    this.loadGenres();
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
</style>
