const gulp = require('gulp');
const imagemin = require('gulp-imagemin');
const sass = require('gulp-sass');
const cleanCSS = require('gulp-clean-css');
const autoprefixer = require('gulp-autoprefixer');
const purgeCSS = require('gulp-purgecss');
const pug = require('gulp-pug');
const webp = require('gulp-webp');
const bs = require('browser-sync');
const uglify = require('gulp-uglify');
const babel = require('gulp-babel');

sass.compiler = require('node-sass');

gulp.task('layout', () => {
    let templatesIgnoreList = [
        'src/scripts.pug',
        'src/header.pug',
        'src/footer.pug',
        'src/menu.pug'
    ]
    return gulp.src('src/*.pug', {ignore: templatesIgnoreList})
        .pipe(pug())
        .pipe(gulp.dest('public/'))
});

gulp.task('sass', () => {
    return gulp.src('src/sass/**/styles.sass')
        .pipe(sass())
        .pipe(cleanCSS())
        .pipe(autoprefixer({
            compatibility: 'ie8'
        }))
        .pipe(gulp.dest('public/css'));
});

gulp.task('js', () => {
    return gulp.src('src/js/*.js')
    .pipe(babel({
        presets: ['@babel/env']
    }))
    .pipe(uglify())
    .pipe(gulp.dest('public/js'));
});

gulp.task('images', () => {
    return gulp.src('src/images/**/*')
        .pipe(imagemin([
            imagemin.mozjpeg({progressive: true}),
            imagemin.optipng({optimozationLevel: 5}),
            imagemin.svgo({})
        ]))
        .pipe(gulp.dest('public/images'))
});

gulp.task('webp', () => {
    return gulp.src(['src/images/**/*.jpg', 'src/images/**/*.png', 'src/images/**/*.jpeg'])
		.pipe(webp())
		.pipe(gulp.dest('public/images'))
});

gulp.task('sass-prod', () => {
	return gulp.src('src/sass/**/styles.sass')
		.pipe(sass())
		.pipe(purgeCSS({
			content: ['src/**/*.pug'],
			rejected: false
		}))
		.pipe(autoprefixer())
		.pipe(cleanCSS({
			compatibility: 'ie8'
		}))
		.pipe(gulp.dest('public/css'))
})

gulp.task('bs', () => {
    bs.init({
        server: {
            baseDir: './public'
        }
    })

    gulp.watch(["./public/**/*.html", "./public/css/**/*.css", "./public/js/**/*.js"]).on('change', bs.reload);
})

gulp.task('watch', () => {
    gulp.watch(['src/sass/**/*.sass', 'src/**/*.pug'], gulp.series(['sass', 'layout']));
    gulp.watch('src/images/**/*', gulp.series('images'));
    gulp.watch('src/js/**/*', gulp.series('js'));
})