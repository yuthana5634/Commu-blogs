<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useArticles } from '../../composables/useArticles'

const route = useRoute()
const { getArticleBySlug } = useArticles()

const slug = route.params.slug as string
const article = getArticleBySlug(slug)

if (!article) {
  throw new Error('Article Not Found')
}
</script>

<template>
  <Head v-if="article">
    <Title>{{ article.title }} — Toto</Title>
    <Meta name="description" :content="article.description" />
    <Meta property="og:title" :content="article.title" />
    <Meta property="og:description" :content="article.description" />
    <Meta property="og:image" :content="article.image" />
    <Meta property="og:type" content="article" />
    <Meta name="author" :content="article.author" />
  </Head>

  <article class="max-w-2xl mx-auto">
    <NuxtLink to="/" class="inline-flex items-center text-sm text-gray-400 hover:text-black transition-colors mb-12 group">
      <span class="mr-2 transform group-hover:-translate-x-1 transition-transform">←</span> Back to articles
    </NuxtLink>

    <header class="mb-12">
      <div class="flex items-center gap-3 text-xs tracking-widest text-gray-400 uppercase mb-4">
        <span>{{ article.date }}</span>
        <span>•</span>
        <span>{{ article.readTime }}</span>
        <span>•</span>
        <span class="text-black font-medium">By {{ article.author }}</span>
      </div>
      <h1 class="text-3xl md:text-5xl font-bold tracking-tight leading-tight mb-6">
        {{ article.title }}
      </h1>
      <p class="text-xl text-gray-500 font-light leading-relaxed">
        {{ article.description }}
      </p>
    </header>

    <div v-if="article" class="mb-10 overflow-hidden bg-gray-100 aspect-[16/9]">
    <img 
      :src="article.image" 
      :alt="article.title"
      class="w-full h-full object-cover"
    />
  </div>

    <div 
      class="prose prose-neutral max-w-none 
             prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-6 prose-p:font-light
             prose-headings:text-black prose-headings:font-bold prose-headings:tracking-tight prose-headings:mt-10 prose-headings:mb-4
             prose-a:text-black prose-a:underline hover:prose-a:text-gray-600"
      v-html="article.content"
    ></div>

    <div class="mt-16 pt-6 border-t border-gray-100 flex flex-wrap gap-2">
      <span 
        v-for="tag in article.tags" 
        :key="tag"
        class="text-xs tracking-wide uppercase px-3 py-1 bg-gray-50 text-gray-600 font-medium"
      >
        #{{ tag }}
      </span>
    </div>
  </article>
</template>