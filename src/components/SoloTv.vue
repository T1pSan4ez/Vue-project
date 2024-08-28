<template>
  <div>
    <v-container class="width-container">
      <v-row>
        <v-col cols="4">
          <h2>{{ tvInfo.name }}</h2>
          <p>{{ tvInfo.original_name }}</p>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" md="4">
          <v-img :src="getPosterUrl(tvInfo.poster_path)"></v-img>
        </v-col>
        <v-col cols="12" md="8">
          <div class="about-movie">
            <p v-if="tvInfo.vote_average"><strong class="underline">Рейтинг IMDB:</strong><span
                :class="getRatingClass(tvInfo.vote_average)"> {{ tvInfo.vote_average }}</span>
              ({{ tvInfo.vote_count }})</p>
            <p v-if="tvInfo.first_air_date"><strong class="underline">Дата выхода первого эпизода:</strong>
              {{ tvInfo.first_air_date }}</p>
            <p v-if="productionCountries.length > 0"><strong class="underline">Страна:</strong>
              {{ getCountryName(productionCountries) }}</p>
            <p v-if="productionCompanies.length > 0"><strong class="underline">Производство:</strong>
              {{ getCompaniesName(productionCompanies) }}</p>
            <p v-if="genresInfo.length > 0"><strong class="underline">Жанр:</strong> {{ getGenresName(genresInfo) }}</p>
            <p v-if="tvInfo.budget"><strong class="underline">Бюджет:</strong> {{ tvInfo.budget }} $</p>
            <p v-if="tvInfo.tagline"><strong class="underline">Слоган:</strong> {{ tvInfo.tagline }}</p>
          </div>
        </v-col>
      </v-row>
    </v-container>
    <v-container class="width-container">
      <v-row>
        <v-col cols="12" v-if="tvInfo.overview">
          <h2>Описание</h2>
          <p class="text-h6">{{ tvInfo.overview }}</p>
        </v-col>
        <v-col cols="12" v-else>
          <h2>Описание</h2>
          <p class="text-h6">Нет описания</p>
        </v-col>
      </v-row>
    </v-container>
    <v-container class="width-container">
      <v-row>
        <v-col cols="12">
          <h2>Просмотр сезонов</h2>

          <v-container class="mx-auto" elevation="16" max-width="1200">
            <v-slide-group
                v-model="model"
                class="pa-4"
                selected-class="bg-primary"
                show-arrows
            >
              <v-slide-group-item
                  v-for="season in seasons"
                  :key="season.id"
                  v-slot="{ isSelected, toggle, selectedClass }"
              >
                <v-card
                    :class="['ma-4', selectedClass]"
                    color="grey-lighten-1"
                    height="450"
                    width="270"
                    @click="toggle"
                >
                  <div v-if="season.poster_path">
                    <p class="text-h6 card-tv-season">{{ season.name }}</p>
                    <v-img cover :src="getPosterUrl(season.poster_path)"></v-img>
                  </div>
                  <div v-else>
                    <p class="text-h6 card-tv-season">{{ season.name }}</p>
                    <v-img cover :src="getPosterUrl(tvInfo.poster_path)"></v-img>
                  </div>

                  <div class="d-flex fill-height align-center justify-center">
                    <v-scale-transition>
                      <v-icon
                          v-if="isSelected"
                          color="white"
                          icon="mdi-close-circle-outline"
                          size="48"
                      ></v-icon>
                    </v-scale-transition>
                  </div>
                </v-card>
              </v-slide-group-item>
            </v-slide-group>
            <v-expand-transition>
              <div v-if="model != null">
                <div class="season-info">
                  <v-row>
                    <v-col cols="4" class="about-movie">
                      <p class="text-h6" v-if="seasons[model].name">Название сезона: {{ seasons[model].name }}</p>
                      <p class="text-h6" v-if="seasons[model].air_date">Выход сезона: {{ seasons[model].air_date }}</p>
                      <p class="text-h6" v-if="seasons[model].season_number">Номер сезона:
                        {{ seasons[model].season_number }}</p>
                      <p class="text-h6" v-if="seasons[model].episode_count">Кол-во серий:
                        {{ seasons[model].episode_count }}</p>
                      <p class="text-h6" v-if="seasons[model].vote_average">Рейтинг сезона: <span
                          :class="getRatingClass(seasons[model].vote_average)">{{ seasons[model].vote_average }}</span>
                      </p>
                    </v-col>
                    <v-col cols="8">
                      <p class="text-h6" v-if="seasons[model].overview">{{ seasons[model].overview }}</p>
                      <p class="text-h6" v-else>Нет описания</p>
                    </v-col>
                  </v-row>
                </div>
              </div>
            </v-expand-transition>
          </v-container>
        </v-col>
      </v-row>
    </v-container>

  </div>
</template>

<script>
import Api from "@/services/api.js";
import {ratingColor} from "@/mixins/RatingColor.js";

import {Navigation} from 'swiper/modules';
import 'swiper/css';


export default {
  name: "SoloTv",
  mixins: [ratingColor],
  props: {
    id: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      tvInfo: [],
      productionCompanies: [],
      genresInfo: [],
      belongToCollection: [],
      productionCountries: [],
      seasons: [],
      model: null,
    }
  },
  methods: {
    async getInfo() {
      const response = await Api.getTvShowDetails(this.id);
      this.tvInfo = response;
      console.log(this.tvInfo);
      this.genresInfo = response.genres;
      this.productionCompanies = response.production_companies;
      this.productionCountries = response.production_countries;
      this.seasons = response.seasons;
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
  setup() {
    const onSwiper = (swiper) => {
      console.log(swiper);
    };
    const onSlideChange = () => {
      console.log('slide change');
    };
    return {
      onSwiper,
      onSlideChange,
      modules: [Navigation],
    };
  },
  mounted() {
    this.getInfo();
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

.card-tv-season {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>