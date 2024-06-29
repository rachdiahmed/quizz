import { NextResponse } from "next/server";

export async function POST(request) {
  
  try {
    const { quizNumber, answers } = await request.json();


    console.log(answers)
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
    questions.forEach((question) => {
      const rightAnswer = question.attributes.rightAnswer;

      const selectedAnswer = answers[question.id];


      if ( selectedAnswer.selectedOption === rightAnswer) {
        score += 1;
      }
    });

    return NextResponse.json({ score }, { status: 200 });
  } catch (error) {
    console.error("Error processing quiz submission:", error);
    return NextResponse.json(
      { error: "Failed to process submission" },
      { status: 500 }
    );
  }
}
