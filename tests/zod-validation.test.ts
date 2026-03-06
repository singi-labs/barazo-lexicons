import { describe, it, expect } from 'vitest'
import {
  topicPostSchema,
  topicReplySchema,
  reactionSchema,
  voteSchema,
  actorPreferencesSchema,
  communityRefSchema,
  actorSignatureSchema,
} from '../src/validation/index.js'

const VALID_DID = 'did:plc:abc123def456'
const VALID_DATETIME = '2026-02-12T10:00:00.000Z'
const VALID_STRONG_REF = {
  uri: 'at://did:plc:abc123/forum.barazo.topic.post/3jzfcijpj2z2a',
  cid: 'bafyreibouvacvqhc2vkwwtdkfynpcaoatmkde7uhrw47ne4gu63cnzc7yq',
}

describe('topicPostSchema', () => {
  const validPost = {
    title: 'Test Topic',
    content: 'This is a test topic body.',
    community: VALID_DID,
    category: 'general',
    createdAt: VALID_DATETIME,
  }

  it('accepts a valid minimal post', () => {
    expect(topicPostSchema.safeParse(validPost).success).toBe(true)
  })

  it('accepts a post with all optional fields', () => {
    const full = {
      ...validPost,
      contentFormat: 'markdown' as const,
      tags: ['test', 'poc'],
      facets: [
        {
          index: { byteStart: 0, byteEnd: 5 },
          features: [{ $type: 'app.bsky.richtext.facet#mention', did: 'did:plc:abc123' }],
        },
      ],
      langs: ['en', 'nl'],
      labels: { values: [{ val: 'sexual' }] },
    }
    expect(topicPostSchema.safeParse(full).success).toBe(true)
  })

  it('rejects empty title', () => {
    expect(topicPostSchema.safeParse({ ...validPost, title: '' }).success).toBe(false)
  })

  it('rejects title exceeding maxLength (2000 bytes)', () => {
    const longTitle = 'x'.repeat(2001)
    expect(topicPostSchema.safeParse({ ...validPost, title: longTitle }).success).toBe(false)
  })

  it('rejects empty content', () => {
    expect(topicPostSchema.safeParse({ ...validPost, content: '' }).success).toBe(false)
  })

  it('rejects content exceeding maxLength (100000)', () => {
    const longContent = 'x'.repeat(100_001)
    expect(topicPostSchema.safeParse({ ...validPost, content: longContent }).success).toBe(false)
  })

  it('rejects invalid DID format for community', () => {
    expect(topicPostSchema.safeParse({ ...validPost, community: 'not-a-did' }).success).toBe(false)
  })

  it('rejects more than 25 tags', () => {
    const tooManyTags = {
      ...validPost,
      tags: Array.from({ length: 26 }, (_, i) => `tag-${String(i)}`),
    }
    expect(topicPostSchema.safeParse(tooManyTags).success).toBe(false)
  })

  it('rejects empty tag strings', () => {
    expect(topicPostSchema.safeParse({ ...validPost, tags: [''] }).success).toBe(false)
  })

  it('rejects invalid datetime format', () => {
    expect(topicPostSchema.safeParse({ ...validPost, createdAt: 'not-a-date' }).success).toBe(false)
  })

  it('rejects empty category', () => {
    expect(topicPostSchema.safeParse({ ...validPost, category: '' }).success).toBe(false)
  })

  it('accepts valid record-key category values', () => {
    for (const key of ['general', 'my-category', 'v1.0', 'test_key', 'a:b']) {
      expect(topicPostSchema.safeParse({ ...validPost, category: key }).success).toBe(true)
    }
  })

  it('rejects invalid record-key category values', () => {
    for (const key of ['.', '..', 'has space', 'has/slash', 'has@at']) {
      expect(topicPostSchema.safeParse({ ...validPost, category: key }).success).toBe(false)
    }
  })

  it('rejects missing required fields', () => {
    expect(topicPostSchema.safeParse({}).success).toBe(false)
    expect(topicPostSchema.safeParse({ title: 'Test' }).success).toBe(false)
  })

  it('rejects invalid contentFormat', () => {
    expect(topicPostSchema.safeParse({ ...validPost, contentFormat: 'html' }).success).toBe(false)
  })

  it('accepts post with facets', () => {
    const withFacets = {
      ...validPost,
      facets: [
        {
          index: { byteStart: 0, byteEnd: 10 },
          features: [{ $type: 'app.bsky.richtext.facet#link', uri: 'https://example.com' }],
        },
      ],
    }
    expect(topicPostSchema.safeParse(withFacets).success).toBe(true)
  })

  it('rejects facets with invalid byteSlice', () => {
    const badFacets = {
      ...validPost,
      facets: [{ index: { byteStart: -1, byteEnd: 5 }, features: [{ $type: 'test' }] }],
    }
    expect(topicPostSchema.safeParse(badFacets).success).toBe(false)
  })

  it('accepts post with langs', () => {
    const withLangs = { ...validPost, langs: ['en', 'nl'] }
    expect(topicPostSchema.safeParse(withLangs).success).toBe(true)
  })

  it('rejects more than 3 langs', () => {
    const tooManyLangs = { ...validPost, langs: ['en', 'nl', 'de', 'fr'] }
    expect(topicPostSchema.safeParse(tooManyLangs).success).toBe(false)
  })

  it('rejects labels with more than 10 values', () => {
    const tooManyLabels = {
      ...validPost,
      labels: {
        values: Array.from({ length: 11 }, (_, i) => ({ val: `label-${String(i)}` })),
      },
    }
    expect(topicPostSchema.safeParse(tooManyLabels).success).toBe(false)
  })
})

