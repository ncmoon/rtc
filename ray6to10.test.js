/*jshint esversion:8 */
console.log('ray6to10.test.js - start');
import lib from './ray.js';
import {assert, isEqual} from './ray.test.js';

function testChapter6() {    
    (function() {
        const
            s = lib.Sphere(),
            n = s.normal(lib.tuple.point(1,0,0));
        assert(isEqual(n, lib.tuple.vector(1,0,0)), 'surface normal(1)', n);
    })();
    (function() {
        const
            s = lib.Sphere(),
            n = s.normal(lib.tuple.point(0,1,0));
        assert(isEqual(n, lib.tuple.vector(0,1,0)), 'surface normal(2)', n);
    })();
    (function() {
        const
            s = lib.Sphere(),
            n = s.normal(lib.tuple.point(0,0,1));
        assert(isEqual(n, lib.tuple.vector(0,0,1)), 'surface normal(3)', n);
    })();
    (function() {
        const
            s = lib.Sphere(),
            n = s.normal(lib.tuple.point(Math.sqrt(3)/3, Math.sqrt(3)/3, Math.sqrt(3)/3));
        assert(isEqual(n, lib.tuple.vector(Math.sqrt(3)/3, Math.sqrt(3)/3, Math.sqrt(3)/3)), 'surface normal(4)', n);
        assert(isEqual(n, lib.tuple.normalize(n)), 'surface normal(5)', n);
    })();

    (function() {
        const
            s = lib.Sphere();
        s.transform = lib.m4x4.translate(0,1,0);
        const
            n = s.normal(lib.tuple.point(0, 1.70711, -0.70711));
        assert(isEqual(n, lib.tuple.vector(0, 0.7071067811865475, -0.7071067811865476)), 'surface normal(6)', n);
    })();
    (function() {
        const
            s = lib.Sphere(),
            m = lib.m4x4.multiply(lib.m4x4.scale(1, 0.5, 1), lib.m4x4.rotateZ(Math.PI/5));
        s.transform = m;
        const
            n = s.normal(lib.tuple.point(0, Math.sqrt(2)/2, -Math.sqrt(2)/2));
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
            l = lib.Light(p, c);
        assert(isEqual(l.position, p) && isEqual(l.intensity, c), 'phong(1)', p, c, l);
    })();
    (function() {
        const
            m = lib.Material();
            //tuple.color(1,1,1), 0.1, 0.9, 0.9, 200);
        assert(isEqual(m.color, lib.tuple.color(1,1,1)) && (m.ambient == 0.1) && 
          (m.diffuse == 0.9) && (m.specular == 0.9) && (m.shininess == 200), 'phong(2)', m);
    })();

    (function() {
        const
            m = lib.Material(),
            p = lib.tuple.point(0, 0, 0),
            eyev = lib.tuple.vector(0, 0, -1),
            normalv = lib.tuple.vector(0, 0, -1),
            l = lib.Light(lib.tuple.point(0,0,-10), lib.tuple.color(1,1,1)),
            r = lib.lighting(undefined, m, l, p, eyev, normalv);
        assert(isEqual(r, lib.tuple.color(1.9,1.9,1.9)), 'phong(3)', r);
    })();
    (function() {
        const
            m = lib.Material(),
            p = lib.tuple.point(0, 0, 0),
            eyev = lib.tuple.vector(0, Math.sqrt(2)/2, -Math.sqrt(2)/2),
            normalv = lib.tuple.vector(0, 0, -1),
            l = lib.Light(lib.tuple.point(0,0,-10), lib.tuple.color(1,1,1)),
            r = lib.lighting(undefined, m, l, p, eyev, normalv);
        assert(isEqual(r, lib.tuple.color(1,1,1)), 'phong(4)', r);
    })();
    (function() {
        const
            m = lib.Material(),
            p = lib.tuple.point(0, 0, 0),
            eyev = lib.tuple.vector(0, 0, -1),
            normalv = lib.tuple.vector(0, 0, -1),
            l = lib.Light(lib.tuple.point(0,10,-10), lib.tuple.color(1,1,1)),
            r = lib.lighting(undefined, m, l, p, eyev, normalv);
        assert(isEqual(r, lib.tuple.color(0.7363961030678927, 0.7363961030678927, 0.7363961030678927)), 'phong(5)', r);
    })();
    (function() {
        const
            m = lib.Material(),
            p = lib.tuple.point(0, 0, 0),
            eyev = lib.tuple.vector(0, -Math.sqrt(2)/2, -Math.sqrt(2)/2),
            normalv = lib.tuple.vector(0, 0, -1),
            l = lib.Light(lib.tuple.point(0,10,-10), lib.tuple.color(1,1,1)),
            r = lib.lighting(undefined, m, l, p, eyev, normalv);
        assert(isEqual(r, lib.tuple.color(1.6363961030678928, 1.6363961030678928, 1.6363961030678928)), 'phong(6)', r);
    })();
    (function() {
        const
            m = lib.Material(),
            p = lib.tuple.point(0, 0, 0),
            eyev = lib.tuple.vector(0, 0, -1),
            normalv = lib.tuple.vector(0, 0, -1),
            l = lib.Light(lib.tuple.point(0,0,10), lib.tuple.color(1,1,1)),
            r = lib.lighting(undefined, m, l, p, eyev, normalv);
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
        assert(isEqual(w.lights[0], lib.Light(lib.tuple.point(-10,10,-10), lib.tuple.color(1,1,1))), 'world(2)', w);
        //TODO test other default objects...
    })();
    (function() {
        const
            w = lib.DefaultWorld(),
            r = lib.Ray(lib.tuple.point(0, 0, -5), lib.tuple.vector(0, 0, 1)),
            xs = w.intersect(r);
        assert((xs.length == 4) && (xs[0].t == 4) && (xs[1].t == 4.5) &&(xs[2].t == 5.5) && (xs[3].t == 6), 'world(3)', w, xs);
    })();

    (function() {
        const
            r = lib.Ray(lib.tuple.point(0, 0, -5), lib.tuple.vector(0, 0, 1)),
            s = lib.Sphere(),
            i = {t: 4, obj: s}; //intersection
        const
            comps = r.prepare(i);
        assert((comps.t === i.t), 'precompute(1a)', i.t, comps.t);
        assert(isEqual(comps.obj.material, i.obj.material), 'precompute(1b)', i.obj.material, comps.obj.material); 
        assert(isEqual(comps.obj.transform, i.obj.transform), 'precompute(1c)', i.obj.transform, comps.obj.transform); 
        assert(isEqual(comps.point, lib.tuple.point(0,0,-1)) && isEqual(comps.eyev, lib.tuple.vector(0,0,-1)), 'precompute(1d)', i.point, comps.point);
        assert(isEqual(comps.normalv, lib.tuple.vector(0,0,-1)), 'precompute(1e)', i, comps);
    })();
    (function() {
        const
            r = lib.Ray(lib.tuple.point(0, 0, -5), lib.tuple.vector(0, 0, 1)),
            s = lib.Sphere(),
            i = {t: 4, obj: s}; //intersection
        const
            comps = r.prepare(i);
        assert(!comps.inside, 'precompute(2)', i, comps);
    })();
    (function() {
        const
            r = lib.Ray(lib.tuple.point(0, 0, 0), lib.tuple.vector(0, 0, 1)),
            s = lib.Sphere(),
            i = {t: 1, obj: s}; //intersection
        const
            comps = r.prepare(i);
        assert(isEqual(comps.point, lib.tuple.point(0,0,1)) && isEqual(comps.eyev, lib.tuple.vector(0,0,-1)) && comps.inside && isEqual(comps.normalv, lib.tuple.vector(0,0,-1)), 'precompute(3)', i, comps);
    })();

    (function() {
        const
            w = lib.DefaultWorld(),
            r = lib.Ray(lib.tuple.point(0, 0, -5), lib.tuple.vector(0, 0, 1)),
            s = w.objects[0],
            i = {t: 4, obj: s}; //intersection
        const
            comps = r.prepare(i),
            c = lib.shadeHit(w, undefined, comps);
        assert(isEqual(c, lib.tuple.color(0.38066119308103435, 0.47582649135129296, 0.28549589481077575)), 'shading(1)', comps, c);
    })();
    (function() {
        const
            w = lib.DefaultWorld(),
            r = lib.Ray(lib.tuple.point(0, 0, 0), lib.tuple.vector(0, 0, 1)),
            s = w.objects[1],
            i = {t: 0.5, obj: s}; //intersection
        w.lights[0] = lib.Light(lib.tuple.point(0, 0.25, 0), lib.tuple.color(1,1,1));
        const
            comps = r.prepare(i),
            c = lib.shadeHit(w, undefined, comps);
        assert(isEqual(c, lib.tuple.color(0.9049844720832575, 0.9049844720832575, 0.9049844720832575)), 'shading(2)', comps, c);
    })();

    (function() {
        const
            w = lib.DefaultWorld(),
            r = lib.Ray(lib.tuple.point(0, 0, -5), lib.tuple.vector(0, 1, 0)),
            c = lib.colorAt(w, r);
        assert(isEqual(c, lib.tuple.color(0, 0, 0)), 'colorAt(1)', c);
    })();
    (function() {
        const
            w = lib.DefaultWorld(),
            r = lib.Ray(lib.tuple.point(0, 0, -5), lib.tuple.vector(0, 0, 1)),
            c = lib.colorAt(w, r);
        assert(isEqual(c, lib.tuple.color(0.38066119308103435, 0.47582649135129296, 0.28549589481077575)), 'colorAt(2)', c);
    })();
    (function() {
        const
            w = lib.DefaultWorld(),
            r = lib.Ray(lib.tuple.point(0, 0, 0.75), lib.tuple.vector(0, 0, -1));
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
            m = lib.Material(),
            p = lib.tuple.point(0, 0, 0),
            eyev = lib.tuple.vector(0,0,-1),
            normalv = lib.tuple.vector(0,0,-1),
            light = lib.Light(lib.tuple.point(0,0,-10), lib.tuple.color(1,1,1)),
            result = lib.lighting(undefined, m, light, p, eyev, normalv, true);
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
            s1 = lib.Sphere(),
            s2 = lib.Sphere();
        s2. transform = lib.m4x4.translate(0, 0, 10);    
        w.lights = [lib.Light(lib.tuple.point(0, 0, -10), lib.tuple.color(1, 1, 1))];
        w.objects = [s1, s2];
        const
            r = lib.Ray(lib.tuple.point(0, 0, 5), lib.tuple.vector(0, 0, 1)),
            i = {t: 4, obj: s2},
            c = lib.shadeHit(w, undefined, r.prepare(i));    
        assert(isEqual(c, lib.tuple.color(0.1, 0.1, 0.1)), 'shadows(6)', c);
    })();

    (function() {
        const
            r = lib.Ray(lib.tuple.point(0, 0, -5), lib.tuple.vector(0, 0, 1)),
            s = lib.Sphere();
        s.transform = lib.m4x4.translate(0, 0, 1);   
        const
            i = {t: 5, obj: s},
            comps = r.prepare(i);
        assert(comps.overPoint[lib.Z] < -Number.EPSILON/2, 'shadows(7)', comps);
        assert(comps.point[lib.Z] > comps.overPoint[lib.Z], 'shadows(8)', comps);
    })();
} //testChapter8

