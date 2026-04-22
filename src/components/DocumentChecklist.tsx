import { useState } from 'react';
import { CheckCircle2, Circle, FileText, Download, AlertCircle } from 'lucide-react';

export function DocumentChecklist() {
  const [checkedItems, setCheckedItems] = useState<{ [key: string]: boolean }>({});

  const toggleCheck = (id: string) => {
    setCheckedItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const requiredDocs = [
    {
      id: 'bank-statements',
      category: 'Banking',
      name: 'Business Bank Statements',
      description: 'Last 6 months of complete statements showing all transactions',
      tips: [
        'Must be from your primary business account',
        'Should show consistent deposits',
        'PDF format from bank is preferred',
        'Redact personal accounts if shown',
      ],
      icon: '🏦',
    },
    {
      id: 'cc-processing',
      category: 'Sales Records',
      name: 'Credit Card Processing Statements',
      description: 'Last 3 months from your payment processor (Stripe, Square, etc.)',
      tips: [
        'Include all processing accounts',
        'Show daily sales volume',
        'Include processor name and account number',
        'Recent statements are critical',
      ],
      icon: '💳',
    },
    {
      id: 'ein',
      category: 'Tax & Legal',
      name: 'EIN Letter (IRS CP 575)',
      description: 'Your official IRS Employer Identification Number document',
      tips: [
        'Also called "CP 575 Notice"',
        'Available from IRS.gov if lost',
        'Must match business name',
        'Can use incorporation documents as backup',
      ],
      icon: '📋',
    },
    {
      id: 'personal-id',
      category: 'Identification',
      name: 'Government-Issued ID',
      description: 'Driver\'s license, passport, or state ID for all owners (25%+ ownership)',
      tips: [
        'Must be current (not expired)',
        'Clear, readable photo/scan',
        'Both front and back',
        'All owners over 25% must provide',
      ],
      icon: '🪪',
    },
  ];

  const optionalDocs = [
    {
      id: 'voided-check',
      name: 'Voided Business Check',
      description: 'For ACH setup and verification',
      icon: '✅',
    },
    {
      id: 'lease',
      name: 'Business Lease/Property Deed',
      description: 'Proves business location (if applicable)',
      icon: '🏢',
    },
    {
      id: 'licenses',
      name: 'Business Licenses/Permits',
      description: 'Industry-specific certifications',
      icon: '📜',
    },
    {
      id: 'articles',
      name: 'Articles of Incorporation/Organization',
      description: 'Legal formation documents',
      icon: '📄',
    },
  ];

  const completedCount = Object.values(checkedItems).filter(Boolean).length;
  const totalRequired = requiredDocs.length;
  const progress = (completedCount / totalRequired) * 100;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
      <div className="mb-8">
        <h3 className="text-2xl font-bold text-[#172b4d] mb-2">Document Preparation Checklist</h3>
        <p className="text-gray-600">Get organized and speed up your application process</p>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <p className="text-sm font-semibold text-[#172b4d]">Required Documents Progress</p>
          <p className="text-sm font-bold text-[#0c66e4]">{completedCount} of {totalRequired}</p>
        </div>
        <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-[#0c66e4] to-[#0055cc] transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        {progress === 100 && (
          <p className="text-sm text-green-600 font-semibold mt-2 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            All required documents checked! You're ready to apply.
          </p>
        )}
      </div>

      {/* Required Documents */}
      <div className="mb-8">
        <h4 className="text-xl font-bold text-[#172b4d] mb-4 flex items-center gap-2">
          <FileText className="w-6 h-6 text-[#0c66e4]" />
          Required Documents
        </h4>
        <div className="space-y-4">
          {requiredDocs.map((doc) => (
            <div 
              key={doc.id}
              className={`border-2 rounded-xl p-6 transition-all ${
                checkedItems[doc.id] 
                  ? 'border-green-500 bg-green-50' 
                  : 'border-gray-200 bg-white hover:border-[#0c66e4]'
              }`}
            >
              <div className="flex items-start gap-4">
                <button
                  onClick={() => toggleCheck(doc.id)}
                  className="flex-shrink-0 mt-1"
                >
                  {checkedItems[doc.id] ? (
                    <CheckCircle2 className="w-8 h-8 text-green-600" strokeWidth={2.5} />
                  ) : (
                    <Circle className="w-8 h-8 text-gray-400 hover:text-[#0c66e4]" strokeWidth={2} />
                  )}
                </button>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-3xl">{doc.icon}</span>
                    <div>
                      <h5 className="text-lg font-bold text-[#172b4d]">{doc.name}</h5>
                      <p className="text-sm text-gray-600">{doc.category}</p>
                    </div>
                  </div>
                  <p className="text-gray-700 mb-3">{doc.description}</p>
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <p className="text-sm font-semibold text-[#172b4d] mb-2">Tips:</p>
                    <ul className="space-y-1">
                      {doc.tips.map((tip, index) => (
                        <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                          <span className="text-[#0c66e4] font-bold">•</span>
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Optional Documents */}
      <div className="mb-8">
        <h4 className="text-xl font-bold text-[#172b4d] mb-4">Optional (But Helpful) Documents</h4>
        <div className="grid md:grid-cols-2 gap-4">
          {optionalDocs.map((doc) => (
            <div 
              key={doc.id}
              className="border border-gray-200 rounded-lg p-5 bg-gray-50 hover:border-[#0c66e4] transition-colors"
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl">{doc.icon}</span>
                <div>
                  <h5 className="font-bold text-[#172b4d] mb-1">{doc.name}</h5>
                  <p className="text-sm text-gray-600">{doc.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Common Issues */}
      <div className="bg-orange-50 border-l-4 border-orange-500 rounded-lg p-6 mb-8">
        <div className="flex items-start gap-4">
          <AlertCircle className="w-6 h-6 text-orange-600 flex-shrink-0 mt-1" />
          <div>
            <h4 className="font-bold text-[#172b4d] mb-3">Common Document Issues to Avoid</h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-orange-600 font-bold">✗</span>
                <span><strong>Incomplete statements:</strong> Missing pages or partial months delay approval</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-600 font-bold">✗</span>
                <span><strong>Poor quality scans:</strong> Blurry or unreadable documents can't be processed</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-600 font-bold">✗</span>
                <span><strong>Outdated documents:</strong> Statements over 30 days old may need updating</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-600 font-bold">✗</span>
                <span><strong>Personal vs. business:</strong> Personal accounts don't qualify, must be business accounts</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-600 font-bold">✗</span>
                <span><strong>Multiple formats:</strong> Mix of screenshots, PDFs, and photos - keep format consistent</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Document Upload Tips */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="text-center p-6 bg-blue-50 rounded-xl">
          <div className="w-12 h-12 bg-[#0c66e4] rounded-full flex items-center justify-center mx-auto mb-3">
            <Download className="w-6 h-6 text-white" />
          </div>
          <h5 className="font-bold text-[#172b4d] mb-2">Download from Bank</h5>
          <p className="text-sm text-gray-600">PDF downloads from your bank portal are best</p>
        </div>
        <div className="text-center p-6 bg-purple-50 rounded-xl">
          <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
            <span className="text-white text-xl">📱</span>
          </div>
          <h5 className="font-bold text-[#172b4d] mb-2">Use Good Lighting</h5>
          <p className="text-sm text-gray-600">If scanning, ensure good lighting and focus</p>
        </div>
        <div className="text-center p-6 bg-green-50 rounded-xl">
          <div className="w-12 h-12 bg-[#0c66e4] rounded-full flex items-center justify-center mx-auto mb-3">
            <span className="text-white text-xl">✓</span>
          </div>
          <h5 className="font-bold text-[#172b4d] mb-2">Double Check</h5>
          <p className="text-sm text-gray-600">Review for completeness before uploading</p>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-gradient-to-r from-[#172b4d] to-[#0a2d5a] rounded-xl p-8 text-white text-center">
        <h4 className="text-2xl font-bold mb-3">Documents Ready?</h4>
        <p className="text-lg mb-6 opacity-90">
          Start your application now and have your documents ready to upload
        </p>
        <button className="bg-[#0c66e4] hover:bg-[#0055cc] text-white px-8 py-4 rounded-xl font-semibold transition-colors">
          Start Application
        </button>
        <p className="text-sm mt-4 opacity-75">Takes 10-15 minutes • Decision in hours, not days</p>
      </div>
    </div>
  );
}