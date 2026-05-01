import type { Core } from '@strapi/strapi';

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register() {},

  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    // 1. Seed permissions for both Public and Authenticated roles
    try {
      const publicRole = await strapi.db
        .query('plugin::users-permissions.role')
        .findOne({ where: { type: 'public' } });

      const authenticatedRole = await strapi.db
        .query('plugin::users-permissions.role')
        .findOne({ where: { type: 'authenticated' } });

      const permissionsToSeed: { action: string; role: number }[] = [];

      if (publicRole) {
        permissionsToSeed.push(
          { action: 'api::article.article.find', role: publicRole.id },
          { action: 'api::article.article.findOne', role: publicRole.id },
          { action: 'api::author.author.find', role: publicRole.id },
          { action: 'api::author.author.findOne', role: publicRole.id },
          { action: 'api::tag.tag.find', role: publicRole.id },
        );
      }

      if (authenticatedRole) {
        permissionsToSeed.push(
          { action: 'api::article.article.create', role: authenticatedRole.id },
          { action: 'api::article.article.update', role: authenticatedRole.id },
          { action: 'api::article.article.delete', role: authenticatedRole.id },
          { action: 'api::article.article.find', role: authenticatedRole.id },
          {
            action: 'api::article.article.findOne',
            role: authenticatedRole.id,
          },
          { action: 'api::author.author.find', role: authenticatedRole.id },
          { action: 'api::author.author.findOne', role: authenticatedRole.id },
          { action: 'api::author.author.create', role: authenticatedRole.id },
          { action: 'api::tag.tag.find', role: authenticatedRole.id },
        );
      }

      for (const perm of permissionsToSeed) {
        const exists = await strapi.db
          .query('plugin::users-permissions.permission')
          .findOne({ where: { action: perm.action, role: perm.role } });

        if (!exists) {
          await strapi.db
            .query('plugin::users-permissions.permission')
            .create({ data: perm });
        }
      }

      strapi.log.info('✅ MVP Permissions seeded (Public + Authenticated)');
    } catch (err) {
      strapi.log.error(
        'Failed to seed permissions: ' +
          (err instanceof Error ? err.message : 'Unknown error'),
      );
    }

    // 2. Lifecycle hook for automatic Author profile creation
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
          const errorMessage =
            error instanceof Error ? error.message : 'Unknown error';
          strapi.log.error(
            `Failed to create author for user ${result.id}: ${errorMessage}`,
          );
        }
      },
    });
  },
};
