const { series, src, dest, watch } = require('gulp'); //  require va a buscar gulp de node_modules. Series permite ejecutar distintas funciones en Serie. Src permite ubicar el css. dest guarda el compilado de css. Watch automatiza el proceso para no tener que estar compilando manualmente.
const sass = require('gulp-sass')(require('sass'));// No se coloca sass entre corchetes porque gulp-sass es una sola funcion y no multiples funciones como gulp 
const imagemin = require('gulp-imagemin');// Para minificar las imagenes 
const notify = require('gulp-notify'); // Notifica lo que esta ejecutando 
const concat = require('gulp-concat');

//Utilidades CSS
const autoprefixer = require('autoprefixer');
const postcss = require('gulp-postcss');
const cssnano =require('cssnano');
const sourcemaps = require('gulp-sourcemaps');

//Utilidades JS
const terser = require('gulp-terser-js');
const rename = require('gulp-rename');


// Función que compila SASS

const paths = {
    imagenes: 'src/img/**/*',
    scss: 'src/scss/**/*.scss',
    js: 'src/js/**/*.js'
}

function css() {
   return src(paths.scss)
    .pipe(sourcemaps.init())
    .pipe (sass()) 
    .pipe(postcss([autoprefixer(), cssnano () ])) 
    .pipe(sourcemaps.write('.'))   
    .pipe( dest ('./build/css') )
} 

function javascript(){
    return src(paths.js)
        .pipe(sourcemaps.init())
        .pipe( concat('bundle.js'))
        .pipe(terser())
        .pipe(sourcemaps.write('.'))
        .pipe(rename({suffix: '.min'}))
        .pipe(dest('./build/js'))
}


function imagenes(){
    return src(paths.imagenes)
    .pipe( imagemin())
    .pipe( dest('./build/img'))
    .pipe ( notify ({message: 'Imagen Minificada' }) );
}



function watchArchivos() {
    watch(paths.scss , css);/* "* Es para ver todos los archivos .scss" "** Todos los archivos dentro de las carpetas" */
    watch(paths.js, javascript);
    
}


exports.css = css;
exports.imagenes = imagenes;
exports.watchArchivos = watchArchivos;



exports.default = series (css,javascript, imagenes, watchArchivos);