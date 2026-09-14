# Runtime templates

Read when filling `<<runs_on>>`, `<<setup_steps>>` and `<<dependabot_stack>>`. One section per `ci.runtime.stack`. Values in `<<…>>` come from `ci.runtime`; the snippets already quote them, so insert the bare value. Pins verified 2026-09-14.

## node

Marker: `runtime: { stack: node, node: "<version>" }`

Runner: `ubuntu-24.04`

```yaml
      - uses: actions/setup-node@820762786026740c76f36085b0efc47a31fe5020 # v7.0.0
        with:
          node-version: "<<node>>"
          cache: npm

      - name: Install dependencies
        run: npm ci
```

Dependabot:

```yaml
  - package-ecosystem: npm
    directory: /
    schedule:
      interval: weekly
      day: monday
      time: "06:00"
      timezone: Europe/Berlin
    open-pull-requests-limit: 5
    cooldown:
      default-days: 7
    labels:
      - dependencies
```

## elixir

Marker, with a version file: `runtime: { stack: elixir, version_file: .tool-versions }`
Marker, with explicit versions: `runtime: { stack: elixir, elixir: "<version>", otp: "<version>" }`

Runner: `ubuntu-24.04`

With a version file:

```yaml
      - uses: erlef/setup-beam@54075bcc5e249e4758d363f27d099f55d843f124 # v1.24.1
        with:
          version-file: "<<version_file>>"
          version-type: strict

      - name: Fetch dependencies
        run: mix deps.get --check-locked
```

With explicit versions:

```yaml
      - uses: erlef/setup-beam@54075bcc5e249e4758d363f27d099f55d843f124 # v1.24.1
        with:
          elixir-version: "<<elixir>>"
          otp-version: "<<otp>>"
          version-type: strict

      - name: Fetch dependencies
        run: mix deps.get --check-locked
```

Dependabot:

```yaml
  - package-ecosystem: mix
    directory: /
    schedule:
      interval: weekly
      day: monday
      time: "06:00"
      timezone: Europe/Berlin
    open-pull-requests-limit: 5
    cooldown:
      default-days: 7
    labels:
      - dependencies
```

## swift

Marker: `runtime: { stack: swift, xcode: "<version>" }`

Runner: `macos-15`

```yaml
      - uses: maxim-lobanov/setup-xcode@ed7a3b1fda3918c0306d1b724322adc0b8cc0a90 # v1.7.0
        with:
          xcode-version: "<<xcode>>"
```

Dependabot, only when `Package.swift` exists at the root:

```yaml
  - package-ecosystem: swift
    directory: /
    schedule:
      interval: weekly
      day: monday
      time: "06:00"
      timezone: Europe/Berlin
    open-pull-requests-limit: 5
    cooldown:
      default-days: 7
    labels:
      - dependencies
```

## cpp-qt

Marker: `runtime: { stack: cpp-qt, cmake: "<version>", qt: "<version>", qt_modules: "<space-separated modules, or empty>" }`

Runner: `ubuntu-24.04`

```yaml
      - uses: lukka/get-cmake@fffaaafeea488556c2c12dad60690008bc1caacb # v4.4.2
        with:
          cmakeVersion: "<<cmake>>"

      - uses: jurplel/install-qt-action@48d3ad6db93f3627c8ee7a0454bc6f3744f7e730 # v4.3.1
        with:
          version: "<<qt>>"
          modules: "<<qt_modules>>"
          cache: "true"
```

Dependabot: none. Dependabot has no ecosystem for CMake; name it as a gap.
