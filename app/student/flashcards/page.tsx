'use client';

import { GlowingEffect } from '@/components/ui/glowing-effect';
import { BookOpen, Sparkles, RotateCcw, ChevronLeft, ChevronRight, Check, X, Loader2, Lightbulb } from 'lucide-react';
import { useState } from 'react';

interface Flashcard {
  id: number;
  front: string;
  back: string;
  hint?: string;
  difficulty: string;
  category: string;
}

export default function FlashcardsPage() {
  const [topic, setTopic] = useState('');
  const [subject, setSubject] = useState('Mathematics');
  const [count, setCount] = useState(10);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [loading, setLoading] = useState(false);
  const [known, setKnown] = useState<Set<number>>(new Set());
  const [studyTip, setStudyTip] = useState('');

  const subjects = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'History', 'Geography'];

  const generateFlashcards = async () => {
    if (!topic.trim()) return;
    
    setLoading(true);
    setFlashcards([]);
    setCurrentIndex(0);
    setKnown(new Set());
    setIsFlipped(false);
    
    try {
      const response = await fetch('/api/ai/flashcards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, subject, count, difficulty }),
      });
      
      const data = await response.json();
      
      if (data.success && data.data?.flashcards) {
        setFlashcards(data.data.flashcards);
        setStudyTip(data.data.studyTip || '');
      }
    } catch (error) {
      console.error('Error generating flashcards:', error);
    } finally {
      setLoading(false);
    }
  };

  const nextCard = () => {
    setIsFlipped(false);
    setShowHint(false);
    setCurrentIndex((prev) => (prev + 1) % flashcards.length);
  };

  const prevCard = () => {
    setIsFlipped(false);
    setShowHint(false);
    setCurrentIndex((prev) => (prev - 1 + flashcards.length) % flashcards.length);
  };

  const markKnown = () => {
    setKnown((prev) => new Set([...prev, currentIndex]));
    nextCard();
  };

  const currentCard = flashcards[currentIndex];
  const progress = flashcards.length > 0 ? ((currentIndex + 1) / flashcards.length) * 100 : 0;
  const knownCount = known.size;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <BookOpen className="w-7 h-7 text-yellow-400" />
            Flashcards
          </h2>
          <p className="text-muted-foreground">Generate AI-powered flashcards for revision</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
          <Sparkles className="w-5 h-5 text-yellow-400" />
          <span className="text-sm font-medium text-yellow-400">AI Powered</span>
        </div>
      </div>

      {/* Generator Form */}
      {flashcards.length === 0 && (
        <div className="relative rounded-2xl border border-border p-1">
          <GlowingEffect spread={40} glow={true} disabled={false} proximity={64} inactiveZone={0.01} borderWidth={2} />
          <div className="relative bg-card rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4">Generate Flashcards</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Subject</label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-muted border border-border focus:border-yellow-500 focus:outline-none"
                >
                  {subjects.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Topic</label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g., Quadratic Equations, Newton's Laws..."
                  className="w-full px-4 py-3 rounded-lg bg-muted border border-border focus:border-yellow-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Number of Cards</label>
                <select
                  value={count}
                  onChange={(e) => setCount(Number(e.target.value))}
                  className="w-full px-4 py-3 rounded-lg bg-muted border border-border focus:border-yellow-500 focus:outline-none"
                >
                  <option value={5}>5 cards</option>
                  <option value={10}>10 cards</option>
                  <option value={15}>15 cards</option>
                  <option value={20}>20 cards</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Difficulty</label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value as 'easy' | 'medium' | 'hard')}
                  className="w-full px-4 py-3 rounded-lg bg-muted border border-border focus:border-yellow-500 focus:outline-none"
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
            </div>
            <button
              onClick={generateFlashcards}
              disabled={loading || !topic.trim()}
              className="mt-6 w-full px-6 py-4 rounded-xl bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generating Flashcards...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Generate Flashcards
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Flashcard Display */}
      {flashcards.length > 0 && (
        <>
          {/* Progress */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                Card {currentIndex + 1} of {flashcards.length}
              </span>
              <span className="text-sm text-green-400">
                {knownCount} known
              </span>
            </div>
            <button
              onClick={() => {
                setFlashcards([]);
                setTopic('');
              }}
              className="flex items-center gap-2 px-3 py-1 rounded-lg border border-border hover:bg-muted text-sm"
            >
              <RotateCcw className="w-4 h-4" />
              New Set
            </button>
          </div>

          {/* Progress Bar */}
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-yellow-500 to-orange-500 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Card */}
          <div className="relative rounded-2xl border border-border p-1 min-h-[400px]">
            <GlowingEffect spread={50} glow={true} disabled={false} proximity={80} inactiveZone={0.01} borderWidth={2} />
            <div
              className="relative bg-card rounded-xl p-8 min-h-[380px] cursor-pointer flex flex-col items-center justify-center text-center"
              onClick={() => setIsFlipped(!isFlipped)}
            >
              {/* Category Badge */}
              <div className="absolute top-4 left-4">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  currentCard.category === 'formula' ? 'bg-blue-500/20 text-blue-400' :
                  currentCard.category === 'definition' ? 'bg-green-500/20 text-green-400' :
                  currentCard.category === 'fact' ? 'bg-blue-600/20 text-blue-500' :
                  'bg-orange-500/20 text-orange-400'
                }`}>
                  {currentCard.category}
                </span>
              </div>

              {/* Known Badge */}
              {known.has(currentIndex) && (
                <div className="absolute top-4 right-4">
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400">
                    ✓ Known
                  </span>
                </div>
              )}

              {/* Card Content */}
              <div className="flex-1 flex items-center justify-center p-4">
                <div className="text-center">
                  <p className="text-xs text-muted-foreground mb-4">
                    {isFlipped ? 'ANSWER' : 'QUESTION'}
                  </p>
                  <p className="text-xl md:text-2xl font-medium leading-relaxed">
                    {isFlipped ? currentCard.back : currentCard.front}
                  </p>
                </div>
              </div>

              {/* Hint */}
              {!isFlipped && currentCard.hint && (
                <div className="mt-4">
                  {showHint ? (
                    <p className="text-sm text-yellow-400 flex items-center gap-2">
                      <Lightbulb className="w-4 h-4" />
                      {currentCard.hint}
                    </p>
                  ) : (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowHint(true);
                      }}
                      className="text-sm text-muted-foreground hover:text-yellow-400 flex items-center gap-2"
                    >
                      <Lightbulb className="w-4 h-4" />
                      Show Hint
                    </button>
                  )}
                </div>
              )}

              <p className="text-xs text-muted-foreground mt-4">
                Click to flip
              </p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between">
            <button
              onClick={prevCard}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border hover:bg-muted"
            >
              <ChevronLeft className="w-5 h-5" />
              Previous
            </button>

            <div className="flex items-center gap-3">
              <button
                onClick={nextCard}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30"
              >
                <X className="w-5 h-5" />
                Still Learning
              </button>
              <button
                onClick={markKnown}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500/20 text-green-400 hover:bg-green-500/30"
              >
                <Check className="w-5 h-5" />
                Got It!
              </button>
            </div>

            <button
              onClick={nextCard}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border hover:bg-muted"
            >
              Next
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Study Tip */}
          {studyTip && (
            <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
              <p className="text-sm text-yellow-400 flex items-center gap-2">
                <Lightbulb className="w-4 h-4" />
                {studyTip}
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
