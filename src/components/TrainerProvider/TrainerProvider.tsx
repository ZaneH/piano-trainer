import {
  createContext,
  Dispatch,
  FC,
  SetStateAction,
  useEffect,
  useState,
} from 'react'
import { CMajor, ScaleType } from '../../utils'

type TrainerContextType = {
  children?: React.ReactNode
  nextTargetNote?: number
  setNextTargetNote?: Dispatch<SetStateAction<number>>
  scale?: ScaleType
  setScale?: Dispatch<SetStateAction<ScaleType>>
  noteCounter?: number // responsible for resetting the target note when we reach the end of a scale
  setNoteCounter?: Dispatch<SetStateAction<number>>
}

export const TrainerContext = createContext({} as TrainerContextType)

const TrainerProvider: FC<TrainerContextType> = ({ children }) => {
  const [scale, setScale] = useState<ScaleType>(CMajor)
  const [nextTargetNote, setNextTargetNote] = useState<number>(
    Number(Object.keys(scale)[0])
  )
  const [noteCounter, setNoteCounter] = useState(0)

  const context: TrainerContextType = {
    nextTargetNote,
    setNextTargetNote,
    scale,
    setScale,
    noteCounter,
    setNoteCounter,
  }

  useEffect(() => {
    const newTargetNote = Number(Object.keys(scale)[noteCounter % 8])
    console.log('NEW:', newTargetNote)
    setNextTargetNote(newTargetNote)
  }, [noteCounter, setNextTargetNote, scale])

  return (
    <TrainerContext.Provider value={context}>
      {children}
    </TrainerContext.Provider>
  )
}

export default TrainerProvider
