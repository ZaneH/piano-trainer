import { AvailableMinorNaturalScalesType } from '../../core/models/types'
import { generateAllMinorNaturalScales } from '../../core/services/scaleService'

// Generate all minor natural scales dynamically
export const AVAILABLE_MINOR_NATURAL_SCALES = generateAllMinorNaturalScales()

export type { AvailableMinorNaturalScalesType }
