<template>
  <div>
    <div v-if="isVisible" class="modal-overlay">
      <div class="backdrop" @click="close"></div>
      <div class="modal-content" :class="themeClass" @click.stop>
        <header class="modal-header">
          <slot name="header"></slot>
          <button class="close-button" @click="close">&times;</button>
        </header>
        <section class="modal-body">
          <slot name="body"></slot>
        </section>
        <footer class="modal-footer">
          <v-btn @click="toggleMode">{{ isRegistration ? 'Уже есть аккаунт? Войти' : 'Нет аккаунта? Регистрация' }}</v-btn>
        </footer>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ModalForm",
  props: {
    isVisible: {
      type: Boolean,
      required: true,
    },
    isRegistration: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    close() {
      this.$emit('close');
    },
    toggleMode() {
      this.$emit('toggle-mode');
    }
  },
  computed: {
    themeClass() {
      return this.$vuetify.theme.dark ? 'dark-mode' : 'light-mode';
    }
  },
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(5px);
  z-index: 999;
}

.modal-content {
  padding: 20px;
  border-radius: 8px;
  max-width: 500px;
  width: 100%;
  z-index: 1001;
  transition: background-color 0.3s ease;
}

.modal-content.light-mode {
  background-color: white;
  color: black;
}

.modal-content.dark-mode {
  background-color: #333;
  color: white;
}

.modal-header,
.modal-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.close-button {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: inherit;
}

.modal-body {
  margin: 15px 0;
}
</style>