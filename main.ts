import { mkdirSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

// One whole story in at most 32 characters: a proposal over Zoom that
// collapses at the crucial second when the WiFi dies. The 31 characters
// below carry the setup, the characters and the event; the reader fills
// in the rest — did she hear the question? did she say yes?
const STORY = "He Proposed On Zoom. WiFi Died.";
const OUT_PATH = "/output/entry.txt";
const MAX_CHARS = 32;

function countChars(text: string): number {
  // Count Unicode code points, not UTF-16 code units.
  return Array.from(text).length;
}

function ensureOutputDir(path: string): void {
  mkdirSync(dirname(path), { recursive: true });
}

function validateStory(text: string): void {
  const chars = countChars(text);
  if (chars < 1 || chars > MAX_CHARS) {
    throw new Error(
      `story must be 1-${MAX_CHARS} characters, got ${chars}`,
    );
  }
  if (text.trim().length === 0) {
    throw new Error("story must not be only whitespace");
  }
  if (text.endsWith("\n") || text.endsWith("\r")) {
    throw new Error("story must not end with a newline");
  }
  // Must be valid UTF-8: a round-trip through Buffer must be identical.
  if (Buffer.from(text, "utf8").toString("utf8") !== text) {
    throw new Error("story must be valid UTF-8 text");
  }
}

validateStory(STORY);
ensureOutputDir(OUT_PATH);
writeFileSync(OUT_PATH, STORY, "utf8");
