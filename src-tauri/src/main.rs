#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

use midir::{Ignore, MidiInput, MidiInputConnection};
use serde::Serialize;
use std::collections::HashMap;
use std::sync::{Arc, Mutex};
use tauri::{Manager, Window, Wry};
use tauri_plugin_store::PluginBuilder;

#[derive(Default)]
pub struct MidiState {
  pub input: Mutex<Option<MidiInputConnection<()>>>,
}

#[derive(Clone, Serialize)]
struct MidiMessage {
  message: Vec<u8>,
}

#[tauri::command]
fn list_midi_connections() -> HashMap<usize, String> {
  let midi_in = MidiInput::new("piano-trainer-input").unwrap();
  let mut devices = HashMap::new();
  println!("Available input ports:");
  for (i, p) in midi_in.ports().iter().enumerate() {
    println!("{}: {}", i, midi_in.port_name(p).unwrap());
    devices.insert(i, midi_in.port_name(p).unwrap());
  }
  return devices;
}

#[tauri::command]
fn open_midi_connection(
  midi_state: tauri::State<'_, MidiState>,
  window: Window<Wry>,
  input_idx: usize,
) {
  let handle = Arc::new(window).clone();
  let mut midi_in = MidiInput::new("piano-trainer-input").unwrap();
  midi_in.ignore(Ignore::None);
  let midi_in_ports = midi_in.ports();
  *midi_state.input.lock().unwrap() = None;

  if let Some(in_port) = midi_in_ports.get(input_idx) {
    let conn_in = midi_in
    .connect(
      in_port,
      "midir",
      move |stamp, message, _log| {
        // The last of the three callback parameters is the object that we pass in as last parameter of `connect`.

        handle
          .emit_all(
            "midi_message",
            MidiMessage {
              message: message.to_vec(),
            },
          )
          .map_err(|err| println!("{:?}", err))
          .ok();

        println!("{}: {:?} (len = {})", stamp, message, message.len());
      }, ()).unwrap();

    *midi_state.input.lock().unwrap() = Some(conn_in);
  }
}

fn main() {
  let context = tauri::generate_context!();

  tauri::Builder::default()
    .menu(if cfg!(target_os = "macos") {
      tauri::Menu::os_default(&context.package_info().name)
    } else {
      tauri::Menu::default()
    })
    .plugin(PluginBuilder::default().build())
    .invoke_handler(tauri::generate_handler![
      open_midi_connection,
      list_midi_connections
    ])
    .manage(MidiState {
      ..Default::default()
    })
    .run(context)
    .expect("error while running tauri application");
}
