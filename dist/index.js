import { pipe } from 'fp-ts/lib/function.js';
import * as E from "fp-ts/lib/Either.js";
import * as B from "fp-ts/lib/boolean.js";
export const checkValues = vals => a => pipe(vals.includes(a), B.match(() => E.left(({ name: "ErrValue", givenValue: a, expectedValues: vals })), () => E.right(a)));
export const checkFieldValues = key => vals => obj => pipe(obj[key], checkValues(vals), E.mapLeft(() => ({ name: "ErrField", fieldName: key, givenValue: obj[key] })));
export const checkType = cType => val => pipe(typeof val === cType, B.match(() => E.left(({ name: "ErrType", givenValue: val, expectedValueType: cType })), () => E.right(val)));
export const checkField = key => checker => obj => pipe(obj[key], checker, E.map(() => obj));
//type Hello = {
//    name: "Hello",
//}
//
//const checkHelloName:
//    (key: string) =>
//    (a: any) =>
//    Op.Option<any> =
//    key =>
//    a =>
//    a[key] === "Hello" ? Op.some(a) : Op.none
//
//const isHello:
//    (a: any) =>
//    Op.Option<Hello> =
//    a => pipe(
//        a,
//        checkHelloName("name"), 
//    )
//    
//const hello1 = {
//    name: "Hello",
//}
//
//console.log(isHello(hello1))
////console.log(isHello('hello1'))
//
//type There = "there" | "their"
//
//const checkThere:
//    (a: any) =>
//    Op.Option<any> =
//    a =>
//    a === "there" || a === "their" ? Op.some(a) : Op.none
//
//const isThere: 
//    (a: any) =>
//    Op.Option<There> =
//    a => pipe(
//        a,
//        checkThere 
//    )
//
//type World = {
//    name: "World"
//    th: There
//}
//
//const checkStrValue:
//    (key: string) =>
//    (target: string) =>
//    (a: any) =>
//    Op.Option<any> =
//    key =>
//    target =>
//    a =>
//    a[key] === target ? Op.some(a) : Op.none
//
//const checkOutsideIs:
//   (key: string) =>
//    (isFn: ( a: any ) => Op.Option<any>) =>
//    (a: any) =>
//    Op.Option<any> =
//    key =>
//    isFn =>
//    a =>
//    isFn(a[key])
//
//const isWorld:
//    (a: any) =>
//    Op.Option<World> =
//    a => pipe(
//        a,
//        checkStrValue("name")("World"),
//        Op.chain(checkOutsideIs("there")(isThere))
//    )
