/**
 * MIDI service for handling MIDI connections and events
 */
import { invoke } from '@tauri-apps/api/core'
import { listen, UnlistenFn } from '@tauri-apps/api/event'
import { MidiDevice } from '../models/types'

export interface MidiMessage {
  message: number[]
}

export interface MidiNoteEvent {
  note: number
  velocity: number
  isNoteOn: boolean
}

/**
 * Lists all available MIDI connections
 */
export async function listMidiConnections(): Promise<MidiDevice[]> {
  try {
    const devicesObject = (await invoke('list_midi_connections')) as Record<
      number,
      string
    >
    return Object.entries(devicesObject).map(([id, name]) => ({
      id: Number(id),
      name,
    }))
  } catch (error) {
    console.error('Error listing MIDI connections:', error)
    return []
  }
}

/**
 * Opens a MIDI connection with the specified device ID
 */
export async function openMidiConnection(deviceId: number): Promise<void> {
  try {
    await invoke('open_midi_connection', { inputIdx: deviceId })
    console.log(`Connected to MIDI device with ID: ${deviceId}`)
  } catch (error) {
    console.error('Error opening MIDI connection:', error)
    throw error
  }
}

/**
 * Subscribes to MIDI messages and calls the callback when messages are received
 */
export async function subscribeMidiMessages(
  callback: (event: MidiNoteEvent) => void
): Promise<UnlistenFn> {
  try {
    return await listen('midi_message', (event) => {
      const payload = event.payload as { message: number[] }
      const [status, note, velocity] = payload.message

      // Extract command from status byte (top 4 bits)
      const command = status & 0xf0

      // Note on: 0x90, Note off: 0x80
      const isNoteOn = command === 0x90 && velocity > 0

      callback({
        note,
        velocity,
        isNoteOn,
      })
    })
  } catch (error) {
    console.error('Error subscribing to MIDI messages:', error)
    throw error
  }
}
