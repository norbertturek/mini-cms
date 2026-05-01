<template>
  <div
    class="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-500/30"
  >
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<style>
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    @apply bg-slate-50 text-slate-900 antialiased;
  }
}

@layer components {
  .glass {
    @apply bg-white/70 backdrop-blur-md border border-slate-200/50;
  }

  .btn-primary {
    @apply px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0;
  }

  .input-field {
    @apply w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-200 outline-none placeholder:text-slate-400;
  }
}
</style>
