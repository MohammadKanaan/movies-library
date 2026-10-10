/**
 * The seeded catalog: genres by name and movies by title with their credits by person name. Slugs
 * are derived the same way the DAL derives them (`lib/slug.ts`), so re-seeding upserts the same rows.
 */

export type SeedMovie = {
  title: string
  /** `YYYY-MM-DD` */
  releaseDate: string
  runtimeMinutes: number
  synopsis: string
  genres: string[]
  directors: string[]
  writers: string[]
  cast: string[]
}

export const SEED_GENRES = [
  'Action',
  'Adventure',
  'Animation',
  'Comedy',
  'Crime',
  'Drama',
  'Fantasy',
  'Horror',
  'Mystery',
  'Romance',
  'Science Fiction',
  'Thriller',
]

export const SEED_MOVIES: SeedMovie[] = [
  {
    title: 'Dune',
    releaseDate: '2021-10-22',
    runtimeMinutes: 155,
    synopsis:
      'Paul Atreides, heir of a noble house, travels to the desert planet Arrakis, the only source of the most valuable substance in the universe.',
    genres: ['Adventure', 'Drama', 'Science Fiction'],
    directors: ['Denis Villeneuve'],
    writers: ['Jon Spaihts', 'Denis Villeneuve', 'Eric Roth'],
    cast: ['Timothée Chalamet', 'Rebecca Ferguson', 'Oscar Isaac', 'Zendaya'],
  },
  {
    title: 'Dune: Part Two',
    releaseDate: '2024-03-01',
    runtimeMinutes: 166,
    synopsis:
      'Paul Atreides unites with the Fremen and seeks revenge against the conspirators who destroyed his family.',
    genres: ['Adventure', 'Science Fiction'],
    directors: ['Denis Villeneuve'],
    writers: ['Denis Villeneuve', 'Jon Spaihts'],
    cast: ['Timothée Chalamet', 'Zendaya', 'Rebecca Ferguson', 'Austin Butler'],
  },
  {
    title: 'Arrival',
    releaseDate: '2016-11-11',
    runtimeMinutes: 116,
    synopsis:
      'A linguist is recruited by the military to communicate with alien lifeforms after twelve mysterious spacecraft appear around the world.',
    genres: ['Drama', 'Mystery', 'Science Fiction'],
    directors: ['Denis Villeneuve'],
    writers: ['Eric Heisserer'],
    cast: ['Amy Adams', 'Jeremy Renner', 'Forest Whitaker'],
  },
  {
    title: 'Blade Runner 2049',
    releaseDate: '2017-10-06',
    runtimeMinutes: 164,
    synopsis:
      'A young blade runner uncovers a long-buried secret that leads him to track down former blade runner Rick Deckard.',
    genres: ['Drama', 'Mystery', 'Science Fiction'],
    directors: ['Denis Villeneuve'],
    writers: ['Hampton Fancher', 'Michael Green'],
    cast: ['Ryan Gosling', 'Harrison Ford', 'Ana de Armas'],
  },
  {
    title: 'Inception',
    releaseDate: '2010-07-16',
    runtimeMinutes: 148,
    synopsis:
      'A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea.',
    genres: ['Action', 'Science Fiction', 'Thriller'],
    directors: ['Christopher Nolan'],
    writers: ['Christopher Nolan'],
    cast: ['Leonardo DiCaprio', 'Joseph Gordon-Levitt', 'Elliot Page', 'Tom Hardy'],
  },
  {
    title: 'Interstellar',
    releaseDate: '2014-11-07',
    runtimeMinutes: 169,
    synopsis:
      'A team of explorers travel through a wormhole in space in an attempt to ensure humanity’s survival.',
    genres: ['Adventure', 'Drama', 'Science Fiction'],
    directors: ['Christopher Nolan'],
    writers: ['Jonathan Nolan', 'Christopher Nolan'],
    cast: ['Matthew McConaughey', 'Anne Hathaway', 'Jessica Chastain'],
  },
  {
    title: 'Oppenheimer',
    releaseDate: '2023-07-21',
    runtimeMinutes: 180,
    synopsis:
      'The story of J. Robert Oppenheimer and his role in the development of the atomic bomb.',
    genres: ['Drama'],
    directors: ['Christopher Nolan'],
    writers: ['Christopher Nolan'],
    cast: ['Cillian Murphy', 'Emily Blunt', 'Robert Downey Jr.'],
  },
  {
    title: 'Parasite',
    releaseDate: '2019-05-30',
    runtimeMinutes: 132,
    synopsis:
      'Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan.',
    genres: ['Comedy', 'Drama', 'Thriller'],
    directors: ['Bong Joon-ho'],
    writers: ['Bong Joon-ho', 'Han Jin-won'],
    cast: ['Song Kang-ho', 'Lee Sun-kyun', 'Cho Yeo-jeong'],
  },
  {
    title: 'Spirited Away',
    releaseDate: '2001-07-20',
    runtimeMinutes: 125,
    synopsis:
      'During her family’s move to the suburbs, a sullen ten-year-old wanders into a world ruled by gods, witches and spirits.',
    genres: ['Adventure', 'Animation', 'Fantasy'],
    directors: ['Hayao Miyazaki'],
    writers: ['Hayao Miyazaki'],
    cast: ['Rumi Hiiragi', 'Miyu Irino'],
  },
  {
    title: 'Get Out',
    releaseDate: '2017-02-24',
    runtimeMinutes: 104,
    synopsis:
      'A young Black man visits his white girlfriend’s family estate, where an uneasy welcome gives way to something far worse.',
    genres: ['Horror', 'Mystery', 'Thriller'],
    directors: ['Jordan Peele'],
    writers: ['Jordan Peele'],
    cast: ['Daniel Kaluuya', 'Allison Williams'],
  },
  {
    title: 'Lady Bird',
    releaseDate: '2017-11-03',
    runtimeMinutes: 94,
    synopsis:
      'In 2002, an artistically inclined seventeen-year-old comes of age in Sacramento, California.',
    genres: ['Comedy', 'Drama'],
    directors: ['Greta Gerwig'],
    writers: ['Greta Gerwig'],
    cast: ['Saoirse Ronan', 'Laurie Metcalf', 'Timothée Chalamet'],
  },
  {
    title: 'Little Women',
    releaseDate: '2019-12-25',
    runtimeMinutes: 135,
    synopsis:
      'Jo March reflects back and forth on her life, telling the beloved story of the March sisters.',
    genres: ['Drama', 'Romance'],
    directors: ['Greta Gerwig'],
    writers: ['Greta Gerwig'],
    cast: ['Saoirse Ronan', 'Emma Watson', 'Florence Pugh', 'Timothée Chalamet'],
  },
  {
    title: 'Mad Max: Fury Road',
    releaseDate: '2015-05-15',
    runtimeMinutes: 120,
    synopsis:
      'In a post-apocalyptic wasteland, Max teams up with Furiosa to flee a tyrant who controls the land’s water supply.',
    genres: ['Action', 'Adventure', 'Science Fiction'],
    directors: ['George Miller'],
    writers: ['George Miller', 'Brendan McCarthy', 'Nico Lathouris'],
    cast: ['Tom Hardy', 'Charlize Theron'],
  },
  {
    title: 'The Grand Budapest Hotel',
    releaseDate: '2014-03-28',
    runtimeMinutes: 99,
    synopsis:
      'A legendary concierge at a famous European hotel and his protégé become embroiled in the theft of a priceless painting.',
    genres: ['Comedy', 'Drama'],
    directors: ['Wes Anderson'],
    writers: ['Wes Anderson'],
    cast: ['Ralph Fiennes', 'Tony Revolori', 'Saoirse Ronan'],
  },
  {
    title: 'Knives Out',
    releaseDate: '2019-11-27',
    runtimeMinutes: 130,
    synopsis:
      'A detective investigates the death of a patriarch of an eccentric, combative family.',
    genres: ['Comedy', 'Crime', 'Mystery'],
    directors: ['Rian Johnson'],
    writers: ['Rian Johnson'],
    cast: ['Daniel Craig', 'Ana de Armas', 'Chris Evans'],
  },
  {
    title: 'Everything Everywhere All at Once',
    releaseDate: '2022-03-25',
    runtimeMinutes: 139,
    synopsis:
      'A middle-aged Chinese immigrant is swept up in an insane adventure in which she alone can save existence.',
    genres: ['Action', 'Adventure', 'Comedy', 'Science Fiction'],
    directors: ['Daniel Kwan', 'Daniel Scheinert'],
    writers: ['Daniel Kwan', 'Daniel Scheinert'],
    cast: ['Michelle Yeoh', 'Ke Huy Quan', 'Stephanie Hsu'],
  },
]

/** Every person credited in `SEED_MOVIES`, once. */
export const seedPeople = (): string[] => {
  const names = new Set<string>()
  for (const movie of SEED_MOVIES) {
    for (const name of [...movie.directors, ...movie.writers, ...movie.cast]) {
      names.add(name)
    }
  }
  return [...names]
}
