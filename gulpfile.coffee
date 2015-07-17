###
#+--------------------------------------------------------------------+
#| gulpfile.coffee
#+--------------------------------------------------------------------+
#| Copyright DarkOverlordOfData (c) 2014-2015
#+--------------------------------------------------------------------+
#|
#| dart-like workflow
#|
#| dart-like is free software; you can copy, modify, and distribute
#| it under the terms of the MIT License
#|
#+--------------------------------------------------------------------+
#
# Tasks:
#
# build   - build lib sources to web/src/{{lib}}, copy to build\
# get     - gets package dependencies using bower
# publish - publish gh-pages
# serve   - open build\web\ in browser
# test    - open web\ in browser 
#
# manually copy required bits from packages/module to web/src/module
#
# project
# | -- bin                    tools
# | -- build                  output folder for zip
# | -- example                example using the lib
# | -- lib                    defines this package
# | -- node_modules           npm dependencies
# | -- packages               bower external packages
# | -- test                   unit tests
# | -- (tmp)                  temporary
# | -- web                    source
# |     | -- index.html
# |     | -- main.js          cocos2d boot
# |     | -- manifest.webapp  firefox config
# |     | -- project.json     cocos2d manifest
# |     | -- frameworks       cocos2d lib
# |     | -- res              resources
# |     + -- src              packages + lib
# |           | -- {lib}
# |           | -- example
# |
# | -- .bowerrc               define ./packages
# | -- .gitignore             build, node_modules, tmp, packages
# | -- bower.json             module name, packages
# | -- csconfig.json          coffee-script compiler config
# | -- gulpfile.coffee        this workflow
# | -- license.md
# | -- package.json           output package name
# + -- readme.md
#
# coffee -cb gulpfile.coffee > gulpfile.js
#
###

fs          = require('fs')
del         = require('del')
gulp        = require('gulp')
copy        = require('gulp-copy')
gutil       = require('gulp-util')
shell       = require('gulp-shell')
coffee      = require('gulp-coffee')
concat      = require('gulp-concat')
uglify      = require('gulp-uglify')
filter      = require('gulp-filter')
rename      = require('gulp-rename')
flatten     = require('gulp-flatten')
webserver   = require('gulp-webserver')
sourcemaps  = require('gulp-sourcemaps')
bowerDeps   = require('gulp-bower-deps')
csconfig    = require('./csconfig.json')
packageName = require('./package.json')
bower       = require('./bower.json')

projectName = packageName.name
authorName = packageName.author
libName = bower.name


csconfig.files = ["lib/**/*.coffee"] unless csconfig.files?

dependencies = do ->
  dependencies = 
    directory: 'packages'
    deps: {}
  for name, version of bower.dependencies  
    dependencies.deps[name] =
      version: version
      files: bower.packages[name]
  return dependencies
  
###
task: clean

  deletes all build files
  
###
gulp.task 'clean', (next) ->
  del ['build'], next
  return


###
task: res

  copy the res files
  
###
gulp.task 'res', ->
  gulp.src([
    'lib/res/**/*.*'
  ]).pipe copy('web', prefix: 1)
  return

###
task: coffee
  
  concat the coffee src files and compile to the web folder

###
gulp.task 'coffee', ->
  gulp.src(csconfig.files)
  .pipe(concat(csconfig.name))
  .pipe(coffee(csconfig.options).on('error', gutil.log))
  .pipe gulp.dest('./web/src/' + csconfig.name)
  return


###
task: build

  copy lib/res to web
  copies the web folder to the build folder
  skip cocos2d runtime and tools
  
### 
gulp.task 'build', [
   'clean'
   'coffee'
   'res'
 ], ->
   gulp.src([
     'web/frameworks/cocos2d-html5/**/*.*'
     'web/src/**/*.*'
     'web/res/**/*.*'
     'web/index.html'
     'web/main.js'
     'web/project.json'
     'web/manifest.webapp'
   ]).pipe copy('build')
   return

###
task: serve

  serve the build folder
  
###
gulp.task 'serve', ->
  gulp.src('./build/web')
  .pipe webserver(
    livereload: false
    open: true
  )
  return

###
task: test

  serve the web folder
  
###
gulp.task 'test', ->
  gulp.src('./web')
  .pipe webserver(
    livereload: true
    open: true
  )
  return

###
task: get

  get dependencies
  
###
gulp.task 'get', ->
  gulp.src(bowerDeps(dependencies).deps)
  .pipe(flatten())
  .pipe(rename( (path) ->
    path.dirname += '/'+ path.basename.split('.')[0]
    return
  ))
  .pipe(gulp.dest('web/src/'))

###
task: publish

  publish to github
  
###
gulp.task 'publish', shell.task([
  "./bin/publish.sh  #{authorName} #{projectName}"
])


###
task: android

  copy build to android project
  
###
gulp.task 'android', ->
  gulp.src([
    "web/src/**/*.*"
    "web/res/**/*.*"
    "web/main.js"
    "web/project.json"
    ])
    .pipe copy("web/frameworks/runtime-src/#{csconfig.name}/web/src/main/assets/", prefix: 1)
  
gulp.task 'default', ['test']