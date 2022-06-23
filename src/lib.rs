mod utils;

use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn add(a: u32, b: u32) -> u32 {
    a + b
}

#[wasm_bindgen]
pub fn return_string() -> String {
    "lto".to_string()
}

#[wasm_bindgen]
pub fn concat_string(name: String) -> String {
    format!("hello {:?}", name).into()
}
