<template>
  <div class="min-h-screen bg-slate-50 font-sans text-slate-800">
     <!-- 導航列 (Simplified version of Home.vue nav, maybe reusable component later) -->
    <nav
      class="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/50"
    >
      <div class="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
        <router-link to="/" class="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
          Red.
        </router-link>
        
        <div class="flex items-center space-x-8 font-medium text-slate-600">
             <router-link to="/" class="hover:text-primary transition-colors">回首頁</router-link>
        </div>
      </div>
    </nav>

    <div class="pt-32 pb-20 px-6 max-w-6xl mx-auto">
        <h1 class="text-3xl font-bold mb-8 text-center">台灣空氣品質即時監控 (Taiwan Air Quality Map)</h1>
        
        <div class="relative">
             <div v-if="isLoading" class="absolute inset-0 z-20 bg-slate-50/80 flex items-center justify-center rounded-2xl">
                <div class="flex flex-col items-center gap-3">
                    <div class="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    <span class="text-slate-500 font-medium">資料載入中...</span>
                </div>
            </div>
            <div v-if="error" class="absolute inset-0 z-20 bg-slate-50/90 flex items-center justify-center rounded-2xl">
                 <div class="text-red-500 font-medium">{{ error }}</div>
            </div>
            <div id="map" class="w-full h-[600px] rounded-2xl shadow-xl z-0"></div>
        </div>
        
        <div class="mt-8 text-slate-600">
            <h2 class="text-xl font-bold mb-4">關於此地圖</h2>
            <p>資料來源: 行政院環境保護署 (Open Data API)</p>
            <p>更新頻率: 每小時</p>
             <div class="flex gap-4 mt-4 flex-wrap">
                <div class="flex items-center gap-2"><span class="w-4 h-4 rounded-full bg-green-500"></span> 良好 (0-50)</div>
                <div class="flex items-center gap-2"><span class="w-4 h-4 rounded-full bg-yellow-400"></span> 普通 (51-100)</div>
                <div class="flex items-center gap-2"><span class="w-4 h-4 rounded-full bg-orange-400"></span> 對敏感族群不健康 (101-150)</div>
                <div class="flex items-center gap-2"><span class="w-4 h-4 rounded-full bg-red-500"></span> 對所有族群不健康 (151-200)</div>
                <div class="flex items-center gap-2"><span class="w-4 h-4 rounded-full bg-purple-500"></span> 非常不健康 (201-300)</div>
                 <div class="flex items-center gap-2"><span class="w-4 h-4 rounded-full bg-red-900"></span> 危害 (>300)</div>
            </div>
        </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const map = ref(null);
const isLoading = ref(true);
const error = ref(null);

const getMarkerColor = (aqi) => {
  if (aqi <= 50) return '#22c55e'; // Green
  if (aqi <= 100) return '#facc15'; // Yellow
  if (aqi <= 150) return '#fb923c'; // Orange
  if (aqi <= 200) return '#ef4444'; // Red
  if (aqi <= 300) return '#a855f7'; // Purple
  return '#7f1d1d'; // Maroon
};

const fetchAirQualityData = async () => {
  try {
    // Note: This API might require a key. Exploring public access.
    // Ensure limit is high enough to get all stations (approx 85 stations)
    const apiKey = import.meta.env.VITE_TAIWAN_AQI_API_KEY;
    const response = await fetch(`https://data.moenv.gov.tw/api/v2/aqx_p_432?limit=1000&sort=ImportDate%20desc&format=json&api_key=${apiKey}`);
    
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    const records = Array.isArray(data) ? data : data.records;

    if (records) {
        records.forEach(site => {
            if (site.latitude && site.longitude) {
                const aqi = parseInt(site.aqi) || 0;
                const color = getMarkerColor(aqi);
                
                // Create circle (radius in meters) so it scales with zoom
                const circleMarker = L.circle([parseFloat(site.latitude), parseFloat(site.longitude)], {
                    color: 'white',
                    weight: 1,
                    fillColor: color,
                    fillOpacity: 0.8,
                    radius: 5000 // 5km radius, will look larger and scale when zooming
                });

                const popupContent = `
                    <div class="font-sans">
                        <h3 class="font-bold text-lg mb-1">${site.sitename}</h3>
                        <div class="text-sm space-y-1">
                             <p><span class="font-semibold">AQI:</span> <span style="color: ${color}; font-weight: bold;">${site.aqi}</span> (${site.status})</p>
                             <p><span class="font-semibold">PM2.5:</span> ${site['pm2.5']} μg/m³</p>
                             <p><span class="font-semibold">PM10:</span> ${site.pm10} μg/m³</p>
                             <p><span class="font-semibold">O3:</span> ${site.o3} ppb</p>
                             <p class="text-xs text-slate-400 mt-2">Update: ${site.publishtime}</p>
                        </div>
                    </div>
                `;

                circleMarker.bindPopup(popupContent);
                circleMarker.addTo(map.value);
            }
        });
    }

  } catch (err) {
    console.error('Failed to fetch air quality data:', err);
    error.value = '無法取得空氣品質資料，請稍後再試。';
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
    // Fix default icon issue
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
        iconRetinaUrl: new URL('leaflet/dist/images/marker-icon-2x.png', import.meta.url).href,
        iconUrl: new URL('leaflet/dist/images/marker-icon.png', import.meta.url).href,
        shadowUrl: new URL('leaflet/dist/images/marker-shadow.png', import.meta.url).href,
    });

    map.value = L.map('map').setView([23.6978, 120.9605], 8); // Center on Taiwan

    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
    }).addTo(map.value);

    fetchAirQualityData();
});
</script>

<style scoped>
#map {
    z-index: 10; /* Ensure map stays below nav */
}
</style>
