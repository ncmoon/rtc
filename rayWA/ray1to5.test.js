/*jshint esversion:8 */
console.log('ray1to5.test.js - start');

import {assert, isEqual} from './ray.test.js';

function testChapter1(lib) {
    /*
    var
        a = lib.tuple.new(4.3, -4.2, 3.1, 1.0);
    assert(isEqual(a, [4.3, -4.2, 3.1, 1]), 'expected tuple to be a point', a);
    a = lib.tuple.new(4.3, -4.2, 3.1, 0.0);
    assert(isEqual(a, [4.3, -4.2, 3.1, 0]), 'expected tuple to be a vector', a);
    */
    (() => {
        lib.test.VectorAdd(lib.setVector(0, [3, -2, 5, 1])*4, lib.setVector(4, [-2, 3, 1, 0])*4, 8*4);
        assert(isEqual(lib.getVector(8), [1, 1, 6, 1]), '$VectorAdd()', [1, 1, 6, 1], lib.getVector(8));
    })();
    (() => {
        lib.test.VectorSub(lib.setVector(0, [3, 2, 1, 1])*4, lib.setVector(4, [5, 6, 7, 1])*4, 8*4);
        assert(isEqual(lib.getVector(8), [-2, -4, -6, 0]), '$VectorSub(1)');

        lib.test.VectorSub(lib.setVector(0, [3, 2, 1, 1])*4, lib.setVector(4, [5, 6, 7, 0])*4, 8*4);
        assert(isEqual(lib.getVector(8), [-2, -4, -6, 1]), '$VectorSub(2)');

        lib.test.VectorSub(lib.setVector(0, [3, 2, 1, 0])*4, lib.setVector(4, [5, 6, 7, 0])*4, 8*4);
        assert(isEqual(lib.getVector(8), [-2, -4, -6, 0]), '$VectorSub(3)', lib.getVector(8));
    })();
    (() => {
        lib.test.VectorNeg(lib.setVector(0, [1, -2, 3, 1])*4, 8*4);
        assert(isEqual(lib.getVector(8), [-1, 2, -3, -1]), '$VectorNeg()', lib.getVector(8));
    })();
    (() => {
        lib.test.VectorMul(lib.setVector(0, [1, -2, 3, 1])*4, lib.setVector(4, [3.5, 3.5, 3.5, 3.5])*4, 8*4);
        assert(isEqual(lib.getVector(8), [3.5, -7, 10.5, 3.5]), '$VectorMul(1)', lib.getVector(8));

        lib.test.VectorMul(lib.setVector(0, [1, -2, 3, 1])*4, lib.setVector(4, [0.5, 0.5, 0.5, 0.5])*4, 8*4);
        assert(isEqual(lib.getVector(8), [0.5, -1, 1.5, 0.5]), '$VectorMul(2)', lib.getVector(8));                    
    })();
    (() => {
        lib.test.VectorDiv(lib.setVector(0, [1, -2, 3, 1])*4, lib.setVector(4, [2, 2, 2, 2])*4, 8*4);
        assert(isEqual(lib.getVector(8), [0.5, -1, 1.5, 0.5]), '$VectorDiv()', lib.getVector(8));
    })();
    (() => {
        lib.test.VectorMag(lib.setVector(0, [1, 0, 0, 0])*4, 8*4);
        assert(isEqual(lib.getVector(8), [1, 1, 1, 1]), '$VectorMag(1)', lib.getVector(8));

        lib.test.VectorMag(lib.setVector(0, [0, 1, 0, 0])*4, 8*4);
        assert(isEqual(lib.getVector(8), [1, 1, 1, 1]), '$VectorMag(2)', lib.getVector(8));

        lib.test.VectorMag(lib.setVector(0, [0, 0, 1, 0])*4, 8*4);
        assert(isEqual(lib.getVector(8), [1, 1, 1, 1]), '$VectorMag(3)', lib.getVector(8));

        lib.test.VectorMag(lib.setVector(0, [1, 2, 3, 0])*4, 8*4);
        assert(isEqual(lib.getVector(8), [Math.sqrt(14), Math.sqrt(14), Math.sqrt(14), Math.sqrt(14)]), '$VectorMag(4)', lib.getVector(8));

        lib.test.VectorMag(lib.setVector(0, [-1, -2, -3, 0])*4, 8*4);
        assert(isEqual(lib.getVector(8), [Math.sqrt(14), Math.sqrt(14), Math.sqrt(14), Math.sqrt(14)]), '$VectorMag(5)', lib.getVector(8));
    })();
    (() => {
        lib.test.VectorNormalize(lib.setVector(0, [4, 0, 0, 0])*4, 8*4);
        assert(isEqual(lib.getVector(8), [1, 0, 0, 0]), '$VectorNormalize(1)', lib.getVector(8));

        lib.test.VectorNormalize(lib.setVector(0, [1, 2, 3, 0])* 4, 8*4);
        assert(isEqual(lib.getVector(8), [1/Math.sqrt(14), 2/Math.sqrt(14), 3/Math.sqrt(14), 0]), '$VectorNormalize(2)', lib.getVector(8));

        lib.test.VectorNormalize(lib.setVector(0, [1, 2, 3, 0])*4, 4*4);
        lib.test.VectorMag(4*4, 8*4);
        assert(isEqual(lib.getVector(8), [1, 1, 1, 1]), '$VectorNormalize(3)', lib.getVector(8));
    })();
    (() => {
        lib.test.VectorDot(lib.setVector(0, [1,2,3,0])*4, lib.setVector(4, [2,3,4, 0])*4, 8*4);
        assert(isEqual(lib.getVector(8), [20, 20, 20, 20]), '$VectorDot()', lib.getVector(8));
    })();
    (() => {
        const
            c = lib.setVector(0, [1, 2, 3, 0]),
            d = lib.setVector(4, [2, 3, 4, 0]);
        lib.test.VectorCross(0*4, 4*4, 8*4);
        assert(isEqual(lib.getVector(8), [-1, 2, -1, 0]), '$VectorCross(1)', lib.getVector(8));
        lib.test.VectorCross(4*4, 0*4, 8*4)
        assert(isEqual(lib.getVector(8), [1, -2, 1, 0]), '$VectorCross(2)', lib.getVector(8));
    })();
} //testChapter1

