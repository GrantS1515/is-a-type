import { expect } from "chai"
import { pipe } from 'fp-ts/lib/function.js' 
import * as E from "fp-ts/lib/Either.js" 
import * as Is from "./index.js"

//const viewErrValue:
//    (err: Is.ErrValue) =>
//    string =
//    err =>
//    `Is Err with value ${err.givenValue} but expected ${err.expectedValues}`
//
//const viewErrField:
//    (err: Is.ErrField) =>
//    string =
//    err =>
//    `Is Err at ${err.fieldName} with value ${err.givenValue}`
//
//const viewErr:
//    (err: Is.Err) =>
//    string =
//    err => {
//        switch(err.name) {
//            case "ErrValue":
//                return viewErrValue(err)
//            case "ErrField":
//                return viewErrField(err)
//            default:
//                return "Error in viewErr"
//        
//        }
//    }

type There = "there" | "their"

const thereGood1 = "there"
const thereFail = "th"

const isThere:
    (a: any) =>
    E.Either<Is.Err, There> =
    a =>
    pipe(
        a,
        Is.checkValues(["there", "their"]) 
    )

type Hello = {
    name: "Hello" | "Hola",
}

const helloGood1 = {
    name: "Hello"
}

const helloBad1 = {
    name: "hi",
}

const isHello:
    (a: any) =>
    E.Either<Is.Err, Hello> =
    a =>
    pipe(
        a,
        Is.checkFieldValues("name")(["Hello", "Hola"]) 
    )

type NumType = number

const numGood1 = 5
const numBad = "hello"

type World = {
    name: "World" | "Worlds"
    value: number,
    hello: Hello,
    th: There,
    tm1: number[],
    tm2: There[],
}

const worldGood1 = {
    name: "World",
    value: 5,
    hello: { name: "Hello" },
    th: "there",
}

describe("Single Value Tests", () => {
    it("There success", () => {
        pipe(
            thereGood1,
            isThere,
            E.match(
                () => expect.fail("fail"),
                () => expect(true).to.equal(true)
            )
        )

    })
    it("There fail", () => {
        pipe(
            thereFail,
            isThere,
            E.match(
                () => expect(true).to.equal(true),
                () => expect.fail('should not return success')
            )
        )

    })
})


describe("Single Value Field Tests", () => {
    it("Hello Success", () => {
        pipe(
            helloGood1,
           isHello,
          E.match(
            () => expect.fail('fail'),
            () => expect(true).to.equal(true) 
          ) 
        )
    })

    it("Hello fail", () => {
        pipe(
            helloBad1,
           isHello,
          E.match(
            () => expect(true).to.equal(true),
            () => expect.fail('should not return success'),
          ) 
        )
    })
})

describe("Checking the type", () => {
    it("If type numberic -> pass", () => {
        pipe(
            numGood1,
           Is.checkType("number"),
           E.match(
                () => expect.fail('fail'),
                () => expect(true).to.equal(true)
           )
        )
    })
    it("If type string -> fail", () => {
        pipe(
            numGood1,
           Is.checkType("string"),
           E.match(
                () => expect(true).to.equal(true),
                () => expect.fail('should not succeed'),
           )
        )
    })
})
