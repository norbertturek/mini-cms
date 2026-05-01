import { factories, Core } from '@strapi/strapi';

/**
 * Controller logic exported for unit testing.
 * In runtime, Strapi binds `super` via Object.setPrototypeOf.
 * In tests, `super` is provided via `controller.super = mockSuper`.
 */
export const articleControllerFactory = ({
  strapi,
}: {
  strapi: Core.Strapi;
}) => ({
  async create(ctx: Record<string, unknown>) {
    const user = (ctx as { state: { user?: { id: number } } }).state?.user;
    if (!user)
      return (ctx as { unauthorized: (m: string) => unknown }).unauthorized(
        'You must be logged in',
      );

    let author = await strapi.documents('api::author.author').findFirst({
      filters: { user: { id: user.id } },
    });

    if (!author) {
      const userData = await strapi.db
        .query('plugin::users-permissions.user')
        .findOne({ where: { id: user.id } });
      author = await strapi.documents('api::author.author').create({
        data: {
          name: userData?.username || `User_${user.id}`,
          email: userData?.email || '',
          user: user.id,
        },
      });
    }

    const body = (
      ctx as { request: { body: { data: Record<string, unknown> } } }
    ).request.body;
    const bodyData = body.data || {};
    const requestedStatus = bodyData.status as string;
    const title = (bodyData.title as string) || '';
    const slug =
      (bodyData.slug as string) ||
      title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '') ||
      `article-${Date.now()}`;

    body.data = {
      ...bodyData,
      author: author.documentId,
      slug,
    };

    const self = this as unknown as {
      super: {
        create: (c: unknown) => Promise<{ data: { documentId: string } }>;
      };
    };
    const result = await self.super.create(ctx);

    if (requestedStatus === 'published' && result?.data?.documentId) {
      await strapi.documents('api::article.article').publish({
        documentId: result.data.documentId,
      });
    }

    return result;
  },

  async find(ctx: Record<string, unknown>) {
    const state = (ctx as { state: { user?: { id: number } } }).state;
    const query = ctx as { query: Record<string, unknown> };
    const user = state?.user;
    const ownArticles = query.query?.ownArticles;

    if (user && ownArticles === 'true') {
      // Owner view: show all own articles (drafts + published)
      const author = await strapi.documents('api::author.author').findFirst({
        filters: { user: { id: user.id } },
      });

      if (!author) return { data: [], meta: { pagination: { total: 0 } } };

      const currentFilters =
        (query.query.filters as Record<string, unknown>) || {};
      query.query.filters = {
        ...currentFilters,
        author: { documentId: author.documentId },
      };
    } else {
      // Public view: only published articles, hide author email
      const currentFilters =
        (query.query.filters as Record<string, unknown>) || {};
      query.query.filters = {
        ...currentFilters,
        status: 'published',
      };

      const currentPopulate = query.query.populate;
      if (typeof currentPopulate === 'string' && currentPopulate === 'author') {
        query.query.populate = { author: { fields: ['name', 'bio'] } };
      } else if (Array.isArray(currentPopulate)) {
        const newPopulate: Record<string, unknown> = {};
        (currentPopulate as string[]).forEach((p: string) => {
          if (p === 'author') newPopulate.author = { fields: ['name', 'bio'] };
          else newPopulate[p] = { populate: true };
        });
        query.query.populate = newPopulate;
      } else if (
        typeof currentPopulate === 'object' &&
        currentPopulate !== null
      ) {
        query.query.populate = {
          ...(currentPopulate as Record<string, unknown>),
          author: { fields: ['name', 'bio'] },
        };
      }
    }

    const self = this as unknown as {
      super: { find: (c: unknown) => Promise<unknown> };
    };
    return await self.super.find(ctx);
  },

  async findOne(ctx: Record<string, unknown>) {
    const state = (ctx as { state: { user?: { id: number } } }).state;
    const query = ctx as { query: Record<string, unknown> };
    const user = state?.user;
    const ownArticles = query.query?.ownArticles;

    if (user && ownArticles === 'true') {
      const author = await strapi.documents('api::author.author').findFirst({
        filters: { user: { id: user.id } },
      });

      if (!author)
        return (ctx as { notFound: (m: string) => unknown }).notFound(
          'Author profile not found',
        );

      const currentFilters =
        (query.query.filters as Record<string, unknown>) || {};
      query.query.filters = {
        ...currentFilters,
        author: { documentId: author.documentId },
      };
    } else {
      // Public view: only published articles
      const currentFilters =
        (query.query.filters as Record<string, unknown>) || {};
      query.query.filters = {
        ...currentFilters,
        status: 'published',
      };
    }

    const self = this as unknown as {
      super: { findOne: (c: unknown) => Promise<unknown> };
    };
    return await self.super.findOne(ctx);
  },

  async update(ctx: Record<string, unknown>) {
    const state = (ctx as { state: { user?: { id: number } } }).state;
    const params = (ctx as { params: Record<string, string> }).params;
    const user = state?.user;

    if (!user)
      return (ctx as { unauthorized: (m: string) => unknown }).unauthorized(
        'You must be logged in',
      );

    const author = await strapi.documents('api::author.author').findFirst({
      filters: { user: { id: user.id } },
    });
    if (!author)
      return (ctx as { badRequest: (m: string) => unknown }).badRequest(
        'No author profile found',
      );

    const article = await strapi.documents('api::article.article').findOne({
      documentId: params.id,
      status: 'draft',
      filters: { author: { documentId: author.documentId } },
    });
    if (!article)
      return (ctx as { notFound: (m: string) => unknown }).notFound(
        'Article not found or you do not have permission',
      );

    const self = this as unknown as {
      super: { update: (c: unknown) => Promise<unknown> };
    };
    return await self.super.update(ctx);
  },

  async delete(ctx: Record<string, unknown>) {
    const state = (ctx as { state: { user?: { id: number } } }).state;
    const params = (ctx as { params: Record<string, string> }).params;
    const user = state?.user;

    if (!user)
      return (ctx as { unauthorized: (m: string) => unknown }).unauthorized(
        'You must be logged in',
      );

    const author = await strapi.documents('api::author.author').findFirst({
      filters: { user: { id: user.id } },
    });
    if (!author)
      return (ctx as { badRequest: (m: string) => unknown }).badRequest(
        'No author profile found',
      );

    const article = await strapi.documents('api::article.article').findOne({
      documentId: params.id,
      status: 'draft',
      filters: { author: { documentId: author.documentId } },
    });
    if (!article)
      return (ctx as { notFound: (m: string) => unknown }).notFound(
        'Article not found or you do not have permission',
      );

    const self = this as unknown as {
      super: { delete: (c: unknown) => Promise<unknown> };
    };
    return await self.super.delete(ctx);
  },
});

export default factories.createCoreController(
  'api::article.article',
  articleControllerFactory as unknown as Parameters<
    typeof factories.createCoreController
  >[1],
);
