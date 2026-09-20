import { useEffect, useMemo, useState } from 'react';
import { SURVEY_PAGES } from '../config/survey';
import type { Question } from '../types/survey';
import { fetchPromptOverrides, resetPromptOverride, savePromptOverride, type PromptOverrides } from '../lib/promptOverrides';

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, '');
}

/** Whether a question's prompt is a fixed string that can be overridden, vs. generated
 * at render time from a prior answer (e.g. "you indicated X, Y, Z. Why?"). */
function isEditablePrompt(question: Question): boolean {
  return !(question.type === 'free-text' && question.promptFromQuestionId);
}

function defaultPromptText(question: Question): string {
  const html = 'promptHtml' in question ? question.promptHtml : undefined;
  return html ? stripHtml(html) : question.prompt;
}

/** Read-only context shown under the editable prompt, so the admin can see what the
 * question looks like without needing to open the live site. */
function optionsPreview(question: Question): string[] {
  switch (question.type) {
    case 'single-select':
    case 'multi-select':
      return question.options.map((o) => o.label);
    case 'matrix':
      return question.columns.map((c) => c.label);
    case 'image-choice':
      return question.images.map((i) => i.label);
    case 'free-text':
      return question.numeric ? ['(numeric answer)'] : ['(free-text answer)'];
    case 'ranking':
      return ['(respondent ranks the items selected in a prior question)'];
    default:
      return [];
  }
}

export function AdminSurveyEditor() {
  const [overrides, setOverrides] = useState<PromptOverrides | null>(null);
  const [edits, setEdits] = useState<Record<string, string>>({});
  const [savingId, setSavingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [savedFlash, setSavedFlash] = useState(false);

  const editableQuestions = useMemo(
    () => SURVEY_PAGES.flatMap((page) => page.questions.filter(isEditablePrompt)),
    [],
  );

  useEffect(() => {
    fetchPromptOverrides().then((loaded) => {
      setOverrides(loaded);
      const initialEdits: Record<string, string> = {};
      for (const q of editableQuestions) {
        initialEdits[q.id] = loaded[q.id] ?? defaultPromptText(q);
      }
      setEdits(initialEdits);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function effectiveDefault(question: Question): string {
    return overrides?.[question.id] ?? defaultPromptText(question);
  }

  function isDirty(question: Question): boolean {
    return edits[question.id] !== effectiveDefault(question);
  }

  function hasOverride(question: Question): boolean {
    return overrides != null && question.id in overrides;
  }

  async function handleSave(question: Question) {
    setError(null);
    setSavingId(question.id);
    try {
      await savePromptOverride(question.id, edits[question.id]);
      setOverrides((prev) => ({ ...(prev ?? {}), [question.id]: edits[question.id] }));
      setSavedFlash(true);
      setTimeout(() => setSavedFlash(false), 1500);
    } catch (e) {
      setError('Could not save that change. Check your connection and try again.');
    } finally {
      setSavingId(null);
    }
  }

  async function handleReset(question: Question) {
    setError(null);
    setSavingId(question.id);
    try {
      await resetPromptOverride(question.id);
      setOverrides((prev) => {
        const next = { ...(prev ?? {}) };
        delete next[question.id];
        return next;
      });
      setEdits((prev) => ({ ...prev, [question.id]: defaultPromptText(question) }));
    } catch (e) {
      setError('Could not reset that question. Check your connection and try again.');
    } finally {
      setSavingId(null);
    }
  }

  if (overrides === null) {
    return <p className="muted">Loading survey text...</p>;
  }

  return (
    <div>
      <p className="muted" style={{ marginTop: 0 }}>
        Scroll through every page below exactly as it's worded on the live survey. You can edit a question's
        wording here -- answer choices, pages, and question order can't be changed from this screen. Edits go
        live immediately once saved, no redeploy needed.
      </p>
      {error && <p className="error-text">{error}</p>}
      {savedFlash && <p style={{ color: 'var(--navy)', fontSize: 13, fontWeight: 600 }}>Saved.</p>}

      {SURVEY_PAGES.map((page, pageIndex) => (
        <div className="card editor-page" key={page.id}>
          <div className="editor-page-heading">Page {pageIndex + 1}</div>
          {page.questions.map((question) => {
            const preview = optionsPreview(question);
            const isDynamic = question.type === 'free-text' && question.promptFromQuestionId;
            return (
              <div className="editor-question" key={question.id}>
                <div className="editor-question-id">{question.id}</div>
                {!isDynamic ? (
                  <>
                    <textarea
                      className="editor-prompt-input"
                      value={edits[question.id] ?? ''}
                      onChange={(e) => setEdits((prev) => ({ ...prev, [question.id]: e.target.value }))}
                    />
                    <div className="editor-question-actions">
                      <button
                        className="btn"
                        style={{ padding: '8px 16px', fontSize: 14 }}
                        disabled={!isDirty(question) || savingId === question.id}
                        onClick={() => handleSave(question)}
                      >
                        {savingId === question.id ? 'Saving...' : 'Save'}
                      </button>
                      {hasOverride(question) && (
                        <button
                          className="btn"
                          style={{ padding: '8px 16px', fontSize: 14, background: 'transparent', border: '1px solid var(--border)' }}
                          disabled={savingId === question.id}
                          onClick={() => handleReset(question)}
                        >
                          Reset to original
                        </button>
                      )}
                    </div>
                  </>
                ) : (
                  <div>
                    <p className="question-prompt" style={{ fontSize: 15 }}>
                      {question.promptTemplate ? question.promptTemplate([]) : question.prompt}
                    </p>
                    <p className="muted" style={{ fontSize: 12.5 }}>
                      This wording is generated automatically from a previous answer and can't be edited here.
                    </p>
                  </div>
                )}
                {preview.length > 0 && (
                  <ul className="editor-options-preview">
                    {preview.map((label, i) => (
                      <li key={i}>{label}</li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
