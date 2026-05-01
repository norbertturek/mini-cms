import type { Core } from '@strapi/strapi';

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register() {},

  bootstrap({ strapi }: { strapi: Core.Strapi }) {
    strapi.db.lifecycles.subscribe({
      models: ['plugin::users-permissions.user'],
      async afterCreate(event) {
        const { result } = event;

        try {
          await strapi.documents('api::author.author').create({
            data: {
              name: result.username,
              email: result.email,
              user: result.id,
            },
          });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          strapi.log.error(
            `Failed to create author for user ${result.id}: ${errorMessage}`,
          );
        }
      },
    });
  },
};
