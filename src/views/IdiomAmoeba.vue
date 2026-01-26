<template>
  <div class="w-full h-screen bg-slate-50 relative overflow-hidden flex flex-col font-sans">
    <!-- Header -->
    <header class="absolute top-0 left-0 w-full z-10 bg-white/90 backdrop-blur-md shadow-sm px-6 py-4 flex items-center justify-between">
      <div class="flex items-center gap-4">
        <router-link to="/" class="text-slate-500 hover:text-slate-800 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        </router-link>
        <h1 class="text-xl font-bold text-slate-800">成語阿米巴</h1>
      </div>
      <div class="flex items-center gap-4">
          <button @click="showHelpModal = true" class="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors" title="說明與成就">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>
          </button>
          
          <div class="hidden md:flex flex-col items-end">
              <div class="text-sm text-slate-500 font-bold bg-slate-100 px-3 py-1 rounded-full">
                {{ currentTitle }} 
                <span class="text-primary ml-1">Lv.{{ Math.floor(score/100) }}</span>
              </div>
          </div>
          <div class="flex flex-col items-end">
             <div class="font-bold text-2xl text-primary font-mono">{{ score }}</div>
             <div v-if="combo > 1" class="text-xs font-bold text-orange-500 animate-bounce">
                COMBO x{{ combo }}
             </div>
          </div>
      </div>
    </header>

    <!-- Game Canvas -->
    <div 
        ref="canvasRef"
        class="flex-1 w-full h-full cursor-grab active:cursor-grabbing relative"
        @mousedown="startDrag"
        @touchstart="startDrag"
    >
        <div 
            class="absolute top-1/2 left-1/2 transition-transform duration-75 origin-center will-change-transform"
            :style="{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})` }"
        >
            <div class="relative">
                <div 
                    v-for="(cell, key) in grid" 
                    :key="key"
                    class="absolute w-12 h-12 flex items-center justify-center bg-white border border-slate-200 rounded-lg shadow-sm font-bold text-lg cursor-pointer transition-all hover:scale-110 hover:shadow-md hover:border-primary/50 select-none"
                    :class="{ 
                        'bg-primary text-white border-primary ring-2 ring-primary/30': selectedKey === key,
                        'text-slate-700': selectedKey !== key
                    }"
                    :style="{ left: `${cell.x * 52}px`, top: `${cell.y * 52}px` }"
                    @click.stop="selectCell(cell.x, cell.y, cell.char)"
                    @dblclick.stop="handleCellDblClick(cell.x, cell.y)"
                >
                    {{ cell.char }}
                     <!-- Optional: Visualize idiom connections or ownership if needed -->
                </div>
            </div>
        </div>
    </div>

    <!-- Controls -->
    <div class="absolute bottom-8 left-1/2 -translate-x-1/2 w-full max-w-md px-4 z-20">
        <div v-if="selectedKey" class="bg-white rounded-2xl shadow-xl border border-slate-100 p-3 flex flex-col gap-2 animate-in slide-in-from-bottom-4 duration-300">
             <div class="flex items-center gap-2">
                 <div class="flex items-center justify-center w-12 h-12 bg-slate-100 rounded-xl font-bold text-slate-700 shrink-0 text-xl">
                    {{ selectedChar }}
                 </div>
                 
                 <div class="grid grid-cols-3 gap-1">
                     <template v-for="n in 9" :key="n">
                         <!-- n is 1..9, visualIndex = n-1 (0..8) -->
                         <!-- Center is n=5 (visual 4) -->
                         <button 
                            v-if="n === 5" 
                            class="w-8 h-8 flex items-center justify-center rounded-lg text-xs bg-slate-100 text-slate-300 cursor-default"
                         >
                            •
                         </button>
                         <button 
                            v-else
                            @click="selectedDirectionIndex = (n > 5 ? n - 2 : n - 1)"
                            class="w-8 h-8 flex items-center justify-center rounded-lg text-sm font-bold transition-all"
                            :class="selectedDirectionIndex === (n > 5 ? n - 2 : n - 1) ? 'bg-primary text-white shadow-md' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'"
                         >
                            {{ directions[(n > 5 ? n - 2 : n - 1)].label }}
                         </button>
                     </template>
                 </div>
             </div>
             
             <!-- Spacer for better mobile layout, or just keep input below -->
             <div class="flex gap-2 w-full">
                 <input 
                    v-model="inputIdiom"
                    type="text" 
                    class="flex-1 px-4 py-3 bg-slate-50 rounded-xl outline-none text-slate-800 placeholder:text-slate-400 border border-transparent focus:border-primary/20 transition-all"
                    :placeholder="`輸入「${selectedChar}」...`"
                    @keyup.enter="submitIdiom"
                 />
                 <button 
                    @click="submitIdiom"
                    class="bg-primary hover:bg-primary/90 text-white px-6 rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-slate-300"
                    :disabled="!isValidInput"
                 >
                    接龍
                 </button>
             </div>
        </div>
         <div v-else class="text-center">
            <button 
                v-if="gridSize === 0"
                @click="resetGame" 
                class="bg-white text-primary border border-primary/20 hover:bg-primary/5 px-6 py-3 rounded-full font-medium shadow-lg transition-all"
            >
                重新開始
            </button>
            <div v-else class="bg-slate-800/80 backdrop-blur text-white px-6 py-3 rounded-full shadow-lg text-sm inline-flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg>
                點選一個字來開始接龍
            </div>
        </div>
    </div>

    <!-- Help/Achievement Modal -->
    <transition enter-active-class="transition duration-200 ease-out" enter-from-class="opacity-0 scale-95" enter-to-class="opacity-100 scale-100" leave-active-class="transition duration-150 ease-in" leave-from-class="opacity-100 scale-100" leave-to-class="opacity-0 scale-95">
        <div v-if="showHelpModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div class="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" @click="showHelpModal = false"></div>
            <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[80vh] overflow-y-auto relative z-10 p-6">
                <button @click="showHelpModal = false" class="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
                
                <h2 class="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>
                    遊戲說明與成就
                </h2>
                
                <div class="space-y-6">
                    <section>
                        <h3 class="font-bold text-slate-700 mb-2">💡 操作提示</h3>
                        <ul class="list-disc list-inside text-slate-600 space-y-1 text-sm">
                            <li>點選畫面上的任一文字，輸入包含該字的四字成語。</li>
                            <li><span class="font-bold text-primary">滑鼠雙擊 (Double Click)</span> 已放置的成語，可查看詳細釋義與注音。</li>
                            <li>拖曳畫面可移動視角 (Pan)。</li>
                        </ul>
                    </section>

                    <section>
                        <h3 class="font-bold text-slate-700 mb-2">🏆 稱號一覽</h3>
                        <p class="text-xs text-slate-500 mb-3">每累積 100 分可獲得新稱號</p>
                        <div class="space-y-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                           <div v-for="(t, idx) in titles" :key="t.name" class="flex items-center justify-between p-2 rounded-lg" :class="score >= t.threshold ? 'bg-primary/10 text-primary font-bold' : 'bg-slate-50 text-slate-400'">
                               <span class="flex items-center gap-2">
                                   <span class="text-xs w-12">{{ t.threshold }}分</span>
                                   <span>{{ t.name }}</span>
                               </span>
                               <span v-if="score >= t.threshold">✓</span>
                               <span v-else class="text-xs">🔒</span>
                           </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    </transition>

    <!-- Definition Modal -->
    <transition enter-active-class="transition duration-200 ease-out" enter-from-class="opacity-0 scale-95" enter-to-class="opacity-100 scale-100" leave-active-class="transition duration-150 ease-in" leave-from-class="opacity-100 scale-100" leave-to-class="opacity-0 scale-95">
        <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div class="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" @click="closeModal"></div>
            <div class="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto relative z-10 p-6 md:p-8">
                <button @click="closeModal" class="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
                
                <div v-if="modalLoading" class="flex justify-center py-12">
                    <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
                
                <div v-else-if="modalData && modalData.length > 0" class="space-y-8">
                    <div v-for="(item, index) in modalData" :key="index" class="relative">
                        <!-- Divider if not first -->
                         <div v-if="index > 0" class="absolute -top-4 left-0 w-full h-px bg-slate-100"></div>

                        <div class="flex items-baseline gap-4 mb-2 flex-wrap">
                            <h2 class="text-3xl font-bold text-slate-800">{{ item.title }}</h2>
                            <span v-if="item.bopomofo" class="text-lg text-slate-600 font-medium">{{ item.bopomofo }}</span>
                             <span v-if="item.pinyin" class="text-sm text-slate-400 font-mono bg-slate-50 px-2 py-1 rounded">{{ item.pinyin }}</span>
                        </div>

                        <div class="space-y-4">
                            <div class="flex gap-3">
                                <div class="shrink-0 mt-1">
                                     <span class="w-2 h-2 rounded-full bg-secondary block"></span>
                                </div>
                                <div class="space-y-3">
                                    <p class="text-slate-600 leading-relaxed text-lg">{{ item.definition }}</p>
                                    
                                    <div v-if="item.synonyms" class="flex gap-2 text-sm">
                                        <span class="font-bold text-slate-500 shrink-0">似：</span>
                                        <span class="text-slate-600">{{ item.synonyms }}</span>
                                    </div>
                                    
                                    <div v-if="item.antonyms" class="flex gap-2 text-sm">
                                        <span class="font-bold text-slate-500 shrink-0">反：</span>
                                        <span class="text-slate-600">{{ item.antonyms }}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                         <div class="mt-4">
                            <a :href="`https://www.moedict.tw/${item.title}`" target="_blank" class="text-primary hover:underline text-sm font-medium inline-flex items-center gap-1">
                                萌典連結 <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                            </a>
                        </div>
                    </div>
                </div>
                 <div v-else class="text-center py-8">
                     <p class="text-slate-500">查無資料</p>
                </div>
            </div>
        </div>
    </transition>

     <!-- Toast Notification -->
    <div 
        v-if="toast.show" 
        class="fixed top-24 left-1/2 -translate-x-1/2 px-6 py-3 rounded-full shadow-lg z-50 transition-all duration-300 transform"
        :class="toast.type === 'error' ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-green-50 text-green-600 border border-green-100'"
    >
        {{ toast.message }}
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, reactive } from 'vue';
import Papa from 'papaparse';
import idiomsCsv from '../data/idioms.csv?raw';

