<script setup lang="ts">
import { useApiClient } from '~/composables/useApiClient';
import type { Article } from '~/types/article';

const { request } = useApiClient();
const articles = ref<Article[]>([]);
const loading = ref(true);

const fetchMyArticles = async () => {
  loading.value = true;
  try {
    const response = await request<{ data: Article[] }>('/api/articles', {
      query: {
        ownArticles: 'true',
        populate: ['author', 'tags'],
      },
    });
    articles.value = response.data;
  } catch (error) {
    console.error('Failed to fetch articles:', error);
  } finally {
    loading.value = false;
  }
};

onMounted(fetchMyArticles);

const getStatusColor = (status: string) => {
  switch (status) {
    case 'published':
      return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
    case 'draft':
      return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
    default:
      return 'text-slate-400 bg-slate-400/10 border-slate-400/20';
  }
};
</script>

<template>
  <div class="max-w-6xl mx-auto p-8 space-y-8">
    <div class="flex items-center justify-between">
      <div>
        <h1
          class="text-4xl font-bold tracking-tight bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent"
        >
          My Articles
        </h1>
        <p class="text-slate-400 mt-2">Manage your stories and drafts</p>
      </div>
      <NuxtLink to="/admin/articles/create" class="btn-primary">
        Create New Article
      </NuxtLink>
    </div>

    <div v-if="loading" class="flex justify-center py-20">
      <div
        class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"
      ></div>
    </div>

    <div
      v-else-if="articles.length === 0"
      class="glass rounded-3xl p-20 text-center"
    >
      <div class="space-y-4">
        <div class="text-6xl text-slate-700">✍️</div>
        <h2 class="text-2xl font-semibold text-slate-300">No articles yet</h2>
        <p class="text-slate-500">
          Start sharing your thoughts with the world.
        </p>
        <NuxtLink
          to="/admin/articles/create"
          class="text-indigo-400 font-medium hover:underline"
        >
          Write your first article
        </NuxtLink>
      </div>
    </div>

    <div v-else class="grid gap-6">
      <div
        v-for="article in articles"
        :key="article.id"
        class="glass rounded-2xl p-6 group hover:border-white/20 transition-all duration-300"
      >
        <div class="flex items-start justify-between">
          <div class="space-y-3">
            <div class="flex items-center gap-3">
              <h2
                class="text-xl font-semibold text-slate-200 group-hover:text-indigo-300 transition-colors"
              >
                {{ article.title }}
              </h2>
              <span
                class="px-2.5 py-0.5 rounded-full text-xs font-medium border uppercase tracking-wider"
                :class="getStatusColor(article.status)"
              >
                {{ article.status }}
              </span>
            </div>
            <p class="text-slate-400 line-clamp-2 max-w-2xl">
              {{
                article.content?.[0]?.children?.[0]?.text ||
                'No description available...'
              }}
            </p>
            <div class="flex items-center gap-4 text-sm text-slate-500">
              <div v-if="article.tags?.length" class="flex items-center gap-2">
                <span
                  v-for="tag in article.tags"
                  :key="tag.id"
                  class="text-indigo-400/80"
                >
                  #{{ tag.name }}
                </span>
              </div>
              <span
                >Created at
                {{ new Date(article.createdAt).toLocaleDateString() }}</span
              >
            </div>
          </div>
          <div
            class="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <button
              class="p-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-all"
            >
              Edit
            </button>
            <button
              class="p-2 hover:bg-red-400/10 rounded-lg text-slate-400 hover:text-red-400 transition-all"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
