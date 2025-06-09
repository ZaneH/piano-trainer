/**
 * Refactored App.tsx
 */
import { useCallback, useEffect } from 'react'
import styled from 'styled-components'

// Import components
import KVProvider from './core/providers/KVProvider'
import SidebarProvider from './components/SidebarProvider/SidebarProvider'
import TrainerProvider from './core/providers/TrainerProvider'
import ScreenManager from './components/ScreenManager/ScreenManager'
import RefactoredKeyboard from './components/Keyboard/RefactoredKeyboard'
import { TrainerDisplay } from './components/Trainer'
import RefactoredTrainerPiano from './components/Trainer/RefactoredTrainerPiano'
import { Quiz } from './components/Quiz'

// Import i18n configuration
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
                <RefactoredTrainerPiano />
                <TrainerDisplay />
                <RefactoredKeyboard />
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