function testChapter9() {
    (function() {
        const
            s = lib.Shape();
        assert(isEqual(s.transform, lib.m4x4.identity()), 'Shape(1)', s.transform);
    })();
    (function() {
        const
            s = lib.Shape(undefined, lib.m4x4.translate(2, 3, 4));
        assert(isEqual(s.transform, lib.m4x4.translate(2, 3, 4)), 'Shape(2)', s.transform);
    })();
    (function() {
        const
            s = lib.Shape();
        assert(isEqual(s.material, lib.Material()), 'Shape(3)', s.material);
    })();
    (function() {
        const
            s = lib.Shape(lib.Material(undefined, 1));
        assert(isEqual(s.material, lib.Material(undefined, 1)), 'Shape(4)', s.material);
    })();

    (function() {
        const
            s = lib.Shape(undefined, lib.m4x4.scale(2, 2, 2)),
            r = lib.Ray(lib.tuple.point(0, 0, -5), lib.tuple.vector(0, 0, 1)),
            xs = s.intersects(r);
        assert(isEqual(s.debug.origin, lib.tuple.point(0,0,-2.5)), 'Shape(5)', s.debug.origin);
        assert(isEqual(s.debug.direction, lib.tuple.vector(0,0, 0.5)), 'Shape(6)', s.debug.direction);
    })();
    (function() {
        const
            s = lib.Shape(undefined, lib.m4x4.translate(5, 0, 0)),
            r = lib.Ray(lib.tuple.point(0, 0, -5), lib.tuple.vector(0, 0, 1)),
            xs = s.intersects(r);
        assert(isEqual(s.debug.origin, lib.tuple.point(-5,0,-5)), 'Shape(7)', s.debug.origin);
        assert(isEqual(s.debug.direction, lib.tuple.vector(0,0, 1)), 'Shape(8)', s.debug.direction);
    })();
    (function() {
        const
            s = lib.Shape(undefined, lib.m4x4.translate(0, 1, 0)),
            n = s.normal(lib.tuple.point(0, 1.70711, -0.70711));
        assert(isEqual(n, lib.tuple.vector(0, 0.7071067811865475, -0.7071067811865476)), 'Shape(9)', n);
    })();
    (function() {
        const
            s = lib.Shape(undefined, lib.m4x4.multiply(lib.m4x4.scale(1, 0.5, 1), lib.m4x4.rotateZ(Math.PI/5))),
            n = s.normal(lib.tuple.point(0, Math.sqrt(2)/2, -Math.sqrt(2)/2));
        assert(isEqual(n, lib.tuple.vector(0, 0.9701425001453319, -0.24253562503633294)), 'Shape(10)', n);
    })();


    (function() {
        const
            p = lib.Plane(),
            n1 = p.normal(lib.tuple.point(0, 0, 0)),
            n2 = p.normal(lib.tuple.point(10, 0, -10)),
            n3 = p.normal(lib.tuple.point(-5, 0, 150));
        assert(isEqual(n1, lib.tuple.vector(0, 1, 0)), 'Plane(1)', n1);
        assert(isEqual(n2, lib.tuple.vector(0, 1, 0)), 'Plane(2)', n2);
        assert(isEqual(n3, lib.tuple.vector(0, 1, 0)), 'Plane(3)', n3);
    })();
    (function() {
        const
            p = lib.Plane(),
            r = lib.Ray(lib.tuple.point(0, 10, 0), lib.tuple.vector(0, 0, 1)),
            xs = p._intersects(r);
        assert(xs.length === 0, 'Plane(4)', xs);
    })();
    (function() {
        const
            p = lib.Plane(),
            r = lib.Ray(lib.tuple.point(0, 0, 0), lib.tuple.vector(0, 0, 1)),
            xs = p._intersects(r);
        assert(xs.length === 0, 'Plane(5)', xs);
    })();

    (function() {
        const
            p = lib.Plane(),
            r = lib.Ray(lib.tuple.point(0, 1, 0), lib.tuple.vector(0, -1, 0)),
            xs = p._intersects(r);
        assert((xs.length === 1) && (xs[0].t === 1) && (xs[0].obj === p), 'Plane(6)', xs);
    })();
    (function() {
        const
            p = lib.Plane(),
            r = lib.Ray(lib.tuple.point(0, -1, 0), lib.tuple.vector(0, 1, 0)),
            xs = p._intersects(r);
        assert((xs.length === 1) && (xs[0].t === 1) && (xs[0].obj === p), 'Plane(7)', xs);
    })();



} //testChapter9

