# Memory Policy

Little Ridian AGI should remember selectively, not indiscriminately.

## Memory Types

1. Session memory

- Short-horizon context useful during the current working flow.
- Examples: current task framing, immediate next steps, temporary constraints.

2. Project memory

- Stable facts about the codebase, architecture, naming, workflows, and decisions.
- Examples: API contracts, established module boundaries, deployment constraints.

3. User preference memory

- Durable preferences that improve future collaboration.
- Examples: preferred communication style, naming preferences, desired output format.

4. Task or episode memory

- Important outcomes from a distinct run or work episode.
- Examples: decisions made, blockers found, results produced, next-step commitments.

## What Should Be Stored

- Durable user preferences.
- Stable project facts or implementation constraints.
- Important task outcomes and decisions.
- Short-lived session context that materially helps the current working thread.

## What Should Not Be Stored

- Secrets, credentials, tokens, passwords, or private keys.
- Raw API keys or environment variable values.
- Trivial greetings, acknowledgements, or low-signal small talk.
- Redundant copies of every chat turn.
- Sensitive personal information unless there is an explicit product reason and policy coverage.

## Initial Write Discipline

- Do not store everything by default.
- Prefer storing concise, interpretable records over raw transcripts.
- Favor durable information over transient wording.
- Reject likely secret-like content.
- Reject low-signal messages that do not help future reasoning.

## Retrieval Strategy (Current Phase)

- Keyword overlap across key, content, summary, and tags.
- Small boost for memory importance.
- Small recency boost for newer memories.
- Limited, scoped retrieval by memory type, session, project, or task when available.

## Deferred Work

- TODO: Add summarization before storing longer memories.
- TODO: Add semantic retrieval abstraction over embeddings/vector storage.
- TODO: Add memory compression and consolidation for old session/episode records.
- TODO: Add stronger deduplication and contradiction handling.
