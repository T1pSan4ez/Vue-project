export const ratingColor = {
    methods: {
        getRatingClass(voteAverage) {
            if (voteAverage >= 7) {
                return 'green-text';
            } else if (voteAverage >= 5 && voteAverage < 7) {
                return 'orange-text';
            } else {
                return 'red-text';
            }
        }
    },
    created() {
        this.getRatingClass();
    }
}