function testChapter10() {
    //Patterns
    (function() {
        const
            pattern = lib.Patterns.Stripe(lib.WHITE, lib.BLACK);
        assert(isEqual(pattern.a, lib.WHITE) && isEqual(pattern.b, lib.BLACK), 'Pattern(1)', pattern);
    })();    
    (function() {
        const
            pattern = lib.Patterns.Stripe(lib.WHITE, lib.BLACK);
        assert(isEqual(pattern._at(lib.tuple.point(0, 0, 0)), lib.WHITE) && isEqual(pattern._at(lib.tuple.point(0, 1, 0)), lib.WHITE) && 
            isEqual(pattern._at(lib.tuple.point(0, 2, 0)), lib.WHITE), 'Pattern(2)', pattern);
    })();    
    (function() {
        const
            pattern = lib.Patterns.Stripe(lib.WHITE, lib.BLACK);
        assert(isEqual(pattern._at(lib.tuple.point(0, 0, 0)), lib.WHITE) && isEqual(pattern._at(lib.tuple.point(0, 0, 1)), lib.WHITE) && 
            isEqual(pattern._at(lib.tuple.point(0, 0, 2)), lib.WHITE), 'Pattern(3)', pattern);
    })();    
    (function() {
        const
            pattern = lib.Patterns.Stripe(lib.WHITE, lib.BLACK);
        assert(isEqual(pattern._at(lib.tuple.point(0, 0, 0)), lib.WHITE) && isEqual(pattern._at(lib.tuple.point(0.9, 0, 0)), lib.WHITE) && 
            isEqual(pattern._at(lib.tuple.point(1, 0, 0)), lib.BLACK), 'Pattern(4)', pattern._at(lib.tuple.point(1, 0, 0)));
        assert(isEqual(pattern._at(lib.tuple.point(-0.1, 0, 0)), lib.BLACK) && 
            isEqual(pattern._at(lib.tuple.point(-1, 0, 0)), lib.BLACK) && isEqual(pattern._at(lib.tuple.point(-1.1, 0, 0)), lib.WHITE), 
            'Pattern(5)', pattern._at(lib.tuple.point(-0.1, 0, 0)));
    })();    
 
    (function() {
        const
            material = lib.Material(lib.WHITE, 1, 0, 0, 0, lib.Patterns.Stripe(lib.WHITE, lib.BLACK)),
            eyev = lib.tuple.vector(0, 0, -1),
            normalv = lib.tuple.vector(0, 0, -1),
            light = lib.Light(lib.tuple.point(0, 0, -10), lib.WHITE),
            c1 = lib.lighting(lib.Sphere(), material, light, lib.tuple.point(0.9,0,0), eyev, normalv, false),
            c2 = lib.lighting(lib.Sphere(), material, light, lib.tuple.point(1.1,0,0), eyev, normalv, false);
        assert(isEqual(c1, lib.WHITE), 'Pattern(6)', c1);
        assert(isEqual(c2, lib.BLACK), 'Pattern(7)', c2);
    })(); 

    (function() {
        const
            s = lib.Sphere(
                lib.Material(lib.WHITE, 1, 0, 0, 0, lib.Patterns.Stripe(lib.WHITE, lib.BLACK)), 
                lib.m4x4.scale(2,2,2)
            ),
            c = s.material.pattern.at(s, lib.tuple.point(1.5,0,0));
        assert(isEqual(c, lib.WHITE), 'Pattern(8)', c);
    })();  
    (function() {
        const
            s = lib.Sphere(
                lib.Material(lib.WHITE, 1, 0, 0, 0, lib.Patterns.Stripe(lib.WHITE, lib.BLACK, lib.m4x4.scale(2,2,2)))
            ),
            c = s.material.pattern.at(s, lib.tuple.point(1.5, 0, 0));
        assert(isEqual(c, lib.WHITE), 'Pattern(9)', c);
    })();  
    (function() {
        const
            s = lib.Sphere(
                lib.Material(lib.WHITE, 1, 0, 0, 0, lib.Patterns.Stripe(lib.WHITE, lib.BLACK, lib.m4x4.translate(0.5,0,0))), 
                lib.m4x4.scale(2,2,2)
            ),
            c = s.material.pattern.at(s, lib.tuple.point(2.5,0,0));
        assert(isEqual(c, lib.WHITE), 'Pattern(10)', c);
    })();  


    (function() {
        const
            p = lib.Patterns.Abstract();
        assert(isEqual(p.transform, lib.m4x4.identity()), 'Abstract(1)', p);
    })();  
    (function() {
        const
            p = lib.Patterns.Abstract(null, null, lib.m4x4.translate(1,2,3));
        assert(isEqual(p.transform, lib.m4x4.translate(1,2,3)), 'Abstract(2)', p);
    })();  

    (function() {
        const
            s = lib.Sphere(undefined, lib.m4x4.scale(2, 2, 2)),
            p = lib.Patterns.Abstract(null, null),
            c = p.at(s, lib.tuple.point(2, 3, 4));
        assert(isEqual(c, lib.tuple.color(1, 1.5, 2)), 'Abstract(3)', p, c);
    })();
    (function() {
        const
            s = lib.Sphere(),
            p = lib.Patterns.Abstract(null, null, lib.m4x4.scale(2, 2, 2)),
            c = p.at(s, lib.tuple.point(2, 3, 4));
        assert(isEqual(c, lib.tuple.color(1, 1.5, 2)), 'Abstract(4)', p, c);
    })();
    (function() {
        const
            s = lib.Sphere(undefined, lib.m4x4.scale(2, 2, 2)),
            p = lib.Patterns.Abstract(null, null, lib.m4x4.translate(0.5, 1, 1.5)),
            c = p.at(s, lib.tuple.point(2.5, 3, 3.5));
        assert(isEqual(c, lib.tuple.color(0.75, 0.5, 0.25)), 'Abstract(5)', p, c);
    })();

    (function() {
        const
            p = lib.Patterns.Gradient(lib.WHITE, lib.BLACK);
        assert(isEqual(p._at(lib.tuple.point(0.25,0,0)), lib.tuple.color(0.75, 0.75, 0.75)), 'Gradient(1)', p._at(lib.tuple.point(0.25,0,0)));
        assert(isEqual(p._at(lib.tuple.point(0.5,0,0)), lib.tuple.color(0.5, 0.5, 0.5)), 'Gradient(2)', p._at(lib.tuple.point(0.5,0,0)));
        assert(isEqual(p._at(lib.tuple.point(0.75,0,0)), lib.tuple.color(0.25, 0.25, 0.25)), 'Gradient(3)', p._at(lib.tuple.point(0.75,0,0)));
    })();

    (function() {
        const
            p = lib.Patterns.Ring(lib.WHITE, lib.BLACK);
        assert(isEqual(p._at(lib.tuple.point(0, 0, 0)), lib.WHITE), 'Ring(1)', p);
        assert(isEqual(p._at(lib.tuple.point(1, 0, 0)), lib.BLACK), 'Ring(2)', p);
        assert(isEqual(p._at(lib.tuple.point(0, 0, 1)), lib.BLACK), 'Ring(3)', p);
        assert(isEqual(p._at(lib.tuple.point(0.708, 0, 0.708)), lib.BLACK), 'Ring(4)', p);
    })();

    
    (function() {
        const
            p = lib.Patterns.Checker(lib.WHITE, lib.BLACK);
        assert(isEqual(p._at(lib.tuple.point(0, 0, 0)), lib.WHITE), 'Checker(1)', p);
        assert(isEqual(p._at(lib.tuple.point(0.99, 0, 0)), lib.WHITE), 'Checker(2)', p);
        assert(isEqual(p._at(lib.tuple.point(1.01, 0, 0)), lib.BLACK), 'Checker(3)', p);
    })();
    (function() {
        const
            p = lib.Patterns.Checker(lib.WHITE, lib.BLACK);
        assert(isEqual(p._at(lib.tuple.point(0, 0, 0)), lib.WHITE), 'Checker(4)', p);
        assert(isEqual(p._at(lib.tuple.point(0, 0.99, 0)), lib.WHITE), 'Checker(5)', p);
        assert(isEqual(p._at(lib.tuple.point(0, 1.01, 0)), lib.BLACK), 'Checker(6)', p);
    })();
    (function() {
        const
            p = lib.Patterns.Checker(lib.WHITE, lib.BLACK);
        assert(isEqual(p._at(lib.tuple.point(0, 0, 0)), lib.WHITE), 'Checker(7)', p);
        assert(isEqual(p._at(lib.tuple.point(0, 0, 0.99)), lib.WHITE), 'Checker(8)', p);
        assert(isEqual(p._at(lib.tuple.point(0, 0, 1.01)), lib.BLACK), 'Checker(9)', p);
    })();
} //testChapter10


export {
    testChapter6,
    testChapter7,
    testChapter8,
    testChapter9,
    testChapter10
};
console.log('ray6to10.test.js - end');