// --- State ---
const grid = reactive({}); // format: "x,y": { x, y, char, idiomId }
const placedIdioms = ref([]);
const idiomSet = ref(new Set());
const commonIdiomSet = ref(new Set());
const loading = ref(true);

const inputIdiom = ref('');
const selectedKey = ref(null);
const selectedChar = computed(() => grid[selectedKey.value]?.char || '');
const selectedPos = computed(() => grid[selectedKey.value] || null);

const pan = reactive({ x: 0, y: 0 });
const scale = ref(1);
const isDragging = ref(false);
const lastMousePos = reactive({ x: 0, y: 0 });

const showModal = ref(false);
const modalLoading = ref(false);
const modalData = ref([]);

const toast = reactive({ show: false, message: '', type: 'info' });

// Help/Info
const showHelpModal = ref(false);

// Scoring System
const score = ref(0);
const combo = ref(0);

const titles = [
    { threshold: 0, name: "初出茅廬" },
    { threshold: 100, name: "略懂皮毛" },
    { threshold: 200, name: "漸入佳境" },
    { threshold: 300, name: "融會貫通" },
    { threshold: 400, name: "出口成章" },
    { threshold: 500, name: "學富五車" },
    { threshold: 600, name: "博古通今" },
    { threshold: 700, name: "妙筆生花" },
    { threshold: 800, name: "一代宗師" },
    { threshold: 900, name: "登峰造極" },
    { threshold: 1000, name: "成語之神" } // 1000+
];

