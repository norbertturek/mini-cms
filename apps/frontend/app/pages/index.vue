<script setup lang="ts">
import { useApiClient } from '~/composables/useApiClient';
import type { Article } from '~/types/article';

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

const formatDate = (dateStr?: string) => {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

onMounted(fetchPublicArticles);
</script>

<template>
  <div class="space-y-12">
    <header class="text-center py-12 space-y-4">
      <h1
        class="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900"
      >
        Discover <span class="text-blue-600">Stories</span>
      </h1>
      <p
        class="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto font-medium"
      >
        Insights, ideas, and community stories curated for you.
      </p>
    </header>

    <section class="pb-12">
      <div
        v-if="loading"
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        <div
          v-for="i in 6"
          :key="i"
          class="h-64 bg-slate-200 rounded-3xl animate-pulse"
        ></div>
      </div>

      <div
        v-else-if="articles.length === 0"
        class="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200"
      >
        <div class="text-4xl mb-4">📝</div>
        <h2 class="text-2xl font-bold text-slate-900">No articles found</h2>
        <p class="text-slate-500">
          Our community is currently preparing fresh content. Check back soon!
        </p>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <article
          v-for="article in articles"
          :key="article.id"
          class="group bg-white rounded-3xl border border-slate-200 overflow-hidden hover:shadow-xl hover:shadow-blue-500/5 hover:-translate-y-1 transition-all duration-300 flex flex-col"
        >
          <div class="p-8 flex-grow flex flex-col space-y-4">
            <div class="flex gap-2">
              <span
                v-for="tag in article.tags"
                :key="tag.id"
                class="text-[10px] font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md"
              >
                {{ tag.name }}
              </span>
            </div>

            <h2
              class="text-2xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-tight"
            >
              {{ article.title }}
            </h2>

            <p
              class="text-slate-500 line-clamp-3 leading-relaxed text-sm flex-grow"
            >
              {{
                article.content?.[0]?.children?.[0]?.text ||
                'No description available.'
              }}
            </p>

            <footer
              class="pt-6 border-t border-slate-50 flex items-center gap-3"
            >
              <div
                class="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center font-bold text-slate-500 border border-slate-200"
              >
                {{ article.author?.name?.charAt(0) || 'A' }}
              </div>
              <div class="flex flex-col">
                <span class="text-sm font-bold text-slate-900">{{
                  article.author?.name || 'Anonymous'
                }}</span>
                <span class="text-xs text-slate-400">{{
                  formatDate(article.publishedAt)
                }}</span>
              </div>
            </footer>
          </div>
        </article>
      </div>
    </section>
  </div>
</template>
