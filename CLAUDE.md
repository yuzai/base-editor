# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

`yuzai-base-editor` is a React component library that wraps Monaco Editor into two embeddable widgets:

- `MultiEditor` (`src/multi/`) — a mini-IDE with file tree, tabs, prettier-on-save, theme picker, and an ESLint web worker.
- `Editor` (`src/single/`) — a single-file Monaco editor with controlled/uncontrolled value support.

Public API is the default export of `src/index.ts`. Built output is a UMD bundle in `dist/` with `react`/`react-dom` as externals.

## Commands

```bash
npm run dev         # webpack-dev-server, entry demo/index.ts (serves ./public at /)
npm run build       # library build (webpack.build.js) → dist/index.bundle.js (UMD)
npm run builddemo   # demo site build (webpack.build.demo.js) → build/ (GH Pages)
npm run doc         # typedoc → docs/
```

There are no tests (`npm test` intentionally fails) and no lint script — `.eslintrc` is configured for editor/IDE integration only.

Release flow is driven by `npm version`: `preversion` runs build+doc, `version` regenerates `CHANGELOG.md` via `conventional-changelog` and runs `replace.js` (rewrites old internal git host), `postversion` pushes commits and tags.

## Architecture

### Monaco bootstrap (`src/utils/initEditor.ts`)

Monaco is **not** bundled. `startUp()` is called once from `src/index.ts` and:

1. Injects the Monaco AMD loader script from `cdnjs.cloudflare.com` and requires `vs/editor/editor.main`.
2. Registers Prettier (standalone + parsers) via `window.define` with the same AMD loader.
3. Polls `window.monaco` at 100ms, then runs `configMonaco()`:
   - Loads `onigasm.wasm`, registers extra languages (`JavascriptReact`, `TypescriptReact`, Verilog, SystemVerilog), builds a TextMate registry via `monaco-textmate` and wires it into Monaco with `monaco-editor-textmate` after a 3s delay (so Monaco's own tokenizer can't overwrite it).
   - Fetches theme JSONs from `${ASSETSPATH}themes/<name>.json`, calls `monaco.editor.defineTheme`, and exports theme colors as `--monaco-<key>` CSS variables on `document.documentElement`.
   - `addExtraLib` loads `@types/react` and `@types/react-dom` from `${ASSETSPATH}@types/...` so JSX/TSX gets IntelliSense.

`MultiEditor`/`Editor` components render a spinner while polling `window.monaco`, then mount the real `./Editor` child component.

### Asset path (`_ASSETSPATH`)

All runtime fetches (themes, grammars, wasm, type defs, eslint worker, demo files) go through `ASSETSPATH` in `src/utils/consts.ts`. This value is injected per build by `webpack.DefinePlugin` as `_ASSETSPATH`:

| Build                  | `_ASSETSPATH`                                          |
| ---------------------- | ------------------------------------------------------ |
| `webpack.config.js`    | `'/'` (dev-server serves `public/` at root)            |
| `webpack.build.demo.js`| `'/base-editor/public/'`                               |
| `webpack.build.js`     | `'https://blog.maxiaobo.com.cn//base-editor/public/'`  |

When adding new runtime assets, drop them into `public/` and fetch them with `${ASSETSPATH}...`. Changing where assets live almost always means updating one or more DefinePlugin entries.

### MultiEditor internals (`src/multi/Editor.tsx`)

- Each file path maps to a Monaco `ITextModel` with URI `music:<path>`, created/updated through `createOrUpdateModel` in `src/utils/index.ts`. The file extension is mapped to a language id there — extend that map when adding languages.
- `filesRef` holds the authoritative `path → contents` map; `openedFiles` state drives the tab bar; `editorStatesRef` caches per-path view state (cursor/scroll) and is saved/restored in `restoreModel`.
- The editor's `_codeEditorService.openCodeEditor` is monkey-patched so that "Go to Definition" across files opens a tab instead of a new editor.
- A debounced (500ms) worker message per content change drives lint markers. The worker is built from `public/eslint.worker.js` via `fetch` → `Blob` → `URL.createObjectURL` to avoid cross-origin worker restrictions (see `worker` export in `src/utils/index.ts`).
- Save is `Ctrl/Cmd+S`; it optionally runs `editor.action.formatDocument` (Prettier) before marking the tab saved and writing back to `filesRef`.
- Several file/folder operations use `setTimeout(..., 50)` before creating/deleting models — Monaco throws if model churn happens synchronously. Preserve these delays when refactoring.

### Components

`src/components/` holds the UI primitives used by `MultiEditor` (`filelist`, `openedtab`, `modal`, `select`, `button`, `prettier`, `icons`). Each has a colocated `index.less`. They are consumed via path aliases, not relative paths.

### Path aliases

`@components` → `src/components`, `@utils` → `src/utils`. These are declared in `tsconfig.json`, `jsconfig.json`, and every webpack config's `resolve.alias`. Keep all four in sync when adding aliases. `alias-jsconfig-webpack-plugin` in dev/demo configs reads `jsconfig.json`.

### Ref API

`MultiEditor` exposes `getValue(path)`, `getAllValue()`, `getSupportThemes()`, `setTheme(name)` via `useImperativeHandle` (`MultiRefType`). Extend this interface when adding new imperative operations — the demo in `demo/app.tsx` is the reference usage.

## Notable constraints

- Global `window.monaco` is assumed available in most editor code paths; always guard with the spinner pattern when adding new top-level components.
- `src/single/index.tsx`, `src/single/Editor.tsx`, and webpack configs use `// @ts-nocheck` / `/* eslint-disable */`. Don't propagate this to `src/multi/` or `src/utils/`, which are strictly typed.
- The bundled ESLint worker (`public/eslint.worker.js`) `importScripts` from a hardcoded `https://yuzai.github.io/base-editor/public/eslint.js` URL — local dev needs internet for lint markers.
- `public/` is gitted and shipped; its contents are part of the product, not build artifacts.
