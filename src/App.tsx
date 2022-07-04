import Keyboard from './components/Keyboard'
import { TrainerPiano } from './components/Trainer'
import TrainerProvider from './components/TrainerProvider'

function App() {
  return (
    <div className='App'>
      <TrainerProvider>
        <TrainerPiano />
        <Keyboard />
      </TrainerProvider>
    </div>
  )
}

export default App
