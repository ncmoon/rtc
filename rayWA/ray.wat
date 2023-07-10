(module
  (import "js" "mem" (memory $mem 1))

  ;; dot: (u, v) => u[0]*v[0] + u[1]*v[1] + u[2]*v[2] + u[3]*v[3], #0
  (func $$VectorDot (param $a v128) (param $b v128) (result v128)
    (local $tmp v128)
    local.get $a    ;;push mem[$a]
    local.get $b    ;;push mem[$b]
    f32x4.mul
    local.set $tmp
    local.get $tmp
    f32x4.extract_lane 0
    local.get $tmp
    f32x4.extract_lane 1
    f32.add
    local.get $tmp
    f32x4.extract_lane 2
    f32.add
    local.get $tmp
    f32x4.extract_lane 3
    f32.add
    f32x4.splat
  )

  ;; cross: (a, b) => { return tuple.vector(a[1]*b[2] - a[2]*b[1], a[2]*b[0] - a[0]*b[2], a[0]*b[1] - a[1]*b[0]); }, #1
  (func $$VectorCross (param $a v128) (param $b v128) (result v128)
    (local $o v128)
    (local $p v128)
    (local $q v128)
    (local $r v128)
    ;;local.get $a    ;;push $a
    ;;local.get $b    ;;push $b


    local.get $o
    local.get $a
    f32x4.extract_lane 1 
    f32x4.replace_lane 0
    local.get $a
    f32x4.extract_lane 2 
    f32x4.replace_lane 1
    local.get $a
    f32x4.extract_lane 0 
    f32x4.replace_lane 2
    ;;local.get $o    ;;[a[1], a[2], a[0], 0]

    local.get $p
    local.get $b
    f32x4.extract_lane 2 
    f32x4.replace_lane 0
    local.get $b
    f32x4.extract_lane 0 
    f32x4.replace_lane 1
    local.get $b
    f32x4.extract_lane 1 
    f32x4.replace_lane 2
    ;;local.get $p    ;;[b[2], b[0], b[1], 0]

    f32x4.mul       ;;[a[1]*b[2], a[2]*b[0], a[0]*b[1], 0]

    local.get $q
    local.get $a
    f32x4.extract_lane 2 
    f32x4.replace_lane 0
    local.get $a
    f32x4.extract_lane 0 
    f32x4.replace_lane 1
    local.get $a
    f32x4.extract_lane 1 
    f32x4.replace_lane 2
    ;;local.get $q  ;;[a[2], a[0], a[1], 0]

    local.get $r
    local.get $b
    f32x4.extract_lane 1 
    f32x4.replace_lane 0
    local.get $b
    f32x4.extract_lane 2 
    f32x4.replace_lane 1
    local.get $b
    f32x4.extract_lane 0 
    f32x4.replace_lane 2
    ;;local.get $r  ;;[b[1], b[2], b[0], 0]

    f32x4.mul       ;;[a[2]*b[1], a[0]*b[2], a[1]*b[0], 0]
    f32x4.sub       ;;[a[1]*b[2] - a[2]*b[1], a[2]*b[0] - a[0]*b[2], a[0]*b[1] - a[1]*b[0], 0-0]
  )

  ;; #2
  (func $$VectorMag (param $a v128) (result v128)
    (local $tmp v128)
    local.get $a    ;;push $a
    local.get $a    ;;push $a  .tee maybe
    call $$VectorDot
    f32x4.sqrt
  )

  ;; #3
  (func $$VectorNormalize (param $a v128) (result v128) ;;#10
    local.get $a    ;;push mem[$a]
    local.get $a    ;;push mem[$a]
    call $$VectorMag
    f32x4.div  
  )


  ;;these trivial functions are only used to test built-in vector operations, could be got rid of?
  ;; #4
  (func $VectorAbs (param $a i32) (param $y i32) ;;#0
    local.get $y    ;;push mem[$y]
    local.get $a    ;;push mem[$a]
    v128.load
    f32x4.abs
    v128.store      ;;pop to mem[$y]
  )

  (func $VectorNeg (param $a i32) (param $y i32)
    local.get $y    ;;push mem[$y]
    local.get $a    ;;push mem[$a]
    v128.load
    f32x4.neg
    v128.store      ;;pop to mem[$y]
  )

  (func $VectorSqrt (param $a i32) (param $y i32)
    local.get $y    ;;push mem[$y]
    local.get $a    ;;push mem[$a]
    v128.load
    f32x4.sqrt
    v128.store      ;;pop to mem[$y]
  )

  ;;//min,max

  (func $VectorAdd (param $a i32) (param $b i32) (param $y i32)
    local.get $y    ;;push mem[$y]
    local.get $a    ;;push mem[$a]
    v128.load
    local.get $b    ;;push mem[$b]
    v128.load
    f32x4.add
    v128.store      ;;pop to mem[$y]
  )

  (func $VectorSub (param $a i32) (param $b i32) (param $y i32)
    local.get $y    ;;push mem[$y]
    local.get $a    ;;push mem[$a]
    v128.load
    local.get $b    ;;push mem[$b]
    v128.load
    f32x4.sub
    v128.store      ;;pop to mem[$y]
  )

  (func $VectorMul (param $a i32) (param $b i32) (param $y i32)
    local.get $y    ;;push mem[$y]
    local.get $a    ;;push mem[$a]
    v128.load
    local.get $b    ;;push mem[$b]
    v128.load
    f32x4.mul
    v128.store      ;;pop to mem[$y]
  )

  (func $VectorDiv (param $a i32) (param $b i32) (param $y i32)
    local.get $y    ;;push mem[$y]
    local.get $a    ;;push mem[$a]
    v128.load
    local.get $b    ;;push mem[$b]
    v128.load
    f32x4.div
    v128.store      ;;pop to mem[$y]
  )
  ;; end of trivial functions



  ;;#11
  (func $VectorMag (param $a i32) (param $y i32)
    local.get $y    ;;push mem[$y]
    local.get $a    ;;push mem[$a]
    v128.load
    call $$VectorMag
    v128.store      ;;pop to mem[$y]
  )

  (func $VectorNormalize (param $a i32) (param $y i32)
    local.get $y    ;;push mem[$y]
    local.get $a    ;;push mem[$a]
    v128.load
    call $$VectorNormalize
    v128.store      ;;pop to mem[$y]
  )

  (func $VectorDot (param $a i32) (param $b i32) (param $y i32)
    local.get $y    ;;push mem[$y]
    local.get $a    ;;push mem[$a]
    v128.load
    local.get $b    ;;push mem[$a]
    v128.load
    call $$VectorDot
    v128.store      ;;pop to mem[$y]
  )

  (func $VectorCross (param $a i32) (param $b i32) (param $y i32)
    local.get $y    ;;push mem[$y]
    local.get $a    ;;push mem[$a]
    v128.load
    local.get $b    ;;push mem[$a]
    v128.load
    call $$VectorCross
    v128.store      ;;pop to mem[$y]
  )

  ;;(a, b) => { //shurr/hadamar product for colors
  ;;  return [a[R] * b[R], a[G] * b[G], a[B] * b[B], 0]; 
  ;;}  //or could just call VectorMul ?
  ;;#15
  (func $ColorProduct (param $a i32) (param $b i32) (param $y i32)
    local.get $y    ;;push mem[$y]
    local.get $a    ;;push mem[$a]
    v128.load
    local.get $b    ;;push mem[$a]
    v128.load
    f32x4.mul
    v128.store      ;;pop to mem[$y]
  )

  ;;(m, n) => {
  ;;  return Matrix([
  ;;      [
  ;;          m[4*0+0] * n[4*0+0] + m[4*0+1] * n[4*1+0] + m[4*0+2] * n[4*2+0] + m[4*0+3] * n[4*3+0], 
  ;;          m[4*0+0] * n[4*0+1] + m[4*0+1] * n[4*1+1] + m[4*0+2] * n[4*2+1] + m[4*0+3] * n[4*3+1], 
  ;;          m[4*0+0] * n[4*0+2] + m[4*0+1] * n[4*1+2] + m[4*0+2] * n[4*2+2] + m[4*0+3] * n[4*3+2], 
  ;;          m[4*0+0] * n[4*0+3] + m[4*0+1] * n[4*1+3] + m[4*0+2] * n[4*2+3] + m[4*0+3] * n[4*3+3]
  ;;      ],
  ;;      [
  ;;          m[4*1+0] * n[4*0+0] + m[4*1+1] * n[4*1+0] + m[4*1+2] * n[4*2+0] + m[4*1+3] * n[4*3+0], 
  ;;          m[4*1+0] * n[4*0+1] + m[4*1+1] * n[4*1+1] + m[4*1+2] * n[4*2+1] + m[4*1+3] * n[4*3+1], 
  ;;          m[4*1+0] * n[4*0+2] + m[4*1+1] * n[4*1+2] + m[4*1+2] * n[4*2+2] + m[4*1+3] * n[4*3+2], 
  ;;          m[4*1+0] * n[4*0+3] + m[4*1+1] * n[4*1+3] + m[4*1+2] * n[4*2+3] + m[4*1+3] * n[4*3+3]
  ;;      ],
  ;;      [
  ;;          m[4*2+0] * n[4*0+0] + m[4*2+1] * n[4*1+0] + m[4*2+2] * n[4*2+0] + m[4*2+3] * n[4*3+0], 
  ;;          m[4*2+0] * n[4*0+1] + m[4*2+1] * n[4*1+1] + m[4*2+2] * n[4*2+1] + m[4*2+3] * n[4*3+1], 
  ;;          m[4*2+0] * n[4*0+2] + m[4*2+1] * n[4*1+2] + m[4*2+2] * n[4*2+2] + m[4*2+3] * n[4*3+2], 
  ;;          m[4*2+0] * n[4*0+3] + m[4*2+1] * n[4*1+3] + m[4*2+2] * n[4*2+3] + m[4*2+3] * n[4*3+3]
  ;;      ],
  ;;      [
  ;;          m[4*3+0] * n[4*0+0] + m[4*3+1] * n[4*1+0] + m[4*3+2] * n[4*2+0] + m[4*3+3] * n[4*3+0], 
  ;;          m[4*3+0] * n[4*0+1] + m[4*3+1] * n[4*1+1] + m[4*3+2] * n[4*2+1] + m[4*3+3] * n[4*3+1], 
  ;;          m[4*3+0] * n[4*0+2] + m[4*3+1] * n[4*1+2] + m[4*3+2] * n[4*2+2] + m[4*3+3] * n[4*3+2], 
  ;;          m[4*3+0] * n[4*0+3] + m[4*3+1] * n[4*1+3] + m[4*3+2] * n[4*2+3] + m[4*3+3] * n[4*3+3]
  ;;      ]
  ;;  ]);
  ;;}

  (func $$MatrixMulRow (param $row v128) (param $n0 v128) (param $n1 v128) (param $n2 v128) (param $n3 v128) (result v128)
    local.get $row        ;;push mem[$row] [[0,1,2,3],...]
    f32x4.extract_lane 0
    f32x4.splat           ;;m[4*0+0], m[4*0+0], m[4*0+0], m[4*0+0]
    local.get $n0
    f32x4.mul             ;;m[4*0+0] * n[4*0+0], m[4*0+0] * n[4*0+1], m[4*0+0] * n[4*0+2], m[4*0+0] * n[4*0+3]   

    local.get $row        ;;push mem[$row] [[0,1,2,3],...]
    f32x4.extract_lane 1
    f32x4.splat           ;;m[4*0+0], m[4*0+0], m[4*0+0], m[4*0+0]
    local.get $n1
    f32x4.mul             ;;m[4*0+0] * n[4*1+0], m[4*0+0] * n[4*1+1], m[4*0+0] * n[4*1+2], m[4*0+0] * n[4*1+3]   

    local.get $row        ;;push mem[$row] [[0,1,2,3],...]
    f32x4.extract_lane 2
    f32x4.splat           ;;m[4*0+0], m[4*0+0], m[4*0+0], m[4*0+0]
    local.get $n2
    f32x4.mul             ;;m[4*0+0] * n[4*2+0], m[4*0+0] * n[4*2+1], m[4*0+0] * n[4*2+2], m[4*0+0] * n[4*2+3]   

    local.get $row        ;;push mem[$row] [[0,1,2,3],...]
    f32x4.extract_lane 3
    f32x4.splat           ;;m[4*0+0], m[4*0+0], m[4*0+0], m[4*0+0]
    local.get $n3
    f32x4.mul             ;;m[4*0+0] * n[4*3+0], m[4*0+0] * n[4*3+1], m[4*0+0] * n[4*3+2], m[4*0+0] * n[4*3+3]   

    f32x4.add         
    f32x4.add         
    f32x4.add             ;;result = 
  )
  (func $MatrixMul (param $m i32) (param $n i32) (param $y i32)
    local.get $y    ;;push mem[$y]
    local.get $m    ;;push mem[$m] [[0,1,2,3],...]
    v128.load
    local.get $n 
    v128.load
    local.get $n 
    i32.const 16
    i32.add
    v128.load 
    local.get $n 
    i32.const 32
    i32.add
    v128.load 
    local.get $n 
    i32.const 48
    i32.add
    v128.load 
    call $$MatrixMulRow
    v128.store      ;;pop to mem[$y]

    local.get $y    ;;push mem[$y]
    i32.const 16
    i32.add
    local.get $m    ;;push mem[$m] [[0,1,2,3],...]
    i32.const 16
    i32.add
    v128.load 
    local.get $n 
    v128.load
    local.get $n 
    i32.const 16
    i32.add
    v128.load 
    local.get $n 
    i32.const 32
    i32.add
    v128.load 
    local.get $n 
    i32.const 48
    i32.add
    v128.load 
    call $$MatrixMulRow
    v128.store      ;;pop to mem[$y+16]

    local.get $y    ;;push mem[$y]
    i32.const 32
    i32.add
    local.get $m    ;;push mem[$m] [[0,1,2,3],...]
    i32.const 32
    i32.add
    v128.load 
    local.get $n 
    v128.load
    local.get $n 
    i32.const 16
    i32.add
    v128.load 
    local.get $n 
    i32.const 32
    i32.add
    v128.load 
    local.get $n 
    i32.const 48
    i32.add
    v128.load 
    call $$MatrixMulRow
    v128.store      ;;pop to mem[$y+32]

    local.get $y    ;;push mem[$y]
    i32.const 48
    i32.add
    local.get $m    ;;push mem[$m] [[0,1,2,3],...]
    i32.const 48
    i32.add
    v128.load 
    local.get $n 
    v128.load
    local.get $n 
    i32.const 16
    i32.add
    v128.load 
    local.get $n 
    i32.const 32
    i32.add
    v128.load 
    local.get $n 
    i32.const 48
    i32.add
    v128.load 
    call $$MatrixMulRow
    v128.store      ;;pop to mem[$y+48]
  )


  ;;(M, v) => { //pre-multiply the tuple by a matrix.
  ;;  return [
  ;;    M[4*0+0]*v[0] + , M[4*1+0]*v[0] + , M[4*2+0]*v[0] + , M[4*3+0]*v[0] + 
  ;;    M[4*0+1]*v[1] + , M[4*1+1]*v[1] + , M[4*2+1]*v[1] + , M[4*3+1]*v[1] + 
  ;;    M[4*0+2]*v[2] + , M[4*1+2]*v[2] + , M[4*2+2]*v[2] + , M[4*3+2]*v[2] +
  ;;    M[4*0+3]*v[3]   , M[4*1+3]*v[3]   , M[4*2+3]*v[3]   , M[4*3+3]*v[3]
  ;;  ]);
  ;;};
  ;;#18
  (func $$MatrixVectorMul (param $m0 v128) (param $m1 v128) (param $m2 v128) (param $m3 v128) (param $v v128) (result v128)
    (local $tmp v128)
    local.get $tmp
    local.get $m0         ;;assemble from $mX[]  
    f32x4.extract_lane 0  ;; $m0[0]
    f32x4.replace_lane 0
    ;;local.get $tmp
    local.get $m1         
    f32x4.extract_lane 0  ;; $m1[0]
    f32x4.replace_lane 1
    ;;local.get $tmp
    local.get $m2         
    f32x4.extract_lane 0  ;; $m2[0]
    f32x4.replace_lane 2
    ;;local.get $tmp
    local.get $m3        
    f32x4.extract_lane 0  ;; $m3[0]
    f32x4.replace_lane 3  ;; [$m0[0], $m1[0], $m2[0], $m3[0]]
    local.get $v
    f32x4.extract_lane 0  ;;from $v
    f32x4.splat           ;; [$v[0], $v[0], $v[0], $v[0]]
    f32x4.mul             ;; [$m0[0]*$v[0], $m1[0]*$v[0], $m2[0]*$v[0], $m3[0]*$v[0]]

    local.get $tmp
    local.get $m0         ;;assemble from $mX[]  
    f32x4.extract_lane 1  ;; $m0[1]
    f32x4.replace_lane 0
    ;;local.get $tmp
    local.get $m1         
    f32x4.extract_lane 1  ;; $m1[1]
    f32x4.replace_lane 1
    ;;local.get $tmp
    local.get $m2         
    f32x4.extract_lane 1  ;; $m2[1]
    f32x4.replace_lane 2
    ;;local.get $tmp
    local.get $m3        
    f32x4.extract_lane 1  ;; $m3[1]
    f32x4.replace_lane 3  ;; [$m0[1], $m1[1], $m2[1], $m3[1]]
    local.get $v
    f32x4.extract_lane 1  ;;from $v
    f32x4.splat           ;; [$v[1], $v[1], $v[1], $v[1]]
    f32x4.mul             ;; [$m0[1]*$v[1], $m1[1]*$v[1], $m2[1]*$v[0], $m3[1]*$v[1]]

    local.get $tmp
    local.get $m0         ;;assemble from $mX[]  
    f32x4.extract_lane 2  ;; $m0[2]
    f32x4.replace_lane 0
    ;;local.get $tmp
    local.get $m1         
    f32x4.extract_lane 2  ;; $m1[2]
    f32x4.replace_lane 1
    ;;local.get $tmp
    local.get $m2         
    f32x4.extract_lane 2  ;; $m2[2]
    f32x4.replace_lane 2
    ;;local.get $tmp
    local.get $m3        
    f32x4.extract_lane 2  ;; $m3[2]
    f32x4.replace_lane 3  ;; [$m0[2], $m1[2], $m2[2], $m3[2]]
    local.get $v
    f32x4.extract_lane 2  ;;from $v
    f32x4.splat           ;; [$v[2], $v[2], $v[2], $v[2]]
    f32x4.mul             ;; [$m0[2]*$v[2], $m1[2]*$v[2], $m2[2]*$v[2], $m3[2]*$v[2]]

    local.get $tmp
    local.get $m0         ;;assemble from $mX[]  
    f32x4.extract_lane 3  ;; $m0[3]
    f32x4.replace_lane 0
    ;;local.get $tmp
    local.get $m1         
    f32x4.extract_lane 3  ;; $m1[3]
    f32x4.replace_lane 1
    ;;local.get $tmp
    local.get $m2         
    f32x4.extract_lane 3  ;; $m2[3]
    f32x4.replace_lane 2
    ;;local.get $tmp
    local.get $m3        
    f32x4.extract_lane 3  ;; $m3[3]
    f32x4.replace_lane 3  ;; [$m0[3], $m1[3], $m2[3], $m3[3]]
    local.get $v
    f32x4.extract_lane 3  ;;from $v
    f32x4.splat           ;; [$v[3], $v[3], $v[3], $v[3]]
    f32x4.mul             ;; [$m0[3]*$v[3], $m1[3]*$v[3], $m2[3]*$v[3], $m3[3]*$v[3]]

    f32x4.add
    f32x4.add
    f32x4.add             ;;result 
  )


  ;;  MatrixTranspose = (m) => { 
  ;;      return Matrix([
  ;;          [m[4*0+0], m[4*1+0], m[4*2+0], m[4*3+0]],
  ;;          [m[4*0+1], m[4*1+1], m[4*2+1], m[4*3+1]],
  ;;          [m[4*0+2], m[4*1+2], m[4*2+2], m[4*3+2]],
  ;;          [m[4*0+3], m[4*1+3], m[4*2+3], m[4*3+3]]
  ;;      ]); 
  ;;  },
  (func $$MatrixTransposeRow0 (param $m0 v128) (param $m1 v128) (param $m2 v128) (param $m3 v128) (result v128)
    (local $work v128)

    local.get $work
    local.get $m0        
    f32x4.extract_lane 0
    f32x4.replace_lane 0  ;; [$m0[0], ?, ? , ?]

    local.get $m1        
    f32x4.extract_lane 0
    f32x4.replace_lane 1  ;; [$m0[0], $m1[0], ? , ?]

    local.get $m2        
    f32x4.extract_lane 0
    f32x4.replace_lane 2  ;; [$m0[0], $m1[0], $m2[0], ?]

    local.get $m3        
    f32x4.extract_lane 0
    f32x4.replace_lane 3  ;; [$m0[0], $m1[0], $m2[0], $m3[0]]
  )
  ;;#20
  (func $$MatrixTransposeRow1 (param $m0 v128) (param $m1 v128) (param $m2 v128) (param $m3 v128) (result v128)
    (local $work v128)

    local.get $work
    local.get $m0        
    f32x4.extract_lane 1
    f32x4.replace_lane 0  ;; [$m0[1], ?, ? , ?]

    local.get $m1        
    f32x4.extract_lane 1
    f32x4.replace_lane 1  ;; [$m0[1], $m1[1], ? , ?]

    local.get $m2        
    f32x4.extract_lane 1
    f32x4.replace_lane 2  ;; [$m0[1], $m1[1], $m2[1], ?]

    local.get $m3        
    f32x4.extract_lane 1
    f32x4.replace_lane 3  ;; [$m0[1], $m1[1], $m2[1], $m3[1]]
  )
  (func $$MatrixTransposeRow2 (param $m0 v128) (param $m1 v128) (param $m2 v128) (param $m3 v128) (result v128)
    (local $work v128)
    
    local.get $work
    local.get $m0        
    f32x4.extract_lane 2
    f32x4.replace_lane 0  ;; [$m0[2], ?, ? , ?]

    local.get $m1        
    f32x4.extract_lane 2
    f32x4.replace_lane 1  ;; [$m0[2], $m1[2], ? , ?]

    local.get $m2        
    f32x4.extract_lane 2
    f32x4.replace_lane 2  ;; [$m0[2], $m1[2], $m2[2], ?]

    local.get $m3        
    f32x4.extract_lane 2
    f32x4.replace_lane 3  ;; [$m0[2], $m1[2], $m2[2], $m3[2]]
  )
  (func $$MatrixTransposeRow3 (param $m0 v128) (param $m1 v128) (param $m2 v128) (param $m3 v128) (result v128)
    (local $work v128)
    
    local.get $work
    local.get $m0        
    f32x4.extract_lane 3
    f32x4.replace_lane 0  ;; [$m0[3], ?, ? , ?]

    local.get $m1        
    f32x4.extract_lane 3
    f32x4.replace_lane 1  ;; [$m0[3], $m1[3], ? , ?]

    local.get $m2        
    f32x4.extract_lane 3
    f32x4.replace_lane 2  ;; [$m0[3], $m1[3], $m2[3], ?]

    local.get $m3        
    f32x4.extract_lane 3
    f32x4.replace_lane 3  ;; [$m0[3], $m1[3], $m2[3], $m3[3]]
  )


  (func $MatrixTranspose (param $m i32) (param $y i32)

    local.get $y    ;;push mem[$y]
    local.get $m
    v128.load       ;;$m0
    local.get $m
    i32.const 16
    i32.add
    v128.load       ;;$m1
    local.get $m
    i32.const 32
    i32.add
    v128.load       ;;$m2
    local.get $m
    i32.const 48
    i32.add
    v128.load       ;;$m3
    call $$MatrixTransposeRow0
    v128.store      ;;pop to mem[$y]

    local.get $y    ;;push mem[$y]
    i32.const 16
    i32.add
    local.get $m
    v128.load       ;;$m0
    local.get $m
    i32.const 16
    i32.add
    v128.load       ;;$m1
    local.get $m
    i32.const 32
    i32.add
    v128.load       ;;$m2
    local.get $m
    i32.const 48
    i32.add
    v128.load       ;;$m3
    call $$MatrixTransposeRow1
    v128.store      ;;pop to mem[$y]

    local.get $y    ;;push mem[$y]
    i32.const 32
    i32.add
    local.get $m
    v128.load       ;;$m0
    local.get $m
    i32.const 16
    i32.add
    v128.load       ;;$m1
    local.get $m
    i32.const 32
    i32.add
    v128.load       ;;$m2
    local.get $m
    i32.const 48
    i32.add
    v128.load       ;;$m3
    call $$MatrixTransposeRow2
    v128.store      ;;pop to mem[$y]

    local.get $y    ;;push mem[$y]
    i32.const 48
    i32.add
    local.get $m
    v128.load       ;;$m0
    local.get $m
    i32.const 16
    i32.add
    v128.load       ;;$m1
    local.get $m
    i32.const 32
    i32.add
    v128.load       ;;$m2
    local.get $m
    i32.const 48
    i32.add
    v128.load       ;;$m3
    call $$MatrixTransposeRow3
    v128.store      ;;pop to mem[$y]
  )

  ;;MatrixDeterminant = (m) => {
  ;;  return  m[4*0+0] *  
  ;;                  //M3determinant(m3x3.new([ [m[1][1], m[1][2], m[1][3]], [m[2][1], m[2][2], m[2][3]], [m[3][1], m[3][2], m[3][3]] ])) + 
  ;;                  (
  ;;                      m[4*1+1] *  (m[4*2+2] * m[4*3+3] - m[4*2+3] * m[4*3+2]) + 
  ;;                      m[4*1+2] * -(m[4*2+1] * m[4*3+3] - m[4*2+3] * m[4*3+1]) + 
  ;;                      m[4*1+3] *  (m[4*2+1] * m[4*3+2] - m[4*2+2] * m[4*3+1])
  ;;                  ) +
  ;;              m[4*0+1] * 
  ;;                  //-M3determinant(m3x3.new([ [m[1][0], m[1][2], m[1][3]], [m[2][0], m[2][2], m[2][3]], [m[3][0], m[3][2], m[3][3]] ])) + 
  ;;                  -(
  ;;                      m[4*1+0] *  (m[4*2+2] * m[4*3+3] - m[4*2+3] * m[4*3+2]) + 
  ;;                      m[4*1+2] * -(m[4*2+0] * m[4*3+3] - m[4*2+3] * m[4*3+0]) + 
  ;;                      m[4*1+3] *  (m[4*2+0] * m[4*3+2] - m[4*2+2] * m[4*3+0])
  ;;                  ) +
  ;;              m[4*0+2] *  
  ;;                  //M3determinant(m3x3.new([ [m[1][0], m[1][1], m[1][3]], [m[2][0], m[2][1], m[2][3]], [m[3][0], m[3][1], m[3][3]] ])) +
  ;;                  (
  ;;                      m[4*1+0] *  (m[4*2+1] * m[4*3+3] - m[4*2+3] * m[4*3+1]) + 
  ;;                      m[4*1+1] * -(m[4*2+0] * m[4*3+3] - m[4*2+3] * m[4*3+0]) + 
  ;;                      m[4*1+3] *  (m[4*2+0] * m[4*3+1] - m[4*2+1] * m[4*3+0])
  ;;                  ) +
  ;;              m[4*0+3] * 
  ;;                  //-M3determinant(m3x3.new([ [m[1][0], m[1][1], m[1][2]], [m[2][0], m[2][1], m[2][2]], [m[3][0], m[3][1], m[3][2]] ]));     
  ;;                  -(
  ;;                      m[4*1+0] *  (m[4*2+1] * m[4*3+2] - m[4*2+2] * m[4*3+1]) + 
  ;;                      m[4*1+1] * -(m[4*2+0] * m[4*3+2] - m[4*2+2] * m[4*3+0]) + 
  ;;                      m[4*1+2] *  (m[4*2+0] * m[4*3+1] - m[4*2+1] * m[4*3+0])
  ;;  );
  ;;}
  (func $$VectorSumParts (param $v v128) (result f32)
    local.get $v
    f32x4.extract_lane 0
    local.get $v
    f32x4.extract_lane 1
    local.get $v
    f32x4.extract_lane 2
    local.get $v
    f32x4.extract_lane 3
    f32.add
    f32.add
    f32.add                   ;; return $v[0] + $v[1] + $v[2] + $v[3]
  )
  (func $$M2Det (param $a f32) (param $b f32) (param $c f32) (param $d f32) (result f32)
    local.get $a
    local.get $b
    f32.mul             ;; a*b
    local.get $c
    local.get $d
    f32.mul             ;; c*d
    f32.sub             ;; a*b - c*d
  )
  ;;(
  ;;   m[4*1+1] *  (m[4*2+2] * m[4*3+3] - m[4*2+3] * m[4*3+2]) + 
  ;;   m[4*1+2] * -(m[4*2+1] * m[4*3+3] - m[4*2+3] * m[4*3+1]) + 
  ;;   m[4*1+3] *  (m[4*2+1] * m[4*3+2] - m[4*2+2] * m[4*3+1])
  ;;)
  ;;   [0, $m1[1],                              $m1[2],                               $m1[3]                             ]
  ;;   [?, ($m2[2] * $m3[3] - $m2[3] * $m3[2]), -($m2[1] * $m3[3] - $m2[3] * $m3[1]), ($m2[1] * $m3[2] - $m2[2] * $m3[1])]
  ;;   mul
  (func $$M3Det0 (param $m1 v128) (param $m2 v128) (param $m3 v128) (result f32)
    (local $tmp v128)
    local.get $m1   
    f32.const 0
    f32x4.replace_lane 0

    local.get $tmp
    f32.const 0
    f32x4.replace_lane 0  ;; 0

    local.get $m2
    f32x4.extract_lane 2
    local.get $m3
    f32x4.extract_lane 3
    local.get $m2
    f32x4.extract_lane 3
    local.get $m3
    f32x4.extract_lane 2  
    call $$M2Det
    f32x4.replace_lane 1  ;; ($m2[2] * $m3[3] - $m2[3] * $m3[2])

    local.get $m2
    f32x4.extract_lane 1
    local.get $m3
    f32x4.extract_lane 3
    local.get $m2
    f32x4.extract_lane 3
    local.get $m3
    f32x4.extract_lane 1  
    call $$M2Det
    f32.neg
    f32x4.replace_lane 2  ;; -($m2[1] * $m3[3] - $m2[3] * $m3[1])

    local.get $m2
    f32x4.extract_lane 1
    local.get $m3
    f32x4.extract_lane 2
    local.get $m2
    f32x4.extract_lane 2
    local.get $m3
    f32x4.extract_lane 1  
    call $$M2Det
    f32x4.replace_lane 3  ;; ($m2[1] * $m3[2] - $m2[2] * $m3[1])

    f32x4.mul
    call $$VectorSumParts
  )
  ;;-(
  ;;    m[4*1+0] *  (m[4*2+2] * m[4*3+3] - m[4*2+3] * m[4*3+2]) + 
  ;;    m[4*1+2] * -(m[4*2+0] * m[4*3+3] - m[4*2+3] * m[4*3+0]) + 
  ;;    m[4*1+3] *  (m[4*2+0] * m[4*3+2] - m[4*2+2] * m[4*3+0])
  ;;)
  ;;   [$m1[0],                              0, $m1[2],                               $m1[3]                             ]
  ;;   [($m2[2] * $m3[3] - $m2[3] * $m3[2]), ?, -($m2[0] * $m3[3] - $m2[3] * $m3[0]), ($m2[0] * $m3[2] - $m2[2] * $m3[0])]
  ;;   mul
  ;;#27
  (func $$M3Det1 (param $m1 v128) (param $m2 v128) (param $m3 v128) (result f32)
    (local $tmp v128)
    local.get $m1   ;;$m1
    f32.const 0
    f32x4.replace_lane 1

    local.get $tmp
    f32.const 0
    f32x4.replace_lane 1  ;; 0

    local.get $m2
    f32x4.extract_lane 2
    local.get $m3
    f32x4.extract_lane 3
    local.get $m2
    f32x4.extract_lane 3
    local.get $m3
    f32x4.extract_lane 2  
    call $$M2Det
    f32x4.replace_lane 0  ;; ($m2[2] * $m3[3] - $m2[3] * $m3[2])

    local.get $m2
    f32x4.extract_lane 0
    local.get $m3
    f32x4.extract_lane 3
    local.get $m2
    f32x4.extract_lane 3
    local.get $m3
    f32x4.extract_lane 0  
    call $$M2Det
    f32.neg
    f32x4.replace_lane 2  ;; -($m2[0] * $m3[3] - $m2[3] * $m3[0])

    local.get $m2
    f32x4.extract_lane 0
    local.get $m3
    f32x4.extract_lane 2
    local.get $m2
    f32x4.extract_lane 2
    local.get $m3
    f32x4.extract_lane 0  
    call $$M2Det
    f32x4.replace_lane 3  ;; ($m2[0] * $m3[2] - $m2[2] * $m3[0])
        
    f32x4.mul
    call $$VectorSumParts
  )
  ;;(
  ;;    m[4*1+0] *  (m[4*2+1] * m[4*3+3] - m[4*2+3] * m[4*3+1]) + 
  ;;    m[4*1+1] * -(m[4*2+0] * m[4*3+3] - m[4*2+3] * m[4*3+0]) + 
  ;;    m[4*1+3] *  (m[4*2+0] * m[4*3+1] - m[4*2+1] * m[4*3+0])
  ;;) 
  ;;   [$m1[0],                              $m1[1],                               0, $m1[3]                             ]
  ;;   [($m2[1] * $m3[3] - $m2[3] * $m3[1]), -($m2[0] * $m3[3] - $m2[3] * $m3[0]), ?, ($m2[0] * $m3[1] - $m2[1] * $m3[0])]
  ;;   mul
  (func $$M3Det2 (param $m1 v128) (param $m2 v128) (param $m3 v128) (result f32)
    (local $tmp v128)
    local.get $m1   ;;$m1
    f32.const 0
    f32x4.replace_lane 2

    local.get $tmp
    f32.const 0
    f32x4.replace_lane 2  ;; 0

    local.get $m2
    f32x4.extract_lane 1
    local.get $m3
    f32x4.extract_lane 3
    local.get $m2
    f32x4.extract_lane 3
    local.get $m3
    f32x4.extract_lane 1  
    call $$M2Det
    f32x4.replace_lane 0  ;; ($m2[1] * $m3[3] - $m2[3] * $m3[1])

    local.get $m2
    f32x4.extract_lane 0
    local.get $m3
    f32x4.extract_lane 3
    local.get $m2
    f32x4.extract_lane 3
    local.get $m3
    f32x4.extract_lane 0  
    call $$M2Det
    f32.neg
    f32x4.replace_lane 1  ;; -($m2[0] * $m3[3] - $m2[3] * $m3[0])

    local.get $m2
    f32x4.extract_lane 0
    local.get $m3
    f32x4.extract_lane 1
    local.get $m2
    f32x4.extract_lane 1
    local.get $m3
    f32x4.extract_lane 0  
    call $$M2Det
    f32x4.replace_lane 3  ;; ($m2[0] * $m3[1] - $m2[1] * $m3[0])

    f32x4.mul
    call $$VectorSumParts
  )
  ;;-(
  ;;    m[4*1+0] *  (m[4*2+1] * m[4*3+2] - m[4*2+2] * m[4*3+1]) + 
  ;;    m[4*1+1] * -(m[4*2+0] * m[4*3+2] - m[4*2+2] * m[4*3+0]) + 
  ;;    m[4*1+2] *  (m[4*2+0] * m[4*3+1] - m[4*2+1] * m[4*3+0])
  ;;);
  ;;   [$m1[0],                              $m1[1],                               $m1[2],                              0]
  ;;   [($m2[1] * $m3[2] - $m2[2] * $m3[1]), -($m2[0] * $m3[2] - $m2[2] * $m3[0]), ($m2[0] * $m3[1] - $m2[1] * $m3[0]), ?]
  ;;   mul
  (func $$M3Det3 (param $m1 v128) (param $m2 v128) (param $m3 v128) (result f32)
    (local $tmp v128)
    local.get $m1   ;;$m1
    f32.const 0
    f32x4.replace_lane 3

    local.get $tmp
    f32.const 0
    f32x4.replace_lane 3  ;; 0

    local.get $m2
    f32x4.extract_lane 1
    local.get $m3
    f32x4.extract_lane 2
    local.get $m2
    f32x4.extract_lane 2
    local.get $m3
    f32x4.extract_lane 1  
    call $$M2Det
    f32x4.replace_lane 0  ;; ($m2[1] * $m3[2] - $m2[2] * $m3[1])

    local.get $m2
    f32x4.extract_lane 0
    local.get $m3
    f32x4.extract_lane 2
    local.get $m2
    f32x4.extract_lane 2
    local.get $m3
    f32x4.extract_lane 0  
    call $$M2Det
    f32.neg
    f32x4.replace_lane 1  ;; -($m2[0] * $m3[2] - $m2[2] * $m3[0])

    local.get $m2
    f32x4.extract_lane 0
    local.get $m3
    f32x4.extract_lane 1
    local.get $m2
    f32x4.extract_lane 1
    local.get $m3
    f32x4.extract_lane 0  
    call $$M2Det
    f32x4.replace_lane 2  ;; ($m2[0] * $m3[1] - $m2[1] * $m3[0])

    f32x4.mul
    call $$VectorSumParts
  )

  ;;#30
  (func $$MatrixDeterminant (param $m0 v128)  (param $m1 v128)  (param $m2 v128)  (param $m3 v128) (result v128)
    (local $tmp v128)
    local.get $m0
    local.get $tmp

    local.get $m1           ;;push $m1
    local.get $m2           ;;push $m2
    local.get $m3           ;;push $m3
    call $$M3Det0
    f32x4.replace_lane 0

    local.get $m1           ;;push $m1
    local.get $m2           ;;push $m2
    local.get $m3           ;;push $m3
    call $$M3Det1
    f32.neg
    f32x4.replace_lane 1

    local.get $m1           ;;push $m1
    local.get $m2           ;;push $m2
    local.get $m3           ;;push $m3
    call $$M3Det2
    f32x4.replace_lane 2

    local.get $m1           ;;push $m1
    local.get $m2           ;;push $m2
    local.get $m3           ;;push $m3
    call $$M3Det3
    f32.neg
    f32x4.replace_lane 3

    f32x4.mul
    call $$VectorSumParts
    f32x4.splat
  )  
  ;;#31
  (func $MatrixDeterminant (param $m i32) (param $y i32)
    local.get $y

    local.get $m
    v128.load       ;;push $m0

    local.get $m    ;;push $m1
    i32.const 16
    i32.add
    v128.load 

    local.get $m    ;;push $m2
    i32.const 32
    i32.add
    v128.load 

    local.get $m    ;;push $m3
    i32.const 48
    i32.add
    v128.load 

    call $$MatrixDeterminant
    v128.store
  )




  ;;MatrixInverse = (m) => {
  ;;  det = MatrixDeterminant(m);
  ;;  return Matrix([
  ;;    [
  ;;              (
  ;;                  m[4*1+1] *  (m[4*2+2] * m[4*3+3] - m[4*2+3] * m[4*3+2]) + 
  ;;                  m[4*1+2] * -(m[4*2+1] * m[4*3+3] - m[4*2+3] * m[4*3+1]) + 
  ;;                  m[4*1+3] *  (m[4*2+1] * m[4*3+2] - m[4*2+2] * m[4*3+1])
  ;;              )/det, //M3Det(subMatrix(m, 0, 0))
  ;;              -(
  ;;                  m[4*0+1] *  (m[4*2+2] * m[4*3+3] - m[4*2+3] * m[4*3+2]) + 
  ;;                  m[4*0+2] * -(m[4*2+1] * m[4*3+3] - m[4*2+3] * m[4*3+1]) + 
  ;;                  m[4*0+3] *  (m[4*2+1] * m[4*3+2] - m[4*2+2] * m[4*3+1])
  ;;              )/det, //M3Det(subMatrix(m, 1, 0))
  ;;               (
  ;;                  m[4*0+1] *  (m[4*1+2] * m[4*3+3] - m[4*1+3] * m[4*3+2]) + 
  ;;                  m[4*0+2] * -(m[4*1+1] * m[4*3+3] - m[4*1+3] * m[4*3+1]) + 
  ;;                  m[4*0+3] *  (m[4*1+1] * m[4*3+2] - m[4*1+2] * m[4*3+1])
  ;;              )/det, //M3Det(subMatrix(m, 2, 0))
  ;;              -(
  ;;                  m[4*0+1] *  (m[4*1+2] * m[4*2+3] - m[4*1+3] * m[4*2+2]) + 
  ;;                  m[4*0+2] * -(m[4*1+1] * m[4*2+3] - m[4*1+3] * m[4*2+1]) + 
  ;;                  m[4*0+3] *  (m[4*1+1] * m[4*2+2] - m[4*1+2] * m[4*2+1])
  ;;              )/det //M3Det(subMatrix(m, 3, 0))
  ;;    ],
  ;;    [
  ;;             -(
  ;;                  m[4*1+0] *  (m[4*2+2] * m[4*3+3] - m[4*2+3] * m[4*3+2]) + 
  ;;                  m[4*1+2] * -(m[4*2+0] * m[4*3+3] - m[4*2+3] * m[4*3+0]) + 
  ;;                  m[4*1+3] *  (m[4*2+0] * m[4*3+2] - m[4*2+2] * m[4*3+0])
  ;;              )/det, //M3Det(subMatrix(m, 0, 1))
  ;;              (
  ;;                  m[4*0+0] *  (m[4*2+2] * m[4*3+3] - m[4*2+3] * m[4*3+2]) + 
  ;;                  m[4*0+2] * -(m[4*2+0] * m[4*3+3] - m[4*2+3] * m[4*3+0]) + 
  ;;                  m[4*0+3] *  (m[4*2+0] * m[4*3+2] - m[4*2+2] * m[4*3+0])
  ;;              )/det, //M3Det(subMatrix(m, 1, 1))
  ;;              -(
  ;;                  m[4*0+0] *  (m[4*1+2] * m[4*3+3] - m[4*1+3] * m[4*3+2]) + 
  ;;                  m[4*0+2] * -(m[4*1+0] * m[4*3+3] - m[4*1+3] * m[4*3+0]) + 
  ;;                  m[4*0+3] *  (m[4*1+0] * m[4*3+2] - m[4*1+2] * m[4*3+0])
  ;;              )/det, //M3Det(subMatrix(m, 2, 1))
  ;;              (
  ;;                  m[4*0+0] *  (m[4*1+2] * m[4*2+3] - m[4*1+3] * m[4*2+2]) + 
  ;;                  m[4*0+2] * -(m[4*1+0] * m[4*2+3] - m[4*1+3] * m[4*2+0]) + 
  ;;                  m[4*0+3] *  (m[4*1+0] * m[4*2+2] - m[4*1+2] * m[4*2+0])
  ;;              )/det  //M3Det(subMatrix(m, 3, 1))
  ;;    ],
  ;;    [
  ;;              (
  ;;                  m[4*1+0] *  (m[4*2+1] * m[4*3+3] - m[4*2+3] * m[4*3+1]) + 
  ;;                  m[4*1+1] * -(m[4*2+0] * m[4*3+3] - m[4*2+3] * m[4*3+0]) + 
  ;;                  m[4*1+3] *  (m[4*2+0] * m[4*3+1] - m[4*2+1] * m[4*3+0])
  ;;              )/det, //M3Det(subMatrix(m, 0, 2))
  ;;              -(
  ;;                  m[4*0+0] *  (m[4*2+1] * m[4*3+3] - m[4*2+3] * m[4*3+1]) + 
  ;;                  m[4*0+1] * -(m[4*2+0] * m[4*3+3] - m[4*2+3] * m[4*3+0]) + 
  ;;                  m[4*0+3] *  (m[4*2+0] * m[4*3+1] - m[4*2+1] * m[4*3+0])
  ;;              )/det, //M3Det(subMatrix(m, 1, 2))
  ;;              (
  ;;                  m[4*0+0] *  (m[4*1+1] * m[4*3+3] - m[4*1+3] * m[4*3+1]) + 
  ;;                  m[4*0+1] * -(m[4*1+0] * m[4*3+3] - m[4*1+3] * m[4*3+0]) + 
  ;;                  m[4*0+3] *  (m[4*1+0] * m[4*3+1] - m[4*1+1] * m[4*3+0])
  ;;               )/det, //M3Det(subMatrix(m, 2, 2))
  ;;              -(
  ;;                  m[4*0+0] *  (m[4*1+1] * m[4*2+3] - m[4*1+3] * m[4*2+1]) + 
  ;;                  m[4*0+1] * -(m[4*1+0] * m[4*2+3] - m[4*1+3] * m[4*2+0]) + 
  ;;                  m[4*0+3] *  (m[4*1+0] * m[4*2+1] - m[4*1+1] * m[4*2+0])
  ;;              )/det //M3Det(subMatrix(m, 3, 2))
  ;;    ],
  ;;    [
  ;;              -(
  ;;                  m[4*1+0] *  (m[4*2+1] * m[4*3+2] - m[4*2+2] * m[4*3+1]) + 
  ;;                  m[4*1+1] * -(m[4*2+0] * m[4*3+2] - m[4*2+2] * m[4*3+0]) + 
  ;;                  m[4*1+2] *  (m[4*2+0] * m[4*3+1] - m[4*2+1] * m[4*3+0])
  ;;              )/det, //M3Det(subMatrix(m, 0, 3))
  ;;              (
  ;;                  m[4*0+0] *  (m[4*2+1] * m[4*3+2] - m[4*2+2] * m[4*3+1]) + 
  ;;                  m[4*0+1] * -(m[4*2+0] * m[4*3+2] - m[4*2+2] * m[4*3+0]) + 
  ;;                  m[4*0+2] *  (m[4*2+0] * m[4*3+1] - m[4*2+1] * m[4*3+0])
  ;;              )/det, //M3Det(subMatrix(m, 1, 3))
  ;;              -(
  ;;                  m[4*0+0] *  (m[4*1+1] * m[4*3+2] - m[4*1+2] * m[4*3+1]) + 
  ;;                  m[4*0+1] * -(m[4*1+0] * m[4*3+2] - m[4*1+2] * m[4*3+0]) + 
  ;;                  m[4*0+2] *  (m[4*1+0] * m[4*3+1] - m[4*1+1] * m[4*3+0])
  ;;              )/det, //M3Det(subMatrix(m, 2, 3))
  ;;              (
  ;;                  m[4*0+0] *  (m[4*1+1] * m[4*2+2] - m[4*1+2] * m[4*2+1]) + 
  ;;                  m[4*0+1] * -(m[4*1+0] * m[4*2+2] - m[4*1+2] * m[4*2+0]) + 
  ;;                  m[4*0+2] *  (m[4*1+0] * m[4*2+1] - m[4*1+1] * m[4*2+0])
  ;;              )/det //M3Det(subMatrix(m, 3, 3))
  ;;          ]
  ;;    ]);
  ;;},
  ;;#32
  (func $$neg0 (result v128)
    f32.const 1
    f32x4.splat
    f32.const -1
    f32x4.replace_lane 0
    f32.const -1
    f32x4.replace_lane 2
  )
  ;;#33
  (func $$neg1 (result v128)
    f32.const 1
    f32x4.splat
    f32.const -1
    f32x4.replace_lane 1
    f32.const -1
    f32x4.replace_lane 3
  )
  ;;#34
  (func $$MatrixInverseRow0 (param $m0 v128) (param $m1 v128) (param $m2 v128) (param $m3 v128) (result v128)
    ;;[
    ;;  (
    ;;                  m1[1] *  (m2[2] * m3[3] - m2[3] * m3[2]) + 
    ;;                  m1[2] * -(m2[1] * m3[3] - m2[3] * m3[1]) + 
    ;;                  m1[3] *  (m2[1] * m3[2] - m2[2] * m3[1])
    ;;  ), 
    ;; -(
    ;;                  m0[1] *  (m2[2] * m3[3] - m2[3] * m3[2]) + 
    ;;                  m0[2] * -(m2[1] * m3[3] - m2[3] * m3[1]) + 
    ;;                  m0[3] *  (m2[1] * m3[2] - m2[2] * m3[1])
    ;;  ), 
    ;;  (
    ;;                  m0[1] *  (m1[2] * m3[3] - m1[3] * m3[2]) + 
    ;;                  m0[2] * -(m1[1] * m3[3] - m1[3] * m3[1]) + 
    ;;                  m0[3] *  (m1[1] * m3[2] - m1[2] * m3[1])
    ;;  ), 
    ;; -(
    ;;                  m0[1] *  (m1[2] * m2[3] - m1[3] * m2[2]) + 
    ;;                  m0[2] * -(m1[1] * m2[3] - m1[3] * m2[1]) + 
    ;;                  m0[3] *  (m1[1] * m2[2] - m1[2] * m2[1])
    ;;  )
    ;;]
    local.get $m1   ;; m1[1], m0[1], m0[1], m0[1] 
    local.get $m1
    f32x4.extract_lane 1
    f32x4.replace_lane 0  
    local.get $m0   
    f32x4.extract_lane 1
    f32x4.replace_lane 1
    local.get $m0   
    f32x4.extract_lane 1
    f32x4.replace_lane 2
    local.get $m0   
    f32x4.extract_lane 1
    f32x4.replace_lane 3
    local.get $m2   ;; m2[2],       m2[2],       m1[2],       m1[2] 
    local.get $m2
    f32x4.extract_lane 2
    f32x4.replace_lane 0  
    local.get $m2   
    f32x4.extract_lane 2
    f32x4.replace_lane 1
    local.get $m1   
    f32x4.extract_lane 2
    f32x4.replace_lane 2
    local.get $m1   
    f32x4.extract_lane 2
    f32x4.replace_lane 3
    local.get $m3   ;; m3[3],       m3[3],       m3[3],       m2[3] 
    local.get $m3
    f32x4.extract_lane 3
    f32x4.replace_lane 0  
    local.get $m3   
    f32x4.extract_lane 3
    f32x4.replace_lane 1
    local.get $m3   
    f32x4.extract_lane 3
    f32x4.replace_lane 2
    local.get $m2   
    f32x4.extract_lane 3
    f32x4.replace_lane 3
            
    f32x4.mul       ;; m2[2]*m3[3], m2[2]*m3[3], m1[2]*m3[3], m1[2]*m2[3] 

    local.get $m2   ;; m2[3],       m2[3],       m1[3],       m1[3]
    local.get $m2
    f32x4.extract_lane 3
    f32x4.replace_lane 0  
    local.get $m2   
    f32x4.extract_lane 3
    f32x4.replace_lane 1
    local.get $m1   
    f32x4.extract_lane 3
    f32x4.replace_lane 2
    local.get $m1   
    f32x4.extract_lane 3
    f32x4.replace_lane 3
    local.get $m3   ;; m3[2],       m3[2],       m3[2],       m2[2]
    local.get $m3
    f32x4.extract_lane 2
    f32x4.replace_lane 0  
    local.get $m3   
    f32x4.extract_lane 2
    f32x4.replace_lane 1
    local.get $m3   
    f32x4.extract_lane 2
    f32x4.replace_lane 2
    local.get $m2   
    f32x4.extract_lane 2
    f32x4.replace_lane 3

    f32x4.mul       ;; m2[3]*m3[2], m2[3]*m3[2], m1[3]*m3[2], m1[3]*m2[2]  
    f32x4.sub       ;; (m2[2]*m3[3] - m2[3]*m3[2]), (m2[2]*m3[3] - m2[3]*m3[2]), (m1[2]*m3[3] - m1[3]*m3[2]), (m1[2]*m2[3] - m1[3]*m2[2]) 
    f32x4.mul       ;; m1[1] *  (m2[2]*m3[3] - m2[3]*m3[2]), m0[1] *  (m2[2]*m3[3] - m2[3]*m3[2]), m0[1] *  (m1[2]*m3[3] - m1[3]*m3[2]), m0[1] *  (m1[2]*m2[3] - m1[3]*m2[2])
             
    local.get $m1   ;; m1[2], m0[2], m0[2], m0[2]
    local.get $m1
    f32x4.extract_lane 2
    f32x4.replace_lane 0  
    local.get $m0   
    f32x4.extract_lane 2
    f32x4.replace_lane 1
    local.get $m0 
    f32x4.extract_lane 2
    f32x4.replace_lane 2
    local.get $m0  
    f32x4.extract_lane 2
    f32x4.replace_lane 3
    local.get $m2   ;; m2[1],       m2[1],       m1[1],       m1[1]
    local.get $m2
    f32x4.extract_lane 1
    f32x4.replace_lane 0  
    local.get $m2   
    f32x4.extract_lane 1
    f32x4.replace_lane 1
    local.get $m1
    f32x4.extract_lane 1
    f32x4.replace_lane 2
    local.get $m1
    f32x4.extract_lane 1
    f32x4.replace_lane 3
    local.get $m3   ;; m3[3],       m3[3],       m3[3],       m2[3]
    local.get $m3
    f32x4.extract_lane 3
    f32x4.replace_lane 0  
    local.get $m3  
    f32x4.extract_lane 3
    f32x4.replace_lane 1
    local.get $m3
    f32x4.extract_lane 3
    f32x4.replace_lane 2
    local.get $m2
    f32x4.extract_lane 3
    f32x4.replace_lane 3

    f32x4.mul       ;; m2[1]*m3[3], m2[1]*m3[3], m1[1]*m3[3], m1[1]*m2[2] 

    local.get $m2   ;; m2[3],       m2[3],       m1[3],       m1[3]
    local.get $m2
    f32x4.extract_lane 3
    f32x4.replace_lane 0  
    local.get $m2  
    f32x4.extract_lane 3
    f32x4.replace_lane 1
    local.get $m1
    f32x4.extract_lane 3
    f32x4.replace_lane 2
    local.get $m1
    f32x4.extract_lane 3
    f32x4.replace_lane 3
    local.get $m3   ;; m3[1],       m3[1],       m3[1],       m2[1]
    local.get $m3
    f32x4.extract_lane 1
    f32x4.replace_lane 0  
    local.get $m3  
    f32x4.extract_lane 1
    f32x4.replace_lane 1
    local.get $m3
    f32x4.extract_lane 1
    f32x4.replace_lane 2
    local.get $m2
    f32x4.extract_lane 1
    f32x4.replace_lane 3

    f32x4.mul       ;; m2[3]*m3[1], m2[3]*m3[1], m1[3]*m3[1], m1[2]*m2[1]
    f32x4.sub       ;; m2[1]*m3[3] - m2[3]*m3[1], m2[1]*m3[3] - m2[3]*m3[1], m1[1]*m3[3] - m1[3]*m3[1], m1[1]*m2[2] - m1[2]*m2[1]
    f32x4.neg       ;; -(m2[1]*m3[3] - m2[3]*m3[1]), -(m2[1]*m3[3] - m2[3]*m3[1]), -(m1[1]*m3[3] - m1[3]*m3[1]), -(m1[1]*m2[2] - m1[2]*m2[1])
    f32x4.mul       ;; m1[2] * -(m2[1]*m3[3] - m2[3]*m3[1]), m0[2] * -(m2[1]*m3[3] - m2[3]*m3[1]), m0[2] * -(m1[1]*m3[3] - m1[3]*m3[1]), m0[3] * (m1[1]*m2[2] - m1[2]*m2[1])

    local.get $m1   ;; m1[3], m0[3], m0[3], m0[3]
    local.get $m1
    f32x4.extract_lane 3
    f32x4.replace_lane 0  
    local.get $m0  
    f32x4.extract_lane 3
    f32x4.replace_lane 1
    local.get $m0
    f32x4.extract_lane 3
    f32x4.replace_lane 2
    local.get $m0
    f32x4.extract_lane 3
    f32x4.replace_lane 3
    local.get $m2   ;; m2[1],       m2[1],       m1[1],       m1[1] 
    local.get $m2
    f32x4.extract_lane 1
    f32x4.replace_lane 0  
    local.get $m2 
    f32x4.extract_lane 1
    f32x4.replace_lane 1
    local.get $m1
    f32x4.extract_lane 1
    f32x4.replace_lane 2
    local.get $m1
    f32x4.extract_lane 1
    f32x4.replace_lane 3
    local.get $m3  ;; m3[2],       m3[2],       m3[2],       m2[2]
    local.get $m3
    f32x4.extract_lane 2
    f32x4.replace_lane 0  
    local.get $m3
    f32x4.extract_lane 2
    f32x4.replace_lane 1
    local.get $m3
    f32x4.extract_lane 2
    f32x4.replace_lane 2
    local.get $m2
    f32x4.extract_lane 2
    f32x4.replace_lane 3

    f32x4.mul      ;; m2[1]*m3[2], m2[1]*m3[2], m1[1]*m3[2], m1[1]*m2[2]
 
    local.get $m2  ;; m2[2],       m2[2],       m1[2],       m1[2]
    local.get $m2
    f32x4.extract_lane 2
    f32x4.replace_lane 0  
    local.get $m2
    f32x4.extract_lane 2
    f32x4.replace_lane 1
    local.get $m1
    f32x4.extract_lane 2
    f32x4.replace_lane 2
    local.get $m1
    f32x4.extract_lane 2
    f32x4.replace_lane 3
    local.get $m3  ;; m3[1],       m3[1],       m3[1],       m2[1]
    local.get $m3
    f32x4.extract_lane 1
    f32x4.replace_lane 0  
    local.get $m3
    f32x4.extract_lane 1
    f32x4.replace_lane 1
    local.get $m3
    f32x4.extract_lane 1
    f32x4.replace_lane 2
    local.get $m2
    f32x4.extract_lane 1
    f32x4.replace_lane 3

    f32x4.mul       ;; m2[2]*m3[1], m2[2]*m3[1], m1[2]*m3[1], m1[2]*m2[1]  
    f32x4.sub       ;; m2[1]*m3[2] - m2[2]*m3[1], m2[1]*m3[2] - m2[2]*m3[1], m1[1]*m3[2] - m1[2]*m3[1], m1[1]*m2[2] - m1[2]*m2[1]
    f32x4.mul       ;; m1[3] * (m2[1]*m3[2] - m2[2]*m3[1]), m0[3] * (m2[1]*m3[2] - m2[2]*m3[1]), m0[3] * (m1[1]*m3[2] - m1[2]*m3[1]), m0[3] * (m1[1]*m2[2] - m1[2]*m2[1])

    f32x4.add       ;;
    f32x4.add       ;;
    call $$neg1     ;; 1, -1, 1, -1
    f32x4.mul       ;;[ (m1[1] * (m2[2]*m3[3] - m2[3]*m3[2]) + m1[2] * -(m2[1]*m3[3] - m2[3]*m3[1]) + m1[3] * (m2[1]*m3[2] - m2[2]*m3[1])), -(m0[1] *  (m2[2]*m3[3] - m2[3]*m3[2]) + m0[2] * -(m2[1]*m3[3] - m2[3]*m3[1]) + m0[3] * (m2[1]*m3[2] - m2[2]*m3[1])), (m0[1] * (m1[2]*m3[3] - m1[3]*m3[2]) + m0[2] * -(m1[1]*m3[3] - m1[3]*m3[1]) + m0[3] * (m1[1]*m3[2] - m1[2]*m3[1])), -(m0[1] * (m1[2]*m2[3] - m1[3]*m2[2]) + m0[2] * -(m1[1]*m2[3] - m1[3]*m2[1]) + m0[3] * (m1[1]*m2[2] - m1[2]*m2[1])) ]
  )
  ;;#35
  (func $$MatrixInverseRow1 (param $m0 v128) (param $m1 v128) (param $m2 v128) (param $m3 v128) (result v128)
    ;;    [
    ;;             -(
    ;;                  m1[0] *  (m2[2]*m3[3] - m2[3]*m3[2]) + 
    ;;                  m1[2] * -(m2[0]*m3[3] - m2[3]*m3[0]) + 
    ;;                  m1[3] *  (m2[0]*m3[2] - m2[2]*m3[0])
    ;;              )/det, //M3Det(subMatrix(m, 0, 1))
    ;;              (
    ;;                  m0[0] *  (m2[2]*m3[3] - m2[3]*m3[2]) + 
    ;;                  m0[2] * -(m2[0]*m3[3] - m2[3]*m3[0]) + 
    ;;                  m0[3] *  (m2[0]*m3[2] - m2[2]*m3[0])
    ;;              )/det, //M3Det(subMatrix(m, 1, 1))
    ;;              -(
    ;;                  m0[0] *  (m1[2]*m3[3] - m1[3]*m3[2]) + 
    ;;                  m0[2] * -(m1[0]*m3[3] - m1[3]*m3[0]) + 
    ;;                  m0[3] *  (m1[0]*m3[2] - m1[2]*m3[0])
    ;;              )/det, //M3Det(subMatrix(m, 2, 1))
    ;;              (
    ;;                  m0[0] *  (m1[2]*m2[3] - m1[3]*m2[2]) + 
    ;;                  m0[2] * -(m1[0]*m2[3] - m1[3]*m2[0]) + 
    ;;                  m0[3] *  (m1[0]*m2[2] - m1[2]*m2[0])
    ;;              )/det  //M3Det(subMatrix(m, 3, 1))
    ;;    ],
                      
    local.get $m1     ;; m1[0], m0[0], m0[0], m0[0]
    local.get $m1
    f32x4.extract_lane 0
    f32x4.replace_lane 0  
    local.get $m0
    f32x4.extract_lane 0
    f32x4.replace_lane 1
    local.get $m0
    f32x4.extract_lane 0
    f32x4.replace_lane 2
    local.get $m0
    f32x4.extract_lane 0
    f32x4.replace_lane 3                      
    local.get $m2     ;;  m2[2],                       m2[2],                       m1[2],                       m1[2]
    local.get $m2
    f32x4.extract_lane 2
    f32x4.replace_lane 0  
    local.get $m2
    f32x4.extract_lane 2
    f32x4.replace_lane 1
    local.get $m1
    f32x4.extract_lane 2
    f32x4.replace_lane 2
    local.get $m1
    f32x4.extract_lane 2
    f32x4.replace_lane 3                      
    local.get $m3     ;;        m3[3],                       m3[3],                       m3[3],                       m2[3]
    local.get $m3
    f32x4.extract_lane 3
    f32x4.replace_lane 0  
    local.get $m3
    f32x4.extract_lane 3
    f32x4.replace_lane 1
    local.get $m3
    f32x4.extract_lane 3
    f32x4.replace_lane 2
    local.get $m2
    f32x4.extract_lane 3
    f32x4.replace_lane 3                  
    f32x4.mul         ;;  m2[2]*m3[3],                 m2[2]*m3[3],                 m1[2]*m3[3],                 m1[2]*m2[3]
                      
    local.get $m2     ;;                m2[3],                       m2[3],                       m1[3],                       m1[3]
    local.get $m2
    f32x4.extract_lane 3
    f32x4.replace_lane 0  
    local.get $m2
    f32x4.extract_lane 3
    f32x4.replace_lane 1
    local.get $m1
    f32x4.extract_lane 3
    f32x4.replace_lane 2
    local.get $m1
    f32x4.extract_lane 3
    f32x4.replace_lane 3 
    local.get $m3     ;;                      m3[2],                       m3[2],                       m3[2],                       m2[2]
    local.get $m3
    f32x4.extract_lane 2
    f32x4.replace_lane 0  
    local.get $m3
    f32x4.extract_lane 2
    f32x4.replace_lane 1
    local.get $m3
    f32x4.extract_lane 2
    f32x4.replace_lane 2
    local.get $m2
    f32x4.extract_lane 2
    f32x4.replace_lane 3 
    f32x4.mul         ;;                m2[3]*m3[2],                 m2[3]*m3[2],                 m1[3]*m3[2],                 m1[3]*m2[2]
    f32x4.sub         ;; (m2[2]*m3[3] - m2[3]*m3[2]), (m2[2]*m3[3] - m2[3]*m3[2]), (m1[2]*m3[3] - m1[3]*m3[2]), (m1[2]*m2[3] - m1[3]*m2[2])
    f32x4.mul         ;; m1[0] *  (m2[2]*m3[3] - m2[3]*m3[2]), m0[0] *  (m2[2]*m3[3] - m2[3]*m3[2]), m0[0] *  (m1[2]*m3[3] - m1[3]*m3[2]), m0[0] *  (m1[2]*m2[3] - m1[3]*m2[2])
                      
                      
    local.get $m1     ;; m1[2], m0[2], m0[2], m0[2]
    local.get $m1
    f32x4.extract_lane 2
    f32x4.replace_lane 0  
    local.get $m0
    f32x4.extract_lane 2
    f32x4.replace_lane 1
    local.get $m0
    f32x4.extract_lane 2
    f32x4.replace_lane 2
    local.get $m0
    f32x4.extract_lane 2
    f32x4.replace_lane 3 
    local.get $m2     ;;   m2[0],                        m2[0],                        m1[0],                        m1[0]
    local.get $m2
    f32x4.extract_lane 0
    f32x4.replace_lane 0  
    local.get $m2
    f32x4.extract_lane 0
    f32x4.replace_lane 1
    local.get $m1
    f32x4.extract_lane 0
    f32x4.replace_lane 2
    local.get $m1
    f32x4.extract_lane 0
    f32x4.replace_lane 3 
    local.get $m3     ;;         m3[3],                        m3[3],                        m3[3],                        m2[3]
    local.get $m3
    f32x4.extract_lane 3
    f32x4.replace_lane 0  
    local.get $m3
    f32x4.extract_lane 3
    f32x4.replace_lane 1
    local.get $m3
    f32x4.extract_lane 3
    f32x4.replace_lane 2
    local.get $m2
    f32x4.extract_lane 3
    f32x4.replace_lane 3 
    f32x4.mul         ;;   m2[0]*m3[3],                  m2[0]*m3[3],                  m1[0]*m3[3],                  m1[0]*m2[3]
                      
    local.get $m2     ;;                 m2[3],                        m2[3],                        m1[3],                        m1[3]
    local.get $m2
    f32x4.extract_lane 3
    f32x4.replace_lane 0  
    local.get $m2
    f32x4.extract_lane 3
    f32x4.replace_lane 1
    local.get $m1
    f32x4.extract_lane 3
    f32x4.replace_lane 2
    local.get $m1
    f32x4.extract_lane 3
    f32x4.replace_lane 3                      
    local.get $m3     ;;                       m3[0],                        m3[0],                        m3[0],                        m2[0] 
    local.get $m3
    f32x4.extract_lane 0
    f32x4.replace_lane 0  
    local.get $m3
    f32x4.extract_lane 0
    f32x4.replace_lane 1
    local.get $m3
    f32x4.extract_lane 0
    f32x4.replace_lane 2
    local.get $m2
    f32x4.extract_lane 0
    f32x4.replace_lane 3
    f32x4.mul         ;;                 m2[3]*m3[0],                  m2[3]*m3[0],                  m1[3]*m3[0],                  m1[3]*m2[0] 
    f32x4.sub         ;;   m2[0]*m3[3] - m2[3]*m3[0],    m2[0]*m3[3] - m2[3]*m3[0],    m1[0]*m3[3] - m1[3]*m3[0],    m1[0]*m2[3] - m1[3]*m2[0]
    f32x4.neg         ;; -(m2[0]*m3[3] - m2[3]*m3[0]), -(m2[0]*m3[3] - m2[3]*m3[0]), -(m1[0]*m3[3] - m1[3]*m3[0]), -(m1[0]*m2[3] - m1[3]*m2[0])
    f32x4.mul         ;; m1[2] * -(m2[0]*m3[3] - m2[3]*m3[0]), m0[2] * -(m2[0]*m3[3] - m2[3]*m3[0]), m0[2] * -(m1[0]*m3[3] - m1[3]*m3[0]), m0[2] * -(m1[0]*m2[3] - m1[3]*m2[0])
                      
    local.get $m1     ;; m1[3], m0[3], m0[3], m0[3]
    local.get $m1
    f32x4.extract_lane 3
    f32x4.replace_lane 0  
    local.get $m0
    f32x4.extract_lane 3
    f32x4.replace_lane 1
    local.get $m0
    f32x4.extract_lane 3
    f32x4.replace_lane 2
    local.get $m0
    f32x4.extract_lane 3
    f32x4.replace_lane 3
    local.get $m2     ;; m2[0],       m2[0],       m1[0],       m1[0]
    local.get $m2
    f32x4.extract_lane 0
    f32x4.replace_lane 0  
    local.get $m2
    f32x4.extract_lane 0
    f32x4.replace_lane 1
    local.get $m1
    f32x4.extract_lane 0
    f32x4.replace_lane 2
    local.get $m1
    f32x4.extract_lane 0
    f32x4.replace_lane 3
    local.get $m3     ;;       m3[2],       m3[2],       m3[2],       m2[2]
    local.get $m3
    f32x4.extract_lane 2
    f32x4.replace_lane 0  
    local.get $m3
    f32x4.extract_lane 2
    f32x4.replace_lane 1
    local.get $m3
    f32x4.extract_lane 2
    f32x4.replace_lane 2
    local.get $m2
    f32x4.extract_lane 2
    f32x4.replace_lane 3 
    f32x4.mul         ;; m2[0]*m3[2], m2[0]*m3[2], m1[0]*m3[2], m1[0]*m2[2]
                      
    local.get $m2     ;; m2[2],       m2[2],       m1[2],       m1[2]
    local.get $m2
    f32x4.extract_lane 2
    f32x4.replace_lane 0  
    local.get $m2
    f32x4.extract_lane 2
    f32x4.replace_lane 1
    local.get $m1
    f32x4.extract_lane 2
    f32x4.replace_lane 2
    local.get $m1
    f32x4.extract_lane 2
    f32x4.replace_lane 3                       
    local.get $m3     ;; m3[0],       m3[0],       m3[0],       m2[0]
    local.get $m3
    f32x4.extract_lane 0
    f32x4.replace_lane 0  
    local.get $m3
    f32x4.extract_lane 0
    f32x4.replace_lane 1
    local.get $m3
    f32x4.extract_lane 0
    f32x4.replace_lane 2
    local.get $m2
    f32x4.extract_lane 0
    f32x4.replace_lane 3
    f32x4.mul         ;; m2[2]*m3[0], m2[2]*m3[0], m1[2]*m3[0], m1[2]*m2[0]
    f32x4.sub         ;; m2[0]*m3[2] - m2[2]*m3[0], m2[0]*m3[2] - m2[2]*m3[0], m1[0]*m3[2] - m1[2]*m3[0], m1[0]*m2[2] - m1[2]*m2[0]
    f32x4.mul         ;; -(m1[3] * (m2[0]*m3[2] - m2[2]*m3[0])), m0[3] * (m2[0]*m3[2] - m2[2]*m3[0]), -(m0[3] * (m1[0]*m3[2] - m1[2]*m3[0])), m0[3] * (m1[0]*m2[2] - m1[2]*m2[0])

    f32x4.add         ;;
    f32x4.add         ;;
    call $$neg0       ;; -1, 1, -1, 1
    f32x4.mul         ;; -(m1[0] * (m2[2]*m3[3] - m2[3]*m3[2]) + m1[2] * -(m2[0]*m3[3] - m2[3]*m3[0]) + m1[3] *  (m2[0]*m3[2] - m2[2]*m3[0])), (m0[0] *  (m2[2]*m3[3] - m2[3]*m3[2]) + m0[2] * -(m2[0]*m3[3] - m2[3]*m3[0]) + m0[3] *  (m2[0]*m3[2] - m2[2]*m3[0])), -(m0[0] * (m1[2]*m3[3] - m1[3]*m3[2]) + m0[2] * -(m1[0]*m3[3] - m1[3]*m3[0]) + m0[3] *  (m1[0]*m3[2] - m1[2]*m3[0])), (m0[0] * (m1[2]*m2[3] - m1[3]*m2[2]) + m0[2] * -(m1[0]*m2[3] - m1[3]*m2[0]) + m0[3] * (m1[0]*m2[2] - m1[2]*m2[0])) ]
  )
  ;;#36
  (func $$MatrixInverseRow2 (param $m0 v128) (param $m1 v128) (param $m2 v128) (param $m3 v128) (result v128)
    ;; [
    ;;    ( m1[0] *  (m2[1]*m3[3] - m2[3]*m3[1]) + m1[1] * -(m2[0]*m3[3] - m2[3]*m3[0]) + m1[3] *  (m2[0]*m3[1] - m2[1]*m3[0]) ),
    ;;   -( m0[0] *  (m2[1]*m3[3] - m2[3]*m3[1]) + m0[1] * -(m2[0]*m3[3] - m2[3]*m3[0]) + m0[3] *  (m2[0]*m3[1] - m2[1]*m3[0]) ),
    ;;    ( m0[0] *  (m1[1]*m3[3] - m1[3]*m3[1]) + m0[1] * -(m1[0]*m3[3] - m1[3]*m3[0]) + m0[3] *  (m1[0]*m3[1] - m1[1]*m3[0]) ), 
    ;;   -( m0[0] *  (m1[1]*m2[3] - m1[3]*m2[1]) + m0[1] * -(m1[0]*m2[3] - m1[3]*m2[0]) + m0[3] *  (m1[0]*m2[1] - m1[1]*m2[0]) )
    ;; ],

    local.get $m1   ;; m1[0], m0[0], m0[0], m0[0]
    local.get $m1
    f32x4.extract_lane 0
    f32x4.replace_lane 0  
    local.get $m0
    f32x4.extract_lane 0
    f32x4.replace_lane 1
    local.get $m0
    f32x4.extract_lane 0
    f32x4.replace_lane 2
    local.get $m0
    f32x4.extract_lane 0
    f32x4.replace_lane 3
    local.get $m2   ;; m2[1],                     m2[1],                     m1[1],                     m1[1]
    local.get $m2
    f32x4.extract_lane 1
    f32x4.replace_lane 0  
    local.get $m2
    f32x4.extract_lane 1
    f32x4.replace_lane 1
    local.get $m1
    f32x4.extract_lane 1
    f32x4.replace_lane 2
    local.get $m1
    f32x4.extract_lane 1
    f32x4.replace_lane 3                    
    local.get $m3   ;;       m3[3],                     m3[3],                     m3[3],                     m2[3]
    local.get $m3
    f32x4.extract_lane 3
    f32x4.replace_lane 0  
    local.get $m3
    f32x4.extract_lane 3
    f32x4.replace_lane 1
    local.get $m3
    f32x4.extract_lane 3
    f32x4.replace_lane 2
    local.get $m2
    f32x4.extract_lane 3
    f32x4.replace_lane 3
    f32x4.mul       ;; m2[1]*m3[3],               m2[1]*m3[3],               m1[1]*m3[3],               m1[1]*m2[3]
                    
    local.get $m2   ;;               m2[3],                     m2[3],                     m1[3],                     m1[3]
    local.get $m2
    f32x4.extract_lane 3
    f32x4.replace_lane 0  
    local.get $m2
    f32x4.extract_lane 3
    f32x4.replace_lane 1
    local.get $m1
    f32x4.extract_lane 3
    f32x4.replace_lane 2
    local.get $m1
    f32x4.extract_lane 3
    f32x4.replace_lane 3                    
    local.get $m3   ;;                     m3[1],                     m3[1],                     m3[1],                     m2[1]
    local.get $m3
    f32x4.extract_lane 1
    f32x4.replace_lane 0  
    local.get $m3
    f32x4.extract_lane 1
    f32x4.replace_lane 1
    local.get $m3
    f32x4.extract_lane 1
    f32x4.replace_lane 2
    local.get $m2
    f32x4.extract_lane 1
    f32x4.replace_lane 3
    f32x4.mul       ;;               m2[3]*m3[1],               m2[3]*m3[1],               m1[3]*m3[1],               m1[3]*m2[1]
    f32x4.sub       ;; m2[1]*m3[3] - m2[3]*m3[1], m2[1]*m3[3] - m2[3]*m3[1], m1[1]*m3[3] - m1[3]*m3[1], m1[1]*m2[3] - m1[3]*m2[1]
    f32x4.mul       ;; m1[0] * (m2[1]*m3[3] - m2[3]*m3[1]), m0[0] * (m2[1]*m3[3] - m2[3]*m3[1]), m0[0] * (m1[1]*m3[3] - m1[3]*m3[1]), m0[0] * (m1[1]*m2[3] - m1[3]*m2[1])


    local.get $m1   ;; m1[1], m0[1], m0[1], m0[1]
    local.get $m1
    f32x4.extract_lane 1
    f32x4.replace_lane 0  
    local.get $m0
    f32x4.extract_lane 1
    f32x4.replace_lane 1
    local.get $m0
    f32x4.extract_lane 1
    f32x4.replace_lane 2
    local.get $m0
    f32x4.extract_lane 1
    f32x4.replace_lane 3                    
    local.get $m2   ;;   m2[0],                        m2[0],                        m1[0],                        m1[0]
    local.get $m2
    f32x4.extract_lane 0
    f32x4.replace_lane 0  
    local.get $m2
    f32x4.extract_lane 0
    f32x4.replace_lane 1
    local.get $m1
    f32x4.extract_lane 0
    f32x4.replace_lane 2
    local.get $m1
    f32x4.extract_lane 0
    f32x4.replace_lane 3
    local.get $m3   ;;         m3[3],                        m3[3],                        m3[3],                        m2[3]
    local.get $m3
    f32x4.extract_lane 3
    f32x4.replace_lane 0  
    local.get $m3
    f32x4.extract_lane 3
    f32x4.replace_lane 1
    local.get $m3
    f32x4.extract_lane 3
    f32x4.replace_lane 2
    local.get $m2
    f32x4.extract_lane 3
    f32x4.replace_lane 3                      
    f32x4.mul       ;;   m2[0]*m3[3],                  m2[0]*m3[3],                  m1[0]*m3[3],                  m1[0]*m2[3]

    local.get $m2   ;;                 m2[3],                        m2[3],                        m1[3],                        m1[3]
    local.get $m2
    f32x4.extract_lane 3
    f32x4.replace_lane 0  
    local.get $m2
    f32x4.extract_lane 3
    f32x4.replace_lane 1
    local.get $m1
    f32x4.extract_lane 3
    f32x4.replace_lane 2
    local.get $m1
    f32x4.extract_lane 3
    f32x4.replace_lane 3                      
                    
    local.get $m3   ;;                       m3[0],                        m3[0],                        m3[0],                        m2[0]
    local.get $m3
    f32x4.extract_lane 0
    f32x4.replace_lane 0  
    local.get $m3
    f32x4.extract_lane 0
    f32x4.replace_lane 1
    local.get $m3
    f32x4.extract_lane 0
    f32x4.replace_lane 2
    local.get $m2
    f32x4.extract_lane 0
    f32x4.replace_lane 3 
    f32x4.mul       ;;                 m2[3]*m3[0],                  m2[3]*m3[0],                  m1[3]*m3[0],                  m1[3]*m2[0]
    f32x4.sub       ;;   m2[0]*m3[3] - m2[3]*m3[0],    m2[0]*m3[3] - m2[3]*m3[0],    m1[0]*m3[3] - m1[3]*m3[0],    m1[0]*m2[3] - m1[3]*m2[0]
    f32x4.neg       ;; -(m2[0]*m3[3] - m2[3]*m3[0]), -(m2[0]*m3[3] - m2[3]*m3[0]), -(m1[0]*m3[3] - m1[3]*m3[0]), -(m1[0]*m2[3] - m1[3]*m2[0])
    f32x4.mul       ;; m1[1] * -(m2[0]*m3[3] - m2[3]*m3[0]), m0[1] * -(m2[0]*m3[3] - m2[3]*m3[0]), m0[1] * -(m1[0]*m3[3] - m1[3]*m3[0]), m0[1] * -(m1[0]*m2[3] - m1[3]*m2[0])



                    
    local.get $m1   ;; m1[3], m0[3], m0[3], m0[3]
    local.get $m1
    f32x4.extract_lane 3
    f32x4.replace_lane 0  
    local.get $m0
    f32x4.extract_lane 3
    f32x4.replace_lane 1
    local.get $m0
    f32x4.extract_lane 3
    f32x4.replace_lane 2
    local.get $m0
    f32x4.extract_lane 3
    f32x4.replace_lane 3                     
    local.get $m2   ;; m2[0],                     m2[0],                     m1[0],                     m1[0]
    local.get $m2
    f32x4.extract_lane 0
    f32x4.replace_lane 0  
    local.get $m2
    f32x4.extract_lane 0
    f32x4.replace_lane 1
    local.get $m1
    f32x4.extract_lane 0
    f32x4.replace_lane 2
    local.get $m1
    f32x4.extract_lane 0
    f32x4.replace_lane 3                     
    local.get $m3   ;;       m3[1],                     m3[1],                     m3[1],                     m2[1] 
    local.get $m3
    f32x4.extract_lane 1
    f32x4.replace_lane 0  
    local.get $m3
    f32x4.extract_lane 1
    f32x4.replace_lane 1
    local.get $m3
    f32x4.extract_lane 1
    f32x4.replace_lane 2
    local.get $m2
    f32x4.extract_lane 1
    f32x4.replace_lane 3
    f32x4.mul       ;; m2[0]*m3[1],               m2[0]*m3[1],               m1[0]*m3[1],               m1[0]*m2[1] 

    local.get $m2   ;;               m2[1],                     m2[1],                     m1[1],                     m1[1]
    local.get $m2
    f32x4.extract_lane 1
    f32x4.replace_lane 0  
    local.get $m2
    f32x4.extract_lane 1
    f32x4.replace_lane 1
    local.get $m1
    f32x4.extract_lane 1
    f32x4.replace_lane 2
    local.get $m1
    f32x4.extract_lane 1
    f32x4.replace_lane 3
                    
    local.get $m3   ;;                     m3[0],                     m3[0],                     m3[0],                     m2[0]
    local.get $m3
    f32x4.extract_lane 0
    f32x4.replace_lane 0  
    local.get $m3
    f32x4.extract_lane 0
    f32x4.replace_lane 1
    local.get $m3
    f32x4.extract_lane 0
    f32x4.replace_lane 2
    local.get $m2
    f32x4.extract_lane 0
    f32x4.replace_lane 3
    f32x4.mul       ;;               m2[1]*m3[0],               m2[1]*m3[0],               m1[1]*m3[0],               m1[1]*m2[0]
    f32x4.sub       ;; m2[0]*m3[1] - m2[1]*m3[0], m2[0]*m3[1] - m2[1]*m3[0], m1[0]*m3[1] - m1[1]*m3[0], m1[0]*m2[1] - m1[1]*m2[0]
    f32x4.mul       ;; m1[3] *  (m2[0]*m3[1] - m2[1]*m3[0]), m0[3] *  (m2[0]*m3[1] - m2[1]*m3[0]), m0[3] *  (m1[0]*m3[1] - m1[1]*m3[0]), m0[3] *  (m1[0]*m2[1] - m1[1]*m2[0])

    f32x4.add         ;;
    f32x4.add         ;;
    call $$neg1       ;; 1,      -1,      1,      -1
    f32x4.mul         ;; ( .. ), -( .. ), ( .. ), -( .. )

    ;;f32.const -3    ;;dummy
    ;;f32x4.splat     ;;dummy
  )
  ;;#37
  (func $$MatrixInverseRow3 (param $m0 v128) (param $m1 v128) (param $m2 v128) (param $m3 v128) (result v128)
    ;;  [
    ;;   -( m1[0] *  (m2[1]*m3[2] - m2[2]*m3[1]) + m1[1] * -(m2[0]*m3[2] - m2[2]*m3[0]) + m1[2] *  (m2[0]*m3[1] - m2[1]*m3[0]) ), 
    ;;    ( m0[0] *  (m2[1]*m3[2] - m2[2]*m3[1]) + m0[1] * -(m2[0]*m3[2] - m2[2]*m3[0]) + m0[2] *  (m2[0]*m3[1] - m2[1]*m3[0]) ), 
    ;;   -( m0[0] *  (m1[1]*m3[2] - m1[2]*m3[1]) + m0[1] * -(m1[0]*m3[2] - m1[2]*m3[0]) + m0[2] *  (m1[0]*m3[1] - m1[1]*m3[0]) ), 
    ;;    ( m0[0] *  (m1[1]*m2[2] - m1[2]*m2[1]) + m0[1] * -(m1[0]*m2[2] - m1[2]*m2[0]) + m0[2] *  (m1[0]*m2[1] - m1[1]*m2[0]) )
    ;;  ]
                    
    local.get $m1     ;; m1[0], m0[0], m0[0], m0[0]
    local.get $m1
    f32x4.extract_lane 0
    f32x4.replace_lane 0  
    local.get $m0   
    f32x4.extract_lane 0
    f32x4.replace_lane 1
    local.get $m0   
    f32x4.extract_lane 0
    f32x4.replace_lane 2
    local.get $m0   
    f32x4.extract_lane 0
    f32x4.replace_lane 3                      
    local.get $m2     ;; m2[1],                     m2[1],                     m1[1],                     m1[1]
    local.get $m2
    f32x4.extract_lane 1
    f32x4.replace_lane 0  
    local.get $m2   
    f32x4.extract_lane 1
    f32x4.replace_lane 1
    local.get $m1   
    f32x4.extract_lane 1
    f32x4.replace_lane 2
    local.get $m1   
    f32x4.extract_lane 1
    f32x4.replace_lane 3
    local.get $m3     ;;       m3[2],                     m3[2],                     m3[2,                      m2[2]
    local.get $m3
    f32x4.extract_lane 2
    f32x4.replace_lane 0  
    local.get $m3   
    f32x4.extract_lane 2
    f32x4.replace_lane 1
    local.get $m3   
    f32x4.extract_lane 2
    f32x4.replace_lane 2
    local.get $m2   
    f32x4.extract_lane 2
    f32x4.replace_lane 3
    f32x4.mul         ;; m2[1]*m3[2],               m2[1]*m3[2],               m1[1]*m3[2,                m1[1]*m2[2]
                      
    local.get $m2     ;;               m2[2],                     m2[2],                     m1[2],                     m1[2]
    local.get $m2
    f32x4.extract_lane 2
    f32x4.replace_lane 0  
    local.get $m2   
    f32x4.extract_lane 2
    f32x4.replace_lane 1
    local.get $m1   
    f32x4.extract_lane 2
    f32x4.replace_lane 2
    local.get $m1   
    f32x4.extract_lane 2
    f32x4.replace_lane 3                                        
    local.get $m3     ;;                     m3[1],                     m3[1],                     m3[1],                     m2[1]
    local.get $m3
    f32x4.extract_lane 1
    f32x4.replace_lane 0  
    local.get $m3   
    f32x4.extract_lane 1
    f32x4.replace_lane 1
    local.get $m3   
    f32x4.extract_lane 1
    f32x4.replace_lane 2
    local.get $m2   
    f32x4.extract_lane 1
    f32x4.replace_lane 3
    f32x4.mul         ;;               m2[2]*m3[1],               m2[2]*m3[1],               m1[2]*m3[1],               m1[2]*m2[1]
    f32x4.sub         ;; m2[1]*m3[2] - m2[2]*m3[1], m2[1]*m3[2] - m2[2]*m3[1], m1[1]*m3[2] - m1[2]*m3[1], m1[1]*m2[2] - m1[2]*m2[1]
    f32x4.mul         ;; m1[0] *  (m2[1]*m3[2] - m2[2]*m3[1]), m0[0] *  (m2[1]*m3[2] - m2[2]*m3[1]), m0[0] *  (m1[1]*m3[2] - m1[2]*m3[1]), m0[0] *  (m1[1]*m2[2] - m1[2]*m2[1])

                      
    local.get $m1     ;; m1[1], m0[1], m0[1], m0[1]
    local.get $m1
    f32x4.extract_lane 1
    f32x4.replace_lane 0  
    local.get $m0   
    f32x4.extract_lane 1
    f32x4.replace_lane 1
    local.get $m0   
    f32x4.extract_lane 1
    f32x4.replace_lane 2
    local.get $m0   
    f32x4.extract_lane 1
    f32x4.replace_lane 3
    local.get $m2     ;;   m2[0],                        m2[0],                        m1[0],                        m1[0]
    local.get $m2
    f32x4.extract_lane 0
    f32x4.replace_lane 0  
    local.get $m2   
    f32x4.extract_lane 0
    f32x4.replace_lane 1
    local.get $m1  
    f32x4.extract_lane 0
    f32x4.replace_lane 2
    local.get $m1   
    f32x4.extract_lane 0 
    f32x4.replace_lane 3                     
    local.get $m3     ;;         m3[2],                        m3[2],                        m3[2],                        m2[2] 
    local.get $m3
    f32x4.extract_lane 2
    f32x4.replace_lane 0  
    local.get $m3  
    f32x4.extract_lane 2
    f32x4.replace_lane 1
    local.get $m3
    f32x4.extract_lane 2
    f32x4.replace_lane 2
    local.get $m2   
    f32x4.extract_lane 2
    f32x4.replace_lane 3
    f32x4.mul         ;;   m2[0]*m3[2],                  m2[0]*m3[2],                  m1[0]*m3[2],                  m1[0]*m2[2] 

    local.get $m2     ;;                 m2[2],                        m2[2],                        m1[2],                        m1[2]
    local.get $m2
    f32x4.extract_lane 2
    f32x4.replace_lane 0  
    local.get $m2  
    f32x4.extract_lane 2
    f32x4.replace_lane 1
    local.get $m1
    f32x4.extract_lane 2
    f32x4.replace_lane 2
    local.get $m1   
    f32x4.extract_lane 2
    f32x4.replace_lane 3                      
    local.get $m3     ;;                       m3[0],                        m3[0],                        m3[0],                        m2[0]  
    local.get $m3
    f32x4.extract_lane 0
    f32x4.replace_lane 0  
    local.get $m3  
    f32x4.extract_lane 0
    f32x4.replace_lane 1
    local.get $m3
    f32x4.extract_lane 0
    f32x4.replace_lane 2
    local.get $m2  
    f32x4.extract_lane 0
    f32x4.replace_lane 3
    f32x4.mul         ;;                 m2[2]*m3[0],                  m2[2]*m3[0],                  m1[2]*m3[0],                  m1[2]*m2[0]  
    f32x4.sub         ;;   m2[0]*m3[2] - m2[2]*m3[0],    m2[0]*m3[2] - m2[2]*m3[0],    m1[0]*m3[2] - m1[2]*m3[0],    m1[0]*m2[2] - m1[2]*m2[0]
    f32x4.neg         ;; -(m2[0]*m3[2] - m2[2]*m3[0]), -(m2[0]*m3[2] - m2[2]*m3[0]), -(m1[0]*m3[2] - m1[2]*m3[0]), -(m1[0]*m2[2] - m1[2]*m2[0])
    f32x4.mul         ;; m1[1] * -(m2[0]*m3[2] - m2[2]*m3[0]), m0[1] * -(m2[0]*m3[2] - m2[2]*m3[0]), m0[1] * -(m1[0]*m3[2] - m1[2]*m3[0]), m0[1] * -(m1[0]*m2[2] - m1[2]*m2[0])

                      
    local.get $m1     ;; m1[2], m0[2], m0[2], m0[2]
    local.get $m1
    f32x4.extract_lane 2
    f32x4.replace_lane 0  
    local.get $m0  
    f32x4.extract_lane 2
    f32x4.replace_lane 1
    local.get $m0
    f32x4.extract_lane 2
    f32x4.replace_lane 2
    local.get $m0   
    f32x4.extract_lane 2
    f32x4.replace_lane 3                      
    local.get $m2     ;; m2[0],                     m2[0],                     m1[0],                     m1[0]
    local.get $m2
    f32x4.extract_lane 0
    f32x4.replace_lane 0  
    local.get $m2
    f32x4.extract_lane 0
    f32x4.replace_lane 1
    local.get $m1
    f32x4.extract_lane 0
    f32x4.replace_lane 2
    local.get $m1   
    f32x4.extract_lane 0
    f32x4.replace_lane 3                      
    local.get $m3     ;;       m3[1],                     m3[1],                     m3[1],                     m2[1]
    local.get $m3
    f32x4.extract_lane 1
    f32x4.replace_lane 0  
    local.get $m3
    f32x4.extract_lane 1
    f32x4.replace_lane 1
    local.get $m3
    f32x4.extract_lane 1
    f32x4.replace_lane 2
    local.get $m2   
    f32x4.extract_lane 1
    f32x4.replace_lane 3                      
    f32x4.mul         ;; m2[0]*m3[1],               m2[0]*m3[1],               m1[0]*m3[1],               m1[0]*m2[1]
                      
    local.get $m2     ;;               m2[1],                     m2[1],                     m1[1],                     m1[1]
    local.get $m2
    f32x4.extract_lane 1
    f32x4.replace_lane 0  
    local.get $m2
    f32x4.extract_lane 1
    f32x4.replace_lane 1
    local.get $m1
    f32x4.extract_lane 1
    f32x4.replace_lane 2
    local.get $m1   
    f32x4.extract_lane 1
    f32x4.replace_lane 3                       
                      
    local.get $m3     ;;                     m3[0],                     m3[0],                     m3[0],                     m2[0]
    local.get $m3
    f32x4.extract_lane 0
    f32x4.replace_lane 0  
    local.get $m3
    f32x4.extract_lane 0
    f32x4.replace_lane 1
    local.get $m3
    f32x4.extract_lane 0
    f32x4.replace_lane 2
    local.get $m2   
    f32x4.extract_lane 0
    f32x4.replace_lane 3                        
    f32x4.mul         ;;               m2[1]*m3[0],               m2[1]*m3[0],               m1[1]*m3[0],               m1[1]*m2[0]
    f32x4.sub         ;; m2[0]*m3[1] - m2[1]*m3[0], m2[0]*m3[1] - m2[1]*m3[0], m1[0]*m3[1] - m1[1]*m3[0], m1[0]*m2[1] - m1[1]*m2[0]
    f32x4.mul         ;; m1[2] *  (m2[0]*m3[1] - m2[1]*m3[0]), m0[2] *  (m2[0]*m3[1] - m2[1]*m3[0]), m0[2] *  (m1[0]*m3[1] - m1[1]*m3[0]), m0[2] *  (m1[0]*m2[1] - m1[1]*m2[0])

    f32x4.add         ;;
    f32x4.add         ;;
    call $$neg0       ;; -1,      1,      -1,      1
    f32x4.mul         ;; -( .. ), ( .. ), -( .. ), ( .. )

    ;;f32.const -4    ;;dummy
    ;;f32x4.splat     ;;dummy
  )
  ;;#38
  (func $MatrixInverse (param $m i32) (param $y i32)
    (local $d v128)
    local.get $m
    v128.load       ;;push $m0
    local.get $m    ;;push $m1
    i32.const 16
    i32.add
    v128.load 
    local.get $m    ;;push $m2
    i32.const 32
    i32.add
    v128.load 
    local.get $m    ;;push $m3
    i32.const 48
    i32.add
    v128.load
    call $$MatrixDeterminant
    local.set $d

    ;;row 0
    local.get $y    ;;push mem[$y]

    local.get $m
    v128.load       ;;push $m0
    local.get $m    ;;push $m1
    i32.const 16
    i32.add
    v128.load 
    local.get $m    ;;push $m2
    i32.const 32
    i32.add
    v128.load 
    local.get $m    ;;push $m3
    i32.const 48
    i32.add
    v128.load 
    call $$MatrixInverseRow0

    local.get $d
    f32x4.div
    v128.store      ;;pop to mem[$y] 


    ;;row 1
    local.get $y    ;;push mem[$y]
    i32.const 16
    i32.add

    local.get $m
    v128.load       ;;push $m0
    local.get $m    ;;push $m1
    i32.const 16
    i32.add
    v128.load 
    local.get $m    ;;push $m2
    i32.const 32
    i32.add
    v128.load 
    local.get $m    ;;push $m3
    i32.const 48
    i32.add
    v128.load 
    call $$MatrixInverseRow1

    local.get $d
    f32x4.div
    v128.store      ;;pop to mem[$y+16]


    ;;row 2
    local.get $y    ;;push mem[$y]
    i32.const 32
    i32.add

    local.get $m
    v128.load       ;;push $m0
    local.get $m    ;;push $m1
    i32.const 16
    i32.add
    v128.load 
    local.get $m    ;;push $m2
    i32.const 32
    i32.add
    v128.load 
    local.get $m    ;;push $m3
    i32.const 48
    i32.add
    v128.load 
    call $$MatrixInverseRow2

    local.get $d
    f32x4.div
    v128.store      ;;pop to mem[$y+32]


    ;;row 3
    local.get $y    ;;push mem[$y]
    i32.const 48
    i32.add

    local.get $m
    v128.load       ;;push $m0
    local.get $m    ;;push $m1
    i32.const 16
    i32.add
    v128.load 
    local.get $m    ;;push $m2
    i32.const 32
    i32.add
    v128.load 
    local.get $m    ;;push $m3
    i32.const 48
    i32.add
    v128.load 
    call $$MatrixInverseRow3

    local.get $d
    f32x4.div
    v128.store      ;;pop to mem[$y+48]
  )

  (func $MatrixVectorMul (param $m i32) (param $v i32) (param $y i32)
    local.get $y    ;;push mem[$y]
    local.get $m
    v128.load       ;;push $m0

    local.get $m    ;;push $m1
    i32.const 16
    i32.add
    v128.load 
    local.get $m    ;;push $m2
    i32.const 32
    i32.add
    v128.load 
    local.get $m    ;;push $m3
    i32.const 48
    i32.add
    v128.load 

    local.get $v 
    v128.load       ;;push $v
    call $$MatrixVectorMul
    v128.store      ;;pop to mem[$y]
  )


  (func $Benchmark (param $a i32) (param $b i32) (param $c i32) (param $m i32) (param $y i32)
    ;;y = lib.test.VectorNormalize(lib.test.VectorAdd(lib.test.VectorNeg(_a), lib.test.VectorSub(lib.test.VectorNeg(_b), lib.test.VectorNeg(_c))));
    local.get $y    ;;push mem[$y]
    local.get $a    ;;push mem[$a]
    v128.load
    f32x4.neg       ;;-a
    local.get $b    ;;push mem[$b]
    v128.load
    f32x4.neg       ;;-b
    local.get $c    ;;push mem[$c]
    v128.load
    f32x4.neg       ;;-c
    f32x4.sub         
    f32x4.add       ;;add(-a, sub())
    call $$VectorNormalize 
    ;;y is the result 
    v128.store      ;;pop to mem[$y]
    ;;z = lib.test.VectorDot(_a, lib.test.VectorCross(_b, _c));
    local.get $y    ;;push mem[$y]
    local.get $a    ;;push mem[$a]
    v128.load
    local.get $b    ;;push mem[$b]
    v128.load
    local.get $c    ;;push mem[$c]
    v128.load
    call $$VectorCross
    call $$VectorDot
    v128.store      ;;pop to mem[$y]
    ;;w = lib.test.MatrixVectorMultiply(_m, _a);
    local.get $y    ;;push mem[$y]
    local.get $m
    v128.load       ;;push $m0

    local.get $m    ;;push $m1
    i32.const 16
    i32.add
    v128.load 
    local.get $m    ;;push $m2
    i32.const 32
    i32.add
    v128.load 
    local.get $m    ;;push $m3
    i32.const 48
    i32.add
    v128.load 

    local.get $a 
    v128.load       ;;push $a
    call $$MatrixVectorMul
    v128.store      ;;pop to mem[$y]
  )

  (export "VectorAbs" (func $VectorAbs))
  (export "VectorNeg" (func $VectorNeg))
  (export "VectorSqrt" (func $VectorSqrt))
  (export "VectorAdd" (func $VectorAdd))
  (export "VectorSub" (func $VectorSub))
  (export "VectorMul" (func $VectorMul))
  (export "VectorDiv" (func $VectorDiv))
  (export "VectorMag" (func $VectorMag))
  (export "VectorNormalize" (func $VectorNormalize))
  (export "VectorDot" (func $VectorDot))
  (export "VectorCross" (func $VectorCross))
  (export "ColorProduct" (func $ColorProduct))
  (export "MatrixMultiply" (func $MatrixMul))
  (export "MatrixTranspose" (func $MatrixTranspose))
  (export "MatrixDeterminant" (func $MatrixDeterminant))
  (export "MatrixInverse" (func $MatrixInverse))
  (export "MatrixVectorMultiply" (func $MatrixVectorMul))
  (export "Benchmark" (func $Benchmark))

  (export "memory" (memory $mem))
)
