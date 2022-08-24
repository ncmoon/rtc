/*jshint esversion:8 */
console.log('ray6to10.test.js - start');
import lib from './ray.js';
import {assert, isEqual} from './ray.test.js';

function testChapter6() {    
    (function() {
        const
            s = lib.sphere.new(),
            n = lib.sphere.normal(s, lib.tuple.point(1,0,0));
        assert(isEqual(n, lib.tuple.vector(1,0,0)), 'surface normal(1)', n);
    })();
    (function() {
        const
            s = lib.sphere.new(),
            n = lib.sphere.normal(s, lib.tuple.point(0,1,0));
        assert(isEqual(n, lib.tuple.vector(0,1,0)), 'surface normal(2)', n);
    })();
    (function() {
        const
            s = lib.sphere.new(),
            n = lib.sphere.normal(s, lib.tuple.point(0,0,1));
        assert(isEqual(n, lib.tuple.vector(0,0,1)), 'surface normal(3)', n);
    })();
    (function() {
        const
            s = lib.sphere.new(),
            n = lib.sphere.normal(s, lib.tuple.point(Math.sqrt(3)/3, Math.sqrt(3)/3, Math.sqrt(3)/3));
        assert(isEqual(n, lib.tuple.vector(Math.sqrt(3)/3, Math.sqrt(3)/3, Math.sqrt(3)/3)), 'surface normal(4)', n);
        assert(isEqual(n, lib.tuple.normalize(n)), 'surface normal(5)', n);
    })();

    (function() {
        const
            s = lib.sphere.new();
        s.transform = lib.m4x4.translate(0,1,0);
        const
            n = lib.sphere.normal(s, lib.tuple.point(0, 1.70711, -0.70711));
        assert(isEqual(n, lib.tuple.vector(0, 0.7071067811865475, -0.7071067811865476)), 'surface normal(6)', n);
    })();
    (function() {
        const
            s = lib.sphere.new(),
            m = lib.m4x4.multiply(lib.m4x4.scale(1, 0.5, 1), lib.m4x4.rotateZ(Math.PI/5));
        s.transform = m;
        const
            n = lib.sphere.normal(s, lib.tuple.point(0, Math.sqrt(2)/2, -Math.sqrt(2)/2));
        assert(isEqual(n, lib.tuple.vector(0, 0.9701425001453319, -0.24253562503633294)), 'surface normal(7)', n);
    })();

    //reflect p83
    (function() {
        const
            v = lib.tuple.vector(1, -1, 0),
            n = lib.tuple.vector(0, 1, 0),
            r = lib.tuple.reflect(v, n);
        assert(isEqual(r, lib.tuple.vector(1, 1, 0)), 'reflection(1)', r);
    })();
    (function() {
        const
            v = lib.tuple.vector(0, -1, 0),
            n = lib.tuple.vector(Math.sqrt(2)/2, Math.sqrt(2)/2, 0),
            r = lib.tuple.reflect(v, n);
        assert(isEqual(r, lib.tuple.vector(1, 0, 0)), 'reflection(2)', r);
    })();

    //phong p84-89
    (function() {
        const
            p = lib.tuple.point(0,0,0),
            c = lib.tuple.color(1,1,1),
            l = lib.light.new(p, c);
        assert(isEqual(l.position, p) && isEqual(l.intensity, c), 'phong(1)', p, c, l);
    })();
    (function() {
        const
            m = lib.material.new();
            //tuple.color(1,1,1), 0.1, 0.9, 0.9, 200);
        assert(isEqual(m.color, lib.tuple.color(1,1,1)) && (m.ambient == 0.1) && 
          (m.diffuse == 0.9) && (m.specular == 0.9) && (m.shininess == 200), 'phong(2)', m);
    })();

    (function() {
        const
            m = lib.material.new(),
            p = lib.tuple.point(0, 0, 0),
            eyev = lib.tuple.vector(0, 0, -1),
            normalv = lib.tuple.vector(0, 0, -1),
            l = lib.light.new(lib.tuple.point(0,0,-10), lib.tuple.color(1,1,1)),
            r = lib.lighting(m, l, p, eyev, normalv);
        assert(isEqual(r, lib.tuple.color(1.9,1.9,1.9)), 'phong(3)', r);
    })();
    (function() {
        const
            m = lib.material.new(),
            p = lib.tuple.point(0, 0, 0),
            eyev = lib.tuple.vector(0, Math.sqrt(2)/2, -Math.sqrt(2)/2),
            normalv = lib.tuple.vector(0, 0, -1),
            l = lib.light.new(lib.tuple.point(0,0,-10), lib.tuple.color(1,1,1)),
            r = lib.lighting(m, l, p, eyev, normalv);
        assert(isEqual(r, lib.tuple.color(1,1,1)), 'phong(4)', r);
    })();
    (function() {
        const
            m = lib.material.new(),
            p = lib.tuple.point(0, 0, 0),
            eyev = lib.tuple.vector(0, 0, -1),
            normalv = lib.tuple.vector(0, 0, -1),
            l = lib.light.new(lib.tuple.point(0,10,-10), lib.tuple.color(1,1,1)),
            r = lib.lighting(m, l, p, eyev, normalv);
        assert(isEqual(r, lib.tuple.color(0.7363961030678927, 0.7363961030678927, 0.7363961030678927)), 'phong(5)', r);
    })();
    (function() {
        const
            m = lib.material.new(),
            p = lib.tuple.point(0, 0, 0),
            eyev = lib.tuple.vector(0, -Math.sqrt(2)/2, -Math.sqrt(2)/2),
            normalv = lib.tuple.vector(0, 0, -1),
            l = lib.light.new(lib.tuple.point(0,10,-10), lib.tuple.color(1,1,1)),
            r = lib.lighting(m, l, p, eyev, normalv);
        assert(isEqual(r, lib.tuple.color(1.6363961030678928, 1.6363961030678928, 1.6363961030678928)), 'phong(6)', r);
    })();
    (function() {
        const
            m = lib.material.new(),
            p = lib.tuple.point(0, 0, 0),
            eyev = lib.tuple.vector(0, 0, -1),
            normalv = lib.tuple.vector(0, 0, -1),
            l = lib.light.new(lib.tuple.point(0,0,10), lib.tuple.color(1,1,1)),
            r = lib.lighting(m, l, p, eyev, normalv);
        assert(isEqual(r, lib.tuple.color(0.1, 0.1, 0.1)), 'phong(7)', r);
    })();
} //testChapter6

