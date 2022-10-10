/*jshint esversion:8 */
console.log('ray11to15.test.js - start');
import lib from './ray.js';
import {assert, isEqual} from './ray.test.js';

function testChapter11() {    

    (function() {
        const
            m = lib.Material();
        assert(m.reflective === 0.0, 'Reflection(1)', m.reflective);
    })();  
    (function() {
        const
            r = lib.Ray(lib.tuple.point(0, 1, -1), lib.tuple.vector(0, -Math.sqrt(2)/2, Math.sqrt(2)/2)),
            shape = lib.Plane(),
            xs = shape.intersects(r);
        //console.log(xs[0],shape, r);
        const            
            comps = r.prepare(xs[0]);
        assert(isEqual(comps.reflectv, lib.tuple.vector(0, Math.sqrt(2)/2, Math.sqrt(2)/2)), 'Reflection(2)', comps.reflectv);
    })();  
    (function() {
        const
            w = lib.DefaultWorld(),
            r = lib.Ray(lib.tuple.point(0, 0, 0), lib.tuple.vector(0, 0, 1)),
            shape = w.objects[1];
        shape.material.ambient = 1;
        const
            xs = shape.intersects(r),
            comps = r.prepare(xs[0]),
            color = w.reflectedColor(comps);
        assert(isEqual(color, lib.BLACK), 'Reflection(3)', color);
    })(); 
    (function() {        
        const
            w = lib.DefaultWorld(),
            shape = lib.Plane(),
            r = lib.Ray(lib.tuple.point(0, 0, -3), lib.tuple.vector(0, -Math.sqrt(2)/2, Math.sqrt(2)/2));
        shape.material.reflective = 0.5;
        shape.transform = lib.m4x4.translate(0, -1, 0);
        w.objects.push(shape);
        const
            xs = shape.intersects(r),
            comps = r.prepare(xs[0]),
            color = w.reflectedColor(comps);
        assert(isEqual(color, lib.tuple.color(0.19033059654052434, 0.23791324567565542, 0.14274794740539323)), 'Reflection(4)', color);
    })(); 
    (function() {        
        const
            w = lib.DefaultWorld(),
            shape = lib.Plane(),
            r = lib.Ray(lib.tuple.point(0, 0, -3), lib.tuple.vector(0, -Math.sqrt(2)/2, Math.sqrt(2)/2));
        shape.material.reflective = 0.5;
        shape.transform = lib.m4x4.translate(0, -1, 0);
        w.objects.push(shape);
        const
            color = w.colorAt(r);
        assert(isEqual(color, lib.tuple.color(0.8767559855220243, 0.9243386346571554, 0.8291733363868932)), 'Reflection(5)', color);
    })(); 
    (function() {        
        const
            w = lib.World(),
            lower = lib.Plane(lib.Material(lib.WHITE, 0.5, 0.5, 1, 200, null, 1), lib.m4x4.translate(0, -1, 0)),
            upper = lib.Plane(lib.Material(lib.WHITE, 0.5, 0.5, 1, 200, null, 1), lib.m4x4.translate(0, 1, 0)),
            r = lib.Ray(lib.ORIGIN, lib.tuple.vector(0, 1, 0));
        w.lights.push(lib.Light(lib.ORIGIN, lib.WHITE));
        w.objects.push(lower);
        w.objects.push(upper);
        const
            color = w.colorAt(r);
        //check stack doesn't blow    
        assert(color, 'Reflection(6)', color);
    })(); 
    //Test #7 not implemented

} //testChapter11

function testChapter12() {

} //testChapter12

function testChapter13() {

} //testChapter13

function testChapter14() {

} //testChapter14

function testChapter15() {
    //Patterns

} //testChapter15


export {
    testChapter11,
    testChapter12,
    testChapter13,
    testChapter14,
    testChapter15
};
console.log('ray11to15.test.js - end');
