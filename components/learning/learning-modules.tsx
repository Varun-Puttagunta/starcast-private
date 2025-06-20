"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Sun, Star, Telescope, Rocket, Globe2, ChevronRight, ArrowRight, Play } from "lucide-react"
import { useSession } from "next-auth/react"
import { Progress } from "@/components/ui/progress"

interface Module {
  id: number
  title: string
  icon: any
  description: string
  lessons: Lesson[]
}

interface Lesson {
  id: string
  title: string
  link: string
  question: string
  answers: string[]
  correctAnswer: string
}

interface UserProgress {
  completedLessons: string[]
  completedModules: number[]
  lastModule: number
  lastLesson: string
  totalProgress: number
}

const modules: Module[] = [
  {
    id: 1,
    title: "The Solar System",
    icon: Sun,
    description: "Learn about our cosmic neighborhood",
    lessons: [
      {
        id: "1.1",
        title: "The Sun",
        link: "https://spaceplace.nasa.gov/",
        question: "What powers the Sun's energy?",
        answers: [
          "Combustion",
          "Solar panels",
          "Nuclear fusion",
          "Static electricity"
        ],
        correctAnswer: "Nuclear fusion"
      },
      {
        id: "1.2",
        title: "Inner Planets",
        link: "https://solarsystem.nasa.gov/planets/overview/",
        question: "Which of the following is an inner planet?",
        answers: [
          "Neptune",
          "Mars",
          "Jupiter",
          "Uranus"
        ],
        correctAnswer: "Mars"
      },
      {
        id: "1.3",
        title: "Outer Planets",
        link: "https://solarsystem.nasa.gov/planets/jupiter/overview/",
        question: "Which planet is known for its large red storm?",
        answers: [
          "Saturn",
          "Uranus",
          "Jupiter",
          "Neptune"
        ],
        correctAnswer: "Jupiter"
      },
      {
        id: "1.4",
        title: "Dwarf Planets",
        link: "https://solarsystem.nasa.gov/planets/dwarf-planets/overview/",
        question: "What is Pluto classified as?",
        answers: [
          "Moon",
          "Asteroid",
          "Dwarf planet",
          "Comet"
        ],
        correctAnswer: "Dwarf planet"
      },
      {
        id: "1.5",
        title: "Asteroids & Comets",
        link: "https://spaceplace.nasa.gov/asteroid-or-comet/en/",
        question: "What's the main difference between asteroids and comets?",
        answers: [
          "Comets have tails",
          "Asteroids are made of ice",
          "Comets orbit planets",
          "Asteroids are alive"
        ],
        correctAnswer: "Comets have tails"
      }
    ]
  },
  {
    id: 2,
    title: "Stars & Galaxies",
    icon: Star,
    description: "Explore the wonders beyond our solar system",
    lessons: [
      {
        id: "2.1",
        title: "Star Formation",
        link: "https://www.esa.int/Science_Exploration/Space_Science/Stars_and_galaxies",
        question: "Where are stars born?",
        answers: [
          "Black holes",
          "Planetary rings",
          "Nebulae",
          "Comets"
        ],
        correctAnswer: "Nebulae"
      },
      {
        id: "2.2",
        title: "Star Life Cycle",
        link: "https://spaceplace.nasa.gov/life-of-a-star/en/",
        question: "What does a medium-sized star like the Sun become at the end of its life?",
        answers: [
          "Supernova",
          "Neutron star",
          "White dwarf",
          "Pulsar"
        ],
        correctAnswer: "White dwarf"
      },
      {
        id: "2.3",
        title: "Types of Stars",
        link: "https://imagine.gsfc.nasa.gov/science/objects/stars1.html",
        question: "What color are the hottest stars?",
        answers: [
          "Red",
          "Blue",
          "Yellow",
          "White"
        ],
        correctAnswer: "Blue"
      },
      {
        id: "2.4",
        title: "Galaxies",
        link: "https://hubblesite.org/contents/articles/galaxies",
        question: "What type of galaxy is the Milky Way?",
        answers: [
          "Elliptical",
          "Irregular",
          "Spiral",
          "Ring"
        ],
        correctAnswer: "Spiral"
      },
      {
        id: "2.5",
        title: "Star Clusters",
        link: "https://www.spacetelescope.org/science/star_clusters/",
        question: "What are star clusters?",
        answers: [
          "Groups of galaxies",
          "Groups of moons",
          "Groups of stars bound by gravity",
          "Floating black holes"
        ],
        correctAnswer: "Groups of stars bound by gravity"
      }
    ]
  },
  {
    id: 3,
    title: "Telescopes & Observation",
    icon: Telescope,
    description: "Learn about the tools we use to study space",
    lessons: [
      {
        id: "3.1",
        title: "History of Telescopes",
        link: "https://spaceplace.nasa.gov/telescopes/en/",
        question: "Who is credited with improving the first astronomical telescope?",
        answers: [
          "Galileo",
          "Einstein",
          "Hubble",
          "Copernicus"
        ],
        correctAnswer: "Galileo"
      },
      {
        id: "3.2",
        title: "Types of Telescopes",
        link: "https://science.nasa.gov/toolkit/telescopes/",
        question: "What kind of telescope uses mirrors to collect light?",
        answers: [
          "Radio",
          "Refracting",
          "Reflecting",
          "Particle"
        ],
        correctAnswer: "Reflecting"
      },
      {
        id: "3.3",
        title: "How Telescopes Work",
        link: "https://www.exploratorium.edu/light/color/telescopes.html",
        question: "What do telescopes primarily collect to see distant objects?",
        answers: [
          "Air",
          "Heat",
          "Light",
          "Sound"
        ],
        correctAnswer: "Light"
      },
      {
        id: "3.4",
        title: "Famous Telescopes",
        link: "https://webb.nasa.gov/content/about/index.html",
        question: "What is the main mission of the James Webb Space Telescope?",
        answers: [
          "Observe black holes",
          "Find alien life",
          "Look deeper into the early universe",
          "Study Earth's atmosphere"
        ],
        correctAnswer: "Look deeper into the early universe"
      },
      {
        id: "3.5",
        title: "Observing the Night Sky",
        link: "https://skyandtelescope.org/astronomy-resources/stargazing-basics/",
        question: "What is best for seeing faint deep-sky objects?",
        answers: [
          "City park",
          "Full moon night",
          "Dark rural area",
          "Indoor planetarium"
        ],
        correctAnswer: "Dark rural area"
      }
    ]
  },
  {
    id: 4,
    title: "Space Missions",
    icon: Rocket,
    description: "Discover humanity's journey to the stars",
    lessons: [
      {
        id: "4.1",
        title: "Early Missions",
        link: "https://www.nasa.gov/specials/apollo50th/",
        question: "What was the first mission to land humans on the Moon?",
        answers: [
          "Apollo 10",
          "Apollo 11",
          "Apollo 13",
          "Gemini 5"
        ],
        correctAnswer: "Apollo 11"
      },
      {
        id: "4.2",
        title: "Mars Rovers",
        link: "https://mars.nasa.gov/mars2020/",
        question: "What is the name of NASA's 2020 Mars rover?",
        answers: [
          "Spirit",
          "Opportunity",
          "Perseverance",
          "Curiosity"
        ],
        correctAnswer: "Perseverance"
      },
      {
        id: "4.3",
        title: "Space Telescopes",
        link: "https://www.nasa.gov/mission_pages/hubble/main/index.html",
        question: "What does the Hubble Space Telescope primarily observe?",
        answers: [
          "Weather",
          "Earthquakes",
          "Deep space objects",
          "Ocean currents"
        ],
        correctAnswer: "Deep space objects"
      },
      {
        id: "4.4",
        title: "The ISS",
        link: "https://www.nasa.gov/mission_pages/station/main/index.html",
        question: "What is the International Space Station used for?",
        answers: [
          "Mining asteroids",
          "Interstellar travel",
          "Scientific research in space",
          "Planet defense"
        ],
        correctAnswer: "Scientific research in space"
      },
      {
        id: "4.5",
        title: "Artemis Program",
        link: "https://www.nasa.gov/artemisprogram/",
        question: "What is the goal of the Artemis missions?",
        answers: [
          "Build a space hotel",
          "Colonize Mars",
          "Return humans to the Moon",
          "Explore the asteroid belt"
        ],
        correctAnswer: "Return humans to the Moon"
      }
    ]
  },
  {
    id: 5,
    title: "Exoplanets & Life in Space",
    icon: Globe2,
    description: "Explore worlds beyond our solar system",
    lessons: [
      {
        id: "5.1",
        title: "What are Exoplanets?",
        link: "https://exoplanets.nasa.gov/what-is-an-exoplanet/overview/",
        question: "What is an exoplanet?",
        answers: [
          "A type of moon",
          "A planet outside our solar system",
          "A comet fragment",
          "A star"
        ],
        correctAnswer: "A planet outside our solar system"
      },
      {
        id: "5.2",
        title: "Methods of Detection",
        link: "https://exoplanets.nasa.gov/alien-worlds/ways-to-find-a-planet/",
        question: "What method detects exoplanets by observing a dip in starlight?",
        answers: [
          "Reflection method",
          "Transit method",
          "Gravity lensing",
          "Radar sweep"
        ],
        correctAnswer: "Transit method"
      },
      {
        id: "5.3",
        title: "Habitable Zones",
        link: "https://astrobiology.nasa.gov/ask-an-astrobiologist/question/?id=34044",
        question: "What is the habitable zone?",
        answers: [
          "Area for space stations",
          "Zone for alien life",
          "Region where liquid water might exist",
          "A ring around a planet"
        ],
        correctAnswer: "Region where liquid water might exist"
      },
      {
        id: "5.4",
        title: "Possibility of Life",
        link: "https://astrobiology.nasa.gov/",
        question: "Which condition is most important for life as we know it?",
        answers: [
          "Gold color",
          "Fast orbit",
          "Liquid water",
          "Magnetic field"
        ],
        correctAnswer: "Liquid water"
      },
      {
        id: "5.5",
        title: "Famous Exoplanets",
        link: "https://exoplanets.nasa.gov/exoplanet-catalog/",
        question: "What is Kepler-22b known for?",
        answers: [
          "First moon found",
          "Gas giant near Earth",
          "First potentially habitable exoplanet discovered",
          "Largest star"
        ],
        correctAnswer: "First potentially habitable exoplanet discovered"
      }
    ]
  }
]

