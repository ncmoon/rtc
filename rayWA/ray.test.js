/*jshint esversion:8 */
console.log('ray.test.js - start');

function assert(...params) {
  console.assert(...params);
  // could also write to a file here...
} //assert

function isEqual(a, b) {
    const
        EPSILON = 1/100000; //for plain JS numbers (Number.EPSILON * 200)
    var
      result = false;
    switch (typeof b) {
        case 'number':
            if (isNaN(b)) {
                result = isNaN(a);
            }
            else {
                result = Math.abs(a-b) < EPSILON;
            }
            break;
        case 'boolean':
            result = a === b;
            break;
        case 'string':
            result = a === b;
            break;   
        case 'undefined':
            result = (typeof a) == 'undefined';
            break;    
        case 'object':
            if (Array.isArray(b)) {
                try {
                result = (a.length === b.length) && b.reduce((p, c, i) => {
                    return p && isEqual(a[i], c);
                }, true);
                }
                catch (e) {
                    console.assert(false, 'isEqual exception:', a, b);
                }
            }
            else if (b === null) {
                result = a === null;
            }
            else {
                const
                  keysA = Object.keys(a),
                  keysB = Object.keys(b);
                result = (keysA.length === keysB.length) && keysB.reduce((p, c) => {
                    return p && isEqual(a[c], b[c]);
                }, true);
            }
            break;
     }
    return result;
} //isEqual


const NUMBERS = [0, 1, 2, 3, 5, 7, 11, 13, -1, -2, -3, -5, -7, -11, -13, Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER];

//self-test
//TODO extend this
NUMBERS.forEach(n => {
    NUMBERS.forEach(m => {
        assert(isEqual(m, n) === (m == n), 'expected isEqual()', m, n);
    });
});


import lib from './ray.js';
import { PerformanceObserver, performance } from 'node:perf_hooks';
import {testChapter1, testChapter2, testChapter3, testChapter4, testChapter5} from './ray1to5.test.js';
import {testChapter6, testChapter7, testChapter8, testChapter9, testChapter10} from './ray6to10.test.js';
import {testChapter11, testChapter12, testChapter13, testChapter14, testChapter15} from './ray11to15.test.js';

function benchmark(lib) {
    //const
    //    a = lib.Vector(1,2,3), 
    //    b = lib.Vector(4,5,6), 
    //    c = lib.Vector(7,8,9),
    //   m = lib.Matrix([[0,1,2,3],[4,5,6,0],[0,7,8,0],[0,0,0,1]]);
    const
        _a = lib.setVector(0, [1, 2, 3, 0])*4,
        _b = lib.setVector(4, [4, 5, 6, 0])*4,
        _c = lib.setVector(8, [7, 8, 9, 0])*4,
        _m = lib.setMatrix(12, [[0,1,2,3],[4,5,6,0],[0,7,8,0],[0,0,0,1]])*4;
    var
        y, z, w, i, t0, t1;
    console.log('for pure JS:', 0.004, 'mS (*100)', 0.007, 'mS (*1000)', 0.0016, 'mS (*10000)');
    // y = -a + (-b - -c);
    t0 = performance.now();
    for (i = 0; i < 100; i++) {
        //y = lib.VectorNormalize(lib.VectorAdd(lib.VectorNeg(a), lib.VectorSub(lib.VectorNeg(b), lib.VectorNeg(c))));
        //z = lib.VectorDot(a, lib.VectorCross(b, c));
        //w = lib.MatrixVectorMultiply(m, a);
        y = lib.test.VectorNormalize(lib.test.VectorAdd(lib.test.VectorNeg(_a), lib.test.VectorSub(lib.test.VectorNeg(_b), lib.test.VectorNeg(_c))));
        z = lib.test.VectorDot(_a, lib.test.VectorCross(_b, _c));
        w = lib.test.MatrixVectorMultiply(_m, _a);
    }
    t1 = performance.now();
    //console.log(y, z, w);
    console.log(((t1-t0)/100).toFixed(6), 'mS (*100)');

    t0 = performance.now();
    for (i = 0; i < 1000; i++) {
        //y = lib.VectorNormalize(lib.VectorAdd(lib.VectorNeg(a), lib.VectorSub(lib.VectorNeg(b), lib.VectorNeg(c))));
        //z = lib.VectorDot(a, lib.VectorCross(b, c));
        //w = lib.MatrixVectorMultiply(m, a);
        y = lib.test.VectorNormalize(lib.test.VectorAdd(lib.test.VectorNeg(_a), lib.test.VectorSub(lib.test.VectorNeg(_b), lib.test.VectorNeg(_c))));
        z = lib.test.VectorDot(_a, lib.test.VectorCross(_b, _c));
        w = lib.test.MatrixVectorMultiply(_m, _a);
    }
    t1 = performance.now();
    //console.log(y, z, w);
    console.log(((t1-t0)/1000).toFixed(6), 'mS (*1000)');

    t0 = performance.now();
    for (i = 0; i < 10000; i++) {
        //y = lib.VectorNormalize(lib.VectorAdd(lib.VectorNeg(a), lib.VectorSub(lib.VectorNeg(b), lib.VectorNeg(c))));
        //z = lib.VectorDot(a, lib.VectorCross(b, c));
        //w = lib.MatrixVectorMultiply(m, a);
        y = lib.test.VectorNormalize(lib.test.VectorAdd(lib.test.VectorNeg(_a), lib.test.VectorSub(lib.test.VectorNeg(_b), lib.test.VectorNeg(_c))));
        z = lib.test.VectorDot(_a, lib.test.VectorCross(_b, _c));
        w = lib.test.MatrixVectorMultiply(_m, _a);
    }
    t1 = performance.now();
    //console.log(y, z, w);
    console.log(((t1-t0)/10000).toFixed(6), 'mS (*10000)');


    t0 = performance.now();
    for (i = 0; i < 100; i++) {
        y = lib.test.Benchmark(_a, _b, _c, _m);
    }
    t1 = performance.now();
    //console.log(y, z, w);
    console.log(((t1-t0)/100).toFixed(6), 'mS (*100) $Benchmark');

    t0 = performance.now();
    for (i = 0; i < 1000; i++) {
        y = lib.test.Benchmark(_a, _b, _c, _m);
    }
    t1 = performance.now();
    //console.log(y, z, w);
    console.log(((t1-t0)/1000).toFixed(6), 'mS (*1000) $Benchmark');

    t0 = performance.now();
    for (i = 0; i < 10000; i++) {
        y = lib.test.Benchmark(_a, _b, _c, _m);
    }
    t1 = performance.now();
    //console.log(y, z, w);
    console.log(((t1-t0)/10000).toFixed(6), 'mS (*10000) $Benchmark');
} //benchmark




