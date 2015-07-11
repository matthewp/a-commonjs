(function(){

var translateConfig = function(loader, packages){
	var g = loader.global;
	if(!g.process) {
		g.process = {
			cwd: function(){},
			env: {
				NODE_ENV: loader.env
			}
		};
	}

	if(!loader.npm) {
		loader.npm = {};
		loader.npmPaths = {};
		loader.globalBrowser = {};
	}
	loader.npmPaths.__default = packages[0];
	var lib = packages[0].system && packages[0].system.directories && packages[0].system.directories.lib;


	var setGlobalBrowser = function(globals, pkg){
		for(var name in globals) {
			loader.globalBrowser[name] = {
				pkg: pkg,
				moduleName: globals[name]
			};
		}
	};
	var setInNpm = function(name, pkg){
		if(!loader.npm[name]) {
			loader.npm[name] = pkg;
		}
		loader.npm[name+"@"+pkg.version] = pkg;
	};
	var forEach = function(arr, fn){
		var i = 0, len = arr.length;
		for(; i < len; i++) {
			fn.call(arr, arr[i]);
		}
	};
	forEach(packages, function(pkg){
		if(pkg.system) {
			// don't set system.main
			var main = pkg.system.main;
			delete pkg.system.main;
			loader.config(pkg.system);
			pkg.system.main = main;

		}
		if(pkg.globalBrowser) {
			setGlobalBrowser(pkg.globalBrowser, pkg);
		}
		var systemName = pkg.system && pkg.system.name;
		if(systemName) {
			setInNpm(systemName, pkg);
		} else {
			setInNpm(pkg.name, pkg);
		}
		if(!loader.npm[pkg.name]) {
			loader.npm[pkg.name] = pkg;
		}
		loader.npm[pkg.name+"@"+pkg.version] = pkg;
		var pkgAddress = pkg.fileUrl.replace(/\/package\.json.*/,"");
		loader.npmPaths[pkgAddress] = pkg;
	});
	forEach(loader._npmExtensions || [], function(ext){
		// If there is a systemConfig use that as configuration
		if(ext.systemConfig) {
			loader.config(ext.systemConfig);
		}
	});
};

window.translateConfig = translateConfig;
})();
