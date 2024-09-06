<template>
  <div>
    <v-card class="mx-auto" max-width="250">
      <v-img
          height="400px"
          :src="getPosterUrl(card.poster_path)"
          cover
          class="cursor-style"
          @click="goToMovieDetails(card.id)"
      ></v-img>
      <v-card-title class="cursor-style" @click="goToMovieDetails(card.id)">{{ card.name }}</v-card-title>
      <v-card-subtitle class="mb-3"><strong>{{ card.original_name }}</strong></v-card-subtitle>
      <v-card-subtitle class="mb-3" v-month-name v-if="card.first_air_date">
        {{ card.first_air_date }}
      </v-card-subtitle>
      <v-card-subtitle v-if="card.vote_average" class="mb-3">
        <span>Рейтинг: </span>
        <span :class="getRatingClass(card.vote_average)">{{ formatRating(card.vote_average) }}</span>
      </v-card-subtitle>
      <div class="button-container">
        <v-btn v-if="isUserLoggedIn && !isFavorite" color="primary" @click="addToFavorites('tv_favorites', { user_id: user.uid, tv_show_id: card.id, title: card.name })">Добавить в избранное</v-btn>
        <v-btn v-if="isUserLoggedIn && isFavorite" color="primary" disabled>В избранном</v-btn>
      </div>
    </v-card>
  </div>
</template>

<script>
import { FavoriteMixin } from "@/mixins/FavoriteMixin.js";
import { RatingMixin } from "@/mixins/RatingMixin.js";
import Constants from "@/constants.js";
import monthNameDirective from "@/directives/monthNameDirective.js";

export default {
  name: "TvComponent",
  props: {
    card: {
      type: Object,
      required: true,
    },
  },
  directives: {
    monthName: monthNameDirective,
  },
  mixins: [FavoriteMixin, RatingMixin],
  computed: {
    isUserLoggedIn() {
      return !!this.user;
    },
  },
  methods: {
    goToMovieDetails(id) {
      this.$router.push({ name: 'tv-card', params: { id } });
    },
  },
  mounted() {
    if (this.user) {
      this.checkIfFavorite(Constants.COLLECTION_TV_FAVORITES, Constants.FIELD_TV_SHOW_ID, this.card.id);
    }
  },
};
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

.cursor-style {
  cursor: pointer;
}

.cursor-style:hover {
  text-decoration: underline;
}

.button-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 10px;
  margin-bottom: 10px;
}
</style>