lib((lib) => {
    testChapter1(lib);
    testChapter2(lib);
    testChapter3(lib);
    testChapter4(lib);
    //testChapter5(lib);

    //testChapter6();
    //testChapter7();
    //testChapter8();
    //testChapter9();
    //testChapter10();

    //testChapter11();
    //testChapter12();
    //testChapter13();
    //testChapter14();
    //testChapter15();

    //testTuple();

    benchmark(lib);
    //draw6();
    //draw7();
    //draw9();
    //draw10();
    //draw11();
});



/*
function draw6() {
    const
        result = [],
        black = lib.tuple.color(0,0,0),
        white = lib.tuple.color(1,1,1),
        red = lib.tuple.color(1,0,0),
        s = lib.sphere.new(),
        l = lib.light.new(lib.tuple.point(-10, 10, -10), white),
        oRay = lib.tuple.point(0, 0, -5),
        nx = 500,
        ny = 500,
        wall = {x0: -3.5, y0: -3.5, x1: 3.5, y1: 3.5, z: 10},
        w = (wall.x1 - wall.x0)/nx; //pixel width (as at wall)
    s.material.color = lib.tuple.color(1, 0.2, 1);
    //s.transform = lib.m4x4.scale(1, 0.5, 1);
    //s.transform = lib.m4x4.scale(0.5, 1, 1);
    //s.transform = lib.m4x4.multiply(lib.m4x4.rotateZ(Math.PI/4), lib.m4x4.scale(0.5, 1, 1));
    s.transform = lib.m4x4.multiply(lib.m4x4.shear(1,0,0,0,0,0), lib.m4x4.scale(0.5, 1, 1));
    var
      x, y;
    for (y = 0; y < ny; y++) {
        var
          row = [];
        for (x = 0; x < nx; x++) {
            var
                position = lib.tuple.point(wall.x0 + w * x, wall.y1 - w * y, wall.z),
                r = lib.ray.new(oRay, lib.tuple.normalize(lib.tuple.subtract(position, oRay))),
                xs = lib.sphere.intersects(s, r),
                h = lib.hit(xs);
            //row.push(h ? lib.lighting(h.obj.material, l, lib.ray.position(r, h.t), -r.direction, lib.sphere.normal(h.obj, lib.ray.position(r, h.t))) : white);
            row.push(h ? lib.lighting(s.material, l, lib.ray.position(r, h.t), lib.tuple.negate(r.direction), lib.sphere.normal(s, lib.ray.position(r, h.t))) : white);
        }
        result.push(row);
    }
    lib.asJPEG(result, 'image6.jpg');
} //draw6

function draw7() {
    const
        w = lib.DefaultWorld(),
        c = lib.Camera(1000, 500, Math.PI/3);
    c.transform = lib.m4x4.viewTransform(lib.tuple.point(0, 1.5, -5), lib.tuple.point(0, 1, 0), lib.tuple.vector(0, 1, 0));
    w.objects[0].transform = lib.m4x4.translate(-0.5,1,0.5); //middle ball

    w.objects[1].transform = lib.m4x4.multiply(lib.m4x4.translate(1.5, 0.5, -0.5), lib.m4x4.scale(0.5,0.5,0.5));
    w.objects[1].material.color = lib.tuple.color(0.5, 1, 0.1); //right ball
    w.objects[1].material.diffuse = 0.7;
    w.objects[1].material.specular = 0.3;

    w.objects.push(lib.Sphere());                           //left ball 
    w.objects[2].transform = lib.m4x4.multiply(lib.m4x4.translate(-1.5, 0.33, -0.75), lib.m4x4.scale(0.33,0.33,0.33));
    w.objects[2].material.color = lib.tuple.color(0, 1, 1);
    w.objects[2].material.diffuse = 1;
    w.objects[2].material.specular = 1;
    w.objects[2].material.shininess = 1200;

    w.objects.push(lib.Sphere());                           //floor
    w.objects[3].transform = lib.m4x4.scale(10,0.01, 10);
    w.objects[3].material.color = lib.tuple.color(1, 0.9, 0.9);
    w.objects[3].material.specular = 0;

    var
      t0, t1, canvas;
    t0 = performance.now();
    canvas = c.render(w);
    t1 = performance.now();
    console.log(t1-t0, 'mS', 1000*500, 'rays');
    lib.asJPEG(canvas, 'image7.jpg');
} //draw7

function draw9() {
    const
        w = lib.DefaultWorld(),
        c = lib.Camera(1000, 500, Math.PI/3);
    c.transform = lib.m4x4.viewTransform(lib.tuple.point(0, 1.5, -5), lib.tuple.point(0, 1, 0), lib.tuple.vector(0, 1, 0));
    w.objects[0].transform = lib.m4x4.translate(-0.5, 1.5, 0.5); //middle ball

    w.objects[1].transform = lib.m4x4.multiply(lib.m4x4.translate(1.5, 0.5, -0.5), lib.m4x4.scale(0.5,0.5,0.5));
    w.objects[1].material.color = lib.tuple.color(0.5, 1, 0.1); //right ball
    w.objects[1].material.diffuse = 0.7;
    w.objects[1].material.specular = 0.3;

    w.objects.push(lib.Sphere());                           //left ball 
    w.objects[2].transform = lib.m4x4.multiply(lib.m4x4.translate(-1.5, 0.2, -0.75), lib.m4x4.scale(0.33,0.33,0.33));
    w.objects[2].material.color = lib.tuple.color(0, 1, 1);
    w.objects[2].material.diffuse = 1;
    w.objects[2].material.specular = 1;
    w.objects[2].material.shininess = 1200;

    w.objects.push(lib.Plane(lib.Material(lib.tuple.color(1,0,0),0.3,0.4,1,100)));       //floor
    //w.objects[3].transform = lib.m4x4.scale(10,0.01, 10);
    //w.objects[3].material.color = lib.tuple.color(1, 0.9, 0.9);
    //w.objects[3].material.specular = 0;
    w.objects.push(lib.Plane(lib.Material(lib.tuple.color(0.5,0.5,1),1),lib.m4x4.translate(0, 11, 0)));       //ceiling

    var
      t0, t1, canvas;
    t0 = performance.now();
    canvas = c.render(w);
    t1 = performance.now();
    console.log(t1-t0, 'mS', 1000*500, 'rays');
    lib.asJPEG(canvas, 'image9.jpg');
} //draw9

function draw10() {
    const
        w = lib.World(),
        c = lib.Camera(1000, 500, Math.PI/3);
    c.transform = lib.m4x4.viewTransform(lib.tuple.point(0, 1.5, -5), lib.tuple.point(0, 1, 0), lib.tuple.vector(0, 1, 0));


    w.lights.push(
        lib.Light(
            lib.tuple.point(-10, 10, -10), lib.tuple.color(1, 1, 1)
        )
    );

    w.objects.push(     //middle ball   
        lib.Sphere(
            lib.Material(lib.tuple.color(0.8, 1, 0.6), 0.5, 0.7, 0.2, 200),
            lib.m4x4.translate(-0.5, 1.5, 0.5)
        )
    );
    w.objects.push(     //right ball
        lib.Sphere(
            lib.Material(lib.tuple.color(0.5, 1, 0.1), 1, 0.5, 0.3, 200, lib.Patterns.Checker(lib.MAGENTA, lib.CYAN, lib.m4x4.scale(0.1, 0.1, 0.1))), 
            lib.m4x4.multiply(lib.m4x4.translate(1.5, 0.5, -0.5), lib.m4x4.scale(0.5, 0.5, 0.5))
        )
    );
    w.objects.push(             //left ball 
        lib.Sphere(
            lib.Material(lib.BLACK, 1, 0, 0, 0, lib.Patterns.Ring(lib.MAGENTA, lib.CYAN, lib.m4x4.scale(0.1, 0.1, 0.1))), 
            lib.m4x4.multiply(lib.m4x4.translate(-1.5, 0.2, -0.75), lib.m4x4.scale(0.33,0.33,0.33))
        )
    );              
    w.objects.push(       //floor
        lib.Plane(
            lib.Material(lib.tuple.color(1, 0, 0), 0.3, 0.4, 1, 100, lib.Patterns.Stripe(lib.WHITE, lib.RED, lib.m4x4.scale(2.5, 1, 1)))
        )
    );
    w.objects.push( //ceiling
        lib.Plane(
            lib.Material(lib.tuple.color(0.5, 0.5, 1), 1, 0, 0, 0, lib.Patterns.Stripe(lib.BLUE, lib.WHITE, lib.m4x4.rotateY(Math.PI/4))),
            lib.m4x4.translate(0, 11, 0)
        )
    );       
    var
      t0, t1, canvas;
    t0 = performance.now();
    canvas = c.render(w);
    t1 = performance.now();
    console.log(t1-t0, 'mS', 1000*500, 'rays');
    lib.asJPEG(canvas, 'image10.jpg');
} //draw10

function draw11() {
    const
        w = lib.World(),
        c = lib.Camera(1000, 500, Math.PI/3);
    c.transform = lib.m4x4.viewTransform(lib.tuple.point(0, 1.5, -5), lib.tuple.point(0, 1, 0), lib.tuple.vector(0, 1, 0));

    w.lights.push(
        lib.Light(
            lib.tuple.point(-10, 10, -10), lib.tuple.color(1, 1, 1)
        )
    );
    w.objects.push(     //middle ball   
        lib.Sphere(
            lib.Material(lib.tuple.color(0.08, 0.08, 0.08), 0.5, 0.97, 1.02, 20, null, 1),
            lib.m4x4.translate(-0.5, 1.5, 0.5)
        )
    );
    w.objects.push(     //right ball
        lib.Sphere(
            lib.Material(lib.tuple.color(0.5, 1, 0.1), 1, 0.5, 0.3, 200/*, lib.Patterns.Checker(lib.MAGENTA, lib.CYAN, lib.m4x4.scale(0.1, 0.1, 0.1))* /), 
            lib.m4x4.multiply(lib.m4x4.translate(1.5, 0.5, -0.5), lib.m4x4.scale(0.5, 0.5, 0.5))
        )
    );
    w.objects.push(             //left ball 
        lib.Sphere(
            lib.Material(lib.BLACK, 1, 0, 0, 0, lib.Patterns.Ring(lib.MAGENTA, lib.CYAN, lib.m4x4.scale(0.1, 0.1, 0.1))), 
            lib.m4x4.multiply(lib.m4x4.translate(-1.5, 0.2, -0.75), lib.m4x4.scale(0.33,0.33,0.33))
        )
    );              
    w.objects.push(       //floor
        lib.Plane(
            lib.Material(lib.tuple.color(1, 0, 0), 0.3, 0.4, 1, 100, lib.Patterns.Stripe(lib.WHITE, lib.RED, lib.m4x4.scale(2.5, 1, 1)), 0.75)
        )
    );
    w.objects.push( //ceiling
        lib.Plane(
            lib.Material(lib.tuple.color(0.5, 0.5, 1), 1, 0, 0, 0/*, lib.Patterns.Stripe(lib.BLUE, lib.WHITE, lib.m4x4.rotateY(Math.PI/4))* /),
            lib.m4x4.translate(0, 11, 0)
        )
    );       
    var
      t0, t1, canvas;
    t0 = performance.now();
    canvas = c.render(w);
    t1 = performance.now();
    console.log(t1-t0, 'mS', 1000*500, 'rays');
    lib.asJPEG(canvas, 'image11.jpg');
} //draw11
*/

export {
    assert,
    isEqual
};
console.log('ray.test.js - end');
