<template>
<div>
  <v-container class="search-container">
    <v-row>
      <v-col>
        <v-text-field
            v-model="searchQuery"
            label="Поиск по названию:"
            @input="searchFilms"
            append-inner-icon="mdi-magnify"
        ></v-text-field>
      </v-col>
    </v-row>
  </v-container>
  <v-container class="films-container">
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
        <CardComponent
            :card="card"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col>
          <v-pagination @click="getFilms"
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
import axiosInstance from "@/services/axios.js";
import CardComponent from "@/components/CardComponent.vue";

export default {
  name: "CardsComponent",
  components: {
    CardComponent,
  },
  data() {
    return {
      myApiKey: '0099006263f714dc2164a25ebd2cbce3',
      cards: [],
      show: false,
      page: 1,
      totalPages: 1,
      maxPages: 500,
      searchQuery: "",
    };
  },
  methods: {
    async getFilms() {
      let endpoint = `movie/popular?api_key=${this.myApiKey}&language=ru-RU&page=${this.page}`;

      if (this.searchQuery) {
        endpoint = `search/movie?api_key=${this.myApiKey}&language=ru-RU&query=${this.searchQuery}&page=${this.page}`;
      }

      const response = await axiosInstance.get(endpoint);
      this.cards = response.data.results;

      this.updatePagination(response.data.total_pages);

      console.log(response.data);
    },
    searchFilms() {
      this.page = 1;
      this.getFilms();
    },
    updatePagination(totalPages) {
      if (totalPages < this.maxPages) {
        this.totalPages = totalPages;
      } else {
        this.totalPages = this.maxPages;
      }
    },
  },
  mounted() {
    this.getFilms();
  },
};

</script>

<style scoped>
.films-container {
  width: 60%;
}

.search-container {
  width: 65%;
}
</style>