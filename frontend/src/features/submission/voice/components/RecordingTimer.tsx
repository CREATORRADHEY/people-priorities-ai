
interface RecordingTimerProps {
  duration: number;
}

export default function RecordingTimer({ duration }: RecordingTimerProps) {
  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="font-mono text-3xl sm:text-4xl font-extrabold text-blue-400 tracking-wider">
      {formatTime(duration)}
    </div>
  );
}
