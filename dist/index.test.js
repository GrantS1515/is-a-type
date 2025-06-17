import { expect } from "chai";
import { pipe } from 'fp-ts/lib/function.js';
import * as E from "fp-ts/lib/Either.js";
import * as Is from "./index.js";
const thereGood1 = "there";
const thereFail = "th";
const isThere = a => pipe(a, Is.checkValues(["there", "their"]));
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
        pipe(arrayGood1, Is.checkArray(Is.checkType("number")), E.match(() => expect.fail('fail'), () => expect(true).to.equal(true)));
    });
    it("empty numeric array -> pass", () => {
        pipe(arrayGood2, Is.checkArray(Is.checkType("number")), E.match(() => expect.fail('fail'), () => expect(true).to.equal(true)));
    });
    it("string in array -> fail", () => {
        pipe(arrayBad1, Is.checkArray(Is.checkType("number")), E.match(() => expect(true).to.equal(true), () => expect.fail('fail')));
    });
});
describe("Set chcker", () => {
    it("All strings -> pass", () => {
        pipe(setGood1, Is.checkSet(Is.checkType("string")), E.match(() => expect.fail('fail'), () => expect(true).to.equal(true)));
    });
    it("empty array -> pass", () => {
        pipe(setGood2, Is.checkSet(Is.checkType("string")), E.match(() => expect.fail('fail'), () => expect(true).to.equal(true)));
    });
    it("numeric array -> fail", () => {
        pipe(setBad1, Is.checkSet(Is.checkType("string")), E.match(() => expect(true).to.equal(true), () => expect.fail('fail')));
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
