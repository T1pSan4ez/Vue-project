// services/ApiService.js
import axios from "axios";

const axiosInstance = axios.create({
    baseURL: "https://api.themoviedb.org/3/",
    headers: { 'Content-Type': 'application/json' },
});

const API_KEY = import.meta.env.VITE_API_KEY ?? '0099006263f714dc2164a25ebd2cbce3';
const LANGUAGE = 'ru-RU';
const VOTE_COUNT = 100;
const WITHOUT_MULT = '16';

class ApiService {
    constructor() {
        this.apiKey = API_KEY;
    }

    async fetchData(endpoint, params = {}) {
        const urlParams = new URLSearchParams({
            api_key: this.apiKey,
            ...params,
        });
        try {
            const response = await axiosInstance.get(`${endpoint}?${urlParams.toString()}`);
            return response.data;
        } catch (error) {
            console.error('Ошибка запроса API:', error);
            throw error;
        }
    }

    getPopularFilmsWithFilters(page = 1, sortOrder = '', genres = '') {
        const params = {
            language: LANGUAGE,
            page,
            sort_by: sortOrder ? `vote_average.${sortOrder}` : 'popularity.desc',
            'vote_count.gte': VOTE_COUNT,
        };

        if (genres) {
            params.with_genres = genres;
        }

        return this.fetchData('discover/movie', params);
    }

    getFilmsWithGenres(page, sortOrder, genres) {
        const params = {
            language: LANGUAGE,
            page,
            without_genres: WITHOUT_MULT,
            sort_by: sortOrder ? `vote_average.${sortOrder}` : undefined,
            'vote_count.gte': VOTE_COUNT,
        };

        if (genres) {
            params.with_genres = genres;
        }

        return this.fetchData('discover/movie', params);
    }

    getTvShows(page, sortOrder, genres) {
        const params = {
            language: LANGUAGE,
            page,
            without_genres: WITHOUT_MULT,
            sort_by: sortOrder ? `vote_average.${sortOrder}` : undefined,
            'vote_count.gte': VOTE_COUNT,
        };

        if (genres) {
            params.with_genres = genres;
        }

        return this.fetchData('discover/tv', params);
    }

    getCartoons(page, sortOrder, genres) {
        const genreParam = genres ? `${genres},${WITHOUT_MULT}` : WITHOUT_MULT;
        const params = {
            language: LANGUAGE,
            page,
            sort_by: sortOrder ? `vote_average.${sortOrder}` : undefined,
            with_genres: genreParam,
            'vote_count.gte': VOTE_COUNT,
        };

        return this.fetchData('discover/movie', params);
    }

    searchByName(query, type, page = 1) {
        const endpoint = type === 'movie' ? 'search/movie' : 'search/tv';
        const params = {
            language: LANGUAGE,
            query: query,
            page,
        };
        return this.fetchData(endpoint, params);
    }

    getMovieDetails(movieId) {
        return this.fetchData(`/movie/${movieId}`, { language: LANGUAGE, include_video: true });
    }

    getTvShowDetails(tvShowId) {
        return this.fetchData(`/tv/${tvShowId}`, { language: LANGUAGE, include_video: true, 'vote_count.gte': VOTE_COUNT });
    }

    getVideos(movieId) {
        return this.fetchData(`/movie/${movieId}/videos`, { language: LANGUAGE });
    }
}

export default new ApiService();
