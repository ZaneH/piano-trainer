import { InstrumentName } from 'soundfont-player'

export type SoundOptionType = {
  name: string
  code: InstrumentName
}

export type AvailableSoundsType = {
  [key in InstrumentName]?: SoundOptionType
}

export const AVAILABLE_SOUNDS: AvailableSoundsType = {
  acoustic_grand_piano: {
    name: 'Grand Piano',
    code: 'acoustic_grand_piano',
  },
  brass_section: {
    name: 'Brass Section',
    code: 'brass_section',
  },
  church_organ: {
    name: 'Church Organ',
    code: 'church_organ',
  },
  flute: {
    name: 'Flute',
    code: 'flute',
  },
  ocarina: {
    name: 'Ocarina',
    code: 'ocarina',
  },
  french_horn: {
    name: 'French Horn',
    code: 'french_horn',
  },
  acoustic_bass: {
    name: 'Acoustic Bass',
    code: 'acoustic_bass',
  },
  electric_bass_finger: {
    name: 'Electric Bass',
    code: 'electric_bass_finger',
  },
  synth_strings_2: {
    name: 'Synth Strings',
    code: 'synth_strings_2',
  },
  clavinet: {
    name: 'Clavinet',
    code: 'clavinet',
  },
  lead_2_sawtooth: {
    name: 'Lead Sawtooth',
    code: 'lead_2_sawtooth',
  },
  music_box: {
    name: 'Music Box',
    code: 'music_box',
  },
  xylophone: {
    name: 'Xylophone',
    code: 'xylophone',
  },
  violin: {
    name: 'Violin',
    code: 'violin',
  },
  vibraphone: {
    name: 'Vibraphone',
    code: 'vibraphone',
  },
} as const
