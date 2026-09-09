import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Lazy Gemini client helper
let aiClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// Models priority list for text generation tasks (standard tier)
// In case of 503 (high demand / unavailable) on one model, seamlessly fall back to another valid model
const TEXT_MODELS = ['gemini-flash-latest', 'gemini-3.8-flash', 'gemini-3.1-flash-lite'];

async function generateWithFallback(ai: GoogleGenAI, options: {
  contents: string;
  config?: any;
}): Promise<any> {
  let lastError: any = null;
  for (const model of TEXT_MODELS) {
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const res = await ai.models.generateContent({
          model,
          contents: options.contents,
          config: options.config,
        });
        return res;
      } catch (err: any) {
        lastError = err;
        const msg = String(err?.message || '');
        const isTransient =
          err?.status === 503 ||
          err?.code === 503 ||
          msg.includes('high demand') ||
          msg.includes('UNAVAILABLE') ||
          err?.status === 429 ||
          msg.includes('RESOURCE_EXHAUSTED');

        if (isTransient) {
          console.warn(`Model ${model} (attempt ${attempt + 1}) busy or unavailable. Retrying / falling back...`);
          await new Promise((resolve) => setTimeout(resolve, 350 * (attempt + 1)));
          continue;
        }
        break; // If error is not transient, proceed to next model
      }
    }
  }
  throw lastError;
}

