import React, { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-blue-600 text-white p-4">
        <nav className="container mx-auto flex justify-between">
          <h1 className="text-2xl font-bold">Job Interview Coach</h1>
          <ul className="flex space-x-4">
            <li><a href="/" className="hover:text-gray-200">Home</a></li>
            <li><a href="/questions" className="hover:text-gray-200">Questions</a></li>
            <li><a href="/summary" className="hover:text-gray-200">Summary</a></li>
          </ul>
        </nav>
      </header>

      <main className="container mx-auto flex-grow p-4">
        {children}
      </main>

      <footer className="bg-gray-800 text-white p-4 text-center">
        &copy; {new Date().getFullYear()} Job Interview Coach. All rights reserved.
      </footer>
    </div>
  );
};

export default Layout;
