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
  loading.value = true;
  error.value = '';

  try {
    // Strapi 5 Document Service expects blocks for 'content', 
    // but we'll simplify and send a single paragraph block for now
    const response = await request<{ data: Article }>('/api/articles', {
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

    if (response.data) {
      router.push('/admin/articles');
    }
  } catch (err: unknown) {
    const fetchError = err as { data?: { error?: { message?: string } } };
    error.value = fetchError.data?.error?.message || 'Failed to create article';
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="max-w-4xl mx-auto p-8 space-y-8">
    <div class="flex items-center gap-4">
      <NuxtLink
        to="/admin/articles"
        class="p-2 hover:bg-white/10 rounded-full text-slate-400 hover:text-white transition-all"
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
            stroke-width="2"
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          ></path>
        </svg>
      </NuxtLink>
      <h1
        class="text-4xl font-bold tracking-tight bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent"
      >
        Create New Article
      </h1>
    </div>

    <form @submit.prevent="handleCreate" class="glass rounded-3xl p-8 space-y-6">
      <div v-if="error" class="p-4 text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-xl">
        {{ error }}
      </div>

      <div class="space-y-4">
        <div class="space-y-2">
          <label class="text-sm font-medium text-slate-300 ml-1">Title</label>
          <input
            v-model="form.title"
            type="text"
            required
            placeholder="Enter a catchy title..."
            class="input-field"
          />
        </div>

        <div class="space-y-2">
          <label class="text-sm font-medium text-slate-300 ml-1">Content</label>
          <textarea
            v-model="form.content"
            required
            rows="10"
            placeholder="Write your story here..."
            class="input-field resize-none"
          ></textarea>
        </div>

        <div class="space-y-2">
          <label class="text-sm font-medium text-slate-300 ml-1">Status</label>
          <select v-model="form.status" class="input-field appearance-none bg-slate-900 cursor-pointer">
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>
      </div>

      <div class="flex justify-end pt-4">
        <button type="submit" :disabled="loading" class="btn-primary min-w-[200px]">
          <span v-if="loading">Creating...</span>
          <span v-else>Save Article</span>
        </button>
      </div>
    </form>
  </div>
</template>
