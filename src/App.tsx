import { useCallback, useEffect } from 'react'
import styled from 'styled-components'
import KVProvider from './core/providers/KVProvider'
import SidebarProvider from './core/providers/SidebarProvider'
import TrainerProvider from './core/providers/TrainerProvider'
import ScreenManager from './components/ScreenManager/ScreenManager'
import Keyboard from './components/Keyboard'
import { TrainerDisplay, TrainerPiano } from './components/Trainer'
import { Quiz } from './components/Quiz'

import './i18n/config'

const PracticeScreenLayout = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
`

const QuizScreenLayout = styled.div`
  display: flex;
  height: 100%;
  flex-direction: column;
`

function App() {
  // Handle keyboard events for the app
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    const { key, metaKey } = e
    let preventDefault = true

    if (key === 'q' && metaKey) {
      preventDefault = false
    }

    if (preventDefault) {
      e.preventDefault()
    }
  }, [])

  // Add and remove event listeners
  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [handleKeyDown])

  return (
    <KVProvider>
      <SidebarProvider>
        <TrainerProvider>
          <ScreenManager
            practice={
              <PracticeScreenLayout>
                <TrainerPiano />
                <TrainerDisplay />
                <Keyboard />
              </PracticeScreenLayout>
            }
            quiz={
              <QuizScreenLayout>
                <Quiz />
              </QuizScreenLayout>
            }
          />
        </TrainerProvider>
      </SidebarProvider>
    </KVProvider>
  )
}

export default App
