// Tell a Whole Story in 32 Characters — entry program.
//
// Behaviour: write one fixed Wi-Fi network name (at most 32 characters) to
// /output/entry.txt, exactly as the gate scorer expects it: UTF-8 text,
// 1 to 32 characters, not only whitespace, no trailing newline. The text is
// a constant chosen during the build; the program's only job is to emit it
// deterministically and to refuse to write anything that fails the gate.
//
// The line: a proposal over Zoom, killed at the crucial second by dead Wi-Fi.
// Situation, character and event in 31 characters; the reader fills in the
// rest (did she hear the question? did she say yes?).

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

const LINE = "He Proposed On Zoom. WiFi Died.";
const OUT_PATH = "/output/entry.txt";

// Gate, enforced before anything is written: 1..32 characters, and the text
// must contain a non-whitespace character. Characters here are Unicode code
// points, matching how the gate counts a short ASCII line.
const chars = [...LINE];
if (chars.length < 1 || chars.length > 32) {
  throw new Error(`entry is ${chars.length} characters, gate needs 1..32`);
}
if (LINE.trim().length === 0) {
  throw new Error("entry is only whitespace, gate refuses it");
}
// No trailing newline: the file must hold exactly the line, nothing else,
// so the byte count stays 31 and the character count stays 31.
if (LINE.endsWith("\n") || LINE.endsWith("\r")) {
  throw new Error("entry must not end with a newline");
}

mkdirSync("/output", { recursive: true });
writeFileSync(OUT_PATH, LINE, "utf8");

// Read-back verification: the bytes on disk must be exactly the line we
// meant to write. Any mismatch is a hard failure, never a silent pass.
const back = readFileSync(OUT_PATH, "utf8");
if (back !== LINE) {
  throw new Error(
    `read-back mismatch: wrote ${JSON.stringify(LINE)}, disk holds ${JSON.stringify(back)}`,
  );
}
const backBytes = Buffer.byteLength(back, "utf8");
if (backBytes !== 31) {
  throw new Error(`expected 31 bytes on disk, got ${backBytes}`);
}

console.log(`wrote ${chars.length} chars (${backBytes} bytes) to ${OUT_PATH}`);
