const fs = require('fs');
const evalSourceMapMiddleware = require('react-dev-utils/evalSourceMapMiddleware');
const redirectServedPath = require('react-dev-utils/redirectServedPathMiddleware');
const noopServiceWorkerMiddleware = require('react-dev-utils/noopServiceWorkerMiddleware');

module.exports = {
    webpack: {
        configure: config => {
            // Dependency and package-cache trees do not need hot reload watchers.
            // Excluding them prevents native watcher exhaustion after package installs.
            config.watchOptions = {
                ...config.watchOptions,
                ignored: /[\\/](?:node_modules|\.cache|\.git|build)(?:[\\/]|$)/,
                poll: 1000,
            };
            const sourceMapLoader = config.module.rules.find(rule =>
                rule && typeof rule.loader === 'string' && rule.loader.includes('source-map-loader')
            );
            if (sourceMapLoader) {
                sourceMapLoader.options = {
                    ...sourceMapLoader.options,
                    // Kendo PDF 4 publishes maps referencing TypeScript files it does not ship.
                    // Remove only those unusable references; retain maps for our app and other dependencies.
                    filterSourceMappingUrl: (url, resourcePath) =>
                        !/[\\/]node_modules[\\/]@progress[\\/]kendo-react-pdf[\\/]/.test(resourcePath),
                };
            }
            return config;
        },
    },
    devServer: (config, { paths }) => {
        // CRA 5 still uses deprecated before/after hooks. Preserve its middleware ordering
        // using webpack-dev-server's supported setupMiddlewares hook.
        delete config.onBeforeSetupMiddleware;
        delete config.onAfterSetupMiddleware;
        const https = config.https;
        delete config.https;
        if (https) config.server = { type: 'https', options: typeof https === 'object' ? https : {} };
        config.static.watch = { ...config.static.watch, usePolling: true, interval: 1000 };

        config.setupMiddlewares = (middlewares, devServer) => {
            if (!devServer) throw new Error('The development server is unavailable.');
            middlewares.unshift({ name: 'source-map-overlay', middleware: evalSourceMapMiddleware(devServer) });
            if (fs.existsSync(paths.proxySetup)) require(paths.proxySetup)(devServer.app);
            middlewares.push(
                { name: 'public-path-redirect', middleware: redirectServedPath(paths.publicUrlOrPath) },
                { name: 'service-worker-reset', middleware: noopServiceWorkerMiddleware(paths.publicUrlOrPath) },
            );
            return middlewares;
        };
        return config;
    },
};
