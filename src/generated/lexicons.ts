/**
 * GENERATED CODE - DO NOT MODIFY
 */
import {
  type LexiconDoc,
  Lexicons,
  ValidationError,
  type ValidationResult,
} from '@atproto/lexicon'
import { type $Typed, is$typed, maybe$typed } from './util.js'

export const schemaDict = {
  AppBskyRichtextFacet: {
    lexicon: 1,
    id: 'app.bsky.richtext.facet',
    defs: {
      main: {
        type: 'object',
        description: 'Annotation of a sub-string within rich text.',
        required: ['index', 'features'],
        properties: {
          index: {
            type: 'ref',
            ref: 'lex:app.bsky.richtext.facet#byteSlice',
          },
          features: {
            type: 'array',
            items: {
              type: 'union',
              refs: [
                'lex:app.bsky.richtext.facet#mention',
                'lex:app.bsky.richtext.facet#link',
                'lex:app.bsky.richtext.facet#tag',
              ],
            },
          },
        },
      },
      mention: {
        type: 'object',
        description:
          "Facet feature for mention of another account. The text is usually a handle, including a '@' prefix, but the facet reference is a DID.",
        required: ['did'],
        properties: {
          did: {
            type: 'string',
            format: 'did',
          },
        },
      },
      link: {
        type: 'object',
        description:
          'Facet feature for a URL. The text URL may have been simplified or truncated, but the facet reference should be a complete URL.',
        required: ['uri'],
        properties: {
          uri: {
            type: 'string',
            format: 'uri',
          },
        },
      },
      tag: {
        type: 'object',
        description:
          "Facet feature for a hashtag. The text usually includes a '#' prefix, but the facet reference should not (except in the case of 'double hash tags').",
        required: ['tag'],
        properties: {
          tag: {
            type: 'string',
            maxLength: 640,
            maxGraphemes: 64,
          },
        },
      },
      byteSlice: {
        type: 'object',
        description:
          'Specifies the sub-string range a facet feature applies to. Start index is inclusive, end index is exclusive. Indices are zero-indexed, counting bytes of the UTF-8 encoded text.',
        required: ['byteStart', 'byteEnd'],
        properties: {
          byteStart: {
            type: 'integer',
            minimum: 0,
          },
          byteEnd: {
            type: 'integer',
            minimum: 0,
          },
        },
      },
    },
  },
  ComAtprotoLabelDefs: {
    lexicon: 1,
    id: 'com.atproto.label.defs',
    defs: {
      label: {
        type: 'object',
        description:
          'Metadata tag on an atproto resource (eg, repo or record).',
        required: ['src', 'uri', 'val', 'cts'],
        properties: {
          ver: {
            type: 'integer',
            description: 'The AT Protocol version of the label object.',
          },
          src: {
            type: 'string',
            format: 'did',
            description: 'DID of the actor who created this label.',
          },
          uri: {
            type: 'string',
            format: 'uri',
            description:
              'AT URI of the record, repository (account), or other resource that this label applies to.',
          },
          cid: {
            type: 'string',
            format: 'cid',
            description:
              "Optionally, CID specifying the specific version of 'uri' resource this label applies to.",
          },
          val: {
            type: 'string',
            maxLength: 128,
            description:
              'The short string name of the value or type of this label.',
          },
          neg: {
            type: 'boolean',
            description:
              'If true, this is a negation label, overwriting a previous label.',
          },
          cts: {
            type: 'string',
            format: 'datetime',
            description: 'Timestamp when this label was created.',
          },
          exp: {
            type: 'string',
            format: 'datetime',
            description:
              'Timestamp at which this label expires (no longer applies).',
          },
          sig: {
            type: 'bytes',
            description: 'Signature of dag-cbor encoded label.',
          },
        },
      },
      selfLabels: {
        type: 'object',
        description:
          'Metadata tags on an atproto record, published by the author within the record.',
        required: ['values'],
        properties: {
          values: {
            type: 'array',
            items: {
              type: 'ref',
              ref: 'lex:com.atproto.label.defs#selfLabel',
            },
            maxLength: 10,
          },
        },
      },
      selfLabel: {
        type: 'object',
        description:
          'Metadata tag on an atproto record, published by the author within the record. Note that schemas should use #selfLabels, not #selfLabel.',
        required: ['val'],
        properties: {
          val: {
            type: 'string',
            maxLength: 128,
            description:
              'The short string name of the value or type of this label.',
          },
        },
      },
      labelValueDefinition: {
        type: 'object',
        description:
          'Declares a label value and its expected interpretations and behaviors.',
        required: ['identifier', 'severity', 'blurs', 'locales'],
        properties: {
          identifier: {
            type: 'string',
            description:
              "The value of the label being defined. Must only include lowercase ascii and the '-' character ([a-z-]+).",
            maxLength: 100,
            maxGraphemes: 100,
          },
          severity: {
            type: 'string',
            description:
              "How should a client visually convey this label? 'inform' means neutral and informational; 'alert' means negative and warning; 'none' means show nothing.",
            knownValues: ['inform', 'alert', 'none'],
          },
          blurs: {
            type: 'string',
            description:
              "What should this label hide in the UI, if applied? 'content' hides all of the target; 'media' hides the images/video/audio; 'none' hides nothing.",
            knownValues: ['content', 'media', 'none'],
          },
          defaultSetting: {
            type: 'string',
            description: 'The default setting for this label.',
            knownValues: ['ignore', 'warn', 'hide'],
            default: 'warn',
          },
          adultOnly: {
            type: 'boolean',
            description:
              'Does the user need to have adult content enabled in order to configure this label?',
          },
          locales: {
            type: 'array',
            items: {
              type: 'ref',
              ref: 'lex:com.atproto.label.defs#labelValueDefinitionStrings',
            },
          },
        },
      },
      labelValueDefinitionStrings: {
        type: 'object',
        description:
          'Strings which describe the label in the UI, localized into a specific language.',
        required: ['lang', 'name', 'description'],
        properties: {
          lang: {
            type: 'string',
            description:
              'The code of the language these strings are written in.',
            format: 'language',
          },
          name: {
            type: 'string',
            description: 'A short human-readable name for the label.',
            maxGraphemes: 64,
            maxLength: 640,
          },
          description: {
            type: 'string',
            description:
              'A longer description of what the label means and why it might be applied.',
            maxGraphemes: 10000,
            maxLength: 100000,
          },
        },
      },
      labelValue: {
        type: 'string',
        knownValues: [
          '!hide',
          '!no-promote',
          '!warn',
          '!no-unauthenticated',
          'dmca-violation',
          'doxxing',
          'porn',
          'sexual',
          'nudity',
          'nsfl',
          'gore',
        ],
      },
    },
  },
  ComAtprotoRepoStrongRef: {
    lexicon: 1,
    id: 'com.atproto.repo.strongRef',
    description: 'A URI with a content-hash fingerprint.',
    defs: {
      main: {
        type: 'object',
        required: ['uri', 'cid'],
        properties: {
          uri: {
            type: 'string',
            format: 'at-uri',
          },
          cid: {
            type: 'string',
            format: 'cid',
          },
        },
      },
    },
  },
  ForumBarazoActorPreferences: {
    lexicon: 1,
    id: 'forum.barazo.actor.preferences',
    description:
      'User-level moderation, safety, and cross-posting preferences. Portable across AppViews.',
    defs: {
      main: {
        type: 'record',
        description:
          'User-level moderation and safety preferences. Portable across AppViews.',
        key: 'literal:self',
        record: {
          type: 'object',
          required: ['maturityLevel', 'updatedAt'],
          properties: {
            maturityLevel: {
              type: 'string',
              knownValues: ['safe', 'mature', 'all'],
              description: "Maximum maturity tier to show. Default: 'safe'.",
            },
            mutedWords: {
              type: 'array',
              maxLength: 100,
              items: {
                type: 'string',
                maxLength: 1000,
                maxGraphemes: 100,
              },
              description: 'Global muted words (apply to all communities).',
            },
            blockedDids: {
              type: 'array',
              maxLength: 1000,
              items: {
                type: 'string',
                format: 'did',
              },
              description: 'Blocked accounts (content hidden everywhere).',
            },
            mutedDids: {
              type: 'array',
              maxLength: 1000,
              items: {
                type: 'string',
                format: 'did',
              },
              description:
                'Muted accounts (content de-emphasized, collapsed but visible).',
            },
            crossPostDefaults: {
              type: 'ref',
              ref: 'lex:forum.barazo.actor.preferences#crossPostConfig',
              description: 'Per-service toggle for cross-posting new topics.',
            },
            updatedAt: {
              type: 'string',
              format: 'datetime',
              description:
                'Client-declared timestamp when preferences were last updated.',
            },
          },
        },
      },
      crossPostConfig: {
        type: 'object',
        properties: {
          bluesky: {
            type: 'boolean',
            description: 'Cross-post new topics to Bluesky. Default: false.',
          },
          frontpage: {
            type: 'boolean',
            description: 'Cross-post new topics to Frontpage. Default: false.',
          },
        },
      },
    },
  },
  ForumBarazoActorSignature: {
    lexicon: 1,
    id: 'forum.barazo.actor.signature',
    defs: {
      main: {
        type: 'record',
        description:
          "A user's forum signature, displayed below their posts. Singleton record (one per user).",
        key: 'literal:self',
        record: {
          type: 'object',
          required: ['text', 'createdAt'],
          properties: {
            text: {
              type: 'string',
              description:
                'Signature content. Plain text or markdown depending on forum configuration.',
              maxGraphemes: 300,
              maxLength: 3000,
            },
            createdAt: {
              type: 'string',
              format: 'datetime',
            },
          },
        },
      },
    },
  },
  ForumBarazoDefs: {
    lexicon: 1,
    id: 'forum.barazo.defs',
    description: 'Shared type definitions for Barazo forum lexicons.',
    defs: {
      communityRef: {
        type: 'object',
        description: 'Reference to a Barazo community by its DID.',
        required: ['did'],
        properties: {
          did: {
            type: 'string',
            format: 'did',
            description: "The community's DID.",
          },
        },
      },
    },
  },
  ForumBarazoInteractionReaction: {
    lexicon: 1,
    id: 'forum.barazo.interaction.reaction',
    description:
      'A reaction to a forum topic or reply, with configurable reaction types per community.',
    defs: {
      main: {
        type: 'record',
        description: 'Record containing a reaction to a forum topic or reply.',
        key: 'tid',
        record: {
          type: 'object',
          required: ['subject', 'type', 'community', 'createdAt'],
          properties: {
            subject: {
              type: 'ref',
              ref: 'lex:com.atproto.repo.strongRef',
              description: 'The topic or reply being reacted to.',
            },
            type: {
              type: 'string',
              knownValues: [
                'forum.barazo.interaction.reaction#like',
                'forum.barazo.interaction.reaction#heart',
                'forum.barazo.interaction.reaction#thumbsup',
              ],
              maxLength: 300,
              maxGraphemes: 30,
              description:
                'Reaction type identifier. Communities may define additional values.',
            },
            community: {
              type: 'string',
              format: 'did',
              description:
                'DID of the community where this reaction was created. Immutable origin identifier.',
            },
            createdAt: {
              type: 'string',
              format: 'datetime',
              description:
                'Client-declared timestamp when this reaction was originally created.',
            },
          },
        },
      },
      like: {
        type: 'token',
        description: 'Simple approval reaction.',
      },
      heart: {
        type: 'token',
        description: 'Love/appreciation reaction.',
      },
      thumbsup: {
        type: 'token',
        description: 'Agreement/thumbs-up reaction.',
      },
    },
  },
  ForumBarazoInteractionVote: {
    lexicon: 1,
    id: 'forum.barazo.interaction.vote',
    description:
      'A directional vote on a forum topic or reply. Votes are quantitative (ranking); reactions are expressive (emoji-style).',
    defs: {
      main: {
        type: 'record',
        description:
          'Record containing a directional vote on a forum topic or reply.',
        key: 'tid',
        record: {
          type: 'object',
          required: ['subject', 'direction', 'community', 'createdAt'],
          properties: {
            subject: {
              type: 'ref',
              ref: 'lex:com.atproto.repo.strongRef',
              description: 'The topic or reply being voted on.',
            },
            direction: {
              type: 'string',
              knownValues: ['up'],
              description:
                "Vote direction. Start upvote-only; 'down' can be added later without breaking change.",
            },
            community: {
              type: 'string',
              format: 'did',
              description:
                'DID of the community where this vote was cast. Immutable origin identifier.',
            },
            createdAt: {
              type: 'string',
              format: 'datetime',
              description:
                'Client-declared timestamp when this vote was originally created.',
            },
          },
        },
      },
    },
  },
  ForumBarazoTopicPost: {
    lexicon: 1,
    id: 'forum.barazo.topic.post',
    description:
      'A forum topic post with title, content, community attribution, and optional tags and content labels.',
    defs: {
      main: {
        type: 'record',
        description: 'Record containing a forum topic post.',
        key: 'tid',
        record: {
          type: 'object',
          required: ['title', 'content', 'community', 'category', 'createdAt'],
          properties: {
            title: {
              type: 'string',
              minLength: 1,
              maxLength: 2000,
              maxGraphemes: 200,
              description: 'Topic title.',
            },
            content: {
              type: 'string',
              minLength: 1,
              maxLength: 100000,
              description: 'Topic body in markdown.',
            },
            contentFormat: {
              type: 'string',
              knownValues: ['markdown'],
              description: "Content format. Defaults to 'markdown' if omitted.",
            },
            community: {
              type: 'string',
              format: 'did',
              description:
                'DID of the community where this record was created. Immutable origin identifier for cross-community attribution.',
            },
            category: {
              type: 'string',
              format: 'record-key',
              maxLength: 640,
              maxGraphemes: 64,
              description:
                'Category record key (slug) within the community. Follows AT Protocol record key syntax.',
            },
            tags: {
              type: 'array',
              maxLength: 25,
              items: {
                type: 'string',
                minLength: 1,
                maxLength: 300,
                maxGraphemes: 30,
              },
              description: 'Topic tags. Lowercase alphanumeric + hyphens.',
            },
            facets: {
              type: 'array',
              description:
                'Annotations of text (mentions, URLs, hashtags, etc).',
              items: {
                type: 'ref',
                ref: 'lex:app.bsky.richtext.facet',
              },
            },
            langs: {
              type: 'array',
              maxLength: 3,
              items: {
                type: 'string',
                format: 'language',
              },
              description:
                'BCP 47 language tags indicating the primary language(s) of the content.',
            },
            labels: {
              type: 'union',
              description:
                'Self-label values for content maturity (e.g., sexual, nudity, graphic-media).',
              refs: ['lex:com.atproto.label.defs#selfLabels'],
            },
            createdAt: {
              type: 'string',
              format: 'datetime',
              description:
                'Client-declared timestamp when this post was originally created.',
            },
          },
        },
      },
    },
  },
  ForumBarazoTopicReply: {
    lexicon: 1,
    id: 'forum.barazo.topic.reply',
    description:
      'A reply to a forum topic or another reply, with threaded parent references and community attribution.',
    defs: {
      main: {
        type: 'record',
        description:
          'Record containing a reply to a forum topic or another reply.',
        key: 'tid',
        record: {
          type: 'object',
          required: ['content', 'root', 'parent', 'community', 'createdAt'],
          properties: {
            content: {
              type: 'string',
              minLength: 1,
              maxLength: 50000,
              description: 'Reply body in markdown.',
            },
            contentFormat: {
              type: 'string',
              knownValues: ['markdown'],
              description: "Content format. Defaults to 'markdown' if omitted.",
            },
            root: {
              type: 'ref',
              ref: 'lex:com.atproto.repo.strongRef',
              description:
                'The original topic (AT URI of forum.barazo.topic.post).',
            },
            parent: {
              type: 'ref',
              ref: 'lex:com.atproto.repo.strongRef',
              description:
                'Direct parent (topic or reply). For top-level replies, parent == root.',
            },
            community: {
              type: 'string',
              format: 'did',
              description:
                'DID of the community where this reply was created. Immutable origin identifier.',
            },
            facets: {
              type: 'array',
              description:
                'Annotations of text (mentions, URLs, hashtags, etc).',
              items: {
                type: 'ref',
                ref: 'lex:app.bsky.richtext.facet',
              },
            },
            langs: {
              type: 'array',
              maxLength: 3,
              items: {
                type: 'string',
                format: 'language',
              },
              description:
                'BCP 47 language tags indicating the primary language(s) of the content.',
            },
            labels: {
              type: 'union',
              description: 'Self-label values for content maturity.',
              refs: ['lex:com.atproto.label.defs#selfLabels'],
            },
            createdAt: {
              type: 'string',
              format: 'datetime',
              description:
                'Client-declared timestamp when this reply was originally created.',
            },
          },
        },
      },
    },
  },
  ForumBarazoAuthForumAccess: {
      "lexicon": 1,
      "id": "forum.barazo.authForumAccess",
      "description": "Permission set for Barazo forum access. Grants ability to create topics, replies, and reactions, and manage user preferences.",
      "defs": {
          "main": {
              "type": "permission-set",
              "title": "Barazo Forum",
              "detail": "Create topics, replies, and reactions. Manage your forum preferences.",
              "permissions": [
                  {
                      "type": "permission",
                      "resource": "repo",
                      "collection": [
                          "forum.barazo.topic.post",
                          "forum.barazo.topic.reply",
                          "forum.barazo.interaction.reaction",
                          "forum.barazo.interaction.vote",
                          "forum.barazo.actor.preferences"
                      ]
                  }
              ]
          }
      }
  },
} as const satisfies Record<string, LexiconDoc>
export const schemas = Object.values(schemaDict) satisfies LexiconDoc[]
export const lexicons: Lexicons = new Lexicons(schemas)

