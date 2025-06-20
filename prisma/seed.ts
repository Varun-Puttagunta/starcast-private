import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const modules = [
  {
    id: 1,
    title: "The Solar System",
    description: "Learn about our cosmic neighborhood",
    lessons: [
      {
        id: "1.1",
        title: "The Sun",
        link: "https://spaceplace.nasa.gov/",
        question: "What powers the Sun's energy?",
        answers: JSON.stringify([
          "Combustion",
          "Solar panels",
          "Nuclear fusion",
          "Static electricity"
        ]),
        correctAnswer: "Nuclear fusion"
      },
      {
        id: "1.2",
        title: "Inner Planets",
        link: "https://solarsystem.nasa.gov/planets/overview/",
        question: "Which of the following is an inner planet?",
        answers: JSON.stringify([
          "Neptune",
          "Mars",
          "Jupiter",
          "Uranus"
        ]),
        correctAnswer: "Mars"
      },
      {
        id: "1.3",
        title: "Outer Planets",
        link: "https://solarsystem.nasa.gov/planets/jupiter/overview/",
        question: "Which planet is known for its large red storm?",
        answers: JSON.stringify([
          "Saturn",
          "Uranus",
          "Jupiter",
          "Neptune"
        ]),
        correctAnswer: "Jupiter"
      },
      {
        id: "1.4",
        title: "Dwarf Planets",
        link: "https://solarsystem.nasa.gov/planets/dwarf-planets/overview/",
        question: "What is Pluto classified as?",
        answers: JSON.stringify([
          "Moon",
          "Asteroid",
          "Dwarf planet",
          "Comet"
        ]),
        correctAnswer: "Dwarf planet"
      },
      {
        id: "1.5",
        title: "Asteroids & Comets",
        link: "https://spaceplace.nasa.gov/asteroid-or-comet/en/",
        question: "What's the main difference between asteroids and comets?",
        answers: JSON.stringify([
          "Comets have tails",
          "Asteroids are made of ice",
          "Comets orbit planets",
          "Asteroids are alive"
        ]),
        correctAnswer: "Comets have tails"
      }
    ]
  },
  {
    id: 2,
    title: "Stars & Galaxies",
    description: "Explore the wonders beyond our solar system",
    lessons: [
      {
        id: "2.1",
        title: "Star Formation",
        link: "https://www.esa.int/Science_Exploration/Space_Science/Stars_and_galaxies",
        question: "Where are stars born?",
        answers: JSON.stringify([
          "Black holes",
          "Planetary rings",
          "Nebulae",
          "Comets"
        ]),
        correctAnswer: "Nebulae"
      },
      {
        id: "2.2",
        title: "Star Life Cycle",
        link: "https://spaceplace.nasa.gov/life-of-a-star/en/",
        question: "What does a medium-sized star like the Sun become at the end of its life?",
        answers: JSON.stringify([
          "Supernova",
          "Neutron star",
          "White dwarf",
          "Pulsar"
        ]),
        correctAnswer: "White dwarf"
      },
      {
        id: "2.3",
        title: "Types of Stars",
        link: "https://imagine.gsfc.nasa.gov/science/objects/stars1.html",
        question: "What color are the hottest stars?",
        answers: JSON.stringify([
          "Red",
          "Blue",
          "Yellow",
          "White"
        ]),
        correctAnswer: "Blue"
      },
      {
        id: "2.4",
        title: "Galaxies",
        link: "https://hubblesite.org/contents/articles/galaxies",
        question: "What type of galaxy is the Milky Way?",
        answers: JSON.stringify([
          "Elliptical",
          "Irregular",
          "Spiral",
          "Ring"
        ]),
        correctAnswer: "Spiral"
      },
      {
        id: "2.5",
        title: "Star Clusters",
        link: "https://www.spacetelescope.org/science/star_clusters/",
        question: "What are star clusters?",
        answers: JSON.stringify([
          "Groups of galaxies",
          "Groups of moons",
          "Groups of stars bound by gravity",
          "Floating black holes"
        ]),
        correctAnswer: "Groups of stars bound by gravity"
      }
    ]
  },
  {
    id: 3,
    title: "Telescopes & Observation",
    description: "Learn about the tools we use to study space",
    lessons: [
      {
        id: "3.1",
        title: "History of Telescopes",
        link: "https://spaceplace.nasa.gov/telescopes/en/",
        question: "Who is credited with improving the first astronomical telescope?",
        answers: JSON.stringify([
          "Galileo",
          "Einstein",
          "Hubble",
          "Copernicus"
        ]),
        correctAnswer: "Galileo"
      },
      {
        id: "3.2",
        title: "Types of Telescopes",
        link: "https://science.nasa.gov/toolkit/telescopes/",
        question: "What kind of telescope uses mirrors to collect light?",
        answers: JSON.stringify([
          "Radio",
          "Refracting",
          "Reflecting",
          "Particle"
        ]),
        correctAnswer: "Reflecting"
      },
      {
        id: "3.3",
        title: "How Telescopes Work",
        link: "https://www.exploratorium.edu/light/color/telescopes.html",
        question: "What do telescopes primarily collect to see distant objects?",
        answers: JSON.stringify([
          "Air",
          "Heat",
          "Light",
          "Sound"
        ]),
        correctAnswer: "Light"
      },
      {
        id: "3.4",
        title: "Famous Telescopes",
        link: "https://webb.nasa.gov/content/about/index.html",
        question: "What is the main mission of the James Webb Space Telescope?",
        answers: JSON.stringify([
          "Observe black holes",
          "Find alien life",
          "Look deeper into the early universe",
          "Study Earth's atmosphere"
        ]),
        correctAnswer: "Look deeper into the early universe"
      },
      {
        id: "3.5",
        title: "Observing the Night Sky",
        link: "https://skyandtelescope.org/astronomy-resources/stargazing-basics/",
        question: "What is best for seeing faint deep-sky objects?",
        answers: JSON.stringify([
          "City park",
          "Full moon night",
          "Dark rural area",
          "Indoor planetarium"
        ]),
        correctAnswer: "Dark rural area"
      }
    ]
  },
  {
    id: 4,
    title: "Space Missions",
    description: "Discover humanity's journey to the stars",
    lessons: [
      {
        id: "4.1",
        title: "Early Missions",
        link: "https://www.nasa.gov/specials/apollo50th/",
        question: "What was the first mission to land humans on the Moon?",
        answers: JSON.stringify([
          "Apollo 10",
          "Apollo 11",
          "Apollo 13",
          "Gemini 5"
        ]),
        correctAnswer: "Apollo 11"
      },
      {
        id: "4.2",
        title: "Mars Rovers",
        link: "https://mars.nasa.gov/mars2020/",
        question: "What is the name of NASA's 2020 Mars rover?",
        answers: JSON.stringify([
          "Spirit",
          "Opportunity",
          "Perseverance",
          "Curiosity"
        ]),
        correctAnswer: "Perseverance"
      },
      {
        id: "4.3",
        title: "Space Telescopes",
        link: "https://www.nasa.gov/mission_pages/hubble/main/index.html",
        question: "What does the Hubble Space Telescope primarily observe?",
        answers: JSON.stringify([
          "Weather",
          "Earthquakes",
          "Deep space objects",
          "Ocean currents"
        ]),
        correctAnswer: "Deep space objects"
      },
      {
        id: "4.4",
        title: "The ISS",
        link: "https://www.nasa.gov/mission_pages/station/main/index.html",
        question: "What is the International Space Station used for?",
        answers: JSON.stringify([
          "Mining asteroids",
          "Interstellar travel",
          "Scientific research in space",
          "Planet defense"
        ]),
        correctAnswer: "Scientific research in space"
      },
      {
        id: "4.5",
        title: "Artemis Program",
        link: "https://www.nasa.gov/artemisprogram/",
        question: "What is the goal of the Artemis missions?",
        answers: JSON.stringify([
          "Build a space hotel",
          "Colonize Mars",
          "Return humans to the Moon",
          "Explore the asteroid belt"
        ]),
        correctAnswer: "Return humans to the Moon"
      }
    ]
  },
  {
    id: 5,
    title: "Exoplanets & Life in Space",
    description: "Explore worlds beyond our solar system",
    lessons: [
      {
        id: "5.1",
        title: "What are Exoplanets?",
        link: "https://exoplanets.nasa.gov/what-is-an-exoplanet/overview/",
        question: "What is an exoplanet?",
        answers: JSON.stringify([
          "A type of moon",
          "A planet outside our solar system",
          "A comet fragment",
          "A star"
        ]),
        correctAnswer: "A planet outside our solar system"
      },
      {
        id: "5.2",
        title: "Methods of Detection",
        link: "https://exoplanets.nasa.gov/alien-worlds/ways-to-find-a-planet/",
        question: "What method detects exoplanets by observing a dip in starlight?",
        answers: JSON.stringify([
          "Reflection method",
          "Transit method",
          "Gravity lensing",
          "Radar sweep"
        ]),
        correctAnswer: "Transit method"
      },
      {
        id: "5.3",
        title: "Habitable Zones",
        link: "https://astrobiology.nasa.gov/ask-an-astrobiologist/question/?id=34044",
        question: "What is the habitable zone?",
        answers: JSON.stringify([
          "Area for space stations",
          "Zone for alien life",
          "Region where liquid water might exist",
          "A ring around a planet"
        ]),
        correctAnswer: "Region where liquid water might exist"
      },
      {
        id: "5.4",
        title: "Possibility of Life",
        link: "https://astrobiology.nasa.gov/",
        question: "Which condition is most important for life as we know it?",
        answers: JSON.stringify([
          "Gold color",
          "Fast orbit",
          "Liquid water",
          "Magnetic field"
        ]),
        correctAnswer: "Liquid water"
      },
      {
        id: "5.5",
        title: "Famous Exoplanets",
        link: "https://exoplanets.nasa.gov/exoplanet-catalog/",
        question: "What is Kepler-22b known for?",
        answers: JSON.stringify([
          "First moon found",
          "Gas giant near Earth",
          "First potentially habitable exoplanet discovered",
          "Largest star"
        ]),
        correctAnswer: "First potentially habitable exoplanet discovered"
      }
    ]
  }
]

async function main() {
  // Clear existing data
  await prisma.lesson.deleteMany()
  await prisma.module.deleteMany()

  // Create modules and lessons
  for (const moduleData of modules) {
    const { lessons, ...moduleInfo } = moduleData
    await prisma.module.create({
      data: {
        ...moduleInfo,
        lessons: {
          create: lessons
        }
      }
    })
  }

  console.log('Database has been seeded!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 
