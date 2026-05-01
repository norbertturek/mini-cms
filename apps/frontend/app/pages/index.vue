<script setup lang="ts">
import { useAuth } from '~/composables/useAuth';
import { useApiClient } from '~/composables/useApiClient';
import type { Article } from '~/types/article';

const { user, isAuthenticated, logout } = useAuth();
const { request } = useApiClient();

const articles = ref<Article[]>([]);
const loading = ref(true);

const fetchPublicArticles = async () => {
  loading.value = true;
  try {
    const response = await request<{ data: Article[] }>('/api/articles', {
      query: {
        populate: ['author', 'tags'],
        sort: ['publishedAt:desc'],
      },
    });
    articles.value = response.data;
  } catch (error) {
    console.error('Failed to fetch public articles:', error);
  } finally {
    loading.value = false;
  }
};

onMounted(fetchPublicArticles);
</script>

<template>
  <div class="max-w-6xl mx-auto p-4 md:p-8 space-y-12">
    <!-- Header/Hero Section -->
    <header class="flex flex-col md:flex-row items-center justify-between gap-8 pt-8 pb-4">
      <div class="text-left space-y-2">
        <h1 class="text-5xl font-black tracking-tighter text-white">
          Mini
          <span class="bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">CMS</span>
        </h1>
        <p class="text-slate-400 text-lg max-w-md">
          Insights, stories, and ideas from our amazing community.
        </p>
      </div>

      <div v-if="isAuthenticated" class="flex items-center gap-6">
        <NuxtLink to="/admin/articles" class="group flex items-center gap-3 glass p-2 pr-6 rounded-2xl hover:border-white/20 transition-all">
          <div class="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center font-bold">
            {{ user?.username?.charAt(0).toUpperCase() }}
          </div>
          <span class="font-medium text-slate-200 group-hover:text-white transition-colors">Dashboard</span>
        </NuxtLink>
        <button @click="logout" class="text-slate-400 hover:text-white transition-colors text-sm font-medium">
          Logout
        </button>
      </div>

      <div v-else class="flex gap-4">
        <NuxtLink to="/login" class="btn-primary">Sign In</NuxtLink>
        <NuxtLink to="/register" class="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl transition-all border border-slate-800">
          Join
        </NuxtLink>
      </div>
    </header>

    <!-- Articles Feed -->
    <section class="space-y-8">
      <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div v-for="i in 6" :key="i" class="glass rounded-3xl h-80 animate-pulse"></div>
      </div>

      <div v-else-if="articles.length === 0" class="glass rounded-3xl p-20 text-center space-y-4">
        <h2 class="text-2xl font-semibold text-slate-300">No articles yet</h2>
        <p class="text-slate-500 text-lg">Be the first to share a story!</p>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <article
          v-for="article in articles"
          :key="article.id"
          class="glass rounded-3xl overflow-hidden group hover:border-indigo-500/30 transition-all duration-500 flex flex-col"
        >
          <div class="p-8 flex-1 flex flex-col space-y-4">
            <div class="flex items-center gap-2">
              <span v-for="tag in article.tags" :key="tag.id" class="text-xs font-bold uppercase tracking-wider text-indigo-400">
                {{ tag.name }}
              </span>
            </div>
            
            <h2 class="text-2xl font-bold text-white group-hover:text-indigo-300 transition-colors line-clamp-2">
              {{ article.title }}
            </h2>

            <p class="text-slate-400 line-clamp-3 leading-relaxed">
              {{ article.content?.[0]?.children?.[0]?.text || 'Click to read more...' }}
            </p>

            <div class="pt-6 mt-auto border-t border-white/5 flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center text-xs font-bold text-slate-400">
                  {{ article.author?.name?.charAt(0).toUpperCase() || 'A' }}
                </div>
                <span class="text-sm font-medium text-slate-300">{{ article.author?.name || 'Anonymous' }}</span>
              </div>
              <span class="text-xs text-slate-500">{{ new Date(article.publishedAt!).toLocaleDateString() }}</span>
            </div>
          </div>
        </article>
      </div>
    </section>
  </div>
</template>
