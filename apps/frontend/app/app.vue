<template>
  <div
    class="min-h-screen bg-slate-950 text-slate-50 font-sans selection:bg-indigo-500/30"
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

body {
  @apply bg-slate-950;
}

.glass {
  @apply bg-white/5 backdrop-blur-xl border border-white/10;
}

.btn-primary {
  @apply px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-indigo-500/20 active:scale-95 disabled:opacity-50 disabled:active:scale-100;
}

.input-field {
  @apply w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-300 outline-none placeholder:text-slate-500;
}
</style>
