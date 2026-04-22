import { Smartphone, Check } from 'lucide-react';
import { motion } from 'motion/react';

interface ReceivedItems {
  businessInfo: boolean;
  ownerInfo: boolean;
  fundingRequest: boolean;
  bankConnected: boolean;
  bankStatements: boolean;
  processorStatements: boolean;
  creditCardProcessor: boolean;
  identityVerified: boolean;
  ssnProvided: boolean;
  eSignature: boolean;
}

interface StatusMessageProps {
  applicantName?: string;
  phoneNumber?: string;
  email?: string;
  receivedItems?: ReceivedItems;
  businessName?: string;
}

export function ApplicationStatusMessage({
  applicantName = 'there',
  phoneNumber,
  email,
  receivedItems,
  businessName,
}: StatusMessageProps) {
  // Build the checklist of received items
  const checklist = [
    { label: 'Business information', received: receivedItems?.businessInfo ?? true },
    { label: 'Owner details & contact', received: receivedItems?.ownerInfo ?? true },
    { label: 'Funding request', received: receivedItems?.fundingRequest ?? true },
    { label: 'Bank account connected', received: receivedItems?.bankConnected ?? false },
    { label: 'Bank statements uploaded', received: receivedItems?.bankStatements ?? false },
    { label: 'Credit card processor selected', received: receivedItems?.creditCardProcessor ?? true },
    { label: 'Processing statements uploaded', received: receivedItems?.processorStatements ?? true },
    { label: 'Identity verified', received: receivedItems?.identityVerified ?? true },
    { label: 'SSN provided', received: receivedItems?.ssnProvided ?? true },
    { label: 'E-signature completed', received: receivedItems?.eSignature ?? true },
  ].filter(item => item.received);

  // Today's date formatted
  const today = new Date();
  const formattedDate = today.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  return (
    <div className="-mx-4 sm:-mx-6 lg:-mx-8 -mt-8 md:-mt-12 relative z-0">
      {/* ── Gradient Banner ── */}
      <div className="relative overflow-hidden pt-14 pb-24 px-6">

        <div className="relative z-10 max-w-xl mx-auto text-center">
          {/* Green check */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.15, type: 'spring', stiffness: 180, damping: 14 }}
            className="mx-auto mb-5 w-[68px] h-[68px] rounded-full bg-white flex items-center justify-center shadow-lg shadow-black/10"
          >
            <div className="w-[52px] h-[52px] rounded-full bg-[#22C55E] flex items-center justify-center">
              <Check className="w-7 h-7 text-white" strokeWidth={3} />
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="text-[28px] md:text-[34px] text-[#172b4d] dark:text-white mb-1.5 tracking-tight"
          >
            Thank you{applicantName !== 'there' ? `, ${applicantName}` : ''} !
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="text-[#172b4d]/60 dark:text-white/60 text-[15px]"
          >
            Your application has been submitted successfully
          </motion.p>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="relative z-10 max-w-[720px] mx-auto px-4 sm:px-6 -mt-14">
        {/* ── Check Your Phone Card ── */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-[#111827] rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.08),0_8px_24px_rgba(0,0,0,0.06)] border border-[#E5E7EB] dark:border-[#1F2933] p-5 mb-8"
        >
          {/* Header row */}
          <div className="flex items-center gap-3.5 mb-4">
            <div className="w-10 h-10 rounded-lg bg-[#EEF2FF] dark:bg-[#0c66e4]/15 flex items-center justify-center flex-shrink-0">
              <Smartphone className="w-5 h-5 text-[#0c66e4]" />
            </div>
            <div>
              <p className="text-[15px] font-semibold text-[#111827] dark:text-white leading-tight">Check Your Phone!</p>
              <p className="text-[13px] text-[#6B7280] dark:text-[#9CA3AF]">You will receive a text message shortly</p>
            </div>
          </div>

          {/* Phone number box */}
          {phoneNumber && (
            <div className="bg-[#F9FAFB] dark:bg-[#0D1117] rounded-lg px-4 py-3 border border-[#F3F4F6] dark:border-[#1F2933] mb-4">
              <p className="text-[10px] text-[#9CA3AF] uppercase tracking-[0.08em] mb-0.5">We&apos;ll text you at</p>
              <p className="text-[15px] font-semibold text-[#111827] dark:text-white tracking-wide">{phoneNumber}</p>
            </div>
          )}

          {/* Expected time */}
          <div className="flex items-center justify-between pt-3 border-t border-[#F3F4F6] dark:border-[#1F2933]">
            <span className="text-[13px] text-[#6B7280]">Expected response time:</span>
            <span className="text-[13px] font-semibold text-[#111827] dark:text-white">5-15 minutes</span>
          </div>
        </motion.div>

        {/* ── Two-Column: Checklist + Sidebar ── */}
        <div className="flex flex-col md:flex-row gap-5 pb-16">
          {/* Left — You're all set */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex-1 min-w-0 bg-white dark:bg-[#111827] rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.08),0_8px_24px_rgba(0,0,0,0.06)] border border-[#E5E7EB] dark:border-[#1F2933] p-6"
          >
            {/* Business label */}
            {businessName && (
              <p className="text-[10px] text-[#9CA3AF] uppercase tracking-[0.1em] mb-1">{businessName}</p>
            )}
            <h2 className="text-[22px] text-[#111827] dark:text-white mb-5 tracking-tight">You're all set</h2>

            {/* Info bubble */}
            <div className="bg-[#F3F4F6] dark:bg-[#0D1117] rounded-xl p-4 mb-6">
              <div className="flex items-start gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-[#0c66e4] flex-shrink-0 mt-[5px]" />
                <p className="text-[13px] text-[#4B5563] dark:text-[#9CA3AF] leading-[1.6]">
                  Your account selections have been saved — we're still reviewing your application and will get back to you soon.
                </p>
              </div>
            </div>

            {/* Green check list */}
            <div className="space-y-3.5">
              {checklist.map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.05 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-[22px] h-[22px] rounded-full bg-[#22C55E] flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 text-white" strokeWidth={3.5} />
                  </div>
                  <span className="flex-1 text-[14px] text-[#374151] dark:text-[#D1D5DB]">{item.label}</span>
                  {index === checklist.length - 1 && (
                    <span className="text-[11px] font-medium text-[#111827] dark:text-white bg-[#F3F4F6] dark:bg-[#1F2933] px-2 py-0.5 rounded">
                      Received
                    </span>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right — Sidebar */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="w-full md:w-[220px] flex-shrink-0 space-y-5"
          >
            {/* Application timeline */}
            <div className="bg-white dark:bg-[#111827] rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.08),0_8px_24px_rgba(0,0,0,0.06)] border border-[#E5E7EB] dark:border-[#1F2933] p-5">
              <h3 className="text-[14px] font-semibold text-[#111827] dark:text-white mb-4">Application timeline</h3>

              {/* Apply */}
              <div className="flex items-start gap-2.5 mb-0">
                <div className="flex flex-col items-center pt-[5px]">
                  <div className="w-[9px] h-[9px] rounded-full bg-[#111827] dark:bg-white" />
                  <div className="w-px h-[28px] bg-[#E5E7EB] dark:bg-[#374151]" />
                </div>
                <div className="pb-2">
                  <p className="text-[13px] font-semibold text-[#111827] dark:text-white leading-tight">Apply</p>
                  <p className="text-[11px] text-[#9CA3AF]">Received {formattedDate}</p>
                </div>
              </div>

              {/* In review */}
              <div className="flex items-start gap-2.5 mb-0">
                <div className="flex flex-col items-center pt-[5px]">
                  <div className="w-[9px] h-[9px] rounded-full bg-[#0c66e4]" />
                  <div className="w-px h-[28px] bg-[#E5E7EB] dark:bg-[#374151]" />
                </div>
                <div className="pb-2">
                  <p className="text-[13px] font-semibold text-[#0c66e4] leading-tight">In review</p>
                  <p className="text-[11px] text-[#9CA3AF]">Approx. 1 day</p>
                </div>
              </div>

              {/* Offer ready */}
              <div className="flex items-start gap-2.5">
                <div className="flex flex-col items-center pt-[5px]">
                  <div className="w-[9px] h-[9px] rounded-full bg-[#D1D5DB] dark:bg-[#4B5563]" />
                </div>
                <div>
                  <p className="text-[13px] text-[#9CA3AF] leading-tight">Offer ready</p>
                </div>
              </div>
            </div>

            {/* Questions */}
            <div className="bg-white dark:bg-[#111827] rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.08),0_8px_24px_rgba(0,0,0,0.06)] border border-[#E5E7EB] dark:border-[#1F2933] p-5">
              <h3 className="text-[14px] font-semibold text-[#111827] dark:text-white mb-0.5">Questions?</h3>
              <p className="text-[11px] text-[#9CA3AF] mb-2.5">Our support team can help:</p>
              <a
                href="mailto:support@deltcapital.com"
                className="block text-[13px] text-[#0c66e4] hover:underline leading-relaxed"
              >
                support@deltcapital.com
              </a>
              <a
                href="tel:+18647293358"
                className="block text-[13px] text-[#0c66e4] hover:underline leading-relaxed"
              >
                (864) 729-3358
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}