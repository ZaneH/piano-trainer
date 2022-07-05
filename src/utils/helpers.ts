import { ScaleType } from '.'

export const ignoreOctave = (scale: ScaleType): ScaleType => {
  const scaleKeys: string[] = Object.keys(scale.keys || {})
  const modKeys: ScaleType = { keys: {} }

  for (const k of scaleKeys) {
    modKeys.keys[Number(k) % 12] = scale!.keys![Number(k)]
  }

  return modKeys
}
