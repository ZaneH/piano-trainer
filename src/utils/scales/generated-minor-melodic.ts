import { AvailableMinorMelodicScalesType } from '../../core/models/types'
import { generateAllMinorMelodicScales } from '../../core/services/scaleService'

// Generate all minor melodic scales dynamically
export const AVAILABLE_MINOR_MELODIC_SCALES = generateAllMinorMelodicScales()

export type { AvailableMinorMelodicScalesType }
