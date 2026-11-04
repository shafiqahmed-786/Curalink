import { useState, useEffect, useRef, useCallback } from 'react';
import Modal from '../common/Modal';
import styles from './VoiceDialog.module.css';
import { askQuestion } from '../../services/chat.service';
import { parseLLMResponse } from '../../utils/parseLLMResponse';
import api from '../../services/api';
import { AiFillCloseCircle } from "react-icons/ai";
import { RiMicAiFill } from "react-icons/ri";

const SplineBackground = () => {
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    // Delay loading the iframe to prioritize initial content
    const timer = setTimeout(() => setShouldLoad(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (!shouldLoad) {
    return null; // Or a fallback gradient if you want one
  }

  return (
    <iframe
      src="https://my.spline.design/particleaibrain-qe1k60Xq3D0vS87r057dvnXm/"
      frameBorder="0"
      width="100%"
      height="100%"
      className={styles.splineIframe}
      loading="lazy"
      title="Background animation"
    />
  );
};

export default function VoiceDialog({ isOpen, onClose }) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const recognitionRef = useRef(null);
  const synthRef = useRef(window.speechSynthesis);
  const sessionIdRef = useRef(`voice-${crypto.randomUUID()}`);
  const streamRef = useRef(null);

  // Initialize Speech Recognition
  useEffect(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setAiResponse("Speech recognition is not supported in this browser. Please use Chrome.");
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
      setTranscript('');
      setAiResponse('');
    };

    recognition.onresult = (event) => {
      let currentTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        currentTranscript += event.results[i][0].transcript;
      }
      setTranscript(currentTranscript);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setIsListening(false);
      if (event.error !== 'aborted') {
        setAiResponse(`Microphone error: ${event.error}`);
      }
    };

    recognition.onend = () => {
      setIsListening(false);
      // Auto-submit if we have a transcript
      if (recognitionRef.current && recognitionRef.current.transcriptToSubmit) {
        handleSubmit(recognitionRef.current.transcriptToSubmit);
        recognitionRef.current.transcriptToSubmit = '';
      }
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  // Update transcript ref so onend can use latest value
  useEffect(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.transcriptToSubmit = transcript;
    }
  }, [transcript, isListening]);

  // Clean up backend ephemeral session when dialog closes
  useEffect(() => {
    if (!isOpen) {
      // Cleanup when closed
      if (synthRef.current) synthRef.current.cancel();
      if (recognitionRef.current) recognitionRef.current.abort();

      // Delete temporary session from backend (only if authenticated)
      const sid = sessionIdRef.current;
      const token = localStorage.getItem('token');
      if (token) {
        api.delete(`/conversations/${sid}`).catch(() => {
          // Silent catch: it's best-effort cleanup
        });
      }

      // Reset for next time
      sessionIdRef.current = `voice-${crypto.randomUUID()}`;
      setTranscript('');
      setAiResponse('');
      setIsLoading(false);
    }
  }, [isOpen]);

  const startListening = () => {
    if (synthRef.current) synthRef.current.cancel();
    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
      } catch (e) {
        // Ignore if already started
      }
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  const handleSubmit = async (queryToSubmit) => {
    const text = queryToSubmit.trim();
    if (!text) return;

    setIsLoading(true);
    setAiResponse('');

    try {
      // Fetch response
      const res = await askQuestion({
        query: text,
        source: 'All Sources',
      }, sessionIdRef.current);

      const { conditionOverview } = res.data.data;
      const { text: msgText } = parseLLMResponse(conditionOverview, res.data.data);

      setAiResponse(msgText);
      speakText(msgText);

    } catch (err) {
      setAiResponse("I'm sorry, I couldn't connect to the server right now.");
      speakText("I'm sorry, I couldn't connect to the server right now.");
    } finally {
      setIsLoading(false);
      setTranscript('');
    }
  };

  const speakText = (text) => {
    if (!synthRef.current || !text) return;
    synthRef.current.cancel(); // stop any current speech

    // Strip markdown formatting for cleaner speech
    const cleanText = text.replace(/[*_#]/g, '').replace(/\[(.*?)\]\(.*?\)/g, '$1');

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;

    // Try to use a better voice if available
    const voices = synthRef.current.getVoices();
    const googleVoice = voices.find(v => v.name.includes('Google US English'));
    if (googleVoice) {
      utterance.voice = googleVoice;
    }

    synthRef.current.speak(utterance);
  };

  if (!isOpen) return null;

  return (
    <Modal onClose={onClose}>
      <div className={styles.container}>
        <div className={styles.splineBg}>
          <SplineBackground />
        </div>

        <button className={styles.closeOverlayBtn} onClick={onClose} aria-label="Close">
          <AiFillCloseCircle size={28} />
        </button>

        <div className={styles.content}>
          {isListening ? (
            <div className={styles.listeningIndicator}>
              <div className={styles.pulseRing}></div>
              <p>Listening...</p>
            </div>
          ) : isLoading ? (
            <div className={styles.loadingIndicator}>
              <div className={styles.spinner}></div>
              <p>Thinking...</p>
            </div>
          ) : (
            <div className={styles.idleState}>
              <button className={styles.micBtn} onClick={startListening}>
                <RiMicAiFill size={28} />
              </button>
              <p>Tap to speak</p>
            </div>
          )}

          <div className={styles.transcriptBox}>
            {transcript && <p className={styles.userText}>"{transcript}"</p>}
            {aiResponse && <p className={styles.aiText}>{aiResponse}</p>}
          </div>
        </div>
      </div>
    </Modal>
  );
}
