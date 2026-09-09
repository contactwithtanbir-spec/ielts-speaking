import { IELTSQuestion, PracticeSession, UserProfile } from '../types';

export const initialUser: UserProfile = {
  name: 'Miftahul Jannat Rijvee',
  email: 'miftahul.rijvee@example.com',
  targetBand: 7.0,
  currentLevel: 'Intermediate',
  joinedDate: '2026-08-15',
};

export const sampleQuestions: IELTSQuestion[] = [
  {
    id: 'q-part1-1',
    part: 'Part 1',
    topic: 'Hometown & Neighbourhood',
    question: 'Can you tell me about the town or city where you grew up? What do you like most about it?',
    cuePoints: [],
    prepTimeSeconds: 0,
    recommendedSpeakingSeconds: 45,
    difficulty: 'Easy',
    sampleAnswer:
      'I was born and raised in Chittagong, which is a coastal city surrounded by scenic green hills and the Bay of Bengal. What I adore most about my hometown is its vibrant culinary heritage and the warmth of the local community. Even though traffic congestion has increased over recent years, there is a refreshing ocean breeze that brings tranquility to our evenings.',
  },
  {
    id: 'q-part1-2',
    part: 'Part 1',
    topic: 'Daily Routine & Productivity',
    question: 'Do you prefer to study or work in the morning or in the evening? Why?',
    cuePoints: [],
    prepTimeSeconds: 0,
    recommendedSpeakingSeconds: 45,
    difficulty: 'Medium',
    sampleAnswer:
      'Without a doubt, I am an early bird. I find that my cognitive focus peaks during the quiet morning hours before the day gets hectic. In contrast, by evening I often experience decision fatigue, so I reserve nights for recreational reading or unwinding with family.',
  },
  {
    id: 'q-part1-3',
    part: 'Part 1',
    topic: 'Art & Museums',
    question: 'How often do you visit art galleries or historical museums? Do you think they are important?',
    cuePoints: [],
    prepTimeSeconds: 0,
    recommendedSpeakingSeconds: 45,
    difficulty: 'Hard',
    sampleAnswer:
      'Admittedly, I do not visit them as frequently as I would like due to my rigorous schedule, perhaps once or twice a year. However, I consider them indispensable cultural repositories. They serve not only as aesthetic spaces but also preserve historical narratives and foster collective civic awareness.',
  },
  {
    id: 'q-part2-1',
    part: 'Part 2',
    topic: 'A Memorable Journey',
    question: 'Describe a memorable journey you have taken.',
    cuePoints: [
      'Where you went and how you traveled there',
      'Who you went with',
      'What you did during the journey',
      'And explain why this journey made such a lasting impression on you.',
    ],
    prepTimeSeconds: 60,
    recommendedSpeakingSeconds: 120,
    difficulty: 'Medium',
    sampleAnswer:
      'I would like to talk about an unforgettable journey I embarked on two winters ago to Bandarban, a scenic mountainous district. I traveled there by overnight train accompanied by three of my closest university peers. Upon arrival, we hiked up to Nilgiri peak early at dawn. As the sun crested the horizon, a sea of white clouds enveloped the rolling valleys below us, which felt completely surreal. What made this journey truly indelible was the spontaneous hospitality of the indigenous community we met; despite having modest amenities, their genuine warmth and eco-friendly lifestyle gave me a profound renewed perspective on modern consumption.',
  },
  {
    id: 'q-part2-2',
    part: 'Part 2',
    topic: 'An Influential Person',
    question: 'Describe an older person who had a significant influence on your life.',
    cuePoints: [
      'Who this person is and how you know them',
      'What kind of person they are',
      'What memorable advice or guidance they gave you',
      'And explain why their influence has been so meaningful to your development.',
    ],
    prepTimeSeconds: 60,
    recommendedSpeakingSeconds: 120,
    difficulty: 'Hard',
    sampleAnswer:
      'The person who has exerted the greatest formative influence on my character is my maternal grandfather. He was a retired high school educator who spent over four decades championing literacy in underserved rural communities. He possessed immense patience and an insatiable curiosity about world literature and science. Whenever I struggled with setbacks, he would reassure me that true mastery is born out of persistent resilience rather than innate genius. His selfless ethos and disciplined work ethic continue to steer my academic decisions to this day.',
  },
  {
    id: 'q-part2-3',
    part: 'Part 2',
    topic: 'A Skill You Learned',
    question: 'Describe a useful practical skill that you learned as a teenager.',
    cuePoints: [
      'What the skill is and how you learned it',
      'Who taught you or helped you learn',
      'Whether it was difficult to master',
      'And explain how having this skill has benefited you in everyday life.',
    ],
    prepTimeSeconds: 60,
    recommendedSpeakingSeconds: 120,
    difficulty: 'Easy',
    sampleAnswer:
      'I would like to describe learning basic culinary skills, specifically traditional home cooking, when I was around fifteen years old. My mother took the initiative during the summer holidays to teach me essential chopping techniques, spice balancing, and kitchen safety. Initially, getting the consistency and seasoning right was quite daunting. However, once I gained confidence, it transformed from a chore into a therapeutic hobby. Living independently later at university, this practical capability enabled me to prepare wholesome meals on a budget.',
  },
  {
    id: 'q-part3-1',
    part: 'Part 3',
    topic: 'Tourism & Globalized Culture',
    question: 'In what ways does mass tourism threaten or benefit local traditions and historical sites?',
    cuePoints: [
      'Economic stimulation versus cultural commercialization',
      'Environmental degradation at historical landmarks',
      'Role of government regulations in sustainable heritage tourism',
    ],
    prepTimeSeconds: 0,
    recommendedSpeakingSeconds: 60,
    difficulty: 'Hard',
    sampleAnswer:
      'It presents a double-edged sword. On one hand, tourism injects crucial foreign exchange into local economies and finances the upkeep of fragile archeological monuments. On the other hand, unchecked commercialization often trivializes sacred rituals into theatrical spectacles for visitors, while excessive footfall accelerates physical erosion. Therefore, policymakers must enforce strict carrying capacities and invest revenue directly into cultural heritage preservation.',
  },
  {
    id: 'q-part3-2',
    part: 'Part 3',
    topic: 'Technological Evolution in Education',
    question: 'Do you believe artificial intelligence will eventually replace human instructors in classrooms?',
    cuePoints: [
      'Personalized adaptive learning algorithms',
      'Emotional intelligence and mentorship from human teachers',
      'Blended learning paradigms for future generations',
    ],
    prepTimeSeconds: 0,
    recommendedSpeakingSeconds: 60,
    difficulty: 'Medium',
    sampleAnswer:
      'While artificial intelligence will revolutionize pedagogical delivery through tailored exercises and automated feedback, I strongly doubt it will render human teachers obsolete. Teaching fundamentally entails emotional mentorship, ethical modeling, and fostering critical empathy—qualities no machine can authentically replicate. I envision a collaborative hybrid framework where AI takes over administrative tasks, freeing educators to focus on inspirational human guidance.',
  },
];