function testChapter7() {
    (function() {
        const
            w = lib.World();
        assert((w.objects.length === 0) && (w.lights.length === 0), 'world(1)', w);
    })();
    (function() {
        const
            w = lib.DefaultWorld();
        assert(isEqual(w.lights[0], lib.light.new(lib.tuple.point(-10,10,-10), lib.tuple.color(1,1,1))), 'world(2)', w);
        //TODO test other default objects...
    })();
    (function() {
        const
            w = lib.DefaultWorld(),
            r = lib.ray.new(lib.tuple.point(0, 0, -5), lib.tuple.vector(0, 0, 1)),
            xs = w.intersect(r);
        assert((xs.length == 4) && (xs[0].t == 4) && (xs[1].t == 4.5) &&(xs[2].t == 5.5) && (xs[3].t == 6), 'world(3)', w, xs);
    })();

    (function() {
        const
            r = lib.ray.new(lib.tuple.point(0, 0, -5), lib.tuple.vector(0, 0, 1)),
            s = lib.sphere.new(),
            i = {t: 4, obj: s}; //intersection
        const
            comps = lib.ray.prepare(i, r);
        assert((comps.t === i.t) && isEqual(comps.obj, i.obj) &&
            isEqual(comps.point, lib.tuple.point(0,0,-1)) && isEqual(comps.eyev, lib.tuple.vector(0,0,-1)) && isEqual(comps.normalv, lib.tuple.vector(0,0,-1)), 'precompute(1)', i, comps);
    })();
    (function() {
        const
            r = lib.ray.new(lib.tuple.point(0, 0, -5), lib.tuple.vector(0, 0, 1)),
            s = lib.sphere.new(),
            i = {t: 4, obj: s}; //intersection
        const
            comps = lib.ray.prepare(i, r);
        assert(!comps.inside, 'precompute(2)', i, comps);
    })();
    (function() {
        const
            r = lib.ray.new(lib.tuple.point(0, 0, 0), lib.tuple.vector(0, 0, 1)),
            s = lib.sphere.new(),
            i = {t: 1, obj: s}; //intersection
        const
            comps = lib.ray.prepare(i, r);
        assert(isEqual(comps.point, lib.tuple.point(0,0,1)) && isEqual(comps.eyev, lib.tuple.vector(0,0,-1)) && comps.inside && isEqual(comps.normalv, lib.tuple.vector(0,0,-1)), 'precompute(3)', i, comps);
    })();

    (function() {
        const
            w = lib.DefaultWorld(),
            r = lib.ray.new(lib.tuple.point(0, 0, -5), lib.tuple.vector(0, 0, 1)),
            s = w.objects[0],
            i = {t: 4, obj: s}; //intersection
        const
            comps = lib.ray.prepare(i, r),
            c = lib.shadeHit(w, comps);
        assert(isEqual(c, lib.tuple.color(0.38066119308103435, 0.47582649135129296, 0.28549589481077575)), 'shading(1)', comps, c);
    })();
    (function() {
        const
            w = lib.DefaultWorld(),
            r = lib.ray.new(lib.tuple.point(0, 0, 0), lib.tuple.vector(0, 0, 1)),
            s = w.objects[1],
            i = {t: 0.5, obj: s}; //intersection
        w.lights[0] = lib.light.new(lib.tuple.point(0, 0.25, 0), lib.tuple.color(1,1,1));
        const
            comps = lib.ray.prepare(i, r),
            c = lib.shadeHit(w, comps);
        assert(isEqual(c, lib.tuple.color(0.9049844720832575, 0.9049844720832575, 0.9049844720832575)), 'shading(2)', comps, c);
    })();

    (function() {
        const
            w = lib.DefaultWorld(),
            r = lib.ray.new(lib.tuple.point(0, 0, -5), lib.tuple.vector(0, 1, 0)),
            c = lib.colorAt(w, r);
        assert(isEqual(c, lib.tuple.color(0, 0, 0)), 'colorAt(1)', c);
    })();
    (function() {
        const
            w = lib.DefaultWorld(),
            r = lib.ray.new(lib.tuple.point(0, 0, -5), lib.tuple.vector(0, 0, 1)),
            c = lib.colorAt(w, r);
        assert(isEqual(c, lib.tuple.color(0.38066119308103435, 0.47582649135129296, 0.28549589481077575)), 'colorAt(2)', c);
    })();
    (function() {
        const
            w = lib.DefaultWorld(),
            r = lib.ray.new(lib.tuple.point(0, 0, 0.75), lib.tuple.vector(0, 0, -1));
        w.objects[0].material.ambient = 1;
        w.objects[1].material.ambient = 1;        
        const    
            c = lib.colorAt(w, r);
        assert(isEqual(c, w.objects[1].material.color), 'colorAt(3)', c, w.objects[1].material.color);
    })();

    (function() {
        const
            v = lib.m4x4.viewTransform(lib.tuple.point(0, 0, 0), lib.tuple.point(0, 0, -1), lib.tuple.vector(0,1,0));
        assert(isEqual(v, lib.m4x4.identity()), 'viewTransform(1)', v);
    })();
    (function() {
        const
            v = lib.m4x4.viewTransform(lib.tuple.point(0, 0, 0), lib.tuple.point(0, 0, 1), lib.tuple.vector(0,1,0));
        assert(isEqual(v, lib.m4x4.scale(-1,1,-1)), 'viewTransform(2)', v);
    })();
    (function() {
        const
            v = lib.m4x4.viewTransform(lib.tuple.point(0, 0, 8), lib.tuple.point(0, 0, 0), lib.tuple.vector(0,1,0));
        assert(isEqual(v, lib.m4x4.translate(0,0,-8)), 'viewTransform(3)', v);
    })();
    (function() {
        const
            v = lib.m4x4.viewTransform(lib.tuple.point(0, 0, 8), lib.tuple.point(0, 0, 0), lib.tuple.vector(0,1,0));
        assert(isEqual(v, lib.m4x4.translate(0,0,-8)), 'viewTransform(3)', v);
    })();
    (function() {
        const
            v = lib.m4x4.viewTransform(lib.tuple.point(1, 3, 2), lib.tuple.point(4, -2, 8), lib.tuple.vector(1,1,0));
        const
            t = [
                [-0.5070925528371099,  0.5070925528371099,  0.6761234037828132,  -2.366431913239846],
                [ 0.7677159338596801,  0.6060915267313263,  0.12121830534626524, -2.8284271247461894],
                [-0.35856858280031806, 0.5976143046671968, -0.7171371656006361,   0],
                [ 0,                   0,                   0,                    1]
            ];
        assert(isEqual(v, lib.m4x4.new(t)), 'viewTransform(4)', v);
    })();


    (function() {
        const
            c = lib.Camera(160, 120, Math.PI/2);
        assert((c.hsize == 160) && (c.vsize == 120) && (c.fieldOfView == Math.PI/2) && isEqual(c.transform, lib.m4x4.identity()), 'Camera(1)', c);
    })();
    (function() {
        const
            c = lib.Camera(200, 125, Math.PI/2);
        assert(c.pixelSize == 0.009999999999999998, 'Camera(2)', c);
    })();
    (function() {
        const
            c = lib.Camera(125, 200, Math.PI/2);
        assert(c.pixelSize == 0.009999999999999998, 'Camera(3)', c);
    })();

    (function() {
        const
            c = lib.Camera(201, 101, Math.PI/2),
            r = c.rayFromPixel(100, 50);
        assert(isEqual(r.origin, lib.tuple.point(0, 0, 0)) && isEqual(r.direction, lib.tuple.vector(0, 0, -1)), 'rayFromPixel(1)', c, r);
    })();
    (function() {
        const
            c = lib.Camera(201, 101, Math.PI/2),
            r = c.rayFromPixel(0, 0);
        assert(isEqual(r.origin, lib.tuple.point(0, 0, 0)) && isEqual(r.direction, lib.tuple.vector(0.6651864261194508, 0.3325932130597254, -0.6685123582500481)), 'rayFromPixel(2)', c, r);
    })();
    (function() {
        const
            c = lib.Camera(201, 101, Math.PI/2);
        c.transform = lib.m4x4.multiply(lib.m4x4.rotateY(Math.PI/4), lib.m4x4.translate(0, -2, 5));
        const    
            r = c.rayFromPixel(100, 50);
        assert(isEqual(r.origin, lib.tuple.point(0, 2, -5)) && isEqual(r.direction, lib.tuple.vector(Math.sqrt(2)/2, 0, -Math.sqrt(2)/2)), 'rayFromPixel(3)', c, r);
    })();

    (function() {
        const
            w = lib.DefaultWorld(),
            c = lib.Camera(11, 11, Math.PI/2);
        c.transform = lib.m4x4.viewTransform(lib.tuple.point(0,0, -5), lib.tuple.point(0, 0, 0), lib.tuple.vector(0, 1, 0));
        const
            image = c.render(w);
        assert(isEqual(image[5][5], lib.tuple.color(0.38066119308103435, 0.47582649135129296, 0.28549589481077575)), 'render(1)', c, w, image[5][5]);
    })();

} //testChapter7