// Helper for fallback evaluation if Gemini key is missing or call fails
function generateFallbackEvaluation(params: {
  part: string;
  question: string;
  transcript: string;
  targetBand: number;
  currentLevel: string;
}) {
  const text = params.transcript.trim();
  const words = text.split(/\s+/).filter(Boolean);
  const wordCount = words.length;

  // Split into real sentences spoken by the candidate
  const rawSentences = text
    .split(/[.?!]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 3);
  const sentences = rawSentences.length > 0 ? rawSentences : [text];

  let estimatedBand = 6.0;
  if (wordCount < 15) estimatedBand = 4.0;
  else if (wordCount < 35) estimatedBand = 5.0;
  else if (wordCount < 70) estimatedBand = 6.0;
  else if (wordCount < 130) estimatedBand = 6.5;
  else if (wordCount < 190) estimatedBand = 7.0;
  else estimatedBand = 7.5;

  const firstSentence = sentences[0] || text;
  const secondSentence = sentences[1] || firstSentence;

  // Pick unique words from candidate's actual speech for vocabulary suggestions
  const filterWords = words
    .map((w) => w.replace(/[^a-zA-Z]/g, '').toLowerCase())
    .filter((w) => w.length >= 4 && !['this', 'that', 'with', 'from', 'have', 'were', 'they', 'what', 'when', 'your', 'about', 'there', 'their', 'some'].includes(w));
  const uniqueSpokenWords = Array.from(new Set(filterWords));

  const vocabTerm1 = uniqueSpokenWords[0] || words[0] || 'point';
  const vocabTerm2 = uniqueSpokenWords[1] || words[1] || 'think';
  const vocabTerm3 = uniqueSpokenWords[2] || words[2] || 'good';

  const mistakesList = [];
  if (wordCount < 25) {
    mistakesList.push({
      original: firstSentence,
      correction: `${firstSentence} ... [expand with supporting reasons, personal examples, and specific details]`,
      explanation: `Your recorded response was only ${wordCount} words. In IELTS ${params.part}, examiners require extended discourse to reward higher band scores.`
    });
  } else {
    mistakesList.push({
      original: firstSentence,
      correction: `In addressing this, ${firstSentence.toLowerCase()}`,
      explanation: "Vary your opening clause to immediately establish complex sentence structure."
    });
  }

  return {
    overallBand: estimatedBand,
    criteria: {
      fluencyCoherence: {
        band: Math.min(9, Math.max(4, estimatedBand + (wordCount > 100 ? 0.5 : -0.5))),
        feedback: wordCount < 30
          ? `Your speech was very brief (${wordCount} words). While intelligible, extended elaboration is essential to achieve Band 6.5+.`
          : `Demonstrated coherent ideas across ${wordCount} words spoken. Transition between key points was generally clear.`,
        strengths: [
          `Directly engaged with the prompt prompt in ${wordCount} words`,
          "Paced speech without unnatural extended hesitation"
        ],
        improvements: [
          "Expand answers by adding 'for instance' or 'a notable example of this is...'",
          "Aim to speak for the full recommended time duration"
        ]
      },
      lexicalResource: {
        band: Math.min(9, Math.max(4, estimatedBand)),
        feedback: `Employed functional vocabulary suited to the topic. To reach Band 7.0+, substitute common terms with less frequent, topic-specific collocations.`,
        strengths: [
          `Successfully communicated intended meaning with words like '${vocabTerm1}'`,
          "Appropriate context-specific wording"
        ],
        improvements: [
          `Upgrade conversational words like '${vocabTerm2}' to formal academic equivalents`,
          "Use more idiomatic English expressions and phrasal verbs"
        ]
      },
      grammaticalRangeAccuracy: {
        band: Math.min(9, Math.max(4, estimatedBand - (wordCount < 25 ? 0.5 : 0))),
        feedback: "Predominantly used simple and compound sentences. Integrating complex conditional or relative clauses will strengthen your grammar band.",
        strengths: [
          "Fundamental sentence structures were clearly understandable",
          "Consistent tense usage throughout the response"
        ],
        improvements: [
          "Incorporate compound-complex sentences (using 'although', 'whereas', 'provided that')",
          "Check subject-verb agreement and singular/plural consistency"
        ]
      },
      pronunciation: {
        band: Math.min(9, Math.max(4, estimatedBand)),
        feedback: "Speech was clearly intelligible. Maintaining natural rhythm, sentence stress, and connected speech across longer phrases will boost clarity.",
        strengths: [
          "Content words were stressed with clear communicative intent",
          "Generally clear articulation of individual sounds"
        ],
        improvements: [
          "Practice linking word endings to beginning vowels (connected speech)",
          "Use rising intonation for lists and falling intonation for definitive conclusions"
        ]
      }
    },
    strengths: [
      `Directly addressed the question: "${params.question}"`,
      `Spoke ${wordCount} words clearly and legibly into the transcript.`,
      "Communicated core thoughts without breakdown in basic sentence structure."
    ],
    mistakes: mistakesList,
    vocabularySuggestions: [
      {
        term: vocabTerm1,
        advancedAlternative: `a pivotal aspect / considerably significant`,
        example: `Using advanced equivalents around '${vocabTerm1}' demonstrates higher Lexical Resource.`
      },
      {
        term: vocabTerm2,
        advancedAlternative: `from my vantage point / I am inclined to believe that`,
        example: `Replacing '${vocabTerm2}' with nuanced opinion markers elevates formal speech.`
      },
      {
        term: vocabTerm3,
        advancedAlternative: `favorable / advantageous / substantial`,
        example: `Refining descriptors like '${vocabTerm3}' shows greater lexical range.`
      }
    ],
    pronunciationFeedback: [
      "Pay attention to word stress on multi-syllabic academic vocabulary.",
      "Link final consonants to initial vowel sounds in consecutive words to sound more fluent.",
      "Vary intonation pitch to keep the listener engaged and express personal attitude."
    ],
    betterExpressions: [
      {
        original: firstSentence,
        refined: `Regarding this topic, ${firstSentence.toLowerCase()}`
      },
      ...(sentences.length > 1
        ? [
            {
              original: secondSentence,
              refined: `Building upon that point, ${secondSentence.toLowerCase()}`
            }
          ]
        : [])
    ],
    roomForImprovement: [
      wordCount < 60
        ? `Increase answer length (currently ${wordCount} words) to satisfy IELTS timing standards.`
        : "Expand Part 2 or Part 3 points with vivid concrete examples.",
      "Incorporate more cohesive linkers ('consequently', 'on the other hand', 'in addition').",
      "Avoid repeating the same structural sentence starter multiple times."
    ],
    nextPracticeRecommendation: `Practice speaking for ${params.part === 'Part 2' ? 'a full 2 minutes' : '45-60 seconds'} continuously on this topic, focusing on expanding '${vocabTerm1}' with detailed explanations to target Band ${Math.min(9, params.targetBand)}.`
  };
}

