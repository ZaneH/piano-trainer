import { ScaleType } from '..'

const CFlatMajor: ScaleType = {
  label: 'Cb Major',
  value: 'c-flat-major',
  keys: {
    59: 'I',
    61: 'ii',
    63: 'iii',
    64: 'IV',
    66: 'V',
    68: 'vi',
    70: 'viiº',
    71: 'I',
  },
} as const

const CMajor: ScaleType = {
  label: 'C Major',
  value: 'c-major',
  keys: {
    48: 'I',
    50: 'ii',
    52: 'iii',
    53: 'IV',
    55: 'V',
    57: 'vi',
    59: 'viiº',
    60: 'I',
  },
} as const

const CSharpMajor: ScaleType = {
  label: 'C# Major',
  value: 'c-sharp-major',
  keys: {
    49: 'I',
    51: 'ii',
    53: 'iii',
    54: 'IV',
    56: 'V',
    58: 'vi',
    60: 'viiº',
    61: 'I',
  },
} as const

const DMajor: ScaleType = {
  label: 'D Major',
  value: 'd-major',
  keys: {
    50: 'I',
    52: 'ii',
    54: 'iii',
    55: 'IV',
    57: 'V',
    59: 'vi',
    61: 'viiº',
    62: 'I',
  },
} as const

const EFlatMajor: ScaleType = {
  label: 'Eb Major',
  value: 'e-flat-major',
  keys: {
    51: 'I',
    53: 'ii',
    55: 'iii',
    56: 'IV',
    58: 'V',
    60: 'vi',
    62: 'viiº',
    63: 'I',
  },
} as const

const EMajor: ScaleType = {
  label: 'E Major',
  value: 'e-major',
  keys: {
    52: 'I',
    54: 'ii',
    56: 'iii',
    57: 'IV',
    59: 'V',
    61: 'vi',
    63: 'viiº',
    64: 'I',
  },
} as const

const FMajor: ScaleType = {
  label: 'F Major',
  value: 'f-major',
  keys: {
    53: 'I',
    55: 'ii',
    57: 'iii',
    58: 'IV',
    60: 'V',
    62: 'vi',
    64: 'viiº',
    65: 'I',
  },
} as const

const FSharpMajor: ScaleType = {
  label: 'F# Major',
  value: 'f-sharp-major',
  keys: {
    54: 'I',
    56: 'ii',
    58: 'iii',
    59: 'IV',
    61: 'V',
    63: 'vi',
    65: 'viiº',
    66: 'I',
  },
} as const

const GFlatMajor: ScaleType = {
  label: 'Gb Major',
  value: 'g-flat-major',
  keys: {
    54: 'I',
    56: 'ii',
    58: 'iii',
    59: 'IV',
    61: 'V',
    63: 'vi',
    65: 'viiº',
    66: 'I',
  },
} as const

const GMajor: ScaleType = {
  label: 'G Major',
  value: 'g-major',
  keys: {
    55: 'I',
    57: 'ii',
    59: 'iii',
    60: 'IV',
    62: 'V',
    64: 'vi',
    66: 'viiº',
    67: 'I',
  },
} as const

const AFlatMajor: ScaleType = {
  label: 'Ab Major',
  value: 'a-flat-major',
  keys: {
    56: 'I',
    58: 'ii',
    60: 'iii',
    61: 'IV',
    63: 'V',
    65: 'vi',
    67: 'viiº',
    68: 'I',
  },
} as const

const AMajor: ScaleType = {
  label: 'A Major',
  value: 'a-major',
  keys: {
    57: 'I',
    59: 'ii',
    61: 'iii',
    62: 'IV',
    64: 'V',
    66: 'vi',
    68: 'viiº',
    69: 'I',
  },
} as const

const BFlatMajor: ScaleType = {
  label: 'Bb Major',
  value: 'b-flat-major',
  keys: {
    58: 'I',
    60: 'ii',
    62: 'iii',
    63: 'IV',
    65: 'V',
    67: 'vi',
    69: 'viiº',
    70: 'I',
  },
} as const

const BMajor: ScaleType = {
  label: 'B Major',
  value: 'b-major',
  keys: {
    59: 'I',
    61: 'ii',
    63: 'iii',
    64: 'IV',
    66: 'V',
    68: 'vi',
    70: 'viiº',
    71: 'I',
  },
} as const

export type AvailableMajorScalesType =
  | 'c-flat-major'
  | 'c-major'
  | 'c-sharp-major'
  | 'd-major'
  | 'e-flat-major'
  | 'e-major'
  | 'f-major'
  | 'f-sharp-major'
  | 'g-flat-major'
  | 'g-major'
  | 'a-flat-major'
  | 'a-major'
  | 'b-flat-major'
  | 'b-major'

const AVAILABLE_MAJOR_SCALES: {
  [key in AvailableMajorScalesType]: ScaleType
} = {
  'c-flat-major': CFlatMajor,
  'c-major': CMajor,
  'c-sharp-major': CSharpMajor,
  'd-major': DMajor,
  'e-flat-major': EFlatMajor,
  'e-major': EMajor,
  'f-major': FMajor,
  'f-sharp-major': FSharpMajor,
  'g-flat-major': GFlatMajor,
  'g-major': GMajor,
  'a-flat-major': AFlatMajor,
  'a-major': AMajor,
  'b-flat-major': BFlatMajor,
  'b-major': BMajor,
} as const

export { AVAILABLE_MAJOR_SCALES }