const currentTitle = computed(() => {
    for (let i = titles.length - 1; i >= 0; i--) {
        if (score.value >= titles[i].threshold) {
            return titles[i].name;
        }
    }
    return titles[0].name;
});

// Directions
const directions = [
    { label: '↖', dx: -1, dy: -1 }, { label: '↑', dx: 0, dy: -1 }, { label: '↗', dx: 1, dy: -1 },
    { label: '←', dx: -1, dy: 0 },                               { label: '→', dx: 1, dy: 0 },
    { label: '↙', dx: -1, dy: 1 }, { label: '↓', dx: 0, dy: 1 }, { label: '↘', dx: 1, dy: 1 }
];
const selectedDirectionIndex = ref(4); // Default to Right (index 4 in array above? No, let's fix logic)
// Let's use specific indices for clarity or finding by values.
// Array indices:
// 0(NW) 1(N) 2(NE)
// 3(W)       4(E)
// 5(SW) 6(S) 7(SE)
// Actually standard reading order: 
// 4 is East (Right), standard default.

const currentDirection = computed(() => directions[selectedDirectionIndex.value]);


// --- Computed ---
const gridSize = computed(() => Object.keys(grid).length);
const isValidInput = computed(() => {
    return inputIdiom.value.length >= 4 && inputIdiom.value.includes(selectedChar.value);
});


