import { createWebHistory, createRouter } from 'vue-router';
import { useUserStore } from '@/store/UserStore.js';

import CardsComponent from "@/components/CardsComponent.vue";
import SoloCard from "@/components/SoloCard.vue";
import SoloTv from "@/components/SoloTv.vue";
import FavoriteComponent from "@/components/FavouriteComponent.vue";
import UserComponent from "@/components/auth/UserComponent.vue";
import NotFound from "@/components/NotFound.vue";

const routes = [
    {
        path: '/',
        name: 'home',
        component: CardsComponent,
    },
    {
        path: '/main',
        name: 'main',
        component: CardsComponent,
    },
    {
        path: '/movie/:id',
        name: 'solo-card',
        component: SoloCard,
        props: true
    },
    {
        path: '/tvSerial/:id',
        name: 'tv-card',
        component: SoloTv,
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
