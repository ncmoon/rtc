/*jshint esversion:8 */


const 
    //tuples as Float32 Arrays
    tuple = {
        //constructors
        new: (x, y, z, w) => Float32Array.of(x, y, z, w),
        point: (x, y, z) => { return tuple.new(x, y, z, 1); },
        vector: (x, y, z) => { return tuple.new(x, y, z, 0); },
        color: (r, g, b) => { return tuple.new(r, g, b, 0); },
        //unary operators
        negate: (a) => { return tuple.new(-a[X], -a[Y], -a[Z], -a[W]); },
        magnitude: (v) => { return Math.sqrt(v[X]*v[X] + v[Y]*v[Y] + v[Z]*v[Z] + v[W]*v[W]); },
        normalize: (v) => {
            var m = tuple.magnitude(v);
            return tuple.new(v[X]/m, v[Y]/m, v[Z]/m, v[W]/m);
        },
        //binary operators
        add: (a, b) => { return tuple.new(a[X] + b[X], a[Y] + b[Y], a[Z] + b[Z], a[W] + b[W]); },
        subtract: (a, b) => { return tuple.new(a[X] - b[X], a[Y] - b[Y], a[Z] - b[Z], a[W] - b[W]); },
        times: (v, s) => { return tuple.new(v[X] * s, v[Y] * s, v[Z] * s, v[W] * s); },
        divide: (v, s) => { return tuple.new(v[X] / s, v[Y] / s, v[Z] / s, v[W] / s); },
        dot: (u, v) => u[X]*v[X] + u[Y]*v[Y] + u[Z]*v[Z] + u[W]*v[W],
        cross: (u, v) => { return tuple.vector(u[Y]*v[Z] - u[Z]*v[Y], u[Z]*v[X] - u[X]*v[Z], u[X]*v[Y] - u[Y]*v[X]); },
        product: (c, d) => { //shurr/hadamar product for colors
            return tuple.color(c[R] * d[R], c[G] * d[G], c[B] * d[B]); 
        }, 
        multiply: (m, v) => { //pre-multiply the tuple by a matrix.
          return tuple.new(
            m[0][0]*v[0] + m[0][1]*v[1] + m[0][2]*v[2] + m[0][3]*v[3],
            m[1][0]*v[0] + m[1][1]*v[1] + m[1][2]*v[2] + m[1][3]*v[3],
            m[2][0]*v[0] + m[2][1]*v[1] + m[2][2]*v[2] + m[2][3]*v[3],
            m[3][0]*v[0] + m[3][1]*v[1] + m[3][2]*v[2] + m[3][3]*v[3]
          );
        }
    },
    X = 'x',
    Y = 'y',
    Z = 'z',
    W = 'w',
    R = 0,
    G = 1,
    B = 2,
    tuple2 = {
        //tuples as objects not arrays
        //constructors
        new: (x, y, z, w) => { return {x: x, y: y, z: z, w: w}; },
        point: (x, y, z) => { return tuple.new(x, y, z, 1); },
        vector: (x, y, z) => { return tuple.new(x, y, z, 0); },
        color: (r, g, b) => { return tuple.new(r, g, b, 0); },
        //unary operators
        negate: (a) => { return tuple.new(-a[X], -a[Y], -a[Z], -a[W]); },
        magnitude: (v) => { return Math.sqrt(v[X]*v[X] + v[Y]*v[Y] + v[Z]*v[Z] + v[W]*v[W]); },
        normalize: (v) => {
            var m = tuple.magnitude(v);
            return tuple.new(v[X]/m, v[Y]/m, v[Z]/m, v[W]/m);
        },
        //binary operators
        add: (a, b) => { return tuple.new(a[X] + b[X], a[Y] + b[Y], a[Z] + b[Z], a[W] + b[W]); },
        subtract: (a, b) => { return tuple.new(a[X] - b[X], a[Y] - b[Y], a[Z] - b[Z], a[W] - b[W]); },
        times: (v, s) => { return tuple.new(v[X] * s, v[Y] * s, v[Z] * s, v[W] * s); },
        divide: (v, s) => { return tuple.new(v[X] / s, v[Y] / s, v[Z] / s, v[W] / s); },
        dot: (u, v) => u[X]*v[X] + u[Y]*v[Y] + u[Z]*v[Z] + u[W]*v[W],
        cross: (u, v) => { return tuple.vector(u[Y]*v[Z] - u[Z]*v[Y], u[Z]*v[X] - u[X]*v[Z], u[X]*v[Y] - u[Y]*v[X]); },
        product: (c, d) => { //shurr/hadamar product for colors
            return tuple.color(c[R] * d[R], c[G] * d[G], c[B] * d[B]); 
        }, 
        multiply: (m, v) => { //pre-multiply the tuple by a matrix.
          return tuple.new(
            m[0][0]*v[X] + m[0][1]*v[Y] + m[0][2]*v[Z] + m[0][3]*v[W],
            m[1][0]*v[X] + m[1][1]*v[Y] + m[1][2]*v[Z] + m[1][3]*v[W],
            m[2][0]*v[X] + m[2][1]*v[Y] + m[2][2]*v[Z] + m[2][3]*v[W],
            m[3][0]*v[X] + m[3][1]*v[Y] + m[3][2]*v[Z] + m[3][3]*v[W]
          );
        }
    };


export default {
    X,
    Y,
    Z,
    W,
    R,
    G,
    B,
    tuple
};