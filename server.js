const browserSync = require('browser-sync'),
    browserify = require('browserify'),
    watchify = require('watchify'),
    fs = require('fs');

/**
 * Watches src files changes
 */
const browserifyInst = browserify({
    entries: './docs/index.js',
    cache: {},
    packageCache: {},
    plugin: [watchify]
});

const bundle = () => {
    browserifyInst.bundle().pipe(fs.createWriteStream('./docs/dist/bundle.js'));
};

browserifyInst.on('update', bundle);
bundle();

/**
 *  Syncs changes with browser
 */
browserSync({
    port: 3000,
    files: [
        "./dist/bundle.js",
        "./docs/**/*.css",
        "./docs/**/*.html"
    ],
    server: ['./docs']
});