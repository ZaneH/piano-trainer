import { ScaleType } from '..'

const CMinorNatural: ScaleType = {
  label: 'C Minor (Natural)',
  value: 'c-minor-natural',
  keys: {
    48: 'i',
    50: 'iiº',
    51: 'III',
    53: 'iv',
    55: 'v',
    56: 'VI',
    58: 'VII',
    60: 'i',
  },
} as const

const DMinorNatural: ScaleType = {
  label: 'D Minor (Natural)',
  value: 'd-minor-natural',
  keys: {
    50: 'i',
    52: 'iiº',
    53: 'III',
    55: 'iv',
    57: 'v',
    58: 'VI',
    60: 'VII',
    62: 'i',
  },
} as const

const EMinorNatural: ScaleType = {
  label: 'E Minor (Natural)',
  value: 'e-minor-natural',
  keys: {
    52: 'i',
    54: 'iiº',
    55: 'III',
    57: 'iv',
    59: 'v',
    60: 'VI',
    62: 'VII',
    64: 'i',
  },
} as const

const FMinorNatural: ScaleType = {
  label: 'F Minor (Natural)',
  value: 'f-minor-natural',
  keys: {
    53: 'i',
    55: 'iiº',
    56: 'III',
    58: 'iv',
    60: 'v',
    61: 'VI',
    63: 'VII',
    65: 'i',
  },
} as const

const GMinorNatural: ScaleType = {
  label: 'G Minor (Natural)',
  value: 'g-minor-natural',
  keys: {
    55: 'i',
    57: 'iiº',
    58: 'III',
    60: 'iv',
    62: 'v',
    63: 'VI',
    65: 'VII',
    67: 'i',
  },
} as const

const AMinorNatural: ScaleType = {
  label: 'A Minor (Natural)',
  value: 'a-minor-natural',
  keys: {
    57: 'i',
    59: 'iiº',
    60: 'III',
    62: 'iv',
    64: 'v',
    65: 'VI',
    67: 'VII',
    69: 'i',
  },
} as const

const BMinorNatural: ScaleType = {
  label: 'B Minor (Natural)',
  value: 'b-minor-natural',
  keys: {
    59: 'i',
    61: 'iiº',
    62: 'III',
    64: 'iv',
    66: 'v',
    67: 'VI',
    69: 'VII',
    71: 'i',
  },
} as const

export type AvailableMinorNaturalScalesType =
  | 'c-minor-natural'
  | 'd-minor-natural'
  | 'e-minor-natural'
  | 'f-minor-natural'
  | 'g-minor-natural'
  | 'a-minor-natural'
  | 'b-minor-natural'

const AVAILABLE_MINOR_NATURAL_SCALES: {
  [key in AvailableMinorNaturalScalesType]: ScaleType
} = {
  'c-minor-natural': CMinorNatural,
  'd-minor-natural': DMinorNatural,
  'e-minor-natural': EMinorNatural,
  'f-minor-natural': FMinorNatural,
  'g-minor-natural': GMinorNatural,
  'a-minor-natural': AMinorNatural,
  'b-minor-natural': BMinorNatural,
} as const

export { AVAILABLE_MINOR_NATURAL_SCALES }
