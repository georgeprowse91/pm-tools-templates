# Changelog

All notable changes to the Requirements Structuring & Validation CLI are documented here.

## [1.1.0] — 2026-03-11

### Added

- **Phase 0 — Ambiguity Detection**: LLM-powered scanner that flags vague qualifiers, undefined references, missing boundaries, implicit assumptions, and ambiguous business rules *before* structuring begins. Outputs a readiness score (ready / needs_clarification / not_ready) with severity-ranked findings and clarification questions for stakeholders.
  - New `detect <input-file>` CLI command for standalone use
  - Integrated as Phase 0 in the pipeline with review gate — blocks on "not_ready", prompts on "needs_clarification"
  - New prompt template: `prompts/00-detect-ambiguity.md`
  - New module: `src/ambiguity-detector.js`

- **Gherkin/BDD Output**: Deterministic generator that converts test cases into `.feature` files compatible with Cucumber, pytest-bdd, SpecFlow, and other Gherkin frameworks.
  - UCS preconditions → `Background: Given`
  - Actor actions → `When`, system responses → `Then`, postconditions → final `Then`
  - New `generate-gherkin <test-cases-file> --ucs <ucs-file>` CLI command
  - Auto-generated in pipeline after test case generation
  - New module: `src/gherkin-generator.js`

- 10 new unit tests for ambiguity detector and Gherkin generator (29 total)
- Pipeline output now includes Gherkin `.feature` file and ambiguity report artifacts

### Changed

- Pipeline expanded from 5-phase to 6-phase (Phase 0 prepended)
- README rewritten for sprint team audience with full command reference, LLM configuration guide, workflow documentation, and updated project structure

## [1.0.0] — 2026-03-10

### Added

- **Phase 1 — Requirement Structuring**: Convert NL requirements to formal structure per Li & Zheng (2025) Equation 1
- **Phase 2 — UCS Template Generation**: Transform formal structure to Use Case Specifications with basic, alternative, and exception flows
- **Algorithm 1 — Test Case Generation**: Automatically generate test cases from every UCS flow path
- **Algorithms 2 & 3 — Consistency Validation**: Validate UCS against activity diagrams (Rules 1 & 2) and state machines (Rule 3)
- **Feedback Loop**: 3-pass LLM-assisted refinement — gap analysis, coverage expansion, implicit requirement discovery — with interactive human-in-the-loop review
- **Human-Readable Reports**: Markdown summary, use case spec, test cases, and validation reports
- **Multi-Provider LLM Support**: Google Gemini (free tier), Anthropic Claude, OpenAI, and any OpenAI-compatible endpoint (Ollama, Together, Groq, etc.) with auto-detection
- **Full Pipeline**: 5-phase end-to-end workflow with review gates
- 9 CLI commands: `init`, `structure`, `transform`, `generate-tests`, `validate`, `review`, `pipeline`
- 4 JSON schemas for data formats (formal-structure, ucs-template, business-process, state-model)
- 7 LLM prompt templates
- Web Store example data from the paper's GAMMA-J experiment
- 19 unit tests
