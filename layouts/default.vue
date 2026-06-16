<template>
  <div class="min-h-screen bg-white text-black font-sans antialiased selection:bg-black selection:text-white flex flex-col">
    
    <div class="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-50">
      <Navbar />
    </div>
    
    <main class="flex-grow max-w-5xl w-full mx-auto px-6 md:px-12 pt-24 pb-28">
      <slot />
    </main>
    
    <div class="fixed bottom-0 left-0 w-full z-40 bg-white/90 backdrop-blur-sm border-t border-gray-50">
      <Footer />
    </div>
    
  </div>
</template>