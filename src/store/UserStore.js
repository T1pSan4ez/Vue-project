import { defineStore } from 'pinia'
import Constants from '@/Constants.js';
export const useUserStore = defineStore(Constants.LOCAL_STORAGE_USER, {
    state: () => {
        return { user: null }
    },

    actions: {
        setUser(user) {
           this.user = user;
           localStorage.setItem(Constants.LOCAL_STORAGE_USER, JSON.stringify(user));
        },
        initUser() {
           const user = localStorage.getItem(Constants.LOCAL_STORAGE_USER);
           if (user) {
               this.user = JSON.parse(user);
               return true;
           } else {
               this.user = null;
               return false;
           }
        },
        clearUser() {
            this.user = null;
            localStorage.removeItem(Constants.LOCAL_STORAGE_USER);
        },
    },
})
