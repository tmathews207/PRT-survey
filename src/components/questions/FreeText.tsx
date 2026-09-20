import { PREFER_NOT_TO_ANSWER } from '../../types/survey';

interface FreeTextInputProps {
  value: string;
  onChange: (value: string) => void;
  maxLength?: number;
  allowPreferNotToAnswer?: boolean;
  placeholder?: string;
  ariaLabel?: string;
  /** Renders a numeric input (brings up the number pad on mobile) instead of a textarea. */
  numeric?: boolean;
}

/** A single free-text control, reused both as a standalone question and inline "(explain)" box. */
export function FreeTextInput({
  value,
  onChange,
  maxLength = 1000,
  allowPreferNotToAnswer = false,
  placeholder = 'Type your answer...',
  ariaLabel,
  numeric = false,
}: FreeTextInputProps) {
  const declined = value === PREFER_NOT_TO_ANSWER;

  return (
    <div>
      {numeric ? (
        <input
          className="text-input"
          type="number"
          inputMode="decimal"
          step="0.5"
          min="0"
          max="24"
          aria-label={ariaLabel}
          value={declined ? '' : value}
          placeholder="e.g. 7"
          disabled={declined}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <>
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
        </>
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
