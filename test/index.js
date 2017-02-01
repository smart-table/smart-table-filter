import zora from 'zora';
import {predicate} from '../index';

export default zora()
  .test('predicate: use includes and string as default parameters', function * (t) {
    const includesFoo = predicate({value: 'foo'});
    t.ok(includesFoo('afoobar'));
    t.ok(!includesFoo('blah'));
  })
  .test('predicate use is operator on strings', function * (t) {
    const strictEqualsFoo = predicate({value: 'foo', operator: 'is'});
    t.ok(!strictEqualsFoo('afoobar'));
    t.ok(strictEqualsFoo('foo'));
  })
  .test('predicate infer number type', function * (t) {
    const greaterThanthree = predicate({value: '3', type: 'number', operator: 'gt'});
    t.ok(greaterThanthree('14'));
    t.ok(greaterThanthree(6));
    t.ok(!greaterThanthree('2'));
    t.ok(!greaterThanthree(1));
  })
  .run();