<script setup lang="ts">
import { useApiClient } from '~/composables/useApiClient';
import type { Article } from '~/types/article';

const { request } = useApiClient();
const router = useRouter();

const form = reactive({
  title: '',
  content: '',
  status: 'draft' as 'draft' | 'published',
});

const loading = ref(false);
const error = ref('');

const handleCreate = async () => {
  if (!form.title || !form.content) {
    error.value = 'Please fill in all fields';
    return;
  }

  loading.value = true;
  error.value = '';

  try {
    await request<{ data: Article }>('/api/articles', {
      method: 'POST',
      body: {
        data: {
          title: form.title,
          content: [
            {
              type: 'paragraph',
              children: [{ type: 'text', text: form.content }],
            },
          ],
          status: form.status,
        },
      },
    });

    router.push('/admin/articles');
  } catch (err: unknown) {
    const fetchError = err as { data?: { error?: { message?: string } } };
    error.value = fetchError.data?.error?.message || 'Failed to create article';
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="max-w-4xl mx-auto py-8">
    <div class="flex items-center gap-4 mb-8">
      <NuxtLink
        to="/admin/articles"
        class="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-900 transition-all border border-transparent hover:border-slate-200"
      >
        <svg
          class="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2.5"
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          ></path>
        </svg>
      </NuxtLink>
      <div>
        <h1 class="text-3xl font-extrabold tracking-tight text-slate-900">
          Create New Article
        </h1>
        <p class="text-slate-500 font-medium">
          Share your insights with the community.
        </p>
      </div>
    </div>

    <form
      @submit.prevent="handleCreate"
      class="bg-white rounded-3xl border border-slate-200 p-10 shadow-xl shadow-slate-200/40 space-y-8"
    >
      <div
        v-if="error"
        class="p-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl font-medium animate-shake"
      >
        {{ error }}
      </div>

      <div class="space-y-6">
        <div class="space-y-2">
          <label>Article Title</label>
          <input
            v-model="form.title"
            type="text"
            required
            placeholder="Enter a catchy title..."
            class="input-field text-lg font-bold"
          />
        </div>

        <div class="space-y-2">
          <label>Content</label>
          <textarea
            v-model="form.content"
            required
            rows="12"
            placeholder="Write your story here..."
            class="input-field resize-none leading-relaxed"
          ></textarea>
        </div>

        <div class="space-y-4">
          <label>Publication Status</label>
          <div class="flex gap-4">
            <button
              type="button"
              @click="form.status = 'draft'"
              class="flex-1 p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 group"
              :class="
                form.status === 'draft'
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-slate-100 hover:border-slate-200 bg-slate-50/50'
              "
            >
              <span class="text-2xl">📝</span>
              <span
                class="font-bold"
                :class="
                  form.status === 'draft' ? 'text-blue-600' : 'text-slate-600'
                "
                >Draft</span
              >
              <span class="text-[10px] text-slate-400 font-medium text-center"
                >Only you can see and edit this.</span
              >
            </button>

            <button
              type="button"
              @click="form.status = 'published'"
              class="flex-1 p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 group"
              :class="
                form.status === 'published'
                  ? 'border-emerald-600 bg-emerald-50'
                  : 'border-slate-100 hover:border-slate-200 bg-slate-50/50'
              "
            >
              <span class="text-2xl">🚀</span>
              <span
                class="font-bold"
                :class="
                  form.status === 'published'
                    ? 'text-emerald-600'
                    : 'text-slate-600'
                "
                >Published</span
              >
              <span class="text-[10px] text-slate-400 font-medium text-center"
                >Visible to everyone immediately.</span
              >
            </button>
          </div>
        </div>
      </div>

      <div
        class="flex items-center justify-between pt-6 border-t border-slate-50"
      >
        <p class="text-xs text-slate-400 font-medium italic">
          * Auto-saved to local storage coming soon
        </p>
        <button
          type="submit"
          :disabled="loading"
          class="btn-primary min-w-[180px]"
        >
          <span v-if="loading" class="flex items-center gap-2">
            <div
              class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"
            ></div>
            Saving...
          </span>
          <span v-else>{{
            form.status === 'published' ? 'Publish Now' : 'Save as Draft'
          }}</span>
        </button>
      </div>
    </form>
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