function testChapter2(lib) {
    /*
    const
        c = lib.Color(-0.5, 0.4, 1.7);
    assert(isEqual(c, [-0.5, 0.4, 1.7, 0]), 'color(0)');
    assert(c[lib.R] == -0.5, 'color(r)');
    assert(c[lib.G] == 0.4, 'color(g)');
    assert(c[lib.B] == 1.7, 'color(b)');*/

    lib.test.VectorAdd(lib.setVector(0, [0.9, 0.6, 0.75, 0])*4, lib.setVector(4, [0.7, 0.1, 0.25, 0])*4, 8*4);
    assert(isEqual(lib.getVector(8), [1.6, 0.7, 1.0, 0]), 'color.add()', lib.getVector(8));
    lib.test.VectorSub(lib.setVector(0, [0.9, 0.6, 0.75, 0])*4, lib.setVector(4, [0.7, 0.1, 0.25, 0])*4, 8*4);
    assert(isEqual(lib.getVector(8), [0.2, 0.5, 0.5, 0]), 'color.subtract()', lib.getVector(8));
    lib.test.VectorMul(lib.setVector(0, [0.2, 0.3, 0.4, 0])*4, lib.setVector(4, [2, 2, 2, 2])*4, 8*4);
    assert(isEqual(lib.getVector(8), [0.4, 0.6, 0.8, 0]), 'color.times()', lib.getVector(8));
    lib.test.ColorProduct(lib.setVector(0, [1, 0.2, 0.4, 0])*4, lib.setVector(4, [0.9, 1, 0.1, 0])*4, 8*4);
    assert(isEqual(lib.getVector(8), [0.9, 0.2, 0.04, 0]), 'color.product()', lib.getVector(8));
} //testChapter2

