# smart-table-filter

[![CircleCI](https://circleci.com/gh/smart-table/smart-table-filter.svg?style=svg)](https://circleci.com/gh/smart-table/smart-table-filter)

Takes a configuration object and returns a filter function operating on arrays. It will return a new array leaving the input array untouched. It work on nested property as well. For nodejs and browsers.

## Installation

### npm

``npm install --save smart-table-filter``

### yarn

``yarn add smart-table-filter``

## Usage

```Javascript
import filter from 'smart-table-filter';

const items = [{foo: 'bar', bar: {blah: 'woo'}},{foo: 'swe', bar: {blah: 'woo'}},{foo: 'sweet', bar: {blah: 'wat'}}];
const filterFunc = filter({foo: [{value: 'swe'}], 'bar.blah': [{operator: 'is', value: 'woo'}]});

const output = filterFunc(items)
// > [{foo: 'swe', bar: {blah: 'woo'}}]
```

### predicate object definition

Predicate object definition keys will be a path to a property in your data items (you can use .(dot) for nested properties.
Values will be arrays containing the following properties:

* type: the type to force coercion of your data item values (and the predicate value).
    * string
    * boolean
    * number
    * date

If not provided input value and data item value are return as they are

* operator: the operator used to perform the check
    * includes: check whether a string contains a substring (default)
    * is: strict equality ( === )
    * isNot: negation of "is" (!==)
    * lt: lower than (<)
    * gte: greater than or equal to (>=)
    * gt: greater than (>)
    * lte: lower than or equal to (<=)
    * equals: loose equality (==)
    * notEqualS: negation of "equals" (!=)
    * anyOf: check whether a values belongs to a given set of values
    
* value: the value to be checked against

## Contribute

### Test

``npm test``

or 

``yarn test``

### Issues

Only **bugs** and must come with a **running reproduction** of the issue

