<template>
  <div>
    <v-container>
      <v-row justify="space-between">
        <v-col>
          <v-text-field v-instruction="'Для поиска сериалов, выберите соотвующую категорию!'" v-model="searchQuery"
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
import PopularComponent from "@/components/movie/PopularComponent.vue";
import TvComponent from "@/components/tvShows/TvComponent.vue";
import ApiService from "@/services/api.js";
import FilterComponent from "@/components/movieFunctional/FilterComponent.vue";
import {FilterStore} from "@/store/FilterStore.js";
import Constants from "/src/constants.js";

export default {
  name: "CardsComponent",
  components: {
    PopularComponent,
    TvComponent,
    FilterComponent,
  },
  props: {
    currentFilter: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      cards: [],
      page: 1,
      totalPages: 1,
      maxPages: 500,
      searchQuery: "",
      showFilters: false,
    };
  },
  computed: {
    filterStore() {
      return FilterStore();
    },
    sortOrder() {
      return this.filterStore.sortOrder === 'По убыванию' ? Constants.SORT_DESC : this.filterStore.sortOrder === 'По возрастанию' ? Constants.SORT_ASC : '';
    },
    selectedGenres() {
      return this.filterStore.selectedGenres;
    },
  },
  methods: {
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
        case Constants.FILTER_MOVIES:
          return await ApiService.getFilmsWithGenres(this.page, this.sortOrder, genres);
        case Constants.FILTER_TV_SHOWS:
          return await ApiService.getTvShows(this.page, this.sortOrder, genres);
        case Constants.FILTER_CARTOONS:
          return await ApiService.getCartoons(this.page, this.sortOrder, genres);
        default:
          return await ApiService.getPopularFilmsWithFilters(this.page, this.sortOrder, genres);
      }
    },
    handleFilterApplied(filterData) {
      this.filterStore.setSortOrder(filterData.sortOrder);
      this.filterStore.setSelectedGenres(filterData.selectedGenres);
      this.page = 1;
      this.updateRouteQuery();
      this.getFilms();
    },
    handlePageChange() {
      this.updateRouteQuery();
      this.getFilms();
    },
    async searchByName() {
      let type = this.currentFilter === Constants.FILTER_TV_SHOWS ? Constants.TV : Constants.MOVIE;
      return await ApiService.searchByName(this.searchQuery, type, this.page);
    },
    searchFilms() {
      this.page = 1;
      this.updateRouteQuery();
      this.getFilms();
    },
    updatePagination(totalPages) {
      window.scrollTo(0, 0);
      this.totalPages = Math.min(totalPages, this.maxPages);
    },
    updateRouteQuery() {
      const query = {};

      if (this.searchQuery) {
        query.search = this.searchQuery;
      }
      if (this.currentFilter) {
        query.filter = this.currentFilter;
      }
      if (this.page > 1) {
        query.page = this.page;
      }

      this.$router.push({name: this.$route.name, query});
    },

  },
  watch: {
    '$route.query': {
      async handler(newQuery) {
        this.page = +newQuery.page || 1;
        this.searchQuery = newQuery.search || '';
        await this.getFilms();
      },
      immediate: true,
    },
  },
  async mounted() {
    await this.getFilms();
  },
};
</script>