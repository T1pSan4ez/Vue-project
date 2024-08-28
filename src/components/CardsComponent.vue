<template>
  <div>
    <v-container>
      <v-row justify="space-between">
        <v-col cols="auto">
          <v-tabs
              v-model="tab"
              align-tabs="center"
              color="blue darken-2"
          >
            <v-tab :value="1" @click="filterCategory('movies')">Фильмы</v-tab>
            <v-tab :value="2" @click="filterCategory('tvShows')">Сериалы</v-tab>
            <v-tab :value="3" @click="filterCategory('cartoons')">Мультфильмы</v-tab>
          </v-tabs>
        </v-col>
        <v-col>
          <v-text-field
              v-model="searchQuery"
              label="Поиск по названию:"
              @input="searchFilms"
              append-inner-icon="mdi-magnify"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-btn @click="showFilters = !showFilters">
        Фильтры
      </v-btn>
      <v-slide-y-transition>
        <div v-show="showFilters">
          <FilterComponent @filter-applied="handleFilterApplied" />
        </div>
      </v-slide-y-transition>
    </v-container>
    <v-container>
      <v-row v-if="cards.length === 0">
        <v-col>
          <v-alert type="warning">
            Извините, ничего не найдено!
          </v-alert>
        </v-col>
      </v-row>
      <v-row v-else>
        <v-col v-for="card in cards" :key="card.id"
               cols="12"
               sm="12"
               md="6"
               lg="3"
        >
          <component
              :is="currentFilter === 'tvShows' ? 'TvComponent' : 'PopularComponent'"
              :card="card"
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-pagination @click="handlePageChange"
                        v-model="page"
                        :length="totalPages"
                        :total-visible="7"
          ></v-pagination>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import PopularComponent from "@/components/PopularComponent.vue";
import TvComponent from "@/components/TvComponent.vue";
import Api from "@/services/api.js";
import FilterComponent from "@/components/FilterComponent.vue";

export default {
  name: "CardsComponent",
  components: {
    PopularComponent,
    TvComponent,
    FilterComponent
  },
  data() {
    return {
      tab: null,
      myApiKey: '0099006263f714dc2164a25ebd2cbce3',
      cards: [],
      show: false,
      page: 1,
      totalPages: 1,
      maxPages: 500,
      searchQuery: "",
      currentFilter: '',
      showFilters: false,
      sortOrder: 'desc',
    };
  },
  methods: {
    async getPopular() {
      const response = await Api.getPopular(this.page);
      console.log(response);
      this.cards = response.results;
      this.updatePagination(response.total_pages);
    },
    async getFilms() {
      let response = await Api.getPopular(this.page);
      try {
        if (this.searchQuery) {
          response = await this.searchByName();
        } else {
          if (this.currentFilter === 'movies') {
            response = await Api.getFilms(this.page);
          } else if (this.currentFilter === 'tvShows') {
            response = await Api.getTvShows(this.page);
          } else if (this.currentFilter === 'cartoons') {
            response = await Api.getCartoons(this.page);
          }
        }
        this.cards = response.results;
        this.updatePagination(response.total_pages);
      } catch (error) {
        console.error("Ошибка при загрузке данных:", error);
      }
    },
    handleFilterApplied(filterData) {
      this.sortOrder = filterData.sortOrder === 'По убыванию' ? 'desc' : filterData.sortOrder === 'По возрастанию' ? 'asc' : null;
      this.selectedGenres = filterData.selectedGenres;
      this.page = 1;
      this.getFilmsWithSorting();
    },
    async getFilmsWithSorting() {
      let response = await Api.getPopular(this.page);
      try {
        if (this.searchQuery) {
          response = await this.searchByName();
        } else {
          const genres = this.selectedGenres.length > 0 ? this.selectedGenres.join(',') : null;
          if (this.currentFilter === 'movies') {
            response = await Api.getFilmsWithGenres(this.page, this.sortOrder, genres);
          } else if (this.currentFilter === 'tvShows') {
            response = await Api.getTvShows(this.page, this.sortOrder, genres);
          } else if (this.currentFilter === 'cartoons') {
            response = await Api.getCartoons(this.page, this.sortOrder, genres);
          }
        }

        this.cards = response.results;
        this.updatePagination(response.total_pages);

      } catch (error) {
        console.error("Ошибка при сортировке данных:", error);
      }
    },
    handlePageChange() {
      if (this.sortOrder) {
        this.getFilmsWithSorting();
      } else {
        this.getFilms();
      }
    },
    async searchByName() {
      let type = 'movie';
      if (this.currentFilter === 'tvShows') {
        type = 'tv';
      } else if (this.currentFilter === 'cartoons') {
        type = 'movie';
      }
      return await Api.searchByName(this.searchQuery, type, this.page);
    },
    filterCategory(filter) {
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
      this.totalPages = totalPages < this.maxPages ? totalPages : this.maxPages;
    },

  },
  mounted() {
    this.getPopular();
  },
};

</script>

<style scoped>

</style>