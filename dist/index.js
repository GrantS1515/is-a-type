import * as Op from "fp-ts/lib/Option.js";
import { pipe } from 'fp-ts/lib/function.js';
const checkHelloName = key => a => a[key] === "Hello" ? Op.some(a) : Op.none;
const isHello = a => pipe(a, checkHelloName("name"));
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
};
console.log(isHello(hello1));
const checkThere = a => a === "there" || a === "their" ? Op.some(a) : Op.none;
const isThere = a => pipe(a, checkThere);
const checkStrValue = key => target => a => a[key] === target ? Op.some(a) : Op.none;
const checkOutsideIs = key => isFn => a => isFn(a[key]);
const isWorld = a => pipe(a, checkStrValue("name")("World"), Op.chain(checkOutsideIs("there")(isThere)));
