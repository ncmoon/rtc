/*jshint esversion:8 */
console.log('ray1to5.test.js - start');


import { PerformanceObserver, performance } from 'node:perf_hooks';
import lib from './ray.js';
import {assert, isEqual} from './ray.test.js';

function testChapter1() {
    //TODO put closures around each test section.
    var
      a = lib.tuple.new(4.3, -4.2, 3.1, 1.0);
    assert(isEqual(a, [4.3, -4.2, 3.1, 1]), 'expected tuple to be a point', a);
    a = lib.tuple.new(4.3, -4.2, 3.1, 0.0);
    assert(isEqual(a, [4.3, -4.2, 3.1, 0]), 'expected tuple to be a vector', a);

    var p = lib.tuple.point(4, -4, 3);
    assert(isEqual(p, [4, -4, 3, 1]), 'expected tuple to be a point', p);
    var v = lib.tuple.vector(4, -4, 3);
    assert(isEqual(v, [4, -4, 3, 0]), 'expected tuple to be a vector', v);

    assert(isEqual(lib.tuple.add(lib.tuple.new(3, -2, 5, 1), lib.tuple.new(-2, 3, 1, 0)), [1, 1, 6, 1]), 'tuple.add()');
    assert(isEqual(lib.tuple.subtract(lib.tuple.point(3, 2, 1), lib.tuple.point(5, 6, 7)), [-2, -4, -6, 0]), 'tuple.subtract(1)');
    assert(isEqual(lib.tuple.subtract(lib.tuple.point(3, 2, 1), lib.tuple.vector(5, 6, 7)), [-2, -4, -6, 1]), 'tuple.subtract(2)');
    assert(isEqual(lib.tuple.subtract(lib.tuple.vector(3, 2, 1), lib.tuple.vector(5, 6, 7)), [-2, -4, -6, 0]), 'tuple.subtract(3)');
    assert(isEqual(lib.tuple.negate(lib.tuple.new(1, -2, 3, -4)), [-1, 2, -3, 4]), 'tuple.negate()');
    assert(isEqual(lib.tuple.times(lib.tuple.new(1, -2, 3, -4), 3.5), [3.5, -7, 10.5, -14]), 'tuple.times(1)');
    assert(isEqual(lib.tuple.times(lib.tuple.new(1, -2, 3, -4), 0.5), [0.5, -1, 1.5, -2]), 'tuple.times(2)');
    assert(isEqual(lib.tuple.divide(lib.tuple.new(1, -2, 3, -4), 2), [0.5, -1, 1.5, -2]), 'tuple.divide()');
    assert(isEqual(lib.tuple.magnitude(lib.tuple.vector(1, 0, 0)), 1), 'tuple.magnitude(1)');
    assert(isEqual(lib.tuple.magnitude(lib.tuple.vector(0, 1, 0)), 1), 'tuple.magnitude(2)');
    assert(isEqual(lib.tuple.magnitude(lib.tuple.vector(0, 0, 1)), 1), 'tuple.magnitude(3)');
    assert(isEqual(lib.tuple.magnitude(lib.tuple.vector(1, 2, 3)), Math.sqrt(14)), 'tuple.magnitude(4)');
    assert(isEqual(lib.tuple.magnitude(lib.tuple.vector(-1, -2, -3)), Math.sqrt(14)), 'tuple.magnitude(5)');
    assert(isEqual(lib.tuple.normalize(lib.tuple.vector(4, 0, 0)), lib.tuple.vector(1, 0, 0)), 'tuple.normalize(1)');
    assert(isEqual(lib.tuple.normalize(lib.tuple.vector(1, 2, 3)), lib.tuple.vector(1/Math.sqrt(14), 2/Math.sqrt(14), 3/Math.sqrt(14))), 'tuple.normalize(2)');
    assert(isEqual(lib.tuple.magnitude(lib.tuple.normalize(lib.tuple.vector(1, 2, 3))), 1), 'tuple.normalize(3)');
    assert(isEqual(lib.tuple.dot(lib.tuple.vector(1,2,3), lib.tuple.vector(2,3,4)), 20), 'tuple.dot()');

    (function() {
        const
            c = lib.tuple.vector(1, 2, 3),
            d = lib.tuple.vector(2, 3, 4);
        assert(isEqual(lib.tuple.cross(c, d), lib.tuple.vector(-1, 2, -1)), 'tuple.cross(1)');
        assert(isEqual(lib.tuple.cross(d, c), lib.tuple.vector(1, -2, 1)), 'tuple.cross(2)');
    })();
} //testChapter1

