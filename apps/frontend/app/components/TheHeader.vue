<template>
  <header class="sticky top-0 z-50 glass border-b border-slate-200/50 h-16 flex items-center">
    <nav class="container mx-auto px-4 flex justify-between items-center">
      <NuxtLink to="/" class="text-xl font-bold tracking-tight">
        <span class="text-slate-900">Mini</span><span class="text-blue-600">CMS</span>
      </NuxtLink>
      
      <div class="flex items-center gap-6">
        <NuxtLink to="/" class="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">Home</NuxtLink>
        
        <template v-if="auth.isAuthenticated">
          <NuxtLink to="/admin/articles" class="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">Dashboard</NuxtLink>
          <button @click="handleLogout" class="text-sm font-medium text-slate-500 hover:text-red-500 transition-colors px-3 py-1.5 border border-slate-200 rounded-lg hover:bg-red-50">Logout</button>
        </template>
        
        <template v-else>
          <NuxtLink to="/login" class="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">Login</NuxtLink>
          <NuxtLink to="/register" class="btn-primary py-1.5 px-4 text-sm">Register</NuxtLink>
        </template>
      </div>
    </nav>
  </header>
</template>

<script setup lang="ts">
const auth = useAuthStore();
const router = useRouter();

const handleLogout = () => {
  auth.logout();
  router.push('/');
};
</script>
