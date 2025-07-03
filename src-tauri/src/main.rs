#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use midir::{Ignore, MidiInput, MidiInputConnection};
use serde::Serialize;
use std::collections::HashMap;
use std::sync::{Arc, Mutex};
use tauri::menu::{MenuBuilder, PredefinedMenuItem};
use tauri::{Emitter, Window, Wry};
use tauri_plugin_updater::UpdaterExt;

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
                                .emit(
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
    let context: tauri::Context<Wry> = tauri::generate_context!();

    tauri::Builder::default()
        .manage(MidiState {
            ..Default::default()
        })
        .invoke_handler(tauri::generate_handler![
            open_midi_connection,
            list_midi_connections
        ])
        .plugin(tauri_plugin_store::Builder::default().build())
        .plugin(tauri_plugin_updater::Builder::new().build())
        .setup(move |app| {
            if cfg!(target_os = "macos") {
                let menu = MenuBuilder::new(app)
                    .item(&PredefinedMenuItem::copy(
                        app,
                        Some(&app.package_info().name),
                    )?)
                    .build()?;

                let _ = app.set_menu(menu);
            }

            let handle = app.handle().clone();
            tauri::async_runtime::spawn(async move {
                let _response = handle.updater().expect("Updater failed").check().await;
            });

            Ok(())
        })
        .run(context)
        .expect("error while running tauri application");
}
