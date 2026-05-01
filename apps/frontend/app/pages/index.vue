<script setup lang="ts">
const { user, isAuthenticated, logout } = useAuth();
</script>

<template>
  <div
    class="flex flex-col items-center justify-center min-h-screen p-4 space-y-8"
  >
    <div class="text-center space-y-4">
      <h1 class="text-6xl font-black tracking-tighter text-white">
        Mini
        <span
          class="bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent"
          >CMS</span
        >
      </h1>
      <p class="text-slate-400 text-xl max-w-md mx-auto">
        A premium platform for creators to share their stories with the world.
      </p>
    </div>

    <div
      v-if="isAuthenticated"
      class="glass p-8 rounded-3xl w-full max-w-md space-y-6"
    >
      <div class="flex items-center gap-4">
        <div
          class="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center text-2xl font-bold"
        >
          {{ user?.username?.charAt(0).toUpperCase() }}
        </div>
        <div>
          <p class="text-sm text-slate-400">Logged in as</p>
          <h2 class="text-xl font-bold">{{ user?.username }}</h2>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <NuxtLink
          to="/admin/articles"
          class="btn-primary text-center py-4 flex items-center justify-center"
        >
          Admin Panel
        </NuxtLink>
        <button
          @click="logout"
          class="px-6 py-4 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl transition-all border border-slate-800 active:scale-95"
        >
          Logout
        </button>
      </div>
    </div>

    <div v-else class="flex gap-4">
      <NuxtLink to="/login" class="btn-primary"> Sign In </NuxtLink>
      <NuxtLink
        to="/register"
        class="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl transition-all border border-slate-800 active:scale-95"
      >
        Create Account
      </NuxtLink>
    </div>
  </div>
</template>
