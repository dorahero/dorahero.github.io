<template>
  <div class="min-h-screen bg-slate-50 font-sans text-slate-800">
    <!-- Navbar (Simplified for this page or Import header? Home has a fixed nav, usually pages have their own or shared layout. 
         Small tools seem to be standalone pages based on IdiomAmoeba. 
         I will add a simple back button or header.) 
    -->
    <nav class="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/50">
      <div class="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
         <router-link to="/" class="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary flex items-center gap-2">
            <ArrowLeft class="w-6 h-6 text-slate-600 hover:text-primary transition-colors" />
            Red.
         </router-link>
         <div class="text-lg font-semibold text-slate-600">LeetCode 刷題進度</div>
      </div>
    </nav>

    <main class="pt-32 pb-20 px-6">
      <div class="max-w-4xl mx-auto">
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
          <div class="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100 p-8">
            <div class="flex flex-col md:flex-row items-center gap-12">
              <!-- Circular Progress -->
              <div class="relative w-48 h-48 flex-shrink-0">
                 <svg class="w-full h-full transform -rotate-90">
                    <!-- Background Circle -->
                    <circle
                      cx="96"
                      cy="96"
                      r="88"
                      stroke="currentColor"
                      stroke-width="12"
                      fill="transparent"
                      class="text-slate-100"
                    />
                    <!-- Segments -->
                    <circle
                      v-for="segment in ringSegments"
                      :key="segment.difficulty"
                      cx="96"
                      cy="96"
                      r="88"
                      stroke="currentColor"
                      stroke-width="12"
                      fill="transparent"
                      :stroke-dasharray="circumference"
                      :stroke-dashoffset="circumference - segment.length"
                      :class="segment.colorClass"
                      class="transition-all duration-1000 ease-out"
                      :style="{ transform: `rotate(${segment.rotation}deg)`, transformOrigin: 'center' }"
                    />
                 </svg>
                 <div class="absolute inset-0 flex flex-col items-center justify-center">
                    <span class="text-4xl font-bold text-slate-800">{{ stats.totalSolved }}</span>
                    <span class="text-sm text-slate-500">Solved</span>
                 </div>
              </div>

              <!-- Breakdown -->
              <div class="flex-1 w-full space-y-6">
                <div v-for="item in stats.breakdown" :key="item.difficulty" class="space-y-2">
                  <div class="flex justify-between items-end">
                    <span class="font-medium text-slate-700" :class="difficultyColorText(item.difficulty)">{{ item.difficulty }}</span>
                    <div class="text-sm text-slate-500">
                      <span class="font-bold text-slate-800">{{ item.solved }}</span>
                      <span class="mx-1">/</span>
                      <span>{{ item.total }}</span>
                    </div>
                  </div>
                  <div class="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      class="h-full rounded-full transition-all duration-1000 ease-out"
                      :class="difficultyColorBg(item.difficulty)"
                      :style="{ width: (item.solved / item.total) * 100 + '%' }"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
           <!-- User Info Card (Optional if needed, reusing profile data maybe?) -->
             <!-- Since the API provides easy/medium/hard, that's what we show. -->
             
             <div class="text-center text-slate-400 text-sm mt-12">
                Data source: LeetCode ({{ username }})
             </div>

        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { ArrowLeft } from 'lucide-vue-next';

const username = "dorahero2727";
const loading = ref(true);
const error = ref(null);
const stats = ref(null);

const circumference = 2 * Math.PI * 88;

const difficultyColorText = (diff) => {
    switch(diff) {
        case 'Easy': return 'text-green-600';
        case 'Medium': return 'text-yellow-600';
        case 'Hard': return 'text-red-600';
        default: return 'text-slate-600';
    }
};

const difficultyColorBg = (diff) => {
    switch(diff) {
        case 'Easy': return 'bg-green-500';
        case 'Medium': return 'bg-yellow-500';
        case 'Hard': return 'bg-red-500';
        default: return 'bg-slate-500';
    }
};

const ringSegments = computed(() => {
    if (!stats.value) return [];
    
    // Calculate raw lengths relative to circumference
    // Note: The denominator here is totalQuestions (all available questions on LC), 
    // so the ring represents "coverage of all LeetCode questions".
    // If we want the ring to be full (100%) and just show distribution of solved, 
    // we would use totalSolved as denominator.
    // However, usually these graphs show progress.
    // Based on previous implementation, it was progress.
    
    // WAIT: The standard LeetCode profile ring:
    // Outer grey ring = Total Questions.
    // Inner Colored arc = Solved Questions.
    // The Colored arc consists of 3 colors stacked.
    
    // My Implementation:
    // Background: Grey (Full circle)
    // Segment 1 (Easy): Green arc. Length = (SolvedEasy / TotalQuestions) * C
    // Segment 2 (Medium): Yellow arc. Length = (SolvedMedium / TotalQuestions) * C. 
    //                     But it must start AFTER Segment 1.
    // Segment 3 (Hard): Red arc. Length = (SolvedHard / TotalQuestions) * C.
    //                   Starts AFTER Segment 2.
    
    const totalQ = stats.value.totalQuestions;
    if (totalQ === 0) return [];

    let currentRotation = 0; // Start at top (which is -90 via parent SVG transform, so internal 0 is fine if we add to it? NO.)
    // SVG transform on parent is -90. So 0 degrees is 12 o'clock.
    // If I rotate inner circles, they rotate relative to that?
    // Wait, <svg class="transform -rotate-90"> rotates the VIEWPORT.
    // So 0,0 is still top-left but visual is rotated?
    // Actually <svg> rotation rotates the coordinate system relative to container.
    // Inside, cx/cy are absolute.
    // If I put `transform: rotate(Ndeg)` on a circle with `transform-origin: center`, it rotates around center.
    // Since parent SVG is rotated -90, a circle with rotation 0 starts at 12 o'clock visual.
    // So 'currentRotation' starts at 0.
    
    const segments = [];
    
    const breakdowns = stats.value.breakdown; // Easy, Medium, Hard order
    // Order matters for stacking? Not really if they don't overlap.
    // But we want them sequential.
    
    // Map text color class to stroke text color class?
    // text-green-600 -> text-green-500 for stroke? 
    // Usually stroke uses 'text-current' so we apply a text class like 'text-green-500'.
    
    const getColorClass = (diff) => {
        switch(diff) {
            case 'Easy': return 'text-green-500';
            case 'Medium': return 'text-yellow-500';
            case 'Hard': return 'text-red-500';
            default: return 'text-slate-500';
        }
    };
    
    for (const item of breakdowns) {
        const ratio = item.solved / totalQ;
        const length = circumference * ratio;
        const degrees = ratio * 360;
        
        segments.push({
            difficulty: item.difficulty,
            length: length,
            rotation: currentRotation, // Relative to the container which is already rotated -90
            colorClass: getColorClass(item.difficulty)
        });
        
        currentRotation += degrees;
    }
    
    return segments;
});

const fetchData = async () => {
    loading.value = true;
    error.value = null;
    
    // Use a public proxy that handles CORS and providing stats in a simple JSON format.
    // Source: https://leetcode-stats-api.herokuapp.com/
    const apiUrl = `https://leetcode-stats-api.herokuapp.com/${username}`;
    
    try {
        const response = await fetch(apiUrl);
        
        if (!response.ok) {
           throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        
        if (result.status === 'error') {
            throw new Error(result.message || 'Error fetching data');
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
