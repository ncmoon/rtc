/*jshint esversion:8 */
console.log('ray.js');
/*

    TODO
    ====

    1)  get ch 1..3 working                                                [OK]
    2)  rewrite so vectors are a Float32Array(4) rather than simple Array  [OK]
    3)  flatten coding for matrix inverse                                  [OK]
    4)  rewrite so Matrix is stored as Float32Array(16)                    [OK]
    5)  add .wat file                                                      [OK]
    6)  add a compile.js script                                            [OK]
    7)  include .wasm in ray.js                                            [OK]
    8)  migrate vector functions to wasm Ch1                               [OK]
    9)  migrate vector functions to wasm Ch2                               [OK]
    10) migrate vector functions to wasm Ch3                               [OK]
    11) change benchmark to use old v new code...                          [OK]
    12) add Ch4
    13) add Ch5

    zynii
    -----
    1) define zynii grammar BNF
    2) create test cases for foldChar() and lexer()
    3) implement basic lexer 
    4) create test cases for parser
    5) implement parser()
    6) expand test cases to be more comprehensive
    7) get parser() to generate javascript (probably run interpretively?)
    8) build test cases for compiled code
    9) get parser to generate .wat source
    10) build toolchain to create .wasm and calling javascript code. 
    ---------

    14) do Ch6-10
    15) do Ch11-15
*/

import fs from 'fs';
var
  buffer,
  wasm;
const
    run = async () => {
        const module = await WebAssembly.compile(fs.readFileSync("./ray.wasm"), {simd: true});
        const memory = new WebAssembly.Memory({ initial: 1 });
        const importObject = {
          js: { mem: memory },
        };
        buffer = new Float32Array(importObject.js.mem.buffer);
        /*
        buffer[0] = 0.1;
        buffer[1] = 0.2;
        buffer[2] = 0.3;
        buffer[3] = 1;
        buffer[4] = 0.4;
        buffer[5] = 0.5;
        buffer[6] = 0.6;
        buffer[7] = 0.7;*/
        wasm = await WebAssembly.instantiate(module, importObject);
    };
  

//NB might be possible to avoid doing assignments and just somehow treat as a record|struct possibly dataview does?
function getVector(off) {
    //console.log('getvector()', off, buffer[off], buffer[off+1], buffer[off+2], buffer[off+3]);
    return [
        buffer[off], buffer[off+1], buffer[off+2], buffer[off+3]
    ];
} //getVector

function setVector(off, v) {
    buffer[off]   = v[0];
    buffer[off+1] = v[1];
    buffer[off+2] = v[2];
    buffer[off+3] = v[3];
    return off;
} //setVector

function getMatrix(off) {
    return [
        [ buffer[off+0],  buffer[off+1],  buffer[off+2],  buffer[off+3]  ],
        [ buffer[off+4],  buffer[off+5],  buffer[off+6],  buffer[off+7]  ],
        [ buffer[off+8],  buffer[off+9],  buffer[off+10], buffer[off+11] ],
        [ buffer[off+12], buffer[off+13], buffer[off+14], buffer[off+15] ]
    ];
} //getMatrix

function setMatrix(off, M) {
    buffer[off+0]  = M[0][0];
    buffer[off+1]  = M[0][1];
    buffer[off+2]  = M[0][2];
    buffer[off+3]  = M[0][3];
    buffer[off+4]  = M[1][0];
    buffer[off+5]  = M[1][1];
    buffer[off+6]  = M[1][2];
    buffer[off+7]  = M[1][3];
    buffer[off+8]  = M[2][0];
    buffer[off+9]  = M[2][1];
    buffer[off+10] = M[2][2];
    buffer[off+11] = M[2][3];
    buffer[off+12] = M[3][0];
    buffer[off+13] = M[3][1];
    buffer[off+14] = M[3][2];
    buffer[off+15] = M[3][3];
    return off;
} //setMatrix

//transformations (CH 4)
function translationMatrix(x, y, z) {
    return [
        [1, 0, 0, x], 
        [0, 1, 0, y], 
        [0, 0, 1, z], 
        [0, 0, 0, 1]
    ];
}

function scaleMatrix(x, y, z) {
    return [
        [x, 0, 0, 0], 
        [0, y, 0, 0], 
        [0, 0, z, 0], 
        [0, 0, 0, 1]
    ];
}

