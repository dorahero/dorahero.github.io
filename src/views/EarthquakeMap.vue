<template>
  <div class="min-h-screen bg-slate-50 font-sans text-slate-800">
    <!-- 導航列 -->
    <nav class="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/50">
      <div class="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
        <router-link to="/" class="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
          Red.
        </router-link>
        
        <div class="flex items-center space-x-8 font-medium text-slate-600">
          <router-link to="/" class="hover:text-primary transition-colors">回首頁</router-link>
        </div>
      </div>
    </nav>

    <div class="pt-32 pb-20 px-6 max-w-7xl mx-auto">
      <h1 class="text-3xl font-bold mb-8 text-center text-slate-800">台灣地震即時資訊 (Taiwan Earthquake Map)</h1>
      <p class="text-center text-slate-500 mb-8 max-w-2xl mx-auto">
        資料來源: 交通部中央氣象署 (CWA Open Data API) - 顯示最新 10 筆顯著有感地震報告。
      </p>
      
      <div class="grid lg:grid-cols-3 gap-8">
        <!-- 左側：地圖 -->
        <div class="lg:col-span-2 relative">
          <div v-if="isLoading" class="absolute inset-0 z-20 bg-slate-50/80 flex items-center justify-center rounded-2xl">
            <div class="flex flex-col items-center gap-3">
              <div class="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              <span class="text-slate-500 font-medium">資料載入中...</span>
            </div>
          </div>
          <div v-if="error" class="absolute inset-0 z-20 bg-slate-50/90 flex flex-col items-center justify-center rounded-2xl p-6 text-center">
            <div class="text-red-500 text-lg font-bold mb-2">錯誤發生</div>
            <div class="text-slate-600 mb-4">{{ error }}</div>
            <p class="text-sm text-slate-500">
              請確認 <code>.env</code> 中是否有正確的 <code>VITE_TAIWAN_EARTHQUAKE_API_KEY</code> 並可存取氣象署開放資料平台。
            </p>
          </div>
          <div id="map" class="w-full h-[600px] rounded-3xl shadow-lg border border-slate-200 z-0"></div>
          
          <div class="absolute bottom-4 left-4 z-[400] bg-white/90 backdrop-blur p-3 rounded-xl shadow-md border border-slate-100 text-sm">
             <div class="font-bold text-slate-700 mb-2">地震規模 (芮氏)</div>
             <div class="flex flex-col gap-1.5">
               <div class="flex items-center gap-2"><span class="w-3 h-3 rounded-full bg-red-600"></span> > 6.0 (強震)</div>
               <div class="flex items-center gap-2"><span class="w-3 h-3 rounded-full bg-orange-500"></span> 5.0 - 5.9 (中震)</div>
               <div class="flex items-center gap-2"><span class="w-3 h-3 rounded-full bg-yellow-400"></span> 4.0 - 4.9 (小震)</div>
               <div class="flex items-center gap-2"><span class="w-3 h-3 rounded-full bg-green-500"></span> < 4.0 (微震)</div>
             </div>
          </div>
        </div>

        <!-- 右側：地震列表 -->
        <div class="lg:col-span-1">
          <div class="bg-white rounded-3xl shadow-lg border border-slate-200 p-6 h-[600px] overflow-y-auto custom-scrollbar">
            <h2 class="text-xl font-bold mb-4 flex items-center gap-2 text-slate-800">
              <span class="p-1.5 bg-red-100 text-red-600 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.54 15H17a2 2 0 0 0-2 2v4.54"/><path d="M7 3.34V5a3 3 0 0 0 3 3v0a2 2 0 0 1 2 2v0c0 1.1.9 2 2 2v0a2 2 0 0 0 2-2v0c0-1.1.9-2 2-2h3.17"/><path d="M11 21.95V18a2 2 0 0 0-2-2v0a2 2 0 0 1-2-2v-1a2 2 0 0 0-2-2H2.05"/><circle cx="12" cy="12" r="10"/></svg>
              </span>
              最新地震報告
            </h2>
            
            <div v-if="earthquakes.length === 0 && !isLoading && !error" class="text-center py-10 text-slate-500">
              暫無地震資料
            </div>
            
            <div class="space-y-4">
              <div 
                v-for="(eq, index) in earthquakes" 
                :key="eq.EarthquakeNo"
                :id="'eq-item-' + eq.EarthquakeNo"
                @click="focusEarthquake(eq)"
                class="group p-4 rounded-xl border border-slate-100 bg-slate-50 hover:bg-red-50 hover:border-red-200 transition-all cursor-pointer"
                :class="{'ring-2 ring-red-400 bg-red-50': selectedEqNo === eq.EarthquakeNo}"
              >
                <div class="flex justify-between items-start mb-2">
                  <div class="font-bold text-slate-800 text-lg">
                    編號 {{ eq.EarthquakeNo }}
                  </div>
                  <div class="font-bold text-xl" :style="{ color: getMagnitudeColor(eq.EarthquakeInfo.EarthquakeMagnitude.MagnitudeValue) }">
                    M {{ eq.EarthquakeInfo.EarthquakeMagnitude.MagnitudeValue }}
                  </div>
                </div>
                <div class="text-sm font-medium text-slate-700 mb-1">
                  {{ eq.EarthquakeInfo.Epicenter.Location }}
                </div>
                <div class="text-xs text-slate-500 space-y-1">
                  <p>發生時間: {{ formatTime(eq.EarthquakeInfo.OriginTime) }}</p>
                  <p>深度: {{ eq.EarthquakeInfo.FocalDepth }} 公里</p>
                  <p>震度: 最大 {{ eq.EarthquakeInfo.EarthquakeMagnitude.MagnitudeType.includes('ML') ? '芮氏' : '' }} {{ eq.EarthquakeInfo.EarthquakeMagnitude.MagnitudeValue }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, nextTick } from 'vue';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const map = ref(null);
