/*jshint esversion:8 */

import fs from 'fs';
import wabt from 'wabt';

wabt().then(wabt => {
    const
        out = wabt.parseWat('hello.wat', fs.readFileSync('hello.wat', 'utf8'), {simd: true}).toBinary({});
    console.log('out.log: "', out.log, '"');    
    fs.writeFileSync('hello.wasm', out.buffer);
}).catch(reason => {
    console.log('Unhandled Promise exception', reason);
});


