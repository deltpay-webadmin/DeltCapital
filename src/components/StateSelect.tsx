import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

interface StateSelectProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

const US_STATES = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
  'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
  'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
  'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
  'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
];

export function StateSelect({ value, onChange, className = '' }: StateSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const filteredStates = US_STATES.filter(state =>
    state.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleSelect = (state: string) => {
    onChange(state);
    setIsOpen(false);
    setSearchTerm('');
  };

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`${className} flex items-center justify-between`}
      >
        <span className={value ? 'text-[#041E42] dark:text-white' : 'text-[#9AA5B1]'}>
          {value || 'Select State'}
        </span>
        <ChevronDown
          className={`w-5 h-5 text-[#52606D] transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute z-50 mt-2 w-full bg-white dark:bg-[#020C1B] border-2 border-[#D1D5DB] dark:border-[#1F2933] rounded-lg shadow-xl"
        >
          {/* Search Input */}
          <div className="p-2 border-b border-[#E4E7EB] dark:border-[#1F2933]">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search states..."
              className="w-full px-3 py-2 text-sm border border-[#D1D5DB] dark:border-[#1F2933] rounded bg-white dark:bg-[#0D1821] text-[#041E42] dark:text-white focus:border-[#1B17FF] focus:outline-none"
              autoFocus
            />
          </div>

          {/* Options List with Scroll */}
          <div className="max-h-[240px] overflow-y-auto">
            {filteredStates.length > 0 ? (
              filteredStates.map((state) => (
                <button
                  key={state}
                  type="button"
                  onClick={() => handleSelect(state)}
                  className={`w-full px-4 py-2.5 text-left text-sm flex items-center justify-between hover:bg-[#F5F7FA] dark:hover:bg-[#1F2933] transition-colors ${
                    value === state
                      ? 'bg-[#EEF2FF] dark:bg-[#1B17FF]/10 text-[#1B17FF] font-semibold'
                      : 'text-[#041E42] dark:text-white'
                  }`}
                >
                  <span>{state}</span>
                  {value === state && <Check className="w-4 h-4 text-[#1B17FF]" />}
                </button>
              ))
            ) : (
              <div className="px-4 py-8 text-center text-sm text-[#9AA5B1]">
                No states found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
