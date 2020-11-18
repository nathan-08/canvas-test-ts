/* eslint-disable @typescript-eslint/no-var-requires */
const gulp = require( 'gulp' );
const browserify = require( 'browserify' );
const source = require( 'vinyl-source-stream' );
const watchify = require( 'watchify' );
const tsify = require( 'tsify' );
const uglify = require( 'gulp-uglify' );
const sourcemaps = require( 'gulp-sourcemaps' );
const buffer = require( 'vinyl-buffer' );
const fancy_log = require( 'fancy-log' );
const paths = {
  pages: ['src/*.html'],
  assets: ['src/assets/*']
};

const watchedBrowserify = watchify(
  browserify( {
    basedir: '.',
    debug: true,
    entries: ['src/main.ts'],
    cache: {},
    packageCache: {},
  } ).plugin( tsify ),
);

gulp.task( 'copy-html', () => {
  return gulp.src( paths.pages ).pipe( gulp.dest( 'dist' ) );
} );

gulp.task( 'copy-assets', () => {
  return gulp.src( paths.assets ).pipe( gulp.dest( 'dist/assets' ) );
} );

function bundle() {
  return watchedBrowserify
    .transform( 'babelify', {
      presets: ['@babel/env'],
      extensions: ['.ts']
     } )
    .bundle()
    .on( 'error', fancy_log )
    .pipe( source( 'bundle.js' ) )
    .pipe( buffer() )
    .pipe( sourcemaps.init( { loadMaps: true } ) )
    .pipe( uglify() )
    .pipe( sourcemaps.write( './' ) )
    .pipe( gulp.dest( 'dist' ) );
}

gulp.task( 'default', gulp.series( gulp.parallel( 'copy-html', 'copy-assets' ), bundle ) );
watchedBrowserify.on( 'update', bundle );
watchedBrowserify.on( 'log', fancy_log );
