<template>
  <div>
    <v-row>
      <v-col cols="12">
        <h2>Комментарии</h2>
        <v-row align="center" justify="space-between" v-if="isUserAuthenticated">
          <v-col cols="12">
            <form @submit.prevent="addComment" style="display: flex; align-items: center;">
              <v-text-field
                  v-model="newComment"
                  label="Введите комментарий"
                  required
                  hide-details
                  style="flex: 1; margin-right: 10px;"
              ></v-text-field>
              <v-btn type="submit" color="primary">Добавить</v-btn>
            </form>
          </v-col>
        </v-row>
        <v-row v-else>
          <v-col cols="12">
            <p>Чтобы оставить комментарий, пожалуйста, авторизуйтесь.</p>
          </v-col>
        </v-row>

        <v-row v-if="comments.length > 0">
          <v-col cols="12">
            <v-list lines="two">
              <v-list-item v-for="comment in comments" :key="comment.id">
                <v-list-item-title>
                  <span style="text-decoration: underline;">{{ comment.nickname }}</span>: {{ comment.text }}
                </v-list-item-title>
                <v-list-item-subtitle>
                  {{ 'Добавлено: ' + new Date(comment.timestamp.seconds * 1000).toLocaleString() }}
                </v-list-item-subtitle>

                <v-list-item-action>
                  <button
                      v-if="isUserAuthenticated && comment.userId === user?.uid"
                      @click="deleteComment(comment.id)"
                      class="btn-delete"
                  >
                    Удалить
                  </button>
                </v-list-item-action>
              </v-list-item>
            </v-list>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { where, orderBy } from 'firebase/firestore';
import FirestoreService from '@/services/FirestoreService.js';
import { useUserStore } from '@/store/UserStore.js';

export default {
  name: 'CommentsComponent',
  props: {
    movieId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      comments: [],
      newComment: '',
      user: null,
      userNicknames: {},
    };
  },
  computed: {
    isUserAuthenticated() {
      return !!this.user;
    },
  },
  methods: {
    async addComment() {
      if (this.newComment.trim()) {
        await FirestoreService.addDocument('comments', {
          text: this.newComment,
          userId: this.user.uid,
          movieId: this.movieId,
          timestamp: new Date(),
        });
        this.newComment = '';
      }
    },
    async deleteComment(id) {
      const comment = this.comments.find((c) => c.id === id);
      if (comment.userId === this.user.uid) {
        await FirestoreService.deleteDocument('comments', id);
      } else {
        alert('Вы не можете удалить этот комментарий.');
      }
    },
    async fetchUserNickname(userId) {
      if (this.userNicknames[userId]) {
        return this.userNicknames[userId];
      }

      const userDoc = await FirestoreService.getDocument('users', userId);
      const nickname = userDoc ? userDoc.nickname : 'Аноним';

      this.userNicknames[userId] = nickname;
      return nickname;
    },
    async loadComments() {
      if (!this.movieId) {
        console.error('movieId is undefined or null');
        return;
      }

      FirestoreService.onCollectionSnapshot(
          'comments',
          [where('movieId', '==', this.movieId), orderBy('timestamp', 'desc')],
          async (snapshot) => {
            this.comments = await Promise.all(
                snapshot.docs.map(async (doc) => {
                  const data = doc.data();
                  const nickname = await this.fetchUserNickname(data.userId);
                  return {
                    id: doc.id,
                    nickname,
                    ...data,
                  };
                })
            );
          }
      );
    },
  },
  watch: {
    movieId: 'loadComments',
  },
  mounted() {
    this.user = useUserStore().user;
    this.loadComments();
  },
};
</script>


<style scoped>
.btn-delete {
  background-color: #49b0d8;
  border-radius: 15px;
  padding: 1px 5px;
  font-size: 12px;
  margin-top: 5px;
}
</style>