export const samplePreviousSessions: PracticeSession[] = [
  {
    id: 'sess-001',
    date: '2026-09-07T14:30:00.000Z',
    part: 'Part 2',
    difficulty: 'Medium',
    topic: 'A Memorable Journey',
    question: 'Describe a memorable journey you have taken.',
    cuePoints: [
      'Where you went and how you traveled there',
      'Who you went with',
      'What you did during the journey',
      'And explain why this journey made such a lasting impression on you.',
    ],
    transcript:
      'I want to talk about my visit to Bandarban two years ago. I went there by train with three friends from my university. The hills was very beautiful and green. We reached early morning and we climbed to the top of Nilgiri. The clouds were touching our hands and it was really nice. The local ethnic people welcomed us and gave us fresh fruit. It was memorable because I never saw such clouds before and it helped me escape city noise.',
    audioDurationSeconds: 88,
    evaluation: {
      overallBand: 6.5,
      criteria: {
        fluencyCoherence: {
          band: 7.0,
          feedback: 'Spoke at a continuous and comfortable tempo. Ideas were linked logically using appropriate chronological discourse markers.',
          strengths: ['Smooth sequencing of the trip chronology', 'Minimal prolonged hesitation'],
          improvements: ['Use wider cohesive devices such as "subsequently" or "in stark contrast"'],
        },
        lexicalResource: {
          band: 6.5,
          feedback: 'Good range of topic-appropriate vocabulary (ethnic people, escape city noise, local). Relied occasionally on basic qualifiers like "really nice" and "very beautiful".',
          strengths: ['Topic-relevant vocabulary', 'Clear imagery regarding the mountains and clouds'],
          improvements: ['Replace "really nice" with "breathtaking / awe-inspiring"', 'Use compound adjectives like "mist-shrouded valleys"'],
        },
        grammaticalRangeAccuracy: {
          band: 6.0,
          feedback: 'Frequent simple and compound sentences with generally clear meaning. Minor subject-verb agreement error ("hills was") and tense consistency ("I never saw" vs "had never seen").',
          strengths: ['Good control of simple past narrative tense', 'Clauses joined with coordination conjunctions'],
          improvements: ['Correct "The hills was" to "The hills were"', 'Adopt past perfect: "I had never witnessed such a phenomenon before"'],
        },
        pronunciation: {
          band: 6.5,
          feedback: 'Generally clear phonological control with natural sentence rhythm. Stress on key descriptive nouns was well executed.',
          strengths: ['Clear enunciation of consonants', 'Effective intonation on exclamatory statements'],
          improvements: ['Differentiate short /ɪ/ and long /iː/ sounds in words like "reach" vs "rich"', 'Work on linked vowel transitions'],
        },
      },
      strengths: [
        'Directly addressed all four bullet points on the Part 2 cue card.',
        'Spoke with genuine enthusiasm and natural descriptive pace.',
        'Conveyed personal emotional reflection effectively at the conclusion.',
      ],
      mistakes: [
        {
          original: 'The hills was very beautiful and green.',
          correction: 'The hills were lush and strikingly scenic.',
          explanation: 'Subject-verb agreement error: "hills" is plural, requiring "were".',
        },
        {
          original: 'I never saw such clouds before...',
          correction: 'I had never witnessed such an atmospheric spectacle before...',
          explanation: 'Use the past perfect ("had never witnessed") when looking back from a point in past time.',
        },
      ],
      vocabularySuggestions: [
        {
          term: 'very beautiful',
          advancedAlternative: 'picturesque / panoramic / awe-inspiring',
          example: 'We were greeted by an awe-inspiring panoramic vista.',
        },
        {
          term: 'really nice',
          advancedAlternative: 'truly rejuvenating / exquisite',
          example: 'The serene mountain environment proved to be truly rejuvenating.',
        },
        {
          term: 'escape city noise',
          advancedAlternative: 'escape the hustle and bustle of urban life',
          example: 'It offered the ideal sanctuary to escape the hustle and bustle of urban life.',
        },
      ],
      pronunciationFeedback: [
        'Pay attention to plural endings: pronounce the /z/ sound clearly in "hills" and "friends".',
        'Use rising intonation when setting the scene ("early morning...") before falling at the main clause closure.',
      ],
      betterExpressions: [
        {
          original: 'The clouds were touching our hands and it was really nice.',
          refined: 'We were literally brushing shoulders with the low-hanging clouds, which was an enchanting encounter.',
        },
      ],
      roomForImprovement: [
        'Expand the speaking duration from 88 seconds closer to the 110-120 second target mark.',
        'Elevate descriptive adjectives beyond standard words like "nice" and "green".',
      ],
      nextPracticeRecommendation:
        'Practice another Part 2 descriptive prompt focusing specifically on varied past tenses (Past Continuous & Past Perfect) to push your grammatical accuracy to Band 7.0.',
    },
  },
  {
    id: 'sess-002',
    date: '2026-09-08T10:15:00.000Z',
    part: 'Part 1',
    difficulty: 'Easy',
    topic: 'Hometown & Neighbourhood',
    question: 'Can you tell me about the town or city where you grew up? What do you like most about it?',
    cuePoints: [],
    transcript:
      'I grew up in Chittagong city. It is a commercial capital of Bangladesh with sea port. What I like the most is the seafood and the beach nearby called Patenga. On weekends, many families go there to enjoy the breeze and eat spicy crab fries. It can be a bit noisy because of the traffic, but the people are very hospitable and helpful to everyone.',
    audioDurationSeconds: 42,
    evaluation: {
      overallBand: 7.0,
      criteria: {
        fluencyCoherence: {
          band: 7.0,
          feedback: 'Effortless flow with no unnatural pausing. Answered directly with natural supporting details.',
          strengths: ['Direct response', 'Natural colloquial flow'],
          improvements: ['Incorporate more complex concessive linkers (e.g., "despite the bustling traffic...")'],
        },
        lexicalResource: {
          band: 7.0,
          feedback: 'Effective topic vocabulary including "commercial capital", "hospitable", and "spicy crab fries".',
          strengths: ['Precise regional vocabulary', 'Good collocations like "commercial capital"'],
          improvements: ['Add vivid modifiers for the coastal atmosphere'],
        },
        grammaticalRangeAccuracy: {
          band: 7.0,
          feedback: 'Clean sentence structures with only a minor article omission ("the sea port" vs "a major seaport").',
          strengths: ['Accurate relative clause usage ("called Patenga", "where families go")', 'Accurate compound sentences'],
          improvements: ['Vary starting phrases beyond "It is..." and "What I like..."'],
        },
        pronunciation: {
          band: 7.0,
          feedback: 'Crisp speech with natural stress patterns on compound nouns.',
          strengths: ['Intelligible throughout', 'Appropriate pacing'],
          improvements: ['Soften the plosive /p/ and /t/ consonants for smoother connected speech'],
        },
      },
      strengths: [
        'Precise, conversational Part 1 response of ideal length (42 seconds).',
        'Natural display of cultural authenticity and local color.',
        'Strong criteria balance across all 4 IELTS rubrics.',
      ],
      mistakes: [
        {
          original: 'It is a commercial capital of Bangladesh with sea port.',
          correction: 'It is the commercial capital of Bangladesh and houses its premier seaport.',
          explanation: 'Use the definite article "the" for unique titles like "the commercial capital".',
        },
      ],
      vocabularySuggestions: [
        {
          term: 'a bit noisy',
          advancedAlternative: 'moderately bustling / cacophonous during rush hours',
          example: 'While downtown avenues are moderately bustling, coastal areas remain tranquil.',
        },
      ],
      pronunciationFeedback: [
        'Notice word linking in "commercial capital of..."—connect the final /l/ directly to the vowel /əv/.',
      ],
      betterExpressions: [
        {
          original: 'What I like the most is the seafood and the beach nearby called Patenga.',
          refined: 'What appeals to me above all is our exquisite coastal seafood and the proximity to Patenga beach.',
        },
      ],
      roomForImprovement: [
        'Experiment with inverted sentences ("Not only is it the nation\'s premier port, but it also...") for band 8 grammatical flair.',
      ],
      nextPracticeRecommendation:
        'Try a Part 3 abstract question on urban development vs environmental sustainability to test your analytical vocabulary.',
    },
  },
  {
    id: 'sess-003',
    date: '2026-09-09T09:00:00.000Z',
    part: 'Part 3',
    difficulty: 'Hard',
    topic: 'Tourism & Globalized Culture',
    question: 'In what ways does mass tourism threaten or benefit local traditions and historical sites?',
    cuePoints: [],
    transcript:
      'In my opinion, mass tourism brings both advantages and drawbacks. Economically, it provides substantial revenue and creates employment opportunities for tour guides, hotel staffs, and local artisans. However, from a cultural viewpoint, ancient traditions can become overly commercialized just to entertain tourists, losing their original sanctity. Furthermore, environmental wear and tear on fragile historical ruins requires urgent preservation policies.',
    audioDurationSeconds: 58,
    evaluation: {
      overallBand: 7.5,
      criteria: {
        fluencyCoherence: {
          band: 7.5,
          feedback: 'Sophisticated discourse flow with cohesive devices used naturally ("Economically", "However", "Furthermore").',
          strengths: ['Balanced analytical structure', 'Seamless thematic transitions'],
          improvements: ['Use rhetorical hypothetical markers for even deeper nuance'],
        },
        lexicalResource: {
          band: 8.0,
          feedback: 'Impressive academic lexicon: "substantial revenue", "commercialized", "sanctity", "wear and tear", "fragile historical ruins".',
          strengths: ['High-level collocations', 'Precise academic register suited for Part 3'],
          improvements: ['Try incorporating idioms like "double-edged sword"'],
        },
        grammaticalRangeAccuracy: {
          band: 7.5,
          feedback: 'Wide array of complex structures with accurate subordination and modal verbs. Minor plural issue ("hotel staffs" -> "hotel staff").',
          strengths: ['Complex sentences with gerund and participial phrases', 'Consistent academic style'],
          improvements: ['Remember that "staff" in this sense is typically uncountable'],
        },
        pronunciation: {
          band: 7.0,
          feedback: 'Confident and clear pronunciation with clear syllable stress on multisyllabic terms like "commercialized" and "substantial".',
          strengths: ['Thought groups were nicely paused', 'Intonation signaled contrast effectively'],
          improvements: ['Ensure stress on "sanctity" falls on the first syllable /ˈsæŋktɪti/'],
        },
      },
      strengths: [
        'Superb Part 3 analytical response presenting balanced multi-perspective arguments.',
        'High-density academic vocabulary and collocations.',
        'Immediate, concise structure fitting the 1-minute speaking window.',
      ],
      mistakes: [
        {
          original: '...creates employment opportunities for tour guides, hotel staffs, and local artisans.',
          correction: '...creates employment opportunities for tour guides, hotel staff, and local artisans.',
          explanation: '"Staff" referring to employees of an establishment is treated as a collective or uncountable noun.',
        },
      ],
      vocabularySuggestions: [
        {
          term: 'advantages and drawbacks',
          advancedAlternative: 'a double-edged sword / conflicting socioeconomic ramifications',
          example: 'Mass tourism inevitably poses conflicting socioeconomic ramifications.',
        },
      ],
      pronunciationFeedback: [
        'Ensure correct stress placement on "sanctity" (first syllable) and "artisan" (first syllable).',
      ],
      betterExpressions: [
        {
          original: 'In my opinion, mass tourism brings both advantages and drawbacks.',
          refined: 'From a macro perspective, mass tourism presents a classic double-edged sword.',
        },
      ],
      roomForImprovement: [
        'Add a concrete real-world example (e.g. Venice or Machu Picchu) to anchor the theoretical argument.',
      ],
      nextPracticeRecommendation:
        'You are consistently hitting 7.5 in Part 3! Focus on maintaining this high register in Part 2 long-turns under timed pressure to lock in a Band 7.5+ overall.',
    },
  },
];
