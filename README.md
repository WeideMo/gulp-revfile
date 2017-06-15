# gulp-revfile

> A web pages Demo works for avoiding cache by appending file hash in file request string
> `index.css` → `index.css?v=ffcf8558f4`


## Install（安装）

>clone or download this repository：克隆或者下载gulp-revfile仓库
```
$ npm install -g gulp
```
```
$ npm install 
```

## API(调用方法)

> Fetch source file：获取源文件

```js
gulp.src('assets_dev/js/**/*.js')
```
> `rev()` Read file contents ready for generation：读取文件准备生成

```js
gulp.src('assets_dev/images/**/*.jpg')    
    .pipe(rev());
```

> `rev.manifest()` Generate file hash version：生成文件hash版本号

```js
gulp.src('assets_dev/images/**/*.jpg')    
    .pipe(rev())
	.pipe(rev.manifest());
```
> `revCollector()` Writes the static resource version number to the target HTML file：写入目标网页文件

```js
gulp.src([ PATH_REV_JSON, PATH_SRC_HTML ])
    .pipe(revCollector({
        replaceReved:true
    }));
```

## Usage

> Dependency prefix：依赖前置

```js
//gulpfile.js
var gulp = require('gulp');
var uglify = require('gulp-uglify');
var rev = require('gulp-revm');
var revCollector = require('gulp-revm-collector');
var cssmin = require('gulp-minify-css');
```

> Constant definition：定义常量路径

```js
//gulpfile.js
var PATH_SRC_HTML = 'srcPages/**/*.html';
var PATH_DES_HTML = 'destPages/';
var PATH_REV_JSON = 'rev/**/*.json';
```

> Files watch：文件监控触发任务

```js
//gulpfile.js
gulp.task('watchChange',function() {
    console.log("watcher has started");
    gulp.watch('assets_dev/js/**/*.js', ['rev_js']);
    gulp.watch('srcPages/**/*.html',['rev_html']);       
});
```

> Gulp task define：gulp处理任务定义

```js
//gulpfile.js
/*----------javascript MD5 version process----------*/
gulp.task('jsmin', function() {    
   return gulp.src('assets_dev/js/**/*.js')
    .pipe(uglify())
    .pipe(rev())
    .pipe(gulp.dest('assets/js')) 
    .pipe(rev.manifest())
    .pipe(gulp.dest('rev/js'));   
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

/*----------reversion html pages----------*/
gulp.task('rev_html',function(cb){   
    gulp.src([ PATH_REV_JSON, PATH_SRC_HTML ])
    .pipe(revCollector({
        replaceReved:true
    }))
    .pipe(gulp.dest( PATH_DES_HTML ));
    cb();
});
```

> Start gulp task(default:watchChange)：启动默认监听任务:watchChange

```
$ gulp  watchChange
```
>Edit any file that under watch: `javascript`,`css sheet` even and `images`:编辑任何监控任务下的文件

The corresponding file automatically generates the version number based on the hash value of the file, which is generated in the `rev` directory.

对应的文件会根据文件的哈希值自动生成版本号生成在rev目录下。

At the same time, gulp will according to rev under the hash version number, and read the srcPages file under the HTML page, and the version number is added to the destPages file.

同时，gulp会根据rev下的hash版本号并读取srcPages文件下的html页面并将版本号加入到destPages文件下。

## Effect（效果）

> Source page 
```html
<!--srcPages/html-->
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>gulp-revDemo</title>
    <link rel="stylesheet" href="../assets/css/index.css">
</head>
<body>
    <div class="title">Easily make static files hash versions with [gulp-revm & gulp-revm-collector]:</div>
    <div class="subTitle">Also works for javascript,css,images and so on...</div>
    <images class="img"  src="../assets/images/demo.jpg"></images>
</body>
<script src="../assets/images/js/jquery-1.10.2.min.js"></script>
<script src="../assets/images/js/testJs_1.js"></script>
<script src="../assets/images/js/testJs_2.js"></script>
</html>
```
> Dest page 
```html
<!--srcPages/html-->
<!DOCTYPE html>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>gulp-revDemo</title>
    <link rel="stylesheet" href="../assets/css/index.css?v=ffcf8558f4">
</head>
<body>
    <div class="title">Easily make static files hash versions with [gulp-revm & gulp-revm-collector]:</div>
    <div class="subTitle">Also works for javascript,css,images and so on...</div>
    <images class="img"  src="../assets/images/demo.jpg?v=31b2c3b2c1"></images>
</body>
<script src="../assets/images/js/jquery-1.10.2.min.js?v=25db94fef9"></script>
<script src="../assets/images/js/testJs_1.js?v=d4c14c7af6"></script>
<script src="../assets/images/js/testJs_2.js?v=2ae0f37aea"></script>
</html>
```

## More Tips（更多）

> Relatived gulp plugin：相关插件
- [gulp-revm](https://github.com/WeideMo/gulp-revm) - Static asset revisioning by appending content hash to filenames: index.css => index.css?d41d8cd98f.
- [gulp-revm-collector](https://github.com/WeideMo/gulp-revm-collector) - Static asset revision data collector from manifests, generated from different streams, and replace their links in html template.
- [gulp-css-spriterm](https://github.com/WeideMo/gulp-css-spriterm) - Gulp-css-spriterm is based on the revised version of gulp-css-spriter, mainly to do clear cache processing for naming Sprite map.

> Works for multi types source file:支持多种源文件类型

By looking at demo, you can see that you can get hash values for different files by listening to different types of files, including JS scripts, CSS styles and picture files, and so on, as well as other files.

通过查看demo可以知道，通过监听不同类型的文件可以获取不同文件的hash值，包括了js脚本，css样式和图片文件等，其他文件同理可以

> Works for multi types target page-file:支持多种源文件类型

Gulp-revfile can write hash versions to different types of web pages, such as HTML, shtml, PHP, JSP, and so on

gulp-revfile可以将hash版本写入不同类型的网页文件，如html,shtml，php，jsp等

>Automatic generation: 编辑自动生成

After startup watch Task, the file version number will be automatically completed when the file is modified.

启动监控后，文件版本号会在修改文件的时候自动完成
