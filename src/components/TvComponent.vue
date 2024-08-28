<template>
  <div>
    <v-card class="mx-auto" max-width="250" >
      <v-img
          height="400px"
          :src="getPosterUrl(card.poster_path)"
          cover
          class="cursor-style"
          @click="goToMovieDetails(card.id)"
      ></v-img>
      <v-card-title class="cursor-style" @click="goToMovieDetails(card.id)">{{card.name}}</v-card-title>
      <v-card-subtitle class="mb-3"><strong>{{card.original_name}}</strong></v-card-subtitle>
      <v-card-subtitle class="mb-3">
        {{card.first_air_date}},
        <span>Рейтинг: </span><span :class="getRatingClass(card.vote_average)">{{card.vote_average}}</span>
      </v-card-subtitle>
    </v-card>
  </div>
</template>

<script>
import {ratingColor} from "@/mixins/RatingColor.js";

export default {
  name: "TvComponent",
  props: {
    card: {
      type: Object,
      required: true,
    },
  },
  mixins: [ratingColor],
  data() {
    return {

    };
  },
  methods: {
    getPosterUrl(posterPath) {
      return `https://image.tmdb.org/t/p/original/${posterPath}`;
    },
    goToMovieDetails(id) {
      this.$router.push({ name: 'tv-card', params: { id } });
    }
  }
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
</style>