<template>
  <div class="font-sans text-slate-800 selection:bg-primary selection:text-white">
    <!-- 導航列 -->
    <nav
      class="fixed top-0 w-full z-50 transition-all duration-300 bg-white/80 backdrop-blur-md border-b border-slate-200/50"
      :class="{ 'shadow-md': isScrolled }"
    >
      <div class="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
        <a href="#" class="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
          Red.
        </a>

        <!-- 桌面選單 -->
        <div class="hidden md:flex items-center space-x-8 font-medium text-slate-600">
          <a href="#" @click.prevent="scrollToSection('about')" class="hover:text-primary transition-colors">自我介紹</a>
          <a href="#" @click.prevent="scrollToSection('experience')" class="hover:text-primary transition-colors">工作經歷</a>
          <a href="#" @click.prevent="scrollToSection('education')" class="hover:text-primary transition-colors">學習經歷</a>
          <!-- 作品集 Dropdown -->
          <div class="relative group">
            <button class="flex items-center gap-1 hover:text-primary transition-colors py-2">
              小工具
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 transition-transform group-hover:rotate-180"><path d="m6 9 6 6 6-6"/></svg>
            </button>
            <div class="absolute left-0 mt-0 w-56 bg-white rounded-xl shadow-lg border border-slate-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top-left z-50">
               <div class="py-2">
                <template v-for="project in portfolio" :key="project.id">
                  <!-- 一般連結 (無子項目) -->
                  <!-- 一般連結 (無子項目) -->
                  <router-link
                    v-if="(!project.items || project.items.length === 0) && isInternalLink(project.url)"
                    :to="project.url"
                    class="block px-4 py-3 text-sm text-slate-600 hover:text-primary hover:bg-slate-50 transition-colors"
                  >
                    {{ project.title }}
                  </router-link>
                  <a 
                    v-else-if="!project.items || project.items.length === 0"
                    :href="project.url"
                    class="block px-4 py-3 text-sm text-slate-600 hover:text-primary hover:bg-slate-50 transition-colors"
                    target="_blank"
                  >
                    {{ project.title }}
                  </a>
                  <!-- 單一子項目 (直接連結) -->
                  <!-- 單一子項目 (直接連結) -->
                  <router-link
                    v-else-if="project.items.length === 1 && isInternalLink(project.items[0].url)"
                    :to="project.items[0].url"
                    class="block px-4 py-3 text-sm text-slate-600 hover:text-primary hover:bg-slate-50 transition-colors"
                  >
                    {{ project.title }}
                  </router-link>
                  <a 
                    v-else-if="project.items.length === 1"
                    :href="project.items[0].url"
                    class="block px-4 py-3 text-sm text-slate-600 hover:text-primary hover:bg-slate-50 transition-colors"
                    target="_blank"
                  >
                    {{ project.title }}
                  </a>
                  <!-- 巢狀選單 (多個子項目) -->
                  <div v-else class="group/nested relative">
                    <button 
                      class="w-full text-left flex items-center justify-between px-4 py-3 text-sm text-slate-600 hover:text-primary hover:bg-slate-50 transition-colors"
                    >
                      {{ project.title }}
                      <span class="text-xs">▶</span>
                    </button>
                    <!-- 子選單 -->
                    <div class="absolute left-full top-0 w-32 bg-white rounded-xl shadow-lg border border-slate-100 opacity-0 invisible group-hover/nested:opacity-100 group-hover/nested:visible transition-all duration-300 ml-2 overflow-hidden">
                     <template v-for="item in project.items" :key="item.title">
                        <router-link
                          v-if="isInternalLink(item.url)"
                          :to="item.url"
                          class="block px-4 py-3 text-sm text-slate-600 hover:text-primary hover:bg-slate-50 transition-colors"
                        >
                          {{ item.title }}
                        </router-link>
                        <a 
                          v-else
                          :href="item.url"
                          class="block px-4 py-3 text-sm text-slate-600 hover:text-primary hover:bg-slate-50 transition-colors"
                          target="_blank"
                        >
                          {{ item.title }}
                        </a>
                     </template>
                    </div>
                  </div>
                </template>
               </div>
            </div>
          </div>
        </div>

        <!-- 手機選單按鈕 -->
        <button
          @click="toggleMenu"
          class="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
        >
          <Menu class="w-6 h-6" />
        </button>
      </div>

      <!-- 手機版選單 -->
      <div
        v-if="isMobileMenuOpen"
        class="md:hidden bg-white border-t border-slate-100 px-6 py-4 shadow-lg absolute w-full"
      >
        <div class="flex flex-col space-y-4">
          <a href="#" class="block text-slate-600 hover:text-primary" @click.prevent="scrollToSection('about'); toggleMenu()">自我介紹</a>
          <a href="#" class="block text-slate-600 hover:text-primary" @click.prevent="scrollToSection('education'); toggleMenu()">學習經歷</a>
          <a href="#" class="block text-slate-600 hover:text-primary" @click.prevent="scrollToSection('experience'); toggleMenu()">工作經歷</a>
           <router-link to="/air-quality-map" class="block text-slate-600 hover:text-primary" @click="toggleMenu">空氣品質地圖</router-link>
          
          <div class="pt-2 border-t border-slate-100">
            <span class="block text-sm font-semibold text-slate-400 mb-2 px-2">小工具</span>
            <div class="pl-4 space-y-3">
              <template v-for="project in portfolio" :key="project.id">
                <router-link
                  v-if="(!project.items || project.items.length === 0) && isInternalLink(project.url)"
                  :to="project.url"
                  class="block text-slate-600 hover:text-primary"
                  @click="toggleMenu"
                >
                  {{ project.title }}
                </router-link>
                <a 
                  v-else-if="!project.items || project.items.length === 0"
                  :href="project.url"
                  class="block text-slate-600 hover:text-primary"
                  @click="toggleMenu"
                  target="_blank"
                >
                  {{ project.title }}
                </a>
                <router-link
                  v-else-if="project.items.length === 1 && isInternalLink(project.items[0].url)"
                  :to="project.items[0].url"
                  class="block text-slate-600 hover:text-primary"
                  @click="toggleMenu"
                >
                  {{ project.title }}
                </router-link>
                <a 
                  v-else-if="project.items.length === 1"
                  :href="project.items[0].url"
                  class="block text-slate-600 hover:text-primary"
                  @click="toggleMenu"
                  target="_blank"
                >
                  {{ project.title }}
                </a>
                <div v-else class="space-y-2">
                  <span class="block text-slate-600 font-medium">{{ project.title }}</span>
                  <div class="pl-4 space-y-2 border-l border-slate-200 ml-1">
                    <template v-for="item in project.items" :key="item.title">
                      <router-link
                        v-if="isInternalLink(item.url)"
                        :to="item.url"
                        class="block text-slate-500 hover:text-primary text-sm"
                        @click="toggleMenu"
                      >
                        {{ item.title }}
                      </router-link>
                      <a 
                        v-else
                        :href="item.url"
                        class="block text-slate-500 hover:text-primary text-sm"
                        @click="toggleMenu"
                        target="_blank"
                      >
                        {{ item.title }}
                      </a>
                    </template>
                  </div>
                </div>
              </template>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <!-- Hero 區塊 -->
    <section class="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-6 overflow-hidden">
      <!-- 背景裝飾圓形 -->
      <div class="absolute top-20 right-[-10%] w-96 h-96 bg-primary/10 rounded-full blur-3xl -z-10"></div>
      <div class="absolute bottom-10 left-[-10%] w-72 h-72 bg-secondary/10 rounded-full blur-3xl -z-10"></div>

      <div class="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        <div class="fade-in-up">
          <div
            class="inline-block px-4 py-2 bg-blue-50 text-primary rounded-full text-sm font-semibold mb-6 border border-blue-100"
          >
            👋 Hi, I'm {{ profile.name }}
          </div>
          <p class="text-lg text-slate-600 mb-8 leading-relaxed max-w-lg">
            {{ profile.description }}
          </p>
        </div>
        <div class="relative fade-in-up delay-200 flex justify-center md:justify-end">
          <!-- 頭像卡片 -->
          <div class="relative w-72 h-72 md:w-96 md:h-96">
            <div class="absolute inset-0 bg-gradient-to-tr from-primary to-secondary rounded-[2rem] rotate-6 opacity-20"></div>
            <img
              :src="profile.avatar"
              alt="Profile"
              class="absolute inset-0 w-full h-full object-cover rounded-[2rem] shadow-2xl border-4 border-white"
            />
            <!-- 浮動的小卡片裝飾 -->
            <div
              class="absolute -bottom-6 -left-6 bg-white p-4 rounded-2xl shadow-xl flex items-center gap-3 animate-bounce"
              style="animation-duration: 3s"
            >
              <div class="p-2 bg-green-100 text-green-600 rounded-full">
                <Code2 class="w-5 h-5" />
              </div>
              <div>
                <p class="text-xs text-slate-500">Experience</p>
                <p class="font-bold text-slate-800">5 Years+</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 自我介紹 & 技能 -->
    <section id="about" class="py-20 bg-white">
      <div class="max-w-6xl mx-auto px-6">
        <div class="grid md:grid-cols-12 gap-12">
          <div class="md:col-span-5 fade-in-up">
            <h2 class="text-3xl font-bold mb-6 flex items-center gap-3">
              <span class="w-8 h-1 bg-primary rounded-full"></span>
              {{ profile.about.title }}
            </h2>
            <p v-for="(para, idx) in profile.about.description" :key="idx" class="text-slate-600 leading-relaxed mb-6">
              {{ para }}
            </p>

            <div class="mt-8 grid grid-cols-2 gap-4">
              <div v-for="stat in profile.about.stats" :key="stat.label" class="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <h3 class="font-bold text-2xl mb-1" :class="stat.color">{{ stat.value }}</h3>
                <p class="text-sm text-slate-500">{{ stat.label }}</p>
              </div>
            </div>
          </div>

          <div class="md:col-span-7 fade-in-up delay-100">
            <h2 class="text-3xl font-bold mb-8">技術技能</h2>
            <div class="space-y-6">
              <!-- 技能條 -->
              <div v-for="(skill, index) in skills" :key="index">
                <div class="flex justify-between mb-2">
                  <span class="font-medium">{{ skill.name }}</span>
                  <span class="text-primary font-bold">{{ skill.level }}%</span>
                </div>
                <div class="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    class="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
                    :style="{ width: skill.level + '%' }"
                  ></div>
                </div>
              </div>

              <!-- 技能標籤 -->
              <div class="pt-6 flex flex-wrap gap-3">
                <span
                  v-for="tag in skillTags"
                  :key="tag"
                  class="px-4 py-2 bg-slate-50 border border-slate-200 rounded-full text-sm font-medium text-slate-600 hover:border-primary hover:text-primary transition-colors cursor-default"
                >
                  {{ tag }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 學習經歷與工作經歷 -->
    <section class="py-20 bg-slate-50" id="experience-education">
      <div class="max-w-6xl mx-auto px-6">
        <div class="grid grid-cols-1 gap-16">
          <!-- 工作經歷 -->
          <div id="experience" class="fade-in-up delay-100">
            <h2 class="text-3xl font-bold mb-10 flex items-center gap-3">
              <div class="p-2 bg-indigo-100 text-secondary rounded-xl">
                <Briefcase class="w-6 h-6" />
              </div>
              工作經歷
            </h2>

            <div class="space-y-8 relative pl-8 border-l-2 border-slate-200">
              <div class="relative" v-for="job in experience" :key="job.title">
                <div
                  class="absolute -left-[41px] top-1 w-5 h-5 rounded-full bg-white border-4"
                  :class="job.current ? 'border-secondary' : 'border-slate-300'"
                ></div>
                <span
                  class="text-sm font-bold px-3 py-1 rounded-full mb-2 inline-block"
                  :class="job.current ? 'text-secondary bg-indigo-50' : 'text-slate-500 bg-slate-100'"
                >
                  {{ job.year }}
                </span>
                <h3 class="text-xl font-bold text-slate-800">{{ job.title }}</h3>
                <p class="text-slate-500 mb-2">{{ job.company }}</p>
                <ul class="list-disc list-inside text-slate-600 text-sm space-y-1">
                  <li v-for="task in job.tasks" :key="task">{{ task }}</li>
                </ul>
              </div>
            </div>
          </div>

          <!-- 學習經歷 -->
          <div id="education" class="fade-in-up">
            <h2 class="text-3xl font-bold mb-10 flex items-center gap-3">
              <div class="p-2 bg-blue-100 text-primary rounded-xl">
                <GraduationCap class="w-6 h-6" />
              </div>
              學習經歷
            </h2>

            <div class="space-y-8 relative pl-8 border-l-2 border-slate-200">
              <div class="relative" v-for="edu in education" :key="edu.degree">
                <div
                  class="absolute -left-[41px] top-1 w-5 h-5 rounded-full bg-white border-4"
                  :class="edu.current ? 'border-primary' : 'border-slate-300'"
                ></div>
                <span
                  class="text-sm font-bold px-3 py-1 rounded-full mb-2 inline-block"
                  :class="edu.current ? 'text-primary bg-blue-50' : 'text-slate-500 bg-slate-100'"
                >
                  {{ edu.year }}
                </span>
                <h3 class="text-xl font-bold text-slate-800">{{ edu.degree }}</h3>
                <p class="text-slate-500 mb-2">{{ edu.school }}</p>
               <ul class="list-disc list-inside text-slate-600 text-sm space-y-1">
                  <li v-for="desc in edu.desc" :key="desc">{{ desc }}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer / 聯絡方式 -->
    <footer id="contact" class="bg-slate-900 text-white py-20 mt-10 rounded-t-[3rem]">
      <div class="max-w-4xl mx-auto px-6 text-center">
        <h2 class="text-3xl font-bold mb-8">準備好開始新專案了嗎？</h2>
        <p class="text-slate-400 mb-10 text-lg">
          我目前開放接案與新的工作機會。如果您有任何想法，歡迎隨時與我聯繫！
        </p>

        <div class="flex flex-col md:flex-row justify-center gap-6 mb-12">
          <a
            :href="`mailto:${socialLinks.email}`"
            class="flex items-center justify-center gap-3 bg-white text-slate-900 px-8 py-4 rounded-2xl font-bold hover:bg-slate-200 transition-colors"
          >
            <Mail class="w-4 h-4" /> 發送郵件
          </a>
          <a
            :href="socialLinks.linkedin"
            class="flex items-center justify-center gap-3 bg-slate-800 text-white px-8 py-4 rounded-2xl font-bold hover:bg-slate-700 transition-colors border border-slate-700"
          >
            <Linkedin class="w-4 h-4 ml-1" /> LinkedIn
          </a>
          <a
            :href="socialLinks.github"
            class="flex items-center justify-center gap-3 bg-slate-800 text-white px-8 py-4 rounded-2xl font-bold hover:bg-slate-700 transition-colors border border-slate-700"
          >
            <Github class="w-4 h-4" /> GitHub
          </a>
        </div>

        <div class="border-t border-slate-800 pt-8 text-slate-500 text-sm">
          <p>&copy; 2024 Wang Xiao-Ming. All rights reserved.</p>
          <p class="mt-2">Designed with Tailwind CSS</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import {
  Menu,
  ArrowRight,
  Mail,
  Code2,
  GraduationCap,
  Briefcase,
  Github,
  Linkedin,
} from 'lucide-vue-next';

// Data Imports
import { 
  profile, 
  skills, 
  skillTags, 
  education, 
  experience, 
  portfolio,
  socialLinks
} from '../data/resume';

// State
const isMobileMenuOpen = ref(false);
const isScrolled = ref(false);

// Methods
const toggleMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
};

const scrollToSection = (id) => {
  const element = document.getElementById(id);
  if (element) {
    const offset = 80; // 考慮導航列高度 (h-20 = 5rem = 80px)
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - offset;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  }
};

const handleScroll = () => {
  if (window.scrollY > 50) {
    isScrolled.value = true;
  } else {
    isScrolled.value = false;
  }
};

const isInternalLink = (url) => {
  return typeof url === 'string' && url.startsWith('/') && !url.split('/').pop().includes('.');
};

// Lifecycle
onMounted(() => {
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>
