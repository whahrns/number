import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Bell, 
  User, 
  MapPin, 
  Phone, 
  ChevronDown, 
  Filter,
  GraduationCap
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { RAW_STAFF_DATA } from './constants';
import { StaffMember } from './types';

const FILTER_CHIPS = [
  "전체 교직원",
  "관리자",
  "수석",
  "교무기획부",
  "교육연구부",
  "교육과정부",
  "학생안전부",
  "환경예체능부",
  "미래자치부",
  "디지털정보부",
  "융합과학부",
  "진로상담부",
  "1학년부",
  "2학년부",
  "3학년부"
];

const STATUS_LABELS: Record<string, string> = {
  'TENURED': '정교사',
  'ACTIVE': '재직중',
  'EDITORIAL': '편집/행정',
  'ON CAMPUS': '교내근무',
  'EMERITUS': '명예교사',
  'NEW HIRE': '신규임용'
};

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('전체 교직원');
  const [visibleCount, setVisibleCount] = useState(10);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const filteredStaff = useMemo(() => {
    return RAW_STAFF_DATA.filter(staff => {
      const matchesSearch = 
        staff.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        staff.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
        staff.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        staff.extension.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (staff.class && staff.class.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesFilter = 
        activeFilter === '전체 교직원' ||
        staff.department === activeFilter;

      return matchesSearch && matchesFilter;
    });
  }, [searchQuery, activeFilter]);

  const displayedStaff = filteredStaff.slice(0, visibleCount);

  return (
    <div className="min-h-screen flex flex-col">
      {/* TopAppBar */}
      <header className="sticky top-0 w-full bg-surface/80 backdrop-blur-xl z-50 border-b border-on-surface/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img 
              src="https://lara-m.goesh.kr/dext5editordata/2025/12/20251205_161630157_70576.png" 
              alt="배곧라라중 로고" 
              className="w-10 h-10 object-contain"
              referrerPolicy="no-referrer"
            />
            <h1 className="text-primary font-bold tracking-tight text-base sm:text-xl">배곧라라중 디지털 비상연락망</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center text-white overflow-hidden border-2 border-primary/10">
              <User className="w-6 h-6" />
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Search Header Section */}
        <section className="mb-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
            <div className="flex items-center gap-2 px-4 py-2 bg-surface-container rounded-full text-secondary font-medium text-sm self-start md:self-auto">
              <Filter className="w-4 h-4" />
              <span>{filteredStaff.length}개의 결과 발견</span>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative group">
            <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
              <Search className="w-5 h-5 text-secondary group-focus-within:text-primary transition-colors" />
            </div>
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => {
                setActiveFilter('전체 교직원');
                setIsSearchFocused(true);
              }}
              onBlur={() => setIsSearchFocused(false)}
              className="w-full bg-surface-container-low border-none rounded-2xl py-4 md:py-5 pl-14 md:pl-16 pr-20 md:pr-32 text-base md:text-lg focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-on-surface-variant/50 shadow-sm"
              placeholder="이름, 부서, 내선번호로 검색..."
            />
            <div className="absolute inset-y-2 right-2 flex items-center">
              <button className="bg-primary text-white px-4 md:px-8 h-full rounded-xl font-semibold hover:bg-primary/90 transition-all active:scale-95 shadow-md text-sm md:text-base">
                검색
              </button>
            </div>
          </div>
        </section>

        {/* Filter Chips - Balanced Grid (Hidden during active search or focus) */}
        <AnimatePresence>
          {!searchQuery && !isSearchFocused && (
            <motion.section 
              initial={{ opacity: 0, height: 0, marginBottom: 0 }}
              animate={{ opacity: 1, height: 'auto', marginBottom: '2rem' }}
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-8 gap-2">
                {FILTER_CHIPS.map((chip) => (
                  <button
                    key={chip}
                    onClick={() => setActiveFilter(chip)}
                    className={`px-1 py-2.5 rounded-xl text-[10px] sm:text-xs md:text-sm font-medium transition-all text-center flex items-center justify-center min-h-[44px] leading-tight ${
                      activeFilter === chip 
                        ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                        : 'bg-surface-container hover:bg-surface-container-low text-on-surface-variant border border-on-surface/5'
                    }`}
                  >
                    {chip}
                  </button>
                ))}
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* Staff Results Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <AnimatePresence mode="popLayout">
            {displayedStaff.map((staff, index) => (
              <motion.div
                key={staff.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2, delay: index * 0.03 }}
                className="group bg-surface-container-lowest hover:bg-surface-container-low transition-all p-5 md:p-6 rounded-2xl flex items-start gap-4 md:gap-6 cursor-pointer shadow-sm hover:shadow-md border border-on-surface/5"
              >
                <div className="flex-grow space-y-1" key={`info-${staff.id}`}>
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg md:text-xl font-bold text-on-surface leading-tight group-hover:text-primary transition-colors">
                      {staff.name}
                    </h3>
                  </div>
                  <p className="text-primary font-semibold text-xs md:text-sm">
                    {staff.department} {staff.class && `(${staff.class})`}
                  </p>
                  <p className="text-on-surface-variant text-xs md:text-sm line-clamp-1">
                    {staff.subject} • 내선: {staff.extension}
                  </p>
                  
                  <div className="pt-3 md:pt-4 flex flex-wrap items-center gap-x-4 md:gap-x-6 gap-y-2">
                    <span className="flex items-center gap-1.5 text-[11px] md:text-xs text-secondary">
                      <MapPin className="w-3.5 h-3.5" />
                      {staff.office}
                    </span>
                    {staff.phone !== 'N/A' && (
                      <a 
                        href={`tel:${staff.phone.replace(/[^0-9]/g, '')}`}
                        key={`tel-${staff.id}`}
                        className="flex items-center gap-1.5 text-[11px] md:text-xs text-secondary hover:text-primary transition-colors cursor-pointer relative z-10"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Phone className="w-3.5 h-3.5" />
                        {staff.phone}
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </section>

        {/* Load More Section */}
        {visibleCount < filteredStaff.length && (
          <div className="mt-16 text-center">
            <button 
              onClick={() => setVisibleCount(prev => prev + 10)}
              className="bg-surface-container hover:bg-surface-container-low text-primary px-10 py-4 rounded-full font-bold transition-all active:scale-95 flex items-center gap-2 mx-auto shadow-sm"
            >
              <ChevronDown className="w-5 h-5" />
              교직원 더 보기
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="hidden md:block w-full bg-surface border-t border-on-surface/5 py-12 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col gap-2">
            <p className="text-xs text-secondary">
              배곧라라중 디지털정보부 조용석
            </p>
          </div>
          <div className="flex items-center gap-8 text-xs text-secondary">
            <a href="#" className="hover:text-primary transition-colors">개인정보 처리방침</a>
            <a href="#" className="hover:text-primary transition-colors">주소록 액세스</a>
            <a href="#" className="hover:text-primary transition-colors">부서 로그인</a>
          </div>
        </div>
      </footer>

      {/* Filter FAB (Mobile) - Scrolls to top/filter */}
      <button 
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-6 right-6 md:hidden w-14 h-14 bg-primary text-white rounded-full shadow-xl flex items-center justify-center active:scale-95 transition-all z-40"
      >
        <Filter className="w-6 h-6" />
      </button>
    </div>
  );
}
