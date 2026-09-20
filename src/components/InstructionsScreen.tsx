import { INSTRUCTIONS_TEXT } from '../config/survey';

interface Props {
  onContinue: () => void;
}

export function InstructionsScreen({ onContinue }: Props) {
  return (
    <div className="centered-screen">
      <div className="card">
        <h1 style={{ marginTop: 0 }}>Instructions</h1>
        <p className="whitespace-pre-line">{INSTRUCTIONS_TEXT}</p>
        <img
          className="question-image"
          src="/illustrations/soldier-firing-weapon-scales.webp"
          alt="A soldier firing a weapon while holding a set of scales, representing justice"
        />
        <button className="btn btn-primary btn-block" onClick={onContinue}>
          Continue
        </button>
      </div>
    </div>
  );
}
