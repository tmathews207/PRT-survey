import type { ImageChoiceQuestion } from '../../types/survey';

interface Props {
  question: ImageChoiceQuestion;
  value: string | undefined;
  onChange: (value: string) => void;
}

/** Not used by the current PRT survey; kept ready for a future image-based question. */
export function ImageChoiceInput({ question, value, onChange }: Props) {
  return (
    <div className="image-grid">
      {question.images.map((img) => (
        <div
          key={img.id}
          className={`image-option${value === img.id ? ' selected' : ''}`}
          onClick={() => onChange(img.id)}
          role="radio"
          aria-checked={value === img.id}
        >
          <img src={img.src} alt={img.label} />
          <div className="image-option-caption">{img.label}</div>
        </div>
      ))}
    </div>
  );
}
