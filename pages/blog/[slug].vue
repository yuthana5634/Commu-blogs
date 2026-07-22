<script setup>
const route = useRoute();
const { find } = useStrapi();

// 🌟 ดึงค่า strapiUrl ให้ตรงกับใน nuxt.config.ts เป๊ะๆ
const config = useRuntimeConfig();
const strapiUrl = config.public.strapiUrl || 'http://localhost:1337';

// ดึงข้อมูลบทความเดี่ยวโดยใช้ slug
const { data: response, pending, error } = await useAsyncData(`article-${route.params.slug}`, () =>
  find('articles', {
    filters: { slug: { $eq: route.params.slug } },
    populate: '*'
  })
);

// แปลงข้อมูลบทความเดี่ยวผ่าน Normalizer
const post = computed(() => {
  const items = response.value && response.value.data ? response.value.data : null;
  if (Array.isArray(items) && items.length > 0) {
    return normalizePost(items[0], strapiUrl);
  }
  return null;
});

// 🛠️ เพิ่มบรรทัดนี้ชั่วคราวเพื่อ Debug
console.log('--- DETAIL PAGE DEBUG ---');
console.log('Response from Strapi:', response.value);
if (error.value) {
  console.error('Detail Fetch Error:', error.value);
}
</script>

<template>
  <div class="min-h-screen bg-white text-[#1a1a1a] font-sans pb-24">
    <!-- ปุ่มย้อนกลับไปหน้ารวมบทความ -->
    <div class="max-w-[760px] mx-auto px-6 pt-12 pb-6">
      <NuxtLink to="/" class="text-gray-400 hover:text-black text-sm transition duration-200">
        ← Back to articles
      </NuxtLink>
    </div>

    <!-- หน้าหลักเนื้อหาบทความ (จัดกึ่งกลางกว้างกำลังดี อ่านสบายตา) -->
    <article v-if="post" class="max-w-[760px] mx-auto px-6">
      
      <!-- Metadata ด้านบนหัวข้อ -->
      <div class="flex items-center gap-2 text-gray-400 text-xs font-semibold uppercase tracking-wider mb-4">
        <span>{{ post.date }}</span>
        <span>•</span>
        <span>{{ post.readTime }}</span>
        <span>•</span>
        <span class="text-black">BY {{ post.author }}</span>
      </div>

      <!-- หัวข้อบทความ -->
      <h1 class="text-3xl md:text-5xl font-bold text-gray-900 leading-tight mb-6">
        {{ post.title }}
      </h1>

      <!-- สรุปเกริ่นนำ (Lead Paragraph) -->
      <p class="text-lg text-gray-500 leading-relaxed mb-8">
        {{ post.description }}
      </p>

      <!-- รูปภาพหน้าปกขนาดใหญ่ -->
      <div class="rounded-lg overflow-hidden mb-10 shadow-sm aspect-[16/10]">
        <img :src="post.image" :alt="post.title" class="w-full h-full object-cover" />
      </div>

      <!-- ส่วนเนื้อหาหลักบทความ (Rich Text จาก Blocks HTML) -->
      <div class="post-content" v-html="post.content"></div>

      <!-- แสดงแท็ก (Tags) ด้านท้ายโพสต์ -->
      <div v-if="post && post.tags && Array.isArray(post.tags) && post.tags.length" class="mt-12 pt-6 border-t border-gray-100 flex flex-wrap gap-2">
        <span v-for="tag in post.tags" :key="tag" class="text-xs font-semibold text-gray-400">
          #{{ tag.toUpperCase() }}
        </span>
      </div>

    </article>

    <!-- หน้ากำลังโหลดข้อมูล -->
    <div v-else-if="pending" class="text-center py-24 text-gray-400">
      กำลังเปิดหน้าบทความ...
    </div>

    <!-- หน้าเมื่อไม่เจอบทความ -->
    <div v-else class="text-center py-24 text-gray-400">
      <p class="mb-4">ไม่พบบทความที่คุณค้นหา</p>
      <NuxtLink to="/" class="text-black underline">กลับหน้าหลัก</NuxtLink>
    </div>
  </div>
</template>

<style scoped>
/* สไตล์ครอบคลุมเนื้อหาภายใน Rich Text ที่เป็น HTML */
.post-content {
  font-size: 1.05rem;
  line-height: 1.85; /* เพิ่มระยะบรรทัดให้อ่านง่ายขึ้น */
  color: #2c2c2c;
}

/* ตั้งค่าระยะขอบและสไตล์ของ Tags ต่าง ๆ ใน Content */
:deep(p) {
  margin-bottom: 1.8rem;
}

:deep(strong) {
  color: #111111;
  font-weight: 700;
}

:deep(h2), :deep(h3) {
  color: #111111;
  font-weight: 700;
  line-height: 1.3;
  margin-top: 2.8rem;
  margin-bottom: 1.2rem;
}

:deep(h2) {
  font-size: 1.75rem;
}

:deep(h3) {
  font-size: 1.35rem;
}

:deep(ul) {
  list-style-type: disc;
  padding-left: 1.5rem;
  margin-bottom: 1.8rem;
}

:deep(ol) {
  list-style-type: decimal;
  padding-left: 1.5rem;
  margin-bottom: 1.8rem;
}

:deep(li) {
  margin-bottom: 0.6rem;
}

:deep(img) {
  border-radius: 8px;
  margin: 2rem 0;
  width: 100%;
}
</style>