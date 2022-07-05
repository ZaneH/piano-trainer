import { ScaleType } from '..'

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
  | 'c-major'
  | 'd-major'
  | 'e-major'
  | 'f-major'
  | 'g-major'
  | 'a-major'
  | 'b-major'

const AVAILABLE_MAJOR_SCALES: { [key in AvailableMajorScalesType]: ScaleType } =
  {
    'c-major': CMajor,
    'd-major': DMajor,
    'e-major': EMajor,
    'f-major': FMajor,
    'g-major': GMajor,
    'a-major': AMajor,
    'b-major': BMajor,
  } as const

export { AVAILABLE_MAJOR_SCALES }
