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
        // Public view: only published articles and restricted author fields
        const currentFilters = (ctx.query.filters as Record<string, unknown>) || {};
        ctx.query.filters = {
          ...currentFilters,
          status: 'published',
        };

        // Enforce privacy: only name and bio for authors in public view
        const currentPopulate = (ctx.query.populate as any) || {};
        if (typeof currentPopulate === 'string' && currentPopulate === 'author') {
          ctx.query.populate = { author: { fields: ['name', 'bio'] } };
        } else if (typeof currentPopulate === 'object') {
          ctx.query.populate = {
            ...currentPopulate,
            author: { fields: ['name', 'bio'] },
          };
        }
      }

      const response = await super.find(ctx);
      return response;
    },

    async findOne(ctx) {
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
        // Public view: only published articles and restricted author fields
        const currentFilters = (ctx.query.filters as Record<string, unknown>) || {};
        ctx.query.filters = {
          ...currentFilters,
          status: 'published',
        };

        const currentPopulate = (ctx.query.populate as any) || {};
        if (typeof currentPopulate === 'string' && currentPopulate === 'author') {
          ctx.query.populate = { author: { fields: ['name', 'bio'] } };
        } else if (typeof currentPopulate === 'object') {
          ctx.query.populate = {
            ...currentPopulate,
            author: { fields: ['name', 'bio'] },
          };
        }
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

      // Check if the article exists and belongs to this author (search in all statuses)
      const article = await strapi.documents('api::article.article').findOne({
        documentId: id,
        status: 'draft', // Strapi 5: 'draft' finds the working version (latest)
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
        status: 'draft',
        filters: { author: { documentId: author.documentId } },
      });

      if (!article) {
        return ctx.notFound('Article not found or you do not have permission');
      }

      return await super.delete(ctx);
    },
  })
);
