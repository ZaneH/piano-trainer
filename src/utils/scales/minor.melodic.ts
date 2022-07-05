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
  | 'd-minor-melodic'
  | 'e-minor-melodic'
  | 'f-minor-melodic'
  | 'g-minor-melodic'
  | 'a-minor-melodic'
  | 'b-minor-melodic'

const AVAILABLE_MINOR_MELODIC_SCALES: {
  [key in AvailableMinorMelodicScalesType]: ScaleType
} = {
  'c-minor-melodic': CMinorMelodic,
  'd-minor-melodic': DMinorMelodic,
  'e-minor-melodic': EMinorMelodic,
  'f-minor-melodic': FMinorMelodic,
  'g-minor-melodic': GMinorMelodic,
  'a-minor-melodic': AMinorMelodic,
  'b-minor-melodic': BMinorMelodic,
} as const

export { AVAILABLE_MINOR_MELODIC_SCALES }
