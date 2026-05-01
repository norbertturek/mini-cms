<template>
  <div class="flex flex-col min-h-screen">
    <TheHeader />
    <main class="flex-grow container mx-auto px-4 py-8">
      <slot />
    </main>
    <footer class="border-t border-slate-200 py-8 bg-white">
      <div class="container mx-auto px-4 text-center">
        <p class="text-sm text-slate-500 font-medium">
          &copy; 2026 Mini-CMS. Built with
          <span class="text-blue-600">Nuxt 4</span> &
          <span class="text-indigo-600">Strapi 5</span>.
        </p>
      </div>
    </footer>
  </div>
</template>
