const browserSync = require('browser-sync'),
    browserify = require('browserify'),
    watchify = require('watchify'),
    fs = require('fs');

/**
 * Watches src files changes
 */
const browserifyInst = browserify({
    entries: './ui/index.js',
    cache: {},
    packageCache: {},
    plugin: [watchify]
});

const bundle = () => {
    browserifyInst.bundle().pipe(fs.createWriteStream('./dist/bundle.js'));
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
        "./ui/**/*.css",
        "./ui/**/*.html"
    ],
    server: ['./ui', './dist']
});