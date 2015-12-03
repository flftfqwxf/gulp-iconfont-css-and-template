'use strict';
var path = require('path'),
    gutil = require('gulp-util'),
    consolidate = require('consolidate'),
    _ = require('lodash'),
    Stream = require('stream');
var PLUGIN_NAME = 'gulp-iconfont-css-and-template';
function iconfontCSSAndTemplate(config) {
    var glyphMap = [],
        currentGlyph,
        currentCodePoint,
        inputFilePrefix,
        stream,
        cssOutputFile,
        templateOutputFile,
        engine,
        cssPathList = ['_icons.css', '_icons.less', '_icons.scss', '_icons2.scss'],
        cssClass;
    // Set default values
    config = _.merge({
        cssPath: 'css',
        cssTemplatePath: '',
        cssTargetPath: '_icons.css',
        templatePath: 'demoTemplate.html',
        templateTargetPath: 'demoTemplate.html',
        fontPath: './',
        engine: 'lodash',
        firstGlyph: 0xE001,
        cssClass: 'icon',
        htmlTemplate:{
            templatePath: 'demoTemplate.html',
            templateTargetPath: 'demoTemplate.html',
            templateTitle:'ICONFONT'
        }
    }, config);
    // Enable default stylesheet generators
    config.templatePath = __dirname + '/templates/' + config.templatePath;
    if (!config.cssPath) {
        config.cssPath = '_icons';
    }
    if (/^(scss|less|css)$/i.test(config.cssPath)) {
        config.cssPath = __dirname + '/templates/_icons.' + config.cssPath;
    }
    if (config.cssTemplatePath) {
       var cssTemplatePath=path.normalize(config.cssTemplatePath);
        config.cssPath=config.cssTemplatePath;
    }
    // Validate config
    if (!config.fontName) {
        throw new gutil.PluginError(PLUGIN_NAME, 'Missing option "fontName"');
    }
    if (!consolidate[config.engine]) {
        throw new gutil.PluginError(PLUGIN_NAME, 'Consolidate missing template engine "' + config.engine + '"');
    }
    try {
        engine = require(config.engine);
    } catch (e) {
        throw new gutil.PluginError(PLUGIN_NAME, 'Template engine "' + config.engine + '" not present');
    }
    // Define starting point
    currentGlyph = config.firstGlyph;
    // Happy streaming
    stream = Stream.PassThrough({
        objectMode: true
    });
    stream._transform = function (file, unused, cb) {
        //var extname = path.extname(file.path);
        if (file.isNull()) {
            this.push(file);
            return cb();
        }
        // Create output file
        if (!cssOutputFile) {
            cssOutputFile = new gutil.File({
                base: file.base,
                cwd: file.cwd,
                path: path.join(file.base, config.cssTargetPath),
                contents: file.isBuffer() ? new Buffer(0) : new Stream.PassThrough()
            });
        }
        if (!templateOutputFile) {
            templateOutputFile = new gutil.File({
                base: file.base,
                cwd: file.cwd,
                path: path.join(file.base, config.templateTargetPath),
                contents: file.isBuffer() ? new Buffer(0) : new Stream.PassThrough()
            });
        }
        currentCodePoint = currentGlyph.toString(16).toUpperCase();
        // Add glyph
        glyphMap.push({
            fileName: path.basename(file.path, '.svg'),
            codePoint: currentCodePoint
        });
        // Prepend codePoint to input file path for gulp-iconfont
        inputFilePrefix = 'u' + currentCodePoint + '-';
        file.path = path.dirname(file.path) + '/' + inputFilePrefix + path.basename(file.path);
        // Increase counter
        currentGlyph++;
        this.push(file);
        cb();
    };
    stream._flush = function (cb) {
        if (glyphMap.length) {
            //写入CSS
            console.log(config.cssPath);
            _createCss(cb);
        } else {
            cb();
        }
    };
    //写入css
    function _createCss(cb) {
        var content;
        consolidate[config.engine](config.cssPath, {
                glyphs: glyphMap,
                fontName: config.fontName,
                fontPath: config.fontPath,
                cssClass: config.cssClass,
                cssPath: config.cssPath
            },
            function (err, html) {
                if (err) {
                    throw new gutil.PluginError(PLUGIN_NAME, 'Error in css template: ' + err.message);
                }
                content = Buffer(html);
                if (cssOutputFile.isBuffer()) {
                    cssOutputFile.contents = content;
                } else {
                    cssOutputFile.contents.write(content);
                    cssOutputFile.contents.end();
                }
                stream.push(cssOutputFile);
                _createHTMLDemo(cb);
            });
    }

    //写入模板
    function _createHTMLDemo(cb) {
        var content, extname = path.extname(config.cssTargetPath), cssTargetPath = config.cssTargetPath;
        if (extname === '.scss' || extname === '.less') {
            cssTargetPath = config.cssTargetPath.substr(0, config.cssTargetPath.lastIndexOf(extname)) + '.css';
        }
        consolidate[config.engine](config.templatePath, {
                glyphs: glyphMap,
                fontName: config.fontName,
                fontPath: config.fontPath,
                cssClass: config.cssClass,
                cssPath: config.cssPath,
                cssTargetPath: cssTargetPath,
                htmlTemplate:config.htmlTemplate
            },
            function (err, html) {
                if (err) {
                    throw new gutil.PluginError(PLUGIN_NAME, 'Error in html template: ' + err.message);
                }
                content = Buffer(html);
                if (templateOutputFile.isBuffer()) {
                    templateOutputFile.contents = content;
                } else {
                    templateOutputFile.contents.write(content);
                    templateOutputFile.contents.end();
                }
                stream.push(templateOutputFile);
                cb();
            });
    }

    return stream;
};
module.exports = iconfontCSSAndTemplate;
