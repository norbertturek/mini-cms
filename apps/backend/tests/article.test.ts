import { describe, it, expect, vi, beforeEach } from 'vitest';

// MOCK STRAPI FACTORIES AT THE VERY TOP
vi.mock('@strapi/strapi', () => ({
  factories: {
    createCoreController: vi.fn((uid, cfg) => cfg),
  },
}));

// Now import the factory
import { articleControllerFactory } from '../src/api/article/controllers/article';

/**
 * SACRED SECURITY TESTS - DO NOT EDIT
 */

describe('Article Controller - Security & Ownership', () => {
  const mockStrapi = {
    documents: vi.fn(),
    log: { error: vi.fn() },
  };

  const mockSuper = {
    find: vi.fn().mockResolvedValue({ data: [] }),
    findOne: vi.fn().mockResolvedValue({ data: {} }),
    update: vi.fn().mockResolvedValue({ data: {} }),
    delete: vi.fn().mockResolvedValue({ data: {} }),
  };

  const initController = () => {
    const controller = articleControllerFactory({ strapi: mockStrapi as any });
    return {
      ...controller,
      super: mockSuper,
    };
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockSuper.find.mockResolvedValue({ data: [] });
    mockSuper.findOne.mockResolvedValue({ data: {} });
  });

  describe('find (Privacy & Public Access)', () => {
    it('should restrict author fields to name and bio for public requests', async () => {
      const controller = initController();
      const ctx = {
        state: {},
        query: { populate: 'author' },
      };

      await controller.find.call(controller, ctx as any);

      expect(ctx.query.populate).toEqual({
        author: { fields: ['name', 'bio'] },
      });
      expect(ctx.query.filters).toMatchObject({
        status: 'published',
      });
      expect(mockSuper.find).toHaveBeenCalledWith(ctx);
    });

    it('should filter by logged in author when ownArticles=true', async () => {
      const controller = initController();
      const ctx = {
        state: { user: { id: 1 } },
        query: { ownArticles: 'true' },
      };

      mockStrapi.documents.mockReturnValue({
        findFirst: vi.fn().mockResolvedValue({ documentId: 'author-1' }),
      });

      await controller.find.call(controller, ctx as any);

      expect(ctx.query.filters).toMatchObject({
        author: { documentId: 'author-1' },
      });
      expect(mockSuper.find).toHaveBeenCalledWith(ctx);
    });
  });

  describe('update (Ownership & Drafts)', () => {
    it('should allow author to find their own draft for update', async () => {
      const controller = initController();
      const ctx = {
        state: { user: { id: 1 } },
        params: { id: 'art-1' },
        request: { body: { data: {} } },
      };

      mockStrapi.documents.mockReturnValue({
        findFirst: vi.fn().mockResolvedValue({ documentId: 'author-1' }),
        findOne: vi.fn().mockResolvedValue({ id: 1, title: 'Draft' }),
      });

      await controller.update.call(controller, ctx as any);

      const findOneCall = mockStrapi.documents('api::article.article').findOne;
      expect(findOneCall).toHaveBeenCalledWith(expect.objectContaining({
        documentId: 'art-1',
        status: 'draft',
        filters: { author: { documentId: 'author-1' } }
      }));
      expect(mockSuper.update).toHaveBeenCalledWith(ctx);
    });

    it('should block update if article does not belong to author', async () => {
      const controller = initController();
      const ctx = {
        state: { user: { id: 1 } },
        params: { id: 'other-art' },
        notFound: vi.fn(),
      };

      mockStrapi.documents.mockReturnValue({
        findFirst: vi.fn().mockResolvedValue({ documentId: 'author-1' }),
        findOne: vi.fn().mockResolvedValue(null),
      });

      await controller.update.call(controller, ctx as any);

      expect(ctx.notFound).toHaveBeenCalledWith('Article not found or you do not have permission');
      expect(mockSuper.update).not.toHaveBeenCalled();
    });
  });
});
