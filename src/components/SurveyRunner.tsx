import { useEffect, useState } from 'react';
import { SURVEY_PAGES, TOTAL_PAGES } from '../config/survey';
import type { AnswersState } from '../types/survey';
import { WelcomeScreen } from './WelcomeScreen';
import { InstructionsScreen } from './InstructionsScreen';
import { ProgressBar } from './ProgressBar';
import { QuestionBlock } from './QuestionBlock';
import { isPageComplete } from '../lib/validation';
import { submitResponse } from '../lib/submitResponse';

const DRAFT_KEY = 'prt-survey-draft-v1';

type Step = 'welcome' | 'instructions' | number | 'submitting' | 'thankyou';

function loadDraft(): { step: Step; answers: AnswersState } | null {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (typeof parsed?.step === 'undefined' || typeof parsed?.answers !== 'object') return null;
    return parsed;
  } catch {
    return null;
  }
}

function saveDraft(step: Step, answers: AnswersState) {
  try {
    localStorage.setItem(DRAFT_KEY, JSON.stringify({ step, answers }));
  } catch {
    // localStorage unavailable (private browsing, quota) -- fine, just means no autosave
  }
}

function clearDraft() {
  try {
    localStorage.removeItem(DRAFT_KEY);
  } catch {
    // ignore
  }
}

export function SurveyRunner() {
  const [step, setStep] = useState<Step>('welcome');
  const [answers, setAnswers] = useState<AnswersState>({});
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const draft = loadDraft();
    if (draft && typeof draft.step === 'number') {
      setStep(draft.step);
      setAnswers(draft.answers);
    }
  }, []);

  useEffect(() => {
    if (step === 'welcome' || step === 'thankyou' || step === 'submitting') return;
    saveDraft(step, answers);
  }, [step, answers]);

  function setAnswer(questionId: string, value: AnswersState[string]) {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  }

  async function handleNext() {
    if (step === 'welcome') {
      setStep('instructions');
      return;
    }
    if (step === 'instructions') {
      setStep(0);
      return;
    }
    if (typeof step === 'number') {
      const isLastPage = step === SURVEY_PAGES.length - 1;
      if (!isLastPage) {
        setStep(step + 1);
        window.scrollTo(0, 0);
        return;
      }
      setError(null);
      setStep('submitting');
      try {
        await submitResponse(answers);
        clearDraft();
        setStep('thankyou');
      } catch (e) {
        setError('Something went wrong submitting your response. Please check your connection and try again.');
        setStep(SURVEY_PAGES.length - 1);
      }
    }
  }

  if (step === 'welcome') {
    return <WelcomeScreen onStart={handleNext} />;
  }

  if (step === 'instructions') {
    return <InstructionsScreen onContinue={handleNext} />;
  }

  if (step === 'submitting') {
    return (
      <div className="centered-screen">
        <div className="card">
          <p>Submitting your response...</p>
        </div>
      </div>
    );
  }

  if (step === 'thankyou') {
    return (
      <div className="centered-screen">
        <div className="card">
          <h1 style={{ marginTop: 0 }}>Thank you</h1>
          <p>Your response has been submitted anonymously. Thanks for taking the time to share your input.</p>
        </div>
      </div>
    );
  }

  const page = SURVEY_PAGES[step];
  const complete = isPageComplete(page, answers);
  const isLastPage = step === SURVEY_PAGES.length - 1;

  return (
    <div className="page-container">
      <ProgressBar current={step + 1} total={TOTAL_PAGES} />
      <div className="card">
        {page.questions.map((q) => (
          <QuestionBlock key={q.id} question={q} answers={answers} setAnswer={setAnswer} />
        ))}
      </div>
      {error && <p className="error-text">{error}</p>}
      <div className="nav-footer">
        <button className="btn btn-primary btn-block" disabled={!complete} onClick={handleNext}>
          {isLastPage ? 'Submit' : 'Next'}
        </button>
      </div>
    </div>
  );
}