function rotateXMatrix(theta) {
    return [
        [1, 0,               0,                 0], 
        [0, Math.cos(theta), -Math.sin(theta),  0], 
        [0, Math.sin(theta), Math.cos(theta),   0], 
        [0, 0,               0,                 1]
    ];
}

function rotateYMatrix(theta) {
    return [
        [Math.cos(theta),  0,   Math.sin(theta),    0], 
        [0,                1,   0,                  0], 
        [-Math.sin(theta), 0,   Math.cos(theta),    0], 
        [0,                0,   0,                  1]
    ];
}

function rotateZMatrix(theta) {
    return [
        [Math.cos(theta),   -Math.sin(theta),   0,  0], 
        [Math.sin(theta),   Math.cos(theta),    0,  0], 
        [0,                 0,                  1,  0], 
        [0,                 0,                  0,  1]
    ];
}

function shearMatrix(xByY,xByZ, yByX, yByZ, zByX, zByY) {
    return [
        [1,     xByY,   xByZ,   0], 
        [yByX,  1,      yByZ,   0], 
        [zByX,  zByY,   1,      0], 
        [0,     0,      0,      1]
    ];
}

const 
    X = 0,
    Y = 1,
    Z = 2,
    W = 3,
    R = 0,
    G = 1,
    B = 2,
    Point = (x, y, z) => { return Float32Array.from([x, y, z, 1]); },
    Vector = (x, y, z) => { return Float32Array.from([x, y, z, 0]); },   
    VectorNeg = (a) => { return Float32Array.from([-a[X], -a[Y], -a[Z], -a[W]]); },
    VectorMag = (v) => { return Math.sqrt(v[X]*v[X] + v[Y]*v[Y] + v[Z]*v[Z] + v[W]*v[W]); },
    VectorNormalize = (v) => {
        const m = VectorMag(v);
        return Float32Array.from([v[X]/m, v[Y]/m, v[Z]/m, v[W]/m]);
    },    
    VectorAdd = (a, b) => { return Float32Array.from([a[X] + b[X], a[Y] + b[Y], a[Z] + b[Z], a[W] + b[W]]); },
    VectorSub = (a, b) => { return Float32Array.from([a[X] - b[X], a[Y] - b[Y], a[Z] - b[Z], a[W] - b[W]]); },
    VectorMul = (v, s) => { return Float32Array.from([v[X] * s, v[Y] * s, v[Z] * s, v[W] * s]); },
    VectorDiv = (v, s) => { return Float32Array.from([v[X] / s, v[Y] / s, v[Z] / s, v[W] / s]); },
    VectorDot = (u, v) => u[X]*v[X] + u[Y]*v[Y] + u[Z]*v[Z] + u[W]*v[W],
    VectorCross = (u, v) => { return Float32Array.from([u[1]*v[2] - u[2]*v[1], u[2]*v[0] - u[0]*v[2], u[0]*v[1] - u[1]*v[0], 0]); },
    
    Color = (r, g, b) => { return [r, g, b, 0]; },
    ColorProduct = (c, d) => { //shurr/hadamar product for colors
        return [c[R] * d[R], c[G] * d[G], c[B] * d[B], 0]; 
    }, 
    BLACK   = Color(0, 0, 0),
    WHITE   = Color(1, 1, 1),
    RED     = Color(1, 0, 0),
    GREEN   = Color(0, 1, 0),
    BLUE    = Color(0, 0, 1),
    YELLOW  = Color(1, 1, 0),
    CYAN    = Color(0, 1, 1),
    MAGENTA = Color(1, 0, 1),
    ORIGIN = Point(0, 0, 0),
    

    /*Matrix = (m) => [
        [m[0][0], m[0][1], m[0][2], m[0][3]],
        [m[1][0], m[1][1], m[1][2], m[1][3]],
        [m[2][0], m[2][1], m[2][2], m[2][3]],
        [m[3][0], m[3][1], m[3][2], m[3][3]]
    ],*/
    Matrix = (m) => Float32Array.from([
        m[0][0], m[0][1], m[0][2], m[0][3],
        m[1][0], m[1][1], m[1][2], m[1][3],
        m[2][0], m[2][1], m[2][2], m[2][3],
        m[3][0], m[3][1], m[3][2], m[3][3]
    ]),
    MatrixIdentity = () => {
        return Matrix([
            [1, 0, 0, 0], 
            [0, 1, 0, 0], 
            [0, 0, 1, 0], 
            [0, 0, 0, 1]
        ]);
    },
    MatrixMultiply = (m, n) => {
        return Matrix([
            [
                m[4*0+0] * n[4*0+0] + m[4*0+1] * n[4*1+0] + m[4*0+2] * n[4*2+0] + m[4*0+3] * n[4*3+0], 
                m[4*0+0] * n[4*0+1] + m[4*0+1] * n[4*1+1] + m[4*0+2] * n[4*2+1] + m[4*0+3] * n[4*3+1], 
                m[4*0+0] * n[4*0+2] + m[4*0+1] * n[4*1+2] + m[4*0+2] * n[4*2+2] + m[4*0+3] * n[4*3+2], 
                m[4*0+0] * n[4*0+3] + m[4*0+1] * n[4*1+3] + m[4*0+2] * n[4*2+3] + m[4*0+3] * n[4*3+3]
            ],
            [
                m[4*1+0] * n[4*0+0] + m[4*1+1] * n[4*1+0] + m[4*1+2] * n[4*2+0] + m[4*1+3] * n[4*3+0], 
                m[4*1+0] * n[4*0+1] + m[4*1+1] * n[4*1+1] + m[4*1+2] * n[4*2+1] + m[4*1+3] * n[4*3+1], 
                m[4*1+0] * n[4*0+2] + m[4*1+1] * n[4*1+2] + m[4*1+2] * n[4*2+2] + m[4*1+3] * n[4*3+2], 
                m[4*1+0] * n[4*0+3] + m[4*1+1] * n[4*1+3] + m[4*1+2] * n[4*2+3] + m[4*1+3] * n[4*3+3]
            ],
            [
                m[4*2+0] * n[4*0+0] + m[4*2+1] * n[4*1+0] + m[4*2+2] * n[4*2+0] + m[4*2+3] * n[4*3+0], 
                m[4*2+0] * n[4*0+1] + m[4*2+1] * n[4*1+1] + m[4*2+2] * n[4*2+1] + m[4*2+3] * n[4*3+1], 
                m[4*2+0] * n[4*0+2] + m[4*2+1] * n[4*1+2] + m[4*2+2] * n[4*2+2] + m[4*2+3] * n[4*3+2], 
                m[4*2+0] * n[4*0+3] + m[4*2+1] * n[4*1+3] + m[4*2+2] * n[4*2+3] + m[4*2+3] * n[4*3+3]
            ],
            [
                m[4*3+0] * n[4*0+0] + m[4*3+1] * n[4*1+0] + m[4*3+2] * n[4*2+0] + m[4*3+3] * n[4*3+0], 
                m[4*3+0] * n[4*0+1] + m[4*3+1] * n[4*1+1] + m[4*3+2] * n[4*2+1] + m[4*3+3] * n[4*3+1], 
                m[4*3+0] * n[4*0+2] + m[4*3+1] * n[4*1+2] + m[4*3+2] * n[4*2+2] + m[4*3+3] * n[4*3+2], 
                m[4*3+0] * n[4*0+3] + m[4*3+1] * n[4*1+3] + m[4*3+2] * n[4*2+3] + m[4*3+3] * n[4*3+3]
            ]
        ]);
    },
    MatrixTranspose = (m) => { 
        return Matrix([
            [m[4*0+0], m[4*1+0], m[4*2+0], m[4*3+0]],
            [m[4*0+1], m[4*1+1], m[4*2+1], m[4*3+1]],
            [m[4*0+2], m[4*1+2], m[4*2+2], m[4*3+2]],
            [m[4*0+3], m[4*1+3], m[4*2+3], m[4*3+3]]
        ]); 
    },
    MatrixDeterminant = (m) => {
        /*
        return  m[0][0] * m4x4.coFactor(m, 0, 0) + 
                m[0][1] * m4x4.coFactor(m, 0, 1) + 
                m[0][2] * m4x4.coFactor(m, 0, 2) +
                m[0][3] * m4x4.coFactor(m, 0, 3);  */              
        return  m[4*0+0] *  
                    //M3determinant(m3x3.new([ [m[1][1], m[1][2], m[1][3]], [m[2][1], m[2][2], m[2][3]], [m[3][1], m[3][2], m[3][3]] ])) + 
                    (
                        m[4*1+1] *  (m[4*2+2] * m[4*3+3] - m[4*2+3] * m[4*3+2]) + 
                        m[4*1+2] * -(m[4*2+1] * m[4*3+3] - m[4*2+3] * m[4*3+1]) + 
                        m[4*1+3] *  (m[4*2+1] * m[4*3+2] - m[4*2+2] * m[4*3+1])
                    ) +
                m[4*0+1] * 
                    //-M3determinant(m3x3.new([ [m[1][0], m[1][2], m[1][3]], [m[2][0], m[2][2], m[2][3]], [m[3][0], m[3][2], m[3][3]] ])) + 
                    -(
                        m[4*1+0] *  (m[4*2+2] * m[4*3+3] - m[4*2+3] * m[4*3+2]) + 
                        m[4*1+2] * -(m[4*2+0] * m[4*3+3] - m[4*2+3] * m[4*3+0]) + 
                        m[4*1+3] *  (m[4*2+0] * m[4*3+2] - m[4*2+2] * m[4*3+0])
                    ) +
                m[4*0+2] *  
                    //M3determinant(m3x3.new([ [m[1][0], m[1][1], m[1][3]], [m[2][0], m[2][1], m[2][3]], [m[3][0], m[3][1], m[3][3]] ])) +
                    (
                        m[4*1+0] *  (m[4*2+1] * m[4*3+3] - m[4*2+3] * m[4*3+1]) + 
                        m[4*1+1] * -(m[4*2+0] * m[4*3+3] - m[4*2+3] * m[4*3+0]) + 
                        m[4*1+3] *  (m[4*2+0] * m[4*3+1] - m[4*2+1] * m[4*3+0])
                    ) +
                m[4*0+3] * 
                    //-M3determinant(m3x3.new([ [m[1][0], m[1][1], m[1][2]], [m[2][0], m[2][1], m[2][2]], [m[3][0], m[3][1], m[3][2]] ]));     
                    -(
                        m[4*1+0] *  (m[4*2+1] * m[4*3+2] - m[4*2+2] * m[4*3+1]) + 
                        m[4*1+1] * -(m[4*2+0] * m[4*3+2] - m[4*2+2] * m[4*3+0]) + 
                        m[4*1+2] *  (m[4*2+0] * m[4*3+1] - m[4*2+1] * m[4*3+0])
                    );
    },
    MatrixInverse = (m) => {
        const
            det = MatrixDeterminant(m);
        return Matrix([
            [
                (
                    m[4*1+1] *  (m[4*2+2] * m[4*3+3] - m[4*2+3] * m[4*3+2]) + 
                    m[4*1+2] * -(m[4*2+1] * m[4*3+3] - m[4*2+3] * m[4*3+1]) + 
                    m[4*1+3] *  (m[4*2+1] * m[4*3+2] - m[4*2+2] * m[4*3+1])
                )/det, //M3Det(subMatrix(m, 0, 0))
                -(
                    m[4*0+1] *  (m[4*2+2] * m[4*3+3] - m[4*2+3] * m[4*3+2]) + 
                    m[4*0+2] * -(m[4*2+1] * m[4*3+3] - m[4*2+3] * m[4*3+1]) + 
                    m[4*0+3] *  (m[4*2+1] * m[4*3+2] - m[4*2+2] * m[4*3+1])
                )/det, //M3Det(subMatrix(m, 1, 0))
                 (
                    m[4*0+1] *  (m[4*1+2] * m[4*3+3] - m[4*1+3] * m[4*3+2]) + 
                    m[4*0+2] * -(m[4*1+1] * m[4*3+3] - m[4*1+3] * m[4*3+1]) + 
                    m[4*0+3] *  (m[4*1+1] * m[4*3+2] - m[4*1+2] * m[4*3+1])
                )/det, //M3Det(subMatrix(m, 2, 0))
                -(
                    m[4*0+1] *  (m[4*1+2] * m[4*2+3] - m[4*1+3] * m[4*2+2]) + 
                    m[4*0+2] * -(m[4*1+1] * m[4*2+3] - m[4*1+3] * m[4*2+1]) + 
                    m[4*0+3] *  (m[4*1+1] * m[4*2+2] - m[4*1+2] * m[4*2+1])
                )/det //M3Det(subMatrix(m, 3, 0))
            ],
            [
                -(
                    m[4*1+0] *  (m[4*2+2] * m[4*3+3] - m[4*2+3] * m[4*3+2]) + 
                    m[4*1+2] * -(m[4*2+0] * m[4*3+3] - m[4*2+3] * m[4*3+0]) + 
                    m[4*1+3] *  (m[4*2+0] * m[4*3+2] - m[4*2+2] * m[4*3+0])
                )/det, //M3Det(subMatrix(m, 0, 1))
                (
                    m[4*0+0] *  (m[4*2+2] * m[4*3+3] - m[4*2+3] * m[4*3+2]) + 
                    m[4*0+2] * -(m[4*2+0] * m[4*3+3] - m[4*2+3] * m[4*3+0]) + 
                    m[4*0+3] *  (m[4*2+0] * m[4*3+2] - m[4*2+2] * m[4*3+0])
                )/det, //M3Det(subMatrix(m, 1, 1))
                -(
                    m[4*0+0] *  (m[4*1+2] * m[4*3+3] - m[4*1+3] * m[4*3+2]) + 
                    m[4*0+2] * -(m[4*1+0] * m[4*3+3] - m[4*1+3] * m[4*3+0]) + 
                    m[4*0+3] *  (m[4*1+0] * m[4*3+2] - m[4*1+2] * m[4*3+0])
                )/det, //M3Det(subMatrix(m, 2, 1))
                (
                    m[4*0+0] *  (m[4*1+2] * m[4*2+3] - m[4*1+3] * m[4*2+2]) + 
                    m[4*0+2] * -(m[4*1+0] * m[4*2+3] - m[4*1+3] * m[4*2+0]) + 
                    m[4*0+3] *  (m[4*1+0] * m[4*2+2] - m[4*1+2] * m[4*2+0])
                )/det  //M3Det(subMatrix(m, 3, 1))
            ],
            [
                (
                    m[4*1+0] *  (m[4*2+1] * m[4*3+3] - m[4*2+3] * m[4*3+1]) + 
                    m[4*1+1] * -(m[4*2+0] * m[4*3+3] - m[4*2+3] * m[4*3+0]) + 
                    m[4*1+3] *  (m[4*2+0] * m[4*3+1] - m[4*2+1] * m[4*3+0])
                )/det, //M3Det(subMatrix(m, 0, 2))
                -(
                    m[4*0+0] *  (m[4*2+1] * m[4*3+3] - m[4*2+3] * m[4*3+1]) + 
                    m[4*0+1] * -(m[4*2+0] * m[4*3+3] - m[4*2+3] * m[4*3+0]) + 
                    m[4*0+3] *  (m[4*2+0] * m[4*3+1] - m[4*2+1] * m[4*3+0])
                )/det, //M3Det(subMatrix(m, 1, 2))
                (
                    m[4*0+0] *  (m[4*1+1] * m[4*3+3] - m[4*1+3] * m[4*3+1]) + 
                    m[4*0+1] * -(m[4*1+0] * m[4*3+3] - m[4*1+3] * m[4*3+0]) + 
                    m[4*0+3] *  (m[4*1+0] * m[4*3+1] - m[4*1+1] * m[4*3+0])
                 )/det, //M3Det(subMatrix(m, 2, 2))
                -(
                    m[4*0+0] *  (m[4*1+1] * m[4*2+3] - m[4*1+3] * m[4*2+1]) + 
                    m[4*0+1] * -(m[4*1+0] * m[4*2+3] - m[4*1+3] * m[4*2+0]) + 
                    m[4*0+3] *  (m[4*1+0] * m[4*2+1] - m[4*1+1] * m[4*2+0])
                )/det //M3Det(subMatrix(m, 3, 2))
            ],
            [
                -(
                    m[4*1+0] *  (m[4*2+1] * m[4*3+2] - m[4*2+2] * m[4*3+1]) + 
                    m[4*1+1] * -(m[4*2+0] * m[4*3+2] - m[4*2+2] * m[4*3+0]) + 
                    m[4*1+2] *  (m[4*2+0] * m[4*3+1] - m[4*2+1] * m[4*3+0])
                )/det, //M3Det(subMatrix(m, 0, 3))
                (
                    m[4*0+0] *  (m[4*2+1] * m[4*3+2] - m[4*2+2] * m[4*3+1]) + 
                    m[4*0+1] * -(m[4*2+0] * m[4*3+2] - m[4*2+2] * m[4*3+0]) + 
                    m[4*0+2] *  (m[4*2+0] * m[4*3+1] - m[4*2+1] * m[4*3+0])
                )/det, //M3Det(subMatrix(m, 1, 3))
                -(
                    m[4*0+0] *  (m[4*1+1] * m[4*3+2] - m[4*1+2] * m[4*3+1]) + 
                    m[4*0+1] * -(m[4*1+0] * m[4*3+2] - m[4*1+2] * m[4*3+0]) + 
                    m[4*0+2] *  (m[4*1+0] * m[4*3+1] - m[4*1+1] * m[4*3+0])
                )/det, //M3Det(subMatrix(m, 2, 3))
                (
                    m[4*0+0] *  (m[4*1+1] * m[4*2+2] - m[4*1+2] * m[4*2+1]) + 
                    m[4*0+1] * -(m[4*1+0] * m[4*2+2] - m[4*1+2] * m[4*2+0]) + 
                    m[4*0+2] *  (m[4*1+0] * m[4*2+1] - m[4*1+1] * m[4*2+0])
                )/det //M3Det(subMatrix(m, 3, 3))
            ]
        ]);
    },
    MatrixVectorMultiply = (m, v) => { //pre-multiply the tuple by a matrix.
        return Float32Array.from([
          m[4*0+0]*v[0] + m[4*0+1]*v[1] + m[4*0+2]*v[2] + m[4*0+3]*v[3],
          m[4*1+0]*v[0] + m[4*1+1]*v[1] + m[4*1+2]*v[2] + m[4*1+3]*v[3],
          m[4*2+0]*v[0] + m[4*2+1]*v[1] + m[4*2+2]*v[2] + m[4*2+3]*v[3],
          m[4*3+0]*v[0] + m[4*3+1]*v[1] + m[4*3+2]*v[2] + m[4*3+3]*v[3]
        ]);
    };

