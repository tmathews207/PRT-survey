import { WELCOME_TEXT } from '../config/survey';

interface Props {
  onStart: () => void;
}

export function WelcomeScreen({ onStart }: Props) {
  return (
    <div className="centered-screen">
      <div className="card">
        <h1 style={{ marginTop: 0 }}>PRT Survey</h1>
        <p className="whitespace-pre-line">{WELCOME_TEXT}</p>
        <img className="question-image" src="/illustrations/soldiers-formation.webp" alt="A group of soldiers standing in formation" />
        <button className="btn btn-primary btn-block" onClick={onStart}>
          START
        </button>
      </div>
    </div>
  );
}
