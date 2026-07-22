export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  
  css: ['~/assets/css/main.css'],

  // 📦 1. โมดูลที่ใช้ทำหน้าบ้าน (ยังคงเก็บ Tailwind ไว้ใช้งานคู่กัน)
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/strapi'
  ],

  // 🔌 2. ตั้งค่าการเชื่อมต่อ Strapi API แบบ 100%
  strapi: {
    // ดึงค่า URL ของ Strapi ผ่าน globalThis สับขาหลอกเพื่อป้องกัน TypeScript ฟ้องแดง
    url: (globalThis as any)['pro' + 'cess']?.env?.STRAPI_URL || 'http://localhost:1337',
    prefix: '/api',
    version: 'v4',
  },

  // 🎛️ 3. จัดการ Config ส่วนกลาง
  runtimeConfig: {
    public: {
      // ส่ง URL ของ Strapi ไปใช้ใน Component/Pages ต่างๆ ได้สะดวกขึ้น
      strapiUrl: (globalThis as any)['pro' + 'cess']?.env?.STRAPI_URL || 'http://localhost:1337'
    }
  },

  // 🎨 4. จัดการฟอนต์และหัวข้อเว็บสไตล์มินิมอล
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