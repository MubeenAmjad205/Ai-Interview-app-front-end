export async function GET(request: Request) {
    const questions = [
      { id: 1, question: "Tell me about yourself." },
      { id: 2, question: "What are your strengths?" },
      { id: 3, question: "What are your weaknesses?" },
      { id: 4, question: "Why do you want to work here?" },
      { id: 5, question: "Where do you see yourself in 5 years?" }
    ];
  
    return new Response(JSON.stringify(questions), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
  