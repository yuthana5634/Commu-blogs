<script setup lang="ts">
defineProps<{ article: any }>()
</script>

<template>
  <section v-if="article" class="mb-24">
    <NuxtLink :to="`/blog/${article.slug}`" class="group block grid md:grid-cols-2 gap-8 md:gap-12 items-center">
      <div class="overflow-hidden bg-gray-100 aspect-[16/10]">
        <img 
          :src="article.image" 
          :alt="article.title"
          class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />
      </div>
      <div class="flex flex-col justify-center">
        <span class="text-xs uppercase tracking-widest text-gray-400 mb-3">{{ article.date }} — {{ article.readTime }}</span>
        <h2 class="text-3xl md:text-4xl font-bold tracking-tight leading-tight mb-4 group-hover:text-gray-600 transition-colors">
          {{ article.title }}
        </h2>
        <p class="text-gray-500 font-light leading-relaxed mb-6">
          {{ article.description }}
        </p>
        <span class="text-sm font-semibold tracking-wider uppercase border-b border-black self-start pb-1">
          Read Article
        </span>
      </div>
    </NuxtLink>
  </section>
</template>