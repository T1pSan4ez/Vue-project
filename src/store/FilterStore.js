import { defineStore } from 'pinia';

export const FilterStore = defineStore('filter', {
    state: () => ({
        selectedGenres: [],
        sortOrder: 'Без сортировки',
    }),
    actions: {
        setSelectedGenres(genres) {
            this.selectedGenres = genres;
        },
        setSortOrder(order) {
            this.sortOrder = order;
        },
        resetFilters() {
            this.selectedGenres = [];
            this.sortOrder = 'Без сортировки';
        },
    },
    getters: {
        selectedGenreNames(state) {
            return state.selectedGenres;
        },
    },
});