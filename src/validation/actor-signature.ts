import { z } from 'zod'

/**
 * Zod schema for forum.barazo.actor.signature records.
 *
 * Mirrors the lexicon constraints from the signature lexicon.
 * Singleton record (key: literal:self).
 */
export const actorSignatureSchema = z.object({
  text: z.string().min(1).max(3000),
  createdAt: z.iso.datetime(),
})

export type ActorSignatureInput = z.input<typeof actorSignatureSchema>
