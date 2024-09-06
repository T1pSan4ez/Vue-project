<template>
  <div>
    <v-row>
      <v-col cols="12">
        <h2>Комментарии</h2>
        <v-row align="center" justify="space-between" v-if="isUserAuthenticated">
          <v-col cols="12">
            <form @submit.prevent="addComment" style="display: flex; align-items: center;">
              <v-avatar size="80" class="mr-3">
                <img :src="userAvatar || 'favicon.ico'"
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
                  :prepend-avatar="comment.avatarUrl || 'favicon.ico'"
              >
                <v-list-item-title>
                  <span  style="font-size: 20px;">{{ comment.nickname }}</span>: {{ comment.text }}
                </v-list-item-title>
                <v-list-item-subtitle>
                  {{ 'Добавлено: ' + new Date(comment.timestamp.seconds * 1000).toLocaleString() }}
                </v-list-item-subtitle>
                <v-list-item-action>
                  <v-icon
                      small
                      @click="likeComment(comment)"
                      :class="{'text-primary': isUserAuthenticated && !comment.likedBy.includes(user.uid), 'text-muted': !isUserAuthenticated || comment.likedBy.includes(user.uid)}"
                      :disabled="!isUserAuthenticated || comment.likedBy.includes(user.uid)"
                      style="cursor: pointer; margin-right: 8px;"
                  >
                    mdi-thumb-up
                  </v-icon>
                  <span>{{ comment.likes }}</span>
                  <v-icon
                      small
                      @click="dislikeComment(comment)"
                      :class="{'text-primary': isUserAuthenticated && !comment.dislikedBy.includes(user.uid), 'text-muted': !isUserAuthenticated || comment.dislikedBy.includes(user.uid)}"
                      :disabled="!isUserAuthenticated || comment.dislikedBy.includes(user.uid)"
                      style="cursor: pointer; margin-left: 16px; margin-right: 8px;"
                  >
                    mdi-thumb-down
                  </v-icon>
                  <span>{{ comment.dislikes }}</span>
                </v-list-item-action>
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
import {where, orderBy} from 'firebase/firestore';
import FirestoreService from '@/services/FirestoreService.js';
import {useUserStore} from '@/store/UserStore.js';
import Constants from '/src/constants.js';

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
      userAvatar: 'favicon.ico',
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
          likes: 0,
          dislikes: 0,
          likedBy: [],
          dislikedBy: [],
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
    async likeComment(comment) {
      if (this.user && !comment.likedBy.includes(this.user.uid)) {
        await FirestoreService.updateDocument(Constants.COLLECTION_COMMENTS, comment.id, {
          likes: comment.likes + 1,
          likedBy: [...comment.likedBy, this.user.uid],
        });
        if (comment.dislikedBy.includes(this.user.uid)) {
          await FirestoreService.updateDocument(Constants.COLLECTION_COMMENTS, comment.id, {
            dislikes: comment.dislikes - 1,
            dislikedBy: comment.dislikedBy.filter(uid => uid !== this.user.uid),
          });
        }
      }
    },
    async dislikeComment(comment) {
      if (this.user && !comment.dislikedBy.includes(this.user.uid)) {
        await FirestoreService.updateDocument(Constants.COLLECTION_COMMENTS, comment.id, {
          dislikes: comment.dislikes + 1,
          dislikedBy: [...comment.dislikedBy, this.user.uid],
        });
        if (comment.likedBy.includes(this.user.uid)) {
          await FirestoreService.updateDocument(Constants.COLLECTION_COMMENTS, comment.id, {
            likes: comment.likes - 1,
            likedBy: comment.likedBy.filter(uid => uid !== this.user.uid),
          });
        }
      }
    },
    async fetchUserData(userId) {
      if (this.userNicknames[userId] && this.userAvatars[userId]) {
        return {
          nickname: this.userNicknames[userId],
          avatarUrl: this.userAvatars[userId] || 'favicon.ico',
        };
      }

      const userDoc = await FirestoreService.getDocument(Constants.COLLECTION_USERS, userId);
      const nickname = userDoc ? userDoc.nickname : 'Аноним';
      const avatarUrl = userDoc ? userDoc.avatar_url : 'favicon.ico';
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
                  const {nickname, avatarUrl} = await this.fetchUserData(data.user_id);
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
        this.userAvatar =  userDoc.avatar_url;
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
