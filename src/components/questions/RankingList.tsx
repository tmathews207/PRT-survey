import type { ChoiceOption } from '../../types/survey';

interface Props {
  rowOptions: ChoiceOption[];
  value: Record<string, number>;
  onChange: (value: Record<string, number>) => void;
}

/**
 * Not used by the current PRT survey; kept ready for a future "rank these items" question.
 * Tap-to-rank: tapping an unranked item assigns it the next available rank; tapping a
 * ranked item clears it, so this works reliably on a phone without drag gestures.
 */
export function RankingListInput({ rowOptions, value, onChange }: Props) {
  const usedRanks = new Set(Object.values(value));
  const nextRank = () => {
    let n = 1;
    while (usedRanks.has(n)) n++;
    return n;
  };

  function tap(optionId: string) {
    const next = { ...value };
    if (next[optionId] != null) {
      delete next[optionId];
    } else {
      next[optionId] = nextRank();
    }
    onChange(next);
  }

  if (rowOptions.length === 0) {
    return <p className="muted">No items were selected on the previous question.</p>;
  }

  return (
    <div className="option-list">
      <p className="muted">Tap items in order of importance, most important first.</p>
      {rowOptions.map((row) => (
        <div key={row.id} className={`option-row${value[row.id] ? ' selected' : ''}`} onClick={() => tap(row.id)}>
          <span style={{ fontWeight: 700, width: 22, flexShrink: 0 }}>{value[row.id] ?? ''}</span>
          <label onClick={(e) => e.preventDefault()}>{row.label}</label>
        </div>
      ))}
    </div>
  );
}
