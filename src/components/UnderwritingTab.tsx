import { useState } from 'react';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { CheckCircle2, XCircle } from 'lucide-react';

export function UnderwritingTab() {
  const [formData, setFormData] = useState({
    businessName: '',
    monthlyRevenue: '',
    timeInBusiness: '',
    creditScore: '',
    requestedAmount: '',
    bankBalance: '',
    monthlyDeposits: '',
  });

  const [results, setResults] = useState<{
    approved: boolean;
    reason: string;
    maxAdvance?: number;
    recommendedPayback?: number;
  } | null>(null);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const analyzeUnderwriting = () => {
    const monthlyRevenue = parseFloat(formData.monthlyRevenue) || 0;
    const creditScore = parseFloat(formData.creditScore) || 0;
    const requestedAmount = parseFloat(formData.requestedAmount) || 0;
    const timeInBusiness = parseFloat(formData.timeInBusiness) || 0;
    const bankBalance = parseFloat(formData.bankBalance) || 0;
    const monthlyDeposits = parseFloat(formData.monthlyDeposits) || 0;

    // Underwriting logic
    let approved = true;
    let reason = '';

    if (creditScore < 500) {
      approved = false;
      reason = 'Credit score below minimum threshold (500)';
    } else if (timeInBusiness < 6) {
      approved = false;
      reason = 'Business must be operational for at least 6 months';
    } else if (monthlyRevenue < 10000) {
      approved = false;
      reason = 'Monthly revenue below minimum requirement ($10,000)';
    } else if (requestedAmount > monthlyRevenue * 1.5) {
      approved = false;
      reason = 'Requested amount exceeds 1.5x monthly revenue';
    } else if (bankBalance < requestedAmount * 0.1) {
      approved = false;
      reason = 'Insufficient bank balance (need at least 10% of advance amount)';
    } else {
      reason = 'Business meets all underwriting criteria';
    }

    // Calculate max advance and payback
    const maxAdvance = Math.min(monthlyRevenue * 1.5, monthlyDeposits * 1.2);
    const factorRate = creditScore >= 650 ? 1.2 : creditScore >= 550 ? 1.3 : 1.4;
    const recommendedPayback = requestedAmount * factorRate;

    setResults({
      approved,
      reason,
      maxAdvance: approved ? maxAdvance : undefined,
      recommendedPayback: approved ? recommendedPayback : undefined,
    });
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="grid md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Business Information</CardTitle>
            <CardDescription>Enter merchant details for underwriting analysis</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="businessName">Business Name</Label>
              <Input
                id="businessName"
                value={formData.businessName}
                onChange={(e) => handleInputChange('businessName', e.target.value)}
                placeholder="ABC Corp"
              />
            </div>
            <div>
              <Label htmlFor="monthlyRevenue">Monthly Revenue ($)</Label>
              <Input
                id="monthlyRevenue"
                type="number"
                value={formData.monthlyRevenue}
                onChange={(e) => handleInputChange('monthlyRevenue', e.target.value)}
                placeholder="50000"
              />
            </div>
            <div>
              <Label htmlFor="timeInBusiness">Time in Business (months)</Label>
              <Input
                id="timeInBusiness"
                type="number"
                value={formData.timeInBusiness}
                onChange={(e) => handleInputChange('timeInBusiness', e.target.value)}
                placeholder="12"
              />
            </div>
            <div>
              <Label htmlFor="creditScore">Credit Score</Label>
              <Input
                id="creditScore"
                type="number"
                value={formData.creditScore}
                onChange={(e) => handleInputChange('creditScore', e.target.value)}
                placeholder="650"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Financial Details</CardTitle>
            <CardDescription>Banking and advance information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="requestedAmount">Requested Amount ($)</Label>
              <Input
                id="requestedAmount"
                type="number"
                value={formData.requestedAmount}
                onChange={(e) => handleInputChange('requestedAmount', e.target.value)}
                placeholder="25000"
              />
            </div>
            <div>
              <Label htmlFor="bankBalance">Average Bank Balance ($)</Label>
              <Input
                id="bankBalance"
                type="number"
                value={formData.bankBalance}
                onChange={(e) => handleInputChange('bankBalance', e.target.value)}
                placeholder="15000"
              />
            </div>
            <div>
              <Label htmlFor="monthlyDeposits">Monthly Deposits ($)</Label>
              <Input
                id="monthlyDeposits"
                type="number"
                value={formData.monthlyDeposits}
                onChange={(e) => handleInputChange('monthlyDeposits', e.target.value)}
                placeholder="45000"
              />
            </div>
            <Button onClick={analyzeUnderwriting} className="w-full mt-4">
              Analyze Application
            </Button>
          </CardContent>
        </Card>
      </div>

      {results && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              {results.approved ? (
                <>
                  <CheckCircle2 className="w-6 h-6 text-green-600 mr-2" />
                  Application Approved
                </>
              ) : (
                <>
                  <XCircle className="w-6 h-6 text-red-600 mr-2" />
                  Application Declined
                </>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Reason</p>
                <p className="font-medium">{results.reason}</p>
              </div>
              {results.approved && (
                <>
                  <div className="grid md:grid-cols-2 gap-4 mt-4">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <p className="text-sm text-muted-foreground">Maximum Advance Amount</p>
                      <p className="text-2xl font-bold text-blue-700">
                        ${results.maxAdvance?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </p>
                    </div>
                    <div className="p-4 bg-green-50 rounded-lg">
                      <p className="text-sm text-muted-foreground">Recommended Payback</p>
                      <p className="text-2xl font-bold text-green-700">
                        ${results.recommendedPayback?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
