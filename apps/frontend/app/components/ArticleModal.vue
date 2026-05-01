<script setup lang="ts">
import { useApiClient } from '~/composables/useApiClient';
import type { Article } from '~/types/article';

const props = defineProps<{
  isOpen: boolean;
  article?: Article | null;
}>();

const emit = defineEmits(['close', 'saved']);

const { request } = useApiClient();

const form = reactive({
  title: '',
  content: '',
  status: 'draft' as 'draft' | 'published',
});

const loading = ref(false);
const error = ref('');

watch(
  () => props.article,
  (newArticle) => {
    if (newArticle) {
      form.title = newArticle.title;
      form.status = newArticle.status;
      form.content = newArticle.content?.[0]?.children?.[0]?.text || '';
    } else {
      form.title = '';
      form.content = '';
      form.status = 'draft';
    }
  },
  { immediate: true },
);

const handleSubmit = async () => {
  if (!form.title || !form.content) {
    error.value = 'Please fill in all fields';
    return;
  }

  loading.value = true;
  error.value = '';

  try {
    const isEdit = !!props.article;
    const url = isEdit
      ? `/api/articles/${props.article?.documentId}`
      : '/api/articles';
    const method = isEdit ? 'PUT' : 'POST';

    await request(url, {
      method,
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

    emit('saved');
    emit('close');
  } catch (err: any) {
    error.value = err.data?.error?.message || 'Something went wrong';
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm"
      >
        <div
          class="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden border border-slate-200 animate-slide-up"
        >
          <div
            class="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50"
          >
            <div>
              <h2 class="text-2xl font-bold text-slate-900">
                {{ article ? 'Edit Article' : 'New Article' }}
              </h2>
              <p class="text-sm text-slate-500 font-medium">
                Ready to share something great?
              </p>
            </div>
            <button
              @click="emit('close')"
              class="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400"
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
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </button>
          </div>

          <form
            @submit.prevent="handleSubmit"
            class="p-8 space-y-6 max-h-[70vh] overflow-y-auto"
          >
            <div
              v-if="error"
              class="p-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl font-medium"
            >
              {{ error }}
            </div>

            <div class="space-y-2">
              <label>Article Title</label>
              <input
                v-model="form.title"
                type="text"
                required
                placeholder="Catchy title..."
                class="input-field font-bold text-lg"
              />
            </div>

            <div class="space-y-2">
              <label>Content</label>
              <textarea
                v-model="form.content"
                required
                rows="8"
                placeholder="Write your story..."
                class="input-field resize-none"
              ></textarea>
            </div>

            <div class="space-y-3">
              <label>Publication Status</label>
              <div class="flex gap-3">
                <button
                  v-for="status in ['draft', 'published']"
                  :key="status"
                  type="button"
                  @click="form.status = status as any"
                  class="flex-1 p-3 rounded-xl border-2 transition-all font-bold text-sm capitalize flex items-center justify-center gap-2"
                  :class="
                    form.status === status
                      ? status === 'draft'
                        ? 'border-blue-600 bg-blue-50 text-blue-600'
                        : 'border-emerald-600 bg-emerald-50 text-emerald-600'
                      : 'border-slate-100 text-slate-400 hover:border-slate-200'
                  "
                >
                  <span v-if="status === 'draft'">📝</span>
                  <span v-else>🚀</span>
                  {{ status }}
                </button>
              </div>
            </div>
          </form>

          <div
            class="p-8 border-t border-slate-100 flex justify-end gap-3 bg-slate-50/50"
          >
            <button
              @click="emit('close')"
              type="button"
              class="px-6 py-2.5 text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              @click="handleSubmit"
              :disabled="loading"
              class="btn-primary min-w-[150px]"
            >
              <span v-if="loading" class="flex items-center gap-2">
                <div
                  class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"
                ></div>
                Saving...
              </span>
              <span v-else>{{
                article ? 'Update Changes' : 'Create Article'
              }}</span>
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.animate-slide-up {
  animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
</style>
