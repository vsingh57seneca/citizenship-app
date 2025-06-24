"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const handleStartQuiz = () => {
    router.push("/quiz");
  }

  return (
    <main className="h-full flex flex-col justify-center items-center mx-auto p-6 space-y-6">
        <h1 className="text-xl lg:text-4xl font-bold text-center">Civics (History and Government) Questions for the Naturalization Test</h1>
        <button onClick={handleStartQuiz} className="text-xl lg:text-4xl border px-4 py-2 cursor-pointer rounded-lg">Start Quiz</button>
    </main>
  );
}
