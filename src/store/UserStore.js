import { defineStore } from 'pinia'


export const useUserStore = defineStore('user', {
    state: () => {
        return { user: null }
    },

    actions: {
        setUser(user) {
           this.user = user;
           localStorage.setItem('user', JSON.stringify(user));
        },
        initUser() {
           const user = localStorage.getItem('user');
           if (user) {
               this.user = JSON.parse(user);
               return true;
           } else {
               this.user = null;
               return false;
           }
        },

    },
})
