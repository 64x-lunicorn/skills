import { expectOneCasePerScenario } from "./spec-coverage.ts";

/**
 * The scenarios of Spec #26, verbatim (ticket #47's acceptance criteria, identical to the Spec's);
 * each runs as an eval case, spread across the `evals/<skill>/` directory of whichever skill the
 * scenario observes.
 */
const SCENARIOS = [
  "An issue waiting for triage is examined",
  "Unlabelled issues wait for triage too",
  "A reporter reply brings an issue back into triage",
  "An issue without a reporter reply stays out of triage",
  "Missing information is asked from the reporter",
  "Triage routes by kind of change",
  "An earlier rejection is found before Daniel is asked",
  "A rejected or parked research object counts as an earlier rejection",
  "A rejected issue is closed with a visible reason",
  "A duplicate is closed with a link",
  "Broken behaviour is diagnosed before a bugfix exists",
  "Diagnosis changes nothing",
  "Diagnosis stops without a command that shows the bug",
  "Seams are proposed and confirmed before the issue is written",
  "A bugfix issue is separate from the Bug and linked both ways",
  "A bugfix scenario is red on today's code",
  "A Bug closes once its bugfix is merged",
  "A Bug stays open while its bugfix is unmerged",
  "Daniel files his own bug directly",
  "Work without behaviour change becomes a Spec-less task",
  "Spec-less task scenarios are green before the change",
  "Spec-less task scenarios stay green after the change",
  "A bugfix is implemented red then green",
  "A bugfix or Spec-less task needs no Spec, architecture issue or wayfinder",
  "A bugfix or Spec-less task is reviewed against its own contract",
  "New domain behaviour is sent to a Spec",
  "An unclear idea is sent to research",
  "A spike is sent to research",
  "Comments on a reporter's issue name their writer",
  "Internal issues carry no writer line",
  "The label set stays closed",
  "Dependency updates get no issue",
  "Local issue files have no triage statuses",
];

expectOneCasePerScenario(26, SCENARIOS);
