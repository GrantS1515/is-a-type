import * as Op from "fp-ts/lib/Option.js"
import { pipe } from 'fp-ts/lib/function.js' 
import * as E from "fp-ts/lib/Either.js" 
import * as B from "fp-ts/lib/boolean.js"
import * as A from "fp-ts/lib/Array.js"
import * as M from "fp-ts/lib/Monoid.js"
import * as St from "fp-ts/lib/Set.js"

export type ErrValue = {
    name: "ErrValue",
    givenValue: any,
    expectedValues: any[],
}

export type ErrType = {
    name: "ErrType",
    givenValue: any,
    expectedValueType: CType,
}

export type NotArrayErr = {
    name: "NotArrayErr",
    given: any,
}

export type NotSetErr = {
    name: "NotSetErr",
    given: any,
}

export type Err = ErrValue | ErrType | NotArrayErr | NotSetErr

// check a set of values defined in the type
export const checkValues:
    (vals: (string | number | boolean)[]) =>
    (a: string | number | boolean) =>
    E.Either<ErrValue, string | number | boolean> =
    vals =>
    a => pipe(
        vals.includes(a),
        B.match(
            () => E.left( ({ name: "ErrValue", givenValue: a, expectedValues: vals }) ),
            () => E.right(a),
        )
    ) 
    
type CType = "string" | "number" | "boolean"

// check for the standard base types
export const checkType:
    (cType: CType) =>
    (val: any) =>
    E.Either<ErrType, string | number | boolean> =
    cType => 
    val =>
    pipe(
        typeof val === cType,
        B.match(
            () => E.left( ({ name: "ErrType", givenValue: val, expectedValueType: cType}) ),
            () => E.right(val) 
        )
    )

export type Check = (a: any) => E.Either<Err, any>
    
// check a field of an object
export const checkField:
    (key: string) =>
    (checker: Check) =>
    (obj: any) =>
    E.Either<Err, any> =
    key =>
    checker =>
    obj =>
    pipe(
        obj[key],
        checker,
        E.map(() => obj)
    )

const eMonoid: M.Monoid<E.Either<Err,any>> = {
    concat: (a: E.Either<Err,any>, b: E.Either<Err, any>) => {
        if ( E.isLeft(a) ) {
            return a
        } else  if ( E.isLeft(b) ){
            return b 
        } else {
            return a 
        }
    },

    empty: E.right("Empty")
}

// check an array
export const _checkArray:
    (checker: Check) =>
    (arr: any[]) =>
    E.Either<Err, any> =
    checker =>
    arr =>
    pipe(
       arr,
       A.foldMap(eMonoid)(checker),
       E.map(() => arr),
    )

// check a set
export const _checkSet:
    (checker: Check) =>
    (st: Set<any>) =>
    E.Either<Err, any> =
    checker =>
    st =>
    pipe(
        st,
        Array.from,
        _checkArray(checker),
        E.match(
            (e) => E.left(e),
            () => E.right(st)
        )
    )


export const _isArray:
    (a: any) =>
    E.Either<NotArrayErr, any[]> =
    a =>
    pipe(
        a,
        Array.isArray,
        B.match(
            () => E.left({name: 'NotArrayErr', given: a}),
            () => E.right(a),
        )
    )

    
export const _isSet:
    (a: any) =>
    E.Either<NotSetErr, Set<any>> =
    a =>
    pipe(
        a instanceof Set,
        B.match(
            () => E.left({name: 'NotSetErr', given: a}),
            () => E.right(a),
        )
    )


export const isArrayWith:
    (check: Check) =>
    (a: any) =>
    E.Either<Err, any[]> =
    check =>
    a =>
    pipe(
        a,
       _isArray,
      E.chain(_checkArray(check)),
    )

export const isSetWith:
    (check: Check) =>
    (a: any) =>
    E.Either<Err, Set<any>> =
    check =>
    a =>
    pipe(
        a,
       _isSet,
      E.chain(_checkSet(check))
    )



