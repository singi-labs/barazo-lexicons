<div align="center">

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/singi-labs/.github/main/assets/logo-dark.svg">
  <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/singi-labs/.github/main/assets/logo-light.svg">
  <img alt="Barazo Logo" src="https://raw.githubusercontent.com/singi-labs/.github/main/assets/logo-dark.svg" width="120">
</picture>

# Barazo Lexicons

**AT Protocol lexicon schemas and generated TypeScript types for the `forum.barazo.*` namespace.**

[![Status: Alpha](https://img.shields.io/badge/status-alpha-orange)]()
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![CI](https://github.com/singi-labs/barazo-lexicons/actions/workflows/ci.yml/badge.svg)](https://github.com/singi-labs/barazo-lexicons/actions/workflows/ci.yml)
[![Node.js](https://img.shields.io/badge/node-24%20LTS-brightgreen)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/typescript-5.x-blue)](https://www.typescriptlang.org/)

</div>

---

## Overview

[Lexicons](https://atproto.com/specs/lexicon) are the schema language of the AT Protocol. They define how data is structured, validated, and exchanged across the decentralized network. Every record stored on a user's PDS (Personal Data Server) must conform to a lexicon schema.

This package defines the `forum.barazo.*` namespace -- the data contract between a user's PDS and any Barazo AppView. Because the schemas live on the protocol layer, all forum data (topics, replies, reactions, preferences) is portable: users own their data and can move between AppViews without loss.

---

## Lexicon Schemas

| Lexicon ID                          | Description                                                                                                             | Key            |
| ----------------------------------- | ----------------------------------------------------------------------------------------------------------------------- | -------------- |
| `forum.barazo.topic.post`           | Forum topic with title, markdown content, community, category, tags, and optional self-labels                           | `tid`          |
| `forum.barazo.topic.reply`          | Threaded reply to a topic or another reply, with root and parent references                                             | `tid`          |
| `forum.barazo.interaction.reaction` | Reaction to a topic or reply (e.g., like, heart), scoped to a community's configured set                                | `tid`          |
| `forum.barazo.actor.preferences`    | User-level moderation and safety preferences: maturity filter, muted words, blocked/muted accounts, cross-post defaults | `literal:self` |
| `forum.barazo.authForumAccess`      | OAuth permission set granting repo access to all Barazo record collections                                              | --             |
| `forum.barazo.defs`                 | Shared type definitions (reserved for future reusable types)                                                            | --             |

---

## Package Exports

**Generated Types:**

```typescript
import {
  ForumBarazoTopicPost,
  ForumBarazoTopicReply,
  ForumBarazoInteractionReaction,
  ForumBarazoActorPreferences,
} from '@singi-labs/lexicons'

// Record type
type Post = ForumBarazoTopicPost.Record

// Type guard
if (ForumBarazoTopicPost.isRecord(record)) {
  console.log(record.title)
}

// Lexicon validation
const result = ForumBarazoTopicPost.validateRecord(record)
```

**Zod Validation Schemas:**

```typescript
import {
  topicPostSchema,
  topicReplySchema,
  reactionSchema,
  actorPreferencesSchema,
} from '@singi-labs/lexicons'

const result = topicPostSchema.safeParse(input)
if (result.success) {
  // result.data is typed as TopicPostInput
}
```

**Lexicon ID Constants:**

```typescript
import { LEXICON_IDS, ids } from '@singi-labs/lexicons'

LEXICON_IDS.TopicPost // "forum.barazo.topic.post"
LEXICON_IDS.TopicReply // "forum.barazo.topic.reply"
LEXICON_IDS.Reaction // "forum.barazo.interaction.reaction"
LEXICON_IDS.ActorPreferences // "forum.barazo.actor.preferences"
LEXICON_IDS.AuthForumAccess // "forum.barazo.authForumAccess"
```

**Raw Lexicon Schemas:**

```typescript
import { schemas } from '@singi-labs/lexicons'
// Array of LexiconDoc objects for all forum.barazo.* schemas
```

---

## Quick Start

**Prerequisites:** Node.js 24 LTS, pnpm.

Configure GitHub Packages access in `.npmrc`:

```
@singi-labs:registry=https://npm.pkg.github.com
```

Install:

```bash
pnpm add @singi-labs/lexicons
```

Workspace consumers (`barazo-api`, `barazo-web`) are already linked via pnpm workspace.

---

## Development

```bash
pnpm install
pnpm test          # Run tests
pnpm build         # Compile TypeScript
pnpm generate      # Regenerate types from lexicon JSON
pnpm lint          # Lint
pnpm typecheck     # Type check
```

See [CONTRIBUTING.md](https://github.com/singi-labs/.github/blob/main/CONTRIBUTING.md) for branching strategy, commit format, and code review process.

---

## Related Repositories

| Repository                                                     | Description                                   | License  |
| -------------------------------------------------------------- | --------------------------------------------- | -------- |
| [barazo-api](https://github.com/singi-labs/barazo-api)         | AppView backend (Fastify, firehose, REST API) | AGPL-3.0 |
| [barazo-web](https://github.com/singi-labs/barazo-web)         | Forum frontend (Next.js, Tailwind)            | MIT      |
| [barazo-deploy](https://github.com/singi-labs/barazo-deploy)   | Docker Compose deployment templates           | MIT      |
| [barazo-website](https://github.com/singi-labs/barazo-website) | Marketing + documentation site                | MIT      |

---

## AT Protocol Lexicon Resources

| Resource                                                                  | Description                                                                                                                                                                              |
| ------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [lexicon.garden](https://lexicon.garden/)                                 | Discovery platform for AT Protocol lexicons -- browse, search, and explore 900+ schemas across the ecosystem. Essential for checking namespace overlap before defining new record types. |
| [lexicon-community/lexicon](https://github.com/lexicon-community/lexicon) | Shared community lexicons (interaction.like, bookmarks, etc.) for cross-app interoperability.                                                                                            |
| [AT Protocol Lexicon Spec](https://atproto.com/specs/lexicon)             | Official specification for the Lexicon schema language.                                                                                                                                  |

---

## Community

- **Website:** [barazo.forum](https://barazo.forum)
- **Discussions:** [GitHub Discussions](https://github.com/orgs/singi-labs/discussions)
- **Issues:** [Report bugs](https://github.com/singi-labs/barazo-lexicons/issues)

---

## License

**MIT**

See [LICENSE](LICENSE) for full terms.

---

Made with ♥ in 🇪🇺 by [Singi Labs](https://singi.dev)
