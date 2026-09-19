import { PREFER_NOT_TO_ANSWER } from '../../types/survey';

interface FreeTextInputProps {
  value: string;
  onChange: (value: string) => void;
  maxLength?: number;
  allowPreferNotToAnswer?: boolean;
  placeholder?: string;
  ariaLabel?: string;
}

/** A single free-text control, reused both as a standalone question and inline "(explain)" box. */
export function FreeTextInput({
  value,
  onChange,
  maxLength = 1000,
  allowPreferNotToAnswer = false,
  placeholder = 'Type your answer...',
  ariaLabel,
}: FreeTextInputProps) {
  const declined = value === PREFER_NOT_TO_ANSWER;

  return (
    <div>
      <textarea
        aria-label={ariaLabel}
        value={declined ? '' : value}
        maxLength={maxLength}
        placeholder={placeholder}
        disabled={declined}
        onChange={(e) => onChange(e.target.value)}
      />
      {!declined && (
        <div className="char-count">
          {value.length}/{maxLength}
        </div>
      )}
      {allowPreferNotToAnswer && (
        <label className="prefer-not">
          <input
            type="checkbox"
            checked={declined}
            onChange={(e) => onChange(e.target.checked ? PREFER_NOT_TO_ANSWER : '')}
          />
          Prefer not to answer
        </label>
      )}
    </div>
  );
}
