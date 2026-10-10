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

export type SeedPerson = {
  /** `YYYY-MM-DD`, or null where the seed does not record one. */
  birthDate: string | null
  bio: string
}

/**
 * The profile of every person credited in `SEED_MOVIES`, by name. Headshots are not seeded: there is
 * no free public source, and one uploaded in development survives a re-seed.
 */
export const SEED_PEOPLE: Record<string, SeedPerson> = {
  'Denis Villeneuve': {
    birthDate: '1967-10-03',
    bio: 'Québécois director of Arrival, Blade Runner 2049 and both parts of Dune.',
  },
  'Jon Spaihts': { birthDate: null, bio: 'American screenwriter who co-wrote both parts of Dune.' },
  'Eric Roth': {
    birthDate: '1945-03-22',
    bio: 'American screenwriter of Forrest Gump and The Insider, and a co-writer of Dune.',
  },
  'Timothée Chalamet': {
    birthDate: '1995-12-27',
    bio: 'American and French actor, Paul Atreides in Dune and the young lead of Lady Bird and Little Women.',
  },
  'Rebecca Ferguson': {
    birthDate: '1983-10-19',
    bio: 'Swedish actor who plays Lady Jessica in Dune.',
  },
  'Oscar Isaac': {
    birthDate: '1979-03-09',
    bio: 'Guatemalan-American actor, Duke Leto Atreides in Dune.',
  },
  Zendaya: { birthDate: '1996-09-01', bio: 'American actor and singer who plays Chani in Dune.' },
  'Austin Butler': {
    birthDate: '1991-08-17',
    bio: 'American actor, Feyd-Rautha in Dune: Part Two.',
  },
  'Eric Heisserer': {
    birthDate: null,
    bio: "American screenwriter who adapted Ted Chiang's story into Arrival.",
  },
  'Amy Adams': {
    birthDate: '1974-08-20',
    bio: 'American actor, the linguist Louise Banks in Arrival.',
  },
  'Jeremy Renner': {
    birthDate: '1971-01-07',
    bio: 'American actor who plays the physicist Ian Donnelly in Arrival.',
  },
  'Forest Whitaker': {
    birthDate: '1961-07-15',
    bio: 'American actor and director, Colonel Weber in Arrival.',
  },
  'Hampton Fancher': {
    birthDate: '1938-07-18',
    bio: 'American screenwriter of Blade Runner and co-writer of Blade Runner 2049.',
  },
  'Michael Green': {
    birthDate: null,
    bio: 'American screenwriter who co-wrote Blade Runner 2049.',
  },
  'Ryan Gosling': {
    birthDate: '1980-11-12',
    bio: 'Canadian actor, K in Blade Runner 2049 and Sebastian in La La Land.',
  },
  'Harrison Ford': {
    birthDate: '1942-07-13',
    bio: 'American actor who returns as Rick Deckard in Blade Runner 2049.',
  },
  'Ana de Armas': {
    birthDate: '1988-04-30',
    bio: 'Cuban and Spanish actor, Joi in Blade Runner 2049 and Marta in Knives Out.',
  },
  'Christopher Nolan': {
    birthDate: '1970-07-30',
    bio: 'British and American director of Inception, Interstellar and Oppenheimer.',
  },
  'Leonardo DiCaprio': {
    birthDate: '1974-11-11',
    bio: 'American actor who leads Inception as the extractor Dom Cobb.',
  },
  'Joseph Gordon-Levitt': { birthDate: '1981-02-17', bio: 'American actor, Arthur in Inception.' },
  'Elliot Page': {
    birthDate: '1987-02-21',
    bio: 'Canadian actor who plays the architect Ariadne in Inception.',
  },
  'Tom Hardy': {
    birthDate: '1977-09-15',
    bio: 'English actor, Eames in Inception and Max in Mad Max: Fury Road.',
  },
  'Jonathan Nolan': {
    birthDate: '1976-06-06',
    bio: 'British and American writer who co-wrote Interstellar with his brother Christopher.',
  },
  'Matthew McConaughey': {
    birthDate: '1969-11-04',
    bio: 'American actor, the pilot Cooper in Interstellar.',
  },
  'Anne Hathaway': {
    birthDate: '1982-11-12',
    bio: 'American actor who plays Dr. Amelia Brand in Interstellar.',
  },
  'Jessica Chastain': {
    birthDate: '1977-03-24',
    bio: 'American actor, the grown-up Murph in Interstellar.',
  },
  'Cillian Murphy': {
    birthDate: '1976-05-25',
    bio: 'Irish actor, J. Robert Oppenheimer in Oppenheimer.',
  },
  'Emily Blunt': { birthDate: '1983-02-23', bio: 'British actor who plays Kitty Oppenheimer.' },
  'Robert Downey Jr.': {
    birthDate: '1965-04-04',
    bio: 'American actor, Lewis Strauss in Oppenheimer.',
  },
  'Bong Joon-ho': {
    birthDate: '1969-09-14',
    bio: 'South Korean director and co-writer of Parasite.',
  },
  'Han Jin-won': { birthDate: null, bio: 'South Korean screenwriter who co-wrote Parasite.' },
  'Song Kang-ho': {
    birthDate: '1967-01-17',
    bio: 'South Korean actor, the father Ki-taek in Parasite.',
  },
  'Lee Sun-kyun': {
    birthDate: '1975-03-02',
    bio: 'South Korean actor who played the wealthy Mr. Park in Parasite.',
  },
  'Cho Yeo-jeong': { birthDate: '1981-02-10', bio: 'South Korean actor, Mrs. Park in Parasite.' },
  'Hayao Miyazaki': {
    birthDate: '1941-01-05',
    bio: 'Japanese animator, co-founder of Studio Ghibli, writer and director of Spirited Away.',
  },
  'Rumi Hiiragi': {
    birthDate: null,
    bio: 'Japanese actor, the voice of Chihiro in Spirited Away.',
  },
  'Miyu Irino': { birthDate: null, bio: 'Japanese voice actor who voices Haku in Spirited Away.' },
  'Jordan Peele': { birthDate: '1979-02-21', bio: 'American writer and director of Get Out.' },
  'Daniel Kaluuya': { birthDate: '1989-02-24', bio: 'British actor, Chris Washington in Get Out.' },
  'Allison Williams': {
    birthDate: '1988-04-13',
    bio: 'American actor who plays Rose Armitage in Get Out.',
  },
  'Greta Gerwig': {
    birthDate: '1983-08-04',
    bio: 'American writer and director of Lady Bird and Little Women.',
  },
  'Saoirse Ronan': {
    birthDate: '1994-04-12',
    bio: 'Irish and American actor, the title role in Lady Bird and Jo March in Little Women.',
  },
  'Laurie Metcalf': {
    birthDate: '1955-06-16',
    bio: 'American actor who plays the mother, Marion, in Lady Bird.',
  },
  'Emma Watson': { birthDate: '1990-04-15', bio: 'British actor, Meg March in Little Women.' },
  'Florence Pugh': {
    birthDate: '1996-01-03',
    bio: 'English actor who plays Amy March in Little Women.',
  },
  'George Miller': {
    birthDate: '1945-03-03',
    bio: 'Australian director and co-writer of the Mad Max films, Fury Road among them.',
  },
  'Brendan McCarthy': {
    birthDate: null,
    bio: 'British comics artist who co-wrote Mad Max: Fury Road.',
  },
  'Nico Lathouris': {
    birthDate: null,
    bio: 'Australian actor and writer who co-wrote Mad Max: Fury Road.',
  },
  'Charlize Theron': {
    birthDate: '1975-08-07',
    bio: 'South African and American actor, Imperator Furiosa in Mad Max: Fury Road.',
  },
  'Wes Anderson': {
    birthDate: '1969-05-01',
    bio: 'American writer and director of The Grand Budapest Hotel.',
  },
  'Ralph Fiennes': {
    birthDate: '1962-12-22',
    bio: 'English actor, the concierge M. Gustave in The Grand Budapest Hotel.',
  },
  'Tony Revolori': {
    birthDate: '1996-04-28',
    bio: 'American actor who plays the lobby boy Zero in The Grand Budapest Hotel.',
  },
  'Rian Johnson': { birthDate: '1973-12-17', bio: 'American writer and director of Knives Out.' },
  'Daniel Craig': {
    birthDate: '1968-03-02',
    bio: 'English actor, the detective Benoit Blanc in Knives Out.',
  },
  'Chris Evans': {
    birthDate: '1981-06-13',
    bio: 'American actor who plays Ransom Drysdale in Knives Out.',
  },
  'Daniel Kwan': {
    birthDate: '1988-02-10',
    bio: 'American director, half of Daniels, who wrote and directed Everything Everywhere All at Once.',
  },
  'Daniel Scheinert': {
    birthDate: '1987-06-07',
    bio: 'American director, the other half of Daniels behind Everything Everywhere All at Once.',
  },
  'Michelle Yeoh': {
    birthDate: '1962-08-06',
    bio: 'Malaysian actor, Evelyn Wang in Everything Everywhere All at Once.',
  },
  'Ke Huy Quan': {
    birthDate: '1971-08-20',
    bio: 'Vietnamese-American actor who plays Waymond Wang in Everything Everywhere All at Once.',
  },
  'Stephanie Hsu': {
    birthDate: '1990-11-25',
    bio: 'American actor, Joy and Jobu Tupaki in Everything Everywhere All at Once.',
  },
  'Justine Triet': {
    birthDate: '1978-07-17',
    bio: 'French director and co-writer of Anatomy of a Fall.',
  },
  'Arthur Harari': {
    birthDate: null,
    bio: 'French director and actor who co-wrote Anatomy of a Fall.',
  },
  'Sandra Hüller': {
    birthDate: '1978-04-30',
    bio: 'German actor, the novelist Sandra Voyter in Anatomy of a Fall.',
  },
  'Swann Arlaud': {
    birthDate: null,
    bio: 'French actor who plays the lawyer Vincent in Anatomy of a Fall.',
  },
  'Milo Machado Graner': {
    birthDate: null,
    bio: 'French actor, the son Daniel in Anatomy of a Fall.',
  },
  'Celine Song': {
    birthDate: null,
    bio: 'Korean-Canadian playwright, writer and director of Past Lives.',
  },
  'Greta Lee': { birthDate: '1983-03-07', bio: 'American actor, Nora in Past Lives.' },
  'Teo Yoo': {
    birthDate: null,
    bio: 'South Korean and German actor who plays Hae Sung in Past Lives.',
  },
  'John Magaro': { birthDate: null, bio: 'American actor, Arthur in Past Lives.' },
  'Charlotte Wells': {
    birthDate: null,
    bio: 'Scottish writer and director of Aftersun, her first feature.',
  },
  'Paul Mescal': { birthDate: '1996-02-02', bio: 'Irish actor, the father Calum in Aftersun.' },
  'Frankie Corio': {
    birthDate: null,
    bio: 'Scottish actor who plays the daughter Sophie in Aftersun.',
  },
  'Celia Rowlson-Hall': {
    birthDate: null,
    bio: 'American dancer and filmmaker, the grown-up Sophie in Aftersun.',
  },
  'Céline Sciamma': {
    birthDate: '1978-11-12',
    bio: 'French writer and director of Portrait of a Lady on Fire.',
  },
  'Noémie Merlant': {
    birthDate: '1988-11-27',
    bio: 'French actor, the painter Marianne in Portrait of a Lady on Fire.',
  },
  'Adèle Haenel': {
    birthDate: '1989-02-11',
    bio: 'French actor who plays Héloïse in Portrait of a Lady on Fire.',
  },
  'Luàna Bajrami': {
    birthDate: null,
    bio: 'French and Kosovar actor, the maid Sophie in Portrait of a Lady on Fire.',
  },
  'Barry Jenkins': {
    birthDate: '1979-11-19',
    bio: 'American director and co-writer of Moonlight.',
  },
  'Tarell Alvin McCraney': {
    birthDate: '1980-10-17',
    bio: 'American playwright whose play became Moonlight, which he co-wrote.',
  },
  'Trevante Rhodes': {
    birthDate: '1990-02-10',
    bio: 'American actor, the adult Chiron in Moonlight.',
  },
  'André Holland': {
    birthDate: '1979-12-28',
    bio: 'American actor who plays the adult Kevin in Moonlight.',
  },
  'Janelle Monáe': {
    birthDate: '1985-12-01',
    bio: 'American singer and actor, Teresa in Moonlight.',
  },
  'Mahershala Ali': { birthDate: '1974-02-16', bio: 'American actor, Juan in Moonlight.' },
  'Damien Chazelle': {
    birthDate: '1985-01-19',
    bio: 'American and French writer and director of Whiplash.',
  },
  'Miles Teller': {
    birthDate: '1987-02-20',
    bio: 'American actor, the drummer Andrew Neiman in Whiplash.',
  },
  'J.K. Simmons': {
    birthDate: '1955-01-09',
    bio: 'American actor who plays the bandleader Terence Fletcher in Whiplash.',
  },
  'Paul Reiser': {
    birthDate: '1956-03-30',
    bio: 'American actor and comedian, the father Jim Neiman in Whiplash.',
  },
  'Francis Ford Coppola': {
    birthDate: '1939-04-07',
    bio: 'American director and co-writer of The Godfather.',
  },
  'Mario Puzo': {
    birthDate: '1920-10-15',
    bio: 'American novelist whose book became The Godfather, which he co-wrote.',
  },
  'Marlon Brando': {
    birthDate: '1924-04-03',
    bio: 'American actor, Vito Corleone in The Godfather.',
  },
  'Al Pacino': {
    birthDate: '1940-04-25',
    bio: 'American actor who plays Michael Corleone in The Godfather.',
  },
  'James Caan': {
    birthDate: '1940-03-26',
    bio: 'American actor, Sonny Corleone in The Godfather.',
  },
  'Diane Keaton': {
    birthDate: '1946-01-05',
    bio: 'American actor who plays Kay Adams in The Godfather.',
  },
}

/** Every person credited in `SEED_MOVIES`, once, with their profile from `SEED_PEOPLE`. */
export const seedPeople = (): (SeedPerson & { name: string })[] => {
  const names = new Set<string>()
  for (const movie of SEED_MOVIES) {
    for (const name of [...movie.directors, ...movie.writers, ...movie.cast]) {
      names.add(name)
    }
  }
  return [...names].map((name) => {
    const profile = SEED_PEOPLE[name]
    if (!profile) {
      throw new Error(`Seed data has no profile for ${name}`)
    }
    return { name, ...profile }
  })
}
