const compose = (first, ...fns) => (...args) => fns.reduce((previous, current) => current(previous), first(...args));

const pointer = (path) => {
    const parts = path.split('.');
    const partial = (obj = {}, parts = []) => {
        const p = parts.shift();
        const current = obj[p];
        return (current === undefined || current === null || parts.length === 0) ?
            current : partial(current, parts);
    };
    const set = (target, newTree) => {
        let current = target;
        const [leaf, ...intermediate] = parts.reverse();
        for (const key of intermediate.reverse()) {
            if (current[key] === undefined) {
                current[key] = {};
                current = current[key];
            }
        }
        current[leaf] = Object.assign(current[leaf] || {}, newTree);
        return target;
    };
    return {
        get(target) {
            return partial(target, [...parts]);
        },
        set
    };
};

var Type;
(function (Type) {
    Type["BOOLEAN"] = "boolean";
    Type["NUMBER"] = "number";
    Type["DATE"] = "date";
    Type["STRING"] = "string";
})(Type || (Type = {}));
const typeExpression = (type) => {
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
var FilterOperator;
(function (FilterOperator) {
    FilterOperator["INCLUDES"] = "includes";
    FilterOperator["IS"] = "is";
    FilterOperator["IS_NOT"] = "isNot";
    FilterOperator["LOWER_THAN"] = "lt";
    FilterOperator["GREATER_THAN"] = "gt";
    FilterOperator["GREATER_THAN_OR_EQUAL"] = "gte";
    FilterOperator["LOWER_THAN_OR_EQUAL"] = "lte";
    FilterOperator["EQUALS"] = "equals";
    FilterOperator["NOT_EQUALS"] = "notEquals";
    FilterOperator["ANY_OF"] = "anyOf";
})(FilterOperator || (FilterOperator = {}));
const not = fn => input => !fn(input);
const is = value => input => Object.is(value, input);
const lt = value => input => input < value;
const gt = value => input => input > value;
const equals = value => input => value === input;
const includes = value => input => input.includes(value);
const anyOf = value => input => value.includes(input);
const operators = {
    ["includes" /* INCLUDES */]: includes,
    ["is" /* IS */]: is,
    ["isNot" /* IS_NOT */]: compose(is, not),
    ["lt" /* LOWER_THAN */]: lt,
    ["gte" /* GREATER_THAN_OR_EQUAL */]: compose(lt, not),
    ["gt" /* GREATER_THAN */]: gt,
    ["lte" /* LOWER_THAN_OR_EQUAL */]: compose(gt, not),
    ["equals" /* EQUALS */]: equals,
    ["notEquals" /* NOT_EQUALS */]: compose(equals, not),
    ["anyOf" /* ANY_OF */]: anyOf
};
const every = fns => (...args) => fns.every(fn => fn(...args));
const predicate = ({ value = '', operator = "includes" /* INCLUDES */, type }) => {
    const typeIt = typeExpression(type);
    const operateOnTyped = compose(typeIt, operators[operator]);
    const predicateFunc = operateOnTyped(value);
    return compose(typeIt, predicateFunc);
};
// Avoid useless filter lookup (improve perf)
const normalizeClauses = (conf) => {
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
const filter = (filter) => {
    const normalizedClauses = normalizeClauses(filter);
    const funcList = Object.keys(normalizedClauses).map(path => {
        const getter = pointer(path).get;
        const clauses = normalizedClauses[path].map(predicate);
        return compose(getter, every(clauses));
    });
    const filterPredicate = every(funcList);
    return array => array.filter(filterPredicate);
};

export { FilterOperator, predicate, filter };
//# sourceMappingURL=smart-table-filter.es.js.map
