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
    <div className="group relative flex flex-col justify-between bg-white border border-slate-200 hover:border-slate-350 rounded-3xl p-6.5 transition-all duration-300 shadow-sm">
      <div>
        <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-slate-50 text-slate-900 group-hover:bg-slate-950 group-hover:text-white transition-all shadow-sm">
          <LucideIcon className="h-5 w-5" />
        </div>

        <h3 className="text-xs font-black text-slate-950 mt-5 group-hover:text-slate-900 transition-colors uppercase tracking-wider">
          {title}
        </h3>
        
        <p className="text-slate-500 text-xs sm:text-sm leading-relaxed mt-2.5 font-medium">
          {description}
        </p>
      </div>
    </div>
  );
}
