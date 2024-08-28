import { createMemoryHistory, createRouter } from 'vue-router'

import CardsComponent from "@/components/CardsComponent.vue";
import SoloCard from "@/components/SoloCard.vue";
import SoloTv from "@/components/SoloTv.vue";

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
        path: '/tv/:id',
        name: 'tv-card',
        component: SoloTv,
        props: true
    },
]

const router = createRouter({
    history: createMemoryHistory(),
    routes,
})

export default router
