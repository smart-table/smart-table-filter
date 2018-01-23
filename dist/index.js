'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var smartTableOperators = require('smart-table-operators');
var pointer = _interopDefault(require('smart-table-json-pointer'));

function typeExpression(type) {
	switch (type) {
		case 'boolean':
			return Boolean;
		case 'number':
			return Number;
		case 'date':
			return val => new Date(val);
		default:
			return smartTableOperators.compose(String, val => val.toLowerCase());
	}
}

const not = fn => input => !fn(input);

const is = value => input => Object.is(value, input);
const lt = value => input => input < value;
const gt = value => input => input > value;
const equals = value => input => value === input;
const includes = value => input => input.includes(value);

const operators = {
	includes,
	is,
	isNot: smartTableOperators.compose(is, not),
	lt,
	gte: smartTableOperators.compose(lt, not),
	gt,
	lte: smartTableOperators.compose(gt, not),
	equals,
	notEquals: smartTableOperators.compose(equals, not)
};

const every = fns => (...args) => fns.every(fn => fn(...args));

function predicate({value = '', operator = 'includes', type = 'string'}) {
	const typeIt = typeExpression(type);
	const operateOnTyped = smartTableOperators.compose(typeIt, operators[operator]);
	const predicateFunc = operateOnTyped(value);
	return smartTableOperators.compose(typeIt, predicateFunc);
}

// Avoid useless filter lookup (improve perf)
function normalizeClauses(conf) {
	const output = {};
	const validPath = Object.keys(conf).filter(path => Array.isArray(conf[path]));
	validPath.forEach(path => {
		const validClauses = conf[path].filter(c => c.value !== '');
		if (validClauses.length > 0) {
			output[path] = validClauses;
		}
	});
	return output;
}

function filter(filter) {
	const normalizedClauses = normalizeClauses(filter);
	const funcList = Object.keys(normalizedClauses).map(path => {
		const getter = pointer(path).get;
		const clauses = normalizedClauses[path].map(predicate);
		return smartTableOperators.compose(getter, every(clauses));
	});
	const filterPredicate = every(funcList);

	return array => array.filter(filterPredicate);
}

exports.predicate = predicate;
exports['default'] = filter;
