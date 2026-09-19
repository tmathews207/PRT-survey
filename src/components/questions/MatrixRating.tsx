import type { ChoiceOption, MatrixQuestion } from '../../types/survey';

interface Props {
  question: MatrixQuestion;
  rowOptions: ChoiceOption[];
  value: Record<string, string>;
  onChange: (value: Record<string, string>) => void;
}

export function MatrixRatingInput({ question, rowOptions, value, onChange }: Props) {
  function setCell(rowId: string, colId: string) {
    onChange({ ...value, [rowId]: colId });
  }

  if (rowOptions.length === 0) {
    return <p className="muted">No items were selected on the previous question.</p>;
  }

  return (
    <div>
      <div className="matrix-table-wrap" style={{ overflowX: 'auto' }}>
        <table className="matrix-table">
          <thead>
            <tr>
              <th></th>
              {question.columns.map((col) => (
                <th key={col.id}>{col.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rowOptions.map((row) => (
              <tr key={row.id}>
                <td>{row.label}</td>
                {question.columns.map((col) => (
                  <td key={col.id}>
                    <input
                      type="radio"
                      name={`${question.id}_${row.id}`}
                      checked={value[row.id] === col.id}
                      onChange={() => setCell(row.id, col.id)}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="matrix-row-stack">
        {rowOptions.map((row) => (
          <div className="matrix-row-card" key={row.id}>
            <div className="matrix-row-title">{row.label}</div>
            <div className="matrix-col-options">
              {question.columns.map((col) => (
                <label className="matrix-col-option" key={col.id}>
                  <input
                    type="radio"
                    name={`${question.id}_${row.id}_stack`}
                    checked={value[row.id] === col.id}
                    onChange={() => setCell(row.id, col.id)}
                  />
                  {col.label}
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