const isLoading = ref(true);
const error = ref(null);
const earthquakes = ref([]);
const markers = ref({});
const selectedEqNo = ref(null);

const getMagnitudeColor = (magnitude) => {
  if (magnitude >= 6.0) return '#dc2626'; // Red
  if (magnitude >= 5.0) return '#f97316'; // Orange
  if (magnitude >= 4.0) return '#facc15'; // Yellow
  return '#22c55e'; // Green
};

const formatTime = (timeStr) => {
  try {
    const date = new Date(timeStr);
    return date.toLocaleString('zh-TW', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
  } catch (e) {
    return timeStr;
  }
};

const focusEarthquake = (eq, fromMap = false) => {
  selectedEqNo.value = eq.EarthquakeNo;
  
  // 捲動右側列表到對應項目
  nextTick(() => {
    const el = document.getElementById(`eq-item-${eq.EarthquakeNo}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  });

  const lat = parseFloat(eq.EarthquakeInfo.Epicenter.EpicenterLatitude);
  const lon = parseFloat(eq.EarthquakeInfo.Epicenter.EpicenterLongitude);
  
  if (!fromMap && map.value && lat && lon) {
    map.value.flyTo([lat, lon], 10, {
      animate: true,
      duration: 1.5
    });
    
    // Open popup
    if (markers.value[eq.EarthquakeNo]) {
        setTimeout(() => {
            markers.value[eq.EarthquakeNo].openPopup();
        }, 1500);
    }
  }
};

const fetchEarthquakeData = async () => {
  try {
    const apiKey = import.meta.env.VITE_TAIWAN_EARTHQUAKE_API_KEY;
    if (!apiKey) {
      throw new Error('請設定 VITE_TAIWAN_EARTHQUAKE_API_KEY 環境變數');
    }
    
    // E-A0015-001: 顯著有感地震報告
    const response = await fetch(`https://opendata.cwa.gov.tw/api/v1/rest/datastore/E-A0015-001?Authorization=${apiKey}&format=JSON&limit=10`);
    
    if (!response.ok) {
        throw new Error(`CWA API 請求失敗 status: ${response.status}`);
    }

    const data = await response.json();
    
    if (data && data.success === "true" && data.records && data.records.Earthquake) {
      earthquakes.value = data.records.Earthquake;
      
      // Plot on map
      earthquakes.value.forEach((eq, index) => {
        const info = eq.EarthquakeInfo;
        const lat = parseFloat(info.Epicenter.EpicenterLatitude);
        const lon = parseFloat(info.Epicenter.EpicenterLongitude);
        const mag = parseFloat(info.EarthquakeMagnitude.MagnitudeValue);
        
        if (lat && lon) {
            const color = getMagnitudeColor(mag);
            // Size based on magnitude, minimum 8000
            const radius = Math.max(mag * 2500, 8000); 
            
            // Highlight the latest one by making it pulse or slightly different
            const isLatest = index === 0;
            
            const circleOptions = {
                color: isLatest ? '#fff' : 'white',
                weight: isLatest ? 3 : 1,
                fillColor: color,
                fillOpacity: isLatest ? 0.9 : 0.6,
                radius: radius
            };

            const circleMarker = L.circle([lat, lon], circleOptions);

            const popupContent = `
                <div class="font-sans min-w-[200px]">
                    <h3 class="font-bold text-lg mb-2 text-slate-800 border-b pb-1">地震報告編號 ${eq.EarthquakeNo}</h3>
                    <div class="text-sm space-y-2 mt-2">
                          <p><span class="font-semibold text-slate-600">發生時間:</span> <br>${formatTime(info.OriginTime)}</p>
                          <p><span class="font-semibold text-slate-600">震央位置:</span> <br>${info.Epicenter.Location}</p>
                          <p><span class="font-semibold text-slate-600">地震深度:</span> ${info.FocalDepth} km</p>
                          <p><span class="font-semibold text-slate-600">地震規模:</span> <span class="font-bold" style="color: ${color}; font-size: 1.1em">${mag}</span></p>
                          <p class="text-xs text-slate-500 mt-3 p-2 bg-slate-50 rounded italic">${eq.ReportContent}</p>
                    </div>
                </div>
            `;

            circleMarker.bindPopup(popupContent);
            
            // 監聽地圖上的點擊事件，同步更新右側列表
            circleMarker.on('click', () => {
                focusEarthquake(eq, true);
            });

            circleMarker.addTo(map.value);
            
            // Store marker for later access
            markers.value[eq.EarthquakeNo] = circleMarker;
        }
      });
      
      // Fit bounds to all markers if there are any
      if (earthquakes.value.length > 0) {
        const firstEq = earthquakes.value[0];
        const lat = parseFloat(firstEq.EarthquakeInfo.Epicenter.EpicenterLatitude);
        const lon = parseFloat(firstEq.EarthquakeInfo.Epicenter.EpicenterLongitude);
        
        // Default view set to the most recent earthquake or Taiwan center
        if(lat && lon) {
             map.value.setView([lat, lon], 7);
             selectedEqNo.value = firstEq.EarthquakeNo;
             markers.value[firstEq.EarthquakeNo]?.openPopup();
        }
      }

    } else {
        throw new Error('API 返回資料格式不符預期');
    }

  } catch (err) {
    console.error('Failed to fetch earthquake data:', err);
    error.value = err.message || '無法取得地震資料，請稍後再試。';
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
    // Fix default icon issue for Leaflet in Vue/Vite
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
        iconRetinaUrl: new URL('leaflet/dist/images/marker-icon-2x.png', import.meta.url).href,
        iconUrl: new URL('leaflet/dist/images/marker-icon.png', import.meta.url).href,
        shadowUrl: new URL('leaflet/dist/images/marker-shadow.png', import.meta.url).href,
    });

    // Initialize Map centered on Taiwan
    map.value = L.map('map', {
        zoomControl: true,
        scrollWheelZoom: true
    }).setView([23.6978, 120.9605], 7); 

    // Add CartoDB Positron base map (light and clean)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        maxZoom: 19
    }).addTo(map.value);

    fetchEarthquakeData();
});
</script>

<style scoped>
#map {
    z-index: 10;
}

/* Custom Scrollbar for Earthquake List */
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: #f1f5f9; 
  border-radius: 8px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #cbd5e1; 
  border-radius: 8px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #94a3b8; 
}
</style>
