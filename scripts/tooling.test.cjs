const assert = require('node:assert/strict');
const { test } = require('node:test');
const { execFileSync } = require('node:child_process');
const config = require('../craco.config');

test('the test DOM uses the maintained Punycode package without Node deprecations', () => {
    const output = execFileSync(process.execPath, ['--throw-deprecation', '-e',
        'const { JSDOM } = require("jsdom"); process.stdout.write(new JSDOM("", { url: "https://mañana.com" }).window.location.hostname);',
    ], { encoding: 'utf8' });
    assert.equal(output, 'xn--maana-pta.com');
});

test('PDF map workaround leaves application and unrelated dependency maps enabled', () => {
    const rule = { loader: require.resolve('source-map-loader') };
    config.webpack.configure({ module: { rules: [false, rule] } });
    const filter = rule.options.filterSourceMappingUrl;
    assert.equal(filter('missing.ts.map', '/app/node_modules/@progress/kendo-react-pdf/dist/es/PDFExport.js'), false);
    assert.equal(filter('missing.ts.map', 'C:\\app\\node_modules\\@progress\\kendo-react-pdf\\dist\\es\\PDFExport.js'), false);
    assert.equal(filter('component.js.map', '/app/src/components/Popup.js'), true);
    assert.equal(filter('valid.js.map', '/app/node_modules/@progress/kendo-drawing/dist/es/main.js'), true);
});

test('hot reload watches app files without watching generated dependency and cache trees', () => {
    const webpack = config.webpack.configure({ module: { rules: [] } });
    assert.equal(webpack.watchOptions.poll, 1000);
    for (const directory of ['node_modules', '.cache', '.git', 'build']) {
        assert.equal(webpack.watchOptions.ignored.test(`/app/${directory}/generated.js`), true);
    }
    assert.equal(webpack.watchOptions.ignored.test('/app/src/components/Popup.js'), false);
});

test('development middleware preserves asset handling and service worker reset', () => {
    const paths = { proxySetup: '/nonexistent-billflow-proxy.js', publicUrlOrPath: '/' };
    const devConfig = config.devServer({ onBeforeSetupMiddleware() {}, onAfterSetupMiddleware() {}, https: false, static: { watch: {} } }, { paths });
    assert.equal('onBeforeSetupMiddleware' in devConfig, false);
    assert.equal('onAfterSetupMiddleware' in devConfig, false);
    assert.equal('https' in devConfig, false);
    const assets = { name: 'webpack-dev-middleware', middleware() {} };
    const middlewares = devConfig.setupMiddlewares([assets], { app: {} });
    assert.equal(middlewares[1], assets);
    let passedThrough = false;
    middlewares[0].middleware({ url: '/static/js/bundle.js' }, {}, () => { passedThrough = true; });
    assert.equal(passedThrough, true);
    let serviceWorker;
    middlewares.at(-1).middleware({ url: '/service-worker.js' }, {
        setHeader(name, value) { assert.equal(value, 'text/javascript'); },
        send(content) { serviceWorker = content; },
    }, () => assert.fail('Service worker reset must respond'));
    assert.match(serviceWorker, /self\.skipWaiting/);
    assert.throws(() => devConfig.setupMiddlewares([], null), /development server is unavailable/);
});

test('HTTPS certificates survive the migration to the server option', () => {
    const certificates = { key: 'test key', cert: 'test cert' };
    const devConfig = config.devServer({ https: certificates, static: { watch: {} } }, {
        paths: { proxySetup: '/nonexistent-billflow-proxy.js', publicUrlOrPath: '/' },
    });
    assert.deepEqual(devConfig.server, { type: 'https', options: certificates });
});
