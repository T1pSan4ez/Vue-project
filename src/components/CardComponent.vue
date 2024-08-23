<template>
  <div>
    <v-card class="mx-auto" max-width="250">
      <v-img
          height="400px"
          :src="getPosterUrl(card.poster_path)"
          cover
      ></v-img>
      <v-card-title>{{card.title}}</v-card-title>
      <v-card-subtitle  class="mb-3"><strong>{{card.original_title}}</strong></v-card-subtitle>
      <v-card-subtitle class="mb-3">
        {{card.release_date}},
        <span :class="getRatingClass(card.vote_average)">Рейтинг: {{card.vote_average}}</span>
        </v-card-subtitle>

    </v-card>
  </div>
</template>

<script>
import {ratingColor} from "@/mixins/RatingColor.js";

export default {
  name: "CardComponent",
  props: {
    card: {
      type: Object,
      required: true,
    },
  },
  mixins: [ratingColor],
  data() {
    return {
      show: false,
    };
  },
  methods: {
    getPosterUrl(posterPath) {
      return `https://image.tmdb.org/t/p/original/${posterPath}`;
    }
  }
};
</script>

<style scoped>
.green-text {
  color: green;
}
.orange-text {
  color: orange;
}
.red-text {
  color: red;
}
</style>