import { factories } from '@strapi/strapi';

/**
 * Controller logic exported for unit testing
 */
export const articleControllerFactory = ({ strapi }: { strapi: any }) => ({
  async create(ctx: any) {
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

    ctx.request.body.data = {
      ...ctx.request.body.data,
      author: author.documentId,
    };

    return await (this as any).super.create(ctx);
  },

  async find(ctx: any) {
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

      const currentPopulate = (ctx.query.populate as any) || {};
      if (typeof currentPopulate === 'string' && currentPopulate === 'author') {
        ctx.query.populate = { author: { fields: ['name', 'bio'] } };
      } else if (typeof currentPopulate === 'object' && currentPopulate !== null) {
        ctx.query.populate = {
          ...currentPopulate,
          author: { fields: ['name', 'bio'] },
        };
      }
    }

    return await (this as any).super.find(ctx);
  },

  async findOne(ctx: any) {
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

      const currentPopulate = (ctx.query.populate as any) || {};
      if (typeof currentPopulate === 'string' && currentPopulate === 'author') {
        ctx.query.populate = { author: { fields: ['name', 'bio'] } };
      } else if (typeof currentPopulate === 'object' && currentPopulate !== null) {
        ctx.query.populate = {
          ...currentPopulate,
          author: { fields: ['name', 'bio'] },
        };
      }
    }

    return await (this as any).super.findOne(ctx);
  },

  async update(ctx: any) {
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

    return await (this as any).super.update(ctx);
  },

  async delete(ctx: any) {
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

    return await (this as any).super.delete(ctx);
  },
});

export default factories.createCoreController(
  'api::article.article',
  articleControllerFactory
);
