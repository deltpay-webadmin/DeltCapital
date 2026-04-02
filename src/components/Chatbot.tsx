import { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, ChevronDown, Send } from 'lucide-react';
import logoImg from 'figma:asset/d59993d0ec9040f5cac8ad4361f161b6a4b3a746.png';
import deltIconImg from 'figma:asset/623b5b895ff281d86e56610115f4c9614b340ff8.png';
import deltLogoClean from 'figma:asset/9ac0f481d2eb398c5abd6b80b5c3efae0c057187.png';
import { useLanguage } from '../contexts/LanguageContext';

interface ChatbotProps {
  onApplyClick?: () => void;
  onCalculatorClick?: () => void;
  onBookingClick?: () => void;
  onSupportClick?: () => void;
}

interface Message {
  id: number;
  type: 'user' | 'bot';
  text: string;
  timestamp: Date;
}

export function Chatbot({ onApplyClick, onCalculatorClick, onBookingClick, onSupportClick }: ChatbotProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { language } = useLanguage();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  const formatTime = () => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    };
    
    if (language === 'es') {
      return currentTime.toLocaleString('es-ES', options);
    }
    return currentTime.toLocaleString('en-US', options);
  };

  const handleAction = (action: string) => {
    setIsExpanded(false); // Close chatbot after action
    
    switch (action) {
      case 'apply':
        onApplyClick?.();
        break;
      case 'book-meeting':
        onBookingClick?.()
        break;
      case 'calculator':
        onCalculatorClick?.();
        break;
      case 'support':
        onSupportClick?.();
        break;
      default:
        break;
    }
  };

  const getBotResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    
    // English responses
    if (language === 'en') {
      if (message.includes('what is delt') || message.includes('who is delt') || message.includes('about delt')) {
        return 'Delt Capital is a revenue-based financing company that provides flexible funding solutions for growing businesses. We offer fast access to capital without requiring equity or personal guarantees.';
      }
      if (message.includes('how does') || message.includes('how it works')) {
        return 'Our process is simple: 1) Apply in minutes with basic business information, 2) Get approved within 24 hours, 3) Receive funding in as fast as 1-2 business days. Repayment is based on a percentage of your daily revenue.';
      }
      if (message.includes('qualify') || message.includes('eligible') || message.includes('requirements')) {
        return 'To qualify, your business should have at least $10,000 in monthly revenue and have been operating for 6+ months. We work with various industries including e-commerce, SaaS, and retail.';
      }
      if (message.includes('how much') || message.includes('amount') || message.includes('funding')) {
        return 'We offer funding from $10,000 to $5,000,000 depending on your business revenue and needs. Use our calculator to see how much you may qualify for.';
      }
      if (message.includes('rate') || message.includes('cost') || message.includes('fee')) {
        return 'Our rates are competitive and customized based on your business profile. Typical factor rates range from 1.1 to 1.4, with no hidden fees. The exact rate depends on your revenue, time in business, and other factors.';
      }
      if (message.includes('repay') || message.includes('payment')) {
        return 'Repayment is flexible and based on your daily revenue. We collect a small percentage of your daily sales, so payments automatically adjust with your business performance.';
      }
      if (message.includes('time') || message.includes('how long') || message.includes('fast')) {
        return 'Our approval process takes 24 hours or less. Once approved, funds are typically deposited within 1-2 business days.';
      }
      if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
        return 'Hello! How can I help you learn more about Delt Capital today?';
      }
      return 'Thank you for your question. For detailed information, I recommend using the quick action buttons above or speaking with one of our funding specialists. You can also call us at (864) 729-3358.';
    }
    
    // Spanish responses
    if (message.includes('qué es delt') || message.includes('quién es delt') || message.includes('sobre delt')) {
      return 'Delt Capital es una empresa de financiamiento basado en ingresos que ofrece soluciones flexibles de capital para empresas en crecimiento. Ofrecemos acceso rápido a capital sin requerir acciones o garantías personales.';
    }
    if (message.includes('cómo funciona') || message.includes('como funciona')) {
      return 'Nuestro proceso es simple: 1) Solicite en minutos con información básica del negocio, 2) Obtenga aprobación en 24 horas, 3) Reciba fondos en tan solo 1-2 días hábiles. El reembolso se basa en un porcentaje de sus ingresos diarios.';
    }
    if (message.includes('calificar') || message.includes('elegible') || message.includes('requisitos')) {
      return 'Para calificar, su negocio debe tener al menos $10,000 en ingresos mensuales y haber estado operando durante 6+ meses. Trabajamos con varias industrias, incluido comercio electrónico, SaaS y minorista.';
    }
    if (message.includes('cuánto') || message.includes('cantidad') || message.includes('financiamiento')) {
      return 'Ofrecemos financiamiento desde $10,000 hasta $5,000,000 según los ingresos y necesidades de su negocio. Use nuestra calculadora para ver cuánto puede calificar.';
    }
    if (message.includes('tasa') || message.includes('costo') || message.includes('tarifa')) {
      return 'Nuestras tasas son competitivas y personalizadas según el perfil de su negocio. Las tasas de factor típicas oscilan entre 1.1 y 1.4, sin tarifas ocultas.';
    }
    if (message.includes('pagar') || message.includes('pago')) {
      return 'El reembolso es flexible y se basa en sus ingresos diarios. Cobramos un pequeño porcentaje de sus ventas diarias, por lo que los pagos se ajustan automáticamente según el rendimiento de su negocio.';
    }
    if (message.includes('tiempo') || message.includes('cuánto tiempo') || message.includes('rápido')) {
      return 'Nuestro proceso de aprobación toma 24 horas o menos. Una vez aprobado, los fondos generalmente se depositan en 1-2 días hábiles.';
    }
    if (message.includes('hola') || message.includes('buenos')) {
      return '¡Hola! ¿Cómo puedo ayudarte a aprender más sobre Delt Capital hoy?';
    }
    return 'Gracias por tu pregunta. Para información detallada, te recomiendo usar los botones de acción rápida arriba o hablar con uno de nuestros especialistas. También puedes llamarnos al (864) 729-3358.';
  };

  const sendMessage = () => {
    if (inputValue.trim()) {
      const newMessage: Message = {
        id: Date.now(),
        type: 'user',
        text: inputValue,
        timestamp: new Date()
      };
      
      const responseText = getBotResponse(inputValue);
      const botResponse: Message = {
        id: Date.now() + 1,
        type: 'bot',
        text: responseText,
        timestamp: new Date()
      };
      
      setMessages([...messages, newMessage, botResponse]);
      setInputValue('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isExpanded ? (
        <div className="bg-white rounded-lg shadow-[0_8px_32px_rgba(0,0,0,0.12)] w-[380px] overflow-hidden border border-[#041e42]/8">
          {/* Header — refined institutional */}
          <div className="bg-gradient-to-r from-[#041e42] to-[#062a5a] text-white px-4 py-4 flex items-center justify-between">
            <img src={deltLogoClean} alt="Delt" className="h-20 object-contain" />
            <button
              onClick={() => setIsExpanded(false)}
              className="hover:bg-white/10 rounded-md p-1.5 transition-all duration-200"
              aria-label="Minimize chat"
            >
              <X className="w-4 h-4" strokeWidth={2.5} />
            </button>
          </div>

          {/* Chat Content */}
          <div className="p-5 max-h-[520px] overflow-y-auto bg-[#fafbfc]">
            {/* Time stamp — minimal */}
            <div className="text-center text-[11px] text-[#041e42]/40 font-medium tracking-wide mb-5 uppercase">
              {formatTime()}
            </div>

            {/* Bot Message — refined card */}
            <div className="flex items-start gap-3 mb-6">
              <div className="w-8 h-8 bg-gradient-to-br from-[#4945ff] to-[#3b38d9] rounded-md flex items-center justify-center flex-shrink-0 shadow-sm">
                <MessageCircle className="w-4 h-4 text-white" strokeWidth={2} />
              </div>
              <div className="bg-white border border-[#041e42]/6 rounded-lg rounded-tl-none px-4 py-3.5 flex-1 shadow-sm">
                <p className="text-[13px] leading-relaxed text-[#041e42]/85" style={{ fontWeight: 450 }}>
                  {language === 'es' 
                    ? 'Bienvenido. ¿Cómo podemos ayudarte hoy? Nuestro equipo está disponible para analizar tus opciones de financiamiento.'
                    : 'Welcome. How can we assist you today? Our team is available to discuss your financing options.'}
                </p>
              </div>
            </div>

            {/* Action Buttons — institutional style */}
            <div className="space-y-2 ml-11">
              <button
                onClick={() => handleAction('apply')}
                className="group w-full bg-white hover:bg-[#4945ff] border border-[#041e42]/8 hover:border-[#4945ff] text-[#041e42] hover:text-white rounded-md px-4 py-3 text-[13px] transition-all duration-200 text-left shadow-sm hover:shadow-md"
                style={{ fontWeight: 500 }}
              >
                <span className="block" style={{ letterSpacing: '0.01em' }}>
                  {language === 'es' ? 'Solicitar financiamiento' : 'Apply for funding'}
                </span>
              </button>
              <button
                onClick={() => handleAction('calculator')}
                className="group w-full bg-white hover:bg-[#4945ff] border border-[#041e42]/8 hover:border-[#4945ff] text-[#041e42] hover:text-white rounded-md px-4 py-3 text-[13px] transition-all duration-200 text-left shadow-sm hover:shadow-md"
                style={{ fontWeight: 500 }}
              >
                <span className="block" style={{ letterSpacing: '0.01em' }}>
                  {language === 'es' ? 'Calcular mi financiamiento' : 'Calculate my funding'}
                </span>
              </button>
              <button
                onClick={() => handleAction('book-meeting')}
                className="group w-full bg-white hover:bg-[#4945ff] border border-[#041e42]/8 hover:border-[#4945ff] text-[#041e42] hover:text-white rounded-md px-4 py-3 text-[13px] transition-all duration-200 text-left shadow-sm hover:shadow-md"
                style={{ fontWeight: 500 }}
              >
                <span className="block" style={{ letterSpacing: '0.01em' }}>
                  {language === 'es' ? 'Reservar una reunión' : 'Book a meeting'}
                </span>
              </button>
              <button
                onClick={() => handleAction('support')}
                className="group w-full bg-white hover:bg-[#4945ff] border border-[#041e42]/8 hover:border-[#4945ff] text-[#041e42] hover:text-white rounded-md px-4 py-3 text-[13px] transition-all duration-200 text-left shadow-sm hover:shadow-md"
                style={{ fontWeight: 500 }}
              >
                <span className="block" style={{ letterSpacing: '0.01em' }}>
                  {language === 'es' ? 'Necesito soporte' : 'I need support'}
                </span>
              </button>
            </div>

            {/* User Messages */}
            {messages.map((message) => (
              <div key={message.id} className={`flex items-start gap-3 mb-4 mt-2 ${message.type === 'user' ? 'justify-end' : ''}`}>
                {message.type === 'bot' && (
                  <div className="w-8 h-8 bg-gradient-to-br from-[#4945ff] to-[#3b38d9] rounded-md flex items-center justify-center flex-shrink-0 shadow-sm">
                    <MessageCircle className="w-4 h-4 text-white" strokeWidth={2} />
                  </div>
                )}
                <div
                  className={`px-4 py-3.5 shadow-sm max-w-[80%] ${
                    message.type === 'user' 
                      ? 'bg-[#4945ff] border border-[#4945ff] rounded-lg rounded-tr-none' 
                      : 'bg-white border border-[#041e42]/6 rounded-lg rounded-tl-none'
                  }`}
                >
                  <p className={`text-[13px] leading-relaxed ${
                    message.type === 'user' ? 'text-white' : 'text-[#041e42]/85'
                  }`} style={{ fontWeight: 450 }}>
                    {message.text}
                  </p>
                </div>
              </div>
            ))}

            {/* Scroll to bottom reference */}
            <div ref={messagesEndRef} />
          </div>

          {/* Input and Send Button */}
          <div className="px-5 py-3 bg-white border-t border-[#041e42]/6 flex items-center">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={language === 'es' ? 'Escribe un mensaje...' : 'Type a message...'}
              className="w-full bg-[#fafbfc] border border-[#041e42]/6 rounded-lg px-4 py-3 text-[13px] leading-relaxed text-[#041e42]/85"
              onKeyPress={handleKeyPress}
            />
            <button
              onClick={sendMessage}
              className="ml-3 bg-[#4945ff] hover:bg-[#3b38d9] text-white rounded-md px-4 py-3 text-[13px] transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <Send className="w-4 h-4" strokeWidth={2} />
            </button>
          </div>

          {/* Footer — subtle */}
          <div className="px-5 py-3 bg-white border-t border-[#041e42]/6">
            <p className="text-[11px] text-[#041e42]/50 text-center font-medium tracking-wide">
              {language === 'es' 
                ? 'Disponible 24/7 · Respuesta en minutos'
                : 'Available 24/7 · Response within minutes'}
            </p>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsExpanded(true)}
          className="bg-gradient-to-br from-[#041e42] to-[#062a5a] hover:from-[#062a5a] hover:to-[#041e42] text-white rounded-lg w-14 h-14 flex items-center justify-center shadow-[0_4px_24px_rgba(4,30,66,0.25)] transition-all duration-300 hover:scale-105 hover:shadow-[0_8px_32px_rgba(4,30,66,0.35)] relative group"
          aria-label="Open chat"
        >
          <MessageCircle className="w-6 h-6 transition-transform group-hover:scale-110" strokeWidth={2} />
          <span className="absolute -top-1 -right-1 bg-[#4945ff] text-white text-[10px] font-bold rounded-full w-[18px] h-[18px] flex items-center justify-center shadow-sm border-2 border-white">
            1
          </span>
        </button>
      )}
    </div>
  );
}