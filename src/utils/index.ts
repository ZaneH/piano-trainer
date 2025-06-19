import { AvailableAllScalesType } from './constants'

export type ScaleKeyType = { [midi: number]: string }
export type ScaleType = {
  label?: string
  value?: AvailableAllScalesType
  keys: ScaleKeyType
}

export * from './constants'
export * from './modes/practice'
export * from './scales/generated-major'
export * from './helpers'
export * from './scales/fifths'
