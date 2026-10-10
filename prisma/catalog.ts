/**
 * 1,000 released feature films selected by vote count from CrawlFeeds' TMDB dataset.
 * Source: https://github.com/CrawlFeeds/movies-datasets
 * Snapshot: 05863eb7b5363c35283fefd506f8f789456e9da3/movies_dataset_1000_records_sample.csv
 * Retrieved 2026-10-10. CrawlFeeds publishes the dataset under CC BY 4.0:
 * https://creativecommons.org/licenses/by/4.0/
 * Movie metadata and posters originate from TMDB: https://www.themoviedb.org/
 * Dates use the source's release dates; credits retain source order, with the first six actors.
 * Records with missing required metadata, TV movies and films under 40 minutes are excluded.
 * TMDB ids beside each record link back to its source. Seeding needs no network or API key.
 */

/** Public TMDB posters let the dev catalog display images without an R2 bucket. */
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

/** Randomly star half of the seeded actor credits. */
export const randomlyMarkAsStar = (role: 'DIRECTOR' | 'WRITER' | 'ACTOR') =>
  role === 'ACTOR' && Math.random() < 0.5

export const SEED_GENRES = [
  'Action',
  'Adventure',
  'Animation',
  'Comedy',
  'Crime',
  'Documentary',
  'Drama',
  'Family',
  'Fantasy',
  'History',
  'Horror',
  'Music',
  'Mystery',
  'Romance',
  'Science Fiction',
  'Thriller',
  'War',
  'Western',
]

export const SEED_MOVIES: SeedMovie[] = [
  // https://www.themoviedb.org/movie/155
  {
    title: 'The Dark Knight',
    releaseDate: '2008-07-16',
    runtimeMinutes: 152,
    synopsis:
      'Batman raises the stakes in his war on crime. With the help of Lt. Jim Gordon and District Attorney Harvey Dent, Batman sets out to dismantle the remaining criminal organizations that plague the streets. The partnership proves to be effective, but they soon find themselves prey to a reign of chaos unleashed by a rising criminal mastermind known to the terrified citizens of Gotham as the Joker.',
    posterUrl: tmdbPoster('qJ2tW6WMUDux911r6m7haRef0WH'),
    genres: ['Action', 'Crime', 'Thriller'],
    directors: ['Christopher Nolan'],
    writers: ['Christopher Nolan', 'Jonathan Nolan'],
    cast: [
      'Christian Bale',
      'Heath Ledger',
      'Aaron Eckhart',
      'Michael Caine',
      'Maggie Gyllenhaal',
      'Gary Oldman',
    ],
  },
  // https://www.themoviedb.org/movie/550
  {
    title: 'Fight Club',
    releaseDate: '1999-10-15',
    runtimeMinutes: 139,
    synopsis:
      'A ticking-time-bomb insomniac and a slippery soap salesman channel primal male aggression into a shocking new form of therapy. Their concept catches on, with underground "fight clubs" forming in every town, until an eccentric gets in the way and ignites an out-of-control spiral toward oblivion.',
    posterUrl: tmdbPoster('jSziioSwPVrOy9Yow3XhWIBDjq1'),
    genres: ['Drama', 'Thriller'],
    directors: ['David Fincher'],
    writers: ['Jim Uhls'],
    cast: [
      'Edward Norton',
      'Brad Pitt',
      'Helena Bonham Carter',
      'Meat Loaf',
      'Jared Leto',
      'Zach Grenier',
    ],
  },
  // https://www.themoviedb.org/movie/680
  {
    title: 'Pulp Fiction',
    releaseDate: '1994-09-10',
    runtimeMinutes: 154,
    synopsis:
      "A burger-loving hit man, his philosophical partner, a drug-addled gangster's moll and a washed-up boxer converge in this sprawling, comedic crime caper. Their adventures unfurl in three stories that ingeniously trip back and forth in time.",
    posterUrl: tmdbPoster('vQWk5YBFWF4bZaofAbv0tShwBvQ'),
    genres: ['Thriller', 'Crime', 'Comedy'],
    directors: ['Quentin Tarantino'],
    writers: ['Quentin Tarantino'],
    cast: [
      'John Travolta',
      'Samuel L. Jackson',
      'Uma Thurman',
      'Bruce Willis',
      'Ving Rhames',
      'Harvey Keitel',
    ],
  },
  // https://www.themoviedb.org/movie/13
  {
    title: 'Forrest Gump',
    releaseDate: '1994-06-23',
    runtimeMinutes: 142,
    synopsis:
      'A man with a low IQ has accomplished great things in his life and been present during significant historic events—in each case, far exceeding what anyone imagined he could do. But despite all he has achieved, his one true love eludes him.',
    posterUrl: tmdbPoster('Cw4hIUIAmSYfK9QfaUW5igp9La'),
    genres: ['Comedy', 'Drama', 'Romance'],
    directors: ['Robert Zemeckis'],
    writers: ['Eric Roth'],
    cast: [
      'Tom Hanks',
      'Robin Wright',
      'Gary Sinise',
      'Sally Field',
      'Mykelti Williamson',
      'Michael Conner Humphreys',
    ],
  },
  // https://www.themoviedb.org/movie/671
  {
    title: "Harry Potter and the Philosopher's Stone",
    releaseDate: '2001-11-16',
    runtimeMinutes: 152,
    synopsis:
      "Harry Potter has lived under the stairs at his aunt and uncle's house his whole life. But on his 11th birthday, he learns he's a powerful wizard—with a place waiting for him at the Hogwarts School of Witchcraft and Wizardry. As he learns to harness his newfound powers with the help of the school's kindly headmaster, Harry uncovers the truth about his parents' deaths—and about the villain who's to blame.",
    posterUrl: tmdbPoster('wuMc08IPKEatf9rnMNXvIDxqP4W'),
    genres: ['Adventure', 'Fantasy'],
    directors: ['Chris Columbus'],
    writers: ['Steve Kloves'],
    cast: [
      'Daniel Radcliffe',
      'Rupert Grint',
      'Emma Watson',
      'Richard Harris',
      'Tom Felton',
      'Alan Rickman',
    ],
  },
  // https://www.themoviedb.org/movie/1726
  {
    title: 'Iron Man',
    releaseDate: '2008-04-30',
    runtimeMinutes: 126,
    synopsis:
      'After being held captive in an Afghan cave, billionaire engineer Tony Stark creates a unique weaponized suit of armor to fight evil.',
    posterUrl: tmdbPoster('78lPtwv72eTNqFW9COBYI0dWDJa'),
    genres: ['Action', 'Science Fiction', 'Adventure'],
    directors: ['Jon Favreau'],
    writers: ['Mark Fergus', 'Matt Holloway', 'Hawk Ostby', 'Art Marcum'],
    cast: [
      'Robert Downey Jr.',
      'Terrence Howard',
      'Jeff Bridges',
      'Gwyneth Paltrow',
      'Leslie Bibb',
      'Shaun Toub',
    ],
  },
  // https://www.themoviedb.org/movie/603
  {
    title: 'The Matrix',
    releaseDate: '1999-03-31',
    runtimeMinutes: 136,
    synopsis:
      'Set in the 22nd century, The Matrix tells the story of a computer hacker who joins a group of underground insurgents fighting the vast and powerful computers who now rule the earth.',
    posterUrl: tmdbPoster('dXNAPwY7VrqMAo51EKhhCJfaGb5'),
    genres: ['Action', 'Science Fiction'],
    directors: ['Lana Wachowski', 'Lilly Wachowski'],
    writers: ['Lana Wachowski', 'Lilly Wachowski'],
    cast: [
      'Keanu Reeves',
      'Laurence Fishburne',
      'Carrie-Anne Moss',
      'Hugo Weaving',
      'Gloria Foster',
      'Joe Pantoliano',
    ],
  },
  // https://www.themoviedb.org/movie/120
  {
    title: 'The Lord of the Rings: The Fellowship of the Ring',
    releaseDate: '2001-12-18',
    runtimeMinutes: 179,
    synopsis:
      'Young hobbit Frodo Baggins, after inheriting a mysterious ring from his uncle Bilbo, must leave his home in order to keep it from falling into the hands of its evil creator. Along the way, a fellowship is formed to protect the ringbearer and make sure that the ring arrives at its final destination: Mt. Doom, the only place where it can be destroyed.',
    posterUrl: tmdbPoster('6oom5QYQ2yQTMJIbnvbkBL9cHo6'),
    genres: ['Adventure', 'Fantasy', 'Action'],
    directors: ['Peter Jackson'],
    writers: ['Peter Jackson', 'Philippa Boyens', 'Fran Walsh'],
    cast: ['Elijah Wood', 'Ian McKellen', 'Viggo Mortensen', 'Sean Astin', 'Ian Holm', 'Liv Tyler'],
  },
  // https://www.themoviedb.org/movie/597
  {
    title: 'Titanic',
    releaseDate: '1997-12-18',
    runtimeMinutes: 194,
    synopsis:
      "101-year-old Rose DeWitt Bukater tells the story of her life aboard the Titanic, 84 years later. A young Rose boards the ship with her mother and fiancé. Meanwhile, Jack Dawson and Fabrizio De Rossi win third-class tickets aboard the ship. Rose tells the whole story from Titanic's departure through to its death—on its first and last voyage—on April 15, 1912.",
    posterUrl: tmdbPoster('9xjZS2rlVxm8SFx8kPC3aIGCOYQ'),
    genres: ['Drama', 'Romance'],
    directors: ['James Cameron'],
    writers: ['James Cameron'],
    cast: [
      'Leonardo DiCaprio',
      'Kate Winslet',
      'Billy Zane',
      'Kathy Bates',
      'Frances Fisher',
      'Gloria Stuart',
    ],
  },
  // https://www.themoviedb.org/movie/122
  {
    title: 'The Lord of the Rings: The Return of the King',
    releaseDate: '2003-12-17',
    runtimeMinutes: 201,
    synopsis:
      'As armies mass for a final battle that will decide the fate of the world--and powerful, ancient forces of Light and Dark compete to determine the outcome--one member of the Fellowship of the Ring is revealed as the noble heir to the throne of the Kings of Men. Yet, the sole hope for triumph over evil lies with a brave hobbit, Frodo, who, accompanied by his loyal friend Sam and the hideous, wretched Gollum, ventures deep into the very dark heart of Mordor on his seemingly impossible quest to destroy the Ring of Power.​',
    posterUrl: tmdbPoster('rCzpDGLbOoPwLjy3OAm5NUPOTrC'),
    genres: ['Adventure', 'Fantasy', 'Action'],
    directors: ['Peter Jackson'],
    writers: ['Peter Jackson', 'Fran Walsh', 'Philippa Boyens'],
    cast: [
      'Elijah Wood',
      'Ian McKellen',
      'Viggo Mortensen',
      'Sean Astin',
      'Andy Serkis',
      'Dominic Monaghan',
    ],
  },
  // https://www.themoviedb.org/movie/121
  {
    title: 'The Lord of the Rings: The Two Towers',
    releaseDate: '2002-12-18',
    runtimeMinutes: 179,
    synopsis:
      "Frodo Baggins and the other members of the Fellowship continue on their sacred quest to destroy the One Ring--but on separate paths. Their destinies lie at two towers--Orthanc Tower in Isengard, where the corrupt wizard Saruman awaits, and Sauron's fortress at Barad-dur, deep within the dark lands of Mordor. Frodo and Sam are trekking to Mordor to destroy the One Ring of Power while Gimli, Legolas and Aragorn search for the orc-captured Merry and Pippin. All along, nefarious wizard Saruman awaits the Fellowship members at the Orthanc Tower in Isengard.",
    posterUrl: tmdbPoster('5VTN0pR8gcqV3EPUHHfMGnJYN9L'),
    genres: ['Adventure', 'Fantasy', 'Action'],
    directors: ['Peter Jackson'],
    writers: ['Peter Jackson', 'Fran Walsh', 'Stephen Sinclair', 'Philippa Boyens'],
    cast: [
      'Elijah Wood',
      'Ian McKellen',
      'Viggo Mortensen',
      'Sean Astin',
      'Andy Serkis',
      'John Rhys-Davies',
    ],
  },
  // https://www.themoviedb.org/movie/672
  {
    title: 'Harry Potter and the Chamber of Secrets',
    releaseDate: '2002-11-13',
    runtimeMinutes: 161,
    synopsis:
      "Cars fly, trees fight back, and a mysterious house-elf comes to warn Harry Potter at the start of his second year at Hogwarts. Adventure and danger await when bloody writing on a wall announces: The Chamber Of Secrets Has Been Opened. To save Hogwarts will require all of Harry, Ron and Hermione's magical abilities and courage.",
    posterUrl: tmdbPoster('sdEOH0992YZ0QSxgXNIGLq1ToUi'),
    genres: ['Adventure', 'Fantasy'],
    directors: ['Chris Columbus'],
    writers: ['Steve Kloves'],
    cast: [
      'Daniel Radcliffe',
      'Rupert Grint',
      'Emma Watson',
      'Kenneth Branagh',
      'Toby Jones',
      'Robbie Coltrane',
    ],
  },
  // https://www.themoviedb.org/movie/673
  {
    title: 'Harry Potter and the Prisoner of Azkaban',
    releaseDate: '2004-05-31',
    runtimeMinutes: 141,
    synopsis:
      "Harry Potter's life is in danger once more as dangerous wizard Sirius Black has escaped from Azkaban Prison and is heading to Hogwarts.",
    posterUrl: tmdbPoster('aWxwnYoe8p2d2fcxOqtvAtJ72Rw'),
    genres: ['Adventure', 'Fantasy'],
    directors: ['Alfonso Cuarón'],
    writers: ['Steve Kloves'],
    cast: [
      'Daniel Radcliffe',
      'Rupert Grint',
      'Emma Watson',
      'Robbie Coltrane',
      'Michael Gambon',
      'Gary Oldman',
    ],
  },
  // https://www.themoviedb.org/movie/807
  {
    title: 'Se7en',
    releaseDate: '1995-09-22',
    runtimeMinutes: 127,
    synopsis:
      'Two homicide detectives are on a desperate hunt for a serial killer whose crimes are based on the "seven deadly sins" in this dark and haunting film that takes viewers from the tortured remains of one victim to the next. The seasoned Det. Somerset researches each sin in an effort to get inside the killer\'s mind, while his novice partner, Mills, scoffs at his efforts to unravel the case.',
    posterUrl: tmdbPoster('191nKfP0ehp3uIvWqgPbFmI4lv9'),
    genres: ['Crime', 'Mystery', 'Thriller'],
    directors: ['David Fincher'],
    writers: ['Andrew Kevin Walker'],
    cast: [
      'Morgan Freeman',
      'Brad Pitt',
      'Gwyneth Paltrow',
      'John Cassini',
      'Peter Crombie',
      'Reg E. Cathey',
    ],
  },
  // https://www.themoviedb.org/movie/238
  {
    title: 'The Godfather',
    releaseDate: '1972-03-14',
    runtimeMinutes: 175,
    synopsis:
      'Spanning the years 1945 to 1955, a chronicle of the fictional Italian-American Corleone crime family. When organized crime family patriarch, Vito Corleone barely survives an attempt on his life, his youngest son, Michael steps in to take care of the would-be killers, launching a campaign of bloody revenge.',
    posterUrl: tmdbPoster('3bhkrj58Vtu7enYsRolD1fZdja1'),
    genres: ['Drama', 'Crime'],
    directors: ['Francis Ford Coppola'],
    writers: ['Francis Ford Coppola', 'Mario Puzo'],
    cast: [
      'Marlon Brando',
      'Al Pacino',
      'James Caan',
      'Robert Duvall',
      'Richard S. Castellano',
      'Diane Keaton',
    ],
  },
  // https://www.themoviedb.org/movie/1771
  {
    title: 'Captain America: The First Avenger',
    releaseDate: '2011-07-22',
    runtimeMinutes: 124,
    synopsis:
      "During World War II, Steve Rogers is a sickly man from Brooklyn who's transformed into super-soldier Captain America to aid in the war effort. Rogers must stop the Red Skull – Adolf Hitler's ruthless head of weaponry, and the leader of an organization that intends to use a mysterious device of untold powers for world domination.",
    posterUrl: tmdbPoster('vSNxAJTlD0r02V9sPYpOjqDZXUK'),
    genres: ['Action', 'Adventure', 'Science Fiction'],
    directors: ['Joe Johnston'],
    writers: ['Christopher Markus', 'Stephen McFeely'],
    cast: [
      'Chris Evans',
      'Hayley Atwell',
      'Sebastian Stan',
      'Tommy Lee Jones',
      'Hugo Weaving',
      'Dominic Cooper',
    ],
  },
  // https://www.themoviedb.org/movie/11
  {
    title: 'Star Wars',
    releaseDate: '1977-05-25',
    runtimeMinutes: 121,
    synopsis:
      'Princess Leia is captured and held hostage by the evil Imperial forces in their effort to take over the galactic Empire. Venturesome Luke Skywalker and dashing captain Han Solo team together with the loveable robot duo R2-D2 and C-3PO to rescue the beautiful princess and restore peace and justice in the Empire.',
    posterUrl: tmdbPoster('6FfCtAuVAW8XJjZ7eWeLibRLWTw'),
    genres: ['Adventure', 'Action', 'Science Fiction'],
    directors: ['George Lucas'],
    writers: ['George Lucas'],
    cast: [
      'Mark Hamill',
      'Harrison Ford',
      'Carrie Fisher',
      'Peter Cushing',
      'Alec Guinness',
      'Anthony Daniels',
    ],
  },
  // https://www.themoviedb.org/movie/22
  {
    title: 'Pirates of the Caribbean: The Curse of the Black Pearl',
    releaseDate: '2003-07-09',
    runtimeMinutes: 143,
    synopsis:
      'When wily pirate Captain Barbossa seizes Jack Sparrow’s beloved ship, the Black Pearl, and kidnaps the governor’s daughter, Elizabeth Swann, blacksmith Will Turner reluctantly teams up with the unpredictable pirate Jack to rescue her—only to uncover a terrifying curse that turns Barbossa’s crew into the undead.',
    posterUrl: tmdbPoster('poHwCZeWzJCShH7tOjg8RIoyjcw'),
    genres: ['Adventure', 'Fantasy', 'Action'],
    directors: ['Gore Verbinski'],
    writers: ['Ted Elliott', 'Terry Rossio'],
    cast: [
      'Johnny Depp',
      'Geoffrey Rush',
      'Orlando Bloom',
      'Keira Knightley',
      'Jack Davenport',
      'Jonathan Pryce',
    ],
  },
  // https://www.themoviedb.org/movie/674
  {
    title: 'Harry Potter and the Goblet of Fire',
    releaseDate: '2005-11-16',
    runtimeMinutes: 157,
    synopsis:
      "When his name emerges from the Goblet of Fire, Harry Potter becomes a competitor in a grueling battle for glory among three wizarding schools. Signs of Voldemort's return emerge as Harry's friends help him prepare for the Triwizard Tournament.",
    posterUrl: tmdbPoster('fECBtHlr0RB3foNHDiCBXeg9Bv9'),
    genres: ['Adventure', 'Fantasy'],
    directors: ['Mike Newell'],
    writers: ['Steve Kloves'],
    cast: [
      'Daniel Radcliffe',
      'Rupert Grint',
      'Emma Watson',
      'Brendan Gleeson',
      'Michael Gambon',
      'Robert Pattinson',
    ],
  },
  // https://www.themoviedb.org/movie/105
  {
    title: 'Back to the Future',
    releaseDate: '1985-07-03',
    runtimeMinutes: 116,
    synopsis:
      "Eighties teenager Marty McFly is accidentally sent back in time to 1955, inadvertently disrupting his parents' first meeting and attracting his mother's romantic interest. Marty must repair the damage to history by rekindling his parents' romance and - with the help of his eccentric inventor friend Doc Brown - return to 1985.",
    posterUrl: tmdbPoster('vN5B5WgYscRGcQpVhHl6p9DDTP0'),
    genres: ['Adventure', 'Comedy', 'Science Fiction'],
    directors: ['Robert Zemeckis'],
    writers: ['Robert Zemeckis', 'Bob Gale'],
    cast: [
      'Michael J. Fox',
      'Christopher Lloyd',
      'Crispin Glover',
      'Lea Thompson',
      'Claudia Wells',
      'Thomas F. Wilson',
    ],
  },
  // https://www.themoviedb.org/movie/98
  {
    title: 'Gladiator',
    releaseDate: '2000-05-04',
    runtimeMinutes: 155,
    synopsis:
      "After the death of Emperor Marcus Aurelius, his devious son takes power and demotes Maximus, one of Rome's most capable generals who Marcus preferred. Eventually, Maximus is forced to become a gladiator and battle to the death against other men for the amusement of paying audiences.",
    posterUrl: tmdbPoster('wN2xWp1eIwCKOD0BHTcErTBv1Uq'),
    genres: ['Action', 'Drama', 'Adventure'],
    directors: ['Ridley Scott'],
    writers: ['David Franzoni', 'John Logan', 'William Nicholson'],
    cast: [
      'Russell Crowe',
      'Joaquin Phoenix',
      'Connie Nielsen',
      'Oliver Reed',
      'Richard Harris',
      'Derek Jacobi',
    ],
  },
  // https://www.themoviedb.org/movie/675
  {
    title: 'Harry Potter and the Order of the Phoenix',
    releaseDate: '2007-07-08',
    runtimeMinutes: 138,
    synopsis:
      "When a new professor's methods leave Hogwarts unprepared to fight the rising tide of evil, Harry teaches students how to defend against the dark arts.",
    posterUrl: tmdbPoster('5aOyriWkPec0zUDxmHFP9qMmBaj'),
    genres: ['Adventure', 'Fantasy'],
    directors: ['David Yates'],
    writers: ['Michael Goldenberg'],
    cast: [
      'Daniel Radcliffe',
      'Rupert Grint',
      'Emma Watson',
      'Imelda Staunton',
      'Helena Bonham Carter',
      'Robbie Coltrane',
    ],
  },
  // https://www.themoviedb.org/movie/767
  {
    title: 'Harry Potter and the Half-Blood Prince',
    releaseDate: '2009-07-15',
    runtimeMinutes: 153,
    synopsis:
      'Dumbledore tries to prepare Harry for the final battle with Voldemort while Death Eaters wreak havoc in both Muggle and Wizard worlds.',
    posterUrl: tmdbPoster('z7uo9zmQdQwU5ZJHFpv2Upl30i1'),
    genres: ['Adventure', 'Fantasy'],
    directors: ['David Yates'],
    writers: ['Steve Kloves'],
    cast: [
      'Daniel Radcliffe',
      'Rupert Grint',
      'Emma Watson',
      'Jim Broadbent',
      'Michael Gambon',
      'Tom Felton',
    ],
  },
  // https://www.themoviedb.org/movie/557
  {
    title: 'Spider-Man',
    releaseDate: '2002-05-01',
    runtimeMinutes: 121,
    synopsis:
      'After being bitten by a genetically altered spider at Oscorp, nerdy but endearing high school student Peter Parker is endowed with amazing powers to become the superhero known as Spider-Man.',
    posterUrl: tmdbPoster('nXdAh5vUwERL4WGVMaee8RoDEAS'),
    genres: ['Action', 'Science Fiction'],
    directors: ['Sam Raimi'],
    writers: ['David Koepp'],
    cast: [
      'Tobey Maguire',
      'Willem Dafoe',
      'Kirsten Dunst',
      'James Franco',
      'Cliff Robertson',
      'Rosemary Harris',
    ],
  },
  // https://www.themoviedb.org/movie/12
  {
    title: 'Finding Nemo',
    releaseDate: '2003-05-30',
    runtimeMinutes: 100,
    synopsis:
      "Nemo, an adventurous young clownfish, is unexpectedly taken from his Great Barrier Reef home to a dentist's office aquarium. It's up to his worrisome father Marlin and a friendly but forgetful fish Dory to bring Nemo home -- meeting vegetarian sharks, surfer dude turtles, hypnotic jellyfish, hungry seagulls, and more along the way.",
    posterUrl: tmdbPoster('5lc6nQc0VhWFYFbNv016xze8Jvy'),
    genres: ['Animation', 'Family', 'Adventure'],
    directors: ['Andrew Stanton'],
    writers: ['Andrew Stanton', 'Bob Peterson', 'David Reynolds'],
    cast: [
      'Albert Brooks',
      'Ellen DeGeneres',
      'Alexander Gould',
      'Willem Dafoe',
      'Geoffrey Rush',
      'Brad Garrett',
    ],
  },
  // https://www.themoviedb.org/movie/862
  {
    title: 'Toy Story',
    releaseDate: '1995-11-22',
    runtimeMinutes: 81,
    synopsis:
      "Led by Woody, Andy's toys live happily in his room until Andy's birthday brings Buzz Lightyear onto the scene. Afraid of losing his place in Andy's heart, Woody plots against Buzz. But when circumstances separate Buzz and Woody from their owner, the duo eventually learns to put aside their differences.",
    posterUrl: tmdbPoster('uXDfjJbdP4ijW5hWSBrPrlKpxab'),
    genres: ['Family', 'Comedy', 'Animation', 'Adventure'],
    directors: ['John Lasseter'],
    writers: ['Andrew Stanton', 'Joel Cohen', 'Joss Whedon', 'Alec Sokolow'],
    cast: [
      'Tom Hanks',
      'Tim Allen',
      'Don Rickles',
      'Jim Varney',
      'Wallace Shawn',
      'John Ratzenberger',
    ],
  },
  // https://www.themoviedb.org/movie/585
  {
    title: 'Monsters, Inc.',
    releaseDate: '2001-11-01',
    runtimeMinutes: 92,
    synopsis:
      "Lovable Sulley and his wisecracking sidekick Mike Wazowski are the top scare team at Monsters, Inc., the scream-processing factory in Monstropolis. When a little girl named Boo wanders into their world, it's the monsters who are scared silly, and it's up to Sulley and Mike to keep her out of sight and get her back home.",
    posterUrl: tmdbPoster('wFSpyMsp7H0ttERbxY7Trlv8xry'),
    genres: ['Animation', 'Comedy', 'Family', 'Fantasy'],
    directors: ['Pete Docter'],
    writers: ['Andrew Stanton', 'Daniel Gerson'],
    cast: [
      'John Goodman',
      'Billy Crystal',
      'Mary Gibbs',
      'Steve Buscemi',
      'James Coburn',
      'Jennifer Tilly',
    ],
  },
  // https://www.themoviedb.org/movie/497
  {
    title: 'The Green Mile',
    releaseDate: '1999-12-10',
    runtimeMinutes: 189,
    synopsis:
      "A supernatural tale set on death row in a Southern prison, where gentle giant John Coffey possesses the mysterious power to heal people's ailments. When the cell block's head guard, Paul Edgecomb, recognizes Coffey's miraculous gift, he tries desperately to help stave off the condemned man's execution.",
    posterUrl: tmdbPoster('8VG8fDNiy50H4FedGwdSVUPoaJe'),
    genres: ['Fantasy', 'Drama', 'Crime'],
    directors: ['Frank Darabont'],
    writers: ['Frank Darabont'],
    cast: [
      'Tom Hanks',
      'David Morse',
      'Bonnie Hunt',
      'Michael Clarke Duncan',
      'James Cromwell',
      'Michael Jeter',
    ],
  },
  // https://www.themoviedb.org/movie/24
  {
    title: 'Kill Bill: Vol. 1',
    releaseDate: '2003-10-10',
    runtimeMinutes: 111,
    synopsis:
      'An assassin is shot by her ruthless employer, Bill, and other members of their assassination circle – but she lives to plot her vengeance.',
    posterUrl: tmdbPoster('v7TaX8kXMXs5yFFGR41guUDNcnB'),
    genres: ['Action', 'Crime'],
    directors: ['Quentin Tarantino'],
    writers: ['Quentin Tarantino'],
    cast: [
      'Uma Thurman',
      'Lucy Liu',
      'Vivica A. Fox',
      'Daryl Hannah',
      'David Carradine',
      'Michael Madsen',
    ],
  },
  // https://www.themoviedb.org/movie/694
  {
    title: 'The Shining',
    releaseDate: '1980-05-23',
    runtimeMinutes: 144,
    synopsis:
      "Jack Torrance accepts a caretaker job at the Overlook Hotel, where he, along with his wife Wendy and their son Danny, must live isolated from the rest of the world for the winter. But they aren't prepared for the madness that lurks within.",
    posterUrl: tmdbPoster('uAR0AWqhQL1hQa69UDEbb2rE5Wx'),
    genres: ['Horror', 'Thriller'],
    directors: ['Stanley Kubrick'],
    writers: ['Stanley Kubrick', 'Diane Johnson'],
    cast: [
      'Jack Nicholson',
      'Shelley Duvall',
      'Danny Lloyd',
      'Scatman Crothers',
      'Barry Nelson',
      'Philip Stone',
    ],
  },
  // https://www.themoviedb.org/movie/808
  {
    title: 'Shrek',
    releaseDate: '2001-05-18',
    runtimeMinutes: 90,
    synopsis:
      "It ain't easy bein' green -- especially if you're a likable (albeit smelly) ogre named Shrek. On a mission to retrieve a gorgeous princess from the clutches of a fire-breathing dragon, Shrek teams up with an unlikely compatriot -- a wisecracking donkey.",
    posterUrl: tmdbPoster('iB64vpL3dIObOtMZgX3RqdVdQDc'),
    genres: ['Animation', 'Comedy', 'Fantasy', 'Adventure', 'Family'],
    directors: ['Andrew Adamson', 'Vicky Jenson'],
    writers: ['Ted Elliott', 'Roger S.H. Schulman', 'Joe Stillman', 'Terry Rossio'],
    cast: [
      'Mike Myers',
      'Eddie Murphy',
      'Cameron Diaz',
      'John Lithgow',
      'Vincent Cassel',
      'Peter Dennis',
    ],
  },
  // https://www.themoviedb.org/movie/129
  {
    title: 'Spirited Away',
    releaseDate: '2001-07-20',
    runtimeMinutes: 125,
    synopsis:
      'A young girl, Chihiro, becomes trapped in a strange new world of spirits. When her parents undergo a mysterious transformation, she must call upon the courage she never knew she had to free her family.',
    posterUrl: tmdbPoster('39wmItIWsg5sZMyRUHLkWBcuVCM'),
    genres: ['Animation', 'Family', 'Fantasy'],
    directors: ['Hayao Miyazaki'],
    writers: ['Hayao Miyazaki'],
    cast: [
      'Rumi Hiiragi',
      'Miyu Irino',
      'Mari Natsuki',
      'Takashi Naito',
      'Yasuko Sawaguchi',
      'Tatsuya Gashuin',
    ],
  },
  // https://www.themoviedb.org/movie/329
  {
    title: 'Jurassic Park',
    releaseDate: '1993-06-11',
    runtimeMinutes: 127,
    synopsis:
      'A wealthy entrepreneur secretly creates a theme park featuring living dinosaurs drawn from prehistoric DNA. Before opening day, he invites a team of experts and his two eager grandchildren to experience the park and help calm anxious investors. However, the park is anything but amusing as the security systems go off-line and the dinosaurs escape.',
    posterUrl: tmdbPoster('b1xCNnyrPebIc7EWNZIa6jhb1Ww'),
    genres: ['Adventure', 'Science Fiction'],
    directors: ['Steven Spielberg'],
    writers: ['Michael Crichton', 'David Koepp'],
    cast: [
      'Sam Neill',
      'Laura Dern',
      'Jeff Goldblum',
      'Richard Attenborough',
      'Bob Peck',
      'Martin Ferrero',
    ],
  },
  // https://www.themoviedb.org/movie/1124
  {
    title: 'The Prestige',
    releaseDate: '2006-10-19',
    runtimeMinutes: 130,
    synopsis:
      'A mysterious story of two magicians whose intense rivalry leads them on a life-long battle for supremacy -- full of obsession, deceit and jealousy with dangerous and deadly consequences.',
    posterUrl: tmdbPoster('Ag2B2KHKQPukjH7WutmgnnSNurZ'),
    genres: ['Drama', 'Mystery', 'Science Fiction'],
    directors: ['Christopher Nolan'],
    writers: ['Christopher Nolan', 'Jonathan Nolan'],
    cast: [
      'Hugh Jackman',
      'Christian Bale',
      'Michael Caine',
      'Piper Perabo',
      'Rebecca Hall',
      'Scarlett Johansson',
    ],
  },
  // https://www.themoviedb.org/movie/424
  {
    title: "Schindler's List",
    releaseDate: '1993-12-15',
    runtimeMinutes: 195,
    synopsis:
      'The true story of how businessman Oskar Schindler saved over a thousand Jewish lives from the Nazis while they worked as slaves in his factory during World War II.',
    posterUrl: tmdbPoster('sF1U4EUQS8YHUYjNl3pMGNIQyr0'),
    genres: ['Drama', 'History', 'War'],
    directors: ['Steven Spielberg'],
    writers: ['Steven Zaillian'],
    cast: [
      'Liam Neeson',
      'Ben Kingsley',
      'Ralph Fiennes',
      'Caroline Goodall',
      'Jonathan Sagall',
      'Embeth Davidtz',
    ],
  },
  // https://www.themoviedb.org/movie/857
  {
    title: 'Saving Private Ryan',
    releaseDate: '1998-07-24',
    runtimeMinutes: 169,
    synopsis:
      'As U.S. troops storm the beaches of Normandy, three brothers lie dead on the battlefield, with a fourth trapped behind enemy lines. Ranger captain John Miller and seven men are tasked with penetrating German-held territory and bringing the boy home.',
    posterUrl: tmdbPoster('uqx37cS8cpHg8U35f9U5IBlrCV3'),
    genres: ['War', 'Drama', 'History'],
    directors: ['Steven Spielberg'],
    writers: ['Robert Rodat'],
    cast: [
      'Tom Hanks',
      'Tom Sizemore',
      'Edward Burns',
      'Barry Pepper',
      'Adam Goldberg',
      'Vin Diesel',
    ],
  },
  // https://www.themoviedb.org/movie/58
  {
    title: "Pirates of the Caribbean: Dead Man's Chest",
    releaseDate: '2006-07-06',
    runtimeMinutes: 151,
    synopsis:
      'Captain Jack Sparrow’s got a blood debt to pay: he owes his soul to the legendary Davy Jones, ghastly Ruler of the Ocean Depths. To escape eternal servitude aboard the Flying Dutchman, ever-crafty Jack must track down the still-beating heart of Jones. But he won’t do it alone: Will Turner and Elizabeth Swann are drawn back into another one of his perilous quests—assuming they can evade execution for aiding a pirate.',
    posterUrl: tmdbPoster('uXEqmloGyP7UXAiphJUu2v2pcuE'),
    genres: ['Adventure', 'Fantasy', 'Action'],
    directors: ['Gore Verbinski'],
    writers: ['Terry Rossio', 'Ted Elliott'],
    cast: [
      'Johnny Depp',
      'Orlando Bloom',
      'Keira Knightley',
      'Jack Davenport',
      'Bill Nighy',
      'Jonathan Pryce',
    ],
  },
  // https://www.themoviedb.org/movie/640
  {
    title: 'Catch Me If You Can',
    releaseDate: '2002-12-16',
    runtimeMinutes: 141,
    synopsis:
      'A true story about Frank Abagnale Jr. who, before his 19th birthday, successfully conned millions of dollars worth of checks as a Pan Am pilot, doctor, and legal prosecutor. An FBI agent makes it his mission to put him behind bars. But Frank not only eludes capture, he revels in the pursuit.',
    posterUrl: tmdbPoster('ctjEj2xM32OvBXCq8zAdK3ZrsAj'),
    genres: ['Drama', 'Crime'],
    directors: ['Steven Spielberg'],
    writers: ['Jeff Nathanson'],
    cast: [
      'Leonardo DiCaprio',
      'Tom Hanks',
      'Christopher Walken',
      'Martin Sheen',
      'Nathalie Baye',
      'Amy Adams',
    ],
  },
  // https://www.themoviedb.org/movie/348
  {
    title: 'Alien',
    releaseDate: '1979-05-25',
    runtimeMinutes: 117,
    synopsis:
      'During its return to the earth, commercial spaceship Nostromo intercepts a distress signal from a distant planet. When a three-member team of the crew discovers a chamber containing thousands of eggs on the planet, a creature inside one of the eggs attacks an explorer. The entire crew is unaware of the impending nightmare set to descend upon them when the alien parasite planted inside its unfortunate host is birthed.',
    posterUrl: tmdbPoster('vfrQk5IPloGg1v9Rzbh2Eg3VGyM'),
    genres: ['Horror', 'Science Fiction'],
    directors: ['Ridley Scott'],
    writers: ["Dan O'Bannon"],
    cast: [
      'Tom Skerritt',
      'Sigourney Weaver',
      'Veronica Cartwright',
      'Harry Dean Stanton',
      'John Hurt',
      'Ian Holm',
    ],
  },
  // https://www.themoviedb.org/movie/558
  {
    title: 'Spider-Man 2',
    releaseDate: '2004-06-25',
    runtimeMinutes: 127,
    synopsis:
      "Peter Parker is going through a major identity crisis. Burned out from being Spider-Man, he decides to shelve his superhero alter ego, which leaves the city suffering in the wake of carnage left by the evil Doc Ock. In the meantime, Parker still can't act on his feelings for Mary Jane Watson, a girl he's loved since childhood. A certain anger begins to brew in his best friend Harry Osborn as well...",
    posterUrl: tmdbPoster('aGuvNAaaZuWXYQQ6N2v7DeuP6mB'),
    genres: ['Action', 'Adventure', 'Science Fiction'],
    directors: ['Sam Raimi'],
    writers: ['Alvin Sargent'],
    cast: [
      'Tobey Maguire',
      'Kirsten Dunst',
      'James Franco',
      'Alfred Molina',
      'Rosemary Harris',
      'J.K. Simmons',
    ],
  },
  // https://www.themoviedb.org/movie/38
  {
    title: 'Eternal Sunshine of the Spotless Mind',
    releaseDate: '2004-03-19',
    runtimeMinutes: 108,
    synopsis:
      'Joel Barish, heartbroken that his girlfriend underwent a procedure to erase him from her memory, decides to do the same. However, as he watches his memories of her fade away, he realises that he still loves her, and may be too late to correct his mistake.',
    posterUrl: tmdbPoster('5MwkWH9tYHv3mV9OdYTMR5qreIz'),
    genres: ['Science Fiction', 'Drama', 'Romance'],
    directors: ['Michel Gondry'],
    writers: ['Charlie Kaufman'],
    cast: [
      'Jim Carrey',
      'Kate Winslet',
      'Kirsten Dunst',
      'Mark Ruffalo',
      'Elijah Wood',
      'Tom Wilkinson',
    ],
  },
  // https://www.themoviedb.org/movie/77
  {
    title: 'Memento',
    releaseDate: '2000-10-11',
    runtimeMinutes: 113,
    synopsis:
      "Leonard Shelby is tracking down the man who raped and murdered his wife. The difficulty of locating his wife's killer, however, is compounded by the fact that he suffers from a rare, untreatable form of short-term memory loss. Although he can recall details of life before his accident, Leonard cannot remember what happened fifteen minutes ago, where he's going, or why.",
    posterUrl: tmdbPoster('nzlv62aC0octS5AklAiWpXLX9Z0'),
    genres: ['Mystery', 'Thriller'],
    directors: ['Christopher Nolan'],
    writers: ['Christopher Nolan'],
    cast: [
      'Guy Pearce',
      'Carrie-Anne Moss',
      'Joe Pantoliano',
      'Mark Boone Junior',
      'Russ Fega',
      'Jorja Fox',
    ],
  },
  // https://www.themoviedb.org/movie/1422
  {
    title: 'The Departed',
    releaseDate: '2006-10-04',
    runtimeMinutes: 151,
    synopsis:
      "To take down South Boston's Irish Mafia, the police send in one of their own to infiltrate the underworld, not realizing the syndicate has done likewise. While an undercover cop curries favor with the mob kingpin, a career criminal rises through the police ranks. But both sides soon discover there's a mole among them.",
    posterUrl: tmdbPoster('nT97ifVT2J1yMQmeq20Qblg61T'),
    genres: ['Drama', 'Thriller', 'Crime'],
    directors: ['Martin Scorsese'],
    writers: ['William Monahan'],
    cast: [
      'Leonardo DiCaprio',
      'Matt Damon',
      'Jack Nicholson',
      'Mark Wahlberg',
      'Martin Sheen',
      'Ray Winstone',
    ],
  },
  // https://www.themoviedb.org/movie/101
  {
    title: 'Léon: The Professional',
    releaseDate: '1994-09-14',
    runtimeMinutes: 111,
    synopsis:
      'Léon, the top hit man in New York, has earned a rep as an effective "cleaner". But when his next-door neighbors are wiped out by a loose-cannon DEA agent, he becomes the unwilling custodian of 12-year-old Mathilda. Before long, Mathilda\'s thoughts turn to revenge, and she considers following in Léon\'s footsteps.',
    posterUrl: tmdbPoster('bxB2q91nKYp8JNzqE7t7TWBVupB'),
    genres: ['Crime', 'Drama', 'Action'],
    directors: ['Luc Besson'],
    writers: ['Luc Besson'],
    cast: [
      'Jean Reno',
      'Natalie Portman',
      'Gary Oldman',
      'Danny Aiello',
      'Peter Appel',
      'Michael Badalucco',
    ],
  },
  // https://www.themoviedb.org/movie/118
  {
    title: 'Charlie and the Chocolate Factory',
    releaseDate: '2005-07-13',
    runtimeMinutes: 115,
    synopsis:
      "A young boy wins a tour through the most magnificent chocolate factory in the world, led by the world's most unusual candy maker.",
    posterUrl: tmdbPoster('iKP6wg3c6COUe8gYutoGG7qcPnO'),
    genres: ['Adventure', 'Comedy', 'Family', 'Fantasy'],
    directors: ['Tim Burton'],
    writers: ['John August'],
    cast: [
      'Johnny Depp',
      'Freddie Highmore',
      'David Kelly',
      'Helena Bonham Carter',
      'Noah Taylor',
      'Missi Pyle',
    ],
  },
  // https://www.themoviedb.org/movie/752
  {
    title: 'V for Vendetta',
    releaseDate: '2006-02-23',
    runtimeMinutes: 132,
    synopsis:
      'In a world in which Great Britain has become a fascist state, a masked vigilante known only as “V” conducts guerrilla warfare against the oppressive British government. When V rescues a young woman from the secret police, he finds in her an ally with whom he can continue his fight to free the people of Britain.',
    posterUrl: tmdbPoster('1avD1JeaRiJX5M4ahPdZPypGoGN'),
    genres: ['Action', 'Thriller', 'Science Fiction'],
    directors: ['James McTeigue'],
    writers: ['Lana Wachowski', 'Lilly Wachowski'],
    cast: [
      'Natalie Portman',
      'Hugo Weaving',
      'Stephen Rea',
      'Stephen Fry',
      'John Hurt',
      'Tim Pigott-Smith',
    ],
  },
  // https://www.themoviedb.org/movie/500
  {
    title: 'Reservoir Dogs',
    releaseDate: '1992-09-02',
    runtimeMinutes: 99,
    synopsis:
      'A botched robbery indicates a police informant, and the pressure mounts in the aftermath at a warehouse. Crime begets violence as the survivors -- veteran Mr. White, newcomer Mr. Orange, psychopathic parolee Mr. Blonde, bickering weasel Mr. Pink and Nice Guy Eddie -- unravel.',
    posterUrl: tmdbPoster('xi8Iu6qyTfyZVDVy60raIOYJJmk'),
    genres: ['Crime', 'Thriller'],
    directors: ['Quentin Tarantino'],
    writers: ['Quentin Tarantino'],
    cast: [
      'Harvey Keitel',
      'Tim Roth',
      'Michael Madsen',
      'Chris Penn',
      'Steve Buscemi',
      'Lawrence Tierney',
    ],
  },
  // https://www.themoviedb.org/movie/559
  {
    title: 'Spider-Man 3',
    releaseDate: '2007-05-01',
    runtimeMinutes: 139,
    synopsis:
      'The seemingly invincible Spider-Man goes up against an all-new crop of villains—including the shape-shifting Sandman. While Spider-Man’s superpowers are altered by an alien organism, his alter ego, Peter Parker, deals with nemesis Eddie Brock and also gets caught up in a love triangle.',
    posterUrl: tmdbPoster('qFmwhVUoUSXjkKRmca5yGDEXBIj'),
    genres: ['Action', 'Adventure', 'Science Fiction'],
    directors: ['Sam Raimi'],
    writers: ['Sam Raimi', 'Ivan Raimi', 'Alvin Sargent'],
    cast: [
      'Tobey Maguire',
      'Kirsten Dunst',
      'James Franco',
      'Thomas Haden Church',
      'Topher Grace',
      'Bryce Dallas Howard',
    ],
  },
  // https://www.themoviedb.org/movie/920
  {
    title: 'Cars',
    releaseDate: '2006-06-08',
    runtimeMinutes: 117,
    synopsis:
      "Lightning McQueen, a hotshot rookie race car driven to succeed, discovers that life is about the journey, not the finish line, when he finds himself unexpectedly detoured in the sleepy Route 66 town of Radiator Springs. On route across the country to the big Piston Cup Championship in California to compete against two seasoned pros, McQueen gets to know the town's offbeat characters.",
    posterUrl: tmdbPoster('2Touk3m5gzsqr1VsvxypdyHY5ci'),
    genres: ['Animation', 'Adventure', 'Comedy', 'Family'],
    directors: ['John Lasseter'],
    writers: [
      'John Lasseter',
      'Dan Fogelman',
      'Joe Ranft',
      'Phil Lorin',
      'Kiel Murray',
      'Jørgen Klubien',
    ],
    cast: [
      'Owen Wilson',
      'Paul Newman',
      'Bonnie Hunt',
      'Larry the Cable Guy',
      'Cheech Marin',
      'Tony Shalhoub',
    ],
  },
  // https://www.themoviedb.org/movie/393
  {
    title: 'Kill Bill: Vol. 2',
    releaseDate: '2004-04-16',
    runtimeMinutes: 136,
    synopsis:
      "The Bride unwaveringly continues on her roaring rampage of revenge against the band of assassins who had tried to kill her and her unborn child. She visits each of her former associates one-by-one, checking off the victims on her Death List Five until there's nothing left to do … but kill Bill.",
    posterUrl: tmdbPoster('2yhg0mZQMhDyvUQ4rG1IZ4oIA8L'),
    genres: ['Action', 'Crime', 'Thriller'],
    directors: ['Quentin Tarantino'],
    writers: ['Quentin Tarantino'],
    cast: [
      'Uma Thurman',
      'David Carradine',
      'Daryl Hannah',
      'Michael Madsen',
      'Gordon Liu Chia-Hui',
      'Michael Parks',
    ],
  },
  // https://www.themoviedb.org/movie/78
  {
    title: 'Blade Runner',
    releaseDate: '1982-06-25',
    runtimeMinutes: 118,
    synopsis:
      'In the smog-choked dystopian Los Angeles of 2019, blade runner Rick Deckard is called out of retirement to terminate a quartet of replicants who have escaped to Earth seeking their creator for a way to extend their short life spans.',
    posterUrl: tmdbPoster('63N9uy8nd9j7Eog2axPQ8lbr3Wj'),
    genres: ['Science Fiction', 'Drama', 'Thriller'],
    directors: ['Ridley Scott'],
    writers: ['David Webb Peoples', 'Hampton Fancher'],
    cast: [
      'Harrison Ford',
      'Rutger Hauer',
      'Sean Young',
      'Edward James Olmos',
      'M. Emmet Walsh',
      'Daryl Hannah',
    ],
  },
  // https://www.themoviedb.org/movie/863
  {
    title: 'Toy Story 2',
    releaseDate: '1999-10-30',
    runtimeMinutes: 92,
    synopsis:
      "Andy heads off to Cowboy Camp, leaving his toys to their own devices. Things shift into high gear when an obsessive toy collector named Al McWhiggen, owner of Al's Toy Barn kidnaps Woody. Andy's toys mount a daring rescue mission, Buzz Lightyear meets his match and Woody has to decide where he and his heart truly belong.",
    posterUrl: tmdbPoster('4rbcp3ng8n1MKHjpeqW0L7Fnpzz'),
    genres: ['Animation', 'Comedy', 'Family'],
    directors: ['John Lasseter'],
    writers: ['Doug Chamberlin', 'Rita Hsiao', 'Andrew Stanton', 'Chris Webb'],
    cast: ['Tom Hanks', 'Tim Allen', 'Joan Cusack', 'Kelsey Grammer', 'Don Rickles', 'Jim Varney'],
  },
  // https://www.themoviedb.org/movie/607
  {
    title: 'Men in Black',
    releaseDate: '1997-07-02',
    runtimeMinutes: 98,
    synopsis:
      'After a police chase with an otherworldly being, a New York City cop is recruited as an agent in a top-secret organization established to monitor and police alien activity on Earth: the Men in Black. Agent K and new recruit Agent J find themselves in the middle of a deadly plot by an intergalactic terrorist who has arrived on Earth to assassinate two ambassadors from opposing galaxies.',
    posterUrl: tmdbPoster('uLOmOF5IzWoyrgIF5MfUnh5pa1X'),
    genres: ['Action', 'Adventure', 'Comedy', 'Science Fiction'],
    directors: ['Barry Sonnenfeld'],
    writers: ['Ed Solomon'],
    cast: [
      'Tommy Lee Jones',
      'Will Smith',
      'Linda Fiorentino',
      "Vincent D'Onofrio",
      'Rip Torn',
      'Tony Shalhoub',
    ],
  },
  // https://www.themoviedb.org/movie/1271
  {
    title: '300',
    releaseDate: '2007-03-07',
    runtimeMinutes: 117,
    synopsis:
      'A story very loosely based the 480 B.C. Battle of Thermopylae, where the King of Sparta led his army against the advancing Persians.',
    posterUrl: tmdbPoster('h7Lcio0c9ohxPhSZg42eTlKIVVY'),
    genres: ['Action', 'Adventure', 'War'],
    directors: ['Zack Snyder'],
    writers: ['Zack Snyder', 'Kurt Johnstad', 'Michael B. Gordon'],
    cast: [
      'Gerard Butler',
      'Lena Headey',
      'Dominic West',
      'David Wenham',
      'Vincent Regan',
      'Michael Fassbender',
    ],
  },
  // https://www.themoviedb.org/movie/218
  {
    title: 'The Terminator',
    releaseDate: '1984-10-26',
    runtimeMinutes: 108,
    synopsis:
      'In the post-apocalyptic future, reigning tyrannical supercomputers teleport a cyborg assassin known as the "Terminator" back to 1984 to kill Sarah Connor, whose unborn son is destined to lead insurgents against 21st century mechanical hegemony. Meanwhile, the human-resistance movement dispatches a lone warrior to safeguard Sarah. Can he stop the virtually indestructible killing machine?',
    posterUrl: tmdbPoster('qvktm0BHcnmDpul4Hz01GIazWPr'),
    genres: ['Action', 'Thriller', 'Science Fiction'],
    directors: ['James Cameron'],
    writers: ['James Cameron', 'Gale Anne Hurd'],
    cast: [
      'Arnold Schwarzenegger',
      'Michael Biehn',
      'Linda Hamilton',
      'Paul Winfield',
      'Lance Henriksen',
      'Rick Rossovich',
    ],
  },
  // https://www.themoviedb.org/movie/769
  {
    title: 'GoodFellas',
    releaseDate: '1990-09-12',
    runtimeMinutes: 145,
    synopsis:
      'The true story of Henry Hill, a half-Irish, half-Sicilian Brooklyn kid who is adopted by neighbourhood gangsters at an early age and climbs the ranks of a Mafia family under the guidance of Jimmy Conway.',
    posterUrl: tmdbPoster('9OkCLM73MIU2CrKZbqiT8Ln1wY2'),
    genres: ['Drama', 'Crime'],
    directors: ['Martin Scorsese'],
    writers: ['Martin Scorsese', 'Nicholas Pileggi'],
    cast: [
      'Robert De Niro',
      'Ray Liotta',
      'Joe Pesci',
      'Lorraine Bracco',
      'Paul Sorvino',
      'Frank Sivero',
    ],
  },
  // https://www.themoviedb.org/movie/425
  {
    title: 'Ice Age',
    releaseDate: '2002-03-14',
    runtimeMinutes: 81,
    synopsis:
      'Manny the mammoth, Sid the loquacious sloth, and Diego the sabre-toothed tiger go on a comical quest to return a human baby back to his father, across a world on the brink of an ice age.',
    posterUrl: tmdbPoster('gLhHHZUzeseRXShoDyC4VqLgsNv'),
    genres: ['Animation', 'Comedy', 'Family', 'Adventure'],
    directors: ['Chris Wedge'],
    writers: ['Michael J. Wilson', 'Michael Berg', 'Peter Ackerman'],
    cast: [
      'Ray Romano',
      'John Leguizamo',
      'Denis Leary',
      'Goran Višnjić',
      'Jack Black',
      'Cedric the Entertainer',
    ],
  },
  // https://www.themoviedb.org/movie/637
  {
    title: 'Life Is Beautiful',
    releaseDate: '1997-12-20',
    runtimeMinutes: 116,
    synopsis:
      'A touching story of an Italian book seller of Jewish ancestry who lives in his own little fairy tale. His creative and happy life would come to an abrupt halt when his entire family is deported to a concentration camp during World War II. While locked up he tries to convince his son that the whole thing is just a game.',
    posterUrl: tmdbPoster('74hLDKjD5aGYOotO6esUVaeISa2'),
    genres: ['Comedy', 'Drama'],
    directors: ['Roberto Benigni'],
    writers: ['Roberto Benigni', 'Vincenzo Cerami'],
    cast: [
      'Roberto Benigni',
      'Nicoletta Braschi',
      'Giorgio Cantarini',
      'Giustino Durano',
      'Sergio Bini Bustric',
      'Marisa Paredes',
    ],
  },
  // https://www.themoviedb.org/movie/240
  {
    title: 'The Godfather Part II',
    releaseDate: '1974-12-20',
    runtimeMinutes: 202,
    synopsis:
      'In the continuing saga of the Corleone crime family, a young Vito Corleone grows up in Sicily and in 1910s New York. In the 1950s, Michael Corleone attempts to expand the family business into Las Vegas, Hollywood and Cuba.',
    posterUrl: tmdbPoster('hek3koDUyRQk7FIhPXsa6mT2Zc3'),
    genres: ['Drama', 'Crime'],
    directors: ['Francis Ford Coppola'],
    writers: ['Francis Ford Coppola', 'Mario Puzo'],
    cast: [
      'Al Pacino',
      'Robert Duvall',
      'Diane Keaton',
      'Robert De Niro',
      'John Cazale',
      'Talia Shire',
    ],
  },
  // https://www.themoviedb.org/movie/165
  {
    title: 'Back to the Future Part II',
    releaseDate: '1989-11-22',
    runtimeMinutes: 108,
    synopsis:
      'Marty and Doc are at it again as the time-traveling duo head to 2015 to nip some McFly family woes in the bud. But things go awry thanks to bully Biff Tannen and a pesky sports almanac. In a last-ditch attempt to set things straight, Marty finds himself bound for 1955 and face to face with his teenage parents -- again.',
    posterUrl: tmdbPoster('hQq8xZe5uLjFzSBt4LanNP7SQjl'),
    genres: ['Adventure', 'Comedy', 'Science Fiction'],
    directors: ['Robert Zemeckis'],
    writers: ['Bob Gale'],
    cast: [
      'Michael J. Fox',
      'Christopher Lloyd',
      'Lea Thompson',
      'Thomas F. Wilson',
      'Elisabeth Shue',
      'James Tolkan',
    ],
  },
  // https://www.themoviedb.org/movie/489
  {
    title: 'Good Will Hunting',
    releaseDate: '1997-12-05',
    runtimeMinutes: 127,
    synopsis:
      "Will Hunting is a headstrong, working-class genius who is failing the lessons of life. After one too many run-ins with the law, Will's last chance is a psychology professor, who might be the only man who can reach him.",
    posterUrl: tmdbPoster('z2FnLKpFi1HPO7BEJxdkv6hpJSU'),
    genres: ['Drama'],
    directors: ['Gus Van Sant'],
    writers: ['Ben Affleck', 'Matt Damon'],
    cast: [
      'Matt Damon',
      'Robin Williams',
      'Ben Affleck',
      'Stellan Skarsgård',
      'Minnie Driver',
      'Casey Affleck',
    ],
  },
  // https://www.themoviedb.org/movie/350
  {
    title: 'The Devil Wears Prada',
    releaseDate: '2006-06-29',
    runtimeMinutes: 109,
    synopsis:
      'A young woman from the Midwest gets more than she bargained for when she moves to New York to become a writer and ends up as the assistant to the tyrannical, larger-than-life editor-in-chief of a major fashion magazine.',
    posterUrl: tmdbPoster('8912AsVuS7Sj915apArUFbv6F9L'),
    genres: ['Drama', 'Comedy'],
    directors: ['David Frankel'],
    writers: ['Aline Brosh McKenna'],
    cast: [
      'Meryl Streep',
      'Anne Hathaway',
      'Emily Blunt',
      'Stanley Tucci',
      'Simon Baker',
      'Adrian Grenier',
    ],
  },
  // https://www.themoviedb.org/movie/185
  {
    title: 'A Clockwork Orange',
    releaseDate: '1971-10-28',
    runtimeMinutes: 137,
    synopsis:
      "In a near-future Britain, young Alexander DeLarge and his pals get their kicks beating and raping anyone they please. When not destroying the lives of others, Alex swoons to the music of Beethoven. The state, eager to crack down on juvenile crime, gives an incarcerated Alex the option to undergo an invasive procedure that'll rob him of all personal agency. In a time when conscience is a commodity, can Alex change his tune?",
    posterUrl: tmdbPoster('4sHeTAp65WrSSuc05nRBKddhBxO'),
    genres: ['Science Fiction', 'Crime'],
    directors: ['Stanley Kubrick'],
    writers: ['Stanley Kubrick'],
    cast: [
      'Malcolm McDowell',
      'Patrick Magee',
      'Carl Duering',
      'Michael Bates',
      'Warren Clarke',
      'James Marcus',
    ],
  },
  // https://www.themoviedb.org/movie/162
  {
    title: 'Edward Scissorhands',
    releaseDate: '1990-12-07',
    runtimeMinutes: 105,
    synopsis:
      'A small suburban town receives a visit from a castaway unfinished science experiment named Edward.',
    posterUrl: tmdbPoster('e0FqKFvGPdQNWG8tF9cZBtev9Em'),
    genres: ['Fantasy', 'Drama', 'Romance'],
    directors: ['Tim Burton'],
    writers: ['Caroline Thompson'],
    cast: [
      'Johnny Depp',
      'Winona Ryder',
      'Dianne Wiest',
      'Anthony Michael Hall',
      'Kathy Baker',
      'Robert Oliveri',
    ],
  },
  // https://www.themoviedb.org/movie/85
  {
    title: 'Raiders of the Lost Ark',
    releaseDate: '1981-06-12',
    runtimeMinutes: 115,
    synopsis:
      'When Dr. Indiana Jones – the tweed-suited professor who just happens to be a celebrated archaeologist – is hired by the government to locate the legendary Ark of the Covenant, he finds himself up against the entire Nazi regime.',
    posterUrl: tmdbPoster('ceG9VzoRAVGwivFU403Wc3AHRys'),
    genres: ['Adventure', 'Action'],
    directors: ['Steven Spielberg'],
    writers: ['Lawrence Kasdan'],
    cast: [
      'Harrison Ford',
      'Karen Allen',
      'Paul Freeman',
      'John Rhys-Davies',
      'Ronald Lacey',
      'Wolf Kahler',
    ],
  },
  // https://www.themoviedb.org/movie/809
  {
    title: 'Shrek 2',
    releaseDate: '2004-05-19',
    runtimeMinutes: 92,
    synopsis:
      'Happily ever after never seemed so far far away when a trip to meet the in-laws turns into a hilariously twisted adventure for Shrek and Fiona. With the help of ever-faithful Donkey, Shrek takes on the potion-brewing Fairy Godmother, pompous Prince Charming, and infamous ogre-killer Puss In Boots.',
    posterUrl: tmdbPoster('2yYP0PQjG8zVqturh1BAqu2Tixl'),
    genres: ['Animation', 'Comedy', 'Family', 'Fantasy', 'Romance'],
    directors: ['Andrew Adamson', 'Kelly Asbury', 'Conrad Vernon'],
    writers: ['Andrew Adamson', 'Joe Stillman', 'J. David Stem', 'David N. Weiss'],
    cast: [
      'Mike Myers',
      'Eddie Murphy',
      'Cameron Diaz',
      'Julie Andrews',
      'Antonio Banderas',
      'John Cleese',
    ],
  },
  // https://www.themoviedb.org/movie/103
  {
    title: 'Taxi Driver',
    releaseDate: '1976-02-09',
    runtimeMinutes: 114,
    synopsis:
      'Suffering from insomnia, disturbed loner Travis Bickle takes a job as a New York City cabbie, haunting the streets nightly, growing increasingly detached from reality as he dreams of cleaning up the filthy city.',
    posterUrl: tmdbPoster('ekstpH614fwDX8DUln1a2Opz0N8'),
    genres: ['Crime', 'Drama'],
    directors: ['Martin Scorsese'],
    writers: ['Paul Schrader'],
    cast: [
      'Robert De Niro',
      'Jodie Foster',
      'Cybill Shepherd',
      'Harvey Keitel',
      'Peter Boyle',
      'Leonard Harris',
    ],
  },
  // https://www.themoviedb.org/movie/141
  {
    title: 'Donnie Darko',
    releaseDate: '2001-01-19',
    runtimeMinutes: 114,
    synopsis:
      'After narrowly escaping a bizarre accident, a troubled teenager is plagued by visions of a large bunny rabbit that manipulates him to commit a series of crimes.',
    posterUrl: tmdbPoster('j2AtZFsflxiluaNtajMTI0Avm8C'),
    genres: ['Fantasy', 'Drama', 'Mystery'],
    directors: ['Richard Kelly'],
    writers: ['Richard Kelly'],
    cast: [
      'Jake Gyllenhaal',
      'Jena Malone',
      'James Duval',
      'Drew Barrymore',
      'Beth Grant',
      'Maggie Gyllenhaal',
    ],
  },
  // https://www.themoviedb.org/movie/111
  {
    title: 'Scarface',
    releaseDate: '1983-12-09',
    runtimeMinutes: 170,
    synopsis:
      'After getting a green card in exchange for assassinating a Cuban government official, Tony Montana stakes a claim on the drug trade in Miami. Viciously murdering anyone who stands in his way, Tony eventually becomes the biggest drug lord in the state, controlling nearly all the cocaine that comes through Miami. But increased pressure from the police, wars with Colombian drug cartels and his own drug-fueled paranoia serve to fuel the flames of his eventual downfall.',
    posterUrl: tmdbPoster('iQ5ztdjvteGeboxtmRdXEChJOHh'),
    genres: ['Action', 'Crime', 'Drama'],
    directors: ['Brian De Palma'],
    writers: ['Oliver Stone'],
    cast: [
      'Al Pacino',
      'Steven Bauer',
      'Michelle Pfeiffer',
      'Mary Elizabeth Mastrantonio',
      'Robert Loggia',
      'Miriam Colon',
    ],
  },
  // https://www.themoviedb.org/movie/14
  {
    title: 'American Beauty',
    releaseDate: '1999-09-15',
    runtimeMinutes: 122,
    synopsis:
      "Lester Burnham, a depressed suburban father in a mid-life crisis, decides to turn his hectic life around after developing an infatuation with his daughter's attractive friend.",
    posterUrl: tmdbPoster('wby9315QzVKdW9BonAefg8jGTTb'),
    genres: ['Drama'],
    directors: ['Sam Mendes'],
    writers: ['Alan Ball'],
    cast: [
      'Kevin Spacey',
      'Annette Bening',
      'Thora Birch',
      'Wes Bentley',
      'Mena Suvari',
      'Peter Gallagher',
    ],
  },
  // https://www.themoviedb.org/movie/745
  {
    title: 'The Sixth Sense',
    releaseDate: '1999-08-06',
    runtimeMinutes: 107,
    synopsis:
      'Following an unexpected tragedy, child psychologist Malcolm Crowe meets a nine year old boy named Cole Sear, who is hiding a dark secret.',
    posterUrl: tmdbPoster('vOyfUXNFSnaTk7Vk5AjpsKTUWsu'),
    genres: ['Mystery', 'Thriller', 'Drama'],
    directors: ['M. Night Shyamalan'],
    writers: ['M. Night Shyamalan'],
    cast: [
      'Bruce Willis',
      'Haley Joel Osment',
      'Toni Collette',
      'Olivia Williams',
      'Trevor Morgan',
      'Donnie Wahlberg',
    ],
  },
  // https://www.themoviedb.org/movie/1724
  {
    title: 'The Incredible Hulk',
    releaseDate: '2008-06-12',
    runtimeMinutes: 114,
    synopsis:
      'Scientist Bruce Banner scours the planet for an antidote to the unbridled force of rage within him: the Hulk. But when the military masterminds who dream of exploiting his powers force him back to civilization, he finds himself coming face to face with a new, deadly foe.',
    posterUrl: tmdbPoster('gKzYx79y0AQTL4UAk1cBQJ3nvrm'),
    genres: ['Science Fiction', 'Action', 'Adventure'],
    directors: ['Louis Leterrier'],
    writers: ['Zak Penn'],
    cast: [
      'Edward Norton',
      'Liv Tyler',
      'Tim Roth',
      'William Hurt',
      'Tim Blake Nelson',
      'Ty Burrell',
    ],
  },
  // https://www.themoviedb.org/movie/207
  {
    title: 'Dead Poets Society',
    releaseDate: '1989-06-02',
    runtimeMinutes: 129,
    synopsis:
      'At an elite, old-fashioned boarding school in New England, a passionate English teacher inspires his students to rebel against convention and seize the potential of every day, courting the disdain of the stern headmaster.',
    posterUrl: tmdbPoster('tNvKkSnnn4Z6RCBThyK1gfCSSvv'),
    genres: ['Drama'],
    directors: ['Peter Weir'],
    writers: ['Tom Schulman'],
    cast: [
      'Robin Williams',
      'Robert Sean Leonard',
      'Ethan Hawke',
      'Josh Charles',
      'Gale Hansen',
      'Dylan Kussman',
    ],
  },
  // https://www.themoviedb.org/movie/62
  {
    title: '2001: A Space Odyssey',
    releaseDate: '1968-04-02',
    runtimeMinutes: 149,
    synopsis:
      "Humanity finds a mysterious object buried beneath the lunar surface and sets off to find its origins with the help of HAL 9000, the world's most advanced super computer.",
    posterUrl: tmdbPoster('ve72VxNqjGM69Uky4WTo2bK6rfq'),
    genres: ['Science Fiction', 'Mystery', 'Adventure'],
    directors: ['Stanley Kubrick'],
    writers: ['Stanley Kubrick', 'Arthur C. Clarke'],
    cast: [
      'Keir Dullea',
      'Gary Lockwood',
      'William Sylvester',
      'Douglas Rain',
      'Daniel Richter',
      'Leonard Rossiter',
    ],
  },
  // https://www.themoviedb.org/movie/73
  {
    title: 'American History X',
    releaseDate: '1998-07-01',
    runtimeMinutes: 119,
    synopsis:
      "Derek Vineyard is paroled after serving 3 years in prison for killing two African-American men. Through his brother, Danny Vineyard's narration, we learn that before going to prison, Derek was a skinhead and the leader of a violent white supremacist gang that committed acts of racial crime throughout L.A. and his actions greatly influenced Danny. Reformed and fresh out of prison, Derek severs contact with the gang and becomes determined to keep Danny from going down the same violent path as he did.",
    posterUrl: tmdbPoster('x2drgoXYZ8484lqyDj7L1CEVR4T'),
    genres: ['Drama'],
    directors: ['Tony Kaye'],
    writers: ['David McKenna'],
    cast: [
      'Edward Norton',
      'Edward Furlong',
      "Beverly D'Angelo",
      'Jennifer Lien',
      'Ethan Suplee',
      'Fairuza Balk',
    ],
  },
  // https://www.themoviedb.org/movie/161
  {
    title: "Ocean's Eleven",
    releaseDate: '2001-12-07',
    runtimeMinutes: 116,
    synopsis:
      "Less than 24 hours into his parole, charismatic thief Danny Ocean is already rolling out his next plan: In one night, Danny's hand-picked crew of specialists will attempt to steal more than $150 million from three Las Vegas casinos. But to score the cash, Danny risks his chances of reconciling with ex-wife, Tess.",
    posterUrl: tmdbPoster('hQQCdZrsHtZyR6NbKH2YyCqd2fR'),
    genres: ['Thriller', 'Crime'],
    directors: ['Steven Soderbergh'],
    writers: ['Ted Griffin'],
    cast: [
      'George Clooney',
      'Brad Pitt',
      'Andy Garcia',
      'Matt Damon',
      'Julia Roberts',
      'Casey Affleck',
    ],
  },
  // https://www.themoviedb.org/movie/771
  {
    title: 'Home Alone',
    releaseDate: '1990-11-16',
    runtimeMinutes: 103,
    synopsis:
      'Eight-year-old Kevin McCallister makes the most of the situation after his family unwittingly leaves him behind when they go on Christmas vacation. When thieves try to break into his home, he puts up a fight like no other.',
    posterUrl: tmdbPoster('onTSipZ8R3bliBdKfPtsDuHTdlL'),
    genres: ['Comedy', 'Family'],
    directors: ['Chris Columbus'],
    writers: ['John Hughes'],
    cast: [
      'Macaulay Culkin',
      'Joe Pesci',
      'Daniel Stern',
      'John Heard',
      'Roberts Blossom',
      "Catherine O'Hara",
    ],
  },
  // https://www.themoviedb.org/movie/194
  {
    title: 'Amélie',
    releaseDate: '2001-04-25',
    runtimeMinutes: 122,
    synopsis:
      'At a tiny Parisian café, the adorable yet painfully shy Amélie accidentally discovers a gift for helping others. Soon Amelie is spending her days as a matchmaker, guardian angel, and all-around do-gooder. But when she bumps into a handsome stranger, will she find the courage to become the star of her very own love story?',
    posterUrl: tmdbPoster('nSxDa3M9aMvGVLoItzWTepQ5h5d'),
    genres: ['Comedy', 'Romance'],
    directors: ['Jean-Pierre Jeunet'],
    writers: ['Jean-Pierre Jeunet', 'Guillaume Laurant'],
    cast: [
      'Audrey Tautou',
      'Mathieu Kassovitz',
      'Rufus',
      'Serge Merlin',
      'Jamel Debbouze',
      'Clotilde Mollet',
    ],
  },
  // https://www.themoviedb.org/movie/1359
  {
    title: 'American Psycho',
    releaseDate: '2000-04-13',
    runtimeMinutes: 102,
    synopsis:
      'A wealthy New York investment banking executive hides his alternate psychopathic ego from his co-workers and friends as he escalates deeper into his illogical, gratuitous fantasies.',
    posterUrl: tmdbPoster('9uGHEgsiUXjCNq8wdq4r49YL8A1'),
    genres: ['Thriller', 'Drama', 'Crime'],
    directors: ['Mary Harron'],
    writers: ['Mary Harron', 'Guinevere Turner'],
    cast: [
      'Christian Bale',
      'Justin Theroux',
      'Josh Lucas',
      'Bill Sage',
      'Chloë Sevigny',
      'Reese Witherspoon',
    ],
  },
  // https://www.themoviedb.org/movie/562
  {
    title: 'Die Hard',
    releaseDate: '1988-07-15',
    runtimeMinutes: 132,
    synopsis:
      "High above the city of L.A. a team of terrorists has seized a building, taken hostages, and declared war. One man has manages to escape... An off-duty cop hiding somewhere inside. He's alone, tired... and the only chance anyone has got.",
    posterUrl: tmdbPoster('7Bjd8kfmDSOzpmhySpEhkUyK2oH'),
    genres: ['Action', 'Thriller'],
    directors: ['John McTiernan'],
    writers: ['Steven E. de Souza', 'Jeb Stuart'],
    cast: [
      'Bruce Willis',
      'Alan Rickman',
      'Alexander Godunov',
      'Bonnie Bedelia',
      'Reginald VelJohnson',
      'Paul Gleason',
    ],
  },
  // https://www.themoviedb.org/movie/115
  {
    title: 'The Big Lebowski',
    releaseDate: '1998-03-06',
    runtimeMinutes: 117,
    synopsis:
      "Jeffrey 'The Dude' Lebowski, a Los Angeles slacker who only wants to bowl and drink White Russians, is mistaken for another Jeffrey Lebowski, a wheelchair-bound millionaire, and finds himself dragged into a strange series of events involving nihilists, adult film producers, ferrets, errant toes, and large sums of money.",
    posterUrl: tmdbPoster('3bv6WAp6BSxxYvB5ozKFUYuRA8C'),
    genres: ['Comedy', 'Crime'],
    directors: ['Joel Coen', 'Ethan Coen'],
    writers: ['Joel Coen', 'Ethan Coen'],
    cast: [
      'Jeff Bridges',
      'John Goodman',
      'Julianne Moore',
      'Steve Buscemi',
      'David Huddleston',
      'Philip Seymour Hoffman',
    ],
  },
  // https://www.themoviedb.org/movie/812
  {
    title: 'Aladdin',
    releaseDate: '1992-11-25',
    runtimeMinutes: 91,
    synopsis:
      'In the boorish city of Agrabah, kind-hearted street urchin Aladdin and Princess Jasmine fall in love, although she can only marry a prince. He and power-hungry Grand Vizier Jafar vie for a magic lamp that can fulfill their wishes.',
    posterUrl: tmdbPoster('eLFfl7vS8dkeG1hKp5mwbm37V83'),
    genres: ['Animation', 'Family', 'Adventure', 'Fantasy', 'Romance'],
    directors: ['Ron Clements', 'John Musker'],
    writers: ['Ron Clements', 'John Musker', 'Terry Rossio', 'Ted Elliott'],
    cast: [
      'Scott Weinger',
      'Robin Williams',
      'Linda Larkin',
      'Jonathan Freeman',
      'Gilbert Gottfried',
      'Douglas Seale',
    ],
  },
  // https://www.themoviedb.org/movie/601
  {
    title: 'E.T. the Extra-Terrestrial',
    releaseDate: '1982-06-11',
    runtimeMinutes: 115,
    synopsis:
      'An alien is left behind on Earth and saved by the 10-year-old Elliott who decides to keep him hidden in his home. While a task force hunts for the extra-terrestrial, Elliott, his brother, and his little sister Gertie form an emotional bond with their new friend, and try to help him find his way home.',
    posterUrl: tmdbPoster('an0nD6uq6byfxXCfk6lQBzdL2J1'),
    genres: ['Adventure', 'Science Fiction', 'Family'],
    directors: ['Steven Spielberg'],
    writers: ['Melissa Mathison'],
    cast: [
      'Henry Thomas',
      'Drew Barrymore',
      'Robert MacNaughton',
      'Peter Coyote',
      'Dee Wallace',
      'Erika Eleniak',
    ],
  },
  // https://www.themoviedb.org/movie/604
  {
    title: 'The Matrix Reloaded',
    releaseDate: '2003-05-15',
    runtimeMinutes: 138,
    synopsis:
      'The Resistance builds in numbers as humans are freed from the Matrix and brought to the city of Zion. Neo discovers his superpowers, including the ability to see the code inside the Matrix. With machine sentinels digging to Zion in 72 hours, Neo, Morpheus and Trinity must find the Keymaker to ultimately reach the Source.',
    posterUrl: tmdbPoster('aA5qHS0FbSXO8PxcxUIHbDrJyuh'),
    genres: ['Adventure', 'Action', 'Thriller', 'Science Fiction'],
    directors: ['Lana Wachowski', 'Lilly Wachowski'],
    writers: ['Lana Wachowski', 'Lilly Wachowski'],
    cast: [
      'Keanu Reeves',
      'Laurence Fishburne',
      'Carrie-Anne Moss',
      'Hugo Weaving',
      'Jada Pinkett Smith',
      'Gloria Foster',
    ],
  },
  // https://www.themoviedb.org/movie/18
  {
    title: 'The Fifth Element',
    releaseDate: '1997-05-02',
    runtimeMinutes: 126,
    synopsis:
      'In 2257, a taxi driver is unintentionally given the task of saving a young girl who is part of the key that will ensure the survival of humanity.',
    posterUrl: tmdbPoster('fPtlCO1yQtnoLHOwKtWz7db6RGU'),
    genres: ['Science Fiction', 'Action', 'Adventure'],
    directors: ['Luc Besson'],
    writers: ['Luc Besson', 'Robert Mark Kamen'],
    cast: [
      'Bruce Willis',
      'Milla Jovovich',
      'Gary Oldman',
      'Ian Holm',
      'Chris Tucker',
      'Luke Perry',
    ],
  },
  // https://www.themoviedb.org/movie/953
  {
    title: 'Madagascar',
    releaseDate: '2005-05-25',
    runtimeMinutes: 86,
    synopsis:
      'Four animal friends get a taste of the wild life when they break out of captivity at the Central Park Zoo and wash ashore on the island of Madagascar.',
    posterUrl: tmdbPoster('zMpJY5CJKUufG9OTw0In4eAFqPX'),
    genres: ['Adventure', 'Animation', 'Comedy', 'Family'],
    directors: ['Eric Darnell', 'Tom McGrath'],
    writers: ['Eric Darnell', 'Tom McGrath', 'Billy Frolick', 'Mark Burton'],
    cast: [
      'Ben Stiller',
      'Chris Rock',
      'David Schwimmer',
      'Jada Pinkett Smith',
      'Sacha Baron Cohen',
      'Cedric the Entertainer',
    ],
  },
  // https://www.themoviedb.org/movie/578
  {
    title: 'Jaws',
    releaseDate: '1975-06-20',
    runtimeMinutes: 124,
    synopsis:
      "When the seaside community of Amity finds itself under attack by a dangerous great white shark, the town's chief of police, a young marine biologist, and a grizzled shark hunter embark on a desperate quest to kill the beast before it strikes again.",
    posterUrl: tmdbPoster('lxM6kqilAdpdhqUl2biYp5frUxE'),
    genres: ['Horror', 'Thriller', 'Adventure'],
    directors: ['Steven Spielberg'],
    writers: ['Peter Benchley', 'Carl Gottlieb'],
    cast: [
      'Roy Scheider',
      'Robert Shaw',
      'Richard Dreyfuss',
      'Lorraine Gary',
      'Murray Hamilton',
      'Carl Gottlieb',
    ],
  },
  // https://www.themoviedb.org/movie/196
  {
    title: 'Back to the Future Part III',
    releaseDate: '1990-05-25',
    runtimeMinutes: 119,
    synopsis:
      'The final installment finds Marty digging the trusty DeLorean out of a mineshaft and looking for Doc in the Wild West of 1885. But when their time machine breaks down, the travelers are stranded in a land of spurs. More problems arise when Doc falls for pretty schoolteacher Clara Clayton, and Marty tangles with Buford Tannen.',
    posterUrl: tmdbPoster('crzoVQnMzIrRfHtQw0tLBirNfVg'),
    genres: ['Adventure', 'Comedy', 'Science Fiction'],
    directors: ['Robert Zemeckis'],
    writers: ['Bob Gale'],
    cast: [
      'Michael J. Fox',
      'Christopher Lloyd',
      'Mary Steenburgen',
      'Thomas F. Wilson',
      'Lea Thompson',
      'Elisabeth Shue',
    ],
  },
  // https://www.themoviedb.org/movie/411
  {
    title: 'The Chronicles of Narnia: The Lion, the Witch and the Wardrobe',
    releaseDate: '2005-12-07',
    runtimeMinutes: 143,
    synopsis:
      "Siblings Lucy, Edmund, Susan and Peter step through a magical wardrobe and find the land of Narnia. There, they discover a charming, once peaceful kingdom that has been plunged into eternal winter by the evil White Witch, Jadis. Aided by the wise and magnificent lion, Aslan, the children lead Narnia into a spectacular, climactic battle to be free of the Witch's glacial powers forever.",
    posterUrl: tmdbPoster('iREd0rNCjYdf5Ar0vfaW32yrkm'),
    genres: ['Adventure', 'Family', 'Fantasy'],
    directors: ['Andrew Adamson'],
    writers: ['Andrew Adamson', 'Ann Peacock', 'Stephen McFeely', 'Christopher Markus'],
    cast: [
      'William Moseley',
      'Anna Popplewell',
      'Skandar Keynes',
      'Georgie Henley',
      'Liam Neeson',
      'Tilda Swinton',
    ],
  },
  // https://www.themoviedb.org/movie/310
  {
    title: 'Bruce Almighty',
    releaseDate: '2003-05-23',
    runtimeMinutes: 101,
    synopsis:
      'Bruce Nolan toils as a "human interest" television reporter in Buffalo, NY, but despite his high ratings and the love of his beautiful girlfriend, Bruce remains unfulfilled. At the end of the worst day in his life, he angrily ridicules God — and the Almighty responds, endowing Bruce with all of His divine powers.',
    posterUrl: tmdbPoster('wqkWrOFtYnZSvIMu8Lsmz7WIvKC'),
    genres: ['Fantasy', 'Comedy'],
    directors: ['Tom Shadyac'],
    writers: ['Steve Koren', "Mark O'Keefe", 'Steve Oedekerk'],
    cast: [
      'Jim Carrey',
      'Morgan Freeman',
      'Jennifer Aniston',
      'Philip Baker Hall',
      'Catherine Bell',
      'Lisa Ann Walter',
    ],
  },
  // https://www.themoviedb.org/movie/600
  {
    title: 'Full Metal Jacket',
    releaseDate: '1987-06-26',
    runtimeMinutes: 117,
    synopsis:
      'A pragmatic U.S. Marine observes the dehumanizing effects the U.S.-Vietnam War has on his fellow recruits from their brutal boot camp training to the bloody street fighting in Hue.',
    posterUrl: tmdbPoster('kMKyx1k8hWWscYFnPbnxxN4Eqo4'),
    genres: ['Drama', 'War'],
    directors: ['Stanley Kubrick'],
    writers: ['Stanley Kubrick', 'Gustav Hasford', 'Michael Herr'],
    cast: [
      'Matthew Modine',
      'Adam Baldwin',
      "Vincent D'Onofrio",
      'R. Lee Ermey',
      'Dorian Harewood',
      'Kevyn Major Howard',
    ],
  },
  // https://www.themoviedb.org/movie/1417
  {
    title: "Pan's Labyrinth",
    releaseDate: '2006-10-11',
    runtimeMinutes: 118,
    synopsis:
      'In post–civil war Spain, 10-year-old Ofelia moves with her pregnant mother to live under the control of her cruel stepfather. Drawn into a mysterious labyrinth, she meets a faun who reveals that she may be a lost princess from an underground kingdom. To return to her true father, she must complete a series of surreal and perilous tasks that blur the line between reality and fantasy.',
    posterUrl: tmdbPoster('z7xXihu5wHuSMWymq5VAulPVuvg'),
    genres: ['Fantasy', 'Drama', 'War'],
    directors: ['Guillermo del Toro'],
    writers: ['Guillermo del Toro'],
    cast: [
      'Ivana Baquero',
      'Sergi López',
      'Maribel Verdú',
      'Doug Jones',
      'Ariadna Gil',
      'Álex Angulo',
    ],
  },
  // https://www.themoviedb.org/movie/510
  {
    title: "One Flew Over the Cuckoo's Nest",
    releaseDate: '1975-11-19',
    runtimeMinutes: 135,
    synopsis:
      'A petty criminal fakes insanity to serve his sentence in a mental ward rather than prison. He soon finds himself as a leader to the other patients—and an enemy to the cruel, domineering nurse who runs the ward.',
    posterUrl: tmdbPoster('kjWsMh72V6d8KRLV4EOoSJLT1H7'),
    genres: ['Drama'],
    directors: ['Miloš Forman'],
    writers: ['Bo Goldman', 'Lawrence Hauben'],
    cast: [
      'Jack Nicholson',
      'Brad Dourif',
      'Louise Fletcher',
      'Danny DeVito',
      'William Redfield',
      'Scatman Crothers',
    ],
  },
  // https://www.themoviedb.org/movie/629
  {
    title: 'The Usual Suspects',
    releaseDate: '1995-07-19',
    runtimeMinutes: 106,
    synopsis:
      "Held in an L.A. interrogation room, Verbal Kint attempts to convince the feds that a mythic crime lord, Keyser Soze, not only exists, but was also responsible for drawing him and his four partners into a multi-million dollar heist that ended with an explosion in San Pedro harbor – leaving few survivors. Verbal lures his interrogators with an incredible story of the crime lord's almost supernatural prowess.",
    posterUrl: tmdbPoster('99X2SgyFunJFXGAYnDv3sb9pnUD'),
    genres: ['Drama', 'Crime', 'Thriller'],
    directors: ['Bryan Singer'],
    writers: ['Christopher McQuarrie'],
    cast: [
      'Stephen Baldwin',
      'Gabriel Byrne',
      'Benicio del Toro',
      'Kevin Pollak',
      'Kevin Spacey',
      'Chazz Palminteri',
    ],
  },
  // https://www.themoviedb.org/movie/854
  {
    title: 'The Mask',
    releaseDate: '1994-07-29',
    runtimeMinutes: 101,
    synopsis:
      'Timid bank clerk Stanley Ipkiss discovers a magical mask infused with the spirit of the Norse god Loki. Donning it transforms him into an unrestrained, green-faced, cartoon-like wild man. While the mask grants him the confidence to woo a local singer, it also makes him the target of a ruthless mobster.',
    posterUrl: tmdbPoster('jPC2eYub74zwf2tPGVtzSlBW6Oy'),
    genres: ['Comedy', 'Fantasy', 'Crime', 'Romance'],
    directors: ['Chuck Russell'],
    writers: ['Mike Werb'],
    cast: [
      'Jim Carrey',
      'Peter Riegert',
      'Peter Greene',
      'Amy Yasbeck',
      'Richard Jeni',
      'Orestes Matacena',
    ],
  },
  // https://www.themoviedb.org/movie/787
  {
    title: 'Mr. & Mrs. Smith',
    releaseDate: '2005-06-07',
    runtimeMinutes: 120,
    synopsis:
      'A husband and wife struggle to keep their marriage alive until they realize they are both secretly working as assassins. Now, their respective assignments require them to kill each other.',
    posterUrl: tmdbPoster('kjD700RtyhveN3ZbOnSvUSne0Qj'),
    genres: ['Action', 'Comedy', 'Drama', 'Thriller'],
    directors: ['Doug Liman'],
    writers: ['Simon Kinberg'],
    cast: [
      'Angelina Jolie',
      'Brad Pitt',
      'Vince Vaughn',
      'Adam Brody',
      'Kerry Washington',
      'Keith David',
    ],
  },
  // https://www.themoviedb.org/movie/197
  {
    title: 'Braveheart',
    releaseDate: '1995-05-24',
    runtimeMinutes: 178,
    synopsis:
      "Enraged at the slaughter of Murron, his new bride and childhood love, Scottish warrior William Wallace slays a platoon of the local English lord's soldiers. This leads the village to revolt and, eventually, the entire country to rise up against English rule.",
    posterUrl: tmdbPoster('or1gBugydmjToAEq7OZY0owwFk'),
    genres: ['Action', 'Drama', 'History', 'War'],
    directors: ['Mel Gibson'],
    writers: ['Randall Wallace'],
    cast: [
      'Mel Gibson',
      'Catherine McCormack',
      'Sophie Marceau',
      'Patrick McGoohan',
      'Angus Macfadyen',
      'Brendan Gleeson',
    ],
  },
  // https://www.themoviedb.org/movie/652
  {
    title: 'Troy',
    releaseDate: '2004-05-13',
    runtimeMinutes: 163,
    synopsis:
      'In year 1250 B.C. during the late Bronze age, two emerging nations begin to clash. Paris, the Trojan prince, convinces Helen, Queen of Sparta, to leave her husband Menelaus, and sail with him back to Troy. After Menelaus finds out that his wife was taken by the Trojans, he asks his brother Agamemnon to help him get her back. Agamemnon sees this as an opportunity for power. They set off with 1,000 ships holding 50,000 Greeks to Troy.',
    posterUrl: tmdbPoster('a07wLy4ONfpsjnBqMwhlWTJTcm'),
    genres: ['War', 'Action', 'History'],
    directors: ['Wolfgang Petersen'],
    writers: ['David Benioff'],
    cast: ['Brad Pitt', 'Orlando Bloom', 'Eric Bana', 'Brian Cox', 'Sean Bean', 'Brendan Gleeson'],
  },
  // https://www.themoviedb.org/movie/453
  {
    title: 'A Beautiful Mind',
    releaseDate: '2001-12-14',
    runtimeMinutes: 135,
    synopsis:
      'From the heights of notoriety to the depths of depravity, John Forbes Nash Jr. experiences it all. As a brilliant but socially awkward mathematician, he made a groundbreaking discovery early in his career and stands on the brink of international acclaim. But as the handsome and arrogant Nash accepts secret work in cryptography, he becomes entangled in a mysterious conspiracy. His life takes a nightmarish turn and he soon finds himself on a painful and harrowing journey of self-discovery.',
    posterUrl: tmdbPoster('rEIg5yJdNOt9fmX4P8gU9LeNoTQ'),
    genres: ['Drama', 'Romance'],
    directors: ['Ron Howard'],
    writers: ['Akiva Goldsman'],
    cast: [
      'Russell Crowe',
      'Jennifer Connelly',
      'Ed Harris',
      'Paul Bettany',
      'Christopher Plummer',
      'Adam Goldberg',
    ],
  },
  // https://www.themoviedb.org/movie/89
  {
    title: 'Indiana Jones and the Last Crusade',
    releaseDate: '1989-05-24',
    runtimeMinutes: 127,
    synopsis:
      "In 1938, an art collector appeals to eminent archaeologist Dr. Indiana Jones to embark on a search for the Holy Grail. Indy learns that a medieval historian has vanished while searching for it, and the missing man is his own father, Dr. Henry Jones Sr.. He sets out to rescue his father by following clues in the old man's notebook, which his father had mailed to him before he went missing. Indy arrives in Venice, where he enlists the help of a beautiful academic, Dr. Elsa Schneider, along with Marcus Brody and Sallah. Together they must stop the Nazis from recovering the power of eternal life and taking over the world!",
    posterUrl: tmdbPoster('sizg1AU8f8JDZX4QIgE4pjUMBvx'),
    genres: ['Adventure', 'Action'],
    directors: ['Steven Spielberg'],
    writers: ['Jeffrey Boam'],
    cast: [
      'Harrison Ford',
      'Sean Connery',
      'Denholm Elliott',
      'Alison Doody',
      'John Rhys-Davies',
      'Julian Glover',
    ],
  },
  // https://www.themoviedb.org/movie/641
  {
    title: 'Requiem for a Dream',
    releaseDate: '2000-10-06',
    runtimeMinutes: 102,
    synopsis:
      'The drug-induced utopias of four Coney Island residents are shattered when their addictions run deep.',
    posterUrl: tmdbPoster('9BTwsLaMVHOGFlmsSlx5QYCaXb'),
    genres: ['Crime', 'Drama'],
    directors: ['Darren Aronofsky'],
    writers: ['Darren Aronofsky', 'Hubert Selby Jr.'],
    cast: [
      'Ellen Burstyn',
      'Jared Leto',
      'Jennifer Connelly',
      'Marlon Wayans',
      'Christopher McDonald',
      'Louise Lasser',
    ],
  },
  // https://www.themoviedb.org/movie/539
  {
    title: 'Psycho',
    releaseDate: '1960-06-22',
    runtimeMinutes: 109,
    synopsis:
      'When larcenous real estate clerk Marion Crane goes on the lam with a wad of cash and hopes of starting a new life, she ends up at the notorious Bates Motel, where manager Norman Bates cares for his housebound mother.',
    posterUrl: tmdbPoster('yz4QVqPx3h1hD1DfqqQkCq3rmxW'),
    genres: ['Horror', 'Thriller', 'Mystery'],
    directors: ['Alfred Hitchcock'],
    writers: ['Joseph Stefano'],
    cast: [
      'Anthony Perkins',
      'Janet Leigh',
      'Vera Miles',
      'John Gavin',
      'Martin Balsam',
      'John McIntire',
    ],
  },
  // https://www.themoviedb.org/movie/1593
  {
    title: 'Night at the Museum',
    releaseDate: '2006-12-20',
    runtimeMinutes: 108,
    synopsis:
      'Chaos reigns at the natural history museum when night watchman Larry Daley accidentally stirs up an ancient curse, awakening Attila the Hun, an army of gladiators, a Tyrannosaurus rex and other exhibits.',
    posterUrl: tmdbPoster('pDsAAYf6Zn0yiAGJ6lYGs6hoZ4E'),
    genres: ['Fantasy', 'Family', 'Comedy'],
    directors: ['Shawn Levy'],
    writers: ['Robert Ben Garant', 'Thomas Lennon'],
    cast: [
      'Ben Stiller',
      'Carla Gugino',
      'Dick Van Dyke',
      'Mickey Rooney',
      'Bill Cobbs',
      'Jake Cherry',
    ],
  },
  // https://www.themoviedb.org/movie/679
  {
    title: 'Aliens',
    releaseDate: '1986-07-18',
    runtimeMinutes: 137,
    synopsis:
      "Ripley, the sole survivor of the Nostromo's deadly encounter with the monstrous Alien, returns to Earth after drifting through space in hypersleep for 57 years. Although her story is initially met with skepticism, she agrees to accompany a team of Colonial Marines back to LV-426.",
    posterUrl: tmdbPoster('r1x5JGpyqZU8PYhbs4UcrO1Xb6x'),
    genres: ['Action', 'Thriller', 'Science Fiction'],
    directors: ['James Cameron'],
    writers: ['James Cameron'],
    cast: [
      'Sigourney Weaver',
      'Carrie Henn',
      'Michael Biehn',
      'Paul Reiser',
      'Lance Henriksen',
      'Bill Paxton',
    ],
  },
  // https://www.themoviedb.org/movie/605
  {
    title: 'The Matrix Revolutions',
    releaseDate: '2003-11-05',
    runtimeMinutes: 129,
    synopsis:
      'The human city of Zion defends itself against the massive invasion of the machines as Neo fights to end the war at another front while also opposing the rogue Agent Smith.',
    posterUrl: tmdbPoster('bkkS61w94ZVMNVd8KEyyJl2tnY5'),
    genres: ['Adventure', 'Action', 'Thriller', 'Science Fiction'],
    directors: ['Lilly Wachowski', 'Lana Wachowski'],
    writers: ['Lilly Wachowski', 'Lana Wachowski'],
    cast: [
      'Keanu Reeves',
      'Laurence Fishburne',
      'Carrie-Anne Moss',
      'Hugo Weaving',
      'Jada Pinkett Smith',
      'Mary Alice',
    ],
  },
  // https://www.themoviedb.org/movie/608
  {
    title: 'Men in Black II',
    releaseDate: '2002-07-03',
    runtimeMinutes: 88,
    synopsis:
      "Kay and Jay reunite to provide our best, last and only line of defense against a sinister seductress who levels the toughest challenge yet to the MIB's untarnished mission statement – protecting Earth from the scum of the universe. It's been four years since the alien-seeking agents averted an intergalactic disaster of epic proportions. Now it's a race against the clock as Jay must convince Kay – who not only has absolutely no memory of his time spent with the MIB, but is also the only living person left with the expertise to save the galaxy – to reunite with the MIB before the earth submits to ultimate destruction.",
    posterUrl: tmdbPoster('enA22EPyzc2WQ1VVyY7zxresQQr'),
    genres: ['Action', 'Comedy', 'Science Fiction'],
    directors: ['Barry Sonnenfeld'],
    writers: ['Robert Gordon', 'Barry Fanaro'],
    cast: [
      'Tommy Lee Jones',
      'Will Smith',
      'Rip Torn',
      'Lara Flynn Boyle',
      'Johnny Knoxville',
      'Rosario Dawson',
    ],
  },
  // https://www.themoviedb.org/movie/772
  {
    title: 'Home Alone 2: Lost in New York',
    releaseDate: '1992-11-15',
    runtimeMinutes: 120,
    synopsis:
      "Instead of flying to Florida with his folks, Kevin ends up alone in New York, where he gets a hotel room with his dad's credit card—despite problems from a clerk and meddling bellboy. But when Kevin runs into his old nemeses, the Wet Bandits, he's determined to foil their plans to rob a toy store on Christmas Eve.",
    posterUrl: tmdbPoster('uuitWHpJwxD1wruFl2nZHIb4UGN'),
    genres: ['Comedy', 'Family', 'Adventure'],
    directors: ['Chris Columbus'],
    writers: ['John Hughes'],
    cast: [
      'Macaulay Culkin',
      'Joe Pesci',
      'Daniel Stern',
      "Catherine O'Hara",
      'John Heard',
      'Brenda Fricker',
    ],
  },
  // https://www.themoviedb.org/movie/1402
  {
    title: 'The Pursuit of Happyness',
    releaseDate: '2006-12-14',
    runtimeMinutes: 117,
    synopsis:
      "A struggling salesman takes custody of his son as he's poised to begin a life-changing professional career.",
    posterUrl: tmdbPoster('lBYOKAMcxIvuk9s9hMuecB9dPBV'),
    genres: ['Drama'],
    directors: ['Gabriele Muccino'],
    writers: ['Steven Conrad'],
    cast: [
      'Will Smith',
      'Jaden Smith',
      'Thandiwe Newton',
      'Brian Howe',
      'James Karen',
      'Dan Castellaneta',
    ],
  },
  // https://www.themoviedb.org/movie/602
  {
    title: 'Independence Day',
    releaseDate: '1996-07-02',
    runtimeMinutes: 145,
    synopsis:
      "Strange phenomena surface around the globe. The skies ignite. Terror races through the world's major cities. As these extraordinary events unfold, it becomes increasingly clear that a force of incredible magnitude has arrived. Its mission: total annihilation over the Fourth of July weekend. The last hope to stop the destruction is an unlikely group of people united by fate and unimaginable circumstances.",
    posterUrl: tmdbPoster('p0BPQGSPoSa8Ml0DAf2mB2kCU0R'),
    genres: ['Action', 'Adventure', 'Science Fiction'],
    directors: ['Roland Emmerich'],
    writers: ['Roland Emmerich', 'Dean Devlin'],
    cast: [
      'Will Smith',
      'Bill Pullman',
      'Jeff Goldblum',
      'Mary McDonnell',
      'Judd Hirsch',
      'Robert Loggia',
    ],
  },
  // https://www.themoviedb.org/movie/627
  {
    title: 'Trainspotting',
    releaseDate: '1996-02-23',
    runtimeMinutes: 94,
    synopsis:
      "Heroin addict Mark Renton stumbles through bad ideas and sobriety attempts with his unreliable friends --Sick Boy, Begbie, Spud and Tommy. He also has an underage girlfriend, Diane, along for the ride. After cleaning up and moving from Edinburgh to London, Mark finds he can't escape the life he left behind as Begbie and Sick Boy come knocking.",
    posterUrl: tmdbPoster('1jUC02qsqS2NxBMFarbIhcQtazV'),
    genres: ['Drama', 'Crime'],
    directors: ['Danny Boyle'],
    writers: ['John Hodge'],
    cast: [
      'Ewan McGregor',
      'Ewen Bremner',
      'Jonny Lee Miller',
      'Kevin McKidd',
      'Robert Carlyle',
      'Kelly Macdonald',
    ],
  },
  // https://www.themoviedb.org/movie/70
  {
    title: 'Million Dollar Baby',
    releaseDate: '2004-12-05',
    runtimeMinutes: 132,
    synopsis:
      "Despondent over a painful estrangement from his daughter, trainer Frankie Dunn isn't prepared for boxer Maggie Fitzgerald to enter his life. But Maggie's determined to go pro and to convince Dunn and his cohort to help her.",
    posterUrl: tmdbPoster('jcfEqKdWF1zeyvECPqp3mkWLct2'),
    genres: ['Drama'],
    directors: ['Clint Eastwood'],
    writers: ['Paul Haggis'],
    cast: [
      'Clint Eastwood',
      'Hilary Swank',
      'Morgan Freeman',
      'Jay Baruchel',
      'Mike Colter',
      'Lucia Rijker',
    ],
  },
  // https://www.themoviedb.org/movie/950
  {
    title: 'Ice Age: The Meltdown',
    releaseDate: '2006-03-29',
    runtimeMinutes: 91,
    synopsis:
      "Diego, Manny and Sid return in this sequel to the hit animated movie Ice Age. This time around, the deep freeze is over, and the ice-covered earth is starting to melt, which will destroy the trio's cherished valley. The impending disaster prompts them to reunite and warn all the other beasts about the desperate situation.",
    posterUrl: tmdbPoster('8vNkkk4erLGDg3UfbmSHsTdSNcY'),
    genres: ['Animation', 'Family', 'Comedy', 'Adventure'],
    directors: ['Carlos Saldanha'],
    writers: ['Peter Gaulke', 'Gerry Swallow', 'Jim Hecht'],
    cast: [
      'Ray Romano',
      'John Leguizamo',
      'Denis Leary',
      'Queen Latifah',
      'Seann William Scott',
      'Josh Peck',
    ],
  },
  // https://www.themoviedb.org/movie/423
  {
    title: 'The Pianist',
    releaseDate: '2002-09-17',
    runtimeMinutes: 150,
    synopsis:
      "The true story of pianist Władysław Szpilman's experiences in Warsaw during the Nazi occupation. When the Jews of the city find themselves forced into a ghetto, Szpilman finds work playing in a café; and when his family is deported in 1942, he stays behind, works for a while as a laborer, and eventually goes into hiding in the ruins of the war-torn city.",
    posterUrl: tmdbPoster('2hFvxCCWrTmCYwfy7yum0GKRi3Y'),
    genres: ['Drama', 'War'],
    directors: ['Roman Polanski'],
    writers: ['Ronald Harwood'],
    cast: [
      'Adrien Brody',
      'Thomas Kretschmann',
      'Frank Finlay',
      'Maureen Lipman',
      'Emilia Fox',
      'Ed Stoppard',
    ],
  },
  // https://www.themoviedb.org/movie/87
  {
    title: 'Indiana Jones and the Temple of Doom',
    releaseDate: '1984-05-23',
    runtimeMinutes: 118,
    synopsis:
      'After arriving in India, Indiana Jones is asked by a desperate village to find a mystical stone. He agrees – and stumbles upon a secret cult plotting a terrible plan in the catacombs of an ancient palace.',
    posterUrl: tmdbPoster('gpdVNUaa4LhRMLfJOPj1AZdhAZ3'),
    genres: ['Adventure', 'Action'],
    directors: ['Steven Spielberg'],
    writers: ['Gloria Katz', 'Willard Huyck'],
    cast: [
      'Harrison Ford',
      'Kate Capshaw',
      'Ke Huy Quan',
      'Amrish Puri',
      'Roshan Seth',
      'Philip Stone',
    ],
  },
  // https://www.themoviedb.org/movie/176
  {
    title: 'Saw',
    releaseDate: '2004-10-01',
    runtimeMinutes: 103,
    synopsis:
      'Two men wake up to find themselves shackled in a grimy, abandoned bathroom. As they struggle to comprehend their predicament, they discover a disturbing tape left behind by the sadistic mastermind known as Jigsaw. With a chilling voice and cryptic instructions, Jigsaw informs them that they must partake in a gruesome game in order to secure their freedom.',
    posterUrl: tmdbPoster('rLNSOudrayDBo1uqXjrhxcjODIC'),
    genres: ['Horror', 'Mystery', 'Crime'],
    directors: ['James Wan'],
    writers: ['Leigh Whannell'],
    cast: [
      'Tobin Bell',
      'Cary Elwes',
      'Leigh Whannell',
      'Danny Glover',
      'Monica Potter',
      'Ken Leung',
    ],
  },
  // https://www.themoviedb.org/movie/564
  {
    title: 'The Mummy',
    releaseDate: '1999-04-16',
    runtimeMinutes: 124,
    synopsis:
      "Dashing legionnaire Rick O'Connell stumbles upon the hidden ruins of Hamunaptra while in the midst of a battle to claim the area in 1920s Egypt. It has been over three thousand years since former High Priest Imhotep suffered a fate worse than death as a punishment for a forbidden love—along with a curse that guarantees eternal doom upon the world if he is ever awoken.",
    posterUrl: tmdbPoster('yhIsVvcUm7QxzLfT6HW2wLf5ajY'),
    genres: ['Adventure', 'Action', 'Fantasy'],
    directors: ['Stephen Sommers'],
    writers: ['Stephen Sommers'],
    cast: [
      'Brendan Fraser',
      'Rachel Weisz',
      'John Hannah',
      'Arnold Vosloo',
      'Patricia Velásquez',
      'Oded Fehr',
    ],
  },
  // https://www.themoviedb.org/movie/591
  {
    title: 'The Da Vinci Code',
    releaseDate: '2006-05-17',
    runtimeMinutes: 149,
    synopsis:
      'A murder in Paris’ Louvre Museum and cryptic clues in some of Leonardo da Vinci’s most famous paintings lead to the discovery of a religious mystery. For 2,000 years a secret society closely guards information that — should it come to light — could rock the very foundations of Christianity.',
    posterUrl: tmdbPoster('9ejKfNk0LBhSI9AahH4f9NJNZNM'),
    genres: ['Thriller', 'Mystery'],
    directors: ['Ron Howard'],
    writers: ['Akiva Goldsman'],
    cast: [
      'Tom Hanks',
      'Audrey Tautou',
      'Ian McKellen',
      'Jean Reno',
      'Paul Bettany',
      'Alfred Molina',
    ],
  },
  // https://www.themoviedb.org/movie/389
  {
    title: '12 Angry Men',
    releaseDate: '1957-04-10',
    runtimeMinutes: 97,
    synopsis:
      "The defense and the prosecution have rested and the jury is filing into the jury room to decide if a young Spanish-American is guilty or innocent of murdering his father. What begins as an open and shut case soon becomes a mini-drama of each of the jurors' prejudices and preconceptions about the trial, the accused, and each other.",
    posterUrl: tmdbPoster('zhG3vKWyDRaZYoaww1UVAi29T9h'),
    genres: ['Drama'],
    directors: ['Sidney Lumet'],
    writers: ['Reginald Rose'],
    cast: [
      'Martin Balsam',
      'John Fiedler',
      'Lee J. Cobb',
      'E.G. Marshall',
      'Jack Klugman',
      'Edward Binns',
    ],
  },
  // https://www.themoviedb.org/movie/107
  {
    title: 'Snatch',
    releaseDate: '2000-09-01',
    runtimeMinutes: 103,
    synopsis:
      'Unscrupulous boxing promoters, violent bookies, a Russian gangster, incompetent amateur robbers, and supposedly Jewish jewellers fight to track down a priceless stolen diamond.',
    posterUrl: tmdbPoster('kJZoAHq1SLDdWjeNGtlHAnGpmFV'),
    genres: ['Crime', 'Comedy'],
    directors: ['Guy Ritchie'],
    writers: ['Guy Ritchie'],
    cast: [
      'Jason Statham',
      'Alan Ford',
      'Stephen Graham',
      'Brad Pitt',
      'Dennis Farina',
      'Robbie Gee',
    ],
  },
  // https://www.themoviedb.org/movie/954
  {
    title: 'Mission: Impossible',
    releaseDate: '1996-05-22',
    runtimeMinutes: 111,
    synopsis:
      "When Ethan Hunt, the leader of a crack espionage team whose perilous operation has gone awry with no explanation, discovers that a mole has penetrated the CIA, he's surprised to learn that he's the prime suspect. To clear his name, Hunt now must ferret out the real double agent and, in the process, even the score.",
    posterUrl: tmdbPoster('l5uxY5m5OInWpcExIpKG6AR3rgL'),
    genres: ['Adventure', 'Action', 'Thriller'],
    directors: ['Brian De Palma'],
    writers: ['David Koepp', 'Robert Towne'],
    cast: [
      'Tom Cruise',
      'Jon Voight',
      'Emmanuelle Béart',
      'Henry Czerny',
      'Jean Reno',
      'Ving Rhames',
    ],
  },
  // https://www.themoviedb.org/movie/670
  {
    title: 'Oldboy',
    releaseDate: '2003-11-21',
    runtimeMinutes: 120,
    synopsis:
      'With no clue how he came to be imprisoned, drugged and tortured for 15 years, a desperate man seeks revenge on his captors.',
    posterUrl: tmdbPoster('pWDtjs568ZfOTMbURQBYuT4Qxka'),
    genres: ['Thriller', 'Mystery'],
    directors: ['Park Chan-wook'],
    writers: ['Park Chan-wook', 'Lim Joon-hyung', 'Hwang Jo-yoon'],
    cast: [
      'Choi Min-sik',
      'Yoo Ji-tae',
      'Kang Hye-jung',
      'Kim Byeong-ok',
      'Ji Dae-han',
      'Oh Dal-su',
    ],
  },
  // https://www.themoviedb.org/movie/810
  {
    title: 'Shrek the Third',
    releaseDate: '2007-05-17',
    runtimeMinutes: 93,
    synopsis:
      'After the King of Far Far Away dies, Shrek and Fiona are to succede. However, Shrek wants to return to his cozy swamp and live in peace and quiet, so when he finds out there is another heir to the throne, he and Donkey set off to bring him back to rule the kingdom.',
    posterUrl: tmdbPoster('n4SexGGQzI26E269tfpa80MZaGV'),
    genres: ['Fantasy', 'Adventure', 'Animation', 'Comedy', 'Family'],
    directors: ['Chris Miller'],
    writers: ['Chris Miller', 'Aron Warner', 'Jeffrey Price', 'Peter S. Seaman'],
    cast: [
      'Mike Myers',
      'Eddie Murphy',
      'Cameron Diaz',
      'Antonio Banderas',
      'Julie Andrews',
      'John Cleese',
    ],
  },
  // https://www.themoviedb.org/movie/620
  {
    title: 'Ghostbusters',
    releaseDate: '1984-06-08',
    runtimeMinutes: 105,
    synopsis:
      'After losing their university jobs, three parapsychologists start a ghost-catching business in New York City and uncover a supernatural threat that could destroy the world.',
    posterUrl: tmdbPoster('7E8nLijS9AwwUEPu2oFYOVKhdFA'),
    genres: ['Comedy', 'Fantasy'],
    directors: ['Ivan Reitman'],
    writers: ['Harold Ramis', 'Dan Aykroyd'],
    cast: [
      'Bill Murray',
      'Dan Aykroyd',
      'Sigourney Weaver',
      'Harold Ramis',
      'Rick Moranis',
      'Annie Potts',
    ],
  },
  // https://www.themoviedb.org/movie/429
  {
    title: 'The Good, the Bad and the Ugly',
    releaseDate: '1966-12-23',
    runtimeMinutes: 161,
    synopsis:
      'While the Civil War rages on between the Union and the Confederacy, three men – a quiet loner, a ruthless hitman, and a Mexican bandit – comb the American Southwest in search of a strongbox containing $200,000 in stolen gold.',
    posterUrl: tmdbPoster('bX2xnavhMYjWDoZp1VM6VnU1xwe'),
    genres: ['Western'],
    directors: ['Sergio Leone'],
    writers: ['Sergio Leone', 'Luciano Vincenzoni', 'Agenore Incrocci', 'Furio Scarpelli'],
    cast: [
      'Clint Eastwood',
      'Eli Wallach',
      'Lee Van Cleef',
      'Aldo Giuffrè',
      'Luigi Pistilli',
      'Rada Rassimov',
    ],
  },
  // https://www.themoviedb.org/movie/180
  {
    title: 'Minority Report',
    releaseDate: '2002-06-20',
    runtimeMinutes: 145,
    synopsis:
      "John Anderton is a top 'Precrime' cop in the late-21st century, when technology can predict crimes before they're committed. But Anderton becomes the quarry when another investigator targets him for a murder charge.",
    posterUrl: tmdbPoster('ccqpHq5tk5W4ymbSbuoy4uYOxFI'),
    genres: ['Science Fiction', 'Action', 'Thriller'],
    directors: ['Steven Spielberg'],
    writers: ['Scott Frank', 'Jon Cohen'],
    cast: [
      'Tom Cruise',
      'Colin Farrell',
      'Samantha Morton',
      'Max von Sydow',
      'Lois Smith',
      'Peter Stormare',
    ],
  },
  // https://www.themoviedb.org/movie/744
  {
    title: 'Top Gun',
    releaseDate: '1986-05-16',
    runtimeMinutes: 110,
    synopsis:
      "For Lieutenant Pete 'Maverick' Mitchell and his friend and co-pilot Nick 'Goose' Bradshaw, being accepted into an elite training school for fighter pilots is a dream come true. But a tragedy, as well as personal demons, will threaten Pete's dreams of becoming an ace pilot.",
    posterUrl: tmdbPoster('xUuHj3CgmZQ9P2cMaqQs4J0d4Zc'),
    genres: ['Action', 'Drama', 'Romance'],
    directors: ['Tony Scott'],
    writers: ['Jack Epps Jr.', 'Jim Cash'],
    cast: [
      'Tom Cruise',
      'Kelly McGillis',
      'Val Kilmer',
      'Anthony Edwards',
      'Tom Skerritt',
      'Michael Ironside',
    ],
  },
  // https://www.themoviedb.org/movie/747
  {
    title: 'Shaun of the Dead',
    releaseDate: '2004-04-09',
    runtimeMinutes: 99,
    synopsis:
      'Shaun lives a supremely uneventful life, which revolves around his girlfriend, his mother, and, above all, his local pub. This gentle routine is threatened when the dead return to life and make strenuous attempts to snack on ordinary Londoners.',
    posterUrl: tmdbPoster('dgXPhzNJH8HFTBjXPB177yNx6RI'),
    genres: ['Horror', 'Comedy'],
    directors: ['Edgar Wright'],
    writers: ['Edgar Wright', 'Simon Pegg'],
    cast: [
      'Simon Pegg',
      'Nick Frost',
      'Kate Ashfield',
      'Lucy Davis',
      'Dylan Moran',
      'Jessica Hynes',
    ],
  },
  // https://www.themoviedb.org/movie/330
  {
    title: 'The Lost World: Jurassic Park',
    releaseDate: '1997-05-23',
    runtimeMinutes: 129,
    synopsis:
      "Four years after Jurassic Park's genetically bred dinosaurs ran amok, multimillionaire John Hammond shocks chaos theorist Ian Malcolm by revealing that he has been breeding more beasties at a secret location. Malcolm, his paleontologist ladylove and a wildlife videographer join an expedition to document the lethal lizards' natural behavior in this action-packed thriller.",
    posterUrl: tmdbPoster('ss6cqHQc72eCsXrvne11XVZs3bR'),
    genres: ['Adventure', 'Action', 'Science Fiction'],
    directors: ['Steven Spielberg'],
    writers: ['David Koepp'],
    cast: [
      'Jeff Goldblum',
      'Julianne Moore',
      'Pete Postlethwaite',
      'Arliss Howard',
      'Richard Attenborough',
      'Vince Vaughn',
    ],
  },
  // https://www.themoviedb.org/movie/74
  {
    title: 'War of the Worlds',
    releaseDate: '2005-06-28',
    runtimeMinutes: 117,
    synopsis:
      'Ray Ferrier is a divorced dockworker and less-than-perfect father. Soon after his ex-wife and her new husband drop off his teenage son and young daughter for a rare weekend visit, a strange and powerful lightning storm touches down.',
    posterUrl: tmdbPoster('6Biy7R9LfumYshur3YKhpj56MpB'),
    genres: ['Adventure', 'Thriller', 'Science Fiction'],
    directors: ['Steven Spielberg'],
    writers: ['David Koepp', 'Josh Friedman'],
    cast: [
      'Tom Cruise',
      'Dakota Fanning',
      'Miranda Otto',
      'Justin Chatwin',
      'Tim Robbins',
      'Rick Gonzalez',
    ],
  },
  // https://www.themoviedb.org/movie/106
  {
    title: 'Predator',
    releaseDate: '1987-06-12',
    runtimeMinutes: 107,
    synopsis:
      'A team of elite commandos on a secret mission in a Central American jungle come to find themselves hunted by an extraterrestrial warrior.',
    posterUrl: tmdbPoster('aN3cdjIK70KGmD84et8MMblU87Q'),
    genres: ['Science Fiction', 'Action', 'Adventure', 'Thriller'],
    directors: ['John McTiernan'],
    writers: ['John Thomas', 'Jim Thomas'],
    cast: [
      'Arnold Schwarzenegger',
      'Carl Weathers',
      'Kevin Peter Hall',
      'Elpidia Carrillo',
      'Bill Duke',
      'Jesse Ventura',
    ],
  },
  // https://www.themoviedb.org/movie/63
  {
    title: 'Twelve Monkeys',
    releaseDate: '1995-12-29',
    runtimeMinutes: 129,
    synopsis:
      "In the year 2035, convict James Cole reluctantly volunteers to be sent back in time to discover the origin of a deadly virus that wiped out nearly all of the earth's population and forced the survivors into underground communities. But when Cole is mistakenly sent to 1990 instead of 1996, he's arrested and locked up in a mental hospital. There he meets psychiatrist Dr. Kathryn Railly and the son of a famous virus expert who may hold the key to the Army of the 12 Monkeys; thought to be responsible for unleashing the killer disease.",
    posterUrl: tmdbPoster('gt3iyguaCIw8DpQZI1LIN5TohM2'),
    genres: ['Science Fiction', 'Thriller', 'Mystery'],
    directors: ['Terry Gilliam'],
    writers: ['Janet Peoples', 'David Webb Peoples'],
    cast: [
      'Bruce Willis',
      'Madeleine Stowe',
      'Brad Pitt',
      'Christopher Plummer',
      'David Morse',
      'Jon Seda',
    ],
  },
  // https://www.themoviedb.org/movie/28
  {
    title: 'Apocalypse Now',
    releaseDate: '1979-05-19',
    runtimeMinutes: 147,
    synopsis:
      'At the height of the Vietnam war, Captain Benjamin Willard is sent on a dangerous mission that, officially, "does not exist, nor will it ever exist." His goal is to locate - and eliminate - a mysterious Green Beret Colonel named Walter Kurtz, who has been leading his personal army on illegal guerrilla missions into enemy territory.',
    posterUrl: tmdbPoster('gQB8Y5RCMkv2zwzFHbUJX3kAhvA'),
    genres: ['Drama', 'War'],
    directors: ['Francis Ford Coppola'],
    writers: ['Francis Ford Coppola', 'John Milius'],
    cast: [
      'Martin Sheen',
      'Marlon Brando',
      'Frederic Forrest',
      'Albert Hall',
      'Laurence Fishburne',
      'Sam Bottoms',
    ],
  },
  // https://www.themoviedb.org/movie/128
  {
    title: 'Princess Mononoke',
    releaseDate: '1997-07-12',
    runtimeMinutes: 134,
    synopsis:
      'Ashitaka, a prince of the disappearing Emishi people, is cursed by a demonized boar god and must journey to the west to find a cure. Along the way, he encounters San, a young human woman fighting to protect the forest, and Lady Eboshi, who is trying to destroy it. Ashitaka must find a way to bring balance to this conflict.',
    posterUrl: tmdbPoster('cMYCDADoLKLbB83g4WnJegaZimC'),
    genres: ['Adventure', 'Fantasy', 'Animation'],
    directors: ['Hayao Miyazaki'],
    writers: ['Hayao Miyazaki'],
    cast: [
      'Yoji Matsuda',
      'Yuriko Ishida',
      'Yuko Tanaka',
      'Kaoru Kobayashi',
      'Masahiko Nishimura',
      'Tsunehiko Kamijô',
    ],
  },
  // https://www.themoviedb.org/movie/217
  {
    title: 'Indiana Jones and the Kingdom of the Crystal Skull',
    releaseDate: '2008-05-21',
    runtimeMinutes: 122,
    synopsis:
      "Set during the Cold War, the Soviets—led by sword-wielding Irina Spalko—are in search of a crystal skull which has supernatural powers related to a mystical Lost City of Gold. Indy is coerced to head to Peru at the behest of a young man whose friend—and Indy's colleague—Professor Oxley has been captured for his knowledge of the skull's whereabouts.",
    posterUrl: tmdbPoster('56As6XEM1flWvprX4LgkPl8ii4K'),
    genres: ['Adventure', 'Action'],
    directors: ['Steven Spielberg'],
    writers: ['David Koepp'],
    cast: [
      'Harrison Ford',
      'Cate Blanchett',
      'Karen Allen',
      'Shia LaBeouf',
      'Ray Winstone',
      'John Hurt',
    ],
  },
  // https://www.themoviedb.org/movie/114
  {
    title: 'Pretty Woman',
    releaseDate: '1990-03-23',
    runtimeMinutes: 120,
    synopsis:
      "Vivian is a carefree, streetwise diamond in the rough when she meets sophisticated billionaire Edward in a chance encounter that turns into a week-long business arrangement. But Vivian's energetic spirit challenges Edward's no-nonsense approach to life, and soon they are teaching each other – and falling in love!",
    posterUrl: tmdbPoster('hVHUfT801LQATGd26VPzhorIYza'),
    genres: ['Romance', 'Comedy'],
    directors: ['Garry Marshall'],
    writers: ['J.F. Lawton'],
    cast: [
      'Richard Gere',
      'Julia Roberts',
      'Ralph Bellamy',
      'Jason Alexander',
      'Laura San Giacomo',
      'Héctor Elizondo',
    ],
  },
  // https://www.themoviedb.org/movie/137
  {
    title: 'Groundhog Day',
    releaseDate: '1993-02-11',
    runtimeMinutes: 101,
    synopsis:
      'A cynical TV weatherman, along with his idealistic producer and his sardonic cameraman, is sent to report on Groundhog Day in the small town of Punxsutawney, where he finds himself repeating the same day over and over.',
    posterUrl: tmdbPoster('gCgt1WARPZaXnq523ySQEUKinCs'),
    genres: ['Romance', 'Fantasy', 'Comedy'],
    directors: ['Harold Ramis'],
    writers: ['Harold Ramis', 'Danny Rubin'],
    cast: [
      'Bill Murray',
      'Andie MacDowell',
      'Chris Elliott',
      'Stephen Tobolowsky',
      'Brian Doyle-Murray',
      'Marita Geraghty',
    ],
  },
  // https://www.themoviedb.org/movie/435
  {
    title: 'The Day After Tomorrow',
    releaseDate: '2004-05-26',
    runtimeMinutes: 124,
    synopsis:
      "After paleoclimatologist Jack Hall is largely ignored by UN officials when presenting his environmental concerns about the beginning of a new Ice Age, his research proves true when a superstorm develops, setting off catastrophic natural disasters throughout the world. Trying to get to his son, Sam, who is trapped in New York City with his friend Laura and others, Jack and his crew must travel to get to Sam before it's too late.",
    posterUrl: tmdbPoster('Wr4HeYQRvwVCxzOV5TmGE7UkXq'),
    genres: ['Science Fiction', 'Thriller', 'Adventure'],
    directors: ['Roland Emmerich'],
    writers: ['Roland Emmerich', 'Jeffrey Nachmanoff'],
    cast: [
      'Dennis Quaid',
      'Jake Gyllenhaal',
      'Emmy Rossum',
      'Dash Mihok',
      'Jay O. Sanders',
      'Sela Ward',
    ],
  },
  // https://www.themoviedb.org/movie/187
  {
    title: 'Sin City',
    releaseDate: '2005-04-01',
    runtimeMinutes: 124,
    synopsis:
      'Welcome to Sin City. This town beckons to the tough, the corrupt, the brokenhearted. Some call it dark… Hard-boiled. Then there are those who call it home — Crooked cops, sexy dames, desperate vigilantes. Some are seeking revenge, others lust after redemption, and then there are those hoping for a little of both. A universe of unlikely and reluctant heroes still trying to do the right thing in a city that refuses to care.',
    posterUrl: tmdbPoster('i66G50wATMmPrvpP95f0XP6ZdVS'),
    genres: ['Crime', 'Thriller'],
    directors: ['Frank Miller', 'Robert Rodriguez'],
    writers: ['Frank Miller', 'Robert Rodriguez'],
    cast: [
      'Bruce Willis',
      'Jessica Alba',
      'Clive Owen',
      'Mickey Rourke',
      'Rutger Hauer',
      'Benicio del Toro',
    ],
  },
  // https://www.themoviedb.org/movie/594
  {
    title: 'The Terminal',
    releaseDate: '2004-06-17',
    runtimeMinutes: 128,
    synopsis:
      'An Eastern European tourist unexpectedly finds himself stranded in JFK airport, and must take up temporary residence there.',
    posterUrl: tmdbPoster('cPB3ZMM4UdsSAhNdS4c7ps5nypY'),
    genres: ['Comedy', 'Drama'],
    directors: ['Steven Spielberg'],
    writers: ['Sacha Gervasi', 'Jeff Nathanson'],
    cast: [
      'Tom Hanks',
      'Catherine Zeta-Jones',
      'Stanley Tucci',
      'Chi McBride',
      'Diego Luna',
      'Barry Shabaka Henley',
    ],
  },
  // https://www.themoviedb.org/movie/1366
  {
    title: 'Rocky',
    releaseDate: '1976-12-03',
    runtimeMinutes: 120,
    synopsis:
      "Rocky Balboa is a Philadelphia club fighter who seems to be going nowhere. But when a stroke of fate puts him in the ring with a world heavyweight champion, Rocky knows that it's his one shot at the big time — a once-in-a-lifetime opportunity to go the distance and come out a winner!",
    posterUrl: tmdbPoster('aYtBYWqCdUqcnoodWJdcTG3pFev'),
    genres: ['Drama'],
    directors: ['John G. Avildsen'],
    writers: ['Sylvester Stallone'],
    cast: [
      'Sylvester Stallone',
      'Talia Shire',
      'Burt Young',
      'Carl Weathers',
      'Burgess Meredith',
      'Thayer David',
    ],
  },
  // https://www.themoviedb.org/movie/95
  {
    title: 'Armageddon',
    releaseDate: '1998-07-01',
    runtimeMinutes: 151,
    synopsis:
      "When an asteroid threatens to collide with Earth, NASA honcho Dan Truman determines the only way to stop it is to drill into its surface and detonate a nuclear bomb. This leads him to renowned driller Harry Stamper, who agrees to helm the dangerous space mission provided he can bring along his own hotshot crew. Among them is the cocksure A.J. who Harry thinks isn't good enough for his daughter, until the mission proves otherwise.",
    posterUrl: tmdbPoster('eTM3qtGhDU8cvjpoa6KEt5E2auU'),
    genres: ['Action', 'Science Fiction', 'Adventure'],
    directors: ['Michael Bay'],
    writers: ['Jonathan Hensleigh', 'J.J. Abrams'],
    cast: [
      'Bruce Willis',
      'Billy Bob Thornton',
      'Ben Affleck',
      'Liv Tyler',
      'Will Patton',
      'Steve Buscemi',
    ],
  },
  // https://www.themoviedb.org/movie/170
  {
    title: '28 Days Later',
    releaseDate: '2002-10-31',
    runtimeMinutes: 113,
    synopsis:
      "Twenty-eight days after a killer virus was accidentally unleashed from a British research facility, a small group of London survivors are caught in a desperate struggle to protect themselves from the infected. Carried by animals and humans, the virus turns those it infects into homicidal maniacs -- and it's absolutely impossible to contain.",
    posterUrl: tmdbPoster('sQckQRt17VaWbo39GIu0TMOiszq'),
    genres: ['Horror', 'Thriller', 'Science Fiction'],
    directors: ['Danny Boyle'],
    writers: ['Alex Garland'],
    cast: [
      'Cillian Murphy',
      'Naomie Harris',
      'Brendan Gleeson',
      'Megan Burns',
      'Christopher Eccleston',
      'Noah Huntley',
    ],
  },
  // https://www.themoviedb.org/movie/35
  {
    title: 'The Simpsons Movie',
    releaseDate: '2007-07-25',
    runtimeMinutes: 87,
    synopsis:
      "After Homer accidentally pollutes the town's water supply, Springfield is encased in a gigantic dome by the EPA and the Simpsons are declared fugitives.",
    posterUrl: tmdbPoster('s3b8TZWwmkYc2KoJ5zk77qB6PzY'),
    genres: ['Animation', 'Comedy', 'Family'],
    directors: ['David Silverman'],
    writers: [
      'Mike Scully',
      'George Meyer',
      'Al Jean',
      'Mike Reiss',
      'Ian Maxtone-Graham',
      'John Swartzwelder',
      'Matt Groening',
      'James L. Brooks',
      'Matt Selman',
      'Sam Simon',
      'David Mirkin',
      'Jon Vitti',
    ],
    cast: [
      'Dan Castellaneta',
      'Julie Kavner',
      'Nancy Cartwright',
      'Yeardley Smith',
      'Hank Azaria',
      'Harry Shearer',
    ],
  },
  // https://www.themoviedb.org/movie/254
  {
    title: 'King Kong',
    releaseDate: '2005-12-12',
    runtimeMinutes: 188,
    synopsis:
      'In 1933 New York, an overly ambitious movie producer coerces his cast and hired ship crew to travel to mysterious Skull Island, where they encounter Kong, a giant ape who is immediately smitten with the leading lady.',
    posterUrl: tmdbPoster('6a2HY6UmD7XiDD3NokgaBAXEsD2'),
    genres: ['Adventure', 'Drama', 'Action'],
    directors: ['Peter Jackson'],
    writers: ['Peter Jackson', 'Philippa Boyens', 'Fran Walsh'],
    cast: [
      'Naomi Watts',
      'Adrien Brody',
      'Jack Black',
      'Andy Serkis',
      'Colin Hanks',
      'Thomas Kretschmann',
    ],
  },
  // https://www.themoviedb.org/movie/949
  {
    title: 'Heat',
    releaseDate: '1995-12-15',
    runtimeMinutes: 170,
    synopsis:
      'Obsessive master thief Neil McCauley leads a top-notch crew on various daring heists throughout Los Angeles while determined detective Vincent Hanna pursues him without rest. Each man recognizes and respects the ability and the dedication of the other even though they are aware their cat-and-mouse game may end in violence.',
    posterUrl: tmdbPoster('umSVjVdbVwtx5ryCA2QXL44Durm'),
    genres: ['Crime', 'Drama', 'Action'],
    directors: ['Michael Mann'],
    writers: ['Michael Mann'],
    cast: [
      'Al Pacino',
      'Robert De Niro',
      'Val Kilmer',
      'Jon Voight',
      'Tom Sizemore',
      'Diane Venora',
    ],
  },
  // https://www.themoviedb.org/movie/1372
  {
    title: 'Blood Diamond',
    releaseDate: '2006-12-08',
    runtimeMinutes: 143,
    synopsis:
      "An ex-mercenary turned smuggler. A Mende fisherman. Amid the explosive civil war overtaking 1999 Sierra Leone, these men join for two desperate missions: recovering a rare pink diamond of immense value and rescuing the fisherman's son, conscripted as a child soldier into the brutal rebel forces ripping a swath of torture and bloodshed countrywide.",
    posterUrl: tmdbPoster('tnLxPpajkbVdbQl5B9CuD7sSpz9'),
    genres: ['Drama', 'Thriller', 'Action'],
    directors: ['Edward Zwick'],
    writers: ['Charles Leavitt'],
    cast: [
      'Leonardo DiCaprio',
      'Djimon Hounsou',
      'Jennifer Connelly',
      'Kagiso Kuypers',
      'Arnold Vosloo',
      'Antony Coleman',
    ],
  },
  // https://www.themoviedb.org/movie/561
  {
    title: 'Constantine',
    releaseDate: '2005-02-08',
    runtimeMinutes: 121,
    synopsis:
      'John Constantine has literally been to Hell and back. When he teams up with a policewoman to solve the mysterious suicide of her twin sister, their investigation takes them through the world of demons and angels that exists beneath the landscape of contemporary Los Angeles.',
    posterUrl: tmdbPoster('vPYgvd2MwHlxTamAOjwVQp4qs1W'),
    genres: ['Fantasy', 'Action', 'Horror'],
    directors: ['Francis Lawrence'],
    writers: ['Kevin Brodbin', 'Frank A. Cappello'],
    cast: [
      'Keanu Reeves',
      'Rachel Weisz',
      'Shia LaBeouf',
      'Djimon Hounsou',
      'Max Baker',
      'Pruitt Taylor Vince',
    ],
  },
  // https://www.themoviedb.org/movie/598
  {
    title: 'City of God',
    releaseDate: '2002-08-30',
    runtimeMinutes: 129,
    synopsis:
      'In the poverty-stricken favelas of Rio de Janeiro in the 1970s, two young men choose different paths. Rocket is a budding photographer who documents the increasing drug-related violence of his neighborhood, while José “Zé” Pequeno is an ambitious drug dealer diving into a dangerous life of crime.',
    posterUrl: tmdbPoster('k7eYdWvhYQyRQoU2TB2A2Xu2TfD'),
    genres: ['Drama', 'Crime'],
    directors: ['Fernando Meirelles'],
    writers: ['Bráulio Mantovani'],
    cast: [
      'Alexandre Rodrigues',
      'Leandro Firmino',
      'Phellipe Haagensen',
      'Douglas Silva',
      'Jonathan Haagensen',
      'Matheus Nachtergaele',
    ],
  },
  // https://www.themoviedb.org/movie/584
  {
    title: '2 Fast 2 Furious',
    releaseDate: '2003-06-05',
    runtimeMinutes: 108,
    synopsis:
      'It\'s a major double-cross when former police officer Brian O\'Conner teams up with his ex-con buddy Roman Pearce to transport a shipment of "dirty" money for shady Miami-based import-export dealer Carter Verone. But the guys are actually working with undercover agent Monica Fuentes to bring Verone down.',
    posterUrl: tmdbPoster('6nDZExrDKIXvSAghsFKVFRVJuSf'),
    genres: ['Action', 'Crime', 'Thriller'],
    directors: ['John Singleton'],
    writers: ['Michael Brandt', 'Derek Haas'],
    cast: ['Paul Walker', 'Tyrese Gibson', 'Eva Mendes', 'Cole Hauser', 'Ludacris', 'James Remar'],
  },
  // https://www.themoviedb.org/movie/153
  {
    title: 'Lost in Translation',
    releaseDate: '2003-09-18',
    runtimeMinutes: 102,
    synopsis:
      "Two lost souls visiting Tokyo -- the young, neglected wife of a photographer and a washed-up movie star shooting a TV commercial -- find an odd solace and pensive freedom to be real in each other's company, away from their lives in America.",
    posterUrl: tmdbPoster('3jCLmYDIIiSMPujbwygNpqdpM8N'),
    genres: ['Drama', 'Comedy', 'Romance'],
    directors: ['Sofia Coppola'],
    writers: ['Sofia Coppola'],
    cast: [
      'Bill Murray',
      'Scarlett Johansson',
      'Giovanni Ribisi',
      'Anna Faris',
      'Akiko Takeshita',
      'Kazuyoshi Minamimagoe',
    ],
  },
  // https://www.themoviedb.org/movie/1091
  {
    title: 'The Thing',
    releaseDate: '1982-06-25',
    runtimeMinutes: 109,
    synopsis:
      'A research team in Antarctica is hunted by a shape-shifting alien that assumes the appearance of its victims.',
    posterUrl: tmdbPoster('ob1NaOSYDC4iBaFkTgIUecaMFGT'),
    genres: ['Horror', 'Mystery', 'Science Fiction'],
    directors: ['John Carpenter'],
    writers: ['Bill Lancaster'],
    cast: [
      'Kurt Russell',
      'Wilford Brimley',
      'T.K. Carter',
      'David Clennon',
      'Keith David',
      'Richard Dysart',
    ],
  },
  // https://www.themoviedb.org/movie/408
  {
    title: 'Snow White and the Seven Dwarfs',
    releaseDate: '1938-01-22',
    runtimeMinutes: 83,
    synopsis:
      'A beautiful girl, Snow White, takes refuge in the forest in the house of seven dwarfs to hide from her stepmother, the wicked Queen. The Queen is jealous because she wants to be known as "the fairest in the land," and Snow White\'s beauty surpasses her own.',
    posterUrl: tmdbPoster('3VAHfuNb6Z7UiW12iYKANSPBl8m'),
    genres: ['Fantasy', 'Animation', 'Family'],
    directors: [
      'William Cottrell',
      'Perce Pearce',
      'Wilfred Jackson',
      'Larry Morey',
      'Ben Sharpsteen',
      'David Hand',
    ],
    writers: [
      'Dick Rickard',
      'Earl Hurd',
      'Dorothy Ann Blank',
      'Richard Creedon',
      'Ted Sears',
      'Webb Smith',
      'Otto Englander',
      'Merrill De Maris',
    ],
    cast: [
      'Adriana Caselotti',
      'Lucille La Verne',
      'Harry Stockwell',
      'Roy Atwell',
      'Pinto Colvig',
      'Otis Harlan',
    ],
  },
  // https://www.themoviedb.org/movie/163
  {
    title: "Ocean's Twelve",
    releaseDate: '2004-12-09',
    runtimeMinutes: 125,
    synopsis:
      "Despite pulling off one of the biggest heists in Las Vegas history and splitting the $160 million take, each of the infamous Ocean's crew have tried to go straight, lay low and live a legit life... but that's proven to be a challenge. Casino owner Terry Benedict demands that Danny Ocean return the money, plus millions more in interest. Unable to come up the cash, the crew is forced to come together to pull off another series of heists, this time in Rome, Paris, and Amsterdam – but a Europol agent is hot on their heels.",
    posterUrl: tmdbPoster('pE5anFf7nf6ah7V3VRezQ1KSovi'),
    genres: ['Thriller', 'Crime'],
    directors: ['Steven Soderbergh'],
    writers: ['George Nolfi'],
    cast: [
      'George Clooney',
      'Julia Roberts',
      'Brad Pitt',
      'Matt Damon',
      'Catherine Zeta-Jones',
      'Andy Garcia',
    ],
  },
  // https://www.themoviedb.org/movie/331
  {
    title: 'Jurassic Park III',
    releaseDate: '2001-07-18',
    runtimeMinutes: 92,
    synopsis:
      "In need of funds for research, Dr. Alan Grant accepts a large sum of money to accompany Paul and Amanda Kirby on an aerial tour of the infamous Isla Sorna. It isn't long before all hell breaks loose and the stranded wayfarers must fight for survival as a host of new -- and even more deadly -- dinosaurs try to make snacks of them.",
    posterUrl: tmdbPoster('oQXj4NUfS3r3gHXtDOzcJgj1lLc'),
    genres: ['Adventure', 'Thriller', 'Science Fiction'],
    directors: ['Joe Johnston'],
    writers: ['Jim Taylor', 'Peter Buchman', 'Alexander Payne'],
    cast: [
      'Sam Neill',
      'William H. Macy',
      'Téa Leoni',
      'Alessandro Nivola',
      'Trevor Morgan',
      'Michael Jeter',
    ],
  },
  // https://www.themoviedb.org/movie/773
  {
    title: 'Little Miss Sunshine',
    releaseDate: '2006-07-26',
    runtimeMinutes: 102,
    synopsis:
      'A family loaded with quirky, colorful characters piles into an old van and road trips to California for little Olive to compete in a beauty pageant.',
    posterUrl: tmdbPoster('niNdhTpPHSgw22tK0PLjQMV640v'),
    genres: ['Comedy', 'Drama'],
    directors: ['Jonathan Dayton', 'Valerie Faris'],
    writers: ['Michael Arndt'],
    cast: [
      'Greg Kinnear',
      'Toni Collette',
      'Steve Carell',
      'Paul Dano',
      'Abigail Breslin',
      'Alan Arkin',
    ],
  },
  // https://www.themoviedb.org/movie/65
  {
    title: '8 Mile',
    releaseDate: '2002-11-08',
    runtimeMinutes: 111,
    synopsis:
      "For Jimmy Smith, Jr., life is a daily fight just to keep hope alive. Feeding his dreams in Detroit's vibrant music scene, Jimmy wages an extraordinary personal struggle to find his own voice - and earn a place in a world where rhymes rule, legends are born and every moment… is another chance.",
    posterUrl: tmdbPoster('7BmQj8qE1FLuLTf7Xjf9sdIHzoa'),
    genres: ['Drama', 'Music'],
    directors: ['Curtis Hanson'],
    writers: ['Scott Silver'],
    cast: [
      'Eminem',
      'Kim Basinger',
      'Mekhi Phifer',
      'Brittany Murphy',
      'Evan Jones',
      'Omar Benson Miller',
    ],
  },
  // https://www.themoviedb.org/movie/587
  {
    title: 'Big Fish',
    releaseDate: '2003-12-10',
    runtimeMinutes: 125,
    synopsis:
      'Throughout his life Edward Bloom has always been a man of big appetites, enormous passions and tall tales. In his later years, he remains a huge mystery to his son, William. Now, to get to know the real man, Will begins piecing together a true picture of his father from flashbacks of his amazing adventures.',
    posterUrl: tmdbPoster('tjK063yCgaBAluVU72rZ6PKPH2l'),
    genres: ['Adventure', 'Fantasy', 'Drama'],
    directors: ['Tim Burton'],
    writers: ['John August'],
    cast: [
      'Ewan McGregor',
      'Albert Finney',
      'Billy Crudup',
      'Jessica Lange',
      'Helena Bonham Carter',
      'Alison Lohman',
    ],
  },
  // https://www.themoviedb.org/movie/621
  {
    title: 'Grease',
    releaseDate: '1978-06-16',
    runtimeMinutes: 110,
    synopsis:
      "Australian good girl Sandy and greaser Danny fell in love over the summer. But when they unexpectedly discover they're now in the same high school, will they be able to rekindle their romance despite their eccentric friends?",
    posterUrl: tmdbPoster('2rM7fQKpb7cs1Iq7IBqub9LFDzJ'),
    genres: ['Romance', 'Comedy'],
    directors: ['Randal Kleiser'],
    writers: ['Bronté Woodard'],
    cast: [
      'Olivia Newton-John',
      'John Travolta',
      'Stockard Channing',
      'Jeff Conaway',
      'Barry Pearl',
      'Michael Tucci',
    ],
  },
  // https://www.themoviedb.org/movie/956
  {
    title: 'Mission: Impossible III',
    releaseDate: '2006-04-25',
    runtimeMinutes: 126,
    synopsis:
      "Retired from active duty, and training recruits for the Impossible Mission Force, agent Ethan Hunt faces the toughest foe of his career: Owen Davian, an international broker of arms and information, who's as cunning as he is ruthless. Davian emerges to threaten Hunt and all that he holds dear – including the woman Hunt loves.",
    posterUrl: tmdbPoster('vKGYCpmQyV9uHybWDzXuII8Los5'),
    genres: ['Adventure', 'Action', 'Thriller'],
    directors: ['J.J. Abrams'],
    writers: ['J.J. Abrams', 'Roberto Orci', 'Alex Kurtzman'],
    cast: [
      'Tom Cruise',
      'Philip Seymour Hoffman',
      'Ving Rhames',
      'Billy Crudup',
      'Michelle Monaghan',
      'Jonathan Rhys Meyers',
    ],
  },
  // https://www.themoviedb.org/movie/955
  {
    title: 'Mission: Impossible II',
    releaseDate: '2000-05-24',
    runtimeMinutes: 123,
    synopsis:
      'With computer genius Luther Stickell at his side and a beautiful thief on his mind, agent Ethan Hunt races across Australia and Spain to stop a former IMF agent from unleashing a genetically engineered biological weapon called Chimera. This mission, should Hunt choose to accept it, plunges him into the center of an international crisis of terrifying magnitude.',
    posterUrl: tmdbPoster('hfnrual76gPeNFduhD4xzHWpfTw'),
    genres: ['Adventure', 'Action', 'Thriller'],
    directors: ['John Woo'],
    writers: ['Robert Towne'],
    cast: [
      'Tom Cruise',
      'Dougray Scott',
      'Thandiwe Newton',
      'Ving Rhames',
      'Richard Roxburgh',
      'John Polson',
    ],
  },
  // https://www.themoviedb.org/movie/616
  {
    title: 'The Last Samurai',
    releaseDate: '2003-12-05',
    runtimeMinutes: 154,
    synopsis:
      "Nathan Algren is an American hired to instruct the Japanese army in the ways of modern warfare, which finds him learning to respect the samurai and the honorable principles that rule them. Pressed to destroy the samurai's way of life in the name of modernization and open trade, Algren decides to become an ultimate warrior himself and to fight for their right to exist.",
    posterUrl: tmdbPoster('a8jmJPs5eZBARmnuEEvZwbjwyz4'),
    genres: ['Drama', 'Action', 'War'],
    directors: ['Edward Zwick'],
    writers: ['Edward Zwick', 'John Logan', 'Marshall Herskovitz'],
    cast: [
      'Tom Cruise',
      'Ken Watanabe',
      'Timothy Spall',
      'Tony Goldwyn',
      'Hiroyuki Sanada',
      'Koyuki',
    ],
  },
  // https://www.themoviedb.org/movie/142
  {
    title: 'Brokeback Mountain',
    releaseDate: '2005-10-22',
    runtimeMinutes: 134,
    synopsis:
      'In 1960s Wyoming, two men develop a strong emotional and sexual relationship that endures as a lifelong connection complicating their lives as they get married and start families of their own.',
    posterUrl: tmdbPoster('aByfQOQBNa4CMFwIgq3QrqY2ZHh'),
    genres: ['Drama', 'Romance'],
    directors: ['Ang Lee'],
    writers: ['Diana Ossana', 'Larry McMurtry'],
    cast: [
      'Heath Ledger',
      'Jake Gyllenhaal',
      'Michelle Williams',
      'Anne Hathaway',
      'Randy Quaid',
      'Linda Cardellini',
    ],
  },
  // https://www.themoviedb.org/movie/322
  {
    title: 'Mystic River',
    releaseDate: '2003-10-08',
    runtimeMinutes: 138,
    synopsis:
      'The lives of three men who were childhood friends are shattered when one of them suffers a family tragedy.',
    posterUrl: tmdbPoster('hCHVDbo6XJGj3r2i4hVjKhE0GKF'),
    genres: ['Thriller', 'Drama', 'Mystery'],
    directors: ['Clint Eastwood'],
    writers: ['Brian Helgeland'],
    cast: [
      'Sean Penn',
      'Tim Robbins',
      'Kevin Bacon',
      'Laurence Fishburne',
      'Marcia Gay Harden',
      'Laura Linney',
    ],
  },
  // https://www.themoviedb.org/movie/1487
  {
    title: 'Hellboy',
    releaseDate: '2004-04-02',
    runtimeMinutes: 122,
    synopsis:
      'In the final days of World War II, the Nazis attempt to use black magic to aid their dying cause. The Allies raid the camp where the ceremony is taking place, but not before they summon a baby demon who is rescued by Allied forces and dubbed "Hellboy". Sixty years later, Hellboy serves the cause of good rather than evil as an agent in the Bureau of Paranormal Research & Defense, along with Abe Sapien - a merman with psychic powers, and Liz Sherman - a woman with pyrokinesis, protecting America against dark forces.',
    posterUrl: tmdbPoster('lbaTEneOofwvAyg77R8HbFML2zT'),
    genres: ['Fantasy', 'Action'],
    directors: ['Guillermo del Toro'],
    writers: ['Guillermo del Toro', 'Peter Briggs', 'Mike Mignola'],
    cast: [
      'Ron Perlman',
      'Selma Blair',
      'Doug Jones',
      'John Hurt',
      'Rupert Evans',
      'Jeffrey Tambor',
    ],
  },
  // https://www.themoviedb.org/movie/508
  {
    title: 'Love Actually',
    releaseDate: '2003-09-07',
    runtimeMinutes: 135,
    synopsis:
      'Eight very different couples deal with their love lives in various loosely interrelated tales all set during a frantic month before Christmas in London.',
    posterUrl: tmdbPoster('7QPeVsr9rcFU9Gl90yg0gTOTpVv'),
    genres: ['Comedy', 'Romance', 'Drama'],
    directors: ['Richard Curtis'],
    writers: ['Richard Curtis'],
    cast: [
      'Hugh Grant',
      'Alan Rickman',
      'Emma Thompson',
      'Liam Neeson',
      'Martine McCutcheon',
      'Colin Firth',
    ],
  },
  // https://www.themoviedb.org/movie/100
  {
    title: 'Lock, Stock and Two Smoking Barrels',
    releaseDate: '1998-08-28',
    runtimeMinutes: 105,
    synopsis:
      'A card shark and his unwillingly-enlisted friends need to make a lot of cash quick after losing a sketchy poker match. To do this they decide to pull a heist on a small-time gang who happen to be operating out of the flat next door.',
    posterUrl: tmdbPoster('6pJB2t3MbQUy9m5pFIBHXLqnqNd'),
    genres: ['Comedy', 'Crime'],
    directors: ['Guy Ritchie'],
    writers: ['Guy Ritchie'],
    cast: [
      'Vinnie Jones',
      'Jason Flemyng',
      'Dexter Fletcher',
      'Nick Moran',
      'Jason Statham',
      'Steven Mackintosh',
    ],
  },
  // https://www.themoviedb.org/movie/567
  {
    title: 'Rear Window',
    releaseDate: '1954-08-01',
    runtimeMinutes: 113,
    synopsis:
      'A wheelchair-bound photographer spies on his neighbors from his apartment window and becomes convinced one of them has committed murder.',
    posterUrl: tmdbPoster('ILVF0eJxHMddjxeQhswFtpMtqx'),
    genres: ['Thriller', 'Mystery', 'Drama'],
    directors: ['Alfred Hitchcock'],
    writers: ['John Michael Hayes'],
    cast: [
      'James Stewart',
      'Grace Kelly',
      'Wendell Corey',
      'Thelma Ritter',
      'Raymond Burr',
      'Judith Evelyn',
    ],
  },
  // https://www.themoviedb.org/movie/380
  {
    title: 'Rain Man',
    releaseDate: '1988-12-12',
    runtimeMinutes: 134,
    synopsis:
      "When car dealer Charlie Babbitt learns that his estranged father has died, he returns home to Cincinnati, where he discovers that he has a savant older brother named Raymond and that his father's $3 million fortune is being left to the mental institution in which Raymond lives. Motivated by his father's money, Charlie checks Raymond out of the facility in order to return with him to Los Angeles. The brothers' cross-country trip ends up changing both their lives.",
    posterUrl: tmdbPoster('iTNHwO896WKkaoPtpMMS74d8VNi'),
    genres: ['Drama'],
    directors: ['Barry Levinson'],
    writers: ['Barry Morrow', 'Ronald Bass'],
    cast: [
      'Dustin Hoffman',
      'Tom Cruise',
      'Valeria Golino',
      'Gerald R. Molen',
      'Jack Murdock',
      'Michael D. Roberts',
    ],
  },
  // https://www.themoviedb.org/movie/364
  {
    title: 'Batman Returns',
    releaseDate: '1992-06-19',
    runtimeMinutes: 126,
    synopsis:
      "The monstrous Penguin, who dwells in the sewers beneath Gotham, joins up with corrupt mayoral candidate Max Shreck to topple the Batman once and for all. But when Shreck's timid assistant Selina Kyle finds out, and Shreck tries to kill her, she's transformed into the sexy Catwoman. She teams up with the Penguin and Shreck to destroy Batman, but sparks fly unexpectedly when she confronts the caped crusader.",
    posterUrl: tmdbPoster('jKBjeXM7iBBV9UkUcOXx3m7FSHY'),
    genres: ['Action', 'Fantasy'],
    directors: ['Tim Burton'],
    writers: ['Daniel Waters'],
    cast: [
      'Michael Keaton',
      'Danny DeVito',
      'Michelle Pfeiffer',
      'Christopher Walken',
      'Michael Gough',
      'Pat Hingle',
    ],
  },
  // https://www.themoviedb.org/movie/345
  {
    title: 'Eyes Wide Shut',
    releaseDate: '1999-07-16',
    runtimeMinutes: 159,
    synopsis:
      "After Dr. Bill Harford's wife, Alice, admits to having sexual fantasies about a man she met, Bill becomes obsessed with having a sexual encounter. He discovers an underground sexual group and attends one of their meetings -- and quickly discovers that he is in over his head.",
    posterUrl: tmdbPoster('knEIz1eNGl5MQDbrEAVWA7iRqF9'),
    genres: ['Drama', 'Thriller', 'Mystery'],
    directors: ['Stanley Kubrick'],
    writers: ['Stanley Kubrick', 'Frederic Raphael'],
    cast: [
      'Tom Cruise',
      'Nicole Kidman',
      'Sydney Pollack',
      'Marie Richardson',
      'Rade Šerbedžija',
      'Todd Field',
    ],
  },
  // https://www.themoviedb.org/movie/1018
  {
    title: 'Mulholland Drive',
    releaseDate: '2001-06-06',
    runtimeMinutes: 147,
    synopsis:
      "Blonde Betty Elms has only just arrived in Hollywood to become a movie star when she meets an enigmatic brunette with amnesia. Meanwhile, as the two set off to solve the second woman's identity, filmmaker Adam Kesher runs into ominous trouble while casting his latest project.",
    posterUrl: tmdbPoster('x7A59t6ySylr1L7aubOQEA480vM'),
    genres: ['Thriller', 'Drama', 'Mystery'],
    directors: ['David Lynch'],
    writers: ['David Lynch'],
    cast: [
      'Naomi Watts',
      'Laura Harring',
      'Justin Theroux',
      'Ann Miller',
      'Mark Pellegrino',
      'Robert Forster',
    ],
  },
  // https://www.themoviedb.org/movie/534
  {
    title: 'Terminator Salvation',
    releaseDate: '2009-05-20',
    runtimeMinutes: 115,
    synopsis:
      "All grown up in post-apocalyptic 2018, John Connor must lead the resistance of humans against the increasingly dominating militaristic robots. But when Marcus Wright appears, his existence confuses the mission as Connor tries to determine whether Wright has come from the future or the past -- and whether he's friend or foe.",
    posterUrl: tmdbPoster('gw6JhlekZgtKUFlDTezq3j5JEPK'),
    genres: ['Action', 'Science Fiction', 'Thriller'],
    directors: ['McG'],
    writers: ['John Brancato', 'Michael Ferris'],
    cast: [
      'Christian Bale',
      'Sam Worthington',
      'Moon Bloodgood',
      'Helena Bonham Carter',
      'Anton Yelchin',
      'Common',
    ],
  },
  // https://www.themoviedb.org/movie/676
  {
    title: 'Pearl Harbor',
    releaseDate: '2001-05-21',
    runtimeMinutes: 183,
    synopsis:
      "The lifelong friendship between Rafe McCawley and Danny Walker is put to the ultimate test when the two ace fighter pilots become entangled in a love triangle with beautiful Naval nurse Evelyn Johnson. But the rivalry between the friends-turned-foes is immediately put on hold when they find themselves at the center of Japan's devastating attack on Pearl Harbor on Dec. 7, 1941.",
    posterUrl: tmdbPoster('y8A0Cvp8WQmZ3bjbnsL53lY0dsC'),
    genres: ['War', 'History', 'Drama'],
    directors: ['Michael Bay'],
    writers: ['Randall Wallace'],
    cast: [
      'Ben Affleck',
      'Josh Hartnett',
      'Kate Beckinsale',
      'William Lee Scott',
      'Greg Zola',
      'Ewen Bremner',
    ],
  },
  // https://www.themoviedb.org/movie/927
  {
    title: 'Gremlins',
    releaseDate: '1984-06-08',
    runtimeMinutes: 106,
    synopsis:
      'After receiving an exotic small animal as a Christmas gift, a young man inadvertently breaks three important rules concerning his new pet, which unleashes a horde of malevolently mischievous creatures on a small town.',
    posterUrl: tmdbPoster('6m0F7fsXjQvUbCZrPWcJNrjvIui'),
    genres: ['Fantasy', 'Horror', 'Comedy'],
    directors: ['Joe Dante'],
    writers: ['Chris Columbus'],
    cast: [
      'Zach Galligan',
      'Phoebe Cates',
      'Hoyt Axton',
      'Frances Lee McCain',
      'Corey Feldman',
      'Keye Luke',
    ],
  },
  // https://www.themoviedb.org/movie/1576
  {
    title: 'Resident Evil',
    releaseDate: '2002-03-15',
    runtimeMinutes: 100,
    synopsis:
      'When a virus leaks from a top-secret facility, turning all resident researchers into ravenous zombies and their lab animals into mutated hounds from hell, the government sends in an elite military task force to contain the outbreak.',
    posterUrl: tmdbPoster('1UKNef590A0ZaMnxsscIcWuK1Em'),
    genres: ['Horror', 'Action', 'Science Fiction'],
    directors: ['Paul W. S. Anderson'],
    writers: ['Paul W. S. Anderson'],
    cast: [
      'Milla Jovovich',
      'Michelle Rodriguez',
      'Eric Mabius',
      'James Purefoy',
      'Martin Crewes',
      'Colin Salmon',
    ],
  },
  // https://www.themoviedb.org/movie/184
  {
    title: 'Jackie Brown',
    releaseDate: '1997-12-25',
    runtimeMinutes: 154,
    synopsis:
      'Jackie Brown is a flight attendant who gets caught in the middle of smuggling cash into the country for her gunrunner boss. When the cops try to use Jackie to get to her boss, she hatches a plan — with help from a bail bondsman — to keep the money for herself.',
    posterUrl: tmdbPoster('rOUx7qg4KmEh1juEDwqzbDSL1Nr'),
    genres: ['Crime', 'Drama', 'Thriller'],
    directors: ['Quentin Tarantino'],
    writers: ['Quentin Tarantino'],
    cast: [
      'Pam Grier',
      'Samuel L. Jackson',
      'Robert De Niro',
      'Bridget Fonda',
      'Michael Keaton',
      'Robert Forster',
    ],
  },
  // https://www.themoviedb.org/movie/782
  {
    title: 'Gattaca',
    releaseDate: '1997-07-09',
    runtimeMinutes: 107,
    synopsis:
      'Vincent is an all-too-human man who dares to defy a system obsessed with genetic perfection. He is an "In-Valid" who assumes the identity of a member of the genetic elite to pursue his goal of traveling into space with the Gattaca Aerospace Corporation.',
    posterUrl: tmdbPoster('eSKr5Fl1MEC7zpAXaLWBWSBjgJq'),
    genres: ['Science Fiction', 'Drama'],
    directors: ['Andrew Niccol'],
    writers: ['Andrew Niccol'],
    cast: ['Ethan Hawke', 'Uma Thurman', 'Jude Law', 'Alan Arkin', 'Loren Dean', 'Gore Vidal'],
  },
  // https://www.themoviedb.org/movie/298
  {
    title: "Ocean's Thirteen",
    releaseDate: '2007-06-05',
    runtimeMinutes: 122,
    synopsis:
      "Danny Ocean's team of criminals are back and composing a plan more personal than ever. When ruthless casino owner Willy Bank doublecrosses Reuben Tishkoff, causing a heart attack, Danny Ocean vows that he and his team will do anything to bring down Willy Bank along with everything he's got. Even if it means asking for help from an enemy.",
    posterUrl: tmdbPoster('pBsZs4zYUiUTemqbikTZ76iQRaU'),
    genres: ['Crime', 'Thriller'],
    directors: ['Steven Soderbergh'],
    writers: ['Brian Koppelman', 'David Levien'],
    cast: ['George Clooney', 'Brad Pitt', 'Al Pacino', 'Matt Damon', 'Don Cheadle', 'Bernie Mac'],
  },
  // https://www.themoviedb.org/movie/1368
  {
    title: 'First Blood',
    releaseDate: '1982-10-22',
    runtimeMinutes: 93,
    synopsis:
      'When former Green Beret John Rambo is harassed by local law enforcement and arrested for vagrancy, he is forced to flee into the mountains and wage an escalating one-man war against his pursuers.',
    posterUrl: tmdbPoster('a9sa6ERZCpplbPEO7OMWE763CLD'),
    genres: ['Action', 'Thriller', 'Drama'],
    directors: ['Ted Kotcheff'],
    writers: ['Michael Kozoll', 'Sylvester Stallone', 'William Sackheim'],
    cast: [
      'Sylvester Stallone',
      'Richard Crenna',
      'Brian Dennehy',
      'Bill McKinney',
      'Jack Starrett',
      'Michael Talbott',
    ],
  },
  // https://www.themoviedb.org/movie/242
  {
    title: 'The Godfather Part III',
    releaseDate: '1990-12-25',
    runtimeMinutes: 162,
    synopsis:
      'In the midst of trying to legitimize his business dealings in 1979 New York and Italy, aging mafia don, Michael Corleone seeks forgiveness for his sins while taking a young protege under his wing.',
    posterUrl: tmdbPoster('lm3pQ2QoQ16pextRsmnUbG2onES'),
    genres: ['Crime', 'Drama', 'Thriller'],
    directors: ['Francis Ford Coppola'],
    writers: ['Francis Ford Coppola', 'Mario Puzo'],
    cast: [
      'Al Pacino',
      'Diane Keaton',
      'Talia Shire',
      'Andy Garcia',
      'Eli Wallach',
      'Joe Mantegna',
    ],
  },
  // https://www.themoviedb.org/movie/1637
  {
    title: 'Speed',
    releaseDate: '1994-06-09',
    runtimeMinutes: 116,
    synopsis:
      "Tensions run high when a crazed bomber rigs a Los Angeles bus with a device that will kill everyone on board if the vehicle's speed dips below fifty miles per hour.",
    posterUrl: tmdbPoster('82PkCE4R95KhHICUDF7G4Ly2z3l'),
    genres: ['Action', 'Thriller'],
    directors: ['Jan de Bont'],
    writers: ['Graham Yost'],
    cast: [
      'Keanu Reeves',
      'Dennis Hopper',
      'Sandra Bullock',
      'Joe Morton',
      'Jeff Daniels',
      'Alan Ruck',
    ],
  },
  // https://www.themoviedb.org/movie/509
  {
    title: 'Notting Hill',
    releaseDate: '1999-05-21',
    runtimeMinutes: 124,
    synopsis:
      "London bookstore owner William Thacker's quiet life turns upside down when a chance encounter with famous actress Anna Scott sparks an unlikely romance challenged by their vastly different worlds.",
    posterUrl: tmdbPoster('hHRIf2XHeQMbyRb3HUx19SF5Ujw'),
    genres: ['Romance', 'Comedy'],
    directors: ['Roger Michell'],
    writers: ['Richard Curtis'],
    cast: [
      'Julia Roberts',
      'Hugh Grant',
      'Gina McKee',
      'Tim McInnerny',
      'Rhys Ifans',
      'Emma Chambers',
    ],
  },
  // https://www.themoviedb.org/movie/565
  {
    title: 'The Ring',
    releaseDate: '2002-10-18',
    runtimeMinutes: 115,
    synopsis:
      'Journalist Rachel Keller investigates a strange videotape that may be behind the untimely deaths of four teenagers. There is an urban legend about this tape: the viewer will die seven days after watching it. Rachel tracks down the video... and watches it. Now she has just seven days to unravel the mystery of the Ring in order to save herself and her son.',
    posterUrl: tmdbPoster('AeRpUynJKDpJveklBJipOYrVxCS'),
    genres: ['Horror', 'Mystery'],
    directors: ['Gore Verbinski'],
    writers: ['Ehren Kruger', 'Hiroshi Takahashi'],
    cast: [
      'Naomi Watts',
      'Martin Henderson',
      'David Dorfman',
      'Brian Cox',
      'Jane Alexander',
      'Lindsay Frost',
    ],
  },
  // https://www.themoviedb.org/movie/1572
  {
    title: 'Die Hard: With a Vengeance',
    releaseDate: '1995-05-19',
    runtimeMinutes: 128,
    synopsis:
      'New York detective John McClane is back and kicking bad-guy butt in the third installment of this action-packed series, which finds him teaming with civilian Zeus Carver to prevent the loss of innocent lives. McClane thought he\'d seen it all, until a genius named Simon engages McClane, his new "partner" -- and his beloved city -- in a deadly game that demands their concentration.',
    posterUrl: tmdbPoster('buqmCdFQEWwEpL3agGgg2GVjN2d'),
    genres: ['Action', 'Thriller'],
    directors: ['John McTiernan'],
    writers: ['Jonathan Hensleigh'],
    cast: [
      'Bruce Willis',
      'Jeremy Irons',
      'Samuel L. Jackson',
      'Larry Bryggman',
      'Graham Greene',
      'Anthony Peck',
    ],
  },
  // https://www.themoviedb.org/movie/644
  {
    title: 'A.I. Artificial Intelligence',
    releaseDate: '2001-06-29',
    runtimeMinutes: 146,
    synopsis:
      'David, a robotic boy—the first of his kind programmed to love—is adopted as a test case by a Cybertronics employee and his wife. Though he gradually becomes their child, a series of unexpected circumstances make this life impossible for David.',
    posterUrl: tmdbPoster('8MZSGX5JORoO72EfuAEcejH5yHn'),
    genres: ['Drama', 'Science Fiction', 'Adventure'],
    directors: ['Steven Spielberg'],
    writers: ['Steven Spielberg'],
    cast: [
      'Haley Joel Osment',
      'Jude Law',
      "Frances O'Connor",
      'Sam Robards',
      'Jake Thomas',
      'William Hurt',
    ],
  },
  // https://www.themoviedb.org/movie/788
  {
    title: 'Mrs. Doubtfire',
    releaseDate: '1993-11-24',
    runtimeMinutes: 125,
    synopsis:
      "Loving but irresponsible dad Daniel Hillard, estranged from his exasperated spouse, is crushed by a court order allowing only weekly visits with his kids. When Daniel learns his ex needs a housekeeper, he gets the job -- disguised as a British nanny. Soon he becomes not only his children's best pal but the kind of parent he should have been from the start.",
    posterUrl: tmdbPoster('shHrSmXS5140o6sQzgzXxn3KqSm'),
    genres: ['Comedy', 'Drama', 'Family'],
    directors: ['Chris Columbus'],
    writers: ['Randi Mayem Singer', 'Leslie Dixon', 'Peter S. Seaman', 'Jeffrey Price'],
    cast: [
      'Robin Williams',
      'Sally Field',
      'Lisa Jakub',
      'Matthew Lawrence',
      'Mara Wilson',
      'Pierce Brosnan',
    ],
  },
  // https://www.themoviedb.org/movie/524
  {
    title: 'Casino',
    releaseDate: '1995-11-22',
    runtimeMinutes: 179,
    synopsis:
      'In Las Vegas, two best friends--a casino executive and a Mafia enforcer--compete for a gambling empire and a fast-living, fast-loving socialite.',
    posterUrl: tmdbPoster('gziIkUSnYuj9ChCi8qOu2ZunpSC'),
    genres: ['Crime', 'Drama'],
    directors: ['Martin Scorsese'],
    writers: ['Martin Scorsese', 'Nicholas Pileggi'],
    cast: [
      'Robert De Niro',
      'Sharon Stone',
      'Joe Pesci',
      'James Woods',
      'Don Rickles',
      'Alan King',
    ],
  },
  // https://www.themoviedb.org/movie/235
  {
    title: 'Stand by Me',
    releaseDate: '1986-08-08',
    runtimeMinutes: 89,
    synopsis:
      "After learning that a boy their age has been accidentally killed near their rural homes, four boys decide to go see the body. Gordie, Vern, Chris, and Teddy encounter a mean junk man and a marsh full of leeches, but they also learn more about one another and their very different home lives. Just a lark at first, the boys' adventure evolves into a defining event in their lives.",
    posterUrl: tmdbPoster('vz0w9BSehcqjDcJOjRaCk7fgJe7'),
    genres: ['Crime', 'Drama'],
    directors: ['Rob Reiner'],
    writers: ['Raynold Gideon', 'Bruce A. Evans'],
    cast: [
      'Wil Wheaton',
      'River Phoenix',
      'Corey Feldman',
      "Jerry O'Connell",
      'Kiefer Sutherland',
      'Casey Siemaszko',
    ],
  },
  // https://www.themoviedb.org/movie/88
  {
    title: 'Dirty Dancing',
    releaseDate: '1987-08-21',
    runtimeMinutes: 100,
    synopsis:
      "Expecting the usual tedium that accompanies a summer in the Catskills with her family, 17-year-old Frances 'Baby' Houseman is surprised to find herself stepping into the shoes of a professional hoofer—and unexpectedly falling in love.",
    posterUrl: tmdbPoster('9Jw6jys7q9gjzVX5zm1z0gC8gY9'),
    genres: ['Drama', 'Music', 'Romance'],
    directors: ['Emile Ardolino'],
    writers: ['Eleanor Bergstein'],
    cast: [
      'Jennifer Grey',
      'Patrick Swayze',
      'Jerry Orbach',
      'Cynthia Rhodes',
      'Jack Weston',
      'Jane Brucker',
    ],
  },
  // https://www.themoviedb.org/movie/755
  {
    title: 'From Dusk Till Dawn',
    releaseDate: '1996-01-19',
    runtimeMinutes: 108,
    synopsis:
      'After kidnapping a father and his two kids, the Gecko brothers head south to a seedy Mexican bar to hide out in safety, unaware of its notorious clientele.',
    posterUrl: tmdbPoster('sV3kIAmvJ9tPz4Lq5fuf9LLMxte'),
    genres: ['Horror', 'Action', 'Crime'],
    directors: ['Robert Rodriguez'],
    writers: ['Quentin Tarantino'],
    cast: [
      'George Clooney',
      'Quentin Tarantino',
      'Harvey Keitel',
      'Juliette Lewis',
      'Ernest Liu',
      'Salma Hayek Pinault',
    ],
  },
  // https://www.themoviedb.org/movie/861
  {
    title: 'Total Recall',
    releaseDate: '1990-06-01',
    runtimeMinutes: 113,
    synopsis:
      "Construction worker Douglas Quaid's obsession with the planet Mars leads him to visit Rekall, a virtual vacation company that manufactures memories. When something goes wrong during Quaid's memory implant procedure, his life turns upside down, leading him to question what is reality and what isn't.",
    posterUrl: tmdbPoster('wVbeL6fkbTKSmNfalj4VoAUUqJv'),
    genres: ['Action', 'Adventure', 'Science Fiction'],
    directors: ['Paul Verhoeven'],
    writers: ["Dan O'Bannon", 'Ronald Shusett', 'Gary Goldman'],
    cast: [
      'Arnold Schwarzenegger',
      'Rachel Ticotin',
      'Sharon Stone',
      'Ronny Cox',
      'Michael Ironside',
      'Marshall Bell',
    ],
  },
  // https://www.themoviedb.org/movie/1250
  {
    title: 'Ghost Rider',
    releaseDate: '2007-01-15',
    runtimeMinutes: 114,
    synopsis:
      "In order to save his dying father, young stunt cyclist Johnny Blaze sells his soul to Mephistopheles and sadly parts from the pure-hearted Roxanne Simpson, the love of his life. Years later, Johnny's path crosses again with Roxanne, now a go-getting reporter, and also with Mephistopheles, who offers to release Johnny's soul if Johnny becomes the fabled, fiery 'Ghost Rider'.",
    posterUrl: tmdbPoster('1KyJfmgCo2dUywUxpk6bGMZbyeZ'),
    genres: ['Thriller', 'Action', 'Fantasy'],
    directors: ['Mark Steven Johnson'],
    writers: ['Mark Steven Johnson'],
    cast: ['Nicolas Cage', 'Eva Mendes', 'Sam Elliott', 'Wes Bentley', 'Peter Fonda', 'Matt Long'],
  },
  // https://www.themoviedb.org/movie/1579
  {
    title: 'Apocalypto',
    releaseDate: '2006-12-07',
    runtimeMinutes: 138,
    synopsis:
      "Set in the Mayan civilization, when a man's idyllic presence is brutally disrupted by a violent invading force, he is taken on a perilous journey to a world ruled by fear and oppression where a harrowing end awaits him. Through a twist of fate and spurred by the power of his love for his woman and his family he will make a desperate break to return home and to ultimately save his way of life.",
    posterUrl: tmdbPoster('cRY25Q32kDNPFDkFkxAs6bgCq3L'),
    genres: ['Action', 'Drama', 'History'],
    directors: ['Mel Gibson'],
    writers: ['Mel Gibson', 'Farhad Safinia'],
    cast: [
      'Rudy Youngblood',
      'Raoul Max Trujillo',
      'Gerardo Taracena',
      'Iazua Larios',
      'Antonio Monroy',
      'María Isabel Díaz Lago',
    ],
  },
  // https://www.themoviedb.org/movie/628
  {
    title: 'Interview with the Vampire',
    releaseDate: '1994-11-11',
    runtimeMinutes: 123,
    synopsis:
      'A vampire relates his epic life story of love, betrayal, loneliness, and dark hunger to an over-curious reporter.',
    posterUrl: tmdbPoster('2162lAT2MP36MyJd2sttmj5du5T'),
    genres: ['Horror', 'Drama', 'Fantasy'],
    directors: ['Neil Jordan'],
    writers: ['Anne Rice'],
    cast: [
      'Tom Cruise',
      'Brad Pitt',
      'Antonio Banderas',
      'Christian Slater',
      'Stephen Rea',
      'Kirsten Dunst',
    ],
  },
  // https://www.themoviedb.org/movie/762
  {
    title: 'Monty Python and the Holy Grail',
    releaseDate: '1975-04-03',
    runtimeMinutes: 91,
    synopsis:
      'King Arthur, accompanied by his squire, recruits his Knights of the Round Table, including Sir Bedevere the Wise, Sir Lancelot the Brave, Sir Robin the Not-Quite-So-Brave-As-Sir-Lancelot and Sir Galahad the Pure. On the way, Arthur battles the Black Knight who, despite having had all his limbs chopped off, insists he can still fight. They reach Camelot, but Arthur decides not  to enter, as "it is a silly place".',
    posterUrl: tmdbPoster('7nTkHjETdGMYK1phHwDbPsrzbYl'),
    genres: ['Adventure', 'Comedy', 'Fantasy'],
    directors: ['Terry Jones', 'Terry Gilliam'],
    writers: [
      'Terry Jones',
      'Terry Gilliam',
      'Graham Chapman',
      'Thomas Malory',
      'Michael Palin',
      'John Cleese',
      'Eric Idle',
    ],
    cast: [
      'Graham Chapman',
      'John Cleese',
      'Eric Idle',
      'Terry Gilliam',
      'Terry Jones',
      'Michael Palin',
    ],
  },
  // https://www.themoviedb.org/movie/1573
  {
    title: 'Die Hard 2',
    releaseDate: '1990-07-03',
    runtimeMinutes: 124,
    synopsis:
      "One year after his heroics in Los Angeles, John McClane is an off-duty cop who is the wrong guy in the wrong place at the wrong time. On a snowy Christmas Eve, as he waits for his wife's plane to land at Washington Dulles International Airport, terrorists take over the air traffic control system in a plot to free a South American army general and drug smuggler being flown into the US to face drug charges. It's now up to McClane to take on the terrorists, while coping with an inept airport police chief, an uncooperative anti-terrorist squad, and the life of his wife and everyone else trapped in planes circling overhead.",
    posterUrl: tmdbPoster('ybki0UWO3OPhaM6MSniuKC7sy1R'),
    genres: ['Action', 'Thriller'],
    directors: ['Renny Harlin'],
    writers: ['Doug Richardson', 'Steven E. de Souza'],
    cast: [
      'Bruce Willis',
      'Bonnie Bedelia',
      'William Sadler',
      'John Amos',
      'Franco Nero',
      'William Atherton',
    ],
  },
  // https://www.themoviedb.org/movie/1597
  {
    title: 'Meet the Parents',
    releaseDate: '2000-10-06',
    runtimeMinutes: 108,
    synopsis:
      "Greg Focker is ready to marry his girlfriend, Pam, but before he pops the question, he must win over her formidable father, humorless former CIA agent Jack Byrnes, at the wedding of Pam's sister. As Greg bends over backward to make a good impression, his visit to the Byrnes home turns into a hilarious series of disasters, and everything that can go wrong does, all under Jack's critical, hawklike gaze.",
    posterUrl: tmdbPoster('5tXJ9ctuyEOMUFLaeqRisbXowWs'),
    genres: ['Comedy', 'Romance'],
    directors: ['Jay Roach'],
    writers: ['John Hamburg', 'Jim Herzfeld'],
    cast: [
      'Ben Stiller',
      'Robert De Niro',
      'Teri Polo',
      'Blythe Danner',
      'Nicole DeHuff',
      'Jon Abrahams',
    ],
  },
  // https://www.themoviedb.org/movie/855
  {
    title: 'Black Hawk Down',
    releaseDate: '2001-12-28',
    runtimeMinutes: 145,
    synopsis:
      'When U.S. Rangers and an elite Delta Force team attempt to kidnap two underlings of a Somali warlord, their Black Hawk helicopters are shot down, and the Americans suffer heavy casualties, facing intense fighting from the militia on the ground.',
    posterUrl: tmdbPoster('7fU5dSqKRL4XHeEUz62rCKBfYok'),
    genres: ['Action', 'War', 'History'],
    directors: ['Ridley Scott'],
    writers: ['Ken Nolan'],
    cast: [
      'Josh Hartnett',
      'Eric Bana',
      'Ewan McGregor',
      'Tom Sizemore',
      'William Fichtner',
      'Sam Shepard',
    ],
  },
  // https://www.themoviedb.org/movie/388
  {
    title: 'Inside Man',
    releaseDate: '2006-03-17',
    runtimeMinutes: 129,
    synopsis:
      'When an armed, masked gang enter a Manhattan bank, lock the doors and take hostages, the detective assigned to effect their release enters negotiations preoccupied with corruption charges he is facing.',
    posterUrl: tmdbPoster('ffMUgkDZICNiyaws1Jkv8qG8uFW'),
    genres: ['Crime', 'Drama', 'Thriller'],
    directors: ['Spike Lee'],
    writers: ['Russell Gewirtz'],
    cast: [
      'Denzel Washington',
      'Clive Owen',
      'Jodie Foster',
      'Christopher Plummer',
      'Willem Dafoe',
      'Chiwetel Ejiofor',
    ],
  },
  // https://www.themoviedb.org/movie/1571
  {
    title: 'Live Free or Die Hard',
    releaseDate: '2007-06-20',
    runtimeMinutes: 128,
    synopsis:
      "John McClane is back and badder than ever, and this time he calls on the services of a young hacker in his bid to stop a ring of Internet terrorists intent on taking control of America's computer infrastructure.",
    posterUrl: tmdbPoster('31TT47YjBl7a7uvJ3ff1nrirXhP'),
    genres: ['Action', 'Thriller'],
    directors: ['Len Wiseman'],
    writers: ['Mark Bomback'],
    cast: [
      'Bruce Willis',
      'Timothy Olyphant',
      'Justin Long',
      'Cliff Curtis',
      'Mary Elizabeth Winstead',
      'Jonathan Sadowski',
    ],
  },
  // https://www.themoviedb.org/movie/426
  {
    title: 'Vertigo',
    releaseDate: '1958-05-09',
    runtimeMinutes: 128,
    synopsis:
      "A retired San Francisco detective suffering from acrophobia investigates the strange activities of an old friend's wife, all the while becoming dangerously obsessed with her.",
    posterUrl: tmdbPoster('15uOEfqBNTVtDUT7hGBVCka0rZz'),
    genres: ['Mystery', 'Romance', 'Thriller'],
    directors: ['Alfred Hitchcock'],
    writers: ['Samuel A. Taylor', 'Alec Coppel'],
    cast: [
      'James Stewart',
      'Kim Novak',
      'Barbara Bel Geddes',
      'Tom Helmore',
      'Henry Jones',
      'Raymond Bailey',
    ],
  },
  // https://www.themoviedb.org/movie/1538
  {
    title: 'Collateral',
    releaseDate: '2004-08-04',
    runtimeMinutes: 120,
    synopsis:
      'Cab driver Max picks up a man who offers him $600 to drive him around. But the promise of easy money sours when Max realizes his fare is an assassin.',
    posterUrl: tmdbPoster('nV5316WUsVij8sVXLCF1g7TFitg'),
    genres: ['Drama', 'Crime', 'Thriller'],
    directors: ['Michael Mann'],
    writers: ['Stuart Beattie'],
    cast: [
      'Tom Cruise',
      'Jamie Foxx',
      'Jada Pinkett Smith',
      'Mark Ruffalo',
      'Peter Berg',
      'Javier Bardem',
    ],
  },
  // https://www.themoviedb.org/movie/1624
  {
    title: 'Liar Liar',
    releaseDate: '1997-03-21',
    runtimeMinutes: 86,
    synopsis:
      "Forced by his son's birthday wish, fast-talking attorney and habitual liar Fletcher Reede must tell the truth for the next 24 hours.",
    posterUrl: tmdbPoster('p1habYSdC7oD3WygQ5lynU5G5rV'),
    genres: ['Comedy', 'Fantasy'],
    directors: ['Tom Shadyac'],
    writers: ['Stephen Mazur', 'Paul Guay'],
    cast: [
      'Jim Carrey',
      'Maura Tierney',
      'Justin Cooper',
      'Cary Elwes',
      'Anne Haney',
      'Amanda Donohoe',
    ],
  },
  // https://www.themoviedb.org/movie/948
  {
    title: 'Halloween',
    releaseDate: '1978-10-24',
    runtimeMinutes: 91,
    synopsis:
      'Fifteen years after murdering his sister on Halloween Night 1963, Michael Myers escapes from a mental hospital and returns to the small town of Haddonfield, Illinois to kill again.',
    posterUrl: tmdbPoster('wijlZ3HaYMvlDTPqJoTCWKFkCPU'),
    genres: ['Horror', 'Thriller'],
    directors: ['John Carpenter'],
    writers: ['John Carpenter', 'Debra Hill'],
    cast: [
      'Donald Pleasence',
      'Jamie Lee Curtis',
      'Nancy Kyes',
      'P. J. Soles',
      'Charles Cyphers',
      'Kyle Richards',
    ],
  },
  // https://www.themoviedb.org/movie/1584
  {
    title: 'The School of Rock',
    releaseDate: '2003-10-03',
    runtimeMinutes: 110,
    synopsis:
      "Fired from his band and hard up for cash, guitarist and vocalist Dewey Finn finagles his way into a job as a fifth-grade substitute teacher at a private school, where he secretly begins teaching his straight-A students the finer points of rock 'n' roll and the power of sticking it to the man. But as the school’s stern principal closes in and the Battle of the Bands looms, Dewey must risk everything to prove that rock 'n' roll can change lives.",
    posterUrl: tmdbPoster('zXLXaepIBvFVLU25DH3wv4IPSbe'),
    genres: ['Comedy', 'Family', 'Music'],
    directors: ['Richard Linklater'],
    writers: ['Mike White'],
    cast: [
      'Jack Black',
      'Joan Cusack',
      'Mike White',
      'Sarah Silverman',
      'Miranda Cosgrove',
      'Joey Gaydos Jr.',
    ],
  },
  // https://www.themoviedb.org/movie/856
  {
    title: 'Who Framed Roger Rabbit',
    releaseDate: '1988-06-22',
    runtimeMinutes: 104,
    synopsis:
      'Toon star Roger is worried that his wife Jessica is playing pattycake with someone else, so the studio hires detective Eddie Valiant to snoop on her. But the stakes are quickly raised when Marvin Acme is found dead and Roger is the prime suspect.',
    posterUrl: tmdbPoster('lYfRc57Kx9VgLZ48iulu0HKnM15'),
    genres: ['Fantasy', 'Animation', 'Comedy', 'Crime'],
    directors: ['Robert Zemeckis'],
    writers: ['Peter S. Seaman', 'Jeffrey Price'],
    cast: [
      'Bob Hoskins',
      'Christopher Lloyd',
      'Joanna Cassidy',
      'Charles Fleischer',
      'Kathleen Turner',
      'Stubby Kaye',
    ],
  },
  // https://www.themoviedb.org/movie/117
  {
    title: 'The Untouchables',
    releaseDate: '1987-06-03',
    runtimeMinutes: 119,
    synopsis:
      'Elliot Ness, an ambitious prohibition agent, is determined to take down Al Capone. In order to achieve this goal, he forms a group given the nickname “The Untouchables”.',
    posterUrl: tmdbPoster('tPq0R4jTO4Ey8ZspFaWK9wGA4Ls'),
    genres: ['Crime', 'History', 'Thriller'],
    directors: ['Brian De Palma'],
    writers: ['David Mamet'],
    cast: [
      'Kevin Costner',
      'Sean Connery',
      'Robert De Niro',
      'Charles Martin Smith',
      'Andy Garcia',
      'Richard Bradford',
    ],
  },
  // https://www.themoviedb.org/movie/935
  {
    title: 'Dr. Strangelove or: How I Learned to Stop Worrying and Love the Bomb',
    releaseDate: '1964-01-29',
    runtimeMinutes: 95,
    synopsis:
      'After the insane General Jack D. Ripper initiates a nuclear strike on the Soviet Union, a war room full of politicians, generals and a Russian diplomat all frantically try to stop it.',
    posterUrl: tmdbPoster('gHm96BRW4GoI339rF1vYoYTB6Qe'),
    genres: ['Comedy', 'War'],
    directors: ['Stanley Kubrick'],
    writers: ['Stanley Kubrick', 'Peter George', 'Terry Southern'],
    cast: [
      'Peter Sellers',
      'George C. Scott',
      'Sterling Hayden',
      'Keenan Wynn',
      'Slim Pickens',
      'Peter Bull',
    ],
  },
  // https://www.themoviedb.org/movie/630
  {
    title: 'The Wizard of Oz',
    releaseDate: '1939-08-21',
    runtimeMinutes: 102,
    synopsis:
      'Young Dorothy finds herself in a magical world where she makes friends with a lion, a scarecrow and a tin man as they make their way along the yellow brick road to talk with the Wizard and ask for the things they miss most in their lives. The Wicked Witch of the West is the only thing that could stop them.',
    posterUrl: tmdbPoster('uCC3j4pV9eOZwzDUWp2ilbcTf1f'),
    genres: ['Adventure', 'Fantasy', 'Family'],
    directors: ['Victor Fleming'],
    writers: ['Noel Langley', 'Edgar Allan Woolf', 'Florence Ryerson'],
    cast: [
      'Judy Garland',
      'Ray Bolger',
      'Jack Haley',
      'Bert Lahr',
      'Frank Morgan',
      'Margaret Hamilton',
    ],
  },
  // https://www.themoviedb.org/movie/15
  {
    title: 'Citizen Kane',
    releaseDate: '1941-04-17',
    runtimeMinutes: 119,
    synopsis:
      'Newspaper magnate Charles Foster Kane is taken from his mother as a boy and made the ward of a rich industrialist. As a result, every well-meaning, tyrannical or self-destructive move he makes for the rest of his life appears in some way to be a reaction to that deeply wounding event.',
    posterUrl: tmdbPoster('sav0jxhqiH0bPr2vZFU0Kjt2nZL'),
    genres: ['Mystery', 'Drama'],
    directors: ['Orson Welles'],
    writers: ['Orson Welles', 'Herman J. Mankiewicz'],
    cast: [
      'Orson Welles',
      'Joseph Cotten',
      'Dorothy Comingore',
      'Ray Collins',
      'George Coulouris',
      'Agnes Moorehead',
    ],
  },
  // https://www.themoviedb.org/movie/251
  {
    title: 'Ghost',
    releaseDate: '1990-07-13',
    runtimeMinutes: 127,
    synopsis:
      'After a young man is murdered, his spirit stays behind to warn his lover of impending danger, with the help of a reluctant psychic.',
    posterUrl: tmdbPoster('w9RaPHov8oM5cnzeE27isnFMsvS'),
    genres: ['Fantasy', 'Romance', 'Thriller'],
    directors: ['Jerry Zucker'],
    writers: ['Bruce Joel Rubin'],
    cast: [
      'Patrick Swayze',
      'Demi Moore',
      'Whoopi Goldberg',
      'Tony Goldwyn',
      'Vincent Schiavelli',
      'Rick Aviles',
    ],
  },
  // https://www.themoviedb.org/movie/496
  {
    title: 'Borat: Cultural Learnings of America for Make Benefit Glorious Nation of Kazakhstan',
    releaseDate: '2006-11-01',
    runtimeMinutes: 84,
    synopsis:
      'Kazakh journalist Borat Sagdiyev travels to America to make a documentary. As he zigzags across the nation, Borat meets real people in real situations with hysterical consequences. His backwards behavior generates strong reactions around him exposing prejudices and hypocrisies in American culture.',
    posterUrl: tmdbPoster('7g9kBHMN2KTr5KUf8aen187Mdn'),
    genres: ['Comedy'],
    directors: ['Larry Charles'],
    writers: ['Peter Baynham', 'Anthony Hines', 'Sacha Baron Cohen', 'Dan Mazer'],
    cast: [
      'Sacha Baron Cohen',
      'Ken Davitian',
      'Luenell',
      'Pamela Anderson',
      'Bob Barr',
      'Alan Keyes',
    ],
  },
  // https://www.themoviedb.org/movie/568
  {
    title: 'Apollo 13',
    releaseDate: '1995-06-30',
    runtimeMinutes: 140,
    synopsis:
      'The true story of technical troubles that scuttle the Apollo 13 lunar mission in 1970, risking the lives of astronaut Jim Lovell and his crew, with the failed journey turning into a thrilling saga of heroism. Drifting more than 200,000 miles from Earth, the astronauts work furiously with the ground crew to avert tragedy.',
    posterUrl: tmdbPoster('tVeKscCm2fY1xDXZk8PgnZ87h9S'),
    genres: ['Drama', 'History'],
    directors: ['Ron Howard'],
    writers: ['William Broyles Jr.', 'Al Reinert'],
    cast: [
      'Tom Hanks',
      'Bill Paxton',
      'Kevin Bacon',
      'Gary Sinise',
      'Ed Harris',
      'Kathleen Quinlan',
    ],
  },
  // https://www.themoviedb.org/movie/754
  {
    title: 'Face/Off',
    releaseDate: '1997-06-27',
    runtimeMinutes: 139,
    synopsis:
      'In order to foil a terrorist plot, an FBI agent undergoes facial transplant surgery and assumes the identity of a criminal mastermind. The plan turns sour when the criminal wakes up prematurely and seeks revenge.',
    posterUrl: tmdbPoster('69Xzn8UdPbVnmqSChKz2RTpoNfB'),
    genres: ['Action', 'Crime', 'Science Fiction'],
    directors: ['John Woo'],
    writers: ['Mike Werb', 'Michael Colleary'],
    cast: [
      'John Travolta',
      'Nicolas Cage',
      'Joan Allen',
      'Alessandro Nivola',
      'Gina Gershon',
      'Dominique Swain',
    ],
  },
  // https://www.themoviedb.org/movie/215
  {
    title: 'Saw II',
    releaseDate: '2005-10-28',
    runtimeMinutes: 93,
    synopsis:
      "The chilling and relentless Jigsaw killer returns to terrorize the city once again. When a gruesome murder victim emerges with unmistakable traces of Jigsaw's sinister methods, Detective Eric Matthews is thrust into a high-stakes investigation. To his surprise, apprehending Jigsaw seems almost too easy, but what he doesn't realize is that being caught is merely another piece of Jigsaw's intricate puzzle.",
    posterUrl: tmdbPoster('gTnaTysN8HsvVQqTRUh8m35mmUA'),
    genres: ['Horror'],
    directors: ['Darren Lynn Bousman'],
    writers: ['Leigh Whannell', 'Darren Lynn Bousman'],
    cast: [
      'Tobin Bell',
      'Donnie Wahlberg',
      'Shawnee Smith',
      'Erik Knudsen',
      'Franky G',
      'Glenn Plummer',
    ],
  },
  // https://www.themoviedb.org/movie/1635
  {
    title: 'The Island',
    releaseDate: '2005-07-21',
    runtimeMinutes: 136,
    synopsis:
      'In 2019, Lincoln Six-Echo is a resident of a seemingly "Utopian" but contained facility. Like all of the inhabitants of this carefully-controlled environment, Lincoln hopes to be chosen to go to The Island — reportedly the last uncontaminated location on the planet. But Lincoln soon discovers that everything about his existence is a lie.',
    posterUrl: tmdbPoster('9MaZYEyFmQwNeDTxZGQEN8E0e4p'),
    genres: ['Action', 'Thriller', 'Science Fiction'],
    directors: ['Michael Bay'],
    writers: ['Caspian Tredwell-Owen', 'Roberto Orci', 'Alex Kurtzman'],
    cast: [
      'Ewan McGregor',
      'Scarlett Johansson',
      'Djimon Hounsou',
      'Sean Bean',
      'Steve Buscemi',
      'Michael Clarke Duncan',
    ],
  },
  // https://www.themoviedb.org/movie/75
  {
    title: 'Mars Attacks!',
    releaseDate: '1996-12-13',
    runtimeMinutes: 106,
    synopsis:
      'A fleet of Martian spacecraft surrounds the world\'s major cities and all of humanity waits to see if the extraterrestrial visitors have, as they claim, "come in peace." U.S. President James Dale receives assurance from science professor Donald Kessler that the Martians\' mission is a friendly one. But when a peaceful exchange ends in the total annihilation of the U.S. Congress, military men call for a full-scale nuclear retaliation.',
    posterUrl: tmdbPoster('hll4O5vSAfnZDb6JbnP06GPtz7b'),
    genres: ['Comedy', 'Fantasy', 'Science Fiction'],
    directors: ['Tim Burton'],
    writers: ['Jonathan Gems'],
    cast: [
      'Jack Nicholson',
      'Glenn Close',
      'Annette Bening',
      'Pierce Brosnan',
      'Danny DeVito',
      'Martin Short',
    ],
  },
  // https://www.themoviedb.org/movie/377
  {
    title: 'A Nightmare on Elm Street',
    releaseDate: '1984-11-09',
    runtimeMinutes: 91,
    synopsis:
      "Teenagers in a small town are dropping like flies, apparently in the grip of mass hysteria causing their suicides. A cop's daughter, Nancy Thompson, traces the cause to child molester Fred Krueger, who was burned alive by angry parents many years before. Krueger has now come back in the dreams of his killers' children, claiming their lives as his revenge. Nancy and her boyfriend, Glen, must devise a plan to lure the monster out of the realm of nightmares and into the real world...",
    posterUrl: tmdbPoster('b9rMHAAKISRmIonaQd9Cccx0S4X'),
    genres: ['Horror'],
    directors: ['Wes Craven'],
    writers: ['Wes Craven'],
    cast: [
      'Heather Langenkamp',
      'Johnny Depp',
      'Robert Englund',
      'Amanda Wyss',
      'Jsu Garcia',
      'John Saxon',
    ],
  },
  // https://www.themoviedb.org/movie/879
  {
    title: 'Hook',
    releaseDate: '1991-04-10',
    runtimeMinutes: 142,
    synopsis:
      "The boy who wasn't supposed to grow up—Peter Pan—does just that, becoming a soulless corporate lawyer whose workaholism could cost him his wife and kids. During his trip to see Granny Wendy in London, the vengeful Capt. Hook kidnaps Peter's kids and forces Peter to return to Neverland.",
    posterUrl: tmdbPoster('a6rB1lGXoGms7gWxRfJneQmAjNV'),
    genres: ['Adventure', 'Fantasy', 'Comedy', 'Family'],
    directors: ['Steven Spielberg'],
    writers: ['Malia Scotch Marmo', 'James V. Hart'],
    cast: [
      'Dustin Hoffman',
      'Robin Williams',
      'Julia Roberts',
      'Bob Hoskins',
      'Maggie Smith',
      'Caroline Goodall',
    ],
  },
  // https://www.themoviedb.org/movie/1562
  {
    title: '28 Weeks Later',
    releaseDate: '2007-04-26',
    runtimeMinutes: 99,
    synopsis:
      'Twenty-eight weeks after the spread of a deadly rage virus, the inhabitants of the British Isles have lost their battle against the onslaught, as the virus has killed everyone there. Six months later, a group of Americans dare to set foot on the Isles, convinced the danger has passed. But it soon becomes all too clear that the scourge continues to live, waiting to pounce on its next victims.',
    posterUrl: tmdbPoster('oix0aNv1lvW3nUGspUyvSIBlpbs'),
    genres: ['Horror', 'Thriller', 'Science Fiction'],
    directors: ['Juan Carlos Fresnadillo'],
    writers: ['Juan Carlos Fresnadillo', 'Rowan Joffé', 'Jesús Olmo', 'Enrique López Lavigne'],
    cast: [
      'Robert Carlyle',
      'Rose Byrne',
      'Jeremy Renner',
      'Harold Perrineau',
      'Catherine McCormack',
      'Mackintosh Muggleton',
    ],
  },
  // https://www.themoviedb.org/movie/1581
  {
    title: 'The Holiday',
    releaseDate: '2006-12-05',
    runtimeMinutes: 136,
    synopsis:
      'Two women, one American and one British, swap homes at Christmastime following bad breakups. Each woman finds romance with a local man but realizes that the imminent return home may end the relationship.',
    posterUrl: tmdbPoster('h1ITOpvJN3Tw4Sy60w2QTfYMvdd'),
    genres: ['Comedy', 'Romance'],
    directors: ['Nancy Meyers'],
    writers: ['Nancy Meyers'],
    cast: ['Cameron Diaz', 'Kate Winslet', 'Jude Law', 'Jack Black', 'Eli Wallach', 'Edward Burns'],
  },
  // https://www.themoviedb.org/movie/414
  {
    title: 'Batman Forever',
    releaseDate: '1995-06-16',
    runtimeMinutes: 121,
    synopsis:
      "Batman faces off against two foes: the schizophrenic, horribly scarred former District Attorney Harvey Dent, aka Two-Face, and the Riddler, a disgruntled ex-Wayne Enterprises inventor seeking revenge against his former employer by unleashing his brain-sucking weapon on Gotham City's residents. As the caped crusader also copes with tortured memories of his parents' murder, he has a new romance, with psychologist Chase Meridian.",
    posterUrl: tmdbPoster('i0fJS8M5UKoETjjJ0zwUiKaR8tr'),
    genres: ['Action', 'Crime', 'Fantasy'],
    directors: ['Joel Schumacher'],
    writers: ['Lee Batchler', 'Janet Scott Batchler', 'Akiva Goldsman'],
    cast: [
      'Val Kilmer',
      'Tommy Lee Jones',
      'Jim Carrey',
      'Nicole Kidman',
      "Chris O'Donnell",
      'Michael Gough',
    ],
  },
  // https://www.themoviedb.org/movie/563
  {
    title: 'Starship Troopers',
    releaseDate: '1997-11-07',
    runtimeMinutes: 129,
    synopsis:
      'Set in the future, the story follows a young soldier named Johnny Rico and his exploits in the Mobile Infantry. Rico\'s military career progresses from recruit to non-commissioned officer and finally to officer against the backdrop of an interstellar war between mankind and an arachnoid species known as "the Bugs."',
    posterUrl: tmdbPoster('cxCmv23O7p3hyHwqoktHYkZcGsY'),
    genres: ['Adventure', 'Action', 'Thriller', 'Science Fiction'],
    directors: ['Paul Verhoeven'],
    writers: ['Edward Neumeier'],
    cast: [
      'Casper Van Dien',
      'Dina Meyer',
      'Denise Richards',
      'Jake Busey',
      'Neil Patrick Harris',
      'Clancy Brown',
    ],
  },
  // https://www.themoviedb.org/movie/634
  {
    title: "Bridget Jones's Diary",
    releaseDate: '2001-04-13',
    runtimeMinutes: 97,
    synopsis:
      "Bridget Jones is an average woman struggling against expectations. As a New Year's resolution, Bridget decides to take control of her life, starting by keeping a diary in which she will always tell the complete truth. Her charming boss takes an interest in her, and she cannot stop running into a rather disagreeable acquaintance whom Bridget cannot help finding quietly attractive.",
    posterUrl: tmdbPoster('olMTi7uCaec9Yr3Ar07D2SIja1G'),
    genres: ['Comedy', 'Romance', 'Drama'],
    directors: ['Sharon Maguire'],
    writers: ['Helen Fielding', 'Andrew Davies', 'Richard Curtis'],
    cast: [
      'Renée Zellweger',
      'Colin Firth',
      'Hugh Grant',
      'Jim Broadbent',
      'Gemma Jones',
      'James Callis',
    ],
  },
  // https://www.themoviedb.org/movie/415
  {
    title: 'Batman & Robin',
    releaseDate: '1997-06-20',
    runtimeMinutes: 125,
    synopsis:
      "Batman and his sidekick Robin attempt to the foil the sinister schemes of a deranged set of new villains, most notably the melancholy Mr. Freeze, who wants to make Gotham City into an arctic region, and the sultry Poison Ivy, a botanical femme fatale. As the Dynamic Duo contend with these bad guys, a third hero, Batgirl, joins the ranks of the city's crime-fighters.",
    posterUrl: tmdbPoster('i7hEUpDuMN2LOrCEifFyGSHZQSY'),
    genres: ['Action', 'Science Fiction', 'Adventure'],
    directors: ['Joel Schumacher'],
    writers: ['Akiva Goldsman'],
    cast: [
      'George Clooney',
      "Chris O'Donnell",
      'Arnold Schwarzenegger',
      'Uma Thurman',
      'Alicia Silverstone',
      'Michael Gough',
    ],
  },
  // https://www.themoviedb.org/movie/544
  {
    title: "There's Something About Mary",
    releaseDate: '1998-07-15',
    runtimeMinutes: 120,
    synopsis:
      'For Ted, prom night went about as bad as it’s possible for any night to go. Thirteen years later, he finally gets another chance with his old prom date, only to run up against other suitors including the sleazy detective he hired to find her.',
    posterUrl: tmdbPoster('slJD1Dvnsf15LoeqhERsyzisAdn'),
    genres: ['Romance', 'Comedy'],
    directors: ['Bobby Farrelly', 'Peter Farrelly'],
    writers: ['Bobby Farrelly', 'Peter Farrelly', 'Ed Decter', 'John J. Strauss'],
    cast: ['Cameron Diaz', 'Matt Dillon', 'Ben Stiller', 'Lee Evans', 'Chris Elliott', 'Lin Shaye'],
  },
  // https://www.themoviedb.org/movie/454
  {
    title: 'Romeo + Juliet',
    releaseDate: '1996-11-01',
    runtimeMinutes: 120,
    synopsis:
      "In this contemporary take on William Shakespeare's classic tragedy, the Montagues and Capulets have moved their ongoing feud to the sweltering suburb of Verona Beach, where Romeo and Juliet fall in love and secretly wed. Though the film is visually modern, the bard's dialogue remains.",
    posterUrl: tmdbPoster('eLf4jclPijOqfEp6bDAmezRFxk5'),
    genres: ['Drama', 'Romance'],
    directors: ['Baz Luhrmann'],
    writers: ['Baz Luhrmann', 'Craig Pearce'],
    cast: [
      'Leonardo DiCaprio',
      'Claire Danes',
      'Jesse Bradford',
      'Vondie Curtis-Hall',
      'Brian Dennehy',
      'John Leguizamo',
    ],
  },
  // https://www.themoviedb.org/movie/320
  {
    title: 'Insomnia',
    releaseDate: '2002-05-24',
    runtimeMinutes: 118,
    synopsis:
      "Two Los Angeles homicide detectives are dispatched to a northern town where the sun doesn't set to investigate the methodical murder of a local teen.",
    posterUrl: tmdbPoster('riVXh3EimGO0y5dgQxEWPRy5Itg'),
    genres: ['Thriller', 'Crime', 'Drama'],
    directors: ['Christopher Nolan'],
    writers: ['Hillary Seitz'],
    cast: [
      'Al Pacino',
      'Robin Williams',
      'Hilary Swank',
      'Maura Tierney',
      'Martin Donovan',
      'Nicky Katt',
    ],
  },
  // https://www.themoviedb.org/movie/1491
  {
    title: 'The Illusionist',
    releaseDate: '2006-08-18',
    runtimeMinutes: 110,
    synopsis:
      "With his eye on a lovely aristocrat, a gifted illusionist named Eisenheim uses his powers to win her away from her betrothed, a crown prince. But Eisenheim's scheme creates tumult within the monarchy and ignites the suspicion of a dogged inspector.",
    posterUrl: tmdbPoster('1O9jUvqkHaGBMVRyOJz1AlkmALW'),
    genres: ['Fantasy', 'Drama', 'Thriller', 'Romance'],
    directors: ['Neil Burger'],
    writers: ['Neil Burger'],
    cast: [
      'Edward Norton',
      'Paul Giamatti',
      'Jessica Biel',
      'Rufus Sewell',
      'Eddie Marsan',
      'Aaron Taylor-Johnson',
    ],
  },
  // https://www.themoviedb.org/movie/1265
  {
    title: 'Bridge to Terabithia',
    releaseDate: '2007-02-15',
    runtimeMinutes: 95,
    synopsis:
      "Jesse Aarons trained all summer to become the fastest runner in school. So he's very upset when newcomer Leslie Burke outruns him and everyone else. Despite this and other differences including that she's rich, he's poor, she's a city girl, and he's a country boy the two become fast friends. Together they create Terabithia, a land of monsters, trolls, ogres, and giants where they rule as king and queen.",
    posterUrl: tmdbPoster('3xFxGodKPMFLheS8rujFSmLfcq4'),
    genres: ['Adventure', 'Drama', 'Family'],
    directors: ['Gábor Csupó'],
    writers: ['Jeff Stockwell'],
    cast: [
      'Josh Hutcherson',
      'AnnaSophia Robb',
      'Zooey Deschanel',
      'Robert Patrick',
      'Bailee Madison',
      'Kate Butler',
    ],
  },
  // https://www.themoviedb.org/movie/1700
  {
    title: 'Misery',
    releaseDate: '1990-11-30',
    runtimeMinutes: 107,
    synopsis:
      'After an accident, acclaimed novelist Paul Sheldon is rescued by a nurse who claims to be his biggest fan.  Her obsession takes a dark turn when she holds him captive in her remote Colorado home and forces him to write back to life the popular literary character he killed off.',
    posterUrl: tmdbPoster('klPO5oh1LOxiPpdDXZo1ADgpKcw'),
    genres: ['Drama', 'Thriller'],
    directors: ['Rob Reiner'],
    writers: ['William Goldman', 'Stephen King'],
    cast: [
      'Kathy Bates',
      'James Caan',
      'Richard Farnsworth',
      'Lauren Bacall',
      'Frances Sternhagen',
      'Graham Jarvis',
    ],
  },
  // https://www.themoviedb.org/movie/431
  {
    title: 'Cube',
    releaseDate: '1998-07-11',
    runtimeMinutes: 90,
    synopsis:
      "A group of strangers find themselves trapped in a maze-like prison. It soon becomes clear that each of them possesses the peculiar skills necessary to escape, if they don't wind up dead first.",
    posterUrl: tmdbPoster('x4BTjxdrOKC27FcSkBh8KPEgnum'),
    genres: ['Thriller', 'Science Fiction', 'Mystery'],
    directors: ['Vincenzo Natali'],
    writers: ['Vincenzo Natali', 'André Bijelic', 'Graeme Manson'],
    cast: [
      'Nicole De Boer',
      'Nicky Guadagni',
      'Maurice Dean Wint',
      'David Hewlett',
      'Andrew Miller',
      'Wayne Robson',
    ],
  },
  // https://www.themoviedb.org/movie/615
  {
    title: 'The Passion of the Christ',
    releaseDate: '2004-02-25',
    runtimeMinutes: 127,
    synopsis: "A graphic portrayal of the last twelve hours of Jesus of Nazareth's life.",
    posterUrl: tmdbPoster('rBM5o2HpmCfDejuIPybI09tkY3V'),
    genres: ['Drama'],
    directors: ['Mel Gibson'],
    writers: ['Mel Gibson', 'Benedict Fitzgerald'],
    cast: [
      'Jim Caviezel',
      'Maia Morgenstern',
      'Christo Jivkov',
      'Francesco De Vito',
      'Monica Bellucci',
      'Mattia Sbragia',
    ],
  },
  // https://www.themoviedb.org/movie/693
  {
    title: 'Meet the Fockers',
    releaseDate: '2004-12-22',
    runtimeMinutes: 115,
    synopsis:
      'Hard-to-crack ex-CIA man Jack Byrnes and his wife Dina head for the warmer climes of Florida to meet the parents of their son-in-law-to-be, Greg Focker. Unlike their happily matched offspring, the future in-laws find themselves in a situation of opposites that definitely do not attract.',
    posterUrl: tmdbPoster('59fXm6N2x7QSbvt6BaBxTNBXGL8'),
    genres: ['Comedy', 'Romance'],
    directors: ['Jay Roach'],
    writers: ['Jim Herzfeld', 'John Hamburg'],
    cast: [
      'Ben Stiller',
      'Robert De Niro',
      'Dustin Hoffman',
      'Barbra Streisand',
      'Blythe Danner',
      'Teri Polo',
    ],
  },
  // https://www.themoviedb.org/movie/792
  {
    title: 'Platoon',
    releaseDate: '1986-12-19',
    runtimeMinutes: 120,
    synopsis:
      'As a young and naive recruit in Vietnam, Chris Taylor faces a moral crisis when confronted with the horrors of war and the duality of man.',
    posterUrl: tmdbPoster('m3mmFkPQKvPZq5exmh0bDuXlD9T'),
    genres: ['Drama', 'War', 'Action'],
    directors: ['Oliver Stone'],
    writers: ['Oliver Stone'],
    cast: [
      'Charlie Sheen',
      'Willem Dafoe',
      'Tom Berenger',
      'Kevin Dillon',
      'Forest Whitaker',
      'Mark Moses',
    ],
  },
  // https://www.themoviedb.org/movie/813
  {
    title: 'Airplane!',
    releaseDate: '1980-06-27',
    runtimeMinutes: 88,
    synopsis:
      'An ex-fighter pilot forced to take over the controls of an airliner when the flight crew succumbs to food poisoning.',
    posterUrl: tmdbPoster('7Q3efxd3AF1vQjlSxnlerSA7RzN'),
    genres: ['Comedy'],
    directors: ['Jerry Zucker', 'David Zucker', 'Jim Abrahams'],
    writers: ['Jerry Zucker', 'David Zucker', 'Jim Abrahams'],
    cast: [
      'Robert Hays',
      'Julie Hagerty',
      'Leslie Nielsen',
      'Kareem Abdul-Jabbar',
      'Lloyd Bridges',
      'Peter Graves',
    ],
  },
  // https://www.themoviedb.org/movie/941
  {
    title: 'Lethal Weapon',
    releaseDate: '1987-03-06',
    runtimeMinutes: 110,
    synopsis:
      'A veteran cop and an unstable detective become partners who must put their differences aside in order to bring down a heroin-smuggling ring run by ex-Special Forces.',
    posterUrl: tmdbPoster('fTq4ThIP3pQTYR9eDepsbDHqdcs'),
    genres: ['Action', 'Thriller', 'Crime'],
    directors: ['Richard Donner'],
    writers: ['Shane Black'],
    cast: [
      'Mel Gibson',
      'Danny Glover',
      'Gary Busey',
      'Mitchell Ryan',
      'Tom Atkins',
      'Darlene Love',
    ],
  },
  // https://www.themoviedb.org/movie/1495
  {
    title: 'Kingdom of Heaven',
    releaseDate: '2005-05-03',
    runtimeMinutes: 144,
    synopsis:
      'After his wife dies, a blacksmith named Balian is thrust into royalty, political intrigue and bloody holy wars during the Crusades.',
    posterUrl: tmdbPoster('rNaBe4TwbMef71sgscqabpGKsxh'),
    genres: ['Drama', 'Action', 'Adventure', 'History', 'War'],
    directors: ['Ridley Scott'],
    writers: ['William Monahan'],
    cast: [
      'Orlando Bloom',
      'Eva Green',
      'Jeremy Irons',
      'David Thewlis',
      'Ghassan Massoud',
      'Liam Neeson',
    ],
  },
  // https://www.themoviedb.org/movie/1427
  {
    title: 'Perfume: The Story of a Murderer',
    releaseDate: '2006-09-13',
    runtimeMinutes: 147,
    synopsis:
      "Jean-Baptiste Grenouille, born in the stench of 18th century Paris, develops a superior olfactory sense, which he uses to create the world's finest perfumes. However, his work takes a dark turn as he tries to preserve scents in the search for the ultimate perfume.",
    posterUrl: tmdbPoster('2wrFrUej8ri5EpjgIkjKTAnr686'),
    genres: ['Crime', 'Fantasy', 'Drama'],
    directors: ['Tom Tykwer'],
    writers: ['Tom Tykwer', 'Andrew Birkin', 'Bernd Eichinger'],
    cast: [
      'Ben Whishaw',
      'Alan Rickman',
      'Rachel Hurd-Wood',
      'Dustin Hoffman',
      'John Hurt',
      'Karoline Herfurth',
    ],
  },
  // https://www.themoviedb.org/movie/686
  {
    title: 'Contact',
    releaseDate: '1997-07-11',
    runtimeMinutes: 150,
    synopsis:
      'A radio astronomer receives the first extraterrestrial radio signal ever picked up on Earth. As the world powers scramble to decipher the message and decide upon a course of action, she must make some difficult decisions between her beliefs, the truth, and reality.',
    posterUrl: tmdbPoster('bCpMIywuNZeWt3i5UMLEIc0VSwM'),
    genres: ['Drama', 'Science Fiction', 'Mystery'],
    directors: ['Robert Zemeckis'],
    writers: ['Michael Goldenberg', 'James V. Hart'],
    cast: [
      'Jodie Foster',
      'Matthew McConaughey',
      'James Woods',
      'John Hurt',
      'Tom Skerritt',
      'William Fichtner',
    ],
  },
  // https://www.themoviedb.org/movie/433
  {
    title: 'Mary Poppins',
    releaseDate: '1964-12-17',
    runtimeMinutes: 139,
    synopsis:
      'In turn of the century London, a magical nanny employs music and adventure to help two neglected children become closer to their father.',
    posterUrl: tmdbPoster('o4Wsby4ydIXhWmtmfvb451D5Np1'),
    genres: ['Comedy', 'Family', 'Fantasy'],
    directors: ['Robert Stevenson'],
    writers: ['Bill Walsh', 'Don DaGradi'],
    cast: [
      'Julie Andrews',
      'Dick Van Dyke',
      'David Tomlinson',
      'Glynis Johns',
      'Hermione Baddeley',
      'Karen Dotrice',
    ],
  },
  // https://www.themoviedb.org/movie/395
  {
    title: 'AVP: Alien vs. Predator',
    releaseDate: '2004-08-12',
    runtimeMinutes: 101,
    synopsis:
      'When scientists discover something near Antarctica that appears to be a buried Pyramid, they send a research team out to investigate. Little do they know that they are about to step into a hunting ground where Aliens are grown as sport for the Predator race.',
    posterUrl: tmdbPoster('ySWu5bCnnmgV1cVacvFnFIhgOjp'),
    genres: ['Adventure', 'Science Fiction', 'Action', 'Horror'],
    directors: ['Paul W. S. Anderson'],
    writers: ['Paul W. S. Anderson'],
    cast: [
      'Sanaa Lathan',
      'Lance Henriksen',
      'Ian Whyte',
      'Raoul Bova',
      'Ewen Bremner',
      'Colin Salmon',
    ],
  },
  // https://www.themoviedb.org/movie/33
  {
    title: 'Unforgiven',
    releaseDate: '1992-08-07',
    runtimeMinutes: 130,
    synopsis:
      'William Munny is a retired, once-ruthless killer turned gentle widower and hog farmer. To help support his two motherless children, he accepts one last bounty-hunter mission to find the men who brutalized a prostitute. Joined by his former partner and a cocky greenhorn, he takes on a corrupt sheriff.',
    posterUrl: tmdbPoster('54roTwbX9fltg85zjsmrooXAs12'),
    genres: ['Western'],
    directors: ['Clint Eastwood'],
    writers: ['David Webb Peoples'],
    cast: [
      'Clint Eastwood',
      'Gene Hackman',
      'Morgan Freeman',
      'Jaimz Woolvett',
      'Richard Harris',
      'Saul Rubinek',
    ],
  },
  // https://www.themoviedb.org/movie/214
  {
    title: 'Saw III',
    releaseDate: '2006-10-26',
    runtimeMinutes: 108,
    synopsis:
      'Jigsaw has disappeared. Along with his new apprentice Amanda, the puppet-master behind the cruel, intricate games that have terrified a community and baffled police has once again eluded capture and vanished. While city detectives scramble to locate him, Doctor Lynn Denlon and Jeff Reinhart are unaware that they are about to become the latest pawns on his vicious chessboard.',
    posterUrl: tmdbPoster('9pWlgGYoPb0QPOsQTjfDmwMdBc6'),
    genres: ['Horror', 'Thriller', 'Crime'],
    directors: ['Darren Lynn Bousman'],
    writers: ['Leigh Whannell'],
    cast: [
      'Tobin Bell',
      'Shawnee Smith',
      'Angus Macfadyen',
      'Bahar Soomekh',
      'Donnie Wahlberg',
      'Dina Meyer',
    ],
  },
  // https://www.themoviedb.org/movie/583
  {
    title: 'Life of Brian',
    releaseDate: '1979-08-17',
    runtimeMinutes: 94,
    synopsis:
      "Brian Cohen is an average young Jewish man, but through a series of ridiculous events, he gains a reputation as the Messiah. When he's not dodging his followers or being scolded by his shrill mother, the hapless Brian has to contend with the pompous Pontius Pilate and acronym-obsessed members of a separatist movement. Rife with Monty Python's signature absurdity, the tale finds Brian's life paralleling Biblical lore, albeit with many more laughs.",
    posterUrl: tmdbPoster('lSSA64WF0M0BXnjwr2quMh6shCl'),
    genres: ['Comedy'],
    directors: ['Terry Jones'],
    writers: [
      'Terry Jones',
      'Terry Gilliam',
      'Michael Palin',
      'Eric Idle',
      'Graham Chapman',
      'John Cleese',
    ],
    cast: [
      'Graham Chapman',
      'John Cleese',
      'Terry Gilliam',
      'Eric Idle',
      'Terry Jones',
      'Michael Palin',
    ],
  },
  // https://www.themoviedb.org/movie/588
  {
    title: 'Silent Hill',
    releaseDate: '2006-04-21',
    runtimeMinutes: 125,
    synopsis:
      'Rose, a desperate mother, takes her adopted daughter, Sharon, to the town of Silent Hill in an attempt to cure her of her ailment. After a violent car crash, Sharon disappears, and Rose embarks on a horrific journey to get her back and begins to uncover the truth behind the apocalyptic disaster that burned the town 30 years earlier.',
    posterUrl: tmdbPoster('r0bEDWO2w4a43K2xTNSF284qOsc'),
    genres: ['Horror', 'Mystery'],
    directors: ['Christophe Gans'],
    writers: ['Roger Avary'],
    cast: [
      'Radha Mitchell',
      'Sean Bean',
      'Jodelle Ferland',
      'Laurie Holden',
      'Deborah Kara Unger',
      'Kim Coates',
    ],
  },
  // https://www.themoviedb.org/movie/335
  {
    title: 'Once Upon a Time in the West',
    releaseDate: '1968-12-21',
    runtimeMinutes: 166,
    synopsis:
      'As the railroad builders advance unstoppably through the Arizona desert on their way to the sea, Jill arrives in the small town of Flagstone with the intention of starting a new life.',
    posterUrl: tmdbPoster('qbYgqOczabWNn2XKwgMtVrntD6P'),
    genres: ['Drama', 'Western'],
    directors: ['Sergio Leone'],
    writers: ['Sergio Leone', 'Sergio Donati'],
    cast: [
      'Claudia Cardinale',
      'Henry Fonda',
      'Jason Robards',
      'Charles Bronson',
      'Gabriele Ferzetti',
      'Paolo Stoppa',
    ],
  },
  // https://www.themoviedb.org/movie/1585
  {
    title: "It's a Wonderful Life",
    releaseDate: '1946-12-20',
    runtimeMinutes: 131,
    synopsis:
      "George Bailey has spent his entire life giving to the people of Bedford Falls.  All that prevents rich skinflint Mr. Potter from taking over the entire town is George's modest building and loan company.  But on Christmas Eve the business's $8,000 is lost and George's troubles begin.",
    posterUrl: tmdbPoster('bSqt9rhDZx1Q7UZ86dBPKdNomp2'),
    genres: ['Drama', 'Family', 'Fantasy'],
    directors: ['Frank Capra'],
    writers: ['Frank Capra', 'Frances Goodrich', 'Albert Hackett'],
    cast: [
      'James Stewart',
      'Donna Reed',
      'Lionel Barrymore',
      'Thomas Mitchell',
      'Henry Travers',
      'Beulah Bondi',
    ],
  },
  // https://www.themoviedb.org/movie/824
  {
    title: 'Moulin Rouge!',
    releaseDate: '2001-05-18',
    runtimeMinutes: 128,
    synopsis:
      "A celebration of love and creative inspiration takes place in the infamous, gaudy and glamorous Parisian nightclub, at the cusp of the 20th century. A young poet, who is plunged into the heady world of Moulin Rouge, begins a passionate affair with the club's most notorious and beautiful star.",
    posterUrl: tmdbPoster('2kjM5CUZRIU5yOANUowrbJcRL9L'),
    genres: ['Drama', 'Romance', 'Music'],
    directors: ['Baz Luhrmann'],
    writers: ['Baz Luhrmann', 'Craig Pearce'],
    cast: [
      'Ewan McGregor',
      'Nicole Kidman',
      'John Leguizamo',
      'Jim Broadbent',
      'Richard Roxburgh',
      'Garry McDonald',
    ],
  },
  // https://www.themoviedb.org/movie/1374
  {
    title: 'Rocky IV',
    releaseDate: '1985-11-21',
    runtimeMinutes: 91,
    synopsis:
      "Rocky Balboa holds the world heavyweight championship, but a new challenger has stepped forward: Drago, a six-foot-four, 261-pound fighter who has the backing of the Soviet Union. This time, Rocky's training regimen takes him to Siberia, where he prepares for a globally televised match in the heart of Moscow. But nothing can truly prepare him for what he's about to face – a fight to the finish, in which he must defend not only himself, but also the honor of his country!",
    posterUrl: tmdbPoster('2MHUit4H6OK5adcOjnCN6suCKOl'),
    genres: ['Drama'],
    directors: ['Sylvester Stallone'],
    writers: ['Sylvester Stallone'],
    cast: [
      'Sylvester Stallone',
      'Dolph Lundgren',
      'Carl Weathers',
      'Talia Shire',
      'Burt Young',
      'Brigitte Nielsen',
    ],
  },
  // https://www.themoviedb.org/movie/1367
  {
    title: 'Rocky II',
    releaseDate: '1979-06-15',
    runtimeMinutes: 119,
    synopsis:
      'After Rocky goes the distance with champ Apollo Creed, both try to put the fight behind them and move on. Rocky settles down with Adrian but can\'t put his life together outside the ring, while Creed seeks a rematch to restore his reputation. Soon enough, the "Master of Disaster" and the "Italian Stallion" are set on a collision course for a climactic battle that is brutal and unforgettable.',
    posterUrl: tmdbPoster('nMaiiu0CzT77U4JZkUYV7KqdAjK'),
    genres: ['Drama'],
    directors: ['Sylvester Stallone'],
    writers: ['Sylvester Stallone'],
    cast: [
      'Sylvester Stallone',
      'Talia Shire',
      'Burt Young',
      'Carl Weathers',
      'Burgess Meredith',
      'Tony Burton',
    ],
  },
  // https://www.themoviedb.org/movie/149
  {
    title: 'Akira',
    releaseDate: '1988-06-10',
    runtimeMinutes: 124,
    synopsis:
      'A secret military project endangers Neo-Tokyo when it turns a biker gang member into a rampaging psychic psychopath that only two teenagers and a group of psychics can stop.',
    posterUrl: tmdbPoster('neZ0ykEsPqxamsX6o5QNUFILQrz'),
    genres: ['Animation', 'Science Fiction', 'Action'],
    directors: ['Katsuhiro Otomo'],
    writers: ['Katsuhiro Otomo', 'Izo Hashimoto'],
    cast: [
      'Mitsuo Iwata',
      'Nozomu Sasaki',
      'Mami Koyama',
      'Taro Ishida',
      'Mizuho Suzuki',
      'Tessyo Genda',
    ],
  },
  // https://www.themoviedb.org/movie/492
  {
    title: 'Being John Malkovich',
    releaseDate: '1999-10-29',
    runtimeMinutes: 113,
    synopsis:
      'One day at work, unsuccessful puppeteer Craig finds a portal into the head of actor John Malkovich. The portal soon becomes a passion for anybody who enters its mad and controlling world of overtaking another human body.',
    posterUrl: tmdbPoster('31FGQu3OnwdmS4COquENe0vMZc0'),
    genres: ['Comedy', 'Drama', 'Fantasy'],
    directors: ['Spike Jonze'],
    writers: ['Charlie Kaufman'],
    cast: [
      'John Cusack',
      'Cameron Diaz',
      'John Malkovich',
      'Catherine Keener',
      'Orson Bean',
      'Mary Kay Place',
    ],
  },
  // https://www.themoviedb.org/movie/1577
  {
    title: 'Resident Evil: Apocalypse',
    releaseDate: '2004-09-10',
    runtimeMinutes: 94,
    synopsis:
      'As the city is locked down under quarantine, Alice finds out that the people that died from the previous incident at the Umbrella Corporation have turned into zombies. She then joins a small band of elite soldiers, who are enlisted to rescue the missing daughter of the creator of the mutating T-virus.  Once lack of luck and resources happen, they begin to wage an exhilarating battle to survive and escape before the Umbrella Corporation erases its experiment from the face of the earth.',
    posterUrl: tmdbPoster('way9dOm4dM2sm9UMcu2PEXMTX0q'),
    genres: ['Horror', 'Action', 'Science Fiction'],
    directors: ['Alexander Witt'],
    writers: ['Paul W. S. Anderson'],
    cast: [
      'Milla Jovovich',
      'Sienna Guillory',
      'Oded Fehr',
      'Thomas Kretschmann',
      'Sophie Vavasseur',
      'Razaaq Adoti',
    ],
  },
  // https://www.themoviedb.org/movie/1578
  {
    title: 'Raging Bull',
    releaseDate: '1980-11-14',
    runtimeMinutes: 129,
    synopsis:
      'The life of boxer Jake LaMotta, whose violence and temper that led him to the top in the ring destroyed his life outside of it.',
    posterUrl: tmdbPoster('1WV7WlTS8LI1L5NkCgjWT9GSW3O'),
    genres: ['Drama', 'History'],
    directors: ['Martin Scorsese'],
    writers: ['Paul Schrader', 'Mardik Martin'],
    cast: [
      'Robert De Niro',
      'Cathy Moriarty',
      'Joe Pesci',
      'Frank Vincent',
      'Nicholas Colasanto',
      'Theresa Saldana',
    ],
  },
  // https://www.themoviedb.org/movie/391
  {
    title: 'A Fistful of Dollars',
    releaseDate: '1964-09-12',
    runtimeMinutes: 99,
    synopsis:
      'The Man With No Name enters the Mexican village of San Miguel in the midst of a power struggle among the three Rojo brothers and sheriff John Baxter. When a regiment of Mexican soldiers bearing gold intended to pay for new weapons is waylaid by the Rojo brothers, the stranger inserts himself into the middle of the long-simmering battle, selling false information to both sides for his own benefit.',
    posterUrl: tmdbPoster('lBwOEpwVeUAmrmglcstnaGcJq3Y'),
    genres: ['Western'],
    directors: ['Sergio Leone'],
    writers: [
      'Sergio Leone',
      'Jaime Comas Gil',
      'Fernando Di Leo',
      'Víctor Andrés Catena',
      'Duccio Tessari',
      'Tonino Valerii',
    ],
    cast: [
      'Clint Eastwood',
      'Marianne Koch',
      'Gian Maria Volonté',
      'Wolfgang Lukschy',
      'Sieghardt Rupp',
      'Joseph Egger',
    ],
  },
  // https://www.themoviedb.org/movie/76
  {
    title: 'Before Sunrise',
    releaseDate: '1995-01-27',
    runtimeMinutes: 101,
    synopsis:
      'An unexpected meeting on a train leads two travelers to spend an evening wandering through Vienna. As the night unfolds, they share stories and conversations about life and love, exploring new ideas while a quiet intimacy grows between them, knowing it may be their only night together.',
    posterUrl: tmdbPoster('kf1Jb1c2JAOqjuzA3H4oDM263uB'),
    genres: ['Drama', 'Romance'],
    directors: ['Richard Linklater'],
    writers: ['Richard Linklater', 'Kim Krizan'],
    cast: [
      'Ethan Hawke',
      'Julie Delpy',
      'Andrea Eckert',
      'Hanno Pöschl',
      'Karl Bruckschwaiger',
      'Tex Rubinowitz',
    ],
  },
  // https://www.themoviedb.org/movie/840
  {
    title: 'Close Encounters of the Third Kind',
    releaseDate: '1977-12-14',
    runtimeMinutes: 137,
    synopsis:
      'After an encounter with UFOs, an electricity linesman feels undeniably drawn to an isolated area in the wilderness where something spectacular is about to happen.',
    posterUrl: tmdbPoster('yaPx3cK9zGFX3SbcKwxWM1QIbUh'),
    genres: ['Science Fiction', 'Drama'],
    directors: ['Steven Spielberg'],
    writers: ['Steven Spielberg'],
    cast: [
      'Richard Dreyfuss',
      'François Truffaut',
      'Teri Garr',
      'Melinda Dillon',
      'Bob Balaban',
      'J. Patrick McNamara',
    ],
  },
  // https://www.themoviedb.org/movie/581
  {
    title: 'Dances with Wolves',
    releaseDate: '1990-11-09',
    runtimeMinutes: 181,
    synopsis:
      "Wounded Civil War soldier John Dunbar tries to commit suicide—and becomes a hero instead. As a reward, he's assigned to his dream post, a remote junction on the Western frontier, and soon makes unlikely friends with the local Sioux tribe.",
    posterUrl: tmdbPoster('hw0ZEHAaTqTxSXGVwUFX7uvanSA'),
    genres: ['Adventure', 'Drama', 'Western'],
    directors: ['Kevin Costner'],
    writers: ['Michael Blake'],
    cast: [
      'Kevin Costner',
      'Mary McDonnell',
      'Graham Greene',
      'Rodney A. Grant',
      "Floyd 'Red Crow' Westerman",
      'Tantoo Cardinal',
    ],
  },
  // https://www.themoviedb.org/movie/134
  {
    title: 'O Brother, Where Art Thou?',
    releaseDate: '2000-08-30',
    runtimeMinutes: 107,
    synopsis:
      'In the deep south during the 1930s, three escaped convicts search for hidden treasure while a relentless lawman pursues them.',
    posterUrl: tmdbPoster('2YztYilviFCYcEtDAnrOstUWGie'),
    genres: ['Adventure', 'Comedy', 'Crime'],
    directors: ['Joel Coen'],
    writers: ['Joel Coen', 'Ethan Coen'],
    cast: [
      'George Clooney',
      'John Turturro',
      'Tim Blake Nelson',
      'John Goodman',
      'Holly Hunter',
      'Chris Thomas King',
    ],
  },
  // https://www.themoviedb.org/movie/639
  {
    title: 'When Harry Met Sally...',
    releaseDate: '1989-07-12',
    runtimeMinutes: 96,
    synopsis:
      "Sex always gets in the way of friendships between men and women. At least, that's what Harry Burns believes. So when Harry meets Sally Albright and a deep friendship blossoms between them, Harry's determined not to let his attraction to Sally destroy it. But when a night of weakness ends in a morning of panic, can the pair avoid succumbing to Harry's fears by remaining friends and admitting they just might be the perfect match for each other?",
    posterUrl: tmdbPoster('rFOiFUhTMtDetqCGClC9PIgnC1P'),
    genres: ['Comedy', 'Romance', 'Drama'],
    directors: ['Rob Reiner'],
    writers: ['Nora Ephron'],
    cast: [
      'Billy Crystal',
      'Meg Ryan',
      'Carrie Fisher',
      'Bruno Kirby',
      'Steven Ford',
      'Lisa Jane Persky',
    ],
  },
  // https://www.themoviedb.org/movie/90
  {
    title: 'Beverly Hills Cop',
    releaseDate: '1984-12-05',
    runtimeMinutes: 105,
    synopsis:
      'Fast-talking, quick-thinking Detroit street cop Axel Foley has bent more than a few rules and regs in his time, but when his best friend is murdered, he heads to sunny Beverly Hills to work the case like only he can.',
    posterUrl: tmdbPoster('eBJEvKkhQ0tUt1dBAcTEYW6kCle'),
    genres: ['Comedy', 'Crime', 'Action'],
    directors: ['Martin Brest'],
    writers: ['Daniel Petrie Jr.'],
    cast: [
      'Eddie Murphy',
      'Judge Reinhold',
      'John Ashton',
      'Lisa Eilbacher',
      'Ronny Cox',
      'Steven Berkoff',
    ],
  },
  // https://www.themoviedb.org/movie/1452
  {
    title: 'Superman Returns',
    releaseDate: '2006-06-28',
    runtimeMinutes: 154,
    synopsis:
      'Superman returns to discover his 5-year absence has allowed Lex Luthor to walk free, and that those he was closest to felt abandoned and have moved on. Luthor plots his ultimate revenge that could see millions killed and change the face of the planet forever, as well as ridding himself of the Man of Steel.',
    posterUrl: tmdbPoster('385XwTQZDpRX2d3kxtnpiLrjBXw'),
    genres: ['Science Fiction', 'Action', 'Adventure'],
    directors: ['Bryan Singer'],
    writers: ['Michael Dougherty', 'Dan Harris'],
    cast: [
      'Brandon Routh',
      'Kate Bosworth',
      'Kevin Spacey',
      'James Marsden',
      'Parker Posey',
      'Frank Langella',
    ],
  },
  // https://www.themoviedb.org/movie/406
  {
    title: 'La Haine',
    releaseDate: '1995-05-31',
    runtimeMinutes: 98,
    synopsis:
      'After a chaotic night of rioting in a marginal suburb of Paris, three young friends, Vinz, Hubert and Saïd, wander around unoccupied waiting for news about the state of health of a mutual friend who has been seriously injured when confronting the police.',
    posterUrl: tmdbPoster('hY4exng4s29RzDbtQInjx9MA3PZ'),
    genres: ['Drama'],
    directors: ['Mathieu Kassovitz'],
    writers: ['Mathieu Kassovitz'],
    cast: [
      'Vincent Cassel',
      'Hubert Koundé',
      'Saïd Taghmaoui',
      'Abdel Ahmed Ghili',
      'Solo',
      'Joseph Momo',
    ],
  },
  // https://www.themoviedb.org/movie/525
  {
    title: 'The Blues Brothers',
    releaseDate: '1980-06-16',
    runtimeMinutes: 133,
    synopsis:
      'Jake Blues, just released from prison, puts his old band back together to save the Catholic home where he and his brother Elwood were raised.',
    posterUrl: tmdbPoster('rhYJKOt6UrQq7JQgLyQcSWW5R86'),
    genres: ['Music', 'Comedy', 'Crime'],
    directors: ['John Landis'],
    writers: ['John Landis', 'Dan Aykroyd'],
    cast: [
      'John Belushi',
      'Dan Aykroyd',
      'James Brown',
      'Cab Calloway',
      'Ray Charles',
      'Aretha Franklin',
    ],
  },
  // https://www.themoviedb.org/movie/924
  {
    title: 'Dawn of the Dead',
    releaseDate: '2004-03-19',
    runtimeMinutes: 101,
    synopsis:
      'A group of survivors take refuge in a shopping mall after the world is taken over by aggressive, flesh-eating zombies.',
    posterUrl: tmdbPoster('ttquyxStEEctzghtA2f4PUGprDr'),
    genres: ['Horror', 'Science Fiction'],
    directors: ['Zack Snyder'],
    writers: ['James Gunn', 'George A. Romero'],
    cast: [
      'Sarah Polley',
      'Ving Rhames',
      'Jake Weber',
      'Michael Kelly',
      'Mekhi Phifer',
      'Inna Korobkina',
    ],
  },
  // https://www.themoviedb.org/movie/764
  {
    title: 'The Evil Dead',
    releaseDate: '1981-10-15',
    runtimeMinutes: 85,
    synopsis:
      "In 1979, a group of college students find a Sumerian Book of the Dead in an old wilderness cabin they've rented for a weekend getaway.",
    posterUrl: tmdbPoster('54C1qdaiSijIU5NeNb4WsPJdNkG'),
    genres: ['Horror'],
    directors: ['Sam Raimi'],
    writers: ['Sam Raimi'],
    cast: [
      'Bruce Campbell',
      'Ellen Sandweiss',
      'Richard DeManincor',
      'Betsy Baker',
      'Theresa Tilly',
      'Philip A. Gillis',
    ],
  },
  // https://www.themoviedb.org/movie/213
  {
    title: 'North by Northwest',
    releaseDate: '1959-08-06',
    runtimeMinutes: 137,
    synopsis:
      'Advertising man Roger Thornhill is mistaken for a spy, triggering a deadly cross-country chase.',
    posterUrl: tmdbPoster('kNOFPQrel9YFCVzI0DF8FnCEpCw'),
    genres: ['Thriller', 'Adventure'],
    directors: ['Alfred Hitchcock'],
    writers: ['Ernest Lehman'],
    cast: [
      'Cary Grant',
      'Eva Marie Saint',
      'James Mason',
      'Jessie Royce Landis',
      'Leo G. Carroll',
      'Josephine Hutchinson',
    ],
  },
  // https://www.themoviedb.org/movie/1371
  {
    title: 'Rocky III',
    releaseDate: '1982-05-28',
    runtimeMinutes: 100,
    synopsis:
      "Following Rocky Balboa's intense battle with his most powerful adversary yet – the ferocious Clubber Lang – Rocky joins forces with former rival Apollo Creed in an effort to get back his fighting spirit.",
    posterUrl: tmdbPoster('uqw16i2kmwVqkJHzjzbDU4xZ0Pl'),
    genres: ['Drama'],
    directors: ['Sylvester Stallone'],
    writers: ['Sylvester Stallone'],
    cast: [
      'Sylvester Stallone',
      'Talia Shire',
      'Burt Young',
      'Carl Weathers',
      'Mr. T',
      'Burgess Meredith',
    ],
  },
  // https://www.themoviedb.org/movie/186
  {
    title: 'Lucky Number Slevin',
    releaseDate: '2006-02-24',
    runtimeMinutes: 110,
    synopsis:
      'Slevin is mistakenly put in the middle of a personal war between the city’s biggest criminal bosses. Under constant watch, Slevin must try not to get killed by an infamous assassin and come up with an idea of how to get out of his current dilemma.',
    posterUrl: tmdbPoster('x21s3p5wPww534nYj1cWakTcqz4'),
    genres: ['Drama', 'Thriller', 'Crime', 'Mystery'],
    directors: ['Paul McGuigan'],
    writers: ['Jason Smilovic'],
    cast: [
      'Josh Hartnett',
      'Morgan Freeman',
      'Ben Kingsley',
      'Lucy Liu',
      'Bruce Willis',
      'Stanley Tucci',
    ],
  },
  // https://www.themoviedb.org/movie/938
  {
    title: 'For a Few Dollars More',
    releaseDate: '1965-12-18',
    runtimeMinutes: 132,
    synopsis:
      'Two bounty hunters both pursue the brutal and sadistic bandit, El Indio, who has a large bounty on his head.',
    posterUrl: tmdbPoster('ooqASvA7qxlTVKL3KwOzBwy57Dh'),
    genres: ['Western'],
    directors: ['Sergio Leone'],
    writers: ['Sergio Leone', 'Luciano Vincenzoni'],
    cast: [
      'Clint Eastwood',
      'Lee Van Cleef',
      'Gian Maria Volonté',
      'Mara Krupp',
      'Luigi Pistilli',
      'Klaus Kinski',
    ],
  },
  // https://www.themoviedb.org/movie/164
  {
    title: "Breakfast at Tiffany's",
    releaseDate: '1961-10-06',
    runtimeMinutes: 115,
    synopsis:
      'Holly Golightly is an eccentric New York City playgirl determined to marry a Brazilian millionaire. But when young writer Paul Varjak moves into her apartment building, her past threatens to get in their way.',
    posterUrl: tmdbPoster('79xm4gXw4l7A5D0XukUOJRocFYQ'),
    genres: ['Comedy', 'Romance', 'Drama'],
    directors: ['Blake Edwards'],
    writers: ['George Axelrod'],
    cast: [
      'Audrey Hepburn',
      'George Peppard',
      'Patricia Neal',
      'Buddy Ebsen',
      'Martin Balsam',
      'José Luis de Vilallonga',
    ],
  },
  // https://www.themoviedb.org/movie/571
  {
    title: 'The Birds',
    releaseDate: '1963-03-28',
    runtimeMinutes: 119,
    synopsis:
      'Thousands of birds flock into a seaside town and terrorize the residents in a series of deadly attacks.',
    posterUrl: tmdbPoster('eClg8QPg8mwB6INIC4pyR5pAbDr'),
    genres: ['Horror', 'Thriller'],
    directors: ['Alfred Hitchcock'],
    writers: ['Evan Hunter'],
    cast: [
      'Tippi Hedren',
      'Rod Taylor',
      'Jessica Tandy',
      'Suzanne Pleshette',
      'Veronica Cartwright',
      'Ethel Griffies',
    ],
  },
  // https://www.themoviedb.org/movie/869
  {
    title: 'Planet of the Apes',
    releaseDate: '2001-07-26',
    runtimeMinutes: 120,
    synopsis:
      'After a spectacular crash-landing on an uncharted planet, brash astronaut Leo Davidson finds himself trapped in a savage world where talking apes dominate the human race. Desperate to find a way home, Leo must evade the invincible gorilla army led by Ruthless General Thade.',
    posterUrl: tmdbPoster('3ZWsuP5rExMSji7erxnb1P5SK6F'),
    genres: ['Thriller', 'Science Fiction', 'Action', 'Adventure'],
    directors: ['Tim Burton'],
    writers: ['Mark Rosenthal', 'William Broyles Jr.', 'Lawrence Konner'],
    cast: [
      'Mark Wahlberg',
      'Tim Roth',
      'Helena Bonham Carter',
      'Michael Clarke Duncan',
      'Paul Giamatti',
      'Estella Warren',
    ],
  },
  // https://www.themoviedb.org/movie/402
  {
    title: 'Basic Instinct',
    releaseDate: '1992-03-20',
    runtimeMinutes: 128,
    synopsis:
      'Catherine, a novelist with an insatiable sexual appetite, becomes a prime suspect when her boyfriend is brutally murdered -- a crime she had described in her latest story.',
    posterUrl: tmdbPoster('76Ts0yoHk8kVQj9MMnoMixhRWoh'),
    genres: ['Thriller', 'Mystery'],
    directors: ['Paul Verhoeven'],
    writers: ['Joe Eszterhas'],
    cast: [
      'Michael Douglas',
      'Sharon Stone',
      'George Dzundza',
      'Jeanne Tripplehorn',
      'Denis Arndt',
      'Leilani Sarelle',
    ],
  },
  // https://www.themoviedb.org/movie/834
  {
    title: 'Underworld: Evolution',
    releaseDate: '2006-01-12',
    runtimeMinutes: 106,
    synopsis:
      'As the war between the vampires and the Lycans rages on, Selene, a former member of the Death Dealers (an elite vampire special forces unit that hunts werewolves), and Michael, the werewolf hybrid, work together in an effort to unlock the secrets of their respective bloodlines.',
    posterUrl: tmdbPoster('oJaQG353uOzOqffQ5K2hg03k4Vp'),
    genres: ['Fantasy', 'Action', 'Thriller'],
    directors: ['Len Wiseman'],
    writers: ['Danny McBride'],
    cast: [
      'Kate Beckinsale',
      'Scott Speedman',
      'Tony Curran',
      'Shane Brolly',
      'Derek Jacobi',
      'Bill Nighy',
    ],
  },
  // https://www.themoviedb.org/movie/770
  {
    title: 'Gone with the Wind',
    releaseDate: '1939-12-15',
    runtimeMinutes: 238,
    synopsis:
      'The spoiled daughter of a Georgia plantation owner conducts a tumultuous romance with a cynical profiteer during the American Civil War and Reconstruction Era.',
    posterUrl: tmdbPoster('lNz2Ow0wGCAvzckW7EOjE03KcYv'),
    genres: ['Drama', 'War', 'Romance'],
    directors: ['Victor Fleming'],
    writers: ['Sidney Howard'],
    cast: [
      'Vivien Leigh',
      'Clark Gable',
      'Olivia de Havilland',
      'Leslie Howard',
      'Hattie McDaniel',
      'Thomas Mitchell',
    ],
  },
  // https://www.themoviedb.org/movie/805
  {
    title: "Rosemary's Baby",
    releaseDate: '1968-06-12',
    runtimeMinutes: 138,
    synopsis:
      'A young couple, Rosemary and Guy, moves into an infamous New York apartment building, known by frightening legends and mysterious events, with the purpose of starting a family.',
    posterUrl: tmdbPoster('uYgvlHceRFjAFbsNeMInYcLZLUb'),
    genres: ['Drama', 'Horror', 'Thriller'],
    directors: ['Roman Polanski'],
    writers: ['Roman Polanski'],
    cast: [
      'Mia Farrow',
      'John Cassavetes',
      'Ruth Gordon',
      'Sidney Blackmer',
      'Maurice Evans',
      'Ralph Bellamy',
    ],
  },
  // https://www.themoviedb.org/movie/116
  {
    title: 'Match Point',
    releaseDate: '2005-10-26',
    runtimeMinutes: 124,
    synopsis:
      "Chris, a former tennis pro, takes a job as an instructor and befriends his wealthy young student, Tom. After being introduced to his family, Chris is soon engaged to Tom's sister, Chloe. Despite the professional and financial advantages that this relationship affords him, Chris becomes obsessed with Tom's fiancee, American actress Nola.",
    posterUrl: tmdbPoster('vHjEVTD8ucuwKSFOZJeyAnTZYli'),
    genres: ['Drama', 'Romance', 'Thriller'],
    directors: ['Woody Allen'],
    writers: ['Woody Allen'],
    cast: [
      'Jonathan Rhys Meyers',
      'Scarlett Johansson',
      'Emily Mortimer',
      'Matthew Goode',
      'Brian Cox',
      'Penelope Wilton',
    ],
  },
  // https://www.themoviedb.org/movie/710
  {
    title: 'GoldenEye',
    releaseDate: '1995-11-16',
    runtimeMinutes: 130,
    synopsis:
      'When a powerful secret defense system is stolen, James Bond is assigned to stop a Russian crime syndicate from using it.',
    posterUrl: tmdbPoster('z0ljRnNxIO7CRBhLEO0DvLgAFPR'),
    genres: ['Adventure', 'Action', 'Thriller'],
    directors: ['Martin Campbell'],
    writers: ['Jeffrey Caine', 'Bruce Feirstein'],
    cast: [
      'Pierce Brosnan',
      'Sean Bean',
      'Izabella Scorupco',
      'Famke Janssen',
      'Joe Don Baker',
      'Judi Dench',
    ],
  },
  // https://www.themoviedb.org/movie/1369
  {
    title: 'Rambo: First Blood Part II',
    releaseDate: '1985-05-21',
    runtimeMinutes: 96,
    synopsis:
      "John Rambo is released from prison by the government for a top-secret covert mission to the last place on Earth he'd want to return - the jungles of Vietnam.",
    posterUrl: tmdbPoster('fVwRtWqEPdsCH21BVDGqgkAQcff'),
    genres: ['Action', 'Adventure', 'Thriller', 'War'],
    directors: ['George P. Cosmatos'],
    writers: ['Sylvester Stallone', 'James Cameron'],
    cast: [
      'Sylvester Stallone',
      'Richard Crenna',
      'Charles Napier',
      'Steven Berkoff',
      'Julia Nickson',
      'Martin Kove',
    ],
  },
  // https://www.themoviedb.org/movie/613
  {
    title: 'Downfall',
    releaseDate: '2004-09-16',
    runtimeMinutes: 155,
    synopsis:
      'In April of 1945, Germany stands at the brink of defeat with the Russian Army closing in from the east and the Allied Expeditionary Force attacking from the west. In Berlin, capital of the Third Reich, Adolf Hitler proclaims that Germany will still achieve victory and orders his generals and advisers to fight to the last man. When the end finally does come, and Hitler lies dead by his own hand, what is left of his military must find a way to end the killing that is the Battle of Berlin, and lay down their arms in surrender.',
    posterUrl: tmdbPoster('cP1ElGjBhbZAAqmueXjHDKlSwiP'),
    genres: ['Drama', 'History', 'War'],
    directors: ['Oliver Hirschbiegel'],
    writers: ['Bernd Eichinger'],
    cast: [
      'Bruno Ganz',
      'Alexandra Maria Lara',
      'Corinna Harfouch',
      'Ulrich Matthes',
      'Juliane Köhler',
      'Heino Ferch',
    ],
  },
  // https://www.themoviedb.org/movie/1587
  {
    title: "What's Eating Gilbert Grape",
    releaseDate: '1993-12-17',
    runtimeMinutes: 118,
    synopsis:
      "Gilbert Grape is a small-town young man with a lot of responsibility. Chief among his concerns are his mother, who is so overweight that she can't leave the house, and his mentally impaired younger brother, Arnie, who has a knack for finding trouble. Settled into a job at a grocery store and an ongoing affair with local woman Betty Carver, Gilbert finally has his life shaken up by the free-spirited Becky.",
    posterUrl: tmdbPoster('8FxWgsfDNosewo7H65oE4QkOb7g'),
    genres: ['Romance', 'Drama'],
    directors: ['Lasse Hallström'],
    writers: ['Peter Hedges'],
    cast: [
      'Johnny Depp',
      'Leonardo DiCaprio',
      'Juliette Lewis',
      'Mary Steenburgen',
      'Darlene Cates',
      'Laura Harrington',
    ],
  },
  // https://www.themoviedb.org/movie/1272
  {
    title: 'Sunshine',
    releaseDate: '2007-04-05',
    runtimeMinutes: 108,
    synopsis:
      'Fifty years into the future, the sun is dying, and Earth is threatened by arctic temperatures. A team of astronauts is sent to revive the Sun — but the mission fails. Seven years later, a new team is sent to finish the mission as mankind’s last hope.',
    posterUrl: tmdbPoster('oKGGeJ8qvm0UmClz43VJ31fzPP7'),
    genres: ['Science Fiction', 'Thriller'],
    directors: ['Danny Boyle'],
    writers: ['Alex Garland'],
    cast: [
      'Cillian Murphy',
      'Rose Byrne',
      'Chris Evans',
      'Michelle Yeoh',
      'Cliff Curtis',
      'Hiroyuki Sanada',
    ],
  },
  // https://www.themoviedb.org/movie/829
  {
    title: 'Chinatown',
    releaseDate: '1974-06-20',
    runtimeMinutes: 130,
    synopsis:
      "Private eye Jake Gittes lives off of the murky moral climate of sunbaked, pre-World War II Southern California. Hired by a beautiful socialite to investigate her husband's extra-marital affair, Gittes is swept into a maelstrom of double dealings and deadly deceits, uncovering a web of personal and political scandals that come crashing together.",
    posterUrl: tmdbPoster('kZRSP3FmOcq0xnBulqpUQngJUXY'),
    genres: ['Crime', 'Mystery', 'Thriller'],
    directors: ['Roman Polanski'],
    writers: ['Robert Towne'],
    cast: [
      'Jack Nicholson',
      'Faye Dunaway',
      'John Huston',
      'Perry Lopez',
      'Burt Young',
      'John Hillerman',
    ],
  },
  // https://www.themoviedb.org/movie/346
  {
    title: 'Seven Samurai',
    releaseDate: '1954-04-26',
    runtimeMinutes: 207,
    synopsis:
      "A samurai answers a village's request for protection after he falls on hard times. The town needs protection from bandits, so the samurai gathers six others to help him teach the people how to defend themselves, and the villagers provide the soldiers with food.",
    posterUrl: tmdbPoster('lOMGc8bnSwQhS4XyE1S99uH8NXf'),
    genres: ['Action', 'Drama'],
    directors: ['Akira Kurosawa'],
    writers: ['Akira Kurosawa', 'Shinobu Hashimoto', 'Hideo Oguni'],
    cast: [
      'Toshirō Mifune',
      'Takashi Shimura',
      'Yoshio Inaba',
      'Seiji Miyaguchi',
      'Minoru Chiaki',
      'Daisuke Katō',
    ],
  },
  // https://www.themoviedb.org/movie/703
  {
    title: 'Annie Hall',
    releaseDate: '1977-04-19',
    runtimeMinutes: 93,
    synopsis: 'New York comedian Alvy Singer falls in love with the ditsy Annie Hall.',
    posterUrl: tmdbPoster('dEtjPywhDbAXYjoFfhBC4U9unU7'),
    genres: ['Comedy', 'Drama', 'Romance'],
    directors: ['Woody Allen'],
    writers: ['Woody Allen', 'Marshall Brickman'],
    cast: [
      'Diane Keaton',
      'Woody Allen',
      'Tony Roberts',
      'Carol Kane',
      'Paul Simon',
      'Shelley Duvall',
    ],
  },
  // https://www.themoviedb.org/movie/929
  {
    title: 'Godzilla',
    releaseDate: '1998-05-20',
    runtimeMinutes: 139,
    synopsis:
      "French nuclear tests irradiate an iguana into a giant monster that viciously attacks freighter ships in the Pacific Ocean. A team of experts, including Niko Tatopoulos, conclude that the oversized reptile is the culprit. Before long, the giant lizard is loose in Manhattan as the US military races to destroy the monster before it reproduces and it's spawn takes over the world.",
    posterUrl: tmdbPoster('xJVl1I95StraYAwaNbBkVoWE2qA'),
    genres: ['Science Fiction', 'Action', 'Thriller'],
    directors: ['Roland Emmerich'],
    writers: ['Roland Emmerich', 'Dean Devlin'],
    cast: [
      'Matthew Broderick',
      'Jean Reno',
      'Maria Pitillo',
      'Hank Azaria',
      'Kevin Dunn',
      'Michael Lerner',
    ],
  },
  // https://www.themoviedb.org/movie/1493
  {
    title: 'Miss Congeniality',
    releaseDate: '2000-12-22',
    runtimeMinutes: 110,
    synopsis:
      "When the local FBI office receives a letter from a terrorist known only as 'The Citizen', it's quickly determined that he's planning his next act at the Miss America beauty pageant. Because tough-as-nails Gracie Hart is the only female Agent at the office, she's chosen to go undercover as the contestant from New Jersey.",
    posterUrl: tmdbPoster('pat3vKaRlB70he4ghwTMydR4TvP'),
    genres: ['Comedy', 'Crime', 'Action'],
    directors: ['Donald Petrie'],
    writers: ['Marc Lawrence', 'Katie Ford', 'Caryn Lucas'],
    cast: [
      'Sandra Bullock',
      'Benjamin Bratt',
      'Heather Burns',
      'Michael Caine',
      'Ernie Hudson',
      'Candice Bergen',
    ],
  },
  // https://www.themoviedb.org/movie/881
  {
    title: 'A Few Good Men',
    releaseDate: '1992-12-11',
    runtimeMinutes: 138,
    synopsis:
      'When cocky military lawyer Lt. Daniel Kaffee and his co-counsel, Lt. Cmdr. JoAnne Galloway, are assigned to a murder case, they uncover a hazing ritual that could implicate high-ranking officials such as shady Col. Nathan Jessep.',
    posterUrl: tmdbPoster('rLOk4z9zL1tTukIYV56P94aZXKk'),
    genres: ['Drama'],
    directors: ['Rob Reiner'],
    writers: ['Aaron Sorkin'],
    cast: [
      'Tom Cruise',
      'Jack Nicholson',
      'Demi Moore',
      'Kevin Bacon',
      'Kiefer Sutherland',
      'Kevin Pollak',
    ],
  },
  // https://www.themoviedb.org/movie/189
  {
    title: 'Sin City: A Dame to Kill For',
    releaseDate: '2014-08-20',
    runtimeMinutes: 102,
    synopsis:
      "Some of Sin City's most hard-boiled citizens cross paths with a few of its more reviled inhabitants.",
    posterUrl: tmdbPoster('50kALxDX4mmzIRljbNbPY0u4cie'),
    genres: ['Action', 'Crime', 'Thriller'],
    directors: ['Frank Miller', 'Robert Rodriguez'],
    writers: ['Frank Miller'],
    cast: [
      'Jessica Alba',
      'Bruce Willis',
      'Mickey Rourke',
      'Josh Brolin',
      'Joseph Gordon-Levitt',
      'Eva Green',
    ],
  },
  // https://www.themoviedb.org/movie/1213
  {
    title: 'The Talented Mr. Ripley',
    releaseDate: '1999-12-25',
    runtimeMinutes: 140,
    synopsis:
      "Tom Ripley is a calculating young man who believes it's better to be a fake somebody than a real nobody. Opportunity knocks in the form of a wealthy U.S. shipbuilder who hires Tom to travel to Italy to bring back his playboy son, Dickie. Ripley worms his way into the idyllic lives of Dickie and his girlfriend, plunging into a daring scheme of duplicity, lies and murder.",
    posterUrl: tmdbPoster('6ojHgqtIR41O2qLKa7LFUVj0cZa'),
    genres: ['Thriller', 'Crime', 'Drama'],
    directors: ['Anthony Minghella'],
    writers: ['Anthony Minghella'],
    cast: [
      'Matt Damon',
      'Gwyneth Paltrow',
      'Jude Law',
      'Cate Blanchett',
      'Philip Seymour Hoffman',
      'Jack Davenport',
    ],
  },
  // https://www.themoviedb.org/movie/582
  {
    title: 'The Lives of Others',
    releaseDate: '2006-03-23',
    runtimeMinutes: 137,
    synopsis:
      'In 1984 East Berlin, dedicated Stasi officer Gerd Wiesler begins spying on a famous playwright and his actress-lover Christa-Maria. Wiesler becomes unexpectedly sympathetic to the couple, and faces conflicting loyalties when his superior takes a liking to Christa-Maria.',
    posterUrl: tmdbPoster('cVUDMnskSc01rdbyH0tLATTJUdP'),
    genres: ['Drama', 'Thriller'],
    directors: ['Florian Henckel von Donnersmarck'],
    writers: ['Florian Henckel von Donnersmarck'],
    cast: [
      'Martina Gedeck',
      'Ulrich Mühe',
      'Sebastian Koch',
      'Ulrich Tukur',
      'Thomas Thieme',
      'Hans-Uwe Bauer',
    ],
  },
  // https://www.themoviedb.org/movie/663
  {
    title: 'Saw IV',
    releaseDate: '2007-10-25',
    runtimeMinutes: 93,
    synopsis:
      "Despite Jigsaw's death, and in order to save the lives of two of his colleagues, Lieutenant Rigg is forced to take part in a new game, which promises to test him to the limit.",
    posterUrl: tmdbPoster('ku1QdCXOU4ckz3zxLLlis8MIJVm'),
    genres: ['Horror', 'Thriller', 'Crime'],
    directors: ['Darren Lynn Bousman'],
    writers: ['Marcus Dunstan', 'Patrick Melton'],
    cast: [
      'Tobin Bell',
      'Costas Mandylor',
      'Scott Patterson',
      'Betsy Russell',
      'Lyriq Bent',
      'Athena Karkanis',
    ],
  },
  // https://www.themoviedb.org/movie/71
  {
    title: 'Billy Elliot',
    releaseDate: '2000-09-28',
    runtimeMinutes: 111,
    synopsis:
      "County Durham, England, 1984. The miners' strike has started and the police have started coming up from Bethnal Green, starting a class war with the lower classes suffering. Caught in the middle of the conflict is 11-year old Billy Elliot, who, after leaving his boxing club for the day, stumbles upon a ballet class and finds out that he's naturally talented. He practices with his teacher Mrs. Wilkinson for an upcoming audition in Newcastle-upon Tyne for the royal Ballet school in London.",
    posterUrl: tmdbPoster('mYtqgWCJiXpDeZwjVcC3OQGD8IR'),
    genres: ['Drama', 'Comedy', 'Music'],
    directors: ['Stephen Daldry'],
    writers: ['Lee Hall'],
    cast: [
      'Jamie Bell',
      'Gary Lewis',
      'Julie Walters',
      'Jean Heywood',
      'Jamie Draven',
      'Stuart Wells',
    ],
  },
  // https://www.themoviedb.org/movie/81
  {
    title: 'Warriors of the Wind',
    releaseDate: '1984-03-11',
    runtimeMinutes: 95,
    synopsis:
      'After a global war, the seaside kingdom known as the Valley of the Wind remains one of the last strongholds on Earth untouched by a poisonous jungle and the powerful insects that guard it. Led by the courageous Princess Nausicaä, the people of the Valley engage in an epic struggle to restore the bond between humanity and Earth.',
    posterUrl: tmdbPoster('tcrkfB8SRPQCgwI88hQScua6nxh'),
    genres: ['Adventure', 'Animation', 'Fantasy'],
    directors: ['Hayao Miyazaki'],
    writers: ['Hayao Miyazaki'],
    cast: [
      'Sumi Shimamoto',
      'Ichiro Nagai',
      'Gorō Naya',
      'Yoji Matsuda',
      'Yoshiko Sakakibara',
      'Iemasa Kayumi',
    ],
  },
  // https://www.themoviedb.org/movie/1164
  {
    title: 'Babel',
    releaseDate: '2006-10-26',
    runtimeMinutes: 143,
    synopsis:
      'Tragedy strikes a married couple vacationing in the Moroccan desert, which jumpstarts an interlocking story involving four different families.',
    posterUrl: tmdbPoster('bZByZbvU7u14WjoUJERqCRW9saN'),
    genres: ['Drama'],
    directors: ['Alejandro G. Iñárritu'],
    writers: ['Guillermo Arriaga'],
    cast: [
      'Brad Pitt',
      'Rinko Kikuchi',
      'Adriana Barraza',
      'Cate Blanchett',
      'Satoshi Nikaido',
      'Said Tarchani',
    ],
  },
  // https://www.themoviedb.org/movie/646
  {
    title: 'Dr. No',
    releaseDate: '1962-10-07',
    runtimeMinutes: 110,
    synopsis:
      'Agent 007 battles mysterious Dr. No, a scientific genius bent on destroying the U.S. space program. As the countdown to disaster begins, Bond must go to Jamaica, where he encounters beautiful Honey Ryder, to confront a megalomaniacal villain in his massive island headquarters.',
    posterUrl: tmdbPoster('f9HsemSsBEHN5eoMble1bj6fDxs'),
    genres: ['Adventure', 'Action', 'Thriller'],
    directors: ['Terence Young'],
    writers: ['Berkely Mather', 'Richard Maibaum', 'Johanna Harwood'],
    cast: [
      'Sean Connery',
      'Ursula Andress',
      'Joseph Wiseman',
      'Jack Lord',
      'Anthony Dawson',
      'Zena Marshall',
    ],
  },
  // https://www.themoviedb.org/movie/853
  {
    title: 'Enemy at the Gates',
    releaseDate: '2001-02-28',
    runtimeMinutes: 131,
    synopsis:
      'A Russian and a German sniper play a game of cat-and-mouse during the Battle of Stalingrad in WWII.',
    posterUrl: tmdbPoster('cHRAbVdsCWFaQrswRsBP7Bn255W'),
    genres: ['War', 'History'],
    directors: ['Jean-Jacques Annaud'],
    writers: ['Jean-Jacques Annaud', 'Alain Godard'],
    cast: ['Jude Law', 'Joseph Fiennes', 'Rachel Weisz', 'Ed Harris', 'Bob Hoskins', 'Ron Perlman'],
  },
  // https://www.themoviedb.org/movie/334
  {
    title: 'Magnolia',
    releaseDate: '1999-12-17',
    runtimeMinutes: 189,
    synopsis:
      'On one random day in the San Fernando Valley, a dying father, a young wife, a male caretaker, a famous lost son, a police officer in love, a boy genius, an ex-boy genius, a game show host and an estranged daughter will each become part of a dazzling multiplicity of plots, but one story.',
    posterUrl: tmdbPoster('tpfC325Jk6S38VTe5dDWjWtoyxr'),
    genres: ['Drama'],
    directors: ['Paul Thomas Anderson'],
    writers: ['Paul Thomas Anderson'],
    cast: [
      'Tom Cruise',
      'Philip Baker Hall',
      'Philip Seymour Hoffman',
      'Julianne Moore',
      'William H. Macy',
      'John C. Reilly',
    ],
  },
  // https://www.themoviedb.org/movie/1089
  {
    title: 'Point Break',
    releaseDate: '1991-07-12',
    runtimeMinutes: 122,
    synopsis:
      'In Los Angeles, a gang of bank robbers who call themselves The Ex-Presidents commit their crimes while wearing masks of Reagan, Carter, Nixon and Johnson. Believing that the members of the gang could be surfers, the F.B.I. sends young agent Johnny Utah to the beach undercover to mix with the surfers and gather information.',
    posterUrl: tmdbPoster('tlbERIghrQ4oofqlbF7H0K0EYnx'),
    genres: ['Action', 'Thriller', 'Crime'],
    directors: ['Kathryn Bigelow'],
    writers: ['W. Peter Iliff'],
    cast: [
      'Keanu Reeves',
      'Patrick Swayze',
      'Lori Petty',
      'Gary Busey',
      'John C. McGinley',
      'James Le Gros',
    ],
  },
  // https://www.themoviedb.org/movie/658
  {
    title: 'Goldfinger',
    releaseDate: '1964-09-20',
    runtimeMinutes: 110,
    synopsis:
      "Special agent 007 comes face to face with one of the most notorious villains of all time, and now he must outwit and outgun the powerful tycoon to prevent him from cashing in on a devious scheme to raid Fort Knox -- and obliterate the world's economy.",
    posterUrl: tmdbPoster('aKNFzaqQgPzsGXnsMc4kJH5hFIV'),
    genres: ['Adventure', 'Action', 'Thriller'],
    directors: ['Guy Hamilton'],
    writers: ['Richard Maibaum', 'Paul Dehn'],
    cast: [
      'Sean Connery',
      'Gert Fröbe',
      'Honor Blackman',
      'Harold Sakata',
      'Shirley Eaton',
      'Tania Mallet',
    ],
  },
  // https://www.themoviedb.org/movie/1592
  {
    title: 'Primal Fear',
    releaseDate: '1996-04-03',
    runtimeMinutes: 130,
    synopsis:
      "Defense attorney Martin Vail takes on jobs for money and prestige rather than any sense of the greater good. His latest case involves an altar boy, accused of brutally murdering the archbishop of Chicago. Vail finds himself up against his ex-pupil and ex-lover, but as the case progresses and the Church's dark secrets are revealed, Vail finds that what appeared a simple case takes on a darker, more dangerous aspect.",
    posterUrl: tmdbPoster('qJf2TzE8nRTFbFMPJNW6c8mI0KU'),
    genres: ['Crime', 'Drama', 'Thriller'],
    directors: ['Gregory Hoblit'],
    writers: ['Steve Shagan', 'Ann Biderman'],
    cast: [
      'Richard Gere',
      'Laura Linney',
      'Edward Norton',
      'John Mahoney',
      'Alfre Woodard',
      'Frances McDormand',
    ],
  },
  // https://www.themoviedb.org/movie/871
  {
    title: 'Planet of the Apes',
    releaseDate: '1968-02-07',
    runtimeMinutes: 112,
    synopsis:
      'Astronaut Taylor crash lands on a distant planet ruled by apes who use a primitive race of humans for experimentation and sport. Soon Taylor finds himself among the hunted, his life in the hands of a benevolent chimpanzee scientist.',
    posterUrl: tmdbPoster('2r9iKnlSYEk4daQadsXfcjHfIjQ'),
    genres: ['Science Fiction', 'Adventure', 'Drama', 'Action'],
    directors: ['Franklin J. Schaffner'],
    writers: ['Rod Serling', 'Michael Wilson'],
    cast: [
      'Charlton Heston',
      'Roddy McDowall',
      'Kim Hunter',
      'Maurice Evans',
      'James Whitmore',
      'James Daly',
    ],
  },
  // https://www.themoviedb.org/movie/1690
  {
    title: 'Hostel',
    releaseDate: '2006-01-06',
    runtimeMinutes: 94,
    synopsis:
      'Three backpackers head to a Slovakian city that promises to meet their hedonistic expectations, with no idea of the hell that awaits them.',
    posterUrl: tmdbPoster('dDrtuWUKhgUGp12kgUWuP0NpTdF'),
    genres: ['Horror'],
    directors: ['Eli Roth'],
    writers: ['Eli Roth'],
    cast: [
      'Jay Hernandez',
      'Derek Richardson',
      'Eythor Gudjonsson',
      'Barbara Nedeljakova',
      'Jana Kaderabkova',
      'Jennifer Lim',
    ],
  },
  // https://www.themoviedb.org/movie/252
  {
    title: 'Willy Wonka & the Chocolate Factory',
    releaseDate: '1971-06-29',
    runtimeMinutes: 100,
    synopsis:
      'When eccentric candy man Willy Wonka promises a lifetime supply of sweets and a tour of his chocolate factory to five lucky kids, penniless Charlie Bucket seeks the golden ticket that will make him a winner.',
    posterUrl: tmdbPoster('vmpsZkrs4Uvkp9r1atL8B3frA63'),
    genres: ['Family', 'Fantasy', 'Comedy'],
    directors: ['Mel Stuart'],
    writers: ['Roald Dahl', 'Leslie Bricusse', 'Anthony Newley'],
    cast: [
      'Gene Wilder',
      'Peter Ostrum',
      'Jack Albertson',
      'Roy Kinnear',
      'Julie Dawn Cole',
      'Leonard Stone',
    ],
  },
  // https://www.themoviedb.org/movie/1586
  {
    title: 'Secret Window',
    releaseDate: '2004-03-12',
    runtimeMinutes: 96,
    synopsis:
      'Mort Rainey, a writer just emerging from a painful divorce with his ex-wife, is stalked at his remote lake house by a psychotic stranger and would-be scribe who claims Rainey swiped his best story idea. But as Rainey endeavors to prove his innocence, he begins to question his own sanity.',
    posterUrl: tmdbPoster('hvzw4wufKZkDCTPVeG71Z7pGfZh'),
    genres: ['Mystery', 'Thriller'],
    directors: ['David Koepp'],
    writers: ['David Koepp'],
    cast: [
      'Johnny Depp',
      'John Turturro',
      'Maria Bello',
      'Timothy Hutton',
      'Charles S. Dutton',
      'Len Cariou',
    ],
  },
  // https://www.themoviedb.org/movie/819
  {
    title: 'Sleepers',
    releaseDate: '1996-10-18',
    runtimeMinutes: 147,
    synopsis:
      'Two gangsters seek revenge on the state jail worker who during their stay at a youth prison sexually abused them. A sensational court hearing takes place to charge him for the crimes.',
    posterUrl: tmdbPoster('yUpiEk2EojS9ZEXb3nIQonQCYYF'),
    genres: ['Crime', 'Drama', 'Thriller'],
    directors: ['Barry Levinson'],
    writers: ['Barry Levinson'],
    cast: [
      'Kevin Bacon',
      'Robert De Niro',
      'Dustin Hoffman',
      'Bruno Kirby',
      'Jason Patric',
      'Brad Pitt',
    ],
  },
  // https://www.themoviedb.org/movie/1598
  {
    title: 'Cape Fear',
    releaseDate: '1991-11-13',
    runtimeMinutes: 128,
    synopsis:
      "Sam Bowden is a small-town corporate attorney. Max Cady is a tattooed, cigar-smoking, Bible-quoting, psychotic rapist. What do they have in common? 14 years ago, Sam was a public defender assigned to Max Cady's rape trial, and he made a serious error: he hid a document from his illiterate client that could have gotten him acquitted. Now, the cagey Cady has been released, and he intends to teach Sam Bowden and his family a thing or two about loss.",
    posterUrl: tmdbPoster('meJZAAuVcjic2ipvbOPz5UlE4P9'),
    genres: ['Drama', 'Crime', 'Thriller'],
    directors: ['Martin Scorsese'],
    writers: ['Wesley Strick'],
    cast: [
      'Robert De Niro',
      'Nick Nolte',
      'Jessica Lange',
      'Juliette Lewis',
      'Joe Don Baker',
      'Robert Mitchum',
    ],
  },
  // https://www.themoviedb.org/movie/239
  {
    title: 'Some Like It Hot',
    releaseDate: '1959-03-19',
    runtimeMinutes: 123,
    synopsis:
      'In Prohibition-era Chicago, musicians Joe and Jerry witness a mob hit, and flee the state in an all-female band disguised as Josephine and Daphne, but further complications set in.',
    posterUrl: tmdbPoster('hVIKyTK13AvOGv7ICmJjK44DTzp'),
    genres: ['Comedy', 'Romance', 'Crime'],
    directors: ['Billy Wilder'],
    writers: ['Billy Wilder', 'I. A. L. Diamond'],
    cast: [
      'Tony Curtis',
      'Jack Lemmon',
      'Marilyn Monroe',
      'George Raft',
      "Pat O'Brien",
      'Joe E. Brown',
    ],
  },
  // https://www.themoviedb.org/movie/1640
  {
    title: 'Crash',
    releaseDate: '2005-05-06',
    runtimeMinutes: 112,
    synopsis:
      'In post-Sept. 11 Los Angeles, tensions erupt when the lives of a Brentwood housewife, her district attorney husband, a Persian shopkeeper, two cops, a pair of carjackers and a Korean couple converge during a 36-hour period.',
    posterUrl: tmdbPoster('86BdPC6RDX88NC880pLidKn2LCj'),
    genres: ['Drama'],
    directors: ['Paul Haggis'],
    writers: ['Paul Haggis', 'Bobby Moresco'],
    cast: [
      'Don Cheadle',
      'Sandra Bullock',
      'Brendan Fraser',
      'Matt Dillon',
      'Jennifer Esposito',
      'Michael Peña',
    ],
  },
  // https://www.themoviedb.org/movie/1541
  {
    title: 'Thelma & Louise',
    releaseDate: '1991-05-24',
    runtimeMinutes: 130,
    synopsis:
      'Taking a break from their dreary lives, close friends Thelma and Louise embark on a short weekend trip that ends in unforeseen incriminating circumstances. As fugitives, both women rediscover the strength of their bond and their newfound resilience.',
    posterUrl: tmdbPoster('vbRAGLzbC75QfiKD1lKjmnQGuph'),
    genres: ['Drama', 'Crime', 'Adventure'],
    directors: ['Ridley Scott'],
    writers: ['Callie Khouri'],
    cast: [
      'Susan Sarandon',
      'Geena Davis',
      'Harvey Keitel',
      'Michael Madsen',
      'Christopher McDonald',
      'Stephen Tobolowsky',
    ],
  },
  // https://www.themoviedb.org/movie/664
  {
    title: 'Twister',
    releaseDate: '1996-05-10',
    runtimeMinutes: 113,
    synopsis:
      "An unprecedented series of violent tornadoes is sweeping across Oklahoma. Tornado chasers, headed by Dr. Jo Harding, attempt to release a groundbreaking device that will allow them to track them and create a more advanced warning system. They are joined by Jo's soon to be ex-husband Bill, a former tornado chaser himself, and his girlfriend Melissa.",
    posterUrl: tmdbPoster('d4ie3f6QTvNw40V770Uzo87SDZn'),
    genres: ['Action', 'Adventure', 'Drama'],
    directors: ['Jan de Bont'],
    writers: ['Michael Crichton', 'Anne-Marie Martin'],
    cast: [
      'Helen Hunt',
      'Bill Paxton',
      'Jami Gertz',
      'Cary Elwes',
      'Lois Smith',
      'Philip Seymour Hoffman',
    ],
  },
  // https://www.themoviedb.org/movie/169
  {
    title: 'Predator 2',
    releaseDate: '1990-11-21',
    runtimeMinutes: 108,
    synopsis:
      'A police chief in the war-torn streets of Los Angeles discovers that an extraterrestrial creature is hunting down residents - and that he is the next target.',
    posterUrl: tmdbPoster('83X4VwY9sdSJykskmsplIVG0a4h'),
    genres: ['Science Fiction', 'Action', 'Thriller'],
    directors: ['Stephen Hopkins'],
    writers: ['John Thomas', 'Jim Thomas'],
    cast: [
      'Danny Glover',
      'Gary Busey',
      'Rubén Blades',
      'María Conchita Alonso',
      'Bill Paxton',
      'Robert Davi',
    ],
  },
  // https://www.themoviedb.org/movie/793
  {
    title: 'Blue Velvet',
    releaseDate: '1986-09-19',
    runtimeMinutes: 120,
    synopsis:
      'The discovery of a severed human ear found in a field leads a young man on an investigation related to a beautiful, mysterious nightclub singer and a group of psychopathic criminals who have kidnapped her child.',
    posterUrl: tmdbPoster('6v1zYh2FKOYVddY5pCQhd4PO9uX'),
    genres: ['Mystery', 'Thriller', 'Crime'],
    directors: ['David Lynch'],
    writers: ['David Lynch'],
    cast: [
      'Isabella Rossellini',
      'Kyle MacLachlan',
      'Dennis Hopper',
      'Laura Dern',
      'Hope Lange',
      'Dean Stockwell',
    ],
  },
  // https://www.themoviedb.org/movie/1246
  {
    title: 'Rocky Balboa',
    releaseDate: '2006-12-20',
    runtimeMinutes: 102,
    synopsis:
      "When he loses a highly publicized virtual boxing match to ex-champ Rocky Balboa, reigning heavyweight titleholder Mason Dixon retaliates by challenging the Italian Stallion to a 10-round exhibition bout. To the surprise of his son and friends, Rocky agrees to come out of retirement and face an opponent who's faster, stronger and thirty years his junior. Rocky takes on Dixon in what will become the greatest fight in boxing history!",
    posterUrl: tmdbPoster('byBlJvZwCqgtIwrZNv0pyE974jC'),
    genres: ['Drama'],
    directors: ['Sylvester Stallone'],
    writers: ['Sylvester Stallone'],
    cast: [
      'Sylvester Stallone',
      'Burt Young',
      'Antonio Tarver',
      'Geraldine Hughes',
      'Milo Ventimiglia',
      'Tony Burton',
    ],
  },
  // https://www.themoviedb.org/movie/241
  {
    title: 'Natural Born Killers',
    releaseDate: '1994-08-26',
    runtimeMinutes: 119,
    synopsis:
      'Two victims of traumatized childhoods become lovers and serial murderers irresponsibly glorified by the mass media.',
    posterUrl: tmdbPoster('fEKZwT91gxvkAoyPgpNXo8W5fu0'),
    genres: ['Crime', 'Thriller', 'Drama'],
    directors: ['Oliver Stone'],
    writers: ['Oliver Stone', 'Richard Rutowski', 'David Veloz'],
    cast: [
      'Woody Harrelson',
      'Juliette Lewis',
      'Robert Downey Jr.',
      'Tommy Lee Jones',
      'Tom Sizemore',
      'Rodney Dangerfield',
    ],
  },
  // https://www.themoviedb.org/movie/816
  {
    title: 'Austin Powers: International Man of Mystery',
    releaseDate: '1997-05-02',
    runtimeMinutes: 89,
    synopsis:
      "As a swinging fashion photographer by day and a groovy British superagent by night, Austin Powers is the '60s' most shagadelic spy. But can he stop megalomaniac Dr. Evil after the bald villain freezes himself and unthaws in the '90s? With the help of sexy sidekick Vanessa Kensington, he just might.",
    posterUrl: tmdbPoster('5uD4dxNX8JKFjWKYMHyOsqhi5pN'),
    genres: ['Comedy', 'Crime'],
    directors: ['Jay Roach'],
    writers: ['Mike Myers'],
    cast: [
      'Mike Myers',
      'Elizabeth Hurley',
      'Michael York',
      'Mimi Rogers',
      'Robert Wagner',
      'Seth Green',
    ],
  },
  // https://www.themoviedb.org/movie/80
  {
    title: 'Before Sunset',
    releaseDate: '2004-06-16',
    runtimeMinutes: 80,
    synopsis:
      'Nine years later, Jesse travels across Europe giving readings from a book he wrote about the night he spent in Vienna with Celine. After his reading in Paris, Celine finds him, and they spend part of the day together before Jesse has to again leave for a flight. They are both in relationships now, and Jesse has a son, but as their strong feelings for each other start to return, both confess a longing for more.',
    posterUrl: tmdbPoster('4sW5XH9ZfYXpvFzev00S1IGAEbg'),
    genres: ['Drama', 'Romance'],
    directors: ['Richard Linklater'],
    writers: ['Richard Linklater', 'Julie Delpy', 'Ethan Hawke'],
    cast: [
      'Ethan Hawke',
      'Julie Delpy',
      'Vernon Dobtcheff',
      'Louise Lemoine Torrès',
      'Rodolphe Pauly',
      'Mariane Plasteig',
    ],
  },
  // https://www.themoviedb.org/movie/942
  {
    title: 'Lethal Weapon 2',
    releaseDate: '1989-07-07',
    runtimeMinutes: 114,
    synopsis:
      'Riggs and Murtaugh are on the trail of South African diplomats using their immunity to engage in criminal activities.',
    posterUrl: tmdbPoster('v04YGBUiGMoqxWqjPJrQUfRImFp'),
    genres: ['Action', 'Thriller', 'Crime'],
    directors: ['Richard Donner'],
    writers: ['Jeffrey Boam'],
    cast: [
      'Mel Gibson',
      'Danny Glover',
      'Joe Pesci',
      'Joss Ackland',
      "Derrick O'Connor",
      'Patsy Kensit',
    ],
  },
  // https://www.themoviedb.org/movie/59
  {
    title: 'A History of Violence',
    releaseDate: '2005-09-23',
    runtimeMinutes: 96,
    synopsis:
      'An average family is thrust into the spotlight after the father commits a seemingly self-defense murder at his diner.',
    posterUrl: tmdbPoster('3qnO72NHmUgs9JZXAmu4aId9QDl'),
    genres: ['Drama', 'Thriller', 'Crime'],
    directors: ['David Cronenberg'],
    writers: ['Josh Olson'],
    cast: [
      'Viggo Mortensen',
      'Maria Bello',
      'Ed Harris',
      'William Hurt',
      'Ashton Holmes',
      'Peter MacNeill',
    ],
  },
  // https://www.themoviedb.org/movie/866
  {
    title: 'Finding Neverland',
    releaseDate: '2004-10-29',
    runtimeMinutes: 106,
    synopsis:
      'During a writing slump, playwright J.M. Barrie meets a widow and her four children, all young boys—who soon become an important part of Barrie’s life and the inspiration that lead him to create his masterpiece. Peter Pan.',
    posterUrl: tmdbPoster('5JyDPH4qdr0I6pF7Bjh1Qrf1Jhh'),
    genres: ['Drama', 'Fantasy'],
    directors: ['Marc Forster'],
    writers: ['David Magee'],
    cast: [
      'Johnny Depp',
      'Kate Winslet',
      'Julie Christie',
      'Dustin Hoffman',
      'Freddie Highmore',
      'Radha Mitchell',
    ],
  },
  // https://www.themoviedb.org/movie/68
  {
    title: 'Brazil',
    releaseDate: '1985-02-20',
    runtimeMinutes: 143,
    synopsis:
      'Low-level bureaucrat Sam Lowry escapes the monotony of his day-to-day life through a recurring daydream of himself as a virtuous hero saving a beautiful damsel. Investigating a case that led to the wrongful arrest and eventual death of an innocent man instead of wanted terrorist Harry Tuttle, he meets the woman from his daydream, and in trying to help her gets caught in a web of mistaken identities, mindless bureaucracy and lies.',
    posterUrl: tmdbPoster('aewan59WcFThBimkTVVoNf2o5Vb'),
    genres: ['Comedy', 'Science Fiction'],
    directors: ['Terry Gilliam'],
    writers: ['Terry Gilliam', 'Charles McKeown', 'Tom Stoppard'],
    cast: [
      'Jonathan Pryce',
      'Robert De Niro',
      'Katherine Helmond',
      'Ian Holm',
      'Bob Hoskins',
      'Michael Palin',
    ],
  },
  // https://www.themoviedb.org/movie/914
  {
    title: 'The Great Dictator',
    releaseDate: '1940-10-15',
    runtimeMinutes: 125,
    synopsis:
      "Dictator Adenoid Hynkel tries to expand his empire while a poor Jewish barber tries to avoid persecution from Hynkel's regime.",
    posterUrl: tmdbPoster('nhMXB8GTdswYMCL9nepDZymJCOr'),
    genres: ['Comedy', 'War'],
    directors: ['Charlie Chaplin'],
    writers: ['Charlie Chaplin'],
    cast: [
      'Charlie Chaplin',
      'Paulette Goddard',
      'Jack Oakie',
      'Reginald Gardiner',
      'Henry Daniell',
      'Billy Gilbert',
    ],
  },
  // https://www.themoviedb.org/movie/817
  {
    title: 'Austin Powers: The Spy Who Shagged Me',
    releaseDate: '1999-06-08',
    runtimeMinutes: 95,
    synopsis:
      "When diabolical genius Dr. Evil travels back in time to steal superspy Austin Powers's ‘mojo,’ Austin must return to the swingin' '60s himself - with the help of American agent, Felicity Shagwell - to stop the dastardly plan. Once there, Austin faces off against Dr. Evil's army of minions to try to save the world in his own unbelievably groovy way.",
    posterUrl: tmdbPoster('jiF7UShERJFn5RtgfBK2lIJrOTc'),
    genres: ['Comedy', 'Adventure', 'Crime'],
    directors: ['Jay Roach'],
    writers: ['Mike Myers', 'Michael McCullers'],
    cast: [
      'Mike Myers',
      'Heather Graham',
      'Verne Troyer',
      'Michael York',
      'Robert Wagner',
      'Seth Green',
    ],
  },
  // https://www.themoviedb.org/movie/1620
  {
    title: 'Hitman',
    releaseDate: '2007-11-21',
    runtimeMinutes: 89,
    synopsis:
      'A genetically engineered assassin with deadly aim, known only as "Agent 47" eliminates strategic targets for a top-secret organization. But when he\'s double-crossed, the hunter becomes the prey as 47 finds himself in a life-or-death game of international intrigue.',
    posterUrl: tmdbPoster('h69UJOOKlrHcvhl5H2LY74N61DQ'),
    genres: ['Action', 'Thriller', 'Drama'],
    directors: ['Xavier Gens'],
    writers: ['Skip Woods'],
    cast: [
      'Timothy Olyphant',
      'Dougray Scott',
      'Olga Kurylenko',
      'Robert Knepper',
      'Ulrich Thomsen',
      'Henry Ian Cusick',
    ],
  },
  // https://www.themoviedb.org/movie/1621
  {
    title: 'Trading Places',
    releaseDate: '1983-06-07',
    runtimeMinutes: 116,
    synopsis:
      'A snobbish investor and a wily street con-artist find their positions reversed as part of a bet by two callous millionaires.',
    posterUrl: tmdbPoster('8mBuLCOcpWnmYtZc4aqtvDXslv6'),
    genres: ['Comedy'],
    directors: ['John Landis'],
    writers: ['Herschel Weingrod', 'Timothy Harris'],
    cast: [
      'Dan Aykroyd',
      'Eddie Murphy',
      'Ralph Bellamy',
      'Don Ameche',
      'Denholm Elliott',
      'Jamie Lee Curtis',
    ],
  },
  // https://www.themoviedb.org/movie/462
  {
    title: 'Erin Brockovich',
    releaseDate: '2000-03-17',
    runtimeMinutes: 131,
    synopsis:
      'A twice-divorced mother of three who sees an injustice, takes on the bad guy and wins -- with a little help from her push-up bra. Erin goes to work for an attorney and comes across medical records describing illnesses clustered in one nearby town. She starts investigating and soon exposes a monumental cover-up.',
    posterUrl: tmdbPoster('eMs20iUQyZVs05Ck7Q0LNnRsstr'),
    genres: ['Drama'],
    directors: ['Steven Soderbergh'],
    writers: ['Susannah Grant'],
    cast: [
      'Julia Roberts',
      'Albert Finney',
      'Aaron Eckhart',
      'Marg Helgenberger',
      'Cherry Jones',
      'Veanne Cox',
    ],
  },
  // https://www.themoviedb.org/movie/1669
  {
    title: 'The Hunt for Red October',
    releaseDate: '1990-03-02',
    runtimeMinutes: 135,
    synopsis:
      'A new technologically-superior Soviet nuclear sub, the Red October, is heading for the U.S. coast under the command of Captain Marko Ramius. The American government thinks Ramius is planning to attack. Lone CIA analyst Jack Ryan has a different idea: he thinks Ramius is planning to defect, but he has only a few hours to find him and prove it - because the entire Russian naval and air commands are trying to find Ramius, too. The hunt is on!',
    posterUrl: tmdbPoster('yVl7zidse4KiWtGMqHFtZCx4X3N'),
    genres: ['Action', 'Thriller'],
    directors: ['John McTiernan'],
    writers: ['Donald E. Stewart', 'Larry Ferguson'],
    cast: [
      'Sean Connery',
      'Alec Baldwin',
      'Scott Glenn',
      'Sam Neill',
      'James Earl Jones',
      'Joss Ackland',
    ],
  },
  // https://www.themoviedb.org/movie/314
  {
    title: 'Catwoman',
    releaseDate: '2004-07-22',
    runtimeMinutes: 104,
    synopsis:
      'Liquidated after discovering a corporate conspiracy, mild-mannered graphic artist Patience Phillips washes up on an island, where she\'s resurrected and endowed with the prowess of a cat — and she\'s eager to use her new skills... as a vigilante. Before you can say "cat and mouse", handsome gumshoe Tom Lone is on her tail, fascinated by both of her personas.',
    posterUrl: tmdbPoster('pvnPgukFyEKgCzyOxyLiwyZ8T1C'),
    genres: ['Action', 'Fantasy', 'Crime'],
    directors: ['Pitof'],
    writers: ['John Rogers', 'Rita Hsiao'],
    cast: [
      'Halle Berry',
      'Benjamin Bratt',
      'Sharon Stone',
      'Lambert Wilson',
      'Frances Conroy',
      'Alex Borstein',
    ],
  },
  // https://www.themoviedb.org/movie/1443
  {
    title: 'The Virgin Suicides',
    releaseDate: '2000-04-21',
    runtimeMinutes: 97,
    synopsis:
      'A group of male friends become obsessed with five mysterious sisters who are sheltered by their strict, religious parents.',
    posterUrl: tmdbPoster('1NCQtXPQnaHRjOZVmktA9BSM35F'),
    genres: ['Drama', 'Romance'],
    directors: ['Sofia Coppola'],
    writers: ['Sofia Coppola'],
    cast: [
      'Kirsten Dunst',
      'Josh Hartnett',
      'James Woods',
      'Kathleen Turner',
      'Michael Paré',
      'A.J. Cook',
    ],
  },
  // https://www.themoviedb.org/movie/796
  {
    title: 'Cruel Intentions',
    releaseDate: '1999-03-05',
    runtimeMinutes: 97,
    synopsis:
      "Slaking a thirst for dangerous games, Kathryn challenges her stepbrother, Sebastian, to deflower their headmaster's daughter before the summer ends. If he succeeds, the prize is the chance to bed Kathryn. But if he loses, Kathryn will claim his most prized possession.",
    posterUrl: tmdbPoster('76cCsRtQ5MJBAqoigojXsLXLJwh'),
    genres: ['Drama', 'Romance'],
    directors: ['Roger Kumble'],
    writers: ['Roger Kumble'],
    cast: [
      'Sarah Michelle Gellar',
      'Ryan Phillippe',
      'Reese Witherspoon',
      'Selma Blair',
      'Louise Fletcher',
      'Joshua Jackson',
    ],
  },
  // https://www.themoviedb.org/movie/146
  {
    title: 'Crouching Tiger, Hidden Dragon',
    releaseDate: '2000-07-06',
    runtimeMinutes: 120,
    synopsis:
      "Two warriors in pursuit of a stolen sword and a notorious fugitive are led to an impetuous, physically-skilled, teenage nobleman's daughter, who is at a crossroads in her life.",
    posterUrl: tmdbPoster('iNDVBFNz4XyYzM9Lwip6atSTFqf'),
    genres: ['Adventure', 'Drama', 'Action', 'Romance'],
    directors: ['Ang Lee'],
    writers: ['Tsai Kuo-Jung', 'James Schamus', 'Wang Huiling'],
    cast: [
      'Chow Yun-Fat',
      'Michelle Yeoh',
      'Zhang Ziyi',
      'Chang Chen',
      'Lung Sihung',
      'Cheng Pei-Pei',
    ],
  },
  // https://www.themoviedb.org/movie/766
  {
    title: 'Army of Darkness',
    releaseDate: '1992-10-31',
    runtimeMinutes: 81,
    synopsis:
      "Ash, a handsome, shotgun-toting, chainsaw-armed department store clerk, is time warped backwards into England's Dark Ages, where he romances a beauty and faces legions of the undead.",
    posterUrl: tmdbPoster('xsgTuAtR2zSH8Umg3jWZcZjlDpe'),
    genres: ['Fantasy', 'Horror', 'Comedy'],
    directors: ['Sam Raimi'],
    writers: ['Sam Raimi', 'Ivan Raimi'],
    cast: [
      'Bruce Campbell',
      'Embeth Davidtz',
      'Marcus Gilbert',
      'Ian Abercrombie',
      'Richard Grove',
      'Michael Earl Reid',
    ],
  },
  // https://www.themoviedb.org/movie/1103
  {
    title: 'Escape from New York',
    releaseDate: '1981-05-23',
    runtimeMinutes: 99,
    synopsis:
      'In a world ravaged by crime, the entire island of Manhattan has been converted into a walled prison where brutal prisoners roam free. After the US president crash-lands inside, war hero Snake Plissken has 24 hours to bring him back.',
    posterUrl: tmdbPoster('vH9llaphjAssRGi0k7e75tD40Ce'),
    genres: ['Action', 'Thriller', 'Science Fiction'],
    directors: ['John Carpenter'],
    writers: ['John Carpenter', 'Nick Castle'],
    cast: [
      'Kurt Russell',
      'Lee Van Cleef',
      'Ernest Borgnine',
      'Donald Pleasence',
      'Isaac Hayes',
      'Season Hubley',
    ],
  },
  // https://www.themoviedb.org/movie/765
  {
    title: 'Evil Dead II',
    releaseDate: '1987-03-13',
    runtimeMinutes: 84,
    synopsis:
      'Ash Williams and his girlfriend Linda find a log cabin in the woods with a voice recording from an archeologist who had recorded himself reciting ancient chants from "The Book of the Dead." As they play the recording an evil power is unleashed taking over Linda\'s body.',
    posterUrl: tmdbPoster('4zqCKJVHUolGs6C5AZwAZqLWixW'),
    genres: ['Horror', 'Comedy', 'Fantasy'],
    directors: ['Sam Raimi'],
    writers: ['Sam Raimi', 'Scott Spiegel'],
    cast: [
      'Bruce Campbell',
      'Sarah Berry',
      'Dan Hicks',
      'Kassie DePaiva',
      'Ted Raimi',
      'Denise Bixler',
    ],
  },
  // https://www.themoviedb.org/movie/872
  {
    title: "Singin' in the Rain",
    releaseDate: '1952-04-10',
    runtimeMinutes: 103,
    synopsis:
      'In 1927 Hollywood, a silent film star falls for a chorus girl just as he and his paranoid screen partner struggle to make the difficult transition to talking pictures.',
    posterUrl: tmdbPoster('w03EiJVHP8Un77boQeE7hg9DVdU'),
    genres: ['Comedy', 'Romance'],
    directors: ['Stanley Donen', 'Gene Kelly'],
    writers: ['Adolph Green', 'Betty Comden'],
    cast: [
      'Gene Kelly',
      "Donald O'Connor",
      'Debbie Reynolds',
      'Jean Hagen',
      'Millard Mitchell',
      'Cyd Charisse',
    ],
  },
  // https://www.themoviedb.org/movie/392
  {
    title: 'Chocolat',
    releaseDate: '2000-12-22',
    runtimeMinutes: 121,
    synopsis:
      'In the winter of 1959, a single mother and her young daughter arrive in a rural French town, where they open an unusual chocolate shop that disrupts the moral fiber of the strictly Catholic townsfolk and mayor.',
    posterUrl: tmdbPoster('lnwPvyj8UR7MetG2pQ92453IIoR'),
    genres: ['Comedy', 'Drama', 'Romance'],
    directors: ['Lasse Hallström'],
    writers: ['Robert Nelson Jacobs'],
    cast: [
      'Juliette Binoche',
      'Judi Dench',
      'Alfred Molina',
      'Lena Olin',
      'Johnny Depp',
      "Hugh O'Conor",
    ],
  },
  // https://www.themoviedb.org/movie/1370
  {
    title: 'Rambo III',
    releaseDate: '1988-05-24',
    runtimeMinutes: 102,
    synopsis:
      "Combat has taken its toll on Rambo, but he's finally begun to find inner peace in a monastery. When Rambo's friend and mentor Col. Trautman asks for his help on a top secret mission to Afghanistan, Rambo declines but must reconsider when Trautman is captured.",
    posterUrl: tmdbPoster('uycbt9iVlAnKkQIisqUWuO8hVcm'),
    genres: ['Action', 'Adventure', 'Thriller', 'War'],
    directors: ['Peter MacDonald'],
    writers: ['Sheldon Lettich', 'Sylvester Stallone'],
    cast: [
      'Sylvester Stallone',
      'Richard Crenna',
      'Marc de Jonge',
      'Kurtwood Smith',
      'Spiros Focás',
      'Sasson Gabai',
    ],
  },
  // https://www.themoviedb.org/movie/1375
  {
    title: 'Rocky V',
    releaseDate: '1990-11-16',
    runtimeMinutes: 104,
    synopsis:
      'A lifetime of taking shots has ended Rocky’s career, and a crooked accountant has left him broke. Inspired by the memory of his trainer, however, Rocky finds glory in training and takes on an up-and-coming boxer.',
    posterUrl: tmdbPoster('tevHaVxtrMTaUi8f3YjLWYSSY8A'),
    genres: ['Drama'],
    directors: ['John G. Avildsen'],
    writers: ['Sylvester Stallone'],
    cast: [
      'Sylvester Stallone',
      'Talia Shire',
      'Burt Young',
      'Richard Gant',
      'Tommy Morrison',
      'Sage Stallone',
    ],
  },
  // https://www.themoviedb.org/movie/714
  {
    title: 'Tomorrow Never Dies',
    releaseDate: '1997-12-11',
    runtimeMinutes: 119,
    synopsis:
      "A deranged media mogul is staging international incidents to pit the world's superpowers against each other. Now James Bond must take on this evil mastermind in an adrenaline-charged battle to end his reign of terror and prevent global pandemonium.",
    posterUrl: tmdbPoster('gZm002w7q9yLOkltxT76TWGfdZX'),
    genres: ['Adventure', 'Action', 'Thriller'],
    directors: ['Roger Spottiswoode'],
    writers: ['Bruce Feirstein'],
    cast: [
      'Pierce Brosnan',
      'Jonathan Pryce',
      'Michelle Yeoh',
      'Teri Hatcher',
      'Ricky Jay',
      'Götz Otto',
    ],
  },
  // https://www.themoviedb.org/movie/947
  {
    title: 'Lawrence of Arabia',
    releaseDate: '1962-12-11',
    runtimeMinutes: 228,
    synopsis:
      "During World War I, English officer Thomas Edward 'T.E.' Lawrence sets out to unite and lead the diverse, often warring, Arab tribes to fight the Turks.",
    posterUrl: tmdbPoster('AiAm0EtDvyGqNpVoieRw4u65vD1'),
    genres: ['Adventure', 'History', 'War'],
    directors: ['David Lean'],
    writers: ['Michael Wilson', 'Robert Bolt'],
    cast: [
      "Peter O'Toole",
      'Alec Guinness',
      'Omar Sharif',
      'Anthony Quinn',
      'Jack Hawkins',
      'José Ferrer',
    ],
  },
  // https://www.themoviedb.org/movie/818
  {
    title: 'Austin Powers in Goldmember',
    releaseDate: '2002-07-26',
    runtimeMinutes: 94,
    synopsis:
      "The world's most shagadelic spy continues his fight against Dr. Evil. This time, the diabolical doctor and his clone, Mini-Me, team up with a new foe—'70s kingpin Goldmember. While pursuing the team of villains to stop them from world domination, Austin gets help from his dad and an old girlfriend.",
    posterUrl: tmdbPoster('n8V61f1v7idya4WJzGEJNoIp9iL'),
    genres: ['Comedy', 'Crime'],
    directors: ['Jay Roach'],
    writers: ['Mike Myers', 'Michael McCullers'],
    cast: [
      'Mike Myers',
      'Beyoncé',
      'Seth Green',
      'Michael York',
      'Robert Wagner',
      'Mindy Sterling',
    ],
  },
  // https://www.themoviedb.org/movie/841
  {
    title: 'Dune',
    releaseDate: '1984-12-14',
    runtimeMinutes: 136,
    synopsis:
      'In the year 10,191, the most precious substance in the universe is the spice Melange. The spice extends life. The spice expands consciousness. The spice is vital to space travel.  The spice exists on only one planet in the entire universe, the vast desert planet Arrakis, also known as Dune.  Its native inhabitants, the Fremen, have long held a prophecy that a man would come, a messiah who would lead them to true freedom.',
    posterUrl: tmdbPoster('4kJmUCE7mkVJjXa7A0g2rY4IGTm'),
    genres: ['Action', 'Science Fiction', 'Adventure'],
    directors: ['David Lynch'],
    writers: ['David Lynch'],
    cast: [
      'Kyle MacLachlan',
      'Francesca Annis',
      'Patrick Stewart',
      'Linda Hunt',
      'José Ferrer',
      'Freddie Jones',
    ],
  },
  // https://www.themoviedb.org/movie/957
  {
    title: 'Spaceballs',
    releaseDate: '1987-06-24',
    runtimeMinutes: 96,
    synopsis:
      'When the nefarious Dark Helmet hatches a plan to snatch Princess Vespa and steal her planet\'s air, space-bum-for-hire Lone Starr and his clueless sidekick fly to the rescue. Along the way, they meet Yogurt, who puts Lone Starr wise to the power of "The Schwartz." Can he master it in time to save the day?',
    posterUrl: tmdbPoster('aHNeKtkNnyQcietzi2cgiYL8sC9'),
    genres: ['Comedy', 'Science Fiction'],
    directors: ['Mel Brooks'],
    writers: ['Mel Brooks', 'Ronny Graham', 'Thomas Meehan'],
    cast: [
      'Bill Pullman',
      'Rick Moranis',
      'Mel Brooks',
      'John Candy',
      'Daphne Zuniga',
      'Dick Van Patten',
    ],
  },
  // https://www.themoviedb.org/movie/1542
  {
    title: 'Office Space',
    releaseDate: '1999-02-19',
    runtimeMinutes: 90,
    synopsis:
      'A depressed white-collar worker tries hypnotherapy, only to find himself in a perpetual state of devil-may-care bliss that prompts him to start living by his own rules, and hatch a hapless attempt to embezzle money from his soul-killing employers.',
    posterUrl: tmdbPoster('iEmTwOkUaLziMQCUZii5wPQBIAO'),
    genres: ['Comedy'],
    directors: ['Mike Judge'],
    writers: ['Mike Judge'],
    cast: [
      'Ron Livingston',
      'Jennifer Aniston',
      'David Herman',
      'Ajay Naidu',
      'Diedrich Bader',
      'Stephen Root',
    ],
  },
  // https://www.themoviedb.org/movie/470
  {
    title: '21 Grams',
    releaseDate: '2003-11-18',
    runtimeMinutes: 124,
    synopsis:
      'Paul Rivers, an ailing mathematician lovelessly married to an English émigré; Christina Peck, an upper-middle-class suburban housewife and mother of two girls; and Jack Jordan, a born-again ex-con, are brought together by a terrible accident that changes their lives.',
    posterUrl: tmdbPoster('wZ0l6or5juuVWqDkLEgaghs4f9l'),
    genres: ['Drama', 'Crime', 'Thriller'],
    directors: ['Alejandro G. Iñárritu'],
    writers: ['Guillermo Arriaga'],
    cast: [
      'Sean Penn',
      'Naomi Watts',
      'Benicio del Toro',
      'Charlotte Gainsbourg',
      'Danny Huston',
      'Melissa Leo',
    ],
  },
  // https://www.themoviedb.org/movie/968
  {
    title: 'Dog Day Afternoon',
    releaseDate: '1975-09-21',
    runtimeMinutes: 125,
    synopsis:
      "Based on the true story of would-be Brooklyn bank robbers John Wojtowicz and Salvatore Naturile. Sonny and Sal attempt a bank heist which quickly turns sour and escalates into a hostage situation and stand-off with the police. As Sonny's motives for the robbery are slowly revealed and things become more complicated, the heist turns into a media circus.",
    posterUrl: tmdbPoster('mavrhr0ig2aCRR8d48yaxtD5aMQ'),
    genres: ['Crime', 'Drama', 'Thriller'],
    directors: ['Sidney Lumet'],
    writers: ['Frank Pierson'],
    cast: [
      'Al Pacino',
      'John Cazale',
      'Charles Durning',
      'Chris Sarandon',
      'James Broderick',
      'Penelope Allen',
    ],
  },
  // https://www.themoviedb.org/movie/657
  {
    title: 'From Russia with Love',
    releaseDate: '1963-10-10',
    runtimeMinutes: 115,
    synopsis:
      'Agent 007 is back in the second installment of the James Bond series, this time battling a secret crime organization known as SPECTRE. Russians Rosa Klebb and Kronsteen are out to snatch a decoding device known as the Lektor, using the ravishing Tatiana to lure Bond into helping them. Bond willingly travels to meet Tatiana in Istanbul, where he must rely on his wits to escape with his life in a series of deadly encounters with the enemy.',
    posterUrl: tmdbPoster('zx4V17FP8oclNvOpTgs2iCCtiYk'),
    genres: ['Action', 'Thriller', 'Adventure'],
    directors: ['Terence Young'],
    writers: ['Richard Maibaum'],
    cast: [
      'Sean Connery',
      'Daniela Bianchi',
      'Pedro Armendáriz',
      'Robert Shaw',
      'Lotte Lenya',
      'Bernard Lee',
    ],
  },
  // https://www.themoviedb.org/movie/622
  {
    title: 'The Ninth Gate',
    releaseDate: '1999-08-25',
    runtimeMinutes: 133,
    synopsis:
      'A rare book dealer finds himself at the heart of a string of paranormal events when he is hired to find the last two copies of a text, The Nine Gates of the Kingdom of Shadows, capable of summoning the Devil.',
    posterUrl: tmdbPoster('rxw9l9YNL14ODdmAavUwHLBjiDo'),
    genres: ['Mystery', 'Thriller', 'Horror'],
    directors: ['Roman Polanski'],
    writers: ['Roman Polanski', 'John Brownjohn', 'Enrique Urbizu'],
    cast: [
      'Johnny Depp',
      'Frank Langella',
      'Lena Olin',
      'Emmanuelle Seigner',
      'Barbara Jefford',
      'Jack Taylor',
    ],
  },
  // https://www.themoviedb.org/movie/490
  {
    title: 'The Seventh Seal',
    releaseDate: '1957-02-16',
    runtimeMinutes: 96,
    synopsis:
      'When disillusioned Swedish knight Antonius Block returns home from the Crusades to find his country in the grips of the Black Death, he challenges Death to a chess match for his life. Tormented by the belief that God does not exist, Block sets off on a journey, meeting up with traveling players Jof and his wife, Mia, and becoming determined to evade Death long enough to commit one redemptive act while he still lives.',
    posterUrl: tmdbPoster('wcZ21zrOsy0b52AfAF50XpTiv75'),
    genres: ['Fantasy', 'Drama'],
    directors: ['Ingmar Bergman'],
    writers: ['Ingmar Bergman'],
    cast: [
      'Gunnar Björnstrand',
      'Bengt Ekerot',
      'Nils Poppe',
      'Max von Sydow',
      'Bibi Andersson',
      'Inga Gill',
    ],
  },
  // https://www.themoviedb.org/movie/609
  {
    title: 'Poltergeist',
    releaseDate: '1982-06-04',
    runtimeMinutes: 114,
    synopsis:
      "The Freelings' suburban home becomes the center of paranormal activity that opens a portal to the 'other side'. With help, they must cross over to get their daughter back.",
    posterUrl: tmdbPoster('4eMN3GANH5GG4kXdHkrTZEUuQ9M'),
    genres: ['Horror'],
    directors: ['Steven Spielberg', 'Tobe Hooper'],
    writers: ['Steven Spielberg', 'Michael Grais', 'Mark Victor'],
    cast: [
      'JoBeth Williams',
      'Craig T. Nelson',
      'Beatrice Straight',
      'Dominique Dunne',
      "Heather O'Rourke",
      'Oliver Robins',
    ],
  },
  // https://www.themoviedb.org/movie/440
  {
    title: 'Aliens vs Predator: Requiem',
    releaseDate: '2007-12-25',
    runtimeMinutes: 94,
    synopsis:
      'After a horrifying PredAlien crash-lands near a small Colorado town, killing everyone it encounters and producing countless Alien offspring, a lone Predator arrives to "clean up" the infestation.',
    posterUrl: tmdbPoster('5iTwPDNtvK6ZZF607BHBbU3HO0B'),
    genres: ['Action', 'Science Fiction', 'Thriller', 'Horror'],
    directors: ['Greg Strause', 'Colin Strause'],
    writers: ['Shane Salerno'],
    cast: [
      'David Paetkau',
      'Sam Trammell',
      'Steven Pasquale',
      'Reiko Aylesworth',
      'John Ortiz',
      'Johnny Lewis',
    ],
  },
  // https://www.themoviedb.org/movie/979
  {
    title: 'Irreversible',
    releaseDate: '2002-05-22',
    runtimeMinutes: 93,
    synopsis:
      'A woman’s lover and her ex-boyfriend take justice into their own hands after she becomes the victim of a rapist. Because some acts can’t be undone. Because man is an animal. Because the desire for vengeance is a natural impulse. Because most crimes remain unpunished.',
    posterUrl: tmdbPoster('rxeDxo8FvZpLu6iplNpxdtAVnfu'),
    genres: ['Drama', 'Thriller', 'Crime'],
    directors: ['Gaspar Noé'],
    writers: ['Gaspar Noé'],
    cast: [
      'Monica Bellucci',
      'Vincent Cassel',
      'Albert Dupontel',
      'Jo Prestia',
      'Philippe Nahon',
      'Stéphane Drouot',
    ],
  },
  // https://www.themoviedb.org/movie/192
  {
    title: 'The Name of the Rose',
    releaseDate: '1986-09-24',
    runtimeMinutes: 130,
    synopsis:
      "14th-century Franciscan monk William of Baskerville and his young novice arrive at a conference to find that several monks have been murdered under mysterious circumstances. To solve the crimes, William must rise up against the Church's authority and fight the shadowy conspiracy of monastery monks using only his intelligence; which is considerable.",
    posterUrl: tmdbPoster('d6dlbTBb3N7nXDz7tQslDJs2jgv'),
    genres: ['Drama', 'Thriller', 'Mystery'],
    directors: ['Jean-Jacques Annaud'],
    writers: ['Howard Franklin', 'Alain Godard', 'Gérard Brach', 'Andrew Birkin'],
    cast: [
      'Sean Connery',
      'Christian Slater',
      'Helmut Qualtinger',
      'Elya Baskin',
      'Michael Lonsdale',
      'Volker Prechtel',
    ],
  },
  // https://www.themoviedb.org/movie/975
  {
    title: 'Paths of Glory',
    releaseDate: '1957-10-25',
    runtimeMinutes: 88,
    synopsis:
      'A commanding officer defends three scapegoats on trial for a failed offensive that occurred within the French Army in 1916.',
    posterUrl: tmdbPoster('hGg1UCQSHlXfv2HI9bDHT2OQBam'),
    genres: ['War', 'Drama'],
    directors: ['Stanley Kubrick'],
    writers: ['Stanley Kubrick', 'Calder Willingham', 'Jim Thompson'],
    cast: [
      'Kirk Douglas',
      'Ralph Meeker',
      'Adolphe Menjou',
      'George Macready',
      'Wayne Morris',
      'Richard Anderson',
    ],
  },
  // https://www.themoviedb.org/movie/843
  {
    title: 'In the Mood for Love',
    releaseDate: '2000-09-29',
    runtimeMinutes: 99,
    synopsis:
      'In 1960s Hong Kong, two neighbors form an intimate bond after making a discovery about their spouses in this visually stunning tale of unrequited love.',
    posterUrl: tmdbPoster('iYypPT4bhqXfq1b6EnmxvRt6b2Y'),
    genres: ['Drama', 'Romance'],
    directors: ['Wong Kar-Wai'],
    writers: ['Wong Kar-Wai'],
    cast: [
      'Maggie Cheung',
      'Tony Leung Chiu-wai',
      'Siu Ping-Lam',
      'Rebecca Pan',
      'Kelly Lai Chen',
      'Joe Cheung Tung-Cho',
    ],
  },
  // https://www.themoviedb.org/movie/943
  {
    title: 'Lethal Weapon 3',
    releaseDate: '1992-05-15',
    runtimeMinutes: 118,
    synopsis:
      'Riggs and Murtaugh pursue a former officer who uses his knowledge of police procedure and policies to steal and sell confiscated guns and ammunition to local street gangs.',
    posterUrl: tmdbPoster('efOCSdTquRGQFTpTsLYApfBWmJK'),
    genres: ['Action', 'Thriller', 'Crime'],
    directors: ['Richard Donner'],
    writers: ['Robert Mark Kamen', 'Jeffrey Boam'],
    cast: ['Mel Gibson', 'Danny Glover', 'Joe Pesci', 'Rene Russo', 'Stuart Wilson', 'Steve Kahan'],
  },
  // https://www.themoviedb.org/movie/619
  {
    title: 'The Bodyguard',
    releaseDate: '1992-11-25',
    runtimeMinutes: 129,
    synopsis:
      "A former Secret Service agent grudgingly takes an assignment to protect a pop idol who's threatened by a crazed fan. At first, the safety-obsessed bodyguard and the self-indulgent diva totally clash. But before long, all that tension sparks fireworks of another sort, and the love-averse tough guy is torn between duty and romance.",
    posterUrl: tmdbPoster('ihWF0uY1xnKqw9YK7ZHNLUZOhcO'),
    genres: ['Action', 'Drama', 'Romance'],
    directors: ['Mick Jackson'],
    writers: ['Lawrence Kasdan'],
    cast: [
      'Kevin Costner',
      'Whitney Houston',
      'Gary Kemp',
      'Bill Cobbs',
      'Ralph Waite',
      'Tomas Arana',
    ],
  },
  // https://www.themoviedb.org/movie/25
  {
    title: 'Jarhead',
    releaseDate: '2005-11-04',
    runtimeMinutes: 123,
    synopsis:
      'Jarhead is a film about a US Marine Anthony Swofford’s experience in the Gulf War. After putting up with an arduous boot camp, Swofford and his unit are sent to the Persian Gulf where they are eager to fight, but are forced to stay back from the action. Swofford struggles with the possibility of his girlfriend cheating on him, and as his mental state deteriorates, his desire to kill increases.',
    posterUrl: tmdbPoster('6vdj47RAWOUZBkeQmqToeZ7eaio'),
    genres: ['Drama', 'War'],
    directors: ['Sam Mendes'],
    writers: ['William Broyles Jr.'],
    cast: [
      'Jake Gyllenhaal',
      'Jamie Foxx',
      'Peter Sarsgaard',
      'Scott MacDonald',
      'Chris Cooper',
      'Laz Alonso',
    ],
  },
  // https://www.themoviedb.org/movie/205
  {
    title: 'Hotel Rwanda',
    releaseDate: '2004-12-22',
    runtimeMinutes: 122,
    synopsis:
      'Inspired by true events, this film takes place in Rwanda in the 1990s when more than a million Tutsis were killed in a genocide that went mostly unnoticed by the rest of the world. Hotel owner Paul Rusesabagina houses over a thousand refuges in his hotel in attempt to save their lives.',
    posterUrl: tmdbPoster('p3pHw85UMZPegfMZBA6dZ06yarm'),
    genres: ['Drama', 'History', 'War'],
    directors: ['Terry George'],
    writers: ['Terry George', 'Keir Pearson'],
    cast: [
      'Don Cheadle',
      'Sophie Okonedo',
      'Nick Nolte',
      'Fana Mokoena',
      'Desmond Dube',
      'Hakeem Kae-Kazim',
    ],
  },
  // https://www.themoviedb.org/movie/421
  {
    title: 'The Life Aquatic with Steve Zissou',
    releaseDate: '2004-12-10',
    runtimeMinutes: 119,
    synopsis:
      "Renowned oceanographer Steve Zissou has sworn vengeance upon the rare shark that devoured a member of his crew. In addition to his regular team, he is joined on his boat by Ned, a man who believes Zissou to be his father, and Jane, a journalist pregnant by a married man. They travel the sea, all too often running into pirates and, perhaps more traumatically, various figures from Zissou's past, including his estranged wife, Eleanor.",
    posterUrl: tmdbPoster('qZoFLNBC78jzboWeDH6Ha0qavF2'),
    genres: ['Adventure', 'Comedy', 'Drama'],
    directors: ['Wes Anderson'],
    writers: ['Wes Anderson', 'Noah Baumbach'],
    cast: [
      'Bill Murray',
      'Owen Wilson',
      'Cate Blanchett',
      'Anjelica Huston',
      'Willem Dafoe',
      'Jeff Goldblum',
    ],
  },
  // https://www.themoviedb.org/movie/665
  {
    title: 'Ben-Hur',
    releaseDate: '1959-11-18',
    runtimeMinutes: 212,
    synopsis:
      'In ancient Judea, a Jewish aristocrat opposing Roman occupation of his homeland reunites with his childhood friend, now a Roman commander — setting in motion a saga of betrayal, adventure, tragedy, revenge, and faith.',
    posterUrl: tmdbPoster('m4WQ1dBIrEIHZNCoAjdpxwSKWyH'),
    genres: ['History', 'Drama', 'Adventure'],
    directors: ['William Wyler'],
    writers: ['Karl Tunberg'],
    cast: [
      'Charlton Heston',
      'Stephen Boyd',
      'Hugh Griffith',
      'Jack Hawkins',
      'Haya Harareet',
      'Martha Scott',
    ],
  },
  // https://www.themoviedb.org/movie/1267
  {
    title: 'Meet the Robinsons',
    releaseDate: '2007-03-23',
    runtimeMinutes: 95,
    synopsis:
      'Lewis, a brilliant young inventor, is keen on creating a time machine to find his mother, who abandoned him in an orphanage. Things take a turn when he meets Wilbur Robinson and his family.',
    posterUrl: tmdbPoster('naya0zF4kT401Sx15AtwB9vpcJr'),
    genres: ['Animation', 'Comedy', 'Family', 'Science Fiction', 'Adventure'],
    directors: ['Stephen J. Anderson'],
    writers: [
      'Stephen J. Anderson',
      'Michelle Bochner Spitz',
      'Nathan Greno',
      'Don Hall',
      'Aurian Redson',
      'Joseph Mateo',
      'Jon Bernstein',
    ],
    cast: [
      'Daniel Hansen',
      'Jordan Fry',
      'Wesley Singerman',
      'Matthew Josten',
      'Stephen J. Anderson',
      'Tom Selleck',
    ],
  },
  // https://www.themoviedb.org/movie/1255
  {
    title: 'The Host',
    releaseDate: '2006-07-27',
    runtimeMinutes: 120,
    synopsis:
      "A teenage girl is captured by a giant mutated squid-like creature that appears from Seoul's Han River after toxic waste was dumped in it, prompting her family into a frantic search for her.",
    posterUrl: tmdbPoster('dEDLY3KeghKFzks5nTDWdigVikr'),
    genres: ['Horror', 'Drama', 'Science Fiction'],
    directors: ['Bong Joon Ho'],
    writers: ['Bong Joon Ho', 'Baek Chul-hyun', 'Hah Jun-won'],
    cast: ['Song Kang-ho', 'Byun Hee-bong', 'Park Hae-il', 'Bae Doona', 'Ko Asung', 'Oh Dal-su'],
  },
  // https://www.themoviedb.org/movie/69
  {
    title: 'Walk the Line',
    releaseDate: '2005-09-13',
    runtimeMinutes: 136,
    synopsis:
      "A chronicle of country music legend Johnny Cash's life, from his early days on an Arkansas cotton farm to his rise to fame with Sun Records in Memphis, where he recorded alongside Elvis Presley, Jerry Lee Lewis and Carl Perkins.",
    posterUrl: tmdbPoster('iIXy2T3fIxfKCBCJqkAnVBFPO8o'),
    genres: ['Drama', 'Music', 'Romance'],
    directors: ['James Mangold'],
    writers: ['James Mangold', 'Gill Dennis'],
    cast: [
      'Joaquin Phoenix',
      'Reese Witherspoon',
      'Ginnifer Goodwin',
      'Robert Patrick',
      'Dallas Roberts',
      'Dan John Miller',
    ],
  },
  // https://www.themoviedb.org/movie/1268
  {
    title: "Mr. Bean's Holiday",
    releaseDate: '2007-03-22',
    runtimeMinutes: 90,
    synopsis:
      'Mr. Bean wins a trip to Cannes where he unwittingly separates a young boy from his father and must help the two reunite. On the way he discovers France, bicycling and true love, among other things.',
    posterUrl: tmdbPoster('bSSx9Sq6irWwN9NTQmoT9KE8kXn'),
    genres: ['Family', 'Comedy'],
    directors: ['Steve Bendelack'],
    writers: ['Hamish McColl', 'Robin Driscoll'],
    cast: [
      'Rowan Atkinson',
      'Willem Dafoe',
      'Maxim Baldry',
      'Karel Roden',
      'Emma de Caunes',
      'Steve Pemberton',
    ],
  },
  // https://www.themoviedb.org/movie/978
  {
    title: 'Seven Years in Tibet',
    releaseDate: '1997-09-12',
    runtimeMinutes: 136,
    synopsis:
      "Austrian mountaineer Heinrich Harrer journeys to the Himalayas without his family to head an expedition in 1939. But when World War II breaks out, the arrogant Harrer falls into Allied forces' hands as a prisoner of war. He escapes with a fellow detainee and makes his way to Lhasa, Tibet, where he meets the 14-year-old Dalai Lama, whose friendship ultimately transforms his outlook on life.",
    posterUrl: tmdbPoster('qm87HHUew8ICtUCM4asO3gFYvby'),
    genres: ['Adventure', 'Drama', 'History'],
    directors: ['Jean-Jacques Annaud'],
    writers: ['Becky Johnston'],
    cast: [
      'Brad Pitt',
      'Jamyang Jamtsho Wangchuk',
      'David Thewlis',
      'BD Wong',
      'Mako',
      'Lhakpa Tsamchoe',
    ],
  },
  // https://www.themoviedb.org/movie/786
  {
    title: 'Almost Famous',
    releaseDate: '2000-09-15',
    runtimeMinutes: 124,
    synopsis:
      'In 1973, a precocious 15-year-old aspiring rock journalist lands a dream assignment from Rolling Stone to tour with a rising rock band, embarking on a coming-of-age journey as he discovers the exhilarating and heartbreaking realities behind rock stardom.',
    posterUrl: tmdbPoster('3rrkyLYbgLj84AYvjhdcJot4JPx'),
    genres: ['Drama', 'Music'],
    directors: ['Cameron Crowe'],
    writers: ['Cameron Crowe'],
    cast: [
      'Billy Crudup',
      'Frances McDormand',
      'Kate Hudson',
      'Jason Lee',
      'Patrick Fugit',
      'Zooey Deschanel',
    ],
  },
  // https://www.themoviedb.org/movie/1381
  {
    title: 'The Fountain',
    releaseDate: '2006-11-22',
    runtimeMinutes: 96,
    synopsis:
      'Spanning over one thousand years, and three parallel stories, The Fountain is a story of love, death, spirituality, and the fragility of our existence in this world.',
    posterUrl: tmdbPoster('4XTf8GuCVLWolubANaKkpk62YPq'),
    genres: ['Drama', 'Adventure', 'Science Fiction', 'Romance'],
    directors: ['Darren Aronofsky'],
    writers: ['Darren Aronofsky'],
    cast: [
      'Hugh Jackman',
      'Rachel Weisz',
      'Ellen Burstyn',
      'Mark Margolis',
      'Stephen McHattie',
      'Fernando Hernández',
    ],
  },
  // https://www.themoviedb.org/movie/19
  {
    title: 'Metropolis',
    releaseDate: '1927-01-10',
    runtimeMinutes: 148,
    synopsis:
      "In a futuristic city sharply divided between the rich and the poor, the son of the city's mastermind meets a prophet who predicts the coming of a savior to mediate their differences.",
    posterUrl: tmdbPoster('kr9wXRN23zLuWJIelahas1mtnYj'),
    genres: ['Drama', 'Science Fiction'],
    directors: ['Fritz Lang'],
    writers: ['Fritz Lang', 'Thea von Harbou'],
    cast: [
      'Gustav Fröhlich',
      'Brigitte Helm',
      'Alfred Abel',
      'Rudolf Klein-Rogge',
      'Theodor Loos',
      'Fritz Rasp',
    ],
  },
  // https://www.themoviedb.org/movie/1656
  {
    title: 'The Legend of Zorro',
    releaseDate: '2005-10-24',
    runtimeMinutes: 130,
    synopsis:
      "Despite trying to keep his swashbuckling to a minimum, a threat to California's pending statehood causes the adventure-loving Don Alejandro de la Vega and his wife, Elena, to take action.",
    posterUrl: tmdbPoster('93iEBX1QbsxAv8eSybe8lhLXY1A'),
    genres: ['Action', 'Adventure', 'Western'],
    directors: ['Martin Campbell'],
    writers: ['Alex Kurtzman', 'Roberto Orci'],
    cast: [
      'Antonio Banderas',
      'Catherine Zeta-Jones',
      'Adrian Alonso',
      'Julio Oscar Mechoso',
      'Nick Chinlund',
      'Alexa Benedetti',
    ],
  },
  // https://www.themoviedb.org/movie/533
  {
    title: 'Wallace & Gromit: The Curse of the Were-Rabbit',
    releaseDate: '2005-09-15',
    runtimeMinutes: 85,
    synopsis:
      'Cheese-loving eccentric Wallace and his cunning canine pal Gromit run a business ridding the town of garden pests. Using only humane methods, which turns their home into a halfway house for evicted vermin, the pair stumble upon a mystery involving a voracious vegetarian monster that threatens to ruin the annual veggie-growing contest.',
    posterUrl: tmdbPoster('cMQ2lNd7sBe6PCf6zF5QxrKzbRG'),
    genres: ['Adventure', 'Animation', 'Comedy', 'Family'],
    directors: ['Nick Park', 'Steve Box'],
    writers: ['Nick Park', 'Steve Box', 'Mark Burton', 'Bob Baker'],
    cast: [
      'Peter Sallis',
      'Ralph Fiennes',
      'Helena Bonham Carter',
      'Peter Kay',
      'Nicholas Smith',
      'Liz Smith',
    ],
  },
  // https://www.themoviedb.org/movie/1278
  {
    title: 'The Dreamers',
    releaseDate: '2003-10-10',
    runtimeMinutes: 115,
    synopsis:
      'When Isabelle and Theo invite Matthew to stay with them, what begins as a casual friendship ripens into a sensual voyage of discovery and desire in which nothing is off limits and everything is possible.',
    posterUrl: tmdbPoster('gBb7GGaFYPu7nEUYvC8G4LaJJN1'),
    genres: ['Drama', 'Romance'],
    directors: ['Bernardo Bertolucci'],
    writers: ['Gilbert Adair'],
    cast: [
      'Michael Pitt',
      'Eva Green',
      'Louis Garrel',
      'Anna Chancellor',
      'Robin Renucci',
      'Jean-Pierre Kalfon',
    ],
  },
  // https://www.themoviedb.org/movie/319
  {
    title: 'True Romance',
    releaseDate: '1993-09-09',
    runtimeMinutes: 121,
    synopsis:
      'Clarence marries hooker Alabama, steals cocaine from her pimp, and tries to sell it in Hollywood, while the owners of the coke try to reclaim it.',
    posterUrl: tmdbPoster('39lXk6ud6KiJgGbbWI2PUKS7y2'),
    genres: ['Action', 'Crime', 'Romance'],
    directors: ['Tony Scott'],
    writers: ['Quentin Tarantino'],
    cast: [
      'Christian Slater',
      'Patricia Arquette',
      'Dennis Hopper',
      'Val Kilmer',
      'Gary Oldman',
      'Brad Pitt',
    ],
  },
  // https://www.themoviedb.org/movie/768
  {
    title: 'From Hell',
    releaseDate: '2001-02-08',
    runtimeMinutes: 122,
    synopsis:
      "Frederick Abberline is an opium-huffing inspector from Scotland Yard who falls for one of Jack the Ripper's prostitute targets in this Hughes brothers adaption of a graphic novel that posits the Ripper's true identity.",
    posterUrl: tmdbPoster('t2WpWM8nBO4sULXr2bDfNEt4qgr'),
    genres: ['Horror', 'Mystery', 'Thriller'],
    directors: ['Allen Hughes', 'Albert Hughes'],
    writers: ['Terry Hayes', 'Rafael Yglesias'],
    cast: [
      'Johnny Depp',
      'Heather Graham',
      'Ian Holm',
      'Robbie Coltrane',
      'Ian Richardson',
      'Jason Flemyng',
    ],
  },
  // https://www.themoviedb.org/movie/801
  {
    title: 'Good Morning, Vietnam',
    releaseDate: '1987-12-23',
    runtimeMinutes: 121,
    synopsis:
      'A disk jockey goes to Vietnam to work for the Armed Forces Radio Service. While he becomes popular among the troops, his superiors disapprove of his humor.',
    posterUrl: tmdbPoster('sreISlFUn5TyR41QNjlfAdX5SEW'),
    genres: ['Comedy', 'Drama', 'War'],
    directors: ['Barry Levinson'],
    writers: ['Mitch Markowitz'],
    cast: [
      'Robin Williams',
      'Forest Whitaker',
      'Tom T. Tran',
      'Chintara Sukapatana',
      'Bruno Kirby',
      'Robert Wuhl',
    ],
  },
  // https://www.themoviedb.org/movie/1580
  {
    title: 'Rope',
    releaseDate: '1948-02-01',
    runtimeMinutes: 81,
    synopsis:
      'Two young men attempt to prove they committed the perfect murder by hosting a dinner party for the family of a classmate they just strangled to death.',
    posterUrl: tmdbPoster('9ar6rxLDB8kagAnXZKn6h9smscr'),
    genres: ['Thriller', 'Crime', 'Drama'],
    directors: ['Alfred Hitchcock'],
    writers: ['Arthur Laurents'],
    cast: [
      'James Stewart',
      'John Dall',
      'Farley Granger',
      'Cedric Hardwicke',
      'Constance Collier',
      'Douglas Dick',
    ],
  },
  // https://www.themoviedb.org/movie/612
  {
    title: 'Munich',
    releaseDate: '2005-12-23',
    runtimeMinutes: 164,
    synopsis:
      'During the 1972 Olympic Games in Munich, eleven Israeli athletes are taken hostage and murdered by a Palestinian terrorist group known as Black September. In retaliation, the Israeli government recruits a group of Mossad agents to track down and execute those responsible for the attack.',
    posterUrl: tmdbPoster('iUekaw96QLInZpsNwRTlRKrZgwm'),
    genres: ['Drama', 'History', 'Thriller'],
    directors: ['Steven Spielberg'],
    writers: ['Tony Kushner', 'Eric Roth'],
    cast: [
      'Eric Bana',
      'Daniel Craig',
      'Ciarán Hinds',
      'Mathieu Kassovitz',
      'Hanns Zischler',
      'Ayelet Zurer',
    ],
  },
  // https://www.themoviedb.org/movie/712
  {
    title: 'Four Weddings and a Funeral',
    releaseDate: '1994-03-09',
    runtimeMinutes: 117,
    synopsis:
      'Over the course of five social occasions, a committed bachelor must consider the notion that he may have discovered love.',
    posterUrl: tmdbPoster('qa72G2VS0bpxms6yo0tI9vsHm2e'),
    genres: ['Comedy', 'Drama', 'Romance'],
    directors: ['Mike Newell'],
    writers: ['Richard Curtis'],
    cast: [
      'Hugh Grant',
      'Andie MacDowell',
      'Kristin Scott Thomas',
      'Simon Callow',
      'James Fleet',
      'John Hannah',
    ],
  },
  // https://www.themoviedb.org/movie/1645
  {
    title: 'A Time to Kill',
    releaseDate: '1996-07-24',
    runtimeMinutes: 149,
    synopsis:
      'A young lawyer defends a black man accused of murdering two white men who raped his 10-year-old daughter, sparking a rebirth of the KKK.',
    posterUrl: tmdbPoster('w8UCke112E9jrhjKcwG32kyhTx5'),
    genres: ['Crime', 'Drama', 'Thriller'],
    directors: ['Joel Schumacher'],
    writers: ['Akiva Goldsman'],
    cast: [
      'Matthew McConaughey',
      'Sandra Bullock',
      'Samuel L. Jackson',
      'Kevin Spacey',
      'Ashley Judd',
      'Donald Sutherland',
    ],
  },
  // https://www.themoviedb.org/movie/944
  {
    title: 'Lethal Weapon 4',
    releaseDate: '1998-07-10',
    runtimeMinutes: 127,
    synopsis:
      'With personal crises and age weighing in on them, LAPD officers Riggs and Murtaugh must contend with a deadly Chinese crime lord trying to get his brother out of prison.',
    posterUrl: tmdbPoster('1EYNRhKXcMPF2zOPS1nWXoC844w'),
    genres: ['Action', 'Crime', 'Thriller'],
    directors: ['Richard Donner'],
    writers: ['Channing Gibson'],
    cast: ['Mel Gibson', 'Danny Glover', 'Joe Pesci', 'Rene Russo', 'Chris Rock', 'Jet Li'],
  },
  // https://www.themoviedb.org/movie/638
  {
    title: 'Lost Highway',
    releaseDate: '1997-01-15',
    runtimeMinutes: 134,
    synopsis:
      'A tormented jazz musician finds himself lost in an enigmatic story involving murder, surveillance, gangsters, doppelgängers, and an impossible transformation inside a prison cell.',
    posterUrl: tmdbPoster('fdTtij6H0sX9AzIjUeynh5zbfm7'),
    genres: ['Drama', 'Thriller', 'Mystery'],
    directors: ['David Lynch'],
    writers: ['David Lynch', 'Barry Gifford'],
    cast: [
      'Patricia Arquette',
      'Bill Pullman',
      'Balthazar Getty',
      'Robert Blake',
      'Robert Loggia',
      'Michael Massee',
    ],
  },
  // https://www.themoviedb.org/movie/599
  {
    title: 'Sunset Boulevard',
    releaseDate: '1950-08-10',
    runtimeMinutes: 110,
    synopsis:
      'A hack screenwriter writes a screenplay for a former silent film star who has faded into Hollywood obscurity.',
    posterUrl: tmdbPoster('zt8aQ6ksqK6p1AopC5zVTDS9pKT'),
    genres: ['Drama'],
    directors: ['Billy Wilder'],
    writers: ['Billy Wilder', 'Charles Brackett', 'D.M. Marshman Jr.'],
    cast: [
      'William Holden',
      'Gloria Swanson',
      'Erich von Stroheim',
      'Nancy Olson',
      'Fred Clark',
      'Lloyd Gough',
    ],
  },
  // https://www.themoviedb.org/movie/55
  {
    title: 'Amores Perros',
    releaseDate: '2000-06-16',
    runtimeMinutes: 154,
    synopsis:
      'A fatalistic car crash in Mexico city sets off a chain of events in the lives of three people: a supermodel, a young man wanting to run off with his sister-in-law, and a homeless man.',
    posterUrl: tmdbPoster('A4lH22nlFF7MdalGfcvSrlC1ttt'),
    genres: ['Drama', 'Thriller'],
    directors: ['Alejandro G. Iñárritu'],
    writers: ['Guillermo Arriaga'],
    cast: [
      'Emilio Echevarría',
      'Gael García Bernal',
      'Vanessa Bauche',
      'Goya Toledo',
      'Álvaro Guerrero',
      'Jorge Salinas',
    ],
  },
  // https://www.themoviedb.org/movie/928
  {
    title: 'Gremlins 2: The New Batch',
    releaseDate: '1990-06-15',
    runtimeMinutes: 106,
    synopsis:
      'Young sweethearts Billy and Kate move to the Big Apple, land jobs in a high-tech office park and soon reunite with the friendly and lovable Gizmo. But a series of accidents creates a whole new generation of Gremlins. The situation worsens when the devilish green creatures invade a top-secret laboratory and develop genetically altered powers, making them even harder to destroy!',
    posterUrl: tmdbPoster('35F5yD7MljvBE2AC0NHAVCoPGEi'),
    genres: ['Comedy', 'Horror', 'Fantasy'],
    directors: ['Joe Dante'],
    writers: ['Charles S. Haas'],
    cast: [
      'Zach Galligan',
      'Phoebe Cates',
      'John Glover',
      'Robert Prosky',
      'Robert Picardo',
      'Christopher Lee',
    ],
  },
  // https://www.themoviedb.org/movie/1574
  {
    title: 'Chicago',
    releaseDate: '2002-12-10',
    runtimeMinutes: 113,
    synopsis:
      'Murderesses Velma Kelly and Roxie Hart find themselves on death row together and fight for the fame that will keep them from the gallows in 1920s Chicago.',
    posterUrl: tmdbPoster('3ED8cWCXY9zkx77Sd0N5qMbsdDP'),
    genres: ['Comedy', 'Crime', 'Drama'],
    directors: ['Rob Marshall'],
    writers: ['Bill Condon'],
    cast: [
      'Renée Zellweger',
      'Catherine Zeta-Jones',
      'Richard Gere',
      'Queen Latifah',
      'Ekaterina Chtchelkanova',
      'John C. Reilly',
    ],
  },
  // https://www.themoviedb.org/movie/1607
  {
    title: 'A Bronx Tale',
    releaseDate: '1993-10-01',
    runtimeMinutes: 121,
    synopsis:
      "Set in the Bronx during the tumultuous 1960s, an adolescent boy is torn between his honest, working-class father and a violent yet charismatic crime boss. Complicating matters is the youngster's growing attraction - forbidden in his neighborhood - for a beautiful black girl.",
    posterUrl: tmdbPoster('sDbO6LmLYtyqAoFTPpRcMgPSCEO'),
    genres: ['Drama', 'Crime'],
    directors: ['Robert De Niro'],
    writers: ['Chazz Palminteri'],
    cast: [
      'Robert De Niro',
      'Chazz Palminteri',
      'Lillo Brancato',
      'Francis Capra',
      'Taral Hicks',
      'Kathrine Narducci',
    ],
  },
  // https://www.themoviedb.org/movie/595
  {
    title: 'To Kill a Mockingbird',
    releaseDate: '1962-12-20',
    runtimeMinutes: 129,
    synopsis:
      'Scout Finch, 6, and her older brother Jem live in sleepy Maycomb, Alabama, spending much of their time with their friend Dill and spying on their reclusive and mysterious neighbor, Boo Radley. When Atticus, their widowed father and a respected lawyer, defends a black man named Tom Robinson against fabricated rape charges, the trial and tangent events expose the children to evils of racism and stereotyping.',
    posterUrl: tmdbPoster('gZycFUMLx2110dzK3nBNai7gfpM'),
    genres: ['Drama'],
    directors: ['Robert Mulligan'],
    writers: ['Horton Foote'],
    cast: [
      'Gregory Peck',
      'Mary Badham',
      'Phillip Alford',
      'John Megna',
      'Frank Overton',
      'Brock Peters',
    ],
  },
  // https://www.themoviedb.org/movie/865
  {
    title: 'The Running Man',
    releaseDate: '1987-11-13',
    runtimeMinutes: 101,
    synopsis:
      'By 2017, the global economy has collapsed and U.S. society has become a totalitarian police state, censoring all cultural activity. The government pacifies the populace by broadcasting a number of game shows in which convicted criminals fight for their lives, including the gladiator-style The Running Man, hosted by the ruthless Damon Killian, where “runners” attempt to evade “stalkers” and certain death for a chance to be pardoned and set free.',
    posterUrl: tmdbPoster('GTAUOhO4BN0peJVvxGEQydJvUO'),
    genres: ['Action', 'Thriller', 'Science Fiction'],
    directors: ['Paul Michael Glaser'],
    writers: ['Steven E. de Souza'],
    cast: [
      'Arnold Schwarzenegger',
      'Richard Dawson',
      'María Conchita Alonso',
      'Yaphet Kotto',
      'Jim Brown',
      'Jesse Ventura',
    ],
  },
  // https://www.themoviedb.org/movie/521
  {
    title: 'Dial M for Murder',
    releaseDate: '1954-05-29',
    runtimeMinutes: 105,
    synopsis:
      'When her American lover visits London, a wealthy woman’s jealous husband hatches a plan to murder her and inherit her fortune.',
    posterUrl: tmdbPoster('2gDCAgl2iBQNuJuk6p2xtuS1ewg'),
    genres: ['Thriller', 'Crime', 'Drama'],
    directors: ['Alfred Hitchcock'],
    writers: ['Frederick Knott'],
    cast: [
      'Ray Milland',
      'Grace Kelly',
      'Robert Cummings',
      'John Williams',
      'Anthony Dawson',
      'Leo Britt',
    ],
  },
  // https://www.themoviedb.org/movie/5
  {
    title: 'Four Rooms',
    releaseDate: '1995-12-09',
    runtimeMinutes: 98,
    synopsis:
      "It's Ted the Bellhop's first night on the job...and the hotel's very unusual guests are about to place him in some outrageous predicaments. It seems that this evening's room service is serving up one unbelievable happening after another.",
    posterUrl: tmdbPoster('75aHn1NOYXh4M7L5shoeQ6NGykP'),
    genres: ['Comedy'],
    directors: ['Allison Anders', 'Alexandre Rockwell', 'Robert Rodriguez', 'Quentin Tarantino'],
    writers: ['Allison Anders', 'Alexandre Rockwell', 'Robert Rodriguez', 'Quentin Tarantino'],
    cast: [
      'Tim Roth',
      'Jennifer Beals',
      'David Proval',
      'Ione Skye',
      'Madonna',
      'Antonio Banderas',
    ],
  },
  // https://www.themoviedb.org/movie/96
  {
    title: 'Beverly Hills Cop II',
    releaseDate: '1987-05-18',
    runtimeMinutes: 103,
    synopsis:
      'Axel Foley returns to the land of sunshine and palm trees to investigate the near-fatal shooting of police Captain Andrew Bogomil. With the help of Sgt. Taggart and Det. Rosewood, they soon uncover that the shooting is associated with a series of "alphabet" robberies masterminded by a heartless weapons kingpin—and the chase is on.',
    posterUrl: tmdbPoster('egDakU8O5yUwpUJP9IMAUVtIDll'),
    genres: ['Action', 'Comedy', 'Crime'],
    directors: ['Tony Scott'],
    writers: ['Larry Ferguson', 'Warren Skaaren'],
    cast: [
      'Eddie Murphy',
      'Judge Reinhold',
      'John Ashton',
      'Jürgen Prochnow',
      'Ronny Cox',
      'Brigitte Nielsen',
    ],
  },
  // https://www.themoviedb.org/movie/951
  {
    title: 'Kindergarten Cop',
    releaseDate: '1990-12-21',
    runtimeMinutes: 111,
    synopsis:
      "Hard-edged cop John Kimble gets more than he bargained for when he goes undercover as a kindergarten teacher to get the goods on a brutal drug lord while at the same time protecting the man's young son. Pitted against a class of boisterous moppets whose antics try his patience and test his mettle, Kimble may have met his match … in more ways than one.",
    posterUrl: tmdbPoster('nKnHWwkXyvhzCYWm3FyRAv3qBrl'),
    genres: ['Comedy'],
    directors: ['Ivan Reitman'],
    writers: ['Murray Salem', 'Timothy Harris', 'Herschel Weingrod'],
    cast: [
      'Arnold Schwarzenegger',
      'Penelope Ann Miller',
      'Pamela Reed',
      'Linda Hunt',
      'Richard Tyson',
      'Carroll Baker',
    ],
  },
  // https://www.themoviedb.org/movie/97
  {
    title: 'Tron',
    releaseDate: '1982-07-09',
    runtimeMinutes: 96,
    synopsis:
      'When brilliant video game maker Flynn hacks the mainframe of his ex-employer, he is beamed inside an astonishing digital world and becomes part of the very game he is designing. In his mission through cyberspace, Flynn matches wits with a maniacal Master Control Program and teams up with Tron, a security measure created to bring balance to the digital environment.',
    posterUrl: tmdbPoster('jigY9B6TKz4qlfikZcd18qtzTK4'),
    genres: ['Science Fiction', 'Action', 'Adventure'],
    directors: ['Steven Lisberger'],
    writers: ['Steven Lisberger'],
    cast: [
      'Jeff Bridges',
      'Bruce Boxleitner',
      'David Warner',
      'Cindy Morgan',
      'Barnard Hughes',
      'Dan Shor',
    ],
  },
  // https://www.themoviedb.org/movie/167
  {
    title: 'K-PAX',
    releaseDate: '2001-10-26',
    runtimeMinutes: 120,
    synopsis:
      'Prot is a patient at a mental hospital who claims to be from a far away planet. His psychiatrist tries to help him, only to begin to doubt his own explanations.',
    posterUrl: tmdbPoster('tafXZX0I6rso7EyoEzfygfTqxq6'),
    genres: ['Science Fiction', 'Drama', 'Mystery'],
    directors: ['Iain Softley'],
    writers: ['Charles Leavitt'],
    cast: [
      'Jeff Bridges',
      'Kevin Spacey',
      'Mary McCormack',
      'Alfre Woodard',
      'David Patrick Kelly',
      'Saul Williams',
    ],
  },
  // https://www.themoviedb.org/movie/984
  {
    title: 'Dirty Harry',
    releaseDate: '1971-12-23',
    runtimeMinutes: 102,
    synopsis:
      "When a madman dubbed 'Scorpio' terrorizes San Francisco, hard-nosed cop, Harry Callahan – famous for his take-no-prisoners approach to law enforcement – is tasked with hunting down the psychopath.",
    posterUrl: tmdbPoster('scl2JDHzYoIEs5xyYy5ITCfyY0G'),
    genres: ['Action', 'Crime', 'Thriller'],
    directors: ['Don Siegel'],
    writers: ['Harry Julian Fink', 'Rita M. Fink', 'Dean Riesner'],
    cast: [
      'Clint Eastwood',
      'Harry Guardino',
      'Reni Santoni',
      'John Vernon',
      'Andrew Robinson',
      'John Larch',
    ],
  },
  // https://www.themoviedb.org/movie/985
  {
    title: 'Eraserhead',
    releaseDate: '1977-09-28',
    runtimeMinutes: 89,
    synopsis:
      'First-time father Henry Spencer tries to survive his industrial environment, his angry girlfriend, and the unbearable screams of his newly born mutant child.',
    posterUrl: tmdbPoster('mxveW3mGVc0DzLdOmtkZsgd7c3B'),
    genres: ['Horror', 'Science Fiction'],
    directors: ['David Lynch'],
    writers: ['David Lynch'],
    cast: [
      'Jack Nance',
      'Charlotte Stewart',
      'Allen Joseph',
      'Jeanne Bates',
      'Judith Roberts',
      'Laurel Near',
    ],
  },
  // https://www.themoviedb.org/movie/814
  {
    title: 'An American Werewolf in London',
    releaseDate: '1981-08-21',
    runtimeMinutes: 97,
    synopsis:
      'American tourists David and Jack are savagely attacked by an unidentified animal while hiking on the Yorkshire Moors. After retiring to the home of a beautiful nurse to recuperate, David soon begins experiencing disturbing changes to his body and mind.',
    posterUrl: tmdbPoster('hVEqUASJmCQaolkKFEySCHZ8uKG'),
    genres: ['Comedy', 'Horror', 'Fantasy'],
    directors: ['John Landis'],
    writers: ['John Landis'],
    cast: [
      'David Naughton',
      'Griffin Dunne',
      'Jenny Agutter',
      'John Woodvine',
      'Don McKillop',
      'Brian Glover',
    ],
  },
  // https://www.themoviedb.org/movie/553
  {
    title: 'Dogville',
    releaseDate: '2003-05-21',
    runtimeMinutes: 178,
    synopsis:
      'A woman on the run from the mob is reluctantly accepted in a small Colorado community in exchange for labor, but when a search visits the town, she learns that their support has a price.',
    posterUrl: tmdbPoster('lraVawavIXh5geMlVjpzCw9TGwR'),
    genres: ['Crime', 'Drama', 'Thriller'],
    directors: ['Lars von Trier'],
    writers: ['Lars von Trier'],
    cast: [
      'Nicole Kidman',
      'Paul Bettany',
      'John Hurt',
      'Stellan Skarsgård',
      'Philip Baker Hall',
      'Patricia Clarkson',
    ],
  },
  // https://www.themoviedb.org/movie/284
  {
    title: 'The Apartment',
    releaseDate: '1960-06-21',
    runtimeMinutes: 126,
    synopsis:
      "Bud Baxter is a minor clerk in a huge New York insurance company, until he discovers a quick way to climb the corporate ladder. He lends out his apartment to the executives as a place to take their mistresses. Although he often has to deal with the aftermath of their visits, one night he's left with a major problem to solve.",
    posterUrl: tmdbPoster('hhSRt1KKfRT0yEhEtRW3qp31JFU'),
    genres: ['Comedy', 'Drama', 'Romance'],
    directors: ['Billy Wilder'],
    writers: ['Billy Wilder', 'I. A. L. Diamond'],
    cast: [
      'Jack Lemmon',
      'Shirley MacLaine',
      'Fred MacMurray',
      'Ray Walston',
      'Jack Kruschen',
      'David Lewis',
    ],
  },
  // https://www.themoviedb.org/movie/660
  {
    title: 'Thunderball',
    releaseDate: '1965-12-11',
    runtimeMinutes: 130,
    synopsis:
      'A criminal organization has obtained two nuclear bombs and are asking for a 100 million pound ransom in the form of diamonds in seven days or they will use the weapons. The secret service sends James Bond to the Bahamas to once again save the world.',
    posterUrl: tmdbPoster('wCc4qllaTDsQN8zgGkAgQrKO6N9'),
    genres: ['Adventure', 'Action', 'Thriller'],
    directors: ['Terence Young'],
    writers: ['Jack Whittingham', 'John Hopkins', 'Richard Maibaum'],
    cast: [
      'Sean Connery',
      'Claudine Auger',
      'Adolfo Celi',
      'Luciana Paluzzi',
      'Rik Van Nutter',
      'Guy Doleman',
    ],
  },
  // https://www.themoviedb.org/movie/338
  {
    title: 'Good Bye, Lenin!',
    releaseDate: '2003-02-13',
    runtimeMinutes: 121,
    synopsis:
      "Alex Kerner's mother was in a coma while the Berlin wall fell. When she wakes up he must try to keep her from learning what happened (as she was an avid communist supporter) to avoid shocking her which could lead to another heart attack.",
    posterUrl: tmdbPoster('uHk1oGEbnvQGLnyiiYxTslZLoog'),
    genres: ['Comedy', 'Drama'],
    directors: ['Wolfgang Becker'],
    writers: [
      'Wolfgang Becker',
      'Bernd Lichtenberg',
      'Chris Silber',
      'Achim von Borries',
      'Hendrik Handloegten',
    ],
    cast: [
      'Daniel Brühl',
      'Katrin Sass',
      'Chulpan Khamatova',
      'Maria Simon',
      'Florian Lukas',
      'Alexander Beyer',
    ],
  },
  // https://www.themoviedb.org/movie/888
  {
    title: 'The Flintstones',
    releaseDate: '1994-05-27',
    runtimeMinutes: 91,
    synopsis:
      'Modern Stone Age family the Flintstones hit the big screen in this live-action version of the classic cartoon. Fred helps Barney adopt a child. Barney sees an opportunity to repay him when Slate Mining tests its employees to find a new executive. But no good deed goes unpunished.',
    posterUrl: tmdbPoster('k7gkf5Wa8YZ9iyEOylBMfw9pnkp'),
    genres: ['Fantasy', 'Comedy', 'Family'],
    directors: ['Brian Levant'],
    writers: ['Jim Jennewein', 'Steven E. de Souza', 'Tom S. Parker', 'Michael J. Wilson'],
    cast: [
      'John Goodman',
      'Elizabeth Perkins',
      'Rick Moranis',
      "Rosie O'Donnell",
      'Kyle MacLachlan',
      'Halle Berry',
    ],
  },
  // https://www.themoviedb.org/movie/696
  {
    title: 'Manhattan',
    releaseDate: '1979-04-25',
    runtimeMinutes: 96,
    synopsis:
      "Manhattan explores how the life of a middle-aged television writer dating a teenage girl is further complicated when he falls in love with his best friend's mistress.",
    posterUrl: tmdbPoster('k4eT3EvfxW1L9Wmt04UqJqCvCR6'),
    genres: ['Comedy', 'Drama', 'Romance'],
    directors: ['Woody Allen'],
    writers: ['Woody Allen', 'Marshall Brickman'],
    cast: [
      'Woody Allen',
      'Diane Keaton',
      'Michael Murphy',
      'Mariel Hemingway',
      'Meryl Streep',
      'Anne Byrne Hoffman',
    ],
  },
  // https://www.themoviedb.org/movie/1281
  {
    title: 'Bean',
    releaseDate: '1997-07-03',
    runtimeMinutes: 89,
    synopsis:
      "Childlike Englishman, Mr. Bean, is an incompetent watchman at the Royal National Gallery. After the museum's board of directors' attempt to have him fired is blocked by the chairman, who has taken a liking to Bean, they send him to Los Angeles to act as their ambassador for the unveiling of a historic painting to humiliate him. Fooled, Mr. Bean must now successfully unveil the painting or risk his and a hapless Los Angeles curator's termination.",
    posterUrl: tmdbPoster('IwrDPrB4d2DMcpnGkvan46yINL'),
    genres: ['Family', 'Adventure', 'Comedy'],
    directors: ['Mel Smith'],
    writers: ['Richard Curtis', 'Robin Driscoll'],
    cast: [
      'Rowan Atkinson',
      'Peter MacNicol',
      'Pamela Reed',
      'Tricia Vessey',
      'Andrew Lawrence',
      'Harris Yulin',
    ],
  },
  // https://www.themoviedb.org/movie/858
  {
    title: 'Sleepless in Seattle',
    releaseDate: '1993-06-24',
    runtimeMinutes: 105,
    synopsis:
      'After the death of his mother, a young boy calls a radio station in an attempt to set his father up on a date. Across the country, an engaged woman becomes convinced that they belong together, despite their never having met. Will their paths collide despite the odds?',
    posterUrl: tmdbPoster('jAXfku1u1uaLGh4cUmK0ESf1pPu'),
    genres: ['Comedy', 'Drama', 'Romance'],
    directors: ['Nora Ephron'],
    writers: ['Nora Ephron', 'Jeff Arch', 'David S. Ward'],
    cast: [
      'Meg Ryan',
      'Tom Hanks',
      'Ross Malinger',
      'Bill Pullman',
      "Rosie O'Donnell",
      'Barbara Garrick',
    ],
  },
  // https://www.themoviedb.org/movie/104
  {
    title: 'Run Lola Run',
    releaseDate: '1998-08-20',
    runtimeMinutes: 80,
    synopsis:
      "Lola receives a phone call from her boyfriend Manni. He lost 100,000 DM in a subway train that belongs to a very bad guy. She has 20 minutes to raise this amount and meet Manni. Otherwise, he will rob a store to get the money. Three different alternatives may happen depending on some minor event along Lola's run.",
    posterUrl: tmdbPoster('v0giIi4bTILVhNhJajet3WWY3FA'),
    genres: ['Action', 'Drama', 'Thriller'],
    directors: ['Tom Tykwer'],
    writers: ['Tom Tykwer'],
    cast: [
      'Franka Potente',
      'Moritz Bleibtreu',
      'Herbert Knaup',
      'Nina Petri',
      'Armin Rohde',
      'Joachim Król',
    ],
  },
  // https://www.themoviedb.org/movie/1429
  {
    title: '25th Hour',
    releaseDate: '2002-12-19',
    runtimeMinutes: 135,
    synopsis:
      'On the eve of a seven-year prison sentence, a New York drug dealer spends his final day of freedom confronting his past, his relationships, and the choices that led to his downfall in a city still reeling from 9/11.',
    posterUrl: tmdbPoster('uW7tTRElr2tRhmAVESzvHy4ByXg'),
    genres: ['Crime', 'Drama'],
    directors: ['Spike Lee'],
    writers: ['David Benioff'],
    cast: [
      'Edward Norton',
      'Philip Seymour Hoffman',
      'Barry Pepper',
      'Rosario Dawson',
      'Anna Paquin',
      'Brian Cox',
    ],
  },
  // https://www.themoviedb.org/movie/504
  {
    title: 'Monster',
    releaseDate: '2003-12-24',
    runtimeMinutes: 109,
    synopsis:
      "In 1989, prostitute Aileen Wuornos befriends and enters a relationship with a young woman named Selby. Determined to straighten out her life, Aileen's limited education lands her back on the corner. She's raped by a trick, who she kills. A string of murder and robbery follows that ultimately leads Aileen to becoming America's first female serial killer.",
    posterUrl: tmdbPoster('sWPKG1GX0woLNBuvDZkwZC8Q3Ub'),
    genres: ['Crime', 'Drama'],
    directors: ['Patty Jenkins'],
    writers: ['Patty Jenkins'],
    cast: [
      'Charlize Theron',
      'Christina Ricci',
      'Bruce Dern',
      'Lee Tergesen',
      'Annie Corley',
      'Pruitt Taylor Vince',
    ],
  },
  // https://www.themoviedb.org/movie/1262
  {
    title: 'Stranger Than Fiction',
    releaseDate: '2006-11-10',
    runtimeMinutes: 113,
    synopsis:
      'Harold Crick is a lonely IRS agent whose mundane existence is transformed when he hears a mysterious voice narrating his life.',
    posterUrl: tmdbPoster('nCzcepubwShvZ4vbCsygQNgF2Z1'),
    genres: ['Drama', 'Comedy', 'Romance', 'Fantasy'],
    directors: ['Marc Forster'],
    writers: ['Zach Helm'],
    cast: [
      'Will Ferrell',
      'Maggie Gyllenhaal',
      'Dustin Hoffman',
      'Emma Thompson',
      'Queen Latifah',
      'Tony Hale',
    ],
  },
  // https://www.themoviedb.org/movie/926
  {
    title: 'Galaxy Quest',
    releaseDate: '1999-12-25',
    runtimeMinutes: 102,
    synopsis:
      'For four years, the courageous crew of the NSEA Protector —  Commander Peter Quincy Taggart, Lieutenant Tawny Madison, and Doctor Lazarus — set off on a thrilling and often dangerous mission in space... until their series was cancelled! Now, twenty years later, aliens under attack have mistaken the Galaxy Quest television transmissions for "historical documents" and beam up the crew of has-been actors to save the universe. With no script, no director, and no clue, the actors must turn in the performances of their lives.',
    posterUrl: tmdbPoster('fZXSwgZknp81vmciTb86rw0MejV'),
    genres: ['Comedy', 'Science Fiction', 'Adventure'],
    directors: ['Dean Parisot'],
    writers: ['David Howard', 'Robert Gordon'],
    cast: [
      'Tim Allen',
      'Sigourney Weaver',
      'Alan Rickman',
      'Tony Shalhoub',
      'Sam Rockwell',
      'Daryl Mitchell',
    ],
  },
  // https://www.themoviedb.org/movie/387
  {
    title: 'Das Boot',
    releaseDate: '1981-09-17',
    runtimeMinutes: 150,
    synopsis:
      'A German submarine hunts allied ships during the Second World War, but it soon becomes the hunted. The crew tries to survive below the surface, while stretching both the boat and themselves to their limits.',
    posterUrl: tmdbPoster('u8FhQPncOAkwcei2OI9orPWhV6K'),
    genres: ['Drama', 'History', 'War'],
    directors: ['Wolfgang Petersen'],
    writers: ['Wolfgang Petersen', 'Dean Riesner'],
    cast: [
      'Jürgen Prochnow',
      'Herbert Grönemeyer',
      'Klaus Wennemann',
      'Hubertus Bengsch',
      'Martin Semmelrogge',
      'Bernd Tauber',
    ],
  },
  // https://www.themoviedb.org/movie/422
  {
    title: '8½',
    releaseDate: '1963-02-14',
    runtimeMinutes: 139,
    synopsis:
      'Guido Anselmi, a film director, finds himself creatively barren at the peak of his career. Urged by his doctors to rest, Anselmi heads for a luxurious resort, but a sorry group gathers—his producer, staff, actors, wife, mistress, and relatives—each one begging him to get on with the show. In retreat from their dependency, he fantasizes about past women and dreams of his childhood.',
    posterUrl: tmdbPoster('23VIf7zNxAgaXwIlvzd3IvOd9sY'),
    genres: ['Drama'],
    directors: ['Federico Fellini'],
    writers: ['Federico Fellini', 'Ennio Flaiano', 'Brunello Rondi', 'Tullio Pinelli'],
    cast: [
      'Marcello Mastroianni',
      'Claudia Cardinale',
      'Anouk Aimée',
      'Sandra Milo',
      'Rossella Falk',
      'Barbara Steele',
    ],
  },
  // https://www.themoviedb.org/movie/548
  {
    title: 'Rashomon',
    releaseDate: '1950-08-26',
    runtimeMinutes: 88,
    synopsis:
      "Four people recount different versions of the story of a man's murder and the rape of his wife.",
    posterUrl: tmdbPoster('ijWibsAU1iBcCD8tuIZfTmDzMVE'),
    genres: ['Crime', 'Drama', 'Mystery'],
    directors: ['Akira Kurosawa'],
    writers: ['Akira Kurosawa', 'Shinobu Hashimoto'],
    cast: [
      'Toshirō Mifune',
      'Machiko Kyō',
      'Takashi Shimura',
      'Masayuki Mori',
      'Minoru Chiaki',
      'Kichijirō Ueda',
    ],
  },
  // https://www.themoviedb.org/movie/522
  {
    title: 'Ed Wood',
    releaseDate: '1994-09-28',
    runtimeMinutes: 127,
    synopsis:
      'The mostly true story of the legendary "worst director of all time", who, with the help of his strange friends, filmed countless B-movies without ever becoming famous or successful.',
    posterUrl: tmdbPoster('n8SrO3WbyuY2b6KazogqbQF348C'),
    genres: ['Comedy', 'Drama', 'History'],
    directors: ['Tim Burton'],
    writers: ['Scott Alexander', 'Larry Karaszewski'],
    cast: [
      'Johnny Depp',
      'Martin Landau',
      'Sarah Jessica Parker',
      'Patricia Arquette',
      'Jeffrey Jones',
      'G.D. Spradlin',
    ],
  },
  // https://www.themoviedb.org/movie/79
  {
    title: 'Hero',
    releaseDate: '2002-12-19',
    runtimeMinutes: 99,
    synopsis:
      "During China's Warring States period, a district prefect arrives at the palace of Qin Shi Huang, claiming to have killed the three assassins who had made an attempt on the king's life three years ago.",
    posterUrl: tmdbPoster('vxgZto2Cz7ILHAlmRXt50I2brB2'),
    genres: ['Drama', 'Adventure', 'Action', 'History'],
    directors: ['Zhang Yimou'],
    writers: ['Zhang Yimou', 'Feng Li', 'Wang Bin'],
    cast: [
      'Jet Li',
      'Tony Leung Chiu-wai',
      'Maggie Cheung',
      'Donnie Yen',
      'Zhang Ziyi',
      'Chen Daoming',
    ],
  },
  // https://www.themoviedb.org/movie/1398
  {
    title: 'Stalker',
    releaseDate: '1979-05-25',
    runtimeMinutes: 162,
    synopsis:
      'Near a gray and unnamed city is the Zone, a place guarded by barbed wire and soldiers, and where the normal laws of physics are victim to frequent anomalies. A stalker guides two men into the Zone, specifically to an area in which deep-seated desires are granted.',
    posterUrl: tmdbPoster('1qhOyf5C4s9ZdvY8d5JDx9DFMeT'),
    genres: ['Science Fiction', 'Drama'],
    directors: ['Andrei Tarkovsky'],
    writers: ['Andrei Tarkovsky', 'Arkadiy Strugatskiy', 'Boris Strugatskiy'],
    cast: [
      'Alisa Freyndlikh',
      'Aleksandr Kaydanovskiy',
      'Anatoliy Solonitsyn',
      'Mykola Hrynko',
      'Natalya Abramova',
      'Faime Jurno',
    ],
  },
  // https://www.themoviedb.org/movie/783
  {
    title: 'Gandhi',
    releaseDate: '1982-12-01',
    runtimeMinutes: 192,
    synopsis:
      "In the early years of the 20th century, Mohandas K. Gandhi, a British-trained lawyer, forsakes all worldly possessions to take up the cause of Indian independence. Faced with armed resistance from the British government, Gandhi adopts a policy of 'passive resistance', endeavouring to win freedom for his people without resorting to bloodshed.",
    posterUrl: tmdbPoster('rOXftt7SluxskrFrvU7qFJa5zeN'),
    genres: ['Drama', 'History'],
    directors: ['Richard Attenborough'],
    writers: ['John Briley'],
    cast: [
      'Ben Kingsley',
      'Candice Bergen',
      'Edward Fox',
      'John Gielgud',
      'Trevor Howard',
      'John Mills',
    ],
  },
  // https://www.themoviedb.org/movie/667
  {
    title: 'You Only Live Twice',
    releaseDate: '1967-06-13',
    runtimeMinutes: 117,
    synopsis:
      'A mysterious spacecraft captures Russian and American space capsules and brings the two superpowers to the brink of war. James Bond investigates the case in Japan and comes face to face with his archenemy Blofeld.',
    posterUrl: tmdbPoster('9mvNd43HgTkbfPwX6MF6EoPIMIa'),
    genres: ['Action', 'Thriller', 'Adventure'],
    directors: ['Lewis Gilbert'],
    writers: ['Roald Dahl', 'Harold Jack Bloom'],
    cast: [
      'Sean Connery',
      'Akiko Wakabayashi',
      'Mie Hama',
      'Tetsuro Tamba',
      'Teru Shimada',
      'Karin Dor',
    ],
  },
  // https://www.themoviedb.org/movie/473
  {
    title: 'Pi',
    releaseDate: '1998-07-10',
    runtimeMinutes: 84,
    synopsis:
      'A mathematical genius discovers a link between numbers and reality, and thus believes he can predict the future.',
    posterUrl: tmdbPoster('fJA22FjlAW8rzrOw9Mwanl6oTc9'),
    genres: ['Mystery', 'Drama', 'Thriller'],
    directors: ['Darren Aronofsky'],
    writers: ['Darren Aronofsky'],
    cast: [
      'Sean Gullette',
      'Mark Margolis',
      'Ben Shenkman',
      'Pamela Hart',
      'Stephen Pearlman',
      'Samia Shoaib',
    ],
  },
  // https://www.themoviedb.org/movie/837
  {
    title: 'Videodrome',
    releaseDate: '1983-02-04',
    runtimeMinutes: 88,
    synopsis:
      'As the president of a trashy TV channel, Max Renn is desperate for new programming to attract viewers. When he happens upon "Videodrome," a TV show dedicated to gratuitous torture and punishment, Max sees a potential hit and broadcasts the show on his channel. However, after his girlfriend auditions for the show and never returns, Max investigates the truth behind Videodrome and discovers that the graphic violence may not be as fake as he thought.',
    posterUrl: tmdbPoster('qqqkiZSU9EBGZ1KiDmfn07S7qvv'),
    genres: ['Horror', 'Science Fiction', 'Mystery'],
    directors: ['David Cronenberg'],
    writers: ['David Cronenberg'],
    cast: [
      'James Woods',
      'Debbie Harry',
      'Sonja Smits',
      'Peter Dvorsky',
      'Leslie Carlson',
      'Jack Creley',
    ],
  },
  // https://www.themoviedb.org/movie/642
  {
    title: 'Butch Cassidy and the Sundance Kid',
    releaseDate: '1969-09-23',
    runtimeMinutes: 111,
    synopsis:
      'As the west rapidly becomes civilized, a pair of outlaws in 1890s Wyoming find themselves pursued by a posse and decide to flee to South America in hopes of evading the law.',
    posterUrl: tmdbPoster('gFmmykF1Ym3OGzENo50nZQaD1dx'),
    genres: ['Western'],
    directors: ['George Roy Hill'],
    writers: ['William Goldman'],
    cast: [
      'Paul Newman',
      'Robert Redford',
      'Katharine Ross',
      'Strother Martin',
      'Henry Jones',
      'Jeff Corey',
    ],
  },
  // https://www.themoviedb.org/movie/832
  {
    title: 'M',
    releaseDate: '1931-05-11',
    runtimeMinutes: 110,
    synopsis:
      "In this classic German thriller, Hans Beckert, a serial killer who preys on children, becomes the focus of a massive Berlin police manhunt. Beckert's heinous crimes are so repellant and disruptive to city life that he is even targeted by others in the seedy underworld network. With both cops and criminals in pursuit, the murderer soon realizes that people are on his trail, sending him into a tense, panicked attempt to escape justice.",
    posterUrl: tmdbPoster('bTdZk3q2DWpBRnLiaaItKFWOVhI'),
    genres: ['Drama', 'Thriller', 'Crime'],
    directors: ['Fritz Lang'],
    writers: ['Fritz Lang', 'Thea von Harbou'],
    cast: [
      'Peter Lorre',
      'Ellen Widmann',
      'Inge Landgut',
      'Otto Wernicke',
      'Theodor Loos',
      'Gustaf Gründgens',
    ],
  },
  // https://www.themoviedb.org/movie/901
  {
    title: 'City Lights',
    releaseDate: '1931-02-06',
    runtimeMinutes: 87,
    synopsis:
      "A tramp falls in love with a beautiful blind flower girl. His on-and-off friendship with a wealthy man allows him to be the girl's benefactor and suitor.",
    posterUrl: tmdbPoster('ugmakEL5y294I5bXgiBqApuZpwc'),
    genres: ['Comedy', 'Drama', 'Romance'],
    directors: ['Charlie Chaplin'],
    writers: ['Charlie Chaplin', 'Harry Carr', 'Harry Crocker'],
    cast: [
      'Charlie Chaplin',
      'Virginia Cherrill',
      'Florence Lee',
      'Harry Myers',
      'Al Ernest Garcia',
      'Hank Mann',
    ],
  },
  // https://www.themoviedb.org/movie/653
  {
    title: 'Nosferatu',
    releaseDate: '1922-02-16',
    runtimeMinutes: 89,
    synopsis:
      'The mysterious Count Orlok summons a happily married real estate agent to his castle, located up in the Transylvanian mountains, to finalise a terrifying deal.',
    posterUrl: tmdbPoster('zv7J85D8CC9qYagAEhPM63CIG6j'),
    genres: ['Horror', 'Fantasy'],
    directors: ['F. W. Murnau'],
    writers: ['Henrik Galeen'],
    cast: [
      'Max Schreck',
      'Gustav von Wangenheim',
      'Greta Schröder',
      'Georg H. Schnell',
      'Ruth Landshoff',
      'Gustav Botz',
    ],
  },
  // https://www.themoviedb.org/movie/623
  {
    title: 'A Fish Called Wanda',
    releaseDate: '1988-07-15',
    runtimeMinutes: 109,
    synopsis:
      'While a diamond advocate attempts to steal a collection of diamonds, troubles arise when he realises he’s not the only one after the collection.',
    posterUrl: tmdbPoster('hkSGFNVfEEUXFCxRZDITFHVhUlu'),
    genres: ['Comedy', 'Crime'],
    directors: ['Charles Crichton'],
    writers: ['John Cleese'],
    cast: [
      'Jamie Lee Curtis',
      'John Cleese',
      'Kevin Kline',
      'Michael Palin',
      'Maria Aitken',
      'Tom Georgeson',
    ],
  },
  // https://www.themoviedb.org/movie/820
  {
    title: 'JFK',
    releaseDate: '1991-12-20',
    runtimeMinutes: 189,
    synopsis:
      'Follows the investigation into the assassination of President John F. Kennedy led by New Orleans district attorney Jim Garrison.',
    posterUrl: tmdbPoster('r0VWVTYlqdRCK5ZoOdNnHdqM2gt'),
    genres: ['Drama', 'Thriller', 'History'],
    directors: ['Oliver Stone'],
    writers: ['Oliver Stone', 'Zachary Sklar'],
    cast: [
      'Kevin Costner',
      'Tommy Lee Jones',
      'Gary Oldman',
      'Kevin Bacon',
      'Michael Rooker',
      'Jack Lemmon',
    ],
  },
  // https://www.themoviedb.org/movie/1646
  {
    title: 'Freedom Writers',
    releaseDate: '2007-01-05',
    runtimeMinutes: 123,
    synopsis:
      'A young teacher inspires her class of at-risk students to learn tolerance, apply themselves, and pursue education beyond high school.',
    posterUrl: tmdbPoster('81AdeUQT99N0xPg3j6RVh0YGOTk'),
    genres: ['Crime', 'Drama'],
    directors: ['Richard LaGravenese'],
    writers: ['Richard LaGravenese'],
    cast: [
      'Hilary Swank',
      'Patrick Dempsey',
      'Scott Glenn',
      'Imelda Staunton',
      'April Hernandez Castillo',
      'Mario',
    ],
  },
  // https://www.themoviedb.org/movie/921
  {
    title: 'Cinderella Man',
    releaseDate: '2005-06-02',
    runtimeMinutes: 144,
    synopsis:
      'The true story of boxer Jim Braddock who, following his retirement in the 1930s, makes a surprise comeback in order to lift his family out of poverty.',
    posterUrl: tmdbPoster('wkeOjIcpuqLMW4GnVowlM9VI0JE'),
    genres: ['Romance', 'Drama', 'History'],
    directors: ['Ron Howard'],
    writers: ['Cliff Hollingsworth', 'Akiva Goldsman'],
    cast: [
      'Russell Crowe',
      'Renée Zellweger',
      'Paul Giamatti',
      'Craig Bierko',
      'Paddy Considine',
      'Bruce McGill',
    ],
  },
  // https://www.themoviedb.org/movie/794
  {
    title: 'The Omen',
    releaseDate: '1976-06-25',
    runtimeMinutes: 111,
    synopsis:
      'Immediately after their miscarriage, the US diplomat Robert Thorn adopts the newborn Damien without the knowledge of his wife. Yet what he doesn’t know is that their new son is the son of the devil.',
    posterUrl: tmdbPoster('mDcjjEu1fMNmsXi4l4D8IftlTix'),
    genres: ['Horror', 'Thriller'],
    directors: ['Richard Donner'],
    writers: ['David Seltzer'],
    cast: [
      'Gregory Peck',
      'Lee Remick',
      'David Warner',
      'Billie Whitelaw',
      'Harvey Stephens',
      'Patrick Troughton',
    ],
  },
  // https://www.themoviedb.org/movie/1248
  {
    title: 'Hannibal Rising',
    releaseDate: '2007-02-06',
    runtimeMinutes: 121,
    synopsis:
      'The story of the early, murderous roots of the cannibalistic killer, Hannibal Lecter – from his hard-scrabble Lithuanian childhood, where he witnesses the repulsive lengths to which hungry soldiers will go to satiate themselves, through his sojourn in France, where as a medical student he hones his appetite for the kill.',
    posterUrl: tmdbPoster('7FTDMQoac0uqJUquZk4KenDzLMZ'),
    genres: ['Crime', 'Thriller', 'Horror'],
    directors: ['Peter Webber'],
    writers: ['Thomas Harris'],
    cast: [
      'Gaspard Ulliel',
      'Aaran Thomas',
      'Gong Li',
      'Dominic West',
      'Rhys Ifans',
      'Richard Brake',
    ],
  },
  // https://www.themoviedb.org/movie/797
  {
    title: 'Persona',
    releaseDate: '1966-10-18',
    runtimeMinutes: 85,
    synopsis:
      'A young nurse, Alma, is put in charge of Elisabeth Vogler: an actress who is seemingly healthy in all respects, but will not talk. As they spend time together, Alma speaks to Elisabeth constantly, never receiving any answer.',
    posterUrl: tmdbPoster('fVA5hTcAOlW2LJyelViQfWHxUcx'),
    genres: ['Drama'],
    directors: ['Ingmar Bergman'],
    writers: ['Ingmar Bergman'],
    cast: [
      'Bibi Andersson',
      'Liv Ullmann',
      'Margaretha Krook',
      'Gunnar Björnstrand',
      'Jörgen Lindström',
    ],
  },
  // https://www.themoviedb.org/movie/245
  {
    title: 'About a Boy',
    releaseDate: '2002-04-26',
    runtimeMinutes: 101,
    synopsis:
      "Will Freeman is a good-looking, smooth-talking bachelor whose primary goal in life is avoiding any kind of responsibility. But when he invents an imaginary son in order to meet attractive single moms, Will gets a hilarious lesson about life from a bright, but hopelessly geeky 12-year-old named Marcus. Now, as Will struggles to teach Marcus the art of being cool, Marcus teaches Will that you're never too old to grow up.",
    posterUrl: tmdbPoster('qoZ1bD0q9EFqcNiEYbEigsRcNCt'),
    genres: ['Drama', 'Comedy', 'Romance'],
    directors: ['Paul Weitz', 'Chris Weitz'],
    writers: ['Paul Weitz', 'Chris Weitz', 'Peter Hedges'],
    cast: [
      'Hugh Grant',
      'Nicholas Hoult',
      'Toni Collette',
      'Rachel Weisz',
      'Natalia Tena',
      'Victoria Smurfit',
    ],
  },
  // https://www.themoviedb.org/movie/1428
  {
    title: 'Once Upon a Time in Mexico',
    releaseDate: '2003-09-11',
    runtimeMinutes: 102,
    synopsis:
      "A corrupt CIA agent Sands hires hitman El Mariachi to assassinate a Mexican general hired by a drug kingpin attempting a coup d'état of the President of Mexico.",
    posterUrl: tmdbPoster('ETUpGxmLocsfER8GT8w5sOkRG0'),
    genres: ['Action', 'Crime', 'Thriller', 'Western'],
    directors: ['Robert Rodriguez'],
    writers: ['Robert Rodriguez'],
    cast: [
      'Antonio Banderas',
      'Johnny Depp',
      'Cheech Marin',
      'Salma Hayek Pinault',
      'Mickey Rourke',
      'Willem Dafoe',
    ],
  },
  // https://www.themoviedb.org/movie/409
  {
    title: 'The English Patient',
    releaseDate: '1996-11-14',
    runtimeMinutes: 162,
    synopsis:
      'In the 1930s, Count Almásy is a Hungarian map maker employed by the Royal Geographical Society to chart the vast expanses of the Sahara Desert along with several other prominent explorers. As World War II unfolds, Almásy enters into a world of love, betrayal, and politics.',
    posterUrl: tmdbPoster('8eHHqMg8qEYtVw8LQLygsHXSR2q'),
    genres: ['Drama', 'Romance', 'War'],
    directors: ['Anthony Minghella'],
    writers: ['Anthony Minghella'],
    cast: [
      'Ralph Fiennes',
      'Juliette Binoche',
      'Willem Dafoe',
      'Kristin Scott Thomas',
      'Naveen Andrews',
      'Colin Firth',
    ],
  },
  // https://www.themoviedb.org/movie/967
  {
    title: 'Spartacus',
    releaseDate: '1960-10-13',
    runtimeMinutes: 197,
    synopsis:
      'The rebellious Thracian Spartacus, born and raised a slave, is sold to Gladiator trainer Batiatus. After weeks of being trained to kill for the arena, Spartacus turns on his owners and leads the other slaves in rebellion. As the rebels move from town to town, their numbers swell as escaped slaves join their ranks. Under the leadership of Spartacus, they make their way to southern Italy, where they will cross the sea and return to their homes.',
    posterUrl: tmdbPoster('r0Fgg1GyZgzokaiw2HFQv3oPaL2'),
    genres: ['History', 'Drama', 'Adventure'],
    directors: ['Stanley Kubrick'],
    writers: ['Peter Ustinov', 'Dalton Trumbo'],
    cast: [
      'Kirk Douglas',
      'Laurence Olivier',
      'Jean Simmons',
      'Charles Laughton',
      'Peter Ustinov',
      'John Gavin',
    ],
  },
  // https://www.themoviedb.org/movie/681
  {
    title: 'Diamonds Are Forever',
    releaseDate: '1971-12-14',
    runtimeMinutes: 120,
    synopsis:
      "Diamonds are stolen only to be sold again in the international market. James Bond infiltrates a smuggling mission to find out who's guilty. The mission takes him to Las Vegas where Bond meets his archenemy Blofeld.",
    posterUrl: tmdbPoster('ooDT0eKrWCxJCsn9JehPkD0QYNj'),
    genres: ['Action', 'Thriller'],
    directors: ['Guy Hamilton'],
    writers: ['Tom Mankiewicz', 'Richard Maibaum'],
    cast: [
      'Sean Connery',
      'Jill St. John',
      'Charles Gray',
      'Lana Wood',
      'Jimmy Dean',
      'Bruce Cabot',
    ],
  },
  // https://www.themoviedb.org/movie/826
  {
    title: 'The Bridge on the River Kwai',
    releaseDate: '1957-10-11',
    runtimeMinutes: 162,
    synopsis:
      "The classic story of English POWs in Burma forced to build a bridge to aid the war effort of their Japanese captors. British and American intelligence officers conspire to blow up the structure, but Col. Nicholson, the commander who supervised the bridge's construction, has acquired a sense of pride in his creation and tries to foil their plans.",
    posterUrl: tmdbPoster('7paXMt2e3Tr5dLmEZOGgFEn2Vo7'),
    genres: ['Drama', 'History', 'War'],
    directors: ['David Lean'],
    writers: ['Carl Foreman', 'Michael Wilson'],
    cast: [
      'William Holden',
      'Alec Guinness',
      'Jack Hawkins',
      'Sessue Hayakawa',
      'James Donald',
      'Geoffrey Horne',
    ],
  },
  // https://www.themoviedb.org/movie/688
  {
    title: 'The Bridges of Madison County',
    releaseDate: '1995-06-02',
    runtimeMinutes: 135,
    synopsis:
      'Photographer Robert Kincaid wanders into the life of housewife Francesca Johnson for four days in the 1960s.',
    posterUrl: tmdbPoster('aCBrhOQjhG397GLkEZ49zReQEKX'),
    genres: ['Drama', 'Romance'],
    directors: ['Clint Eastwood'],
    writers: ['Richard LaGravenese'],
    cast: [
      'Meryl Streep',
      'Clint Eastwood',
      'Annie Corley',
      'Victor Slezak',
      'Jim Haynie',
      'Sarah Zahn',
    ],
  },
  // https://www.themoviedb.org/movie/1523
  {
    title: 'The Last King of Scotland',
    releaseDate: '2006-09-27',
    runtimeMinutes: 123,
    synopsis:
      "Young Scottish doctor, Nicholas Garrigan decides it's time for an adventure after he finishes his formal education, so he decides to try his luck in Uganda, and arrives during the downfall of President Obote. General Idi Amin comes to power and asks Garrigan to become his personal doctor.",
    posterUrl: tmdbPoster('n1CgN2mS7RSxHhv2R1DdisYDvT6'),
    genres: ['Drama'],
    directors: ['Kevin Macdonald'],
    writers: ['Jeremy Brock', 'Peter Morgan'],
    cast: [
      'Forest Whitaker',
      'James McAvoy',
      'Simon McBurney',
      'Gillian Anderson',
      'Kerry Washington',
      'David Oyelowo',
    ],
  },
  // https://www.themoviedb.org/movie/1535
  {
    title: 'Spy Game',
    releaseDate: '2001-11-18',
    runtimeMinutes: 126,
    synopsis:
      'On the day of his retirement, a veteran CIA agent learns that his former protégé has been arrested in China, is sentenced to die the next morning in Beijing, and that the CIA is considering letting that happen to avoid an international scandal.',
    posterUrl: tmdbPoster('6y8M1rxjKofQCRKKe6xeV91K2Fc'),
    genres: ['Action', 'Crime', 'Thriller'],
    directors: ['Tony Scott'],
    writers: ['Michael Frost Beckner', 'David Arata'],
    cast: [
      'Robert Redford',
      'Brad Pitt',
      'Catherine McCormack',
      'Stephen Dillane',
      'Larry Bryggman',
      'Marianne Jean-Baptiste',
    ],
  },
  // https://www.themoviedb.org/movie/795
  {
    title: 'City of Angels',
    releaseDate: '1998-04-10',
    runtimeMinutes: 114,
    synopsis:
      'When a guardian angel – who invisibly watches over the citizens of Los Angeles – becomes captivated by a strong-willed heart surgeon, he ponders trading in his pure, otherworldly existence for a mortal life with his beloved. The couple embarks on a tender but forbidden romance spanning heaven and Earth.',
    posterUrl: tmdbPoster('iuzxpUjHsbQJXV3kB9ZAdCimM60'),
    genres: ['Romance', 'Drama', 'Fantasy'],
    directors: ['Brad Silberling'],
    writers: ['Dana Stevens'],
    cast: [
      'Nicolas Cage',
      'Meg Ryan',
      'Dennis Franz',
      'Andre Braugher',
      'Colm Feore',
      'Robin Bartlett',
    ],
  },
  // https://www.themoviedb.org/movie/378
  {
    title: 'Raising Arizona',
    releaseDate: '1987-03-13',
    runtimeMinutes: 94,
    synopsis:
      'When a childless couple—an ex-con and an ex-cop—take one of a wealthy family’s quintuplets to raise as their own, their lives grow more complicated than anticipated.',
    posterUrl: tmdbPoster('niKyjOqiB4XVl0BqgKTHIlHOCeF'),
    genres: ['Comedy', 'Crime'],
    directors: ['Joel Coen'],
    writers: ['Joel Coen', 'Ethan Coen'],
    cast: [
      'Nicolas Cage',
      'Holly Hunter',
      'Trey Wilson',
      'John Goodman',
      'William Forsythe',
      'Sam McMurray',
    ],
  },
  // https://www.themoviedb.org/movie/147
  {
    title: 'The 400 Blows',
    releaseDate: '1959-06-03',
    runtimeMinutes: 99,
    synopsis:
      'For young Parisian boy Antoine Doinel, life is one difficult situation after another. Surrounded by inconsiderate adults, including his neglectful parents, Antoine spends his days with his best friend, Rene, trying to plan for a better life. When one of their schemes goes awry, Antoine ends up in trouble with the law, leading to even more conflicts with unsympathetic authority figures.',
    posterUrl: tmdbPoster('12PuU23kkDLvTd0nb8hMlE3oShB'),
    genres: ['Drama'],
    directors: ['François Truffaut'],
    writers: ['François Truffaut'],
    cast: [
      'Jean-Pierre Léaud',
      'Claire Maurier',
      'Albert Rémy',
      'Georges Flamant',
      'Patrick Auffay',
      'Robert Beauvais',
    ],
  },
  // https://www.themoviedb.org/movie/503
  {
    title: 'Poseidon',
    releaseDate: '2006-05-03',
    runtimeMinutes: 98,
    synopsis:
      'A packed cruise ship traveling the Atlantic is hit and overturned by a massive wave, compelling the passengers to begin a dramatic fight for their lives.',
    posterUrl: tmdbPoster('fDPdjGc8SUEDWfTwMaZlCE6NSi3'),
    genres: ['Adventure', 'Action', 'Drama', 'Thriller'],
    directors: ['Wolfgang Petersen'],
    writers: ['Mark Protosevich'],
    cast: [
      'Josh Lucas',
      'Kurt Russell',
      'Jacinda Barrett',
      'Richard Dreyfuss',
      'Emmy Rossum',
      'Mía Maestro',
    ],
  },
  // https://www.themoviedb.org/movie/1547
  {
    title: 'The Lost Boys',
    releaseDate: '1987-07-31',
    runtimeMinutes: 97,
    synopsis:
      'When an unsuspecting town newcomer is drawn to local blood fiends, the Frog brothers and other unlikely heroes gear up to rescue him.',
    posterUrl: tmdbPoster('nH1lvyQvfbL5GKScTtT6zkIvDEn'),
    genres: ['Horror', 'Comedy', 'Thriller', 'Drama', 'Romance'],
    directors: ['Joel Schumacher'],
    writers: ['James Jeremias', 'Jan Fischer', 'Jeffrey Boam'],
    cast: [
      'Jason Patric',
      'Corey Haim',
      'Dianne Wiest',
      'Barnard Hughes',
      'Edward Herrmann',
      'Kiefer Sutherland',
    ],
  },
  // https://www.themoviedb.org/movie/923
  {
    title: 'Dawn of the Dead',
    releaseDate: '1978-09-02',
    runtimeMinutes: 127,
    synopsis:
      'During an ever-growing epidemic of zombies that have risen from the dead, two Philadelphia SWAT team members, a traffic reporter, and his television-executive girlfriend seek refuge in a secluded shopping mall.',
    posterUrl: tmdbPoster('70MY8H0bLMvXf8ED2SgVMPhDVVM'),
    genres: ['Horror', 'Science Fiction'],
    directors: ['George A. Romero'],
    writers: ['George A. Romero'],
    cast: [
      'David Emge',
      'Ken Foree',
      'Scott H. Reiniger',
      'Gaylen Ross',
      'David Crawford',
      'David Early',
    ],
  },
  // https://www.themoviedb.org/movie/1251
  {
    title: 'Letters from Iwo Jima',
    releaseDate: '2006-12-09',
    runtimeMinutes: 141,
    synopsis:
      'The story of the battle of Iwo Jima between the United States and Imperial Japan during World War II, as told from the perspective of the Japanese who fought it.',
    posterUrl: tmdbPoster('kZokxQtzMPURvijWYFuvh1fAvnv'),
    genres: ['Action', 'Drama', 'War'],
    directors: ['Clint Eastwood'],
    writers: ['Iris Yamashita'],
    cast: [
      'Ken Watanabe',
      'Kazunari Ninomiya',
      'Tsuyoshi Ihara',
      'Ryo Kase',
      'Shido Nakamura',
      'Hiroshi Watanabe',
    ],
  },
  // https://www.themoviedb.org/movie/253
  {
    title: 'Live and Let Die',
    releaseDate: '1973-06-27',
    runtimeMinutes: 121,
    synopsis:
      'James Bond must investigate a mysterious murder case of a British agent in New Orleans. Soon he finds himself up against a gangster boss named Mr. Big.',
    posterUrl: tmdbPoster('39qkrjqMZs6utwNmihVImC3ghas'),
    genres: ['Adventure', 'Action', 'Thriller'],
    directors: ['Guy Hamilton'],
    writers: ['Tom Mankiewicz'],
    cast: [
      'Roger Moore',
      'Yaphet Kotto',
      'Jane Seymour',
      'Clifton James',
      'Julius Harris',
      'Geoffrey Holder',
    ],
  },
  // https://www.themoviedb.org/movie/864
  {
    title: 'Cool Runnings',
    releaseDate: '1993-10-01',
    runtimeMinutes: 98,
    synopsis:
      'When a Jamaican sprinter is disqualified from the Olympic Games, he enlists the help of a dishonored coach to start the first Jamaican bobsled team.',
    posterUrl: tmdbPoster('6fXuGEb7EqGmAeUodxm7l5ELPZ'),
    genres: ['Comedy', 'Adventure', 'Drama'],
    directors: ['Jon Turteltaub'],
    writers: ['Lynn Siefert', 'Michael Goldberg', 'Tommy Swerdlow'],
    cast: [
      'Leon',
      'Doug E. Doug',
      'Rawle D. Lewis',
      'Malik Yoba',
      'John Candy',
      'Raymond J. Barry',
    ],
  },
  // https://www.themoviedb.org/movie/203
  {
    title: 'Mean Streets',
    releaseDate: '1973-10-14',
    runtimeMinutes: 112,
    synopsis:
      'A small-time hood must choose from among love, friendship and the chance to rise within the mob.',
    posterUrl: tmdbPoster('9msfwOeGc9uL1iRRTBdEf15XonC'),
    genres: ['Drama', 'Crime'],
    directors: ['Martin Scorsese'],
    writers: ['Martin Scorsese', 'Mardik Martin'],
    cast: [
      'Robert De Niro',
      'Harvey Keitel',
      'David Proval',
      'Amy Robinson',
      'Richard Romanus',
      'Cesare Danova',
    ],
  },
  // https://www.themoviedb.org/movie/682
  {
    title: 'The Man with the Golden Gun',
    releaseDate: '1974-12-04',
    runtimeMinutes: 125,
    synopsis:
      "Cool government operative James Bond searches for a stolen invention that can turn the sun's heat into a destructive weapon. He soon crosses paths with the menacing Francisco Scaramanga, a hitman so skilled he has a seven-figure working fee. Bond then joins forces with the swimsuit-clad Mary Goodnight, and together they track Scaramanga to a Thai tropical isle hideout where the killer-for-hire lures the slick spy into a deadly maze for a final duel.",
    posterUrl: tmdbPoster('xVkbKwGnBVNQ122GN5bCTMyPbWz'),
    genres: ['Adventure', 'Action', 'Thriller'],
    directors: ['Guy Hamilton'],
    writers: ['Tom Mankiewicz', 'Richard Maibaum'],
    cast: [
      'Roger Moore',
      'Christopher Lee',
      'Britt Ekland',
      'Maud Adams',
      'Hervé Villechaize',
      'Clifton James',
    ],
  },
  // https://www.themoviedb.org/movie/804
  {
    title: 'Roman Holiday',
    releaseDate: '1953-08-26',
    runtimeMinutes: 119,
    synopsis:
      "Overwhelmed by her suffocating schedule, touring European princess Ann takes off for a night while in Rome. When a sedative she took from her doctor kicks in, however, she falls asleep on a park bench and is found by an American reporter, Joe Bradley, who takes her back to his apartment for safety. At work the next morning, Joe finds out Ann's regal identity and bets his editor he can get exclusive interview with her, but romance soon gets in the way.",
    posterUrl: tmdbPoster('8lI9dmz1RH20FAqltkGelY1v4BE'),
    genres: ['Romance', 'Comedy', 'Drama'],
    directors: ['William Wyler'],
    writers: ['Dalton Trumbo', 'Ian McLellan Hunter', 'John Dighton'],
    cast: [
      'Gregory Peck',
      'Audrey Hepburn',
      'Eddie Albert',
      'Hartley Power',
      'Harcourt Williams',
      'Margaret Rawlings',
    ],
  },
  // https://www.themoviedb.org/movie/650
  {
    title: 'Boyz n the Hood',
    releaseDate: '1991-07-12',
    runtimeMinutes: 112,
    synopsis:
      "In the middle of the Los Angeles ghetto, drugs, robberies and shootings dominate everyday life. During these times, Furious tries to raise his son Tre to be a decent person. Tre's friends, on the other hand, have little regard for the law and drag the entire neighborhood into a street war...",
    posterUrl: tmdbPoster('v4ox4aSCNT5vyLXl4Q71JiWwCXW'),
    genres: ['Crime', 'Drama'],
    directors: ['John Singleton'],
    writers: ['John Singleton'],
    cast: [
      'Cuba Gooding Jr.',
      'Laurence Fishburne',
      'Ice Cube',
      'Morris Chestnut',
      'Angela Bassett',
      'Nia Long',
    ],
  },
  // https://www.themoviedb.org/movie/802
  {
    title: 'Lolita',
    releaseDate: '1962-06-13',
    runtimeMinutes: 154,
    synopsis:
      "Humbert Humbert is a middle-aged British novelist who is both appalled by and attracted to the vulgarity of American culture. When he comes to stay at the boarding house run by Charlotte Haze, he soon becomes obsessed with Lolita, the woman's teenaged daughter.",
    posterUrl: tmdbPoster('8Puqbeh0D95DpXFWep1rmH78btu'),
    genres: ['Drama'],
    directors: ['Stanley Kubrick'],
    writers: ['Vladimir Nabokov'],
    cast: [
      'James Mason',
      'Shelley Winters',
      'Sue Lyon',
      'Gary Cockrell',
      'Jerry Stovin',
      'Diana Decker',
    ],
  },
  // https://www.themoviedb.org/movie/691
  {
    title: 'The Spy Who Loved Me',
    releaseDate: '1977-07-07',
    runtimeMinutes: 125,
    synopsis:
      'Russian and British submarines with nuclear missiles on board both vanish from sight without a trace. England and Russia both blame each other as James Bond tries to solve the riddle of the disappearing ships. But the KGB also has an agent on the case.',
    posterUrl: tmdbPoster('3ZxHKFxMYvAko680DsRgAZKWcLi'),
    genres: ['Adventure', 'Action', 'Thriller'],
    directors: ['Lewis Gilbert'],
    writers: ['Richard Maibaum', 'Christopher Wood'],
    cast: [
      'Roger Moore',
      'Barbara Bach',
      'Curd Jürgens',
      'Richard Kiel',
      'Caroline Munro',
      'Walter Gotell',
    ],
  },
  // https://www.themoviedb.org/movie/655
  {
    title: 'Paris, Texas',
    releaseDate: '1984-07-16',
    runtimeMinutes: 145,
    synopsis:
      'A man wanders out of the desert not knowing who he is. His brother finds him, and helps to pull his memory back of the life he led before he walked out on his family and disappeared four years earlier.',
    posterUrl: tmdbPoster('sP27Qm4THyRZyHjHYMfIDtJP6YE'),
    genres: ['Drama'],
    directors: ['Wim Wenders'],
    writers: ['Sam Shepard', 'L.M. Kit Carson'],
    cast: [
      'Harry Dean Stanton',
      'Nastassja Kinski',
      'Dean Stockwell',
      'Hunter Carson',
      'Aurore Clément',
      'Bernhard Wicki',
    ],
  },
  // https://www.themoviedb.org/movie/698
  {
    title: 'Moonraker',
    releaseDate: '1979-06-26',
    runtimeMinutes: 126,
    synopsis:
      "After Drax Industries' Moonraker space shuttle is hijacked, secret agent James Bond is assigned to investigate, traveling to California to meet the company's owner, the mysterious Hugo Drax. With the help of scientist Dr. Holly Goodhead, Bond soon uncovers Drax's nefarious plans for humanity, all the while fending off an old nemesis, Jaws, and venturing to Venice, Rio, the Amazon...and even outer space.",
    posterUrl: tmdbPoster('6LrJdXNmu5uHOVALZxVYd44Lva0'),
    genres: ['Action', 'Adventure', 'Thriller', 'Science Fiction'],
    directors: ['Lewis Gilbert'],
    writers: ['Gerry Anderson', 'Christopher Wood'],
    cast: [
      'Roger Moore',
      'Lois Chiles',
      'Michael Lonsdale',
      'Richard Kiel',
      'Corinne Cléry',
      'Bernard Lee',
    ],
  },
  // https://www.themoviedb.org/movie/1677
  {
    title: 'Ray',
    releaseDate: '2004-10-29',
    runtimeMinutes: 152,
    synopsis:
      'Born on a sharecropping plantation in Northern Florida, Ray Charles went blind at seven. Inspired by a fiercely independent mom who insisted he make his own way, He found his calling and his gift behind a piano keyboard. Touring across the Southern musical circuit, the soulful singer gained a reputation and then exploded with worldwide fame when he pioneered coupling gospel and country together.',
    posterUrl: tmdbPoster('tSPC7sO2XYNL9QcMmK88tuUALL5'),
    genres: ['Drama', 'Music'],
    directors: ['Taylor Hackford'],
    writers: ['James L. White'],
    cast: [
      'Jamie Foxx',
      'Kerry Washington',
      'Regina King',
      'Harry Lennix',
      'Clifton Powell',
      'Bokeem Woodbine',
    ],
  },
  // https://www.themoviedb.org/movie/700
  {
    title: 'Octopussy',
    releaseDate: '1983-06-05',
    runtimeMinutes: 131,
    synopsis:
      'James Bond is sent to investigate after a fellow “00” agent is found dead with a priceless Indian Fabergé egg. Bond follows the mystery and uncovers a smuggling scandal and a Russian General who wants to provoke a new World War.',
    posterUrl: tmdbPoster('yoosZitM9igSk3Sd0sBXIhKlAh1'),
    genres: ['Adventure', 'Action', 'Thriller'],
    directors: ['John Glen'],
    writers: ['Michael G. Wilson', 'George MacDonald Fraser', 'Richard Maibaum'],
    cast: [
      'Roger Moore',
      'Maud Adams',
      'Louis Jourdan',
      'Kristina Wayborn',
      'Kabir Bedi',
      'Steven Berkoff',
    ],
  },
  // https://www.themoviedb.org/movie/1691
  {
    title: 'Hostel: Part II',
    releaseDate: '2007-06-07',
    runtimeMinutes: 93,
    synopsis:
      'Three American college students studying abroad are lured to a Slovakian hostel, and discover the grim reality behind it.',
    posterUrl: tmdbPoster('qB20aiY8Ah3pQikkBxm3j7jQVc8'),
    genres: ['Horror'],
    directors: ['Eli Roth'],
    writers: ['Eli Roth'],
    cast: [
      'Lauren German',
      'Heather Matarazzo',
      'Bijou Phillips',
      'Vera Jordanova',
      'Jay Hernandez',
      'Roger Bart',
    ],
  },
  // https://www.themoviedb.org/movie/707
  {
    title: 'A View to a Kill',
    releaseDate: '1985-05-24',
    runtimeMinutes: 131,
    synopsis:
      'A newly-developed microchip designed by Zorin Industries for the British Government that can survive the electromagnetic radiation caused by a nuclear explosion has landed in the hands of the KGB. James Bond must find out how and why. His suspicions soon lead him to big industry leader Max Zorin who forms a plan to destroy his only competition in Silicon Valley by triggering a massive earthquake in the San Francisco Bay.',
    posterUrl: tmdbPoster('arJF829RP9cYvh0NU70dC5TtXSa'),
    genres: ['Adventure', 'Action', 'Thriller'],
    directors: ['John Glen'],
    writers: ['Michael G. Wilson', 'Richard Maibaum'],
    cast: [
      'Roger Moore',
      'Tanya Roberts',
      'Christopher Walken',
      'Grace Jones',
      'Patrick Macnee',
      'Patrick Bauchau',
    ],
  },
  // https://www.themoviedb.org/movie/243
  {
    title: 'High Fidelity',
    releaseDate: '2000-03-17',
    runtimeMinutes: 113,
    synopsis:
      'After his long-time girlfriend dumps him, a thirty-year-old record store owner seeks to understand why he is unlucky in love while recounting his "top five breakups of all time".',
    posterUrl: tmdbPoster('e2LZGB62GMhv3Fo8tDZjY87I81a'),
    genres: ['Drama', 'Comedy', 'Romance', 'Music'],
    directors: ['Stephen Frears'],
    writers: ['John Cusack', 'Scott Rosenberg', 'D.V. DeVincentis', 'Steve Pink'],
    cast: [
      'John Cusack',
      'Iben Hjejle',
      'Todd Louiso',
      'Jack Black',
      'Lisa Bonet',
      'Catherine Zeta-Jones',
    ],
  },
  // https://www.themoviedb.org/movie/860
  {
    title: 'WarGames',
    releaseDate: '1983-06-03',
    runtimeMinutes: 114,
    synopsis:
      "High school student David Lightman has a talent for hacking. But while trying to hack into a computer system to play unreleased video games, he unwittingly taps into the Department of Defense's war computer and initiates a confrontation of global proportions. Together with his friend and a wizardly computer genius, David must race against time to outwit his opponent and prevent a nuclear Armageddon.",
    posterUrl: tmdbPoster('zZ1rN4LoPxKNfAp67Xl300WxVeD'),
    genres: ['Drama', 'Science Fiction', 'Thriller'],
    directors: ['John Badham'],
    writers: ['Lawrence Lasker', 'Walter F. Parkes'],
    cast: [
      'Matthew Broderick',
      'Dabney Coleman',
      'John Wood',
      'Ally Sheedy',
      'Barry Corbin',
      'Juanin Clay',
    ],
  },
  // https://www.themoviedb.org/movie/709
  {
    title: 'Licence to Kill',
    releaseDate: '1989-06-13',
    runtimeMinutes: 133,
    synopsis:
      "After capturing the notorious drug lord Franz Sanchez, Bond's close friend and former CIA agent Felix Leiter is left for dead and his wife is murdered. Bond goes rogue and seeks vengeance on those responsible, as he infiltrates Sanchez's organization from the inside.",
    posterUrl: tmdbPoster('8nzJve63EXA79HGAyidZwivZrQ2'),
    genres: ['Adventure', 'Action', 'Thriller'],
    directors: ['John Glen'],
    writers: ['Richard Maibaum', 'Michael G. Wilson'],
    cast: [
      'Timothy Dalton',
      'Carey Lowell',
      'Robert Davi',
      'Talisa Soto',
      'Anthony Zerbe',
      'Frank McRae',
    ],
  },
  // https://www.themoviedb.org/movie/847
  {
    title: 'Willow',
    releaseDate: '1988-05-20',
    runtimeMinutes: 126,
    synopsis:
      "The evil Queen Bavmorda hunts the newborn princess Elora Danan, a child prophesied to bring about her downfall. When the royal infant is found by Willow, a timid farmer and aspiring sorcerer, he's entrusted with delivering her from evil.",
    posterUrl: tmdbPoster('pAIRGMIdN7ZdZhflazdV2ezuJ9f'),
    genres: ['Fantasy', 'Adventure', 'Action'],
    directors: ['Ron Howard'],
    writers: ['Bob Dolman'],
    cast: [
      'Warwick Davis',
      'Val Kilmer',
      'Joanne Whalley',
      'Patricia Hayes',
      "Gavan O'Herlihy",
      'Phil Fondacaro',
    ],
  },
  // https://www.themoviedb.org/movie/1360
  {
    title: 'Frida',
    releaseDate: '2002-08-29',
    runtimeMinutes: 123,
    synopsis:
      'A biography of artist Frida Kahlo, who channeled the pain of a crippling injury and her tempestuous marriage into her work.',
    posterUrl: tmdbPoster('a4hgR6aKoohB6MHni171jbi9BkU'),
    genres: ['Drama', 'Romance'],
    directors: ['Julie Taymor'],
    writers: ['Gregory Nava', 'Anna Thomas', 'Diane Lake', 'Clancy Sigal'],
    cast: [
      'Salma Hayek Pinault',
      'Alfred Molina',
      'Mía Maestro',
      'Patricia Reyes Spíndola',
      'Edward Norton',
      'Antonio Banderas',
    ],
  },
  // https://www.themoviedb.org/movie/624
  {
    title: 'Easy Rider',
    releaseDate: '1969-06-26',
    runtimeMinutes: 96,
    synopsis:
      'Wyatt and Billy, two Harley-riding hippies, complete a drug deal in Southern California and decide to travel cross-country in search of spiritual truth.',
    posterUrl: tmdbPoster('3H3vwPGX6EbBRffIVHp3eHHcjka'),
    genres: ['Adventure', 'Drama'],
    directors: ['Dennis Hopper'],
    writers: ['Dennis Hopper', 'Peter Fonda', 'Terry Southern'],
    cast: [
      'Peter Fonda',
      'Dennis Hopper',
      'Jack Nicholson',
      'Antonio Mendoza',
      'Phil Spector',
      'Mac Mashourian',
    ],
  },
  // https://www.themoviedb.org/movie/668
  {
    title: "On Her Majesty's Secret Service",
    releaseDate: '1969-12-18',
    runtimeMinutes: 142,
    synopsis:
      "With the help of Marc-Ange Draco, head of the Unione Corse crime syndicate, and Draco's troubled daughter Tracy, James Bond tracks his archnemesis, Ernst Stravro Blofeld, to a mountaintop retreat in the Swiss Alps, where he is training an army of beautiful, lethal women.",
    posterUrl: tmdbPoster('m3KfbxvqaiAvRJ6MpguA3GuLdDQ'),
    genres: ['Adventure', 'Action', 'Thriller'],
    directors: ['Peter R. Hunt'],
    writers: ['Richard Maibaum'],
    cast: [
      'George Lazenby',
      'Diana Rigg',
      'Telly Savalas',
      'Gabriele Ferzetti',
      'Ilse Steppat',
      'Bernard Lee',
    ],
  },
  // https://www.themoviedb.org/movie/1051
  {
    title: 'The French Connection',
    releaseDate: '1971-10-09',
    runtimeMinutes: 104,
    synopsis:
      "Tough narcotics detective 'Popeye' Doyle is in hot pursuit of a suave French drug dealer who may be the key to a huge heroin-smuggling operation.",
    posterUrl: tmdbPoster('pH4saPwMjhnVGwmSH6RkMaHrt3s'),
    genres: ['Action', 'Crime', 'Thriller'],
    directors: ['William Friedkin'],
    writers: ['Ernest Tidyman'],
    cast: [
      'Gene Hackman',
      'Roy Scheider',
      'Fernando Rey',
      'Tony Lo Bianco',
      'Marcel Bozzuffi',
      'Frédéric de Pasquale',
    ],
  },
  // https://www.themoviedb.org/movie/306
  {
    title: 'Beverly Hills Cop III',
    releaseDate: '1994-05-24',
    runtimeMinutes: 105,
    synopsis:
      "When his boss is killed, Detroit cop Axel Foley finds evidence that the murderer had ties to a California amusement park called Wonder World. Returning to sunny Beverly Hills once more, Foley reunites with Detective Billy Rosewood to solve the case. Along with Billy's new partner, Detective Jon Flint, they discover that Wonder World is being used as a front for a massive counterfeiting ring.",
    posterUrl: tmdbPoster('7vIpCkgGEfk5LZwm78nMxswLJRH'),
    genres: ['Action', 'Comedy', 'Crime'],
    directors: ['John Landis'],
    writers: ['Steven E. de Souza'],
    cast: [
      'Eddie Murphy',
      'Judge Reinhold',
      'Héctor Elizondo',
      'Timothy Carhart',
      'John Saxon',
      'Jon Tenney',
    ],
  },
  // https://www.themoviedb.org/movie/154
  {
    title: 'Star Trek II: The Wrath of Khan',
    releaseDate: '1982-06-04',
    runtimeMinutes: 113,
    synopsis:
      'The starship Enterprise and its crew is pulled back into action when old nemesis, Khan, steals a top secret device called Project Genesis.',
    posterUrl: tmdbPoster('uPyLsKl8Z0LOoxeaFXsY5MxhR5s'),
    genres: ['Action', 'Adventure', 'Science Fiction', 'Thriller'],
    directors: ['Nicholas Meyer'],
    writers: ['Jack B. Sowards'],
    cast: [
      'William Shatner',
      'Leonard Nimoy',
      'Ricardo Montalban',
      'DeForest Kelley',
      'James Doohan',
      'Walter Koenig',
    ],
  },
  // https://www.themoviedb.org/movie/579
  {
    title: 'Jaws 2',
    releaseDate: '1978-06-16',
    runtimeMinutes: 117,
    synopsis:
      'Police chief Brody must protect the citizens of Amity after a second monstrous shark begins terrorizing the waters.',
    posterUrl: tmdbPoster('cN3ijEwsn4kBaRuHfcJpAQJbeWe'),
    genres: ['Horror', 'Thriller'],
    directors: ['Jeannot Szwarc'],
    writers: ['Peter Benchley', 'Howard Sackler', 'Carl Gottlieb'],
    cast: [
      'Roy Scheider',
      'Lorraine Gary',
      'Murray Hamilton',
      'Joseph Mascolo',
      'Jeffrey Kramer',
      'Collin Wilcox Paxton',
    ],
  },
  // https://www.themoviedb.org/movie/1636
  {
    title: 'Bedazzled',
    releaseDate: '2000-10-19',
    runtimeMinutes: 93,
    synopsis:
      'Elliot Richards, a socially awkward IT worker, is given seven wishes to get the girl of his dreams when he meets a very seductive Satan. The catch: his soul. Some of his wishes include being a 7 foot basketball star, a wealthy, powerful man, and a sensitive caring guy. But, as could be expected, the Devil puts her own little twist on each of his fantasies.',
    posterUrl: tmdbPoster('sBV28EVvWsJRosMsEFCbVmpAZEl'),
    genres: ['Fantasy', 'Comedy', 'Romance'],
    directors: ['Harold Ramis'],
    writers: ['Harold Ramis', 'Peter Tolan', 'Larry Gelbart'],
    cast: [
      'Brendan Fraser',
      'Elizabeth Hurley',
      "Frances O'Connor",
      'Miriam Shor',
      'Orlando Jones',
      'Paul Adelstein',
    ],
  },
  // https://www.themoviedb.org/movie/1092
  {
    title: 'The Third Man',
    releaseDate: '1949-08-31',
    runtimeMinutes: 105,
    synopsis:
      'In postwar Vienna, Austria, Holly Martins, a writer of pulp Westerns, arrives penniless as a guest of his childhood chum Harry Lime, only to learn he has died. Martins develops a conspiracy theory after learning of a "third man" present at the time of Harry\'s death, running into interference from British officer Major Calloway, and falling head-over-heels for Harry\'s grief-stricken lover, Anna.',
    posterUrl: tmdbPoster('rO2Fq0AZZx9obs52KJdx4mRE8p5'),
    genres: ['Thriller', 'Mystery'],
    directors: ['Carol Reed'],
    writers: ['Graham Greene'],
    cast: [
      'Joseph Cotten',
      'Alida Valli',
      'Trevor Howard',
      'Orson Welles',
      'Paul Hörbiger',
      'Ernst Deutsch',
    ],
  },
  // https://www.themoviedb.org/movie/1648
  {
    title: "Bill & Ted's Excellent Adventure",
    releaseDate: '1989-02-17',
    runtimeMinutes: 90,
    synopsis:
      "Bill and Ted are high school buddies starting a band. They are also about to fail their history class—which means Ted would be sent to military school—but receive help from Rufus, a traveller from a future where their band is the foundation for a perfect society. With the use of Rufus' time machine, Bill and Ted travel to various points in history, returning with important figures to help them complete their final history presentation.",
    posterUrl: tmdbPoster('tV25lGWGWGEqUe3U0xjQTBgilSx'),
    genres: ['Adventure', 'Comedy', 'Science Fiction'],
    directors: ['Stephen Herek'],
    writers: ['Ed Solomon', 'Chris Matheson'],
    cast: [
      'Keanu Reeves',
      'Alex Winter',
      'George Carlin',
      'Terry Camilleri',
      'Dan Shor',
      'Tony Steedman',
    ],
  },
  // https://www.themoviedb.org/movie/1807
  {
    title: 'Elephant',
    releaseDate: '2003-09-20',
    runtimeMinutes: 81,
    synopsis:
      'Several ordinary high school students go through their daily routine as two others prepare for something more malevolent.',
    posterUrl: tmdbPoster('1a4VU9z2hxEvugHMK7VsobB9xTX'),
    genres: ['Crime', 'Drama'],
    directors: ['Gus Van Sant'],
    writers: ['Gus Van Sant'],
    cast: [
      'Alex Frost',
      'Eric Deulen',
      'John Robinson',
      'Elias McConnell',
      'Jordan Taylor',
      'Carrie Finklea',
    ],
  },
  // https://www.themoviedb.org/movie/699
  {
    title: 'For Your Eyes Only',
    releaseDate: '1981-06-24',
    runtimeMinutes: 128,
    synopsis:
      'A British spy ship has sunk and on board was a hi-tech encryption device. James Bond is sent to find the device that holds British launching instructions before the enemy Soviets get to it first.',
    posterUrl: tmdbPoster('xV4Nnr6DjjERlqNikqDQX8LUgua'),
    genres: ['Adventure', 'Action', 'Thriller'],
    directors: ['John Glen'],
    writers: ['Michael G. Wilson', 'Richard Maibaum'],
    cast: [
      'Roger Moore',
      'Carole Bouquet',
      'Chaim Topol',
      'Julian Glover',
      'Lynn-Holly Johnson',
      'Cassandra Harris',
    ],
  },
  // https://www.themoviedb.org/movie/891
  {
    title: "All the President's Men",
    releaseDate: '1976-04-09',
    runtimeMinutes: 138,
    synopsis:
      "During the 1972 elections, two reporters' investigation sheds light on the controversial Watergate scandal that compels President Nixon to resign from his post.",
    posterUrl: tmdbPoster('pCe6lfLxt1B58zPD4lgQrlnDS2j'),
    genres: ['Drama', 'Mystery', 'Thriller'],
    directors: ['Alan J. Pakula'],
    writers: ['William Goldman'],
    cast: [
      'Robert Redford',
      'Dustin Hoffman',
      'Jack Warden',
      'Martin Balsam',
      'Hal Holbrook',
      'Jason Robards',
    ],
  },
  // https://www.themoviedb.org/movie/99
  {
    title: 'All About My Mother',
    releaseDate: '1999-04-16',
    runtimeMinutes: 101,
    synopsis:
      'Following the tragic death of her teenage son, Manuela travels from Madrid to Barcelona in an attempt to contact the long-estranged father the boy never knew. She reunites with an old friend, an outspoken transgender sex worker, and befriends a troubled actress and a pregnant, HIV-positive nun.',
    posterUrl: tmdbPoster('hjQhzhkGYXPNM96k0mOgob6HMmn'),
    genres: ['Comedy', 'Drama'],
    directors: ['Pedro Almodóvar'],
    writers: ['Pedro Almodóvar'],
    cast: [
      'Cecilia Roth',
      'Marisa Paredes',
      'Candela Peña',
      'Antonia San Juan',
      'Penélope Cruz',
      'Rosa María Sardà',
    ],
  },
  // https://www.themoviedb.org/movie/401
  {
    title: 'Garden State',
    releaseDate: '2004-07-28',
    runtimeMinutes: 102,
    synopsis:
      'Andrew returns to his hometown for his mother’s funeral, a journey that reconnects him with old friends. The trip coincides with his decision to stop taking his powerful antidepressants. A chance meeting with Sam—a girl also struggling with various maladies—opens up the possibility of rekindling emotional connections, confronting his psychologist father, and perhaps beginning a new life.',
    posterUrl: tmdbPoster('h3iqYiGS6F3y7GxaS4AT8nFxZ2i'),
    genres: ['Comedy', 'Drama', 'Romance'],
    directors: ['Zach Braff'],
    writers: ['Zach Braff'],
    cast: [
      'Zach Braff',
      'Natalie Portman',
      'Ian Holm',
      'Peter Sarsgaard',
      'Jean Smart',
      'Armando Riesco',
    ],
  },
  // https://www.themoviedb.org/movie/996
  {
    title: 'Double Indemnity',
    releaseDate: '1944-07-06',
    runtimeMinutes: 107,
    synopsis:
      'An insurance representative is seduced by a dissatisfied housewife into a scheme of insurance fraud and murder that arouses the suspicion of his colleague, a claims investigator.',
    posterUrl: tmdbPoster('rVNYZZgfhwqVMMWlBmxOfWqnwCj'),
    genres: ['Crime', 'Thriller'],
    directors: ['Billy Wilder'],
    writers: ['Billy Wilder', 'Raymond Chandler'],
    cast: [
      'Fred MacMurray',
      'Barbara Stanwyck',
      'Edward G. Robinson',
      'Porter Hall',
      'Jean Heather',
      'Tom Powers',
    ],
  },
  // https://www.themoviedb.org/movie/708
  {
    title: 'The Living Daylights',
    releaseDate: '1987-06-29',
    runtimeMinutes: 130,
    synopsis:
      'After a defecting Russian general reveals a plot to assassinate foreign spies, James Bond is assigned a secret mission to dispatch the new head of the KGB to prevent an escalation of tensions between the Soviet Union and the West.',
    posterUrl: tmdbPoster('1oRlmWX9hewpn2B44wawBjHd7dx'),
    genres: ['Action', 'Adventure', 'Thriller'],
    directors: ['John Glen'],
    writers: ['Michael G. Wilson', 'Richard Maibaum'],
    cast: [
      'Timothy Dalton',
      "Maryam D'Abo",
      'Joe Don Baker',
      'Art Malik',
      'John Rhys-Davies',
      'Jeroen Krabbé',
    ],
  },
  // https://www.themoviedb.org/movie/592
  {
    title: 'The Conversation',
    releaseDate: '1974-04-12',
    runtimeMinutes: 115,
    synopsis:
      'A paranoid, secretive surveillance expert has a crisis of conscience when he suspects that the couple he is spying on will be murdered.',
    posterUrl: tmdbPoster('dHqVBwcv1SGymOpUueRoKzcmdes'),
    genres: ['Crime', 'Drama', 'Mystery'],
    directors: ['Francis Ford Coppola'],
    writers: ['Francis Ford Coppola'],
    cast: [
      'Gene Hackman',
      'John Cazale',
      'Allen Garfield',
      'Frederic Forrest',
      'Cindy Williams',
      'Michael Higgins',
    ],
  },
  // https://www.themoviedb.org/movie/439
  {
    title: 'La Dolce Vita',
    releaseDate: '1960-02-05',
    runtimeMinutes: 174,
    synopsis:
      "Episodic journey of journalist Marcello who struggles to find his place in the world, torn between the allure of Rome's elite social scene and the stifling domesticity offered by his girlfriend, all the while searching for a way to become a serious writer.",
    posterUrl: tmdbPoster('dZ2v0DAX4aCZartCzZdg4ZinSW2'),
    genres: ['Comedy', 'Drama'],
    directors: ['Federico Fellini'],
    writers: [
      'Federico Fellini',
      'Ennio Flaiano',
      'Tullio Pinelli',
      'Brunello Rondi',
      'Pier Paolo Pasolini',
    ],
    cast: [
      'Marcello Mastroianni',
      'Anita Ekberg',
      'Anouk Aimée',
      'Yvonne Furneaux',
      'Magali Noël',
      'Alain Cuny',
    ],
  },
  // https://www.themoviedb.org/movie/455
  {
    title: 'Bend It Like Beckham',
    releaseDate: '2002-04-11',
    runtimeMinutes: 112,
    synopsis:
      'Jess Bhamra, the daughter of a strict Indian couple in London, is not permitted to play organized soccer, even though she is 18. When Jess is playing for fun one day, her impressive skills are seen by Jules Paxton, who then convinces Jess to play for her semi-pro team. Jess uses elaborate excuses to hide her matches from her family while also dealing with her romantic feelings for her coach, Joe.',
    posterUrl: tmdbPoster('2dzSBmFWWqt8NbnubJKIWU21Y86'),
    genres: ['Comedy', 'Drama', 'Romance'],
    directors: ['Gurinder Chadha'],
    writers: ['Gurinder Chadha', 'Guljit Bindra', 'Paul Mayeda Berges'],
    cast: [
      'Parminder Nagra',
      'Keira Knightley',
      'Jonathan Rhys Meyers',
      'Anupam Kher',
      'Shaheen Khan',
      'Archie Panjabi',
    ],
  },
  // https://www.themoviedb.org/movie/16
  {
    title: 'Dancer in the Dark',
    releaseDate: '2000-09-01',
    runtimeMinutes: 140,
    synopsis:
      'Selma, a Czech immigrant on the verge of blindness, struggles to make ends meet for herself and her son, who has inherited the same genetic disorder and will suffer the same fate without an expensive operation. When life gets too difficult, Selma learns to cope through her love of musicals, dreaming up little numbers to the rhythmic beats of her surroundings.',
    posterUrl: tmdbPoster('pWzOfTJRZHPNO1VNrMnNFqRcJwg'),
    genres: ['Drama', 'Crime'],
    directors: ['Lars von Trier'],
    writers: ['Lars von Trier'],
    cast: [
      'Björk',
      'Catherine Deneuve',
      'David Morse',
      'Peter Stormare',
      'Joel Grey',
      'Cara Seymour',
    ],
  },
  // https://www.themoviedb.org/movie/326
  {
    title: 'Snakes on a Plane',
    releaseDate: '2006-08-17',
    runtimeMinutes: 105,
    synopsis:
      'FBI agent Neville Flynn boards a flight from Honolulu, Hawaii to Los Angeles, escorting a key witness to testify against a mob boss at an upcoming trial. An on-board assassin releases a crate full of hundreds of deadly venomous snakes in an attempt to eliminate the witness. Flynn and a host of frightened passengers and crew must band together to survive the slithery threat.',
    posterUrl: tmdbPoster('i0ynvZ89tV1t8MAL9FmeQELfXH0'),
    genres: ['Action', 'Thriller', 'Adventure', 'Crime', 'Horror'],
    directors: ['David R. Ellis'],
    writers: ['John Heffernan', 'Sebastian Gutierrez'],
    cast: [
      'Samuel L. Jackson',
      'Julianna Margulies',
      'Nathan Phillips',
      'Kenan Thompson',
      'Rachel Blanchard',
      'Flex Alexander',
    ],
  },
  // https://www.themoviedb.org/movie/925
  {
    title: 'Do the Right Thing',
    releaseDate: '1989-06-14',
    runtimeMinutes: 120,
    synopsis:
      "Sal is the Italian owner of a pizzeria in Brooklyn. A neighborhood local, Buggin' Out, becomes upset when he sees that the pizzeria's Wall of Fame exhibits only Italian actors. Buggin' Out believes a pizzeria in a black neighborhood should showcase black actors, but Sal disagrees. The wall becomes a symbol of racism and hate to Buggin' Out and to other people in the neighborhood, and tensions rise.",
    posterUrl: tmdbPoster('63rmSDPahrH7C1gEFYzRuIBAN9W'),
    genres: ['Drama'],
    directors: ['Spike Lee'],
    writers: ['Spike Lee'],
    cast: [
      'Danny Aiello',
      'Ossie Davis',
      'Ruby Dee',
      'Richard Edson',
      'Giancarlo Esposito',
      'Spike Lee',
    ],
  },
  // https://www.themoviedb.org/movie/966
  {
    title: 'The Magnificent Seven',
    releaseDate: '1960-10-12',
    runtimeMinutes: 128,
    synopsis:
      'An oppressed Mexican peasant village hires seven gunfighters to help defend their homes.',
    posterUrl: tmdbPoster('e5ToxOyJwuZD4VOfI0qEn5uIjeJ'),
    genres: ['Western', 'Action', 'Adventure', 'Drama'],
    directors: ['John Sturges'],
    writers: ['Walter Bernstein', 'Walter Newman', 'William Roberts'],
    cast: [
      'Yul Brynner',
      'Eli Wallach',
      'Steve McQueen',
      'Charles Bronson',
      'Robert Vaughn',
      'Brad Dexter',
    ],
  },
  // https://www.themoviedb.org/movie/617
  {
    title: 'Wild Things',
    releaseDate: '1998-03-20',
    runtimeMinutes: 108,
    synopsis:
      "When teen-socialite Kelly Van Ryan and troubled bad girl Suzie Toller accuse guidance counselor Sam Lombardo of rape, he's suspended by the school, rejected by the town, and fighting to get his life back. One cop suspects conspiracy, but nothing is what it seems...",
    posterUrl: tmdbPoster('wrcTDD9T7Ga5c9MW7kaOo2qwIvW'),
    genres: ['Mystery', 'Thriller', 'Drama'],
    directors: ['John McNaughton'],
    writers: ['Stephen Peters'],
    cast: [
      'Kevin Bacon',
      'Matt Dillon',
      'Neve Campbell',
      'Denise Richards',
      'Theresa Russell',
      'Bill Murray',
    ],
  },
  // https://www.themoviedb.org/movie/82
  {
    title: 'Miami Vice',
    releaseDate: '2006-07-27',
    runtimeMinutes: 132,
    synopsis:
      'A case involving drug lords and murder in South Florida takes a personal turn for undercover detectives Sonny Crockett and Ricardo Tubbs. Unorthodox Crockett gets involved romantically with the Chinese-Cuban wife of a trafficker of arms and drugs, while Tubbs deals with an assault on those he loves.',
    posterUrl: tmdbPoster('iJPSls4taB09EUKtLj6FjFSprb3'),
    genres: ['Action', 'Crime', 'Thriller'],
    directors: ['Michael Mann'],
    writers: ['Michael Mann'],
    cast: ['Colin Farrell', 'Jamie Foxx', 'Naomie Harris', 'Gong Li', 'John Ortiz', 'Ciarán Hinds'],
  },
  // https://www.themoviedb.org/movie/873
  {
    title: 'The Color Purple',
    releaseDate: '1985-12-18',
    runtimeMinutes: 154,
    synopsis:
      "An epic tale spanning forty years in the life of Celie, an African-American woman living in the South who survives incredible abuse and bigotry. After Celie's abusive father marries her off to the equally debasing 'Mister' Albert Johnson, things go from bad to worse, leaving Celie to find companionship anywhere she can. She perseveres, holding on to her dream of one day being reunited with her sister in Africa.",
    posterUrl: tmdbPoster('6bvxkcTAXyqxGRwo38mxw92D6Xr'),
    genres: ['Drama', 'History'],
    directors: ['Steven Spielberg'],
    writers: ['Menno Meyjes'],
    cast: [
      'Danny Glover',
      'Whoopi Goldberg',
      'Margaret Avery',
      'Oprah Winfrey',
      'Willard E. Pugh',
      'Akosua Busia',
    ],
  },
  // https://www.themoviedb.org/movie/1634
  {
    title: 'Free Willy',
    releaseDate: '1993-07-16',
    runtimeMinutes: 112,
    synopsis:
      'When maladjusted orphan Jesse vandalizes a theme park, he is placed with foster parents and must work at the park to make amends. There he meets Willy, a young Orca whale who has been separated from his family. Sensing kinship, they form a bond and, with the help of kindly whale trainer Rae Lindley, develop a routine of tricks. However, greedy park owner Dial soon catches wind of the duo and makes plans to profit from them.',
    posterUrl: tmdbPoster('9iBgd9gi9ztWiVcYSG6zl8wDFBN'),
    genres: ['Family', 'Adventure', 'Drama'],
    directors: ['Simon Wincer'],
    writers: ['Keith Walker', 'Corey Blechman'],
    cast: [
      'Jason James Richter',
      'Keiko',
      'Lori Petty',
      'August Schellenberg',
      'Michael Madsen',
      'Jayne Atkinson',
    ],
  },
  // https://www.themoviedb.org/movie/223
  {
    title: 'Rebecca',
    releaseDate: '1940-03-23',
    runtimeMinutes: 130,
    synopsis:
      'Story of a young woman who marries a fascinating widower only to find out that she must live in the shadow of his former wife, Rebecca, who died mysteriously several years earlier. The young wife must come to grips with the terrible secret of her handsome, cold husband, Max De Winter. She must also deal with the jealous, obsessed Mrs. Danvers, the housekeeper, who will not accept her as the mistress of the house.',
    posterUrl: tmdbPoster('1qz3qUOHnVy7dL7M7G8jSErxE4b'),
    genres: ['Mystery', 'Romance', 'Drama'],
    directors: ['Alfred Hitchcock'],
    writers: ['Robert E. Sherwood', 'Joan Harrison'],
    cast: [
      'Laurence Olivier',
      'Joan Fontaine',
      'George Sanders',
      'Judith Anderson',
      'Gladys Cooper',
      'Nigel Bruce',
    ],
  },
  // https://www.themoviedb.org/movie/1498
  {
    title: 'Teenage Mutant Ninja Turtles',
    releaseDate: '1990-03-30',
    runtimeMinutes: 93,
    synopsis:
      'A quartet of humanoid turtles, trained by their mentor in Ninjutsu, must learn to work together to face the menace of Shredder and the Foot Clan.',
    posterUrl: tmdbPoster('shfAU6xIIEAEtsloIT3n9Fscz2E'),
    genres: ['Science Fiction', 'Action', 'Adventure', 'Comedy', 'Family'],
    directors: ['Steve Barron'],
    writers: ['Bobby Herbeck', 'Todd W. Langen'],
    cast: [
      'Brian Tochi',
      'Josh Pais',
      'Corey Feldman',
      'Robbie Rist',
      'Judith Hoag',
      'Elias Koteas',
    ],
  },
  // https://www.themoviedb.org/movie/199
  {
    title: 'Star Trek: First Contact',
    releaseDate: '1996-11-22',
    runtimeMinutes: 111,
    synopsis:
      'The Borg, a relentless race of cyborgs, are on a direct course for Earth. Violating orders to stay away from the battle, Captain Picard and the crew of the newly-commissioned USS Enterprise E pursue the Borg back in time to prevent the invaders from changing Federation history and assimilating the galaxy.',
    posterUrl: tmdbPoster('iqhHe893Vcf07jNkNQ31tu85dKG'),
    genres: ['Science Fiction', 'Action', 'Adventure', 'Thriller'],
    directors: ['Jonathan Frakes'],
    writers: ['Brannon Braga', 'Ronald D. Moore'],
    cast: [
      'Patrick Stewart',
      'Jonathan Frakes',
      'Brent Spiner',
      'LeVar Burton',
      'Michael Dorn',
      'Gates McFadden',
    ],
  },
  // https://www.themoviedb.org/movie/1632
  {
    title: 'Mississippi Burning',
    releaseDate: '1988-12-08',
    runtimeMinutes: 128,
    synopsis:
      'Two FBI agents investigating the murder of civil rights workers during the 60s seek to breach the conspiracy of silence in a small Southern town where segregation divides black and white. The younger agent trained in FBI school runs up against the small town ways of his partner, a former sheriff.',
    posterUrl: tmdbPoster('wvEx2WbxZXYljQ9vSoq37NgeXcJ'),
    genres: ['Drama', 'Crime', 'Mystery', 'Thriller'],
    directors: ['Alan Parker'],
    writers: ['Chris Gerolmo'],
    cast: [
      'Gene Hackman',
      'Willem Dafoe',
      'Frances McDormand',
      'Brad Dourif',
      'R. Lee Ermey',
      'Gailard Sartain',
    ],
  },
  // https://www.themoviedb.org/movie/152
  {
    title: 'Star Trek: The Motion Picture',
    releaseDate: '1979-12-07',
    runtimeMinutes: 131,
    synopsis:
      'When an unidentified alien destroys three powerful Klingon cruisers, Captain James T. Kirk returns to the newly transformed U.S.S. Enterprise to take command.',
    posterUrl: tmdbPoster('wfiAfNwH6CMKxz4vRaW8CPTabtk'),
    genres: ['Science Fiction', 'Adventure', 'Mystery'],
    directors: ['Robert Wise'],
    writers: ['Harold Livingston'],
    cast: [
      'William Shatner',
      'Leonard Nimoy',
      'DeForest Kelley',
      'James Doohan',
      'George Takei',
      'Walter Koenig',
    ],
  },
  // https://www.themoviedb.org/movie/1647
  {
    title: 'The Recruit',
    releaseDate: '2003-01-31',
    runtimeMinutes: 115,
    synopsis:
      "A brilliant CIA trainee must prove his worth at the Farm, the agency's secret training grounds, where he learns to watch his back and trust no one.",
    posterUrl: tmdbPoster('xInKytrHV3EJeCAulOpn5Q0bMxh'),
    genres: ['Action', 'Thriller'],
    directors: ['Roger Donaldson'],
    writers: ['Roger Towne', 'Mitch Glazer', 'Kurt Wimmer'],
    cast: [
      'Colin Farrell',
      'Al Pacino',
      'Bridget Moynahan',
      'Gabriel Macht',
      'Karl Pruner',
      'Eugene Lipinski',
    ],
  },
  // https://www.themoviedb.org/movie/219
  {
    title: 'Volver',
    releaseDate: '2006-03-17',
    runtimeMinutes: 121,
    synopsis:
      'Three generations of women deal with family secrets while surviving the east wind, fire, insanity, superstition, lies and even death.',
    posterUrl: tmdbPoster('m1ZUDGTFtVGE3zjTvF8OiQ9um5e'),
    genres: ['Comedy', 'Drama', 'Romance'],
    directors: ['Pedro Almodóvar'],
    writers: ['Pedro Almodóvar'],
    cast: [
      'Penélope Cruz',
      'Carmen Maura',
      'Lola Dueñas',
      'Blanca Portillo',
      'Yohana Cobo',
      'Chus Lampreave',
    ],
  },
  // https://www.themoviedb.org/movie/746
  {
    title: 'The Last Emperor',
    releaseDate: '1987-10-04',
    runtimeMinutes: 163,
    synopsis:
      "A dramatic history of Pu Yi, the last of the Emperors of China, from his lofty birth and brief reign in the Forbidden City, the object of worship by half a billion people; through his abdication, his decline and dissolute lifestyle; his exploitation by the invading Japanese, and finally to his obscure existence as just another peasant worker in the People's Republic.",
    posterUrl: tmdbPoster('7TILJhdeJAaEyDiwvJZMo9SQBoe'),
    genres: ['Drama', 'History'],
    directors: ['Bernardo Bertolucci'],
    writers: ['Bernardo Bertolucci', 'Mark Peploe'],
    cast: ['John Lone', 'Joan Chen', "Peter O'Toole", 'Ruocheng Ying', 'Victor Wong', 'Dennis Dun'],
  },
  // https://www.themoviedb.org/movie/483
  {
    title: 'Wild at Heart',
    releaseDate: '1990-08-17',
    runtimeMinutes: 125,
    synopsis:
      'Young lovers Sailor and Lula hit the road to start a new life together away from the wrath of Lula’s deranged, disapproving mother, who has hired a team of hitmen to cut the lovers’ surreal honeymoon short.',
    posterUrl: tmdbPoster('uLUFI5sJIfWrBUWB2Y1dEuyvvVy'),
    genres: ['Crime', 'Thriller', 'Romance'],
    directors: ['David Lynch'],
    writers: ['David Lynch'],
    cast: [
      'Nicolas Cage',
      'Laura Dern',
      'Willem Dafoe',
      'Diane Ladd',
      'Harry Dean Stanton',
      'J.E. Freeman',
    ],
  },
  // https://www.themoviedb.org/movie/108
  {
    title: 'Three Colors: Blue',
    releaseDate: '1993-09-08',
    runtimeMinutes: 98,
    synopsis:
      'The wife of a famous composer survives a car accident that kills her husband and daughter. Now alone, she shakes off her old identity and explores her newfound freedom but finds that she is unbreakably bound to other humans, including her husband’s mistress, whose existence she never suspected.',
    posterUrl: tmdbPoster('33wsWxzsNstI8N7dvuwzFmj1qBd'),
    genres: ['Drama'],
    directors: ['Krzysztof Kieślowski'],
    writers: ['Krzysztof Kieślowski', 'Krzysztof Piesiewicz'],
    cast: [
      'Juliette Binoche',
      'Benoît Régent',
      'Florence Pernel',
      'Charlotte Véry',
      'Hélène Vincent',
      'Philippe Volter',
    ],
  },
  // https://www.themoviedb.org/movie/963
  {
    title: 'The Maltese Falcon',
    releaseDate: '1941-10-18',
    runtimeMinutes: 100,
    synopsis:
      'A private detective takes on a case that involves him with three eccentric criminals, a beautiful liar, and their quest for a priceless statuette.',
    posterUrl: tmdbPoster('bf4o6Uzw5wqLjdKwRuiDrN1xyvl'),
    genres: ['Mystery', 'Crime', 'Thriller'],
    directors: ['John Huston'],
    writers: ['John Huston'],
    cast: [
      'Humphrey Bogart',
      'Mary Astor',
      'Gladys George',
      'Peter Lorre',
      'Barton MacLane',
      'Lee Patrick',
    ],
  },
  // https://www.themoviedb.org/movie/845
  {
    title: 'Strangers on a Train',
    releaseDate: '1951-06-27',
    runtimeMinutes: 101,
    synopsis:
      'A charming psychopath tries to coerce a tennis star into his theory that two strangers can commit the perfect crime by exchanging murders—each killing the other’s most-hated person.',
    posterUrl: tmdbPoster('ihC083U7ef56Ui4x0P0dobojrZ1'),
    genres: ['Crime', 'Thriller', 'Drama'],
    directors: ['Alfred Hitchcock'],
    writers: ['Raymond Chandler', 'Czenzi Ormonde'],
    cast: [
      'Farley Granger',
      'Ruth Roman',
      'Robert Walker',
      'Leo G. Carroll',
      'Patricia Hitchcock',
      'Kasey Rogers',
    ],
  },
  // https://www.themoviedb.org/movie/590
  {
    title: 'The Hours',
    releaseDate: '2002-12-27',
    runtimeMinutes: 114,
    synopsis:
      'The story of three women searching for more potent, meaningful lives. Each is alive at a different time and place, all are linked by their yearnings and their fears. Their stories intertwine, and finally come together in a surprising, transcendent moment of shared recognition.',
    posterUrl: tmdbPoster('4myDtowDJQPQnkEDB1IWGtJR1Fo'),
    genres: ['Drama'],
    directors: ['Stephen Daldry'],
    writers: ['David Hare'],
    cast: [
      'Julianne Moore',
      'Nicole Kidman',
      'Meryl Streep',
      'Stephen Dillane',
      'Miranda Richardson',
      'Linda Bassett',
    ],
  },
  // https://www.themoviedb.org/movie/1588
  {
    title: 'Bring It On',
    releaseDate: '2000-08-25',
    runtimeMinutes: 99,
    synopsis:
      "The Toro cheerleading squad from Rancho Carne High School in San Diego has got spirit, spunk, sass and a killer routine that's sure to land them the national championship trophy for the sixth year in a row. But for newly-elected team captain Torrance, the Toros' road to total cheer glory takes a shady turn when she discovers that their perfectly-choreographed routines were in fact stolen.",
    posterUrl: tmdbPoster('bnVby0qI0dS7YunbShP7mw68HY3'),
    genres: ['Comedy'],
    directors: ['Peyton Reed'],
    writers: ['Jessica Bendinger'],
    cast: [
      'Kirsten Dunst',
      'Eliza Dushku',
      'Jesse Bradford',
      'Gabrielle Union',
      'Sherry Hursey',
      'Holmes Osborne',
    ],
  },
  // https://www.themoviedb.org/movie/763
  {
    title: 'Braindead',
    releaseDate: '1992-08-13',
    runtimeMinutes: 103,
    synopsis:
      "When a Sumatran rat-monkey bites Lionel Cosgrove's mother, she's transformed into a zombie and begins killing (and transforming) the entire town while Lionel races to keep things under control.",
    posterUrl: tmdbPoster('pa39D8TQs6aNw3hiUs4jLjHVUB0'),
    genres: ['Horror', 'Comedy'],
    directors: ['Peter Jackson'],
    writers: ['Peter Jackson', 'Stephen Sinclair', 'Fran Walsh'],
    cast: [
      'Timothy Balme',
      'Diana Peñalver',
      'Elizabeth Moody',
      'Ian Watkin',
      'Brenda Kendall',
      'Stuart Devenie',
    ],
  },
  // https://www.themoviedb.org/movie/379
  {
    title: "Miller's Crossing",
    releaseDate: '1990-09-21',
    runtimeMinutes: 115,
    synopsis:
      'Set in 1929, a political boss and his advisor have a parting of the ways when they both fall for the same woman.',
    posterUrl: tmdbPoster('i83gYdglRCjCRLSsmCk5nRWRmDM'),
    genres: ['Drama', 'Thriller', 'Crime'],
    directors: ['Joel Coen'],
    writers: ['Joel Coen', 'Ethan Coen'],
    cast: [
      'Gabriel Byrne',
      'Marcia Gay Harden',
      'John Turturro',
      'Jon Polito',
      'J.E. Freeman',
      'Albert Finney',
    ],
  },
  // https://www.themoviedb.org/movie/962
  {
    title: 'The Gold Rush',
    releaseDate: '1925-07-13',
    runtimeMinutes: 95,
    synopsis:
      'A gold prospector in Alaska struggles to survive the elements and win the heart of a dance hall girl.',
    posterUrl: tmdbPoster('eQRFo1qwRREYwj47Yoe1PisgOle'),
    genres: ['Adventure', 'Comedy', 'Drama'],
    directors: ['Charlie Chaplin'],
    writers: ['Charlie Chaplin'],
    cast: [
      'Charlie Chaplin',
      'Mack Swain',
      'Tom Murray',
      'Henry Bergman',
      'Malcolm Waite',
      'Georgia Hale',
    ],
  },
  // https://www.themoviedb.org/movie/593
  {
    title: 'Solaris',
    releaseDate: '1972-03-20',
    runtimeMinutes: 167,
    synopsis:
      'A psychologist is sent to a space station orbiting a planet called Solaris to investigate the death of a doctor and the mental problems of cosmonauts on the station. He soon discovers that the water on the planet is a type of brain which brings out repressed memories and obsessions.',
    posterUrl: tmdbPoster('pgqj7QoBPWFLLKtLEpPmFYFRMgB'),
    genres: ['Drama', 'Science Fiction', 'Mystery'],
    directors: ['Andrei Tarkovsky'],
    writers: ['Andrei Tarkovsky', 'Fridrikh Gorenshteyn'],
    cast: [
      'Natalya Bondarchuk',
      'Donatas Banionis',
      'Jüri Järvet',
      'Vladislav Dvorzhetsky',
      'Mykola Hrynko',
      'Anatoliy Solonitsyn',
    ],
  },
  // https://www.themoviedb.org/movie/846
  {
    title: 'The X-Files',
    releaseDate: '1998-06-19',
    runtimeMinutes: 121,
    synopsis:
      "Mulder and Scully, now taken off the FBI's X Files cases, must find a way to fight the shadowy elements of the government to find out the truth about a conspiracy that might mean the alien colonization of Earth.",
    posterUrl: tmdbPoster('yLIw6shz2WC3W3iI0jROsF4B2ha'),
    genres: ['Mystery', 'Science Fiction', 'Thriller'],
    directors: ['Rob Bowman'],
    writers: ['Chris Carter'],
    cast: [
      'David Duchovny',
      'Gillian Anderson',
      'Mitch Pileggi',
      'William B. Davis',
      'John Neville',
      'Martin Landau',
    ],
  },
  // https://www.themoviedb.org/movie/1639
  {
    title: 'Speed 2: Cruise Control',
    releaseDate: '1997-06-13',
    runtimeMinutes: 125,
    synopsis:
      "A disgruntled former employee hijacks the Seabourn Legend cruise liner. Set on a fixed course, without any means of communication and at the mercy of the hijacker, it's up to the one cop on vacation, and his soon to be fiancé (hopefully) Annie, to regain control of it before it kills the passengers and causes an environmental disaster. Insurmountable and daunting tasks await them on their  perilous journey throughout the ship trying to fend off the hijacker and save the passengers.",
    posterUrl: tmdbPoster('gnK1ocpwUTj24zAktzomOJsD2bu'),
    genres: ['Action', 'Thriller'],
    directors: ['Jan de Bont'],
    writers: ['Randall McCormick', 'Jeff Nathanson'],
    cast: [
      'Sandra Bullock',
      'Jason Patric',
      'Willem Dafoe',
      'Temuera Morrison',
      'Brian McCardie',
      'Glenn Plummer',
    ],
  },
  // https://www.themoviedb.org/movie/614
  {
    title: 'Wild Strawberries',
    releaseDate: '1957-08-28',
    runtimeMinutes: 91,
    synopsis:
      "Crotchety retired doctor Isak Borg travels from Stockholm to Lund, Sweden, with his pregnant and unhappy daughter-in-law, Marianne, in order to receive an honorary degree from his alma mater. Along the way, they encounter a series of hitchhikers, each of whom causes the elderly doctor to muse upon the pleasures and failures of his own life. These include the vivacious young Sara, a dead ringer for the doctor's own first love.",
    posterUrl: tmdbPoster('iyTD2QnySNMPUPE3IedZQipSWfz'),
    genres: ['Drama'],
    directors: ['Ingmar Bergman'],
    writers: ['Ingmar Bergman'],
    cast: [
      'Victor Sjöström',
      'Bibi Andersson',
      'Ingrid Thulin',
      'Gunnar Björnstrand',
      'Jullan Kindahl',
      'Folke Sundquist',
    ],
  },
  // https://www.themoviedb.org/movie/404
  {
    title: 'The Straight Story',
    releaseDate: '1999-10-15',
    runtimeMinutes: 112,
    synopsis:
      "Retired farmer and widower Alvin Straight learns one day that his distant brother Lyle has suffered a stroke and may not recover. Alvin is determined to make things right with Lyle while he still can, but his brother lives in Wisconsin, while Alvin is stuck in Iowa with no car and no driver's license. He then has the idea of making the trip on his old lawnmower, thus beginning a picturesque and at times deeply spiritual odyssey.",
    posterUrl: tmdbPoster('tT9cMiVDdtlcdZxOoFy3VRmEoKk'),
    genres: ['Drama'],
    directors: ['David Lynch'],
    writers: ['John Roach', 'Mary Sweeney'],
    cast: [
      'Richard Farnsworth',
      'Sissy Spacek',
      'Jane Galloway Heitz',
      'Joseph A. Carpenter',
      'Donald Wiegert',
      'Tracey Maloney',
    ],
  },
  // https://www.themoviedb.org/movie/403
  {
    title: 'Driving Miss Daisy',
    releaseDate: '1989-12-13',
    runtimeMinutes: 99,
    synopsis:
      'The story of an old Jewish widow named Daisy Werthan and her relationship with her black chauffeur, Hoke. From an initial mere work relationship grew in 25 years a strong friendship between the two very different characters, in a time when those types of relationships were shunned.',
    posterUrl: tmdbPoster('iaCzvcY42HihFxQBTZCTKMpsI0P'),
    genres: ['Drama'],
    directors: ['Bruce Beresford'],
    writers: ['Alfred Uhry'],
    cast: [
      'Morgan Freeman',
      'Jessica Tandy',
      'Dan Aykroyd',
      'Patti LuPone',
      'Esther Rolle',
      'Joann Havrilla',
    ],
  },
  // https://www.themoviedb.org/movie/475
  {
    title: 'Bonnie and Clyde',
    releaseDate: '1967-08-13',
    runtimeMinutes: 111,
    synopsis:
      'In the 1930s, bored European-American waitress Bonnie Parker falls in love with a European-American ex-con named Clyde Barrow and together they start a violent crime spree through the country, stealing cars and robbing banks.',
    posterUrl: tmdbPoster('sCSQFK9kMsprT4jgWqgw82dT6WI'),
    genres: ['Crime', 'Drama'],
    directors: ['Arthur Penn'],
    writers: ['David Newman', 'Robert Benton'],
    cast: [
      'Warren Beatty',
      'Faye Dunaway',
      'Michael J. Pollard',
      'Gene Hackman',
      'Estelle Parsons',
      'Denver Pyle',
    ],
  },
  // https://www.themoviedb.org/movie/654
  {
    title: 'On the Waterfront',
    releaseDate: '1954-06-22',
    runtimeMinutes: 108,
    synopsis:
      'A prizefighter-turned-longshoreman with a conscience goes up against labor leaders to expose corruption, extortion, and murder among the union ranks.',
    posterUrl: tmdbPoster('v1RtJ1qR4v9nrnfoBVBl6hjTW9'),
    genres: ['Crime', 'Drama', 'Romance'],
    directors: ['Elia Kazan'],
    writers: ['Budd Schulberg'],
    cast: [
      'Marlon Brando',
      'Eva Marie Saint',
      'Karl Malden',
      'Lee J. Cobb',
      'Rod Steiger',
      'Pat Henning',
    ],
  },
  // https://www.themoviedb.org/movie/234
  {
    title: 'The Cabinet of Dr. Caligari',
    releaseDate: '1920-02-27',
    runtimeMinutes: 77,
    synopsis:
      'Francis, a young man, recalls in his memory the horrible experiences he and his fiancée Jane recently went through. Francis and his friend Alan visit The Cabinet of Dr. Caligari, an exhibit where the mysterious doctor shows the somnambulist Cesare, and awakens him for some moments from his death-like sleep.',
    posterUrl: tmdbPoster('myK9DeIsXWGKgUTZyGXg2IfFk0W'),
    genres: ['Drama', 'Horror', 'Thriller', 'Crime'],
    directors: ['Robert Wiene'],
    writers: ['Carl Mayer', 'Hans Janowitz'],
    cast: [
      'Werner Krauss',
      'Conrad Veidt',
      'Friedrich Fehér',
      'Lil Dagover',
      'Hans Heinrich von Twardowski',
      'Rudolf Lettinger',
    ],
  },
  // https://www.themoviedb.org/movie/221
  {
    title: 'Rebel Without a Cause',
    releaseDate: '1955-10-27',
    runtimeMinutes: 111,
    synopsis:
      "After moving to a new town, troublemaking teen Jim Stark is supposed to have a clean slate, although being the new kid in town brings its own problems. While searching for some stability, Stark forms a bond with a disturbed classmate, Plato, and falls for local girl Judy. However, Judy is the girlfriend of neighborhood tough, Buzz. When Buzz violently confronts Jim and challenges him to a drag race, the new kid's real troubles begin.",
    posterUrl: tmdbPoster('yHStsC8rRRfIjqRN38BQsLh6S7k'),
    genres: ['Drama'],
    directors: ['Nicholas Ray'],
    writers: ['Stewart Stern'],
    cast: ['James Dean', 'Natalie Wood', 'Sal Mineo', 'Jim Backus', 'Ann Doran', 'Corey Allen'],
  },
  // https://www.themoviedb.org/movie/790
  {
    title: 'The Fog',
    releaseDate: '1980-02-01',
    runtimeMinutes: 90,
    synopsis:
      "Strange things begin to occur as a tiny California coastal town prepares to commemorate its centenary. Inanimate objects spring eerily to life; Rev. Malone stumbles upon a dark secret about the town's founding; radio announcer Stevie witnesses a mystical fire; and hitchhiker Elizabeth discovers the mutilated corpse of a fisherman. Then a mysterious iridescent fog descends upon the village, and more people start to die.",
    posterUrl: tmdbPoster('12EeSboRofP3CI4SPmMFNNXCbtY'),
    genres: ['Horror'],
    directors: ['John Carpenter'],
    writers: ['John Carpenter', 'Debra Hill'],
    cast: [
      'Adrienne Barbeau',
      'Tom Atkins',
      'Jamie Lee Curtis',
      'Hal Holbrook',
      'Janet Leigh',
      'Nancy Kyes',
    ],
  },
  // https://www.themoviedb.org/movie/1391
  {
    title: 'Y Tu Mamá También',
    releaseDate: '2001-06-08',
    runtimeMinutes: 106,
    synopsis:
      'In Mexico, two teenage boys and an attractive older woman embark on a road trip and learn a thing or two about life, friendship, sex, and each other.',
    posterUrl: tmdbPoster('aj3rqjab8jfc2fWmcS3H3c5qbur'),
    genres: ['Drama', 'Romance'],
    directors: ['Alfonso Cuarón'],
    writers: ['Alfonso Cuarón', 'Carlos Cuarón'],
    cast: [
      'Maribel Verdú',
      'Gael García Bernal',
      'Diego Luna',
      'Daniel Giménez Cacho',
      'Diana Bracho',
      'Verónica Langer',
    ],
  },
  // https://www.themoviedb.org/movie/303
  {
    title: 'Notorious',
    releaseDate: '1946-08-21',
    runtimeMinutes: 103,
    synopsis:
      'In order to help bring Nazis to justice, U.S. government agent T.R. Devlin recruits Alicia Huberman, the American daughter of a convicted German war criminal, as a spy. As they begin to fall for one another, Alicia is instructed to win the affections of Alexander Sebastian, a Nazi hiding out in Brazil. When Sebastian becomes serious about his relationship with Alicia, the stakes get higher, and Devlin must watch her slip further undercover.',
    posterUrl: tmdbPoster('4RERYb1NIQrJHYY5e8nUlYM7t2z'),
    genres: ['Romance', 'Mystery', 'Drama'],
    directors: ['Alfred Hitchcock'],
    writers: ['Ben Hecht'],
    cast: [
      'Cary Grant',
      'Ingrid Bergman',
      'Claude Rains',
      'Louis Calhern',
      'Leopoldine Konstantin',
      'Reinhold Schünzel',
    ],
  },
  // https://www.themoviedb.org/movie/512
  {
    title: 'Scoop',
    releaseDate: '2006-07-27',
    runtimeMinutes: 96,
    synopsis:
      'An American journalism student in London scoops a big story, and begins an affair with an aristocrat as the incident unfurls.',
    posterUrl: tmdbPoster('1nF290EoEn2rs4W9VVercKa4S5o'),
    genres: ['Comedy', 'Mystery'],
    directors: ['Woody Allen'],
    writers: ['Woody Allen'],
    cast: [
      'Scarlett Johansson',
      'Woody Allen',
      'Hugh Jackman',
      'Ian McShane',
      'Charles Dance',
      'Romola Garai',
    ],
  },
  // https://www.themoviedb.org/movie/635
  {
    title: 'Angel Heart',
    releaseDate: '1987-03-06',
    runtimeMinutes: 113,
    synopsis:
      'A down-and-out Brooklyn detective is hired to track down a singer on an odyssey that will take him through the desperate streets of Harlem, the smoke-filled jazz clubs of New Orleans, and the swamps of Louisiana and its seedy underworld of voodoo.',
    posterUrl: tmdbPoster('h5v3wjJQNB7q2RntEnKDLhKtTFE'),
    genres: ['Horror', 'Mystery'],
    directors: ['Alan Parker'],
    writers: ['Alan Parker'],
    cast: [
      'Mickey Rourke',
      'Robert De Niro',
      'Lisa Bonet',
      'Charlotte Rampling',
      'Stocker Fontelieu',
      'Brownie McGhee',
    ],
  },
  // https://www.themoviedb.org/movie/1266
  {
    title: 'Street Kings',
    releaseDate: '2008-04-10',
    runtimeMinutes: 109,
    synopsis:
      "Tom Ludlow is a disillusioned L.A. Police Officer, rarely playing by the rules and haunted by the death of his wife. When evidence implicates him in the execution of a fellow officer, he is forced to go up against the cop culture he's been a part of his entire career, ultimately leading him to question the loyalties of everyone around him.",
    posterUrl: tmdbPoster('iTO7sBfVTr7LUqiFtGeFW7g2Ncf'),
    genres: ['Action', 'Crime', 'Drama', 'Thriller'],
    directors: ['David Ayer'],
    writers: ['James Ellroy', 'Kurt Wimmer', 'Jamie Moss'],
    cast: [
      'Keanu Reeves',
      'Forest Whitaker',
      'Chris Evans',
      'Hugh Laurie',
      'Naomie Harris',
      'Cedric the Entertainer',
    ],
  },
  // https://www.themoviedb.org/movie/922
  {
    title: 'Dead Man',
    releaseDate: '1995-12-23',
    runtimeMinutes: 122,
    synopsis:
      'On the run after committing murder, an accountant encounters a strange Native American man who prepares him for his journey into the spiritual world.',
    posterUrl: tmdbPoster('jX3wGBVoYoAY3IixBpwYk1fjT4z'),
    genres: ['Drama', 'Fantasy', 'Western'],
    directors: ['Jim Jarmusch'],
    writers: ['Jim Jarmusch'],
    cast: [
      'Johnny Depp',
      'Gary Farmer',
      'Crispin Glover',
      'Lance Henriksen',
      'Michael Wincott',
      'Eugene Byrd',
    ],
  },
  // https://www.themoviedb.org/movie/1551
  {
    title: 'Flatliners',
    releaseDate: '1990-08-10',
    runtimeMinutes: 115,
    synopsis:
      'Five medical students experiment with "near death" experiences, until the dark consequences of past tragedies begin to jeopardize their lives.',
    posterUrl: tmdbPoster('wda3j7p7YHXKpFIlSzoTCtP7myF'),
    genres: ['Drama', 'Science Fiction', 'Horror'],
    directors: ['Joel Schumacher'],
    writers: ['Peter Filardi'],
    cast: [
      'Kiefer Sutherland',
      'Julia Roberts',
      'Kevin Bacon',
      'William Baldwin',
      'Oliver Platt',
      'Kimberly Scott',
    ],
  },
  // https://www.themoviedb.org/movie/1407
  {
    title: 'La Vie en Rose',
    releaseDate: '2007-02-14',
    runtimeMinutes: 140,
    synopsis:
      "From the mean streets of the Belleville district of Paris to the dazzling limelight of New York's most famous concert halls, Edith Piaf's life was a constant battle to sing and survive, to live and love. Raised in her grandmother's brothel, Piaf was discovered in 1935 by nightclub owner Louis Leplee, who persuaded her to sing despite her extreme nervousness. Piaf became one of France's immortal icons, her voice one of the indelible signatures of the 20th century.",
    posterUrl: tmdbPoster('3b9DAONAsFRhJKu25R33PE3VwDh'),
    genres: ['Music', 'Drama'],
    directors: ['Olivier Dahan'],
    writers: ['Olivier Dahan', 'Isabelle Sobelman'],
    cast: [
      'Marion Cotillard',
      'Sylvie Testud',
      'Pascal Greggory',
      'Emmanuelle Seigner',
      'Jean-Paul Rouve',
      'Gérard Depardieu',
    ],
  },
  // https://www.themoviedb.org/movie/150
  {
    title: '48 Hrs.',
    releaseDate: '1982-12-07',
    runtimeMinutes: 96,
    synopsis:
      'A hard-nosed cop reluctantly teams up with a wise-cracking criminal temporarily paroled to him, in order to track down a killer.',
    posterUrl: tmdbPoster('rvvjXHzEDBIvIVDBHNOwHS7hVPu'),
    genres: ['Crime', 'Action', 'Comedy'],
    directors: ['Walter Hill'],
    writers: ['Walter Hill', 'Roger Spottiswoode', 'Steven E. de Souza', 'Larry Gross'],
    cast: [
      'Nick Nolte',
      'Eddie Murphy',
      "Annette O'Toole",
      'Frank McRae',
      'James Remar',
      'David Patrick Kelly',
    ],
  },
  // https://www.themoviedb.org/movie/247
  {
    title: 'The Killing',
    releaseDate: '1956-06-06',
    runtimeMinutes: 85,
    synopsis:
      'Career criminal Johnny Clay recruits a sharpshooter, a crooked police officer, a bartender and a betting teller named George, among others, for one last job before he goes straight and gets married. But when George tells his restless wife about the scheme to steal millions from the racetrack where he works, she hatches a plot of her own.',
    posterUrl: tmdbPoster('A6VzUPcADZGYdGHlVdWvpMNDF5d'),
    genres: ['Crime', 'Thriller', 'Drama'],
    directors: ['Stanley Kubrick'],
    writers: ['Stanley Kubrick', 'Jim Thompson'],
    cast: [
      'Sterling Hayden',
      'Coleen Gray',
      'Vince Edwards',
      'Jay C. Flippen',
      'Ted de Corsia',
      'Marie Windsor',
    ],
  },
  // https://www.themoviedb.org/movie/705
  {
    title: 'All About Eve',
    releaseDate: '1950-11-09',
    runtimeMinutes: 139,
    synopsis:
      "From the moment she glimpses her idol at the stage door, Eve Harrington is determined to take the reins of power away from the great actress Margo Channing. Eve maneuvers her way into Margo's Broadway role, becomes a sensation and even causes turmoil in the lives of Margo's director boyfriend, her playwright and his wife. Only the cynical drama critic sees through Eve, admiring her audacity and perfect pattern of deceit.",
    posterUrl: tmdbPoster('blBzZaatPWVuWpXEnPscMA4Xp6m'),
    genres: ['Drama'],
    directors: ['Joseph L. Mankiewicz'],
    writers: ['Joseph L. Mankiewicz'],
    cast: [
      'Bette Davis',
      'Anne Baxter',
      'George Sanders',
      'Celeste Holm',
      'Gary Merrill',
      'Hugh Marlowe',
    ],
  },
  // https://www.themoviedb.org/movie/1430
  {
    title: 'Bowling for Columbine',
    releaseDate: '2002-10-09',
    runtimeMinutes: 120,
    synopsis:
      "This is not a film about gun control. It is a film about the fearful heart and soul of the United States, and the 280 million Americans lucky enough to have the right to a constitutionally protected Uzi. From a look at the Columbine High School security camera tapes to the home of Oscar-winning NRA President Charlton Heston, from a young man who makes homemade napalm with The Anarchist's Cookbook to the murder of a six-year-old girl by another six-year-old. Bowling for Columbine is a journey through the US, through our past, hoping to discover why our pursuit of happiness is so riddled with violence.",
    posterUrl: tmdbPoster('4XsiTsZcNCRSkee1o0fdr5OqYRT'),
    genres: ['Documentary', 'Drama'],
    directors: ['Michael Moore'],
    writers: ['Michael Moore'],
    cast: [
      'Michael Moore',
      'George H. W. Bush',
      'George W. Bush',
      'Charlton Heston',
      'Jacobo Árbenz',
      'Mike Bradley',
    ],
  },
  // https://www.themoviedb.org/movie/381
  {
    title: 'To Catch a Thief',
    releaseDate: '1955-08-03',
    runtimeMinutes: 106,
    synopsis:
      'When a string of jewel robberies hits the French Riviera, suspicion falls on retired thief John “The Cat” Robie. To clear his name, he sets out to trap the copycat himself—entangling a wealthy widow and her beguiling daughter in a seductive game of pursuit, deception, and desire.',
    posterUrl: tmdbPoster('cbMRkBGBgo3aLJK2M4MyicvkPLQ'),
    genres: ['Mystery', 'Romance', 'Thriller'],
    directors: ['Alfred Hitchcock'],
    writers: ['John Michael Hayes'],
    cast: [
      'Cary Grant',
      'Grace Kelly',
      'Jessie Royce Landis',
      'John Williams',
      'Charles Vanel',
      'Brigitte Auber',
    ],
  },
  // https://www.themoviedb.org/movie/451
  {
    title: 'Leaving Las Vegas',
    releaseDate: '1995-10-27',
    runtimeMinutes: 111,
    synopsis:
      'Ben Sanderson, an alcoholic Hollywood screenwriter who lost everything because of his drinking, arrives in Las Vegas to drink himself to death. There, he meets and forms an uneasy friendship and non-interference pact with prostitute Sera.',
    posterUrl: tmdbPoster('wTrFpGe3U65kXTldIUxuM2hmOAK'),
    genres: ['Drama', 'Romance'],
    directors: ['Mike Figgis'],
    writers: ['Mike Figgis'],
    cast: [
      'Nicolas Cage',
      'Elisabeth Shue',
      'Julian Sands',
      'Richard Lewis',
      'Steven Weber',
      'Kim Adams',
    ],
  },
  // https://www.themoviedb.org/movie/168
  {
    title: 'Star Trek IV: The Voyage Home',
    releaseDate: '1986-11-26',
    runtimeMinutes: 118,
    synopsis:
      "When a huge alien probe enters the galaxy and begins to vaporize Earth's oceans, Kirk and his crew must travel back in time in order to bring back whales and save the planet.",
    posterUrl: tmdbPoster('xY5TzGXJOB3L9rhZ1MbbPyVlW5J'),
    genres: ['Science Fiction', 'Adventure'],
    directors: ['Leonard Nimoy'],
    writers: ['Harve Bennett', 'Peter Krikes', 'Nicholas Meyer', 'Steve Meerson'],
    cast: [
      'William Shatner',
      'Leonard Nimoy',
      'DeForest Kelley',
      'James Doohan',
      'George Takei',
      'Walter Koenig',
    ],
  },
  // https://www.themoviedb.org/movie/713
  {
    title: 'The Piano',
    releaseDate: '1993-05-18',
    runtimeMinutes: 120,
    synopsis:
      'When an arranged marriage brings Ada and her spirited daughter to the wilderness of nineteenth-century New Zealand, she finds herself locked in a battle of wills with both her controlling husband and a rugged frontiersman to whom she develops a forbidden attraction.',
    posterUrl: tmdbPoster('rx8RKXn8OtuS6lqloYsjyrGOUp4'),
    genres: ['Drama', 'Romance'],
    directors: ['Jane Campion'],
    writers: ['Jane Campion'],
    cast: [
      'Holly Hunter',
      'Harvey Keitel',
      'Sam Neill',
      'Anna Paquin',
      'Cliff Curtis',
      'Kerry Walker',
    ],
  },
  // https://www.themoviedb.org/movie/398
  {
    title: 'Capote',
    releaseDate: '2005-09-30',
    runtimeMinutes: 114,
    synopsis:
      'A biopic of writer Truman Capote and his assignment for The New Yorker to write the non-fiction book "In Cold Blood".',
    posterUrl: tmdbPoster('tzsxkZMnJvozpHQEl1KzO8KwWu'),
    genres: ['Crime', 'Drama'],
    directors: ['Bennett Miller'],
    writers: ['Dan Futterman'],
    cast: [
      'Philip Seymour Hoffman',
      'Catherine Keener',
      'Clifton Collins Jr.',
      'Bruce Greenwood',
      'Bob Balaban',
      'Mark Pellegrino',
    ],
  },
  // https://www.themoviedb.org/movie/892
  {
    title: 'Delicatessen',
    releaseDate: '1991-04-17',
    runtimeMinutes: 99,
    synopsis:
      "In a post-apocalyptic world, the residents of an apartment above the butcher shop receive an occasional delicacy of meat, something that is in low supply. A young man new in town falls in love with the butcher's daughter, which causes conflicts in her family, who need the young man for other business-related purposes.",
    posterUrl: tmdbPoster('gNtOgQHxE5B8e08zuNRAdDpmK5Z'),
    genres: ['Comedy', 'Science Fiction', 'Fantasy'],
    directors: ['Jean-Pierre Jeunet', 'Marc Caro'],
    writers: ['Jean-Pierre Jeunet', 'Marc Caro', 'Gilles Adrien'],
    cast: [
      'Dominique Pinon',
      'Marie-Laure Dougnac',
      'Jean-Claude Dreyfus',
      'Karin Viard',
      'Ticky Holgado',
      'Pascal Benezech',
    ],
  },
  // https://www.themoviedb.org/movie/437
  {
    title: 'Cube 2: Hypercube',
    releaseDate: '2002-04-15',
    runtimeMinutes: 94,
    synopsis:
      'Eight strangers awaken with no memory, in a puzzling cube-shaped room where the laws of physics do not always apply.',
    posterUrl: tmdbPoster('bEqqwtwUP7lm56VyeVONhv9JtYu'),
    genres: ['Thriller', 'Science Fiction', 'Mystery'],
    directors: ['Andrzej Sekula'],
    writers: ['Lauren McLaughlin', 'Sean Hood', 'Ernie Barbarash'],
    cast: [
      'Kari Matchett',
      'Geraint Wyn Davies',
      'Grace Lynn Kung',
      'Matthew Ferguson',
      'Neil Crone',
      'Barbara Gordon',
    ],
  },
  // https://www.themoviedb.org/movie/903
  {
    title: 'Cool Hand Luke',
    releaseDate: '1967-11-01',
    runtimeMinutes: 127,
    synopsis:
      "When petty criminal Luke Jackson is sentenced to two years in a Florida prison farm, he doesn't play by the rules of either the sadistic warden or the yard's resident heavy, Dragline, who ends up admiring the new guy's unbreakable will. Luke's bravado, even in the face of repeated stints in the prison's dreaded solitary confinement cell, \"the box,\" make him a rebel hero to his fellow convicts and a thorn in the side of the prison officers.",
    posterUrl: tmdbPoster('4ykzTiHKLamh3eZJ8orVICtU2Jp'),
    genres: ['Drama', 'Crime'],
    directors: ['Stuart Rosenberg'],
    writers: ['Donn Pearce', 'Frank Pierson', 'Hal Dresner'],
    cast: [
      'Paul Newman',
      'George Kennedy',
      'Luke Askew',
      'Morgan Woodward',
      'Harry Dean Stanton',
      'Dennis Hopper',
    ],
  },
  // https://www.themoviedb.org/movie/535
  {
    title: 'Flashdance',
    releaseDate: '1983-04-14',
    runtimeMinutes: 95,
    synopsis:
      'Alex Owens, a young woman juggling between two odd jobs, aspires to become a successful ballet dancer. Nick, who is her boss and lover, supports and encourages her to fulfil her dream.',
    posterUrl: tmdbPoster('ziiy6ORt8BlxWFXskBChBMInvDA'),
    genres: ['Drama', 'Romance'],
    directors: ['Adrian Lyne'],
    writers: ['Thomas Hedley Jr.', 'Joe Eszterhas'],
    cast: [
      'Jennifer Beals',
      'Michael Nouri',
      'Sunny Johnson',
      'Kyle T. Heffner',
      'Cynthia Rhodes',
      'Lee Ving',
    ],
  },
  // https://www.themoviedb.org/movie/1480
  {
    title: 'Touch of Evil',
    releaseDate: '1958-03-30',
    runtimeMinutes: 111,
    synopsis:
      'A border-town bombing draws Mexican investigator Miguel Vargas into a corruption-ridden police investigation led by crooked captain Hank Quinlan, setting off a deadly struggle over power, justice, and truth.',
    posterUrl: tmdbPoster('1pvRgmfBaoMczIJBOi9gCOZ4FMC'),
    genres: ['Crime', 'Thriller', 'Drama'],
    directors: ['Orson Welles'],
    writers: ['Orson Welles'],
    cast: [
      'Charlton Heston',
      'Janet Leigh',
      'Orson Welles',
      'Joseph Calleia',
      'Akim Tamiroff',
      'Joanna Moore',
    ],
  },
  // https://www.themoviedb.org/movie/201
  {
    title: 'Star Trek: Nemesis',
    releaseDate: '2002-12-13',
    runtimeMinutes: 116,
    synopsis:
      'En route to the honeymoon of William Riker to Deanna Troi on her home planet of Betazed, Captain Jean-Luc Picard and the crew of the U.S.S. Enterprise receives word from Starfleet that a coup has resulted in the installation of a new Romulan political leader, Shinzon, who claims to seek peace with the human-backed United Federation of Planets. Once in enemy territory, the captain and his crew make a startling discovery: Shinzon is human, a slave from the Romulan sister planet of Remus, and has a secret, shocking relationship to Picard himself.',
    posterUrl: tmdbPoster('cldAwhvBmOv9jrd3bXWuqRHoXyq'),
    genres: ['Science Fiction', 'Action', 'Adventure', 'Thriller'],
    directors: ['Stuart Baird'],
    writers: ['John Logan'],
    cast: [
      'Patrick Stewart',
      'Jonathan Frakes',
      'Brent Spiner',
      'LeVar Burton',
      'Michael Dorn',
      'Gates McFadden',
    ],
  },
  // https://www.themoviedb.org/movie/838
  {
    title: 'American Graffiti',
    releaseDate: '1973-08-11',
    runtimeMinutes: 112,
    synopsis:
      'A couple of high school graduates spend one final night cruising the strip with their buddies before they go off to college.',
    posterUrl: tmdbPoster('1tjLivPad2PX8FAzWko7FPIb8d2'),
    genres: ['Comedy', 'Drama'],
    directors: ['George Lucas'],
    writers: ['George Lucas', 'Willard Huyck', 'Gloria Katz'],
    cast: [
      'Richard Dreyfuss',
      'Ron Howard',
      'Paul Le Mat',
      'Charles Martin Smith',
      'Cindy Williams',
      'Candy Clark',
    ],
  },
  // https://www.themoviedb.org/movie/179
  {
    title: 'The Interpreter',
    releaseDate: '2005-04-08',
    runtimeMinutes: 128,
    synopsis:
      'After Silvia Broome, an interpreter at United Nations headquarters, overhears plans of an assassination, an American Secret Service agent is sent to investigate.',
    posterUrl: tmdbPoster('wTidq3J9fh8sEOAlD8WZFHVLSuB'),
    genres: ['Crime', 'Thriller'],
    directors: ['Sydney Pollack'],
    writers: ['Charles Randolph', 'Scott Frank', 'Steven Zaillian'],
    cast: [
      'Nicole Kidman',
      'Sean Penn',
      'Catherine Keener',
      'Jesper Christensen',
      'Yvan Attal',
      'Earl Cameron',
    ],
  },
  // https://www.themoviedb.org/movie/1548
  {
    title: 'Ghost World',
    releaseDate: '2001-07-20',
    runtimeMinutes: 111,
    synopsis:
      'Two quirky, cynical teenaged girls try to figure out what to do with their lives after high school graduation. After they play a prank on an eccentric, middle aged record collector, one of them befriends him, which causes a rift in the girls’ friendship.',
    posterUrl: tmdbPoster('uwKqnUPE4dSM0kKuMW0vXpURh2T'),
    genres: ['Comedy', 'Drama'],
    directors: ['Terry Zwigoff'],
    writers: ['Terry Zwigoff', 'Daniel Clowes'],
    cast: [
      'Thora Birch',
      'Scarlett Johansson',
      'Steve Buscemi',
      'Brad Renfro',
      'Illeana Douglas',
      'Bob Balaban',
    ],
  },
  // https://www.themoviedb.org/movie/175
  {
    title: 'The Big Blue',
    releaseDate: '1988-05-10',
    runtimeMinutes: 168,
    synopsis:
      'Childhood friends Jacques and Enzo share a passion for the danger of free diving. Jacques, following in the footsteps of his father, who died at sea when Jacques was a boy, harbors a remarkable ability to adjust his heart rate and breathing patterns in the water, with his vital signs more closely resembling those of dolphins than men.',
    posterUrl: tmdbPoster('3t5t7yaFiTJQlqxiTkXJMFZdkh3'),
    genres: ['Romance', 'Adventure', 'Drama'],
    directors: ['Luc Besson'],
    writers: ['Luc Besson', 'Jacques Mayol', 'Robert Garland', 'Marc Perrier', 'Marilyn Goldin'],
    cast: [
      'Rosanna Arquette',
      'Jean-Marc Barr',
      'Jean Reno',
      'Paul Shenar',
      'Sergio Castellitto',
      'Jean Bouise',
    ],
  },
  // https://www.themoviedb.org/movie/1696
  {
    title: "The Devil's Rejects",
    releaseDate: '2005-07-22',
    runtimeMinutes: 111,
    synopsis:
      'The murderous, backwoods Firefly family take to the road to escape the vengeful Sheriff Wydell, who is not afraid of being as ruthless as his target.',
    posterUrl: tmdbPoster('drZz4AuI7trq6BxlH9Xa4v4O0Pb'),
    genres: ['Drama', 'Horror', 'Crime'],
    directors: ['Rob Zombie'],
    writers: ['Rob Zombie'],
    cast: [
      'Sid Haig',
      'Bill Moseley',
      'Sheri Moon Zombie',
      'William Forsythe',
      'Ken Foree',
      'Matthew McGrory',
    ],
  },
  // https://www.themoviedb.org/movie/227
  {
    title: 'The Outsiders',
    releaseDate: '1983-03-25',
    runtimeMinutes: 91,
    synopsis:
      'In 1960s Tulsa, class divisions ignite a violent rivalry between the working-class Greasers and the privileged Socs. When a deadly encounter forces two Greasers, Ponyboy and Johnny, to flee, their struggle for survival and redemption exposes the fragile innocence and enduring bonds of youth on the wrong side of town.',
    posterUrl: tmdbPoster('l9os0HcXY8BOkvUWAx4rvby3j6L'),
    genres: ['Crime', 'Drama'],
    directors: ['Francis Ford Coppola'],
    writers: ['Kathleen Rowell'],
    cast: [
      'C. Thomas Howell',
      'Matt Dillon',
      'Ralph Macchio',
      'Patrick Swayze',
      'Rob Lowe',
      'Emilio Estevez',
    ],
  },
  // https://www.themoviedb.org/movie/574
  {
    title: 'The Man Who Knew Too Much',
    releaseDate: '1956-05-16',
    runtimeMinutes: 121,
    synopsis:
      'An American doctor and his wife, a former singing star, witness a murder while vacationing in Morocco, and are drawn into a twisting plot of international intrigue when their young son is kidnapped.',
    posterUrl: tmdbPoster('gy8YBRjCQRIT9x9G9F5fpnFD4xw'),
    genres: ['Thriller', 'Mystery', 'Drama'],
    directors: ['Alfred Hitchcock'],
    writers: ['John Michael Hayes'],
    cast: [
      'James Stewart',
      'Doris Day',
      'Brenda De Banzie',
      'Bernard Miles',
      'Ralph Truman',
      'Daniel Gélin',
    ],
  },
  // https://www.themoviedb.org/movie/110
  {
    title: 'Three Colors: Red',
    releaseDate: '1994-05-12',
    runtimeMinutes: 100,
    synopsis:
      'Part-time model Valentine unexpectedly befriends a retired judge after she runs over his dog. At first, the grumpy man shows no concern about the dog, and Valentine decides to keep it. But the two form a bond when she returns to his house and catches him listening to his neighbors’ phone calls.',
    posterUrl: tmdbPoster('JHmsBiX1tjCKqAul1lzC20WcAW'),
    genres: ['Drama', 'Mystery', 'Romance'],
    directors: ['Krzysztof Kieślowski'],
    writers: ['Krzysztof Kieślowski', 'Krzysztof Piesiewicz'],
    cast: [
      'Irène Jacob',
      'Jean-Louis Trintignant',
      'Frédérique Feder',
      'Jean-Pierre Lorit',
      'Samuel Le Bihan',
      'Marion Stalens',
    ],
  },
  // https://www.themoviedb.org/movie/1090
  {
    title: 'The Thirteenth Floor',
    releaseDate: '1999-04-16',
    runtimeMinutes: 100,
    synopsis:
      'In Los Angeles, a wealthy man, known as Mr. Fuller, discovers a shocking secret about the world he lives in. Fearing for his life, he leaves a desperate message for a friend of his in the most unexpected place.',
    posterUrl: tmdbPoster('7oaie3ZBc9UuWZLF24crro1pone'),
    genres: ['Thriller', 'Science Fiction', 'Mystery'],
    directors: ['Josef Rusnak'],
    writers: ['Josef Rusnak', 'Ravel Centeno-Rodriguez'],
    cast: [
      'Craig Bierko',
      'Armin Mueller-Stahl',
      'Gretchen Mol',
      "Vincent D'Onofrio",
      'Dennis Haysbert',
      'Steven Schub',
    ],
  },
  // https://www.themoviedb.org/movie/606
  {
    title: 'Out of Africa',
    releaseDate: '1985-12-20',
    runtimeMinutes: 161,
    synopsis:
      'Tells the life story of Danish author Karen Blixen, who at the beginning of the 20th century moved to Africa to build a new life for herself. The film is based on her 1937 autobiographical novel.',
    posterUrl: tmdbPoster('6oMKqh08TfxmvnoFR4mm1wZB67P'),
    genres: ['History', 'Romance', 'Drama'],
    directors: ['Sydney Pollack'],
    writers: ['Kurt Luedtke'],
    cast: [
      'Robert Redford',
      'Meryl Streep',
      'Klaus Maria Brandauer',
      'Michael Kitchen',
      'Malick Bowens',
      'Michael Gough',
    ],
  },
  // https://www.themoviedb.org/movie/1642
  {
    title: 'The Net',
    releaseDate: '1995-07-28',
    runtimeMinutes: 114,
    synopsis:
      "Angela Bennett is a freelance computer systems analyst who tracks down software viruses. At night she hooks up to the internet and chats to others 'surfing the net'. While de-bugging a new high-tech game for a cyber friend, she comes across a top secret program and becomes the target of a mysterious organization who will stop at nothing to erase her identity and her existence, in order to protect the project.",
    posterUrl: tmdbPoster('dtupntUFMD5iXBo8HLfALt2ET4R'),
    genres: ['Crime', 'Drama', 'Mystery', 'Thriller', 'Action'],
    directors: ['Irwin Winkler'],
    writers: ['John Brancato', 'Michael Ferris'],
    cast: [
      'Sandra Bullock',
      'Jeremy Northam',
      'Dennis Miller',
      'Wendy Gazelle',
      'Diane Baker',
      'Ken Howard',
    ],
  },
  // https://www.themoviedb.org/movie/157
  {
    title: 'Star Trek III: The Search for Spock',
    releaseDate: '1984-06-01',
    runtimeMinutes: 105,
    synopsis:
      "A surprise visit from Spock's father provides a startling revelation: McCoy is harboring Spock's living essence.",
    posterUrl: tmdbPoster('yqEj0oPfKBMCz7YcCARHDgH7VFm'),
    genres: ['Science Fiction', 'Action', 'Adventure', 'Thriller'],
    directors: ['Leonard Nimoy'],
    writers: ['Harve Bennett'],
    cast: [
      'William Shatner',
      'DeForest Kelley',
      'James Doohan',
      'George Takei',
      'Walter Koenig',
      'Nichelle Nichols',
    ],
  },
  // https://www.themoviedb.org/movie/1245
  {
    title: 'The Remains of the Day',
    releaseDate: '1993-11-05',
    runtimeMinutes: 134,
    synopsis:
      "A rule-bound head butler's world of manners and decorum in the household he maintains is tested by the arrival of a housekeeper who falls in love with him in post-WWI Britain. The possibility of romance and his master's cultivation of ties with the Nazi cause challenge his carefully maintained veneer of servitude.",
    posterUrl: tmdbPoster('uDGDtqSvuch324WnM7Ukdp1bCAQ'),
    genres: ['Drama', 'Romance'],
    directors: ['James Ivory'],
    writers: ['Ruth Prawer Jhabvala'],
    cast: [
      'Anthony Hopkins',
      'Emma Thompson',
      'James Fox',
      'Christopher Reeve',
      'Hugh Grant',
      'Peter Vaughan',
    ],
  },
  // https://www.themoviedb.org/movie/687
  {
    title: 'Dead Man Walking',
    releaseDate: '1995-12-29',
    runtimeMinutes: 122,
    synopsis:
      'A death row inmate turns for spiritual guidance to a local nun in the days leading up to his scheduled execution for the murders of a young couple.',
    posterUrl: tmdbPoster('eShxyjhWoFl3BwsuEmVsr4nLaMZ'),
    genres: ['Drama'],
    directors: ['Tim Robbins'],
    writers: ['Tim Robbins'],
    cast: [
      'Susan Sarandon',
      'Sean Penn',
      'Robert Prosky',
      'Raymond J. Barry',
      'R. Lee Ermey',
      'Celia Weston',
    ],
  },
  // https://www.themoviedb.org/movie/193
  {
    title: 'Star Trek: Generations',
    releaseDate: '1994-11-18',
    runtimeMinutes: 118,
    synopsis:
      "Captain Jean-Luc Picard and the crew of the Enterprise-D find themselves at odds with the renegade scientist Soran who is destroying entire star systems. Only one man can help Picard stop Soran's scheme...and he's been dead for seventy-eight years.",
    posterUrl: tmdbPoster('gh0ZZRwSmlzEZTIZee3ZCN9Jssx'),
    genres: ['Science Fiction', 'Action', 'Adventure', 'Thriller'],
    directors: ['David Carson'],
    writers: ['Ronald D. Moore', 'Brannon Braga'],
    cast: [
      'Patrick Stewart',
      'Jonathan Frakes',
      'Brent Spiner',
      'LeVar Burton',
      'Michael Dorn',
      'Gates McFadden',
    ],
  },
  // https://www.themoviedb.org/movie/231
  {
    title: 'Syriana',
    releaseDate: '2005-11-23',
    runtimeMinutes: 128,
    synopsis:
      'The Middle Eastern oil industry is the backdrop of this tense drama, which weaves together numerous story lines. Bennett Holiday is an American lawyer in charge of facilitating a dubious merger of oil companies, while Bryan Woodman, a Switzerland-based energy analyst, experiences both personal tragedy and opportunity during a visit with Arabian royalty. Meanwhile, veteran CIA agent Bob Barnes uncovers an assassination plot with unsettling origins.',
    posterUrl: tmdbPoster('mO3hWUTOxmLJxihvDU0YFkb0Mb5'),
    genres: ['Drama', 'Thriller'],
    directors: ['Stephen Gaghan'],
    writers: ['Stephen Gaghan'],
    cast: [
      'George Clooney',
      'Matt Damon',
      'Jeffrey Wright',
      'Chris Cooper',
      'Amanda Peet',
      'William Hurt',
    ],
  },
  // https://www.themoviedb.org/movie/144
  {
    title: 'Wings of Desire',
    releaseDate: '1987-09-23',
    runtimeMinutes: 128,
    synopsis:
      'Two angels, Damiel and Cassiel, glide through the streets of Berlin, observing the bustling population, providing invisible rays of hope to the distressed but never interacting with them. When Damiel falls in love with lonely trapeze artist Marion, the angel longs to experience life in the physical world, and finds — with some words of wisdom from actor Peter Falk — that it might be possible for him to take human form.',
    posterUrl: tmdbPoster('iZQs2vUeCzvS1KfZJ6uYNCGJBBV'),
    genres: ['Drama', 'Fantasy', 'Romance'],
    directors: ['Wim Wenders'],
    writers: ['Wim Wenders', 'Peter Handke', 'Richard Reitinger', 'Bernard Eisenschitz'],
    cast: [
      'Bruno Ganz',
      'Solveig Dommartin',
      'Otto Sander',
      'Curt Bois',
      'Peter Falk',
      'Hans Martin Stier',
    ],
  },
  // https://www.themoviedb.org/movie/308
  {
    title: 'Broken Flowers',
    releaseDate: '2005-07-31',
    runtimeMinutes: 106,
    synopsis:
      'An introverted man receives an anonymous letter from an ex-lover informing him that he has a son who may be looking for him. A freelance sleuth neighbor motivates the man to embark on a cross-country search for his past flames, seeking answers.',
    posterUrl: tmdbPoster('gd8JNjwgiM6ZgGm6NFAkovQWoYn'),
    genres: ['Comedy', 'Drama', 'Mystery', 'Romance'],
    directors: ['Jim Jarmusch'],
    writers: ['Jim Jarmusch'],
    cast: [
      'Bill Murray',
      'Sharon Stone',
      'Jessica Lange',
      'Tilda Swinton',
      'Frances Conroy',
      'Alexis Dziena',
    ],
  },
  // https://www.themoviedb.org/movie/702
  {
    title: 'A Streetcar Named Desire',
    releaseDate: '1951-09-18',
    runtimeMinutes: 122,
    synopsis:
      'A disturbed, aging Southern belle moves in with her sister for solace — but being face-to-face with her brutish brother-in-law accelerates her downward spiral.',
    posterUrl: tmdbPoster('aicdlO5vt7z2ARm279eGzJeYCLQ'),
    genres: ['Drama', 'Thriller'],
    directors: ['Elia Kazan'],
    writers: ['Oscar Saul', 'Tennessee Williams'],
    cast: [
      'Vivien Leigh',
      'Marlon Brando',
      'Kim Hunter',
      'Karl Malden',
      'Rudy Bond',
      'Nick Dennis',
    ],
  },
  // https://www.themoviedb.org/movie/1685
  {
    title: 'Beneath the Planet of the Apes',
    releaseDate: '1970-04-23',
    runtimeMinutes: 95,
    synopsis:
      'The sole survivor of an interplanetary rescue mission lands on the planet of the apes, and uncovers a horrible secret beneath the surface.',
    posterUrl: tmdbPoster('szHCeYwi4ubewuYnlnz0YGqWnQC'),
    genres: ['Adventure', 'Science Fiction', 'Mystery'],
    directors: ['Ted Post'],
    writers: ['Paul Dehn', 'Mort Abrahams'],
    cast: [
      'James Franciscus',
      'Kim Hunter',
      'Maurice Evans',
      'Charlton Heston',
      'Linda Harrison',
      'Paul Richards',
    ],
  },
  // https://www.themoviedb.org/movie/1633
  {
    title: 'Fried Green Tomatoes',
    releaseDate: '1991-12-27',
    runtimeMinutes: 130,
    synopsis:
      'Amidst her own personality crisis, a southern housewife meets an outgoing old woman who tells her the story of Idgie Threadgoode and Ruth Jamison, two young women who experienced hardships and love in 1920s Whistle Stop, Alabama.',
    posterUrl: tmdbPoster('g71l1vbJwyAAYk8zKCkIQQ58qcb'),
    genres: ['Drama', 'Comedy'],
    directors: ['Jon Avnet'],
    writers: ['Fannie Flagg', 'Carol Sobieski'],
    cast: [
      'Kathy Bates',
      'Jessica Tandy',
      'Mary-Louise Parker',
      'Mary Stuart Masterson',
      'Cicely Tyson',
      'Stan Shaw',
    ],
  },
  // https://www.themoviedb.org/movie/177
  {
    title: 'The Fisher King',
    releaseDate: '1991-09-20',
    runtimeMinutes: 138,
    synopsis:
      'Two troubled men face their terrible destinies and events of their past as they join together on a mission to find the Holy Grail and thus to save themselves.',
    posterUrl: tmdbPoster('hwIYw22HmAUMobV4zsX69MgfVUz'),
    genres: ['Comedy', 'Drama'],
    directors: ['Terry Gilliam'],
    writers: ['Richard LaGravenese'],
    cast: [
      'Robin Williams',
      'Jeff Bridges',
      'Amanda Plummer',
      'Mercedes Ruehl',
      'Michael Jeter',
      'William Jay Marshall',
    ],
  },
  // https://www.themoviedb.org/movie/226
  {
    title: "Boys Don't Cry",
    releaseDate: '1999-09-02',
    runtimeMinutes: 118,
    synopsis:
      'A young transgender man explores his gender identity and searches for love in rural Nebraska.',
    posterUrl: tmdbPoster('eB505ycEhFVfMwGglIzXNUyKAIs'),
    genres: ['Crime', 'Drama'],
    directors: ['Kimberly Peirce'],
    writers: ['Kimberly Peirce', 'Andy Bienen'],
    cast: [
      'Hilary Swank',
      'Chloë Sevigny',
      'Peter Sarsgaard',
      'Brendan Sexton III',
      'Alicia Goranson',
      'Alison Folland',
    ],
  },
  // https://www.themoviedb.org/movie/479
  {
    title: 'Shaft',
    releaseDate: '2000-06-15',
    runtimeMinutes: 99,
    synopsis:
      "New York police detective John Shaft arrests Walter Wade Jr. for a racially motivated slaying. But the only eyewitness disappears, and Wade jumps bail for Switzerland. Two years later Wade returns to face trial, confident his money and influence will get him acquitted -- especially since he's paid a drug kingpin to kill the witness.",
    posterUrl: tmdbPoster('5ncvnNPaN73cOqD4muE413sSOyY'),
    genres: ['Action', 'Adventure', 'Crime', 'Thriller'],
    directors: ['John Singleton'],
    writers: ['John Singleton', 'Shane Salerno', 'Richard Price'],
    cast: [
      'Samuel L. Jackson',
      'Vanessa Williams',
      'Jeffrey Wright',
      'Christian Bale',
      'Busta Rhymes',
      'Dan Hedaya',
    ],
  },
  // https://www.themoviedb.org/movie/64
  {
    title: 'Talk to Her',
    releaseDate: '2002-03-15',
    runtimeMinutes: 112,
    synopsis:
      'Two men share an odd friendship while they care for two women who are both in deep comas.',
    posterUrl: tmdbPoster('fWDbQlOWOqjR5jZm98KjGyYmUOw'),
    genres: ['Drama', 'Romance'],
    directors: ['Pedro Almodóvar'],
    writers: ['Pedro Almodóvar'],
    cast: [
      'Javier Cámara',
      'Darío Grandinetti',
      'Leonor Watling',
      'Rosario Flores',
      'Mariola Fuentes',
      'Geraldine Chaplin',
    ],
  },
  // https://www.themoviedb.org/movie/1165
  {
    title: 'The Queen',
    releaseDate: '2006-09-15',
    runtimeMinutes: 103,
    synopsis:
      "The Queen is an intimate behind the scenes glimpse at the interaction between HM Elizabeth II and Prime Minister Tony Blair during their struggle, following the death of Diana, to reach a compromise between what was a private tragedy for the Royal family and the public's demand for an overt display of mourning.",
    posterUrl: tmdbPoster('v08RH5Cx9EFAQMBWQuE5jHAgHYs'),
    genres: ['Drama', 'History'],
    directors: ['Stephen Frears'],
    writers: ['Peter Morgan'],
    cast: [
      'Helen Mirren',
      'Michael Sheen',
      'James Cromwell',
      'Helen McCrory',
      'Alex Jennings',
      'Roger Allam',
    ],
  },
  // https://www.themoviedb.org/movie/1653
  {
    title: 'The Motorcycle Diaries',
    releaseDate: '2004-02-06',
    runtimeMinutes: 126,
    synopsis:
      'Based on the journals of Che Guevara, leader of the Cuban Revolution. In his memoirs, Guevara recounts adventures he and best friend Alberto Granado had while crossing South America by motorcycle in the early 1950s.',
    posterUrl: tmdbPoster('qz2aBYT8CAiJYvX4fRZpJ5G0Oz1'),
    genres: ['Drama'],
    directors: ['Walter Salles'],
    writers: ['Jose Rivera'],
    cast: [
      'Gael García Bernal',
      'Rodrigo de la Serna',
      'Mercedes Morán',
      'Mía Maestro',
      'Jean Pierre Noher',
      'Lucas Oro',
    ],
  },
  // https://www.themoviedb.org/movie/174
  {
    title: 'Star Trek VI: The Undiscovered Country',
    releaseDate: '1991-12-06',
    runtimeMinutes: 110,
    synopsis:
      'After years of war, the Federation and the Klingon empire find themselves on the brink of a peace summit when a Klingon ship is nearly destroyed by an apparent attack from the Enterprise. Both worlds brace for what may be their deadliest encounter.',
    posterUrl: tmdbPoster('tvTOJD7Gz668GLy2nNdLRQvpPsv'),
    genres: ['Science Fiction', 'Action', 'Adventure', 'Thriller'],
    directors: ['Nicholas Meyer'],
    writers: ['Nicholas Meyer', 'Denny Martin Flinn'],
    cast: [
      'William Shatner',
      'Leonard Nimoy',
      'DeForest Kelley',
      'James Doohan',
      'Walter Koenig',
      'Nichelle Nichols',
    ],
  },
  // https://www.themoviedb.org/movie/850
  {
    title: 'A Christmas Story',
    releaseDate: '1983-11-18',
    runtimeMinutes: 93,
    synopsis:
      'The comic mishaps and adventures of a young boy named Ralph, trying to convince his parents, teachers, and Santa that a Red Ryder B.B. gun really is the perfect Christmas gift for the 1940s.',
    posterUrl: tmdbPoster('34nSHYqmb7222tiqiuKqKJmZiQa'),
    genres: ['Comedy', 'Family'],
    directors: ['Bob Clark'],
    writers: ['Bob Clark', 'Jean Shepherd', 'Leigh Brown'],
    cast: [
      'Melinda Dillon',
      'Darren McGavin',
      'Peter Billingsley',
      'Jean Shepherd',
      'Ian Petrella',
      'Scott Schwartz',
    ],
  },
  // https://www.themoviedb.org/movie/961
  {
    title: 'The General',
    releaseDate: '1926-12-25',
    runtimeMinutes: 79,
    synopsis:
      "During America’s Civil War, Union spies steal engineer Johnny Gray's beloved locomotive, 'The General'—with Johnnie's lady love aboard an attached boxcar—and he single-handedly must do all in his power to both get The General back and to rescue Annabelle.",
    posterUrl: tmdbPoster('nIp4gIXogCjfB1QABNsWwa9gSca'),
    genres: ['Comedy', 'War', 'Romance'],
    directors: ['Buster Keaton', 'Clyde Bruckman'],
    writers: ['Buster Keaton', 'Clyde Bruckman'],
    cast: [
      'Buster Keaton',
      'Marion Mack',
      'Glen Cavender',
      'Jim Farley',
      'Frederick Vroom',
      'Frank Barnes',
    ],
  },
  // https://www.themoviedb.org/movie/1389
  {
    title: 'Out of Sight',
    releaseDate: '1998-06-26',
    runtimeMinutes: 123,
    synopsis:
      "Meet Jack Foley, a smooth criminal who bends the law and is determined to make one last heist. Karen Sisco is a federal marshal who chooses all the right moves … and all the wrong guys. Now they're willing to risk it all to find out if there's more between them than just the law.",
    posterUrl: tmdbPoster('v49q7AMR3pB4M762woWB1NYMCLF'),
    genres: ['Romance', 'Comedy', 'Crime'],
    directors: ['Steven Soderbergh'],
    writers: ['Scott Frank'],
    cast: [
      'George Clooney',
      'Jennifer Lopez',
      'Ving Rhames',
      'Don Cheadle',
      'Steve Zahn',
      'Dennis Farina',
    ],
  },
  // https://www.themoviedb.org/movie/138
  {
    title: 'Dracula',
    releaseDate: '1931-02-12',
    runtimeMinutes: 74,
    synopsis:
      'A British estate agent travels to Transylvania to meet the mysterious Count Dracula, who is interested in leasing a London castle. After Dracula enslaves the agent and drives him to insanity, the pair return to London together, where Dracula, a secret bloodsucker, begins preying on socialites.',
    posterUrl: tmdbPoster('ueVSPt7vAba0XScHWTDWS5tNxYX'),
    genres: ['Horror'],
    directors: ['Tod Browning'],
    writers: [
      'Tod Browning',
      'Garrett Fort',
      'Louis Bromfield',
      'Frederick Stephani',
      'Louis Stevens',
    ],
    cast: [
      'Bela Lugosi',
      'Helen Chandler',
      'David Manners',
      'Dwight Frye',
      'Edward Van Sloan',
      'Herbert Bunston',
    ],
  },
  // https://www.themoviedb.org/movie/884
  {
    title: 'Crash',
    releaseDate: '1996-07-17',
    runtimeMinutes: 100,
    synopsis:
      'A car crash victim inexplicably finds himself aroused by car accidents and becomes involved with an underground subculture of like-minded souls.',
    posterUrl: tmdbPoster('gpai5oUFyFGLHOCsYTvVMqlbY7A'),
    genres: ['Thriller', 'Drama'],
    directors: ['David Cronenberg'],
    writers: ['David Cronenberg'],
    cast: [
      'James Spader',
      'Holly Hunter',
      'Elias Koteas',
      'Deborah Kara Unger',
      'Rosanna Arquette',
      'Peter MacNeill',
    ],
  },
  // https://www.themoviedb.org/movie/1052
  {
    title: 'Blow-Up',
    releaseDate: '1966-12-18',
    runtimeMinutes: 111,
    synopsis:
      'A successful mod photographer in London whose world is bounded by fashion, pop music, marijuana, and easy sex, feels his life is boring and despairing. But in the course of a single day he unknowingly captures a death on film.',
    posterUrl: tmdbPoster('jVDVpydUw8Z50naUDAG4NbRCrSa'),
    genres: ['Drama', 'Mystery', 'Thriller'],
    directors: ['Michelangelo Antonioni'],
    writers: ['Michelangelo Antonioni', 'Tonino Guerra'],
    cast: [
      'David Hemmings',
      'Vanessa Redgrave',
      'Sarah Miles',
      'John Castle',
      'Veruschka von Lehndorff',
      'Jane Birkin',
    ],
  },
  // https://www.themoviedb.org/movie/1433
  {
    title: "The Devil's Backbone",
    releaseDate: '2001-04-20',
    runtimeMinutes: 108,
    synopsis:
      'Spain, 1939. In the last days of the Spanish Civil War, the young Carlos arrives at the Santa Lucía orphanage, where he will make friends and enemies as he follows the quiet footsteps of a mysterious presence eager for revenge.',
    posterUrl: tmdbPoster('iP1z1aJzPnkP8FHg77TS7ukqoEZ'),
    genres: ['Fantasy', 'Drama', 'Horror', 'Thriller'],
    directors: ['Guillermo del Toro'],
    writers: ['Guillermo del Toro', 'David Muñoz', 'Antonio Trashorras'],
    cast: [
      'Marisa Paredes',
      'Eduardo Noriega',
      'Federico Luppi',
      'Fernando Tielve',
      'Íñigo Garcés',
      'Irene Visedo',
    ],
  },
  // https://www.themoviedb.org/movie/913
  {
    title: 'The Thomas Crown Affair',
    releaseDate: '1999-08-06',
    runtimeMinutes: 113,
    synopsis:
      'Bored billionaire executive Thomas Crown decides to plan a robbery and assigns a professional agent with the right information to the job. However, Crown is soon betrayed yet cannot blow his cover as he’s fallen in love.',
    posterUrl: tmdbPoster('5yqs1MVlqdIg1DY5adC5jFx3d7j'),
    genres: ['Drama', 'Crime', 'Romance'],
    directors: ['John McTiernan'],
    writers: ['Leslie Dixon', 'Kurt Wimmer'],
    cast: [
      'Pierce Brosnan',
      'Rene Russo',
      'Denis Leary',
      'Frankie Faison',
      'Faye Dunaway',
      'Esther Cañadas',
    ],
  },
  // https://www.themoviedb.org/movie/1649
  {
    title: "Bill & Ted's Bogus Journey",
    releaseDate: '1991-07-19',
    runtimeMinutes: 93,
    synopsis:
      'Amiable slackers Bill and Ted are once again roped into a fantastical adventure when De Nomolos, a villain from the future, sends evil robot duplicates of the two lads to terminate and replace them. The robot doubles actually succeed in killing Bill and Ted, but the two are determined to escape the afterlife, challenging the Grim Reaper to a series of games in order to return to the land of the living.',
    posterUrl: tmdbPoster('tldtDfLnPFOtTWp758EmIP2Hbz5'),
    genres: ['Adventure', 'Comedy', 'Science Fiction'],
    directors: ['Peter Hewitt'],
    writers: ['Chris Matheson', 'Ed Solomon'],
    cast: [
      'Keanu Reeves',
      'Alex Winter',
      'William Sadler',
      'Joss Ackland',
      'Pam Grier',
      'George Carlin',
    ],
  },
  // https://www.themoviedb.org/movie/200
  {
    title: 'Star Trek: Insurrection',
    releaseDate: '1998-12-11',
    runtimeMinutes: 103,
    synopsis:
      'When an alien race and factions within Starfleet attempt to take over a planet that has "regenerative" properties, it falls upon Captain Picard and the crew of the Enterprise to defend the planet\'s people as well as the very ideals upon which the Federation itself was founded.',
    posterUrl: tmdbPoster('xQCMAHeg5M9HpDIqanYbWdr4brB'),
    genres: ['Science Fiction', 'Action', 'Adventure', 'Thriller'],
    directors: ['Jonathan Frakes'],
    writers: ['Michael Piller'],
    cast: [
      'Patrick Stewart',
      'Brent Spiner',
      'Michael Dorn',
      'Jonathan Frakes',
      'F. Murray Abraham',
      'Anthony Zerbe',
    ],
  },
  // https://www.themoviedb.org/movie/576
  {
    title: 'The Wild Bunch',
    releaseDate: '1969-06-19',
    runtimeMinutes: 145,
    synopsis:
      'An aging group of outlaws look for one last big score as the "traditional" American West is disappearing around them.',
    posterUrl: tmdbPoster('8j9yEC3xjy1PJDSizIbaxcHaSph'),
    genres: ['Western'],
    directors: ['Sam Peckinpah'],
    writers: ['Sam Peckinpah', 'Walon Green'],
    cast: [
      'William Holden',
      'Ernest Borgnine',
      'Robert Ryan',
      'Jaime Sánchez',
      'Warren Oates',
      "Edmond O'Brien",
    ],
  },
  // https://www.themoviedb.org/movie/1643
  {
    title: 'Last Tango in Paris',
    releaseDate: '1972-12-15',
    runtimeMinutes: 129,
    synopsis:
      'A recently widowed American begins an anonymous sexual relationship with a young Parisian woman.',
    posterUrl: tmdbPoster('dNgdUdNOWfHsZI3lDu6Epig7H2P'),
    genres: ['Drama', 'Romance'],
    directors: ['Bernardo Bertolucci'],
    writers: ['Bernardo Bertolucci', 'Franco Arcalli'],
    cast: [
      'Marlon Brando',
      'Maria Schneider',
      'Maria Michi',
      'Giovanna Galletti',
      'Jean-Pierre Léaud',
      'Gitt Magrini',
    ],
  },
  // https://www.themoviedb.org/movie/1654
  {
    title: 'The Dirty Dozen',
    releaseDate: '1967-06-15',
    runtimeMinutes: 149,
    synopsis:
      '12 American military prisoners in World War II are ordered to infiltrate a well-guarded enemy château and kill the Nazi officers vacationing there. The soldiers, most of whom are facing death sentences for a variety of violent crimes, agree to the mission and the possible commuting of their sentences.',
    posterUrl: tmdbPoster('tFWWsuhp22zJ6OG6QepJIiPUfeF'),
    genres: ['Action', 'Adventure', 'War'],
    directors: ['Robert Aldrich'],
    writers: ['Lukas Heller', 'Nunnally Johnson'],
    cast: [
      'Lee Marvin',
      'Ernest Borgnine',
      'Charles Bronson',
      'Jim Brown',
      'John Cassavetes',
      'Richard Jaeckel',
    ],
  },
  // https://www.themoviedb.org/movie/109
  {
    title: 'Three Colors: White',
    releaseDate: '1994-01-26',
    runtimeMinutes: 92,
    synopsis:
      'Polish immigrant Karol Karol finds himself out of a marriage, a job and a country when his French wife, Dominique, divorces him after six months due to his impotence. Forced to leave France after losing the business they jointly owned, Karol enlists fellow Polish expatriate Mikołaj to smuggle him back to their homeland.',
    posterUrl: tmdbPoster('fdIet3NSa27gobMbaUml66oCQNT'),
    genres: ['Comedy', 'Drama', 'Mystery'],
    directors: ['Krzysztof Kieślowski'],
    writers: ['Krzysztof Kieślowski', 'Krzysztof Piesiewicz'],
    cast: [
      'Zbigniew Zamachowski',
      'Julie Delpy',
      'Janusz Gajos',
      'Jerzy Stuhr',
      'Grzegorz Warchoł',
      'Jerzy Nowak',
    ],
  },
  // https://www.themoviedb.org/movie/332
  {
    title: 'Inspector Gadget',
    releaseDate: '1999-07-23',
    runtimeMinutes: 78,
    synopsis:
      'John Brown is a bumbling but well-intentioned security guard who is badly injured in an explosion planned by an evil mastermind. He is taken to a laboratory, where Brenda, a leading robotics surgeon, replaces his damaged limbs with state-of-the-art gadgets and tools. Named "Inspector Gadget" by the press, John -- along with his niece, Penny, and her trusty dog, Brain -- uses his new powers to discover who was behind the explosion.',
    posterUrl: tmdbPoster('dDcsv1Lql5aM6H4JYfDHjBAXKgT'),
    genres: ['Action', 'Adventure', 'Comedy', 'Family'],
    directors: ['David Kellogg'],
    writers: ['Kerry Ehrin', 'Zak Penn'],
    cast: [
      'Matthew Broderick',
      'Rupert Everett',
      'Joely Fisher',
      'Michelle Trachtenberg',
      'Andy Dick',
      'Cheri Oteri',
    ],
  },
  // https://www.themoviedb.org/movie/172
  {
    title: 'Star Trek V: The Final Frontier',
    releaseDate: '1989-06-09',
    runtimeMinutes: 106,
    synopsis:
      'A renegade Vulcan with a startling secret hijacks the U.S.S. Enterprise in order to find a mythical planet.',
    posterUrl: tmdbPoster('uiXr41VLYsuug3CZbFrKLSNahuZ'),
    genres: ['Science Fiction', 'Action', 'Adventure', 'Thriller'],
    directors: ['William Shatner'],
    writers: ['David Loughery'],
    cast: [
      'William Shatner',
      'Leonard Nimoy',
      'DeForest Kelley',
      'James Doohan',
      'George Takei',
      'Walter Koenig',
    ],
  },
  // https://www.themoviedb.org/movie/136
  {
    title: 'Freaks',
    releaseDate: '1932-01-01',
    runtimeMinutes: 64,
    synopsis:
      "A circus' beautiful trapeze artist agrees to marry the leader of side-show performers, but his deformed friends discover she is only marrying him for his inheritance.",
    posterUrl: tmdbPoster('fX2Wxd0W9E7eVClUd8kJTfennoV'),
    genres: ['Drama', 'Horror'],
    directors: ['Tod Browning'],
    writers: ['Leon Gordon', 'Willis Goldbeck'],
    cast: [
      'Harry Earles',
      'Olga Baclanova',
      'Daisy Earles',
      'Henry Victor',
      'Wallace Ford',
      'Leila Hyams',
    ],
  },
  // https://www.themoviedb.org/movie/1247
  {
    title: 'The Good Shepherd',
    releaseDate: '2006-12-11',
    runtimeMinutes: 167,
    synopsis:
      "Edward Wilson, the only witness to his father's suicide and member of the Skull and Bones Society while a student at Yale, is a morally upright young man who values honor and discretion, qualities that help him to be recruited for a career in the newly founded OSS. His dedication to his work does not come without a price though, leading him to sacrifice his ideals and eventually his family.",
    posterUrl: tmdbPoster('qWmF0rQRPeIVQRfwQN3C9VFKsBh'),
    genres: ['Drama', 'Thriller', 'History'],
    directors: ['Robert De Niro'],
    writers: ['Eric Roth'],
    cast: [
      'Matt Damon',
      'Angelina Jolie',
      'Robert De Niro',
      'Alec Baldwin',
      'William Hurt',
      'Joe Pesci',
    ],
  },
  // https://www.themoviedb.org/movie/916
  {
    title: 'Bullitt',
    releaseDate: '1968-10-17',
    runtimeMinutes: 113,
    synopsis:
      "Senator Walter Chalmers is aiming to take down mob boss Pete Ross with the help of testimony from the criminal's hothead brother Johnny, who is in protective custody in San Francisco under the watch of police lieutenant Frank Bullitt. When a pair of mob hitmen enter the scene, Bullitt follows their trail through a maze of complications and double-crosses. This thriller includes one of the most famous car chases ever filmed.",
    posterUrl: tmdbPoster('2ffzF1WmeXtH420fSUoCrecFvDA'),
    genres: ['Action', 'Crime', 'Thriller'],
    directors: ['Peter Yates'],
    writers: ['Alan Trustman', 'Harry Kleiner'],
    cast: [
      'Steve McQueen',
      'Robert Vaughn',
      'Jacqueline Bisset',
      'Don Gordon',
      'Robert Duvall',
      'Simon Oakland',
    ],
  },
  // https://www.themoviedb.org/movie/643
  {
    title: 'Battleship Potemkin',
    releaseDate: '1925-12-24',
    runtimeMinutes: 75,
    synopsis:
      'A dramatized account of a great Russian naval mutiny and a resultant public demonstration, showing support, which brought on a police massacre.',
    posterUrl: tmdbPoster('hZmsRLsCnE9Zshf1YJONUpCOhds'),
    genres: ['Drama', 'History', 'War'],
    directors: ['Sergei Eisenstein'],
    writers: [
      'Sergei Eisenstein',
      'Nikolay Aseev',
      'Sergei Tretyakov',
      'Grigori Aleksandrov',
      'Nina Agadzhanova',
    ],
    cast: [
      'Aleksandr Antonov',
      'Vladimir Barsky',
      'Grigori Aleksandrov',
      'Ivan Bobrov',
      'Mikhail Gomorov',
      'Aleksandr Levshin',
    ],
  },
  // https://www.themoviedb.org/movie/1715
  {
    title: 'The Cider House Rules',
    releaseDate: '1999-12-17',
    runtimeMinutes: 126,
    synopsis:
      'Homer is an orphan who was never adopted, becoming the favorite of orphanage director Dr. Larch. Dr. Larch imparts his full medical knowledge on Homer, who becomes a skilled, albeit unlicensed, physician. But Homer yearns for a self-chosen life outside the orphanage. What will Homer learn about life and love in the cider house? What of the destiny that Dr. Larch has planned for him?',
    posterUrl: tmdbPoster('qAECAgqjSFRVZzEEGbFAZqZNiDh'),
    genres: ['Drama'],
    directors: ['Lasse Hallström'],
    writers: ['John Irving'],
    cast: [
      'Tobey Maguire',
      'Charlize Theron',
      'Michael Caine',
      'Delroy Lindo',
      'Paul Rudd',
      'Jane Alexander',
    ],
  },
  // https://www.themoviedb.org/movie/907
  {
    title: 'Doctor Zhivago',
    releaseDate: '1965-12-22',
    runtimeMinutes: 200,
    synopsis:
      "The life of a Russian physician and poet who, although married to another, falls in love with a political activist's wife and experiences hardship during World War I and then the October Revolution.",
    posterUrl: tmdbPoster('r0Iv2BiCFYDnzc6uU1q3AJ56igT'),
    genres: ['Drama', 'Romance', 'War'],
    directors: ['David Lean'],
    writers: ['Robert Bolt'],
    cast: [
      'Omar Sharif',
      'Julie Christie',
      'Geraldine Chaplin',
      'Rod Steiger',
      'Alec Guinness',
      'Tom Courtenay',
    ],
  },
  // https://www.themoviedb.org/movie/309
  {
    title: 'The Celebration',
    releaseDate: '1998-06-19',
    runtimeMinutes: 101,
    synopsis:
      'The family of a wealthy businessman gather to celebrate his 60th birthday. During the course of the party, his eldest son presents a speech that reveals a devastating secret that turns the night into a battle of truth and denial.',
    posterUrl: tmdbPoster('2LRzNq41yrY8EjCnD1S8sCCPvKk'),
    genres: ['Drama'],
    directors: ['Thomas Vinterberg'],
    writers: ['Thomas Vinterberg', 'Mogens Rukov'],
    cast: [
      'Ulrich Thomsen',
      'Henning Moritzen',
      'Thomas Bo Larsen',
      'Paprika Steen',
      'Birthe Neumann',
      'Trine Dyrholm',
    ],
  },
  // https://www.themoviedb.org/movie/859
  {
    title: 'Dangerous Liaisons',
    releaseDate: '1988-12-21',
    runtimeMinutes: 119,
    synopsis:
      'In 18th century France, Marquise de Merteuil asks her ex-lover Vicomte de Valmont to seduce the future wife of another ex-lover of hers in return for one last night with her. Yet things don’t go as planned.',
    posterUrl: tmdbPoster('hFem30C3uJUd9smNy7rFLGVhKys'),
    genres: ['Drama', 'Romance'],
    directors: ['Stephen Frears'],
    writers: ['Christopher Hampton'],
    cast: [
      'Glenn Close',
      'John Malkovich',
      'Michelle Pfeiffer',
      'Uma Thurman',
      'Swoosie Kurtz',
      'Keanu Reeves',
    ],
  },
  // https://www.themoviedb.org/movie/445
  {
    title: 'Caché',
    releaseDate: '2005-10-05',
    runtimeMinutes: 118,
    synopsis:
      'George, host of a television show focusing on literature, receives videos shot on the sly that feature his family, along with disturbing drawings that are difficult to interpret. He has no idea who has made and sent him the videos. Progressively, the contents of the videos become more personal, indicating that the sender has known George for a long time.',
    posterUrl: tmdbPoster('vTzjRi0Uhy0tt3Rjw8SARZZJHlX'),
    genres: ['Mystery', 'Drama', 'Thriller'],
    directors: ['Michael Haneke'],
    writers: ['Michael Haneke'],
    cast: [
      'Daniel Auteuil',
      'Juliette Binoche',
      'Annie Girardot',
      'Bernard Le Coq',
      'Daniel Duval',
      'Maurice Bénichou',
    ],
  },
  // https://www.themoviedb.org/movie/301
  {
    title: 'Rio Bravo',
    releaseDate: '1959-03-08',
    runtimeMinutes: 141,
    synopsis:
      'A small-town sheriff in the American West enlists the help of a disabled man, a drunk, and a young gunfighter in his efforts to hold in jail the brother of the local bad guy.',
    posterUrl: tmdbPoster('4gI4KKmoi0d3yfsF71YU3S0I5t8'),
    genres: ['Western', 'Drama'],
    directors: ['Howard Hawks'],
    writers: ['Leigh Brackett', 'Jules Furthman'],
    cast: [
      'John Wayne',
      'Dean Martin',
      'Ricky Nelson',
      'Angie Dickinson',
      'Walter Brennan',
      'Ward Bond',
    ],
  },
  // https://www.themoviedb.org/movie/1280
  {
    title: '3-Iron',
    releaseDate: '2004-10-15',
    runtimeMinutes: 88,
    synopsis:
      "A drifter lives in people's houses while they are away and repays them by doing chores for them. His life changes when he meets a beautiful woman who wants to escape her unhappy marriage.",
    posterUrl: tmdbPoster('mejeTOe8aGWyAAjaGj7Mi66Vtfc'),
    genres: ['Drama', 'Romance', 'Crime'],
    directors: ['Kim Ki-duk'],
    writers: ['Kim Ki-duk'],
    cast: ['Lee Seung-yun', 'Jae Hee', 'Kwon Hyuk-ho', 'Ju Jin-mo', 'Choi Jeong-ho', 'Lee Joo-suk'],
  },
  // https://www.themoviedb.org/movie/1630
  {
    title: 'The People vs. Larry Flynt',
    releaseDate: '1996-12-25',
    runtimeMinutes: 130,
    synopsis:
      'Larry Flynt is the hedonistically obnoxious, but indomitable, publisher of Hustler magazine. The film recounts his struggle to make an honest living publishing his girlie magazine and how it changes into a battle to protect the freedom of speech for all people.',
    posterUrl: tmdbPoster('sAgHn7ys6TiVXBDTZ0UBEjinIUk'),
    genres: ['Drama'],
    directors: ['Miloš Forman'],
    writers: ['Larry Karaszewski', 'Scott Alexander'],
    cast: [
      'Woody Harrelson',
      'Courtney Love',
      'Edward Norton',
      'Brett Harrelson',
      'Donna Hanover',
      'James Cromwell',
    ],
  },
  // https://www.themoviedb.org/movie/526
  {
    title: 'Ladyhawke',
    releaseDate: '1985-03-27',
    runtimeMinutes: 121,
    synopsis:
      'Captain Etienne Navarre is a man on whose shoulders lies a cruel curse. Punished for loving each other, Navarre must become a wolf by night whilst his lover, Lady Isabeau, takes the form of a hawk by day. Together, with the thief Philippe Gaston, they must try to overthrow the corrupt Bishop and in doing so break the spell.',
    posterUrl: tmdbPoster('vJA2Fhw2uBMiVFdBde2kH7kZ2gw'),
    genres: ['Adventure', 'Comedy', 'Fantasy'],
    directors: ['Richard Donner'],
    writers: ['Edward Khmara', 'Michael Thomas', 'Tom Mankiewicz', 'David Webb Peoples'],
    cast: [
      'Matthew Broderick',
      'Rutger Hauer',
      'Michelle Pfeiffer',
      'Alfred Molina',
      'John Wood',
      'Leo McKern',
    ],
  },
  // https://www.themoviedb.org/movie/1073
  {
    title: 'Arlington Road',
    releaseDate: '1999-03-19',
    runtimeMinutes: 117,
    synopsis:
      "Bedraggled college professor Michael Faraday has been vexed — and increasingly paranoid — since his wife's accidental death in a botched FBI operation. When a seemingly all-American couple set up house next door, Michael begins to suspect there’s more to them than meets the eye.",
    posterUrl: tmdbPoster('4yYHyZuyTTQaEZuHKS7561jXjtR'),
    genres: ['Crime', 'Drama', 'Thriller', 'Mystery'],
    directors: ['Mark Pellington'],
    writers: ['Ehren Kruger'],
    cast: [
      'Jeff Bridges',
      'Tim Robbins',
      'Joan Cusack',
      'Hope Davis',
      'Robert Gossett',
      'Mason Gamble',
    ],
  },
  // https://www.themoviedb.org/movie/249
  {
    title: 'The War of the Roses',
    releaseDate: '1989-12-08',
    runtimeMinutes: 116,
    synopsis:
      "Barbara and Oliver Rose live happily as a married couple. When Barbara starts to wonder what life would be like without Oliver and likes what she sees, the two begin a campaign to force each other to leave their house, with their divorce lawyer D'Amato caught in the middle.",
    posterUrl: tmdbPoster('9VWwYsuXhRImUtrJGvN6bYJB2He'),
    genres: ['Comedy', 'Drama'],
    directors: ['Danny DeVito'],
    writers: ['Michael J. Leeson'],
    cast: [
      'Michael Douglas',
      'Kathleen Turner',
      'Danny DeVito',
      'Marianne Sägebrecht',
      'Sean Astin',
      'Heather Fairfield',
    ],
  },
  // https://www.themoviedb.org/movie/66
  {
    title: 'Absolute Power',
    releaseDate: '1997-02-14',
    runtimeMinutes: 121,
    synopsis:
      'A master thief coincidentally is robbing a house where a murder—in which the President of the United States is involved—occurs in front of his eyes. He is forced to run, while holding evidence that could convict the President.',
    posterUrl: tmdbPoster('izvyt3cxlilhbYwybTOteDWqf99'),
    genres: ['Crime', 'Drama', 'Action'],
    directors: ['Clint Eastwood'],
    writers: ['William Goldman'],
    cast: [
      'Clint Eastwood',
      'Gene Hackman',
      'Ed Harris',
      'Laura Linney',
      'Judy Davis',
      'Scott Glenn',
    ],
  },
  // https://www.themoviedb.org/movie/1497
  {
    title: 'Teenage Mutant Ninja Turtles II: The Secret of the Ooze',
    releaseDate: '1991-03-22',
    runtimeMinutes: 88,
    synopsis:
      'The Turtles and the Shredder battle once again, this time for the last cannister of the ooze that created the Turtles, which Shredder wants to create an army of new mutants. Meanwhile Splinter is coming... to a decision.',
    posterUrl: tmdbPoster('Hyvvz9Z3le1is8a0EeFJQm0aSC'),
    genres: ['Science Fiction', 'Adventure', 'Action', 'Comedy', 'Family'],
    directors: ['Michael Pressman'],
    writers: ['Todd W. Langen'],
    cast: ['Brian Tochi', 'Laurie Faso', 'Robbie Rist', 'Adam Carl', 'Paige Turco', 'David Warner'],
  },
  // https://www.themoviedb.org/movie/647
  {
    title: 'Final Fantasy VII: Advent Children',
    releaseDate: '2005-07-14',
    runtimeMinutes: 101,
    synopsis:
      'Two years have passed since the final battle with Sephiroth. Though Midgar, city of mako, city of prosperity, has been reduced to ruins, its people slowly but steadily walk the road to reconstruction. However, a mysterious illness called Geostigma torments them. With no cure in sight, it brings death to the afflicted, one after another, robbing the people of their fledgling hope.',
    posterUrl: tmdbPoster('pTIXM2yu8McSlcQVs1VjVSNC45x'),
    genres: ['Animation', 'Action', 'Adventure', 'Fantasy', 'Science Fiction'],
    directors: ['Tetsuya Nomura'],
    writers: ['Kazushige Nojima'],
    cast: [
      'Takahiro Sakurai',
      'Ayumi Ito',
      'Showtaro Morikubo',
      'Maaya Sakamoto',
      'Keiji Fujiwara',
      'Taiten Kusunoki',
    ],
  },
  // https://www.themoviedb.org/movie/828
  {
    title: 'The Day the Earth Stood Still',
    releaseDate: '1951-09-18',
    runtimeMinutes: 92,
    synopsis:
      'An alien and a robot land on Earth after World War II and tell mankind to be peaceful or face destruction.',
    posterUrl: tmdbPoster('eslDNzf0LF1m9GsgUXlmyfTcC6Y'),
    genres: ['Science Fiction', 'Thriller', 'Drama'],
    directors: ['Robert Wise'],
    writers: ['Edmund H. North'],
    cast: [
      'Michael Rennie',
      'Patricia Neal',
      'Billy Gray',
      'Sam Jaffe',
      'Hugh Marlowe',
      'Lock Martin',
    ],
  },
  // https://www.themoviedb.org/movie/468
  {
    title: 'My Own Private Idaho',
    releaseDate: '1991-02-01',
    runtimeMinutes: 104,
    synopsis:
      'In this loose adaptation of Shakespeare\'s "Henry IV," Mike Waters is a hustler afflicted with narcolepsy. Scott Favor is the rebellious son of a mayor. Together, the two travel from Portland, Oregon to Idaho and finally to the coast of Italy in a quest to find Mike\'s estranged mother. Along the way they turn tricks for money and drugs, eventually attracting the attention of a wealthy benefactor and sexual deviant.',
    posterUrl: tmdbPoster('p9TF90Pb5yg2MNb2UztzyXktMm4'),
    genres: ['Drama'],
    directors: ['Gus Van Sant'],
    writers: ['Gus Van Sant'],
    cast: [
      'River Phoenix',
      'Keanu Reeves',
      'James Russo',
      'William Richert',
      'Rodney Harvey',
      'Chiara Caselli',
    ],
  },
  // https://www.themoviedb.org/movie/1687
  {
    title: 'Escape from the Planet of the Apes',
    releaseDate: '1971-05-20',
    runtimeMinutes: 98,
    synopsis:
      'The world is shocked by the appearance of three talking chimpanzees, who arrived mysteriously in a spacecraft. Intrigued by their intelligence, humans use them for research - until the apes attempt to escape.',
    posterUrl: tmdbPoster('vqD7qjBRizY7sPVIHbFRUZwgEXL'),
    genres: ['Action', 'Science Fiction'],
    directors: ['Don Taylor'],
    writers: ['Paul Dehn'],
    cast: [
      'Roddy McDowall',
      'Kim Hunter',
      'Bradford Dillman',
      'Natalie Trundy',
      'Eric Braeden',
      'William Windom',
    ],
  },
  // https://www.themoviedb.org/movie/995
  {
    title: 'Stagecoach',
    releaseDate: '1939-03-02',
    runtimeMinutes: 96,
    synopsis:
      'A group of people traveling on a stagecoach find their journey complicated by the threat of Geronimo, and learn something about each other in the process.',
    posterUrl: tmdbPoster('zgMnfnwWZ3nkx4t0bUDEKtW24O8'),
    genres: ['Western'],
    directors: ['John Ford'],
    writers: ['Dudley Nichols'],
    cast: [
      'Claire Trevor',
      'John Wayne',
      'George Bancroft',
      'Andy Devine',
      'Thomas Mitchell',
      'John Carradine',
    ],
  },
  // https://www.themoviedb.org/movie/1273
  {
    title: 'TMNT',
    releaseDate: '2007-03-23',
    runtimeMinutes: 87,
    synopsis:
      'After the defeat of their old arch nemesis, The Shredder, the Turtles have grown apart as a family. Struggling to keep them together, their rat sensei, Splinter, becomes worried when strange things begin to brew in New York City.',
    posterUrl: tmdbPoster('bcpVoVarN7vqwzMuIP0Gb0xYZ0N'),
    genres: ['Adventure', 'Animation', 'Comedy', 'Family'],
    directors: ['Kevin Munroe'],
    writers: ['Kevin Munroe'],
    cast: [
      'Chris Evans',
      'Sarah Michelle Gellar',
      'Patrick Stewart',
      'Mako',
      'Zhang Ziyi',
      'James Arnold Taylor',
    ],
  },
  // https://www.themoviedb.org/movie/506
  {
    title: 'Marnie',
    releaseDate: '1964-07-17',
    runtimeMinutes: 130,
    synopsis:
      'Marnie is a beautiful but emotionally withdrawn thief, stealing from employers before disappearing under new identities. When her new boss, Mark Rutland, discovers her secret, his fascination turns to obsession, and he blackmails her into marriage, convinced he can cure her. But as he probes deeper into Marnie’s fractured mind, long-buried fears and compulsions begin to surface.',
    posterUrl: tmdbPoster('nRRy4VO2A3Py7wiZBPz11PAlogp'),
    genres: ['Thriller', 'Mystery', 'Romance'],
    directors: ['Alfred Hitchcock'],
    writers: ['Jay Presson Allen'],
    cast: [
      'Tippi Hedren',
      'Sean Connery',
      'Diane Baker',
      'Martin Gabel',
      'Louise Latham',
      'Bob Sweeney',
    ],
  },
  // https://www.themoviedb.org/movie/1555
  {
    title: 'The Spanish Apartment',
    releaseDate: '2002-06-19',
    runtimeMinutes: 122,
    synopsis:
      'A strait-laced French student moves into an apartment in Barcelona with a cast of six other characters from all over Europe. Together, they speak the international language of love and friendship.',
    posterUrl: tmdbPoster('baDm4V3Dqx2hNh7WF1NvGrHGgqQ'),
    genres: ['Drama', 'Comedy', 'Romance'],
    directors: ['Cédric Klapisch'],
    writers: ['Cédric Klapisch'],
    cast: [
      'Romain Duris',
      'Judith Godrèche',
      'Audrey Tautou',
      'Kelly Reilly',
      'Cécile de France',
      'Cristina Brondo',
    ],
  },
  // https://www.themoviedb.org/movie/575
  {
    title: 'The Experiment',
    releaseDate: '2001-03-08',
    runtimeMinutes: 120,
    synopsis:
      '20 volunteers agree to take part in a seemingly well-paid experiment advertised by the university. It is supposed to be about aggressive behavior in an artificial prison situation. A journalist senses a story behind the ad and smuggles himself in among the test subjects. They are randomly divided into prisoners and guards. What seems like a game at the beginning soon turns into bloody seriousness.',
    posterUrl: tmdbPoster('mfxXel8k2UWkgJ4MIsvVBsqnvFp'),
    genres: ['Drama', 'Thriller'],
    directors: ['Oliver Hirschbiegel'],
    writers: ['Mario Giordano', 'Christoph Darnstädt', 'Don Bohlinger'],
    cast: [
      'Moritz Bleibtreu',
      'Christian Berkel',
      'Justus von Dohnányi',
      'Maren Eggert',
      'Edgar Selge',
      'Andrea Sawatzki',
    ],
  },
  // https://www.themoviedb.org/movie/711
  {
    title: 'Finding Forrester',
    releaseDate: '2000-12-21',
    runtimeMinutes: 136,
    synopsis:
      'Gus Van Sant tells the story of a young African American man named Jamal who confronts his talents while living on the streets of the Bronx. He accidentally runs into an old writer named Forrester who discovers his passion for writing. With help from his new mentor Jamal receives a scholarship to a private school.',
    posterUrl: tmdbPoster('chd9bCGNYtzDoJqGw5wUHlhrkOb'),
    genres: ['Drama', 'History'],
    directors: ['Gus Van Sant'],
    writers: ['Mike Rich'],
    cast: [
      'Sean Connery',
      'Rob Brown',
      'F. Murray Abraham',
      'Anna Paquin',
      'Damany Mathis',
      'Busta Rhymes',
    ],
  },
  // https://www.themoviedb.org/movie/902
  {
    title: 'The City of Lost Children',
    releaseDate: '1995-05-17',
    runtimeMinutes: 112,
    synopsis:
      'A scientist in a surrealist society kidnaps children to steal their dreams, hoping that they slow his aging process.',
    posterUrl: tmdbPoster('whwT3Q9JxbAYzEc3t7uYYcCbTMf'),
    genres: ['Fantasy', 'Science Fiction', 'Adventure'],
    directors: ['Marc Caro', 'Jean-Pierre Jeunet'],
    writers: ['Marc Caro', 'Jean-Pierre Jeunet', 'Gilles Adrien'],
    cast: [
      'Ron Perlman',
      'Dominique Pinon',
      'Judith Vittet',
      'Daniel Emilfork',
      'Jean-Claude Dreyfus',
      'Geneviève Brunet',
    ],
  },
  // https://www.themoviedb.org/movie/1667
  {
    title: 'March of the Penguins',
    releaseDate: '2005-01-26',
    runtimeMinutes: 80,
    synopsis:
      "Every year, thousands of Antarctica's emperor penguins make an astonishing journey to breed their young. They walk, marching day and night in single file 70 miles into the darkest, driest and coldest continent on Earth.  This amazing, true-life tale is touched with humour and alive with thrills. Breathtaking photography captures the transcendent beauty and staggering drama of devoted parent penguins who, in the fierce polar winter, take turns guarding their egg and trekking to the ocean in search of food. Predators hunt them, storms lash them. But the safety of their adorable chicks makes it all worthwhile. So follow the leader... to adventure!!",
    posterUrl: tmdbPoster('o9xJ1xG1WKlHkl8ACqq0LShOuMu'),
    genres: ['Documentary', 'Family'],
    directors: ['Luc Jacquet'],
    writers: ['Luc Jacquet', 'Michel Fessler', 'Jordan Roberts'],
    cast: ['Charles Berling', 'Romane Bohringer', 'Jules Sitruk', 'Morgan Freeman'],
  },
  // https://www.themoviedb.org/movie/1537
  {
    title: 'Changing Lanes',
    releaseDate: '2002-04-07',
    runtimeMinutes: 98,
    synopsis:
      "A rush-hour fender-bender on New York City's crowded FDR Drive, under most circumstances, wouldn't set off a chain reaction that could decimate two people's lives. But on this day, at this time, a minor collision will turn two complete strangers into vicious adversaries. Their means of destroying each other might be different, but their goals, ultimately, will be the same: Each will systematically try to dismantle the other's life in a reckless effort to reclaim something he has lost.",
    posterUrl: tmdbPoster('8wh9WzTKo5pJw3EgHYWA60W7Kbl'),
    genres: ['Thriller', 'Drama'],
    directors: ['Roger Michell'],
    writers: ['Chap Taylor', 'Michael Tolkin'],
    cast: [
      'Ben Affleck',
      'Samuel L. Jackson',
      'Toni Collette',
      'Sydney Pollack',
      'William Hurt',
      'Amanda Peet',
    ],
  },
  // https://www.themoviedb.org/movie/343
  {
    title: 'Harold and Maude',
    releaseDate: '1971-12-20',
    runtimeMinutes: 92,
    synopsis:
      'A deadpan young man obsessed with death meets an eccentric septuagenarian who teaches him to live life to the fullest.',
    posterUrl: tmdbPoster('t7qEuGwDjcYu8ajaKZ68DeDnOxw'),
    genres: ['Comedy', 'Drama', 'Romance'],
    directors: ['Hal Ashby'],
    writers: ['Colin Higgins'],
    cast: [
      'Ruth Gordon',
      'Bud Cort',
      'Vivian Pickles',
      'Cyril Cusack',
      'Charles Tyner',
      'Ellen Geer',
    ],
  },
  // https://www.themoviedb.org/movie/166
  {
    title: 'The Party',
    releaseDate: '1980-12-17',
    runtimeMinutes: 110,
    synopsis:
      'A thirteen-year-old French girl deals with moving to a new city and school in Paris, while at the same time her parents are getting a divorce.',
    posterUrl: tmdbPoster('usGV1Q7KWR0Uq4dOIppGZ0ba8kz'),
    genres: ['Drama', 'Romance', 'Comedy'],
    directors: ['Claude Pinoteau'],
    writers: ['Claude Pinoteau', 'Danièle Thompson'],
    cast: [
      'Claude Brasseur',
      'Brigitte Fossey',
      'Sophie Marceau',
      'Denise Grey',
      'Jean-Michel Dupuis',
      'Alexandre Sterling',
    ],
  },
  // https://www.themoviedb.org/movie/113
  {
    title: 'Spring, Summer, Fall, Winter... and Spring',
    releaseDate: '2003-09-19',
    runtimeMinutes: 103,
    synopsis:
      'An isolated lake, where an old monk lives in a small floating temple. The monk has a young boy living with him, learning to become a monk. We watch as seasons and years pass by.',
    posterUrl: tmdbPoster('6SQQ5REuAz7k0FMQ9mSCT40T2LN'),
    genres: ['Drama'],
    directors: ['Kim Ki-duk'],
    writers: ['Kim Ki-duk'],
    cast: [
      'Oh Young-soo',
      'Kim Ki-duk',
      'Kim Young-min',
      'Seo Jae-kyeong',
      'Kim Jong-ho',
      'Ha Yeo-jin',
    ],
  },
  // https://www.themoviedb.org/movie/806
  {
    title: 'The Omen',
    releaseDate: '2006-06-06',
    runtimeMinutes: 110,
    synopsis:
      'A diplomatic couple adopts the son of the devil without knowing it. A remake of the classic horror film of the same name from 1976.',
    posterUrl: tmdbPoster('kf1Qq9b32jn4umll9qD2ue5ftnh'),
    genres: ['Horror', 'Mystery', 'Thriller'],
    directors: ['John Moore'],
    writers: ['David Seltzer'],
    cast: [
      'Liev Schreiber',
      'Julia Stiles',
      'Mia Farrow',
      'David Thewlis',
      'Pete Postlethwaite',
      'Michael Gambon',
    ],
  },
  // https://www.themoviedb.org/movie/547
  {
    title: 'The Horse Whisperer',
    releaseDate: '1998-02-01',
    runtimeMinutes: 169,
    synopsis:
      "The mother of a severely traumatized daughter enlists the aid of a unique horse trainer to help the girl's equally injured horse.",
    posterUrl: tmdbPoster('ptkDeHY2mRJVyNRyxb9TgyAjTYs'),
    genres: ['Adventure', 'Drama', 'Romance'],
    directors: ['Robert Redford'],
    writers: ['Richard LaGravenese', 'Eric Roth'],
    cast: [
      'Robert Redford',
      'Kristin Scott Thomas',
      'Sam Neill',
      'Scarlett Johansson',
      'Dianne Wiest',
      'Chris Cooper',
    ],
  },
  // https://www.themoviedb.org/movie/931
  {
    title: "Don't Look Now",
    releaseDate: '1973-10-11',
    runtimeMinutes: 110,
    synopsis:
      'While grieving a terrible loss, a married couple meet two mysterious sisters, one of whom gives them a message sent from the afterlife.',
    posterUrl: tmdbPoster('ivWsU3QtcstImCTOjItsH0SAbNn'),
    genres: ['Thriller', 'Drama', 'Horror'],
    directors: ['Nicolas Roeg'],
    writers: ['Allan Scott', 'Chris Bryant'],
    cast: [
      'Donald Sutherland',
      'Julie Christie',
      'Hilary Mason',
      'Massimo Serato',
      'Clelia Matania',
      'Renato Scarpa',
    ],
  },
  // https://www.themoviedb.org/movie/336
  {
    title: 'Duck, You Sucker',
    releaseDate: '1971-10-29',
    runtimeMinutes: 157,
    synopsis:
      'At the beginning of the 1913 Mexican Revolution, greedy bandit Juan Miranda and idealist John H. Mallory, an Irish Republican Army explosives expert on the lam from the British, fall in with a band of revolutionaries plotting to strike a national bank. When it turns out that the government has been using the bank as a hiding place for illegally detained political prisoners -- who are freed by the blast -- Miranda becomes a revolutionary hero against his will.',
    posterUrl: tmdbPoster('nWmAtZf83qpOai0fzehf7Hn1S3R'),
    genres: ['Western'],
    directors: ['Sergio Leone'],
    writers: ['Sergio Leone', 'Sergio Donati', 'Luciano Vincenzoni'],
    cast: [
      'Rod Steiger',
      'James Coburn',
      'Romolo Valli',
      'Maria Monti',
      'Rik Battaglia',
      'Franco Graziosi',
    ],
  },
  // https://www.themoviedb.org/movie/580
  {
    title: 'Jaws: The Revenge',
    releaseDate: '1987-07-17',
    runtimeMinutes: 89,
    synopsis:
      "After another deadly shark attack, Ellen Brody decides she has had enough of New England's Amity Island and moves to the Caribbean to join her son, Michael, and his family. But a great white shark has followed her there, hungry for more lives.",
    posterUrl: tmdbPoster('ebYw9tR0iqBzDGA6HVBhtd2xJM3'),
    genres: ['Adventure', 'Thriller', 'Horror'],
    directors: ['Joseph Sargent'],
    writers: ['Michael De Guzman'],
    cast: [
      'Lorraine Gary',
      'Lance Guest',
      'Mario Van Peebles',
      'Michael Caine',
      'Karen Young',
      'Judith Barsi',
    ],
  },
  // https://www.themoviedb.org/movie/936
  {
    title: 'The Pink Panther',
    releaseDate: '1963-12-18',
    runtimeMinutes: 115,
    synopsis:
      "The trademark of The Phantom, a renowned jewel thief, is a glove left at the scene of the crime. Inspector Clouseau, an expert on The Phantom's exploits, feels sure that he knows where The Phantom will strike next and leaves Paris for the Tyrolean Alps, where the famous Lugashi jewel 'The Pink Panther' is going to be. However, he does not know who The Phantom really is, or for that matter who anyone else really is...",
    posterUrl: tmdbPoster('aCjJ0sKayks2uL7MJBzdp2i67NI'),
    genres: ['Comedy', 'Crime'],
    directors: ['Blake Edwards'],
    writers: ['Blake Edwards', 'Maurice Richlin'],
    cast: [
      'David Niven',
      'Peter Sellers',
      'Claudia Cardinale',
      'Capucine',
      'Robert Wagner',
      'Brenda De Banzie',
    ],
  },
  // https://www.themoviedb.org/movie/93
  {
    title: 'Anatomy of a Murder',
    releaseDate: '1959-07-01',
    runtimeMinutes: 161,
    synopsis:
      "Semi-retired Michigan lawyer Paul Biegler takes the case of Army Lt. Manion, who murdered a local innkeeper after his wife claimed that he raped her. Over the course of an extensive trial, Biegler parries with District Attorney Lodwick and out-of-town prosecutor Claude Dancer to set his client free, but his case rests on the victim's mysterious business partner, who's hiding a dark secret.",
    posterUrl: tmdbPoster('b2G1QSAwtBv9luhEwErIgSRaU92'),
    genres: ['Crime', 'Drama', 'Mystery'],
    directors: ['Otto Preminger'],
    writers: ['Wendell Mayes'],
    cast: [
      'James Stewart',
      'Lee Remick',
      'Ben Gazzara',
      "Arthur O'Connell",
      'Eve Arden',
      'Kathryn Grant',
    ],
  },
  // https://www.themoviedb.org/movie/992
  {
    title: 'Sherlock Jr.',
    releaseDate: '1924-04-17',
    runtimeMinutes: 45,
    synopsis:
      "A film projectionist longs to be a detective, and puts his meager skills to work when he is framed by a rival for stealing his girlfriend's father's pocketwatch.",
    posterUrl: tmdbPoster('1G9r3rqtbFAQuyWKOZm4Y5J5s7Q'),
    genres: ['Action', 'Comedy', 'Mystery'],
    directors: ['Buster Keaton'],
    writers: ['Clyde Bruckman'],
    cast: [
      'Buster Keaton',
      'Kathryn McGuire',
      'Joe Keaton',
      'Erwin Connelly',
      'Ward Crane',
      'Doris Deane',
    ],
  },
  // https://www.themoviedb.org/movie/405
  {
    title: 'La Strada',
    releaseDate: '1954-09-23',
    runtimeMinutes: 115,
    synopsis:
      "When Gelsomina, a naïve young woman, is purchased from her impoverished mother by brutish circus strongman Zampanò to be his wife and partner, she loyally endures her husband's coldness and abuse as they travel the Italian countryside performing together. Soon Zampanò must deal with his jealousy and conflicted feelings about Gelsomina when she finds a kindred spirit in Il Matto, the carefree circus fool, and contemplates leaving Zampanò.",
    posterUrl: tmdbPoster('rwjbT0zlsUDMztaCcWjlWuxaEL1'),
    genres: ['Drama'],
    directors: ['Federico Fellini'],
    writers: ['Federico Fellini', 'Tullio Pinelli'],
    cast: [
      'Giulietta Masina',
      'Anthony Quinn',
      'Richard Basehart',
      'Aldo Silvani',
      'Marcella Rovere',
      'Livia Venturini',
    ],
  },
  // https://www.themoviedb.org/movie/910
  {
    title: 'The Big Sleep',
    releaseDate: '1946-08-22',
    runtimeMinutes: 114,
    synopsis:
      'Private Investigator Philip Marlowe is hired by wealthy General Sternwood regarding a matter involving his youngest daughter Carmen. Before the complex case is over, Marlowe sees murder, blackmail, deception, and what might be love.',
    posterUrl: tmdbPoster('lraHo9D8c0YWfxsKqT5P5sVqMKN'),
    genres: ['Mystery', 'Crime', 'Thriller'],
    directors: ['Howard Hawks'],
    writers: ['Leigh Brackett', 'Jules Furthman', 'William Faulkner'],
    cast: [
      'Humphrey Bogart',
      'Lauren Bacall',
      'John Ridgely',
      'Martha Vickers',
      'Louis Jean Heydt',
      'Charles Waldron',
    ],
  },
  // https://www.themoviedb.org/movie/1440
  {
    title: 'Little Children',
    releaseDate: '2006-10-06',
    runtimeMinutes: 137,
    synopsis:
      'The lives of two lovelorn spouses from separate marriages, a registered sex offender, and a disgraced ex-police officer intersect as they struggle to resist their vulnerabilities and temptations.',
    posterUrl: tmdbPoster('l2wTSP0Ifo9vY03nJEfkFBbT2S9'),
    genres: ['Drama', 'Romance'],
    directors: ['Todd Field'],
    writers: ['Todd Field', 'Tom Perrotta'],
    cast: [
      'Kate Winslet',
      'Patrick Wilson',
      'Jennifer Connelly',
      'Gregg Edelman',
      'Sadie Goldstein',
      'Ty Simpkins',
    ],
  },
  // https://www.themoviedb.org/movie/438
  {
    title: 'Cube Zero',
    releaseDate: '2004-10-10',
    runtimeMinutes: 97,
    synopsis:
      'A young programmer whose job is to watch over the reality-warping Cube defies orders to rescue an innocent mother trapped in one of its rooms.',
    posterUrl: tmdbPoster('m5ODgUYh5lMvRumBY63QJ4eVYp5'),
    genres: ['Mystery', 'Science Fiction', 'Thriller'],
    directors: ['Ernie Barbarash'],
    writers: ['Ernie Barbarash'],
    cast: [
      'Zachary Bennett',
      'David Huband',
      'Stephanie Moore',
      'Martin Roach',
      'Terri Hawkes',
      'Richard McMillan',
    ],
  },
  // https://www.themoviedb.org/movie/651
  {
    title: 'M*A*S*H',
    releaseDate: '1970-02-18',
    runtimeMinutes: 116,
    synopsis:
      "One of the world's most acclaimed comedies, M*A*S*H focuses on three Korean War Army surgeons brilliantly brought to life by Donald Sutherland, Tom Skerritt and Elliott Gould. Though highly skilled and deeply dedicated, they adopt a hilarious, lunatic lifestyle as an antidote to the tragedies of their Mobile Army Surgical Hospital, and in the process infuriate Army bureaucrats. Robert Duvall, Gary Burghoff and Sally Kellerman co-star as a sanctimonious Major, an other-worldly Corporal, and a self-righteous yet lusty nurse.",
    posterUrl: tmdbPoster('on8Q9LhtHYNhmITjUMpgOUkIG8o'),
    genres: ['Comedy', 'Drama', 'War'],
    directors: ['Robert Altman'],
    writers: ['Ring Lardner', 'Jr.'],
    cast: [
      'Donald Sutherland',
      'Elliott Gould',
      'Tom Skerritt',
      'Sally Kellerman',
      'Robert Duvall',
      'Roger Bowen',
    ],
  },
  // https://www.themoviedb.org/movie/145
  {
    title: 'Breaking the Waves',
    releaseDate: '1996-07-05',
    runtimeMinutes: 159,
    synopsis:
      'In a small, conservative Scottish village, an oilman is paralyzed in an accident. His wife, who prayed for his return, feels guilty; even more, when he urges her to have sex with another.',
    posterUrl: tmdbPoster('dQWMcdHXUOSHtr7ypOCa5T79JMS'),
    genres: ['Drama', 'Romance'],
    directors: ['Lars von Trier'],
    writers: ['Lars von Trier'],
    cast: [
      'Emily Watson',
      'Stellan Skarsgård',
      'Katrin Cartlidge',
      'Jean-Marc Barr',
      'Adrian Rawlins',
      'Jonathan Hackett',
    ],
  },
  // https://www.themoviedb.org/movie/1678
  {
    title: 'Godzilla',
    releaseDate: '1954-11-03',
    runtimeMinutes: 96,
    synopsis:
      'Japan is thrown into a panic after several ships are sunk near Odo Island. An expedition to the island led by Dr. Kyohei Yamane soon discover something far more devastating than imagined in the form of a 50 meter tall monster whom the natives call Gojira. Now the monster begins a rampage that threatens to destroy not only Japan, but the rest of the world as well.',
    posterUrl: tmdbPoster('2W0Yw0qrgVMgdsSCZRKtfvaAh0i'),
    genres: ['Thriller', 'Horror', 'Science Fiction'],
    directors: ['Ishirō Honda'],
    writers: ['Ishirō Honda', 'Takeo Murata'],
    cast: [
      'Akira Takarada',
      'Momoko Kôchi',
      'Akihiko Hirata',
      'Takashi Shimura',
      'Fuyuki Murakami',
      'Sachio Sakai',
    ],
  },
  // https://www.themoviedb.org/movie/1544
  {
    title: 'Imagine Me & You',
    releaseDate: '2006-01-27',
    runtimeMinutes: 93,
    synopsis:
      'During her wedding ceremony, Rachel notices Luce in the audience and feels instantly drawn to her. The two women become close friends, and when Rachel learns that Luce is a lesbian, she realizes that despite her happy marriage to Heck, she is falling for Luce. As she questions her sexual orientation, Rachel must decide between her stable relationship with Heck and her exhilarating new romance with Luce.',
    posterUrl: tmdbPoster('a7CbxY3TMwFKX6awlBxhb7Es6tS'),
    genres: ['Drama', 'Comedy', 'Romance'],
    directors: ['Ol Parker'],
    writers: ['Ol Parker'],
    cast: [
      'Piper Perabo',
      'Lena Headey',
      'Matthew Goode',
      'Celia Imrie',
      'Anthony Stewart Head',
      'Darren Boyd',
    ],
  },
  // https://www.themoviedb.org/movie/596
  {
    title: 'The Grapes of Wrath',
    releaseDate: '1940-03-15',
    runtimeMinutes: 129,
    synopsis:
      'Tom Joad returns to his home after a jail sentence to find his family kicked out of their farm due to foreclosure. He catches up with them on his Uncle’s farm, and joins them the next day as they head for California and a new life... Hopefully.',
    posterUrl: tmdbPoster('eUcxMVBIA0Jg8l1RGUqycrc3eIQ'),
    genres: ['Drama'],
    directors: ['John Ford'],
    writers: ['Nunnally Johnson'],
    cast: [
      'Henry Fonda',
      'Jane Darwell',
      'John Carradine',
      'Charley Grapewin',
      'Dorris Bowdon',
      'Russell Simpson',
    ],
  },
  // https://www.themoviedb.org/movie/229
  {
    title: 'Bride of Frankenstein',
    releaseDate: '1935-04-20',
    runtimeMinutes: 75,
    synopsis:
      'Dr. Frankenstein and his monster both turn out to be alive after being attacked by an angry mob. The now-chastened scientist attempts to escape his past, but a former mentor forces him to assist with the creation of a new creature.',
    posterUrl: tmdbPoster('5241zUwe7rC17MNc2QpCBKKdp1N'),
    genres: ['Horror', 'Science Fiction'],
    directors: ['James Whale'],
    writers: ['William Hurlbut', 'Edmund Pearson'],
    cast: [
      'Boris Karloff',
      'Colin Clive',
      'Valerie Hobson',
      'Ernest Thesiger',
      'Elsa Lanchester',
      'Gavin Gordon',
    ],
  },
  // https://www.themoviedb.org/movie/827
  {
    title: 'Diabolique',
    releaseDate: '1955-01-29',
    runtimeMinutes: 118,
    synopsis:
      "The cruel and abusive headmaster of a boarding school, Michel Delassalle, is murdered by an unlikely duo -- his meek wife and the mistress he brazenly flaunts. The women become increasingly unhinged by a series of odd occurrences after Delassalle's corpse mysteriously disappears.",
    posterUrl: tmdbPoster('jE8ygUYBUGyUcM4sR6iinPqYeDK'),
    genres: ['Thriller', 'Mystery'],
    directors: ['Henri-Georges Clouzot'],
    writers: ['Henri-Georges Clouzot', 'Jérôme Géronimi'],
    cast: [
      'Véra Clouzot',
      'Simone Signoret',
      'Paul Meurisse',
      'Charles Vanel',
      'Jean Brochard',
      'Pierre Larquey',
    ],
  },
  // https://www.themoviedb.org/movie/204
  {
    title: 'The Wages of Fear',
    releaseDate: '1953-04-22',
    runtimeMinutes: 154,
    synopsis:
      'In a run-down South American town, four men are paid to drive trucks loaded with nitroglycerin into the jungle through to the oil field. Friendships are tested and rivalries develop as they embark upon the perilous journey.',
    posterUrl: tmdbPoster('sNOvIp4X0fmCMfgEs2ww5IyMgFm'),
    genres: ['Drama', 'Thriller', 'Adventure'],
    directors: ['Henri-Georges Clouzot'],
    writers: ['Henri-Georges Clouzot', 'Jérôme Géronimi'],
    cast: [
      'Yves Montand',
      'Charles Vanel',
      'Peter van Eyck',
      'Folco Lulli',
      'Véra Clouzot',
      'Antonio Centa',
    ],
  },
  // https://www.themoviedb.org/movie/990
  {
    title: 'The Hustler',
    releaseDate: '1961-09-25',
    runtimeMinutes: 134,
    synopsis:
      'Fast Eddie Felson is a small-time pool hustler with a lot of talent but a self-destructive attitude. His bravado causes him to challenge the legendary Minnesota Fats to a high-stakes match.',
    posterUrl: tmdbPoster('snItsSViawjaadW9mlWUmGwR41R'),
    genres: ['Drama', 'Romance'],
    directors: ['Robert Rossen'],
    writers: ['Robert Rossen', 'Sidney Carroll'],
    cast: [
      'Paul Newman',
      'Jackie Gleason',
      'Piper Laurie',
      'George C. Scott',
      'Myron McCormick',
      'Murray Hamilton',
    ],
  },
  // https://www.themoviedb.org/movie/1688
  {
    title: 'Conquest of the Planet of the Apes',
    releaseDate: '1972-06-29',
    runtimeMinutes: 88,
    synopsis:
      'In a futuristic world that has embraced ape slavery, a chimpanzee named Caesar resurfaces after almost twenty years of hiding from the authorities, and prepares for a revolt against humanity.',
    posterUrl: tmdbPoster('tzKZRY2opw5MruSkevffgT5ocun'),
    genres: ['Action', 'Science Fiction'],
    directors: ['J. Lee Thompson'],
    writers: ['Paul Dehn'],
    cast: [
      'Roddy McDowall',
      'Don Murray',
      'Ricardo Montalban',
      'Hari Rhodes',
      'Severn Darden',
      'Lou Wagner',
    ],
  },
  // https://www.themoviedb.org/movie/1365
  {
    title: "Monster's Ball",
    releaseDate: '2001-12-26',
    runtimeMinutes: 113,
    synopsis:
      'A prison guard begins a tentative romance with the unsuspecting widow of a man whose execution he presided over.',
    posterUrl: tmdbPoster('rQeufx98gKH4CCeVw57KT1Fd0gr'),
    genres: ['Drama', 'Romance'],
    directors: ['Marc Forster'],
    writers: ['Milo Addica', 'Will Rokos'],
    cast: [
      'Billy Bob Thornton',
      'Heath Ledger',
      'Halle Berry',
      'Sean Combs',
      'Yasiin Bey',
      'Will Rokos',
    ],
  },
  // https://www.themoviedb.org/movie/1396
  {
    title: 'Mirror',
    releaseDate: '1975-03-07',
    runtimeMinutes: 107,
    synopsis:
      'A dying man in his forties recalls his childhood, his mother, the war and personal moments that tell of and juxtapose pivotal moments in Soviet history with daily life.',
    posterUrl: tmdbPoster('AttDP5OEsMxtHPPN7Z92p2Ntnmd'),
    genres: ['Drama', 'History'],
    directors: ['Andrei Tarkovsky'],
    writers: ['Andrei Tarkovsky', 'Aleksandr Misharin'],
    cast: [
      'Margarita Terekhova',
      'Ignat Daniltsev',
      'Larisa Tarkovskaya',
      'Alla Demidova',
      'Anatoliy Solonitsyn',
      'Mykola Hrynko',
    ],
  },
  // https://www.themoviedb.org/movie/780
  {
    title: 'The Passion of Joan of Arc',
    releaseDate: '1928-04-21',
    runtimeMinutes: 81,
    synopsis:
      "A classic of the silent age, this film tells the story of the doomed but ultimately canonized 15th-century teenage warrior. On trial for claiming she'd spoken to God, Jeanne d'Arc is subjected to inhumane treatment and scare tactics at the hands of church court officials. Initially bullied into changing her story, Jeanne eventually opts for what she sees as the truth. Her punishment, a famously brutal execution, earns her perpetual martyrdom.",
    posterUrl: tmdbPoster('tAgV9yxY6AC1bsPt3qJJQpD4s8'),
    genres: ['Drama', 'History'],
    directors: ['Carl Theodor Dreyer'],
    writers: ['Carl Theodor Dreyer', 'Joseph Delteil'],
    cast: [
      'Maria Falconetti',
      'Eugène Silvain',
      'André Berley',
      'Maurice Schutz',
      'Antonin Artaud',
      'Michel Simon',
    ],
  },
  // https://www.themoviedb.org/movie/900
  {
    title: 'Bringing Up Baby',
    releaseDate: '1938-02-18',
    runtimeMinutes: 102,
    synopsis:
      'David Huxley is waiting to get a bone he needs for his museum collection. Through a series of strange circumstances, he meets Susan Vance, and the duo have a series of misadventures which include a leopard called Baby.',
    posterUrl: tmdbPoster('vTNNOtemaYmtx3k2NpsLMRJKEwZ'),
    genres: ['Comedy', 'Romance'],
    directors: ['Howard Hawks'],
    writers: ['Hagar Wilde', 'Dudley Nichols'],
    cast: [
      'Katharine Hepburn',
      'Cary Grant',
      'Charles Ruggles',
      'Walter Catlett',
      'Barry Fitzgerald',
      'May Robson',
    ],
  },
  // https://www.themoviedb.org/movie/1125
  {
    title: 'Dreamgirls',
    releaseDate: '2006-12-25',
    runtimeMinutes: 130,
    synopsis:
      'A trio of female soul singers cross over to the pop charts in the early 1960s, facing their own personal struggles along the way.',
    posterUrl: tmdbPoster('sG5JyOj8Spe13QkNJMH8b5kzQUh'),
    genres: ['Drama', 'Music'],
    directors: ['Bill Condon'],
    writers: ['Bill Condon'],
    cast: [
      'Jamie Foxx',
      'Beyoncé',
      'Eddie Murphy',
      'Danny Glover',
      'Jennifer Hudson',
      'Anika Noni Rose',
    ],
  },
  // https://www.themoviedb.org/movie/844
  {
    title: '2046',
    releaseDate: '2004-09-29',
    runtimeMinutes: 128,
    synopsis:
      "Women enter and exit a science fiction author's life over the course of a few years after the author loses the woman he considers his one true love.",
    posterUrl: tmdbPoster('jIN65qw0Giplo4CshzMrxz204Wn'),
    genres: ['Drama', 'Science Fiction', 'Romance'],
    directors: ['Wong Kar-Wai'],
    writers: ['Wong Kar-Wai'],
    cast: [
      'Tony Leung Chiu-wai',
      'Gong Li',
      'Faye Wong',
      'Takuya Kimura',
      'Zhang Ziyi',
      'Dong Jie',
    ],
  },
  // https://www.themoviedb.org/movie/759
  {
    title: 'Gentlemen Prefer Blondes',
    releaseDate: '1953-07-15',
    runtimeMinutes: 91,
    synopsis:
      "Lorelei Lee is a beautiful showgirl engaged to be married to the wealthy Gus Esmond, much to the disapproval of Gus' rich father, Esmond Sr., who thinks that Lorelei is just after his money. When Lorelei goes on a cruise accompanied only by her best friend, Dorothy Shaw, Esmond Sr. hires Ernie Malone, a private detective, to follow her and report any questionable behavior that would disqualify her from the marriage.",
    posterUrl: tmdbPoster('fDozhst5HVJJcd3BM8ZOsKniO7Q'),
    genres: ['Comedy', 'Romance'],
    directors: ['Howard Hawks'],
    writers: ['Charles Lederer'],
    cast: [
      'Jane Russell',
      'Marilyn Monroe',
      'Charles Coburn',
      'Elliott Reid',
      'Tommy Noonan',
      'George Winslow',
    ],
  },
  // https://www.themoviedb.org/movie/1705
  {
    title: 'Battle for the Planet of the Apes',
    releaseDate: '1973-06-15',
    runtimeMinutes: 93,
    synopsis:
      'The fifth and final episode in the Planet of the Apes series. After the collapse of human civilization, a community of intelligent apes led by Caesar lives in harmony with a group of humans. Gorilla General Aldo tries to cause an ape civil war and a community of human mutants who live beneath a destroyed city try to conquer those whom they perceive as enemies. All leading to the finale.',
    posterUrl: tmdbPoster('dP5dYjLp5p2CG103cJMio4Nj29d'),
    genres: ['Action', 'Science Fiction'],
    directors: ['J. Lee Thompson'],
    writers: ['John William Corrington', 'Joyce Hooper Corrington'],
    cast: [
      'Roddy McDowall',
      'Natalie Trundy',
      'Austin Stoker',
      'Severn Darden',
      'Claude Akins',
      'Paul Williams',
    ],
  },
  // https://www.themoviedb.org/movie/140
  {
    title: 'Bad Education',
    releaseDate: '2004-03-19',
    runtimeMinutes: 105,
    synopsis:
      'When an old friend brings filmmaker Enrique Goded a semi-autobiographical script chronicling their adolescence, Enrique is forced to relive his youth spent at a Catholic boarding school. Weaving through past and present, the script follows a transvestite performer who reconnects with a grade school sweetheart. Spurred on by this chance encounter, the character reflects on her childhood sexual victimization and the trauma of closeting her sexual orientation.',
    posterUrl: tmdbPoster('ir4lkaAMJQrlLFMW1QM3BD9Jeb0'),
    genres: ['Drama', 'Crime'],
    directors: ['Pedro Almodóvar'],
    writers: ['Pedro Almodóvar'],
    cast: [
      'Gael García Bernal',
      'Fele Martínez',
      'Daniel Giménez Cacho',
      'Lluís Homar',
      'Francisco Maestre',
      'Francisco Boira',
    ],
  },
  // https://www.themoviedb.org/movie/636
  {
    title: 'THX 1138',
    releaseDate: '1971-03-11',
    runtimeMinutes: 86,
    synopsis:
      'People in the future live in a totalitarian society. A technician named THX 1138 lives a mundane life between work and taking a controlled consumption of drugs that the government uses to make puppets out of people. As THX is without drugs for the first time he has feelings for a woman and they start a secret relationship.',
    posterUrl: tmdbPoster('pPyEXW7h2SJRjTsHZqrIlXxOgW9'),
    genres: ['Science Fiction', 'Drama'],
    directors: ['George Lucas'],
    writers: ['George Lucas', 'Walter Murch'],
    cast: [
      'Robert Duvall',
      'Donald Pleasence',
      'Don Pedro Colley',
      'Maggie McOmie',
      'Ian Wolfe',
      'Marshall Efron',
    ],
  },
  // https://www.themoviedb.org/movie/830
  {
    title: 'Forbidden Planet',
    releaseDate: '1956-03-23',
    runtimeMinutes: 98,
    synopsis:
      'Starship C57D travels to planet Altair 4 in search of the crew of spaceship "Bellerophon," a scientific expedition that has been missing for twenty years. They find themselves unwelcome by the expedition\'s lone survivor and warned of destruction by an invisible force if they don\'t turn back immediately.',
    posterUrl: tmdbPoster('aq0OQfRS7hDDI8vyD0ICbH9eguC'),
    genres: ['Science Fiction', 'Adventure'],
    directors: ['Fred M. Wilcox'],
    writers: ['Cyril Hume'],
    cast: [
      'Walter Pidgeon',
      'Anne Francis',
      'Leslie Nielsen',
      'Warren Stevens',
      'Jack Kelly',
      'Earl Holliman',
    ],
  },
  // https://www.themoviedb.org/movie/994
  {
    title: 'Straw Dogs',
    releaseDate: '1971-11-25',
    runtimeMinutes: 116,
    synopsis:
      "David Sumner, a mild-mannered academic from the United States, marries Amy, an Englishwoman. In order to escape a hectic stateside lifestyle, David and his wife relocate to the small town in rural Cornwall where Amy was raised. There, David is ostracized by the brutish men of the village, including Amy's old flame, Charlie. Eventually the taunts escalate.",
    posterUrl: tmdbPoster('yigkfHE1OhkxPPrjrV78Y9ibGEk'),
    genres: ['Thriller', 'Drama', 'Crime'],
    directors: ['Sam Peckinpah'],
    writers: ['Sam Peckinpah', 'David Zelag Goodman'],
    cast: [
      'Dustin Hoffman',
      'Susan George',
      'Peter Vaughan',
      'T. P. McKenna',
      'Del Henney',
      'Jim Norton',
    ],
  },
  // https://www.themoviedb.org/movie/488
  {
    title: 'The African Queen',
    releaseDate: '1952-01-07',
    runtimeMinutes: 105,
    synopsis:
      'At the start of the First World War, in the middle of Africa’s nowhere, a gin soaked riverboat captain is persuaded by a strong-willed missionary to go down river and face-off a German warship.',
    posterUrl: tmdbPoster('2Ypg0KhQfFYWILelvHGtSHHR0dk'),
    genres: ['Romance', 'Adventure', 'Drama'],
    directors: ['John Huston'],
    writers: ['John Huston', 'James Agee'],
    cast: [
      'Humphrey Bogart',
      'Katharine Hepburn',
      'Robert Morley',
      'Peter Bull',
      'Theodore Bikel',
      'Walter Gotell',
    ],
  },
  // https://www.themoviedb.org/movie/760
  {
    title: 'The Mad Adventures of Rabbi Jacob',
    releaseDate: '1973-10-17',
    runtimeMinutes: 100,
    synopsis:
      "In this riot of frantic disguises and mistaken identities, Victor Pivert, a blustering, bigoted French factory owner, finds himself taken hostage by Slimane, an Arab rebel leader. The two dress up as rabbis as they try to elude not only assasins from Slimane's country, but also the police, who think Pivert is a murderer. Pivert ends up posing as Rabbi Jacob, a beloved figure who's returned to France for his first visit after 30 years in the United States. Adding to the confusion are Pivert's dentist-wife, who thinks her husband is leaving her for another woman, their daughter, who's about to get married, and a Parisian neighborhood filled with people eager to celebrate the return of Rabbi Jacob.",
    posterUrl: tmdbPoster('oYuCFxS2BGCHNGuv9No0GoP2DZf'),
    genres: ['Comedy'],
    directors: ['Gérard Oury'],
    writers: ['Gérard Oury', 'Josy Eisenberg', 'Danièle Thompson', 'Roberto De Leonardis'],
    cast: [
      'Louis de Funès',
      'Suzy Delair',
      'Marcel Dalio',
      'Claude Giraud',
      'Renzo Montagnani',
      'Janet Brandt',
    ],
  },
  // https://www.themoviedb.org/movie/586
  {
    title: 'Wag the Dog',
    releaseDate: '1997-12-25',
    runtimeMinutes: 97,
    synopsis:
      "During the final weeks of a presidential race, the President is accused of sexual misconduct. To distract the public until the election, the President's adviser hires a Hollywood producer to help him stage a fake war.",
    posterUrl: tmdbPoster('wyQDucg22FivG3Rz7CpaOY64eMr'),
    genres: ['Comedy', 'Drama'],
    directors: ['Barry Levinson'],
    writers: ['Hilary Henkin', 'David Mamet'],
    cast: [
      'Dustin Hoffman',
      'Robert De Niro',
      'Anne Heche',
      'Woody Harrelson',
      'Denis Leary',
      'Willie Nelson',
    ],
  },
  // https://www.themoviedb.org/movie/123
  {
    title: 'The Lord of the Rings',
    releaseDate: '1978-11-15',
    runtimeMinutes: 132,
    synopsis:
      "Young Hobbit Frodo Baggins is thrown into an amazing adventure when he's tasked with destroying the One Ring, created by the dark lord Sauron. Frodo must travel in a small fellowship of nine warriors and accomplices. But it won't be an easy journey for the Fellowship of the Ring, on the ultimate quest to rid Middle-earth of evil.",
    posterUrl: tmdbPoster('liW0mjvTyLs7UCumaHhx3PpU4VT'),
    genres: ['Adventure', 'Animation', 'Fantasy'],
    directors: ['Ralph Bakshi'],
    writers: ['Peter S. Beagle', 'Chris Conkling'],
    cast: [
      'Christopher Guard',
      'William Squire',
      'Michael Scholes',
      'John Hurt',
      'Simon Chandler',
      'Dominic Guard',
    ],
  },
  // https://www.themoviedb.org/movie/339
  {
    title: 'Night on Earth',
    releaseDate: '1991-12-12',
    runtimeMinutes: 129,
    synopsis:
      'A quintet of cabbies in five cities and their remarkable fares on the same eventful night.',
    posterUrl: tmdbPoster('ktejUHCo6c8DekpOtR3uSb6oDXr'),
    genres: ['Comedy', 'Drama'],
    directors: ['Jim Jarmusch'],
    writers: ['Jim Jarmusch'],
    cast: [
      'Winona Ryder',
      'Gena Rowlands',
      'Giancarlo Esposito',
      'Armin Mueller-Stahl',
      'Rosie Perez',
      'Isaach de Bankolé',
    ],
  },
  // https://www.themoviedb.org/movie/883
  {
    title: 'Coffee and Cigarettes',
    releaseDate: '2004-03-12',
    runtimeMinutes: 97,
    synopsis:
      'An anthology of eleven vignettes featuring star-studded casts of extremely unique individuals who all share the common activities of conversing while drinking coffee and smoking cigarettes.',
    posterUrl: tmdbPoster('pfG02QCsutx3PIxFS8UY4iM9AsS'),
    genres: ['Comedy', 'Drama'],
    directors: ['Jim Jarmusch'],
    writers: ['Jim Jarmusch'],
    cast: [
      'Roberto Benigni',
      'Steven Wright',
      'Joie Lee',
      'Cinqué Lee',
      'Steve Buscemi',
      'Iggy Pop',
    ],
  },
  // https://www.themoviedb.org/movie/666
  {
    title: 'Central Station',
    releaseDate: '1998-04-03',
    runtimeMinutes: 111,
    synopsis:
      'An emotional journey of a former school teacher, who writes letters for illiterate people, and a young boy, whose mother has just died, as they search for the father he never knew.',
    posterUrl: tmdbPoster('zJvp7XjQ2LhPbDVYhFXyucs40vR'),
    genres: ['Drama'],
    directors: ['Walter Salles'],
    writers: ['Walter Salles', 'João Emanuel Carneiro', 'Marcos Bernstein'],
    cast: [
      'Fernanda Montenegro',
      'Vinícius de Oliveira',
      'Marília Pêra',
      'Othon Bastos',
      'Otávio Augusto',
      'Matheus Nachtergaele',
    ],
  },
  // https://www.themoviedb.org/movie/212
  {
    title: 'Arsenic and Old Lace',
    releaseDate: '1944-09-01',
    runtimeMinutes: 118,
    synopsis:
      "Mortimer Brewster, a newspaper drama critic, playwright, and author known for his diatribes against marriage, suddenly falls in love and gets married;  but when he makes a quick trip home to tell his two maiden aunts, he finds out his aunts' hobby - killing lonely old men and burying them in the cellar!",
    posterUrl: tmdbPoster('xG1GEEQGgExKl0WT5sRo1Arst5D'),
    genres: ['Comedy', 'Crime'],
    directors: ['Frank Capra'],
    writers: ['Philip G. Epstein', 'Julius J. Epstein'],
    cast: [
      'Cary Grant',
      'Priscilla Lane',
      'Josephine Hull',
      'Jean Adair',
      'Raymond Massey',
      'John Alexander',
    ],
  },
  // https://www.themoviedb.org/movie/1412
  {
    title: 'sex, lies, and videotape',
    releaseDate: '1989-08-04',
    runtimeMinutes: 101,
    synopsis:
      'Ann, a frustrated wife, enters into counseling due to a troubled marriage. Unbeknownst to her, her husband John has begun an affair with her sister. When John’s best friend Graham arrives, his penchant for interviewing women about their sex lives forever changes John and Ann’s rocky marriage.',
    posterUrl: tmdbPoster('dE0u4uB5UPfVIdz258Ye2XEPuuh'),
    genres: ['Drama'],
    directors: ['Steven Soderbergh'],
    writers: ['Steven Soderbergh'],
    cast: [
      'James Spader',
      'Andie MacDowell',
      'Peter Gallagher',
      'Laura San Giacomo',
      'Ron Vawter',
      'Steven Brill',
    ],
  },
  // https://www.themoviedb.org/movie/1024
  {
    title: 'Heavenly Creatures',
    releaseDate: '1994-09-12',
    runtimeMinutes: 109,
    synopsis:
      'Precocious teenager Juliet moves to New Zealand with her family and soon befriends the quiet, brooding Pauline through their shared love of fantasy and literature. This friendship gradually develops into an intense and obsessive bond.',
    posterUrl: tmdbPoster('uvb86wVCIqD3Rlbr0GTNgWDF7Zo'),
    genres: ['Drama', 'Fantasy'],
    directors: ['Peter Jackson'],
    writers: ['Peter Jackson', 'Fran Walsh'],
    cast: [
      'Melanie Lynskey',
      'Kate Winslet',
      'Sarah Peirse',
      'Diana Kent',
      'Clive Merrison',
      "Simon O'Connor",
    ],
  },
  // https://www.themoviedb.org/movie/940
  {
    title: 'The Lady Vanishes',
    releaseDate: '1938-10-07',
    runtimeMinutes: 96,
    synopsis:
      'On a train headed for England a group of travelers is delayed by an avalanche. Holed up in a hotel in a fictional European country, young Iris befriends elderly Miss Froy. When the train resumes, Iris suffers a bout of unconsciousness and wakes to find the old woman has disappeared. The other passengers ominously deny Miss Froy ever existed, so Iris begins to investigate with another traveler and, as the pair sleuth, romantic sparks fly.',
    posterUrl: tmdbPoster('qyP7W58Z8BUwl2tL1UE1VVXEU0K'),
    genres: ['Mystery', 'Thriller'],
    directors: ['Alfred Hitchcock'],
    writers: ['Frank Launder', 'Sidney Gilliat'],
    cast: [
      'Margaret Lockwood',
      'Michael Redgrave',
      'Paul Lukas',
      'May Whitty',
      'Basil Radford',
      'Naunton Wayne',
    ],
  },
  // https://www.themoviedb.org/movie/551
  {
    title: 'The Poseidon Adventure',
    releaseDate: '1972-12-01',
    runtimeMinutes: 117,
    synopsis:
      'When their ocean liner capsizes, a group of passengers struggle to survive and escape.',
    posterUrl: tmdbPoster('6RGiA5BfhelU9zoD0b1GAG4GWWf'),
    genres: ['Adventure', 'Drama', 'Thriller'],
    directors: ['Ronald Neame'],
    writers: ['Stirling Silliphant', 'Wendell Mayes'],
    cast: [
      'Gene Hackman',
      'Ernest Borgnine',
      'Stella Stevens',
      'Shelley Winters',
      'Jack Albertson',
      'Red Buttons',
    ],
  },
  // https://www.themoviedb.org/movie/573
  {
    title: 'Frenzy',
    releaseDate: '1972-05-25',
    runtimeMinutes: 116,
    synopsis:
      'London is terrorized by a vicious sex killer known as The Necktie Murderer. Following the brutal slaying of his ex-wife, down-on-his-luck Richard Blaney is suspected by the police of being the killer. He goes on the run, determined to prove his innocence.',
    posterUrl: tmdbPoster('4SFvqrlSigAt9tnhXFSMyKeJWQk'),
    genres: ['Crime', 'Thriller', 'Horror'],
    directors: ['Alfred Hitchcock'],
    writers: ['Anthony Shaffer'],
    cast: [
      'Jon Finch',
      'Barry Foster',
      'Barbara Leigh-Hunt',
      'Anna Massey',
      'Alec McCowen',
      'Vivien Merchant',
    ],
  },
  // https://www.themoviedb.org/movie/649
  {
    title: 'Belle de Jour',
    releaseDate: '1967-05-24',
    runtimeMinutes: 101,
    synopsis:
      'Beautiful young housewife Séverine Serizy cannot reconcile her masochistic fantasies with her everyday life alongside dutiful husband Pierre. When her lovestruck friend Henri mentions a secretive high-class brothel run by Madame Anais, Séverine begins to work there during the day under the name Belle de Jour. But when one of her clients grows possessive, she must try to go back to her normal life.',
    posterUrl: tmdbPoster('iUAFECovwPA0cVV9bo4uNGLJSGL'),
    genres: ['Drama', 'Romance'],
    directors: ['Luis Buñuel'],
    writers: ['Luis Buñuel', 'Jean-Claude Carrière'],
    cast: [
      'Catherine Deneuve',
      'Jean Sorel',
      'Michel Piccoli',
      'Geneviève Page',
      'Pierre Clémenti',
      'Françoise Fabian',
    ],
  },
  // https://www.themoviedb.org/movie/981
  {
    title: 'The Philadelphia Story',
    releaseDate: '1940-12-05',
    runtimeMinutes: 113,
    synopsis:
      "When a rich woman's ex-husband and a tabloid-type reporter turn up just before her planned remarriage, she begins to learn the truth about herself.",
    posterUrl: tmdbPoster('dKUubjvxO78XDts6VP1Ggcp4R9O'),
    genres: ['Comedy', 'Romance'],
    directors: ['George Cukor'],
    writers: ['Waldo Salt', 'Donald Ogden Stewart'],
    cast: [
      'Cary Grant',
      'Katharine Hepburn',
      'James Stewart',
      'Ruth Hussey',
      'John Howard',
      'Roland Young',
    ],
  },
  // https://www.themoviedb.org/movie/173
  {
    title: '20,000 Leagues Under the Sea',
    releaseDate: '1954-12-23',
    runtimeMinutes: 127,
    synopsis:
      'A ship sent to investigate a wave of mysterious sinkings encounters the advanced submarine, the Nautilus, commanded by Captain Nemo.',
    posterUrl: tmdbPoster('heAEH85fdxEgV98LizHbQCL95iZ'),
    genres: ['Adventure', 'Science Fiction', 'Fantasy'],
    directors: ['Richard Fleischer'],
    writers: ['Earl Felton'],
    cast: [
      'Kirk Douglas',
      'James Mason',
      'Paul Lukas',
      'Peter Lorre',
      'Robert J. Wilke',
      'Ted de Corsia',
    ],
  },
  // https://www.themoviedb.org/movie/1259
  {
    title: 'Notes on a Scandal',
    releaseDate: '2006-12-25',
    runtimeMinutes: 92,
    synopsis:
      'A veteran high school teacher befriends a younger art teacher, who is having an affair with one of her 15-year-old students. However, her intentions with this new "friend" also go well beyond platonic friendship.',
    posterUrl: tmdbPoster('ieX6ZO2Kf2qjoIBXbQW5awivbhY'),
    genres: ['Drama', 'Romance'],
    directors: ['Richard Eyre'],
    writers: ['Patrick Marber'],
    cast: [
      'Judi Dench',
      'Cate Blanchett',
      'Bill Nighy',
      'Andrew Simpson',
      'Phil Davis',
      'Michael Maloney',
    ],
  },
  // https://www.themoviedb.org/movie/307
  {
    title: 'Rome, Open City',
    releaseDate: '1945-10-08',
    runtimeMinutes: 104,
    synopsis:
      'During the Nazi occupation of 1944 Rome, Resistance leader Giorgio Manfredi is pursued by the Nazis as he seeks refuge and a means of escape.',
    posterUrl: tmdbPoster('ijGV4v8JxgbNzgEhqKdzHdaZn8a'),
    genres: ['Drama', 'War'],
    directors: ['Roberto Rossellini'],
    writers: ['Roberto Rossellini', 'Sergio Amidei', 'Federico Fellini'],
    cast: [
      'Aldo Fabrizi',
      'Marcello Pagliero',
      'Harry Feist',
      'Anna Magnani',
      'Maria Michi',
      'Francesco Grandjacquet',
    ],
  },
  // https://www.themoviedb.org/movie/761
  {
    title: 'The Wing or the Thigh?',
    releaseDate: '1976-10-27',
    runtimeMinutes: 104,
    synopsis:
      'Charles Duchemin, a well-known gourmet and publisher of a famous restaurant guide, is waging a war against fast food entrepreneur Tri- catel to save the French art of cooking. After having agreed to appear on a talk show to show his skills in naming food and wine by taste, he is confronted with two disasters: his son wants to become a clown rather than a restaurant tester and he, the famous Charles Duchemin, has lost his taste!',
    posterUrl: tmdbPoster('ywkIu5l3iAgPZvLFEVBDYxLouH8'),
    genres: ['Comedy'],
    directors: ['Claude Zidi'],
    writers: ['Claude Zidi', 'Michel Fabre'],
    cast: [
      'Louis de Funès',
      'Coluche',
      'Ann Zacharias',
      'Julien Guiomar',
      'Raymond Bussières',
      'Philippe Bouvard',
    ],
  },
  // https://www.themoviedb.org/movie/821
  {
    title: 'Judgment at Nuremberg',
    releaseDate: '1961-12-18',
    runtimeMinutes: 191,
    synopsis:
      'In 1947, four German judges who served on the bench during the Nazi regime face a military tribunal to answer charges of crimes against humanity. Chief Justice Haywood hears evidence and testimony not only from lead defendant Ernst Janning and his defense attorney Hans Rolfe, but also from the widow of a Nazi general, an idealistic U.S. Army captain and reluctant witness Irene Wallner.',
    posterUrl: tmdbPoster('b6vYatvui1EXeFYfpDX4rcbueuP'),
    genres: ['Drama', 'History'],
    directors: ['Stanley Kramer'],
    writers: ['Abby Mann'],
    cast: [
      'Spencer Tracy',
      'Richard Widmark',
      'Maximilian Schell',
      'Burt Lancaster',
      'Marlene Dietrich',
      'Judy Garland',
    ],
  },
  // https://www.themoviedb.org/movie/1040
  {
    title: 'The Leopard',
    releaseDate: '1963-03-27',
    runtimeMinutes: 186,
    synopsis:
      "As Garibaldi's troops begin the unification of Italy in the 1860s, an aristocratic Sicilian family grudgingly adapts to the sweeping social changes undermining their way of life.",
    posterUrl: tmdbPoster('riSUxwoK3xjkOgy6YJSvPhi7cO6'),
    genres: ['Drama'],
    directors: ['Luchino Visconti'],
    writers: [
      'Luchino Visconti',
      'Massimo Franciosa',
      'Enrico Medioli',
      "Suso Cecchi d'Amico",
      'Pasquale Festa Campanile',
    ],
    cast: [
      'Burt Lancaster',
      'Claudia Cardinale',
      'Alain Delon',
      'Paolo Stoppa',
      'Rina Morelli',
      'Romolo Valli',
    ],
  },
  // https://www.themoviedb.org/movie/895
  {
    title: 'Andrei Rublev',
    releaseDate: '1966-12-16',
    runtimeMinutes: 183,
    synopsis:
      'An expansive Russian drama, this film focuses on the life of revered religious icon painter Andrei Rublev. Drifting from place to place in a tumultuous era, the peace-seeking monk eventually gains a reputation for his art. But after Rublev witnesses a brutal battle and unintentionally becomes involved, he takes a vow of silence and spends time away from his work. As he begins to ease his troubled soul, he takes steps towards becoming a painter once again.',
    posterUrl: tmdbPoster('jUihkn16SwPPIjuOyo6orHWUep6'),
    genres: ['Drama', 'History'],
    directors: ['Andrei Tarkovsky'],
    writers: ['Andrei Tarkovsky', 'Andrei Konchalovsky'],
    cast: [
      'Anatoliy Solonitsyn',
      'Ivan Lapikov',
      'Mykola Hrynko',
      'Nikolai Sergeyev',
      'Irma Raush',
      'Nikolay Burlyaev',
    ],
  },
  // https://www.themoviedb.org/movie/143
  {
    title: 'All Quiet on the Western Front',
    releaseDate: '1930-04-29',
    runtimeMinutes: 133,
    synopsis:
      'When a group of idealistic young men join the German Army during the Great War, they are assigned to the Western Front, where their patriotism is destroyed by the harsh realities of combat.',
    posterUrl: tmdbPoster('1wZUB08igw8iLUgF1r4T6aJD65b'),
    genres: ['Drama', 'War'],
    directors: ['Lewis Milestone'],
    writers: ['George Abbott'],
    cast: ['Louis Wolheim', 'Lew Ayres', 'John Wray', 'Arnold Lucy', 'Ben Alexander', 'Scott Kolk'],
  },
  // https://www.themoviedb.org/movie/1492
  {
    title: '1492: Conquest of Paradise',
    releaseDate: '1992-08-09',
    runtimeMinutes: 154,
    synopsis:
      '1492: Conquest of Paradise depicts Christopher Columbus’ discovery of The New World and his effect on the indigenous people.',
    posterUrl: tmdbPoster('3effmbI6BbGW9i0HzEDfVGuOsvz'),
    genres: ['Action', 'Adventure', 'Drama', 'History'],
    directors: ['Ridley Scott'],
    writers: ['Roselyne Bosch'],
    cast: [
      'Gérard Depardieu',
      'Armand Assante',
      'Sigourney Weaver',
      'Loren Dean',
      'Ángela Molina',
      'Fernando Rey',
    ],
  },
  // https://www.themoviedb.org/movie/1499
  {
    title: 'Teenage Mutant Ninja Turtles III',
    releaseDate: '1993-03-17',
    runtimeMinutes: 95,
    synopsis:
      'The four turtles travel back in time to the days of the legendary and deadly samurai in ancient Japan, where they train to perfect the art of becoming one. The turtles also assist a small village in an uprising.',
    posterUrl: tmdbPoster('fwX5RdPDBFsbEAXc46DrvRz5Bca'),
    genres: ['Action', 'Adventure', 'Comedy', 'Family', 'Fantasy', 'Science Fiction'],
    directors: ['Stuart Gillard'],
    writers: ['Stuart Gillard'],
    cast: [
      'Brian Tochi',
      'Tim Kelleher',
      'Corey Feldman',
      'Robbie Rist',
      'Paige Turco',
      'Elias Koteas',
    ],
  },
  // https://www.themoviedb.org/movie/396
  {
    title: "Who's Afraid of Virginia Woolf?",
    releaseDate: '1966-06-22',
    runtimeMinutes: 131,
    synopsis:
      "A history professor and his wife entertain a young couple who are new to the university's faculty. As the drinks flow, secrets come to light, and the middle-aged couple unload onto their guests the full force of the bitterness, dysfunction, and animosity that defines their marriage.",
    posterUrl: tmdbPoster('wF7ihB5V5gSm6zxjv3ZhHOpgREI'),
    genres: ['Drama'],
    directors: ['Mike Nichols'],
    writers: ['Ernest Lehman'],
    cast: [
      'Elizabeth Taylor',
      'Richard Burton',
      'George Segal',
      'Sandy Dennis',
      'Agnes Flanagan',
      'Frank Flanagan',
    ],
  },
  // https://www.themoviedb.org/movie/631
  {
    title: 'Sunrise: A Song of Two Humans',
    releaseDate: '1927-11-04',
    runtimeMinutes: 94,
    synopsis:
      'A married farmer falls under the spell of a slatternly woman from the city, who tries to convince him to drown his wife.',
    posterUrl: tmdbPoster('5V9jDm4u2QemGHbqjUyP5HmFmzf'),
    genres: ['Drama', 'Romance'],
    directors: ['F. W. Murnau'],
    writers: ['Carl Mayer'],
    cast: [
      "George O'Brien",
      'Janet Gaynor',
      'Margaret Livingston',
      'Bodil Rosing',
      'J. Farrell MacDonald',
      'Ralph Sipperly',
    ],
  },
  // https://www.themoviedb.org/movie/1116
  {
    title: 'The Wind That Shakes the Barley',
    releaseDate: '2006-06-23',
    runtimeMinutes: 127,
    synopsis:
      "In 1920s Ireland young doctor Damien O'Donovan prepares to depart for a new job in a London hospital. As he says his goodbyes at a friend's farm, British Black and Tans arrive, and a young man is killed. Damien joins his brother Teddy in the Irish Republican Army, but political events are soon set in motion that tear the brothers apart.",
    posterUrl: tmdbPoster('yCb4LweL6U7KTgSda3Wb7vHiA9J'),
    genres: ['Drama', 'War'],
    directors: ['Ken Loach'],
    writers: ['Paul Laverty'],
    cast: [
      'Cillian Murphy',
      'Pádraic Delaney',
      'Liam Cunningham',
      'Orla Fitzgerald',
      "Mary O'Riordan",
      'Mary Murphy',
    ],
  },
  // https://www.themoviedb.org/movie/467
  {
    title: 'The Hole',
    releaseDate: '2001-04-20',
    runtimeMinutes: 102,
    synopsis:
      'Four teenagers at a British private school secretly uncover and explore the depths of a sealed underground hole created decades ago as a possible bomb shelter.',
    posterUrl: tmdbPoster('n5aMoI6AZLJzUoNbjMj0P60EYMJ'),
    genres: ['Crime', 'Drama', 'Horror', 'Thriller'],
    directors: ['Nick Hamm'],
    writers: ['Caroline Ip', 'Ben Court'],
    cast: [
      'Thora Birch',
      'Desmond Harrington',
      'Keira Knightley',
      'Laurence Fox',
      'Embeth Davidtz',
      'Steven Waddington',
    ],
  },
  // https://www.themoviedb.org/movie/1600
  {
    title: 'The Double Life of Véronique',
    releaseDate: '1991-05-15',
    runtimeMinutes: 98,
    synopsis:
      'Véronique is a beautiful young French woman who aspires to be a renowned singer; Weronika lives in Poland, has a similar career goal and looks identical to Véronique, though the two are not related. The film follows both women as they contend with the ups and downs of their individual lives, with Véronique embarking on an unusual romance with Alexandre Fabbri, a puppeteer who may be able to help her with her existential issues.',
    posterUrl: tmdbPoster('oqRyO9xrNBRaxqF9pCHHgLuaATx'),
    genres: ['Drama', 'Fantasy'],
    directors: ['Krzysztof Kieślowski'],
    writers: ['Krzysztof Kieślowski', 'Krzysztof Piesiewicz'],
    cast: [
      'Irène Jacob',
      'Halina Gryglaszewska',
      'Philippe Volter',
      'Guillaume de Tonquédec',
      'Kalina Jędrusik',
      'Aleksander Bardini',
    ],
  },
  // https://www.themoviedb.org/movie/1683
  {
    title: 'The Reaping',
    releaseDate: '2007-04-04',
    runtimeMinutes: 99,
    synopsis:
      'Katherine Morrissey, a former Christian missionary, lost her faith after the tragic deaths of her family. Now she applies her expertise to debunking religious phenomena. When a series of biblical plagues overrun a small town, Katherine arrives to prove that a supernatural force is not behind the occurrences, but soon finds that science cannot explain what is happening. Instead, she must regain her faith to combat the evil that waits in a Louisiana swamp.',
    posterUrl: tmdbPoster('o8Vl4Vxp5LBth9J6Aa3k6PAefxt'),
    genres: ['Horror'],
    directors: ['Stephen Hopkins'],
    writers: ['Chad Hayes', 'Carey Hayes'],
    cast: [
      'Hilary Swank',
      'David Morrissey',
      'Idris Elba',
      'AnnaSophia Robb',
      'Stephen Rea',
      'William Ragsdale',
    ],
  },
  // https://www.themoviedb.org/movie/577
  {
    title: 'To Die For',
    releaseDate: '1995-09-22',
    runtimeMinutes: 106,
    synopsis:
      'Suzanne Stone wants to be a world-famous news anchor and she is willing to do anything to get what she wants. What she lacks in intelligence, she makes up for in cold determination and diabolical wiles. As she pursues her goal with relentless focus, she is forced to destroy anything and anyone that may stand in her way, regardless of the ultimate cost or means necessary.',
    posterUrl: tmdbPoster('whz4bwvqE1OmQHIyqHdZD8jU9CO'),
    genres: ['Drama', 'Comedy', 'Crime'],
    directors: ['Gus Van Sant'],
    writers: ['Buck Henry'],
    cast: [
      'Nicole Kidman',
      'Matt Dillon',
      'Joaquin Phoenix',
      'Casey Affleck',
      'Illeana Douglas',
      'Alison Folland',
    ],
  },
  // https://www.themoviedb.org/movie/1406
  {
    title: 'City Slickers',
    releaseDate: '1991-06-07',
    runtimeMinutes: 114,
    synopsis:
      'Three New York businessmen decide to take a "Wild West" vacation that turns out not to be the relaxing vacation they had envisioned.',
    posterUrl: tmdbPoster('9DVZpm9pQNB3M17cRo752zqUYhL'),
    genres: ['Comedy', 'Western'],
    directors: ['Ron Underwood'],
    writers: ['Lowell Ganz', 'Babaloo Mandel'],
    cast: [
      'Billy Crystal',
      'Daniel Stern',
      'Bruno Kirby',
      'Patricia Wettig',
      'Helen Slater',
      'Lindsay Crystal',
    ],
  },
  // https://www.themoviedb.org/movie/1554
  {
    title: 'Down by Law',
    releaseDate: '1986-09-20',
    runtimeMinutes: 106,
    synopsis: 'A disc jockey, a pimp and an Italian tourist escape from jail in New Orleans.',
    posterUrl: tmdbPoster('4IyxoUQ7BB5kcSd7gASe2dTyWu7'),
    genres: ['Crime', 'Drama', 'Comedy'],
    directors: ['Jim Jarmusch'],
    writers: ['Jim Jarmusch'],
    cast: [
      'Tom Waits',
      'John Lurie',
      'Roberto Benigni',
      'Nicoletta Braschi',
      'Ellen Barkin',
      'Billie Neal',
    ],
  },
  // https://www.themoviedb.org/movie/261
  {
    title: 'Cat on a Hot Tin Roof',
    releaseDate: '1958-08-29',
    runtimeMinutes: 108,
    synopsis:
      'An alcoholic ex-football player drinks his days away, having failed to come to terms with his sexuality and his real feelings for his football buddy who died after an ambiguous accident. His wife is crucified by her desperation to make him desire her: but he resists the affections of his wife. His reunion with his father—who is dying of cancer—jogs a host of memories and revelations for both father and son.',
    posterUrl: tmdbPoster('5djZZECgqDGuSI1INmrdAcGRBb0'),
    genres: ['Drama'],
    directors: ['Richard Brooks'],
    writers: ['Richard Brooks', 'James Poe'],
    cast: [
      'Paul Newman',
      'Elizabeth Taylor',
      'Burl Ives',
      'Judith Anderson',
      'Jack Carson',
      'Madeleine Sherwood',
    ],
  },
  // https://www.themoviedb.org/movie/198
  {
    title: 'To Be or Not to Be',
    releaseDate: '1942-03-06',
    runtimeMinutes: 99,
    synopsis:
      "During the Nazi occupation of Poland, an acting troupe becomes embroiled in a Polish soldier's efforts to track down a German spy.",
    posterUrl: tmdbPoster('dDQRpEoyjHT4fzw9cNklIvZuXYg'),
    genres: ['Comedy', 'War', 'Romance'],
    directors: ['Ernst Lubitsch'],
    writers: ['Edwin Justus Mayer'],
    cast: [
      'Carole Lombard',
      'Jack Benny',
      'Robert Stack',
      'Felix Bressart',
      'Lionel Atwill',
      'Stanley Ridges',
    ],
  },
  // https://www.themoviedb.org/movie/625
  {
    title: 'The Killing Fields',
    releaseDate: '1984-11-23',
    runtimeMinutes: 142,
    synopsis:
      'New York Times reporter Sydney Schanberg is on assignment covering the Cambodian Civil War, with the help of local interpreter Dith Pran and American photojournalist Al Rockoff. When the U.S. Army pulls out amid escalating violence, Schanberg makes exit arrangements for Pran and his family. Pran, however, tells Schanberg he intends to stay in Cambodia to help cover the unfolding story — a decision he may regret as the Khmer Rouge rebels move in.',
    posterUrl: tmdbPoster('cX6Bv7natnZwQjsV9bLL8mmWjkS'),
    genres: ['Drama', 'History', 'War'],
    directors: ['Roland Joffé'],
    writers: ['Bruce Robinson'],
    cast: [
      'Sam Waterston',
      'Haing S. Ngor',
      'John Malkovich',
      'Julian Sands',
      'Craig T. Nelson',
      'Spalding Gray',
    ],
  },
  // https://www.themoviedb.org/movie/791
  {
    title: 'The Fog',
    releaseDate: '2005-10-14',
    runtimeMinutes: 100,
    synopsis:
      "Trapped within an eerie mist, the residents of Antonio Bay have become the unwitting victims of a horrifying vengeance. One hundred years earlier, a ship carrying lepers was purposely lured onto the rocky coastline and sank, drowning all aboard. Now they're back – long-dead mariners who've waited a century for their revenge.",
    posterUrl: tmdbPoster('v9vt49PUDJGkrMVjhb3yiYo7H4Y'),
    genres: ['Horror', 'Mystery'],
    directors: ['Rupert Wainwright'],
    writers: ['Cooper Layne'],
    cast: [
      'Tom Welling',
      'Maggie Grace',
      'Selma Blair',
      'DeRay Davis',
      'Kenneth Welsh',
      'Adrian Hough',
    ],
  },
  // https://www.themoviedb.org/movie/1075
  {
    title: 'Black Cat, White Cat',
    releaseDate: '1998-06-01',
    runtimeMinutes: 127,
    synopsis:
      "A small-time hustler makes a deal with a notorious gangster to whom he owes money: marry his teenage son to the latter's daughter. However, the young lovers are not as agreeable.",
    posterUrl: tmdbPoster('xxQ9jgYf3xhbUTW98VtCjA1wMLv'),
    genres: ['Comedy', 'Romance', 'Crime'],
    directors: ['Emir Kusturica'],
    writers: ['Emir Kusturica', 'Gordan Mihić'],
    cast: [
      'Bajram Severdžan',
      "Srđan 'Žika' Todorović",
      'Zabit Memedov',
      'Florijan Ajdini',
      'Branka Katić',
      'Ljubica Adžović',
    ],
  },
  // https://www.themoviedb.org/movie/340
  {
    title: 'Everything Is Illuminated',
    releaseDate: '2005-09-05',
    runtimeMinutes: 105,
    synopsis:
      'A young Jewish American man endeavors—with the help of eccentric, distant relatives—to find the woman who saved his grandfather during World War II—in a Ukrainian village which was ultimately razed by the Nazis.',
    posterUrl: tmdbPoster('gk469Y3fJTlbcAkSNMZc4OtETOK'),
    genres: ['Comedy', 'Drama'],
    directors: ['Liev Schreiber'],
    writers: ['Liev Schreiber'],
    cast: [
      'Elijah Wood',
      'Eugene Hutz',
      'Boris Lyoskin',
      'Jana Hrabětova',
      'Jonathan Safran Foer',
      'Stephen Samudovsky',
    ],
  },
  // https://www.themoviedb.org/movie/1439
  {
    title: 'Anna and the King',
    releaseDate: '1999-12-16',
    runtimeMinutes: 148,
    synopsis:
      'The story of the romance between the King of Siam (now Thailand) and the widowed British school teacher Anna Leonowens during the 1860s. Anna teaches the children and becomes romanced by the King. She convinces him that a man can be loved by just one woman.',
    posterUrl: tmdbPoster('PIlOkljucv7HnvATbn4JwrAvSn'),
    genres: ['Drama', 'Romance', 'History'],
    directors: ['Andy Tennant'],
    writers: ['Peter Krikes', 'Steve Meerson'],
    cast: [
      'Jodie Foster',
      'Chow Yun-Fat',
      'Bai Ling',
      'Tom Felton',
      'Syed Alwi',
      'Randall Duk Kim',
    ],
  },
  // https://www.themoviedb.org/movie/889
  {
    title: 'The Flintstones in Viva Rock Vegas',
    releaseDate: '2000-04-28',
    runtimeMinutes: 91,
    synopsis:
      "The Flintstones are at it again. The Flintstones and the Rubbles head for Rock Vegas with Fred hoping to court the lovely Wilma. Nothing will stand in the way of love, except for the conniving Chip Rockefeller who is the playboy born in Baysville but who has made it in the cutthroat town of Rock Vegas. Will Fred win Wilma's love?",
    posterUrl: tmdbPoster('qTcf60dqziF7xU2amxIIsvrnkTl'),
    genres: ['Comedy', 'Family', 'Romance'],
    directors: ['Brian Levant'],
    writers: [
      'Jim Cash',
      'Jack Epps Jr.',
      'Harry Elfont',
      'Deborah Kaplan',
      'Joseph Barbera',
      'William Hanna',
    ],
    cast: [
      'Mark Addy',
      'Stephen Baldwin',
      'Kristen Johnston',
      'Jane Krakowski',
      'Joan Collins',
      'Thomas Gibson',
    ],
  },
  // https://www.themoviedb.org/movie/1494
  {
    title: 'Curse of the Golden Flower',
    releaseDate: '2006-12-14',
    runtimeMinutes: 114,
    synopsis:
      "During China's Tang dynasty the emperor has taken the princess of a neighboring province as his wife. She has borne him two sons and raised his eldest. Now his control over his dominion is complete, including the royal family itself.",
    posterUrl: tmdbPoster('gHkkDpfo5YnOrbVfwtDHi91BkrU'),
    genres: ['Action', 'Drama', 'Fantasy'],
    directors: ['Zhang Yimou'],
    writers: ['Zhang Yimou', 'Bian Zhihong', 'Wu Nan'],
    cast: ['Chow Yun-Fat', 'Gong Li', 'Jay Chou', 'Liu Ye', 'Qin Junjie', 'Li Man'],
  },
  // https://www.themoviedb.org/movie/867
  {
    title: 'Sliver',
    releaseDate: '1993-05-21',
    runtimeMinutes: 107,
    synopsis:
      "A woman moves into a Manhattan apartment, where she learns that the previous tenant's life ended under mysterious circumstances.",
    posterUrl: tmdbPoster('g7PC2e2KqDkIfOoJx9iXJJez99d'),
    genres: ['Drama', 'Thriller'],
    directors: ['Phillip Noyce'],
    writers: ['Joe Eszterhas'],
    cast: [
      'Sharon Stone',
      'William Baldwin',
      'Tom Berenger',
      'Polly Walker',
      'Colleen Camp',
      'Amanda Foreman',
    ],
  },
  // https://www.themoviedb.org/movie/220
  {
    title: 'East of Eden',
    releaseDate: '1955-04-10',
    runtimeMinutes: 115,
    synopsis:
      'In the Salinas Valley in and around World War I, Cal Trask feels he must compete against overwhelming odds with his brother for the love of their father. Cal is frustrated at every turn, from his reaction to the war, how to get ahead in business and in life, and how to relate to his estranged mother.',
    posterUrl: tmdbPoster('xv1MZVIop0SQqwLUymgE5eb2LFl'),
    genres: ['Drama'],
    directors: ['Elia Kazan'],
    writers: ['Paul Osborn'],
    cast: [
      'James Dean',
      'Julie Harris',
      'Raymond Massey',
      'Richard Davalos',
      'Jo Van Fleet',
      'Burl Ives',
    ],
  },
  // https://www.themoviedb.org/movie/982
  {
    title: 'The Manchurian Candidate',
    releaseDate: '1962-10-24',
    runtimeMinutes: 126,
    synopsis:
      'Near the end of the Korean War, a platoon of U.S. soldiers is captured by communists and brainwashed. Following the war, the platoon is returned home, and Sergeant Raymond Shaw is lauded as a hero by the rest of his platoon. However, the platoon commander, Captain Bennett Marco, finds himself plagued by strange nightmares and soon races to uncover a terrible plot.',
    posterUrl: tmdbPoster('2xQ856kd9hw6bB3OnusGyTvvkwB'),
    genres: ['Thriller', 'Drama'],
    directors: ['John Frankenheimer'],
    writers: ['George Axelrod'],
    cast: [
      'Frank Sinatra',
      'Laurence Harvey',
      'Angela Lansbury',
      'Janet Leigh',
      'James Gregory',
      'Henry Silva',
    ],
  },
  // https://www.themoviedb.org/movie/397
  {
    title: 'French Kiss',
    releaseDate: '1995-05-05',
    runtimeMinutes: 111,
    synopsis:
      'After her fiancee admits to infidelity while on a business trip in France, a woman attempts to get her lover back and marry him by traveling to Paris despite her crippling fear of flying.  On the way she unwittingly smuggles something of value that has a charming crook chasing her across France as she chases after her future husband.',
    posterUrl: tmdbPoster('q5hXdMfxSwhuOmWmkTJmm5qVijc'),
    genres: ['Comedy', 'Romance', 'Drama'],
    directors: ['Lawrence Kasdan'],
    writers: ['Adam Brooks'],
    cast: [
      'Meg Ryan',
      'Kevin Kline',
      'Timothy Hutton',
      'Jean Reno',
      'François Cluzet',
      'Suzan Anbeh',
    ],
  },
  // https://www.themoviedb.org/movie/1023
  {
    title: "Adam's Apples",
    releaseDate: '2005-04-15',
    runtimeMinutes: 95,
    synopsis:
      'A neo-nazi sentenced to community service at a church clashes with the blindly devotional priest.',
    posterUrl: tmdbPoster('kBP0xOOaAT9rmJZGVxrolRk87AR'),
    genres: ['Drama', 'Comedy', 'Crime'],
    directors: ['Anders Thomas Jensen'],
    writers: ['Anders Thomas Jensen', 'Rikke Deepthi Hansen'],
    cast: [
      'Mads Mikkelsen',
      'Ulrich Thomsen',
      'Paprika Steen',
      'Ole Thestrup',
      'Nikolaj Lie Kaas',
      'Nicolas Bro',
    ],
  },
  // https://www.themoviedb.org/movie/1534
  {
    title: 'Pathfinder',
    releaseDate: '2007-01-11',
    runtimeMinutes: 99,
    synopsis:
      'A Viking boy is left behind after his clan battles a Native American tribe. Raised within the tribe, he ultimately becomes their savior in a fight against the Norsemen.',
    posterUrl: tmdbPoster('mME7efKNTU7jzXTgFkI1t0aQUiz'),
    genres: ['Adventure', 'Action'],
    directors: ['Marcus Nispel'],
    writers: ['Laeta Kalogridis'],
    cast: [
      'Karl Urban',
      'Moon Bloodgood',
      'Nicole Muñoz',
      'Clancy Brown',
      'Jay Tavare',
      'Ray G. Thunderchild',
    ],
  },
  // https://www.themoviedb.org/movie/499
  {
    title: 'Cléo from 5 to 7',
    releaseDate: '1962-04-11',
    runtimeMinutes: 90,
    synopsis:
      'Agnès Varda eloquently captures Paris in the sixties with this real-time portrait of a singer set adrift in the city as she awaits test results of a biopsy. A chronicle of the minutes of one woman’s life, Cléo from 5 to 7 is a spirited mix of vivid vérité and melodrama, featuring a score by Michel Legrand and cameos by Jean-Luc Godard and Anna Karina.',
    posterUrl: tmdbPoster('oelBStY4xpguaplRv15P3Za7Xsr'),
    genres: ['Drama'],
    directors: ['Agnès Varda'],
    writers: ['Agnès Varda'],
    cast: [
      'Corinne Marchand',
      'Antoine Bourseiller',
      'Dominique Davray',
      'Dorothée Blanck',
      'Michel Legrand',
      'José Luis de Vilallonga',
    ],
  },
  // https://www.themoviedb.org/movie/777
  {
    title: 'Grand Illusion',
    releaseDate: '1937-06-18',
    runtimeMinutes: 114,
    synopsis:
      'A group of French soldiers, including the patrician Captain de Boeldieu and the working-class Lieutenant Maréchal, grapple with their own class differences after being captured and held in a World War I German prison camp. When the men are transferred to a high-security fortress, they must concoct a plan to escape beneath the watchful eye of aristocratic German officer von Rauffenstein, who has formed an unexpected bond with de Boeldieu.',
    posterUrl: tmdbPoster('lWg41zE0FVixkNsFgxnlRyvDYv9'),
    genres: ['Drama', 'History', 'War'],
    directors: ['Jean Renoir'],
    writers: ['Jean Renoir', 'Charles Spaak'],
    cast: [
      'Jean Gabin',
      'Dita Parlo',
      'Pierre Fresnay',
      'Erich von Stroheim',
      'Julien Carette',
      'Georges Péclet',
    ],
  },
  // https://www.themoviedb.org/movie/232
  {
    title: 'Rumble Fish',
    releaseDate: '1983-10-09',
    runtimeMinutes: 94,
    synopsis:
      "Absent-minded street thug Rusty James struggles to live up to his legendary older brother's reputation, and longs for the days of gang warfare.",
    posterUrl: tmdbPoster('nwIUWs7cexC8Wk9c6ey8nFltAZd'),
    genres: ['Crime', 'Drama', 'Romance'],
    directors: ['Francis Ford Coppola'],
    writers: ['Francis Ford Coppola', 'S.E. Hinton'],
    cast: [
      'Matt Dillon',
      'Mickey Rourke',
      'Diane Lane',
      'Dennis Hopper',
      'Diana Scarwid',
      'Vincent Spano',
    ],
  },
  // https://www.themoviedb.org/movie/1712
  {
    title: 'Giant',
    releaseDate: '1956-11-08',
    runtimeMinutes: 201,
    synopsis:
      "Wealthy rancher Bick Benedict and dirt-poor cowboy Jett Rink both woo Leslie Lynnton, a beautiful young woman from Maryland who is new to Texas. She marries Benedict, but she is shocked by the racial bigotry of the White Texans against the local people of Mexican descent. Rink discovers oil on a small plot of land, and while he uses his vast, new wealth to buy all the land surrounding the Benedict ranch, the Benedict's disagreement over prejudice fuels conflict that runs across generations.",
    posterUrl: tmdbPoster('h5RRYPVVuHzd7QOJyP5Dsi8J9XZ'),
    genres: ['Drama', 'Western'],
    directors: ['George Stevens'],
    writers: ['Fred Guiol', 'Ivan Moffat'],
    cast: [
      'Elizabeth Taylor',
      'Rock Hudson',
      'James Dean',
      'Carroll Baker',
      'Jane Withers',
      'Chill Wills',
    ],
  },
  // https://www.themoviedb.org/movie/887
  {
    title: 'The Best Years of Our Lives',
    releaseDate: '1946-12-25',
    runtimeMinutes: 171,
    synopsis:
      "It's the hope that sustains the spirit of every GI: the dream of the day when he will finally return home. For three WWII veterans, the day has arrived. But for each man, the dream is about to become a nightmare.",
    posterUrl: tmdbPoster('gd5EoAU4MM57sW3vlWxJ0NMM8cV'),
    genres: ['Drama', 'Romance', 'War'],
    directors: ['William Wyler'],
    writers: ['Robert E. Sherwood'],
    cast: [
      'Dana Andrews',
      'Fredric March',
      'Harold Russell',
      'Teresa Wright',
      'Myrna Loy',
      "Cathy O'Donnell",
    ],
  },
  // https://www.themoviedb.org/movie/704
  {
    title: "A Hard Day's Night",
    releaseDate: '1964-07-07',
    runtimeMinutes: 88,
    synopsis:
      "Capturing John Lennon, Paul McCartney, George Harrison and Ringo Starr in their electrifying element, 'A Hard Day's Night' is a wildly irreverent journey through this pastiche of a day in the life of The Beatles during 1964. The band have to use all their guile and wit to avoid the pursuing fans and press to reach their scheduled television performance, in spite of Paul's troublemaking grandfather and Ringo's arrest.",
    posterUrl: tmdbPoster('6Ulsccp2VkaVU5qbya3bxm9JG4x'),
    genres: ['Comedy', 'Music'],
    directors: ['Richard Lester'],
    writers: ['Alun Owen'],
    cast: [
      'John Lennon',
      'Paul McCartney',
      'George Harrison',
      'Ringo Starr',
      'Wilfrid Brambell',
      'Norman Rossington',
    ],
  },
  // https://www.themoviedb.org/movie/833
  {
    title: 'Umberto D.',
    releaseDate: '1952-01-20',
    runtimeMinutes: 91,
    synopsis:
      "When elderly pensioner Umberto Domenico Ferrari returns to his boarding house from a protest calling for a hike in old-age pensions, his landlady demands her 15,000-lire rent by the end of the month or he and his small dog will be turned out onto the street. Unable to get the money in time, Umberto fakes illness to get sent to a hospital, giving his beloved dog to the landlady's pregnant and abandoned maid for temporary safekeeping.",
    posterUrl: tmdbPoster('5I7SYsNQmZRZpQ2MAarIQYU9vaX'),
    genres: ['Drama'],
    directors: ['Vittorio De Sica'],
    writers: ['Cesare Zavattini'],
    cast: [
      'Carlo Battisti',
      'Napoleone the Dog',
      'Maria Pia Casilio',
      'Lina Gennari',
      'Elena Rea',
      'Memmo Carotenuto',
    ],
  },
  // https://www.themoviedb.org/movie/993
  {
    title: 'Sleuth',
    releaseDate: '1972-12-10',
    runtimeMinutes: 138,
    synopsis:
      "A man who loves games and theatre invites his wife's lover to meet, setting up a battle of wits with potentially deadly results.",
    posterUrl: tmdbPoster('jAREYLUnYGwPjbQr0vs1s38QLkH'),
    genres: ['Thriller', 'Mystery', 'Crime'],
    directors: ['Joseph L. Mankiewicz'],
    writers: ['Anthony Shaffer'],
    cast: ['Laurence Olivier', 'Michael Caine'],
  },
  // https://www.themoviedb.org/movie/1552
  {
    title: 'Parenthood',
    releaseDate: '1989-07-31',
    runtimeMinutes: 124,
    synopsis:
      "The story of the Buckman family and friends, attempting to bring up their children. They suffer/enjoy all the events that occur: estranged relatives, the 'black sheep' of the family, the eccentrics, the skeletons in the closet, and the rebellious teenagers.",
    posterUrl: tmdbPoster('29Y6yg0gSurkFYTh54yxDzLBmrT'),
    genres: ['Comedy', 'Drama'],
    directors: ['Ron Howard'],
    writers: ['Babaloo Mandel', 'Lowell Ganz'],
    cast: [
      'Steve Martin',
      'Mary Steenburgen',
      'Dianne Wiest',
      'Jason Robards',
      'Rick Moranis',
      'Tom Hulce',
    ],
  },
  // https://www.themoviedb.org/movie/983
  {
    title: 'The Man Who Would Be King',
    releaseDate: '1975-12-03',
    runtimeMinutes: 129,
    synopsis:
      "Tired of life as soldiers, Peachy Carnehan and Danny Dravot travel to the isolated land of Kafiristan, where they are ultimately embraced by the people and revered as rulers. After a series of misunderstandings, the natives come to believe that Dravot is a god, but he and Carnehan can't keep up their deception forever.",
    posterUrl: tmdbPoster('xnEhm0CtgJoM9Z1dGGSQAwxU7oJ'),
    genres: ['Adventure', 'Drama'],
    directors: ['John Huston'],
    writers: ['John Huston', 'Gladys Hill'],
    cast: [
      'Sean Connery',
      'Michael Caine',
      'Christopher Plummer',
      'Saeed Jaffrey',
      'Doghmi Larbi',
      'Jack May',
    ],
  },
  // https://www.themoviedb.org/movie/1059
  {
    title: 'The Hidden Fortress',
    releaseDate: '1958-12-28',
    runtimeMinutes: 139,
    synopsis:
      'In feudal Japan, during a bloody war between clans, two cowardly and greedy peasants, soldiers of a defeated army, stumble upon a mysterious man who guides them to a fortress hidden in the mountains.',
    posterUrl: tmdbPoster('olO4vMPKNIJQxhJh54TPQFwKpad'),
    genres: ['Drama', 'Action', 'Adventure'],
    directors: ['Akira Kurosawa'],
    writers: ['Akira Kurosawa', 'Shinobu Hashimoto', 'Ryuzo Kikushima', 'Hideo Oguni'],
    cast: [
      'Toshirō Mifune',
      'Minoru Chiaki',
      'Kamatari Fujiwara',
      'Misa Uehara',
      'Susumu Fujita',
      'Takashi Shimura',
    ],
  },
  // https://www.themoviedb.org/movie/851
  {
    title: 'Brief Encounter',
    releaseDate: '1945-11-24',
    runtimeMinutes: 86,
    synopsis:
      'Returning home from a shopping trip to a nearby town, bored suburban housewife Laura Jesson is thrown by happenstance into an acquaintance with virtuous doctor Alec Harvey. Their casual friendship soon develops during their weekly visits into something more emotionally fulfilling than either expected, and they must wrestle with the potential havoc their deepening relationship would have on their lives and the lives of those they love.',
    posterUrl: tmdbPoster('jC9EwLJcGhYMSQAHu2LxkKN5v7O'),
    genres: ['Drama', 'Romance'],
    directors: ['David Lean'],
    writers: ['Noël Coward'],
    cast: [
      'Celia Johnson',
      'Trevor Howard',
      'Stanley Holloway',
      'Joyce Carey',
      'Cyril Raymond',
      'Everley Gregg',
    ],
  },
  // https://www.themoviedb.org/movie/1093
  {
    title: 'Elevator to the Gallows',
    releaseDate: '1958-01-29',
    runtimeMinutes: 92,
    synopsis:
      'A self-assured businessman murders his employer, husband of his mistress, which unintentionally provokes an ill-fated chain of events.',
    posterUrl: tmdbPoster('jgeZS97po2luaeElfUh07VAbVfV'),
    genres: ['Crime', 'Drama', 'Thriller'],
    directors: ['Louis Malle'],
    writers: ['Louis Malle', 'Roger Nimier'],
    cast: [
      'Jeanne Moreau',
      'Maurice Ronet',
      'Georges Poujouly',
      'Yori Bertin',
      'Jean Wall',
      'Elga Andersen',
    ],
  },
  // https://www.themoviedb.org/movie/1599
  {
    title: 'I ♥ Huckabees',
    releaseDate: '2004-09-10',
    runtimeMinutes: 106,
    synopsis:
      'A husband-and-wife team play detective, but not in the traditional sense. Instead, the happy duo helps others solve their existential issues, the kind that keep you up at night, wondering what it all means.',
    posterUrl: tmdbPoster('h27ytqXyOrAB6KmRx2abOp8p2W'),
    genres: ['Comedy', 'Romance'],
    directors: ['David O. Russell'],
    writers: ['David O. Russell', 'Jeff Baena'],
    cast: [
      'Jason Schwartzman',
      'Isabelle Huppert',
      'Dustin Hoffman',
      'Lily Tomlin',
      'Jude Law',
      'Mark Wahlberg',
    ],
  },
  // https://www.themoviedb.org/movie/1626
  {
    title: 'Vivre Sa Vie',
    releaseDate: '1962-09-20',
    runtimeMinutes: 84,
    synopsis:
      'Twelve episodic tales in the life of a Parisian woman and her slow descent into prostitution.',
    posterUrl: tmdbPoster('A0BjScjASfMFgyGI5sU0CwfKh3l'),
    genres: ['Drama'],
    directors: ['Jean-Luc Godard'],
    writers: ['Jean-Luc Godard'],
    cast: [
      'Anna Karina',
      'Sady Rebbot',
      'André S. Labarthe',
      'Guylaine Schlumberger',
      'Gérard Hoffmann',
      'Monique Messine',
    ],
  },
  // https://www.themoviedb.org/movie/877
  {
    title: 'Scarface',
    releaseDate: '1932-04-09',
    runtimeMinutes: 93,
    synopsis:
      "In 1920s Chicago, Italian immigrant and notorious thug, Antonio 'Tony' Camonte, aka Scarface, shoots his way to the top of the mobs while trying to protect his sister from the criminal life.",
    posterUrl: tmdbPoster('y4E5oRiHMTFkEB12IIcpbKbKzDW'),
    genres: ['Crime', 'Action', 'Drama', 'Thriller'],
    directors: ['Howard Hawks'],
    writers: ['Ben Hecht'],
    cast: [
      'Paul Muni',
      'Ann Dvorak',
      'Karen Morley',
      'Osgood Perkins',
      'C. Henry Gordon',
      'George Raft',
    ],
  },
  // https://www.themoviedb.org/movie/695
  {
    title: 'Short Cuts',
    releaseDate: '1993-10-01',
    runtimeMinutes: 188,
    synopsis:
      "Many loosely connected characters cross paths in this film, based on the stories of Raymond Carver. Waitress Doreen Piggot accidentally runs into a boy with her car. Soon after walking away, the child lapses into a coma. While at the hospital, the boy's grandfather tells his son, Howard, about his past affairs. Meanwhile, a baker starts harassing the family when they fail to pick up the boy's birthday cake.",
    posterUrl: tmdbPoster('mbNTvbtWfV4soyErimDTdX67OAr'),
    genres: ['Drama', 'Comedy'],
    directors: ['Robert Altman'],
    writers: ['Robert Altman', 'Frank Barhydt'],
    cast: [
      'Andie MacDowell',
      'Bruce Davison',
      'Jack Lemmon',
      'Tim Robbins',
      'Julianne Moore',
      'Tom Waits',
    ],
  },
  // https://www.themoviedb.org/movie/1613
  {
    title: 'The 51st State',
    releaseDate: '2001-12-07',
    runtimeMinutes: 93,
    synopsis:
      'An American master chemist plans to score big on a once in a lifetime drug deal. All does not go as planned and he is soon entangled in a web of deceit.',
    posterUrl: tmdbPoster('aYlrGirWrRCTU1PF6Svghn1EMAc'),
    genres: ['Thriller', 'Action', 'Comedy', 'Crime'],
    directors: ['Ronny Yu'],
    writers: ['Stel Pavlou'],
    cast: [
      'Samuel L. Jackson',
      'Robert Carlyle',
      'Emily Mortimer',
      'Meat Loaf',
      'Rhys Ifans',
      'Sean Pertwee',
    ],
  },
  // https://www.themoviedb.org/movie/648
  {
    title: 'Beauty and the Beast',
    releaseDate: '1946-10-29',
    runtimeMinutes: 96,
    synopsis:
      "The story of a gentle-hearted beast in love with a simple and beautiful girl. She is drawn to the repellent but strangely fascinating Beast, who tests her fidelity by giving her a key, telling her that if she doesn't return it to him by a specific time, he will die of grief. She is unable to return the key on time, but it is revealed that the Beast is the genuinely handsome one. A simple tale of tragic love that turns into a surreal vision of death, desire, and beauty.",
    posterUrl: tmdbPoster('iYSe3yrkma0e1B0wWPXgr8w5sDN'),
    genres: ['Drama', 'Fantasy', 'Romance'],
    directors: ['Jean Cocteau'],
    writers: ['Jean Cocteau'],
    cast: [
      'Jean Marais',
      'Josette Day',
      'Marcel André',
      'Mila Parély',
      'Nane Germon',
      'Michel Auclair',
    ],
  },
  // https://www.themoviedb.org/movie/1257
  {
    title: 'Because I Said So',
    releaseDate: '2007-02-02',
    runtimeMinutes: 102,
    synopsis:
      "In an effort to prevent family history from repeating itself, meddlesome mom Daphne Wilder attempts to set up her youngest daughter, Milly, with Mr. Right. Meanwhile, her other daughters try to keep their mom's good intentions under control.",
    posterUrl: tmdbPoster('wQtGQnr5RPnmzSfV9zUcgh8R9NX'),
    genres: ['Romance', 'Comedy'],
    directors: ['Michael Lehmann'],
    writers: ['Karen Leigh Hopkins', 'Jessie Nelson'],
    cast: [
      'Diane Keaton',
      'Mandy Moore',
      'Gabriel Macht',
      'Tom Everett Scott',
      'Lauren Graham',
      'Piper Perabo',
    ],
  },
  // https://www.themoviedb.org/movie/632
  {
    title: 'Stalag 17',
    releaseDate: '1953-05-29',
    runtimeMinutes: 120,
    synopsis:
      'After two American prisoners are killed by guards in the act of escaping from a German POW camp in World War II, barracks black marketeer J.J. Sefton is suspected of being an informer.',
    posterUrl: tmdbPoster('lfve9FDKjT7JPbWI9NCs5340F79'),
    genres: ['Comedy', 'Drama', 'War'],
    directors: ['Billy Wilder'],
    writers: ['Billy Wilder', 'Edwin Blum'],
    cast: [
      'William Holden',
      'Don Taylor',
      'Otto Preminger',
      'Robert Strauss',
      'Harvey Lembeck',
      'Richard Erdman',
    ],
  },
  // https://www.themoviedb.org/movie/776
  {
    title: 'The Rules of the Game',
    releaseDate: '1939-07-09',
    runtimeMinutes: 110,
    synopsis:
      'The Marquis de la Chesnaye and his wife host a weekend gala where a variety of complicated romantic and social entanglements between guests and servants lead to tragedy, all against the backdrop of a looming war.',
    posterUrl: tmdbPoster('8JOzt7uFZyshcuzCBmYU6CDJL4D'),
    genres: ['Drama', 'Comedy', 'Romance'],
    directors: ['Jean Renoir'],
    writers: ['Jean Renoir'],
    cast: [
      'Jean Renoir',
      'Marcel Dalio',
      'Nora Gregor',
      'Julien Carette',
      'Roland Toutain',
      'Paulette Dubost',
    ],
  },
  // https://www.themoviedb.org/movie/1594
  {
    title: 'A Shot in the Dark',
    releaseDate: '1964-06-23',
    runtimeMinutes: 102,
    synopsis:
      'Inspector Jacques Clouseau, smitten with the accused maid Maria Gambrelli, unwittingly turns a straightforward murder investigation into a comedic series of mishaps, testing the patience of his irritable boss Charles Dreyfus as casualties mount.',
    posterUrl: tmdbPoster('pR6tNqNLYIbRRYC5TFKWVWaVvvK'),
    genres: ['Comedy', 'Mystery', 'Crime'],
    directors: ['Blake Edwards'],
    writers: ['Blake Edwards', 'William Peter Blatty'],
    cast: [
      'Peter Sellers',
      'Elke Sommer',
      'George Sanders',
      'Herbert Lom',
      'Graham Stark',
      'Moira Redmond',
    ],
  },
  // https://www.themoviedb.org/movie/171
  {
    title: 'The Party 2',
    releaseDate: '1982-12-08',
    runtimeMinutes: 109,
    synopsis:
      'A young French teenage girl after moving to a new city falls in love with a boy and is thinking of having sex with him because her girlfriends have already done it.',
    posterUrl: tmdbPoster('pbkccDoxH1H1VdqWcQYycZxHTIK'),
    genres: ['Comedy', 'Romance', 'Drama'],
    directors: ['Claude Pinoteau'],
    writers: ['Claude Pinoteau', 'Danièle Thompson'],
    cast: [
      'Claude Brasseur',
      'Brigitte Fossey',
      'Sophie Marceau',
      'known',
      'Denise Grey',
      'Pierre Cosso',
    ],
  },
  // https://www.themoviedb.org/movie/1675
  {
    title: 'Day for Night',
    releaseDate: '1973-05-24',
    runtimeMinutes: 116,
    synopsis:
      'A committed filmmaker struggles to complete his latest project while coping with a myriad of crises, personal and professional, among the cast and crew.',
    posterUrl: tmdbPoster('e5xDrSx6zDEUlMe2dWKGhv88PDZ'),
    genres: ['Comedy', 'Drama'],
    directors: ['François Truffaut'],
    writers: ['François Truffaut', 'Suzanne Schiffman', 'Jean-Louis Richard'],
    cast: [
      'Jacqueline Bisset',
      'Valentina Cortese',
      'Dani',
      'Alexandra Stewart',
      'Jean-Pierre Aumont',
      'Jean Champion',
    ],
  },
  // https://www.themoviedb.org/movie/1410
  {
    title: 'Dark Star',
    releaseDate: '1974-03-30',
    runtimeMinutes: 83,
    synopsis:
      'A group of scientists are sent on a mission to destroy unstable planets. Twenty years into their mission, they have to battle their alien mascot as well as a "sensitive" and intelligent bombing device that starts to question the meaning of its existence.',
    posterUrl: tmdbPoster('aiqLBiH0IWrog2Q78dZTT8Ad9Sp'),
    genres: ['Comedy', 'Science Fiction'],
    directors: ['John Carpenter'],
    writers: ['John Carpenter', "Dan O'Bannon"],
    cast: [
      'Brian Narelle',
      'Cal Kuniholm',
      "Dan O'Bannon",
      'Dre Pahich',
      'Adam Beckenbaugh',
      'Nick Castle',
    ],
  },
  // https://www.themoviedb.org/movie/452
  {
    title: 'The Idiots',
    releaseDate: '1998-05-20',
    runtimeMinutes: 110,
    synopsis:
      "A group of people gather at a Copenhagen suburban home to break all the limitations and to bring out the 'inner idiot' in themselves.",
    posterUrl: tmdbPoster('dZUgHe2XH8egBFerMC6yLoqUqii'),
    genres: ['Comedy', 'Drama'],
    directors: ['Lars von Trier'],
    writers: ['Lars von Trier'],
    cast: [
      'Bodil Jørgensen',
      'Jens Albinus',
      'Anne Louise Hassing',
      'Troels Lyby',
      'Nikolaj Lie Kaas',
      'Louise Mieritz',
    ],
  },
  // https://www.themoviedb.org/movie/678
  {
    title: 'Out of the Past',
    releaseDate: '1947-11-25',
    runtimeMinutes: 97,
    synopsis:
      'The peaceful life of a gas station owner is disrupted when a man from his past arrives in town and forces him to return to the dark world he had tried to escape.',
    posterUrl: tmdbPoster('lnUK6Cg5ARM0qaq0B5SG20VAM0h'),
    genres: ['Crime', 'Thriller'],
    directors: ['Jacques Tourneur'],
    writers: ['Daniel Mainwaring'],
    cast: [
      'Robert Mitchum',
      'Jane Greer',
      'Kirk Douglas',
      'Paul Valentine',
      'Virginia Huston',
      'Rhonda Fleming',
    ],
  },
  // https://www.themoviedb.org/movie/934
  {
    title: 'Rififi',
    releaseDate: '1955-04-13',
    runtimeMinutes: 118,
    synopsis:
      "Out of prison after a five-year stretch, jewel thief Tony turns down a quick job his friend Jo offers him, until he discovers that his old girlfriend Mado has become the lover of local gangster Pierre Grutter during Tony's absence. Expanding a minor smash-and-grab into a full-scale jewel heist, Tony and his crew appear to get away clean, but their actions after the job is completed threaten the lives of everyone involved.",
    posterUrl: tmdbPoster('heVdAFNZUxXVmO6jiJcEHCvI5lK'),
    genres: ['Crime', 'Thriller', 'Drama'],
    directors: ['Jules Dassin'],
    writers: ['Auguste Le Breton', 'René Wheeler'],
    cast: [
      'Jean Servais',
      'Carl Möhner',
      'Robert Manuel',
      'Janine Darcey',
      'Pierre Grasset',
      'Robert Hossein',
    ],
  },
  // https://www.themoviedb.org/movie/540
  {
    title: 'D.E.B.S.',
    releaseDate: '2005-03-25',
    runtimeMinutes: 91,
    synopsis:
      'The star of a team of teenage crime fighters falls for the alluring villainess she must bring to justice.',
    posterUrl: tmdbPoster('cMwLTcG5aVBYeh5W6SVSfowboAf'),
    genres: ['Action', 'Comedy', 'Romance'],
    directors: ['Angela Robinson'],
    writers: ['Angela Robinson'],
    cast: [
      'Sara Foster',
      'Jordana Brewster',
      'Meagan Good',
      'Devon Aoki',
      'Jill Ritchie',
      'Geoff Stults',
    ],
  },
  // https://www.themoviedb.org/movie/811
  {
    title: 'Silent Running',
    releaseDate: '1972-03-09',
    runtimeMinutes: 89,
    synopsis:
      'After the entire flora goes extinct, ecologist Lowell maintains a greenhouse aboard a space station for the future with his android companions. However, he rebels after being ordered to destroy the greenhouse in favor of carrying cargo, a decision that puts him at odds with everyone but his mechanical companions.',
    posterUrl: tmdbPoster('ahasZ5HILZHtlrl6cbXgpfk0y8H'),
    genres: ['Adventure', 'Science Fiction', 'Drama'],
    directors: ['Douglas Trumbull'],
    writers: ['Michael Cimino', 'Deric Washburn', 'Steven Bochco'],
    cast: ['Bruce Dern', 'Cliff Potts', 'Ron Rifkin', 'Jesse Vint', 'Mark Persons', 'Steven Brown'],
  },
  // https://www.themoviedb.org/movie/1364
  {
    title: 'Sex and Lucía',
    releaseDate: '2001-08-24',
    runtimeMinutes: 128,
    synopsis:
      'Lucía is a young waitress in Madrid who seeks refuge on a quiet, secluded Mediterranean island after the loss of her longtime boyfriend. Amidst the fresh air, dazzling sun, and glistening deep blue water, Lucía begins to piece together the dark corners of her past relationship.',
    posterUrl: tmdbPoster('gvErAg9bv7xOO3B40gottv6Bqip'),
    genres: ['Drama', 'Romance'],
    directors: ['Julio Medem'],
    writers: ['Julio Medem'],
    cast: [
      'Paz Vega',
      'Tristán Ulloa',
      'Elena Anaya',
      'Najwa Nimri',
      'Daniel Freire',
      'Silvia Llanos',
    ],
  },
  // https://www.themoviedb.org/movie/363
  {
    title: 'Head-On',
    releaseDate: '2004-03-11',
    runtimeMinutes: 122,
    synopsis:
      'With the intention to break free from the strict familial restrictions, a suicidal young woman sets up a marriage of convenience with a forty-year-old addict, an act that will lead to an outburst of envious love.',
    posterUrl: tmdbPoster('9L5BBJiXZss58EBcbw0l4holdzZ'),
    genres: ['Drama', 'Romance'],
    directors: ['Fatih Akin'],
    writers: ['Fatih Akin'],
    cast: [
      'Sibel Kekilli',
      'Birol Ünel',
      'Güven Kıraç',
      'Meltem Cumbul',
      'Adam Bousdoukos',
      'Mehmet Kurtuluş',
    ],
  },
  // https://www.themoviedb.org/movie/1408
  {
    title: 'Cutthroat Island',
    releaseDate: '1995-12-22',
    runtimeMinutes: 124,
    synopsis:
      'Morgan Adams and her slave, William Shaw, are on a quest to recover the three portions of a treasure map. Unfortunately, the final portion is held by her murderous uncle, Dawg. Her crew is skeptical of her leadership abilities, so she must complete her quest before they mutiny against her. This is made yet more difficult by the efforts of the British crown to end her pirate raids.',
    posterUrl: tmdbPoster('hYdeBZ4BFXivdouxLfQGWNE6zRx'),
    genres: ['Action', 'Adventure'],
    directors: ['Renny Harlin'],
    writers: ['Robert King', 'Marc Norman'],
    cast: [
      'Geena Davis',
      'Matthew Modine',
      'Frank Langella',
      'Maury Chaykin',
      'Patrick Malahide',
      'Stan Shaw',
    ],
  },
  // https://www.themoviedb.org/movie/178
  {
    title: 'Blown Away',
    releaseDate: '1994-07-01',
    runtimeMinutes: 121,
    synopsis:
      'Blown Away tells the story of Jimmy Dove, who works for the Boston bomb squad. Shortly after Dove leaves the force, his partner is killed by a bomb that Dove thinks might have been made by someone he knows.',
    posterUrl: tmdbPoster('fD23iryzdjfRU05nQAQriD0A3AR'),
    genres: ['Action'],
    directors: ['Stephen Hopkins'],
    writers: ['John Rice', 'Joe Batteer'],
    cast: [
      'Jeff Bridges',
      'Tommy Lee Jones',
      'Suzy Amis',
      'Lloyd Bridges',
      'Forest Whitaker',
      'Stephi Lineburg',
    ],
  },
  // https://www.themoviedb.org/movie/849
  {
    title: 'Krull',
    releaseDate: '1983-07-29',
    runtimeMinutes: 121,
    synopsis:
      'A prince and a fellowship of companions set out to rescue his bride from a fortress of alien invaders who have arrived on their home planet.',
    posterUrl: tmdbPoster('izDbySIrTmID0Nh6UqcWrUvOMjU'),
    genres: ['Action', 'Adventure', 'Fantasy', 'Science Fiction'],
    directors: ['Peter Yates'],
    writers: ['Stanford Sherman'],
    cast: [
      'Ken Marshall',
      'Lysette Anthony',
      'Freddie Jones',
      'Francesca Annis',
      'Alun Armstrong',
      'David Battley',
    ],
  },
  // https://www.themoviedb.org/movie/427
  {
    title: 'Mon Oncle',
    releaseDate: '1958-05-10',
    runtimeMinutes: 118,
    synopsis:
      "Genial, bumbling Monsieur Hulot loves his top-floor apartment in a grimy corner of the city, and cannot fathom why his sister's family has moved to the suburbs. Their house is an ultra-modern nightmare, which Hulot only visits for the sake of stealing away his rambunctious young nephew. Hulot's sister, however, wants to win him over to her new way of life, and conspires to set him up with a wife and job.",
    posterUrl: tmdbPoster('wH6RyPiXFy8INLbViVkchLVOmBc'),
    genres: ['Comedy'],
    directors: ['Jacques Tati'],
    writers: ['Jacques Tati', 'Jacques Lagrange', "Jean L'Hôte"],
    cast: [
      'Jacques Tati',
      'Jean-Pierre Zola',
      'Adrienne Servantie',
      'Lucien Frégis',
      'Betty Schneider',
      'Jean-François Martial',
    ],
  },
  // https://www.themoviedb.org/movie/476
  {
    title: 'Drugstore Cowboy',
    releaseDate: '1989-10-20',
    runtimeMinutes: 102,
    synopsis:
      'Portland, Oregon, 1971. Bob Hughes is the charismatic leader of a peculiar quartet, formed by his wife, Dianne, and another couple, Rick and Nadine, who skillfully steal from drugstores and hospital medicine cabinets in order to appease their insatiable need for drugs. But neither fun nor luck last forever.',
    posterUrl: tmdbPoster('nxITSEh80jvMEGGsU8RgCzLL340'),
    genres: ['Drama', 'Crime'],
    directors: ['Gus Van Sant'],
    writers: ['Gus Van Sant', 'Daniel Yost'],
    cast: [
      'Matt Dillon',
      'Kelly Lynch',
      'James Remar',
      'James Le Gros',
      'Heather Graham',
      'Beah Richards',
    ],
  },
  // https://www.themoviedb.org/movie/469
  {
    title: 'Stranger Than Paradise',
    releaseDate: '1984-10-01',
    runtimeMinutes: 90,
    synopsis:
      'New York layabout Willie forms an unexpected bond with his young Hungarian cousin Eva when she pays him a surprise visit. Later, Eva moves in with their aunt in Cleveland, and Willie takes his best friend Eddie to see her—a visit that culminates in a strange, eventful trip to Florida.',
    posterUrl: tmdbPoster('Q9wdlNjBOti4JhAjAQXphzShw3'),
    genres: ['Comedy', 'Drama'],
    directors: ['Jim Jarmusch'],
    writers: ['Jim Jarmusch'],
    cast: [
      'John Lurie',
      'Eszter Balint',
      'Richard Edson',
      'Cecillia Stark',
      'Danny Rosen',
      'Rammellzee',
    ],
  },
  // https://www.themoviedb.org/movie/991
  {
    title: 'The Man Who Fell to Earth',
    releaseDate: '1976-03-18',
    runtimeMinutes: 139,
    synopsis:
      'Thomas Jerome Newton is an alien who has come to Earth in search of water to save his home planet. Aided by lawyer Oliver Farnsworth, Thomas uses his knowledge of advanced technology to create profitable inventions. While developing a method to transport water, Thomas meets Mary-Lou, a quiet hotel clerk, and begins to fall in love with her. Just as he is ready to leave Earth, Thomas is intercepted by the U.S. government, and his entire plan is threatened.',
    posterUrl: tmdbPoster('gwmPVphE5DMFFGXGMhfEFyxOOYj'),
    genres: ['Science Fiction', 'Drama', 'Fantasy'],
    directors: ['Nicolas Roeg'],
    writers: ['Paul Mayersberg'],
    cast: ['David Bowie', 'Rip Torn', 'Candy Clark', 'Tony Mascia', 'Buck Henry', 'Bernie Casey'],
  },
  // https://www.themoviedb.org/movie/1394
  {
    title: 'Nostalgia',
    releaseDate: '1983-05-01',
    runtimeMinutes: 124,
    synopsis:
      'Russian poet Andrei Gorchakov journeys through Italy with his interpreter Eugenia to research the life of an 18th-century Russian composer who once lived abroad. Isolated and consumed by an unrelenting longing for his homeland, Andrei becomes drawn to Domenico, a radical mystic obsessed with spiritual redemption. Through austere imagery and extended temporal rhythms, Tarkovsky examines exile, memory, and the profound melancholy of being unable to belong fully to either place or language.',
    posterUrl: tmdbPoster('fCYSidPXp3LpDa9wlLNv0gZvjyF'),
    genres: ['Drama', 'Romance'],
    directors: ['Andrei Tarkovsky'],
    writers: ['Andrei Tarkovsky', 'Tonino Guerra'],
    cast: [
      'Oleg Yankovskiy',
      'Erland Josephson',
      'Domiziana Giordano',
      'Patrizia Terreno',
      'Laura De Marchi',
      'Delia Boccardo',
    ],
  },
  // https://www.themoviedb.org/movie/1254
  {
    title: "Don't Worry, I'm Fine",
    releaseDate: '2006-09-06',
    runtimeMinutes: 96,
    synopsis:
      'A 19-year-old searches for her twin brother after he runs away from home, following a fight with their father.',
    posterUrl: tmdbPoster('yD6skMZZq0Rgn2NhI9dk4B2Dipu'),
    genres: ['Drama'],
    directors: ['Philippe Lioret'],
    writers: ['Philippe Lioret', 'Olivier Adam'],
    cast: [
      'Mélanie Laurent',
      'Kad Merad',
      'Isabelle Renauld',
      'Julien Boisselier',
      'Aïssa Maïga',
      'Simon Buret',
    ],
  },
  // https://www.themoviedb.org/movie/1641
  {
    title: 'Forces of Nature',
    releaseDate: '1999-03-12',
    runtimeMinutes: 105,
    synopsis:
      'Ben Holmes, a professional book-jacket blurbologist, is trying to get to Savannah for his wedding. He just barely catches the last plane, but a seagull flies into the engine as the plane is taking off. All later flights are cancelled because of an approaching hurricane, so he is forced to hitch a ride in a Geo Metro with an attractive but eccentric woman named Sara.',
    posterUrl: tmdbPoster('etmjiee84g6G9WALmLkJ1DhenAu'),
    genres: ['Romance', 'Comedy'],
    directors: ['Bronwen Hughes'],
    writers: ['Marc Lawrence'],
    cast: [
      'Sandra Bullock',
      'Ben Affleck',
      'Maura Tierney',
      'Steve Zahn',
      'Blythe Danner',
      'Ronny Cox',
    ],
  },
  // https://www.themoviedb.org/movie/618
  {
    title: 'The Birth of a Nation',
    releaseDate: '1915-03-08',
    runtimeMinutes: 193,
    synopsis:
      "Two families, abolitionist Northerners the Stonemans and Southern landowners the Camerons, intertwine. When Confederate colonel Ben Cameron is captured in battle, nurse Elsie Stoneman petitions for his pardon. In Reconstruction-era South Carolina, Cameron founds the Ku Klux Klan, battling Elsie's congressman father and his African-American protégé, Silas Lynch.",
    posterUrl: tmdbPoster('pNpOXpQI5GSUfiWypubYtMh9928'),
    genres: ['Drama', 'History', 'War'],
    directors: ['D.W. Griffith'],
    writers: ['D.W. Griffith', 'Frank E. Woods'],
    cast: [
      'Lillian Gish',
      'Mae Marsh',
      'Henry B. Walthall',
      'Miriam Cooper',
      'Mary Alden',
      'Ralph Lewis',
    ],
  },
  // https://www.themoviedb.org/movie/158
  {
    title: "Knockin' on Heaven's Door",
    releaseDate: '1997-02-20',
    runtimeMinutes: 89,
    synopsis:
      "Two young men, Martin and Rudi, both suffering from terminal cancer, get to know each other in a hospital room. They drown their desperation in tequila and decide to take one last trip to the sea. Drunk and still in pajamas they steal the first fancy car they find, a 60's Mercedes convertible. The car happens to belong to a bunch of gangsters, which immediately start to chase it, since it contains more than the pistol Martin finds in the glove box.",
    posterUrl: tmdbPoster('oiaGyQtjI5rnFDI7BVngXyfmVhc'),
    genres: ['Comedy', 'Crime', 'Action', 'Drama'],
    directors: ['Thomas Jahn'],
    writers: ['Thomas Jahn', 'Til Schweiger'],
    cast: [
      'Til Schweiger',
      'Jan Josef Liefers',
      'Thierry van Werveke',
      'Moritz Bleibtreu',
      'Huub Stapel',
      'Leonard Lansink',
    ],
  },
  // https://www.themoviedb.org/movie/779
  {
    title: 'Vampyr',
    releaseDate: '1932-05-06',
    runtimeMinutes: 74,
    synopsis:
      'Allan Gray, a young man fascinated by the supernatural, goes to a small village where he feels a sinister force descending upon him. There, Allan meets an old man who asks him to protect his two daughters, for one of them has been bitten by a vampire.',
    posterUrl: tmdbPoster('yt3JS5JSoZseSohYkhs6FLU9B0O'),
    genres: ['Horror', 'Fantasy', 'Mystery'],
    directors: ['Carl Theodor Dreyer'],
    writers: ['Carl Theodor Dreyer', 'Christen Jul'],
    cast: [
      'Nicolas de Gunzburg',
      'Maurice Schutz',
      'Rena Mandel',
      'Sybille Schmitz',
      'Jan Hieronimko',
      'Henriette Gérard',
    ],
  },
  // https://www.themoviedb.org/movie/1672
  {
    title: 'The Professional',
    releaseDate: '1981-10-21',
    runtimeMinutes: 108,
    synopsis:
      'Josselin Beaumont, a French secret agent, is tasked with assassinating Njala, the president for life of Malawi in Africa. A shift in French policy means that assassinating Njala is no longer an option. But instead of recalling their agent, high-ranking officials deliberately sacrifice Beaumont by handing him over to the Malawian authorities. Arrested, tried, and imprisoned, he nevertheless manages to escape. Back in Paris after a two-year absence, he informs his superiors through Colonel Martin that he will fulfill his contract during Njala’s upcoming official visit to Paris between the 12th and 15th of this month, and that he has a few scores to settle with the D.G.S.E. The question is, should Beaumont be stopped or not?',
    posterUrl: tmdbPoster('dhAZ8T0tTlTNw3D7Cn8wc87sk1w'),
    genres: ['Action', 'Adventure', 'Thriller'],
    directors: ['Georges Lautner'],
    writers: ['Georges Lautner', 'Michel Audiard', 'Jacques Audiard'],
    cast: [
      'Jean-Paul Belmondo',
      'Robert Hossein',
      'Elisabeth Margoni',
      'Jean-Louis Richard',
      'Jean Desailly',
      'Michel Beaune',
    ],
  },
  // https://www.themoviedb.org/movie/1378
  {
    title: 'Shortbus',
    releaseDate: '2006-10-04',
    runtimeMinutes: 101,
    synopsis:
      'In post-9/11 New York City, an eclectic group of citizens find their lives entangled, personally, romantically, and sexually, at Shortbus, an underground Brooklyn salon infamous for its blend of art, music, politics, and carnality.',
    posterUrl: tmdbPoster('s8QBrWgpZpYrySSyTQ0xbFLPKrS'),
    genres: ['Romance', 'Drama', 'Comedy'],
    directors: ['John Cameron Mitchell'],
    writers: ['John Cameron Mitchell'],
    cast: [
      'Sook-Yin Lee',
      'Paul Dawson',
      'PJ DeBoy',
      'Lindsay Beamish',
      'Jay Brannan',
      'Raphael Barker',
    ],
  },
  // https://www.themoviedb.org/movie/976
  {
    title: 'Sweet Smell of Success',
    releaseDate: '1957-07-04',
    runtimeMinutes: 97,
    synopsis:
      "New York City newspaper writer J.J. Hunsecker holds considerable sway over public opinion with his Broadway column, but one thing that he can't control is his younger sister, Susan, who is in a relationship with aspiring jazz guitarist Steve Dallas. Hunsecker strongly disapproves of the romance and recruits publicist Sidney Falco to find a way to split the couple, no matter how ruthless the method.",
    posterUrl: tmdbPoster('akzvV8JasNrgEl5iAP9K6zPHGJe'),
    genres: ['Drama'],
    directors: ['Alexander Mackendrick'],
    writers: ['Ernest Lehman', 'Clifford Odets'],
    cast: [
      'Burt Lancaster',
      'Tony Curtis',
      'Susan Harrison',
      'Martin Milner',
      'Jeff Donnell',
      'Sam Levene',
    ],
  },
  // https://www.themoviedb.org/movie/27
  {
    title: '9 Songs',
    releaseDate: '2004-07-16',
    runtimeMinutes: 70,
    synopsis:
      "Matt, a young glaciologist, soars across the vast, silent, icebound immensities of the South Pole as he recalls his love affair with Lisa. They meet at a mobbed rock concert in a vast music hall - London's Brixton Academy. They are in bed at night's end. Together, over a period of several months, they pursue a mutual sexual passion whose inevitable stages unfold in counterpoint to nine live-concert songs.",
    posterUrl: tmdbPoster('91O7z0vo7MiNWd5xD2BoivwbQsb'),
    genres: ['Drama', 'Music', 'Romance'],
    directors: ['Michael Winterbottom'],
    writers: ['Michael Winterbottom'],
    cast: [
      "Kieran O'Brien",
      'Margo Stilley',
      'Courtney Taylor-Taylor',
      'Alex Kapranos',
      'Guy Garvey',
      'Robert Levon Been',
    ],
  },
  // https://www.themoviedb.org/movie/1567
  {
    title: 'I Stand Alone',
    releaseDate: '1999-02-17',
    runtimeMinutes: 89,
    synopsis:
      'After completing jail time for beating up a man who tried to seduce his mentally-handicapped teenage daughter, the Butcher wants to start life anew. He institutionalizes his daughter and moves to the Lille suburbs with his mistress, who promises him a new butcher shop. Learning that she lied, the Butcher returns to Paris to find his daughter.',
    posterUrl: tmdbPoster('4kMB2AAcDQ5diRuh7NTxuS90bx7'),
    genres: ['Drama', 'Thriller'],
    directors: ['Gaspar Noé'],
    writers: ['Gaspar Noé'],
    cast: [
      'Philippe Nahon',
      'Blandine Lenoir',
      'Frankie Pain',
      'Martine Audrain',
      'Zaven',
      'Jean-François Rauger',
    ],
  },
  // https://www.themoviedb.org/movie/912
  {
    title: 'The Thomas Crown Affair',
    releaseDate: '1968-06-26',
    runtimeMinutes: 102,
    synopsis:
      'A debonair, adventuresome bank executive believes that he has pulled off the perfect multi-million dollar heist--until he must match wits with an insurance investigator who will do anything to get her man.',
    posterUrl: tmdbPoster('oODAwa2AK3fXvK93GCbq7dFLZPi'),
    genres: ['Crime', 'Romance'],
    directors: ['Norman Jewison'],
    writers: ['Alan Trustman'],
    cast: [
      'Steve McQueen',
      'Faye Dunaway',
      'Paul Burke',
      'Jack Weston',
      'Biff McGuire',
      'Addison Powell',
    ],
  },
  // https://www.themoviedb.org/movie/1441
  {
    title: 'The Contract',
    releaseDate: '2006-04-05',
    runtimeMinutes: 96,
    synopsis:
      'Attempting to recover from a recent family trauma by escaping into the woods for a peaceful hiking trip, an ex-lawman and his young son stumble across a dangerous contract killer.',
    posterUrl: tmdbPoster('sU2yzV3T1LetBdQPAeBRDb4YwLo'),
    genres: ['Drama', 'Action', 'Thriller', 'Crime'],
    directors: ['Bruce Beresford'],
    writers: ['Stephen Katz', 'John Darrouzet'],
    cast: [
      'Morgan Freeman',
      'John Cusack',
      'Alice Krige',
      'Megan Dodds',
      'Corey Johnson',
      'Jonathan Hyde',
    ],
  },
  // https://www.themoviedb.org/movie/1485
  {
    title: 'Get Carter',
    releaseDate: '1971-02-03',
    runtimeMinutes: 112,
    synopsis:
      "Jack Carter is a small-time hood working in London. When word reaches him of his brother's death, he travels to Newcastle to attend the funeral. Refusing to accept the police report of suicide, Carter seeks out his brother’s friends and acquaintances to learn who murdered his sibling and why.",
    posterUrl: tmdbPoster('3AytAYzJuPmS4Wo8X3jcsaN4oM3'),
    genres: ['Crime', 'Thriller'],
    directors: ['Mike Hodges'],
    writers: ['Mike Hodges', 'Ted Lewis'],
    cast: [
      'Michael Caine',
      'Ian Hendry',
      'Britt Ekland',
      'John Osborne',
      'Tony Beckley',
      'George Sewell',
    ],
  },
  // https://www.themoviedb.org/movie/690
  {
    title: 'Pickpocket',
    releaseDate: '1959-12-16',
    runtimeMinutes: 75,
    synopsis:
      "Michel takes up pickpocketing on a lark and is arrested soon after. His mother dies shortly after his release, and despite the objections of his only friend, Jacques, and his mother's neighbor Jeanne, Michel teams up with a couple of petty thieves in order to improve his craft. With a police inspector keeping an eye on him, Michel also tries to get a straight job, but the temptation to steal is hard to resist.",
    posterUrl: tmdbPoster('kxpvceDv9fhFc4OAs82fmdzu17Y'),
    genres: ['Crime', 'Drama'],
    directors: ['Robert Bresson'],
    writers: ['Robert Bresson'],
    cast: [
      'Martin LaSalle',
      'Marika Green',
      'Jean Pélégri',
      'Dolly Scal',
      'Pierre Leymarie',
      'Kassagi',
    ],
  },
  // https://www.themoviedb.org/movie/823
  {
    title: 'Jin-Roh: The Wolf Brigade',
    releaseDate: '1999-11-17',
    runtimeMinutes: 102,
    synopsis:
      'A member of an elite paramilitary counter-terrorism unit becomes traumatized after witnessing the suicide bombing of a young girl and is forced to undergo retraining. However, unbeknownst to him, he becomes a key player in a dispute between rival police divisions, as he finds himself increasingly involved with the sister of the girl he saw die.',
    posterUrl: tmdbPoster('63EMBxmcafkc4cWuUWQh2Ttd2jh'),
    genres: ['Animation', 'Thriller', 'Science Fiction'],
    directors: ['Hiroyuki Okiura'],
    writers: ['Mamoru Oshii'],
    cast: [
      'Yoshikatsu Fujiki',
      'Sumi Mutoh',
      'Hiroyuki Kinoshita',
      'Kohsei Hirota',
      'Yukihiro Yoshida',
      'Ryuichi Horibe',
    ],
  },
  // https://www.themoviedb.org/movie/692
  {
    title: 'Pink Flamingos',
    releaseDate: '1972-03-17',
    runtimeMinutes: 93,
    synopsis:
      'Notorious Baltimore criminal and underground figure Divine goes up against Connie & Raymond Marble, a sleazy married couple who make a passionate attempt to humiliate her and seize her tabloid-given title as "The Filthiest Person Alive".',
    posterUrl: tmdbPoster('10N8SvTQwUqyWgocPam1P18Jgr'),
    genres: ['Comedy', 'Crime'],
    directors: ['John Waters'],
    writers: ['John Waters'],
    cast: [
      'Divine',
      'David Lochary',
      'Mary Vivian Pearce',
      'Mink Stole',
      'Danny Mills',
      'Edith Massey',
    ],
  },
  // https://www.themoviedb.org/movie/1644
  {
    title: 'The Vanishing',
    releaseDate: '1993-02-05',
    runtimeMinutes: 109,
    synopsis:
      'The boyfriend of an abducted woman never gives up the search as the abductor looks on.',
    posterUrl: tmdbPoster('whCG6TGm3h9AHBkfh5M0MnJ8zT0'),
    genres: ['Thriller', 'Drama', 'Mystery', 'Horror'],
    directors: ['George Sluizer'],
    writers: ['Todd Graff'],
    cast: [
      'Kiefer Sutherland',
      'Jeff Bridges',
      'Nancy Travis',
      'Sandra Bullock',
      'Park Overall',
      'Lisa Eichhorn',
    ],
  },
  // https://www.themoviedb.org/movie/918
  {
    title: 'Blind Date',
    releaseDate: '1987-03-27',
    runtimeMinutes: 95,
    synopsis:
      "When bachelor Walter Davis is set up with his sister-in-law's pretty cousin, Nadia Gates, a seemingly average blind date turns into a chaotic night on the town. Walter's brother, Ted, tells him not to let Nadia drink alcohol, but he dismisses the warning and her behaviour gets increasingly wild. Walter and Nadia's numerous incidents are made even worse as her former lover David relentlessly follows them around town.",
    posterUrl: tmdbPoster('cLb3akSpZhU5qkmCO46IHfJtcs0'),
    genres: ['Comedy', 'Romance'],
    directors: ['Blake Edwards'],
    writers: ['Dale Launer'],
    cast: [
      'Kim Basinger',
      'Bruce Willis',
      'John Larroquette',
      'William Daniels',
      'George Coe',
      'Mark Blum',
    ],
  },
  // https://www.themoviedb.org/movie/800
  {
    title: 'The Young and the Damned',
    releaseDate: '1950-12-09',
    runtimeMinutes: 82,
    synopsis:
      'A group of juvenile delinquents live a violent life in the infamous slums of Mexico City; among them Pedro, whose morality is gradually corrupted and destroyed by the others.',
    posterUrl: tmdbPoster('cDCvmYoyqFg4CuSMtGMvCpfOIEw'),
    genres: ['Drama', 'Crime'],
    directors: ['Luis Buñuel'],
    writers: ['Luis Buñuel', 'Luis Alcoriza'],
    cast: [
      'Estela Inda',
      'Miguel Inclán',
      'Alfonso Mejía',
      'Roberto Cobo',
      'Alma Delia Fuentes',
      'Francisco Jambrina',
    ],
  },
  // https://www.themoviedb.org/movie/659
  {
    title: 'The Tin Drum',
    releaseDate: '1979-05-02',
    runtimeMinutes: 162,
    synopsis:
      'In 1924, Oskar Matzerath is born in the Free City of Danzig. At age three, he falls down a flight of stairs and stops growing. In 1939, World War II breaks out.',
    posterUrl: tmdbPoster('z4QsBWJbbBxct2zU7LnYSOw8UFz'),
    genres: ['Drama', 'History', 'War'],
    directors: ['Volker Schlöndorff'],
    writers: ['Volker Schlöndorff', 'Franz Seitz Junior', 'Jean-Claude Carrière'],
    cast: [
      'Mario Adorf',
      'Angela Winkler',
      'David Bennent',
      'Katharina Thalbach',
      'Daniel Olbrychski',
      'Tina Engel',
    ],
  },
  // https://www.themoviedb.org/movie/778
  {
    title: "Monsieur Hulot's Holiday",
    releaseDate: '1953-02-25',
    runtimeMinutes: 87,
    synopsis:
      'Monsieur Hulot, Jacques Tati’s endearing clown, takes a holiday at a seaside resort, where his presence provokes one catastrophe after another. Tati’s masterpiece of gentle slapstick is a series of effortlessly well-choreographed sight gags involving dogs, boats, and firecrackers; it was the first entry in the Hulot series and the film that launched its maker to international stardom.',
    posterUrl: tmdbPoster('r4F4tsU0Ajeh9ZYUkWOJSYmioj7'),
    genres: ['Comedy'],
    directors: ['Jacques Tati'],
    writers: ['Jacques Tati', 'Henri Marquet', 'Jacques Lagrange', 'Pierre Aubert'],
    cast: [
      'Jacques Tati',
      'Nathalie Pascaud',
      'Louis Pérault',
      'Micheline Rolla',
      'Valentine Camax',
      'André Dubois',
    ],
  },
  // https://www.themoviedb.org/movie/327
  {
    title: 'Brother',
    releaseDate: '2000-12-13',
    runtimeMinutes: 113,
    synopsis:
      "A Japanese Yakuza gangster's deadly existence in his homeland gets him exiled to Los Angeles, where he is taken in by his little brother and his brother's gang.",
    posterUrl: tmdbPoster('rSRJozSafFFuiFT9XnwsE1ricHT'),
    genres: ['Crime', 'Drama', 'Thriller'],
    directors: ['Takeshi Kitano'],
    writers: ['Takeshi Kitano'],
    cast: [
      'Takeshi Kitano',
      'Omar Epps',
      'Claude Maki',
      'Susumu Terajima',
      'Masaya Katō',
      'Royale Watkins',
    ],
  },
  // https://www.themoviedb.org/movie/457
  {
    title: 'Sissi',
    releaseDate: '1955-12-22',
    runtimeMinutes: 102,
    synopsis:
      'The young Bavarian princess Elisabeth, who all call Sissi, goes with her mother and older sister Néné to Austria where Néné will be wed to an emperor named Franz Joseph, Yet unexpectedly Franz runs into Sissi while out fishing and they fall in love.',
    posterUrl: tmdbPoster('iGy9j4AdhkiOYRYeTSpq7g3zayL'),
    genres: ['Comedy', 'Drama', 'Romance'],
    directors: ['Ernst Marischka'],
    writers: ['Ernst Marischka'],
    cast: [
      'Romy Schneider',
      'Karlheinz Böhm',
      'Magda Schneider',
      'Uta Franz',
      'Gustav Knuth',
      'Vilma Degischer',
    ],
  },
  // https://www.themoviedb.org/movie/1770
  {
    title: 'Michael Collins',
    releaseDate: '1996-10-25',
    runtimeMinutes: 132,
    synopsis:
      'Michael Collins plays a crucial role in the establishment of the Irish Free State in the 1920s, but becomes vilified by those hoping to create a completely independent Irish republic.',
    posterUrl: tmdbPoster('brIBbU6t9glEGAKRTJ4PMj9OiDC'),
    genres: ['War', 'Drama', 'Thriller', 'History'],
    directors: ['Neil Jordan'],
    writers: ['Neil Jordan'],
    cast: [
      'Liam Neeson',
      'Aidan Quinn',
      'Stephen Rea',
      'Alan Rickman',
      'Julia Roberts',
      'Ian Hart',
    ],
  },
  // https://www.themoviedb.org/movie/988
  {
    title: 'The China Syndrome',
    releaseDate: '1979-03-16',
    runtimeMinutes: 122,
    synopsis:
      'While doing a series of reports on alternative energy sources, opportunistic reporter Kimberly Wells witnesses an accident at a nuclear power plant. Wells is determined to publicize the incident, but soon finds herself entangled in a sinister conspiracy to keep the full impact of the incident a secret.',
    posterUrl: tmdbPoster('uHwwQIlt4XwpTFhX9ZT1A8xSW7F'),
    genres: ['Drama', 'Thriller'],
    directors: ['James Bridges'],
    writers: ['James Bridges', 'Mike Gray', 'T.S. Cook'],
    cast: [
      'Jane Fonda',
      'Michael Douglas',
      'Jack Lemmon',
      'Scott Brady',
      'James Hampton',
      'Peter Donat',
    ],
  },
  // https://www.themoviedb.org/movie/1716
  {
    title: 'The Last Metro',
    releaseDate: '1980-09-17',
    runtimeMinutes: 131,
    synopsis:
      'In occupied Paris, an actress wed to a Jewish theater owner must keep him hidden from the Nazis while doing both of their jobs.',
    posterUrl: tmdbPoster('t8KMFg9PiD9GSIHXlzast2WhZex'),
    genres: ['Drama', 'Romance', 'War'],
    directors: ['François Truffaut'],
    writers: ['François Truffaut', 'Suzanne Schiffman'],
    cast: [
      'Catherine Deneuve',
      'Gérard Depardieu',
      'Jean Poiret',
      'Andréa Ferréol',
      'Paulette Dubost',
      'Jean-Louis Richard',
    ],
  },
  // https://www.themoviedb.org/movie/466
  {
    title: 'Klute',
    releaseDate: '1971-06-23',
    runtimeMinutes: 114,
    synopsis:
      'A high-priced call girl is forced to depend on a reluctant private eye when she is stalked by a psychopath.',
    posterUrl: tmdbPoster('tVyINAsNGSgD1OIstqwCcs7wyGH'),
    genres: ['Thriller', 'Crime', 'Drama'],
    directors: ['Alan J. Pakula'],
    writers: ['Andy Lewis', 'David E. Lewis'],
    cast: [
      'Jane Fonda',
      'Donald Sutherland',
      'Charles Cioffi',
      'Roy Scheider',
      'Dorothy Tristan',
      'Rita Gam',
    ],
  },
  // https://www.themoviedb.org/movie/1623
  {
    title: 'Brubaker',
    releaseDate: '1980-06-20',
    runtimeMinutes: 125,
    synopsis:
      'The new warden of a small prison farm in Arkansas tries to clean it up of corruption after initially posing as an inmate.',
    posterUrl: tmdbPoster('4DhrSojl3J0Z4wZyM2CfNGnKQWl'),
    genres: ['Crime', 'Drama'],
    directors: ['Stuart Rosenberg'],
    writers: ['W.D. Richter'],
    cast: [
      'Robert Redford',
      'Yaphet Kotto',
      'Jane Alexander',
      'Murray Hamilton',
      'David Keith',
      'Morgan Freeman',
    ],
  },
  // https://www.themoviedb.org/movie/546
  {
    title: 'Transamerica',
    releaseDate: '2005-02-14',
    runtimeMinutes: 103,
    synopsis:
      'A transgender woman takes an unexpected journey when she learns that she had a son, now a teenage runaway hustling on the streets of New York.',
    posterUrl: tmdbPoster('3MmLpqRlrYSP0uFIDr9BHA4o2LP'),
    genres: ['Drama', 'Adventure', 'Comedy'],
    directors: ['Duncan Tucker'],
    writers: ['Duncan Tucker'],
    cast: [
      'Felicity Huffman',
      'Kevin Zegers',
      'Fionnula Flanagan',
      'Burt Young',
      'Carrie Preston',
      'Elizabeth Peña',
    ],
  },
  // https://www.themoviedb.org/movie/20
  {
    title: 'My Life Without Me',
    releaseDate: '2003-03-07',
    runtimeMinutes: 106,
    synopsis:
      'A fatally ill mother with only two months to live creates a list of things she wants to do before she dies without telling her family of her illness.',
    posterUrl: tmdbPoster('pFEtVPW88pWflYV84UFL0h1iJr3'),
    genres: ['Drama', 'Romance'],
    directors: ['Isabel Coixet'],
    writers: ['Isabel Coixet'],
    cast: [
      'Sarah Polley',
      'Amanda Plummer',
      'Scott Speedman',
      'Mark Ruffalo',
      'Leonor Watling',
      'Debbie Harry',
    ],
  },
  // https://www.themoviedb.org/movie/527
  {
    title: 'Once Were Warriors',
    releaseDate: '1994-09-02',
    runtimeMinutes: 99,
    synopsis:
      'In a violent relationship, it takes a mother’s strength to save herself and her children from the man she loved. Once Were Warriors is a violent love story set against a contemporary urban backdrop.',
    posterUrl: tmdbPoster('kRNANrGG50AaU2TwN0kg7tkYqlQ'),
    genres: ['Drama'],
    directors: ['Lee Tamahori'],
    writers: ['Riwia Brown'],
    cast: [
      'Rena Owen',
      'Temuera Morrison',
      'Mamaengaroa Kerr-Bell',
      'Julian Arahanga',
      'Taungaroa Emile',
      'Rachael Morris Jr.',
    ],
  },
  // https://www.themoviedb.org/movie/874
  {
    title: 'A Man for All Seasons',
    releaseDate: '1966-12-13',
    runtimeMinutes: 120,
    synopsis:
      'A depiction of the conflict between King Henry VIII of England and his Lord Chancellor, Sir Thomas More, who refuses to swear the Oath of Supremacy declaring Henry Supreme Head of the Church in England.',
    posterUrl: tmdbPoster('1AhIatyuSxymFNHhNTzDiUrE6kn'),
    genres: ['Drama', 'History'],
    directors: ['Fred Zinnemann'],
    writers: ['Robert Bolt'],
    cast: [
      'Paul Scofield',
      'Wendy Hiller',
      'Leo McKern',
      'Robert Shaw',
      'Orson Welles',
      'Susannah York',
    ],
  },
  // https://www.themoviedb.org/movie/1619
  {
    title: 'The Way of the Gun',
    releaseDate: '2000-09-08',
    runtimeMinutes: 119,
    synopsis:
      'Two criminal drifters without sympathy get more than they bargained for after kidnapping and holding for ransom the surrogate mother of a powerful and shady man.',
    posterUrl: tmdbPoster('wrjMMdgn1a4ChlaBmlzKnb78nr6'),
    genres: ['Action', 'Crime', 'Drama', 'Thriller'],
    directors: ['Christopher McQuarrie'],
    writers: ['Christopher McQuarrie'],
    cast: [
      'Ryan Phillippe',
      'Benicio del Toro',
      'Juliette Lewis',
      'Taye Diggs',
      'Nicky Katt',
      'Geoffrey Lewis',
    ],
  },
  // https://www.themoviedb.org/movie/1553
  {
    title: 'The Beat That My Heart Skipped',
    releaseDate: '2005-03-16',
    runtimeMinutes: 107,
    synopsis:
      'A ruthless real estate agent discovers a passion for piano and auditions with help from a young virtuoso, but the pressures of his corrupt career threaten to derail his musical aspirations.',
    posterUrl: tmdbPoster('w4Y1WJMUP6w2hZo5FnQdZL3OWjN'),
    genres: ['Drama', 'Crime'],
    directors: ['Jacques Audiard'],
    writers: ['Jacques Audiard', 'Tonino Benacquista'],
    cast: [
      'Romain Duris',
      'Niels Arestrup',
      'Jonathan Zaccaï',
      'Gilles Cohen',
      'Linh-Dan Pham',
      'Aure Atika',
    ],
  },
  // https://www.themoviedb.org/movie/236
  {
    title: "Muriel's Wedding",
    releaseDate: '1994-09-29',
    runtimeMinutes: 106,
    synopsis:
      'Socially awkward Muriel Heslop wants nothing more than to get married. Unfortunately, due to her oppressive politician father, Muriel has never even been on a date. Ostracized by her more socially adept friends, Muriel runs into fellow outcast Rhonda Epinstalk, and the two move from their small Australian town to the big city of Sydney, where Muriel changes her name and begins the arduous task of redesigning her life to match her fantasies.',
    posterUrl: tmdbPoster('zJyTr8Fo412a2OIfJGXTRAm4IwX'),
    genres: ['Comedy', 'Drama', 'Romance'],
    directors: ['P.J. Hogan'],
    writers: ['P.J. Hogan'],
    cast: [
      'Toni Collette',
      'Bill Hunter',
      'Rachel Griffiths',
      'Sophie Lee',
      'Jeanie Drynan',
      'Gennie Nevinson',
    ],
  },
  // https://www.themoviedb.org/movie/965
  {
    title: 'The Magnificent Ambersons',
    releaseDate: '1942-07-10',
    runtimeMinutes: 88,
    synopsis:
      'The spoiled young heir to the decaying Amberson fortune comes between his widowed mother and the man she has always loved.',
    posterUrl: tmdbPoster('g5EosvM0delNPkgBDGYYZvJl46n'),
    genres: ['Drama', 'Romance'],
    directors: ['Orson Welles'],
    writers: ['Orson Welles'],
    cast: [
      'Joseph Cotten',
      'Dolores Costello',
      'Anne Baxter',
      'Tim Holt',
      'Agnes Moorehead',
      'Ray Collins',
    ],
  },
  // https://www.themoviedb.org/movie/502
  {
    title: 'Fail Safe',
    releaseDate: '1964-10-07',
    runtimeMinutes: 112,
    synopsis:
      'Because of a technical defect an American bomber team mistakenly orders the destruction of Moscow. The President of the United States has but little time to prevent an atomic catastrophe from occurring.',
    posterUrl: tmdbPoster('qrsj5hort5xkLOKw9NyraGMnlVP'),
    genres: ['Thriller', 'Drama', 'War'],
    directors: ['Sidney Lumet'],
    writers: ['Walter Bernstein'],
    cast: [
      'Henry Fonda',
      'Walter Matthau',
      'Fritz Weaver',
      'Larry Hagman',
      'Frank Overton',
      'Edward Binns',
    ],
  },
  // https://www.themoviedb.org/movie/255
  {
    title: 'Stolen Kisses',
    releaseDate: '1968-09-04',
    runtimeMinutes: 90,
    synopsis:
      "The third in a series of films featuring François Truffaut's alter-ego, Antoine Doinel, the story resumes with Antoine being discharged from military service. His sweetheart Christine's father lands Antoine a job as a security guard, which he promptly loses. Stumbling into a position assisting a private detective, Antoine falls for his employers' seductive wife, Fabienne, and finds that he must choose between the older woman and Christine.",
    posterUrl: tmdbPoster('5qHh1Vp2TOOX5IaTVt4wyT8OTnR'),
    genres: ['Comedy', 'Drama', 'Romance'],
    directors: ['François Truffaut'],
    writers: ['François Truffaut', 'Bernard Revon', 'Claude de Givray'],
    cast: [
      'Jean-Pierre Léaud',
      'Claude Jade',
      'Delphine Seyrig',
      'Michael Lonsdale',
      'Daniel Ceccaldi',
      'Claire Duhamel',
    ],
  },
  // https://www.themoviedb.org/movie/216
  {
    title: 'Ali: Fear Eats the Soul',
    releaseDate: '1974-03-05',
    runtimeMinutes: 93,
    synopsis:
      "Emmi Kurowski, a cleaning lady, is lonely in her old age. Her husband died years ago, and her grown children offer little companionship. One night she goes to a bar frequented by Arab immigrants and strikes up a friendship with middle-aged mechanic Ali. Their relationship soon develops into something more, and Emmi's family and neighbors criticize their spontaneous marriage. Soon Emmi and Ali are forced to confront their own insecurities about their future.",
    posterUrl: tmdbPoster('cRL8j5RhL4YUviwcfTiCVHfrBFM'),
    genres: ['Romance', 'Drama'],
    directors: ['Rainer Werner Fassbinder'],
    writers: ['Rainer Werner Fassbinder'],
    cast: [
      'Brigitte Mira',
      'El Hedi ben Salem',
      'Irm Hermann',
      'Barbara Valentin',
      'Elma Karlowa',
      'Anita Bucher',
    ],
  },
  // https://www.themoviedb.org/movie/1249
  {
    title: 'Hollywoodland',
    releaseDate: '2006-08-31',
    runtimeMinutes: 126,
    synopsis:
      "When Hollywood superstar George Reeves dies in his home, private detective Louis Simo is hired to investigate his death and gets caught in a web of lies involving a big studio executive's wife. Based on a true story.",
    posterUrl: tmdbPoster('8FgNVvJEEwRgFURiAcW7VuXwvf1'),
    genres: ['Crime', 'Drama', 'Mystery'],
    directors: ['Allen Coulter'],
    writers: ['Paul Bernbaum'],
    cast: [
      'Adrien Brody',
      'Diane Lane',
      'Ben Affleck',
      'Bob Hoskins',
      'Robin Tunney',
      'Kathleen Robertson',
    ],
  },
  // https://www.themoviedb.org/movie/1088
  {
    title: 'Whale Rider',
    releaseDate: '2003-01-30',
    runtimeMinutes: 101,
    synopsis:
      'A contemporary story of love, rejection, and triumph as a young Māori girl fights to fulfill a destiny her grandfather refuses to recognize.',
    posterUrl: tmdbPoster('cVBZQZq091KtwBm2qObOv0JTFcH'),
    genres: ['Drama', 'Family'],
    directors: ['Niki Caro'],
    writers: ['Niki Caro'],
    cast: [
      'Keisha Castle-Hughes',
      'Rawiri Paratene',
      'Vicky Haughton',
      'Cliff Curtis',
      'Grant Roa',
      'Mana Taumaunu',
    ],
  },
  // https://www.themoviedb.org/movie/1689
  {
    title: 'Little Buddha',
    releaseDate: '1993-12-01',
    runtimeMinutes: 123,
    synopsis:
      'After the death of Lama Dorje, Tibetan Buddhist monks find three children — one American and two Nepalese — who may be the rebirth of their great teacher.',
    posterUrl: tmdbPoster('xy70xtdoKZ3PxlKkakwdhL3UFDQ'),
    genres: ['Drama', 'History'],
    directors: ['Bernardo Bertolucci'],
    writers: ['Rudy Wurlitzer', 'Mark Peploe'],
    cast: [
      'Keanu Reeves',
      'Bridget Fonda',
      'Chris Isaak',
      'Ruocheng Ying',
      'Alex Wiesendanger',
      'Raju Lal',
    ],
  },
  // https://www.themoviedb.org/movie/3
  {
    title: 'Shadows in Paradise',
    releaseDate: '1986-10-17',
    runtimeMinutes: 74,
    synopsis:
      'Nikander, a rubbish collector and would-be entrepreneur, finds his plans for success dashed when his business associate dies. One evening, he meets Ilona, a down-on-her-luck cashier, in a local supermarket. Falteringly, a bond begins to develop between them.',
    posterUrl: tmdbPoster('nj01hspawPof0mJmlgfjuLyJuRN'),
    genres: ['Comedy', 'Drama', 'Romance'],
    directors: ['Aki Kaurismäki'],
    writers: ['Aki Kaurismäki'],
    cast: [
      'Matti Pellonpää',
      'Kati Outinen',
      'Sakari Kuosmanen',
      'Esko Nikkari',
      'Kylli Köngäs',
      'Pekka Laiho',
    ],
  },
  // https://www.themoviedb.org/movie/1420
  {
    title: 'Breakfast on Pluto',
    releaseDate: '2005-11-16',
    runtimeMinutes: 128,
    synopsis:
      'In the 1970s, a young transgender woman called “Kitten” leaves her small Irish town for London in search of love, acceptance, and her long-lost mother.',
    posterUrl: tmdbPoster('14tmdb1PiLNDZf3VD29S2nUKVV0'),
    genres: ['Drama', 'Comedy'],
    directors: ['Neil Jordan'],
    writers: ['Neil Jordan', 'Pat McCabe'],
    cast: [
      'Cillian Murphy',
      'Stephen Rea',
      'Brendan Gleeson',
      'Liam Neeson',
      'Eva Birthistle',
      'Ruth Negga',
    ],
  },
  // https://www.themoviedb.org/movie/400
  {
    title: "Things to Do in Denver When You're Dead",
    releaseDate: '1995-12-01',
    runtimeMinutes: 116,
    synopsis: 'Five different criminals face imminent death after botching a job quite badly.',
    posterUrl: tmdbPoster('3LxYzYybOVpnw0juCSlNL5cj8NK'),
    genres: ['Drama', 'Crime'],
    directors: ['Gary Fleder'],
    writers: ['Scott Rosenberg'],
    cast: [
      'Andy Garcia',
      'Christopher Lloyd',
      'William Forsythe',
      'Bill Nunn',
      'Treat Williams',
      'Jack Warden',
    ],
  },
  // https://www.themoviedb.org/movie/436
  {
    title: 'Maria Full of Grace',
    releaseDate: '2004-04-02',
    runtimeMinutes: 101,
    synopsis:
      'A pregnant Colombian teenager becomes a drug mule to make some desperately needed money for her family.',
    posterUrl: tmdbPoster('30CImATfvHWLXy6a3KmHXnYXB6c'),
    genres: ['Drama', 'Thriller', 'Crime'],
    directors: ['Joshua Marston'],
    writers: ['Joshua Marston'],
    cast: [
      'Catalina Sandino Moreno',
      'Guilied Lopez',
      'Yenny Paola Vega',
      'Jhon Álex Toro',
      'Virgina Ariza',
      'Rodrigo Sánchez Borhorquez',
    ],
  },
  // https://www.themoviedb.org/movie/909
  {
    title: 'Meet Me in St. Louis',
    releaseDate: '1944-11-28',
    runtimeMinutes: 114,
    synopsis:
      "A year in the life of a turn-of-the-century middle class family, leading up to the opening of the 1904 St. Louis World's Fair.",
    posterUrl: tmdbPoster('ekVeUvG81pidsv2LMtWf5yYcNbq'),
    genres: ['Comedy', 'Drama', 'Romance', 'Family'],
    directors: ['Vincente Minnelli'],
    writers: ['Irving Brecher', 'Fred F. Finklehoffe'],
    cast: [
      'Judy Garland',
      "Margaret O'Brien",
      'Mary Astor',
      'Lucille Bremer',
      'Leon Ames',
      'Tom Drake',
    ],
  },
  // https://www.themoviedb.org/movie/980
  {
    title: 'The Ox-Bow Incident',
    releaseDate: '1943-03-11',
    runtimeMinutes: 76,
    synopsis:
      'A posse discovers a trio of men they suspect of murder and cow theft and are split between handing them over to the law or lynching them on the spot.',
    posterUrl: tmdbPoster('1rzmL32QaewQbpO1zbhZKMDn5Gz'),
    genres: ['Western'],
    directors: ['William A. Wellman'],
    writers: ['Lamar Trotti'],
    cast: [
      'Henry Fonda',
      'Dana Andrews',
      'Mary Beth Hughes',
      'Anthony Quinn',
      'William Eythe',
      'Harry Morgan',
    ],
  },
  // https://www.themoviedb.org/movie/1721
  {
    title: 'All the Way Boys',
    releaseDate: '1972-12-22',
    runtimeMinutes: 120,
    synopsis:
      'The "Trinity" crew makes another modern era film. Plata and Salud are pilots ditching aircraft for insurance money. They wind up crashing for real in the jungles of South America. The plot involves "Mr. Big", who is buying the diamonds from the miners for much too little, and has thugs who keep the price down. Of course, Plata and Salud side with the miners',
    posterUrl: tmdbPoster('cWhBysh8ejHqKBcv5cGaA5FCCcq'),
    genres: ['Adventure', 'Action', 'Comedy'],
    directors: ['Giuseppe Colizzi'],
    writers: ['Giuseppe Colizzi', 'Barbara Alberti', 'Amedeo Pagani'],
    cast: [
      'Terence Hill',
      'Bud Spencer',
      'Reinhard Kolldehoff',
      'Riccardo Pizzuti',
      'Marcello Verziera',
      'Cyril Cusack',
    ],
  },
  // https://www.themoviedb.org/movie/1450
  {
    title: 'Blood: The Last Vampire',
    releaseDate: '2009-04-02',
    runtimeMinutes: 91,
    synopsis:
      'On the surface, Saya is a stunning 16-year-old, but that youthful exterior hides the tormented soul of a 400-year-old "halfling". Born to a human father and a vampire mother, she has for centuries been a loner obsessed with using her samurai skills to rid the world of vampires, all the while knowing that she herself can survive only on blood like those she hunts.',
    posterUrl: tmdbPoster('uzuYpbdFkNYqnBdOvhWqZxhHa5C'),
    genres: ['Action', 'Adventure', 'Horror', 'Science Fiction', 'Thriller'],
    directors: ['Chris Nahon'],
    writers: ['Chris Chow'],
    cast: [
      'Gianna Jun',
      'Allison Miller',
      'Liam Cunningham',
      'JJ Feild',
      'Koyuki',
      'Yasuaki Kurata',
    ],
  },
  // https://www.themoviedb.org/movie/1049
  {
    title: 'Sommersby',
    releaseDate: '1993-02-05',
    runtimeMinutes: 109,
    synopsis:
      'Set in the South just after the US Civil War, Laurel Sommersby is just managing to work the farm without her husband, believed killed in battle. By all accounts, Jack Sommersby was not a pleasant man, thus when he suddenly returns, Laurel has mixed emotions. It appears that Jack has changed a great deal, leading some people to believe that this is not actually Jack but an imposter. Laurel herself is unsure, but willing to take the man into her home, and perhaps later into her heart.',
    posterUrl: tmdbPoster('tAgQKLv0GK97Tr0bvdI66oXlEVb'),
    genres: ['Drama', 'Thriller', 'Mystery', 'Romance'],
    directors: ['Jon Amiel'],
    writers: ['Sarah Kernochan'],
    cast: [
      'Jodie Foster',
      'Richard Gere',
      'Bill Pullman',
      'James Earl Jones',
      'Lanny Flaherty',
      'William Windom',
    ],
  },
  // https://www.themoviedb.org/movie/430
  {
    title: 'One, Two, Three',
    releaseDate: '1961-12-15',
    runtimeMinutes: 109,
    synopsis:
      "In Cold War-era West Berlin, American Coca-Cola executive C.R. 'Mac' MacNamara is tasked with playing babysitter to his boss' spoiled 17-year-old daughter Scarlett, who proves more difficult than anticipated when she reveals that she is pregnant by a Communist.",
    posterUrl: tmdbPoster('yWQE227ub1frfnjP5HZy0wLF0wu'),
    genres: ['Comedy'],
    directors: ['Billy Wilder'],
    writers: ['Billy Wilder', 'I. A. L. Diamond'],
    cast: [
      'James Cagney',
      'Horst Buchholz',
      'Pamela Tiffin',
      'Arlene Francis',
      'Liselotte Pulver',
      'Hanns Lothar',
    ],
  },
  // https://www.themoviedb.org/movie/1662
  {
    title: 'State of Grace',
    releaseDate: '1990-09-14',
    runtimeMinutes: 135,
    synopsis:
      "Hell's Kitchen, New York. Terry Noonan returns home after a ten-year absence. He soon reconnects with Jackie, a childhood friend and member of the Irish mob, and rekindles his love affair with Jackie's sister Kathleen.",
    posterUrl: tmdbPoster('dNMeRLY3MeY2FFeh639plHai3F1'),
    genres: ['Drama', 'Crime', 'Thriller'],
    directors: ['Phil Joanou'],
    writers: ['Dennis McIntyre'],
    cast: [
      'Sean Penn',
      'Ed Harris',
      'Gary Oldman',
      'Robin Wright',
      'John Turturro',
      'Burgess Meredith',
    ],
  },
  // https://www.themoviedb.org/movie/482
  {
    title: 'Shaft',
    releaseDate: '1971-06-25',
    runtimeMinutes: 100,
    synopsis:
      'Cool Black private eye John Shaft is hired by a crime lord to find and retrieve his kidnapped daughter.',
    posterUrl: tmdbPoster('yJChPuu2V339IiDPQDHeIh1SYpA'),
    genres: ['Crime', 'Thriller', 'Drama', 'Action'],
    directors: ['Gordon Parks'],
    writers: ['Ernest Tidyman', 'John D.F. Black'],
    cast: [
      'Richard Roundtree',
      'Moses Gunn',
      'Charles Cioffi',
      'Christopher St. John',
      'Gwenn Mitchell',
      'Lawrence Pressman',
    ],
  },
  // https://www.themoviedb.org/movie/1665
  {
    title: 'Last Days',
    releaseDate: '2005-06-12',
    runtimeMinutes: 97,
    synopsis:
      'The life and struggles of a notorious rock musician seeping into a pit of loneliness whose everyday life involves friends and family seeking financial aid and favors, inspired by rock music legend Kurt Cobain and his final hours.',
    posterUrl: tmdbPoster('btbp47CHXgLhw30kyDoVfNFLB3g'),
    genres: ['Drama'],
    directors: ['Gus Van Sant'],
    writers: ['Gus Van Sant'],
    cast: [
      'Michael Pitt',
      'Lukas Haas',
      'Asia Argento',
      'Scott Patrick Green',
      'Nicole Vicius',
      'Ricky Jay',
    ],
  },
  // https://www.themoviedb.org/movie/299
  {
    title: "Ocean's Eleven",
    releaseDate: '1960-08-10',
    runtimeMinutes: 127,
    synopsis:
      'Danny Ocean and his gang attempt to rob the five biggest casinos in Las Vegas in one night.',
    posterUrl: tmdbPoster('A4R6u7SidBPVXMVzGSysCiRGTRz'),
    genres: ['Crime', 'Comedy', 'Thriller'],
    directors: ['Lewis Milestone'],
    writers: ['Charles Lederer', 'Harry Brown'],
    cast: [
      'Frank Sinatra',
      'Dean Martin',
      'Sammy Davis Jr.',
      'Peter Lawford',
      'Angie Dickinson',
      'Richard Conte',
    ],
  },
  // https://www.themoviedb.org/movie/987
  {
    title: 'The Front Page',
    releaseDate: '1974-11-01',
    runtimeMinutes: 105,
    synopsis:
      'Ruthless Chicago newspaper editor Walter Burns resorts to dubious motives in order to get top reporter Hildy Johnson to cover one more big crime story before retirement.',
    posterUrl: tmdbPoster('r4RtbJk8wVyZ1yk6yBZjzGD4ANU'),
    genres: ['Comedy'],
    directors: ['Billy Wilder'],
    writers: ['Billy Wilder', 'I. A. L. Diamond'],
    cast: [
      'Jack Lemmon',
      'Walter Matthau',
      'Susan Sarandon',
      'Vincent Gardenia',
      'David Wayne',
      'Allen Garfield',
    ],
  },
  // https://www.themoviedb.org/movie/6
  {
    title: 'Judgment Night',
    releaseDate: '1993-10-15',
    runtimeMinutes: 109,
    synopsis:
      'Four young friends, while taking a shortcut en route to a local boxing match, witness a brutal murder which leaves them running for their lives.',
    posterUrl: tmdbPoster('3rvvpS9YPM5HB2f4HYiNiJVtdam'),
    genres: ['Action', 'Crime', 'Thriller'],
    directors: ['Stephen Hopkins'],
    writers: ['Lewis Colick'],
    cast: [
      'Emilio Estevez',
      'Cuba Gooding Jr.',
      'Denis Leary',
      'Stephen Dorff',
      'Jeremy Piven',
      'Peter Greene',
    ],
  },
  // https://www.themoviedb.org/movie/1252
  {
    title: 'Lonely Hearts',
    releaseDate: '2006-04-30',
    runtimeMinutes: 108,
    synopsis:
      "In the late 1940s, a murderous couple known as the 'The Lonely Hearts Killers' kills close to a dozen people. Two detectives try to nab the duo who find their targets via the personals in the paper.",
    posterUrl: tmdbPoster('qnQK4JUwEUFDKt7dSMY2fJmhv2f'),
    genres: ['Drama', 'Thriller', 'Crime', 'Romance'],
    directors: ['Todd Robinson'],
    writers: ['Todd Robinson'],
    cast: [
      'John Travolta',
      'James Gandolfini',
      'Jared Leto',
      'Salma Hayek Pinault',
      'Scott Caan',
      'Laura Dern',
    ],
  },
  // https://www.themoviedb.org/movie/1382
  {
    title: 'Me and You and Everyone We Know',
    releaseDate: '2005-05-12',
    runtimeMinutes: 91,
    synopsis:
      'Single dad Richard meets Christine, a starving artist who moonlights as a cabbie. They awkwardly attempt to start a romance, but Richard’s divorce has left him emotionally damaged. Meanwhile, Richard’s sons—one a teenager, the other 6-years-old—take part in clumsy experiments with the opposite sex.',
    posterUrl: tmdbPoster('hrj9VsInHnqSDBhEc2FvY0qd79F'),
    genres: ['Comedy', 'Drama'],
    directors: ['Miranda July'],
    writers: ['Miranda July'],
    cast: [
      'Miranda July',
      'John Hawkes',
      'Brandon Ratcliff',
      'Miles Thompson',
      'Carlie Westerman',
      'Brad William Henke',
    ],
  },
  // https://www.themoviedb.org/movie/919
  {
    title: 'Blood: The Last Vampire',
    releaseDate: '2000-11-18',
    runtimeMinutes: 48,
    synopsis:
      'In Japan, the vampire-hunter Saya, who is a powerful original, is sent by her liaison with the government, David, posed as a teenage student to the Yokota High School on the eve of Halloween to hunt down vampires. Saya asks David to give a new katana to her. Soon she saves the school nurse Makiho Amano from two vampires disguised of classmates and Makiho witnesses her fight against the powerful demon.',
    posterUrl: tmdbPoster('uRwR5lcl55n5JSaTiYPwp5KjP6A'),
    genres: ['Animation', 'Fantasy', 'Horror'],
    directors: ['Hiroyuki Kitakubo'],
    writers: ['Kenji Kamiyama'],
    cast: [
      'Youki Kudoh',
      'Saemi Nakamura',
      'Joe Romersa',
      'Rebecca Forstadt',
      'Stuart Robinson',
      'Akira Koteyama',
    ],
  },
  // https://www.themoviedb.org/movie/2
  {
    title: 'Ariel',
    releaseDate: '1988-10-21',
    runtimeMinutes: 73,
    synopsis:
      'A Finnish man goes to the city to find a job after the mine where he worked is closed and his father commits suicide.',
    posterUrl: tmdbPoster('ojDg0PGvs6R9xYFodRct2kdI6wC'),
    genres: ['Comedy', 'Drama', 'Romance', 'Crime'],
    directors: ['Aki Kaurismäki'],
    writers: ['Aki Kaurismäki'],
    cast: [
      'Turo Pajala',
      'Susanna Haavisto',
      'Matti Pellonpää',
      'Eetu Hilkamo',
      'Erkki Pajala',
      'Matti Jaaranen',
    ],
  },
  // https://www.themoviedb.org/movie/318
  {
    title: 'The Million Dollar Hotel',
    releaseDate: '2000-02-09',
    runtimeMinutes: 122,
    synopsis:
      'A federal agent searches for a potential killer among the bizarre residents of a dilapidated Los Angeles hotel.',
    posterUrl: tmdbPoster('iGRyPsZF0lfIL3IadmBdoAsYzyn'),
    genres: ['Drama', 'Thriller'],
    directors: ['Wim Wenders'],
    writers: ['Nicholas Klein', 'Bono'],
    cast: [
      'Mel Gibson',
      'Milla Jovovich',
      'Jeremy Davies',
      'Peter Stormare',
      'Amanda Plummer',
      'Bud Cort',
    ],
  },
  // https://www.themoviedb.org/movie/458
  {
    title: 'Sissi: The Young Empress',
    releaseDate: '1956-12-01',
    runtimeMinutes: 107,
    synopsis:
      'Sissi is now the empress of Austria and attempts to learn etiquette. While she is busy being empress she also has to deal with her difficult new mother-in-law, while the arch-duchess Sophie is trying to tell the emperor how to rule and also Sissi how to be a mother.',
    posterUrl: tmdbPoster('eGBCl0qGEwNbNu0nc5KOWYdBce4'),
    genres: ['Drama', 'Comedy', 'Romance'],
    directors: ['Ernst Marischka'],
    writers: ['Ernst Marischka'],
    cast: [
      'Romy Schneider',
      'Karlheinz Böhm',
      'Magda Schneider',
      'Vilma Degischer',
      'Gustav Knuth',
      'Walther Reyer',
    ],
  },
  // https://www.themoviedb.org/movie/507
  {
    title: 'Killing Zoe',
    releaseDate: '1993-10-01',
    runtimeMinutes: 96,
    synopsis:
      'Zed is an American vault-cracker who travels to Paris to meet up with his old friend Eric. Eric and his gang have planned to raid the only bank in the city which is open on Bastille day. After offering his services, Zed soon finds himself trapped in a situation beyond his control when heroin abuse, poor planning and a call-girl named Zoe all conspire to turn the robbery into a very bloody siege.',
    posterUrl: tmdbPoster('k3UEKMVnkljOlsO5sLmz87YGlaG'),
    genres: ['Action', 'Crime', 'Drama', 'Thriller'],
    directors: ['Roger Avary'],
    writers: ['Roger Avary'],
    cast: [
      'Eric Stoltz',
      'Julie Delpy',
      'Jean-Hugues Anglade',
      'Tai Thai',
      'Bruce Ramsay',
      'Kario Salem',
    ],
  },
  // https://www.themoviedb.org/movie/228
  {
    title: 'The Blue Angel',
    releaseDate: '1930-04-01',
    runtimeMinutes: 108,
    synopsis:
      'Prim professor Immanuel Rath finds some of his students ogling racy photos of cabaret performer Lola Lola and visits a local club, The Blue Angel, in an attempt to catch them there. Seeing Lola perform, the teacher is filled with lust, eventually resigning his position at the school to marry the young woman. However, his marriage to a coquette -- whose job is to entice men -- proves to be more difficult than Rath imagined.',
    posterUrl: tmdbPoster('khz2rKLAPDVu9auJt1sR1HO9SCG'),
    genres: ['Drama'],
    directors: ['Josef von Sternberg'],
    writers: [
      'Josef von Sternberg',
      'Robert Liebmann',
      'Carl Winston',
      'Carl Zuckmayer',
      'Karl Vollmöller',
    ],
    cast: [
      'Emil Jannings',
      'Marlene Dietrich',
      'Kurt Gerron',
      'Rosa Valetti',
      'Hans Albers',
      'Reinhold Bernt',
    ],
  },
  // https://www.themoviedb.org/movie/315
  {
    title: 'Faster, Pussycat! Kill! Kill!',
    releaseDate: '1965-08-06',
    runtimeMinutes: 83,
    synopsis:
      "A trio of thrill-seeking go-go dancers kidnap a young girl and attempt to seduce an old rancher and his two sons out of their small fortune, but their scheme doesn't play out as intended.",
    posterUrl: tmdbPoster('2hIHFk52SZ9XsZB4U85RUq36BT4'),
    genres: ['Action', 'Crime', 'Comedy', 'Thriller'],
    directors: ['Russ Meyer'],
    writers: ['Jack Moran'],
    cast: [
      'Tura Satana',
      'Haji',
      'Lori Williams',
      'Sue Bernard',
      'Stuart Lancaster',
      'Paul Trinka',
    ],
  },
  // https://www.themoviedb.org/movie/870
  {
    title: 'Dolls',
    releaseDate: '2002-10-12',
    runtimeMinutes: 114,
    synopsis:
      "Dolls takes puppeteering as its overriding motif, which relates thematically to the action provided by the live characters. Chief among those tales is the story of Matsumoto and Sawako, a young couple whose relationship is about to be broken apart by the former's parents, who have insisted their son take part in an arranged marriage to his boss' daughter.",
    posterUrl: tmdbPoster('vQ9XBpH88jvO3hpHt9Zm5IHe5NP'),
    genres: ['Drama', 'Romance'],
    directors: ['Takeshi Kitano'],
    writers: ['Takeshi Kitano'],
    cast: [
      'Miho Kanno',
      'Hidetoshi Nishijima',
      'Tatsuya Mihashi',
      'Chieko Matsubara',
      'Kyoko Fukada',
      'Tsutomu Takeshige',
    ],
  },
  // https://www.themoviedb.org/movie/1483
  {
    title: 'Begotten',
    releaseDate: '1991-06-05',
    runtimeMinutes: 72,
    synopsis:
      'Begotten is the creation myth brought to life, the story of no less than the violent death of God and the (re)birth of nature on a barren earth.',
    posterUrl: tmdbPoster('y8GbJny4bBUimJxUGXqq3l3k4OV'),
    genres: ['Fantasy', 'Horror'],
    directors: ['E. Elias Merhige'],
    writers: ['E. Elias Merhige'],
    cast: ['Brian Salzberg', 'Donna Dempsey', 'Stephen Charles Barry'],
  },
  // https://www.themoviedb.org/movie/459
  {
    title: 'Sissi: The Fateful Years of an Empress',
    releaseDate: '1957-12-18',
    runtimeMinutes: 109,
    synopsis:
      'After a wonderful time in Hungary Sissi falls extremely ill and must retreat to a Mediterranean climate to rest. The young empress’ mother takes her from Austria to recover in Madeira.',
    posterUrl: tmdbPoster('o6B5zxNzWR6hvT77IbjjUXdCtEu'),
    genres: ['Romance', 'Drama', 'History'],
    directors: ['Ernst Marischka'],
    writers: ['Ernst Marischka'],
    cast: [
      'Romy Schneider',
      'Karlheinz Böhm',
      'Magda Schneider',
      'Gustav Knuth',
      'Uta Franz',
      'Walther Reyer',
    ],
  },
  // https://www.themoviedb.org/movie/868
  {
    title: 'Tsotsi',
    releaseDate: '2005-12-23',
    runtimeMinutes: 94,
    synopsis:
      "A young South African boy from the Johannesburg ghetto named Tsotsi, meaning Gangster, leaves home as a child to get away from his helpless parents. Now a teenage thug, Tsotsi finds a baby in the back seat of a car he's just stolen. He decides that it is his responsibility to care for the infant and in the process learns that maybe the criminal life isn’t the best way.",
    posterUrl: tmdbPoster('r3ebTJFcDZ35GaKcuUQQe243z4f'),
    genres: ['Crime', 'Drama'],
    directors: ['Gavin Hood'],
    writers: ['Gavin Hood'],
    cast: [
      'Presley Chweneyagae',
      'Jerry Mofokeng',
      'Terry Pheto',
      'Zenzo Ngqobe',
      'Zola',
      'Rapulana Seiphemo',
    ],
  },
  // https://www.themoviedb.org/movie/182
  {
    title: 'The Good German',
    releaseDate: '2006-12-15',
    runtimeMinutes: 108,
    synopsis:
      'An American journalist arrives in Berlin just after the end of World War Two. He becomes involved in a murder mystery surrounding a dead GI who washes up at a lakeside mansion during the Potsdam negotiations between the Allied powers. Soon his investigation connects with his search for his married pre-war German lover.',
    posterUrl: tmdbPoster('3LjHC2CWDkzoiPehf3GViujws0'),
    genres: ['Drama', 'Mystery', 'Romance', 'Thriller', 'War'],
    directors: ['Steven Soderbergh'],
    writers: ['Paul Attanasio'],
    cast: [
      'George Clooney',
      'Cate Blanchett',
      'Tobey Maguire',
      'Beau Bridges',
      'Tony Curran',
      'Leland Orser',
    ],
  },
  // https://www.themoviedb.org/movie/183
  {
    title: 'The Wizard',
    releaseDate: '1989-12-15',
    runtimeMinutes: 100,
    synopsis:
      'A boy and his brother run away from home and hitch cross-country, with help from a girl they meet, to compete in the ultimate video game championship.',
    posterUrl: tmdbPoster('dtgNNq3TBbpBX6RXHLt5gAMdwPV'),
    genres: ['Adventure', 'Comedy', 'Drama', 'Family'],
    directors: ['Todd Holland'],
    writers: ['David Chisholm'],
    cast: [
      'Luke Edwards',
      'Vince Trankina',
      'Wendy Phillips',
      'Dea McAllister',
      'Sam McMurray',
      'Beau Bridges',
    ],
  },
  // https://www.themoviedb.org/movie/1162
  {
    title: 'The Miracle Worker',
    releaseDate: '1962-05-23',
    runtimeMinutes: 106,
    synopsis:
      "The true story of the frightening, lonely world of silence and darkness of 7-year-old Helen Keller who, since infancy, has never seen the sky, heard her mother's voice or expressed her innermost feelings. Then Annie Sullivan, a 20-year-old teacher from Boston, arrives. Having just recently regained her own sight, the no-nonsense Annie reaches out to Helen through the power of touch, the only tool they have in common, and leads her bold pupil on a miraculous journey from fear and isolation to happiness and light.",
    posterUrl: tmdbPoster('3dI6UVM5W1sz3MU9gNK5nVDcAyQ'),
    genres: ['Drama', 'History'],
    directors: ['Arthur Penn'],
    writers: ['William Gibson'],
    cast: [
      'Anne Bancroft',
      'Patty Duke',
      'Victor Jory',
      'Inga Swenson',
      'Andrew Prine',
      'Kathleen Comegys',
    ],
  },
  // https://www.themoviedb.org/movie/946
  {
    title: 'Letter from an Unknown Woman',
    releaseDate: '1948-04-28',
    runtimeMinutes: 87,
    synopsis:
      'A pianist about to flee from a duel receives a letter from a woman he cannot remember. As she tells the story of her lifelong love for him, he is forced to reinterpret his own past.',
    posterUrl: tmdbPoster('gRGRW7DKyK8qBtKJTWguULMGbHG'),
    genres: ['Drama', 'Romance'],
    directors: ['Max Ophüls'],
    writers: ['Howard Koch'],
    cast: [
      'Joan Fontaine',
      'Louis Jourdan',
      'Mady Christians',
      'Marcel Journet',
      'Art Smith',
      'Carol Yorke',
    ],
  },
  // https://www.themoviedb.org/movie/898
  {
    title: 'Birdman of Alcatraz',
    releaseDate: '1962-07-04',
    runtimeMinutes: 147,
    synopsis:
      "After killing a prison guard, convict Robert Stroud faces life imprisonment in solitary confinement. Driven nearly mad by loneliness and despair, Stroud's life gains new meaning when he happens upon a helpless baby sparrow in the exercise yard and nurses it back to health. Despite having only a third grade education, Stroud goes on to become a renowned ornithologist and achieves a greater sense of freedom and purpose behind bars than most people find in the outside world.",
    posterUrl: tmdbPoster('6EODLN11HTX4l2cmakAhWIoJLF'),
    genres: ['Drama', 'Crime', 'History'],
    directors: ['John Frankenheimer'],
    writers: ['Guy Trosper'],
    cast: [
      'Burt Lancaster',
      'Karl Malden',
      'Thelma Ritter',
      'Neville Brand',
      'Betty Field',
      'Telly Savalas',
    ],
  },
  // https://www.themoviedb.org/movie/1682
  {
    title: 'Mothra vs. Godzilla',
    releaseDate: '1964-04-29',
    runtimeMinutes: 89,
    synopsis:
      "Journalists Ichiro Sakai and Junko cover the wreckage of a typhoon when an enormous egg is found and claimed by greedy entrepreneurs. Mothra's fairies arrive and are aided by the journalists in a plea for its return. As their requests are denied, Godzilla arises near Nagoya and the people of Infant Island must decide if they are willing to answer Japan's own pleas for help.",
    posterUrl: tmdbPoster('y49vvM03gpuyhpyMc1f55VrNkP3'),
    genres: ['Drama', 'Action', 'Science Fiction'],
    directors: ['Ishirō Honda'],
    writers: ['Shinichi Sekizawa'],
    cast: [
      'Akira Takarada',
      'Yuriko Hoshi',
      'Hiroshi Koizumi',
      'Yū Fujiki',
      'Kenji Sahara',
      'Emi Ito',
    ],
  },
  // https://www.themoviedb.org/movie/1717
  {
    title: "All the King's Men",
    releaseDate: '2006-09-10',
    runtimeMinutes: 128,
    synopsis:
      "The story of an idealist's rise to power in the world of Louisiana politics and the corruption that leads to his ultimate downfall. Based on the 1946 Pulitzer Prize-winning novel written by Robert Penn Warren, loosely based on the story of real-life politician Huey Long.",
    posterUrl: tmdbPoster('r3Yu6JdufxUSqy6PJgT887UpSMt'),
    genres: ['Drama', 'Thriller'],
    directors: ['Steven Zaillian'],
    writers: ['Steven Zaillian'],
    cast: [
      'Sean Penn',
      'Jude Law',
      'Anthony Hopkins',
      'Kate Winslet',
      'Mark Ruffalo',
      'Patricia Clarkson',
    ],
  },
  // https://www.themoviedb.org/movie/1679
  {
    title: 'Godzilla Raids Again',
    releaseDate: '1955-04-24',
    runtimeMinutes: 82,
    synopsis:
      'Two fishing scout pilots make a horrifying discovery when they encounter a second Godzilla alongside a new monster named Anguirus. Without the weapon that killed the original, authorities attempt to lure Godzilla away from the mainland. But Anguirus soon arrives and the two monsters make their way towards Osaka as Japan braces for tragedy.',
    posterUrl: tmdbPoster('bBYdh9tDCyLaArBOzE38QCA7C3y'),
    genres: ['Science Fiction', 'Horror', 'Action'],
    directors: ['Motoyoshi Oda'],
    writers: ['Takeo Murata', 'Shigeaki Hidaka'],
    cast: [
      'Hiroshi Koizumi',
      'Setsuko Wakayama',
      'Minoru Chiaki',
      'Takashi Shimura',
      'Masao Shimizu',
      'Seijirô Onda',
    ],
  },
  // https://www.themoviedb.org/movie/1283
  {
    title: 'Torrente: The Dumb Arm of the Law',
    releaseDate: '1998-03-13',
    runtimeMinutes: 97,
    synopsis:
      'A former policeman enlists his nerdy friend to help bust drug traffickers moving heroin through a Chinese restaurant.',
    posterUrl: tmdbPoster('tGlaXKGmpo7YH1ULTQYFCz8241k'),
    genres: ['Comedy', 'Crime'],
    directors: ['Santiago Segura'],
    writers: ['Santiago Segura'],
    cast: [
      'Santiago Segura',
      'Javier Cámara',
      'Neus Asensi',
      'Chus Lampreave',
      'Tony Leblanc',
      'Julio Sanjuán',
    ],
  },
  // https://www.themoviedb.org/movie/669
  {
    title: 'Nanook of the North',
    releaseDate: '1922-06-11',
    runtimeMinutes: 79,
    synopsis:
      "This pioneering documentary film depicts the lives of the indigenous Inuit people of Canada's northern Quebec region. Although the production contains some fictional elements, it vividly shows how its resourceful subjects survive in such a harsh climate, revealing how they construct their igloo homes and find food by hunting and fishing. The film also captures the beautiful, if unforgiving, frozen landscape of the Great White North, far removed from conventional civilization.",
    posterUrl: tmdbPoster('9WAboi1QbKu41WkyGxQVNpXwwxx'),
    genres: ['Documentary', 'Drama'],
    directors: ['Robert Flaherty'],
    writers: ['Robert Flaherty'],
    cast: ['Allakariallak', 'Alice Nevalinga', 'Cunayou', 'Allegoo', 'Allee'],
  },
  // https://www.themoviedb.org/movie/1698
  {
    title: 'Anatomy',
    releaseDate: '2000-02-03',
    runtimeMinutes: 103,
    synopsis:
      'Medical student Paula wins a place at an exclusive Heidelberg medical school. When the body of a young man she met on the train turns up on her dissection table, she begins to investigate the mysterious circumstances surrounding his death.',
    posterUrl: tmdbPoster('hZgnRhrOkmjjod5u3umbw4y08kX'),
    genres: ['Horror', 'Thriller'],
    directors: ['Stefan Ruzowitzky'],
    writers: ['Stefan Ruzowitzky'],
    cast: [
      'Franka Potente',
      'Benno Fürmann',
      'Anna Loos',
      'Sebastian Blomberg',
      'Holger Speckhahn',
      'Traugott Buhre',
    ],
  },
  // https://www.themoviedb.org/movie/701
  {
    title: 'Our Hospitality',
    releaseDate: '1923-11-19',
    runtimeMinutes: 73,
    synopsis:
      'A young man falls for a young woman on his trip home; unbeknownst to him, her family has vowed to kill every member of his family.',
    posterUrl: tmdbPoster('cAEdL6RzfDSbPO51izl01Njzikx'),
    genres: ['Comedy', 'Romance', 'Thriller'],
    directors: ['John G. Blystone', 'Buster Keaton'],
    writers: ['Joseph A. Mitchell', 'Jean C. Havez'],
    cast: [
      'Buster Keaton',
      'Joe Roberts',
      'Natalie Talmadge',
      'Francis X. Bushman Jr.',
      'Craig Ward',
      'Joe Keaton',
    ],
  },
  // https://www.themoviedb.org/movie/848
  {
    title: 'Dragonslayer',
    releaseDate: '1981-06-26',
    runtimeMinutes: 108,
    synopsis:
      'A sorcerer and his apprentice are on a mission to kill an evil dragon to save the King’s daughter from being sacrificed according to a pact that the King himself made with the dragon to protect his kingdom.',
    posterUrl: tmdbPoster('92VXAEwbjebYqTeUa7uX5bBtDuD'),
    genres: ['Fantasy', 'Adventure'],
    directors: ['Matthew Robbins'],
    writers: ['Matthew Robbins', 'Hal Barwood'],
    cast: [
      'Peter MacNicol',
      'Caitlin Clarke',
      'Ralph Richardson',
      'John Hallam',
      'Peter Eyre',
      'Albert Salmi',
    ],
  },
  // https://www.themoviedb.org/movie/549
  {
    title: 'Basquiat',
    releaseDate: '1996-08-09',
    runtimeMinutes: 107,
    synopsis:
      'The brief life of Jean Michel Basquiat, a world renowned New York street artist struggling with fame, drugs and his identity.',
    posterUrl: tmdbPoster('gFfVhN8BbgHhMb3ZNQRAH5xc7kq'),
    genres: ['Drama', 'History'],
    directors: ['Julian Schnabel'],
    writers: ['Julian Schnabel', 'John F. Bowe'],
    cast: [
      'Jeffrey Wright',
      'Michael Wincott',
      'Benicio del Toro',
      'Claire Forlani',
      'David Bowie',
      'Dennis Hopper',
    ],
  },
  // https://www.themoviedb.org/movie/195
  {
    title: 'Trouble in Paradise',
    releaseDate: '1932-10-30',
    runtimeMinutes: 83,
    synopsis:
      "Thief Gaston Monescu and pickpocket Lily are partners in crime and love. Working for perfume company executive Mariette Colet, the two crooks decide to combine their criminal talents to rob their employer. Under the alias of Monsieur Laval, Gaston uses his position as Mariette's personal secretary to become closer to her. However, he takes things too far when he actually falls in love with Mariette, and has to choose between her and Lily.",
    posterUrl: tmdbPoster('FBxuoLRD3Biyul14unT5m3PYNS'),
    genres: ['Comedy', 'Crime', 'Romance'],
    directors: ['Ernst Lubitsch'],
    writers: ['Samson Raphaelson'],
    cast: [
      'Miriam Hopkins',
      'Kay Francis',
      'Herbert Marshall',
      'Charles Ruggles',
      'Edward Everett Horton',
      'C. Aubrey Smith',
    ],
  },
  // https://www.themoviedb.org/movie/542
  {
    title: 'The Crime of Padre Amaro',
    releaseDate: '2002-10-01',
    runtimeMinutes: 118,
    synopsis:
      "Sent to Mexico to help take care of aging Father Benito, young Father Amaro faces a moral challenge when he meets a 16-year-old girl who he starts an affair with. Likewise, the girl's mother had been having an affair with Father Benito. Father Amaro must choose between a holy or sinful life.",
    posterUrl: tmdbPoster('wqwt2DKcQV6EeSwXuYTk7pkLFii'),
    genres: ['Drama', 'Romance'],
    directors: ['Carlos Carrera'],
    writers: ['Vicente Leñero'],
    cast: [
      'Gael García Bernal',
      'Ana Claudia Talancón',
      'Sancho Gracia',
      'Angélica Aragón',
      'Luisa Huertas',
      'Ernesto Gómez Cruz',
    ],
  },
  // https://www.themoviedb.org/movie/842
  {
    title: 'The Assassination of Richard Nixon',
    releaseDate: '2004-05-17',
    runtimeMinutes: 95,
    synopsis:
      'It’s 1974 and Sam Bicke has lost everything. His wife leaves him with his three kids, his boss fires him, his brother turns away from him, and the bank won’t give him any money to start anew. He tries to find someone to blame for his misfortunes and comes up with the President of the United States who he plans to murder.',
    posterUrl: tmdbPoster('5jOOvAVvP0XtwC5yYQpQCy4cjq1'),
    genres: ['Drama', 'History', 'Thriller', 'Crime'],
    directors: ['Niels Mueller'],
    writers: ['Niels Mueller', 'Kevin Kennedy'],
    cast: [
      'Sean Penn',
      'Don Cheadle',
      'Jack Thompson',
      'Mykelti Williamson',
      'Michael Wincott',
      'Naomi Watts',
    ],
  },
  // https://www.themoviedb.org/movie/552
  {
    title: 'Bread and Tulips',
    releaseDate: '2000-03-03',
    runtimeMinutes: 114,
    synopsis:
      'An endearing light comedy about a woman who spontaneously becomes a resident of Venice after her family left her behind. While enjoying the wonderful people she meets she achieves a new life and the first time independent of her family.',
    posterUrl: tmdbPoster('ijCBLF08KQsam3cOBAnit05iiV3'),
    genres: ['Comedy', 'Romance'],
    directors: ['Silvio Soldini'],
    writers: ['Silvio Soldini', 'Doriana Leondeff'],
    cast: [
      'Licia Maglietta',
      'Bruno Ganz',
      'Giuseppe Battiston',
      'Antonio Catania',
      'Marina Massironi',
      'Felice Andreasi',
    ],
  },
  // https://www.themoviedb.org/movie/886
  {
    title: 'The Cincinnati Kid',
    releaseDate: '1965-10-15',
    runtimeMinutes: 102,
    synopsis:
      'An up-and-coming poker player tries to prove himself in a high-stakes match against a long-time master of the game.',
    posterUrl: tmdbPoster('s4Apy8FcF6a0lR1Qay1atpfwAv9'),
    genres: ['Drama'],
    directors: ['Norman Jewison'],
    writers: ['Terry Southern', 'Ring Lardner', 'Jr.'],
    cast: [
      'Steve McQueen',
      'Edward G. Robinson',
      'Ann-Margret',
      'Karl Malden',
      'Tuesday Weld',
      'Joan Blondell',
    ],
  },
  // https://www.themoviedb.org/movie/1627
  {
    title: 'The Wild Child',
    releaseDate: '1970-02-26',
    runtimeMinutes: 83,
    synopsis:
      'The true story of Victor of Aveyron. In a French forest circa 1798, an abandoned child — feral, filthy and mentally impaired — is found. Dr Jean Marc Gaspard Itard becomes interested in the case and patiently attempts to civilise the boy.',
    posterUrl: tmdbPoster('ivIyyc2VgefJK9LdAogl1BEgmeH'),
    genres: ['Drama', 'History'],
    directors: ['François Truffaut'],
    writers: ['François Truffaut', 'Jean Gruault'],
    cast: [
      'Jean-Pierre Cargol',
      'François Truffaut',
      'Françoise Seigner',
      'Jean Dasté',
      'Annie Miller',
      'Claude Miller',
    ],
  },
  // https://www.themoviedb.org/movie/661
  {
    title: 'The Marriage of Maria Braun',
    releaseDate: '1979-03-23',
    runtimeMinutes: 120,
    synopsis:
      'Maria marries a young soldier in the last days of World War II, only for him to go missing in the war. She must rely on her beauty and ambition to navigate the difficult post-war years alone.',
    posterUrl: tmdbPoster('tXjZEzlf4WQwZ4Dt53gXeJVuO7p'),
    genres: ['Drama'],
    directors: ['Rainer Werner Fassbinder'],
    writers: ['Peter Märthesheimer', 'Pea Fröhlich'],
    cast: [
      'Hanna Schygulla',
      'Klaus Löwitsch',
      'Ivan Desny',
      'George Eagles',
      'Gisela Uhlen',
      'Elisabeth Trissenaar',
    ],
  },
  // https://www.themoviedb.org/movie/250
  {
    title: 'In China They Eat Dogs',
    releaseDate: '1999-09-10',
    runtimeMinutes: 91,
    synopsis:
      'Arvid is an ordinary bank clerk who lives a rather unassuming life with his dear girlfriend. But his life is turned completely upside down when he bravely manages to avert a robbery against the bank where he works.',
    posterUrl: tmdbPoster('v78NxEyzsElWnwSvGWpvf2DCzP9'),
    genres: ['Action', 'Comedy', 'Crime'],
    directors: ['Lasse Spang Olsen'],
    writers: ['Anders Thomas Jensen'],
    cast: [
      'Kim Bodnia',
      'Dejan Čukić',
      'Nikolaj Lie Kaas',
      'Tomas Villum Jensen',
      'Peter Gantzler',
      'Trine Dyrholm',
    ],
  },
  // https://www.themoviedb.org/movie/441
  {
    title: 'Human Nature',
    releaseDate: '2001-09-12',
    runtimeMinutes: 96,
    synopsis:
      'Obsessive scientist Nathan and his lover, the naturalist Lila, discover Puff: a man born and raised in the wild. As Nathan trains the wild man in the civilized ways of the world, Lila fights to preserve the man’s natural state. In the power struggle that ensues, an unusual love triangle emerges.',
    posterUrl: tmdbPoster('eyEgsPIwsr9bUV9n9INH46L5KuM'),
    genres: ['Drama', 'Comedy'],
    directors: ['Michel Gondry'],
    writers: ['Charlie Kaufman'],
    cast: [
      'Tim Robbins',
      'Patricia Arquette',
      'Rhys Ifans',
      'Miranda Otto',
      'Mary Kay Place',
      'Robert Forster',
    ],
  },
  // https://www.themoviedb.org/movie/505
  {
    title: 'Johnny Handsome',
    releaseDate: '1989-09-12',
    runtimeMinutes: 94,
    synopsis:
      'A career criminal who has been deformed since birth is given a new face by a kindly doctor and paroled from prison. It appears that he has gone straight, but he is really planning his revenge on the man who killed his mentor and sent him to prison.',
    posterUrl: tmdbPoster('ec0fMt4CwtWJ0VxeJr9nnhdS867'),
    genres: ['Crime', 'Drama', 'Thriller'],
    directors: ['Walter Hill'],
    writers: ['Ken Friedman'],
    cast: [
      'Mickey Rourke',
      'Ellen Barkin',
      'Morgan Freeman',
      'Forest Whitaker',
      'Elizabeth McGovern',
      'Lance Henriksen',
    ],
  },
  // https://www.themoviedb.org/movie/1596
  {
    title: 'Population 436',
    releaseDate: '2006-07-04',
    runtimeMinutes: 88,
    synopsis:
      'A census-taker is sent to investigate why a certain small town has had the same population -- 436 residents -- for the last 100 years.',
    posterUrl: tmdbPoster('trEcuqgfXtIt06b7Tg1fkCnOHBY'),
    genres: ['Horror', 'Thriller'],
    directors: ['Michelle MacLaren'],
    writers: ['Michael Kingston'],
    cast: [
      'Jeremy Sisto',
      'Charlotte Sullivan',
      'Fred Durst',
      'Peter Outerbridge',
      'R.H. Thomson',
      'David Fox',
    ],
  },
  // https://www.themoviedb.org/movie/897
  {
    title: 'Aparajito',
    releaseDate: '1956-10-11',
    runtimeMinutes: 110,
    synopsis:
      'Apu and his family have moved away from the country to live in the bustling holy city of Benares. As he progresses from wide-eyed child to intellectually curious teenager, eventually studying in Kolkata, we witness his academic and moral education, as well as the growing complexity of his relationship with his mother.',
    posterUrl: tmdbPoster('qvR2Qs42WHwCEcuwhQnterU3gVY'),
    genres: ['Drama'],
    directors: ['Satyajit Ray'],
    writers: ['Satyajit Ray'],
    cast: [
      'Karuna Banerjee',
      'Santi Gupta',
      'Ranibala',
      'Sudipta Roy',
      'Kamala Adhikari',
      'Kanu Bannerjee',
    ],
  },
  // https://www.themoviedb.org/movie/67
  {
    title: 'Paradise Now',
    releaseDate: '2005-09-07',
    runtimeMinutes: 90,
    synopsis: 'Two childhood friends are recruited for a suicide bombing in Tel Aviv.',
    posterUrl: tmdbPoster('qWZkYa8VdcDZk8uzRB2PfhpM9IL'),
    genres: ['Crime', 'Thriller', 'Drama', 'War'],
    directors: ['Hany Abu-Assad'],
    writers: ['Hany Abu-Assad', 'Pierre Hodgson', 'Bero Beyer'],
    cast: [
      'Qais Nashif',
      'Ali Suliman',
      'Lubna Azabal',
      'Amer Hlehel',
      'Hiam Abbass',
      'Ashraf Barhom',
    ],
  },
  // https://www.themoviedb.org/movie/896
  {
    title: 'The World of Apu',
    releaseDate: '1959-05-01',
    runtimeMinutes: 105,
    synopsis:
      'Apu, now a jobless ex-student dreaming vaguely of a future as a writer, is invited to join an old college friend on a trip up-country to a village wedding.',
    posterUrl: tmdbPoster('6Tz1Q69o2n3Zwb0ZffzPL0nFt2T'),
    genres: ['Drama'],
    directors: ['Satyajit Ray'],
    writers: ['Satyajit Ray'],
    cast: [
      'Soumitra Chatterjee',
      'Sharmila Tagore',
      'Alok Chakravarty',
      'Swapan Mukherjee',
      'Sefalika Devi',
      'Belarani Devi',
    ],
  },
  // https://www.themoviedb.org/movie/543
  {
    title: 'Blackmail',
    releaseDate: '1929-07-28',
    runtimeMinutes: 86,
    synopsis:
      'London, 1929. Frank Webber, a very busy Scotland Yard detective, seems to be more interested in his work than in Alice White, his girlfriend. Feeling herself ignored, Alice agrees to go out with an elegant and well-mannered artist who invites her to visit his fancy apartment.',
    posterUrl: tmdbPoster('7ioNEKouUkkWyv5tUDwVUd7BDRR'),
    genres: ['Drama', 'Thriller', 'Crime'],
    directors: ['Alfred Hitchcock'],
    writers: ['Alfred Hitchcock', 'Michael Powell'],
    cast: [
      'Anny Ondra',
      'Sara Allgood',
      'Charles Paton',
      'John Longden',
      'Donald Calthrop',
      'Cyril Ritchard',
    ],
  },
  // https://www.themoviedb.org/movie/1561
  {
    title: 'Mouchette',
    releaseDate: '1967-03-28',
    runtimeMinutes: 81,
    synopsis:
      'A young girl living in the French countryside suffers constant indignities at the hand of alcoholism and her fellow man.',
    posterUrl: tmdbPoster('cITZsSQ7VG122xQ0xAN3NHZF0OH'),
    genres: ['Drama'],
    directors: ['Robert Bresson'],
    writers: ['Robert Bresson'],
    cast: [
      'Nadine Nortier',
      'Jean-Claude Guilbert',
      'Marie Cardinal',
      'Paul Hébert',
      'Jean Vimenet',
      'Marie Susini',
    ],
  },
  // https://www.themoviedb.org/movie/742
  {
    title: 'Together',
    releaseDate: '2000-08-25',
    runtimeMinutes: 106,
    synopsis:
      'Elisabeth leaves her abusive and drunken husband Rolf, and goes to live with her brother, Göran. The year is 1975 and Göran lives in a commune called Together. Living in this leftist commune Elisabeth learns that the world can be viewed from different perspectives.',
    posterUrl: tmdbPoster('fIY5xko6dJOcn0hckudIhPXobve'),
    genres: ['Drama', 'Comedy', 'Romance'],
    directors: ['Lukas Moodysson'],
    writers: ['Lukas Moodysson'],
    cast: [
      'Lisa Lindgren',
      'Michael Nyqvist',
      'Emma Samuelsson',
      'Sam Kessel',
      'Gustaf Hammarsten',
      'Anja Lundqvist',
    ],
  },
  // https://www.themoviedb.org/movie/1414
  {
    title: 'Lovers of the Arctic Circle',
    releaseDate: '1998-09-04',
    runtimeMinutes: 112,
    synopsis:
      "As young children, Otto and Ana become best friends, leading to the marriage of Ana's mother to Otto's father. When Otto and Ana become teenagers, they begin a sexual relationship, which they hide from their parents. The two fall deeply in love and seem destined to spend the rest of their lives together. However, their relationship is tested when Otto's mother dies and the two are separated.",
    posterUrl: tmdbPoster('1hUFwXtUIJQdayIkaTR835QyaKT'),
    genres: ['Drama', 'Mystery', 'Romance'],
    directors: ['Julio Medem'],
    writers: ['Julio Medem'],
    cast: [
      'Najwa Nimri',
      'Fele Martínez',
      'Nancho Novo',
      'Maru Valdivielso',
      'Sara Valiente',
      'Peru Medem',
    ],
  },
  // https://www.themoviedb.org/movie/789
  {
    title: 'Closely Watched Trains',
    releaseDate: '1966-11-18',
    runtimeMinutes: 93,
    synopsis:
      'At a village railway station in occupied Czechoslovakia, a bumbling dispatcher’s apprentice longs to liberate himself from his virginity. Oblivious to the war and the resistance that surrounds him, this young man embarks on a journey of sexual awakening and self-discovery, encountering a universe of frustration, eroticism, and adventure within his sleepy backwater depot.',
    posterUrl: tmdbPoster('oKiOhsSRWO6fRqxtvda8WuCiXBm'),
    genres: ['Comedy', 'Drama', 'War'],
    directors: ['Jiří Menzel'],
    writers: ['Jiří Menzel', 'Bohumil Hrabal'],
    cast: [
      'Václav Neckář',
      'Jitka Scoffin',
      'Vladimír Valenta',
      'Libuše Havelková',
      'Josef Somr',
      'Alois Vachek',
    ],
  },
  // https://www.themoviedb.org/movie/1550
  {
    title: 'Pieces of April',
    releaseDate: '2003-10-17',
    runtimeMinutes: 81,
    synopsis:
      'Quirky and rebellious April Burns lives with her boyfriend in a low-rent New York City apartment miles away from her emotionally distant family. But when she discovers that her mother has a fatal form of breast cancer, she invites the clan to her place for Thanksgiving. While her father struggles to drive her family into the city, April -- an inexperienced cook -- runs into kitchen trouble and must ask a neighbor for help.',
    posterUrl: tmdbPoster('qm3jGZwz2UkwwEFEFzSot8T0pz1'),
    genres: ['Comedy', 'Drama'],
    directors: ['Peter Hedges'],
    writers: ['Peter Hedges'],
    cast: [
      'Katie Holmes',
      'Derek Luke',
      'Patricia Clarkson',
      'Oliver Platt',
      'Alison Pill',
      'John Gallagher Jr.',
    ],
  },
  // https://www.themoviedb.org/movie/1253
  {
    title: 'Breaking and Entering',
    releaseDate: '2006-12-15',
    runtimeMinutes: 129,
    synopsis:
      'Set in a blighted, inner-city neighbourhood of London, Breaking and Entering examines an affair which unfolds between a successful British landscape architect and Amira, a Bosnian woman – the mother of a troubled teen son – who was widowed by the war in Bosnia and Herzegovina.',
    posterUrl: tmdbPoster('4VZWsOQGbxfPuqMBcLaQLxNvLzR'),
    genres: ['Drama', 'Romance'],
    directors: ['Anthony Minghella'],
    writers: ['Anthony Minghella'],
    cast: [
      'Jude Law',
      'Juliette Binoche',
      'Vera Farmiga',
      'Robin Wright',
      'Martin Freeman',
      'Rafi Gavron',
    ],
  },
  // https://www.themoviedb.org/movie/1058
  {
    title: 'Breathless',
    releaseDate: '1983-05-13',
    runtimeMinutes: 100,
    synopsis:
      'Jesse, a small-time criminal, high-tails it to Los Angeles to rendezvous with a French exchange student. Stealing a car and accidentally killing a highway patrolman, he becomes the most wanted fugitive in L.A.',
    posterUrl: tmdbPoster('ipnsEbOsnQYO0HMrHTyqsO5osUV'),
    genres: ['Romance', 'Drama', 'Action'],
    directors: ['Jim McBride'],
    writers: ['Jim McBride', 'L.M. Kit Carson'],
    cast: [
      'Richard Gere',
      'Valérie Kaprisky',
      'Art Metrano',
      'John P. Ryan',
      'William Tepper',
      'Robert Dunn',
    ],
  },
  // https://www.themoviedb.org/movie/1546
  {
    title: 'Thumbsucker',
    releaseDate: '2005-09-16',
    runtimeMinutes: 96,
    synopsis:
      'Justin Cobb, a teenager in suburban Oregon, copes with his thumb-sucking problem, romance, and his diagnosis with ADHD and subsequent experience using Ritalin.',
    posterUrl: tmdbPoster('fBLjXNRkH0KuC5JEnGBUZx3SQw3'),
    genres: ['Comedy', 'Drama'],
    directors: ['Mike Mills'],
    writers: ['Mike Mills'],
    cast: [
      'Lou Taylor Pucci',
      'Tilda Swinton',
      "Vincent D'Onofrio",
      'Keanu Reeves',
      'Benjamin Bratt',
      'Kelli Garner',
    ],
  },
  // https://www.themoviedb.org/movie/1279
  {
    title: 'Samaritan Girl',
    releaseDate: '2004-03-05',
    runtimeMinutes: 96,
    synopsis:
      'Jae-Young is an amateur prostitute who sleeps with men while her best friend Yeo-Jin "manages" her, fixing dates, taking care of the money, and making sure the coast is clear. When Jae-Young falls in love with one of those men, she suppresses her feelings towards him in respect of her friend who\'s jealous.',
    posterUrl: tmdbPoster('w0cn9vwzkheuCT2a2MStdnadOyh'),
    genres: ['Drama'],
    directors: ['Kim Ki-duk'],
    writers: ['Kim Ki-duk'],
    cast: ['Han Yeo-reum', 'Kwak Ji-min', 'Lee Eol', 'Jung In-gi', 'Kwon Hyun-min', 'Oh Young'],
  },
  // https://www.themoviedb.org/movie/1563
  {
    title: 'Sans Soleil',
    releaseDate: '1983-03-02',
    runtimeMinutes: 100,
    synopsis:
      'A woman narrates the thoughts of a world traveler, meditations on time and memory expressed in words and images from places as far-flung as Japan, Guinea-Bissau, Iceland, and San Francisco.',
    posterUrl: tmdbPoster('2ZmVbnecEeGoZCimxMhpY0Nz7eh'),
    genres: ['Documentary'],
    directors: ['Chris Marker'],
    writers: ['Chris Marker'],
    cast: [
      'Florence Delay',
      'Amílcar Cabral',
      'Arielle Dombasle',
      'Bin Akao',
      'David Coverdale',
      'Chris Marker',
    ],
  },
  // https://www.themoviedb.org/movie/905
  {
    title: "Pandora's Box",
    releaseDate: '1929-01-30',
    runtimeMinutes: 141,
    synopsis:
      'The rise and inevitable fall of an amoral but naive young woman whose insouciant eroticism inspires lust and violence in those around her.',
    posterUrl: tmdbPoster('3B2A5g8t3HZltKp1fplNn2xW4us'),
    genres: ['Drama', 'Crime', 'Romance'],
    directors: ['G.W. Pabst'],
    writers: ['G.W. Pabst', 'Ladislaus Vajda', 'Joseph Fleisler'],
    cast: [
      'Louise Brooks',
      'Fritz Kortner',
      'Francis Lederer',
      'Carl Goetz',
      'Krafft-Raschig',
      'Alice Roberts',
    ],
  },
  // https://www.themoviedb.org/movie/1610
  {
    title: 'Fever Pitch',
    releaseDate: '1997-04-04',
    runtimeMinutes: 102,
    synopsis:
      "A romantic comedy about a man, a woman and a football team. Based on Nick Hornby's best selling autobiographical novel, Fever Pitch. English teacher Paul Ashworth believes his long standing obsession with Arsenal serves him well. But then he meets Sarah. Their relationship develops in tandem with Arsenal's roller coaster fortunes in the football league, both leading to a nail biting climax.",
    posterUrl: tmdbPoster('xTpZGWVo5DDk1oQUrUJcRjqGzGg'),
    genres: ['Comedy', 'Romance'],
    directors: ['David Evans'],
    writers: ['Nick Hornby'],
    cast: ['Colin Firth', 'Ruth Gemmell', 'Mark Strong', 'Holly Aird', 'Ken Stott', 'Stephen Rea'],
  },
  // https://www.themoviedb.org/movie/570
  {
    title: 'Fat Girl',
    releaseDate: '2001-03-07',
    runtimeMinutes: 86,
    synopsis:
      "Anaïs is twelve and bears the weight of the world on her shoulders. She watches her older sister, Elena, whom she both loves and hates. Elena is fifteen and devilishly beautiful. Neither more futile, nor more stupid than her younger sister, she cannot understand that she is merely an object of desire. And, as such, she can only be taken. Or had. Indeed, this is the subject: a girl's loss of virginity. And, that summer, it opens a door to tragedy.",
    posterUrl: tmdbPoster('afzbY1h7huuxlITigPfcyQSkqLs'),
    genres: ['Drama'],
    directors: ['Catherine Breillat'],
    writers: ['Catherine Breillat'],
    cast: [
      'Anaïs Reboux',
      'Roxane Mesquida',
      'Libero De Rienzo',
      'Arsinée Khanjian',
      'Romain Goupil',
      'Laura Betti',
    ],
  },
  // https://www.themoviedb.org/movie/939
  {
    title: 'The Jazz Singer',
    releaseDate: '1927-10-06',
    runtimeMinutes: 96,
    synopsis:
      'A young Jewish man is torn between tradition and individuality when his old-fashioned family objects to his career as a jazz singer. This is the first full length feature film to use synchronized sound, and is the original film musical.',
    posterUrl: tmdbPoster('wr8Pt1GO87cwB3210TO3JTNDsUc'),
    genres: ['Drama', 'Music'],
    directors: ['Alan Crosland'],
    writers: ['Alfred A. Cohn'],
    cast: [
      'Al Jolson',
      'May McAvoy',
      'Warner Oland',
      'Eugenie Besserer',
      'Otto Lederer',
      'Robert Gordon',
    ],
  },
  // https://www.themoviedb.org/movie/1376
  {
    title: 'Sweet Sixteen',
    releaseDate: '2002-09-07',
    runtimeMinutes: 106,
    synopsis:
      'Determined to have a normal family life once his mother gets out of prison, a Scottish teenager from a tough background sets out to raise the money for a home.',
    posterUrl: tmdbPoster('p5h50WEZQ4pRFffnSULqL4cEuLp'),
    genres: ['Crime', 'Drama'],
    directors: ['Ken Loach'],
    writers: ['Paul Laverty'],
    cast: [
      'Martin Compston',
      'Annmarie Fulton',
      'William Ruane',
      'Michelle Abercromby',
      'Michelle Coulter',
      'Gary McCormack',
    ],
  },
  // https://www.themoviedb.org/movie/541
  {
    title: 'The Man with the Golden Arm',
    releaseDate: '1955-12-26',
    runtimeMinutes: 119,
    synopsis:
      'When illegal card dealer and recovering heroin addict Frankie Machine gets out of prison, he decides to straighten up. Armed with nothing but an old drum set, Frankie tries to get honest work as a drummer. But when his former employer and his old drug dealer re-enter his life, Frankie finds it hard to stay clean and eventually finds himself succumbing to his old habits.',
    posterUrl: tmdbPoster('3TUOhZhM5GCYIbxwFO3chpZ0DHx'),
    genres: ['Drama', 'Crime'],
    directors: ['Otto Preminger'],
    writers: ['Lewis Meltzer', 'Walter Newman'],
    cast: [
      'Frank Sinatra',
      'Eleanor Parker',
      'Kim Novak',
      'Arnold Stang',
      'Darren McGavin',
      'Robert Strauss',
    ],
  },
  // https://www.themoviedb.org/movie/825
  {
    title: 'Playing by Heart',
    releaseDate: '1998-12-30',
    runtimeMinutes: 121,
    synopsis:
      "In a vibrant tapestry of love and longing, nine interconnected souls navigate romance and heartbreak in L.A., where passions collide and truths unfold, revealing that the heart's desires often lead us where we least expect.",
    posterUrl: tmdbPoster('3neHR1oPnC0OpcYhLn0TEdSHoEp'),
    genres: ['Comedy', 'Drama', 'Romance'],
    directors: ['Willard Carroll'],
    writers: ['Willard Carroll'],
    cast: [
      'Gillian Anderson',
      'Ellen Burstyn',
      'Sean Connery',
      'Anthony Edwards',
      'Angelina Jolie',
      'Jay Mohr',
    ],
  },
  // https://www.themoviedb.org/movie/1444
  {
    title: 'Junebug',
    releaseDate: '2005-08-03',
    runtimeMinutes: 106,
    synopsis:
      "On the way to meet with an independent artist in the South, newlywed art dealer Madeleine is convinced by her husband, George, that they should stop to meet his family in North Carolina. Madeleine's affluent lifestyle clashes with the family, but she befriends George's wide-eyed and pregnant sister-in-law, Ashley, who is nearing her due date. Through the family, Madeleine gains greater insight into George's character.",
    posterUrl: tmdbPoster('asC6UOPrR6OlNMiyXbeXWu08SOG'),
    genres: ['Comedy', 'Drama'],
    directors: ['Phil Morrison'],
    writers: ['Angus MacLachlan'],
    cast: [
      'Amy Adams',
      'Embeth Davidtz',
      'Ben McKenzie',
      'Alessandro Nivola',
      'Celia Weston',
      'Scott Wilson',
    ],
  },
  // https://www.themoviedb.org/movie/1392
  {
    title: "Born into Brothels: Calcutta's Red Light Kids",
    releaseDate: '2004-12-08',
    runtimeMinutes: 85,
    synopsis:
      'Documentary depicting the lives of child prostitutes in the red light district of Songachi, Calcutta. Director Zana Briski went to photograph the prostitutes when she met and became friends with their children. Briski began giving photography lessons to the children and became aware that their photography might be a way for them to lead better lives.',
    posterUrl: tmdbPoster('e7OWmWptBRCnUKj6MJ2qbxj5ZY5'),
    genres: ['Documentary'],
    directors: ['Ross Kauffman', 'Zana Briski'],
    writers: ['Ross Kauffman', 'Zana Briski'],
    cast: ['Zana Briski', 'Avijit', 'Geeta Masi', 'Kochi', 'Mamuni'],
  },
  // https://www.themoviedb.org/movie/127
  {
    title: 'Blind Chance',
    releaseDate: '1987-01-10',
    runtimeMinutes: 123,
    synopsis:
      "Witek runs after a train. Three variations follow on how such a seemingly banal incident could influence the rest of Witek's life.",
    posterUrl: tmdbPoster('gx84VmJllqvXF3JEqcEdsxBEcbF'),
    genres: ['Drama'],
    directors: ['Krzysztof Kieślowski'],
    writers: ['Krzysztof Kieślowski'],
    cast: [
      'Bogusław Linda',
      'Tadeusz Łomnicki',
      'Zbigniew Zapasiewicz',
      'Bogusława Pawelec',
      'Marzena Trybała',
      'Jacek Borkowski',
    ],
  },
  // https://www.themoviedb.org/movie/899
  {
    title: 'Broken Blossoms or The Yellow Man and the Girl',
    releaseDate: '1919-05-13',
    runtimeMinutes: 89,
    synopsis:
      'The love story of an abused English girl and a Chinese Buddhist in a time when London was a brutal and harsh place to live.',
    posterUrl: tmdbPoster('njwFIUL76zaRmPemnrZVmmTSCjz'),
    genres: ['Drama', 'Romance'],
    directors: ['D.W. Griffith'],
    writers: ['D.W. Griffith'],
    cast: [
      'Lillian Gish',
      'Richard Barthelmess',
      'Donald Crisp',
      'Arthur Howard',
      'Edward Peil Sr.',
      'George Beranger',
    ],
  },
  // https://www.themoviedb.org/movie/1413
  {
    title: 'M. Butterfly',
    releaseDate: '1993-10-01',
    runtimeMinutes: 101,
    synopsis:
      'In 1960s China, French diplomat Rene Gallimard falls in love with opera singer Song Liling – but Song is not at all who Gallimard thinks.',
    posterUrl: tmdbPoster('vfutnJ9sgpAtNuPemksd26gd5dC'),
    genres: ['Romance', 'Drama', 'History'],
    directors: ['David Cronenberg'],
    writers: ['David Henry Hwang'],
    cast: [
      'Jeremy Irons',
      'John Lone',
      'Barbara Sukowa',
      'Annabel Leventon',
      'Shizuko Hoshi',
      'Ian Richardson',
    ],
  },
  // https://www.themoviedb.org/movie/986
  {
    title: 'Chimes at Midnight',
    releaseDate: '1965-12-22',
    runtimeMinutes: 115,
    synopsis:
      "Henry IV usurps the English throne, sets in motion the factious War of the Roses and now faces a rebellion led by Northumberland scion Hotspur. Henry's heir, Prince Hal, is a ne'er-do-well carouser who drinks and causes mischief with his low-class friends, especially his rotund father figure, John Falstaff. To redeem his title, Hal may have to choose between allegiance to his real father and loyalty to his friend.",
    posterUrl: tmdbPoster('5Fjxyz3u2Zdco4WeuC3wQ6O5tYQ'),
    genres: ['Comedy', 'Drama', 'History', 'War'],
    directors: ['Orson Welles'],
    writers: ['Orson Welles'],
    cast: [
      'Orson Welles',
      'Keith Baxter',
      'John Gielgud',
      'Jeanne Moreau',
      'Margaret Rutherford',
      'Marina Vlady',
    ],
  },
  // https://www.themoviedb.org/movie/1556
  {
    title: 'Funeral Parade of Roses',
    releaseDate: '1969-09-13',
    runtimeMinutes: 105,
    synopsis:
      'In 1960s Tokyo, Gonda owns a bar in which the gay, cross-dresser, and trans scenes meet. Gonda is in a relationship with the madam of the bar, Leda. As the younger Eddie starts a passionate affair with Gonda, she ignites the jealousy of Leda, unaware of another kind of history between them.',
    posterUrl: tmdbPoster('7cRQ6rSGajW2soWDr3voEN2rgYO'),
    genres: ['Drama'],
    directors: ['Toshio Matsumoto'],
    writers: ['Toshio Matsumoto'],
    cast: [
      'Shinnosuke Ikehata',
      'Yoshio Tsuchiya',
      'Emiko Azuma',
      'Osamu Ogasawara',
      'Yoshimi Jô',
      'Koichi Nakamura',
    ],
  },
  // https://www.themoviedb.org/movie/1629
  {
    title: 'La Chinoise',
    releaseDate: '1967-08-30',
    runtimeMinutes: 96,
    synopsis:
      'A small group of French students are studying Mao, trying to find out their position in the world and how to change the world to a Maoistic community using terrorism.',
    posterUrl: tmdbPoster('hfGzYErvwi8hB38kCsSNy6OjdPv'),
    genres: ['Drama', 'Comedy'],
    directors: ['Jean-Luc Godard'],
    writers: ['Jean-Luc Godard'],
    cast: [
      'Anne Wiazemsky',
      'Jean-Pierre Léaud',
      'Juliet Berto',
      'Michel Semeniako',
      'Lex De Bruijn',
      'Omar Diop',
    ],
  },
  // https://www.themoviedb.org/movie/750
  {
    title: 'Murder She Said',
    releaseDate: '1961-09-26',
    runtimeMinutes: 87,
    synopsis:
      "Miss Marple believes she's seen a murder in a passing-by train, yet when the police find no evidence she decides to investigate it on her own.",
    posterUrl: tmdbPoster('tqnUJyeirufO0q29PoSPaCpB27E'),
    genres: ['Comedy', 'Crime', 'Drama', 'Mystery'],
    directors: ['George Pollock'],
    writers: ['David Pursall', 'Jack Seddon', 'David D. Osborn'],
    cast: [
      'Margaret Rutherford',
      'Arthur Kennedy',
      'Muriel Pavlow',
      'James Robertson Justice',
      'Thorley Walters',
      'Charles Tingwell',
    ],
  },
  // https://www.themoviedb.org/movie/875
  {
    title: 'Shanghai Express',
    releaseDate: '1932-02-12',
    runtimeMinutes: 82,
    synopsis:
      'A beautiful temptress re-kindles an old romance while trying to escape her past during a tension-packed train journey.',
    posterUrl: tmdbPoster('z0ea6xM3HhIZi7zApDVsxewv9R8'),
    genres: ['Drama', 'Romance', 'War'],
    directors: ['Josef von Sternberg'],
    writers: ['Jules Furthman'],
    cast: [
      'Marlene Dietrich',
      'Clive Brook',
      'Anna May Wong',
      'Warner Oland',
      'Eugene Pallette',
      'Lawrence Grant',
    ],
  },
  // https://www.themoviedb.org/movie/831
  {
    title: 'This Island Earth',
    releaseDate: '1955-06-10',
    runtimeMinutes: 85,
    synopsis:
      'Aliens have landed and are hiding on Earth, but need Earth’s scientists to help them fight an inter-planetary war.',
    posterUrl: tmdbPoster('2viRDpHmhzQoreZok2auLjkVbSE'),
    genres: ['Science Fiction', 'Adventure', 'Horror'],
    directors: ['Jack Arnold', 'Joseph M. Newman'],
    writers: ['George Callahan', 'Franklin Coen'],
    cast: [
      'Rex Reason',
      'Faith Domergue',
      'Jeff Morrow',
      'Lance Fuller',
      'Robert Nichols',
      'Russell Johnson',
    ],
  },
  // https://www.themoviedb.org/movie/572
  {
    title: 'Next Door',
    releaseDate: '2005-03-11',
    runtimeMinutes: 75,
    synopsis:
      'After Ingrid leaves John, he allows himself to be pulled into a mystical and scary world where it is impossible to separate truth from lies.',
    posterUrl: tmdbPoster('xqS5Y8f6EQy9i9YFuPuTlPRopV4'),
    genres: ['Mystery', 'Thriller', 'Horror'],
    directors: ['Pål Sletaune'],
    writers: ['Pål Sletaune'],
    cast: [
      'Kristoffer Joner',
      'Cecilie A. Mosli',
      'Julia Schacht',
      'Anna Bache-Wiig',
      'Michael Nyqvist',
      'Øystein Martinsen',
    ],
  },
  // https://www.themoviedb.org/movie/1583
  {
    title: 'Lammbock',
    releaseDate: '2001-08-23',
    runtimeMinutes: 93,
    synopsis:
      'Stefan and Kai run a thriving business: a home-grown cannabis trade disguised as a pizza delivery service. For now they just have to fight aphids.',
    posterUrl: tmdbPoster('z1AeFrBKkdZBUi4YvP7TsaQ7zoe'),
    genres: ['Comedy'],
    directors: ['Christian Zübert'],
    writers: ['Christian Zübert', 'Shalini Sonntag'],
    cast: [
      'Lucas Gregorowicz',
      'Moritz Bleibtreu',
      'Marie Zielcke',
      'Julian Weigend',
      'Alexandra Schalaudek',
      'Elmar Wepper',
    ],
  },
  // https://www.themoviedb.org/movie/148
  {
    title: 'The Secret Life of Words',
    releaseDate: '2005-12-15',
    runtimeMinutes: 115,
    synopsis:
      'A solitary nurse bonds with a badly burned patient who survived an accident on an oil rig.',
    posterUrl: tmdbPoster('mgffUjCN2jvebZBqvyP0lvAoAhB'),
    genres: ['Romance', 'Drama'],
    directors: ['Isabel Coixet'],
    writers: ['Isabel Coixet'],
    cast: [
      'Sarah Polley',
      'Tim Robbins',
      'Javier Cámara',
      'Danny Cunningham',
      'Dean Lennox Kelly',
      'Daniel Mays',
    ],
  },
  // https://www.themoviedb.org/movie/233
  {
    title: 'The Wanderers',
    releaseDate: '1979-07-13',
    runtimeMinutes: 117,
    synopsis:
      "The streets of the Bronx are owned by '60s youth gangs where the joy and pain of adolescence is lived. Philip Kaufman tells his take on the novel by Richard Price about the history of the Italian-American gang ‘The Wanderers.’",
    posterUrl: tmdbPoster('p8vxJHlCbmmnUX3p8bEAzXZfcIT'),
    genres: ['Drama'],
    directors: ['Philip Kaufman'],
    writers: ['Philip Kaufman', 'Rose Kaufman'],
    cast: [
      'Ken Wahl',
      'John Friedrich',
      'Karen Allen',
      'Toni Kalem',
      'Alan Rosenberg',
      'Jim Youngs',
    ],
  },
  // https://www.themoviedb.org/movie/1557
  {
    title: '23',
    releaseDate: '1998-07-02',
    runtimeMinutes: 99,
    synopsis:
      "The movie's plot is based on the true story of a group of young computer hackers from Hannover, Germany. In the late 1980s the orphaned Karl Koch invests his heritage in a flat and a home computer. At first he dials up to bulletin boards to discuss conspiracy theories inspired by his favorite novel, R.A. Wilson's \"Illuminatus\", but soon he and his friend David start breaking into government and military computers. Pepe, one of Karl's rather criminal acquaintances senses that there is money in computer cracking - he travels to east Berlin and tries to contact the KGB.",
    posterUrl: tmdbPoster('rkIxy5BCPUV0EzXalywT5m6mOIn'),
    genres: ['Drama', 'Thriller'],
    directors: ['Hans-Christian Schmid'],
    writers: ['Hans-Christian Schmid', 'Michael Gutmann'],
    cast: [
      'August Diehl',
      'Fabian Busch',
      'Dieter Landuris',
      'Jan-Gregor Kremp',
      'Burghart Klaußner',
      'Stephan Kampwirth',
    ],
  },
  // https://www.themoviedb.org/movie/697
  {
    title: 'October (Ten Days that Shook the World)',
    releaseDate: '1928-05-11',
    runtimeMinutes: 115,
    synopsis:
      "Sergei M. Eisenstein's docu-drama about the 1917 October Revolution in Russia. Made ten years after the events and edited in Eisenstein's 'Soviet Montage' style, it re-enacts in celebratory terms several key scenes from the revolution.",
    posterUrl: tmdbPoster('2sNZPybGgux2keFKxZuKuedrS3d'),
    genres: ['Drama', 'History'],
    directors: ['Grigori Aleksandrov', 'Sergei Eisenstein'],
    writers: ['Grigori Aleksandrov', 'Sergei Eisenstein'],
    cast: [
      'Vladimir Popov',
      'Vasili Nikandrov',
      'Layaschenko',
      'Boris Livanov',
      'Mikholyev',
      'Chibisov',
    ],
  },
  // https://www.themoviedb.org/movie/480
  {
    title: 'Monsoon Wedding',
    releaseDate: '2001-08-30',
    runtimeMinutes: 114,
    synopsis:
      'A stressed father, a bride-to-be with a secret, a smitten event planner, and relatives from around the world create much ado about the preparations for an arranged marriage in India.',
    posterUrl: tmdbPoster('vCwkv7tYFem0tQ9Duoq2MX7T7Zd'),
    genres: ['Comedy', 'Drama', 'Romance'],
    directors: ['Mira Nair'],
    writers: ['Sabrina Dhawan'],
    cast: [
      'Naseeruddin Shah',
      'Lillete Dubey',
      'Shefali Shah',
      'Vasundhara Das',
      'Parvin Dabas',
      'Vijay Raaz',
    ],
  },
  // https://www.themoviedb.org/movie/1361
  {
    title: 'The Return of the King',
    releaseDate: '1980-05-11',
    runtimeMinutes: 98,
    synopsis:
      "Two Hobbits struggle to destroy the Ring in Mount Doom while their friends desperately fight evil Lord Sauron's forces in a final battle.",
    posterUrl: tmdbPoster('lTwUT4NsSyUQlHV20Mx3C96JHq4'),
    genres: ['Animation', 'Fantasy', 'Adventure'],
    directors: ['Arthur Rankin', 'Jr.', 'Jules Bass'],
    writers: ['Romeo Muller'],
    cast: [
      'Orson Bean',
      'Roddy McDowall',
      'John Huston',
      'Theodore Gottlieb',
      'Casey Kasem',
      'Sonny Melendrez',
    ],
  },
  // https://www.themoviedb.org/movie/753
  {
    title: 'Faces',
    releaseDate: '1968-11-24',
    runtimeMinutes: 130,
    synopsis:
      "Middle-aged suburban husband Richard abruptly tells his wife, Maria, that he wants a divorce. As Richard takes up with a younger woman, Maria enjoys a night on the town with her friends and meets a younger man. As the couple and those around them confront a seemingly futile search for what they've lost -- love, excitement, passion -- this classic American independent film explores themes of aging and alienation.",
    posterUrl: tmdbPoster('qTkhxFQ0o6DEtTtPXkv4IA5M90J'),
    genres: ['Drama'],
    directors: ['John Cassavetes'],
    writers: ['John Cassavetes'],
    cast: [
      'John Marley',
      'Gena Rowlands',
      'Lynn Carlin',
      'Fred Draper',
      'Seymour Cassel',
      'Val Avery',
    ],
  },
  // https://www.themoviedb.org/movie/1284
  {
    title: 'Torrente 2: Mission in Marbella',
    releaseDate: '2001-03-30',
    runtimeMinutes: 99,
    synopsis:
      'For this second film in the cult comedy series Torrente takes our fat police officer from Madrid to Marbella in Spain to investigate a villain’s plot to destroy the city with a missile. This James Bond style slapstick comedy became the most successful box-office film in Spanish film history beating out only the first Torrente film.',
    posterUrl: tmdbPoster('9qu0svJv5dgclrHh0GFQMLyC04R'),
    genres: ['Action', 'Comedy', 'Crime'],
    directors: ['Santiago Segura'],
    writers: ['Santiago Segura'],
    cast: [
      'Santiago Segura',
      'Gabino Diego',
      'Tony Leblanc',
      'José Luis Moreno',
      'Inés Sastre',
      'Arturo Valls',
    ],
  },
  // https://www.themoviedb.org/movie/1418
  {
    title: 'Take My Eyes',
    releaseDate: '2003-10-08',
    runtimeMinutes: 103,
    synopsis:
      'One winter night, Pilar runs away from home. With her, she takes only a few belongings and her son, Juan. Antonio soon sets out to look for her. He says Pilar is his sunshine, and what\'s more, "She gave him her eyes"...',
    posterUrl: tmdbPoster('2U9z48ULc5eQSlkERAaLjTZ276m'),
    genres: ['Romance', 'Drama'],
    directors: ['Icíar Bollaín'],
    writers: ['Icíar Bollaín', 'Alicia Luna'],
    cast: [
      'Laia Marull',
      'Luis Tosar',
      'Candela Peña',
      'Rosa María Sardà',
      'Kiti Mánver',
      'Elisabet Gelabert',
    ],
  },
  // https://www.themoviedb.org/movie/259
  {
    title: 'Love on the Run',
    releaseDate: '1979-01-24',
    runtimeMinutes: 93,
    synopsis:
      'Now in his thirties, Antoine Doinel is a divorced proofreader in love with a record seller. Colette Tazzi, now a lawyer, buys his first published autobiography, leading them to a chance meeting.',
    posterUrl: tmdbPoster('shUrax1ZJXYyclxUaktsTBUHMa9'),
    genres: ['Romance', 'Drama', 'Comedy'],
    directors: ['François Truffaut'],
    writers: ['François Truffaut', 'Jean Aurel', 'Marie-France Pisier', 'Suzanne Schiffman'],
    cast: [
      'Jean-Pierre Léaud',
      'Marie-France Pisier',
      'Claude Jade',
      'Dani',
      'Dorothée',
      'Daniel Mesguich',
    ],
  },
  // https://www.themoviedb.org/movie/1421
  {
    title: 'The Man Who Loved Women',
    releaseDate: '1977-04-27',
    runtimeMinutes: 119,
    synopsis:
      "At Bertrand Morane's burial there are many of the women that the 40-year-old engineer loved. In flashback Bertrand's life and love affairs are told by himself while writing an autobiographical novel.",
    posterUrl: tmdbPoster('qAbqXoN6ucpN8jvHOxZOzwyP8pE'),
    genres: ['Drama', 'Comedy', 'Romance'],
    directors: ['François Truffaut'],
    writers: ['François Truffaut', 'Michel Fermaud', 'Suzanne Schiffman'],
    cast: [
      'Charles Denner',
      'Leslie Caron',
      'Nelly Borgeaud',
      'Valérie Bonnier',
      'Sabine Glaser',
      'Brigitte Fossey',
    ],
  },
  // https://www.themoviedb.org/movie/784
  {
    title: 'Kolya',
    releaseDate: '1996-05-15',
    runtimeMinutes: 105,
    synopsis:
      'After a fictitious marriage with a Russian emigrant, Cellisten Louka, a Czech man, must suddenly take responsibility for her son. However, it’s not long before the communication barrier is broken between the two new family members.',
    posterUrl: tmdbPoster('fB0cGiEOngfsfyDHXIpFOmEwFgi'),
    genres: ['Drama', 'Comedy'],
    directors: ['Jan Svěrák'],
    writers: ['Zdeněk Svěrák'],
    cast: [
      'Zdeněk Svěrák',
      'Andrei Khalimon',
      'Libuše Šafránková',
      'Ondřej Vetchý',
      'Stella Zázvorková',
      'Ladislav Smoljak',
    ],
  },
  // https://www.themoviedb.org/movie/1496
  {
    title: 'Cool as Ice',
    releaseDate: '1991-10-18',
    runtimeMinutes: 91,
    synopsis:
      "Freewheeling, motorcycle-riding musician Johnny rolls into a small town with his band, and meets Kathy, an honor student who catches his eye. Meanwhile, Kathy's father, after being in the Witness Protection Program, is finally tracked down by two corrupt cops he escaped from years ago, who want the money he owes them.",
    posterUrl: tmdbPoster('fO0YbAJiMPFMquixdZgbC98I3MP'),
    genres: ['Romance', 'Music', 'Comedy'],
    directors: ['David Kellogg'],
    writers: ['David Stenn'],
    cast: [
      'Vanilla Ice',
      'Kristin Minter',
      'Naomi Campbell',
      'Deezer D',
      'Kevin Hicks',
      'Allison Dean',
    ],
  },
  // https://www.themoviedb.org/movie/1405
  {
    title: 'Greed',
    releaseDate: '1924-12-04',
    runtimeMinutes: 140,
    synopsis:
      'When housewife Trina wins the lottery, her comfortable life with her dentist husband John slowly deteriorates, in part by her own increasing paranoia and partly by the machinations of villainous acquaintance Marcus.',
    posterUrl: tmdbPoster('eur2vc2BGiOocBuBLVPXySO7lRh'),
    genres: ['Drama', 'Crime'],
    directors: ['Erich von Stroheim'],
    writers: ['Erich von Stroheim', 'June Mathis'],
    cast: [
      'Gibson Gowland',
      'Zasu Pitts',
      'Jean Hersholt',
      'Dale Fuller',
      'Tempe Pigott',
      'Sylvia Ashton',
    ],
  },
  // https://www.themoviedb.org/movie/1831
  {
    title: 'The Next Best Thing',
    releaseDate: '2000-03-03',
    runtimeMinutes: 108,
    synopsis:
      "A comedy-drama about best friends - one a straight woman, Abbie, the other a gay man, Robert - who decide to have a child together. Five years later, Abbie falls in love with a straight man and wants to move away with her and Robert's little boy Sam, and a nasty custody battle ensues.",
    posterUrl: tmdbPoster('iYK1ZUtY4etcn91glUmrGuZRH6M'),
    genres: ['Comedy', 'Drama', 'Romance'],
    directors: ['John Schlesinger'],
    writers: ['Tom Ropelewski'],
    cast: [
      'Madonna',
      'Rupert Everett',
      'Benjamin Bratt',
      'Malcolm Stumpf',
      'Josef Sommer',
      'Suzanne Krull',
    ],
  },
  // https://www.themoviedb.org/movie/1609
  {
    title: "There's Only One Jimmy Grimble",
    releaseDate: '2000-08-25',
    runtimeMinutes: 106,
    synopsis:
      "Jimmy Grimble is a shy Manchester school boy. At school he is constantly being bullied by the other kids, and at home he has to face his mother's new boyfriend. However, through football, and some special boots, he manages to gain the confidence to succeed and leads his school football team towards the final of the local schools cup.",
    posterUrl: tmdbPoster('9v4RxdSMUkhkH9cceSVU4jH4BfV'),
    genres: ['Comedy'],
    directors: ['John Hay'],
    writers: ['John Hay', 'Rik Carmichael', 'Simon Mayle'],
    cast: [
      'Lewis McKenzie',
      'Jane Lapotaire',
      'Gina McKee',
      'Robert Carlyle',
      'Ben Miller',
      'Wayne Galtrey',
    ],
  },
  // https://www.themoviedb.org/movie/1377
  {
    title: 'Houseboat',
    releaseDate: '1958-11-19',
    runtimeMinutes: 110,
    synopsis:
      'An Italian socialite on the run signs on as housekeeper for a widower with three children.',
    posterUrl: tmdbPoster('nfaOBiZktPHOV0f3DTqTftgTo3B'),
    genres: ['Comedy', 'Romance'],
    directors: ['Melville Shavelson'],
    writers: ['Melville Shavelson', 'Betsy Drake', 'Jack Rose'],
    cast: [
      'Cary Grant',
      'Sophia Loren',
      'Martha Hyer',
      'Harry Guardino',
      'Eduardo Ciannelli',
      'Murray Hamilton',
    ],
  },
  // https://www.themoviedb.org/movie/1415
  {
    title: 'Party Monster',
    releaseDate: '2003-09-05',
    runtimeMinutes: 98,
    synopsis:
      'The New York club scene of the 80s and 90s was a world like no other. Into this candy-colored, mirror ball playground stepped Michael Alig, a wannabe from nowhere special. Under the watchful eye of veteran club kid James St. James, Alig quickly rose to the top... and there was no place to go but down.',
    posterUrl: tmdbPoster('4DVWGtV1OA3W8kZxiimdNsepS6O'),
    genres: ['Comedy', 'Drama', 'Crime', 'Thriller'],
    directors: ['Fenton Bailey', 'Randy Barbato'],
    writers: ['Fenton Bailey', 'Randy Barbato'],
    cast: [
      'Macaulay Culkin',
      'Seth Green',
      'Chloë Sevigny',
      'Natasha Lyonne',
      'Wilmer Valderrama',
      'Wilson Cruz',
    ],
  },
  // https://www.themoviedb.org/movie/1566
  {
    title: 'The Bridge',
    releaseDate: '1959-10-21',
    runtimeMinutes: 103,
    synopsis:
      'A group of German boys are ordered to protect a small bridge in their home village during the waning months of the second world war. Truckloads of defeated, cynical Wehrmacht soldiers flee the approaching American troops, but the boys, full of enthusiasm for the "blood and honor" Nazi ideology, stay to defend the useless bridge. The film is based on a West German anti-war novel of the same name, written by Gregor Dorfmeister.',
    posterUrl: tmdbPoster('jCg5NqSdUFB1S6iJu3jyXwHOE8d'),
    genres: ['Drama', 'History', 'War'],
    directors: ['Bernhard Wicki'],
    writers: ['Bernhard Wicki', 'Karl-Wilhelm Vivier', 'Michael Mansfeld'],
    cast: [
      'Folker Bohnet',
      'Fritz Wepper',
      'Michael Hinz',
      'Frank Glaubrecht',
      'Karl Michael Balzer',
      'Volker Lechtenbrink',
    ],
  },
  // https://www.themoviedb.org/movie/237
  {
    title: 'Young Adam',
    releaseDate: '2003-09-26',
    runtimeMinutes: 93,
    synopsis:
      "A young drifter working on a river barge disrupts his employers' lives while hiding the fact that he knows more about a dead woman found in the river than he admits.",
    posterUrl: tmdbPoster('rU5GJ5r4tQbSx9C2ENKbPkD6nr9'),
    genres: ['Drama', 'Thriller', 'Crime', 'Romance'],
    directors: ['David Mackenzie'],
    writers: ['David Mackenzie'],
    cast: [
      'Ewan McGregor',
      'Tilda Swinton',
      'Peter Mullan',
      'Emily Mortimer',
      'Jack McElhone',
      'Thérèse Bradley',
    ],
  },
  // https://www.themoviedb.org/movie/1285
  {
    title: 'Torrente 3: The Protector',
    releaseDate: '2005-09-30',
    runtimeMinutes: 91,
    synopsis:
      "A popular and beautiful politician plans to expose the evil-doings of a multinational corporation. Hoping to silence her, the corporation's top executives decide to hire the most incompetent detective they can find to act as her bodyguard.",
    posterUrl: tmdbPoster('l1RzG6SGfcAIftgCjaNNSfP7wEC'),
    genres: ['Comedy', 'Crime'],
    directors: ['Santiago Segura'],
    writers: ['Santiago Segura'],
    cast: [
      'Santiago Segura',
      'José Mota',
      'Javier Gutiérrez',
      'Carlos Latre',
      'Tony Leblanc',
      'Eduardo García',
    ],
  },
  // https://www.themoviedb.org/movie/313
  {
    title: 'Snow Cake',
    releaseDate: '2006-09-08',
    runtimeMinutes: 112,
    synopsis:
      'A drama focused on the friendship between a high-functioning autistic woman and a man who is traumatized after a fatal car accident.',
    posterUrl: tmdbPoster('dzKNKUqaDu9JCUmjhuoDd8KQBBs'),
    genres: ['Romance', 'Drama'],
    directors: ['Marc Evans'],
    writers: ['Angela Pell'],
    cast: [
      'Alan Rickman',
      'Sigourney Weaver',
      'Carrie-Anne Moss',
      'Emily Hampshire',
      'James Allodi',
      'Janet van de Graaf',
    ],
  },
  // https://www.themoviedb.org/movie/464
  {
    title: 'As It Is in Heaven',
    releaseDate: '2004-09-03',
    runtimeMinutes: 132,
    synopsis:
      'A musical romantic tragedy about a famous composer who moves back to his small hometown after having had heart troubles. His search for a simple everyday life leads him into teaching the local church choir, which is not easily accepted by the town yet the choir builds a great love for their teacher.',
    posterUrl: tmdbPoster('ygJ6RQQSmXRQLPpUKP9SCdKXSKJ'),
    genres: ['Romance', 'Drama', 'Comedy', 'Music'],
    directors: ['Kay Pollak'],
    writers: ['Kay Pollak', 'Carin Pollak', 'Margaretha Pollak', 'Ola Olsson', 'Anders Nyberg'],
    cast: [
      'Michael Nyqvist',
      'Frida Hallgren',
      'Helen Sjöholm',
      'Lennart Jähkel',
      'Ingela Olsson',
      'Verena Buratti',
    ],
  },
  // https://www.themoviedb.org/movie/248
  {
    title: 'Pocketful of Miracles',
    releaseDate: '1961-12-18',
    runtimeMinutes: 136,
    synopsis:
      'A New York gangster and his girlfriend attempt to turn street beggar Apple Annie into a society lady when the peddler learns her daughter is marrying royalty.',
    posterUrl: tmdbPoster('xjXwcGJjT5tE22wazQUYH32HwU8'),
    genres: ['Comedy', 'Drama'],
    directors: ['Frank Capra'],
    writers: ['Harry Tugend', 'Hal Kanter'],
    cast: [
      'Glenn Ford',
      'Bette Davis',
      'Hope Lange',
      "Arthur O'Connell",
      'Peter Falk',
      'Thomas Mitchell',
    ],
  },
  // https://www.themoviedb.org/movie/751
  {
    title: 'Murder at the Gallop',
    releaseDate: '1963-05-09',
    runtimeMinutes: 81,
    synopsis:
      "Miss Marple and Mr. Stringer are witnesses to the death by heart attack of elderly, rich Mr. Enderby. Yet they have their doubts about what happened. The police don't believe them, thus leading Miss Marple to yet again investigate by herself.",
    posterUrl: tmdbPoster('lCLJ6yutSJc8PkiazcEh8dB6Juh'),
    genres: ['Comedy', 'Crime', 'Drama', 'Mystery', 'Thriller'],
    directors: ['George Pollock'],
    writers: ['James P. Cavanagh'],
    cast: [
      'Margaret Rutherford',
      'Stringer Davis',
      'Robert Morley',
      'Flora Robson',
      'Charles Tingwell',
      'Gordon Harris',
    ],
  },
  // https://www.themoviedb.org/movie/1590
  {
    title: 'Copying Beethoven',
    releaseDate: '2006-09-10',
    runtimeMinutes: 104,
    synopsis:
      "A fictionalised exploration of Beethoven's life in his final days working on his Ninth Symphony. It is 1824. Beethoven is racing to finish his new symphony. However, it has been years since his last success and he is plagued by deafness, loneliness and personal trauma. A copyist is urgently needed to help the composer. A fictional character is introduced in the form of a young conservatory student and aspiring composer named Anna Holtz. The mercurial Beethoven is skeptical that a woman might become involved in his masterpiece but slowly comes to trust in Anna's assistance and in the end becomes quite fond of her. By the time the piece is performed, her presence in his life is an absolute necessity. Her deep understanding of his work is such that she even corrects mistakes he has made, while her passionate personality opens a door into his private world.",
    posterUrl: tmdbPoster('xplAbPXhZF9B3H4OnhjQsEKUESe'),
    genres: ['Drama'],
    directors: ['Agnieszka Holland'],
    writers: ['Stephen J. Rivele', 'Christopher Wilkinson'],
    cast: [
      'Ed Harris',
      'Diane Kruger',
      'Matthew Goode',
      'Phyllida Law',
      'Ralph Riach',
      'Bill Stewart',
    ],
  },
  // https://www.themoviedb.org/movie/1591
  {
    title: 'Nowhere in Africa',
    releaseDate: '2001-12-11',
    runtimeMinutes: 140,
    synopsis:
      "A Jewish woman named Jettel Redlich flees Nazi Germany with her daughter Regina, to join her husband, Walter, on a farm in Kenya. At first, Jettel refuses to adjust to her new circumstances, bringing with her a set of china dishes and an evening gown. While Regina adapts readily to this new world, forming a strong bond with her father's cook, an African named Owuor.",
    posterUrl: tmdbPoster('2ED1GaTKhHielGYa1giBsxfoacp'),
    genres: ['Drama'],
    directors: ['Caroline Link'],
    writers: ['Caroline Link', 'Susanne Liebetrau'],
    cast: [
      'Juliane Köhler',
      'Merab Ninidze',
      'Sidede Onyulo',
      'Matthias Habich',
      'Lea Kurka',
      'Karoline Eckertz',
    ],
  },
  // https://www.themoviedb.org/movie/977
  {
    title: 'Tabu: A Story of the South Seas',
    releaseDate: '1931-07-30',
    runtimeMinutes: 86,
    synopsis:
      "On the South Pacific island of Bora Bora, a young couple's love is threatened when the tribal chief declares the girl a sacred virgin.",
    posterUrl: tmdbPoster('c4zfawkB8Jsp5lhWl62QCzczR3M'),
    genres: ['Romance', 'Drama', 'Adventure'],
    directors: ['F. W. Murnau'],
    writers: ['F. W. Murnau', 'Robert Flaherty', 'Edgar G. Ulmer'],
    cast: ['Matahi', 'Anne Chevalier', 'Bill Bambridge', 'Hitu', 'Jules'],
  },
  // https://www.themoviedb.org/movie/633
  {
    title: 'Soldier of Orange',
    releaseDate: '1977-09-22',
    runtimeMinutes: 148,
    synopsis:
      'The lives of Erik Lanshof and five of his closest friends take different paths when the German army invades the Netherlands in 1940: fight and resistance, fear and resignation, collaboration and high treason.',
    posterUrl: tmdbPoster('kdlk0cz97i8Fyb1ZFpp9tokHxGD'),
    genres: ['Drama', 'Thriller', 'War'],
    directors: ['Paul Verhoeven'],
    writers: ['Paul Verhoeven', 'Gerard Soeteman', 'Kees Holierhoek'],
    cast: [
      'Rutger Hauer',
      'Jeroen Krabbé',
      'Lex van Delden',
      'Derek de Lint',
      'Huib Rooymans',
      'Dolf de Vries',
    ],
  },
  // https://www.themoviedb.org/movie/135
  {
    title: "Bob Dylan – Don't Look Back",
    releaseDate: '1967-05-17',
    runtimeMinutes: 96,
    synopsis:
      'In this wildly entertaining vision of one of the twentieth century’s greatest artists, Bob Dylan is surrounded by teen fans, gets into heated philosophical jousts with journalists, and kicks back with fellow musicians Joan Baez, Donovan, and Alan Price.',
    posterUrl: tmdbPoster('2kd5XfH2MhFlChq7DkjxWBLoYPF'),
    genres: ['Documentary', 'Music'],
    directors: ['D. A. Pennebaker'],
    writers: ['D. A. Pennebaker'],
    cast: ['Bob Dylan', 'Albert Grossman', 'Bob Neuwirth', 'Joan Baez', 'Alan Price', 'Tito Burns'],
  },
  // https://www.themoviedb.org/movie/757
  {
    title: 'Murder Most Foul',
    releaseDate: '1964-03-01',
    runtimeMinutes: 90,
    synopsis:
      'A murderer is brought to court and only Miss Marple is unconvinced of his innocence. Once again she begins her own investigation.',
    posterUrl: tmdbPoster('qTCKB5rxYzgdWUUH4UMgpRVH3GJ'),
    genres: ['Comedy', 'Crime', 'Drama', 'Mystery', 'Thriller'],
    directors: ['George Pollock'],
    writers: ['Jack Seddon', 'David Pursall'],
    cast: [
      'Margaret Rutherford',
      'Ron Moody',
      'Charles Tingwell',
      'Andrew Cruickshank',
      'Megs Jenkins',
      'Ralph Michael',
    ],
  },
  // https://www.themoviedb.org/movie/337
  {
    title: 'Monsieur Ibrahim',
    releaseDate: '2003-09-17',
    runtimeMinutes: 91,
    synopsis:
      'Paris, 1960s. Momo, a resolute and independent Jewish teenager who lives with his father, a sullen and depressed man, in a working-class neighborhood, develops a close friendship with Monsieur Ibrahim, an elderly Muslim who owns a small grocery store.',
    posterUrl: tmdbPoster('lS4hx9X5v6cpoCzzQohZs7zD881'),
    genres: ['Drama'],
    directors: ['François Dupeyron'],
    writers: ['François Dupeyron'],
    cast: [
      'Omar Sharif',
      'Pierre Boulanger',
      'Gilbert Melki',
      'Isabelle Renauld',
      'Lola Naymark',
      'Anne Suarez',
    ],
  },
  // https://www.themoviedb.org/movie/1282
  {
    title: 'Dogtown and Z-Boys',
    releaseDate: '2002-05-10',
    runtimeMinutes: 90,
    synopsis:
      'This award-winning, thrilling story is about a group of discarded kids who revolutionized skateboarding and shaped the attitude and culture of modern day extreme sports. Featuring old skool skating footage, exclusive interviews and a blistering rock soundtrack, DOGTOWN AND Z-BOYS captures the rise of the Zephyr skateboarding team from Venice\'s Dogtown, a tough "locals only" beach with a legacy of outlaw surfing.',
    posterUrl: tmdbPoster('eb02dpopuAhuThf7nXAAwKtAF88'),
    genres: ['Documentary'],
    directors: ['Stacy Peralta'],
    writers: ['Stacy Peralta', 'Craig Stecyk'],
    cast: ['Jay Adams', 'Tony Alva', 'Stacy Peralta', 'Steve Caballero', 'Tony Hawk', 'Jeff Ament'],
  },
  // https://www.themoviedb.org/movie/560
  {
    title: 'Secret Beyond the Door',
    releaseDate: '1947-12-24',
    runtimeMinutes: 99,
    synopsis:
      "After a whirlwind romance in Mexico, a beautiful heiress marries a man she barely knows with hardly a second thought. She finds his New York home full of his strange relations, and macabre rooms that are replicas of famous murder sites. One locked room contains the secret to her husband's obsession, and the truth about what happened to his first wife.",
    posterUrl: tmdbPoster('uVBEwjzXweHWjCFjAs7eJzH9in6'),
    genres: ['Mystery', 'Thriller', 'Drama', 'Romance'],
    directors: ['Fritz Lang'],
    writers: ['Silvia Richards'],
    cast: [
      'Joan Bennett',
      'Michael Redgrave',
      'Anne Revere',
      "Barbara O'Neil",
      'Natalie Schafer',
      'Paul Cavanagh',
    ],
  },
  // https://www.themoviedb.org/movie/1379
  {
    title: 'Lights in the Dusk',
    releaseDate: '2006-02-03',
    runtimeMinutes: 78,
    synopsis:
      'Outcast by his co-workers and living alone, Koistinen is a security guard who works the night shift in a luxury shopping mall in Helsinki. But when icy blonde Mirja approaches him, the lonely Koistinen falls helplessly for her, unaware she is manipulating him for her criminal boyfriend.',
    posterUrl: tmdbPoster('vBn28XPBI4vOKye1NSTGghdvGoJ'),
    genres: ['Drama', 'Comedy'],
    directors: ['Aki Kaurismäki'],
    writers: ['Aki Kaurismäki'],
    cast: [
      'Janne Hyytiäinen',
      'Maria Järvenhelmi',
      'Maria Heiskanen',
      'Ilkka Koivula',
      'Sergei Doudko',
      'Andrei Gennadiev',
    ],
  },
  // https://www.themoviedb.org/movie/822
  {
    title: 'The Music Room',
    releaseDate: '1958-10-10',
    runtimeMinutes: 100,
    synopsis:
      'An aging, decadent landlord’s passion for music becomes the undoing of his legacy as he sacrifices his wealth in order to compete with the opulent music room of his younger, richer neighbour.',
    posterUrl: tmdbPoster('1coINFn9GDeFr09QtkzjgTUbev5'),
    genres: ['Drama', 'Music'],
    directors: ['Satyajit Ray'],
    writers: ['Satyajit Ray', 'Santi P. Choudhury'],
    cast: [
      'Chhabi Biswas',
      'Gangapada Basu',
      'Kali Sarkar',
      'Tulsi Lahiri',
      'Padmadevi',
      'Pinaki Sengupta',
    ],
  },
  // https://www.themoviedb.org/movie/815
  {
    title: 'Animal Farm',
    releaseDate: '1999-10-03',
    runtimeMinutes: 91,
    synopsis:
      'Animals on a farm lead a revolution against the farmers to put their destiny in their own hands. However this revolution eats their own children and they cannot avoid corruption.',
    posterUrl: tmdbPoster('vFQo4DdhgHBr0Jy06VpzCYaZaPI'),
    genres: ['Drama', 'Comedy'],
    directors: ['John Stephenson'],
    writers: ['Alan Janes', 'Martyn Burke'],
    cast: [
      'Patrick Stewart',
      'Kelsey Grammer',
      'Julia Ormond',
      'Ian Holm',
      'Pete Postlethwaite',
      'Paul Scofield',
    ],
  },
  // https://www.themoviedb.org/movie/758
  {
    title: 'Murder Ahoy',
    releaseDate: '1964-09-22',
    runtimeMinutes: 93,
    synopsis:
      'During an annual board of trustees meeting, one of the trustees dies. Miss Marple thinks he’s been poisoned after finding a chemical on him. She sets off to investigate at the ship where he had just come from. The fourth and final film from the Miss Marple series starring Margaret Rutherford as the quirky amateur detective.',
    posterUrl: tmdbPoster('rfWqXgr0yVz8Ml4JdUEBOmN6KrW'),
    genres: ['Drama', 'Thriller', 'Crime', 'Mystery', 'Comedy'],
    directors: ['George Pollock'],
    writers: ['Jack Seddon', 'David Pursall'],
    cast: [
      'Margaret Rutherford',
      'Lionel Jeffries',
      'Stringer Davis',
      'Charles Tingwell',
      'William Mervyn',
      'Henry Oscar',
    ],
  },
  // https://www.themoviedb.org/movie/1660
  {
    title: 'Small Change',
    releaseDate: '1976-03-17',
    runtimeMinutes: 104,
    synopsis:
      "The lives of a motherless young man, who's just starting to find interest in women, and his physically abused, poverty stricken friend, are mixed with more or less innocent childhood experiences and challenges most their age experience.",
    posterUrl: tmdbPoster('lBOkXZ2RsL2BO6NlrFgR9yT7J4I'),
    genres: ['Comedy', 'Drama'],
    directors: ['François Truffaut'],
    writers: ['François Truffaut', 'Suzanne Schiffman'],
    cast: [
      'Jean-François Stévenin',
      'Virginie Thévenet',
      'Chantal Mercier',
      'Tania Torrens',
      'Nicole Félix',
      'Philippe Goldman',
    ],
  },
  // https://www.themoviedb.org/movie/1549
  {
    title: 'Games of Love and Chance',
    releaseDate: '2003-11-25',
    runtimeMinutes: 124,
    synopsis:
      "A group of teenagers living in a housing project in the outskirts of Paris rehearse a scene from Marivaux's play of the same name. Krimo is determined not to take part, but after developing feelings for Lydia, he quickly assumes the main role and love interest in the play.",
    posterUrl: tmdbPoster('vrGRVDJqa9WcFbfoIV9vYV3Fg7d'),
    genres: ['Romance', 'Drama'],
    directors: ['Abdellatif Kechiche'],
    writers: ['Abdellatif Kechiche', 'Ghalya Lacroix'],
    cast: [
      'Osman Elkharraz',
      'Sara Forestier',
      'Sabrina Ouazani',
      'Nanou Benhamou',
      'Hafet Ben-Ahmed',
      'Aurélie Ganito',
    ],
  },
  // https://www.themoviedb.org/movie/112
  {
    title: 'Italian for Beginners',
    releaseDate: '2000-12-07',
    runtimeMinutes: 118,
    synopsis:
      "Several lonely hearts in a semi-provincial suburb of a town in Denmark use a beginner's course in Italian as the platform to meet the romance of their lives. The film, which unspools the connections and family drama shared between the students, complies with several aesthetic principles of Dogme 95 movement.",
    posterUrl: tmdbPoster('yviUKuVb9BXYPqkWvp8JZFj2wVb'),
    genres: ['Comedy', 'Drama', 'Romance'],
    directors: ['Lone Scherfig'],
    writers: ['Lone Scherfig'],
    cast: [
      'Anders W. Berthelsen',
      'Anette Støvelbæk',
      'Ann Eleonora Jørgensen',
      'Peter Gantzler',
      'Lars Kaalund',
      'Sara Indrio Jensen',
    ],
  },
  // https://www.themoviedb.org/movie/852
  {
    title: 'It Happened in Broad Daylight',
    releaseDate: '1958-06-09',
    runtimeMinutes: 100,
    synopsis:
      'The search for a child murderer drags a once-respected detective into an all-consuming obsession.',
    posterUrl: tmdbPoster('8M3CPJvCe96WnIqKT8HHrSLprgT'),
    genres: ['Crime', 'Thriller'],
    directors: ['Ladislao Vajda'],
    writers: ['Ladislao Vajda', 'Hans Jacoby', 'Friedrich Dürrenmatt'],
    cast: [
      'Heinz Rühmann',
      'Sigfrit Steiner',
      'Siegfried Lowitz',
      'Michel Simon',
      'Heinrich Gretler',
      'Gert Fröbe',
    ],
  },
  // https://www.themoviedb.org/movie/878
  {
    title: 'The Punch Bowl',
    releaseDate: '1944-01-28',
    runtimeMinutes: 97,
    synopsis:
      'Writer Johannes Pfeiffer who goes undercover as a student in a high school after his friends told him that he missed out on a great life experience since he was home schooled.',
    posterUrl: tmdbPoster('yPklnEcziGaLCetKtLSwEJrecBe'),
    genres: ['Comedy', 'Family'],
    directors: ['Helmut Weiss'],
    writers: ['Heinrich Spoerl'],
    cast: [
      'Heinz Rühmann',
      'Karin Himboldt',
      'Hilde Sessak',
      'Erich Ponto',
      'Paul Henckels',
      'Hans Leibelt',
    ],
  },
  // https://www.themoviedb.org/movie/1269
  {
    title: 'The Vexxer',
    releaseDate: '2007-03-10',
    runtimeMinutes: 98,
    synopsis:
      'Scotland Yard investigators have to prevent the murder of Victoria Dickman when her name is found on a death list.',
    posterUrl: tmdbPoster('miD6UUIcikgDHWHhS9HxySDcS92'),
    genres: ['Comedy', 'Crime'],
    directors: ['Cyrill Boss', 'Philipp Stennert'],
    writers: ['Oliver Welke', 'Bastian Pastewka', 'Oliver Kalkofe'],
    cast: [
      'Oliver Kalkofe',
      'Bastian Pastewka',
      'Joachim Fuchsberger',
      'Christiane Paul',
      'Christoph Maria Herbst',
      'Martin Semmelrogge',
    ],
  },
  // https://www.themoviedb.org/movie/1631
  {
    title: 'A Real Young Girl',
    releaseDate: '1976-06-01',
    runtimeMinutes: 94,
    synopsis:
      "Reluctantly, a sulky adolescent returns to her parents' house for yet another boring summer vacation, dabbling in desire and the art of desirability, eventually mixing reality with vision, caged fantasies with the fierce female sexuality.",
    posterUrl: tmdbPoster('kuSYd4AGcfydRtkcVLqas0zLtql'),
    genres: ['Romance', 'Drama'],
    directors: ['Catherine Breillat'],
    writers: ['Catherine Breillat'],
    cast: [
      'Charlotte Alexandra',
      'Hiram Keller',
      'Rita Maiden',
      'Bruno Balp',
      'Georges Guéret',
      'Shirley Stoler',
    ],
  },
  // https://www.themoviedb.org/movie/86
  {
    title: 'The Elementary Particles',
    releaseDate: '2006-02-10',
    runtimeMinutes: 105,
    synopsis:
      "Based on Michel Houellebecq's controversial novel, Atomised (aka The Elementary Particles) focuses on Michael and Bruno, two very different half-brothers and their disturbed sexuality.  After a chaotic childhood with a hippie mother only caring for her affairs, Michael, a molecular biologist, is more interested in genes than women, while Bruno is obsessed with his sexual desires, but mostly finds his satisfaction with prostitutes.  But Bruno's life changes when he gets to know the experienced Christiane.  In the meantime, Michael meets Annabelle, the love of his youth, again.",
    posterUrl: tmdbPoster('wpGpR7GewyApPgqPvuWadBAfmFc'),
    genres: ['Drama', 'Romance'],
    directors: ['Oskar Roehler'],
    writers: ['Oskar Roehler'],
    cast: [
      'Christian Ulmen',
      'Moritz Bleibtreu',
      'Martina Gedeck',
      'Franka Potente',
      'Nina Hoss',
      'Corinna Harfouch',
    ],
  },
  // https://www.themoviedb.org/movie/1294
  {
    title: 'Four Minutes',
    releaseDate: '2006-06-23',
    runtimeMinutes: 112,
    synopsis:
      'Jenny is young. Her life is over. She killed someone. And she would do it again. When an 80-year-old piano teacher discovers the girl’s secret, her brutality and her dreams, she decides to transform her pupil into the musical wunderkind she once was.',
    posterUrl: tmdbPoster('qZusVWgu0Df9hD4JbT0R2yYL2ya'),
    genres: ['Drama', 'Music'],
    directors: ['Chris Kraus'],
    writers: ['Chris Kraus'],
    cast: [
      'Monica Bleibtreu',
      'Hannah Herzsprung',
      'Sven Pippig',
      'Richy Müller',
      'Jasmin Tabatabai',
      'Stefan Kurt',
    ],
  },
  // https://www.themoviedb.org/movie/1123
  {
    title: 'Catch a Fire',
    releaseDate: '2006-10-27',
    runtimeMinutes: 101,
    synopsis:
      'The true story of anti-apartheid activists in South Africa, and particularly the life of Patrick Chamusso, a timid foreman at Secunda CTL, the largest synthetic fuel plant in the world. Patrick is wrongly accused, imprisoned and tortured for an attempt to bomb the plant, with the injustice transforming the apolitical worker into a radicalised insurgent, who then carries out his own successful sabotage mission.',
    posterUrl: tmdbPoster('2sgujWX2yWH7REnDI35ZZXsqPiV'),
    genres: ['Action', 'Drama', 'Thriller'],
    directors: ['Phillip Noyce'],
    writers: ['Shawn Slovo'],
    cast: [
      'Tim Robbins',
      'Derek Luke',
      'Bonnie Mbuli',
      'Mncedisi Shabangu',
      'Tumisho Masha',
      'Sithembiso Khumalo',
    ],
  },
  // https://www.themoviedb.org/movie/1380
  {
    title: 'Gleaming the Cube',
    releaseDate: '1989-01-13',
    runtimeMinutes: 106,
    synopsis:
      "An Orange County teenager's carefree life of ditching class and skateboarding abandoned pools comes to a screeching halt when someone close to him dies. The cops rule the death a suicide, but the bereaved skater believes he was murdered. It's up to him to solve the case, with a skateboard.",
    posterUrl: tmdbPoster('dpwbqnG2vmkwBBIpfQmFUf5l120'),
    genres: ['Crime', 'Thriller', 'Action'],
    directors: ['Graeme Clifford'],
    writers: ['Michael Tolkin'],
    cast: [
      'Christian Slater',
      'Steven Bauer',
      'Richard Herd',
      'Ed Lauter',
      'Le Tuan',
      'Peter Kwong',
    ],
  },
  // https://www.themoviedb.org/movie/1622
  {
    title: 'Lemming',
    releaseDate: '2005-05-11',
    runtimeMinutes: 130,
    synopsis:
      "After the death of his boss's wife, a young engineer faces the sudden psychological metamorphosis of his own wife, seemingly possessed by the soul of the deceased...",
    posterUrl: tmdbPoster('zzGmXQnc9xsFoVM1Zqqm7r4hfBp'),
    genres: ['Drama', 'Thriller', 'Mystery'],
    directors: ['Dominik Moll'],
    writers: ['Dominik Moll', 'Gilles Marchand'],
    cast: [
      'Laurent Lucas',
      'Charlotte Gainsbourg',
      'André Dussollier',
      'Charlotte Rampling',
      'Jacques Bonnaffé',
      'Véronique Affholder',
    ],
  },
  // https://www.themoviedb.org/movie/880
  {
    title: "Antonia's Line",
    releaseDate: '1995-09-21',
    runtimeMinutes: 102,
    synopsis:
      "After World War II, Antonia and her daughter, Danielle, go back to their Dutch hometown, where Antonia's late mother has bestowed a small farm upon her. There, Antonia settles down and joins a tightly-knit but unusual community. Those around her include quirky friend Crooked Finger, would-be suitor Bas and, eventually for Antonia, a granddaughter and great-granddaughter who help create a strong family of empowered women.",
    posterUrl: tmdbPoster('nUCVi6bBIL7LGC61nYaCqikAhIA'),
    genres: ['Drama', 'Comedy'],
    directors: ['Marleen Gorris'],
    writers: ['Marleen Gorris'],
    cast: [
      'Willeke van Ammelrooy',
      'Els Dottermans',
      'Dora van der Groen',
      'Veerle van Overloop',
      'Carolien Spoor',
      'Esther Vriesendorp',
    ],
  },
  // https://www.themoviedb.org/movie/1436
  {
    title: 'The Warrior',
    releaseDate: '2001-09-07',
    runtimeMinutes: 155,
    synopsis:
      'In 1375, China was in chaos between Yuan Dynasty and Ming Dynasty. Coryo (an ancient kingdom of Korea then) sent a delegation of many diplomats, soldiers and a silent slave to make peace with the new Chinese government. However, this delegation got charged as spies and sent in exile to a remote desert.',
    posterUrl: tmdbPoster('i0lpQfqQHN7vEYzSHOk6B65dQbb'),
    genres: ['History', 'Drama', 'Action', 'War'],
    directors: ['Kim Sung-soo'],
    writers: ['Kim Sung-soo'],
    cast: [
      'Jung Woo-sung',
      'Ahn Sung-ki',
      'Ju Jin-mo',
      'Park Yong-woo',
      'Zhang Ziyi',
      'Park Jeong-hak',
    ],
  },
  // https://www.themoviedb.org/movie/1559
  {
    title: 'Sweet Movie',
    releaseDate: '1974-06-12',
    runtimeMinutes: 98,
    synopsis:
      'The winner of the Miss World Virginity contest marries, escapes from her masochistic husband and ends up involved in a world of debauchery.',
    posterUrl: tmdbPoster('64SaF3kOOaLPUVflDhXZLrB0xjt'),
    genres: ['Comedy'],
    directors: ['Dušan Makavejev'],
    writers: ['Dušan Makavejev', 'Martin Malina', 'France Gallagher'],
    cast: [
      'Carole Laure',
      'Pierre Clémenti',
      'Anna Prucnal',
      'Sami Frey',
      'John Vernon',
      'Jane Mallett',
    ],
  },
  // https://www.themoviedb.org/movie/1404
  {
    title: 'Ae Fond Kiss...',
    releaseDate: '2004-07-14',
    runtimeMinutes: 104,
    synopsis:
      'A young man upsets his Punjabi family when he falls in love with an Irish schoolteacher.',
    posterUrl: tmdbPoster('tShULKbs8svdBcekljqGPO42PNj'),
    genres: ['Drama', 'Romance'],
    directors: ['Ken Loach'],
    writers: ['Paul Laverty'],
    cast: [
      'Atta Yaqub',
      'Eva Birthistle',
      'Shamshad Akhtar',
      'Ghizala Avan',
      'Shabana Akhtar Bakhsh',
      'Ahmad Riaz',
    ],
  },
  // https://www.themoviedb.org/movie/1702
  {
    title: 'Death Machine',
    releaseDate: '1995-05-02',
    runtimeMinutes: 122,
    synopsis:
      "Chaank Armaments is experimenting with the ultimate fighting machine which is part human - part machine. So far, the Hardman project has been unreliable and has killed a number of innocent people. The genius behind this project is Jack who lives in a world of models, toys and magazines. When he is fired by Cale for killing a few corporate officers, he unleashes the ultimate killing machine called the 'Warbeast' against Cale and those who would help her.",
    posterUrl: tmdbPoster('vmDaabHFO4NvrEc6kT8aRMv9Rve'),
    genres: ['Action', 'Horror', 'Science Fiction', 'Thriller'],
    directors: ['Stephen Norrington'],
    writers: ['Stephen Norrington'],
    cast: [
      'Ely Pouget',
      'Brad Dourif',
      'William Hootkins',
      'John Sharian',
      'Martin McDougall',
      'Andreas Wisniewski',
    ],
  },
  // https://www.themoviedb.org/movie/1693
  {
    title: 'Monster Man',
    releaseDate: '2003-07-30',
    runtimeMinutes: 95,
    synopsis:
      'Two guys and a female hitchhiker are terrorized by a monstrous looking man driving a giant monster truck.',
    posterUrl: tmdbPoster('iFCta7mFC7aVTPMA3opH8Vq62Pn'),
    genres: ['Horror', 'Comedy'],
    directors: ['Michael Davis'],
    writers: ['Michael Davis'],
    cast: [
      'Eric Jungmann',
      'Justin Urich',
      'Aimee Brooks',
      'Michael Bailey Smith',
      'Joe Goodrich',
      'Tim Sitarz',
    ],
  },
  // https://www.themoviedb.org/movie/911
  {
    title: 'The Bank Dick',
    releaseDate: '1940-11-29',
    runtimeMinutes: 72,
    synopsis:
      "Egbert Sousé becomes an unexpected hero when a bank robber falls over a bench he's occupying. Now considered brave, Egbert is given a job as a bank guard. Soon, he is approached by charlatan J. Frothingham Waterbury about buying shares in a mining company. Egbert persuades teller Og Oggilby to lend him bank money, to be returned when the scheme pays off. Unfortunately, bank inspector Snoopington then makes a surprise appearance.",
    posterUrl: tmdbPoster('3XrqHTrJpTaUeyqXqb4fVacYWpf'),
    genres: ['Comedy'],
    directors: ['Edward F. Cline'],
    writers: ['W.C. Fields'],
    cast: [
      'W.C. Fields',
      'Cora Witherspoon',
      'Una Merkel',
      'Evelyn Del Rio',
      'Jessie Ralph',
      'Franklin Pangborn',
    ],
  },
  // https://www.themoviedb.org/movie/390
  {
    title: 'Lisbon Story',
    releaseDate: '1994-12-16',
    runtimeMinutes: 100,
    synopsis:
      "Wim Wenders' homage to Lisbon and films. A sound engineer obtains a mysterious postcard from a friend who at the moment is filming a film in Lisbon. He sets out across Europe to find him and help him.",
    posterUrl: tmdbPoster('iqxvLET9q43BxxNXmit9nNiEPPM'),
    genres: ['Drama', 'Music'],
    directors: ['Wim Wenders'],
    writers: ['Wim Wenders'],
    cast: [
      'Rüdiger Vogler',
      'Patrick Bauchau',
      'Teresa Salgueiro',
      'Manoel de Oliveira',
      'Vasco Sequeira',
      'Joel Cunha Ferreira',
    ],
  },
  // https://www.themoviedb.org/movie/222
  {
    title: 'Berlin: Symphony of a Great City',
    releaseDate: '1927-09-23',
    runtimeMinutes: 69,
    synopsis:
      'A day in the city of Berlin, which experienced an industrial boom in the 1920s, and still provides an insight into the living and working conditions at that time. Germany had just recovered a little from the worst consequences of the First World War, the great economic crisis was still a few years away and Hitler was not yet an issue at the time.',
    posterUrl: tmdbPoster('1APQoI9PKgZtg6PWZjIbr0U7GvZ'),
    genres: ['Documentary'],
    directors: ['Walter Ruttmann'],
    writers: ['Walter Ruttmann', 'Karl Freund'],
    cast: ['Paul von Hindenburg'],
  },
  // https://www.themoviedb.org/movie/523
  {
    title: 'Requiem',
    releaseDate: '2006-03-02',
    runtimeMinutes: 92,
    synopsis:
      'Michaela, an epileptic, enrolls in college to study education. She goes off her medication and soon begins hearing voices and seeing apparitions that tell her to avoid religious objects, although she is devoutly Roman Catholic. One priest scoffs at the idea that Michaela could be possessed by demons, but a younger pastor arranges an exorcism for the young woman.',
    posterUrl: tmdbPoster('Aquk2tb8RiU4uWhIGrrr6DDy37Z'),
    genres: ['Drama'],
    directors: ['Hans-Christian Schmid'],
    writers: ['Bernd Lange'],
    cast: [
      'Sandra Hüller',
      'Burghart Klaußner',
      'Imogen Kogge',
      'Anna Blomeier',
      'Nicholas Reinke',
      'Walter Schmidinger',
    ],
  },
  // https://www.themoviedb.org/movie/102
  {
    title: 'Open Hearts',
    releaseDate: '2002-09-06',
    runtimeMinutes: 113,
    synopsis:
      'Cecilie and Joachim are about to get married when a freak car accident leaves Joachim disabled, throwing their lives into a spin. The driver of the other car, Marie, and her family don’t get off lightly, either. Her husband Niels works in the hospital where he meets Cecilie and falls madly in love with her.',
    posterUrl: tmdbPoster('hOrV2fCw2kmSiS4ZMGFPfXqr3lt'),
    genres: ['Drama', 'Romance'],
    directors: ['Susanne Bier'],
    writers: ['Anders Thomas Jensen'],
    cast: [
      'Sonja Richter',
      'Nikolaj Lie Kaas',
      'Mads Mikkelsen',
      'Paprika Steen',
      'Stine Bjerregaard',
      'Birthe Neumann',
    ],
  },
  // https://www.themoviedb.org/movie/1618
  {
    title: 'Still Crazy',
    releaseDate: '1998-10-30',
    runtimeMinutes: 95,
    synopsis:
      'In the 1970s, Strange Fruit were it. They lived the rock lifestyle to the max, groupies, drugs, internal tension and an ex front man dead from an overdose. Even their demise was glamorous; when lightning struck the stage during an outdoor festival. Twenty years on, these former rock gods they have now sunk deep into obscurity when the idea of a reunion tour is lodged in the head of Tony, former keyboard player of the Fruits. Tony sets out to find his former bandmates with the help of former manager Karen to see if they can recapture the magic and give themselves a second chance.',
    posterUrl: tmdbPoster('o1k991eZm7iF8JUNiVdUZU44x5c'),
    genres: ['Comedy', 'Music'],
    directors: ['Brian Gibson'],
    writers: ['Ian La Frenais', 'Dick Clement'],
    cast: [
      'Stephen Rea',
      'Billy Connolly',
      'Jimmy Nail',
      'Timothy Spall',
      'Bill Nighy',
      'Juliet Aubrey',
    ],
  },
  // https://www.themoviedb.org/movie/677
  {
    title: 'Olympia Part One: Festival of the Nations',
    releaseDate: '1938-04-21',
    runtimeMinutes: 127,
    synopsis:
      'Starting with a long and lyrical overture, evoking the origins of the Olympic Games in ancient Greece, Riefenstahl covers twenty-one athletic events in the first half of this two-part love letter to the human body and spirit, culminating with the marathon, where Jesse Owens became the first track and field athlete to win four gold medals in a single Olympics.',
    posterUrl: tmdbPoster('49KaePhxdoM3TkJHo8zaoCFEJ6X'),
    genres: ['Documentary'],
    directors: ['Leni Riefenstahl'],
    writers: ['Leni Riefenstahl'],
    cast: [
      'David Albritton',
      'Arvo Askola',
      'Jack Beresford',
      'Erwin Blask',
      'Sulo Bärlund',
      'Ibolya Csák',
    ],
  },
  // https://www.themoviedb.org/movie/159
  {
    title: 'Maybe... Maybe Not',
    releaseDate: '1994-10-05',
    runtimeMinutes: 94,
    synopsis:
      'The heterosexual man Axel is thrown out of his girlfriends home for cheating and ends up moving in with a gay man. Axel learns the advantages of living with gay men even though they are attracted to him and when his girlfriend wants him back he must make a tough decision.',
    posterUrl: tmdbPoster('2TcZBHcseRXLxNq2RXnKIsbKZwi'),
    genres: ['Comedy', 'Drama'],
    directors: ['Sönke Wortmann'],
    writers: ['Sönke Wortmann'],
    cast: [
      'Til Schweiger',
      'Joachim Król',
      'Katja Riemann',
      'Rufus Beck',
      'Armin Rohde',
      'Martina Gedeck',
    ],
  },
  // https://www.themoviedb.org/movie/1403
  {
    title: 'Duel at Diablo',
    releaseDate: '1966-06-15',
    runtimeMinutes: 105,
    synopsis:
      "In Apache territory, a supply Army column heads for the next fort, an ex-scout searches for the killer of his Native wife, and a housewife abandons her husband to rejoin her Apache lover's tribe.",
    posterUrl: tmdbPoster('bKtx5Nu0LzjNDvCHthTQ3KAY95f'),
    genres: ['Western'],
    directors: ['Ralph Nelson'],
    writers: ['Marvin H. Albert', 'Michael M. Grilikhes'],
    cast: [
      'James Garner',
      'Sidney Poitier',
      'Bill Travers',
      'Bibi Andersson',
      'Dennis Weaver',
      'William Redfield',
    ],
  },
  // https://www.themoviedb.org/movie/383
  {
    title: 'Mala Noche',
    releaseDate: '1987-06-19',
    runtimeMinutes: 75,
    synopsis:
      'Walt is a lonely convenience store clerk who has fallen in love with a Mexican migrant worker named Johnny. Though Walt has little in common with the object of his affections — including a shared language — his desire to possess Johnny prompts a sexual awakening that results in a tangled love triangle.',
    posterUrl: tmdbPoster('gAtkeNjk054tEl3jCHtF1wOFCx1'),
    genres: ['Drama', 'Romance'],
    directors: ['Gus Van Sant'],
    writers: ['Gus Van Sant'],
    cast: [
      'Doug Cooeyate',
      'Tim Streeter',
      'Sam Downey',
      'Nyla McCarthy',
      'Ray Monge',
      'Robert Lee Pitchlynn',
    ],
  },
  // https://www.themoviedb.org/movie/554
  {
    title: 'The Cuckoo',
    releaseDate: '2002-09-12',
    runtimeMinutes: 100,
    synopsis:
      "September of 1944, a few days before Finland went out of the Second World War. A chained to a rock Finnish sniper-kamikadze Veikko managed to set himself free. Ivan, a captain of the Soviet Army, arrested by the Front Secret Police 'Smersh', has a narrow escape. They are soldiers of the two enemy armies. A Lapp woman Anni gives a shelter to both of them at her farm. For Anni they are not enemies, but just men.",
    posterUrl: tmdbPoster('g0bVxxdeAkDwzLoJq7o8ehQZWa6'),
    genres: ['Drama', 'Romance', 'Comedy'],
    directors: ['Aleksandr Rogozhkin'],
    writers: ['Aleksandr Rogozhkin'],
    cast: [
      'Anni-Kristiina Juuso',
      'Ville Haapasalo',
      'Viktor Bychkov',
      'Mikhail Korobochkin',
      'Denis Aksenov',
      'Santeri Kuikka',
    ],
  },
  // https://www.themoviedb.org/movie/1673
  {
    title: 'Comanche Station',
    releaseDate: '1960-01-31',
    runtimeMinutes: 74,
    synopsis:
      'A white man trades with the Comanche for the release of a female stranger and the pair cross paths with three outlaws who have their eyes on the handsome reward for bringing her home and Comanche on the warpath.',
    posterUrl: tmdbPoster('1PHMKqoyZ4JS1iXBDSgKrbirox'),
    genres: ['Western'],
    directors: ['Budd Boetticher'],
    writers: ['Burt Kennedy'],
    cast: [
      'Randolph Scott',
      'Nancy Gates',
      'Claude Akins',
      'Skip Homeier',
      'Richard Rust',
      'Rand Brooks',
    ],
  },
  // https://www.themoviedb.org/movie/124
  {
    title: 'No End',
    releaseDate: '1985-06-17',
    runtimeMinutes: 108,
    synopsis:
      '1982, Poland. A translator loses her husband and becomes a victim of her own sorrow. She looks to sex, to her son, to law, and to hypnotism when she has nothing else in this time of martial law when Solidarity was banned.',
    posterUrl: tmdbPoster('3pdF1guvIxNgmhDkmXJHCCk0PkC'),
    genres: ['Drama'],
    directors: ['Krzysztof Kieślowski'],
    writers: ['Krzysztof Kieślowski', 'Krzysztof Piesiewicz'],
    cast: [
      'Grażyna Szapołowska',
      'Maria Pakulnis',
      'Aleksander Bardini',
      'Jerzy Radziwiłowicz',
      'Artur Barciś',
      'Michał Bajor',
    ],
  },
  // https://www.themoviedb.org/movie/885
  {
    title: 'The Docks of New York',
    releaseDate: '1928-09-16',
    runtimeMinutes: 76,
    synopsis:
      "A blue-collar worker on New York's depressed waterfront finds his life changed after he saves a woman attempting suicide.",
    posterUrl: tmdbPoster('rCMZpfPAHeuy02nMCttEX3OJt4B'),
    genres: ['Drama', 'Romance'],
    directors: ['Josef von Sternberg'],
    writers: ['Jules Furthman', 'Julian Johnson', 'John Monk Saunders'],
    cast: [
      'George Bancroft',
      'Betty Compson',
      'Olga Baclanova',
      'Clyde Cook',
      'Mitchell Lewis',
      'Guy Oliver',
    ],
  },
  // https://www.themoviedb.org/movie/1699
  {
    title: 'Anatomy 2',
    releaseDate: '2003-11-23',
    runtimeMinutes: 101,
    synopsis:
      'The doctor and soccer player in the leisure time Jo Hauser decides to move to Berlin and be an intern in a famous clinic, expecting to increase his knowledge and expertize, and help his handicap brother Willi Hauser. He joins a secret fraternity of doctors, under the leadership of Prof. Muller-LaRousse, who is researching the use of bionic muscles in human beings without any ethics or respect to the laws. The team is also volunteer to the experiences, and is under investigation of Paula Henning. When Jo gets close to a Filipino nurse, and becomes addicted in the drugs used in experience, he realizes the truth hidden in the methods used by the secret society in the development of science.',
    posterUrl: tmdbPoster('yT8ouLaEJtLb899m34BYtR5bR5o'),
    genres: ['Horror', 'Thriller'],
    directors: ['Stefan Ruzowitzky'],
    writers: ['Stefan Ruzowitzky'],
    cast: [
      'Barnaby Metschurat',
      'Herbert Knaup',
      'Heike Makatsch',
      'Roman Knižka',
      'Wotan Wilke Möhring',
      'Franka Potente',
    ],
  },
  // https://www.themoviedb.org/movie/1676
  {
    title: 'Will Penny',
    releaseDate: '1967-12-19',
    runtimeMinutes: 110,
    synopsis:
      "Will Penny, an aging cowpoke, takes a job on a ranch which requires him to ride the line of the property looking for trespassers or, worse, squatters. He finds that his cabin in the high mountains has been appropriated by a woman whose guide to Oregon has deserted her and her son. Too ashamed to kick mother and child out just as the bitter winter of the mountains sets in, he agrees to share the cabin until the spring thaw. But it isn't just the snow that slowly thaws; the lonely man and woman soon forget their mutual hostility and start developing a deep love for one another.",
    posterUrl: tmdbPoster('v3RcNrqutEPGsiTLd31J3U735kB'),
    genres: ['Western', 'Romance'],
    directors: ['Tom Gries'],
    writers: ['Tom Gries'],
    cast: [
      'Charlton Heston',
      'Joan Hackett',
      'Donald Pleasence',
      'Lee Majors',
      'Bruce Dern',
      'Ben Johnson',
    ],
  },
  // https://www.themoviedb.org/movie/1697
  {
    title: 'Grave Decisions',
    releaseDate: '2006-08-17',
    runtimeMinutes: 105,
    synopsis:
      "In this black comedy set in small-town Bavaria, 11-year-old Sebastian thinks you can never be too young to be a murderer. He's convinced that he killed his mother on the day he was born and is certain he's already been condemned to purgatory. Deciding he might be able to knock off a few years of his sentence by doing good deeds, Sebastian sets out to find a wife for his father Lorenz. When Lorenz and Sebastian's schoolteacher Veronika fall madly in love with each other, it seems the heavens must be smiling. There's just one hitch: Veronika is married.",
    posterUrl: tmdbPoster('4y0DMk2QEbPJZcNnvBE34DlJoiN'),
    genres: ['Drama', 'Comedy'],
    directors: ['Marcus H. Rosenmüller'],
    writers: ['Marcus H. Rosenmüller', 'Christian Lerch'],
    cast: [
      'Markus Krojer',
      'Fritz Karl',
      'Jürgen Tonkel',
      'Jule Ronstedt',
      'Saskia Vester',
      'Franz Xaver Brückner',
    ],
  },
  // https://www.themoviedb.org/movie/347
  {
    title: 'People on Sunday',
    releaseDate: '1930-02-04',
    runtimeMinutes: 74,
    synopsis:
      "A semi-documentary experimental 1930 German silent film created by amateurs with a small budget. With authentic scenes of the metropolis city of Berlin, it's the first film from the later famous screenwriters/directors Billy Wilder and Fred Zinnemann.",
    posterUrl: tmdbPoster('gWIkCmYaRDlA78WMIfRUlURuLCZ'),
    genres: ['Drama'],
    directors: ['Edgar G. Ulmer', 'Robert Siodmak'],
    writers: ['Billy Wilder'],
    cast: [
      'Erwin Splettstößer',
      'Brigitte Borchert',
      'Wolfgang von Waltershausen',
      'Christl Ehlers',
      'Annie Schreyer',
      'Kurt Gerron',
    ],
  },
  // https://www.themoviedb.org/movie/1114
  {
    title: 'The Story of the Weeping Camel',
    releaseDate: '2004-08-12',
    runtimeMinutes: 91,
    synopsis:
      "When a Mongolian nomadic family's newest camel colt is rejected by its mother, a musician is needed for a ritual to change her mind.",
    posterUrl: tmdbPoster('c3SAAO5hNJqLWLlJr9TZ6CQ8eGI'),
    genres: ['Documentary', 'Drama'],
    directors: ['Luigi Falorni', 'Byambasuren Davaa'],
    writers: ['Luigi Falorni', 'Byambasuren Davaa'],
    cast: [
      'Janchiv Ayurzana',
      'Chimed Ohin',
      'Amgaabazar Gonson',
      'Zeveljamz Nyam',
      'Ikhbayar Amgaabazar',
      'Odgerel Ayusch',
    ],
  },
  // https://www.themoviedb.org/movie/1126
  {
    title: "In My Father's Den",
    releaseDate: '2004-06-11',
    runtimeMinutes: 126,
    synopsis:
      'War journalist Paul Prior returns to his New Zealand hometown after his father’s death, rekindling strained relationships with his brother and memories of a troubled past. He befriends Celia, a curious and aspiring writer, who shares a fascination with his world. When Celia mysteriously disappears, Paul becomes the prime suspect, forcing him to confront buried secrets and uncover the dark truths of his family and community.',
    posterUrl: tmdbPoster('tnFvXenEmwfESsw401SE6N9oFQp'),
    genres: ['Drama', 'Mystery', 'Thriller'],
    directors: ['Brad McGann'],
    writers: ['Brad McGann'],
    cast: [
      'Matthew Macfadyen',
      'Emily Barclay',
      'Miranda Otto',
      'Colin Moy',
      'Jimmy Keen',
      'Jodie Rimmer',
    ],
  },
  // https://www.themoviedb.org/movie/1720
  {
    title: 'Noi the Albino',
    releaseDate: '2003-02-28',
    runtimeMinutes: 90,
    synopsis:
      '17 year old Nói drifts through life on a remote fjord in Iceland. In winter, the fjord is cut off from the outside world, surrounded by ominous mountains and buried under a shroud of snow. Nói dreams of escaping from this white-walled prison with Íris, a city girl who works in a local gas station. But his clumsy attempts at escape spiral out of control.',
    posterUrl: tmdbPoster('dy8srjJ3pQCA967wcJ2WaaTbr51'),
    genres: ['Drama'],
    directors: ['Dagur Kári'],
    writers: ['Dagur Kári'],
    cast: [
      'Tómas Lemarquis',
      'Þröstur Leó Gunnarsson',
      'Elín Hansdóttir',
      'Hjalti Rögnvaldsson',
      'Pétur Einarsson',
      'Anna Friðriksdóttir',
    ],
  },
  // https://www.themoviedb.org/movie/156
  {
    title: 'Wilbur Wants to Kill Himself',
    releaseDate: '2002-11-08',
    runtimeMinutes: 111,
    synopsis:
      'The strange comedy film of two close brothers; one, Wilbur, who wants to kill himself, and the other, Harbour, who tries to prevent this. When their father dies leaving them his bookstore they meet a woman who makes their lives a bit better yet with a bit more trouble as well.',
    posterUrl: tmdbPoster('bRrHJbr8kMb849IKBZ0RBk2Vmte'),
    genres: ['Comedy', 'Drama', 'Romance'],
    directors: ['Lone Scherfig'],
    writers: ['Lone Scherfig', 'Anders Thomas Jensen'],
    cast: [
      'Jamie Sives',
      'Adrian Rawlins',
      'Shirley Henderson',
      'Lisa McKinlay',
      'Mads Mikkelsen',
      'Julia Davis',
    ],
  },
  // https://www.themoviedb.org/movie/1448
  {
    title: 'Immortality',
    releaseDate: '1998-11-27',
    runtimeMinutes: 98,
    synopsis: "A vampire in London is searching for the ideal woman to 'redeem' him.",
    posterUrl: tmdbPoster('rMxdX8QXWjIZDsZthsN8axFR4ws'),
    genres: ['Fantasy', 'Romance', 'Thriller'],
    directors: ['Leong Po-Chih'],
    writers: ['Paul Hoffman'],
    cast: [
      'Jude Law',
      'Elina Löwensohn',
      'Timothy Spall',
      'Jack Davenport',
      'Hitler Wong',
      'Kerry Fox',
    ],
  },
  // https://www.themoviedb.org/movie/481
  {
    title: '7 Virgins',
    releaseDate: '2005-10-14',
    runtimeMinutes: 86,
    synopsis:
      'It is summertime in a blue-collar, marginal district of a city in the South of Spain. Tano, a teenager currently serving a sentence in a juvenile reform center, is given a 48-hour leave to attend his brother’s wedding.',
    posterUrl: tmdbPoster('aIGNKsJFfaxIOtxjcLT0uy1HBLU'),
    genres: ['Drama', 'Crime'],
    directors: ['Alberto Rodríguez'],
    writers: ['Alberto Rodríguez', 'Rafael Cobos'],
    cast: [
      'Juan José Ballesta',
      'Jesús Carroza',
      'Vicente Romero Sánchez',
      'Alba Rodríguez',
      'Julián Villagrán',
      'Ana Wagener',
    ],
  },
  // https://www.themoviedb.org/movie/1661
  {
    title: 'Gigantic',
    releaseDate: '1999-09-30',
    runtimeMinutes: 80,
    synopsis:
      'The Hamburg friends Walter, Ricco and Floyd take each day as it comes between the estates of tower blocks and fast food restaurants. All three are in their early twenties and are dreaming of another life when Floyd suddenly takes a job on a freighter going to Singapore.',
    posterUrl: tmdbPoster('bfIyk9Tlc4u5NdpWvtSD2jQEqOE'),
    genres: ['Drama', 'Comedy'],
    directors: ['Sebastian Schipper'],
    writers: ['Sebastian Schipper'],
    cast: [
      'Frank Giering',
      'Florian Lukas',
      'Antoine Monot Jr.',
      'Julia Hummer',
      'Jochen Nickel',
      'Albert Kitzl',
    ],
  },
  // https://www.themoviedb.org/movie/1479
  {
    title: 'Clean, Shaven',
    releaseDate: '1995-04-14',
    runtimeMinutes: 79,
    synopsis:
      'Peter Winter is a young schizophrenic who is desperately trying to get his daughter back from her adoptive family. He attempts to function in a world that, for him, is filled with strange voices, electrical noise, disconcerting images, and jarringly sudden emotional shifts. During his quest, he runs afoul of the law and an ongoing murder investigation.',
    posterUrl: tmdbPoster('kpMXYy0L2GHrIVyDF0HkEiDK1Wd'),
    genres: ['Drama', 'Crime', 'Thriller'],
    directors: ['Lodge Kerrigan'],
    writers: ['Lodge Kerrigan'],
    cast: [
      'Peter Greene',
      'Robert Albert',
      'Megan Owen',
      'Jennifer MacDonald',
      'Molly Castelloe',
      'J. Dixon Byrne',
    ],
  },
  // https://www.themoviedb.org/movie/689
  {
    title: 'The Travelling Players',
    releaseDate: '1975-07-01',
    runtimeMinutes: 223,
    synopsis:
      'A traveling theatre troupe tours the Greek countryside from 1939 to the early 1950s, staging “Golfo the Shepherdess”. As the years pass, its members endure persecution, betrayal, executions, and exile. Their personal stories become entangled with the country’s major historical events, in a seemingly endless cycle of violence and loss.',
    posterUrl: tmdbPoster('3SQKTdfFNoYtwyFCfUm1WQ4dNEe'),
    genres: ['Drama', 'War', 'History'],
    directors: ['Theo Angelopoulos'],
    writers: ['Theo Angelopoulos'],
    cast: [
      'Eva Kotamanidou',
      'Vangelis Kazan',
      'Aliki Georgouli',
      'Kiriakos Katrivanos',
      'Stratos Pahis',
      'Nina Papazaphiropoulou',
    ],
  },
  // https://www.themoviedb.org/movie/836
  {
    title: 'Barren Lives',
    releaseDate: '1963-08-22',
    runtimeMinutes: 100,
    synopsis:
      'In vivid images, the documentary-like story of a drover and his family in the northern badlands of Brazil during the drought. A family in the search of new hope and destiny.',
    posterUrl: tmdbPoster('bBb4GiCZul2W6hhV8sbbnBnlhuE'),
    genres: ['Drama'],
    directors: ['Nelson Pereira dos Santos'],
    writers: ['Nelson Pereira dos Santos'],
    cast: [
      'Átila Iório',
      'Maria Ribeiro',
      'Gilvan Lima',
      'Genivaldo Lima',
      'Orlando Macedo',
      'Jofre Soares',
    ],
  },
  // https://www.themoviedb.org/movie/989
  {
    title: 'The Mortal Storm',
    releaseDate: '1940-06-20',
    runtimeMinutes: 100,
    synopsis:
      'The Roth family leads a quiet life in a small village in the German Alps during the early 1930s. After the Nazis come to power, the family is divided and Martin Breitner, a family friend, is caught up in the turmoil.',
    posterUrl: tmdbPoster('xPvS7UVrJuCyE5NsiDkW39ABLGX'),
    genres: ['Drama'],
    directors: ['Frank Borzage'],
    writers: ['Claudine West', 'George Froeschel', 'Hans Rameau'],
    cast: [
      'Margaret Sullavan',
      'James Stewart',
      'Robert Young',
      'Frank Morgan',
      'Robert Stack',
      'Bonita Granville',
    ],
  },
  // https://www.themoviedb.org/movie/1363
  {
    title: 'The Hi-Lo Country',
    releaseDate: '1998-12-30',
    runtimeMinutes: 114,
    synopsis:
      'An intimate story of the enduring bond of friendship between two hard-living men, set against a sweeping backdrop: the American West, post-World War II, in its twilight. Pete and Big Boy are masters of the prairie, but ultimately face trickier terrain: the human heart.',
    posterUrl: tmdbPoster('1bC63XzaUEWJArFUQFKwUy77lZS'),
    genres: ['Drama', 'Romance', 'Western'],
    directors: ['Stephen Frears'],
    writers: ['Walon Green'],
    cast: [
      'Billy Crudup',
      'Woody Harrelson',
      'Penélope Cruz',
      'Patricia Arquette',
      'Cole Hauser',
      'John Diehl',
    ],
  },
  // https://www.themoviedb.org/movie/1416
  {
    title: 'The Coast Guard',
    releaseDate: '2002-11-22',
    runtimeMinutes: 96,
    synopsis:
      'A member of Coast Guard Platoon 23, Private Kang monitors a high-infiltration stretch of beach lined with barbed-wire fencing. Driven by the belief that killing a spy is the highest honor, he waits for a chance to prove his worth.',
    posterUrl: tmdbPoster('ezHR68DZeyKgRraAZd3eGCgmIl'),
    genres: ['Drama', 'War'],
    directors: ['Kim Ki-duk'],
    writers: ['Kim Ki-duk'],
    cast: ['Jang Dong-gun', 'Kim Jung-hak', 'Park Ji-a', 'Yoo Hai-jin', 'Jung Jin', 'Kim Koo-taek'],
  },
  // https://www.themoviedb.org/movie/407
  {
    title: 'Short Sharp Shock',
    releaseDate: '1998-10-15',
    runtimeMinutes: 100,
    synopsis:
      'Gabriel, Bobby and Costa are old friends from Altona, a multicultural hood in Hamburg. Just out of prison, Gabriel wants to turn his back on crime, but the others continue to operate as petty criminals. Friendships are tested as the trio navigate a dark world of mafia bosses and deals gone wrong.',
    posterUrl: tmdbPoster('cVyYb5REN5cX5CWAr7wcdu7cT4Y'),
    genres: ['Crime', 'Drama'],
    directors: ['Fatih Akin'],
    writers: ['Fatih Akin'],
    cast: [
      'Mehmet Kurtuluş',
      'Aleksandar Jovanović',
      'Adam Bousdoukos',
      'Regula Grauwiller',
      'İdil Üner',
      'Ralph Herforth',
    ],
  },
  // https://www.themoviedb.org/movie/225
  {
    title: 'Man of Iron',
    releaseDate: '1981-07-27',
    runtimeMinutes: 147,
    synopsis:
      'In Warsaw in 1980, the Communist Party sends disgruntled radio reporter Winkel to Gdańsk to dig up dirt on the shipyard strikers - particularly on Maciek Tomczyk, an independent labour union leader whose father was killed in the December 1970 protests. Posing as sympathetic, Winkel interviews the people surrounding Tomczyk, including his detained wife, Agnieszka.',
    posterUrl: tmdbPoster('22wNUqKyz2m6wzAt31f26H8Y433'),
    genres: ['Drama', 'History'],
    directors: ['Andrzej Wajda'],
    writers: ['Aleksander Ścibor-Rylski'],
    cast: [
      'Jerzy Radziwiłowicz',
      'Krystyna Janda',
      'Marian Opania',
      'Irena Byrska',
      'Wiesława Kosmalska',
      'Bogusław Linda',
    ],
  },
  // https://www.themoviedb.org/movie/1127
  {
    title: 'Princesses',
    releaseDate: '2005-09-02',
    runtimeMinutes: 113,
    synopsis:
      "Caye is a young prostitute whose family is unaware of her profession. She meets her striking Dominican neighbour Zulema, an illegal immigrant, after she finds her in the bathroom, badly beaten up. They strike up a close friendship unbeknownst to Caye's xenophobic co-workers.",
    posterUrl: tmdbPoster('bMW8v2uhR8pwKXoxa10nq8U3pGD'),
    genres: ['Drama'],
    directors: ['Fernando León de Aranoa'],
    writers: ['Fernando León de Aranoa'],
    cast: [
      'Candela Peña',
      'Micaela Nevárez',
      'Mariana Cordero',
      'Llum Barrera',
      'Violeta Pérez',
      'Mònica van Campen',
    ],
  },
  // https://www.themoviedb.org/movie/224
  {
    title: 'Man of Marble',
    releaseDate: '1977-02-25',
    runtimeMinutes: 153,
    synopsis:
      'A young Polish filmmaker sets out to find out what happened to Mateusz Birkut, a bricklayer who became a propaganda hero in the 1950s but later fell out of favor and disappeared.',
    posterUrl: tmdbPoster('dQWfBHQmdQbcUAeyr0VS1j19uto'),
    genres: ['Drama'],
    directors: ['Andrzej Wajda'],
    writers: ['Aleksander Ścibor-Rylski'],
    cast: [
      'Krystyna Janda',
      'Jerzy Radziwiłowicz',
      'Tadeusz Łomnicki',
      'Jacek Lomnicki',
      'Michał Tarkowski',
      'Piotr Cieślak',
    ],
  },
  // https://www.themoviedb.org/movie/321
  {
    title: 'Mambo Italiano',
    releaseDate: '2003-06-06',
    runtimeMinutes: 89,
    synopsis:
      'When an Italian man comes out of the closet, it affects both his life and his crazy family.',
    posterUrl: tmdbPoster('siYFoZUq0HOCksnOc7me8YT1AOo'),
    genres: ['Comedy', 'Romance'],
    directors: ['Émile Gaudreault'],
    writers: ['Émile Gaudreault', 'Steve Galluccio'],
    cast: [
      'Luke Kirby',
      'Ginette Reno',
      'Paul Sorvino',
      'Mary Walsh',
      'Peter Miller',
      'Claudia Ferri',
    ],
  },
  // https://www.themoviedb.org/movie/1411
  {
    title: 'The Rapture',
    releaseDate: '1991-10-04',
    runtimeMinutes: 100,
    synopsis:
      'A lonely telephone operator leading an empty, amoral life finds God – only to have her faith continually tested in ways beyond what she could have imagined.',
    posterUrl: tmdbPoster('4EkFm13ecqO0eszr7OKT8vf1YjJ'),
    genres: ['Mystery', 'Drama', 'Fantasy', 'Thriller'],
    directors: ['Michael Tolkin'],
    writers: ['Michael Tolkin'],
    cast: [
      'Mimi Rogers',
      'David Duchovny',
      'Patrick Bauchau',
      'Kimberly Cullum',
      'Will Patton',
      'Terri Hanauer',
    ],
  },
  // https://www.themoviedb.org/movie/317
  {
    title: 'Grbavica: The Land of My Dreams',
    releaseDate: '2006-03-01',
    runtimeMinutes: 90,
    synopsis:
      'A woman and her daughter struggle to make their way through the aftermath of the Balkan war.',
    posterUrl: tmdbPoster('hzLRMGaQ9v3QDMSimCE12aBtJzG'),
    genres: ['Drama', 'History'],
    directors: ['Jasmila Žbanić'],
    writers: ['Jasmila Žbanić', 'Barbara Albert'],
    cast: [
      'Mirjana Karanović',
      'Luna Mijović',
      'Leon Lučev',
      'Kenan Ćatić',
      'Jasna Beri',
      'Dejan Aćimović',
    ],
  },
  // https://www.themoviedb.org/movie/1435
  {
    title: 'Tarnation',
    releaseDate: '2003-10-19',
    runtimeMinutes: 91,
    synopsis:
      "Filmmaker Jonathan Caouette's documentary on growing up with his schizophrenic mother -- a mixture of snapshots, Super-8, answering machine messages, video diaries, early short films, and more -- culled from 19 years of his life.",
    posterUrl: tmdbPoster('7zeQapdvD8poOizcaHwzmPxN9Km'),
    genres: ['Documentary', 'Drama'],
    directors: ['Jonathan Caouette'],
    writers: ['Jonathan Caouette'],
    cast: [
      'Renee Leblanc',
      'Adolph Davis',
      'Jonathan Caouette',
      'Rosemary Davis',
      'David Sanin Paz',
    ],
  },
  // https://www.themoviedb.org/movie/511
  {
    title: 'The Promised Land',
    releaseDate: '1975-02-21',
    runtimeMinutes: 179,
    synopsis:
      'At the turn of the century, Lodz, Poland, was a quick-paced manufacturing center for textiles, replete with cutthroat industrialists and unsafe working conditions. Three young friends, a Pole, a Jew, and a German, pool their money together to build a factory.',
    posterUrl: tmdbPoster('pjk8K5MpQJX0XczTC2KOVWNj0lC'),
    genres: ['Drama', 'History'],
    directors: ['Andrzej Wajda'],
    writers: ['Andrzej Wajda'],
    cast: [
      'Daniel Olbrychski',
      'Wojciech Pszoniak',
      'Andrzej Seweryn',
      'Kalina Jędrusik',
      'Anna Nehrebecka',
      'Bożena Dykiel',
    ],
  },
  // https://www.themoviedb.org/movie/1256
  {
    title: 'Dead in 3 Days',
    releaseDate: '2006-07-21',
    runtimeMinutes: 97,
    synopsis:
      'When Nina and her high school friends receive eerie text messages declaring that they will all die within three days, they dismiss it as a hokey prank - until one by one, the pals start turning up dead in the alpine countryside. With the cops stymied, Nina and her remaining friends must scour their past for clues to identify the madman before he kills them all.',
    posterUrl: tmdbPoster('9OqDWRgUDtrkLZ57RwyMz8NzV81'),
    genres: ['Horror', 'Thriller'],
    directors: ['Andreas Prochaska'],
    writers: ['Andreas Prochaska', 'Thomas Baum'],
    cast: [
      'Sabrina Reiter',
      'Michael Steinocher',
      'Laurence Rupp',
      'Nadja Vogel',
      'Karl Fischer',
      'Michou Friesz',
    ],
  },
  // https://www.themoviedb.org/movie/493
  {
    title: "Shaft's Big Score!",
    releaseDate: '1972-06-21',
    runtimeMinutes: 105,
    synopsis:
      'John Shaft is back as the lady-loved black detective cop on the search for the murderer of a client.',
    posterUrl: tmdbPoster('9iNj96mEU66sRi1aCRDzglDUaGn'),
    genres: ['Crime', 'Thriller', 'Drama', 'Action'],
    directors: ['Gordon Parks'],
    writers: ['Ernest Tidyman'],
    cast: [
      'Richard Roundtree',
      'Moses Gunn',
      'Drew Bundini Brown',
      'Joseph Mascolo',
      'Kathy Imrie',
      'Wally Taylor',
    ],
  },
  // https://www.themoviedb.org/movie/494
  {
    title: 'Shaft in Africa',
    releaseDate: '1973-06-20',
    runtimeMinutes: 112,
    synopsis:
      'Detective John Shaft travels incognito to Ethiopia, then France, to bust a human trafficking ring.',
    posterUrl: tmdbPoster('z6yYpJBuRd1j5kldYd9vjbv9xfq'),
    genres: ['Adventure', 'Crime', 'Thriller', 'Action'],
    directors: ['John Guillermin'],
    writers: ['Stirling Silliphant'],
    cast: [
      'Richard Roundtree',
      'Frank Finlay',
      'Vonetta McGee',
      'Neda Arnerić',
      'Debebe Eshetu',
      'Spiros Focás',
    ],
  },
  // https://www.themoviedb.org/movie/1264
  {
    title: 'The Wild Soccer Bunch 4',
    releaseDate: '2007-02-01',
    runtimeMinutes: 110,
    synopsis:
      'With the victory against "The Beastly Beasts", "The Wild Soccer Bunch" showed it to everyone and then won every single game. Only one victory now separates them from the "Pott", the Freestyle Soccer Cup. For this they have to compete against the "Wolves of Ragnarök". But the wolves are not normal opponents! They have a dark secret - and behind them lurks a power stronger than all of them: the girl Horizon and the "Silver Lights" from the fog...',
    posterUrl: tmdbPoster('hfTuyoAIE6KtrrwAW26NXBXVFJI'),
    genres: ['Comedy', 'Family', 'Adventure'],
    directors: ['Joachim Masannek'],
    writers: ['Joachim Masannek'],
    cast: [
      'Jimi Blue Ochsenknecht',
      'Wilson Gonzalez Ochsenknecht',
      'Sarah Kim Gries',
      'Nick Romeo Reimann',
      'Marlon Wessel',
      'Leon Wessel-Masannek',
    ],
  },
  // https://www.themoviedb.org/movie/685
  {
    title: 'Olympia Part Two: Festival of Beauty',
    releaseDate: '1938-06-02',
    runtimeMinutes: 104,
    synopsis:
      "Part two of Leni Riefenstahl's monumental examination of the 1938 Olympic Games, the cameras leave the main stadium and venture into the many halls and fields deployed for such sports as fencing, polo, cycling, and the modern pentathlon, which was won by American Glenn Morris.",
    posterUrl: tmdbPoster('oleIfZJ4NZebY9ETjoaZoTXYDLb'),
    genres: ['Documentary'],
    directors: ['Leni Riefenstahl'],
    writers: ['Leni Riefenstahl'],
    cast: [
      'Sheigo Arai',
      'Albert Bachmann',
      'Daniel Barrow',
      'Jack Beresford',
      'Ralf Berzsenyi',
      'Ferenc Csík',
    ],
  },
  // https://www.themoviedb.org/movie/312
  {
    title: 'Beyond Silence',
    releaseDate: '1996-12-18',
    runtimeMinutes: 109,
    synopsis:
      'Beyond Silence is about a family and a young girl’s coming of age story. This German film looks into the lives of the deaf and at a story about the love for music. A girl who has always had to translate speech into sign language for her deaf parents yet when her love for playing music grows strong she must decide to continue doing something she cannot share with her parents.',
    posterUrl: tmdbPoster('bfNOcXDcwzKOlJoTtQM4lsEVxS1'),
    genres: ['Drama', 'Music'],
    directors: ['Caroline Link'],
    writers: ['Caroline Link', 'Beth Serlin'],
    cast: [
      'Sylvie Testud',
      'Tatjana Trieb',
      'Howie Seago',
      'Emmanuelle Laborit',
      'Sibylle Canonica',
      'Matthias Habich',
    ],
  },
  // https://www.themoviedb.org/movie/1560
  {
    title: 'Singapore Sling',
    releaseDate: '1990-12-06',
    runtimeMinutes: 112,
    synopsis:
      'Singapore Sling is chasing after Laura, a romantic memory from his past. One night he finds himself in a mysterious villa, watching two women bury a body. He falls into their trap and, in an atmosphere of isolation and decadence, the trio act out insane pleasure games and a ritual of blood and murder.',
    posterUrl: tmdbPoster('btTYcALtXvE9j8xjvlGOnLT1cQI'),
    genres: ['Comedy', 'Horror', 'Drama'],
    directors: ['Nikos Nikolaidis'],
    writers: ['Nikos Nikolaidis'],
    cast: ['Meredyth Herold', 'Michele Valley', 'Panos Thanassoulis', 'John E. Regan'],
  },
  // https://www.themoviedb.org/movie/1393
  {
    title: 'The Cave of the Yellow Dog',
    releaseDate: '2005-07-27',
    runtimeMinutes: 93,
    synopsis:
      'The little nomad girl, Nansal, finds a baby dog in the Mongolian veld, who becomes her best friend - against all rejections of her parents. A story about a Mongolian family of nomads - their traditional way of life and the rising call of the City.',
    posterUrl: tmdbPoster('f4FNp6mb5Lh02vno2ujkGJX9tfl'),
    genres: ['Drama'],
    directors: ['Byambasuren Davaa'],
    writers: ['Byambasuren Davaa'],
    cast: [
      'Batchuluun Urjindorj',
      'Buyandulam Daramdadi',
      'Nansal Batchuluun',
      'Nansalmaa Batchuluun',
      'Batbayar Batchuluun',
      'Tserenpuntsag Ish',
    ],
  },
  // https://www.themoviedb.org/movie/139
  {
    title: 'Mifune',
    releaseDate: '1999-03-12',
    runtimeMinutes: 98,
    synopsis:
      'Kresten, newly wed, is on the threshold of a great career success in his father-in-law’s company. But when the death of his own father takes him back to his poverty-stricken childhood home, far out in the country, his career plans fall apart. For one thing he has to deal with his loveable, backward brother, who is now all alone; for another, he meets a stunning woman who comes to the farm as a housekeeper, in disguise of her real profession as a call-girl.',
    posterUrl: tmdbPoster('qEg7dmFcPqjF5kBYD0Bkz2CVyYB'),
    genres: ['Drama', 'Comedy', 'Romance'],
    directors: ['Søren Kragh-Jacobsen'],
    writers: ['Søren Kragh-Jacobsen', 'Anders Thomas Jensen'],
    cast: [
      'Anders W. Berthelsen',
      'Iben Hjejle',
      'Jesper Asholt',
      'Sofie Gråbøl',
      'Emil Tarding',
      'Anders Hove',
    ],
  },
  // https://www.themoviedb.org/movie/1050
  {
    title: 'Shower',
    releaseDate: '1999-09-13',
    runtimeMinutes: 92,
    synopsis:
      'An aged father and his younger, mentally challenged son have been working hard every day to keep the bathhouse running for a motley group of regular customers. When his elder son, who left years ago to seek his fortune in the southern city of Shenzhen, abruptly returns one day, it once again puts under stress the long-broken father-son ties. Presented as a light-hearted comedy, Shower explores the value of family, friendship, and tradition.',
    posterUrl: tmdbPoster('wAEmh0m4RSDQrby64REzZJLCSH5'),
    genres: ['Comedy', 'Drama'],
    directors: ['Zhang Yang'],
    writers: ['Zhang Yang', 'Cai Shangjun', 'Diao Yinan', 'Liu Fendou', 'Xin Huo'],
    cast: ['Zhu Xu', 'Pu Cunxin', 'Jiang Wu', 'Li Ding', 'Feng Shun', 'He Bing'],
  },
  // https://www.themoviedb.org/movie/932
  {
    title: 'The Murderers Are Among Us',
    releaseDate: '1946-10-15',
    runtimeMinutes: 81,
    synopsis:
      'After returning from a concentration camp, Susanne finds a traumatized ex-soldier living in her apartment in bombed out Berlin. Together the two try to move past their experiences during WWII.',
    posterUrl: tmdbPoster('xdkYKcmMSGNvRBoIzmYQQ4CLesz'),
    genres: ['Drama', 'Romance', 'Thriller'],
    directors: ['Wolfgang Staudte'],
    writers: ['Wolfgang Staudte'],
    cast: [
      'Hildegard Knef',
      'Wilhelm Borchert',
      'Arno Paulsen',
      'Robert Forsch',
      'Albert Johannes',
      'Ursula Krieg',
    ],
  },
  // https://www.themoviedb.org/movie/513
  {
    title: 'Fire',
    releaseDate: '1997-08-22',
    runtimeMinutes: 108,
    synopsis:
      "In a barren, arranged marriage to an amateur swami who seeks enlightenment through celibacy, Radha's life takes an irresistible turn when her beautiful young sister-in-law seeks to free herself from the confines of her own loveless marriage.",
    posterUrl: tmdbPoster('jDUCcZ7bBkqhbZ8R0vml3YUd4GG'),
    genres: ['Drama', 'Romance'],
    directors: ['Deepa Mehta'],
    writers: ['Deepa Mehta'],
    cast: [
      'Nandita Das',
      'Shabana Azmi',
      'Javed Jaffrey',
      'Kulbhushan Kharbanda',
      'Kushal Rekhi',
      'Ranjit Chowdhry',
    ],
  },
  // https://www.themoviedb.org/movie/1277
  {
    title: 'Gloomy Sunday',
    releaseDate: '1999-10-21',
    runtimeMinutes: 112,
    synopsis:
      'Budapest in the 1930s. Restaurant owner Laszlo hires pianist András to play in his restaurant. Both men fall in love with the beautiful waitress Ilona who inspires András to his only composition. His song of Gloomy Sunday is, at first, loved and then feared, for its melancholic melody sets off a chain of suicides. The fragile balance of the erotic ménage à trois is sent off kilter when the German Hans falls in love with Ilona as well.',
    posterUrl: tmdbPoster('7cjNxmJUmz3gaaN6LYRJuEYtaKe'),
    genres: ['Drama', 'Romance'],
    directors: ['Rolf Schübel'],
    writers: ['Rolf Schübel', 'Ruth Toma'],
    cast: [
      'Marozsán Erika',
      'Joachim Król',
      'Ben Becker',
      'Stefano Dionisi',
      'András Bálint',
      'Géza Boros',
    ],
  },
  // https://www.themoviedb.org/movie/1419
  {
    title: 'Vollidiot',
    releaseDate: '2007-04-11',
    runtimeMinutes: 102,
    synopsis:
      "Based on Tommy Jaud's bestselling novel, this comedy focuses on a dispassionate clerk and his set-backs in life. 29-year-old Simon works in a phone shop, but his thoughts just circle around finding a new girl-friend after being left by his last one year ago. While his Croatian cleaner tries to procure him, his efforts to chat up women in clubs also fail. However, he finds the woman of his dreams (and mother of their future children) in his most hated coffee shop, although not having a clue how to win her heart...",
    posterUrl: tmdbPoster('bbtlSUOiNLEV1JvS99WtwKpBtE5'),
    genres: ['Comedy', 'Drama'],
    directors: ['Tobi Baumann'],
    writers: ['Tommy Jaud', 'Christian Zübert'],
    cast: [
      'Oliver Pocher',
      'Oliver Fleischer',
      'Tanja Wenzel',
      'Tomas Spencer',
      'Anke Engelke',
      'Adriana Altaras',
    ],
  },
  // https://www.themoviedb.org/movie/191
  {
    title: 'The State I Am In',
    releaseDate: '2001-02-01',
    runtimeMinutes: 106,
    synopsis:
      'Clara and Hans are left-wing terrorists who have been sought by police for almost fifteen years. Their increasingly rebellious daughter Jeanne begins to pose a threat to their security when she falls in love with a boy she meets on the beach.',
    posterUrl: tmdbPoster('wQoYYvXYaeZNsGPtP1vvvyTmuhF'),
    genres: ['Drama'],
    directors: ['Christian Petzold'],
    writers: ['Christian Petzold', 'Harun Farocki'],
    cast: [
      'Julia Hummer',
      'Barbara Auer',
      'Richy Müller',
      'Bilge Bingul',
      'Rogério Jacques',
      'Maria João',
    ],
  },
  // https://www.themoviedb.org/movie/1718
  {
    title: 'Santa Fe Trail',
    releaseDate: '1940-12-20',
    runtimeMinutes: 110,
    synopsis:
      "As a penalty for fighting fellow classmates days before graduating from West Point, J.E.B. Stuart, George Armstrong Custer and four friends are assigned to the 2nd Cavalry, stationed at Fort Leavenworth. While there they aid in the capture and execution of the abolitionist, John Brown following the Battle of Harper's Ferry.",
    posterUrl: tmdbPoster('uBtJzonmF9uOFrDXlqQuxTfMwl7'),
    genres: ['Western'],
    directors: ['Michael Curtiz'],
    writers: ['Robert Buckner'],
    cast: [
      'Errol Flynn',
      'Olivia de Havilland',
      'Raymond Massey',
      'Ronald Reagan',
      'Alan Hale',
      'William Lundigan',
    ],
  },
  // https://www.themoviedb.org/movie/442
  {
    title: 'Popular Music',
    releaseDate: '2004-10-01',
    runtimeMinutes: 105,
    synopsis:
      'Matti and Niila, growing up in the mid-sixties in the harsh and conservative environment of a Finnish-speaking part of Tornedalen in Swedish Laponia, close to the Finnish border. Their big dream is to become rock stars. In the present the now grown-up Matti feels guilt for the death of his drug-addicted rock star friend Niila.',
    posterUrl: tmdbPoster('79nUxKn6kPagIOHcOMsev3UxT38'),
    genres: ['Comedy', 'Drama'],
    directors: ['Reza Bagher'],
    writers: ['Reza Bagher', 'Erik Norberg'],
    cast: [
      'Max Enderfors',
      'Andreas af Enehielm',
      'Niklas Ulfvarson',
      'Tommy Vallikari',
      'Jarmo Mäkinen',
      'Kati Outinen',
    ],
  },
  // https://www.themoviedb.org/movie/410
  {
    title: 'Summer in Berlin',
    releaseDate: '2005-09-09',
    runtimeMinutes: 105,
    synopsis:
      'An intimate study of two women friends who come to each other because of troubles with everyday life and with men and thus try to enjoy a life based on their ideas.',
    posterUrl: tmdbPoster('9zu21w5SwWDSHZI7P5fv8wJqUz5'),
    genres: ['Comedy', 'Drama'],
    directors: ['Andreas Dresen'],
    writers: ['Wolfgang Kohlhaase'],
    cast: [
      'Inka Friedrich',
      'Nadja Uhl',
      'Andreas Schmidt',
      'Vincent Redetzki',
      'Stephanie Schönfeld',
      'Christel Peters',
    ],
  },
  // https://www.themoviedb.org/movie/1387
  {
    title: 'Superstar: The Karen Carpenter Story',
    releaseDate: '1987-07-15',
    runtimeMinutes: 43,
    synopsis:
      'The final 17 years of American singer and musician Karen Carpenter, performed almost entirely by modified Barbie dolls.',
    posterUrl: tmdbPoster('8kMRTa9K442K1D5d0tQYqyFsZh9'),
    genres: ['Drama', 'Music', 'History'],
    directors: ['Todd Haynes'],
    writers: ['Todd Haynes', 'Cynthia Schneider'],
    cast: [
      'Merrill Gruver',
      'Michael Edwards',
      'Melissa Brown',
      'Rob LaBelle',
      'Cynthia Schneider',
      'Todd Haynes',
    ],
  },
  // https://www.themoviedb.org/movie/460
  {
    title: 'Go for Zucker',
    releaseDate: '2004-12-31',
    runtimeMinutes: 91,
    synopsis:
      'Germany director Dani Levy filmed this comedy about Jewish life in today’s Germany along side the familiar east-west conflict. With it great success this film is a joyful comedy of humor and knowledge.',
    posterUrl: tmdbPoster('sDAVHwXZI3yMSBOqjZGtiEyfhQt'),
    genres: ['Comedy'],
    directors: ['Dani Levy'],
    writers: ['Dani Levy', 'Holger Franke'],
    cast: [
      'Henry Hübchen',
      'Hannelore Elsner',
      'Udo Samel',
      'Gołda Tencer',
      'Steffen Groth',
      'Anja Franke',
    ],
  },
  // https://www.themoviedb.org/movie/434
  {
    title: 'Tough Enough',
    releaseDate: '2006-03-09',
    runtimeMinutes: 98,
    synopsis:
      'From the youth directed novel of the same name by Greogor Tressnow comes a film by Detlev Buck that is a realistic portrait of life in the section of Berlin called Neukölln. It’s about power and weakness, delinquents and victims, and the difficulties a 15-year-old faces in a poor and criminal environment.',
    posterUrl: tmdbPoster('3HcEEKSNs2m4k8ghZ9cgTaSfyoF'),
    genres: ['Drama', 'Thriller'],
    directors: ['Detlev Buck'],
    writers: ['Gregor Tressnow', 'Zoran Drvenkar'],
    cast: [
      'David Kross',
      'Jenny Elvers',
      'Erhan Emre',
      'Oktay Özdemir',
      'Kida Khodr Ramadan',
      'Arnel Taci',
    ],
  },
  // https://www.themoviedb.org/movie/286
  {
    title: "Germany: A Summer's Fairytale",
    releaseDate: '2006-10-03',
    runtimeMinutes: 110,
    synopsis:
      'A documentary of the German national soccer team’s 2006 World Cup experience that changed the face of modern Germany.',
    posterUrl: tmdbPoster('pQ7p8zGxy0OTy6RwDA0Y2mlqmdu'),
    genres: ['Documentary'],
    directors: ['Sönke Wortmann'],
    writers: ['Sönke Wortmann'],
    cast: [
      'Jürgen Klinsmann',
      'Joachim Löw',
      'Andreas Köpke',
      'Oliver Bierhoff',
      'Jens Lehmann',
      'Oliver Kahn',
    ],
  },
  // https://www.themoviedb.org/movie/781
  {
    title: 'Winter Sleepers',
    releaseDate: '1997-10-30',
    runtimeMinutes: 120,
    synopsis:
      "Young blonde translator Rebecca lives with her boyfriend ski instructor Marco in a mountain villa owned by her friend, nurse Laura. Rene, local cinema projectionist, steals Marco's car and gets into a car crash with local Theo, whose daughter, after being in coma for a time, dies. Rene suffers from partial short term memory loss and starts a relationship with Laura. Meanwhile Marco is looking for the man who stole his car and Theo - for the man who killed his daughter...",
    posterUrl: tmdbPoster('9eSSVuhQ197uSzhgkuW8rKGQ1bo'),
    genres: ['Drama', 'Romance'],
    directors: ['Tom Tykwer'],
    writers: ['Tom Tykwer'],
    cast: [
      'Ulrich Matthes',
      'Marie-Lou Sellem',
      'Floriane Daniel',
      'Heino Ferch',
      'Josef Bierbichler',
      'Laura Tonke',
    ],
  },
  // https://www.themoviedb.org/movie/8773
  {
    title: 'Love at Twenty',
    releaseDate: '1962-06-22',
    runtimeMinutes: 120,
    synopsis:
      'Love at Twenty unites five directors from five different countries to present their different perspectives on what love really is at the age of 20. The episodes are united with the score of Georges Delerue and still photos of Henri Cartier-Bresson.',
    posterUrl: tmdbPoster('aup2QCYCsyEeQfpboXy0f4uj8aE'),
    genres: ['Drama', 'Romance'],
    directors: [
      'Marcel Ophüls',
      'Renzo Rossellini',
      'François Truffaut',
      'Shintarō Ishihara',
      'Andrzej Wajda',
    ],
    writers: [
      'Marcel Ophüls',
      'Renzo Rossellini',
      'François Truffaut',
      'Shintarō Ishihara',
      'Jerzy Stefan Stawiński',
      'Yvon Samuel',
    ],
    cast: [
      'Jean-Pierre Léaud',
      'Marie-France Pisier',
      'Patrick Auffay',
      'Rosy Varte',
      'François Darbon',
      'Jean-François Adam',
    ],
  },
  // https://www.themoviedb.org/movie/1595
  {
    title: 'Land of Plenty',
    releaseDate: '2004-09-10',
    runtimeMinutes: 123,
    synopsis:
      'After living abroad, Lana returns to the United States, and finds that her uncle is a reclusive vagabond with psychic wounds from the Vietnam War.',
    posterUrl: tmdbPoster('oK8z5rPlEjhGBiHk2OqE3bIhyol'),
    genres: ['Drama'],
    directors: ['Wim Wenders'],
    writers: ['Wim Wenders', 'Michael Meredith'],
    cast: [
      'Michelle Williams',
      'John Diehl',
      'Shaun Toub',
      'Burt Young',
      'Jeris Poindexter',
      'Wendell Pierce',
    ],
  },
  // https://www.themoviedb.org/movie/706
  {
    title: 'Effi Briest',
    releaseDate: '1974-06-20',
    runtimeMinutes: 141,
    synopsis:
      'When 17-year-old Effi Briest marries the elderly Baron von Instetten, she moves to a small, isolated Baltic town and a house that she fears is haunted. Starved for companionship, Effi begins a friendship with Major Crampas, a charismatic womanizer.',
    posterUrl: tmdbPoster('wgQvixpxtDCQPprGaVJOTas9n4'),
    genres: ['History', 'Drama'],
    directors: ['Rainer Werner Fassbinder'],
    writers: ['Rainer Werner Fassbinder'],
    cast: [
      'Hanna Schygulla',
      'Wolfgang Schenck',
      'Ulli Lommel',
      'Lilo Pempeit',
      'Herbert Steinmetz',
      'Ursula Strätz',
    ],
  },
  // https://www.themoviedb.org/movie/1543
  {
    title: "Emma's Bliss",
    releaseDate: '2006-07-16',
    runtimeMinutes: 103,
    synopsis:
      'Upon being informed that he is fatally ill with cancer, Max, who works at a used car store, steals money which his boss has gained through illegal means. When fleeing from the scene of the crime Max crashes his car. He is pulled unconscious from the destroyed vehicle by a homely young woman, Emma, who lives alone on a farm where Max decides to stay in order to hide from the police and his boss.',
    posterUrl: tmdbPoster('56shiMeNu2OJNU03eXgQrPYhNx'),
    genres: ['Drama', 'Romance'],
    directors: ['Sven Taddicken'],
    writers: ['Claudia Schreiber', 'Ruth Toma'],
    cast: [
      'Jördis Triebel',
      'Jürgen Vogel',
      'Hinnerk Schönemann',
      'Martin Feifel',
      'Karin Neuhäuser',
      'Nina Petri',
    ],
  },
]

export type SeedPerson = {
  /** `YYYY-MM-DD`, or null where the seed does not record one. */
  birthDate: string | null
  bio: string | null
}

/**
 * Profiles for selected people credited in `SEED_MOVIES`. Headshots are not seeded: there is no
 * free public source, and one uploaded in development survives a re-seed.
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

/** Every person credited in `SEED_MOVIES`, once, with any available profile from `SEED_PEOPLE`. */
export const seedPeople = (): (SeedPerson & { name: string })[] => {
  const names = new Set<string>()
  for (const movie of SEED_MOVIES) {
    for (const name of [...movie.directors, ...movie.writers, ...movie.cast]) {
      names.add(name)
    }
  }
  return [...names].map((name) => {
    const profile = SEED_PEOPLE[name] ?? { birthDate: null, bio: null }
    return { name, ...profile }
  })
}
