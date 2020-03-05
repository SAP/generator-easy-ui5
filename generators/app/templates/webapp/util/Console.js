/* eslint no-console: 0 */
var _console = Object.assign({}, console);

var _getCurrentDateString = function () {
	return (new Date()).toISOString() + " ::";
};

var _formatAsTable = function (args) {
	if (Array.isArray(args)) {
		console.table(args);
		return true;
	}
	return false;
};

/**
 * Console.log
 * @param  {any} msg Arg1
 * @param  {any} arg2 Arg2
 * @param  {any} arg3 Arg3
 * @param  {any} arg4 Arg4
 * @param  {any} arg5 Arg5
 * @param  {any} arg6 Arg6
 */
console.log = function (msg, arg2, arg3, arg4, arg5, arg6) {
	arg2 = arg2 === undefined ? "" : arg2;
	arg3 = arg3 === undefined ? "" : arg3;
	arg4 = arg4 === undefined ? "" : arg4;
	arg5 = arg5 === undefined ? "" : arg5;
	arg6 = arg6 === undefined ? "" : arg6;
	if (!_formatAsTable(msg)) {
		_console.log.apply(_console.log, [_getCurrentDateString()].concat(msg, arg2, arg3, arg4, arg5, arg6));
	}
};

/**
 * Console.warning
 * @param  {any} msg Arg1
 * @param  {any} arg2 Arg2
 * @param  {any} arg3 Arg3
 * @param  {any} arg4 Arg4
 * @param  {any} arg5 Arg5
 * @param  {any} arg6 Arg6
 */
console.warn = function (msg, arg2, arg3, arg4, arg5, arg6) {
	arg2 = arg2 === undefined ? "" : arg2;
	arg3 = arg3 === undefined ? "" : arg3;
	arg4 = arg4 === undefined ? "" : arg4;
	arg5 = arg5 === undefined ? "" : arg5;
	arg6 = arg6 === undefined ? "" : arg6;
	if (!_formatAsTable(msg)) {
		_console.warn.apply(_console.warn, [_getCurrentDateString()].concat(msg, arg2, arg3, arg4, arg5, arg6));
	}
};
console.warning = console.warn;

/**
 * Console.info
 * @param  {any} msg Arg1
 * @param  {any} arg2 Arg2
 * @param  {any} arg3 Arg3
 * @param  {any} arg4 Arg4
 * @param  {any} arg5 Arg5
 * @param  {any} arg6 Arg6
 */
console.info = function (msg, arg2, arg3, arg4, arg5, arg6) {
	arg2 = arg2 === undefined ? "" : arg2;
	arg3 = arg3 === undefined ? "" : arg3;
	arg4 = arg4 === undefined ? "" : arg4;
	arg5 = arg5 === undefined ? "" : arg5;
	arg6 = arg6 === undefined ? "" : arg6;
	if (!_formatAsTable(msg)) {
		_console.info.apply(_console.info, [_getCurrentDateString()].concat(msg, arg2, arg3, arg4, arg5, arg6));
	}
};

/**
 * Console.debug
 * @param  {any} msg Arg1
 * @param  {any} arg2 Arg2
 * @param  {any} arg3 Arg3
 * @param  {any} arg4 Arg4
 * @param  {any} arg5 Arg5
 * @param  {any} arg6 Arg6
 */
console.debug = function (msg, arg2, arg3, arg4, arg5, arg6) {
	arg2 = arg2 === undefined ? "" : arg2;
	arg3 = arg3 === undefined ? "" : arg3;
	arg4 = arg4 === undefined ? "" : arg4;
	arg5 = arg5 === undefined ? "" : arg5;
	arg6 = arg6 === undefined ? "" : arg6;
	if (!_formatAsTable(msg)) {
		_console.debug.apply(_console.debug, [_getCurrentDateString()].concat(msg, arg2, arg3, arg4, arg5, arg6));
	}
};

/**
 * Console.error
 * @param  {any} msg Arg1
 * @param  {any} arg2 Arg2
 * @param  {any} arg3 Arg3
 * @param  {any} arg4 Arg4
 * @param  {any} arg5 Arg5
 * @param  {any} arg6 Arg6
 */
console.error = function (msg, arg2, arg3, arg4, arg5, arg6) {
	arg2 = arg2 === undefined ? "" : arg2;
	arg3 = arg3 === undefined ? "" : arg3;
	arg4 = arg4 === undefined ? "" : arg4;
	arg5 = arg5 === undefined ? "" : arg5;
	arg6 = arg6 === undefined ? "" : arg6;
	if (!_formatAsTable(msg)) {
		_console.error.apply(_console.error, [_getCurrentDateString()].concat(msg, arg2, arg3, arg4, arg5, arg6));
	}
};