function testChapter3(lib) {
    (() => {
        var
            m4 = [[1,2,3,4], [5.5,6.5,7.5,8.5], [9, 10, 11, 12], [13.5, 14.5, 15.5, 16.5]];
        lib.setMatrix(0, m4);
        assert(isEqual(lib.getMatrix(0), m4), 'Matrix.new()', lib.getMatrix(0), m4);  
    })();
    (() => {
        lib.test.MatrixMultiply(
            lib.setMatrix(0,  [[1,2,3,4],  [5,6,7,8],  [9,8,7,6], [5,4,3,2]])*4, 
            lib.setMatrix(16, [[-2,1,2,3], [3,2,1,-1], [4,3,6,5], [1,2,7,8]])*4, 
            32*4
        );
        assert(isEqual(lib.getMatrix(32), [[20,22,50,48], [44,54,114,108], [40,58,110,102], [16,26,46,42]]), 'Matrix.multiply()', lib.getMatrix(32));  
    })();
    (() => {
        lib.test.MatrixVectorMultiply(
            lib.setMatrix(0, [[1,2,3,4], [2,4,4,2], [8,6,4,1], [0,0,0,1]])*4, 
            lib.setVector(16, [1, 2, 3, 1])*4,
            32*4
        );
        assert(isEqual(lib.getVector(32), [18, 24, 33, 1]), 'MatrixVectorMultiply(M,v)', lib.getVector(32));
    })();

    const //TODO should be defined in ray lib
        MatrixIdentity = [[1,0,0,0], [0,1,0,0], [0,0,1,0], [0,0,0,1]];

    (() => {
        lib.test.MatrixMultiply(
            lib.setMatrix(0, [[0,1,2,4],[1,2,4,8],[2,4,8,16],[4,8,16,32]])*4,
            lib.setMatrix(16, MatrixIdentity)*4,
            32*4
        );
        assert(isEqual(lib.getMatrix(32), [[0,1,2,4],[1,2,4,8],[2,4,8,16],[4,8,16,32]]), 'MatrixIdentity(1)', lib.getMatrix(32));    

        lib.test.MatrixVectorMultiply(
            lib.setMatrix(0, MatrixIdentity)*4, 
            lib.setVector(16, [1,2,3,1])*4, 
            32*4
        );
        assert(isEqual(lib.getVector(32), [1,2,3,1]), 'MatrixIdentity(2)', lib.getVector(32));
    })();
    (() => {
        lib.test.MatrixTranspose(
            lib.setMatrix(0, [[0,9,3,0],[9,8,0,8],[1,8,5,3],[0,0,5,8]])*4,
            32*4
        );
        assert(isEqual(lib.getMatrix(32), [[0,9,1,0],[9,8,8,0],[3,0,5,5],[0,8,3,8]]), 'MatrixTranspose(1)', lib.getMatrix(32));

        lib.test.MatrixTranspose(
            lib.setMatrix(0, MatrixIdentity)*4, 
            32*4
        );
        assert(isEqual(lib.getMatrix(32), MatrixIdentity), 'MatrixTranspose(2)', lib.getMatrix(32));
    })();
    (() => {
        lib.test.MatrixDeterminant(
            lib.setMatrix(0, [[-2,-8,3,5], [-3,1,7,3], [1,2,-9,6], [-6,7,7,-9]])*4,
            32*4
        );
        assert(isEqual(lib.getVector(32)[0], -4071), 'MatrixDeterminant(5)', lib.getVector(32));
    })();
    (() => {
        var
            a0 = [[6,4,4,4], [5,5,7,6], [4,-9,3,-7], [9,1,7,-6]],
            a1 = [[-4,2,-2,-3], [9,6,2,6], [0,-5,1,-5], [0,0,0,0]],
            a2 = [[-5,2,6,-8], [1,-5,1,8], [7,7,-6,-7], [1,-3,7,4]];
        lib.test.MatrixDeterminant(
            lib.setMatrix(0, a0)*4,
            32*4
        );
        assert(isEqual(lib.getVector(32)[0], -2120), 'MatrixInverse(1)', lib.getVector(32));  
        lib.test.MatrixDeterminant(
            lib.setMatrix(0, a1)*4,
            32*4
        );
        assert(isEqual(lib.getVector(32)[0], 0), 'MatrixInverse(2)', lib.getVector(32));  

        lib.test.MatrixDeterminant(
            lib.setMatrix(0, a2)*4,
            32*4
        );
        assert(isEqual(lib.getVector(32)[0], 532), 'MatrixInverse(3)');

        lib.test.MatrixInverse(
            lib.setMatrix(0, a2)*4,
            32*4
        ); 
        assert(isEqual(lib.getMatrix(32)[3][2], -160/532), 'MatrixInverse(5)', lib.getMatrix(32));
        assert(isEqual(lib.getMatrix(32)[2][3], 105/532), 'MatrixInverse(7)', lib.getMatrix(32));
        assert(isEqual(lib.getMatrix(32), [
            [ 0.21804511278195488,   0.45112781954887216,    0.24060150375939848,    -0.045112781954887216 ],
            [-0.8082706766917294,   -1.4567669172932332,    -0.44360902255639095,     0.5206766917293233   ],
            [-0.07894736842105263,  -0.2236842105263158,    -0.05263157894736842,     0.19736842105263158  ],
            [-0.5225563909774437,   -0.8139097744360902,    -0.3007518796992481,      0.30639097744360905  ]
        ]), 'MatrixInverse(8)', lib.getMatrix(32));
    })();
    (() => {
        lib.setMatrix(0, [[3,-9,7,3],[3,-8,2,-9],[-4,4,4,1],[-6,5,-1,1]]); // a
        lib.setMatrix(16, [[8,2,2,2],[3,-1,7,0],[7,0,5,4],[6,-2,0,5]]);    // b
        lib.test.MatrixInverse(16*4, 32*4);                                //~b
        lib.test.MatrixMultiply(0*4, 16*4, 48*4);                          // c = a*b
        lib.test.MatrixMultiply(48*4, 32*4, 64*4);                         // c*~b = a 
        assert(isEqual(lib.getMatrix(64), [[3,-9,7,3],[3,-8,2,-9],[-4,4,4,1],[-6,5,-1,1]]), 'MatrixInverse*product', lib.getMatrix(64));    
    })();
} //testChapter3

