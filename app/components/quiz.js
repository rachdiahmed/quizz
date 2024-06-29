"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import background from "../../public/background.png";
import aiAcademyLogo from "../../public/ai_academy.png";
import { useRouter } from "next/navigation";

export default function Quiz({ quizNumber,nextQuiz }) {
  const [questions, setQuestions] = useState([]);
  const [title, setTitle] = useState("");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState([]); // Array to store selected options
  const [elapsedTime, setElapsedTime] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isQuizStarted, setIsQuizStarted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function fetchQuestions() {
      try {
        const res = await fetch(`/api/quiz/${quizNumber}`);
        if (res.ok) {
          const data = await res.json();
          setQuestions(data.questions);
          setTitle(data.title);
        }
      } catch (error) {
        console.error("Error fetching quiz data:", error);
      }
    }
    fetchQuestions();

    const userID = localStorage.getItem("userID");
    if (userID) {
      setUserId(userID);
    }
  }, [quizNumber]);

  useEffect(() => {
    let timer;
    if (isQuizStarted && startTime) {
      timer = setInterval(() => {
        const elapsedTime = new Date().getTime() - startTime;
        setElapsedTime(elapsedTime);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isQuizStarted, startTime]);

  const startQuiz = () => {
    setStartTime(new Date().getTime());
    setIsQuizStarted(true);
  };

  const submitQuiz = async () => {
    try {
      const res = await fetch(`/api/quiz/${quizNumber}/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          quizNumber,
          answers: selectedOptions,
          elapsedTime,
          userId,
        }),
      });

      if (!res.ok) {
        throw new Error("Error submitting quiz");
      }

      // Handle response if needed
    } catch (error) {
      console.error("Error submitting quiz:", error);
    }
  };

  const nextQuestion = async () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      await submitQuiz();
      if(nextQuiz==4){
      router.push("/congrats/");

      }
     else router.push("/quiz/" + nextQuiz);
    }
  };

  const handleOptionClick = (index) => {
    const newSelectedOptions = [...selectedOptions];
    newSelectedOptions[currentQuestionIndex] = index;
    setSelectedOptions(newSelectedOptions);
  };

  const currentQuestion = questions[currentQuestionIndex];

  if (!isQuizStarted) {
    return (
      <div
        className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${background.src})` }}
      >
        <div className="bg-white p-10 rounded shadow-lg max-w-3xl w-full text-center">
          <div className="flex flex-col items-center mb-8">
            <Image
              src={aiAcademyLogo}
              alt="AI Academy Logo"
              width={500}
              height={120}
            />
            <h2
              className="text-3xl font-bold mt-6"
              style={{ fontFamily: "Poppins" }}
            >
              {title}
            </h2>
          </div>
          <button
            onClick={startQuiz}
            className="bg-blue-600 text-white py-4 px-3 rounded mt-4"
            style={{
              backgroundColor: "#19255B",
              width: "70%",
              maxWidth: "300px",
            }}
          >
            Start Quiz
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${background.src})` }}
    >
      <div className="bg-white p-10 rounded shadow-lg max-w-3xl w-full">
        <div className="flex flex-col items-center mb-8">
          <Image
            src={aiAcademyLogo}
            alt="AI Academy Logo"
            width={500}
            height={120}
          />
          <h2
            className="text-3xl font-bold mt-6 text-center"
            style={{ fontFamily: "Poppins" }}
          >
            {title}
          </h2>
        </div>

        <div className="bg-[#19255b] p-3 rounded-t">
          <div className="bg-[#d31a2b] text-white p-4 rounded-t text-center">
            <h1 className="text-lg font-bold" style={{ fontFamily: "Poppins" }}>
              Question {currentQuestionIndex + 1}
            </h1>
            <hr className="border-t-2 border-white my-4" />
            <p
              className="text-xl font-medium"
              style={{ fontFamily: "Poppins" }}
            >
              {currentQuestion.question}
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
          {currentQuestion.options.map((option, index) => (
            <div
              key={index}
              onClick={() => handleOptionClick(index)}
              className={`p-3 border rounded-lg text-center cursor-pointer ${
                selectedOptions[currentQuestionIndex] === index
                  ? "bg-blue-200"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              <span
                className="text-xl font-medium block mb-3"
                style={{ fontFamily: "Poppins", color: "#19255B" }}
              >
                {String.fromCharCode(65 + index)}
              </span>
              <p
                className="text-xl"
                style={{ fontFamily: "Poppins", color: "#19255B" }}
              >
                {option}
              </p>
            </div>
          ))}
        </div>
        <div className="flex justify-center">
          <button
            onClick={nextQuestion}
            className="bg-blue-600 text-white py-4 px-3 rounded text-center mt-4 align-center flex flex-col items-center"
            style={{
              backgroundColor: "#19255B",
              width: "70%",
              maxWidth: "300px",
            }}
            disabled={selectedOptions[currentQuestionIndex] === undefined}
          >
            Next Question
          </button>
        </div>
        <div className="mt-4 text-center text-gray-600">
          Elapsed Time: {Math.floor(elapsedTime / 1000)} seconds
        </div>
      </div>
    </div>
  );
}
