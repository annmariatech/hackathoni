import React, { useState, useRef } from 'react';
import { Mic, MicOff, Volume2, Send, CheckCircle2, Loader2 } from 'lucide-react';
import { VoiceInteractionResponse } from '../types';

interface PushToTalkProps {
  onInteractionComplete: (response: VoiceInteractionResponse) => void;
  selectedCrewId: string;
}

export const PushToTalk: React.FC<PushToTalkProps> = ({
  onInteractionComplete,
  selectedCrewId,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState<string>('');
  const [responseMalayalam, setResponseMalayalam] = useState<string>('');

  const [textFallback, setTextFallback] = useState<string>('');
  const [showTextInput, setShowTextInput] = useState<boolean>(false);
  const [lastAction, setLastAction] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      const supportedMimeType = [
        'audio/webm;codecs=opus',
        'audio/webm',
        'audio/mp4',
      ].find((mimeType) => MediaRecorder.isTypeSupported(mimeType));
      const mediaRecorder = new MediaRecorder(
        stream,
        supportedMimeType ? { mimeType: supportedMimeType } : undefined,
      );
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioType = audioChunksRef.current[0]?.type || mediaRecorder.mimeType || 'audio/webm';
        const extension = audioType.includes('webm') ? 'webm' : audioType.includes('mp4') ? 'mp4' : 'wav';
        const audioBlob = new Blob(audioChunksRef.current, { type: audioType });
        await sendAudioPayload(audioBlob, undefined, `field_recording.${extension}`);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.warn('Microphone permission blocked or unavailable. Falling back to text prompt.', err);
      setShowTextInput(true);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsProcessing(true);
    }
  };

  const sendAudioPayload = async (audioBlob?: Blob, text?: string, audioFilename = 'field_recording.wav') => {
    setIsProcessing(true);
    const formData = new FormData();
    formData.append('crew_id', selectedCrewId);

    if (audioBlob) {
      formData.append('audio', audioBlob, audioFilename);
    }
    if (text) {
      formData.append('text_fallback', text);
    }

    try {
      const resp = await fetch('/api/v1/voice/interact', {
        method: 'POST',
        body: formData,
      });

      if (!resp.ok) {
        throw new Error(`HTTP error! status: ${resp.status}`);
      }

      const data: VoiceInteractionResponse = await resp.json();
      setTranscript(data.transcript_malayalam);
      setResponseMalayalam(data.dispatcher_response_malayalam);
      // setAudioUrl(data.audio_response_url);

      if (data.tool_calls && data.tool_calls.length > 0) {
        const tc = data.tool_calls[0];
        setLastAction(`Executed: ${tc.tool_name} (Allocated: ${tc.result.assigned_yard || 'Confirmed'})`);
      }

      onInteractionComplete(data);

      // Automatically play Malayalam response audio
      if (data.audio_response_url) {
        const audio = new Audio(data.audio_response_url);
        audioPlayerRef.current = audio;
        audio.play().catch((e) => console.log('Audio autoplay prevented:', e));
      }
    } catch (err) {
      console.error('Voice interaction failed:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!textFallback.trim()) return;
    sendAudioPayload(undefined, textFallback.trim());
    setTextFallback('');
  };

  // Quick preset voice queries in Malayalam
  const sendPreset = (malayalamText: string) => {
    sendAudioPayload(undefined, malayalamText);
  };

  return (
    <div className="bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-2xl p-5 shadow-2xl">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-emerald-400" />
            Sarvam Malayalam Voice Desk (പായൽ കൺട്രോൾ റൂം)
          </h2>
        </div>
        <button
          onClick={() => setShowTextInput(!showTextInput)}
          className="text-xs text-slate-400 hover:text-emerald-400 underline transition-colors"
        >
          {showTextInput ? 'Hide Text' : 'Text Input Fallback'}
        </button>
      </div>

      {/* Main Push to Talk Button */}
      <div className="flex flex-col items-center justify-center my-4">
        <button
          onMouseDown={startRecording}
          onMouseUp={stopRecording}
          onTouchStart={startRecording}
          onTouchEnd={stopRecording}
          disabled={isProcessing}
          className={`relative group w-24 h-24 rounded-full flex flex-col items-center justify-center transition-all transform active:scale-95 shadow-xl ${
            isRecording
              ? 'bg-rose-600 shadow-rose-600/50 scale-105'
              : isProcessing
              ? 'bg-amber-600 shadow-amber-600/40'
              : 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/40'
          }`}
        >
          {/* Animated ripple pulse when recording */}
          {isRecording && (
            <span className="absolute -inset-3 rounded-full bg-rose-500/30 animate-ping"></span>
          )}

          {isProcessing ? (
            <Loader2 className="w-10 h-10 text-white animate-spin" />
          ) : isRecording ? (
            <MicOff className="w-10 h-10 text-white" />
          ) : (
            <Mic className="w-10 h-10 text-white" />
          )}

          <span className="text-[10px] font-extrabold uppercase tracking-wider text-white mt-1">
            {isRecording ? 'Listening' : isProcessing ? 'Sarvam AI' : 'Hold to Speak'}
          </span>
        </button>

      </div>

      {/* Preset Malayalam Quick Commands for Testing / Houseboat Demo */}
      <div className="border-t border-slate-800/80 pt-3 mt-2">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => sendPreset('ഞങ്ങൾ കൈനകരിയിൽ 350 കിലോ പായൽ ശേഖരിച്ചു, അടുത്തത് എങ്ങോട്ട് പോണം?')}
            disabled={isProcessing}
            className="text-xs px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition font-['Noto_Sans_Malayalam']"
          >
            "350 kg harvested at Kainakary" (ശേഖരണം)
          </button>
          <button
            onClick={() => sendPreset('ഞങ്ങൾക്ക് അടുത്ത യാർഡ് സ്ലോട്ട് അനുവദിക്കാമോ?')}
            disabled={isProcessing}
            className="text-xs px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition font-['Noto_Sans_Malayalam']"
          >
            "Request Yard Slot" (യാർഡ് സ്ലോട്ട്)
          </button>
          <button
            onClick={() => sendPreset('പുന്നമടയിൽ മഴ സാധ്യത എങ്ങനെയാണ്?')}
            disabled={isProcessing}
            className="text-xs px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition font-['Noto_Sans_Malayalam']"
          >
            "Rain Forecast" (മഴ സാധ്യത)
          </button>
        </div>
      </div>

      {/* Text Input Fallback */}
      {showTextInput && (
        <form onSubmit={handleTextSubmit} className="mt-3 flex gap-2">
          <input
            type="text"
            value={textFallback}
            onChange={(e) => setTextFallback(e.target.value)}
            placeholder=""
            className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
          <button
            type="submit"
            disabled={isProcessing || !textFallback.trim()}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-lg text-xs font-semibold flex items-center gap-1"
          >
            <Send className="w-3.5 h-3.5" />
            Send
          </button>
        </form>
      )}

      {/* Live Transcript & Dispatcher Feedback Card */}
      {(transcript || responseMalayalam) && (
        <div className="mt-4 p-4 rounded-xl bg-slate-800/60 border border-slate-700 space-y-2">
          {transcript && (
            <div>
              <span className="text-[10px] font-bold uppercase text-slate-400">Harvester Spoken (Saaras STT):</span>
              <p className="text-sm font-['Noto_Sans_Malayalam'] text-emerald-300 font-medium">
                "{transcript}"
              </p>
            </div>
          )}

          {responseMalayalam && (
            <div className="border-t border-slate-700/60 pt-2">
              <span className="text-[10px] font-bold uppercase text-sky-400">Dispatcher Reply (Bulbul v3 TTS):</span>
              <p className="text-sm font-['Noto_Sans_Malayalam'] text-white">
                {responseMalayalam}
              </p>
            </div>
          )}

          {lastAction && (
            <div className="flex items-center gap-1.5 text-xs text-amber-300 pt-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{lastAction}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
