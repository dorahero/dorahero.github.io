import { createRouter, createWebHashHistory } from 'vue-router'
import IdiomAmoeba from '../views/IdiomAmoeba.vue'
import Home from '../views/Home.vue'
import AirQualityMap from '../views/AirQualityMap.vue'

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home
    },
    {
        path: '/air-quality-map',
        name: 'AirQualityMap',
        component: AirQualityMap
    },
    {
        path: '/idiom-amoeba',
        name: 'IdiomAmoeba',
        component: IdiomAmoeba
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes,
    scrollBehavior(to, from, savedPosition) {
        if (to.hash) {
            return {
                el: to.hash,
                behavior: 'smooth',
            }
        }
        return { top: 0 }
    }
})

export default router
