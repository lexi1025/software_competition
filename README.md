# Equipment Maintenance Agent

This repository contains the competition project skeleton for a multimodal
equipment maintenance knowledge retrieval and work guidance system.

## Layout

- `backend/`: FastAPI service, retrieval pipeline, and agent harness.
- `frontend/`: Vite + React client for query, evidence, and SOP views.
- `data/`: raw manuals, processed outputs, indexes, and runtime uploads.
- `docs/`: project docs, architecture notes, and delivery artifacts.

## First implementation target

1. Register the maintenance manual PDF.
2. Parse the PDF into page-level chunks.
3. Build a searchable index.
4. Ask a fault question and return evidence with page references.

## Manual asset

The competition manual is already present in the repo root:

- `./摩托车发动机维修手册.pdf`

Move or copy it into `data/raw/manuals/` when you wire up the parser.

