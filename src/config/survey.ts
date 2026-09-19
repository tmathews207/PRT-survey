import type { SurveyPage } from '../types/survey';

export const WELCOME_TEXT = `This survey does not ask for identifying information or demographic data. Just take the survey. All results will be compiled into one data set.

There are no trick questions. There are no right or wrong answers, since this survey is simply assessing assumptions, beliefs, and preferences. Accordingly, there is no back button. Just give your opinion, click next, and move along.

This survey takes about 5 minutes, unless you want to type lengthy comments.`;

export const INSTRUCTIONS_TEXT = `When completing this survey, assume that you are in an OSJA that supports a GCMCA and has installation support responsibilities (so, for example, XVIII ABN Corps, 3ID, JRTC & Fort Polk, etc), or that you are in a brigade legal office that regularly conducts PRT with the OSJA. The OSJA has technical supervision over several legal offices that support tenant brigades. Your OSJA has an SJA, CPNCO, DSJA, at least one legal administrator, a senior Civilian, at least 3 divisions within the office, and the personnel are approximately 40% officers, 30% NCOs, 20% junior enlisted, and 10% Civilians. Most Soldiers will serve 2 to 4 years in that location and then PCS or ETS.`;

/** Joins option labels into a readable sentence fragment: "a, b, and c" / "a and b" / "a" */
export function joinLabels(labels: string[]): string {
  if (labels.length === 0) return '';
  if (labels.length === 1) return labels[0];
  if (labels.length === 2) return `${labels[0]} and ${labels[1]}`;
  return `${labels.slice(0, -1).join(', ')}, and ${labels[labels.length - 1]}`;
}

