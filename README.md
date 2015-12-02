# gulp-iconfont-css-and-template
##基于gulp-iconfont和gulp-iconfont-css源码修改的组件，用于生成iconfont及字体图标及查看模板。解决生成的字体图标不方便查看的问题
第一个可用版本：

## Install

Install with [npm](https://npmjs.org/package/gulp-iconfont-css-and-template).

```
npm install --save-dev gulp-iconfont-css-and-template
```
## Examples

```js
var gulp = require('gulp');
var iconfont=require('gulp-iconfont');
var iconfontCssAndTemplate=require('gulp-iconfont-css-and-template');
gulp.task('iconFontCssAndTemplate', function(){
    gulp.src(['svg/**/*.svg'])
        .pipe(iconfontCssAndTemplate({
            fontName: fontName,
            cssClass:'gmIcon',
            cssTargetPath:'iconFont.css'
        }))
        .pipe(iconfont({
            fontName: fontName,
            formats: ['ttf', 'eot', 'woff','svg']
        }))
        .pipe(gulp.dest('dist'));

});
});
```


##使用文档后续完善