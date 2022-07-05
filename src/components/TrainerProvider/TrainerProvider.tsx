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
  AvailableScreensType,
  AVAILABLE_SCALES,
  ScaleType,
  SCALE_LENGTH,
} from '../../utils'

type TrainerContextType = {
  children?: React.ReactNode

  // Core functionality
  nextTargetNote?: number
  setNextTargetNote?: Dispatch<SetStateAction<number>>
  /** Track the last key pressed for hard mode */
  prevNote?: number
  setPrevNote?: Dispatch<SetStateAction<number>>
  scale?: ScaleType
  setScale?: Dispatch<SetStateAction<ScaleType>>
  /** Responsible for resetting the nextTargetNote when we reach the end of a scale sequence. Counts to infinity */
  noteCounter?: number
  setNoteCounter?: Dispatch<SetStateAction<number>>
  /** Responsible for storing the current chord being played in Chord mode */
  chordStack?: number[]
  setChordStack?: Dispatch<SetStateAction<number[]>>

  // Settings
  practiceMode?: AvailablePracticeModesType
  setPracticeMode?: Dispatch<SetStateAction<AvailablePracticeModesType>>
  currentScreen?: AvailableScreensType
  setCurrentScreen?: Dispatch<SetStateAction<AvailableScreensType>>
  isScalePingPong?: boolean
  setIsScalePingPong?: Dispatch<SetStateAction<boolean>>
  isHardModeEnabled?: boolean
  setIsHardModeEnabled?: Dispatch<SetStateAction<boolean>>
}

export const TrainerContext = createContext({} as TrainerContextType)

const TrainerProvider: FC<TrainerContextType> = ({ children }) => {
  const [scale, setScale] = useState<ScaleType>(AVAILABLE_SCALES['c-major'])
  const [prevNote, setPrevNote] = useState(Number(Object.keys(scale.keys)[0]))
  const [nextTargetNote, setNextTargetNote] = useState<number>(
    Number(Object.keys(scale)[0])
  )
  const [noteCounter, setNoteCounter] = useState(0)
  const [chordStack, setChordStack] = useState<number[]>([])
  const [practiceMode, setPracticeMode] =
    useState<AvailablePracticeModesType>('scales')
  const [currentScreen, setCurrentScreen] =
    useState<AvailableScreensType>('practice')
  const [isScalePingPong, setIsScalePingPong] = useState(false)
  const [isHardModeEnabled, setIsHardModeEnabled] = useState(false)

  const [_isGoingDown, _setIsGoingDown] = useState(false)

  const context: TrainerContextType = {
    nextTargetNote,
    setNextTargetNote,
    prevNote,
    setPrevNote,
    scale,
    setScale,
    noteCounter,
    setNoteCounter,
    chordStack,
    setChordStack,
    practiceMode,
    setPracticeMode,
    currentScreen,
    setCurrentScreen,
    isScalePingPong,
    setIsScalePingPong,
    isHardModeEnabled,
    setIsHardModeEnabled,
  }

  useEffect(() => {
    setPrevNote(nextTargetNote)

    if (isScalePingPong && _isGoingDown) {
      setNextTargetNote(
        Number(Object.keys(scale.keys).reverse()[noteCounter % SCALE_LENGTH])
      )

      if ((noteCounter + 1) % SCALE_LENGTH === 0) {
        _setIsGoingDown(false)
      }
    } else {
      setNextTargetNote(
        Number(Object.keys(scale.keys)[noteCounter % SCALE_LENGTH])
      )

      if ((noteCounter + 1) % SCALE_LENGTH === 0) {
        _setIsGoingDown(true)
      }
    }
  }, [noteCounter, setNextTargetNote, scale, isScalePingPong])

  useEffect(() => {
    setNoteCounter(0)
  }, [scale, isScalePingPong, currentScreen, practiceMode])

  return (
    <TrainerContext.Provider value={context}>
      {children}
    </TrainerContext.Provider>
  )
}

export default TrainerProvider
