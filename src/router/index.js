import { createRouter, createWebHashHistory } from 'vue-router'
import IdiomAmoeba from '../views/IdiomAmoeba.vue'
import Home from '../views/Home.vue'
import AirQualityMap from '../views/AirQualityMap.vue'
import LeetCodeStats from '../views/LeetCodeStats.vue'
import EarthquakeMap from '../views/EarthquakeMap.vue'

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home,
        meta: { title: '個人履歷 | Red' }
    },
    {
        path: '/air-quality-map',
        name: 'AirQualityMap',
        component: AirQualityMap,
        meta: { title: '空氣品質地圖 | Red' }
    },
    {
        path: '/earthquake-map',
        name: 'EarthquakeMap',
        component: EarthquakeMap,
        meta: { title: '台灣地震偵測 | Red' }
    },
    {
        path: '/idiom-amoeba',
        name: 'IdiomAmoeba',
        component: IdiomAmoeba,
        meta: { title: '成語阿米巴 | Red' }
    },
    {
        path: '/leetcode-stats',
        name: 'LeetCodeStats',
        component: LeetCodeStats,
        meta: { title: 'LeetCode 刷題進度 | Red' }
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

router.afterEach((to) => {
    if (to.meta.title) {
        document.title = to.meta.title
    } else {
        document.title = 'Red'
    }
})

export default router
