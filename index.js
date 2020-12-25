import { resolve } from 'path';
import { existsSync } from 'fs';


import { i18n } from '@kbn/i18n';


export default function (kibana) {
  return new kibana.Plugin({
    name: 'quality_dashboard',
    uiExports: {
      app: {
        title: 'Report Dashboard',
        description: 'Report Dashboard plugin for Kibana',
        main: 'plugins/quality_dashboard/app',
      },
      styleSheetPaths: [resolve(__dirname, 'public/app.scss'), resolve(__dirname,
                        'public/app.css')].find(p => existsSync(p)),
    },

    config(Joi) {
      return Joi.object({
        enabled: Joi.boolean().default(true),
      }).default();
    },

    init(server, options) { // eslint-disable-line no-unused-vars
        const xpackMainPlugin = server.plugins.xpack_main;
        if (xpackMainPlugin) {
          const featureId = 'quality_dashboard';

          xpackMainPlugin.registerFeature({
            id: featureId,
            name: i18n.translate('qualityDashboardPlugin.featureRegistry.featureName', {
              defaultMessage: 'quality_dashboard',
            }),
            navLinkId: featureId,
            icon: 'questionInCircle',
            app: [featureId, 'kibana'],
            catalogue: [],
            privileges: {
              all: {
                api: [],
                savedObject: {
                  all: [],
                  read: [],
                },
                ui: ['show'],
              },
              read: {
                api: [],
                savedObject: {
                  all: [],
                  read: [],
                },
                ui: ['show'],
              },
            },
          });
        }

      // Add server routes and initialize the plugin here
      elsData(server);
    }
  });
}
