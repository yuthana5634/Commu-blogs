<script setup>
const { find } = useStrapi();

// ดึงค่า strapiUrl ให้ตรงกับใน nuxt.config.ts
const config = useRuntimeConfig();
const strapiUrl = config.public.strapiUrl || 'http://localhost:1337'; 

// เรียกข้อมูลจาก Strapi
const { data: rawPosts, pending, error } = await useAsyncData('articles', () => 
  find('articles', { populate: '*' })
);

// แปลงข้อมูลให้อยู่ในฟอร์แมตมาตรฐาน
const posts = computed(() => {
  const rawList = rawPosts.value?.data || [];
  return rawList.map(item => normalizePost(item, strapiUrl));
});

// 1. กรองบทความเด่น (Featured)
const featuredPost = computed(() => {
  if (!posts.value || posts.value.length === 0) return null;
  return posts.value.find(post => post && post.featured) || posts.value[0];
});

// 2. บทความอื่นๆ ด้านล่าง (ไม่ซ้ำกับตัวเด่น)
const recentPosts = computed(() => {
  if (!posts.value || posts.value.length === 0) return [];
  if (!featuredPost.value) return posts.value;
  return posts.value.filter(post => post && post.id !== featuredPost.value.id);
});

// 3. จัดการปุ่ม Filter คัดกรองหมวดหมู่
const activeTab = ref('All');
const availableTabs = computed(() => {
  const tags = new Set(['All']);
  if (posts.value && Array.isArray(posts.value)) {
    posts.value.forEach(post => {
      if (post && post.tags && Array.isArray(post.tags)) {
        post.tags.forEach(tag => {
          if (tag) tags.add(tag);
        });
      }
    });
  }
  return Array.from(tags);
});

// 4. ดึงลิสต์บทความหลังจากกด Filter แท็ก
const filteredPosts = computed(() => {
  const list = recentPosts.value || [];
  if (activeTab.value === 'All') return list;
  return list.filter(post => post && post.tags && Array.isArray(post.tags) && post.tags.includes(activeTab.value));
});
</script>

<template>
  <div class="max-w-6xl mx-auto px-4 py-8">
    
    <!-- 1. ส่วนแสดงบทความเด่น (Featured Post) ด้านบนสุด -->
    <!-- 🌟 เพิ่มคลาส group เพื่อให้ Mouseover ทำงานสไตล์เดียวกับการ์ดด้านล่าง -->
    <transition name="page-fade" appear>
      <section v-if="featuredPost" class="mb-16 group flex flex-col">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <!-- ฝั่งซ้าย: รูปภาพหน้าปก (มี Animation Hover Zoom เหมือนตัวล่าง) -->
          <NuxtLink :to="`/blog/${featuredPost.slug}`" class="rounded-lg overflow-hidden shadow-sm aspect-[16/10]">
            <img :src="featuredPost.image" :alt="featuredPost.title" class="w-full h-full object-cover group-hover:scale-105 transition duration-500 ease-out" />
          </NuxtLink>
          <!-- ฝั่งขวา: รายละเอียดเนื้อหา -->
          <div class="flex flex-col justify-center">
            <div class="text-gray-400 text-sm mb-2">
              {{ featuredPost.date }} — {{ featuredPost.readTime }}
            </div>
            <!-- หัวข้อที่จะเปลี่ยนสีเมื่อเอาเมาส์มาวางทับทั้งการ์ด -->
            <h1 class="text-3xl md:text-4xl font-bold mb-4 leading-tight text-gray-900 group-hover:text-gray-700 transition duration-300">
              <NuxtLink :to="`/blog/${featuredPost.slug}`">{{ featuredPost.title }}</NuxtLink>
            </h1>
            <p class="text-gray-500 mb-6 line-clamp-3">
              {{ featuredPost.description }}
            </p>
            <NuxtLink :to="`/blog/${featuredPost.slug}`" class="text-sm font-bold border-b border-black pb-1 self-start hover:text-gray-600 transition duration-300">
              READ ARTICLE
            </NuxtLink>
          </div>
        </div>
      </section>
    </transition>

    <!-- 2. ส่วนหัวข้อข่าวสารล่าสุด และ ตัวกรอง Filter Tabs -->
    <transition name="page-fade" appear>
      <div v-if="!pending" class="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-100 pb-4 mb-8">
        <h2 class="text-sm font-bold uppercase tracking-wider text-gray-400 mb-4 md:mb-0">
          RECENT WRITING
        </h2>
        <!-- ปุ่มตัวกรองหมวดหมู่ -->
        <div class="flex flex-wrap gap-2">
          <button 
            v-for="tab in availableTabs" 
            :key="tab"
            @click="activeTab = tab"
            :class="[
              'px-4 py-1.5 text-xs font-semibold rounded transition duration-200',
              activeTab === tab ? 'bg-black text-white' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
            ]"
          >
            {{ tab }}
          </button>
        </div>
      </div>
    </transition>

    <!-- 3. รายการบทความล่าสุดหลังจากกด Filter -->
    <div v-if="pending" class="text-center py-12 text-gray-400">กำลังโหลดข้อมูล...</div>
    <div v-else-if="!filteredPosts || filteredPosts.length === 0" class="text-center py-12 text-gray-400">
      ไม่พบบทความในหมวดหมู่นี้
    </div>
    
    <!-- ใช้ TransitionGroup ในการคุมแอนิเมชันรายการการ์ด -->
    <TransitionGroup 
      v-else 
      tag="div" 
      name="post-list" 
      class="grid grid-cols-1 md:grid-cols-2 gap-8 relative"
      appear
    >
      <div v-for="post in filteredPosts" :key="post.id" class="group flex flex-col duration-500">
        <!-- รูปการ์ดบทความ (Hover Zoom สไตล์เดียวกัน) -->
        <NuxtLink :to="`/blog/${post.slug}`" class="rounded-lg overflow-hidden aspect-[16/10] mb-4">
          <img :src="post.image" :alt="post.title" class="w-full h-full object-cover group-hover:scale-105 transition duration-500 ease-out" />
        </NuxtLink>
        <!-- เนื้อหาการ์ดบทความ -->
        <div>
          <div class="text-gray-400 text-xs mb-2">
            {{ post.date }} — {{ post.readTime }}
          </div>
          <!-- หัวข้อเปลี่ยนสีเมื่อ Hover สไตล์เดียวกัน -->
          <h3 class="text-lg font-bold mb-2 text-gray-900 group-hover:text-gray-700 transition duration-300">
            <NuxtLink :to="`/blog/${post.slug}`">{{ post.title }}</NuxtLink>
          </h3>
          <p class="text-gray-500 text-sm line-clamp-2">
            {{ post.description }}
          </p>
        </div>
      </div>
    </TransitionGroup>

  </div>
</template>

<style scoped>
/* 🌟 1. แอนิเมชันตอนโหลดหน้าเว็บครั้งแรก (เฟดสไลด์ขึ้นพร้อมกันแบบเนียน ๆ) */
.page-fade-enter-active {
  transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}
.page-fade-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

/* 🌟 2. แอนิเมชันจัดการการ์ดรายการตอนกดสลับฟิลเตอร์ */
.post-list-enter-active,
.post-list-leave-active {
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}
.post-list-enter-from {
  opacity: 0;
  transform: translateY(20px);
}
.post-list-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
.post-list-move {
  transition: transform 0.5s ease;
}
.post-list-leave-active {
  position: absolute;
  width: calc(50% - 1rem);
}

@media (max-width: 768px) {
  .post-list-leave-active {
    width: 100%;
  }
}
</style>