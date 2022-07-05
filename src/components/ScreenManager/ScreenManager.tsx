import { useContext } from 'react'
import { TrainerContext } from '../TrainerProvider'

interface ScreenManagerProps {
  practice: JSX.Element
  quiz: JSX.Element
}

const ScreenManager = ({ practice, quiz }: ScreenManagerProps) => {
  const { currentScreen } = useContext(TrainerContext)
  if (currentScreen === 'practice') {
    return practice
  } else if (currentScreen === 'quiz') {
    return quiz
  }

  return null
}

export default ScreenManager
