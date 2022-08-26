/*jshint esversion:8 */
console.log('ray.js');

const 
    X = 0,
    Y = 1,
    Z = 2,
    W = 3,
    R = 0,
    G = 1,
    B = 2,
    tuple = {
        //constructors
        new: (x, y, z, w) => [x, y, z, w],
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
        dot: (u, v) => u[0]*v[X] + u[1]*v[Y] + u[2]*v[Z] + u[3]*v[W],
        cross: (u, v) => { return tuple.vector(u[1]*v[2] - u[2]*v[1], u[2]*v[0] - u[0]*v[2], u[0]*v[1] - u[1]*v[0]); },
        product: (c, d) => { //shurr/hadamar product for colors
            return tuple.color(c[R] * d[R], c[G] * d[G], c[B] * d[B]); 
        }, 
        reflect: (v, n) => { //reflect v, using normal n
          return tuple.subtract(v, tuple.times(n, 2 * tuple.dot(v, n)))
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
    BLACK   = tuple.color(0, 0, 0),
    WHITE   = tuple.color(1, 1, 1),
    RED     = tuple.color(1, 0, 0),
    GREEN   = tuple.color(0, 1, 0),
    BLUE    = tuple.color(0, 0, 1),
    YELLOW  = tuple.color(1, 1, 0),
    CYAN    = tuple.color(0, 1, 1),
    MAGENTA = tuple.color(1, 0, 1),
    ORIGIN = tuple.point(0, 0, 0),
    /*
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
    tuple = {
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
    },*/
    m2x2 = {
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
    },
    m3x3 = {
        new: (m) => [
            [m[0][0], m[0][1], m[0][2]],
            [m[1][0], m[1][1], m[1][2]],
            [m[2][0], m[2][1], m[2][2]]
        ],
        identity: () => { 
            return m3x3.new([
                [1, 0, 0],
                [0, 1, 0],
                [0, 0, 1]
            ]); 
        },
        transpose: (m) => {
            return m3x3.new([
                [m[0][0], m[1][0], m[2][0]],
                [m[0][1], m[1][1], m[2][1]],
                [m[0][2], m[1][2], m[2][2]]
            ]); 
        },
        subMatrix: (m, r, c) => { 
            const
              work = m.map((row) => {
                return row.filter((x, i) => i !== c);
              });
            return m2x2.new(work.filter((n, i) => i !== r));
        },
        determinant: (m) => {
          return m[0][0] * m3x3.coFactor(m, 0, 0) + m[0][1] * m3x3.coFactor(m, 0, 1) + m[0][2] * m3x3.coFactor(m, 0, 2);
        },
        minor: (m, r, c) => {
           return m2x2.determinant(m3x3.subMatrix(m, r, c));
        },
        coFactor: (m, r, c) => {
            return ((r + c) % 2) ? -m3x3.minor(m,r,c) : m3x3.minor(m,r,c); //-m[r][c] : m[r][c];
        },
        inverse: (m) => {
            const
                det = m3x3.determinant(m);
            return m3x3.new([
                [m3x3.coFactor(m, 0, 0)/det, m3x3.coFactor(m, 1, 0)/det, m3x3.coFactor(m, 2, 0)/det],
                [m3x3.coFactor(m, 0, 1)/det, m3x3.coFactor(m, 1, 1)/det, m3x3.coFactor(m, 2, 1)/det],
                [m3x3.coFactor(m, 0, 2)/det, m3x3.coFactor(m, 1, 2)/det, m3x3.coFactor(m, 2, 2)/det]
            ]);
        },
        multiply: (m, n) => {
            return m3x3.new([
                [m[0][0] * n[0][0], m[0][1] * n[1][0], m[0][2] * n[1][0]],
                [m[1][0] * n[0][1], m[1][1] * n[1][1], m[1][2] * n[1][1]],
                [m[2][0] * n[0][2], m[2][1] * n[1][2], m[2][2] * n[1][2]]
            ]);
        }
    },
    m4x4 = {
        //constructors
        new: (m) => [
            [m[0][0], m[0][1], m[0][2], m[0][3]],
            [m[1][0], m[1][1], m[1][2], m[1][3]],
            [m[2][0], m[2][1], m[2][2], m[2][3]],
            [m[3][0], m[3][1], m[3][2], m[3][3]]
        ],
        identity: () => {
            return m4x4.new([
                [1, 0, 0, 0], 
                [0, 1, 0, 0], 
                [0, 0, 1, 0], 
                [0, 0, 0, 1]
            ]);
        },
        //transformations (CH 4)
        translate: (x, y, z) => {
            return m4x4.new([
                [1, 0, 0, x], 
                [0, 1, 0, y], 
                [0, 0, 1, z], 
                [0, 0, 0, 1]
            ]);
        },
        scale: (x, y, z) => {
            return m4x4.new([
                [x, 0, 0, 0], 
                [0, y, 0, 0], 
                [0, 0, z, 0], 
                [0, 0, 0, 1]
            ]);
        },
        rotateX: (theta) => {
            return m4x4.new([
                [1, 0,               0,                 0], 
                [0, Math.cos(theta), -Math.sin(theta),  0], 
                [0, Math.sin(theta), Math.cos(theta),   0], 
                [0, 0,               0,                 1]
            ]);
        },
        rotateY: (theta) => {
            return m4x4.new([
                [Math.cos(theta),  0,   Math.sin(theta),    0], 
                [0,                1,   0,                  0], 
                [-Math.sin(theta), 0,   Math.cos(theta),    0], 
                [0,                0,   0,                  1]
            ]);
        },
        rotateZ: (theta) => {
            return m4x4.new([
                [Math.cos(theta),   -Math.sin(theta),   0,  0], 
                [Math.sin(theta),   Math.cos(theta),    0,  0], 
                [0,                 0,                  1,  0], 
                [0,                 0,                  0,  1]
            ]);
        },
        shear: (xByY,xByZ, yByX, yByZ, zByX, zByY) => {
            return m4x4.new([
                [1,     xByY,   xByZ,   0], 
                [yByX,  1,      yByZ,   0], 
                [zByX,  zByY,   1,      0], 
                [0,     0,      0,      1]
            ]);
        },
        //view transform CH 7
        viewTransform: (from, to, up) => {
            const
                forward = tuple.normalize(tuple.subtract(to, from)),
                upn = tuple.normalize(up),
                left = tuple.cross(forward, upn),
                upt = tuple.cross(left, forward),
                orientation = m4x4.new([
                    [left[X],     left[Y],     left[Z],     0],
                    [upt[X],      upt[Y],      upt[Z],      0],
                    [-forward[X], -forward[Y], -forward[Z], 0],
                    [0,           0,           0,           1]
                ]),
                translation = m4x4.translate(-from[X], -from[Y], -from[Z]);
            return m4x4.multiply(orientation, translation);
        },

        //unary operators
        transpose: (m) => { return m4x4.new([
            [m[0][0], m[1][0], m[2][0], m[3][0]],
            [m[0][1], m[1][1], m[2][1], m[3][1]],
            [m[0][2], m[1][2], m[2][2], m[3][2]],
            [m[0][3], m[1][3], m[2][3], m[3][3]]
        ]); },
        subMatrix: (m, r, c) => { 
            const
              work = m.map((row) => {
                return row.filter((x, i) => i !== c);
              });
            return m3x3.new(work.filter((n, i) => i !== r));
        },
        determinant: (m) => {
            return m[0][0] * m4x4.coFactor(m, 0, 0) + 
                m[0][1] * m4x4.coFactor(m, 0, 1) + 
                m[0][2] * m4x4.coFactor(m, 0, 2) +
                m[0][3] * m4x4.coFactor(m, 0, 3);
        },
        minor: (m, r, c) => {
            return m3x3.determinant(m4x4.subMatrix(m, r, c));
        },
        coFactor: (m, r, c) => {
            return ((r + c) % 2) ? -m4x4.minor(m, r, c) : m4x4.minor(m, r, c);
        },
        inverse: (m) => {
            const
                det = m4x4.determinant(m);
            return m4x4.new([
                [m4x4.coFactor(m, 0, 0)/det, m4x4.coFactor(m, 1, 0)/det, m4x4.coFactor(m, 2, 0)/det, m4x4.coFactor(m, 3, 0)/det],
                [m4x4.coFactor(m, 0, 1)/det, m4x4.coFactor(m, 1, 1)/det, m4x4.coFactor(m, 2, 1)/det, m4x4.coFactor(m, 3, 1)/det],
                [m4x4.coFactor(m, 0, 2)/det, m4x4.coFactor(m, 1, 2)/det, m4x4.coFactor(m, 2, 2)/det, m4x4.coFactor(m, 3, 2)/det],
                [m4x4.coFactor(m, 0, 3)/det, m4x4.coFactor(m, 1, 3)/det, m4x4.coFactor(m, 2, 3)/det, m4x4.coFactor(m, 3, 3)/det]
            ]);
        },
        //binary oerators
        multiply: (m, n) => {
            return m4x4.new([
                [
                    m[0][0] * n[0][0] + m[0][1] * n[1][0] + m[0][2] * n[2][0] + m[0][3] * n[3][0], 
                    m[0][0] * n[0][1] + m[0][1] * n[1][1] + m[0][2] * n[2][1] + m[0][3] * n[3][1], 
                    m[0][0] * n[0][2] + m[0][1] * n[1][2] + m[0][2] * n[2][2] + m[0][3] * n[3][2], 
                    m[0][0] * n[0][3] + m[0][1] * n[1][3] + m[0][2] * n[2][3] + m[0][3] * n[3][3]
                ],
                [
                    m[1][0] * n[0][0] + m[1][1] * n[1][0] + m[1][2] * n[2][0] + m[1][3] * n[3][0], 
                    m[1][0] * n[0][1] + m[1][1] * n[1][1] + m[1][2] * n[2][1] + m[1][3] * n[3][1], 
                    m[1][0] * n[0][2] + m[1][1] * n[1][2] + m[1][2] * n[2][2] + m[1][3] * n[3][2], 
                    m[1][0] * n[0][3] + m[1][1] * n[1][3] + m[1][2] * n[2][3] + m[1][3] * n[3][3]
                ],
                [
                    m[2][0] * n[0][0] + m[2][1] * n[1][0] + m[2][2] * n[2][0] + m[2][3] * n[3][0], 
                    m[2][0] * n[0][1] + m[2][1] * n[1][1] + m[2][2] * n[2][1] + m[2][3] * n[3][1], 
                    m[2][0] * n[0][2] + m[2][1] * n[1][2] + m[2][2] * n[2][2] + m[2][3] * n[3][2], 
                    m[2][0] * n[0][3] + m[2][1] * n[1][3] + m[2][2] * n[2][3] + m[2][3] * n[3][3]
                ],
                [
                    m[3][0] * n[0][0] + m[3][1] * n[1][0] + m[3][2] * n[2][0] + m[3][3] * n[3][0], 
                    m[3][0] * n[0][1] + m[3][1] * n[1][1] + m[3][2] * n[2][1] + m[3][3] * n[3][1], 
                    m[3][0] * n[0][2] + m[3][1] * n[1][2] + m[3][2] * n[2][2] + m[3][3] * n[3][2], 
                    m[3][0] * n[0][3] + m[3][1] * n[1][3] + m[3][2] * n[2][3] + m[3][3] * n[3][3]
                ]
            ]);
        }
    },
    hit = (xs) => {
        //assumes xs is already in ascending order
        return xs.find(x => x.t > 0);
    },
    lighting = (material, light, point, eyev, normalv, inShadow) => {
        //console.group('lighting()');console.log(material, light, point, eyev, normalv);
        //TODO if inShadow - no need to calculate diffuse, specular
        const
            black = tuple.color(0, 0, 0),
            c = tuple.product(material.color, light.intensity),
            lightv = tuple.normalize(tuple.subtract(light.position, point)),
            ambient = tuple.times(c, material.ambient),
            d = tuple.dot(lightv, normalv);
        //console.log(c, material.color, light.intensity);    
        var
            diffuse, specular;    
        if (d < 0) {
            diffuse = BLACK;
            specular = BLACK;
        }
        else {
            diffuse = tuple.times(c, material.diffuse * d);
            const
                reflectv = tuple.reflect(tuple.negate(lightv), normalv),
                reflect_eye = tuple.dot(reflectv, eyev);
            if (reflect_eye <= 0) {
                specular = BLACK;
            }
            else {
                specular = tuple.times(light.intensity, material.specular * Math.pow(reflect_eye, material.shininess));
            }
        }
        //console.log('/lighting()', ambient, diffuse, specular);console.groupEnd();
        return inShadow ? ambient : tuple.add(ambient, tuple.add(diffuse, specular));
    },
    shadeHit = (world, comps) => {
        const
            shadow = world.inShadow(comps.overPoint);         
        return lighting(comps.obj.material, world.lights[0], comps.overPoint, comps.eyev, comps.normalv, shadow);
    },
    colorAt = (world, r) => {
        var
          result = tuple.color(0,0,0);
        const
            xs = world.intersect(r),
            h = hit(xs);
        if (h) {
            const
                comps = r.prepare(h);
            result = shadeHit(world, comps); 
        }
        return result;
    },

    Ray = (origin, direction) => {

        function position(t) {
            return tuple.add(origin, tuple.times(direction, t));
        }

        return {
            origin: origin, 
            direction: direction,
            position: position,
            transform: (m) => { return Ray(tuple.multiply(m, origin), tuple.multiply(m, direction)); },
            prepare: (intersection) => { //NB this might belong somewhere else - the xs list, world, ray, Shape?
                const
                    p = position(intersection.t),
                    n = intersection.obj.normal(p),  //normal should be a method of obj.
                    e = tuple.negate(direction),
                    inside = tuple.dot(n, e) < 0,
                    nv = inside ? tuple.negate(n) : n;
                return {
                    t: intersection.t,
                    obj: intersection.obj,
                    point: p,
                    overPoint: tuple.add(p, tuple.times(nv, Number.EPSILON * 200)),
                    eyev: e,
                    normalv: nv,
                    inside: inside 
                };
            }
        };
    },
    Light =  (p, c) => {
        return {position: p, intensity: c};
    },   
    Material = (color, ambient, diffuse, specular, shininess) => {
        color = color ? color : tuple.color(1, 1, 1);
        ambient = ambient ? ambient : 0.1; 
        diffuse = diffuse ? diffuse : 0.9;
        specular = specular ? specular : 0.9;
        shininess = shininess ? shininess : 200;
        return {
            color, 
            ambient, 
            diffuse, 
            specular, 
            shininess
        };
    }, 
    Patterns = {

    },
    Shape = (material, transform) => {
        material = material ? material : Material();
        transform = transform ? transform : m4x4.identity();
        var
            inverse = m4x4.inverse(transform),
            self = {
                get material() { return material; },
                set material(value) { material = value; },
                get transform() { return transform; },
                set transform(value) { 
                    transform = value; 
                    inverse = m4x4.inverse(transform);
                },
                get _inverse() { return inverse; },
                _intersects: (ray2) => { //abstract 
                    return [];
                },
                intersects: (ray) => {
                    const
                        r2 = ray.transform(self._inverse);
                    self.debug = {
                        origin: r2.origin,
                        direction: r2.direction
                    };    
                    return self._intersects(r2); 
                },
                _normal: (oPoint) => {
                    return tuple.normalize(tuple.vector(oPoint[X], oPoint[Y], oPoint[Z]));
                },
                normal: (point) => {
                    var
                        //map point into object space
                        oPoint = tuple.multiply(self._inverse, point),
                        oNormal = self._normal(oPoint),
                        //map normal back to world space 
                        result = tuple.multiply(m4x4.transpose(self._inverse), oNormal);
                    result[W] = 0;
                    //return normalized
                    return tuple.normalize(result);
                } 
            };
        return self;
    },
    Sphere = (material, transform) => {
        var
            self = Shape(material, transform);
        self._intersects = (ray2) => {
            const                
                sphere2 = tuple.subtract(ray2.origin, tuple.point(0, 0, 0)),
                a = tuple.dot(ray2.direction, ray2.direction),
                b = 2 * tuple.dot(ray2.direction, sphere2),
                c = tuple.dot(sphere2, sphere2) -1,
                d = b * b - 4 * a * c;      
            return (d < 0) ? [] : [{obj: self, t: (-b - Math.sqrt(d))/(2*a)}, {obj: self, t: (-b + Math.sqrt(d))/(2*a)}].sort((a,b) => {return a.t < b.t ? -1 : 1; }); 
        };      
        self._normal = (oPoint) => {
            return tuple.normalize(tuple.subtract(oPoint, ORIGIN));
        }; 
        return self;
    },
    Plane = (material, transform) => {
        var
            self = Shape(material, transform);
        self._intersects = (oRay) => {
            return Math.abs(oRay.direction[Y]) < (Number.EPSILON * 1) ? [] : [{obj: self, t: -oRay.origin[Y]/oRay.direction[Y]}];
        };    
        self._normal = (oPoint) => {
            return tuple.vector(0, 1, 0);
        };
        return self;
    },
    Cube = (material, transform) => {
        var
            self = Shape(material, transform);
            
        return self;
    },
    Cylinder = (material, transform) => {
        var
            self = Shape(material, transform);
            
        return self;
    },
    World = (function() {
        return () => {
            var
                objects = [],
                lights = [];  

            function intersect(ray) {
                //console.group('World.intersect');console.log(ray);
                var result = [];
                objects.forEach(o => {
                        const xs = o.intersects(ray);
                    if (xs && xs.length) {
                        result = result.concat(...xs);
                    }
                });  
                result.sort((a,b) => {return a.t < b.t ? -1 : 1; });  
                //console.log(result.length);console.groupEnd();
                return result;
            } //intersect   

            return {
                get objects() { return objects; },
                set objects(value) { objects = value; },
                //objects: objects,
                get lights() { return lights;},
                set lights(value) { lights = value; },
                //lights: lights,
                intersect: intersect,
                inShadow: (point) => {
                    const
                        v = tuple.subtract(lights[0].position, point),
                        //distance = tuple.magnitude(v),
                        //direction = tuple.normalize(v),
                        h = hit(intersect(Ray(point, tuple.normalize(v))));
                    return !!(h && (h.t < tuple.magnitude(v)));
                }

            };
        };
    })(),  
    DefaultWorld = () => {
        const
            w = World(),
            s1 = Sphere(),
            s2 = Sphere();
        s1.material.color = tuple.color(0.8, 1, 0.6);
        s1.material.diffuse = 0.7;
        s1.material.specular = 0.2;
        s2.transform = m4x4.scale(0.5, 0.5, 0.5);
        w.objects.push(s1);
        w.objects.push(s2);
        w.lights.push(Light(tuple.point(-10, 10, -10), tuple.color(1, 1, 1)));
        return w;
    },
    Camera = (() => {
        return (hsize, vsize, fieldOfView) => {
            const
                half = Math.tan(fieldOfView/2),
                aspect = hsize/vsize,
                halfWidth = (aspect >= 1) ? half : half * aspect,
                halfHeight = (aspect >= 1) ? half / aspect : half,
                pixelSize = halfWidth * 2 / hsize;
            var
                _transform = m4x4.identity(),
                _inverse = m4x4.identity();
            const
                rayFromPixel = (x, y) => {
                    const
                        xoffset = (x + 0.5) * pixelSize,
                        yoffset = (y + 0.5) * pixelSize,
                        worldX = halfWidth - xoffset,
                        worldY = halfHeight - yoffset,
                        pixel = tuple.multiply(_inverse/*m4x4.inverse(_transform)*/, tuple.point(worldX, worldY, -1)),
                        origin = tuple.multiply(_inverse/*m4x4.inverse(_transform)*/, tuple.point(0, 0, 0)),
                        direction = tuple.normalize(tuple.subtract(pixel, origin));
                    return Ray(origin, direction);
                };

            return {
                hsize: hsize,
                vsize: vsize,
                fieldOfView: fieldOfView,
                get transform() { return _transform; },
                set transform(value) { 
                    _transform = value; 
                    _inverse = m4x4.inverse(_transform);
                },
                pixelSize: pixelSize,
                rayFromPixel: rayFromPixel,
                render: (world) => {
                    const
                        result = [];
                    var
                        x,y, row;    
                    for (y = 0; y < vsize; y++) {
                        row = [];
                        for (x = 0; x < hsize; x++) {
                            var ray = rayFromPixel(x, y);
                            var color = colorAt(world, ray);
                            row.push(color);
                        }
                        result.push(row);
                    }
                    return result;
                }
            };
        };
    })();


export default {
    X,
    Y,
    Z,
    W,
    R,
    G,
    B,
    tuple,
    BLACK,
    WHITE,
    RED,
    GREEN,
    BLUE,
    YELLOW,
    CYAN,
    MAGENTA,
    ORIGIN,
    m2x2,
    m3x3,
    m4x4,
    hit,
    lighting,
    shadeHit,
    colorAt,
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
    Camera
};