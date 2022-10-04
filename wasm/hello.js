/*jshint esversion:8 */
//hello.js

import fs from 'fs';

const
    run = async () => {
        const buffer = fs.readFileSync("./hello.wasm");
        const module = await WebAssembly.compile(buffer);
        const instance = await WebAssembly.instantiate(module);
        console.log(instance.exports.helloWorld());
    };
  
  run();


