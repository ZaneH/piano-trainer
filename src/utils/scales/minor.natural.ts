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

const CSharpMinorNatural: ScaleType = {
  label: 'C# Minor (Natural)',
  value: 'c-sharp-minor-natural',
  keys: {
    49: 'i',
    51: 'iiº',
    52: 'III',
    54: 'iv',
    56: 'v',
    57: 'VI',
    59: 'VII',
    61: 'i',
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

const DSharpMinorNatural: ScaleType = {
  label: 'D# Minor (Natural)',
  value: 'd-sharp-minor-natural',
  keys: {
    51: 'i',
    53: 'iiº',
    54: 'III',
    56: 'iv',
    58: 'v',
    59: 'VI',
    61: 'VII',
    63: 'i',
  },
} as const

const EFlatMinorNatural: ScaleType = {
  label: 'Eb Minor (Natural)',
  value: 'e-flat-minor-natural',
  keys: {
    51: 'i',
    53: 'iiº',
    54: 'III',
    56: 'iv',
    58: 'v',
    59: 'VI',
    61: 'VII',
    63: 'i',
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

const FSharpMinorNatural: ScaleType = {
  label: 'F# Minor (Natural)',
  value: 'f-sharp-minor-natural',
  keys: {
    54: 'i',
    56: 'iiº',
    57: 'III',
    59: 'iv',
    61: 'v',
    62: 'VI',
    64: 'VII',
    66: 'i',
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

const GSharpMinorNatural: ScaleType = {
  label: 'G# Minor (Natural)',
  value: 'g-sharp-minor-natural',
  keys: {
    56: 'i',
    58: 'iiº',
    59: 'III',
    61: 'iv',
    63: 'v',
    64: 'VI',
    66: 'VII',
    68: 'i',
  },
} as const

const AFlatMinorNatural: ScaleType = {
  label: 'Ab Minor (Natural)',
  value: 'a-flat-minor-natural',
  keys: {
    56: 'i',
    58: 'iiº',
    59: 'III',
    61: 'iv',
    63: 'v',
    64: 'VI',
    66: 'VII',
    68: 'i',
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

const ASharpMinorNatural: ScaleType = {
  label: 'A# Minor (Natural)',
  value: 'a-sharp-minor-natural',
  keys: {
    58: 'i',
    60: 'iiº',
    61: 'III',
    63: 'iv',
    65: 'v',
    66: 'VI',
    68: 'VII',
    70: 'i',
  },
} as const

const BFlatMinorNatural: ScaleType = {
  label: 'Bb Minor (Natural)',
  value: 'b-flat-minor-natural',
  keys: {
    58: 'i',
    60: 'iiº',
    61: 'III',
    63: 'iv',
    65: 'v',
    66: 'VI',
    68: 'VII',
    70: 'i',
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
  | 'c-sharp-minor-natural'
  | 'd-minor-natural'
  | 'd-sharp-minor-natural'
  | 'e-flat-minor-natural'
  | 'e-minor-natural'
  | 'f-minor-natural'
  | 'f-sharp-minor-natural'
  | 'g-minor-natural'
  | 'g-sharp-minor-natural'
  | 'a-flat-minor-natural'
  | 'a-minor-natural'
  | 'a-sharp-minor-natural'
  | 'b-flat-minor-natural'
  | 'b-minor-natural'

const AVAILABLE_MINOR_NATURAL_SCALES: {
  [key in AvailableMinorNaturalScalesType]: ScaleType
} = {
  'c-minor-natural': CMinorNatural,
  'c-sharp-minor-natural': CSharpMinorNatural,
  'd-minor-natural': DMinorNatural,
  'd-sharp-minor-natural': DSharpMinorNatural,
  'e-flat-minor-natural': EFlatMinorNatural,
  'e-minor-natural': EMinorNatural,
  'f-minor-natural': FMinorNatural,
  'f-sharp-minor-natural': FSharpMinorNatural,
  'g-minor-natural': GMinorNatural,
  'g-sharp-minor-natural': GSharpMinorNatural,
  'a-flat-minor-natural': AFlatMinorNatural,
  'a-minor-natural': AMinorNatural,
  'a-sharp-minor-natural': ASharpMinorNatural,
  'b-flat-minor-natural': BFlatMinorNatural,
  'b-minor-natural': BMinorNatural,
} as const

export { AVAILABLE_MINOR_NATURAL_SCALES }
