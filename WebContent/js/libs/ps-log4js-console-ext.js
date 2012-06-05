define(["libs/log4javascript_uncompressed"], function() {	
	
/**
 * log4javascript console extension
 */
//	var l4js = 'log4javascript_uncompressed'; 
//    define([l4js], function (log4javascript_uncompressed) { 
	
	var log = log4javascript.getDefaultLogger();
	log.setLevel(log4javascript.Level.ALL);
	log4javascript.setShowStackTraces(true);
	
	var url;
	if(url != undefined){
		var ajaxAppender = new log4javascript.AjaxAppender();
		ajaxAppender.setThreshold(log4javascript.Level.ERROR);
		log.addAppender(ajaxAppender);
	}

	var log4javascriptEnabled = true;
	var consoleLoggingEnabled = true;
		
//		require('');
		
	var exLog = console.log;
	console.log = function(msg) {
		if (consoleLoggingEnabled)
			exLog.apply(this, arguments);
		if (log4javascriptEnabled)
			log.debug(msg);
	};
	var exTrace = console.trace;
	console.trace = function(msg) {
		if (consoleLoggingEnabled)
			exTrace.apply(this, arguments);
		if (log4javascriptEnabled){
			define(["stacktrace-0.3"], function(printStackTrace) {
				log.trace(printStackTrace().join('\n-> '));
			});
		}
	};
	var exDebug = console.debug;
	console.debug = function(msg) {
		if (consoleLoggingEnabled)
			exDebug.apply(this, arguments);
		if (log4javascriptEnabled)
			log.debug(Array.prototype.slice.call(arguments).join(""));
	};
	var exInfo = console.info;
	console.info = function(msg) {
		if (consoleLoggingEnabled)
			exInfo.apply(this, arguments);
		if (log4javascriptEnabled)
			log.info(Array.prototype.slice.call(arguments).join(""));
	};
	var exWarn = console.warn;
	console.warn = function(msg) {
		if (consoleLoggingEnabled)
			exWarn.apply(this, arguments);
		if (log4javascriptEnabled)
			log.warn(Array.prototype.slice.call(arguments).join(""));
	};
	var exError = console.error;
	console.error = function(msg) {
		if (consoleLoggingEnabled)
			exError.apply(this, arguments);
		if (log4javascriptEnabled)
			log.error(Array.prototype.slice.call(arguments).join(""));
	};
	//var exFatal = console.fatal;
	console.fatal = function(msg) {
		if (consoleLoggingEnabled){
			var args = Array.prototype.slice.call(arguments);
			args.unshift("FATAL:");
			exError.apply(this, args);
		}
		if (log4javascriptEnabled)
			log.fatal(Array.prototype.slice.call(arguments).join(""));
	};
	var exGroup = console.group;
	console.group = function(msg) {
		if (consoleLoggingEnabled)
			exGroup.apply(this, arguments);
		if (log4javascriptEnabled)
			log.group(Array.prototype.slice.call(arguments).join(""));
	};
	var exGroupEnd = console.groupEnd;
	console.groupEnd = function() {
		if (consoleLoggingEnabled)
			exGroupEnd.apply(this, arguments);
		if (log4javascriptEnabled)
			log.groupEnd();
	};
	if(console.assert){
		var exAssert = console.assert;
		console.assert = function(expression) {
			if (consoleLoggingEnabled)
				exAssert.apply(this, arguments);
			if (log4javascriptEnabled)
				log.assert(expression);
		};			
	}else{
		console.assert = function(expression) {
			if (log4javascriptEnabled)
				log.assert(expression);
		};	
	}		
});