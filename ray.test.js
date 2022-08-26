/*jshint esversion:8 */
console.log('ray.test.js - start');

function assert(...params) {
  console.assert(...params);
  // could also write to a file here...
} //assert

function isEqual(a, b) {
    var result = false;
    switch (typeof b) {
        case 'number':
            if (isNaN(b)) {
                result = isNaN(a);
            }
            else {
                result = Math.abs(a-b) < (Number.EPSILON * 200);
            }
            break;
        case 'boolean':
            result = a === b;
            break;
        case 'string':
            result = a === b;
            break;   
        case 'object':
            if (Array.isArray(b)) {
                try {
                result = (a.length === b.length) && b.reduce((p, c, i) => {
                    return p && isEqual(a[i], c);
                }, true);
                }
                catch (e) {
                    console.assert(false, a,b);
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


import { PerformanceObserver, performance } from 'node:perf_hooks';
import lib from './ray.js';
import {testChapter1, testChapter2, testChapter3, testChapter4, testChapter5} from './ray1to5.test.js';
import {testChapter6, testChapter7, testChapter8, testChapter9, testChapter10} from './ray6to10.test.js';
import {testChapter11, testChapter12, testChapter13, testChapter14, testChapter15} from './ray11to15.test.js';


function testTuple() {
    NUMBERS.forEach(n => {
        NUMBERS.forEach(m => {
            NUMBERS.forEach(l => {
                NUMBERS.forEach(k => {
                    var y = lib.tuple.new(n, m, l, k);
                    assert(isEqual(y, [n, m, l, k]), 'expected tuple y to be:', y, n, m, l, k);
                });
                var p = lib.tuple.point(n, m, l);
                assert(isEqual(p, [n, m, l, 1]), 'expected point p to be:', p, n, m, l);
                var v = lib.tuple.vector(n, m, l);
                assert(isEqual(v, [n, m, l, 0]), 'expected vector v to be:', v, n, m, l);
                var w = lib.tuple.negate(v); 
    
                assert(isEqual(lib.tuple.add(v,w), [0,0,0,0]),'expected v + -v [0,0,0,0]', v, w, lib.tuple.add(v,w));
                assert(isEqual(lib.tuple.add(v,v), lib.tuple.subtract(v, w)),'expected v*2 == v-w', v, w, lib.tuple.add(v,w));
                assert(isEqual(lib.tuple.divide(lib.tuple.times(v, 0.5), 0.5), v),'expected v*5/5 === v', v, lib.tuple.divide(lib.tuple.times(v,5), 5));
    
                //TODO add dot/cross tests....
    
                assert(isEqual(w, [-n, -m, -l, 0]), 'expected negate(v) to be:', v, -n, -m, -l);
                var u = lib.tuple.normalize(v);
                assert(isEqual(lib.tuple.magnitude(u), ((l === 0) && (m === 0) && (n === 0)) ? NaN : 1), 'expected mag(unit vector) to be 1', l, m, n, u, lib.tuple.magnitude(u));
                var mag = lib.tuple.magnitude(v);
                assert(isEqual(mag, Math.sqrt(v[lib.X]**2 + v[lib.Y]**2 + v[lib.Z]**2 + v[lib.W]**2)), 'expected magnitude to match', mag, Math.sqrt(v[lib.X]^2 + v[lib.Y]^2 + v[lib.Z]^2 + v[lib.W]^2), v); //TODO find a different way to calculate mag
                var z = lib.tuple.times(u, m);
                //console.assert(isEqual(z, v), 'expected u * mag  to be v', v, mag, u, z, v[lib.X]-z[lib.X]);    
            });
        });
    });
} //testTuple

function testM2x2() {
  /*
          new: (m) => [
            [m[0][0], m[0][1]],
            [m[1][0], m[1][1]]
        ],
        identity: () => {
            return m3x3.new([
                [1, 0],
                [0, 1]
            ]);
        },
        transpose: (m) => {
            return m2x2.new([
                [m[0][0], m[1][0]],
                [m[0][1], m[1][1]]
            ]); 
        },
        determinant: (m) => {
            return m[0][0] * m[1][1] - m[0][1] * m[1][0];
        },
        inverse: (m) => {
            const
                det = m2x2.determinant(m);
            return m2x2.new([
                [m[1][1]/det, -m[1][0]/det], //TODO check this!
                [-m[0][1]/det, m[0][0]/det]
            ]);    
        },
        multiply: (m, n) => {
            return m2x2.new([
                [m[0][0] * n[0][0], m[0][1] * n[1][0]],
                [m[1][0] * n[0][1], m[1][1] * n[1][1]]
            ]);
        }

  
  */
} //testM2x2

function testM3x3() {

} //testM3x3

function testM4x4() {

} //testM4x4


function benchmark() {
    const
        a = lib.tuple.vector(1,2,3), 
        b = lib.tuple.vector(4,5,6), 
        c = lib.tuple.vector(7,8,9),
        m = lib.m4x4.new([[0,1,2,3],[4,5,6,0],[0,7,8,0],[0,0,0,1]]);
    var
        y, z, w, i, t0, t1;
    // y = -a + (-b - -c);
    t0 = performance.now();
    for (i = 0; i < 100; i++) {
        y = lib.tuple.normalize(lib.tuple.add(lib.tuple.negate(a), lib.tuple.subtract(lib.tuple.negate(b), lib.tuple.negate(c))));
        z = lib.tuple.dot(a, lib.tuple.cross(b, c));
        w = lib.tuple.multiply(m, a);
    }
    t1 = performance.now();
    console.log(y, z, w);
    console.log((t1-t0)/100, 'mS (*100)');

    t0 = performance.now();
    for (i = 0; i < 1000; i++) {
        y = lib.tuple.normalize(lib.tuple.add(lib.tuple.negate(a), lib.tuple.subtract(lib.tuple.negate(b), lib.tuple.negate(c))));
        z = lib.tuple.dot(a, lib.tuple.cross(b, c));
        w = lib.tuple.multiply(m, a);
    }
    t1 = performance.now();
    console.log(y, z, w);
    console.log((t1-t0)/1000, 'mS (*1000)');

    t0 = performance.now();
    for (i = 0; i < 10000; i++) {
        y = lib.tuple.normalize(lib.tuple.add(lib.tuple.negate(a), lib.tuple.subtract(lib.tuple.negate(b), lib.tuple.negate(c))));
        z = lib.tuple.dot(a, lib.tuple.cross(b, c));
        w = lib.tuple.multiply(m, a);
    }
    t1 = performance.now();
    console.log(y, z, w);
    console.log((t1-t0)/10000, 'mS (*10000)');

} //benchmark


//TODO move this to ray.js
import fs from 'fs';
import jpeg from 'jpeg-js';

function asJPEG(canvas, filename) {

    function clamp(x, min, max) {
        return (x < min) ? min : (x > max) ? max : x;
    } //clamp

    const
      nx = canvas[0].length,
      ny = canvas.length;
    var
        //TODO change call to Buffer() to something not deprecated
      frameData = new Buffer(nx * ny * 4);
    var i, x, y;
    for (y = 0; y < ny; y++) {
        for (x = 0; x < nx; x++) {
            i = (y * nx + x) * 4;
            frameData[i] = 255 * clamp(canvas[y][x][lib.R], 0, 1); // red
            frameData[i+1] = 255 * clamp(canvas[y][x][lib.G], 0, 1); // green
            frameData[i+2] = 255 * clamp(canvas[y][x][lib.B], 0, 1); // blue
            frameData[i+3] = 0xff; // alpha - ignored in JPEGs
            //console.log(frameData[i],frameData[i+1],frameData[i+2],frameData[i+3]);
        }
    }
    var rawImageData = {
      data: frameData, width: nx, height: ny
    };
    var jpegImageData = jpeg.encode(rawImageData, 100);
    fs.writeFileSync(filename, jpegImageData.data);    
} //asJPEG



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
    asJPEG(result, 'image6.jpg');
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
    asJPEG(canvas, 'image7.jpg');
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
    asJPEG(canvas, 'image9.jpg');
} //draw9

testChapter1();
testChapter2();
testChapter3();
testChapter4();
testChapter5();

testChapter6();
testChapter7();
testChapter8();
testChapter9();
testChapter10();

testChapter11();
testChapter12();
testChapter13();
testChapter14();
testChapter15();

//testTuple();
testM4x4();
testM4x4();
testM4x4();

benchmark();
//draw6();
//draw7();
draw9();

export {
    assert,
    isEqual
};

console.log('ray.test.js - end');
