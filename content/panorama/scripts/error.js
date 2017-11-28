(function (){
  // https://github.com/v8/v8/wiki/Stack-Trace-API#customizing-stack-traces
  // https://stackoverflow.com/a/11386493
  Object.defineProperty($, '__stack', {
    get: function(){
      var orig = Error.prepareStackTrace;
      Error.prepareStackTrace = function(_, stack){ return stack; };
      var err = new Error;
      Error.captureStackTrace(err, arguments.callee);
      var stack = err.stack;
      Error.prepareStackTrace = orig;
      return stack;
    }
  });
  /*(function (){
    error("Test Error")
  }());*/
}());

function error(err) {
  function printstack(stack, msg) {
    var functionName = stack.getFunctionName()
    if (functionName === null) functionName = 'anonymous';
    msg += ' at ' + functionName;
    msg += ' (' + stack.getFileName() + ':'+ stack.getLineNumber() + ':' + stack.getColumnNumber() + ')';
    $.Msg(msg);
  }

  var stack = $.__stack
  printstack(stack[1], 'Error "'+ err + '"');
  $.Each(stack.slice(2, -1), function (x) {
    printstack(x, '\t');
  });
}
