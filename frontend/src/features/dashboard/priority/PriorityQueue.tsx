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
        return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      case 'HIGH':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'MEDIUM':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      default:
        return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
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
    if (sortBy !== field) return <span className="text-slate-600 ml-1">⇅</span>;
    return sortOrder === 'asc' ? (
      <span className="text-blue-400 ml-1">▲</span>
    ) : (
      <span className="text-blue-400 ml-1">▼</span>
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
            className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-slate-800 bg-slate-900/40 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500/50 transition-all font-sans"
          />
          <svg
            className="w-4 h-4 text-slate-500 absolute left-3 top-3"
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
        <div className="text-xs text-slate-500 font-sans">
          Showing {processedItems.length} of {items?.length || 0} issues
        </div>
      </div>

      {/* Table Container */}
      <div className="flex-1 overflow-x-auto rounded-xl border border-slate-900 bg-slate-950/20">
        <table className="w-full text-left border-collapse font-sans">
          <thead>
            <tr className="border-b border-slate-900 text-xs font-semibold text-slate-400 bg-slate-950/40">
              <th
                onClick={() => handleSort('priority')}
                className="py-3.5 px-4 cursor-pointer hover:text-slate-200 select-none transition-all"
              >
                Priority <SortIndicator field="priority" />
              </th>
              <th className="py-3.5 px-4">Issue Details</th>
              <th
                onClick={() => handleSort('category')}
                className="py-3.5 px-4 cursor-pointer hover:text-slate-200 select-none transition-all"
              >
                Category <SortIndicator field="category" />
              </th>
              <th
                onClick={() => handleSort('locality')}
                className="py-3.5 px-4 cursor-pointer hover:text-slate-200 select-none transition-all"
              >
                Locality <SortIndicator field="locality" />
              </th>
              <th
                onClick={() => handleSort('date')}
                className="py-3.5 px-4 cursor-pointer hover:text-slate-200 select-none transition-all"
              >
                Reported <SortIndicator field="date" />
              </th>
            </tr>
          </thead>
          <tbody className="text-sm divide-y divide-slate-900/60">
            {processedItems.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-10 text-slate-500 text-xs">
                  No issues matching criteria.
                </td>
              </tr>
            ) : (
              processedItems.map((item) => (
                <tr
                  key={item.submissionId}
                  onClick={() => onSelectRow(item.submissionId)}
                  className="hover:bg-slate-900/20 cursor-pointer transition-all duration-150 group"
                >
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2.5">
                      <span className="text-sm font-bold tracking-tight text-slate-200 font-mono w-7">
                        {item.priorityScore}
                      </span>
                      <span
                        className={`text-[10px] px-2.5 py-0.5 rounded-full border font-bold uppercase tracking-wider font-sans ${getPriorityBadgeClass(
                          item.priorityLevel
                        )}`}
                      >
                        {item.priorityLevel}
                      </span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 max-w-xs md:max-w-sm lg:max-w-md">
                    <div className="flex flex-col">
                      <span className="font-semibold text-slate-200 group-hover:text-blue-400 transition-colors line-clamp-1">
                        {item.title}
                      </span>
                      <span className="text-xs text-slate-500 line-clamp-1 mt-0.5 font-sans">
                        Rec: {item.recommendedAction}
                      </span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-xs font-semibold text-slate-400">
                    {item.category}
                  </td>
                  <td className="py-3.5 px-4 text-xs text-slate-400">
                    {item.locality}
                  </td>
                  <td className="py-3.5 px-4 text-xs text-slate-500">
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
