<script setup lang="ts">
import { useApiClient } from '~/composables/useApiClient';
import type { Article } from '~/types/article';

const { request } = useApiClient();
const articles = ref<Article[]>([]);
const loading = ref(true);

// Modal state
const isModalOpen = ref(false);
const selectedArticle = ref<Article | null>(null);

const fetchMyArticles = async () => {
  loading.value = true;
  try {
    const response = await request<{ data: Article[] }>('/api/articles', {
      query: {
        ownArticles: 'true',
        populate: ['tags'],
        sort: ['createdAt:desc'],
      },
    });
    articles.value = response.data;
  } catch (error) {
    console.error('Failed to fetch articles:', error);
  } finally {
    loading.value = false;
  }
};

const openCreateModal = () => {
  selectedArticle.value = null;
  isModalOpen.value = true;
};

const openEditModal = (article: Article) => {
  selectedArticle.value = article;
  isModalOpen.value = true;
};

const handleDelete = async (documentId: string) => {
  if (
    !confirm(
      'Are you sure you want to delete this article? This action cannot be undone.',
    )
  ) {
    return;
  }

  try {
    await request(`/api/articles/${documentId}`, {
      method: 'DELETE',
    });
    articles.value = articles.value.filter((a) => a.documentId !== documentId);
  } catch (error) {
    alert('Failed to delete article.');
    console.error('Delete error:', error);
  }
};

onMounted(fetchMyArticles);
</script>

<template>
  <div class="space-y-10">
    <div
      class="flex flex-col md:flex-row md:items-center justify-between gap-6"
    >
      <div>
        <h1 class="text-3xl font-extrabold tracking-tight text-slate-900">
          My Articles
        </h1>
        <p class="text-slate-500 font-medium mt-1">
          Manage your stories, drafts and publications.
        </p>
      </div>
      <button @click="openCreateModal" class="btn-primary">
        Create New Article
      </button>
    </div>

    <div v-if="loading" class="flex justify-center py-20">
      <div
        class="w-10 h-10 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"
      ></div>
    </div>

    <div
      v-else-if="articles.length === 0"
      class="bg-white rounded-3xl border-2 border-dashed border-slate-200 p-16 text-center"
    >
      <div class="text-5xl mb-6">✍️</div>
      <h2 class="text-2xl font-bold text-slate-900">No articles yet</h2>
      <p class="text-slate-500 max-w-sm mx-auto mt-2">
        You haven't shared any stories yet. Start by creating your first
        article!
      </p>
      <button
        @click="openCreateModal"
        class="inline-block mt-8 text-blue-600 font-bold hover:text-blue-700 transition-colors"
      >
        Write your first article &rarr;
      </button>
    </div>

    <div v-else class="grid gap-4">
      <div
        v-for="article in articles"
        :key="article.id"
        class="group bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-lg hover:shadow-slate-200/40 transition-all duration-300"
      >
        <div
          class="flex flex-col md:flex-row md:items-center justify-between gap-6"
        >
          <div class="space-y-3 flex-grow">
            <div class="flex items-center gap-3">
              <h2
                class="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors"
              >
                {{ article.title }}
              </h2>
              <span
                class="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest border"
                :class="
                  article.status === 'published'
                    ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                    : 'bg-amber-50 text-amber-600 border-amber-100'
                "
              >
                {{ article.status }}
              </span>
            </div>
            <p
              class="text-slate-500 line-clamp-1 max-w-3xl text-sm font-medium"
            >
              {{
                article.content?.[0]?.children?.[0]?.text ||
                'No content provided.'
              }}
            </p>
            <div
              class="flex items-center gap-4 text-xs font-semibold text-slate-400"
            >
              <span
                >Created
                {{ new Date(article.createdAt).toLocaleDateString() }}</span
              >
            </div>
          </div>

          <div class="flex items-center gap-2">
            <button
              @click="openEditModal(article)"
              class="px-4 py-2 text-sm font-bold text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
            >
              Edit
            </button>
            <button
              @click="handleDelete(article.documentId)"
              class="px-4 py-2 text-sm font-bold text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- The Popup Modal -->
    <ArticleModal
      :is-open="isModalOpen"
      :article="selectedArticle"
      @close="isModalOpen = false"
      @saved="fetchMyArticles"
    />
  </div>
</template>
