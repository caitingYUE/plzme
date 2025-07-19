const fs = require('fs');
const path = require('path');
const ScriptGenerator = require('./utils/script-generator');

const SCRIPT_DIR = path.join(__dirname, 'assets/scripts_list');
const OUTPUT_FILE = path.join(__dirname, 'cover_prompts.json');
const SCRIPT_PREFIX = 'script_';
const SCRIPT_SUFFIX = '.md';
const START_INDEX = 1;
const END_INDEX = 40;

let coverPrompts = {};
if (fs.existsSync(OUTPUT_FILE)) {
  try {
    coverPrompts = JSON.parse(fs.readFileSync(OUTPUT_FILE, 'utf-8'));
  } catch (e) {
    coverPrompts = {};
  }
}

const generator = new ScriptGenerator();

(async () => {
  for (let i = START_INDEX; i <= END_INDEX; i++) {
    const id = SCRIPT_PREFIX + String(i).padStart(3, '0');
    const file = path.join(SCRIPT_DIR, `${id}${SCRIPT_SUFFIX}`);
    if (!fs.existsSync(file)) continue;
    if (coverPrompts[id]) continue;
    const content = fs.readFileSync(file, 'utf-8');
    const info = await generator.generateScriptFromMD(content, id);
    if (!info) continue;
    coverPrompts[id] = info.imagePrompt;
    console.log(`生成：${id}`);
  }
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(coverPrompts, null, 2), 'utf-8');
  console.log('全部生成完毕，已写入', OUTPUT_FILE);
})();