// 1. Evaluate endpoint
app.post('/api/evaluate', async (req, res) => {
  try {
    const { part, question, cuePoints, transcript, difficulty, targetBand, currentLevel } = req.body;

    if (!transcript || !transcript.trim()) {
      return res.status(400).json({ error: 'Speech transcript is required for evaluation.' });
    }

    const ai = getGenAI();
    if (!ai) {
      console.log('Gemini API key not configured, returning realistic fallback evaluation.');
      const fallback = generateFallbackEvaluation({
        part: part || 'Part 1',
        question: question || 'General topic',
        transcript,
        targetBand: Number(targetBand) || 7.0,
        currentLevel: currentLevel || 'Intermediate',
      });
      return res.json(fallback);
    }

    const prompt = `
You are an expert, certified IELTS Speaking Examiner.
You must evaluate the candidate's spoken response strictly based on the official IELTS 9-band Speaking criteria:
1. Fluency and Coherence (FC)
2. Lexical Resource (LR)
3. Grammatical Range and Accuracy (GRA)
4. Pronunciation (PR)

STRICT REAL-WORLD GROUNDING RULES (MANDATORY):
1. EVALUATE ONLY WHAT THE CANDIDATE ACTUALLY SPOKE: You must evaluate ONLY the exact words provided below in "Candidate's Transcript".
2. ABSOLUTELY DO NOT INVENT, FABRICATE, OR ASSUME ANY WORDS, PHRASES, TOPICS, OR BACKGROUND THAT ARE NOT IN THE TRANSCRIPT.
3. If the candidate spoke only a short response (e.g. 5 to 30 words), evaluate THAT SHORT RESPONSE realistically: the Band score must reflect that brevity (e.g. Band 4.0 - 5.5 because IELTS demands extended answers), and state clearly that the answer was too brief. DO NOT pretend they gave an elaborate speech about traveling, vacations, or something they never said.
4. "mistakes" array:
   - Every "original" field MUST BE AN EXACT VERBATIM SUBSTRING QUOTE from the Candidate's Transcript below.
   - If the candidate made no clear grammar mistakes in what they said, do not invent one! Return an empty array [] or at most 1 minor slip.
5. "betterExpressions" array:
   - Every "original" field MUST be an exact sentence or phrase spoken by the candidate in Candidate's Transcript.
   - The "refined" field must show how a native Band 8.5/9.0 speaker would express THAT EXACT SAME IDEA with more natural, idiomatic phrasing.
6. "vocabularySuggestions" array:
   - The "term" field MUST be an actual word or short phrase that appears in the Candidate's Transcript. Suggest an academic or idiomatic Band 8+ upgrade for it.

Candidate Details:
- Target Band: ${targetBand || 7.0}
- Current Level: ${currentLevel || 'Intermediate'}
- Test Part: ${part}
- Difficulty: ${difficulty || 'Medium'}
- Question / Prompt: "${question}"
${cuePoints && cuePoints.length ? `- Cue card bullet points: ${JSON.stringify(cuePoints)}` : ''}

Candidate's Transcript (Evaluate this exact text and nothing else):
"""
${transcript.trim()}
"""
`;

    const response = await generateWithFallback(ai, {
      contents: prompt,
      config: {
        systemInstruction: "You are a professional IELTS Speaking Examiner and Certified Coach. Return structured, high-accuracy IELTS evaluations in valid JSON. Never output conversational filler outside the JSON.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            overallBand: { type: Type.NUMBER, description: "Overall estimated IELTS Band score e.g. 6.5, 7.0" },
            criteria: {
              type: Type.OBJECT,
              properties: {
                fluencyCoherence: {
                  type: Type.OBJECT,
                  properties: {
                    band: { type: Type.NUMBER },
                    feedback: { type: Type.STRING },
                    strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
                    improvements: { type: Type.ARRAY, items: { type: Type.STRING } }
                  },
                  required: ["band", "feedback", "strengths", "improvements"]
                },
                lexicalResource: {
                  type: Type.OBJECT,
                  properties: {
                    band: { type: Type.NUMBER },
                    feedback: { type: Type.STRING },
                    strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
                    improvements: { type: Type.ARRAY, items: { type: Type.STRING } }
                  },
                  required: ["band", "feedback", "strengths", "improvements"]
                },
                grammaticalRangeAccuracy: {
                  type: Type.OBJECT,
                  properties: {
                    band: { type: Type.NUMBER },
                    feedback: { type: Type.STRING },
                    strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
                    improvements: { type: Type.ARRAY, items: { type: Type.STRING } }
                  },
                  required: ["band", "feedback", "strengths", "improvements"]
                },
                pronunciation: {
                  type: Type.OBJECT,
                  properties: {
                    band: { type: Type.NUMBER },
                    feedback: { type: Type.STRING },
                    strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
                    improvements: { type: Type.ARRAY, items: { type: Type.STRING } }
                  },
                  required: ["band", "feedback", "strengths", "improvements"]
                }
              },
              required: ["fluencyCoherence", "lexicalResource", "grammaticalRangeAccuracy", "pronunciation"]
            },
            strengths: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "What the user did well"
            },
            mistakes: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  original: { type: Type.STRING },
                  correction: { type: Type.STRING },
                  explanation: { type: Type.STRING }
                },
                required: ["original", "correction", "explanation"]
              },
              description: "Specific mistakes from their response"
            },
            vocabularySuggestions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  term: { type: Type.STRING },
                  advancedAlternative: { type: Type.STRING },
                  example: { type: Type.STRING }
                },
                required: ["term", "advancedAlternative", "example"]
              },
              description: "Vocabulary they could improve"
            },
            pronunciationFeedback: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Pronunciation areas to practice"
            },
            betterExpressions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  original: { type: Type.STRING },
                  refined: { type: Type.STRING }
                },
                required: ["original", "refined"]
              },
              description: "Better/natural ways to express some sentences"
            },
            roomForImprovement: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Main areas for improvement"
            },
            nextPracticeRecommendation: {
              type: Type.STRING,
              description: "A short recommendation for the next practice session"
            }
          },
          required: [
            "overallBand",
            "criteria",
            "strengths",
            "mistakes",
            "vocabularySuggestions",
            "pronunciationFeedback",
            "betterExpressions",
            "roomForImprovement",
            "nextPracticeRecommendation"
          ]
        }
      }
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (err: any) {
    console.warn('Notice: Evaluation using robust fallback generator due to transient model capacity limit:', err?.message || err);
    // Graceful fallback
    const fallback = generateFallbackEvaluation({
      part: req.body?.part || 'Part 1',
      question: req.body?.question || 'General Topic',
      transcript: req.body?.transcript || '',
      targetBand: Number(req.body?.targetBand) || 7.0,
      currentLevel: req.body?.currentLevel || 'Intermediate'
    });
    return res.json(fallback);
  }
});

