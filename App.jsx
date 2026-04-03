import React from 'react';
import Translator from './components/Translator';

function App() {
  return (
    <div className="relative isolate min-h-screen">
      <header className="absolute top-0 left-0 w-full p-4 sm:p-6 flex justify-between items-center z-50 pointer-events-auto">
        <div className="flex items-center gap-3 cursor-pointer group">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-black text-lg sm:text-xl shadow-lg shadow-indigo-500/30 group-hover:scale-105 transition-transform duration-300">
            PK
          </div>
          <span className="font-semibold text-slate-300 hidden sm:block tracking-wide group-hover:text-white transition-colors">#JustCodeError#</span>
        </div>
        
        <div className="flex items-center gap-2 cursor-pointer group">
          <span className="text-2xl sm:text-3xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-300 group-hover:from-blue-300 group-hover:to-cyan-200 transition-colors">
            QSkill
          </span>
          <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_10px_rgba(34,211,238,0.8)]"></div>
        </div>
      </header>
      
      {/* Decorative background blobs for vibrant aesthetic */}
      <div className="absolute top-0 -z-10 h-full w-full overflow-hidden opacity-30 pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-primary/40 blur-[120px]"></div>
        <div className="absolute bottom-[10%] right-[0%] w-[40%] h-[40%] rounded-full bg-indigo-600/30 blur-[100px]"></div>
        <div className="absolute top-[40%] left-[80%] w-[30%] h-[30%] rounded-full bg-purple-600/20 blur-[100px]"></div>
      </div>
      
      <main className="flex flex-col items-center justify-center min-h-screen py-2 px-4">
        <Translator />
      </main>
    </div>
  );
}

export default App;
