import { factories } from '@strapi/strapi';

export default factories.createCoreController(
  'api::article.article',
  ({ strapi }) => ({
    async create(ctx) {
      const user = ctx.state.user;

      if (!user) {
        return ctx.unauthorized('You must be logged in to create an article');
      }

      // Find the author record associated with this user
      const author = await strapi.documents('api::author.author').findFirst({
        filters: { user: { id: user.id } },
      });

      if (!author) {
        return ctx.badRequest('No author profile found for this user');
      }

      // Automatically assign the author
      ctx.request.body.data = {
        ...ctx.request.body.data,
        author: author.documentId,
      };

      const response = await super.create(ctx);
      return response;
    },

    async find(ctx) {
      const user = ctx.state.user;
      const { ownArticles } = ctx.query;

      // Ownership filtering: only if explicitly requested (e.g. for dashboard)
      if (user && ownArticles === 'true') {
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
      } else if (!user || ownArticles !== 'true') {
        // Public view (or logged in user browsing home): only published articles
        // Unless it's an authenticated request wanting more, but usually home is published only.
        const currentFilters = (ctx.query.filters as Record<string, unknown>) || {};
        ctx.query.filters = {
          ...currentFilters,
          status: 'published',
        };
      }

      const response = await super.find(ctx);
      return response;
    },

    async findOne(ctx) {
      const user = ctx.state.user;
      const { ownArticles } = ctx.query;

      if (user && ownArticles === 'true') {
        // Ensure the article belongs to the user's author profile
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
        // Public view: only published articles
        const currentFilters = (ctx.query.filters as Record<string, unknown>) || {};
        ctx.query.filters = {
          ...currentFilters,
          status: 'published',
        };
      }

      return await super.findOne(ctx);
    },

    async update(ctx) {
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

      // Check if the article exists and belongs to this author
      const article = await strapi.documents('api::article.article').findOne({
        documentId: id,
        filters: { author: { documentId: author.documentId } },
      });

      if (!article) {
        return ctx.notFound('Article not found or you do not have permission');
      }

      return await super.update(ctx);
    },

    async delete(ctx) {
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
        filters: { author: { documentId: author.documentId } },
      });

      if (!article) {
        return ctx.notFound('Article not found or you do not have permission');
      }

      return await super.delete(ctx);
    },
  })
);