function testChapter4(lib) {
    /*
    (function() {
        const
            transform = lib.m4x4.translate(5, -3, 2);
        assert(isEqual(lib.tuple.multiply(transform, lib.tuple.point(-3, 4, 5)), lib.tuple.point(2, 1, 7)), 'm4x4.translate(1)', transform, lib.tuple.multiply(transform, lib.tuple.point(-3, 4, 5)));
        assert(isEqual(lib.tuple.multiply(lib.m4x4.inverse(transform), lib.tuple.point(-3,4,5)), lib.tuple.point(-8, 7, 3)), 'm4x4.translate(2)');
        const
            v = lib.tuple.vector(-3, 4, 5);
        assert(isEqual(lib.tuple.multiply(transform, v), v), 'm4x4.translate(3)');
    })();

    (function() {
        const
            transform = lib.m4x4.scale(2, 3, 4);
        assert(isEqual(lib.tuple.multiply(transform, lib.tuple.point(-4, 6, 8)), lib.tuple.point(-8, 18, 32)), 'm4x4.scale(1)');
        assert(isEqual(lib.tuple.multiply(transform, lib.tuple.vector(-4, 6, 8)), lib.tuple.vector(-8, 18, 32)), 'm4x4.scale(2)');
        assert(isEqual(lib.tuple.multiply(lib.m4x4.inverse(transform), lib.tuple.vector(-4, 6, 8)), lib.tuple.vector(-2, 2, 2)), 'm4x4.scale(3)');
        assert(isEqual(lib.tuple.multiply(lib.m4x4.scale(-1, 1, 1), lib.tuple.point(2, 3, 4)), lib.tuple.point(-2, 3, 4)), 'm4x4.scale(4)');
    })();

    (function() {
        const
            p = lib.tuple.point(0, 1, 0);
        assert(isEqual(lib.tuple.multiply(lib.m4x4.rotateX(Math.PI/4), p), lib.tuple.point(0, Math.sqrt(2)/2, Math.sqrt(2)/2)), 'm4x4.rotateX(1)', p, lib.m4x4.rotateX(Math.PI/4));
        assert(isEqual(lib.tuple.multiply(lib.m4x4.rotateX(Math.PI/2), p), lib.tuple.point(0, 0, 1)), 'm4x4.rotateX(2)', p, lib.m4x4.rotateX(Math.PI/2));
    })();
    (function() {
        const
            p = lib.tuple.point(0, 0, 1);
        assert(isEqual(lib.tuple.multiply(lib.m4x4.rotateY(Math.PI/4), p), lib.tuple.point(Math.sqrt(2)/2, 0, Math.sqrt(2)/2)), 'm4x4.rotateY(1)', p, lib.m4x4.rotateY(Math.PI/4));
        assert(isEqual(lib.tuple.multiply(lib.m4x4.rotateY(Math.PI/2), p), lib.tuple.point(1, 0, 0)), 'm4x4.rotateY(2)', p, lib.m4x4.rotateY(Math.PI/2));
    })();
    (function() {
        const
            p = lib.tuple.point(0, 1, 0);
        assert(isEqual(lib.tuple.multiply(lib.m4x4.rotateZ(Math.PI/4), p), lib.tuple.point(-Math.sqrt(2)/2, Math.sqrt(2)/2, 0), 'm4x4.rotateZ(1)', p, lib.m4x4.rotateZ(Math.PI/4),
            lib.tuple.multiply(lib.m4x4.rotateZ(Math.PI/4), p), lib.tuple.point(-Math.sqrt(2)/2, Math.sqrt(2)/2, 0)));
        assert(isEqual(lib.tuple.multiply(lib.m4x4.rotateZ(Math.PI/2), p), lib.tuple.point(-1, 0, 0)), 'm4x4.rotateZ(2)', p, lib.m4x4.rotateZ(Math.PI/2), lib.tuple.multiply(lib.m4x4.rotateZ(Math.PI/2), p));
    })();

    (function() {
        const
            p = lib.tuple.point(2, 3, 4),
            transform = lib.m4x4.shear(1, 0, 0, 0, 0, 0);
        assert(isEqual(lib.tuple.multiply(lib.m4x4.shear(1, 0, 0, 0, 0, 0), p), lib.tuple.point(5,3,4)), 'm4x4.shear(1)');
        assert(isEqual(lib.tuple.multiply(lib.m4x4.shear(0, 1, 0, 0, 0, 0), p), lib.tuple.point(6,3,4)), 'm4x4.shear(2)');
        assert(isEqual(lib.tuple.multiply(lib.m4x4.shear(0, 0, 1, 0, 0, 0), p), lib.tuple.point(2,5,4)), 'm4x4.shear(3)');
        assert(isEqual(lib.tuple.multiply(lib.m4x4.shear(0, 0, 0, 1, 0, 0), p), lib.tuple.point(2,7,4)), 'm4x4.shear(4)');
        assert(isEqual(lib.tuple.multiply(lib.m4x4.shear(0, 0, 0, 0, 1, 0), p), lib.tuple.point(2,3,6)), 'm4x4.shear(5)');
        assert(isEqual(lib.tuple.multiply(lib.m4x4.shear(0, 0, 0, 0, 0, 1), p), lib.tuple.point(2,3,7)), 'm4x4.shear(6)');
    })();

    (function() {
        const
            p = lib.tuple.point(1, 0, 1),
            A = lib.m4x4.rotateX(Math.PI/2),
            B = lib.m4x4.scale(5,5,5),
            C = lib.m4x4.translate(10,5,7),
            p2 = lib.tuple.multiply(A, p),
            p3 = lib.tuple.multiply(B, p2),
            p4 = lib.tuple.multiply(C, p3);
        assert(isEqual(p2, lib.tuple.point(1, -1, 0)), 'm4x4.combine(1)', p2);
        assert(isEqual(p3, lib.tuple.point(5, -5, 0)), 'm4x4.combine(2)', p3);
        assert(isEqual(p4, lib.tuple.point(15, 0, 7)), 'm4x4.combine(3)', p4);
        const
            T = lib.m4x4.multiply(C, lib.m4x4.multiply(B, A));
        assert(isEqual(lib.tuple.multiply(T, p), lib.tuple.point(15, 0, 7)), 'm4x4.combine(4)');
    })();
    */
} //testChapter4