export function LearningModules() {
  const { data: session } = useSession()
  const [selectedModule, setSelectedModule] = useState<Module | null>(null)
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null)
  const [selectedAnswer, setSelectedAnswer] = useState<string>("")
  const [isAnswered, setIsAnswered] = useState(false)
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const response = await fetch('/api/user-progress')
        if (!response.ok) throw new Error('Failed to fetch progress')
        const data = await response.json()
        setUserProgress(data)
      } catch (error) {
        console.error('Error fetching progress:', error)
        // Initialize with default values if fetch fails
        setUserProgress({
          completedLessons: [],
          completedModules: [],
          lastModule: 0,
          lastLesson: '',
          totalProgress: 0
        })
      }
      setIsLoading(false)
    }
    fetchProgress()
  }, [session])

  const updateProgress = async (lessonId: string, moduleId: number) => {
    if (!session?.user) return

    try {
      const response = await fetch('/api/user-progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lessonId, moduleId }),
      })
      const data = await response.json()
      setUserProgress(data)
    } catch (error) {
      console.error('Error updating progress:', error)
    }
  }

  const handleModuleSelect = (module: Module) => {
    setSelectedModule(module)
    setSelectedLesson(null)
    setSelectedAnswer("")
    setIsAnswered(false)
  }

  const handleLessonSelect = (lesson: Lesson) => {
    setSelectedLesson(lesson)
    setSelectedAnswer("")
    setIsAnswered(false)
  }

  const handleAnswerSubmit = async () => {
    if (selectedLesson && selectedAnswer && selectedModule) {
      setIsAnswered(true)
      if (selectedAnswer === selectedLesson.correctAnswer) {
        await updateProgress(selectedLesson.id, selectedModule.id)
      }
    }
  }

  const handleResume = () => {
    if (!userProgress) return
    const lastModule = modules.find(m => m.id === userProgress.lastModule)
    if (!lastModule) return
    const lastLesson = lastModule.lessons.find(l => l.id === userProgress.lastLesson)
    if (!lastLesson) return
    setSelectedModule(lastModule)
    setSelectedLesson(lastLesson)
  }

  const isLessonCompleted = (lessonId: string) => {
    return userProgress?.completedLessons.includes(lessonId) || false
  }

  const isModuleCompleted = (moduleId: number) => {
    if (!userProgress) return false
    const module = modules.find(m => m.id === moduleId)
    if (!module) return false
    return module.lessons.every(lesson => userProgress.completedLessons.includes(lesson.id))
  }

  const getModuleProgress = (moduleId: number) => {
    if (!userProgress?.completedLessons) return 0
    const module = modules.find(m => m.id === moduleId)
    if (!module) return 0
    const completedLessons = module.lessons.filter(lesson => 
      userProgress.completedLessons.includes(lesson.id)
    ).length
    return (completedLessons / module.lessons.length) * 100
  }

  const handleNextLesson = () => {
    if (!selectedModule || !selectedLesson) return

    const currentLessonIndex = selectedModule.lessons.findIndex(
      lesson => lesson.id === selectedLesson.id
    )

    if (currentLessonIndex < selectedModule.lessons.length - 1) {
      // Go to next lesson in current module
      handleLessonSelect(selectedModule.lessons[currentLessonIndex + 1])
    } else {
      // Go to first lesson of next module if available
      const currentModuleIndex = modules.findIndex(
        module => module.id === selectedModule.id
      )
      if (currentModuleIndex < modules.length - 1) {
        const nextModule = modules[currentModuleIndex + 1]
        setSelectedModule(nextModule)
        handleLessonSelect(nextModule.lessons[0])
      }
    }
  }

  const handleNextModule = () => {
    const currentModuleIndex = modules.findIndex(
      module => module.id === selectedModule?.id
    )
    if (currentModuleIndex < modules.length - 1) {
      handleModuleSelect(modules[currentModuleIndex + 1])
    }
  }

  return (
    <div className="space-y-8">
      {userProgress && userProgress.lastModule > 0 && (
        <Button
          onClick={handleResume}
          className="w-full bg-white/10 hover:bg-white/20 text-white mb-8"
        >
          <Play className="h-4 w-4 mr-2" />
          Resume Learning
        </Button>
      )}

      {/* Progress summary area */}
      <div className="flex flex-col items-center mb-6">
        {/* The progress circle has been removed as per user request */}
      </div>

      {!selectedModule ? (
        <div className="grid gap-6 md:grid-cols-2">
          {modules.map((module) => (
            <Card
              key={module.id}
              className={`p-6 transition-all cursor-pointer group ${
                isModuleCompleted(module.id)
                  ? "bg-green-500/10 border-green-500/20 hover:bg-green-500/20"
                  : "bg-white/5 border-white/10 hover:bg-white/10"
              }`}
              onClick={() => handleModuleSelect(module)}
            >
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-lg ${
                  isModuleCompleted(module.id)
                    ? "bg-green-500/20"
                    : "bg-white/10"
                }`}>
                  <module.icon className={`h-6 w-6 ${
                    isModuleCompleted(module.id)
                      ? "text-green-400"
                      : "text-white"
                  }`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-white">
                    Module {module.id}: {module.title}
                  </h3>
                    {isModuleCompleted(module.id) && (
                      <span className="text-green-400 text-sm">Completed</span>
                    )}
                  </div>
                  <p className="text-white/80 mb-3">{module.description}</p>
                </div>
                <ChevronRight className={`h-6 w-6 transition-colors ${
                  isModuleCompleted(module.id)
                    ? "text-green-400/60 group-hover:text-green-400"
                    : "text-white/40 group-hover:text-white/60"
                }`} />
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div>
          <Button
            variant="ghost"
            className="mb-6 text-white/80 hover:text-white"
            onClick={() => setSelectedModule(null)}
          >
            ← Back to Modules
          </Button>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
              <h2 className="text-2xl font-bold text-white">
                Module {selectedModule.id}: {selectedModule.title}
              </h2>
                <Progress
                  value={getModuleProgress(selectedModule.id)}
                  className="mt-2 h-2 w-64"
                />
              </div>
              {!selectedLesson && (
                <Button
                  variant="outline"
                  className="text-white border-white/20 hover:bg-white/10"
                  onClick={handleNextModule}
                  disabled={selectedModule.id === modules.length}
                >
                  Next Module <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              )}
            </div>

            {!selectedLesson ? (
              <div className="grid gap-4">
                {selectedModule.lessons.map((lesson) => (
                  <Card
                    key={lesson.id}
                    className={`p-4 transition-all cursor-pointer group ${
                      isLessonCompleted(lesson.id)
                        ? "bg-green-500/10 border-green-500/20 hover:bg-green-500/20"
                        : "bg-white/5 border-white/10 hover:bg-white/10"
                    }`}
                    onClick={() => handleLessonSelect(lesson)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                      <h4 className="text-lg font-medium text-white">
                        Lesson {lesson.id} – {lesson.title}
                      </h4>
                        {isLessonCompleted(lesson.id) && (
                          <span className="text-green-400 text-sm">Completed</span>
                        )}
                      </div>
                      <ChevronRight className={`h-5 w-5 transition-colors ${
                        isLessonCompleted(lesson.id)
                          ? "text-green-400/60 group-hover:text-green-400"
                          : "text-white/40 group-hover:text-white/60"
                      }`} />
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="space-y-6">
                <Button
                  variant="ghost"
                  className="mb-4 text-white/80 hover:text-white"
                  onClick={() => setSelectedLesson(null)}
                >
                  ← Back to Lessons
                </Button>

                <Card className="p-6 bg-white/5 border-white/10">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-white">
                      Lesson {selectedLesson.id} – {selectedLesson.title}
                    </h3>
                    {isAnswered && (
                      <Button
                        variant="outline"
                        className="text-white border-white/20 hover:bg-white/10"
                        onClick={handleNextLesson}
                        disabled={
                          selectedLesson.id === selectedModule.lessons[selectedModule.lessons.length - 1].id &&
                          selectedModule.id === modules.length
                        }
                      >
                        Next Lesson <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h4 className="text-lg font-medium text-white mb-2">Study Material</h4>
                      <a
                        href={selectedLesson.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 underline"
                      >
                        Click here to study the material
                      </a>
                    </div>

                    <div>
                      <h4 className="text-lg font-medium text-white mb-4">Knowledge Check</h4>
                      <p className="text-white/90 mb-4">{selectedLesson.question}</p>

                      <div className="space-y-3">
                        {selectedLesson.answers.map((answer, index) => (
                          <button
                            key={index}
                            className={`w-full p-3 text-left rounded-lg border transition-all ${
                              selectedAnswer === answer
                                ? isAnswered
                                  ? answer === selectedLesson.correctAnswer
                                    ? "bg-green-500/20 border-green-500"
                                    : "bg-red-500/20 border-red-500"
                                  : "bg-white/10 border-white/20"
                                : "bg-white/5 border-white/10 hover:bg-white/10"
                            }`}
                            onClick={() => !isAnswered && setSelectedAnswer(answer)}
                            disabled={isAnswered}
                          >
                            <span className="text-white">{answer}</span>
                          </button>
                        ))}
                      </div>

                      {!isAnswered && selectedAnswer && (
                        <Button
                          className="mt-6 w-full"
                          onClick={handleAnswerSubmit}
                        >
                          Submit Answer
                        </Button>
                      )}

                      {isAnswered && (
                        <div className={`mt-6 p-4 rounded-lg ${
                          selectedAnswer === selectedLesson.correctAnswer
                            ? "bg-green-500/20 border border-green-500"
                            : "bg-red-500/20 border border-red-500"
                        }`}>
                          <p className="text-white">
                            {selectedAnswer === selectedLesson.correctAnswer
                              ? "Correct! Well done! 🎉"
                              : `Incorrect. The correct answer is: ${selectedLesson.correctAnswer}`}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
} 
