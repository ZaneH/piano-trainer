import { ScaleType } from '..'

const CMinorMelodic: ScaleType = {
  label: 'C Minor (Melodic)',
  value: 'c-minor-melodic',
  keys: {
    48: 'i',
    50: 'iiº',
    51: 'III+',
    53: 'IV',
    55: 'V',
    57: 'viº',
    59: 'viiº',
    60: 'i',
  },
} as const

const CSharpMinorMelodic: ScaleType = {
  label: 'C# Minor (Melodic)',
  value: 'c-sharp-minor-melodic',
  keys: {
    49: 'i',
    51: 'iiº',
    52: 'III+',
    54: 'IV',
    56: 'V',
    58: 'viº',
    60: 'viiº',
    61: 'i',
  },
} as const

const DMinorMelodic: ScaleType = {
  label: 'D Minor (Melodic)',
  value: 'd-minor-melodic',
  keys: {
    50: 'i',
    52: 'iiº',
    53: 'III+',
    55: 'IV',
    57: 'V',
    59: 'viº',
    61: 'viiº',
    62: 'i',
  },
} as const

const DSharpMinorMelodic: ScaleType = {
  label: 'D# Minor (Melodic)',
  value: 'd-sharp-minor-melodic',
  keys: {
    51: 'i',
    53: 'iiº',
    54: 'III+',
    56: 'IV',
    58: 'V',
    60: 'viº',
    62: 'viiº',
    63: 'i',
  },
} as const

const EFlatMinorMelodic: ScaleType = {
  label: 'Eb Minor (Melodic)',
  value: 'e-flat-minor-melodic',
  keys: {
    51: 'i',
    53: 'iiº',
    54: 'III+',
    56: 'IV',
    58: 'V',
    60: 'viº',
    62: 'viiº',
    63: 'i',
  },
} as const

const EMinorMelodic: ScaleType = {
  label: 'E Minor (Melodic)',
  value: 'e-minor-melodic',
  keys: {
    52: 'i',
    54: 'iiº',
    55: 'III+',
    57: 'IV',
    59: 'V',
    61: 'viº',
    63: 'viiº',
    64: 'i',
  },
} as const

const FMinorMelodic: ScaleType = {
  label: 'F Minor (Melodic)',
  value: 'f-minor-melodic',
  keys: {
    53: 'i',
    55: 'iiº',
    56: 'III+',
    58: 'IV',
    60: 'V',
    62: 'viº',
    64: 'viiº',
    65: 'i',
  },
} as const

const FSharpMinorMelodic: ScaleType = {
  label: 'F# Minor (Melodic)',
  value: 'f-sharp-minor-melodic',
  keys: {
    54: 'i',
    56: 'iiº',
    57: 'III+',
    59: 'IV',
    61: 'V',
    63: 'viº',
    65: 'viiº',
    66: 'i',
  },
} as const

const GMinorMelodic: ScaleType = {
  label: 'G Minor (Melodic)',
  value: 'g-minor-melodic',
  keys: {
    55: 'i',
    57: 'iiº',
    58: 'III+',
    60: 'IV',
    62: 'V',
    64: 'viº',
    66: 'viiº',
    67: 'i',
  },
} as const

const GSharpMinorMelodic: ScaleType = {
  label: 'G# Minor (Melodic)',
  value: 'g-sharp-minor-melodic',
  keys: {
    56: 'i',
    58: 'iiº',
    59: 'III+',
    61: 'IV',
    63: 'V',
    65: 'viº',
    67: 'viiº',
    68: 'i',
  },
} as const

const AFlatMinorMelodic: ScaleType = {
  label: 'Ab Minor (Melodic)',
  value: 'a-flat-minor-melodic',
  keys: {
    56: 'i',
    58: 'iiº',
    59: 'III+',
    61: 'IV',
    63: 'V',
    65: 'viº',
    67: 'viiº',
    68: 'i',
  },
} as const

const AMinorMelodic: ScaleType = {
  label: 'A Minor (Melodic)',
  value: 'a-minor-melodic',
  keys: {
    57: 'i',
    59: 'iiº',
    60: 'III+',
    62: 'IV',
    64: 'V',
    66: 'viº',
    68: 'viiº',
    69: 'i',
  },
} as const

const ASharpMinorMelodic: ScaleType = {
  label: 'A# Minor (Melodic)',
  value: 'a-sharp-minor-melodic',
  keys: {
    58: 'i',
    60: 'iiº',
    61: 'III+',
    63: 'IV',
    65: 'V',
    67: 'viº',
    69: 'viiº',
    70: 'i',
  },
} as const

const BFlatMinorMelodic: ScaleType = {
  label: 'Bb Minor (Melodic)',
  value: 'b-flat-minor-melodic',
  keys: {
    58: 'i',
    60: 'iiº',
    61: 'III+',
    63: 'IV',
    65: 'V',
    67: 'viº',
    69: 'viiº',
    70: 'i',
  },
} as const

const BMinorMelodic: ScaleType = {
  label: 'B Minor (Melodic)',
  value: 'b-minor-melodic',
  keys: {
    59: 'i',
    61: 'iiº',
    62: 'III+',
    64: 'IV',
    66: 'V',
    68: 'viº',
    70: 'viiº',
    71: 'i',
  },
} as const

export type AvailableMinorMelodicScalesType =
  | 'c-minor-melodic'
  | 'c-sharp-minor-melodic'
  | 'd-minor-melodic'
  | 'd-sharp-minor-melodic'
  | 'e-flat-minor-melodic'
  | 'e-minor-melodic'
  | 'f-minor-melodic'
  | 'f-sharp-minor-melodic'
  | 'g-minor-melodic'
  | 'g-sharp-minor-melodic'
  | 'a-flat-minor-melodic'
  | 'a-minor-melodic'
  | 'a-sharp-minor-melodic'
  | 'b-flat-minor-melodic'
  | 'b-minor-melodic'

const AVAILABLE_MINOR_MELODIC_SCALES: {
  [key in AvailableMinorMelodicScalesType]: ScaleType
} = {
  'c-minor-melodic': CMinorMelodic,
  'c-sharp-minor-melodic': CSharpMinorMelodic,
  'd-minor-melodic': DMinorMelodic,
  'd-sharp-minor-melodic': DSharpMinorMelodic,
  'e-flat-minor-melodic': EFlatMinorMelodic,
  'e-minor-melodic': EMinorMelodic,
  'f-minor-melodic': FMinorMelodic,
  'f-sharp-minor-melodic': FSharpMinorMelodic,
  'g-minor-melodic': GMinorMelodic,
  'g-sharp-minor-melodic': GSharpMinorMelodic,
  'a-flat-minor-melodic': AFlatMinorMelodic,
  'a-minor-melodic': AMinorMelodic,
  'a-sharp-minor-melodic': ASharpMinorMelodic,
  'b-flat-minor-melodic': BFlatMinorMelodic,
  'b-minor-melodic': BMinorMelodic,
} as const

export { AVAILABLE_MINOR_MELODIC_SCALES }
