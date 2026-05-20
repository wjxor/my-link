import React from 'react';

export default function ProfilePage() {
  return (
    <div className="min-h-screen relative overflow-hidden bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4 sm:p-8 font-sans selection:bg-indigo-500/30">
      
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-indigo-500/20 dark:bg-indigo-500/10 blur-[120px] animate-float"></div>
        <div className="absolute top-[20%] -right-[10%] w-[50%] h-[50%] rounded-full bg-purple-500/20 dark:bg-purple-500/10 blur-[120px] animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute -bottom-[10%] left-[20%] w-[60%] h-[60%] rounded-full bg-cyan-500/20 dark:bg-cyan-500/10 blur-[120px] animate-float" style={{ animationDelay: '4s' }}></div>
      </div>

      <main className="glass w-full max-w-3xl rounded-3xl p-8 sm:p-12 animate-slide-up relative z-10 border border-white/40 dark:border-white/10">
        
        {/* Header Section */}
        <header className="text-center mb-12 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <div className="inline-block mb-4 p-1 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:scale-105 transition-transform duration-300">
            <div className="h-24 w-24 sm:h-28 sm:w-28 rounded-full bg-white dark:bg-slate-900 flex items-center justify-center text-4xl sm:text-5xl border-4 border-transparent glass">
              🧑🏻‍💻
            </div>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-3 text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-cyan-500 dark:from-indigo-400 dark:to-cyan-300">
            고상협
          </h1>
          <p className="text-lg sm:text-xl font-medium text-slate-500 dark:text-slate-400">Sanghyeob Ko</p>
          <div className="mt-6 h-1.5 w-16 bg-gradient-to-r from-indigo-500 to-cyan-500 mx-auto rounded-full"></div>
        </header>

        {/* Introduction Section */}
        <section className="mb-12 text-center animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto">
            디지털 포렌식 및 정보보호 분야의 전문 연구자이자 개발자입니다.<br className="hidden sm:block" />
            <span className="font-semibold text-indigo-600 dark:text-indigo-400">인공지능(NLP, 딥러닝) 기술</span>을 보안 및 수사 프로세스에 접목하여 <br className="hidden sm:block" />
            실무적·법적 문제를 해결하는 혁신적인 연구에 집중하고 있습니다.
          </p>
        </section>

        {/* Info Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 animate-fade-in" style={{ animationDelay: '0.6s' }}>
          
          {/* Education Card */}
          <section className="group p-6 rounded-2xl bg-white/50 dark:bg-slate-900/50 hover:bg-white/80 dark:hover:bg-slate-900/80 border border-slate-200/50 dark:border-slate-800/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-5 flex items-center">
              <span className="text-2xl mr-3 group-hover:scale-110 transition-transform">🎓</span> Education
            </h2>
            <ul className="space-y-4">
              <li className="relative pl-4 border-l-2 border-indigo-200 dark:border-indigo-900/50">
                <div className="absolute -left-[5px] top-1.5 h-2 w-2 rounded-full bg-indigo-500"></div>
                <div className="font-bold text-slate-900 dark:text-slate-100">연세대학교 정보대학원</div>
                <div className="text-sm text-slate-600 dark:text-slate-400 mt-0.5">정보보호 트랙 석사 졸업</div>
              </li>
              <li className="relative pl-4 border-l-2 border-cyan-200 dark:border-cyan-900/50">
                <div className="absolute -left-[5px] top-1.5 h-2 w-2 rounded-full bg-cyan-500"></div>
                <div className="font-bold text-slate-900 dark:text-slate-100">성균관대학교 과학수사학과</div>
                <div className="text-sm text-slate-600 dark:text-slate-400 mt-0.5">디지털포렌식연구실 연구원</div>
              </li>
            </ul>
          </section>

          {/* Awards Card */}
          <section className="group p-6 rounded-2xl bg-white/50 dark:bg-slate-900/50 hover:bg-white/80 dark:hover:bg-slate-900/80 border border-slate-200/50 dark:border-slate-800/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-5 flex items-center">
              <span className="text-2xl mr-3 group-hover:scale-110 transition-transform">🏆</span> Awards & Honors
            </h2>
            <ul className="space-y-4">
              <li className="relative pl-4 border-l-2 border-yellow-200 dark:border-yellow-900/50">
                <div className="absolute -left-[5px] top-1.5 h-2 w-2 rounded-full bg-yellow-500"></div>
                <div className="font-semibold text-slate-900 dark:text-slate-100 text-sm">한국디지털포렌식학회 동계학술대회</div>
                <div className="text-indigo-600 dark:text-indigo-400 font-bold mt-1">경찰청장상 수상 (2025)</div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed bg-slate-100/50 dark:bg-slate-800/50 p-2 rounded-lg">NLP와 딥러닝을 활용한 국가안보사건 문서 판별 모델 연구</div>
              </li>
            </ul>
          </section>
        </div>

        {/* Skills Section */}
        <section className="mt-10 animate-fade-in text-center" style={{ animationDelay: '0.8s' }}>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-6 flex items-center justify-center">
            <span className="text-2xl mr-3">🔬</span> Key Research & Expertise
          </h2>
          <div className="flex flex-wrap gap-2.5 justify-center">
            {["디지털 포렌식", "NLP 기반 텍스트 분석", "딥러닝 보안 모델", "클라우드 압수·수색 적법성", "정보보호 정책"].map((skill, i) => (
              <span 
                key={skill} 
                className="px-4 py-2 rounded-xl text-sm font-semibold bg-white/60 dark:bg-slate-800/60 text-slate-700 dark:text-slate-200 border border-slate-200/60 dark:border-slate-700/60 shadow-sm hover:shadow-md hover:scale-105 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all duration-200 cursor-default"
                style={{ animationDelay: `${0.8 + i * 0.1}s` }}
              >
                {skill}
              </span>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-slate-200/50 dark:border-slate-700/50 text-center animate-fade-in" style={{ animationDelay: '1s' }}>
          <div className="flex justify-center space-x-8">
            <a href="https://www.kaggle.com/sanghyeobko" target="_blank" rel="noopener noreferrer" className="group flex items-center text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-medium">
              <span className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mr-2 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/50 transition-colors">
                K
              </span>
              Kaggle
            </a>
            <a href="#" className="group flex items-center text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors font-medium">
              <span className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mr-2 group-hover:bg-slate-200 dark:group-hover:bg-slate-700 transition-colors">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
              </span>
              GitHub
            </a>
          </div>
          <p className="mt-8 text-xs text-slate-400 font-mono tracking-wider">&copy; 2026 SANGHYEOB KO. ALL RIGHTS RESERVED.</p>
        </footer>
      </main>
    </div>
  );
}
