import React from 'react';

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans p-6 md:p-12 selection:bg-pink-400 selection:text-black">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Header / Hero */}
        <header className="flex flex-col md:flex-row gap-8 items-center justify-between mb-16">
          <div className="flex-1 space-y-6">
            <h1 className="text-6xl sm:text-7xl md:text-8xl font-black uppercase tracking-tighter leading-none break-keep">
              Sanghyeob<br/>Ko
            </h1>
            <div className="inline-block bg-yellow-400 text-black px-4 py-2 neo-border text-lg sm:text-xl font-bold transform -rotate-1 hover:rotate-0 transition-transform">
              고상협 / AI & Digital Forensics Researcher
            </div>
            <p className="text-lg sm:text-xl md:text-2xl font-medium max-w-2xl leading-relaxed break-keep">
              디지털 포렌식 및 정보보호 전문가입니다. 자연어 처리(NLP)와 딥러닝을 보안 및 사이버범죄 수사 프로세스에 접목하여 실무적·법적 문제를 해결하는 혁신적인 연구를 수행합니다.
            </p>
          </div>
          
          {/* Abstract Profile Icon Avatar */}
          <div className="w-64 h-64 md:w-80 md:h-80 bg-pink-400 neo-border neo-shadow flex flex-col items-center justify-center transform rotate-3 hover:rotate-6 transition-transform">
            <span className="text-8xl md:text-9xl mb-2">🕵🏻‍♂️</span>
            <span className="text-black font-black uppercase tracking-widest text-xl">Forensics</span>
          </div>
        </header>

        {/* Experience & Education Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          <section className="bg-cyan-400 text-black p-8 neo-border neo-shadow">
            <h2 className="text-3xl sm:text-4xl font-black uppercase mb-6 neo-border-b pb-2 flex justify-between items-end">
              <span>Experience</span>
              <span className="text-4xl">💼</span>
            </h2>
            <ul className="space-y-6">
              <li className="flex flex-col bg-white p-4 neo-border">
                <span className="text-xl sm:text-2xl font-bold">성균관대학교 과학수사학과</span>
                <span className="text-lg font-medium text-gray-800">디지털포렌식연구실 연구원</span>
                <span className="text-sm font-bold bg-black text-white self-start px-3 py-1 mt-3">Present</span>
              </li>
              <li className="flex flex-col bg-white p-4 neo-border opacity-90">
                <span className="text-xl sm:text-2xl font-bold">경찰수사연수원</span>
                <span className="text-lg font-medium text-gray-800">이전 근무 이력</span>
              </li>
            </ul>
          </section>

          <section className="bg-yellow-400 text-black p-8 neo-border neo-shadow">
            <h2 className="text-3xl sm:text-4xl font-black uppercase mb-6 neo-border-b pb-2 flex justify-between items-end">
              <span>Education</span>
              <span className="text-4xl">🎓</span>
            </h2>
            <ul className="space-y-6">
              <li className="flex flex-col bg-white p-4 neo-border">
                <span className="text-xl sm:text-2xl font-bold">연세대학교 정보대학원</span>
                <span className="text-lg font-medium text-gray-800">정보보호 트랙 석사 졸업</span>
                <div className="mt-4 bg-gray-100 p-3 neo-border text-sm sm:text-base font-bold">
                  학위 논문<br/>
                  <span className="font-medium">사이버경찰의 저작권법 사건 수사제도 및 정책의 경제적 효과 분석</span>
                </div>
              </li>
            </ul>
          </section>

        </div>

        {/* Awards & Interests Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <section className="col-span-1 lg:col-span-2 bg-[#ff7a59] text-black p-8 neo-border neo-shadow">
            <h2 className="text-3xl sm:text-4xl font-black uppercase mb-6 neo-border-b pb-2 flex justify-between items-end">
              <span>Awards & Honors</span>
              <span className="text-4xl">🏆</span>
            </h2>
            <div className="space-y-4">
              <div className="bg-white p-5 neo-border">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
                  <h3 className="text-2xl font-bold">경찰청장상</h3>
                  <span className="font-black bg-black text-white px-2 py-1 mt-2 sm:mt-0 self-start sm:self-auto">2025</span>
                </div>
                <p className="text-lg font-bold text-gray-700">한국디지털포렌식학회 동계학술대회</p>
                <div className="bg-yellow-100 p-3 neo-border mt-4 text-base font-bold">
                  주제: NLP와 딥러닝을 활용한 국가안보사건 문서 판별 모델 연구
                </div>
              </div>
            </div>
          </section>

          <section className="col-span-1 bg-green-400 text-black p-8 neo-border neo-shadow flex flex-col">
            <h2 className="text-3xl font-black uppercase mb-6 neo-border-b pb-2 flex justify-between items-end">
              <span>Developer</span>
              <span className="text-4xl">💻</span>
            </h2>
            <p className="text-lg font-medium mb-5 bg-white p-3 neo-border">
              연구뿐만 아니라 개발 분야에도 높은 관심을 가지고 활발히 활동합니다.
            </p>
            <ul className="list-disc list-inside space-y-3 font-bold text-lg">
              <li>Infcon 등 기술 컨퍼런스 적극 참여</li>
              <li>Inflearn 강의 수강 및 기술 학습</li>
              <li>현업 문제 해결을 위한 최신 AI 툴 개발 적용</li>
            </ul>
          </section>

        </div>

        {/* Skills Marquee (Simulated with wrap flex) */}
        <section className="bg-white dark:bg-[#111] text-foreground p-8 md:p-12 neo-border neo-shadow text-center">
          <h2 className="text-3xl sm:text-4xl font-black uppercase mb-8">Key Research & Skills</h2>
          <div className="flex flex-wrap gap-4 justify-center">
            {["디지털 포렌식", "NLP 기반 텍스트 분석", "딥러닝 보안 모델", "사이버범죄 수사 기법", "클라우드 압수·수색 적법성", "정보보호 정책", "머신러닝"].map((skill, i) => (
              <span 
                key={i} 
                className="px-5 py-3 bg-indigo-500 text-white font-bold text-lg sm:text-xl neo-button cursor-pointer select-none hover:-rotate-2"
              >
                {skill}
              </span>
            ))}
          </div>
        </section>

        {/* Footer Links */}
        <footer className="flex flex-col md:flex-row justify-between items-center bg-black dark:bg-[#222] text-white p-8 neo-border gap-6 neo-shadow">
          <p className="font-mono font-bold text-lg text-center md:text-left">&copy; 2026 SANGHYEOB KO.<br className="md:hidden"/> ALL RIGHTS RESERVED.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="https://www.kaggle.com/sanghyeobko" target="_blank" rel="noopener noreferrer" className="bg-white text-black px-8 py-3 font-black text-lg uppercase neo-button hover:bg-yellow-400">
              Kaggle
            </a>
            <a href="#" className="bg-white text-black px-8 py-3 font-black text-lg uppercase neo-button hover:bg-cyan-400">
              GitHub
            </a>
          </div>
        </footer>

      </div>
    </div>
  );
}