function testChapter8() {
    
    (function() {
        const
            m = lib.material.new(),
            p = lib.tuple.point(0, 0, 0),
            eyev = lib.tuple.vector(0,0,-1),
            normalv = lib.tuple.vector(0,0,-1),
            light = lib.light.new(lib.tuple.point(0,0,-10), lib.tuple.color(1,1,1)),
            result = lib.lighting(m, light, p, eyev, normalv, true);
        assert(isEqual(result, lib.tuple.color(0.1,0.1,0.1)), 'shadows(1)', result);
    })();

    (function() {
        const
            w = lib.DefaultWorld(),
            p = lib.tuple.point(0, 10, 0);
        assert(isEqual(w.inShadow(p), false), 'shadows(2)', w.inShadow(p));
    })();
    (function() {
        const
            w = lib.DefaultWorld(),
            p = lib.tuple.point(10, -10, 10);
        assert(isEqual(w.inShadow(p), true), 'shadows(3)', w.inShadow(p));
    })();
    (function() {
        const
            w = lib.DefaultWorld(),
            p = lib.tuple.point(-20, 20, -20);
        assert(isEqual(w.inShadow(p), false), 'shadows(4)', w.inShadow(p));
    })();
    (function() {
        const
            w = lib.DefaultWorld(),
            p = lib.tuple.point(-2, 2, -2);
        assert(isEqual(w.inShadow(p), false), 'shadows(5)', w.inShadow(p));
    })();

    (function() {
        const
            w = lib.World(),
            s1 = lib.sphere.new(),
            s2 = lib.sphere.new();
        s2. transform = lib.m4x4.translate(0, 0, 10);    
        w.lights = [lib.light.new(lib.tuple.point(0, 0, -10), lib.tuple.color(1, 1, 1))];
        w.objects = [s1, s2];
        const
            r = lib.ray.new(lib.tuple.point(0, 0, 5), lib.tuple.vector(0, 0, 1)),
            i = {t: 4, obj: s2},
            c = lib.shadeHit(w, lib.ray.prepare(i, r));    
        assert(isEqual(c, lib.tuple.color(0.1, 0.1, 0.1)), 'shadows(6)', c);
    })();

    (function() {
        const
            r = lib.ray.new(lib.tuple.point(0, 0, -5), lib.tuple.vector(0, 0, 1)),
            s = lib.sphere.new();
        s.transform = lib.m4x4.translate(0, 0, 1);   
        const
            i = {t: 5, obj: s},
            comps = lib.ray.prepare(i, r);
        assert(comps.overPoint[lib.Z] < -Number.EPSILON/2, 'shadows(7)', comps);
        assert(comps.point[lib.Z] > comps.overPoint[lib.Z], 'shadows(8)', comps);
    })();
} //testChapter8

function testChapter9() {

} //testChapter9

function testChapter10() {

} //testChapter10


export {
    testChapter6,
    testChapter7,
    testChapter8,
    testChapter9,
    testChapter10
};
console.log('ray6to10.test.js - end');
