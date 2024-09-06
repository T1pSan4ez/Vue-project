import { createWebHistory, createRouter } from 'vue-router';
import { useUserStore } from '@/store/UserStore.js';

import CardsComponent from "@/components/movie/CardsComponent.vue";
import FavoriteComponent from "@/components/movieFunctional/FavouriteComponent.vue";
import UserComponent from "@/components/auth/UserComponent.vue";
import NotFound from "@/components/NotFound.vue";

const routes = [
    {
        path: '/',
        name: 'main',
        component: CardsComponent,
    },
    {
        path: '/movie',
        name: 'movie',
        component: CardsComponent,
        props: { currentFilter: 'movies' },
    },
    {
        path: '/tv-shows',
        name: 'tv-shows',
        component: CardsComponent,
        props: { currentFilter: 'tvShows' },
    },
    {
        path: '/cartoons',
        name: 'cartoons',
        component: CardsComponent,
        props: { currentFilter: 'cartoons' },
    },
    {
        path: '/movie/:id',
        name: 'solo-card',
        component: () => import('@/components/movie/SoloCard.vue'),
        props: true
    },
    {
        path: '/tvSerial/:id',
        name: 'tv-card',
        component: () => import('@/components/tvShows/SoloTv.vue'),
        props: true
    },
    {
        path: '/favorite',
        name: 'favorite',
        component: FavoriteComponent,
        meta: { requiresAuth: true }
    },
    {
        path: '/user-office',
        name: 'user',
        component: UserComponent,
        meta: { requiresAuth: true }
    },
    {
        path: '/not-found',
        name: 'NotFound',
        component: NotFound,
    },
    {
        path: '/:catchAll(.*)',
        redirect: { name: 'NotFound' },
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach((to, from, next) => {
    const userStore = useUserStore();
    const isAuthenticated = !!userStore.user;

    if (to.matched.some(record => record.meta.requiresAuth) && !isAuthenticated) {
        console.warn(`Неавторизованный доступ к защищенному маршруту: ${to.fullPath}`);
        next({ name: 'NotFound' });
    } else {
        next();
    }
});

export default router;
