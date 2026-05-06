import React from 'react';

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 font-sans">
      <main className="max-w-2xl w-full bg-white rounded-2xl shadow-xl overflow-hidden p-10 border border-gray-100">
        <header className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-2">고상협</h1>
          <p className="text-lg text-blue-600 font-medium italic">Sanghyeob Ko</p>
          <div className="mt-4 h-1 w-20 bg-blue-500 mx-auto rounded-full"></div>
        </header>

        <section className="mb-10 text-center">
          <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2 inline-block">Introduction</h2>
          <p className="text-gray-600 leading-relaxed text-center">
            디지털 포렌식 및 정보보호 분야의 전문 연구자이자 개발자입니다. <br />
            인공지능(NLP, 딥러닝) 기술을 보안 및 수사 프로세스에 접목하여 <br />
            실무적·법적 문제를 해결하는 혁신적인 연구에 집중하고 있습니다.
          </p>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <section>
            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center justify-center md:justify-start">
              <span className="mr-2">🎓</span> Education
            </h2>
            <ul className="space-y-3 text-gray-600">
              <li>
                <div className="font-semibold text-gray-900">연세대학교 정보대학원</div>
                <div className="text-sm italic">정보보호 트랙 석사 졸업</div>
              </li>
              <li>
                <div className="font-semibold text-gray-900">성균관대학교 과학수사학과</div>
                <div className="text-sm italic">디지털포렌식연구실 연구원</div>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center justify-center md:justify-start">
              <span className="mr-2">🏆</span> Awards & Honors
            </h2>
            <ul className="space-y-3 text-gray-600">
              <li>
                <div className="font-semibold text-gray-900 text-sm">한국디지털포렌식학회 동계학술대회</div>
                <div className="text-blue-600 font-bold">경찰청장상 수상 (2025)</div>
                <div className="text-xs text-gray-500">NLP와 딥러닝을 활용한 국가안보사건 문서 판별 모델 연구</div>
              </li>
            </ul>
          </section>
        </div>

        <section className="mt-10">
          <h2 className="text-lg font-bold text-gray-800 mb-4 text-center">
            <span className="mr-2">🔬</span> Key Research & Expertise
          </h2>
          <div className="flex flex-wrap gap-2 justify-center">
            {["디지털 포렌식", "NLP 기반 텍스트 분석", "딥러닝 보안 모델", "클라우드 압수·수색 적법성", "정보보호 정책"].map((skill) => (
              <span key={skill} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium border border-blue-100">
                {skill}
              </span>
            ))}
          </div>
        </section>

        <footer className="mt-12 pt-8 border-t border-gray-100 text-center">
          <div className="flex justify-center space-x-6">
            <a href="https://www.kaggle.com/sanghyeobko" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-500 transition-colors">
              Kaggle
            </a>
            <a href="#" className="text-gray-400 hover:text-gray-900 transition-colors">
              GitHub
            </a>
          </div>
          <p className="mt-4 text-xs text-gray-400">&copy; 2026 Sanghyeob Ko. All rights reserved.</p>
        </footer>
      </main>
    </div>
  );
}
