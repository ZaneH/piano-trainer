import {
  AvailableMajorScalesType,
  AVAILABLE_MAJOR_SCALES,
} from './scales/major'
import {
  AvailableMinorMelodicScalesType,
  AVAILABLE_MINOR_MELODIC_SCALES,
} from './scales/minor.melodic'
import {
  AvailableMinorNaturalScalesType,
  AVAILABLE_MINOR_NATURAL_SCALES,
} from './scales/minor.natural'

type AvailableScalesType =
  | AvailableMajorScalesType
  | AvailableMinorNaturalScalesType
  | AvailableMinorMelodicScalesType

export type ScaleType = {
  label?: string
  value?: AvailableScalesType
  keys: {
    [midi: number]: string
  }
}

export const AVAILABLE_SCALES: {
  [key in AvailableScalesType]: ScaleType
} = {
  ...AVAILABLE_MAJOR_SCALES,
  ...AVAILABLE_MINOR_NATURAL_SCALES,
  ...AVAILABLE_MINOR_MELODIC_SCALES,
}

export const ignoreOctave = (scale: ScaleType): ScaleType => {
  const scaleKeys: string[] = Object.keys(scale.keys || {})
  const modKeys: ScaleType = { keys: {} }

  for (const k of scaleKeys) {
    modKeys.keys[Number(k) % 12] = scale!.keys![Number(k)]
  }

  return modKeys
}

export * from './scales/major'
export * from './modes/practice'
