import { expect } from "chai";
import { pipe } from 'fp-ts/lib/function.js';
import * as E from "fp-ts/lib/Either.js";
import * as Is from "./index.js";
import * as Op from "fp-ts/lib/Option.js";
const thereGood1 = "there";
const thereFail = "th";
const isThere = a => pipe(a, Is.checkValues(["there", "their"]), E.map((s) => s));
const helloGood1 = {
    name: "Hello"
};
const helloBad1 = {
    name: "hi",
};
const isHello = a => pipe(a, Is.checkField("name")(Is.checkValues(["Hello", "Hola"])));
const numGood1 = 5;
const numBad = "hello";
const arrayGood1 = [1, 2];
const arrayGood2 = [];
const arrayBad1 = ["hello", 1];
const setGood1 = new Set(["hello", "there"]);
const setGood2 = new Set([]);
const setBad1 = new Set([1, "hello"]);
const exGood1 = {
    name: "Example",
    value: 1,
};
const exBad1 = {
    name: "ex",
    value: 1,
};
const exBad2 = {
    name: "Example",
    value: "hello"
};
const isExample = a => pipe(a, Is.checkField("name")(Is.checkValues(["Example"])), E.chain(Is.checkField("value")(Is.checkType("number"))));
describe("Single Value Tests", () => {
    it("There success", () => {
        pipe(thereGood1, isThere, E.match(() => expect.fail("fail"), () => expect(true).to.equal(true)));
    });
    it("There fail", () => {
        pipe(thereFail, isThere, E.match(() => expect(true).to.equal(true), () => expect.fail('should not return success')));
    });
});
describe("Single Value Field Tests", () => {
    it("Hello Success", () => {
        pipe(helloGood1, isHello, E.match(() => expect.fail('fail'), () => expect(true).to.equal(true)));
    });
    it("Hello fail", () => {
        pipe(helloBad1, isHello, E.match(() => expect(true).to.equal(true), () => expect.fail('should not return success')));
    });
});
describe("Checking the type", () => {
    it("If type numberic -> pass", () => {
        pipe(numGood1, Is.checkType("number"), E.match(() => expect.fail('fail'), () => expect(true).to.equal(true)));
    });
    it("If type string -> fail", () => {
        pipe(numGood1, Is.checkType("string"), E.match(() => expect(true).to.equal(true), () => expect.fail('should not succeed')));
    });
});
describe("Array checking", () => {
    it("numeric array -> pass", () => {
        pipe(arrayGood1, Is._checkArray(Is.checkType("number")), E.match(() => expect.fail('fail'), () => expect(true).to.equal(true)));
    });
    it("empty numeric array -> pass", () => {
        pipe(arrayGood2, Is._checkArray(Is.checkType("number")), E.match(() => expect.fail('fail'), () => expect(true).to.equal(true)));
    });
    it("string in array -> fail", () => {
        pipe(arrayBad1, Is._checkArray(Is.checkType("number")), E.match(() => expect(true).to.equal(true), () => expect.fail('fail')));
    });
});
describe("Set chcker", () => {
    it("All strings -> pass", () => {
        pipe(setGood1, Is._checkSet(Is.checkType("string")), E.match(() => expect.fail('fail'), () => expect(true).to.equal(true)));
    });
    it("empty array -> pass", () => {
        pipe(setGood2, Is._checkSet(Is.checkType("string")), E.match(() => expect.fail('fail'), () => expect(true).to.equal(true)));
    });
    it("numeric array -> fail", () => {
        pipe(setBad1, Is._checkSet(Is.checkType("string")), E.match(() => expect(true).to.equal(true), () => expect.fail('fail')));
    });
});
describe("Example of multiple fields that need to pass", () => {
    it("valid structure -> pass", () => {
        pipe(exGood1, isExample, E.match(() => expect.fail('fail'), () => expect(true).to.equal(true)));
    });
    it("invalid structure -> fail", () => {
        pipe(exBad1, isExample, E.match(() => expect(true).to.equal(true), () => expect.fail('fail')));
    });
    it("invalid structure -> fail", () => {
        pipe(exBad2, isExample, E.match(() => expect(true).to.equal(true), () => expect.fail('fail')));
    });
});
const a1 = [1, 2];
const a2 = { 1: 1, 2: 2 };
const a3 = new Set([1, 2]);
describe("Check that a value is an array meeting some type fn", () => {
    it("if array of numeric -> true", () => {
        pipe(a1, Is._isArray, E.match(() => expect.fail('fail'), () => expect(true).to.equal(true)));
    });
    it("if an object -> false", () => {
        pipe(a2, Is._isArray, E.match(() => expect(true).to.equal(true), () => expect.fail('fail')));
    });
    it("if an object -> false", () => {
        pipe(a3, Is._isArray, E.match(() => expect(true).to.equal(true), () => expect.fail('fail')));
    });
});
describe("Check if a value is a set", () => {
    it("if set -> true", () => {
        pipe(a3, Is._isSet, E.match(() => expect.fail('fail'), () => expect(true).to.equal(true)));
    });
    it("if array -> false", () => {
        pipe(a1, Is._isSet, E.match(() => expect(true).to.equal(true), () => expect.fail('fail')));
    });
    it("if object -> false", () => {
        pipe(a2, Is._isSet, E.match(() => expect(true).to.equal(true), () => expect.fail('fail')));
    });
});
const v1 = [1, 2, 3];
const v2 = ["hello"];
const v3 = new Set([1, 2, 3]);
const v4 = new Set(["hello"]);
describe("Determine if an array of cerain type values", () => {
    it("if numeric array -> true", () => {
        pipe(v1, Is.isArrayWith(Is.checkType("number")), E.match(() => expect.fail('fail'), () => expect(true).to.equal(true)));
    });
    it("if string array -> false", () => {
        pipe(v2, Is.isArrayWith(Is.checkType("number")), E.match(() => expect(true).to.equal(true), () => expect.fail('fail')));
    });
    it("if set -> false", () => {
        pipe(v3, Is.isArrayWith(Is.checkType("number")), E.match(() => expect(true).to.equal(true), () => expect.fail('fail')));
    });
});
describe("Determine if an set of cerain type values", () => {
    it("if numeric set -> true", () => {
        pipe(v3, Is.isSetWith(Is.checkType("number")), E.match(() => expect.fail('fail'), () => expect(true).to.equal(true)));
    });
    it("if set string -> false", () => {
        pipe(v4, Is.isSetWith(Is.checkType("number")), E.match(() => expect(true).to.equal(true), () => expect.fail('fail')));
    });
    it("if array -> false", () => {
        pipe(v1, Is.isSetWith(Is.checkType("number")), E.match(() => expect(true).to.equal(true), () => expect.fail('fail')));
    });
});
const oSomeNum = Op.some(1);
const oNone = Op.none;
const o1 = { a: 1 };
const o2 = [1, 2];
describe("Check if the value is an option", () => {
    it("op some -> true", () => {
        pipe(oSomeNum, Is.isOp, E.match(() => expect.fail('fail'), () => expect(true).to.equal(true)));
    });
    it("op none -> true", () => {
        pipe(oNone, Is.isOp, E.match(() => expect.fail('fail'), () => expect(true).to.equal(true)));
    });
    it("random obj -> false", () => {
        pipe(o1, Is.isOp, E.match(() => expect(true).to.equal(true), () => expect.fail('fail')));
    });
    it("random obj -> false", () => {
        pipe(o2, Is.isOp, E.match(() => expect(true).to.equal(true), () => expect.fail('fail')));
    });
});