function testChapter2() {
    const
      c = lib.tuple.color(-0.5, 0.4, 1.7);
    assert(isEqual(c, [-0.5, 0.4, 1.7, 0]), 'color(0)');
    assert(c[lib.R] == -0.5, 'color(r)');
    assert(c[lib.G] == 0.4, 'color(g)');
    assert(c[lib.B] == 1.7, 'color(b)');

    assert(isEqual(lib.tuple.add(lib.tuple.color(0.9, 0.6, 0.75), lib.tuple.color(0.7, 0.1, 0.25)), [1.6, 0.7, 1.0, 0]), 'color.add()');
    assert(isEqual(lib.tuple.subtract(lib.tuple.color(0.9, 0.6, 0.75), lib.tuple.color(0.7, 0.1, 0.25)), [0.2, 0.5, 0.5, 0]), 'color.subtract()');
    assert(isEqual(lib.tuple.times(lib.tuple.color(0.2, 0.3, 0.4), 2), [0.4, 0.6, 0.8, 0]), 'color.times()');
    assert(isEqual(lib.tuple.product(lib.tuple.color(1, 0.2, 0.4), lib.tuple.color(0.9, 1, 0.1)), [0.9, 0.2, 0.04, 0]), 'color.product()');
} //testChapter2

function testChapter3() {
    var
        m2 = [[1,2], [5.5,6.5]],
        m3 = [[1,2,3], [5.5,6.5,7.5], [9, 10, 11]],
        m4 = [[1,2,3,4], [5.5,6.5,7.5,8.5], [9, 10, 11, 12], [13.5, 14.5, 15.5, 16.5]];
    assert(isEqual(lib.m4x4.new(m4), m4), 'm4x4.new()', lib.m4x4.new(m4), m4);
    assert(isEqual(lib.m3x3.new(m3), m3), 'm3x3.new()', lib.m3x3.new(m3), m3);
    assert(isEqual(lib.m2x2.new(m2), m2), 'm2x2.new()', lib.m2x2.new(m2), m2);

    var
      a = lib.m4x4.new([[1,2,3,4], [5,6,7,8], [9,8,7,6], [5,4,3,2]]),
      b = lib.m4x4.new([[-2,1,2,3], [3,2,1,-1], [4,3,6,5], [1,2,7,8]]);
    assert(isEqual(lib.m4x4.multiply(a, b), [[20,22,50,48], [44,54,114,108], [40,58,110,102], [16,26,46,42]]), 'm4x4.multiply()', a, b, lib.m4x4.multiply(a, b));

    var
        m = lib.m4x4.new([[1,2,3,4], [2,4,4,2], [8,6,4,1], [0,0,0,1]]),
        v = lib.tuple.new(1,2,3,1);
    assert(isEqual(lib.tuple.multiply(m, v), lib.tuple.new(18, 24, 33, 1)), 'tuple.multiply(M,v)', lib.tuple.multiply(m, v));

    var
        n = lib.m4x4.new([[0,1,2,4],[1,2,4,8],[2,4,8,16],[4,8,16,32]]);
    assert(isEqual(lib.m4x4.multiply(n, lib.m4x4.identity()), n), 'm4x4.identity(1)', lib.m4x4.multiply(n, lib.m4x4.identity()), n, lib.m4x4.identity());    
    assert(isEqual(lib.tuple.multiply(lib.m4x4.identity(), lib.tuple.new(1,2,3,4)), lib.tuple.new(1,2,3,4)), 'm4x4.identity(2)');

    assert(isEqual(lib.m4x4.transpose(lib.m4x4.new([[0,9,3,0],[9,8,0,8],[1,8,5,3],[0,0,5,8]])), lib.m4x4.new([[0,9,1,0],[9,8,8,0],[3,0,5,5],[0,8,3,8]])), 'm4x4.transpose(1)');
    assert(isEqual(lib.m4x4.transpose(lib.m4x4.identity()), lib.m4x4.identity()), 'm4x4.transpose(2)');

    assert(isEqual(lib.m2x2.determinant(lib.m2x2.new([[1,5],[-3,2]])), 17), 'm2x2.determinant()');

    assert(isEqual(lib.m3x3.subMatrix(lib.m3x3.new([[1,5,0],[-3,2,7],[0,6,-3]]), 0, 2), lib.m2x2.new([[-3,2],[0,6]])), 'm3x3.subMatrix()');
    assert(isEqual(lib.m4x4.subMatrix(lib.m4x4.new([[-6,1,1,6],[-8,5,8,6],[-1,0,8,2],[-7,1,-1,1]]), 2, 1), lib.m3x3.new([[-6,1,6],[-8,8,6],[-7,-1,1]])), 'm4x4.subMatrix()');

    (function() {
        var 
            a = lib.m3x3.new([[3,5,0],[2,-1,-7],[6,-1,5]]);
        assert(isEqual(lib.m2x2.determinant(lib.m3x3.subMatrix(a, 1, 0)), 25), 'm3x3.minor(1)', lib.m2x2.determinant(lib.m3x3.subMatrix(a)));
        assert(isEqual(lib.m3x3.minor(a, 1, 0), 25), 'm3x3.minor(2)');
        assert(isEqual(lib.m3x3.minor(a, 0, 0), -12), 'm3x3.coFactor(1)');
        assert(isEqual(lib.m3x3.coFactor(a, 0, 0), -12), 'm3x3.coFactor(2)', lib.m3x3.coFactor(a, 0, 0));
        assert(isEqual(lib.m3x3.coFactor(a, 1, 0), -25), 'm3x3.coFactor(3)', lib.m3x3.coFactor(a, 1, 0));
    })();

    (function() {
        var
            a = lib.m3x3.new([[1,2,6], [-5,8,-4], [2,6,4]]);
        assert(isEqual(lib.m3x3.coFactor(a, 0, 0), 56), 'm3x3.determinant(1)');    
        assert(isEqual(lib.m3x3.coFactor(a, 0, 1), 12), 'm3x3.determinant(2)');    
        assert(isEqual(lib.m3x3.coFactor(a, 0, 2), -46), 'm3x3.determinant(3)');    
        assert(isEqual(lib.m3x3.determinant(a), -196), 'm3x3.determinant(4)');  
    })();

    (function() {
        var
            a = lib.m4x4.new([[-2,-8,3,5], [-3,1,7,3], [1,2,-9,6], [-6,7,7,-9]]);
        assert(isEqual(lib.m4x4.coFactor(a, 0, 0), 690), 'm4x4.determinant(1)', a, lib.m4x4.coFactor(a, 0, 0));    
        assert(isEqual(lib.m4x4.coFactor(a, 0, 1), 447), 'm4x4.determinant(2)');    
        assert(isEqual(lib.m4x4.coFactor(a, 0, 2), 210), 'm4x4.determinant(3)');  
        assert(isEqual(lib.m4x4.coFactor(a, 0, 3), 51), 'm4x4.determinant(4)');    
        assert(isEqual(lib.m4x4.determinant(a), -4071), 'm4x4.determinant(5)');
    })();

    (function() {
        var
          a0 = lib.m4x4.new([[6,4,4,4], [5,5,7,6], [4,-9,3,-7], [9,1,7,-6]]),
          a1 = lib.m4x4.new([[-4,2,-2,-3], [9,6,2,6], [0,-5,1,-5], [0,0,0,0]]),
          a2 = lib.m4x4.new([[-5,2,6,-8], [1,-5,1,8], [7,7,-6,-7], [1,-3,7,4]]);
        assert(isEqual(lib.m4x4.determinant(a0), -2120), 'm4x4.inverse(1)');  
        assert(isEqual(lib.m4x4.determinant(a1), 0), 'm4x4.inverse(2)');  
        var
          b = lib.m4x4.inverse(a2); 
        assert(isEqual(lib.m4x4.determinant(a2), 532), 'm4x4.inverse(3)');
        assert(isEqual(lib.m4x4.coFactor(a2, 2, 3), -160), 'm4x4.inverse(4)');
        assert(isEqual(b[3][2], -160/532), 'm4x4.inverse(5)');
        assert(isEqual(lib.m4x4.coFactor(a2, 3, 2), 105), 'm4x4.inverse(6)');
        assert(isEqual(b[2][3], 105/532), 'm4x4.inverse(7)');
        assert(isEqual(b, [
            [
                0.21804511278195488,
                0.45112781954887216,
                0.24060150375939848,
                -0.045112781954887216
            ],
            [
                -0.8082706766917294,
                -1.4567669172932332,
                -0.44360902255639095,
                0.5206766917293233
            ],
            [
                -0.07894736842105263,
                -0.2236842105263158,
                -0.05263157894736842,
                0.19736842105263158
            ],
            [
                -0.5225563909774437,
                -0.8139097744360902,
                -0.3007518796992481,
                0.30639097744360905
            ]
        ]), 'm4x4.inverse(8)', b);
    })();

    (function() {
        const
            a = lib.m4x4.new([[3,-9,7,3],[3,-8,2,-9],[-4,4,4,1],[-6,5,-1,1]]),
            b = lib.m4x4.new([[8,2,2,2],[3,-1,7,0],[7,0,5,4],[6,-2,0,5]]),
            c = lib.m4x4.multiply(a, b);
        assert(isEqual(lib.m4x4.multiply(c, lib.m4x4.inverse(b)), a), 'm4x4.inverse*product', c, lib.m4x4.multiply(c, lib.m4x4.inverse(b)));    
    })();
} //testChapter3

