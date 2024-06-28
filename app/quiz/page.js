"use client";import { useEffect, useState } from "react";
import Image from "next/image";
import background from "../../public/background.png";
import aiAcademyLogo from "../../public/ai_academy.png";
import useWebSocket from "../hooks/useWebSocket"; // Adjust the path as per your structure

export default function Quiz() {
  const [questions, setQuestions] = useState([]);
  const [title, setTitle] = useState("");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [quizNumber, setQuizNumber] = useState(1);
  const [selectedOption, setSelectedOption] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);

  const socket = useWebSocket("http://localhost:3000"); // Adjust WebSocket URL

  useEffect(() => {
    async function fetchQuestionsAndStartTime() {
      try {
        const res = await fetch(`/api/quiz/${quizNumber}`);
        if (res.ok) {
          const data = await res.json();
          setQuestions(data.questions);
          setTitle(data.title);

          // Start timer when quiz data is fetched
          if (socket) {
            socket.emit("startTimer", { userId: "replace_with_user_id" });
          }
        } else {
          throw new Error("Failed to fetch quiz data");
        }
      } catch (error) {
        console.error("Error fetching quiz data:", error);
        // Handle error fetching quiz data
      }
    }
    fetchQuestionsAndStartTime();
  }, [quizNumber, socket]);

  useEffect(() => {
    if (!socket) return;

    socket.on("currentTime", (currentTime) => {
      setElapsedTime(currentTime);
    });

    return () => {
      socket.off("currentTime");
    };
  }, [socket]);

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else if (quizNumber < 3) {
      setQuizNumber(quizNumber + 1);
      setCurrentQuestionIndex(0);
    } else {
      alert("Quiz terminé!");
    }
    setSelectedOption(null); // Reset selected option for the next question

    // Start timer for the next question
    if (socket) {
      socket.emit("startTimer", { userId: "replace_with_user_id" });
    }
  };

  const handleOptionClick = (index) => {
    setSelectedOption(index);
  };

  const currentQuestion = questions[currentQuestionIndex];

  if (!currentQuestion) {
    return <div>Loading...</div>;
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
            maxWidth={500}
            maxHeight={120}
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
                selectedOption === index
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
            disabled={selectedOption === null} // Disable button if no option is selected
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
