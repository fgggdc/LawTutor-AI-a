const fs = require('fs');
let content = fs.readFileSync('src/components/MockVivaQuiz.tsx', 'utf-8');

// Add import for QuizDashboard and some icons
content = content.replace(
  "import { LawSubjectId, QuizQuestion } from '../types';",
  "import { LawSubjectId, QuizQuestion } from '../types';\nimport { QuizDashboard } from './QuizDashboard';\nimport { BarChart3, Edit3 } from 'lucide-react';"
);

// Add result interface
content = content.replace(
  "const DEFAULT_QUIZ_QUESTIONS: QuizQuestion[] = [",
  "export interface QuizResult {\n  id: string;\n  timestamp: number;\n  score: number;\n  total: number;\n  subjectId: string;\n}\n\nconst DEFAULT_QUIZ_QUESTIONS: QuizQuestion[] = ["
);

// Add state to component
content = content.replace(
  "const [loadingNewQuiz, setLoadingNewQuiz] = useState(false);",
  "const [loadingNewQuiz, setLoadingNewQuiz] = useState(false);\n  const [viewMode, setViewMode] = useState<'quiz' | 'dashboard'>('quiz');\n  const [quizResults, setQuizResults] = useState<QuizResult[]>([]);\n\n  useEffect(() => {\n    const stored = localStorage.getItem('mockQuizResults');\n    if (stored) {\n      try {\n        setQuizResults(JSON.parse(stored));\n      } catch(e) {}\n    }\n  }, []);"
);

// Update handleNextQuestion to save results
content = content.replace(
  "setQuizFinished(true);\n    }",
  "setQuizFinished(true);\n      const newResult: QuizResult = {\n        id: Date.now().toString(),\n        timestamp: Date.now(),\n        score: score + (selectedOption === currentQ.correctIndex && !isAnswerSubmitted ? 1 : 0), // Adjust if last question wasn't counted yet, but we already incremented score in handleSubmitAnswer. Actually, let's just use 'score' since handleSubmitAnswer is required before next.\n        total: questions.length,\n        subjectId: selectedSubject\n      };\n      const updatedResults = [...quizResults, newResult];\n      setQuizResults(updatedResults);\n      localStorage.setItem('mockQuizResults', JSON.stringify(updatedResults));\n    }"
);

// Update handleNextQuestion again since score might not reflect the last question if next is clicked before submit? No, next is only available AFTER submit.
content = content.replace(
  "score: score + (selectedOption === currentQ.correctIndex && !isAnswerSubmitted ? 1 : 0), // Adjust if last question wasn't counted yet, but we already incremented score in handleSubmitAnswer. Actually, let's just use 'score' since handleSubmitAnswer is required before next.",
  "score: score,"
);


// Add Toggle UI
const toggleUI = `
      {/* View Toggle */}
      <div className="flex bg-stone-200/50 p-1 rounded-xl w-full sm:w-fit mx-auto mb-6">
        <button
          onClick={() => setViewMode('quiz')}
          className={\`flex-1 sm:px-6 py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all \${viewMode === 'quiz' ? 'bg-white shadow-sm text-amber-700' : 'text-stone-500 hover:text-stone-700'}\`}
        >
          <Edit3 className="w-4 h-4" />
          <span>মক টেস্ট দিন</span>
        </button>
        <button
          onClick={() => setViewMode('dashboard')}
          className={\`flex-1 sm:px-6 py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all \${viewMode === 'dashboard' ? 'bg-white shadow-sm text-amber-700' : 'text-stone-500 hover:text-stone-700'}\`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>পারফরম্যান্স ড্যাশবোর্ড</span>
        </button>
      </div>

      {viewMode === 'dashboard' ? (
        <QuizDashboard results={quizResults} />
      ) : (
        <div className="space-y-6">
`;

content = content.replace(
  "{/* Subject Filter & Generator Bar */}",
  toggleUI + "\n      {/* Subject Filter & Generator Bar */}"
);

// Add closing tags for the toggle wrapper
content = content.replace(
  "</div>\n  );\n};\n",
  "</div>\n      )}\n    </div>\n  );\n};\n"
);

fs.writeFileSync('src/components/MockVivaQuiz.tsx', content);

