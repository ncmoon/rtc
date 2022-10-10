(module
  (import "js" "mem" (memory $mem 1))


  (func $VectorAbs (param $a i32) (param $y i32)
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




  ;; dot: (u, v) => u[0]*v[0] + u[1]*v[1] + u[2]*v[2] + u[3]*v[3],
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

  ;; cross: (u, v) => { return tuple.vector(u[1]*v[2] - u[2]*v[1], u[2]*v[0] - u[0]*v[2], u[0]*v[1] - u[1]*v[0]); },
  (func $$VectorCross (param $a v128) (param $b v128) (result v128)
    local.get $a    ;;push $a
    local.get $b    ;;push $b
    f32x4.sub
  )

  (func $$VectorMag (param $a v128) (result v128)
    (local $tmp v128)
    local.get $a    ;;push $a
    local.get $a    ;;push $a  .tee maybe
    call $$VectorDot
  )

  (func $$VectorNormalize (param $a v128) (result v128)
    local.get $a    ;;push mem[$a]
    local.get $a    ;;push mem[$a]
    call $$VectorMag
    f32x4.div  
  )




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
  (export "memory" (memory $mem))
)