export function validate<T extends { $type: string }>(
  v: unknown,
  id: string,
  hash: string,
  requiredType: true,
): ValidationResult<T>
export function validate<T extends { $type?: string }>(
  v: unknown,
  id: string,
  hash: string,
  requiredType?: false,
): ValidationResult<T>
export function validate(
  v: unknown,
  id: string,
  hash: string,
  requiredType?: boolean,
): ValidationResult {
  return (requiredType ? is$typed : maybe$typed)(v, id, hash)
    ? lexicons.validate(`${id}#${hash}`, v)
    : {
        success: false,
        error: new ValidationError(
          `Must be an object with "${hash === 'main' ? id : `${id}#${hash}`}" $type property`,
        ),
      }
}

export const ids = {
  AppBskyRichtextFacet: 'app.bsky.richtext.facet',
  ComAtprotoLabelDefs: 'com.atproto.label.defs',
  ComAtprotoRepoStrongRef: 'com.atproto.repo.strongRef',
  ForumBarazoActorPreferences: 'forum.barazo.actor.preferences',
  ForumBarazoActorSignature: 'forum.barazo.actor.signature',
  ForumBarazoDefs: 'forum.barazo.defs',
  ForumBarazoInteractionReaction: 'forum.barazo.interaction.reaction',
  ForumBarazoInteractionVote: 'forum.barazo.interaction.vote',
  ForumBarazoTopicPost: 'forum.barazo.topic.post',
  ForumBarazoTopicReply: 'forum.barazo.topic.reply',
  ForumBarazoAuthForumAccess: 'forum.barazo.authForumAccess',
} as const
