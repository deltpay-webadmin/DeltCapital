import { Clock } from 'lucide-react';
import { motion } from 'motion/react';

interface TimeTrackerProps {
  currentStep: number;
  totalSteps: number;
  startTime?: number;
  inline?: boolean;
}

export function TimeToCompleteTracker({
  currentStep,
  totalSteps,
  inline = false,
}: TimeTrackerProps) {
  const getProgressPercentage = () => {
    return Math.round(((currentStep + 1) / totalSteps) * 100);
  };

  if (inline) {
    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center gap-3 bg-[#EEF2FF] dark:bg-[#4F46E5]/10 border-2 border-[#4F46E5]/20 rounded-lg px-4 py-3"
      >
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#4F46E5] to-[#4845FF] flex items-center justify-center flex-shrink-0">
          <Clock className="w-4 h-4 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <span className="text-sm font-semibold text-[#0F0E17] dark:text-white">
            Est. Time: ~5 minutes
          </span>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-6 right-6 bg-white dark:bg-[#020C1B] rounded-xl shadow-2xl border-2 border-[#D1D5DB] dark:border-[#1A1923] p-5 max-w-[280px] z-40 hidden lg:block"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#4F46E5] to-[#4845FF] flex items-center justify-center">
          <Clock className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-bold text-[#0F0E17] dark:text-white">Time to Complete</h4>
          <p className="text-xs text-[#6A6876] dark:text-[#D9D4C7]">
            {getProgressPercentage()}% done
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="h-2 bg-[#E7E3DA] dark:bg-[#1A1923] rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-[#4F46E5] to-[#4845FF]"
            initial={{ width: 0 }}
            animate={{ width: `${getProgressPercentage()}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </div>
      </div>

      {/* Static Time Estimate */}
      <div className="space-y-3">
        <div className="flex items-center justify-between pt-3 border-t border-[#E7E3DA] dark:border-[#1A1923]">
          <span className="text-xs text-[#6A6876] dark:text-[#D9D4C7]">Est. Time</span>
          <span className="text-sm font-semibold text-[#4F46E5]">
            ~5 minutes
          </span>
        </div>
      </div>
    </motion.div>
  );
}
