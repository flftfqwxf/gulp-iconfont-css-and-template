# gulp-iconfont-css-and-template
第一个可用版本：

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

使和文档后续完善