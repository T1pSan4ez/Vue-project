export const RatingMixin = {
    methods: {
        getPosterUrl(posterPath) {
            return `https://image.tmdb.org/t/p/original/${posterPath}`;
        },
        getRatingClass(rating) {
            if (rating === 0) return 'Нет данных';
            if (rating >= 7) return 'green-text';
            if (rating >= 4) return 'orange-text';
            return 'red-text';
        },
        formatRating(rating) {
            return rating === 0 ? 'Нет данных' : rating.toFixed(1);
        },
    },
};
