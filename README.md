# Lion ESS Chat

A search-only chatbot for Lion Energy Sanctuary support. It answers **only** from the sourced reference material (the Lion
manuals, the Technical Service Manual and the author's notes), shows the source on every line, and says so when nothing
matches. **There is no AI in it**: it matches your words to passages that already exist, so it cannot make anything up.

This is a fresh start next to the old training website (`../sanctuary-ess`), which is left exactly as it was.

## Run it
- Double-click `Start Sanctuary Chat.bat` (builds the page, starts the server, opens http://localhost:3000).
- Or: `npm install`, then `npm start`. For development run `npm run dev:server` and `npm run dev:web` (the page proxies `/api` to the server).
- `npm test` runs the tests (110 copied from the website for the content and the search, plus the server tests).

By default the server only listens on this computer (`127.0.0.1`). `HOST=0.0.0.0 npm run serve` lets other computers on the
network reach it. There is no login, so do not put it on the open internet without something in front of it (HTTPS and a
password at least). `PORT` changes the port.

## One-file version (no server)
`npm run build:static` builds `dist-static/index.html` and `artifact/index.html`: the whole chatbot in one file. The search is plain
JavaScript, so it runs in the browser with no server and no network. It uses `web/src/api-local.ts` in place of the server calls.
`artifact/index.html` is the form the Artifact tool publishes (a private page on the owner's Claude account, which works from a phone
with nothing running on this PC). Both builds share the same page and a dark-first theme with a light palette for light devices.

## Hosting
The hosted copy runs on GitHub Pages: https://bestbaconaround.github.io/ESS-v2/ (repo `BestBaconAround/ESS-v2`). It is the one-file
build, so there is no server to keep running. It is public and has no password; nothing typed is saved. To update it, push to `main`,
then open Actions > Deploy to GitHub Pages > Run workflow (the workflow is manual, like the website's).

## How it works
- `server/` is a small Node server (no framework): `POST /api/ask {question, revision}`, `GET /api/passage?id=`,
  `GET /api/health`, `GET /api/suggestions`, and it serves the built page from `web/dist`.
  It limits request size (8 KB) and question length (500), limits 60 questions a minute per address, sets security headers, and
  never serves files outside `web/dist`. It does not log or save what people type.
- `server/answer.ts` turns a question into an answer: several fault codes in one question get one answer each, in the order
  typed; one question gets the best passage plus "also relevant" passages; no good match gets an honest "nothing matches".
  Lines are filtered by the revision chosen (Rev 1 to 4, Sanctuary 3, or all).
- `shared/` is **copied** from the website and is read-only here: `shared/content/` (all sourced content) and
  `shared/ask/` (the tokenizer, the search, the corpus builder). Search tests are in `shared/ask/search.test.ts`.
- `web/` is the page (React + Vite): a dark HUD style with one yellow accent, monospace caps and square panels.

## Content edited here since the copy
`shared/content` is now the copy this project maintains. Edits made here that the website's copy does not have (re-apply them if you ever
re-copy):
- 2026-10-08, author decision: communication troubleshooting starts with the cable. `ts-battery-no-comm` now starts with testing or
  replacing the BMS cable, then "make sure the battery voltage is above 51 V". `ts-gen3-battery-comm` now starts with the cable steps
  (check, test, replace) and then the power button and LED checks. The 51 V check was not added to Sanctuary 3: that figure is the
  Sanctuary 2 range and no Sanctuary 3 number is in the sources.

## Rules for the content
- Never invent specs, fault codes or procedures. The chatbot can only say what is in `shared/content`. A gap in the content
  stays a gap; do not paper over it in the server or the page.
- Technical Service Manual wins over older documents and the author's field knowledge; the author's decisions are recorded in
  `../sanctuary-ess/CLAUDE.md`. Public-repo hold-backs (no register-read procedures, no personal contact details) already apply
  to the copied content: keep them.
- To add notes, drop a markdown file in `shared/content/reference/*.md`. Each heading becomes a searchable passage tagged as
  the author's notes. Restart the server.

## Updating the copied content
When the website's content changes, copy `../sanctuary-ess/src/content` over `shared/content` and `src/ask/{tokenize,search,corpus,markdown}.ts`
over `shared/ask/`, then re-apply two small changes and run `npm test`:
1. `corpus.ts`: no `import.meta.glob` (the server reads the markdown files from disk, see `server/knowledge.ts`).
2. In `content.test.ts` and `procedures.test.ts`, the image-file existence checks are removed (the images belong to the website).

## Ideas for next
Follow-up questions that remember the last topic; a "was this useful?" button that writes to a local file; call-notes mode (paste
what the customer said, get the likely entries); a link from each answer to the full entry on the website.