// --- Initialization ---
onMounted(() => {
    parseIdioms();
});

const parseIdioms = () => {
    Papa.parse(idiomsCsv, {
        header: true,
        complete: (results) => {
            results.data.forEach(row => {
                const word = row['成語']?.trim();
                if (word) {
                    idiomSet.value.add(word);
                    if (row['常用'] === 'true') {
                        commonIdiomSet.value.add(word);
                    }
                }
            });
            initGame();
            loading.value = false;
        }
    });
};

const initGame = () => {
    // Clear grid
    for (const key in grid) delete grid[key];
    placedIdioms.value = [];
    selectedKey.value = null;
    pan.x = 0;
    pan.y = 0;
    score.value = 0;
    combo.value = 0;
    selectedDirectionIndex.value = 4; // Reset to Right

    // Pick random start idiom from Common Idioms if available
    let pool = Array.from(commonIdiomSet.value);
    if (pool.length === 0) {
        pool = Array.from(idiomSet.value);
    }
    
    const randomIdiom = pool[Math.floor(Math.random() * pool.length)];
    
    // Initial placement is always Horizontal (Right) for simplicity
    placeIdiom(randomIdiom, 0, 0, 1, 0);
};

const resetGame = () => initGame();


// --- Game Logic ---

const placeIdiom = (word, startX, startY, dx, dy) => {
    const newCells = [];

    for (let i = 0; i < word.length; i++) {
        const x = startX + (i * dx);
        const y = startY + (i * dy);
        
        newCells.push({ x, y, char: word[i] });
    }

    newCells.forEach(cell => {
        grid[`${cell.x},${cell.y}`] = cell;
    });
    
    placedIdioms.value.push({ word, cells: newCells });
};

const selectCell = (x, y, char) => {
    const key = `${x},${y}`;
    if (selectedKey.value === key) {
        selectedKey.value = null;
        inputIdiom.value = '';
    } else {
        selectedKey.value = key;
        inputIdiom.value = '';
    }
};

const handleCellDblClick = async (x, y) => {
    // Find all idioms containing this cell
    const idiomsContainingChar = placedIdioms.value.filter(pi => 
        pi.cells.some(c => c.x === x && c.y === y)
    );
    
    if (idiomsContainingChar.length === 0) return;
    
    showModal.value = true;
    modalLoading.value = true;
    modalData.value = [];
    
    // Fetch all definitions concurrently
    const promises = idiomsContainingChar.map(item => fetchDefinitionData(item.word));
    const results = await Promise.all(promises);
    
    // Filter out failed requests
    modalData.value = results.filter(r => r !== null);
    modalLoading.value = false;
};

const submitIdiom = () => {
    if (!isValidInput.value) {
        showToast('輸入格式不正確', 'error');
        handlePenalty("格式錯誤");
        return;
    }
    
    const word = inputIdiom.value.trim();
    
    const isAlreadyPlaced = placedIdioms.value.some(p => p.word === word);
    if (isAlreadyPlaced) {
         showToast('這個成語已經用過了！', 'error');
         handlePenalty("重複成語");
         return;
    }
    
    if (!idiomSet.value.has(word)) {
        showToast('這不是一個成語喔！', 'error');
        handlePenalty("非成語");
        return;
    }
    
    // Find index of selected char in the new word
    const charIndex = word.indexOf(selectedChar.value);
    
    const sx = selectedPos.value.x;
    const sy = selectedPos.value.y;
    
    // Use selected direction
    const dx = currentDirection.value.dx;
    const dy = currentDirection.value.dy;
    
    // Calculate new Start X, Y
    const startX = sx - (charIndex * dx);
    const startY = sy - (charIndex * dy);
    
    // Collision Detection
    if (!checkCanPlace(word, startX, startY, dx, dy)) {
        showToast('位置有衝突，無法放置！', 'error');
        handlePenalty("位置衝突");
        return;
    }
    
    // --- Success ---
    placeIdiom(word, startX, startY, dx, dy);
    
    // Score Calculation
    handleSuccess();
    
    // Reset selection
    selectedKey.value = null;
    inputIdiom.value = '';
};

