import { createMemoryHistory, createRouter } from 'vue-router'

import CardsComponent from "@/components/CardsComponent.vue";

const routes = [
    {
        path: '/',
        component: CardsComponent,
    },
    {
        path: '/CardsComponent',
        component: CardsComponent,
    },
]

const router = createRouter({
    history: createMemoryHistory(),
    routes,
})

export default router
