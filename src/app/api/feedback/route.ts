import { NextResponse } from 'next/server';

// Mock feedback data
const feedbacks = [
  "Great response, but consider being more concise.",
  "Your answer is well thought out, but try to give more examples.",
  "This is a good answer, but make sure to emphasize your problem-solving skills.",
  "Your answer needs more technical details. Be more specific."
];

export async function POST(req: Request) {
  try {
    // Extracting data from the request body
    const body = await req.json();

    // Log the received data (you can remove this in production)
    console.log("Received data:", body);

    // Get random feedback from the mock data
    const randomFeedback = feedbacks[Math.floor(Math.random() * feedbacks.length)];

    // Return a successful response with random feedback
    return NextResponse.json({
      success: true,
      feedback: randomFeedback
    });
  } catch (error) {
    console.error('Error handling the feedback request:', error);
    return NextResponse.json({
      success: false,
      message: "Failed to submit feedback."
    });
  }
}
