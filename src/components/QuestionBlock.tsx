import type { AnswersState, Question } from '../types/survey';
import { explainKey, resolveRowOptions, resolveSelectedLabels } from '../lib/surveyHelpers';
import { SingleSelectInput } from './questions/SingleSelect';
import { MultiSelectInput } from './questions/MultiSelect';
import { MatrixRatingInput } from './questions/MatrixRating';
import { FreeTextInput } from './questions/FreeText';
import { ImageChoiceInput } from './questions/ImageChoice';
import { RankingListInput } from './questions/RankingList';

interface Props {
  question: Question;
  answers: AnswersState;
  setAnswer: (questionId: string, value: AnswersState[string]) => void;
}

export function QuestionBlock({ question, answers, setAnswer }: Props) {
  const promptHtml = 'promptHtml' in question ? question.promptHtml : undefined;

  return (
    <div className="question-block">
      {question.type === 'free-text' && question.promptFromQuestionId ? (
        <p className="question-prompt">
          {question.promptTemplate
            ? question.promptTemplate(resolveSelectedLabels(question.promptFromQuestionId, answers))
            : question.prompt}
        </p>
      ) : promptHtml ? (
        <p className="question-prompt" dangerouslySetInnerHTML={{ __html: promptHtml }} />
      ) : (
        <p className="question-prompt">{question.prompt}</p>
      )}

      {question.type === 'single-select' && (
        <SingleSelectInput
          question={question}
          value={answers[question.id] as string | undefined}
          explainValue={(answers[explainKey(question.id)] as string) ?? ''}
          onChange={(v) => setAnswer(question.id, v)}
          onExplainChange={(v) => setAnswer(explainKey(question.id), v)}
        />
      )}

      {question.type === 'multi-select' && (
        <MultiSelectInput
          question={question}
          value={(answers[question.id] as string[]) ?? []}
          explainValue={(answers[explainKey(question.id)] as string) ?? ''}
          onChange={(v) => setAnswer(question.id, v)}
          onExplainChange={(v) => setAnswer(explainKey(question.id), v)}
        />
      )}

      {question.type === 'matrix' && (
        <MatrixRatingInput
          question={question}
          rowOptions={resolveRowOptions(question.rowsFromQuestionId, answers)}
          value={(answers[question.id] as Record<string, string>) ?? {}}
          onChange={(v) => setAnswer(question.id, v)}
        />
      )}

      {question.type === 'free-text' && (
        <FreeTextInput
          value={(answers[question.id] as string) ?? ''}
          onChange={(v) => setAnswer(question.id, v)}
          maxLength={question.maxLength}
          allowPreferNotToAnswer={question.allowPreferNotToAnswer}
          ariaLabel={question.id}
        />
      )}

      {question.type === 'image-choice' && (
        <ImageChoiceInput
          question={question}
          value={answers[question.id] as string | undefined}
          onChange={(v) => setAnswer(question.id, v)}
        />
      )}

      {question.type === 'ranking' && (
        <RankingListInput
          rowOptions={resolveRowOptions(question.rowsFromQuestionId, answers)}
          value={(answers[question.id] as Record<string, number>) ?? {}}
          onChange={(v) => setAnswer(question.id, v)}
        />
      )}
    </div>
  );
}
