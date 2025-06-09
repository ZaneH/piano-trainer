/**
 * Core types for the piano trainer application
 */

// Basic note and scale types
export type Note = string
export type MidiNumber = number

export type ScaleKeyType = { [midi: MidiNumber]: string }
export type ScaleType = {
  label?: string
  value?: AvailableAllScalesType
  keys: ScaleKeyType
}

// Available modes
export type AvailableScreensType = 'practice' | 'quiz'
export type AvailablePracticeModesType =
  | 'scales'
  | 'chords'
  | 'seventhChords'
  | 'fifths'

// Settings types
export type PTSettingsKeyType =
  | 'piano-sound'
  | 'show-keyboard'
  | 'mute-sound'
  | 'midi-input-id'
  | 'language'
  | 'is-sentry-on'

export type PTSettingType = {
  key: PTSettingsKeyType
  type: 'select' | 'checkbox'
  options?: readonly string[]
}

// Scale types
export type ScaleStepsType = 'w' | 'h'
export type MajorMinorType = 'Major' | 'Minor'

// Scale names
export type AvailableMajorScalesType =
  | 'c-flat-major'
  | 'c-major'
  | 'c-sharp-major'
  | 'd-major'
  | 'e-flat-major'
  | 'e-major'
  | 'f-major'
  | 'f-sharp-major'
  | 'g-flat-major'
  | 'g-major'
  | 'a-flat-major'
  | 'a-major'
  | 'b-flat-major'
  | 'b-major'

export type AvailableMinorNaturalScalesType =
  | 'a-minor-natural'
  | 'b-minor-natural'
  | 'c-minor-natural'
  | 'c-sharp-minor-natural'
  | 'd-minor-natural'
  | 'e-minor-natural'
  | 'f-minor-natural'
  | 'f-sharp-minor-natural'
  | 'g-minor-natural'
  | 'g-sharp-minor-natural'

export type AvailableMinorMelodicScalesType =
  | 'a-minor-melodic'
  | 'b-minor-melodic'
  | 'c-minor-melodic'
  | 'c-sharp-minor-melodic'
  | 'd-minor-melodic'
  | 'e-minor-melodic'
  | 'f-minor-melodic'
  | 'f-sharp-minor-melodic'
  | 'g-minor-melodic'
  | 'g-sharp-minor-melodic'

export type AvailableAllScalesType =
  | AvailableMajorScalesType
  | AvailableMinorNaturalScalesType
  | AvailableMinorMelodicScalesType

// MIDI Device type
export type MidiDevice = {
  id: number
  name?: string
}

// Note tracker for training
export interface NoteTracker {
  currentMidiNumber: MidiNumber
  nextTargetMidiNumber: MidiNumber
  prevNote?: MidiNumber
  noteCounter: number
}
