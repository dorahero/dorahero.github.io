<template>
  <div class="min-h-screen bg-slate-50 font-sans text-slate-800">
    <!-- Navbar (Simplified for this page or Import header? Home has a fixed nav, usually pages have their own or shared layout. 
         Small tools seem to be standalone pages based on IdiomAmoeba. 
         I will add a simple back button or header.) 
    -->
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

    <main class="pt-32 pb-20 px-6">
      <div class="max-w-4xl mx-auto">
        <h1 class="text-3xl font-bold mb-8 text-center">LeetCode 刷題進度</h1>
        <!-- Error State -->
        <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl mb-8 flex items-center justify-between">
          <span>{{ error }}</span>
          <button @click="fetchData" class="text-sm font-semibold underline hover:text-red-800">重試</button>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="flex justify-center items-center py-20">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>

        <!-- Content -->
        <div v-else-if="stats" class="space-y-8 fade-in-up">
          <!-- Main Stats Card -->
          <div class="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100 p-8 max-w-2xl mx-auto">
            <div class="flex flex-col md:flex-row items-center justify-center gap-16">
              
              <!-- Circular Progress -->
              <div class="relative w-56 h-56 flex-shrink-0">
                 <svg class="w-full h-full transform -rotate-90">
                    <!-- Background Circle -->
                    <circle
                      cx="112"
                      cy="112"
                      r="100"
                      stroke="currentColor"
                      stroke-width="8"
                      fill="transparent"
                      class="text-slate-100"
                    />
                    <!-- Segments -->
                    <!-- Background Segments -->
                    <circle
                      v-for="segment in chartData.bg"
                      :key="'bg-' + segment.difficulty"
                      cx="112"
                      cy="112"
                      r="100"
                      stroke="currentColor"
                      stroke-width="8"
                      fill="transparent"
                      stroke-linecap="round" 
                      :stroke-dasharray="circumference"
                      :stroke-dashoffset="circumference - segment.length"
                      :class="segment.colorClass"
                      class="transition-all duration-1000 ease-out"
                      :style="{ 
                        transform: `rotate(${segment.rotation}deg)`, 
                        transformOrigin: '112px 112px' 
                      }"
                    />
                    
                    <!-- Foreground Segments (Solved) -->
                    <circle
                      v-for="segment in chartData.fg"
                      :key="'fg-' + segment.difficulty"
                      cx="112"
                      cy="112"
                      r="100"
                      stroke="currentColor"
                      stroke-width="8"
                      fill="transparent"
                      stroke-linecap="round" 
                      :stroke-dasharray="circumference"
                      :stroke-dashoffset="circumference - segment.length"
                      :class="segment.colorClass"
                      class="transition-all duration-1000 ease-out"
                      :style="{ 
                        transform: `rotate(${segment.rotation}deg)`, 
                        transformOrigin: '112px 112px' 
                      }"
                    />
                 </svg>
                 <div class="absolute inset-0 flex flex-col items-center justify-center">
                    <div class="flex items-baseline">
                        <span class="text-5xl font-bold text-slate-800">{{ stats.totalSolved }}</span>
                        <span class="text-xl text-slate-400 font-medium ml-1">/{{ stats.totalQuestions }}</span>
                    </div>
                    
                    <div class="flex items-center gap-1 mt-2 text-green-600 bg-green-50 px-3 py-1 rounded-full">
                        <CheckCircle class="w-4 h-4" />
                        <span class="text-sm font-semibold">Solved</span>
                    </div>
                 </div>
              </div>

              <!-- Breakdown Legend -->
              <div class="grid grid-cols-3 gap-2 w-full md:flex md:flex-col md:gap-4 md:w-48">
                <div v-for="item in stats.breakdown" :key="item.difficulty" 
                     class="group flex flex-col items-center justify-center p-3 rounded-xl transition-all duration-300 hover:shadow-md border border-transparent hover:border-slate-200"
                     :class="difficultyBgHover(item.difficulty)">
                    
                    <span class="text-sm font-medium mb-1" :class="difficultyColorText(item.difficulty)">
                        {{ item.difficulty }}
                    </span>
                    <div class="text-slate-700 font-semibold text-lg">
                        {{ item.solved }}
                        <span class="text-slate-400 text-sm font-normal">/{{ item.total }}</span>
                    </div>
                </div>
              </div>
            </div>
          </div>
          
           <!-- Footer Info -->
             <div class="text-center text-slate-400 text-sm mt-8">
                Data source: LeetCode ({{ username }})
             </div>

        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { CheckCircle } from 'lucide-vue-next';

const username = "dorahero2727";
const loading = ref(true);
const error = ref(null);
const stats = ref(null);

// Radius = 100
const circumference = 2 * Math.PI * 100;

const difficultyColorText = (diff) => {
    switch(diff) {
        case 'Easy': return 'text-[rgb(0,184,163)]'; // LeetCode Teal
        case 'Medium': return 'text-[rgb(255,192,30)]'; // LeetCode Yellow
        case 'Hard': return 'text-[rgb(255,55,95)]'; // LeetCode Red
        default: return 'text-slate-600';
    }
};

