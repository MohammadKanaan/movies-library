import type { MovieDetail } from '@/lib/dto/movies'
import type { PersonSummary } from '@/lib/dto/people'

/** How many top-billed people the movie page's billing block names; the rest go to its rail. */
export const STARRING_COUNT = 3
export const WRITTEN_BY_COUNT = 2

/** A credit outside the billing block, labelled with its role (and billing, for the cast). */
export type SupportingCredit = { person: PersonSummary; role: 'cast' | 'writer'; label: string }

/**
 * The movie page splits the credits the way a one-sheet does: the leads (top-billed cast and
 * writers, and every director) by name in the billing block, everyone else on a rail of cards.
 */
export const presentMovieDetail = (movie: MovieDetail) => {
  const { cast, writers } = movie.credits
  const supporting: SupportingCredit[] = [
    ...cast.slice(STARRING_COUNT).map((person, index) => ({
      person,
      role: 'cast' as const,
      label: `Cast · #${STARRING_COUNT + index + 1}`,
    })),
    ...writers
      .slice(WRITTEN_BY_COUNT)
      .map((person) => ({ person, role: 'writer' as const, label: 'Writer' })),
  ]
  return {
    ...movie,
    year: movie.releaseDate.getUTCFullYear(),
    starring: cast.slice(0, STARRING_COUNT),
    writtenBy: writers.slice(0, WRITTEN_BY_COUNT),
    supporting,
  }
}