function testChapter5(lib) {
    (function() {
        const
            p = lib.tuple.point(1, 2, 3),
            v = lib.tuple.vector(4, 5, 6),
            r = lib.Ray(p, v);
        assert(isEqual(r.origin, p) && isEqual(r.direction, v), 'ray.new(1)');
    })();
    (function() {
        const
            r = lib.Ray(lib.tuple.point(2, 3, 4), lib.tuple.vector(1, 0, 0));
        assert(isEqual(r.position(0), lib.tuple.point(2, 3, 4)), 'ray.position(1)');
        assert(isEqual(r.position(1), lib.tuple.point(3, 3, 4)), 'ray.position(2)');
        assert(isEqual(r.position(-1), lib.tuple.point(1, 3, 4)), 'ray.position(3)');
        assert(isEqual(r.position(2.5), lib.tuple.point(4.5, 3, 4)), 'ray.position(4)');
    })();

    (function() {
        const
            r = lib.Ray(lib.tuple.point(0, 0, -5), lib.tuple.vector(0, 0, 1)),
            s = lib.Sphere(),
            xs = s.intersects(r);
        assert((xs.length == 2) && (xs[0].t == 4) && (xs[1].t == 6), 'sphere.intersects(1)', xs);
    })();
    (function() {
        const
            r = lib.Ray(lib.tuple.point(0, 1, -5), lib.tuple.vector(0, 0, 1)),
            s = lib.Sphere(),
            xs = s.intersects(r);
        assert((xs.length == 2) && (xs[0].t == 5) && (xs[1].t == 5), 'sphere.intersects(2)', xs);
    })();
    (function() {
        const
            r = lib.Ray(lib.tuple.point(0, 2, -5), lib.tuple.vector(0, 0, 1)),
            s = lib.Sphere(),
            xs = s.intersects(r);
        assert(xs.length == 0, 'sphere.intersects(3)', xs);
    })();
    (function() {
        const
            r = lib.Ray(lib.tuple.point(0, 0, 0), lib.tuple.vector(0, 0, 1)),
            s = lib.Sphere(),
            xs = s.intersects(r);
        assert((xs.length == 2) && (xs[0].t == -1) && (xs[1].t == 1), 'sphere.intersects(4)', xs);
    })();
    (function() {
        const
            r = lib.Ray(lib.tuple.point(0, 0, 5), lib.tuple.vector(0, 0, 1)),
            s = lib.Sphere(),
            xs = s.intersects(r);
        assert((xs.length == 2) && (xs[0].t == -6) && (xs[1].t == -4), 'sphere.intersects(5)', xs);
    })();

    (function() {
        const
            s = lib.Sphere(),
            xs = [{obj: s, t: 1}, {obj: s, t: 2}];
        assert(lib.hit(xs).t == 1, 'hit(1)', xs);
    })();
    (function() {
        const
            s = lib.Sphere(),
            xs = [{obj: s, t: -1}, {obj: s, t: 1}];
        assert(lib.hit(xs).t == 1, 'hit(2)', xs);
    })();
    (function() {
        const
            s = lib.Sphere(),
            xs = [{obj: s, t: -2}, {obj: s, t: -1}];
        assert(lib.hit(xs) === undefined, 'hit(3)', xs);
    })();

    (function() {
        const
            r = lib.Ray(lib.tuple.point(1, 2, 3), lib.tuple.vector(0, 1, 0)),
            m = lib.m4x4.translate(3,4,5),
            r2 = r.transform(m);
        assert(isEqual(r2.origin, lib.tuple.point(4,6,8)) && isEqual(r2.direction, lib.tuple.vector(0,1,0)), 'ray.transform(1)', r2);
    })();
    (function() {
        const
            r = lib.Ray(lib.tuple.point(1, 2, 3), lib.tuple.vector(0, 1, 0)),
            m = lib.m4x4.scale(2,3,4),
            r2 = r.transform(m);
        assert(isEqual(r2.origin, lib.tuple.point(2, 6, 12)) && isEqual(r2.direction, lib.tuple.vector(0,3,0)), 'ray.transform(2)', r2);
    })();

    (function() {
        const
            s = lib.Sphere(),
            t = lib.m4x4.translate(2, 3, 4);
        s.transform = t;
        assert(isEqual(s.transform, t), 'sphere.transform(1)');
    })();
    (function() {
        const
            r = lib.Ray(lib.tuple.point(0,0,-5), lib.tuple.vector(0,0,1)),
            s = lib.Sphere(),
            t = lib.m4x4.scale(2, 2, 2);
        s.transform = t;
        const
            xs = s.intersects(r);
        assert((xs.length == 2) && (xs[0].t == 3) && (xs[1].t == 7), 'sphere.transform(2)', xs);
    })();
    (function() {
        const
            r = lib.Ray(lib.tuple.point(0,0,-5), lib.tuple.vector(0,0,1)),
            s = lib.Sphere(),
            t = lib.m4x4.translate(5, 0, 0);
        s.transform = t;
        const
            xs = s.intersects(r);
        assert(xs.length == 0, 'sphere.transform(3)', xs);
    })();
} //testChapter5

export {
    testChapter1,
    testChapter2,
    testChapter3,
    testChapter4,
    testChapter5
};
console.log('ray1to5.test.js - end');