export default (async (cb) => {
    await run();

    cb({
        setVector,
        getVector,
        setMatrix,
        getMatrix,
        test : {
            VectorAdd: wasm.exports.VectorAdd, // function(a, b, y) {wasm.exports.VectorAdd(a, b, y); },
            VectorSub: wasm.exports.VectorSub, //function(a, b, y) {wasm.exports.VectorSub(a, b, y); },
            VectorNeg: wasm.exports.VectorNeg, //function(a, y) {wasm.exports.VectorNeg(a, y); },
            VectorMul: wasm.exports.VectorMul, //function(a, b, y) {wasm.exports.VectorMul(a, b, y); },
            VectorDiv: wasm.exports.VectorDiv, //function(a, b, y) {wasm.exports.VectorDiv(a, b, y); },
            VectorMag: wasm.exports.VectorMag, //function(a, b, y) {wasm.exports.VectorMag(a, b, y); },
            VectorNormalize: wasm.exports.VectorNormalize, //function(a, y) {wasm.exports.VectorNormalize(a, y); },
            VectorDot: wasm.exports.VectorDot, //function(a, b, y) {wasm.exports.VectorDot(a, b, y); }
            VectorCross: wasm.exports.VectorCross,
            ColorProduct: wasm.exports.ColorProduct,
            MatrixMultiply: wasm.exports.MatrixMultiply,
            MatrixTranspose: wasm.exports.MatrixTranspose,
            MatrixDeterminant: wasm.exports.MatrixDeterminant,
            MatrixInverse: wasm.exports.MatrixInverse,
            MatrixVectorMultiply: wasm.exports.MatrixVectorMultiply,

            Benchmark: wasm.exports.Benchmark
        },
        X,
        Y,
        Z,
        W,
        R,
        G,
        B,
        Point,
        Vector,
        VectorNeg,
        VectorMag,
        VectorNormalize,
        VectorAdd,
        VectorSub,
        VectorMul,
        VectorDiv,
        VectorDot,
        VectorCross,
        Color,
        ColorProduct,
        BLACK,
        WHITE,
        RED,
        GREEN,
        BLUE,
        YELLOW,
        CYAN,
        MAGENTA,
        ORIGIN,
        Matrix,
        MatrixIdentity,
        MatrixMultiply,
        MatrixTranspose,
        MatrixDeterminant,
        MatrixInverse,
        MatrixVectorMultiply
        /*
        hit,
        lighting,
        //shadeHit,
        //colorAt,
        // more OO style world classes/objects
        Ray,
        Light,
        Material,
        Patterns,
        Shape,
        Sphere,
        Plane,
        Cube,
        Cylinder,
        World,
        DefaultWorld,
        Camera,
        asJPEG*/
    });
});
