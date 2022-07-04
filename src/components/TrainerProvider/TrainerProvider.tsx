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
  AVAILABLE_MODES,
  AVAILABLE_SCALES,
  ScaleType,
} from '../../utils'

type TrainerContextType = {
  children?: React.ReactNode
  nextTargetNote?: number
  setNextTargetNote?: Dispatch<SetStateAction<number>>
  scale?: ScaleType
  setScale?: Dispatch<SetStateAction<ScaleType>>
  noteCounter?: number // responsible for resetting the target note when we reach the end of a scale sequence
  setNoteCounter?: Dispatch<SetStateAction<number>>
  practiceMode?: AvailablePracticeModesType
  setPracticeMode?: Dispatch<SetStateAction<AvailablePracticeModesType>>
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

  const context: TrainerContextType = {
    nextTargetNote,
    setNextTargetNote,
    scale,
    setScale,
    noteCounter,
    setNoteCounter,
    practiceMode,
    setPracticeMode,
  }

  useEffect(() => {
    setNextTargetNote(Number(Object.keys(scale)[noteCounter % 8]))
  }, [noteCounter, setNextTargetNote, scale])

  return (
    <TrainerContext.Provider value={context}>
      {children}
    </TrainerContext.Provider>
  )
}

export default TrainerProvider
