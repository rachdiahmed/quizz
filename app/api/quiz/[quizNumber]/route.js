import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  const { quizNumber } = params;

  try {
    // Fetch quiz data from Strapi
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
    const quizData = data.data.attributes.questions.data.map((question) => ({
      id:question.id,
      question: question.attributes.question,
      options: question.attributes.answers.data,
    }));
    const title = data.data.attributes.title;
    const startTime = new Date().getTime(); // Example: Fetch start time from database or other source

    return NextResponse.json(
      { title, questions: quizData, startTime: startTime },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching data from Strapi:", error);
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 }
    );
  }
}
