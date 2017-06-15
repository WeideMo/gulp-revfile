/*----------Dependency prefix----------*/
var gulp = require('gulp');
var uglify = require('gulp-uglify');
var rev = require('gulp-revm');
var revCollector = require('gulp-revm-collector');
var cssmin = require('gulp-minify-css');

/*----------Constant definition----------*/
var PATH_SRC_HTML = 'srcPages/**/*.html';
var PATH_DES_HTML = 'destPages/';
var PATH_REV_JSON = 'rev/**/*.json';

/*----------images MD5 version process----------*/
gulp.task('imgCheck',function() {
    return gulp.src('assets_dev/images/**/*.jpg')    
    .pipe(rev()) 
    .pipe(gulp.dest('assets/images')) 
    .pipe(rev.manifest())
    .pipe(gulp.dest('rev/images'));
});

/*----------javascript MD5 version process----------*/
gulp.task('jsmin', function() {    
   return gulp.src('assets_dev/js/**/*.js')
    .pipe(uglify())
    .pipe(rev())
    .pipe(gulp.dest('assets/js')) 
    .pipe(rev.manifest())
    .pipe(gulp.dest('rev/js'));   
});


/*----------css files MD5 version process----------*/
gulp.task('cssmin',function() {
    return gulp.src('assets_dev/css/**/*.css')
    .pipe(cssmin())
    .pipe(rev())
    .pipe(gulp.dest('assets/css'))
    .pipe(rev.manifest())
    .pipe(gulp.dest('rev/css'));     
});

/*----------reversion Javascript deps on task[jsmin]----------*/
gulp.task('rev_js',['jsmin'],function(cb){
    gulp.src([ PATH_REV_JSON, PATH_SRC_HTML ])
    .pipe(revCollector({
        replaceReved:true
    }))
    .pipe(gulp.dest( PATH_DES_HTML ));
    cb();
});

/*----------reversion css deps on task[cssmin]----------*/
gulp.task('rev_css',['cssmin'],function(cb){
    gulp.src([ PATH_REV_JSON, PATH_SRC_HTML ])
    .pipe(revCollector({
        replaceReved:true
    }))
    .pipe(gulp.dest( PATH_DES_HTML ));
    cb();
});

/*----------reversion images deps on task[imgCheck]----------*/
gulp.task('rev_img',['imgCheck'],function(cb){
    gulp.src([ PATH_REV_JSON, PATH_SRC_HTML ])
    .pipe(revCollector({
        replaceReved:true
    }))
    .pipe(gulp.dest( PATH_DES_HTML ));
    cb();
});

/*----------reversion html pages----------*/
gulp.task('rev_html',function(cb){   
    gulp.src([ PATH_REV_JSON, PATH_SRC_HTML ])
    .pipe(revCollector({
        replaceReved:true
    }))
    .pipe(gulp.dest( PATH_DES_HTML ));
    cb();
});

/*----------files watch----------*/
gulp.task('watchChange',function() {
    console.log("watcher has started");
    gulp.watch('assets_dev/js/**/*.js', ['rev_js']);    
    gulp.watch('assets_dev/css/**/*.css', ['rev_css']);
    gulp.watch('assets_dev/images/**/*.jpg', ['rev_img']);
    gulp.watch('srcPages/**/*.html',['rev_html']);       
});



