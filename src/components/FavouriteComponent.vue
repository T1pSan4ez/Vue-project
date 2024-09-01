<template>
  <div>
    <v-container max-width="1200">
      <v-row>
        <v-col>
          <h2>Коллекция избранных фильмов пользователя: {{ userNickname }}</h2>
        </v-col>
      </v-row>
    </v-container>
    <v-container max-width="1200">
      <v-row>
        <v-col>
          <h2 class="text-h6">Фильмы и полнометражные мультфильмы</h2>
        </v-col>
      </v-row>
      <v-container v-if="!favoriteMovies.length" max-width="1200">
        <v-row>
          <v-col>
            <p class="text-h6">У вас нет избранных фильмов.</p>
          </v-col>
        </v-row>
      </v-container>
      <v-container v-else class="mx-auto" max-width="1400">
        <v-slide-group show-arrows>
          <v-slide-group-item v-for="movie in favoriteMovies" :key="movie.id">
            <v-card class="ma-5" max-width="250" rounded>
              <v-img
                  :src="getPosterUrl(movie.poster_path)"
                  height="400px"
                  width="250px"
                  cover
                  class="cursor-style"
                  @click="goToDetails(movie.id, 'movie')"
              ></v-img>
              <v-card-title class="cursor-style" @click="goToDetails(movie.id, 'movie')">
                {{ movie.title }}
              </v-card-title>
              <v-card-subtitle class="mb-3"><strong>{{ movie.original_title }}</strong></v-card-subtitle>
              <v-card-subtitle class="mb-3">{{ movie.release_date }}</v-card-subtitle>
              <div class="button-container">
                <v-btn color="primary" @click="removeFromFavorites(movie.id, 'movie')">Удалить</v-btn>
              </div>
            </v-card>
          </v-slide-group-item>
        </v-slide-group>
      </v-container>
    </v-container>

    <v-container max-width="1200">
      <v-row>
        <v-col>
          <h2 class="text-h6">Сериалы</h2>
        </v-col>
      </v-row>
      <v-container v-if="!favoriteTvShows.length" max-width="1200">
        <v-row>
          <v-col>
            <p class="text-h6">У вас нет избранных сериалов.</p>
          </v-col>
        </v-row>
      </v-container>
      <v-container v-else class="mx-auto" max-width="1400">
        <v-slide-group show-arrows>
          <v-slide-group-item v-for="tvShow in favoriteTvShows" :key="tvShow.id">
            <v-card class="ma-5" max-width="250" rounded>
              <v-img
                  :src="getPosterUrl(tvShow.poster_path)"
                  height="400px"
                  width="250px"
                  cover
                  class="cursor-style"
                  @click="goToDetails(tvShow.id, 'tv')"
              ></v-img>
              <v-card-title class="cursor-style" @click="goToDetails(tvShow.id, 'tv')">
                {{ tvShow.name }}
              </v-card-title>
              <v-card-subtitle class="mb-3"><strong>{{ tvShow.original_name }}</strong></v-card-subtitle>
              <v-card-subtitle class="mb-3">{{ tvShow.first_air_date }}</v-card-subtitle>
              <div class="button-container">
                <v-btn color="primary" @click="removeFromFavorites(tvShow.id, 'tv')">Удалить</v-btn>
              </div>
            </v-card>
          </v-slide-group-item>
        </v-slide-group>
      </v-container>
    </v-container>
  </div>
</template>

<script>
import { db } from '../main.js';
import { collection, getDocs, query, where, deleteDoc, onSnapshot, doc, getDoc } from 'firebase/firestore';
import { useUserStore } from '@/store/UserStore.js';
import Api from '@/services/api.js';

export default {
  name: "FavouriteComponent",
  data() {
    return {
      favoriteMovies: [],
      favoriteTvShows: [],
      userNickname: '',
      user: null,
    };
  },
  computed: {
    userStore() {
      return useUserStore();
    },
  },
  methods: {
    async loadUserNickname() {
      if (this.user?.uid) {
        const userDocRef = doc(collection(db, 'users'), this.user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          this.userNickname = userDoc.data().nickname;
        } else {
          console.error('Пользователь не найден в Firestore');
        }
      }
    },
    async loadFavorites() {
      if (!this.user) return;

      const favoritesQuery = query(
          collection(db, 'favorites'),
          where('userId', '==', this.user.uid)
      );

      onSnapshot(favoritesQuery, async (snapshot) => {
        this.favoriteMovies = [];

        const movieIds = snapshot.docs.map((doc) => doc.data().movieId);
        await this.fetchFavorites(movieIds, 'movie');
      });

      const tvFavoritesQuery = query(
          collection(db, 'tvFavorites'),
          where('userId', '==', this.user.uid)
      );

      onSnapshot(tvFavoritesQuery, async (snapshot) => {
        this.favoriteTvShows = [];

        const tvShowIds = snapshot.docs.map((doc) => doc.data().tvShowId);
        await this.fetchFavorites(tvShowIds, 'tv');
      });
    },
    async fetchFavorites(ids, type) {
      if (!ids.length) return;

      try {
        const validIds = ids.filter(id => id !== undefined && id !== null);

        if (!validIds.length) {
          console.warn(`No valid ${type === 'movie' ? 'movie' : 'tv show'} IDs found.`);
          return;
        }

        const fetchPromises = validIds.map(id => {
          return type === 'movie' ? Api.getMovieDetails(id) : Api.getTvShowDetails(id);
        });

        const results = await Promise.all(fetchPromises);

        if (type === 'movie') {
          this.favoriteMovies.unshift(...results);
        } else {
          this.favoriteTvShows.unshift(...results);
        }
      } catch (error) {
        console.error(`Ошибка при загрузке избранных ${type === 'movie' ? 'фильмов' : 'сериалов'}:`, error);
      }
    },
    getPosterUrl(posterPath) {
      return `https://image.tmdb.org/t/p/original/${posterPath}`;
    },
    goToDetails(id, type) {
      const routeName = type === 'movie' ? 'solo-card' : 'tv-card';
      this.$router.push({name: routeName, params: {id}});
    },
    async removeFromFavorites(id, type) {
      try {
        const collectionName = type === 'movie' ? 'favorites' : 'tvFavorites';
        const fieldName = type === 'movie' ? 'movieId' : 'tvShowId';

        const docToDeleteQuery = query(
            collection(db, collectionName),
            where('userId', '==', this.user.uid),
            where(fieldName, '==', id)
        );

        const snapshot = await getDocs(docToDeleteQuery);
        for (const doc of snapshot.docs) {
          await deleteDoc(doc.ref);
        }

        if (type === 'movie') {
          this.favoriteMovies = this.favoriteMovies.filter(movie => movie.id !== id);
        } else {
          this.favoriteTvShows = this.favoriteTvShows.filter(tvShow => tvShow.id !== id);
        }
        // alert(`${type === 'movie' ? 'Фильм' : 'Сериал'} успешно удален из избранного.`);
      } catch (error) {
        console.error('Ошибка при удалении из избранного:', error);
      }
    },
  },
  mounted() {
    this.user = this.userStore.user;
    this.loadUserNickname();
    this.loadFavorites();
  },
};
</script>

<style scoped>
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
