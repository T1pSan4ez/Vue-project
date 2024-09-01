<template>
  <div>
    <v-container max-width="800px">
      <v-card>
        <v-card-title>Личный кабинет</v-card-title>
        <v-card-text>
          <v-alert v-if="successMessage" type="success" dismissible @click:close="successMessage = ''" class="mb-5">{{ successMessage }}</v-alert>
          <v-alert v-if="errorMessage" type="error" dismissible @click:close="errorMessage = ''" class="mb-5">{{ errorMessage }}</v-alert>

          <v-form>
            <v-text-field v-model="nickname" label="Nickname" />
            <v-btn class="mb-5" @click.prevent="updateNickname">Изменить имя</v-btn>
            <v-text-field v-model="email" label="Почта" :disabled="true"></v-text-field>
            <v-text-field v-model="currentPassword" label="Current Password" type="password" :rules="[rules.required]"></v-text-field>
            <v-text-field v-model="newPassword" label="New Password" type="password" :rules="[rules.required]"></v-text-field>
            <v-btn @click.prevent="changePassword">Сменить пароль</v-btn>
          </v-form>
        </v-card-text>
      </v-card>
    </v-container>
  </div>
</template>

<script>
import { AuthService } from '@/services/AuthService.js';
import { auth } from '@/main.js';

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
      rules: {
        required: (value) => !!value || 'Required.',
      },
    };
  },
  async created() {
    const user = auth.currentUser;
    if (user) {
      this.email = user.email;
      const userProfile = await AuthService.getUserProfile(user.uid);
      if (userProfile) this.nickname = userProfile.nickname;
    }
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

</style>
