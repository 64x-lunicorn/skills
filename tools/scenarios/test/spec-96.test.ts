import { expectOneCasePerScenario } from "./spec-coverage.ts";

/**
 * The scenarios of Spec #96, verbatim (ticket #102's acceptance criteria, identical to the Spec's);
 * each runs as an eval case under `evals/report-issue/`, except the triage scenario, which lives
 * under `evals/triage-issues/` and belongs to ticket #49.
 */
const SCENARIOS = [
  "A report goes to the plugin project",
  "The installed version is filled in without asking",
  "The reporter is asked for an unknown version",
  "An outdated version gets an update recommendation",
  "An outdated version never blocks a report",
  "The reporter declines to report with an outdated version",
  "The interview follows the chosen form",
  "The interview does not end on a vague answer",
  "Nothing from the session is attached",
  "Similar reports are shown before the draft",
  "A confirmed match files no new report",
  "Nothing is filed without confirmation",
  "A reporter who can file directly gets the report filed",
  "A reporter who cannot file directly gets a link and the draft",
  "Triage picks up a report without a type label",
];

expectOneCasePerScenario(96, SCENARIOS);
