"use client";

import React, { useEffect, useState } from "react";
import civicQuestions from "../../data/questions.json";

type Question = {
  id: number;
  q: string;
  answers: string[];
  wrong_answers: string[];
  select_limit?: number;
};

const Quiz = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [index, setIndex] = useState(0);
  const [shuffledOptions, setShuffledOptions] = useState<string[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [selectedCount, setSelectedCount] = useState<number | null>(null);

  const shuffleArray = <T,>(arr: T[]): T[] =>
    [...arr].sort(() => Math.random() - 0.5);

  const startQuiz = (count: number) => {
    const shuffled = shuffleArray(civicQuestions).slice(0, count);
    setQuestions(shuffled);
    setSelectedCount(count);
    setIndex(0);
    setScore(0);
  };

  useEffect(() => {
    if (questions.length === 0) return;
    const current = questions[index];
    const options = [...current.answers, ...current.wrong_answers];
    setShuffledOptions(shuffleArray(options));
    setSelectedOptions([]);
    setIsSubmitted(false);
  }, [index, questions]);

  if (selectedCount === null) {
    return (
      <div className="p-6 max-w-md mx-auto text-center h-full flex flex-col justify-center">
        <h1 className="text-2xl font-bold mb-4">🧠 Civics Quiz</h1>
        <p className="mb-2 text-gray-600">
          How many questions would you like to try?
        </p>
        <div className="space-x-4">
          {[10, 20, civicQuestions.length].map((count) => (
            <button
              key={count}
              onClick={() => startQuiz(count)}
              className="px-4 py-2 bg-blue-600 text-white rounded cursor-pointer"
            >
              {count === civicQuestions.length ? "All" : count}
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (questions.length === 0)
    return <p className="text-center mt-4">Loading questions...</p>;

  const question = questions[index];
  const isSingleSelect =
    question.select_limit === 1 || question.answers.length === 1;

  const toggleOption = (option: string) => {
    if (isSubmitted) return;

    if (isSingleSelect) {
      setSelectedOptions([option]);
    } else {
      setSelectedOptions((prev) =>
        prev.includes(option)
          ? prev.filter((o) => o !== option)
          : [...prev, option]
      );
    }
  };

  const isCorrect = () => {
    return selectedOptions.every((opt) => question.answers.includes(opt));
  };

  const handleSubmit = () => {
    if (selectedOptions.length === 0) return;
    if (isCorrect()) setScore((prev) => prev + 1);
    setIsSubmitted(true);
  };

  const nextQuestion = () => {
    if (index + 1 >= questions.length) {
      alert(`🎉 Quiz complete! Your score: ${score} / ${questions.length}`);
      setSelectedCount(null); // Reset to quiz setup
    } else {
      setIndex((prev) => prev + 1);
    }
  };

  return (
    <div className="p-4 max-w-xl mx-auto flex flex-col justify-center h-full text-semibold">
      <h1 className="text-xl font-bold mb-2">{question.q}</h1>
      <p className="mb-2 text-sm text-red-400 font-semibold">
        {isSingleSelect
          ? "Choose one correct answer"
          : `Select ${question.select_limit ?? "all that apply"}`}
      </p>
      <p className="text-sm text-gray-500 mb-2">
        Question {index + 1} of {questions.length} • Score: {score}
      </p>

      <ul className="space-y-2 max-h-60 overflow-y-auto mb-4">
        {shuffledOptions.map((opt) => {
          const isSelected = selectedOptions.includes(opt);
          const isCorrectAnswer = question.answers.includes(opt);

          return (
            <li key={opt}>
              <button
                onClick={() => toggleOption(opt)}
                disabled={isSubmitted}
                className={`w-full px-4 py-2 text-left border rounded font-semibold cursor-pointer ${
                  isSubmitted
                    ? isCorrectAnswer
                      ? "bg-green-200 text-black font-semibold"
                      : isSelected
                      ? "bg-red-200 text-black font-semibold"
                      : ""
                    : isSelected
                    ? "bg-blue-100 text-black font-semibold"
                    : ""
                }`}
              >
                {opt}
              </button>
            </li>
          );
        })}
      </ul>

      {!isSubmitted ? (
        <button
          onClick={handleSubmit}
          className={`mt-4 px-4 py-2 rounded transition-colors duration-200 ${
            selectedOptions.length === 0 ||
            (question.select_limit &&
              selectedOptions.length !== question.select_limit)
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 cursor-pointer"
          } text-white`}
          disabled={
            selectedOptions.length === 0 ||
            (question.select_limit &&
              selectedOptions.length !== question.select_limit)
          }
        >
          Submit
        </button>
      ) : (
        <>
          <p
            className={`mt-4 font-semibold ${
              isCorrect() ? "text-green-600" : "text-red-600"
            }`}
          >
            {isCorrect() ? "Correct!" : "Incorrect."}
          </p>
          <button
            onClick={nextQuestion}
            className="mt-2 px-4 py-2 bg-gray-800 text-white rounded"
          >
            Next Question
          </button>
        </>
      )}
    </div>
  );
};

export default Quiz;
