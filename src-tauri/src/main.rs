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
  let midi_in = MidiInput::new("piano-trainer-input");
  match midi_in {
    Ok(midi_in) => {
      let mut midi_connections = HashMap::new();
      for (i, p) in midi_in.ports().iter().enumerate() {
        let port_name = midi_in.port_name(p);
        match port_name {
          Ok(port_name) => {
            midi_connections.insert(i, port_name);
          }
          Err(e) => {
            println!("Error getting port name: {}", e);
          }
        }
      }
      midi_connections
    }
    Err(_) => HashMap::new(),
  }
}

#[tauri::command]
fn open_midi_connection(
  midi_state: tauri::State<'_, MidiState>,
  window: Window<Wry>,
  input_idx: usize,
) {
  let handle = Arc::new(window).clone();
  let midi_in = MidiInput::new("piano-trainer-input");
  match midi_in {
    Ok(mut midi_in) => {
      midi_in.ignore(Ignore::None);
      let midi_in_ports = midi_in.ports();
      let port = midi_in_ports.get(input_idx);
      match port {
        Some(port) => {
          let midi_in_conn = midi_in.connect(
            port,
            "midir",
            move |_, message, _| {
              handle
                .emit_all(
                  "midi_message",
                  MidiMessage {
                    message: message.to_vec(),
                  },
                )
                .map_err(|e| {
                  println!("Error sending midi message: {}", e);
                })
                .ok();
            },
            (),
          );
          match midi_in_conn {
            Ok(midi_in_conn) => {
              midi_state.input.lock().unwrap().replace(midi_in_conn);
            }
            Err(e) => {
              println!("Error: {}", e);
            }
          }
        }
        None => {
          println!("No port found at index {}", input_idx);
        }
      }
    }
    Err(e) => println!("Error: {}", e),
  }
}

fn main() {
  let context = tauri::generate_context!();
  sentry_tauri::init(
    sentry::release_name!(),
    |_| {
      sentry::init((
        "https://36cfcf5f635d48d9bb4209bfcf05667e@o1312215.ingest.sentry.io/6561276",
        sentry::ClientOptions {
          release: sentry::release_name!(),
          ..Default::default()
        },
      ))
    },
    |sentry_plugin| {
      tauri::Builder::default()
        .plugin(PluginBuilder::default().build())
        .plugin(sentry_plugin)
        .manage(MidiState {
          ..Default::default()
        })
        .invoke_handler(tauri::generate_handler![
          open_midi_connection,
          list_midi_connections
        ])
        .menu(if cfg!(target_os = "macos") {
          tauri::Menu::os_default(&context.package_info().name)
        } else {
          tauri::Menu::default()
        })
        .run(context)
        .expect("error while running tauri application");
    },
  )
}
