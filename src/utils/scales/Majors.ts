import { ScaleType } from '..'

const CMajor: ScaleType = {
  48: 'I',
  50: 'ii',
  52: 'iii',
  53: 'IV',
  55: 'V',
  57: 'vi',
  59: 'viiº',
  60: 'I',
}

const ignoreOctave = (scale: ScaleType): ScaleType => {
  const scaleKeys: string[] = Object.keys(scale)
  const modKeys: ScaleType = {}

  for (const k of scaleKeys) {
    modKeys[Number(k) % 12] = scale[Number(k)]
  }

  return modKeys
}

export { CMajor, ignoreOctave }
