import React from 'react';

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans p-4 sm:p-6 md:p-12 selection:bg-pink-400 selection:text-black overflow-hidden">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Header / Hero */}
        <header className="flex flex-col md:flex-row gap-10 md:gap-8 items-center justify-between mb-16 mt-4 md:mt-0">
          <div className="flex-1 space-y-6 text-center md:text-left w-full">
            <h1 className="text-5xl sm:text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none break-words">
              Ko<br/>Sanghyeob
            </h1>
            <div className="inline-block bg-yellow-400 text-black px-3 py-2 sm:px-4 sm:py-2 neo-border text-base sm:text-lg md:text-xl font-bold transform -rotate-1 hover:rotate-0 transition-transform">
              고상협 / Backend Developer
            </div>
            <p className="text-base sm:text-lg md:text-2xl font-medium max-w-2xl leading-relaxed break-words mx-auto md:mx-0">
              Java와 Spring 프레임워크를 기반으로 안정적이고 확장 가능한 백엔드 시스템을 개발하는 백엔드 개발자입니다. 견고한 아키텍처와 클린 코드에 관심이 많습니다.
            </p>
          </div>
          
          {/* Abstract Profile Icon Avatar */}
          <div className="w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 shrink-0 mx-auto md:mx-0 bg-pink-400 neo-border neo-shadow flex flex-col items-center justify-center transform rotate-3 hover:rotate-6 transition-transform">
            <span className="text-6xl sm:text-8xl md:text-9xl mb-1 sm:mb-2">☕️</span>
            <span className="text-black font-black uppercase tracking-widest text-sm sm:text-lg md:text-xl mt-1 sm:mt-2 text-center px-2">Java / Spring</span>
          </div>
        </header>

        {/* Experience & Education Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          <section className="bg-cyan-400 text-black p-6 sm:p-8 neo-border neo-shadow w-full">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black uppercase mb-6 neo-border-b pb-2 flex justify-between items-end">
              <span>Tech Stack</span>
              <span className="text-3xl sm:text-4xl">🛠</span>
            </h2>
            <ul className="space-y-6">
              <li className="flex flex-col bg-white p-4 sm:p-5 neo-border">
                <span className="text-xl sm:text-2xl lg:text-3xl font-bold">Java</span>
                <span className="text-base sm:text-lg font-medium text-gray-800 mt-2 break-words">객체 지향 프로그래밍, JVM 생태계</span>
              </li>
              <li className="flex flex-col bg-white p-4 sm:p-5 neo-border">
                <span className="text-xl sm:text-2xl lg:text-3xl font-bold">Spring</span>
                <span className="text-base sm:text-lg font-medium text-gray-800 mt-2 break-words">Spring Boot, Spring MVC 기반 REST API 개발</span>
              </li>
            </ul>
          </section>

          <section className="bg-[#ff7a59] text-black p-6 sm:p-8 neo-border neo-shadow w-full">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black uppercase mb-6 neo-border-b pb-2 flex justify-between items-end">
              <span>Profile</span>
              <span className="text-3xl sm:text-4xl">💻</span>
            </h2>
            <div className="space-y-6">
              <div className="bg-white p-5 sm:p-6 neo-border flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold">GitHub</h3>
                  <p className="text-base sm:text-lg font-bold text-gray-600 mt-1 break-all">@wjxor</p>
                </div>
                <a href="https://github.com/wjxor" target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto text-center inline-block bg-black text-white px-6 py-3 font-bold uppercase neo-button hover:bg-gray-800">
                  Visit GitHub
                </a>
              </div>
              <div className="bg-white p-5 sm:p-6 neo-border flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold">LinkedIn</h3>
                  <p className="text-base sm:text-lg font-bold text-gray-600 mt-1 break-all">Sanghyeob Ko</p>
                </div>
                <a href="https://www.linkedin.com/in/sanghyeob-ko/" target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto text-center inline-block bg-[#0A66C2] text-white px-6 py-3 font-bold uppercase neo-button hover:bg-blue-800">
                  Visit LinkedIn
                </a>
              </div>
            </div>
          </section>

        </div>

        {/* Skills Marquee */}
        <section className="bg-white dark:bg-[#111] text-foreground p-6 sm:p-8 md:p-12 neo-border neo-shadow text-center w-full">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black uppercase mb-6 sm:mb-8">Keywords</h2>
          <div className="flex flex-wrap gap-3 sm:gap-4 justify-center">
            {["Java", "Spring Boot", "Backend Architecture", "RESTful API", "Clean Code", "OOP"].map((skill, i) => (
              <span 
                key={i} 
                className="px-4 py-2 sm:px-5 sm:py-3 bg-indigo-500 text-white font-bold text-sm sm:text-lg lg:text-xl neo-button cursor-pointer select-none hover:-rotate-2"
              >
                {skill}
              </span>
            ))}
          </div>
        </section>

        {/* Footer Links */}
        <footer className="flex flex-col md:flex-row justify-between items-center bg-black dark:bg-[#222] text-white p-6 sm:p-8 neo-border gap-6 neo-shadow w-full">
          <p className="font-mono font-bold text-sm sm:text-base lg:text-lg text-center md:text-left">&copy; 2026 KO SANGHYEOB.<br className="md:hidden"/> ALL RIGHTS RESERVED.</p>
          <div className="flex flex-wrap justify-center w-full md:w-auto">
            <a href="https://github.com/wjxor" target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto text-center bg-white text-black px-6 sm:px-8 py-3 font-black text-sm sm:text-lg uppercase neo-button hover:bg-cyan-400">
              GitHub (@wjxor)
            </a>
          </div>
        </footer>

      </div>
    </div>
  );
}
