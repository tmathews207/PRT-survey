import type { SingleSelectQuestion } from '../../types/survey';
import { FreeTextInput } from './FreeText';

interface Props {
  question: SingleSelectQuestion;
  value: string | undefined;
  explainValue: string;
  onChange: (value: string) => void;
  onExplainChange: (value: string) => void;
}

export function SingleSelectInput({ question, value, explainValue, onChange, onExplainChange }: Props) {
  const selectedOption = question.options.find((o) => o.id === value);

  return (
    <div className="option-list">
      {question.options.map((option) => (
        <div key={option.id}>
          <div
            className={`option-row${value === option.id ? ' selected' : ''}`}
            onClick={() => onChange(option.id)}
          >
            <input
              type="radio"
              name={question.id}
              checked={value === option.id}
              onChange={() => onChange(option.id)}
            />
            <label onClick={(e) => e.preventDefault()}>{option.label}</label>
          </div>
          {option.explain && selectedOption?.id === option.id && (
            <div className="explain-box">
              <FreeTextInput
                value={explainValue}
                onChange={onExplainChange}
                ariaLabel={`${question.id} explanation`}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
