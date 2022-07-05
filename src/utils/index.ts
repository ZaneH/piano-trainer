import { AvailableScalesType } from './constants'

export type ScaleType = {
  label?: string
  value?: AvailableScalesType
  keys: {
    [midi: number]: string
  }
}

export * from './constants'
export * from './modes/practice'
export * from './scales/major'
export * from './helpers'
