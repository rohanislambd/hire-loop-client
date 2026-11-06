"use client"

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, MapPin, Briefcase, Building2, Users, Star, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Hero() {
  const router = useRouter();
  const [jobQuery, setJobQuery] = useState('');
  const [locationQuery, setLocationQuery] = useState('');

  const stats = [
    { icon: Briefcase, value: '50K', label: 'Active Jobs' },
    { icon: Building2, value: '12K', label: 'Companies' },
    { icon: Users, value: '2M', label: 'Job Seekers' },
    { icon: Star, value: '97%', label: 'Satisfaction Rate' },
  ];

  const trendingTags = ['Product Designer', 'AI Engineering', 'Dev-ops Engineer'];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (jobQuery.trim()) {
      params.set('q', jobQuery.trim());
    }
    if (locationQuery.trim()) {
      params.set('location', locationQuery.trim());
    }
    const queryString = params.toString();
    router.push(`/jobs${queryString ? `?${queryString}` : ''}`);
  };

  const handleTagClick = (tag: string) => {
    setJobQuery(tag);
    const params = new URLSearchParams();
    params.set('q', tag);
    if (locationQuery.trim()) {
      params.set('location', locationQuery.trim());
    }
    router.push(`/jobs?${params.toString()}`);
  };

  return (
    <div className="relative w-full bg-[#030108] text-white overflow-hidden py-10 sm:py-16 lg:py-20">
      {/* Background Ambient Glow */}
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,rgba(99,102,241,0.12),transparent_70%)]"
        aria-hidden="true"
      />

      {/* hero text & seacrh */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
        {/* top badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-zinc-900/80 border border-zinc-800 text-xs mb-5 backdrop-blur-md">
          <span role="img" aria-label="Briefcase">💼</span>
          <span className="font-semibold text-white">50,000+</span>
          <span className="text-zinc-400 tracking-wider">NEW JOBS THIS MONTH</span>
        </div>

        
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-4 leading-tight">
          Find Your Dream Job Today
        </h1>
        <p className="text-zinc-400 text-sm sm:text-base max-w-xl mx-auto mb-8 leading-relaxed">
          HireLoop connects top talent with world-class companies. Browse thousands of curated opportunities and land your next role — faster.
        </p>

        {/* search*/}
        <form
          onSubmit={handleSearch}
          className="bg-[#0b0c14]/90 border border-zinc-800/80 rounded-2xl p-2 sm:p-2.5 flex flex-col md:flex-row items-center gap-2 max-w-2xl mx-auto shadow-2xl backdrop-blur-md transition-all focus-within:border-zinc-700"
        >
          {/* Job title / skill input */}
          <div className="flex items-center gap-3 px-3 w-full md:w-1/2 border-b md:border-b-0 md:border-r border-zinc-800/80 py-2.5 md:py-0">
            <Search className="w-4 h-4 text-zinc-500 shrink-0" />
            <input
              type="text"
              value={jobQuery}
              onChange={(e) => setJobQuery(e.target.value)}
              placeholder="Job title, skill or company"
              className="bg-transparent text-sm w-full outline-none placeholder:text-zinc-500 text-zinc-200"
            />
            {jobQuery && (
              <button
                type="button"
                onClick={() => setJobQuery('')}
                className="text-zinc-500 hover:text-zinc-300 transition"
                aria-label="Clear job query"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Location input */}
          <div className="flex items-center gap-3 px-3 w-full md:w-1/2 py-2.5 md:py-0">
            <MapPin className="w-4 h-4 text-zinc-500 shrink-0" />
            <input
              type="text"
              value={locationQuery}
              onChange={(e) => setLocationQuery(e.target.value)}
              placeholder="Location or Remote"
              className="bg-transparent text-sm w-full outline-none placeholder:text-zinc-500 text-zinc-200"
            />
            {locationQuery && (
              <button
                type="button"
                onClick={() => setLocationQuery('')}
                className="text-zinc-500 hover:text-zinc-300 transition"
                aria-label="Clear location query"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Search Button */}
          <Button
            type="submit"
            className="w-full md:w-auto px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition flex items-center justify-center shrink-0 h-10 shadow-md shadow-indigo-600/30 border-0 cursor-pointer"
            aria-label="Search jobs"
          >
            <Search className="w-4 h-4 text-white" />
          </Button>
        </form>

        {/*tranding word*/}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-5 text-xs text-zinc-400">
          <span className="text-zinc-500">Trending Position:</span>
          {trendingTags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => handleTagClick(tag)}
              className="px-3 py-1 rounded-full bg-zinc-900/60 border border-zinc-800 hover:border-zinc-700 hover:text-white transition cursor-pointer"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      
      <div className="relative z-10 max-w-5xl mx-auto w-full px-4 mt-16 sm:mt-20">
        <div className="text-center mb-8 sm:mb-10">
          <h2 className="text-xl sm:text-3xl font-medium text-zinc-200">
            Assisting over <span className="font-bold text-white">15,000 job seekers</span>
          </h2>
          <p className="text-base sm:text-xl text-zinc-400 mt-1">
            find their dream positions.
          </p>
        </div>

        {/* card section*/}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-[#0b0c16]/75 border border-zinc-800/80 rounded-2xl p-5 sm:p-6 backdrop-blur-md shadow-xl flex flex-col justify-between h-36 sm:h-40 hover:border-zinc-700 transition"
              >
                <Icon className="w-5 h-5 text-zinc-400" />
                <div>
                  <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white mb-1">
                    {item.value}
                  </h3>
                  <p className="text-xs text-zinc-400 font-medium">
                    {item.label}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
