import React, { useState, useMemo } from 'react';
import { PriorityItem } from '../types/dashboard';

interface DuplicateClustersProps {
  priorities: PriorityItem[] | null;
  onSelectRow: (submissionId: string) => void;
}

interface ClusterGroup {
  parentId: string;
  parentTitle: string;
  category: string;
  locality: string;
  duplicates: PriorityItem[];
}

export const DuplicateClusters: React.FC<DuplicateClustersProps> = ({ priorities, onSelectRow }) => {
  const [expandedCluster, setExpandedCluster] = useState<string | null>(null);

  const clusters = useMemo(() => {
    if (!priorities) return [];

    // Cluster submissions by Category and Locality
    const clusterMap: { [key: string]: ClusterGroup } = {};

    priorities.forEach((item) => {
      const key = `${item.category}::${item.locality}`.toLowerCase();
      if (!clusterMap[key]) {
        clusterMap[key] = {
          parentId: item.submissionId,
          parentTitle: item.title,
          category: item.category,
          locality: item.locality,
          duplicates: [],
        };
      } else {
        clusterMap[key].duplicates.push(item);
      }
    });

    // Return only clusters that have actual duplicates (size > 0)
    return Object.values(clusterMap)
      .filter((c) => c.duplicates.length > 0)
      .sort((a, b) => b.duplicates.length - a.duplicates.length);
  }, [priorities]);

  const toggleExpand = (key: string) => {
    setExpandedCluster(expandedCluster === key ? null : key);
  };

  const formatDate = (isoString: string) => {
    if (!isoString) return '';
    try {
      return new Date(isoString).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return isoString;
    }
  };

  if (clusters.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-slate-400 text-xs py-10">
        No duplicate report clusters detected.
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full space-y-3.5 font-sans">
      <div className="flex-1 overflow-y-auto max-h-[290px] pr-1 space-y-3 custom-scrollbar">
        {clusters.map((cluster) => {
          const clusterKey = `${cluster.category}-${cluster.locality}`;
          const isExpanded = expandedCluster === clusterKey;

          return (
            <div
              key={clusterKey}
              className="flex flex-col rounded-2xl border border-slate-200 bg-white overflow-hidden transition-all duration-300 shadow-sm"
            >
              {/* Header card */}
              <div
                onClick={() => toggleExpand(clusterKey)}
                className="flex items-center justify-between p-4 cursor-pointer hover:bg-slate-50/50 select-none"
              >
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-50 text-blue-600 border border-blue-100 font-bold text-xs">
                    {cluster.duplicates.length + 1}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-800 line-clamp-1">
                      {cluster.parentTitle}
                    </span>
                    <span className="text-[10px] text-slate-455 mt-0.5 font-semibold">
                      {cluster.category} • {cluster.locality}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[9px] bg-rose-50 text-rose-700 border border-rose-100 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                    Cluster
                  </span>
                  <span className="text-slate-400 text-xs">{isExpanded ? '▲' : '▼'}</span>
                </div>
              </div>

              {/* Duplicate reports details list */}
              {isExpanded && (
                <div className="border-t border-slate-100 bg-slate-50/30 px-4 py-3 divide-y divide-slate-100">
                  <div className="text-[9px] text-slate-400 font-extrabold uppercase tracking-wider mb-2">
                    Duplicate Reports in Cluster
                  </div>
                  {cluster.duplicates.map((dup) => (
                    <div
                      key={dup.submissionId}
                      onClick={() => onSelectRow(dup.submissionId)}
                      className="py-2.5 flex items-center justify-between hover:text-slate-900 cursor-pointer transition-colors text-xs"
                    >
                      <span className="line-clamp-1 max-w-[200px] font-medium text-slate-700 hover:underline">
                        {dup.title}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {formatDate(dup.processedAt)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DuplicateClusters;