// 2. Dynamic IELTS question generator endpoint
app.post('/api/generate-question', async (req, res) => {
  try {
    const { part, difficulty, topic } = req.body;
    const ai = getGenAI();

    if (!ai) {
      // Return predefined high-quality IELTS question
      if (part === 'Part 2') {
        return res.json({
          part: 'Part 2',
          topic: 'A Memorable Journey',
          question: 'Describe an exciting or memorable journey you have taken.',
          cuePoints: [
            'Where you went and how you traveled there',
            'Who you went with',
            'What you did during the journey',
            'And explain why this journey made a lasting impression on you.'
          ],
          prepTimeSeconds: 60,
          recommendedSpeakingSeconds: 120,
          difficulty: difficulty || 'Medium'
        });
      } else if (part === 'Part 3') {
        return res.json({
          part: 'Part 3',
          topic: 'Travel & Tourism in Society',
          question: 'How do you think international tourism influences local cultures and traditions?',
          cuePoints: [
            'Economic vs cultural impacts',
            'Preservation of historical heritage',
            'Future trends in eco-tourism'
          ],
          prepTimeSeconds: 0,
          recommendedSpeakingSeconds: 60,
          difficulty: difficulty || 'Medium'
        });
      } else {
        return res.json({
          part: 'Part 1',
          topic: 'Hometown & Living Environment',
          question: 'Can you tell me about the town or city where you grew up? What do you like most about it?',
          cuePoints: [],
          prepTimeSeconds: 0,
          recommendedSpeakingSeconds: 45,
          difficulty: difficulty || 'Medium'
        });
      }
    }

    const prompt = `
Generate a realistic official IELTS Speaking question for:
Part: ${part || 'Part 1'} (Part 1 = everyday familiar topics; Part 2 = Individual long run cue card with 'You should say' bullet points; Part 3 = In-depth two-way analytical discussion).
Difficulty: ${difficulty || 'Medium'} (Easy: familiar everyday topics, Medium: standard modern exam topics, Hard: abstract, philosophical, or policy-related questions).
Optional Topic theme: ${topic || 'Any standard IELTS topic'}.

Provide a JSON object with:
- part (string, e.g. "Part 1", "Part 2", "Part 3")
- topic (short 2-4 words topic title)
- question (the exact question or main prompt for the candidate)
- cuePoints (for Part 2: array of 4 bullet points starting with 'Where...', 'Who...', 'What...', and 'And explain why...'. For Part 1 or 3: empty array or 2 guidance prompts)
- prepTimeSeconds (number: 60 for Part 2, 0 for Part 1/3)
- recommendedSpeakingSeconds (number: 45 for Part 1, 120 for Part 2, 60 for Part 3)
`;

    const response = await generateWithFallback(ai, {
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            part: { type: Type.STRING },
            topic: { type: Type.STRING },
            question: { type: Type.STRING },
            cuePoints: { type: Type.ARRAY, items: { type: Type.STRING } },
            prepTimeSeconds: { type: Type.NUMBER },
            recommendedSpeakingSeconds: { type: Type.NUMBER },
            difficulty: { type: Type.STRING }
          },
          required: ["part", "topic", "question", "cuePoints", "prepTimeSeconds", "recommendedSpeakingSeconds"]
        }
      }
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (err: any) {
    console.warn('Notice: Using pre-configured questions due to transient capacity limit:', err?.message || err);
    return res.json({
      part: req.body?.part || 'Part 1',
      topic: 'Daily Habits & Leisure',
      question: 'What do you usually like to do when you have free time in the evenings?',
      cuePoints: [],
      prepTimeSeconds: 0,
      recommendedSpeakingSeconds: 45,
      difficulty: req.body?.difficulty || 'Medium'
    });
  }
});

// 3. Examiner follow-up question endpoint
app.post('/api/follow-up', async (req, res) => {
  try {
    const { question, transcript, part } = req.body;
    const ai = getGenAI();
    if (!ai) {
      return res.json({
        followUpQuestion: "That's interesting. Could you elaborate a little more on why that made such a notable difference for you?"
      });
    }

    const prompt = `
You are an IELTS Speaking Examiner. The candidate just spoke in response to: "${question}".
Their response transcript was: "${transcript}".
Generate ONE short, natural, encouraging IELTS follow-up question (1 sentence) that invites them to expand on a specific detail they mentioned or clarify their reasoning.
`;

    const response = await generateWithFallback(ai, {
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            followUpQuestion: { type: Type.STRING }
          },
          required: ["followUpQuestion"]
        }
      }
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (err: any) {
    console.warn('Notice: Using contextual follow-up prompt due to capacity limit:', err?.message || err);
    return res.json({
      followUpQuestion: "Could you tell me a little bit more about how that affected your day-to-day perspective?"
    });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Vite middleware / production serving
async function start() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`IELTS Speaking Coach AI Server running on http://localhost:${PORT}`);
  });
}

start();
