import {
  createContext,
  Dispatch,
  FC,
  SetStateAction,
  useEffect,
  useState,
} from 'react'
import {
  AvailablePracticeModesType,
  AVAILABLE_SCALES,
  ScaleType,
} from '../../utils'

type TrainerContextType = {
  children?: React.ReactNode

  // Core functionality
  nextTargetNote?: number
  setNextTargetNote?: Dispatch<SetStateAction<number>>
  scale?: ScaleType
  setScale?: Dispatch<SetStateAction<ScaleType>>
  noteCounter?: number // responsible for resetting the target note when we reach the end of a scale sequence
  setNoteCounter?: Dispatch<SetStateAction<number>>

  // Settings
  practiceMode?: AvailablePracticeModesType
  setPracticeMode?: Dispatch<SetStateAction<AvailablePracticeModesType>>
  isScalePingPong?: boolean
  setIsScalePingPong?: Dispatch<SetStateAction<boolean>>
  isHardModeEnabled?: boolean
  setIsHardModeEnabled?: Dispatch<SetStateAction<boolean>>
}

export const TrainerContext = createContext({} as TrainerContextType)

const TrainerProvider: FC<TrainerContextType> = ({ children }) => {
  const [scale, setScale] = useState<ScaleType>(AVAILABLE_SCALES['c-major'])
  const [nextTargetNote, setNextTargetNote] = useState<number>(
    Number(Object.keys(scale)[0])
  )
  const [noteCounter, setNoteCounter] = useState(0)
  const [practiceMode, setPracticeMode] =
    useState<AvailablePracticeModesType>('scales')
  const [isScalePingPong, setIsScalePingPong] = useState(false)
  const [isHardModeEnabled, setIsHardModeEnabled] = useState(false)

  const [_isGoingDown, _setIsGoingDown] = useState(false)

  const context: TrainerContextType = {
    nextTargetNote,
    setNextTargetNote,
    scale,
    setScale,
    noteCounter,
    setNoteCounter,
    practiceMode,
    setPracticeMode,
    isScalePingPong,
    setIsScalePingPong,
    isHardModeEnabled,
    setIsHardModeEnabled,
  }

  useEffect(() => {
    if (isScalePingPong && _isGoingDown) {
      setNextTargetNote(
        Number(Object.keys(scale.keys).reverse()[noteCounter % 8])
      )

      if ((noteCounter + 1) % 8 === 0) {
        _setIsGoingDown(false)
      }
    } else {
      setNextTargetNote(Number(Object.keys(scale.keys)[noteCounter % 8]))

      if ((noteCounter + 1) % 8 === 0) {
        _setIsGoingDown(true)
      }
    }
  }, [noteCounter, setNextTargetNote, scale])

  useEffect(() => {
    setNoteCounter(0)
  }, [scale, isScalePingPong])

  return (
    <TrainerContext.Provider value={context}>
      {children}
    </TrainerContext.Provider>
  )
}

export default TrainerProvider
