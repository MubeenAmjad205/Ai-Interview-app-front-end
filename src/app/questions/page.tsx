'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Timer from '@/components/Timer';

interface Question {
  id: number;
  question: string;
}

interface ChatMessage {
  type: 'question' | 'answer' | 'feedback';
  content: string;
}

const Questions: React.FC = () => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [chat, setChat] = useState<ChatMessage[]>([]);
  const [isQuizComplete, setIsQuizComplete] = useState(false);

  const router = useRouter(); // Next.js hook to handle navigation

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get('/api/questions');
        setQuestions(response.data);
        setIsTimerActive(true);
        setChat([{ type: 'question', content: response.data[0].question }]);
      } catch (error) {
        console.error('Error fetching questions:', error);
        toast.error('Failed to load questions.');
      }
    };

    fetchQuestions();
  }, []);

  const handleTimeUp = () => {
    toast.info('Time is up! Moving to the next question...');
    goToNextQuestion();
  };

  const goToNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setIsTimerActive(false);
      setTimeout(() => setIsTimerActive(true), 100); // Restart timer
      setChat((prevChat) => [
        ...prevChat,
        { type: 'question', content: questions[currentQuestionIndex + 1].question },
      ]);
    } else {
      setIsQuizComplete(true); // Mark quiz as complete
      toast.success('You have completed all the questions!');
    }
    reset();
  };

  const onSubmit = async (data: any) => {
    if (isQuizComplete) {
      toast.info('You have completed all questions, no more answers are needed.');
      return;
    }

    const userAnswer = data.answer;

    setChat((prevChat) => [
      ...prevChat,
      { type: 'answer', content: userAnswer },
    ]);

    try {
      const mockAIResponse = await axios.post('/api/feedback', {
        questionId: questions[currentQuestionIndex].id,
        answer: userAnswer,
      });

      const feedback = mockAIResponse.data?.feedback || 'This is a mock AI feedback.';

      setChat((prevChat) => [
        ...prevChat,
        { type: 'feedback', content: feedback },
      ]);

      setIsTimerActive(false);
      goToNextQuestion();
    } catch (error) {
      console.error('Error submitting answer:', error);
      toast.error('Failed to submit answer.');
    }
  };

  const onError = () => {
    toast.error('Please provide an answer!');
  };

  const handleRetry = () => {
    setCurrentQuestionIndex(0);
    setIsQuizComplete(false);
    setChat([{ type: 'question', content: questions[0].question }]);
    setIsTimerActive(true);
  };

  const handleReturnHome = () => {
    router.push('/'); // Navigates back to the homepage
  };

  return (
    <div className="flex items-center justify-center h-screen bg-black text-white">
      <div className="bg-gray-900 p-8 rounded-lg shadow-lg text-center w-full max-w-2xl h-[90vh] overflow-y-auto">
        <h2 className="text-3xl font-bold mb-4">Interview Questions</h2>

        <div className="flex justify-between mb-4">
          <p>Question {currentQuestionIndex + 1} of {questions.length}</p>
          <p>Remaining: {questions.length - currentQuestionIndex - 1}</p>
        </div>

        {questions.length > 0 ? (
          <div className="mb-4">
            <div className="chat-container mb-4 space-y-3">
              {chat.map((message, index) => (
                <div
                  key={index}
                  className={`p-2 mb-2 rounded-lg text-left ${
                    message.type === 'question'
                      ? 'bg-blue-600 text-white'
                      : message.type === 'answer'
                      ? 'bg-gray-600 text-right text-white'
                      : 'bg-green-600 text-left text-white'
                  }`}
                >
                  {message.content}
                </div>
              ))}
            </div>

            {isTimerActive && <Timer initialTime={60} onTimeUp={handleTimeUp} />}

            {!isQuizComplete && (
              <form onSubmit={handleSubmit(onSubmit, onError)}>
                <textarea
                  className={`border p-2 w-full mt-4 bg-gray-800 text-white rounded ${errors.answer ? 'border-red-500' : 'border-gray-600'}`}
                  rows={4}
                  placeholder="Type your answer here..."
                  {...register("answer", { required: true, minLength: 5 })}
                />
                {errors.answer && (
                  <p className="text-red-500 text-sm mt-2">
                    {errors.answer.type === 'required' ? 'Answer is required.' : 'Answer must be at least 5 characters.'}
                  </p>
                )}

                <button
                  className="bg-blue-600 text-white py-2 px-4 rounded mt-4 hover:bg-blue-700 transition duration-300"
                  type="submit"
                >
                  Submit Answer
                </button>
              </form>
            )}

            {isQuizComplete && (
              <div className="mt-4 space-y-4">
                <p className="text-green-400 text-lg">Congratulations! You have completed the interview.</p>
                <button
                  className="bg-blue-600 text-white py-2 px-4 mx-1 rounded hover:bg-blue-700 transition duration-300"
                  onClick={handleReturnHome}
                >
                  Return to Home
                </button>
                <button
                  className="bg-gray-600 text-white py-2 px-4 mx-1 rounded hover:bg-gray-700 transition duration-300"
                  onClick={handleRetry}
                >
                  Retry Interview
                </button>
              </div>
            )}
          </div>
        ) : (
          <p>Loading questions...</p>
        )}

        <ToastContainer />
      </div>
    </div>
  );
};

export default Questions;
