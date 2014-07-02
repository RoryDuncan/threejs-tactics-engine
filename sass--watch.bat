
@ECHO OFF
@ECHO +--------------------------------------------------------------------------+
@ECHO +
@ECHO + Watching *.sass files inside of 'public/sass' directory.
@ECHO + Output is 'public/css'
@ECHO +
@ECHO +--------------------------------------------------------------------------+

sass --watch public/sass:public/css