<script setup lang="ts">
defineProps<{ article: any }>()
</script>

<template>
  <article v-if="article" class="group animate-fade-in-up">
    <NuxtLink :to="`/blog/${article.slug}`" class="block">
      <div class="overflow-hidden bg-gray-100 aspect-[16/10] mb-5">
        <img 
          :src="article.image" 
          :alt="article.title"
          class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />
      </div>
      <div class="space-y-2">
        <div class="flex items-center gap-3 text-xs tracking-widest text-gray-400 uppercase">
          <span>{{ article.date }}</span>
          <span>•</span>
          <span>{{ article.readTime }}</span>
        </div>
        <h3 class="text-xl font-bold tracking-tight text-black group-hover:text-gray-600 transition-colors line-clamp-2">
          {{ article.title }}
        </h3>
        <p class="text-gray-500 text-sm font-light leading-relaxed line-clamp-2">
          {{ article.description }}
        </p>
      </div>
    </NuxtLink>
  </article>
</template>