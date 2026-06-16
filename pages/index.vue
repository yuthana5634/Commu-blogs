<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useArticles } from '../composables/useArticles'

const { getFeaturedArticle, getLatestArticles } = useArticles()
const featured = getFeaturedArticle()
const allLatestArticles = getLatestArticles()

// 🛠️ 1. ปรับแก้ชื่อหมวดหมู่จาก 'Events' เป็น 'Event' ให้ตรงกับข้อมูลใน tags ของ Mock Data ครับ
const categories = ['All', 'Event', 'Food & Cafes', 'Connection']
const selectedCategory = ref('All')

// 2. ระบบ Infinite Scroll
const itemsPerPage = 6 
const visibleCount = ref(itemsPerPage)
const isLoadingMore = ref(false)

// 🛠️ 3. ปรับปรุง Logic ตัวกรองข้อมูลให้ใช้ .includes() ค้นหาของใน Array tags
const filteredArticles = computed(() => {
  if (selectedCategory.value === 'All') {
    return allLatestArticles
  }
  
  return allLatestArticles.filter(article => {
    // เช็กก่อนว่ามีฟิลด์ tags ไหม และใน Array tags นั้นมีคำที่ตรงกับปุ่มที่เรากดเลือกอยู่หรือเปล่า
    return article.tags && article.tags.includes(selectedCategory.value)
  })
})

// 4. บทความที่จะแสดงผลจริงตามขอบเขตการหั่นหน้า
const visibleArticles = computed(() => {
  return filteredArticles.value.slice(0, visibleCount.value)
})

// รีเซ็ตจำนวนการแสดงผลกลับไปเริ่มต้นทุกครั้งที่คนกดเปลี่ยนหมวดหมู่
watch(selectedCategory, () => {
  visibleCount.value = itemsPerPage
})

const handleScroll = () => {
  if (isLoadingMore.value) return

  const scrollHeight = document.documentElement.scrollHeight
  const scrollTop = document.documentElement.scrollTop
  const clientHeight = document.documentElement.clientHeight

  if (scrollTop + clientHeight >= scrollHeight - 100) {
    if (visibleCount.value < filteredArticles.value.length) {
      isLoadingMore.value = true
      setTimeout(() => {
        visibleCount.value += 4
        isLoadingMore.value = false
      }, 800)
    }
  }
}

onMounted(() => { window.addEventListener('scroll', handleScroll) })
onUnmounted(() => { window.removeEventListener('scroll', handleScroll) })
</script>

<template>
  <Head>
    <Title>TOTO Space — Events & Lifestyle Community</Title>
  </Head>

  <div>
    <BlogFeatured :article="featured" />

    <section class="mt-20">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-10 gap-4">
        <h2 class="text-xs uppercase tracking-widest text-gray-400 font-bold">Recent Writing</h2>
        
        <div class="flex flex-wrap gap-2 text-xs tracking-wider uppercase">
          <button 
            v-for="cat in categories" 
            :key="cat"
            @click="selectedCategory = cat"
            :class="[
              'px-4 py-2 border transition-all duration-300 rounded-none',
              selectedCategory === cat 
                ? 'bg-black text-white border-black font-medium' 
                : 'bg-white text-gray-500 border-gray-100 hover:border-gray-400 hover:text-black'
            ]"
          >
            {{ cat }}
          </button>
        </div>
      </div>
      
      <div class="grid sm:grid-cols-2 gap-x-10 gap-y-16">
        <BlogCard 
          v-for="(article, index) in visibleArticles" 
          :key="article.id" 
          :article="article" 
          :index="index"
        />
      </div>

      <div class="mt-20 h-10 flex items-center justify-center">
        <div v-if="isLoadingMore" class="flex flex-col items-center gap-2">
          <div class="w-5 h-5 border-2 border-gray-200 border-t-black rounded-full animate-spin"></div>
          <span class="text-[10px] tracking-widest text-gray-400 uppercase">Loading posts...</span>
        </div>
        <div v-else-if="visibleCount < filteredArticles.length" class="text-xs text-gray-300 tracking-widest uppercase animate-pulse">
          ↓ Scroll for more entries
        </div>
        <div v-else class="text-xs text-gray-400 tracking-widest uppercase">
          • End of {{ selectedCategory }} •
        </div>
      </div>
    </section>
  </div>
</template>