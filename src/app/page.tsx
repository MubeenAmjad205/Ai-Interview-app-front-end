import Layout from "@/components/Layout";
import Image from "next/image";

export default function Home() {
  return (
    <Layout>
      <div className="flex items-center justify-center min-h-screen bg-black text-white">
        <div className="text-center">
          <h2 className="text-4xl font-bold mb-6">Welcome to the Job Interview Coach</h2>
          <p className="text-lg mb-6">Ace your next job interview with AI-driven practice questions and feedback!</p>
          <a href="/questions" className="bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition duration-300">
            Start Practicing
          </a>
        </div>
      </div>
    </Layout>
  );
}
