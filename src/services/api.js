import axios from "axios";

const axiosInstance = axios.create({
    baseURL: "https://api.themoviedb.org/3/",

    headers: {'Content-Type': 'application/json'},
})

class Api {
    apiKey;
    filmGenres;
    withoutMult = '16';
    languageApi = 'language=ru-RU';
    sortBy = 'vote_average.desc'
    voteCount = 'vote_count.gte=250'

    constructor() {
        this.apiKey = import.meta.env.VITE_API_KEY ?? '0099006263f714dc2164a25ebd2cbce3';
        const genreArray = [28, 12, 35, 80, 99, 18, 10751, 14, 36, 27, 10402, 9648, 10749, 878, 53, 10752, 37];
        this.filmGenres = genreArray.join('or');
    }

    async getFilms(page, sortOrder) {
        let sortParam = sortOrder ? `&sort_by=vote_average.${sortOrder}` : '';
        let preparedUrl = `discover/movie?api_key=${this.apiKey}&${this.languageApi}&with_genres=${this.filmGenres}&without_genres=${this.withoutMult}&page=${page}&${this.voteCount}${sortParam}`;
        return await axiosInstance.get(preparedUrl)
            .then((response) => {
                return response.data;
            })
            .catch(error => console.error(error));
    }

    async getFilmsWithGenres(page, sortOrder, genres) {
        let sortParam = sortOrder ? `&sort_by=vote_average.${sortOrder}` : '';
        let genreParam = genres ? `&with_genres=${genres}` : '';
        let preparedUrl = `discover/movie?api_key=${this.apiKey}&${this.languageApi}${genreParam}&without_genres=${this.withoutMult}&page=${page}&${this.voteCount}${sortParam}`;
        return await axiosInstance.get(preparedUrl)
            .then((response) => {
                return response.data;
            })
            .catch(error => console.error(error));
    }

    async getTvShows(page, sortOrder, genres) {
        let sortParam = sortOrder ? `&sort_by=vote_average.${sortOrder}` : '';
        let genreParam = genres ? `&with_genres=${genres}` : '';
        let preparedUrl = `discover/tv?api_key=${this.apiKey}&${this.languageApi}${genreParam}&without_genres=${this.withoutMult}&page=${page}&${this.voteCount}${sortParam}`;
        return await axiosInstance.get(preparedUrl)
            .then((response) => {
                return response.data;
            })
            .catch(error => console.error(error));
    }

    async getCartoons(page, sortOrder, genres) {
        let sortParam = sortOrder ? `&sort_by=vote_average.${sortOrder}` : '';
        let genreParam;

        if (genres) {
            genreParam = `&with_genres=${genres},${this.withoutMult}`;
        } else {
            genreParam = `&with_genres=${this.withoutMult}`;
        }

        let preparedUrl = `discover/movie?api_key=${this.apiKey}&${this.languageApi}${genreParam}&page=${page}&${this.voteCount}${sortParam}`;
        return await axiosInstance.get(preparedUrl)
            .then((response) => {
                return response.data;
            })
            .catch(error => console.error(error));
    }


    async getPopular(page) {
        let preparedUrl = `movie/popular?api_key=${this.apiKey}&${this.languageApi}&page=${page}&${this.voteCount}`;
        return await axiosInstance.get(preparedUrl)
            .then((response) => {
                return response.data
            })
            .catch(error => console.error(error));
    }

    async searchByName(query, type, page = 1) {
        let endpoint;
        if (type === 'movie') {
            endpoint = `search/movie`;
        } else if (type === 'tv') {
            endpoint = `search/tv`;
        } else {
            throw new Error("неправильный тип поиска");
        }
        let preparedUrl = `${endpoint}?api_key=${this.apiKey}&${this.languageApi}&query=${encodeURIComponent(query)}&page=${page}&${this.voteCount}`;
        return await axiosInstance.get(preparedUrl)
            .then((response) => {
                return response.data;
            })
            .catch(error => console.error(error));
    }

    async getMovieDetails(movieId) {
        let preparedUrl = `/movie/${movieId}?api_key=${this.apiKey}&${this.languageApi}&include_video=true`;
        return await axiosInstance.get(preparedUrl)
            .then((response) => {
                return response.data;
            })
            .catch(error => console.error(error));
    }

    async getVideos(movieId) {
        let preparedUrl = `/movie/${movieId}/videos?api_key=${this.apiKey}&${this.languageApi}`;
        return await axiosInstance.get(preparedUrl)
            .then((response) => {
                return response.data;
            })
            .catch(error => console.error(error));
    }

    async getTvShowDetails(tvShowId) {
        let preparedUrl = `/tv/${tvShowId}?api_key=${this.apiKey}&${this.languageApi}&include_video=true`;
        return await axiosInstance.get(preparedUrl)
            .then((response) => {
                return response.data;
            })
            .catch(error => console.error(error));
    }

}

export default new Api();