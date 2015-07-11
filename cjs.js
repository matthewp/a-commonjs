/**
 * CommonJS overrides for Loader
 */

(function(){

  window.CommonJSLoader = CommonJSLoader;

  function CommonJSLoader(){
    Loader.apply(this, arguments);
  }

  CommonJSLoader.prototype = Object.create(Loader.prototype);
  CommonJSLoader.prototype.constructor = CommonJSLoader;

  var depTree = {};

  var proto = CommonJSLoader.prototype;

  proto.global = window;

  proto.translate = function(id, address, source) {
    return "(function(require, exports, module, __filename, __dirname, global) {\n"
      + source + "\n}).apply(__cjsWrapper.exports, __cjsWrapper.args);";
  };

  var cjsRequireRegEx = /(?:^\uFEFF?|[^$_a-zA-Z\xA0-\uFFFF."'])require\s*\(\s*("[^"\\]*(?:\\.[^"\\]*)*"|'[^'\\]*(?:\\.[^'\\]*)*')\s*\)/g;

  function getDeps(source) {
    cjsRequireRegEx.lastIndex = 0;
    var deps = [], match;
    while(match = cjsRequireRegEx.exec(source))
      deps.push(match[1].substr(1, match[1].length - 2));
    return deps;
  }

  proto.parse = function(id, address, source){
    // Parse for dependencies
    var deps = getDeps(source);

    var factory = function(){
      __cjsEval(source);
      return __cjsWrapper.args[2].exports;
    };

    this.addToRegistry(id, deps, factory);
  };

  // Deps
  proto.depend = function(id, deps){
    if(id) {
      depTree[id] = deps;
    }
    return Loader.prototype.depend.call(this, id, deps);
  };

  proto.instantiate = function(id, deps, factory){
    // Create a map with the normalized names
    var unnormalizedDeps = depTree[id] || [];
    var depMap = {};
    for(var i = 0, len = unnormalizedDeps.length; i < len; i++) {
      depMap[unnormalizedDeps[i]] = deps[i];
    }
    delete depTree[id];

    var m = {
      exports: {}
    };

    var loader = this;
    var require = function(unnormalizedId){
      var normalizedId = depMap[unnormalizedId];
      return loader.getModule(normalizedId);
    };

    __cjsWrapper = {
      exports: m.exports,
      args: [require, m.exports, m]
    };

    var ret = Loader.prototype.instantiate.call(this, id, deps, factory);

    __cjsWrapper = null;

    return ret;
  };


})();

var __cjsEval = function(source){
  eval(source);
};
