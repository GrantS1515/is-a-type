import * as Op from "fp-ts/lib/Option.js"
import { pipe } from 'fp-ts/lib/function.js' 
//make more general purpose then string
// multiple acceptance values
// convert to either

type Hello = {
    name: "Hello",
}

const checkHelloName:
    (key: string) =>
    (a: any) =>
    Op.Option<any> =
    key =>
    a =>
    a[key] === "Hello" ? Op.some(a) : Op.none

const isHello:
    (a: any) =>
    Op.Option<Hello> =
    a => pipe(
        a,
        checkHelloName("name"), 
    )
    
//const isHello:
//    (a: any) =>
//    Op.Option<Hello> =
//    a => {
//        if (a.name === "Hello") {
//            return Op.some(a) 
//        } else {
//            return Op.none 
//        }
//    } 

const hello1 = {
    name: "Hello",
}

console.log(isHello(hello1))
//console.log(isHello('hello1'))

type There = "there" | "their"

const checkThere:
    (a: any) =>
    Op.Option<any> =
    a =>
    a === "there" || a === "their" ? Op.some(a) : Op.none

const isThere: 
    (a: any) =>
    Op.Option<There> =
    a => pipe(
        a,
        checkThere 
    )

type World = {
    name: "World"
    th: There
}

const checkStrValue:
    (key: string) =>
    (target: string) =>
    (a: any) =>
    Op.Option<any> =
    key =>
    target =>
    a =>
    a[key] === target ? Op.some(a) : Op.none

const checkOutsideIs:
   (key: string) =>
    (isFn: ( a: any ) => Op.Option<any>) =>
    (a: any) =>
    Op.Option<any> =
    key =>
    isFn =>
    a =>
    isFn(a[key])

const isWorld:
    (a: any) =>
    Op.Option<World> =
    a => pipe(
        a,
        checkStrValue("name")("World"),
        Op.chain(checkOutsideIs("there")(isThere))
    )
