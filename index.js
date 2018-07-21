import {compose} from 'smart-table-operators';
import pointer from 'smart-table-json-pointer';

function typeExpression(type) {
	switch (type) {
		case 'boolean':
			return Boolean;
		case 'number':
			return Number;
		case 'date':
			return val => new Date(val);
		case 'string':
			return compose(String, val => val.toLowerCase());
		default:
			return val => val;
	}
}

const not = fn => input => !fn(input);

const is = value => input => Object.is(value, input);
const lt = value => input => input < value;
const gt = value => input => input > value;
const equals = value => input => value === input;
const includes = value => input => input.includes(value);
const anyOf = value => input => value.includes(input);

const operators = {
	includes,
	is,
	isNot: compose(is, not),
	lt,
	gte: compose(lt, not),
	gt,
	lte: compose(gt, not),
	equals,
	notEquals: compose(equals, not),
	anyOf
};

const every = fns => (...args) => fns.every(fn => fn(...args));

export function predicate({value = '', operator = 'includes', type = 'string'}) {
	const typeIt = typeExpression(type);
	const operateOnTyped = compose(typeIt, operators[operator]);
	const predicateFunc = operateOnTyped(value);
	return compose(typeIt, predicateFunc);
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

export default function filter(filter) {
	const normalizedClauses = normalizeClauses(filter);
	const funcList = Object.keys(normalizedClauses).map(path => {
		const getter = pointer(path).get;
		const clauses = normalizedClauses[path].map(predicate);
		return compose(getter, every(clauses));
	});
	const filterPredicate = every(funcList);

	return array => array.filter(filterPredicate);
}
