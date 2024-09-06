<template>
  <div>
    <v-container max-width="800px">
      <v-card>
        <v-card-title>Личный кабинет</v-card-title>
        <v-card-text>
          <v-alert v-if="successMessage" type="success" dismissible @click:close="successMessage = ''" class="mb-5">{{ successMessage }}</v-alert>
          <v-alert v-if="errorMessage" type="error" dismissible @click:close="errorMessage = ''" class="mb-5">{{ errorMessage }}</v-alert>

          <v-form>
            <div class="avatar-container">
              <v-avatar size="180">
                <img :src="avatarUrl || 'favicon.ico'"
                alt="User Avatar"
                class="avatar-image"
                />
              </v-avatar>
              <v-file-input
                  label="Загрузить аватар"
                  @change="handleAvatarUpload"
                  accept="image/*"
              ></v-file-input>
              <v-btn @click.prevent="deleteAvatar" color="error" v-if="avatarUrl !== 'favicon.ico'">Удалить аватар</v-btn>
            </div>
            <v-text-field v-model="nickname" label="Nickname" />
            <v-btn class="mb-5" @click.prevent="updateNickname">Изменить имя</v-btn>
            <v-text-field v-model="email" label="Почта" :disabled="true"></v-text-field>
            <v-text-field v-model="currentPassword" label="Текущий пароль" type="password" :rules="[rules.required]"></v-text-field>
            <v-text-field v-model="newPassword" label="Новый пароль" type="password" :rules="[rules.required]"></v-text-field>
            <v-btn @click.prevent="changePassword">Сменить пароль</v-btn>
          </v-form>
        </v-card-text>
      </v-card>
    </v-container>
  </div>
</template>

<script>
import {AuthService} from '@/services/AuthService.js';
import {auth} from '@/main.js';
import { onAuthStateChanged } from 'firebase/auth';

export default {
  name: 'UserComponent',
  data() {
    return {
      nickname: '',
      email: '',
      currentPassword: '',
      newPassword: '',
      successMessage: '',
      errorMessage: '',
      avatarUrl: 'favicon.ico',
      rules: {
        required: (value) => !!value || 'Required.',
      },
    };
  },
  async created() {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        this.email = user.email;
        const userProfile = await AuthService.getUserProfile(user.uid);
        if (userProfile) {
          this.nickname = userProfile.nickname;
          this.avatarUrl = userProfile.avatar_url || 'favicon.ico';
        }
      }
    });
  },
  methods: {
    async updateNickname() {
      try {
        const user = auth.currentUser;
        await AuthService.updateNickname(user.uid, this.nickname);
        this.successMessage = 'Никнейм успешно обновлен!';
        this.errorMessage = '';
      } catch (error) {
        console.error('Ошибка при обновлении никнейма:', error);
        this.errorMessage = 'Ошибка при обновлении никнейма.';
        this.successMessage = '';
      }
    },
    async changePassword() {
      try {
        await AuthService.changePassword(this.currentPassword, this.newPassword);
        this.successMessage = 'Пароль успешно обновлен!';
        this.errorMessage = '';
      } catch (error) {
        console.error('Ошибка при смене пароля:', error);
        this.errorMessage = 'Ошибка при смене пароля. Проверьте введенные данные.';
        this.successMessage = '';
      }
    },
    async handleAvatarUpload(event) {
      const file = event.target.files[0];
      if (!file) {
        return;
      }
      try {
        const user = auth.currentUser;
        this.avatarUrl = await AuthService.uploadAvatar(user.uid, file);
        this.successMessage = 'Аватар успешно обновлен!';
        this.errorMessage = '';
      } catch (error) {
        console.error('Ошибка при загрузке аватара:', error);
        this.errorMessage = 'Ошибка при загрузке аватара.';
        this.successMessage = '';
      }
    },
    async deleteAvatar() {
      try {
        const user = auth.currentUser;
        this.avatarUrl = await AuthService.deleteAvatar(user.uid);
        this.successMessage = 'Аватар успешно удален!';
        this.errorMessage = '';
      } catch (error) {
        console.error('Ошибка при удалении аватара:', error);
        this.errorMessage = 'Ошибка при удалении аватара.';
        this.successMessage = '';
      }
    },
  },
  watch: {
    nickname() {
      this.errorMessage = '';
      this.successMessage = '';
    },
    currentPassword() {
      this.errorMessage = '';
      this.successMessage = '';
    },
    newPassword() {
      this.errorMessage = '';
      this.successMessage = '';
    },
  },
};
</script>

<style scoped>
.avatar-container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  gap: 20px;
  margin-bottom: 20px;
}

.avatar-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
