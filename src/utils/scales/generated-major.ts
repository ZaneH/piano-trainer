/**
 * Dynamically generated major scales - replaces hardcoded major.ts
 */
import { AvailableMajorScalesType } from '../../core/models/types'
import { generateAllMajorScales } from '../../core/services/scaleService'

export const AVAILABLE_MAJOR_SCALES = generateAllMajorScales()

export type { AvailableMajorScalesType }
