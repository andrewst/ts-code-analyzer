# Fixture: compiler-edges

Scenario coverage:

- external library imports should not become project graph edges
- local export declarations should not become re-export edges
- wildcard and namespace re-exports should be captured in the export graph
- modules without exports should remain part of the file inventory
