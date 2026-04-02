import { MessageCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export function HelpCTA({ onContactClick }: { onContactClick?: () => void }) {
  const { t } = useLanguage();

  return (
    <section className="py-16 bg-white">
      <div className="max-w-xs mx-auto px-4 text-center">
        {/* Chat icon */}
        <div className="flex justify-center mb-5">
          <div className="relative w-12 h-12 text-gray-400">
            <MessageCircle className="w-9 h-9 absolute top-0 left-0 stroke-[1.5]" />
            <MessageCircle className="w-7 h-7 absolute bottom-0 right-0 stroke-[1.5] scale-x-[-1]" />
          </div>
        </div>

        {/* Heading */}
        <h3 className="text-[#041E42] mb-2" style={{ fontSize: '1.25rem' }}>
          Get Help
        </h3>

        {/* Description */}
        <p className="text-gray-500 text-sm leading-relaxed mb-4">
          Have a question? Call a Specialist<br />or chat online.
        </p>

        {/* Contact link */}
        <button
          onClick={() => onContactClick?.()}
          className="text-[#4945ff] hover:text-[#3b38d9] text-sm inline-flex items-center gap-0.5 transition-colors cursor-pointer bg-transparent border-none"
        >
          Contact us <span className="ml-0.5">›</span>
        </button>
      </div>
    </section>
  );
}