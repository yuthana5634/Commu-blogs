// nuxt.config.ts
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  
  // 1. ดึงสไตล์หลักเข้าระบบ
  css: ['~/assets/css/main.css'],

  // 🛠️ 2. ดึงตัวประม듈 Tailwind กลับมาทำงาน (เพิ่มบรรทัดนี้เลยครับ!)
  modules: ['@nuxtjs/tailwindcss'],

  app: {
    head: {
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { 
          rel: 'stylesheet', 
          href: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Noto+Sans+Thai+Looped:wght@300;400;500;700&display=swap' 
        }
      ]
    }
  }
})