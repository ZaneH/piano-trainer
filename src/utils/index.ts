import { AvailableAllScalesType } from './constants'

export type ScaleType = {
  label?: string
  value?: AvailableAllScalesType
  keys: {
    [midi: number]: string
  }
}

export * from './constants'
export * from './modes/practice'
export * from './scales/major'
export * from './helpers'
export * from './scales/fifths'