function testChapter4() {
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
} //testChapter4

function testChapter5() {
    (function() {
        const
            p = lib.tuple.point(1, 2, 3),
            v = lib.tuple.vector(4, 5, 6),
            r = lib.ray.new(p, v);
        assert(isEqual(r.origin, p) && isEqual(r.direction, v), 'ray.new(1)');
    })();
    (function() {
        const
            r = lib.ray.new(lib.tuple.point(2, 3, 4), lib.tuple.vector(1, 0, 0));
        assert(isEqual(lib.ray.position(r, 0), lib.tuple.point(2, 3, 4)), 'ray.position(1)');
        assert(isEqual(lib.ray.position(r, 1), lib.tuple.point(3, 3, 4)), 'ray.position(2)');
        assert(isEqual(lib.ray.position(r, -1), lib.tuple.point(1, 3, 4)), 'ray.position(3)');
        assert(isEqual(lib.ray.position(r, 2.5), lib.tuple.point(4.5, 3, 4)), 'ray.position(4)');
    })();

    (function() {
        const
            r = lib.ray.new(lib.tuple.point(0, 0, -5), lib.tuple.vector(0, 0, 1)),
            s = lib.sphere.new(),
            xs = lib.sphere.intersects(s, r);
        assert((xs.length == 2) && (xs[0].t == 4) && (xs[1].t == 6), 'sphere.intersects(1)', xs);
    })();
    (function() {
        const
            r = lib.ray.new(lib.tuple.point(0, 1, -5), lib.tuple.vector(0, 0, 1)),
            s = lib.sphere.new(),
            xs = lib.sphere.intersects(s, r);
        assert((xs.length == 2) && (xs[0].t == 5) && (xs[1].t == 5), 'sphere.intersects(2)', xs);
    })();
    (function() {
        const
            r = lib.ray.new(lib.tuple.point(0, 2, -5), lib.tuple.vector(0, 0, 1)),
            s = lib.sphere.new(),
            xs = lib.sphere.intersects(s, r);
        assert(xs.length == 0, 'sphere.intersects(3)', xs);
    })();
    (function() {
        const
            r = lib.ray.new(lib.tuple.point(0, 0, 0), lib.tuple.vector(0, 0, 1)),
            s = lib.sphere.new(),
            xs = lib.sphere.intersects(s, r);
        assert((xs.length == 2) && (xs[0].t == -1) && (xs[1].t == 1), 'sphere.intersects(4)', xs);
    })();
    (function() {
        const
            r = lib.ray.new(lib.tuple.point(0, 0, 5), lib.tuple.vector(0, 0, 1)),
            s = lib.sphere.new(),
            xs = lib.sphere.intersects(s, r);
        assert((xs.length == 2) && (xs[0].t == -6) && (xs[1].t == -4), 'sphere.intersects(5)', xs);
    })();

    (function() {
        const
            s = lib.sphere.new(),
            xs = [{obj: s, t: 1}, {obj: s, t: 2}];
        assert(lib.hit(xs).t == 1, 'hit(1)', xs);
    })();
    (function() {
        const
            s = lib.sphere.new(),
            xs = [{obj: s, t: -1}, {obj: s, t: 1}];
        assert(lib.hit(xs).t == 1, 'hit(2)', xs);
    })();
    (function() {
        const
            s = lib.sphere.new(),
            xs = [{obj: s, t: -2}, {obj: s, t: -1}];
        assert(lib.hit(xs) === undefined, 'hit(3)', xs);
    })();

    (function() {
        const
            r = lib.ray.new(lib.tuple.point(1, 2, 3), lib.tuple.vector(0, 1, 0)),
            m = lib.m4x4.translate(3,4,5),
            r2 = lib.ray.transform(r, m);
        assert(isEqual(r2.origin, lib.tuple.point(4,6,8)) && isEqual(r2.direction, lib.tuple.vector(0,1,0)), 'ray.transform(1)', r2);
    })();
    (function() {
        const
            r = lib.ray.new(lib.tuple.point(1, 2, 3), lib.tuple.vector(0, 1, 0)),
            m = lib.m4x4.scale(2,3,4),
            r2 = lib.ray.transform(r, m);
        assert(isEqual(r2.origin, lib.tuple.point(2, 6, 12)) && isEqual(r2.direction, lib.tuple.vector(0,3,0)), 'ray.transform(2)', r2);
    })();

    (function() {
        const
            s = lib.sphere.new(),
            t = lib.m4x4.translate(2, 3, 4);
        s.transform = t;
        assert(isEqual(s.transform, t), 'sphere.transform(1)');
    })();
    (function() {
        const
            r = lib.ray.new(lib.tuple.point(0,0,-5), lib.tuple.vector(0,0,1)),
            s = lib.sphere.new(),
            t = lib.m4x4.scale(2, 2, 2);
        s.transform = t;
        const
            xs = lib.sphere.intersects(s, r);
        assert((xs.length == 2) && (xs[0].t == 3) && (xs[1].t == 7), 'sphere.transform(2)', xs);
    })();
    (function() {
        const
            r = lib.ray.new(lib.tuple.point(0,0,-5), lib.tuple.vector(0,0,1)),
            s = lib.sphere.new(),
            t = lib.m4x4.translate(5, 0, 0);
        s.transform = t;
        const
            xs = lib.sphere.intersects(s, r);
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