const difficultyBgHover = (diff) => {
     switch(diff) {
        case 'Easy': return 'hover:bg-teal-50/50';
        case 'Medium': return 'hover:bg-yellow-50/50';
        case 'Hard': return 'hover:bg-red-50/50';
        default: return 'hover:bg-slate-50';
    }
}

const segmentGap = 2; // Gap between difficulty segments in degrees

const chartData = computed(() => {
    if (!stats.value) return { bg: [], fg: [] };
    
    // Total Questions (Easy + Medium + Hard)
    // Note: stats.totalQuestions from API might include others? 
    // Best to sum the breakdowns to be safe and consistent with the ring.
    // Or just use the API total. 
    // Let's use the sum of the breakdown totals to ensure the ring is exactly 100%.
    const totalQ = stats.value.breakdown.reduce((acc, item) => acc + item.total, 0);
    
    if (totalQ === 0) return { bg: [], fg: [] };

    let currentRotation = 240; 
    const bgSegments = [];
    const fgSegments = [];
    
    const getColorConfig = (diff) => {
        switch(diff) {
            case 'Easy': return { text: 'text-[rgb(0,184,163)]', bg: 'text-[rgba(0,184,163,0.2)]' }; // Teal
            case 'Medium': return { text: 'text-[rgb(255,192,30)]', bg: 'text-[rgba(255,192,30,0.2)]' }; // Yellow
            case 'Hard': return { text: 'text-[rgb(255,55,95)]', bg: 'text-[rgba(255,55,95,0.2)]' }; // Red
            default: return { text: 'text-slate-500', bg: 'text-slate-100' };
        }
    };
    
    // We iterate Easy -> Medium -> Hard
    for (const item of stats.value.breakdown) {
        // Calculate shares
        // User requested EQUAL segments (3 segments -> 1/3 each)
        // const totalShare = item.total / totalQ; // Proportional
        const totalShare = 1 / 3; // Equal
        
        // Calculate angles (in degrees)
        // Subtract gap from the visual length if possible, or just add rotation gap.
        // Let's just rotate with gaps. 
        // Actual degree span for this Difficulty Block:
        const blockDegrees = totalShare * 360;
        
        // Visual Background Arc
        // We want a gap. So we shrink the arc slightly? 
        // Or we just advance rotation by blockDegrees but draw (blockDegrees - gap).
        const drawDegrees = Math.max(0, blockDegrees - segmentGap);
        const bgLength = (drawDegrees / 360) * circumference;
        
        // Foreground Arc (Progress)
        // Scale the solved share to the DRAWN block size? 
        // Or is solved strictly proportional to TotalQ? 
        // Solved MUST be inside the Bg Arc.
        // Solved Fraction of THIS block = solved / total.
        // So visual solved degrees = (solved/total) * drawDegrees.
        const solvedRatioInBlock = item.total > 0 ? (item.solved / item.total) : 0;
        const solvedDrawDegrees = solvedRatioInBlock * drawDegrees;
        const fgLength = (solvedDrawDegrees / 360) * circumference;
        
        const colors = getColorConfig(item.difficulty);
        
        // Background Segment
        bgSegments.push({
            difficulty: item.difficulty,
            length: bgLength,
            rotation: currentRotation + (segmentGap / 2),
            colorClass: colors.bg
        });
        
        // Foreground Segment
        if (fgLength > 0) {
            fgSegments.push({
                difficulty: item.difficulty,
                length: fgLength,
                rotation: currentRotation + (segmentGap / 2),
                colorClass: colors.text
            });
        }
        
        currentRotation += blockDegrees;
    }
    
    return { bg: bgSegments, fg: fgSegments };
});

const fetchData = async () => {
    loading.value = true;
    error.value = null;
    
    // Use a public proxy that handles CORS and providing stats in a simple JSON format.
    // Source: https://leetcode-api-faisalshohag.vercel.app/
    const apiUrl = `https://leetcode-api-faisalshohag.vercel.app/${username}`;
    
    try {
        const response = await fetch(apiUrl);
        
        if (!response.ok) {
           throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        
        // The new API might not use 'status: error' but let's keep it just in case.
        // Also check for essential data to ensure validity.
        if (result.status === 'error' || result.errors) {
            throw new Error(result.message || (result.errors ? result.errors[0].message : 'Error fetching data'));
        }
        
        if (typeof result.totalSolved === 'undefined') {
             throw new Error('Invalid data format received from API');
        }
        
        // Map the API response to our stats structure
        stats.value = {
            totalSolved: result.totalSolved,
            totalQuestions: result.totalQuestions,
            breakdown: [
                { difficulty: 'Easy', solved: result.easySolved, total: result.totalEasy },
                { difficulty: 'Medium', solved: result.mediumSolved, total: result.totalMedium },
                { difficulty: 'Hard', solved: result.hardSolved, total: result.totalHard }
            ]
        };

    } catch (err) {
        console.error("LeetCode Fetch Error:", err);
        error.value = "無法載入資料 (API 連線錯誤 或 CORS 限制)。詳細錯誤：" + err.message;
    } finally {
        loading.value = false;
    }
};

onMounted(() => {
    fetchData();
});
</script>

<style scoped>
/* Custom animations if needed */
</style>
