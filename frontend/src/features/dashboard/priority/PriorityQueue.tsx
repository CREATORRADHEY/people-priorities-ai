import React, { useState, useMemo } from 'react';
import { PriorityItem } from '../types/dashboard';

interface PriorityQueueProps {
  items: PriorityItem[] | null;
  onSelectRow: (submissionId: string) => void;
}

type SortField = 'priority' | 'date' | 'locality' | 'category';
type SortOrder = 'asc' | 'desc';

export const PriorityQueue: React.FC<PriorityQueueProps> = ({ items, onSelectRow }) => {
  const [sortBy, setSortBy] = useState<SortField>('priority');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const handleSort = (field: SortField) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc'); // Default to descending
    }
  };

  const processedItems = useMemo(() => {
    if (!items) return [];

    // 1. Filter
    let filtered = [...items];
    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.title.toLowerCase().includes(lower) ||
          item.locality.toLowerCase().includes(lower) ||
          item.category.toLowerCase().includes(lower)
      );
    }

    // 2. Sort
    filtered.sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'priority') {
        comparison = a.priorityScore - b.priorityScore;
      } else if (sortBy === 'date') {
        comparison = new Date(a.processedAt).getTime() - new Date(b.processedAt).getTime();
      } else if (sortBy === 'locality') {
        comparison = a.locality.localeCompare(b.locality);
      } else if (sortBy === 'category') {
        comparison = a.category.localeCompare(b.category);
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [items, sortBy, sortOrder, searchTerm]);

  const getPriorityBadgeClass = (level: string) => {
    switch (level.toUpperCase()) {
      case 'CRITICAL':
        return 'bg-rose-50 text-rose-700 border-rose-100';
      case 'HIGH':
        return 'bg-amber-50 text-amber-700 border-amber-100';
      case 'MEDIUM':
        return 'bg-blue-50 text-blue-700 border-blue-100';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-100';
    }
  };

  const formatDate = (isoString: string) => {
    if (!isoString) return 'Pending';
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return isoString;
    }
  };

  const SortIndicator: React.FC<{ field: SortField }> = ({ field }) => {
    if (sortBy !== field) return <span className="text-slate-350 ml-1">⇅</span>;
    return sortOrder === 'asc' ? (
      <span className="text-slate-900 ml-1">▲</span>
    ) : (
      <span className="text-slate-900 ml-1">▼</span>
    );
  };

  return (
    <div className="flex flex-col h-full space-y-4">
      {/* Search Filter Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search priority queue..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 bg-[#FAF9F6] text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-950 transition-all font-sans"
          />
          <svg
            className="w-4 h-4 text-slate-400 absolute left-3 top-2.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-sans">
          Showing {processedItems.length} of {items?.length || 0} issues
        </div>
      </div>

      {/* Table Container */}
      <div className="flex-1 overflow-x-auto rounded-2xl border border-slate-200 bg-white">
        <table className="w-full text-left border-collapse font-sans text-xs">
          <thead>
            <tr className="border-b border-slate-200 text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50">
              <th
                onClick={() => handleSort('priority')}
                className="py-3.5 px-4 cursor-pointer hover:text-slate-800 select-none transition-all"
              >
                Priority <SortIndicator field="priority" />
              </th>
              <th className="py-3.5 px-4 text-slate-500">Issue Details</th>
              <th
                onClick={() => handleSort('category')}
                className="py-3.5 px-4 cursor-pointer hover:text-slate-800 select-none transition-all"
              >
                Category <SortIndicator field="category" />
              </th>
              <th
                onClick={() => handleSort('locality')}
                className="py-3.5 px-4 cursor-pointer hover:text-slate-800 select-none transition-all"
              >
                Locality <SortIndicator field="locality" />
              </th>
              <th
                onClick={() => handleSort('date')}
                className="py-3.5 px-4 cursor-pointer hover:text-slate-800 select-none transition-all"
              >
                Reported <SortIndicator field="date" />
              </th>
            </tr>
          </thead>
          <tbody className="text-xs divide-y divide-slate-100 text-slate-700">
            {processedItems.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-10 text-slate-450 italic">
                  No issues matching criteria.
                </td>
              </tr>
            ) : (
              processedItems.map((item) => (
                <tr
                  key={item.submissionId}
                  onClick={() => onSelectRow(item.submissionId)}
                  className="hover:bg-slate-50/50 cursor-pointer transition-all duration-150 group"
                >
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2.5">
                      <span className="text-xs font-black tracking-tight text-slate-900 font-mono w-7">
                        {item.priorityScore}
                      </span>
                      <span
                        className={`text-[9px] px-2.5 py-0.5 rounded-full border font-bold uppercase tracking-wider font-sans ${getPriorityBadgeClass(
                          item.priorityLevel
                        )}`}
                      >
                        {item.priorityLevel}
                      </span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 max-w-xs md:max-w-sm lg:max-w-md">
                    <div className="flex flex-col">
                      <span className="font-extrabold text-slate-900 group-hover:text-slate-850 transition-colors line-clamp-1">
                        {item.title}
                      </span>
                      <span className="text-[10px] text-slate-400 line-clamp-1 mt-0.5 font-sans font-medium">
                        Rec: {item.recommendedAction}
                      </span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-500 uppercase tracking-wider text-[9px]">
                    {item.category}
                  </td>
                  <td className="py-3.5 px-4 font-medium text-slate-650">
                    {item.locality}
                  </td>
                  <td className="py-3.5 px-4 font-medium text-slate-400">
                    {formatDate(item.processedAt)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PriorityQueue;
