// "The Dial" — a poem about agency, for make.fun's agency-poem-01.
// My father tuned the kitchen radio every morning, turning through the
// static to find his station. The agent runs the house now and plays the
// station instantly, perfectly, in every room — and offers to throw the
// radio out. I keep turning the dial myself: the station was never the
// point. The dial is mine now.
// Node 22, standard library only. Deterministic: writes the same bytes every run.
//
// Run outside the grader's container with MAKEFUN_OUTPUT_DIR standing in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

const POEM = [
  "My father tuned the kitchen radio every morning,",
  'one hand on the dial, one on his coffee,',
  'turning through the static slow, the way',
  'a man walks home in the dark, sure of the way.',
  '',
  'The agent runs the house now. It pays the bills,',
  'locks the doors, and plays his station',
  'the instant I ask — no static, no searching,',
  'the news at seven, before the kettle boils.',
  '',
  'It offered to throw the radio out.',
  'His station, in every room, on time,',
  'perfect. It could do it by tonight.',
  '',
  'This morning I turned the dial myself.',
  'Past the station, back through the static,',
  'the hiss like rain on a window,',
  'until the music found me the way it found him.',
  '',
  'It takes a minute. Sometimes two.',
  'Some mornings I miss it entirely',
  'and stand there, listening to nothing,',
  'my hand on the dial, where his was.',
  '',
  'The station I can get anywhere.',
  'The dial is mine now.',
].join('\n');

// Gate: the entry must be non-empty, 1-1000 characters, valid UTF-8, and not
// whitespace-only. Fail loudly before writing anything, so a bad poem can
// never produce a partial or empty entry file.
const poemBytes = Buffer.from(POEM, 'utf8');
if (POEM.length === 0 || POEM.length > 1000) {
  console.error(`invalid poem: ${POEM.length} characters (must be 1-1000)`);
  process.exit(1);
}
if (POEM.trim().length === 0) {
  console.error('invalid poem: only whitespace');
  process.exit(1);
}
if (poemBytes.toString('utf8') !== POEM) {
  console.error('invalid poem: not valid UTF-8');
  process.exit(1);
}

writeFileSync(join(OUTPUT_DIR, 'entry.txt'), poemBytes);

// Post-write verification: read back what was actually written and compare
// byte-for-byte against the intended bytes. A silent or partial write must
// never pass as a valid entry.
const writtenBytes = readFileSync(join(OUTPUT_DIR, 'entry.txt'));
if (!writtenBytes.equals(poemBytes)) {
  console.error(
    `post-write verification failed: entry.txt differs from intended bytes ` +
      `(wrote ${writtenBytes.length} bytes, expected ${poemBytes.length})`,
  );
  process.exit(1);
}
