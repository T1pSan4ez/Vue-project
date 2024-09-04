<template>
  <div>
    <v-row>
      <v-col cols="12" class="d-flex align-center justify-end">
        <span class="text-h6 me-2">Оценка пользователей:</span>
        <v-rating
            half-increments
            hover
            :length="10"
            :size="32"
            v-model="averageRating"
            color="primary"
            active-color="warning"
            @update:modelValue="rateMovie"
            :readonly="!isUserAuthenticated || hasRated"
            :class="{'cursor-pointer': isUserAuthenticated && !hasRated}"
        />
        <span>({{ totalVotes }} голосов)</span>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { where} from 'firebase/firestore';
import FirestoreService from '@/services/FirestoreService.js';
import { useUserStore } from '@/store/UserStore.js';
import Constants from '@/Constants.js';

export default {
  name: "RatingComponent",
  props: {
    movieId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      userRating: 0,
      totalVotes: 0,
      averageRating: 0,
      hasRated: false,
      user: null,
    };
  },
  computed: {
    isUserAuthenticated() {
      return !!this.user;
    }
  },
  methods: {
    async getUserRating() {
      if (!this.isUserAuthenticated) return;

      const rating = await FirestoreService.getDocument(Constants.COLLECTION_RATINGS, `${this.movieId}_${this.user.uid}`);

      if (rating) {
        this.userRating = rating.rating;
        this.hasRated = true;
      }
    },
    async rateMovie(rating) {
      const userId = this.user.uid;

      await FirestoreService.setDocument(Constants.COLLECTION_RATINGS, `${this.movieId}_${userId}`, {
        user_id: userId,
        movie_id: this.movieId,
        rating: rating
      });

      this.hasRated = true;
      this.getAverageRating();
    },
    getAverageRating() {
      FirestoreService.onCollectionSnapshot(Constants.COLLECTION_RATINGS, [where(Constants.FIELD_MOVIE_ID, '==', this.movieId)], (snapshot) => {
        let total = 0;
        let count = snapshot.size;

        snapshot.forEach((doc) => {
          total += doc.data().rating;
        });

        this.totalVotes = count;
        this.averageRating = count > 0 ? (total / count).toFixed(1) : 0;
      });
    }
  },
  mounted() {
    this.user = useUserStore().user;
    this.getUserRating();
    this.getAverageRating();
  }
};
</script>


<style scoped>
</style>
