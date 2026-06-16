import { ref } from 'vue'
import mockArticles from '../data/mockArticles.json'

export interface Article {
  id: number
  slug: string
  title: string
  description: string
  content: string
  image: string
  date: string
  author: string
  readTime: string
  tags: string[]
  featured: boolean
}

export const useArticles = () => {
  const articles = ref<Article[]>(mockArticles)

  const getArticles = () => articles.value
  
  const getFeaturedArticle = () => articles.value.find(a => a.featured) || articles.value[0]
  
  const getLatestArticles = () => articles.value.filter(a => !a.featured)

  const getArticleBySlug = (slug: string) => {
    return articles.value.find(a => a.slug === slug)
  }

  return {
    getArticles,
    getFeaturedArticle,
    getLatestArticles,
    getArticleBySlug
  }
}