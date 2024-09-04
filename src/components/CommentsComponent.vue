<template>
  <div>
    <v-row>
      <v-col cols="12">
        <h2>Комментарии</h2>
        <v-row align="center" justify="space-between" v-if="isUserAuthenticated">
          <v-col cols="12">
            <form @submit.prevent="addComment" style="display: flex; align-items: center;">
              <v-avatar size="40" class="mr-3">
                <img :src="userAvatar || 'https://cdn.vuetifyjs.com/images/profiles/1.png'"
                     alt="User Avatar"
                     class="avatar-image"
                />
              </v-avatar>
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
              <v-list-item
                  v-for="comment in comments"
                  :key="comment.id"
                  :prepend-avatar="comment.avatarUrl || 'https://cdn.vuetifyjs.com/images/profiles/1.png'"
              >
                <v-list-item-title>
                  <span style="text-decoration: underline;">{{ comment.nickname }}</span>: {{ comment.text }}
                </v-list-item-title>
                <v-list-item-subtitle>
                  {{ 'Добавлено: ' + new Date(comment.timestamp.seconds * 1000).toLocaleString() }}
                </v-list-item-subtitle>

                <v-list-item-action>
                  <button
                      v-if="isUserAuthenticated && comment.user_id === user.uid"
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
import Constants from '@/Constants.js';

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
      userAvatars: {},
      userAvatar: '',
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
        await FirestoreService.addDocument(Constants.COLLECTION_COMMENTS, {
          text: this.newComment,
          user_id: this.user.uid,
          movie_id: this.movieId,
          timestamp: new Date(),
        });
        this.newComment = '';
      }
    },
    async deleteComment(id) {
      const comment = this.comments.find((c) => c.id === id);
      if (comment.user_id === this.user.uid) {
        await FirestoreService.deleteDocument(Constants.COLLECTION_COMMENTS, id);
      } else {
        alert('Вы не можете удалить этот комментарий.');
      }
    },
    async fetchUserData(userId) {
      if (this.userNicknames[userId] && this.userAvatars[userId]) {
        return {
          nickname: this.userNicknames[userId],
          avatarUrl: this.userAvatars[userId]
        };
      }

      const userDoc = await FirestoreService.getDocument(Constants.COLLECTION_USERS, userId);
      const nickname = userDoc ? userDoc.nickname : 'Аноним';
      const avatarUrl = userDoc ? userDoc.avatar_url : null;

      this.userNicknames[userId] = nickname;
      this.userAvatars[userId] = avatarUrl;

      return {
        nickname,
        avatarUrl
      };
    },
    async loadComments() {
      if (!this.movieId) {
        console.error('movieId is undefined or null');
        return;
      }

      FirestoreService.onCollectionSnapshot(
          Constants.COLLECTION_COMMENTS,
          [where(Constants.FIELD_MOVIE_ID, '==', this.movieId), orderBy('timestamp', 'desc')],
          async (snapshot) => {
            this.comments = await Promise.all(
                snapshot.docs.map(async (doc) => {
                  const data = doc.data();
                  const { nickname, avatarUrl } = await this.fetchUserData(data.user_id);
                  return {
                    id: doc.id,
                    nickname,
                    avatarUrl,
                    ...data,
                  };
                })
            );
          }
      );
    },
    async loadCurrentUserAvatar() {
      if (this.user) {
        const userDoc = await FirestoreService.getDocument(Constants.COLLECTION_USERS, this.user.uid);
        this.userAvatar = userDoc ? userDoc.avatar_url || 'https://cdn.vuetifyjs.com/images/profiles/1.png' : 'https://cdn.vuetifyjs.com/images/profiles/1.png';
      }
    }
  },
  watch: {
    movieId: 'loadComments',
  },
  async mounted() {
    this.user = useUserStore().user;
    await this.loadComments();
    await this.loadCurrentUserAvatar();
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

.avatar-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
