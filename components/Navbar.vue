<template>
  <nav class="max-w-5xl w-full mx-auto px-6 md:px-12 py-8 flex justify-between items-center border-b border-gray-100">
    <NuxtLink to="/" class="text-xl font-bold tracking-tighter uppercase">CommuCommu</NuxtLink>
    <div class="flex gap-8 text-sm tracking-wide uppercase text-gray-500">
      <NuxtLink to="/" class="hover:text-black transition-colors duration-200" active-class="text-black font-medium">Blog</NuxtLink>
      <NuxtLink to="/about" class="hover:text-black transition-colors duration-200" active-class="text-black font-medium">About</NuxtLink>
    </div>
  </nav>
</template>