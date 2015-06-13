/**
 * A very basic loader
 */

(function(){

  window.Loader = Loader;

  function Loader(){
    Lifecycle.apply(this, arguments);

    this.baseUrl = location+"";
  }

  Loader.prototype = Object.create(Lifecycle.prototype);
  Loader.prototype.constructor = Loader;

  Loader.prototype["import"] = function(unNormalizedId){
    return this.useUnnormalized(unNormalizedId);
  };

  Loader.prototype.locate = function(id){
      return this.baseUrl + '/' + id + '.js';
  };

  Loader.prototype.fetch = function(id, refId, location) {
    // async
    return new Promise(function(resolve, reject) {
      var xhr = new XMLHttpRequest();

      xhr.open("GET", location);

      xhr.onload = function(){
        resolve(xhr.responseText);
      };

      xhr.onerror = function(e){
        reject(e);
      };

      xhr.send();
    });
  };


})();
