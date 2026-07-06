
interface ValidationMessageProps {
  message?: string;
  type?: 'error' | 'success' | 'info';
}

export default function ValidationMessage({ message, type = 'error' }: ValidationMessageProps) {
  if (!message) return null;

  const typeClasses = {
    error: "text-red-400 bg-red-500/10 border-red-500/20",
    success: "text-green-400 bg-green-500/10 border-green-500/20",
    info: "text-blue-400 bg-blue-500/10 border-blue-500/20"
  };

  return (
    <div className={`text-xs px-3 py-1.5 rounded-lg border font-medium mt-1 animate-fadeIn ${typeClasses[type]}`}>
      {message}
    </div>
  );
}
