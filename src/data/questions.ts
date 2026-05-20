import type { Question } from "../types";

export const QUESTIONS: Question[] = [
  {
    id: 1,
    kind: "choice",
    prompt: "В каком году была создана группа «КОМПАШКА ДРУЗЕЙ»?",
    options: ["2022", "2023", "2024", "2025"],
    correctIndex: 2,
    points: 6,
  },
  {
    id: 2,
    kind: "choice",
    prompt: "Кто придумал идею создать группу «КОМПАШКА ДРУЗЕЙ»?",
    options: ["Кирилл", "Влад", "Ира", "Давид"],
    correctIndex: 0,
    points: 6,
  },
  {
    id: 3,
    kind: "choice",
    prompt: "Какой цвет Кирилл обожает больше всего?",
    options: ["Чёрный", "Красный", "Зелёный", "Жёлтый", "Синий"],
    correctIndex: 0,
    points: 6,
  },
  {
    id: 4,
    kind: "text",
    prompt: "Как зовут кошку Кирилла? (напишите имя в поле ниже)",
    acceptedAnswers: ["дина"],
    points: 6,
  },
  {
    id: 5,
    kind: "choice",
    prompt: "Какого месяца день рождения у Кирилла?",
    options: ["Июнь", "Июль", "Август", "Декабрь"],
    correctIndex: 1,
    points: 6,
  },
  {
    id: 6,
    kind: "choice",
    prompt:
      "Сколько всего раз Кирилл выходил из групп? («КОМПАШКА ДРУЗЕЙ» и «КОМПАШКА МОПСОВ»)",
    options: ["1", "2", "3", "4"],
    correctIndex: 0,
    points: 6,
  },
  {
    id: 7,
    kind: "choice",
    prompt: "Какого числа началось COMPANY-AWARDS?",
    options: ["29", "28", "30", "31"],
    correctIndex: 3,
    points: 6,
  },
  {
    id: 8,
    kind: "choice",
    prompt: "Кто забрал «короля года» в COMPANY-AWARDS?",
    options: ["Кирилл", "Давид", "Никита", "Влад"],
    correctIndex: 3,
    points: 6,
  },
  {
    id: 9,
    kind: "choice",
    prompt: "Кто забрал «королеву года» в COMPANY-AWARDS?",
    options: ["Настя", "Вика", "Ника", "Ира"],
    correctIndex: 0,
    points: 6,
  },
  {
    id: 10,
    kind: "choice",
    prompt: "Кто придумал «локальный» мем с пяточками в группе?",
    options: ["Вика", "Настя", "Кирилл", "Давид", "Ника"],
    correctIndex: 0,
    points: 6,
  },
  {
    id: 11,
    kind: "choice",
    prompt: "Сколько раз уходила Ира?",
    options: ["1", "2", "3", "4", "5"],
    correctIndex: 1,
    points: 6,
  },
  {
    id: 12,
    kind: "choice",
    prompt:
      "Как назывался YouTube-канал Насти, на котором она снимала кринж-контент?",
    options: ["уНасти", "НастяКанал", "ДелаемЧтоУгодно"],
    correctIndex: 2,
    points: 6,
  },
  {
    id: 13,
    kind: "choice",
    prompt: "Как назывался YouTube-канал Вики?",
    options: ["kurik000", "pon0047", "курик", "kurik"],
    correctIndex: 1,
    points: 6,
  },
  {
    id: 14,
    kind: "choice",
    prompt: "Сколько историй в профиле у Вики?",
    options: ["219", "254", "198", "312"],
    correctIndex: 0,
    points: 6,
  },
  {
    id: 15,
    kind: "choice",
    prompt: "Сколько всего аватарок у Насти?",
    options: ["120", "104", "108", "107", "136"],
    correctIndex: 1,
    points: 6,
  },
  {
    id: 16,
    kind: "choice",
    prompt: "67?",
    options: ["67"],
    correctIndex: 0,
    points: 0,
    bonus: true,
  },
];

export const MAX_SCORE = QUESTIONS.reduce((sum, q) => sum + q.points, 0);

export const EXAM_DURATION_MS = 25 * 60 * 1000;

export function normalizeText(value: string): string {
  return value.trim().toLowerCase().replace(/ё/g, "е");
}

export function isAnswerCorrect(question: Question, given: string): boolean {
  if (question.kind === "choice") {
    return given === question.options[question.correctIndex];
  }
  const normalized = normalizeText(given);
  return question.acceptedAnswers.some(
    (variant) => normalizeText(variant) === normalized,
  );
}
