import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { CheckCircle2, ArrowLeft, ArrowRight, Sparkles, X, Building2, DollarSign, Link2, FileCheck, Shield, Lock, Camera, Upload } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { SecureInput } from './SecureInput';
import plaidLogo from 'figma:asset/b19fc5b06208df452c9347434d63d6c2447fa096.png';

interface ApplicationFormProps {
  onClose: () => void;
}

export function ApplicationForm({ onClose }: ApplicationFormProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [plaidConnected, setPlaidConnected] = useState(false);
  const [idPhoto, setIdPhoto] = useState<File | null>(null);
  const [selfiePhoto, setSelfiePhoto] = useState<File | null>(null);

  const [formData, setFormData] = useState({
    // Basic Information
    businessName: '',
    ownerName: '',
    email: '',
    phone: '',
    businessType: '',
    monthlyRevenue: '',
    timeInBusiness: '',
    
    // Funding Request
    requestedAmount: '',
    useOfFunds: '',
    
    // Identity Verification
    ein: '',
  });

  const totalSteps = 4;
  const progress = ((currentStep + 1) / totalSteps) * 100;

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePlaidConnect = () => {
    // Mock Plaid connection - in production this would open Plaid Link
    setTimeout(() => {
      setPlaidConnected(true);
    }, 1000);
  };

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setSubmitted(true);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const formatEIN = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length <= 2) return cleaned;
    return `${cleaned.slice(0, 2)}-${cleaned.slice(2, 9)}`;
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 0: // Basic Information
        return (
          formData.businessName.trim() !== '' &&
          formData.ownerName.trim() !== '' &&
          formData.email.trim() !== '' &&
          formData.email.includes('@') &&
          formData.phone.trim() !== '' &&
          formData.businessType !== '' &&
          formData.monthlyRevenue !== '' &&
          formData.timeInBusiness !== ''
        );
      case 1: // Funding Request
        return (
          formData.requestedAmount !== '' &&
          formData.useOfFunds.trim() !== ''
        );
      case 2: // Connect Accounts & Verify Identity
        return (
          plaidConnected &&
          idPhoto !== null &&
          selfiePhoto !== null
        );
      case 3: // Review & Submit
        return true;
      default:
        return false;
    }
  };

  const steps = [
    { title: 'Basic Information', icon: Building2 },
    { title: 'Funding Request', icon: DollarSign },
    { title: 'Connect & Verify', icon: Link2 },
    { title: 'Review & Submit', icon: FileCheck },
  ];

  if (submitted) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-2xl shadow-2xl p-12 max-w-2xl w-full text-center relative"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>

          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle2 className="w-16 h-16 text-green-600" strokeWidth={2.5} />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-4xl font-bold text-[#172b4d] mb-4"
          >
            Application Submitted! 🎉
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xl text-gray-600 mb-8"
          >
            Thank you, <span className="font-semibold text-[#172b4d]">{formData.ownerName}</span>!<br />
            Your application for <span className="font-semibold text-[#172b4d]">{formData.businessName}</span> is being reviewed.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 mb-8"
          >
            <p className="text-lg font-semibold text-[#172b4d] mb-2">📱 Check Your Phone!</p>
            <p className="text-gray-600">
              We've sent a confirmation text to <span className="font-semibold">{formData.phone}</span> and an email to <span className="font-semibold">{formData.email}</span>
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-[#f4f4f4] rounded-xl p-8 mb-8"
          >
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-2">Application ID</p>
                <p className="font-mono font-bold text-[#172b4d] text-lg">DT-{Date.now().toString().slice(-8)}</p>
              </div>
              <div className="bg-white rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-2">Requested Amount</p>
                <p className="font-bold text-[#172b4d] text-lg">${parseInt(formData.requestedAmount || '0').toLocaleString()}</p>
              </div>
            </div>

            <div className="mt-6 text-left">
              <h3 className="font-bold text-[#172b4d] mb-4">What Happens Next?</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-[#0c66e4] text-white rounded-full flex items-center justify-center mr-3 text-sm font-bold">✓</div>
                  <p className="text-[#44546f]">Decision within 4 hours</p>
                </div>
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-[#0c66e4] text-white rounded-full flex items-center justify-center mr-3 text-sm font-bold">✓</div>
                  <p className="text-[#44546f]">Offer sent to {formData.email}</p>
                </div>
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-[#0c66e4] text-white rounded-full flex items-center justify-center mr-3 text-sm font-bold">✓</div>
                  <p className="text-[#44546f]">Funds in 24-48 hours</p>
                </div>
              </div>
            </div>
          </motion.div>

          <Button
            onClick={onClose}
            className="bg-[#0c66e4] hover:bg-[#0055cc] text-white px-8 py-6"
          >
            Back to Home
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-[#172b4d] to-[#0a2d5a] z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="max-w-5xl w-full my-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-white"
          >
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-[#0c66e4]" />
              Delt Capital Application
            </h1>
            <p className="text-gray-300">Step {currentStep + 1} of {totalSteps}: {steps[currentStep].title}</p>
          </motion.div>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-300 transition-colors"
          >
            <X className="w-8 h-8" />
          </button>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            {steps.map((step, index) => {
              const StepIcon = step.icon;
              const isCompleted = index < currentStep;
              const isCurrent = index === currentStep;
              
              return (
                <div key={index} className="flex items-center flex-1">
                  <div className="flex flex-col items-center flex-1">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all ${
                        isCompleted
                          ? 'bg-green-500'
                          : isCurrent
                          ? 'bg-[#0c66e4]'
                          : 'bg-white/20'
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="w-6 h-6 text-white" />
                      ) : (
                        <StepIcon className="w-6 h-6 text-white" />
                      )}
                    </div>
                    <p className={`text-xs text-center ${isCurrent ? 'text-white font-semibold' : 'text-gray-400'}`}>
                      {step.title}
                    </p>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`h-1 flex-1 mx-2 mb-8 ${isCompleted ? 'bg-green-500' : 'bg-white/20'}`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Content Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl shadow-2xl p-8 md:p-12"
          >
            {/* Step 1: Basic Information */}
            {currentStep === 0 && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <div className="text-5xl mb-4">🏢</div>
                  <h2 className="text-3xl font-bold text-[#172b4d] mb-2">Basic Information</h2>
                  <p className="text-gray-600">Tell us about your business - no social security number needed yet</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label className="text-[#172b4d] font-semibold mb-2">Business Name *</Label>
                    <Input
                      value={formData.businessName}
                      onChange={(e) => handleInputChange('businessName', e.target.value)}
                      placeholder="e.g., ABC Corporation"
                      className="p-4 border-2 border-[#dcdfe4] focus:border-[#0c66e4]"
                    />
                  </div>

                  <div>
                    <Label className="text-[#172b4d] font-semibold mb-2">Owner Name *</Label>
                    <Input
                      value={formData.ownerName}
                      onChange={(e) => handleInputChange('ownerName', e.target.value)}
                      placeholder="e.g., John Smith"
                      className="p-4 border-2 border-[#dcdfe4] focus:border-[#0c66e4]"
                    />
                  </div>

                  <div>
                    <Label className="text-[#172b4d] font-semibold mb-2">Email Address *</Label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="e.g., john@business.com"
                      className="p-4 border-2 border-[#dcdfe4] focus:border-[#0c66e4]"
                    />
                  </div>

                  <div>
                    <Label className="text-[#172b4d] font-semibold mb-2">Phone Number *</Label>
                    <Input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="e.g., (555) 123-4567"
                      className="p-4 border-2 border-[#dcdfe4] focus:border-[#0c66e4]"
                    />
                  </div>

                  <div>
                    <Label className="text-[#172b4d] font-semibold mb-2">Business Type *</Label>
                    <Select onValueChange={(value) => handleInputChange('businessType', value)} value={formData.businessType}>
                      <SelectTrigger className="p-4 border-2 border-[#dcdfe4] focus:border-[#0c66e4]">
                        <SelectValue placeholder="Select your business type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="retail">🛍️ Retail</SelectItem>
                        <SelectItem value="restaurant">🍽️ Restaurant / Food Service</SelectItem>
                        <SelectItem value="ecommerce">🛒 E-commerce</SelectItem>
                        <SelectItem value="services">💼 Professional Services</SelectItem>
                        <SelectItem value="construction">🏗️ Construction</SelectItem>
                        <SelectItem value="healthcare">⚕️ Healthcare</SelectItem>
                        <SelectItem value="automotive">🚗 Automotive</SelectItem>
                        <SelectItem value="other">📦 Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-[#172b4d] font-semibold mb-2">Monthly Revenue *</Label>
                    <Select onValueChange={(value) => handleInputChange('monthlyRevenue', value)} value={formData.monthlyRevenue}>
                      <SelectTrigger className="p-4 border-2 border-[#dcdfe4] focus:border-[#0c66e4]">
                        <SelectValue placeholder="Select revenue range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="10000-25000">$10,000 - $25,000</SelectItem>
                        <SelectItem value="25000-50000">$25,000 - $50,000</SelectItem>
                        <SelectItem value="50000-100000">$50,000 - $100,000</SelectItem>
                        <SelectItem value="100000-250000">$100,000 - $250,000</SelectItem>
                        <SelectItem value="250000+">$250,000+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-[#172b4d] font-semibold mb-2">Time in Business *</Label>
                    <Select onValueChange={(value) => handleInputChange('timeInBusiness', value)} value={formData.timeInBusiness}>
                      <SelectTrigger className="p-4 border-2 border-[#dcdfe4] focus:border-[#0c66e4]">
                        <SelectValue placeholder="Select duration" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="6-12">6-12 months</SelectItem>
                        <SelectItem value="1-2">1-2 years</SelectItem>
                        <SelectItem value="2-5">2-5 years</SelectItem>
                        <SelectItem value="5+">5+ years</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Funding Request */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <div className="text-5xl mb-4">💰</div>
                  <h2 className="text-3xl font-bold text-[#172b4d] mb-2">Funding Request</h2>
                  <p className="text-gray-600">Tell us how much you need and what you'll use it for</p>
                </div>

                <div className="space-y-6 max-w-2xl mx-auto">
                  <div>
                    <Label className="text-[#172b4d] font-semibold mb-2">Requested Funding Amount *</Label>
                    <Select onValueChange={(value) => handleInputChange('requestedAmount', value)} value={formData.requestedAmount}>
                      <SelectTrigger className="p-6 text-xl border-2 border-[#dcdfe4] focus:border-[#0c66e4]">
                        <SelectValue placeholder="Select funding amount" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="10000">$10,000 - $25,000</SelectItem>
                        <SelectItem value="37500">$25,000 - $50,000</SelectItem>
                        <SelectItem value="75000">$50,000 - $100,000</SelectItem>
                        <SelectItem value="150000">$100,000 - $150,000</SelectItem>
                        <SelectItem value="250000">$150,000 - $250,000</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-[#172b4d] font-semibold mb-2">How will you use the funds? *</Label>
                    <Textarea
                      value={formData.useOfFunds}
                      onChange={(e) => handleInputChange('useOfFunds', e.target.value)}
                      placeholder="e.g., Purchase inventory for peak season, hire 2 new employees, launch marketing campaign, expand to new location..."
                      className="text-lg p-6 border-2 border-[#dcdfe4] focus:border-[#0c66e4] min-h-[200px]"
                    />
                    <p className="text-sm text-gray-500 mt-2">Be specific - this helps us tailor your offer</p>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Connect Accounts & Verify Identity */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <div className="text-5xl mb-4">🔐</div>
                  <h2 className="text-3xl font-bold text-[#172b4d] mb-2">Connect & Verify Identity</h2>
                  <p className="text-gray-600">Secure bank connection, ID verification, and SSN last 4 digits</p>
                </div>

                <div className="space-y-6 max-w-2xl mx-auto">
                  {/* Plaid Connection */}
                  <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-8 border-2 border-blue-200">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-16 h-16 bg-white rounded-xl shadow-lg flex items-center justify-center">
                        <img src={plaidLogo} alt="Plaid" className="w-10 h-10" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-[#172b4d] mb-1">Connect Your Bank Account</h3>
                        <p className="text-sm text-gray-600">Secure instant verification via Plaid</p>
                      </div>
                    </div>

                    {!plaidConnected ? (
                      <div className="space-y-4">
                        <div className="bg-white rounded-lg p-4 space-y-2">
                          <div className="flex items-center gap-2 text-sm text-gray-700">
                            <CheckCircle2 className="w-4 h-4 text-green-600" />
                            <span>Bank-level 256-bit encryption</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-700">
                            <CheckCircle2 className="w-4 h-4 text-green-600" />
                            <span>Read-only access - we can't move money</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-700">
                            <CheckCircle2 className="w-4 h-4 text-green-600" />
                            <span>Instant verification - no waiting</span>
                          </div>
                        </div>
                        <button
                          onClick={handlePlaidConnect}
                          className="w-full py-4 bg-[#0c66e4] hover:bg-[#0055cc] text-white font-semibold rounded-lg transition-all flex items-center justify-center gap-2"
                        >
                          <Lock className="w-5 h-5" />
                          Connect with Plaid
                        </button>
                      </div>
                    ) : (
                      <div className="bg-green-50 border-2 border-green-500 rounded-lg p-6">
                        <div className="flex items-center gap-3 text-green-700">
                          <CheckCircle2 className="w-8 h-8" strokeWidth={2.5} />
                          <div>
                            <p className="font-bold text-lg">Bank Account Connected!</p>
                            <p className="text-sm">Your bank account has been securely verified</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* ID Photo Upload */}
                  <div className="bg-gray-50 rounded-xl p-8 border-2 border-gray-200">
                    <div className="flex items-start gap-4 mb-6">
                      <div className="w-12 h-12 bg-[#0c66e4] rounded-lg flex items-center justify-center flex-shrink-0">
                        <Camera className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-[#172b4d] mb-1">Government ID Picture</h3>
                        <p className="text-sm text-gray-600">Upload a photo of your driver's license or passport</p>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      {!idPhoto ? (
                        <label className="block">
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) setIdPhoto(file);
                            }}
                          />
                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-[#0c66e4] hover:bg-blue-50 transition-all cursor-pointer">
                            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                            <p className="text-sm font-semibold text-[#172b4d] mb-1">Click to upload ID photo</p>
                            <p className="text-xs text-gray-500">PNG, JPG up to 10MB</p>
                          </div>
                        </label>
                      ) : (
                        <div className="bg-green-50 border-2 border-green-500 rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 text-green-700">
                              <CheckCircle2 className="w-6 h-6" />
                              <div>
                                <p className="font-semibold">ID Photo Uploaded</p>
                                <p className="text-xs text-gray-600">{idPhoto.name}</p>
                              </div>
                            </div>
                            <button
                              onClick={() => setIdPhoto(null)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <X className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Selfie Upload */}
                  <div className="bg-gray-50 rounded-xl p-8 border-2 border-gray-200">
                    <div className="flex items-start gap-4 mb-6">
                      <div className="w-12 h-12 bg-[#0c66e4] rounded-lg flex items-center justify-center flex-shrink-0">
                        <Camera className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-[#172b4d] mb-1">Selfie Photo</h3>
                        <p className="text-sm text-gray-600">Take a clear photo of yourself for identity verification</p>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      {!selfiePhoto ? (
                        <label className="block">
                          <input
                            type="file"
                            accept="image/*"
                            capture="user"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) setSelfiePhoto(file);
                            }}
                          />
                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-[#0c66e4] hover:bg-blue-50 transition-all cursor-pointer">
                            <Camera className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                            <p className="text-sm font-semibold text-[#172b4d] mb-1">Click to take selfie</p>
                            <p className="text-xs text-gray-500">PNG, JPG up to 10MB</p>
                          </div>
                        </label>
                      ) : (
                        <div className="bg-green-50 border-2 border-green-500 rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 text-green-700">
                              <CheckCircle2 className="w-6 h-6" />
                              <div>
                                <p className="font-semibold">Selfie Uploaded</p>
                                <p className="text-xs text-gray-600">{selfiePhoto.name}</p>
                              </div>
                            </div>
                            <button
                              onClick={() => setSelfiePhoto(null)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <X className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>


                </div>
              </div>
            )}

            {/* Step 4: Review & Submit */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <div className="text-5xl mb-4">✅</div>
                  <h2 className="text-3xl font-bold text-[#172b4d] mb-2">Review & Submit</h2>
                  <p className="text-gray-600">Please review your information before submitting</p>
                </div>

                <div className="space-y-4 max-w-3xl mx-auto">
                  {/* Basic Information */}
                  <div className="bg-gray-50 rounded-xl p-6 border-2 border-gray-200">
                    <h3 className="font-bold text-[#172b4d] mb-4 flex items-center gap-2">
                      <Building2 className="w-5 h-5 text-[#0c66e4]" />
                      Basic Information
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Business Name</p>
                        <p className="font-semibold text-[#172b4d]">{formData.businessName}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Owner Name</p>
                        <p className="font-semibold text-[#172b4d]">{formData.ownerName}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Email</p>
                        <p className="font-semibold text-[#172b4d]">{formData.email}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Phone</p>
                        <p className="font-semibold text-[#172b4d]">{formData.phone}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Business Type</p>
                        <p className="font-semibold text-[#172b4d]">{formData.businessType}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Monthly Revenue</p>
                        <p className="font-semibold text-[#172b4d]">{formData.monthlyRevenue}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Time in Business</p>
                        <p className="font-semibold text-[#172b4d]">{formData.timeInBusiness}</p>
                      </div>
                    </div>
                  </div>

                  {/* Funding Request */}
                  <div className="bg-blue-50 rounded-xl p-6 border-2 border-blue-200">
                    <h3 className="font-bold text-[#172b4d] mb-4 flex items-center gap-2">
                      <DollarSign className="w-5 h-5 text-[#0c66e4]" />
                      Funding Request
                    </h3>
                    <div className="space-y-3 text-sm">
                      <div>
                        <p className="text-gray-600">Requested Amount</p>
                        <p className="font-bold text-2xl text-[#172b4d]">${parseInt(formData.requestedAmount || '0').toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Use of Funds</p>
                        <p className="font-semibold text-[#172b4d]">{formData.useOfFunds}</p>
                      </div>
                    </div>
                  </div>

                  {/* Verification Status */}
                  <div className="bg-green-50 rounded-xl p-6 border-2 border-green-200">
                    <h3 className="font-bold text-[#172b4d] mb-4 flex items-center gap-2">
                      <Shield className="w-5 h-5 text-green-600" />
                      Verification Status
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                        <span className="text-gray-700">Bank Account Connected via Plaid</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                        <span className="text-gray-700">ID Photo Uploaded: {idPhoto?.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                        <span className="text-gray-700">Selfie Photo Uploaded: {selfiePhoto?.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                        <span className="text-gray-700">Identity Verified</span>
                      </div>
                    </div>
                  </div>

                  {/* Agreement */}
                  <div className="bg-gray-50 rounded-xl p-6 border-2 border-gray-200">
                    <div className="flex items-start gap-3">
                      <input type="checkbox" className="mt-1" id="agreement" />
                      <label htmlFor="agreement" className="text-sm text-gray-700">
                        I certify that all information provided is accurate and complete. I authorize Delt Capital to verify this information and check my credit and business history. I understand this does not obligate me to accept any offer.
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex gap-4 mt-8">
              {currentStep > 0 && (
                <Button
                  onClick={handleBack}
                  variant="outline"
                  className="flex-1 py-6 text-lg border-2"
                >
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Back
                </Button>
              )}
              <Button
                onClick={handleNext}
                disabled={!isStepValid()}
                className="flex-1 bg-[#0c66e4] hover:bg-[#0055cc] text-white py-6 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {currentStep === totalSteps - 1 ? 'Submit Application' : 'Continue'}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>

            {/* Validation Message */}
            {!isStepValid() && (
              <p className="text-sm text-gray-500 text-center mt-4">
                {currentStep === 2 && !plaidConnected && 'Please connect your bank account to continue'}
                {currentStep === 2 && plaidConnected && !idPhoto && 'Please upload your ID photo'}
                {currentStep === 2 && plaidConnected && idPhoto && !selfiePhoto && 'Please upload your selfie photo'}
                {currentStep !== 2 && 'Please fill in all required fields to continue'}
              </p>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 text-center"
        >
          <div className="flex items-center justify-center gap-6 text-white text-sm flex-wrap">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-400" />
              <span>Won't impact credit score</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-400" />
              <span>Bank-level encryption</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-400" />
              <span>Decision in 4 hours</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}