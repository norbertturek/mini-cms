import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';

// MOCK STRAPI FACTORIES AT THE VERY TOP TO PREVENT LODASH IMPORT ISSUES
vi.mock('@strapi/strapi', () => ({
  factories: {
    createCoreController: vi.fn((uid, cfg) => cfg),
  },
}));

import { Core } from '@strapi/strapi';
import { articleControllerFactory } from '../src/api/article/controllers/article';

/**
 * SACRED SECURITY TESTS - DO NOT EDIT
 *
 * These tests define the core authorization, data ownership, and privacy rules of the Mini CMS.
 */

// Define same interface as in controller for consistency
interface StrapiContext {
  state: {
    user?: { id: number };
  };
  query: Record<string, unknown>;
  params: Record<string, string>;
  request: {
    body: {
      data: unknown;
    };
  };
  unauthorized: Mock;
  badRequest: Mock;
  notFound: Mock;
}

interface MockSuper {
  find: Mock;
  findOne: Mock;
  update: Mock;
  delete: Mock;
  create: Mock;
}

interface MockController {
  find: (ctx: StrapiContext) => Promise<unknown>;
  findOne: (ctx: StrapiContext) => Promise<unknown>;
  update: (ctx: StrapiContext) => Promise<unknown>;
  delete: (ctx: StrapiContext) => Promise<unknown>;
  create: (ctx: StrapiContext) => Promise<unknown>;
  super: MockSuper;
}

describe('Article Controller - Security & Ownership', () => {
  const mockStrapi = {
    documents: vi.fn(),
    log: { error: vi.fn() },
  } as unknown as Core.Strapi;

  const mockSuper: MockSuper = {
    find: vi.fn().mockResolvedValue({ data: [] }),
    findOne: vi.fn().mockResolvedValue({ data: {} }),
    update: vi.fn().mockResolvedValue({ data: {} }),
    delete: vi.fn().mockResolvedValue({ data: {} }),
    create: vi.fn().mockResolvedValue({ data: {} }),
  };

  const initController = (): MockController => {
    // Initialize controller logic
    const controllerLogic = articleControllerFactory({ strapi: mockStrapi });
    
    // Bind mockSuper to simulate Strapi core behavior
    const controller = {
      ...controllerLogic,
      super: mockSuper,
    };

    return controller as unknown as MockController;
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockSuper.find.mockResolvedValue({ data: [] });
    mockSuper.findOne.mockResolvedValue({ data: {} });
  });

  const createMockCtx = (overrides: Partial<StrapiContext> = {}): StrapiContext => {
    return {
      state: {},
      query: {},
      params: {},
      request: { body: { data: {} } },
      unauthorized: vi.fn(),
      badRequest: vi.fn(),
      notFound: vi.fn(),
      ...overrides,
    };
  };

  describe('find (Privacy & Public Access)', () => {
    it('should restrict author fields to name and bio for public requests', async () => {
      const controller = initController();
      const ctx = createMockCtx({
        query: { populate: 'author' },
      });

      await controller.find.call(controller, ctx);

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
      const ctx = createMockCtx({
        state: { user: { id: 1 } },
        query: { ownArticles: 'true' },
      });

      (mockStrapi.documents as Mock).mockReturnValue({
        findFirst: vi.fn().mockResolvedValue({ documentId: 'author-1' }),
      });

      await controller.find.call(controller, ctx);

      expect(ctx.query.filters).toMatchObject({
        author: { documentId: 'author-1' },
      });
      expect(mockSuper.find).toHaveBeenCalledWith(ctx);
    });
  });

  describe('update (Ownership & Drafts)', () => {
    it('should allow author to find their own draft for update', async () => {
      const controller = initController();
      const ctx = createMockCtx({
        state: { user: { id: 1 } },
        params: { id: 'art-1' },
      });

      (mockStrapi.documents as Mock).mockReturnValue({
        findFirst: vi.fn().mockResolvedValue({ documentId: 'author-1' }),
        findOne: vi.fn().mockResolvedValue({ id: 1, title: 'Draft' }),
      });

      await controller.update.call(controller, ctx);

      const findOneCall = (mockStrapi.documents as Mock)('api::article.article').findOne;
      expect(findOneCall).toHaveBeenCalledWith(expect.objectContaining({
        documentId: 'art-1',
        status: 'draft',
        filters: { author: { documentId: 'author-1' } }
      }));
      expect(mockSuper.update).toHaveBeenCalledWith(ctx);
    });

    it('should block update if article does not belong to author', async () => {
      const controller = initController();
      const ctx = createMockCtx({
        state: { user: { id: 1 } },
        params: { id: 'other-art' },
      });

      (mockStrapi.documents as Mock).mockReturnValue({
        findFirst: vi.fn().mockResolvedValue({ documentId: 'author-1' }),
        findOne: vi.fn().mockResolvedValue(null),
      });

      await controller.update.call(controller, ctx);

      expect(ctx.notFound).toHaveBeenCalledWith('Article not found or you do not have permission');
      expect(mockSuper.update).not.toHaveBeenCalled();
    });
  });
});