export const SURVEY_PAGES: SurveyPage[] = [
  {
    id: 'page1',
    pageNumber: 1,
    questions: [
      {
        id: 'q1',
        type: 'multi-select',
        prompt: 'The purpose of physical readiness training is to (choose all that apply):',
        options: [
          { id: 'raise_aft', label: 'Raise AFT scores' },
          { id: 'raise_morale', label: 'Raise morale' },
          { id: 'esprit_de_corps', label: 'Enhance esprit de corps' },
          { id: 'improve_physical_readiness', label: 'Improve physical readiness' },
          { id: 'build_teams', label: 'Build teams' },
          { id: 'mental_toughness', label: 'Instill mental toughness' },
          { id: 'leadership_training', label: 'Provide leadership training' },
        ],
      },
    ],
  },
  {
    id: 'page2',
    pageNumber: 2,
    questions: [
      {
        id: 'q2',
        type: 'matrix',
        prompt: 'You selected the purposes below. Rate how important each one is.',
        rowsFromQuestionId: 'q1',
        columns: [
          { id: 'fail_without', label: 'Program is a failure if it doesn’t do this.' },
          { id: 'very_important', label: 'Not the primary focus, but very important.' },
          { id: 'nice_to_have', label: 'Nice to have.' },
          { id: 'not_important', label: 'Not important.' },
          { id: 'irrelevant', label: 'Irrelevant.' },
        ],
      },
    ],
  },
  {
    id: 'page3',
    pageNumber: 3,
    questions: [
      {
        id: 'q3a',
        type: 'single-select',
        prompt:
          'Suppose organized PRT occurs on every duty day. If so, then should this be all the training that anyone needs to meet and exceed Army physical fitness standards?',
        options: [
          { id: 'yes_five_days', label: 'Yes. Five days in a typical week is adequate training time.' },
          { id: 'depends', label: 'It depends. It will be adequate for some, but not others.' },
          {
            id: 'no_baseline',
            label:
              'No. This is just a baseline level of training. People will still need to train on their own in addition to PRT.',
          },
          { id: 'other', label: 'Something else (explain).', explain: true },
        ],
      },
      {
        id: 'q3b',
        type: 'single-select',
        prompt: 'If organized PRT occurs on a few duty days, and soldiers are left to train on their own on other days:',
        options: [
          { id: 'prescribed', label: 'What they do on those other days should be prescribed by an officer or NCO.' },
          {
            id: 'reviewed',
            label:
              'What they do on those other days should be reviewed by a supervisor (soldier chooses; supervisor validates).',
          },
          {
            id: 'basic_criteria',
            label:
              'What they do on those other days just needs to fulfill some basic criteria (amount and type of training) but the Soldier can choose within those bounds.',
          },
          {
            id: 'soldier_choice_monitored',
            label: 'What they do on those other days should be left to the Soldier. Supervisors just monitor.',
          },
          {
            id: 'entirely_soldier',
            label: 'What they do is entirely on the Soldier. If they fail the AFT, then it was inadequate.',
          },
        ],
      },
    ],
  },
  {
    id: 'page4',
    pageNumber: 4,
    questions: [
      {
        id: 'q4a',
        type: 'single-select',
        prompt: 'Select the answer that is most accurate.\n\nMy training from the Army has given me the knowledge necessary to:',
        options: [
          { id: 'plan_for_self_and_others', label: 'Plan physical training for myself and others.' },
          { id: 'plan_for_self_only', label: 'Only plan my own physical training.' },
          { id: 'seek_resources', label: 'Seek out appropriate resources for planning guidance.' },
          { id: 'follow_instructions', label: 'Just do what I am told.' },
        ],
      },
      {
        id: 'q4b',
        type: 'single-select',
        prompt:
          'Knowledge that I have obtained elsewhere (college major, credentialing, a coach, self-study, etc) has given me the knowledge necessary to:',
        options: [
          { id: 'plan_for_self_and_others_ext', label: 'Plan physical training for myself and others.' },
          { id: 'plan_for_self_only_ext', label: 'Only plan my own physical training.' },
          { id: 'seek_resources_ext', label: 'Seek out appropriate resources for planning guidance.' },
          { id: 'follow_instructions_ext', label: 'Just do what I am told.' },
        ],
      },
    ],
  },
  {
    id: 'page5',
    pageNumber: 5,
    questions: [
      {
        id: 'q5',
        type: 'single-select',
        prompt:
          'A good workout is one that makes me sweaty, exhausted, breathe heavily, elevates my heart rate, and induces muscle soreness.\n\nWhich of the following comes closest to your view of the statement above?',
        options: [
          { id: 'accurate', label: 'This is accurate.' },
          { id: 'usually_accurate', label: 'This is usually accurate.' },
          { id: 'different_criteria', label: 'I think whether a workout is good should be assessed with different criteria.' },
          { id: 'usually_not_accurate', label: 'This is usually not accurate.' },
          { id: 'not_accurate', label: 'This is not accurate.' },
        ],
      },
    ],
  },
  {
    id: 'page6',
    pageNumber: 6,
    questions: [
      {
        id: 'q6a',
        type: 'single-select',
        prompt:
          'For the following questions, state your preference. Do not select the answer just because you think it is “the right answer.” Select what is closest to your preference.\n\nI prefer physical training:',
        options: [
          { id: 'large_group', label: 'as a large group.' },
          { id: 'small_group', label: 'as a small group.' },
          { id: 'alone', label: 'on my own.' },
          { id: 'other', label: 'something else (explain).', explain: true },
        ],
      },
      {
        id: 'q6b',
        type: 'single-select',
        prompt: 'I prefer physical training with people who:',
        options: [
          { id: 'similar_goals', label: 'have similar fitness goals.' },
          { id: 'different_goals', label: 'have different fitness goals.' },
          { id: 'mix', label: 'a mix of both.' },
          { id: 'other', label: 'something else (explain).', explain: true },
        ],
      },
      {
        id: 'q6c',
        type: 'single-select',
        prompt: 'I prefer training in:',
        options: [
          { id: 'similar_ability', label: 'a group of similar ability.' },
          { id: 'mixed_ability', label: 'a group of mixed abilities.' },
          { id: 'mix', label: 'a mix of both.' },
          { id: 'other', label: 'something else (explain).', explain: true },
        ],
      },
    ],
  },
  {
    id: 'page7',
    pageNumber: 7,
    questions: [
      {
        id: 'q7',
        type: 'single-select',
        prompt: 'Which of these most closely aligns to your preference for physical readiness training?',
        options: [
          {
            id: 'show_up_told',
            label:
              'I prefer to just show up and have someone tell me what the workout will be; it helps me offload mental work to someone else.',
          },
          {
            id: 'know_in_advance',
            label:
              'I like for someone else to come up with the plan, but I prefer to know in advance what it will be, so I can arrive prepared.',
          },
          { id: 'decide_myself', label: 'I prefer to decide for myself what my workout will be.' },
          { id: 'no_preference', label: 'I really don’t have any preference.' },
        ],
      },
    ],
  },
  {
    id: 'page8',
    pageNumber: 8,
    questions: [
      {
        id: 'q8a',
        type: 'single-select',
        prompt:
          'Has your fitness improved since you joined the Army? Think in terms of strength, power, endurance (muscular, aerobic, anaerobic), mobility, and flexibility.',
        options: [
          { id: 'all_improved', label: 'All aspects of fitness have improved' },
          { id: 'most_improved', label: 'Most aspects of my fitness have improved; a few remained the same or got worse' },
          { id: 'no_change', label: 'No significant change.' },
          { id: 'few_improved', label: 'A few aspects of my fitness have improved; most have remained the same or gotten worse.' },
          { id: 'worse', label: 'My fitness has gotten worse.' },
        ],
      },
      {
        id: 'q8b',
        type: 'single-select',
        prompt: 'Do you attribute this to Army PRT or your own individual training?',
        options: [
          { id: 'army_prt', label: 'Army PRT' },
          { id: 'own_training', label: 'My own training' },
          { id: 'both', label: 'Both' },
          { id: 'other', label: 'Something else (explain)', explain: true },
        ],
      },
    ],
  },
  {
    id: 'page9',
    pageNumber: 9,
    questions: [
      {
        id: 'q9',
        type: 'single-select',
        prompt: 'Before deciding to join the Army, did you regularly engage in physical training?',
        promptHtml: 'Before <u>deciding</u> to join the Army, did you regularly engage in physical training?',
        options: [
          { id: 'yes', label: 'Yes' },
          { id: 'no', label: 'No' },
          { id: 'other', label: 'Other (explain)', explain: true },
        ],
      },
    ],
  },
  {
    id: 'page10',
    pageNumber: 10,
    questions: [
      {
        id: 'q10',
        type: 'multi-select',
        prompt: 'At the end of a workout, I prefer to feel like (check all that apply):',
        options: [
          { id: 'accomplished_hard', label: 'I accomplished something hard' },
          { id: 'gave_100_percent', label: 'I gave 100% or close to it.' },
          { id: 'others_saw', label: 'Others saw me work hard.' },
          { id: 'helped_push_others', label: 'I helped push others to work hard.' },
          { id: 'improved_fitness', label: 'I improved my physical fitness.' },
          { id: 'helped_others_fitness', label: 'I helped others improve their physical fitness.' },
          { id: 'exhausted_rest_of_day', label: 'I will be exhausted for the rest of the duty day.' },
          { id: 'no_preference_get_over', label: 'No preference; I just get it over with.' },
        ],
      },
    ],
  },
  {
    id: 'page11',
    pageNumber: 11,
    questions: [
      {
        id: 'q11',
        type: 'multi-select',
        prompt:
          'For the following questions, state your opinion.\n\nIf everyone gave 100% effort at organized PRT, people would occasionally be on profile, but in general (check all that apply):',
        options: [
          { id: 'no_aft_failures', label: 'there would be no AFT failures.' },
          { id: 'no_abcp_failures', label: 'there would be no ABCP failures.' },
          { id: 'run_4_miles_36', label: 'everyone could run 4 miles in 36 minutes or faster.' },
          { id: 'airborne_requirements', label: 'everyone could meet airborne school physical requirements.' },
          { id: 'higher_morale', label: 'there would be higher morale.' },
          { id: 'mental_toughness_resilience', label: 'there would be greater mental toughness and/or mental resilience.' },
        ],
      },
    ],
  },
  {
    id: 'page12',
    pageNumber: 12,
    questions: [
      {
        id: 'q12_why',
        type: 'free-text',
        prompt: '', // generated at render time from q11 via promptTemplate
        promptFromQuestionId: 'q11',
        promptTemplate: (labels) =>
          labels.length > 0
            ? `In the previous question, you indicated that if everyone gave 100% effort at organized PRT then ${joinLabels(
                labels.map((l) => l.replace(/\.$/, '')),
              )}. Why?`
            : 'Why do you think that?',
        allowPreferNotToAnswer: true,
        maxLength: 1000,
      },
    ],
  },
  {
    id: 'page13',
    pageNumber: 13,
    questions: [
      {
        id: 'q13',
        type: 'single-select',
        prompt: 'At office PRT, everyone should put forth:',
        options: [
          { id: 'maximum_effort', label: 'maximum effort.' },
          { id: 'effort_necessary_improve', label: 'the amount of effort necessary to improve.' },
          { id: 'whatever_feel_like', label: 'whatever they feel like doing, regardless of whether it helps them improve.' },
          { id: 'doesnt_matter', label: 'it doesn’t matter.' },
          { id: 'other', label: 'something else (explain).', explain: true },
        ],
      },
    ],
  },
  {
    id: 'page14',
    pageNumber: 14,
    questions: [
      {
        id: 'q14a',
        type: 'single-select',
        prompt: 'When I arrive to PRT:',
        options: [
          { id: 'motivated', label: 'I am motivated.' },
          { id: 'indifferent', label: 'I am indifferent.' },
          { id: 'nervous', label: 'I am nervous.' },
        ],
      },
      {
        id: 'q14b',
        type: 'multi-select',
        prompt: 'At PRT, my goal is to (select all that apply):',
        options: [
          { id: 'survive', label: 'survive.' },
          { id: 'not_embarrass_myself', label: 'not embarrass myself.' },
          { id: 'compete_with_others', label: 'compete with others.' },
          { id: 'push_myself', label: 'push myself.' },
          { id: 'encourage_others', label: 'encourage others.' },
          { id: 'get_useful_out_of_it', label: 'get out of it what is useful.' },
          { id: 'get_it_over_with', label: 'get it over with.' },
        ],
      },
    ],
  },
];

export const TOTAL_PAGES = SURVEY_PAGES.length;
