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
      <v-card-title class="cursor-style" @click="goToMovieDetails(card.id)">{{ card.title }}</v-card-title>
      <v-card-subtitle class="mb-3"><strong>{{ card.original_title }}</strong></v-card-subtitle>
      <v-card-subtitle class="mb-3">
        {{ card.release_date }},
        <span>Рейтинг: </span>
        <span :class="getRatingClass(card.vote_average)">{{ formatRating(card.vote_average) }}</span>
      </v-card-subtitle>
      <div class="button-container">
        <v-btn v-if="isUserLoggedIn && !isFavorite" color="primary" @click="addToFavorites('favorites', { userId: user.uid, movieId: card.id, title: card.title })">Добавить в избранное</v-btn>
        <v-btn v-if="isUserLoggedIn && isFavorite" color="primary" disabled>В избранном</v-btn>
      </div>
    </v-card>
  </div>
</template>

<script>
import { FavoriteMixin } from "@/mixins/FavoriteMixin.js";
import { RatingMixin } from "@/mixins/RatingMixin.js";

export default {
  name: "PopularComponent",
  props: {
    card: {
      type: Object,
      required: true,
    },
  },
  mixins: [FavoriteMixin, RatingMixin],
  computed: {
    isUserLoggedIn() {
      return !!this.user;
    },
  },
  methods: {
    goToMovieDetails(id) {
      this.$router.push({ name: 'solo-card', params: { id } });
    },
  },
  mounted() {
    if (this.user) {
      this.checkIfFavorite('favorites', 'movieId', this.card.id);
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
  color: orangered;
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