import { useState, useRef, useEffect, useCallback } from 'react';
import { RecordingState } from '../types/voice';

export function useVoiceRecorder() {
  const [isSupported, setIsSupported] = useState(true);
  const [recordingState, setRecordingState] = useState<RecordingState>('idle');
  const [duration, setDuration] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [permissionError, setPermissionError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  // 1. Browser capability detection
  useEffect(() => {
    const supported = !!(
      navigator.mediaDevices &&
      typeof navigator.mediaDevices.getUserMedia === 'function' &&
      window.MediaRecorder
    );
    setIsSupported(supported);
  }, []);

  // Clear timer/stream on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  // 2. Request mic permission
  const requestPermission = useCallback(async (): Promise<boolean> => {
    try {
      setPermissionError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      // Stop the test stream tracks immediately so the microphone light doesn't stay on
      stream.getTracks().forEach((track) => track.stop());
      return true;
    } catch (err: any) {
      console.error("Microphone permission denied:", err);
      setPermissionError(err.message || "Microphone access denied.");
      setRecordingState('error');
      return false;
    }
  }, []);

  // 3. Start recording
  const startRecording = useCallback(async () => {
    try {
      setPermissionError(null);
      chunksRef.current = [];
      setDuration(0);
      setAudioUrl(null);
      setAudioBlob(null);

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      // Determine mimeType support
      let options = {};
      if (MediaRecorder.isTypeSupported('audio/webm')) {
        options = { mimeType: 'audio/webm' };
      }

      const mediaRecorder = new MediaRecorder(stream, options);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const mimeType = mediaRecorder.mimeType || 'audio/webm';
        const blob = new Blob(chunksRef.current, { type: mimeType });
        const url = URL.createObjectURL(blob);
        setAudioBlob(blob);
        setAudioUrl(url);
        setRecordingState('recorded');
      };

      mediaRecorder.start();
      setRecordingState('recording');

      // Start duration timer
      timerRef.current = setInterval(() => {
        setDuration((prev) => {
          if (prev >= 119) {
            // Auto stop at 2 minutes (120 seconds)
            if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
              mediaRecorderRef.current.stop();
            }
            if (streamRef.current) {
              streamRef.current.getTracks().forEach((track) => track.stop());
            }
            if (timerRef.current) clearInterval(timerRef.current);
            return 120;
          }
          return prev + 1;
        });
      }, 1000);
    } catch (err: any) {
      console.error("Failed to start recording:", err);
      setPermissionError("Could not access microphone.");
      setRecordingState('error');
    }
  }, []);

  // 4. Stop recording
  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  }, []);

  // 5. Delete recording
  const deleteRecording = useCallback(() => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
    setAudioUrl(null);
    setAudioBlob(null);
    setDuration(0);
    setRecordingState('idle');
  }, [audioUrl]);

  return {
    isSupported,
    recordingState,
    duration,
    audioUrl,
    audioBlob,
    permissionError,
    requestPermission,
    startRecording,
    stopRecording,
    deleteRecording,
  };
}
