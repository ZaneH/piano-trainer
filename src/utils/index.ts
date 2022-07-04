import { AvailableScalesType } from './scales/majors'

export type ScaleType = {
  label?: string
  value?: AvailableScalesType
  [midi: number]: string
}

export * from './scales/majors'
export * from './modes/practice'
