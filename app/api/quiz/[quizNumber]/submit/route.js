import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { quizNumber, answers, elapsedTime, userId } = await request.json();


    // Fetch all questions to get correct answers
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/quizzes/${quizNumber}?populate=*`,
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }

    const data = await response.json();
    const questions = data.data.attributes.questions.data;

    let score = 0;
    questions.forEach((question, index) => {
      const rightAnswer = question.attributes.rightAnswer;
      const selectedAnswer = answers[index];

      if (selectedAnswer === rightAnswer) {
        score += 1;
      }
    });

    console.log(userId)
    const session={
            quiz: quizNumber,
            student: parseInt(userId),
            answerTime: elapsedTime,
            score: score,
          }
          console.log(session)
    // Sending score and time to the backend
    const sessionResponse = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/sessions`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
        },
        body: JSON.stringify({
          data: {
            quiz: quizNumber,
            student: parseInt(userId),
            answerTime: elapsedTime,
            score: score,
          },
        }),
      }
    );

    if (!sessionResponse.ok) {
      throw new Error("Failed to record session data");
    }

    const sessionData = await sessionResponse.json();

    return NextResponse.json({ score, sessionData }, { status: 200 });
  } catch (error) {
    console.error("Error processing quiz submission:", error);
    return NextResponse.json(
      { error: "Failed to process submission" },
      { status: 500 }
    );
  }
}
