import { db } from '@/main.js';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { useUserStore } from '@/store/UserStore.js';
import Constants from '/src/constants.js';

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
                where(Constants.FIELD_USER_ID, '==', this.user.uid),
                where(field, '==', id)
            );

            const snapshot = await getDocs(favoritesQuery);
            this.isFavorite = !snapshot.empty;
        },
        async addToFavorites(collectionName, data) {
            try {
                const favoritesCollection = collection(db, collectionName);

                const dateAdded = new Date();
                await addDoc(favoritesCollection, {
                    ...data,
                    date_added: dateAdded,
                });

                this.isFavorite = true;
            } catch (error) {
                console.error('Ошибка при добавлении в избранное:', error);
            }
        },
    },
    mounted() {
        this.user = this.userStore.user;
    },
};
