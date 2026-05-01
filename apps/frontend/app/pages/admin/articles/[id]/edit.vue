<script setup lang="ts">
import { useApiClient } from '~/composables/useApiClient';
import type { Article } from '~/types/article';

const { request } = useApiClient();
const router = useRouter();
const route = useRoute();

const documentId = route.params.id as string;

const form = reactive({
  title: '',
  content: '',
  status: 'draft' as 'draft' | 'published',
});

const loading = ref(false);
const fetching = ref(true);
const error = ref('');

const fetchArticle = async () => {
  fetching.value = true;
  try {
    const response = await request<{ data: Article }>(`/api/articles/${documentId}`, {
      query: { ownArticles: 'true' }
    });
    
    if (response.data) {
      form.title = response.data.title;
      form.status = response.data.status;
      // Extract text from Strapi blocks
      form.content = response.data.content?.[0]?.children?.[0]?.text || '';
    }
  } catch (err: unknown) {
    error.value = 'Failed to load article';
    console.error(err);
  } finally {
    fetching.value = false;
  }
};

const handleUpdate = async () => {
  if (!form.title || !form.content) {
    error.value = 'Please fill in all fields';
    return;
  }

  loading.value = true;
  error.value = '';

  try {
    await request(`/api/articles/${documentId}`, {
      method: 'PUT',
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
    error.value = fetchError.data?.error?.message || 'Failed to update article';
  } finally {
    loading.value = false;
  }
};

onMounted(fetchArticle);
</script>

<template>
  <div class="max-w-4xl mx-auto py-8">
    <div class="flex items-center gap-4 mb-8">
      <NuxtLink
        to="/admin/articles"
        class="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-900 transition-all border border-transparent hover:border-slate-200"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
        </svg>
      </NuxtLink>
      <div>
        <h1 class="text-3xl font-extrabold tracking-tight text-slate-900">Edit Article</h1>
        <p class="text-slate-500 font-medium">Update your story and publication settings.</p>
      </div>
    </div>

    <div v-if="fetching" class="flex justify-center py-20">
      <div class="w-10 h-10 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
    </div>

    <form v-else @submit.prevent="handleUpdate" class="bg-white rounded-3xl border border-slate-200 p-10 shadow-xl shadow-slate-200/40 space-y-8">
      <div v-if="error" class="p-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl font-medium animate-shake">
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
              class="flex-1 p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2"
              :class="form.status === 'draft' ? 'border-blue-600 bg-blue-50' : 'border-slate-100 hover:border-slate-200 bg-slate-50/50'"
            >
              <span class="text-2xl">📝</span>
              <span class="font-bold" :class="form.status === 'draft' ? 'text-blue-600' : 'text-slate-600'">Draft</span>
              <span class="text-[10px] text-slate-400 font-medium text-center">Only you can see and edit this.</span>
            </button>

            <button 
              type="button"
              @click="form.status = 'published'"
              class="flex-1 p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2"
              :class="form.status === 'published' ? 'border-emerald-600 bg-emerald-50' : 'border-slate-100 hover:border-slate-200 bg-slate-50/50'"
            >
              <span class="text-2xl">🚀</span>
              <span class="font-bold" :class="form.status === 'published' ? 'text-emerald-600' : 'text-slate-600'">Published</span>
              <span class="text-[10px] text-slate-400 font-medium text-center">Visible to everyone immediately.</span>
            </button>
          </div>
        </div>
      </div>

      <div class="flex items-center justify-between pt-6 border-t border-slate-50">
        <p class="text-xs text-slate-400 font-medium italic">
          Last updated {{ new Date().toLocaleDateString() }}
        </p>
        <div class="flex gap-4">
          <NuxtLink to="/admin/articles" class="px-6 py-2.5 text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors">
            Cancel
          </NuxtLink>
          <button type="submit" :disabled="loading" class="btn-primary min-w-[180px]">
            <span v-if="loading" class="flex items-center gap-2">
              <div class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              Updating...
            </span>
            <span v-else>Update Article</span>
          </button>
        </div>
      </div>
    </form>
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
