import * as Icons from 'lucide-react';

interface FeatureCardProps {
  title: string;
  description: string;
  iconName: string;
}

export default function FeatureCard({ title, description, iconName }: FeatureCardProps) {
  // Dynamically map icon name to Lucide Icon component
  const LucideIcon = (Icons as any)[iconName] || Icons.HelpCircle;

  return (
    <div className="group relative bg-slate-900/60 backdrop-blur-sm border border-slate-800 hover:border-slate-700/80 rounded-2xl p-6 sm:p-8 transition-all hover:shadow-xl hover:shadow-blue-950/20 hover:-translate-y-1">
      <div className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl bg-gradient-to-r from-blue-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity" />
      
      <div className="inline-flex items-center justify-center p-3 rounded-xl bg-blue-500/10 text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-inner">
        <LucideIcon className="h-6 w-6" />
      </div>

      <h3 className="text-xl font-bold text-white mt-6 group-hover:text-blue-300 transition-colors">
        {title}
      </h3>
      
      <p className="text-slate-400 text-sm leading-relaxed mt-3">
        {description}
      </p>
    </div>
  );
}
