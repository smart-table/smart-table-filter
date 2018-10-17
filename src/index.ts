import {compose} from 'smart-table-operators';
import {pointer} from 'smart-table-json-pointer';

enum Type {
    BOOLEAN = 'boolean',
    NUMBER = 'number',
    DATE = 'date',
    STRING = 'string'
}

type TypeOrAny = Type | any;

const typeExpression = (type: TypeOrAny): Function => {
    switch (type) {
        case Type.BOOLEAN:
            return Boolean;
        case Type.NUMBER:
            return Number;
        case Type.DATE:
            return val => new Date(val);
        case Type.STRING:
            return compose(String, val => val.toLowerCase());
        default:
            return val => val;
    }
};

export const enum FilterOperator {
    INCLUDES = 'includes',
    IS = 'is',
    IS_NOT = 'isNot',
    LOWER_THAN = 'lt',
    GREATER_THAN = 'gt',
    GREATER_THAN_OR_EQUAL = 'gte',
    LOWER_THAN_OR_EQUAL = 'lte',
    EQUALS = 'equals',
    NOT_EQUALS = 'notEquals',
    ANY_OF = 'anyOf'
}

const not = fn => input => !fn(input);
const is = value => input => Object.is(value, input);
const lt = value => input => input < value;
const gt = value => input => input > value;
const equals = value => input => value === input;
const includes = value => input => input.includes(value);
const anyOf = value => input => value.includes(input);

const operators = {
    [FilterOperator.INCLUDES]: includes,
    [FilterOperator.IS]: is,
    [FilterOperator.IS_NOT]: compose(is, not),
    [FilterOperator.LOWER_THAN]: lt,
    [FilterOperator.GREATER_THAN_OR_EQUAL]: compose(lt, not),
    [FilterOperator.GREATER_THAN]: gt,
    [FilterOperator.LOWER_THAN_OR_EQUAL]: compose(gt, not),
    [FilterOperator.EQUALS]: equals,
    [FilterOperator.NOT_EQUALS]: compose(equals, not),
    [FilterOperator.ANY_OF]: anyOf
};

const every = fns => (...args) => fns.every(fn => fn(...args));

export interface PredicateDefinition {
    type?: TypeOrAny
    operator?: FilterOperator,
    value?: any
}

export const predicate = ({value = '', operator = FilterOperator.INCLUDES, type}: PredicateDefinition) => {
    const typeIt = typeExpression(type);
    const operateOnTyped = compose(typeIt, operators[operator]);
    const predicateFunc = operateOnTyped(value);
    return compose(typeIt, predicateFunc);
};

export interface FilterConfiguration {
    [s: string]: PredicateDefinition[]
}

// Avoid useless filter lookup (improve perf)
const normalizeClauses = (conf: FilterConfiguration) => {
    const output = {};
    const validPath = Object.keys(conf).filter(path => Array.isArray(conf[path]));
    validPath.forEach(path => {
        const validClauses = conf[path].filter(c => c.value !== '');
        if (validClauses.length > 0) {
            output[path] = validClauses;
        }
    });
    return output;
};

export const filter = <T>(filter: FilterConfiguration): (array: T[]) => T[] => {
    const normalizedClauses = normalizeClauses(filter);
    const funcList = Object.keys(normalizedClauses).map(path => {
        const getter = pointer<T>(path).get;
        const clauses = normalizedClauses[path].map(predicate);
        return compose(getter, every(clauses));
    });
    const filterPredicate = every(funcList);

    return array => array.filter(filterPredicate);
};
