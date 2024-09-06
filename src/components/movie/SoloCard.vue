<template>
  <div>
    <v-container class="width-container">
      <v-row>
        <v-col cols="8">
          <h2>{{ movieInfo.title }}</h2>
          <p>{{ movieInfo.original_title }}</p>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" md="4">
          <v-img :src="movieInfo.poster_path ? getPosterUrl(movieInfo.poster_path) : '/public/imagenotfound.png'"></v-img>
        </v-col>
        <v-col cols="12" md="8">
          <div class="about-movie">
            <p v-if="movieInfo.vote_average"><strong class="underline">Рейтинг IMDB:</strong><span
                :class="getRatingClass(movieInfo.vote_average)"> {{ movieInfo.vote_average }}</span>
              ({{ movieInfo.vote_count }})</p>
            <p v-if="movieInfo.release_date"><strong class="underline">Дата выхода: </strong>
              <span v-month-name>{{ movieInfo.release_date }}</span>
             </p>
            <p v-if="productionCountries.length > 0"><strong class="underline">Страна:</strong>
              {{ getCountryName(productionCountries) }}</p>
            <p v-if="productionCompanies.length > 0"><strong class="underline">Производство:</strong>
              {{ getCompaniesName(productionCompanies) }}</p>
            <p v-if="genresInfo.length > 0"><strong class="underline">Жанр:</strong> {{ getGenresName(genresInfo) }}</p>
            <p v-if="movieInfo.budget"><strong class="underline">Бюджет:</strong> {{ movieInfo.budget }} $</p>
            <p v-if="movieInfo.tagline"><strong class="underline">Слоган:</strong> {{ movieInfo.tagline }}</p>
          </div>
          <div class="button-container">
            <v-btn v-if="isUserLoggedIn && !isFavorite" color="primary" @click="addToFavorites('favorites', { user_id: user.uid, movie_id: movieInfo.id, title: movieInfo.title })">Добавить в избранное</v-btn>
            <v-btn v-if="isUserLoggedIn && isFavorite" color="primary" disabled>В избранном</v-btn>
          </div>
        </v-col>
      </v-row>
    </v-container>
    <v-container class="width-container" v-if="movieInfo.overview">
      <v-row>
        <v-col cols="12">
          <h2>Описание</h2>
          <p>{{ movieInfo.overview }}</p>
        </v-col>
      </v-row>
    </v-container>
    <v-container class="width-container">
      <v-row>
        <v-col cols="12">
          <h2>Просмотр видео</h2>
          <iframe v-if="videos.length > 0" :src="getVideoUrl(videos[videos.length - 1].key)" width="100%" height="500"
                  allowfullscreen></iframe>
          <p v-else>Видео недоступно</p>
        </v-col>
      </v-row>

      <v-container class="width-container">
        <RatingComponent v-if="movieInfo.id" :movieId="movieInfo.id"/>
      </v-container>

    </v-container>
    <v-container class="width-container">
      <CommentsComponent v-if="movieInfo.id" :movieId="movieInfo.id"/>
    </v-container>
  </div>
</template>

<script>
import Api from "@/services/api.js";
import { RatingMixin } from "@/mixins/RatingMixin.js";
import { FavoriteMixin } from "@/mixins/FavoriteMixin.js";
import CommentsComponent from "@/components/movieFunctional/CommentsComponent.vue";
import RatingComponent from "@/components/movieFunctional/RatingComponent.vue";
import Constants from "@/constants.js";
import monthNameDirective from "@/directives/monthNameDirective.js";

export default {
  name: "SoloCard",
  components: {
    CommentsComponent,
    RatingComponent
  },
  directives: {
    monthName: monthNameDirective,
  },
  mixins: [RatingMixin, FavoriteMixin],
  props: {
    id: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      movieInfo: [],
      productionCompanies: [],
      genresInfo: [],
      belongToCollection: [],
      productionCountries: [],
      videos: [],
    }
  },
  computed: {
    isUserLoggedIn() {
      return !!this.user;
    }
  },
  methods: {
    async getInfo() {
      const response = await Api.getMovieDetails(this.id);
      console.log(response);
      this.movieInfo = response;

      this.productionCompanies = response.production_companies;
      this.genresInfo = response.genres;
      this.belongToCollection = response.belongs_to_collection;
      this.productionCountries = response.production_countries;

      if (this.user) {
        await this.checkIfFavorite(Constants.COLLECTION_FAVORITES, Constants.FIELD_MOVIE_ID, this.movieInfo.id);
      }
    },
    async getVideos() {
      const response = await Api.getVideos(this.id);
      this.videos = response.results;
    },
    getVideoUrl(videoKey) {
      return `https://www.youtube.com/embed/${videoKey}`;
    },
    getPosterUrl(posterPath) {
      return `https://image.tmdb.org/t/p/original/${posterPath}`;
    },
    getCountryName(country) {
      return country.map(country => country.name).join(", ");
    },
    getCompaniesName(company) {
      return company.map(company => company.name).join(", ");
    },
    getGenresName(genre) {
      return genre.map(genre => genre.name).join(", ");
    },
  },
  mounted() {
    this.getInfo();
    this.getVideos();
    this.user = this.userStore.user;
  },
}
</script>

<style scoped>
.green-text {
  color: #3dae65;
}

.orange-text {
  color: orange;
}

.red-text {
  color: red;
}

.underline {
  text-decoration: underline;
}

.about-movie {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.width-container {
  max-width: 1200px;
}

.button-container {
  margin-top: 25px;
}
</style>
