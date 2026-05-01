<script setup lang="ts">
const { login } = useAuth();
const router = useRouter();

const form = reactive({
  identifier: '',
  password: '',
});

const loading = ref(false);
const error = ref('');

const handleLogin = async () => {
  loading.value = true;
  error.value = '';

  const result = await login(form);

  if (result.success) {
    router.push('/admin/articles');
  } else {
    error.value = result.error || 'Invalid credentials';
  }

  loading.value = false;
};
</script>

<template>
  <div class="max-w-md mx-auto py-12">
    <div
      class="bg-white p-10 rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50 space-y-8 relative overflow-hidden"
    >
      <div class="text-center space-y-2">
        <h1 class="text-3xl font-extrabold tracking-tight text-slate-900">
          Welcome back
        </h1>
        <p class="text-slate-500 font-medium">
          Enter your details to access your account
        </p>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-6">
        <div
          v-if="error"
          class="p-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl font-medium animate-shake"
        >
          {{ error }}
        </div>

        <div class="space-y-5">
          <div class="space-y-2">
            <label>Email or Username</label>
            <input
              v-model="form.identifier"
              type="text"
              required
              placeholder="name@example.com"
              class="input-field"
            />
          </div>

          <div class="space-y-2">
            <label>Password</label>
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
          class="w-full btn-primary flex items-center justify-center gap-2"
        >
          <span v-if="loading" class="flex items-center gap-2">
            <div
              class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"
            ></div>
            Logging in...
          </span>
          <span v-else>Sign In</span>
        </button>
      </form>

      <div class="text-center text-sm text-slate-500 font-medium">
        Don't have an account?
        <NuxtLink
          to="/register"
          class="text-blue-600 hover:text-blue-700 font-bold transition-colors"
        >
          Create an account
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes shake {
  0%,
  100% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-4px);
  }
  75% {
    transform: translateX(4px);
  }
}
.animate-shake {
  animation: shake 0.2s ease-in-out 0s 2;
}
</style>
