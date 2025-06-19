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

//export const errValue2String:
//    (e: ErrValue) =>
//    string =
//    e =>
//    `Err in the value expected. Given ${e.givenValue} but expecting ${e.expectedValues}`
//
export type ErrType = {
    name: "ErrType",
    givenValue: any,
    expectedValueType: CType,
}
//
//export const errType2String:
//    (e: ErrType) =>
//    string =
//    e =>
//    `Err in the type expected. Given ${e.givenValue} but expecting ${e.expectedValueType}`
//
export type Err = ErrValue | ErrType
//
//export const err2String:
//    (e: Err) =>
//    string =
//    e => {
//        switch(e.name) {
//            case "ErrValue":
//               return errValue2String(e) 
//            case "ErrType":
//                return errType2String(e)
//            default:
//                return "Error in conversion to string"
//        } 
//    }

// check a set of values defined in the type
export const checkValues:
    (vals: any[]) =>
    (a: any) =>
    E.Either<ErrValue, any> =
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
    E.Either<ErrType, any> =
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
export const checkArray:
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
export const checkSet:
    (checker: Check) =>
    (st: Set<any>) =>
    E.Either<Err, any> =
    checker =>
    st =>
    pipe(
        st,
        Array.from,
        checkArray(checker)
    )
