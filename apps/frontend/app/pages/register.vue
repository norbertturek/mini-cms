<script setup lang="ts">
const { register } = useAuth();
const router = useRouter();

const form = reactive({
  username: '',
  email: '',
  password: '',
});

const loading = ref(false);
const error = ref('');

const handleRegister = async () => {
  loading.value = true;
  error.value = '';
  
  const result = await register(form);
  
  if (result.success) {
    router.push('/admin/articles');
  } else {
    error.value = result.error || 'Registration failed';
  }
  
  loading.value = false;
};
</script>

<template>
  <div class="flex items-center justify-center min-h-screen p-4">
    <div class="w-full max-w-md p-8 glass rounded-3xl space-y-8 relative overflow-hidden">
      <!-- Background decoration -->
      <div class="absolute -top-24 -right-24 w-48 h-48 bg-purple-600/20 rounded-full blur-3xl"></div>
      <div class="absolute -bottom-24 -left-24 w-48 h-48 bg-indigo-600/20 rounded-full blur-3xl"></div>

      <div class="relative space-y-2 text-center">
        <h1 class="text-4xl font-bold tracking-tight bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
          Create Account
        </h1>
        <p class="text-slate-400">Join our community of authors today</p>
      </div>

      <form @submit.prevent="handleRegister" class="relative space-y-6">
        <div v-if="error" class="p-4 text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-xl animate-shake">
          {{ error }}
        </div>

        <div class="space-y-4">
          <div class="space-y-2">
            <label class="text-sm font-medium text-slate-300 ml-1">Username</label>
            <input 
              v-model="form.username"
              type="text" 
              required
              placeholder="johndoe"
              class="input-field"
            />
          </div>

          <div class="space-y-2">
            <label class="text-sm font-medium text-slate-300 ml-1">Email</label>
            <input 
              v-model="form.email"
              type="email" 
              required
              placeholder="name@example.com"
              class="input-field"
            />
          </div>

          <div class="space-y-2">
            <label class="text-sm font-medium text-slate-300 ml-1">Password</label>
            <input 
              v-model="form.password"
              type="password" 
              required
              placeholder="••••••••"
              class="input-field"
            />
          </div>
        </div>

        <button 
          type="submit" 
          :disabled="loading"
          class="w-full btn-primary bg-gradient-to-r from-purple-600 to-indigo-600 border-none"
        >
          <span v-if="loading" class="flex items-center justify-center gap-2">
            <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Creating account...
          </span>
          <span v-else>Get Started</span>
        </button>
      </form>

      <div class="relative text-center text-sm text-slate-400">
        Already have an account? 
        <NuxtLink to="/login" class="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors">
          Sign in
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-4px); }
  75% { transform: translateX(4px); }
}
.animate-shake {
  animation: shake 0.2s ease-in-out 0s 2;
}
</style>