const handleSuccess = () => {
    combo.value++;
    const points = 10 + (combo.value - 1) * 2;
    score.value += points;
    
    showToast(`接龍成功！ +${points}分 (Combo x${combo.value})`, 'success');
};

const handlePenalty = (reason) => {
    combo.value = 0;
    const penalty = 5;
    score.value = Math.max(0, score.value - penalty);
    if (score.value > 0) {
        // Penalty handled
    }
};

const checkCanPlace = (word, startX, startY, dx, dy) => {
    for (let i = 0; i < word.length; i++) {
        const x = startX + (i * dx);
        const y = startY + (i * dy);
        const key = `${x},${y}`;
        const existingCell = grid[key];
        
        if (existingCell) {
            // Must match
            if (existingCell.char !== word[i]) {
                return false;
            }
        }
    }
    return true;
};


// --- Interaction ---
const startDrag = (e) => {
    if (e.target.closest('.cursor-pointer')) return; // Don't drag if clicking a cell
    
    isDragging.value = true;
    lastMousePos.x = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
    lastMousePos.y = e.type.includes('mouse') ? e.clientY : e.touches[0].clientY;
    
    window.addEventListener('mousemove', onDrag);
    window.addEventListener('mouseup', stopDrag);
    window.addEventListener('touchmove', onDrag);
    window.addEventListener('touchend', stopDrag);
};

const onDrag = (e) => {
    if (!isDragging.value) return;
    
    const clientX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
    const clientY = e.type.includes('mouse') ? e.clientY : e.touches[0].clientY;
    
    const dx = clientX - lastMousePos.x;
    const dy = clientY - lastMousePos.y;
    
    pan.x += dx;
    pan.y += dy;
    
    lastMousePos.x = clientX;
    lastMousePos.y = clientY;
};

const stopDrag = () => {
    isDragging.value = false;
    window.removeEventListener('mousemove', onDrag);
    window.removeEventListener('mouseup', stopDrag);
    window.removeEventListener('touchmove', onDrag);
    window.removeEventListener('touchend', stopDrag);
};


// --- API ---
const fetchDefinitionData = async (word) => {
    try {
        const response = await fetch(`https://www.moedict.tw/uni/${encodeURIComponent(word)}`);
        if (!response.ok) throw new Error('API Error');
        const data = await response.json();
        
        // Parse data based on new requirement
        // JSON Ex: { heteronyms: [{ bopomofo, pinyin, definitions: [{def: "..."}] }], title: "..." }
        
        return {
            title: data.title,
            bopomofo: data.heteronyms?.[0]?.bopomofo,
            pinyin: data.heteronyms?.[0]?.pinyin,
            // Assuming the first definition is the primary one we want to show, per user example structure
            // User example: definitions: [ { def: "..."} ]
            definition: data.heteronyms?.[0]?.definitions?.[0]?.def,
            antonyms: data.heteronyms?.[0]?.definitions?.[0]?.antonyms,
            synonyms: data.heteronyms?.[0]?.definitions?.[0]?.synonyms
        };
        
    } catch (e) {
        console.error(`Failed to fetch ${word}:`, e);
        return null;
    }
};

const closeModal = () => {
    showModal.value = false;
};

const showToast = (msg, type = 'info') => {
    toast.message = msg;
    toast.type = type;
    toast.show = true;
    setTimeout(() => {
        toast.show = false;
    }, 3000);
};

</script>

<style scoped>
/* Grid pattern background */
.bg-slate-50 {
    background-image: radial-gradient(#cbd5e1 1px, transparent 1px);
    background-size: 20px 20px;
}
</style>
