// mixins/FavoriteMixin.js
import { db } from '@/main.js';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { useUserStore } from '@/store/UserStore.js';

export const FavoriteMixin = {
    data() {
        return {
            isFavorite: false,
            user: null,
        };
    },
    computed: {
        userStore() {
            return useUserStore();
        },
    },
    methods: {
        async checkIfFavorite(collectionName, field, id) {
            if (!this.user) return;

            const favoritesQuery = query(
                collection(db, collectionName),
                where('userId', '==', this.user.uid),
                where(field, '==', id)
            );

            const snapshot = await getDocs(favoritesQuery);
            this.isFavorite = !snapshot.empty;
        },
        async addToFavorites(collectionName, data) {
            try {
                const favoritesCollection = collection(db, collectionName);
                await addDoc(favoritesCollection, data);
                this.isFavorite = true;
                // alert('Добавлено в избранное!');
            } catch (error) {
                console.error('Ошибка при добавлении в избранное:', error);
            }
        },
    },
    mounted() {
        this.user = this.userStore.user;
    },
};
