<template>
  <div>
    <v-container>
      <v-row justify="space-between">
        <v-col cols="auto">
          <v-tabs v-model="tab" align-tabs="center" color="deep-orange">
            <v-tab :value="1" @click="filterCategory('movies')">Фильмы</v-tab>
            <v-tab :value="2" @click="filterCategory('tvShows')">Сериалы</v-tab>
            <v-tab :value="3" @click="filterCategory('cartoons')">Мультфильмы</v-tab>
          </v-tabs>
        </v-col>
        <v-col>
          <v-text-field v-instruction="'Для поиска сериалов, выберите категорию слева!'" v-model="searchQuery"
                        label="Поиск по названию:" @input="searchFilms" append-inner-icon="mdi-magnify"></v-text-field>
        </v-col>
      </v-row>
      <v-btn @click="showFilters = !showFilters">Фильтры</v-btn>
      <v-slide-y-transition>
        <div v-show="showFilters">
          <FilterComponent @filter-applied="handleFilterApplied"/>
        </div>
      </v-slide-y-transition>
    </v-container>
    <v-container>
      <v-row v-if="cards.length === 0">
        <v-col>
          <v-alert type="warning">Извините, ничего не найдено!</v-alert>
        </v-col>
      </v-row>
      <v-row v-else>
        <v-col v-for="card in cards" :key="card.id" cols="12" sm="12" md="6" lg="3">
          <component :is="currentFilter === 'tvShows' ? 'TvComponent' : 'PopularComponent'" :card="card"/>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-pagination @click="handlePageChange" v-model="page" :length="totalPages" :total-visible="7"></v-pagination>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import PopularComponent from "@/components/PopularComponent.vue";
import TvComponent from "@/components/TvComponent.vue";
import ApiService from "@/services/api.js";
import FilterComponent from "@/components/FilterComponent.vue";
import { FilterStore } from "@/store/FilterStore.js";

export default {
  name: "CardsComponent",
  components: {
    PopularComponent,
    TvComponent,
    FilterComponent,
  },
  data() {
    return {
      tab: null,
      cards: [],
      page: 1,
      totalPages: 1,
      maxPages: 500,
      searchQuery: "",
      currentFilter: '',
      showFilters: false,
    };
  },
  computed: {
    filterStore() {
      return FilterStore();
    },
    sortOrder() {
      return this.filterStore.sortOrder === 'По убыванию' ? 'desc' : this.filterStore.sortOrder === 'По возрастанию' ? 'asc' : '';
    },
    selectedGenres() {
      return this.filterStore.selectedGenres;
    },
  },
  methods: {
    async getPopular() {
      try {
        const response = await ApiService.getPopularFilmsWithFilters(
            this.page,
            this.sortOrder === 'desc' || this.sortOrder === 'asc' ? this.sortOrder : '',
            this.selectedGenres.join(',')
        );
        this.cards = response.results;
        this.updatePagination(response.total_pages);
      } catch (error) {
        console.error("Ошибка при загрузке популярных фильмов:", error);
      }
    },
    async getFilms() {
      try {
        let response;
        if (this.searchQuery) {
          response = await this.searchByName();
        } else {
          const genres = this.selectedGenres.length > 0 ? this.selectedGenres.join(',') : null;
          response = await this.fetchFilteredFilms(genres);
        }
        this.cards = response.results;
        this.updatePagination(response.total_pages);
      } catch (error) {
        console.error("Ошибка при загрузке данных:", error);
      }
    },
    async fetchFilteredFilms(genres) {
      switch (this.currentFilter) {
        case 'movies':
          return await ApiService.getFilmsWithGenres(this.page, this.sortOrder, genres);
        case 'tvShows':
          return await ApiService.getTvShows(this.page, this.sortOrder, genres);
        case 'cartoons':
          return await ApiService.getCartoons(this.page, this.sortOrder, genres);
        default:
          return await ApiService.getPopularFilmsWithFilters(this.page, this.sortOrder, genres);
      }
    },
    handleFilterApplied(filterData) {
      this.filterStore.setSortOrder(filterData.sortOrder);
      this.filterStore.setSelectedGenres(filterData.selectedGenres);
      this.page = 1;
      this.getFilms();
    },
    handlePageChange() {
      this.getFilms();
    },
    async searchByName() {
      let type = this.currentFilter === 'tvShows' ? 'tv' : 'movie';
      return await ApiService.searchByName(this.searchQuery, type, this.page);
    },
    filterCategory(filter) {
      this.filterStore.resetFilters();

      this.page = 1;
      this.currentFilter = filter;
      this.searchQuery = "";
      this.getFilms();
    },
    searchFilms() {
      this.page = 1;
      this.getFilms();
    },
    updatePagination(totalPages) {
      window.scrollTo(0, 0);
      this.totalPages = Math.min(totalPages, this.maxPages);
    },
  },
  mounted() {
    this.getPopular();
  },
};
</script>