describe('topicReplySchema', () => {
  const validReply = {
    content: 'This is a reply.',
    root: VALID_STRONG_REF,
    parent: VALID_STRONG_REF,
    community: VALID_DID,
    createdAt: VALID_DATETIME,
  }

  it('accepts a valid reply', () => {
    expect(topicReplySchema.safeParse(validReply).success).toBe(true)
  })

  it('rejects missing root', () => {
    const { root: _, ...noRoot } = validReply
    expect(topicReplySchema.safeParse(noRoot).success).toBe(false)
  })

  it('rejects missing parent', () => {
    const { parent: _, ...noParent } = validReply
    expect(topicReplySchema.safeParse(noParent).success).toBe(false)
  })

  it('rejects invalid strongRef (missing cid)', () => {
    expect(
      topicReplySchema.safeParse({
        ...validReply,
        root: { uri: 'at://did:plc:abc/test/123' },
      }).success
    ).toBe(false)
  })

  it('rejects content exceeding 50000 bytes', () => {
    expect(
      topicReplySchema.safeParse({
        ...validReply,
        content: 'x'.repeat(50_001),
      }).success
    ).toBe(false)
  })
})

describe('reactionSchema', () => {
  const validReaction = {
    subject: VALID_STRONG_REF,
    type: 'like',
    community: VALID_DID,
    createdAt: VALID_DATETIME,
  }

  it('accepts a valid reaction', () => {
    expect(reactionSchema.safeParse(validReaction).success).toBe(true)
  })

  it('rejects empty type string', () => {
    expect(reactionSchema.safeParse({ ...validReaction, type: '' }).success).toBe(false)
  })

  it('rejects type exceeding 300 bytes', () => {
    expect(reactionSchema.safeParse({ ...validReaction, type: 'x'.repeat(301) }).success).toBe(
      false
    )
  })

  it('accepts known token values', () => {
    for (const type of [
      'forum.barazo.interaction.reaction#like',
      'forum.barazo.interaction.reaction#heart',
      'forum.barazo.interaction.reaction#thumbsup',
    ]) {
      expect(reactionSchema.safeParse({ ...validReaction, type }).success).toBe(true)
    }
  })

  it('accepts custom reaction type values (knownValues is open)', () => {
    expect(
      reactionSchema.safeParse({ ...validReaction, type: 'custom-community-reaction' }).success
    ).toBe(true)
  })

  it('rejects invalid subject (not a strongRef)', () => {
    expect(
      reactionSchema.safeParse({
        ...validReaction,
        subject: { uri: 'not-an-at-uri', cid: 'test' },
      }).success
    ).toBe(false)
  })
})

