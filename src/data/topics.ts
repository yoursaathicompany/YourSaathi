import { Calculator, Beaker, Code2, Globe, Book, Target, Map as MapIcon, Palette, Music, Heart, Briefcase, LucideIcon } from 'lucide-react';

export interface TopicData {
  id: string;
  name: string;
  icon: LucideIcon;
  color: string;
  desc: string;
  seoTitle: string;
  seoDescription: string;
  content: {
    introduction: string;
    subtopics: { title: string; content: string }[];
    studyGuide?: { title: string; steps: string[] };
    sampleQuizzes?: { question: string; options: string[]; answer: string; explanation: string; difficulty: string }[];
  }
}

export const topicsData: Record<string, TopicData> = {
  math: {
    id: 'math',
    name: 'Mathematics & Logic',
    icon: Calculator,
    color: 'from-blue-500 to-cyan-400',
    desc: 'Calculus, Algebra, Logic puzzles',
    seoTitle: 'Mathematics & Logic Practice Quizzes | ZQuiz',
    seoDescription: 'Master Mathematics and Logic with our comprehensive study guides, sample questions, and AI-generated quizzes for Calculus, Algebra, and Probability.',
    content: {
      introduction: "Mathematics and Logic form the foundation of problem-solving and critical thinking. From the abstract concepts of algebra to the structural analysis in calculus, mastering these domains is crucial for anyone preparing for competitive exams, technical interviews, or academic excellence.",
      subtopics: [
        { title: 'Algebra & Equations', content: 'Focuses on manipulating variables and numbers to solve equations. Key concepts include quadratic equations, polynomials, inequalities, and functional mapping.' },
        { title: 'Calculus', content: 'The study of continuous change. Topics like limits, derivatives, integrals, and infinite series are essential for advanced physics and engineering.' },
        { title: 'Logical Reasoning', content: 'Involves syllogisms, sequence solving, seating arrangements, and deduction. These are highly tested in almost all competitive examinations worldwide.' }
      ],
      studyGuide: {
        title: 'How to Master Mathematics',
        steps: [
          'Understand the Fundamental Theorems: Do not just memorize formulas; understand how they are derived.',
          'Practice Consistently: Math is not a spectator sport. Solve at least 20 problems a day focusing on your weak areas.',
          'Review Mistakes: Analyze why you got a problem wrong. Was it a calculation error or a conceptual gap?',
          'Time Your Practice: Use a timer to simulate exam conditions and improve your speed and accuracy.'
        ]
      },
      sampleQuizzes: [
        {
          difficulty: 'Medium',
          question: 'If 3x + 7 = 22, what is the value of 2x?',
          options: ['5', '10', '15', '20'],
          answer: '10',
          explanation: 'Subtract 7 from both sides: 3x = 15. Divide by 3: x = 5. Therefore, 2x = 10.'
        },
        {
          difficulty: 'Hard',
          question: 'What is the derivative of f(x) = x^3 - 4x + 7?',
          options: ['3x^2 - 4', '3x^2 + 4', 'x^2 - 4', '4x^3 - 4'],
          answer: '3x^2 - 4',
          explanation: 'Using the power rule, the derivative of x^n is nx^(n-1). So the derivative of x^3 is 3x^2, the derivative of -4x is -4, and the derivative of a constant (7) is 0.'
        }
      ]
    }
  },
  science: {
    id: 'science',
    name: 'Science & Nature',
    icon: Beaker,
    color: 'from-emerald-500 to-green-400',
    desc: 'Physics, Biology, Chemistry',
    seoTitle: 'Science & Nature Study Guide & Quizzes | ZQuiz',
    seoDescription: 'Explore the fascinating world of Science & Nature. Learn Physics, Chemistry, and Biology through our detailed lessons and interactive AI quizzes.',
    content: {
      introduction: "Science encompasses the systematic study of the structure and behavior of the physical and natural world through observation and experiment. Understanding science helps us make sense of the universe around us, from the smallest subatomic particles to the vastness of galaxies.",
      subtopics: [
        { title: 'Physics (The Fundamentals)', content: 'Physics studies matter, energy, and the fundamental forces of nature. Key areas include classical mechanics (Newton’s laws), thermodynamics, electromagnetism, and quantum mechanics. A solid grasp of physics allows us to understand how engines work, how electricity is generated, and how planets orbit.' },
        { title: 'Chemistry (The Central Science)', content: 'Chemistry bridges other natural sciences by studying the composition, structure, properties, and changes of matter. Core topics include the periodic table, chemical bonding, stoichiometry, and organic chemistry. It lays the groundwork for fields like pharmacology, materials science, and biochemistry.' },
        { title: 'Biology (The Study of Life)', content: 'Biology explores living organisms, encompassing their physical structure, chemical processes, molecular interactions, physiological mechanisms, development, and evolution. Sub-disciplines like genetics, ecology, and anatomy are vital for medicine, environmental conservation, and agriculture.' }
      ],
      studyGuide: {
        title: 'Effective Science Study Techniques',
        steps: [
          'Conceptual Mapping: Create mental or physical maps connecting different scientific principles. Example: How thermodynamics connects to chemical reaction rates.',
          'Active Recall: Test yourself frequently instead of passively reading the textbook.',
          'Laboratory Experience: Whenever possible, perform experiments. Practical application solidifies theoretical knowledge.',
          'Understand Vocabulary: Science uses highly specific terminology. Keep a glossary of unfamiliar terms.'
        ]
      },
      sampleQuizzes: [
        {
          difficulty: 'Easy',
          question: 'What is the powerhouse of the cell?',
          options: ['Nucleus', 'Mitochondria', 'Ribosome', 'Endoplasmic Reticulum'],
          answer: 'Mitochondria',
          explanation: 'Mitochondria are often referred to as the powerhouse of the cell because they generate most of the cell\'s supply of adenosine triphosphate (ATP), used as a source of chemical energy.'
        },
        {
          difficulty: 'Medium',
          question: 'In physics, what does Newton\'s Second Law of Motion state?',
          options: ['For every action, there is an equal and opposite reaction.', 'An object at rest stays at rest.', 'Force equals mass times acceleration (F=ma).', 'Energy cannot be created or destroyed.'],
          answer: 'Force equals mass times acceleration (F=ma).',
          explanation: 'Newton\'s Second Law formally states that the acceleration of an object as produced by a net force is directly proportional to the magnitude of the net force, in the same direction as the net force, and inversely proportional to the mass of the object.'
        }
      ]
    }
  },
  cs: {
    id: 'cs',
    name: 'Computer Science',
    icon: Code2,
    color: 'from-purple-500 to-indigo-500',
    desc: 'Algorithms, Data Structures, Web',
    seoTitle: 'Computer Science Concepts & Quizzes | ZQuiz',
    seoDescription: 'Master Algorithms, Data Structures, and Web Development. Read comprehensive Computer Science explainers and test your coding knowledge.',
    content: {
      introduction: "Computer Science is the study of computation, automation, and information. It spans theoretical disciplines like algorithms and information theory to practical disciplines like software design and hardware engineering. In the modern digital age, computational thinking is an essential skill.",
      subtopics: [
        { title: 'Data Structures and Algorithms', content: 'The foundation of efficient software. Topics include arrays, linked lists, trees, graphs, sorting (quicksort, mergesort), and searching algorithms. Understanding Big O notation is crucial.' },
        { title: 'Web Development', content: 'The creation of applications that run on the internet. Involves frontend technologies (HTML, CSS, JavaScript, React) and backend systems (Node.js, Databases, APIs).' },
        { title: 'Artificial Intelligence', content: 'The simulation of human intelligence by machines. Encompasses machine learning, neural networks, natural language processing, and robotics.' }
      ],
      studyGuide: {
        title: 'Mastering Coding & CS',
        steps: [
          'Code Every Day: Consistency is key. Even 30 minutes of coding daily yields huge long-term benefits.',
          'Build Projects: Apply what you learn by building real-world applications. Theoretical knowledge without practical application is easily forgotten.',
          'Read Source Code: Look at open-source projects to understand how experienced developers structure their code.',
          'Understand the "Why": Don’t just memorize syntax; understand why a tool or framework exists and what problem it solves.'
        ]
      }
    }
  },
  history: {
    id: 'history',
    name: 'World History',
    icon: Globe,
    color: 'from-orange-500 to-yellow-500',
    desc: 'Ancient civilizations, World Wars',
    seoTitle: 'World History Study Guides & Quizzes | ZQuiz',
    seoDescription: 'Dive into World History. From Ancient Civilizations to modern conflicts, our explainers and quizzes will prepare you for any history exam.',
    content: {
      introduction: "World History is the story of human experience across the globe. By studying the past, we gain invaluable insights into the present and can better anticipate the future. It helps us understand how societies, governments, and cultures have evolved.",
      subtopics: [
        { title: 'Ancient Civilizations', content: 'The origins of human society, including Mesopotamia, Ancient Egypt, the Indus Valley Civilization, and Ancient China. Focuses on early writing systems, agriculture, and monumental architecture.' },
        { title: 'The Middle Ages', content: 'Covers the post-classical era, including the fall of the Roman Empire, the rise of Islamic Caliphates, the Byzantine Empire, and feudalism in Europe.' },
        { title: 'Modern History & Global Conflicts', content: 'Encompasses the Renaissance, the Industrial Revolution, colonialism, and the two World Wars. This era shaped the current geopolitical landscape.' }
      ],
      studyGuide: {
        title: 'Studying History Effectively',
        steps: [
          'Create Timelines: Visualizing the sequence of events is vital for understanding cause and effect.',
          'Understand Context: Do not just memorize dates; understand the socio-economic and political context of the era.',
          'Analyze Primary Sources: Reading original documents or firsthand accounts provides a deeper, more nuanced understanding than textbooks alone.',
          'Connect Past and Present: Look for historical parallels to modern-day events to make the material more relevant.'
        ]
      }
    }
  },
  lit: {
    id: 'lit',
    name: 'Literature',
    icon: Book,
    color: 'from-pink-500 to-rose-400',
    desc: 'Classic authors, Poetry, Analysis',
    seoTitle: 'Literature Quizzes and Explainers | ZQuiz',
    seoDescription: 'Deep dive into English Literature. Study classic authors, poetry analysis, and literary devices with our comprehensive guides.',
    content: {
      introduction: "Literature reflects the human condition, capturing our thoughts, emotions, and societal struggles through the written word. Studying literature enhances critical reading skills, empathy, and cultural awareness.",
      subtopics: [
        { title: 'Literary Analysis', content: 'The practice of closely reading a text to examine its themes, motifs, symbolism, and narrative structure. It involves looking beyond the surface plot.' },
        { title: 'Classic Authors & Eras', content: 'Studying works from specific periods, such as the Renaissance (Shakespeare), Romanticism (Wordsworth, Keats), and Modernism (Joyce, Woolf).' },
        { title: 'Poetry', content: 'Analyzing the rhythmic and evocative use of language. Focuses on meter, rhyme scheme, imagery, and poetic forms like sonnets and haikus.' }
      ]
    }
  },
  comp: {
    id: 'comp',
    name: 'Competitive Exams',
    icon: Target,
    color: 'from-red-500 to-orange-500',
    desc: 'UPSC, GRE, Engineering entrance',
    seoTitle: 'Competitive Exams Preparation & Guides | ZQuiz',
    seoDescription: 'Prepare for top competitive exams like UPSC, GRE, and Engineering entrances with structured study plans and AI-driven quizzes.',
    content: {
      introduction: "Competitive exams are the gateways to premier educational institutions and prestigious government jobs. They require not just subject knowledge, but also extreme time management, strategic preparation, and strong mental endurance.",
      subtopics: [
        { title: 'Quantitative Aptitude', content: 'Testing mathematical logic, speed, and accuracy. Common in exams like the GRE, GMAT, and various banking exams.' },
        { title: 'Verbal Reasoning', content: 'Assesses reading comprehension, vocabulary, and grammar. Crucial for exams like the SAT, GRE, and civil services.' },
        { title: 'General Awareness', content: 'Includes current affairs, static general knowledge, and history. Extremely important for civil services exams like UPSC.' }
      ]
    }
  },
  geo: {
    id: 'geo',
    name: 'Geography',
    icon: MapIcon,
    color: 'from-green-500 to-emerald-400',
    desc: 'Countries, Capitals, Physical Geography',
    seoTitle: 'Geography Topics and Interactive Quizzes | ZQuiz',
    seoDescription: 'Learn physical and political geography. Master capitals, countries, tectonic plates, and climate systems with dedicated guides.',
    content: {
      introduction: "Geography is the study of places and the relationships between people and their environments. Geographers explore both the physical properties of Earth's surface and the human societies spread across it.",
      subtopics: [
        { title: 'Physical Geography', content: 'The study of Earth\'s natural features and processes, including climate, landforms, soil, and vegetation (e.g., geomorphology, climatology).' },
        { title: 'Human Geography', content: 'Focuses on the spatial distribution of human populations, cultures, economies, and political systems.' },
        { title: 'Cartography & Spatial Awareness', content: 'The science and art of map-making, crucial for visualizing geographic data and navigating the world.' }
      ]
    }
  },
  art: {
    id: 'art',
    name: 'Art & Culture',
    icon: Palette,
    color: 'from-pink-500 to-fuchsia-500',
    desc: 'Famous Artists, Art History, Movements',
    seoTitle: 'Art & Culture Study Modules | ZQuiz',
    seoDescription: 'Explore Famous Artists, Art History, and Cultural Movements. Prepare your knowledge base with extensive guides and quizzes.',
    content: {
      introduction: "Art and Culture represent the creative expression and shared heritage of human societies. From prehistoric cave paintings to modern abstract expressionism, art is a mirror to the soul of an era.",
      subtopics: [
        { title: 'Art Movements', content: 'Studying distinct periods with specific styles and philosophies, such as the Renaissance, Impressionism, Cubism, and Surrealism.' },
        { title: 'Cultural Heritage', content: 'Examining traditions, folklore, indigenous arts, and UNESCO world heritage sites to understand global diversity.' },
        { title: 'Techniques and Mediums', content: 'Understanding the materials and methods used by artists, from oil painting and fresco to digital art and sculpture.' }
      ]
    }
  },
  music: {
    id: 'music',
    name: 'Music',
    icon: Music,
    color: 'from-violet-500 to-purple-500',
    desc: 'Instruments, Music Theory, Genres',
    seoTitle: 'Music Theory and History Explainer | ZQuiz',
    seoDescription: 'Delve into Music Theory, Genres, and Instruments. Comprehensive textual guides to boost your musical understanding.',
    content: {
      introduction: "Music is the universal language of mankind. It involves the organized production of sound and silence, relying on elements such as pitch, rhythm, dynamics, and timbre.",
      subtopics: [
        { title: 'Music Theory', content: 'The study of the practices and possibilities of music. Involves understanding scales, chords, key signatures, and time signatures.' },
        { title: 'History of Western Music', content: 'Tracing the evolution from Medieval chants and Baroque precision to Classical symphonies and Romantic emotionality.' },
        { title: 'Global Musical Traditions', content: 'Exploring diverse genres including Jazz, Blues, Hindustani classical, and contemporary electronic music.' }
      ]
    }
  },
  health: {
    id: 'health',
    name: 'Health & Fitness',
    icon: Heart,
    color: 'from-rose-500 to-red-400',
    desc: 'Nutrition, Anatomy, Wellness',
    seoTitle: 'Health, Nutrition & Fitness Guides | ZQuiz',
    seoDescription: 'Learn about human anatomy, nutrition, and wellness practices. Generate quizzes to test your health knowledge.',
    content: {
      introduction: "Health and Fitness encompass not just the absence of disease, but a state of complete physical, mental, and social well-being. Understanding bodily functions and nutrition is key to a long, healthy life.",
      subtopics: [
        { title: 'Human Anatomy & Physiology', content: 'Understanding how the body works, from the skeletal and muscular systems to the cardiovascular and nervous systems.' },
        { title: 'Nutrition & Dietetics', content: 'The science of food and its relationship to health. Discusses macronutrients, micronutrients, caloric intake, and metabolic processes.' },
        { title: 'Mental Wellness', content: 'Focusing on psychological health, stress management, sleep hygiene, and the mind-body connection.' }
      ]
    }
  },
  business: {
    id: 'business',
    name: 'Business & Finance',
    icon: Briefcase,
    color: 'from-amber-500 to-orange-400',
    desc: 'Economics, Management, Markets',
    seoTitle: 'Business, Finance, and Economics Explainers | ZQuiz',
    seoDescription: 'Master the principles of Business and Finance. Understand economics, management, and global markets with our deep-dive content.',
    content: {
      introduction: "Business and Finance are the engines of the global economy. They dictate how resources are allocated, how wealth is generated, and how organizations are managed to achieve their objectives.",
      subtopics: [
        { title: 'Micro and Macro Economics', content: 'Microeconomics looks at individual and business decisions, while macroeconomics analyzes decisions made by countries and governments (e.g., inflation, GDP).' },
        { title: 'Financial Markets', content: 'Understanding the stock market, bonds, commodities, and the principles of investing and risk management.' },
        { title: 'Management & Leadership', content: 'The theories and practices of organizing teams, strategic planning, human resources, and corporate governance.' }
      ]
    }
  }
};
