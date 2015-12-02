# gulp-iconfont-css-and-template

第一个可用版本：

## Install

Install with [npm](https://npmjs.org/package/gulp-iconfont-css-and-template).

```
npm install --save-dev gulp-iconfont-css-and-template
```
## Examples

```js
var gulp = require('gulp');
var iconfontCssAndTemplate=require('gulp-iconfont-css-and-template');
gulp.task('iconFontCssAndTemplate', function(){
    gulp.src([pkg.iconfont_dir])
        .pipe(iconfontCssAndTemplate({
            fontName: fontName,
            cssClass:'gmIcon',
            cssTargetPath:'iconFont.css'
        }))
        .pipe(iconfont({
            fontName: fontName,
            formats: ['ttf', 'eot', 'woff','svg']
        }))
        .pipe(gulp.dest(pkg.iconfont_dist_dir));

});
});
```


##使和文档后续完善