describe('voteSchema', () => {
  const validVote = {
    subject: VALID_STRONG_REF,
    direction: 'up',
    community: VALID_DID,
    createdAt: VALID_DATETIME,
  }

  it('accepts a valid vote', () => {
    expect(voteSchema.safeParse(validVote).success).toBe(true)
  })

  it('accepts custom direction values (knownValues is open)', () => {
    expect(voteSchema.safeParse({ ...validVote, direction: 'down' }).success).toBe(true)
  })

  it('rejects empty direction string', () => {
    expect(voteSchema.safeParse({ ...validVote, direction: '' }).success).toBe(false)
  })

  it('rejects invalid subject (not a strongRef)', () => {
    expect(
      voteSchema.safeParse({
        ...validVote,
        subject: { uri: 'not-an-at-uri', cid: 'test' },
      }).success
    ).toBe(false)
  })

  it('rejects invalid community DID', () => {
    expect(voteSchema.safeParse({ ...validVote, community: 'not-a-did' }).success).toBe(false)
  })

  it('rejects missing required fields', () => {
    expect(voteSchema.safeParse({}).success).toBe(false)
    expect(voteSchema.safeParse({ subject: VALID_STRONG_REF }).success).toBe(false)
  })
})

describe('actorPreferencesSchema', () => {
  const validPrefs = {
    maturityLevel: 'safe' as const,
    updatedAt: VALID_DATETIME,
  }

  it('accepts valid minimal preferences', () => {
    expect(actorPreferencesSchema.safeParse(validPrefs).success).toBe(true)
  })

  it('accepts all maturity levels', () => {
    for (const level of ['safe', 'mature', 'all']) {
      expect(
        actorPreferencesSchema.safeParse({
          ...validPrefs,
          maturityLevel: level,
        }).success
      ).toBe(true)
    }
  })

  it('rejects invalid maturity level', () => {
    expect(
      actorPreferencesSchema.safeParse({
        ...validPrefs,
        maturityLevel: 'extreme',
      }).success
    ).toBe(false)
  })

  it('accepts preferences with all optional fields', () => {
    const full = {
      ...validPrefs,
      mutedWords: ['spam', 'crypto'],
      blockedDids: [VALID_DID],
      mutedDids: [VALID_DID],
      crossPostDefaults: { bluesky: true, frontpage: false },
    }
    expect(actorPreferencesSchema.safeParse(full).success).toBe(true)
  })

  it('rejects more than 100 muted words', () => {
    const tooMany = {
      ...validPrefs,
      mutedWords: Array.from({ length: 101 }, (_, i) => `word-${String(i)}`),
    }
    expect(actorPreferencesSchema.safeParse(tooMany).success).toBe(false)
  })

  it('rejects more than 1000 blocked DIDs', () => {
    const tooMany = {
      ...validPrefs,
      blockedDids: Array.from({ length: 1001 }, (_, i) => `did:plc:blocked${String(i)}`),
    }
    expect(actorPreferencesSchema.safeParse(tooMany).success).toBe(false)
  })

  it('rejects invalid DID in blockedDids', () => {
    expect(
      actorPreferencesSchema.safeParse({
        ...validPrefs,
        blockedDids: ['not-a-did'],
      }).success
    ).toBe(false)
  })
})

describe('communityRefSchema', () => {
  it('accepts a valid community reference', () => {
    expect(communityRefSchema.safeParse({ did: VALID_DID }).success).toBe(true)
  })

  it('rejects invalid DID format', () => {
    expect(communityRefSchema.safeParse({ did: 'not-a-did' }).success).toBe(false)
  })

  it('rejects missing did field', () => {
    expect(communityRefSchema.safeParse({}).success).toBe(false)
  })
})

describe('actorSignatureSchema', () => {
  it('validates a valid signature', () => {
    const result = actorSignatureSchema.safeParse({
      text: 'Building forums for the open web',
      createdAt: '2026-03-04T12:00:00.000Z',
    })
    expect(result.success).toBe(true)
  })

  it('rejects empty text', () => {
    const result = actorSignatureSchema.safeParse({
      text: '',
      createdAt: '2026-03-04T12:00:00.000Z',
    })
    expect(result.success).toBe(false)
  })

  it('rejects text exceeding 3000 bytes', () => {
    const result = actorSignatureSchema.safeParse({
      text: 'a'.repeat(3001),
      createdAt: '2026-03-04T12:00:00.000Z',
    })
    expect(result.success).toBe(false)
  })

  it('rejects missing createdAt', () => {
    const result = actorSignatureSchema.safeParse({
      text: 'Hello',
    })
    expect(result.success).toBe(false)
  })

  it('rejects invalid datetime format', () => {
    const result = actorSignatureSchema.safeParse({
      text: 'Hello',
      createdAt: 'not-a-date',
    })
    expect(result.success).toBe(false)
  })

  it('rejects missing text', () => {
    const result = actorSignatureSchema.safeParse({
      createdAt: '2026-03-04T12:00:00.000Z',
    })
    expect(result.success).toBe(false)
  })
})
