/*jshint esversion:8 */
console.log('ray.js');
/*

  TODO
  ====

  1) get ch 1..3 working                                               [OK]
  2) rewrite so vectors are a Float32Array(4) rather than simple Array [OK]
  3) flatten coding for matrix inverse                                 [OK]
  4) rewrite so Matrix is stored as Float32Array(16)                   [OK]
  5) add .wat file
  6) add a compile.js script
  7) include .wasm in ray.js
  8) migrate vector functions to wasm
  9) change benchmark to use old v new code....

*/
const 
    X = 0,
    Y = 1,
    Z = 2,
    W = 3,
    R = 0,
    G = 1,
    B = 2,
    //TODO should create an f32x4 rather than [x,y,z,0|1]
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

export default {
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
};