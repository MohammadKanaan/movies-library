/**
 * The seeded catalog: genres by name and movies by title with their credits by person name. Slugs
 * are derived the same way the DAL derives them (`lib/slug.ts`), so re-seeding upserts the same rows.
 */

/**
 * Dev posters are TMDB's public images, not bucket objects, so the catalog has posters without R2.
 * The DAL never deletes a poster URL outside the bucket, so replacing or removing one is safe.
 */
const tmdbPoster = (path: string) => `https://image.tmdb.org/t/p/w500/${path}.jpg`

export type SeedMovie = {
  title: string
  /** `YYYY-MM-DD` */
  releaseDate: string
  runtimeMinutes: number
  synopsis: string
  posterUrl: string
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
  'History',
  'Horror',
  'Music',
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
    posterUrl: tmdbPoster('d5NXSklXo0qyIYkgV94XAgMIckC'),
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
    posterUrl: tmdbPoster('1pdfLvkbY9ohJlCjQH2CZjjYVvJ'),
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
    posterUrl: tmdbPoster('x2FJsf1ElAgr63Y3PNPtJrcmpoe'),
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
    posterUrl: tmdbPoster('gajva2L0rPYkEWjzgFlBXCAVBE5'),
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
    posterUrl: tmdbPoster('oYuLEt3zVCKq57qu2F8dT7NIa6f'),
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
    posterUrl: tmdbPoster('gEU2QniE6E77NI6lCU6MxlNBvIx'),
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
    posterUrl: tmdbPoster('8Gxv8gSFCU0XGDykEGv7zR1n2ua'),
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
    posterUrl: tmdbPoster('7IiTTgloJzvGI1TAYymCfbfl3vT'),
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
    posterUrl: tmdbPoster('39wmItIWsg5sZMyRUHLkWBcuVCM'),
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
    posterUrl: tmdbPoster('tFXcEccSQMf3lfhfXKSU9iRBpa3'),
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
    posterUrl: tmdbPoster('gl66K7zRdtNYGrxyS2YDUP5ASZd'),
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
    posterUrl: tmdbPoster('yn5ihODtZ7ofn8pDYfxCmxh8AXI'),
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
    posterUrl: tmdbPoster('hA2ple9q4qnwxp3hKVNhroipsir'),
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
    posterUrl: tmdbPoster('eWdyYQreja6JGCzqHWXpWHDrrPo'),
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
    posterUrl: tmdbPoster('pThyQovXQrw2m0s9x82twj48Jq4'),
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
    posterUrl: tmdbPoster('w3LxiVYdWWRvEVdn5RYq6jIqkb1'),
    genres: ['Action', 'Adventure', 'Comedy', 'Science Fiction'],
    directors: ['Daniel Kwan', 'Daniel Scheinert'],
    writers: ['Daniel Kwan', 'Daniel Scheinert'],
    cast: ['Michelle Yeoh', 'Ke Huy Quan', 'Stephanie Hsu'],
  },
  {
    title: 'Anatomy of a Fall',
    releaseDate: '2023-08-23',
    runtimeMinutes: 152,
    synopsis:
      'A novelist stands trial for her husband’s death, and their partially sighted son becomes the only witness to a marriage taken apart in court.',
    posterUrl: tmdbPoster('kQs6keheMwCxJxrzV83VUwFtHkB'),
    genres: ['Drama', 'Mystery', 'Thriller'],
    directors: ['Justine Triet'],
    writers: ['Justine Triet', 'Arthur Harari'],
    cast: ['Sandra Hüller', 'Swann Arlaud', 'Milo Machado Graner'],
  },
  {
    title: 'Past Lives',
    releaseDate: '2023-06-02',
    runtimeMinutes: 106,
    synopsis:
      'Two childhood friends separated when one emigrates from Seoul meet again in New York twenty-four years later.',
    posterUrl: tmdbPoster('k3waqVXSnvCZWfJYNtdamTgTtTA'),
    genres: ['Drama', 'Romance'],
    directors: ['Celine Song'],
    writers: ['Celine Song'],
    cast: ['Greta Lee', 'Teo Yoo', 'John Magaro'],
  },
  {
    title: 'Aftersun',
    releaseDate: '2022-10-21',
    runtimeMinutes: 102,
    synopsis:
      'A woman looks back on a holiday in Turkey with her young father, piecing him together from memory and camcorder footage.',
    posterUrl: tmdbPoster('evKz85EKouVbIr51zy5fOtpNRPg'),
    genres: ['Drama'],
    directors: ['Charlotte Wells'],
    writers: ['Charlotte Wells'],
    cast: ['Paul Mescal', 'Frankie Corio', 'Celia Rowlson-Hall'],
  },
  {
    title: 'Portrait of a Lady on Fire',
    releaseDate: '2019-09-18',
    runtimeMinutes: 122,
    synopsis:
      'In 1770, a painter is commissioned to paint a reluctant bride-to-be in secret, studying her by day and painting her by night.',
    posterUrl: tmdbPoster('2LquGwEhbg3soxSCs9VNyh5VJd9'),
    genres: ['Drama', 'History', 'Romance'],
    directors: ['Céline Sciamma'],
    writers: ['Céline Sciamma'],
    cast: ['Noémie Merlant', 'Adèle Haenel', 'Luàna Bajrami'],
  },
  {
    title: 'Moonlight',
    releaseDate: '2016-10-21',
    runtimeMinutes: 111,
    synopsis:
      'Three chapters in the life of Chiron, a young Black man growing up in Miami, as he comes to terms with who he is.',
    posterUrl: tmdbPoster('4911T5FbJ9eD2Faz5Z8cT3SUhU3'),
    genres: ['Drama'],
    directors: ['Barry Jenkins'],
    writers: ['Barry Jenkins', 'Tarell Alvin McCraney'],
    cast: ['Trevante Rhodes', 'André Holland', 'Janelle Monáe', 'Mahershala Ali'],
  },
  {
    title: 'Whiplash',
    releaseDate: '2014-10-10',
    runtimeMinutes: 107,
    synopsis:
      'A young jazz drummer at an elite conservatory is pushed to his limits by an instructor who will stop at nothing.',
    posterUrl: tmdbPoster('7fn624j5lj3xTme2SgiLCeuedmO'),
    genres: ['Drama', 'Music'],
    directors: ['Damien Chazelle'],
    writers: ['Damien Chazelle'],
    cast: ['Miles Teller', 'J.K. Simmons', 'Paul Reiser'],
  },
  {
    title: 'The Godfather',
    releaseDate: '1972-03-24',
    runtimeMinutes: 175,
    synopsis:
      'The aging patriarch of a crime dynasty hands control of his empire to his reluctant youngest son.',
    posterUrl: tmdbPoster('3bhkrj58Vtu7enYsRolD1fZdja1'),
    genres: ['Crime', 'Drama'],
    directors: ['Francis Ford Coppola'],
    writers: ['Mario Puzo', 'Francis Ford Coppola'],
    cast: ['Marlon Brando', 'Al Pacino', 'James Caan', 'Diane Keaton'],
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
