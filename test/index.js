import zora from 'zora';
import {predicate, default as filter} from '../index';

export default zora()
  .test('predicate: use includes and string as default parameters', function * (t) {
    const includesFoo = predicate({value: 'foo'});
    t.ok(includesFoo('afoobar'));
    t.notOk(includesFoo('blah'));
  })
  .test('predicate use is operator on strings', function * (t) {
    const strictEqualsFoo = predicate({value: 'foo', operator: 'is'});
    t.notOk(strictEqualsFoo('afoobar'));
    t.ok(strictEqualsFoo('foo'));
  })
  .test('predicate infer number type', function * (t) {
    const greaterThanthree = predicate({value: '3', type: 'number', operator: 'gt'});
    t.ok(greaterThanthree('14'));
    t.ok(greaterThanthree(6));
    t.notOk(greaterThanthree('2'));
    t.notOk(greaterThanthree(1));
  })
  .test('predicate infer date type', function * (t) {
    const bornBeforeLaurent = predicate({value: '1987/05/21', type: 'date', operator: 'lt'});
    t.ok(bornBeforeLaurent(new Date(1986, 4, 3)));
    t.ok(bornBeforeLaurent('1982/04/11'));
    t.notOk(bornBeforeLaurent(new Date(1988, 4, 2)));
    t.notOk(bornBeforeLaurent('1990/23/10'));
  })
  .test('operator on string: includes', function * (t) {
    const includeFoo = predicate({value: 'foo', operator: 'includes'});
    t.ok(includeFoo('foo'));
    t.ok(includeFoo('adsffoob'));
  })
  .test('operator on string: is', function * (t) {
    const isFoo = predicate({value: 'foo', operator: 'is'});
    t.ok(isFoo('foo'));
    t.notOk(isFoo('adsffoob'));
  })
  .test('operator on string: isNot', function * (t) {
    const isNotFoo = predicate({value: 'foo', operator: 'isNot'});
    t.notOk(isNotFoo('foo'));
    t.ok(isNotFoo('adsffoob'));
  })
  .test('operator on string: lt', function * (t) {
    const ltFoo = predicate({value: 'foo', operator: 'lt'});
    t.ok(ltFoo('abc'));
    t.notOk(ltFoo('foo'));
  })
  .test('operator on string: lte', function * (t) {
    const lteFoo = predicate({value: 'foo', operator: 'lte'});
    t.ok(lteFoo('abc'));
    t.ok(lteFoo('foo'));
    t.notOk(lteFoo('foob'));
  })
  .test('operator on string: gt', function * (t) {
    const gtFoo = predicate({value: 'foo', operator: 'gt'});
    t.ok(gtFoo('fooa'));
    t.notOk(gtFoo('foo'));
  })
  .test('operator on string: gte', function * (t) {
    const gteFoo = predicate({value: 'foo', operator: 'gte'});
    t.ok(gteFoo('fooa'));
    t.ok(gteFoo('foo'));
    t.notOk(gteFoo('fo'));
  })
  .test('operator on string: equals', function * (t) {
    const equalsFoo = predicate({value: 'foo', operator: 'equals'});
    t.ok(equalsFoo('foo'));
    t.notOk(equalsFoo('adsffoob'));
  })
  .test('operator on string: notEquals', function * (t) {
    const notEquals = predicate({value: 'foo', operator: 'notEquals'});
    t.notOk(notEquals('foo'));
    t.ok(notEquals('adsffoob'));
  })
  .test('operator on number: is', function * (t) {
    const is42 = predicate({value: '42', type: 'number', operator: 'is'});
    t.ok(is42('42'));
    t.ok(is42(42));
    t.notOk(is42(41));
    t.notOk(is42('41'));
  })
  .test('operator on number: isNot', function * (t) {
    const isNot42 = predicate({value: '42', type: 'number', operator: 'isNot'});
    t.notOk(isNot42('42'));
    t.ok(isNot42('43'));
  })
  .test('operator on number: lt', function * (t) {
    const lt42 = predicate({value: '42', type: 'number', operator: 'lt'});
    t.ok(lt42(23));
    t.notOk(lt42('42'));
  })
  .test('operator on number: lte', function * (t) {
    const lte42 = predicate({value: '42', type: 'number', operator: 'lte'});
    t.ok(lte42('42'));
    t.ok(lte42(4));
    t.notOk(lte42(43));
  })
  .test('operator on number: gt', function * (t) {
    const gt42 = predicate({value: '42', type: 'number', operator: 'gt'});
    t.ok(gt42(43));
    t.ok(gt42('49'));
    t.notOk(gt42('42'));
  })
  .test('operator on number: gte', function * (t) {
    const gte42 = predicate({value: 42, operator: 'gte'});
    t.ok(gte42('42'));
    t.ok(gte42(432));
    t.notOk(gte42('41.9'));
  })
  .test('operator on number: equals', function * (t) {
    const equals42 = predicate({value: '42', type: 'number', operator: 'equals'});
    t.ok(equals42('42.0'));
    t.ok(equals42(42));
    t.notOk(equals42('42.1'));
  })
  .test('operator on number: notEquals', function * (t) {
    const notEquals42 = predicate({value: '42', type: 'number', operator: 'notEquals'});
    t.notOk(notEquals42('42.0'));
    t.notOk(notEquals42(42.0));
    t.ok(notEquals42('adsffoob'));
  })
  .test('operator on date: lt', function * (t) {
    const beforeBug = predicate({value: new Date(2000, 0, 0), type: 'date', operator: 'lt'});
    t.ok(beforeBug(new Date(1999, 10, 31)));
    t.notOk(beforeBug(new Date(2000, 0, 0)));
  })
  .test('operator on date: lte', function * (t) {
    const beforeDday = predicate({value: '1944/06/06', type: 'date', operator: 'lte'});
    t.ok(beforeDday(new Date(1944, 5, 6)));
    t.ok(beforeDday('1918/11/11'));
    t.notOk(beforeDday(new Date()));
  })
  .test('operator on date: gt', function * (t) {
    const afterBug = predicate({value: new Date(2000, 0, 1), type: 'date', operator: 'gt'});
    t.ok(afterBug(new Date(2000, 0, 2)));
    t.notOk(afterBug(new Date(2000)));
  })
  .test('operator on date: gte', function * (t) {
    const afterDday = predicate({value: '1944/06/06', type: 'date', operator: 'gte'});
    t.ok(afterDday(new Date(1944, 5, 7)));
    t.ok(afterDday(new Date()));
    t.notOk(afterDday('1918/11/11'));
  })
  .test('filter items: string includes', function * (t) {
    const items = [
      {foo: 'bar'},
      {foo: 'swe'},
      {foo: 'we'}
    ];
    const filtered = filter({foo: [{value: 'we'}]})(items);
    t.deepEqual(filtered, [{foo: 'swe'}, {foo: 'we'}]);
  })
  .test('filter items: combine clauses on same property', function * (t) {
    const items = [
      {foo: 'bar'},
      {foo: 'swe'},
      {foo: 'sweet'}
    ];
    const filtered = filter({foo: [{value: 'swe'}, {operator: 'is', value: 'swe'}]})(items);
    t.deepEqual(filtered, [{foo: 'swe'}]);
  })
  .test('filter items: combine clauses on different properties', function * (t) {
    const items = [
      {foo: 'bar', age: 54},
      {foo: 'swe', age: 27},
      {foo: 'sweet', age: 12}
    ];
    const filtered = filter({foo: [{value: 'swe'}], age: [{operator: 'gt', value: 12, type: 'number'}]})(items);
    t.deepEqual(filtered, [{foo: 'swe', age: 27}]);
  })
  .test('filter items: clauses on nested properties', function * (t) {
    const items = [
      {foo: 'bar', bar: {blah: 'woo'}},
      {foo: 'swe', bar: {blah: 'woo'}},
      {foo: 'sweet', bar: {blah: 'wat'}}
    ];
    const filtered = filter({foo: [{value: 'swe'}], 'bar.blah': [{operator: 'is', value: 'woo'}]})(items);
    t.deepEqual(filtered, [{foo: 'swe', bar: {blah: 'woo'}}]);
  })
  .run();