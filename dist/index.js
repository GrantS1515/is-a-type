import { pipe } from 'fp-ts/lib/function.js';
import * as E from "fp-ts/lib/Either.js";
import * as B from "fp-ts/lib/boolean.js";
import * as A from "fp-ts/lib/Array.js";
// check a set of values defined in the type
export const checkValues = vals => a => pipe(vals.includes(a), B.match(() => E.left(({ name: "ErrValue", givenValue: a, expectedValues: vals })), () => E.right(a)));
// check for the standard base types
export const checkType = cType => val => pipe(typeof val === cType, B.match(() => E.left(({ name: "ErrType", givenValue: val, expectedValueType: cType })), () => E.right(val)));
// check a field of an object
export const checkField = key => checker => obj => pipe(obj[key], checker, E.map(() => obj));
const eMonoid = {
    concat: (a, b) => {
        if (E.isLeft(a)) {
            return a;
        }
        else if (E.isLeft(b)) {
            return b;
        }
        else {
            return a;
        }
    },
    empty: E.right("Empty")
};
// check an array
export const _checkArray = checker => arr => pipe(arr, A.foldMap(eMonoid)(checker), E.map(() => arr));
// check a set
export const _checkSet = checker => st => pipe(st, Array.from, _checkArray(checker), E.match((e) => E.left(e), () => E.right(st)));
export const _isArray = a => pipe(a, Array.isArray, B.match(() => E.left({ name: 'NotArrayErr', given: a }), () => E.right(a)));
export const _isSet = a => pipe(a instanceof Set, B.match(() => E.left({ name: 'NotSetErr', given: a }), () => E.right(a)));
export const isArrayWith = check => a => pipe(a, _isArray, E.chain(_checkArray(check)));
export const isSetWith = check => a => pipe(a, _isSet, E.chain(_checkSet(check)));
