import { factories, Core } from '@strapi/strapi';

/**
 * Minimum required interface for Strapi Context to avoid using 'any'
 * and bypass missing exports in Strapi 5 types.
 */
interface StrapiContext {
  state: {
    user?: {
      id: number;
    };
  };
  query: Record<string, unknown>;
  params: Record<string, string>;
  request: {
    body: {
      data: unknown;
    };
  };
  unauthorized: (msg: string) => unknown;
  badRequest: (msg: string) => unknown;
  notFound: (msg: string) => unknown;
}

/**
 * Interface for Article Controller to allow typed access to super methods
 */
interface ArticleController {
  super: {
    create: (ctx: StrapiContext) => Promise<unknown>;
    find: (ctx: StrapiContext) => Promise<unknown>;
    findOne: (ctx: StrapiContext) => Promise<unknown>;
    update: (ctx: StrapiContext) => Promise<unknown>;
    delete: (ctx: StrapiContext) => Promise<unknown>;
  };
}

/**
 * Controller logic exported for unit testing
 */
export const articleControllerFactory = ({ strapi }: { strapi: Core.Strapi }) => ({
  async create(this: ArticleController, ctx: StrapiContext) {
    const user = ctx.state.user;

    if (!user) {
      return ctx.unauthorized('You must be logged in to create an article');
    }

    const author = await strapi.documents('api::author.author').findFirst({
      filters: { user: { id: user.id } },
    });

    if (!author) {
      return ctx.badRequest('No author profile found for this user');
    }

    const bodyData = (ctx.request.body.data as Record<string, unknown>) || {};
    ctx.request.body.data = {
      ...bodyData,
      author: author.documentId,
    };

    return await this.super.create(ctx);
  },

  async find(this: ArticleController, ctx: StrapiContext) {
    const user = ctx.state.user;
    const { ownArticles } = ctx.query;

    const isOwnerRequest = user && ownArticles === 'true';

    if (isOwnerRequest) {
      const author = await strapi.documents('api::author.author').findFirst({
        filters: { user: { id: user.id } },
      });

      if (author) {
        const currentFilters = (ctx.query.filters as Record<string, unknown>) || {};
        ctx.query.filters = {
          ...currentFilters,
          author: { documentId: author.documentId },
        };
      }
    } else {
      const currentFilters = (ctx.query.filters as Record<string, unknown>) || {};
      ctx.query.filters = {
        ...currentFilters,
        status: 'published',
      };

      const currentPopulate = ctx.query.populate as unknown;
      if (typeof currentPopulate === 'string' && currentPopulate === 'author') {
        ctx.query.populate = { author: { fields: ['name', 'bio'] } };
      } else if (typeof currentPopulate === 'object' && currentPopulate !== null) {
        ctx.query.populate = {
          ...(currentPopulate as Record<string, unknown>),
          author: { fields: ['name', 'bio'] },
        };
      }
    }

    return await this.super.find(ctx);
  },

  async findOne(this: ArticleController, ctx: StrapiContext) {
    const user = ctx.state.user;
    const { ownArticles } = ctx.query;

    const isOwnerRequest = user && ownArticles === 'true';

    if (isOwnerRequest) {
      const author = await strapi.documents('api::author.author').findFirst({
        filters: { user: { id: user.id } },
      });

      if (author) {
        const currentFilters = (ctx.query.filters as Record<string, unknown>) || {};
        ctx.query.filters = {
          ...currentFilters,
          author: { documentId: author.documentId },
        };
      }
    } else {
      const currentFilters = (ctx.query.filters as Record<string, unknown>) || {};
      ctx.query.filters = {
        ...currentFilters,
        status: 'published',
      };

      const currentPopulate = ctx.query.populate as unknown;
      if (typeof currentPopulate === 'string' && currentPopulate === 'author') {
        ctx.query.populate = { author: { fields: ['name', 'bio'] } };
      } else if (typeof currentPopulate === 'object' && currentPopulate !== null) {
        ctx.query.populate = {
          ...(currentPopulate as Record<string, unknown>),
          author: { fields: ['name', 'bio'] },
        };
      }
    }

    return await this.super.findOne(ctx);
  },

  async update(this: ArticleController, ctx: StrapiContext) {
    const user = ctx.state.user;
    const { id } = ctx.params;

    if (!user) {
      return ctx.unauthorized('You must be logged in to update an article');
    }

    const author = await strapi.documents('api::author.author').findFirst({
      filters: { user: { id: user.id } },
    });

    if (!author) {
      return ctx.badRequest('No author profile found');
    }

    const article = await strapi.documents('api::article.article').findOne({
      documentId: id,
      status: 'draft',
      filters: { author: { documentId: author.documentId } },
    });

    if (!article) {
      return ctx.notFound('Article not found or you do not have permission');
    }

    return await this.super.update(ctx);
  },

  async delete(this: ArticleController, ctx: StrapiContext) {
    const user = ctx.state.user;
    const { id } = ctx.params;

    if (!user) {
      return ctx.unauthorized('You must be logged in to delete an article');
    }

    const author = await strapi.documents('api::author.author').findFirst({
      filters: { user: { id: user.id } },
    });

    if (!author) {
      return ctx.badRequest('No author profile found');
    }

    const article = await strapi.documents('api::article.article').findOne({
      documentId: id,
      status: 'draft',
      filters: { author: { documentId: author.documentId } },
    });

    if (!article) {
      return ctx.notFound('Article not found or you do not have permission');
    }

    return await this.super.delete(ctx);
  },
});

export default factories.createCoreController(
  'api::article.article',
  articleControllerFactory as unknown as Parameters<typeof factories.createCoreController>[1]
);
