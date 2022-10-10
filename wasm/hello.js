/*jshint esversion:8 */
//hello.js

import fs from 'fs';

const
    run = async () => {
        const module = await WebAssembly.compile(fs.readFileSync("./hello.wasm"));
        const memory = new WebAssembly.Memory({ initial: 1 });
        const importObject = {
          //console: { log: consoleLogString },
          js: { mem: memory },
        };

        const buffer = new Float32Array(importObject.js.mem.buffer);
        buffer[0] = 0.1;
        buffer[1] = 0.2;
        buffer[2] = 0.3;
        buffer[3] = 1;
        buffer[4] = 0.4;
        buffer[5] = 0.5;
        buffer[6] = 0.6;
        buffer[7] = 0.7;
        //console.log(buffer, importObject.js.mem.buffer);

        const instance = await WebAssembly.instantiate(module, importObject);

        console.log(instance.exports.helloWorld());

        instance.exports.VectorNeg(0, 128*4);
        console.log(buffer[128], buffer[129], buffer[130], buffer[131]);
        instance.exports.VectorAbs(128*4, 132*4);
        console.log(buffer[132], buffer[133], buffer[134], buffer[135]);
        instance.exports.VectorSqrt(0, 136*4);
        console.log(buffer[136], buffer[137], buffer[138], buffer[139]);
  
  
        instance.exports.VectorAdd(0, 16, 256*4);
        console.log(buffer[256], buffer[257], buffer[258], buffer[259]);
        instance.exports.VectorSub(0, 16, 260*4);
        console.log(buffer[260], buffer[261], buffer[262], buffer[263]);
        instance.exports.VectorMul(0, 16, 264*4);
        console.log(buffer[264], buffer[265], buffer[266], buffer[267]);
        instance.exports.VectorDiv(0, 16, 268*4);
        console.log(buffer[268], buffer[269], buffer[270], buffer[271]);

    };
  
  run();


