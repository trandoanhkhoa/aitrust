import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import 'froala-editor/css/froala_style.min.css';
import 'froala-editor/css/froala_editor.pkgd.min.css';

import FroalaEditor from 'react-froala-wysiwyg';
// Import the font size plugin
import 'froala-editor/js/plugins/font_size.min.js';
// Import the paragraph format plugin and stylesheet
import 'froala-editor/js/plugins/paragraph_format.min.js';
import 'froala-editor/js/plugins/font_family.min.js';
import 'froala-editor/js/plugins/line_height.min.js';

import ManagerApi from '../../../api/Manager';
export default function AddQuestionPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);

  const config = {
    // ===== Toolbar =====
    toolbarButtons: {
      moreText: {
        buttons: [
          'bold',
          'italic',
          'underline',
          'strikeThrough',
          'fontFamily',
          'fontSize',
          'textColor',
          'backgroundColor',
          'clearFormatting',
        ],
        buttonsVisible: 6,
      },

      moreParagraph: {
        buttons: [
          'alignLeft',
          'alignCenter',
          'alignRight',
          'alignJustify',
          'formatOL',
          'formatUL',
          'outdent',
          'indent',
          'lineHeight',
          'paragraphFormat',
        ],
        buttonsVisible: 6,
      },

      moreRich: {
        buttons: [
          'insertLink',
          'insertImage',
          'insertTable',
          'emoticons',
          'specialCharacters',
          'insertHR',
        ],
        buttonsVisible: 4,
      },

      moreMisc: {
        buttons: ['undo', 'redo', 'fullscreen', 'html'],
        align: 'right',
        buttonsVisible: 2,
      },
    },

    // ===== Font =====
    fontFamily: {
      'Arial,sans-serif': 'Arial',
      'Times New Roman,serif': 'Times New Roman',
      'Roboto,sans-serif': 'Roboto',
      'Tahoma,sans-serif': 'Tahoma',
    },

    fontSize: ['10', '12', '14', '16', '18', '20', '24', '30', '36'],
    fontSizeDefaultSelection: '18',
    fontSizeUnit: 'px',

    // ===== Paragraph =====
    paragraphFormat: {
      N: 'Normal',
      H1: 'Heading 1',
      H2: 'Heading 2',
      H3: 'Heading 3',
    },

    lineHeights: {
      Default: '1.5',
      One: '1',
      OneHalf: '1.5',
      Double: '2',
    },

    // ===== Clean HTML (RẤT QUAN TRỌNG) =====
    pastePlain: true, // ❗ Không dán style rác
    htmlRemoveStyle: true, // ❗ Xóa inline style
    htmlAllowedStyleProps: [
      'font-size',
      'font-family',
      'color',
      'background-color',
      'text-align',
      'font-weight',
      'text-decoration',
    ],

    // ===== Misc =====
    charCounterCount: false,
    attribution: false,
    heightMin: 200,
  };

  const [form, setForm] = useState({
    id: 0,
    question: '',
    answers: {
      A: '',
      B: '',
      C: '',
      D: '',
      E: '',
      F: '',
    },
    correctAnswer: '',
    correctDesc: '',
    hallucinationAnswer: '',
    hallucinationDesc: '',
    timeTries: '',
  });

  //Load data if id exist
  useEffect(() => {
    if (!isEdit) return;

    const fetchQuestion = async () => {
      const res = await ManagerApi.getquestionbyid(id);
      console.log(res);
      // return;
      if (!res.status) return;

      const q = res.data;

      setForm({
        id: q.id || 0,
        question: q.question1 || '',
        answers: {
          A: q.answer.split('|')[0] || '',
          B: q.answer.split('|')[1] || '',
          C: q.answer.split('|')[2] || '',
          D: q.answer.split('|')[3] || '',
          E: q.answer.split('|')[4] || '',
          F: q.answer.split('|')[5] || '',
        },
        correctAnswer: q.correctanswer?.trim() || '',
        correctDesc: q.correctanswerdesc || '',
        hallucinationAnswer: q.hallucinationanswer?.trim() || '',
        hallucinationDesc: q.hallucination || '',
        timeTries: q.timeTries ?? 1,
      });
    };

    fetchQuestion();
  }, [id]);

  const handleSubmitQuestion = async () => {
    const data = {
      id: form.id,
      question1: form.question,
      answer: Object.values(form.answers).join('|'),
      correctAnswer: form.correctAnswer,
      correctAnswerDesc: form.correctDesc,
      hallucination: form.hallucinationDesc,
      hallucinationAnswer: form.hallucinationAnswer,
      timeTries: form.timeTries,
    };

    let res;
    if (isEdit) {
      res = await ManagerApi.editquestion(data);
    } else {
      res = await ManagerApi.addquestion(data);
    }

    if (res.status) {
      alert(res.message);
    }
  };
  return (
    <div className="p-6">
      <div
        className="
          max-w-5xl mx-auto
          rounded-2xl
          border border-slate-200
          shadow-md
          p-6 space-y-6
          bg-white/80
          backdrop-blur-sm
        "
      >
        {/* Header */}
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">
            {isEdit ? 'Edit Question' : 'Add Question'}
          </h1>
          <p className="text-slate-500 text-sm">
            Create a question for AI evaluation & hallucination analysis
          </p>
        </div>

        {/* Question */}
        {/* <Section title="Question">
          <textarea
            rows={4}
            placeholder="Enter question content..."
            className="
              w-full rounded-xl px-4 py-3
              border border-slate-300
              text-slate-800
              focus:outline-none focus:ring-2 focus:ring-cyan-400
            "
          />
        </Section> */}
        <input type="hidden" value={form.id} />
        <FroalaEditor
          model={form.question}
          config={config}
          onModelChange={(content) => setForm((prev) => ({ ...prev, question: content }))}
        />
        {/* Answers */}
        <Section title="Answers">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {['A', 'B', 'C', 'D', 'E', 'F'].map((letter) => (
              <div key={letter} className="flex items-center gap-3">
                <span className="text-slate-600 font-medium w-6">{letter}.</span>
                <textarea
                  value={form.answers[letter]}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      answers: { ...prev.answers, [letter]: e.target.value },
                    }))
                  }
                  type="text"
                  placeholder={`Answer ${letter}`}
                  className="
                    w-full rounded-lg px-3 py-2
                    border border-slate-300
                    text-slate-800
                    focus:outline-none focus:ring-2 focus:ring-cyan-400
                  "
                />
              </div>
            ))}
          </div>

          {/* Correct Answer */}
          <div className="mt-4 flex items-center gap-4">
            <label className="text-slate-600 text-sm">Correct Answer</label>
            <select
              value={form.correctAnswer}
              onChange={(e) => setForm((prev) => ({ ...prev, correctAnswer: e.target.value }))}
              className="
                rounded-lg px-3 py-2
                border border-slate-300
                text-slate-800
                focus:outline-none focus:ring-2 focus:ring-emerald-400
              "
            >
              <option value="">-- Select --</option>
              {['A', 'B', 'C', 'D', 'E', 'F'].map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
          </div>
        </Section>

        {/* Correct Answer Desc */}
        <Section title="Correct Answer Description">
          <textarea
            value={form.correctDesc}
            onChange={(e) => setForm((prev) => ({ ...prev, correctDesc: e.target.value }))}
            rows={3}
            placeholder="Explain the correct answer..."
            className="
              w-full rounded-xl px-4 py-3
              border border-slate-300
              text-slate-800
              focus:outline-none focus:ring-2 focus:ring-emerald-400
            "
          />
        </Section>

        {/* Hallucination */}
        <Section title="Hallucination">
          <div className="flex items-center gap-4 mb-3">
            <label className="text-slate-600 text-sm">Hallucination Answer</label>
            <select
              value={form.hallucinationAnswer}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, hallucinationAnswer: e.target.value }))
              }
              className="
                rounded-lg px-3 py-2
                border border-slate-300
                text-slate-800
                focus:outline-none focus:ring-2 focus:ring-cyan-400
              "
            >
              <option value="">-- Select --</option>
              {['A', 'B', 'C', 'D', 'E', 'F'].map((l) => (
                <option value={l} key={l}>
                  {l}
                </option>
              ))}
            </select>
          </div>

          <textarea
            value={form.hallucinationDesc}
            onChange={(e) => setForm((prev) => ({ ...prev, hallucinationDesc: e.target.value }))}
            rows={3}
            placeholder="Describe hallucination behavior..."
            className="
              w-full rounded-xl px-4 py-3
              border border-slate-300
              text-slate-800
              focus:outline-none focus:ring-2 focus:ring-cyan-400
            "
          />
        </Section>

        {/* Timetries */}
        <Section title="Time Tries">
          <input
            type="number"
            value={form.timeTries}
            onChange={(e) => setForm((prev) => ({ ...prev, timeTries: e.target.value }))}
            min={1}
            placeholder="Number of attempts"
            className="
              w-40 rounded-lg px-3 py-2
              border border-slate-300
              text-slate-800
              focus:outline-none focus:ring-2 focus:ring-cyan-400
            "
          />
        </Section>

        {/* Actions */}
        <div className="flex justify-end pt-4">
          <button
            onClick={() => handleSubmitQuestion()}
            className="
              px-5 py-2.5 rounded-xl
              bg-cyan-600 text-white
              font-medium
              hover:bg-cyan-700
              transition
            "
          >
            {isEdit ? 'Update Question' : 'Save Question'}
          </button>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="space-y-2">
      <h2 className="text-slate-700 font-medium">{title}</h2>
      {children}
    </div>
  );
}
