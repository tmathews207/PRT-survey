import type { MultiSelectQuestion } from '../../types/survey';
import { FreeTextInput } from './FreeText';

interface Props {
  question: MultiSelectQuestion;
  value: string[];
  explainValue: string;
  onChange: (value: string[]) => void;
  onExplainChange: (value: string) => void;
}

export function MultiSelectInput({ question, value, explainValue, onChange, onExplainChange }: Props) {
  function toggle(optionId: string) {
    if (value.includes(optionId)) {
      onChange(value.filter((id) => id !== optionId));
    } else {
      onChange([...value, optionId]);
    }
  }

  const explainSelected = question.options.some((o) => o.explain && value.includes(o.id));

  return (
    <div className="option-list">
      {question.options.map((option) => (
        <div
          key={option.id}
          className={`option-row${value.includes(option.id) ? ' selected' : ''}`}
          onClick={() => toggle(option.id)}
        >
          <input type="checkbox" checked={value.includes(option.id)} onChange={() => toggle(option.id)} />
          <label onClick={(e) => e.preventDefault()}>{option.label}</label>
        </div>
      ))}
      {explainSelected && (
        <div className="explain-box">
          <FreeTextInput value={explainValue} onChange={onExplainChange} ariaLabel={`${question.id} explanation`} />
        </div>
      )}
    </div>
  );
}
