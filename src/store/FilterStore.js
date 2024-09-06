import { defineStore } from 'pinia';
import Constants from '/src/constants.js';

export const FilterStore = defineStore('filter', {
    state: () => ({
        selectedGenres: [],
        sortOrder: Constants.SORT_NONE,
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
            this.sortOrder = Constants.SORT_NONE;
        },
    },
});