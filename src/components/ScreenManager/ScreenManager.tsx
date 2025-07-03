import { JSX } from 'react'
import { useTrainer } from '../../core/contexts/TrainerContext'

interface ScreenManagerProps {
  practice: JSX.Element
  quiz: JSX.Element
}

const ScreenManager = ({ practice, quiz }: ScreenManagerProps) => {
  const { currentScreen } = useTrainer()

  if (currentScreen === 'practice') {
    return practice
  } else if (currentScreen === 'quiz') {
    return quiz
  }

  return null
}

export default ScreenManager
