import axios from "axios";
import Constants from '@/constants.js';

const axiosInstance = axios.create({
    baseURL: Constants.API_BASE_URL,
    headers: { 'Content-Type': 'application/json' },
});

class ApiService {
    constructor() {
        this.apiKey = import.meta.env.VITE_API_KEY ?? '0099006263f714dc2164a25ebd2cbce3';
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
            language: Constants.API_LANGUAGE,
            page,
            sort_by: sortOrder ? `vote_average.${sortOrder}` : 'popularity.desc',
            'vote_count.gte': Constants.API_VOTE_COUNT,
        };

        if (genres) {
            params.with_genres = genres;
        }

        return this.fetchData('discover/movie', params);
    }

    getFilmsWithGenres(page, sortOrder, genres) {
        const params = {
            language: Constants.API_LANGUAGE,
            page,
            without_genres: Constants.API_WITHOUT_MULT,
            sort_by: sortOrder ? `vote_average.${sortOrder}` : undefined,
            'vote_count.gte': Constants.API_VOTE_COUNT,
        };

        if (genres) {
            params.with_genres = genres;
        }

        return this.fetchData('discover/movie', params);
    }

    getTvShows(page, sortOrder, genres) {
        const params = {
            language: Constants.API_LANGUAGE,
            page,
            without_genres: Constants.API_WITHOUT_MULT,
            sort_by: sortOrder ? `vote_average.${sortOrder}` : undefined,
            'vote_count.gte': Constants.API_VOTE_COUNT,
        };

        if (genres) {
            params.with_genres = genres;
        }

        return this.fetchData('discover/tv', params);
    }

    getCartoons(page, sortOrder, genres) {
        const genreParam = genres ? `${genres},${Constants.API_WITHOUT_MULT}` : Constants.API_WITHOUT_MULT;
        const params = {
            language: Constants.API_LANGUAGE,
            page,
            sort_by: sortOrder ? `vote_average.${sortOrder}` : undefined,
            with_genres: genreParam,
            'vote_count.gte': Constants.API_VOTE_COUNT,
        };

        return this.fetchData('discover/movie', params);
    }

    searchByName(query, type, page = 1) {
        const endpoint = type === Constants.MOVIE ? 'search/movie' : 'search/tv';
        const params = {
            language: Constants.API_LANGUAGE,
            query: query,
            page,
        };
        return this.fetchData(endpoint, params);
    }

    getMovieDetails(movieId) {
        return this.fetchData(`/movie/${movieId}`, { language: Constants.API_LANGUAGE, include_video: true});
    }

    getTvShowDetails(tvShowId) {
        return this.fetchData(`/tv/${tvShowId}`, { language: Constants.API_LANGUAGE, include_video: true, 'vote_count.gte': Constants.API_VOTE_COUNT });
    }

    getVideos(movieId) {
        return this.fetchData(`/movie/${movieId}/videos`, { language: Constants.API_LANGUAGE });
    }
}

export default new ApiService();
