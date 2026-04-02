import { useState } from 'react';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Slider } from './ui/slider';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export function CostOfMoneyTab() {
  const [inputs, setInputs] = useState({
    advanceAmount: '25000',
    factorRate: '1.30',
    termMonths: '4',
    originationFee: '500',
  });

  const [calculations, setCalculations] = useState<any>(null);

  const handleInputChange = (field: string, value: string) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  const handleSliderChange = (field: string, value: number[]) => {
    setInputs(prev => ({ ...prev, [field]: value[0].toString() }));
  };

  const calculateCostOfMoney = () => {
    const advanceAmount = parseFloat(inputs.advanceAmount) || 0;
    const factorRate = parseFloat(inputs.factorRate) || 1;
    const termMonths = parseFloat(inputs.termMonths) || 1;
    const originationFee = parseFloat(inputs.originationFee) || 0;

    const totalPayback = advanceAmount * factorRate;
    const totalFees = originationFee;
    const totalCost = totalPayback + totalFees - advanceAmount;
    const costPercentage = (totalCost / advanceAmount) * 100;

    // Calculate APR
    const termYears = termMonths / 12;
    const apr = (totalCost / advanceAmount) / termYears * 100;

    // Daily cost
    const costPerDay = totalCost / (termMonths * 30);
    const dailyRate = (costPerDay / advanceAmount) * 100;

    // Payment breakdown
    const dailyPayment = totalPayback / (termMonths * 30);
    const weeklyPayment = dailyPayment * 5; // Assuming 5 business days
    const monthlyPayment = totalPayback / termMonths;

    // Cost breakdown for chart
    const costBreakdown = [
      { name: 'Principal', value: advanceAmount },
      { name: 'Factor Fee', value: totalPayback - advanceAmount },
      { name: 'Origination', value: originationFee },
    ];

    // Comparison data
    const comparisonData = [
      { type: 'MCA Cost', percentage: costPercentage },
      { type: 'Credit Card (18% APR)', percentage: 18 * termYears },
      { type: 'Business Loan (8% APR)', percentage: 8 * termYears },
      { type: 'SBA Loan (6% APR)', percentage: 6 * termYears },
    ];

    setCalculations({
      totalPayback,
      totalFees,
      totalCost,
      costPercentage,
      apr,
      costPerDay,
      dailyRate,
      dailyPayment,
      weeklyPayment,
      monthlyPayment,
      costBreakdown,
      comparisonData,
    });
  };

  const COLORS = ['#3b82f6', '#ef4444', '#f59e0b'];

  return (
    <div className="max-w-6xl mx-auto">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Cost of Money Calculator</CardTitle>
          <CardDescription>Analyze the true cost of merchant cash advances</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="advanceAmount">Advance Amount ($)</Label>
              <Input
                id="advanceAmount"
                type="number"
                value={inputs.advanceAmount}
                onChange={(e) => handleInputChange('advanceAmount', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="originationFee">Origination Fee ($)</Label>
              <Input
                id="originationFee"
                type="number"
                value={inputs.originationFee}
                onChange={(e) => handleInputChange('originationFee', e.target.value)}
              />
            </div>
            <div>
              <Label>Factor Rate: {inputs.factorRate}</Label>
              <Slider
                value={[parseFloat(inputs.factorRate)]}
                onValueChange={(value) => handleSliderChange('factorRate', value)}
                min={1.05}
                max={1.15}
                step={0.01}
                className="mt-2"
              />
              <p className="text-xs text-muted-foreground mt-1">Preferred range: 1.05 - 1.15 (not all may qualify)</p>
            </div>
            <div>
              <Label>Term (Months): {inputs.termMonths}</Label>
              <Slider
                value={[parseFloat(inputs.termMonths)]}
                onValueChange={(value) => handleSliderChange('termMonths', value)}
                min={3}
                max={18}
                step={1}
                className="mt-2"
              />
              <p className="text-xs text-muted-foreground mt-1">Typical range: 3 - 18 months</p>
            </div>
          </div>
          <Button onClick={calculateCostOfMoney} className="w-full mt-6">
            Calculate Cost
          </Button>
        </CardContent>
      </Card>

      {calculations && (
        <>
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Total Cost</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-red-600">
                  ${calculations.totalCost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {calculations.costPercentage.toFixed(2)}% of advance
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">APR</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-orange-600">
                  {calculations.apr.toFixed(2)}%
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Annual percentage rate
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Daily Cost</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-purple-600">
                  ${calculations.costPerDay.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {calculations.dailyRate.toFixed(3)}% per day
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Total Payback</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-blue-600">
                  ${calculations.totalPayback.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Including all fees
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Payment Schedule</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-muted-foreground">Daily Payment</p>
                  <p className="text-xl font-bold text-blue-700">
                    ${calculations.dailyPayment.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <p className="text-sm text-muted-foreground">Weekly Payment</p>
                  <p className="text-xl font-bold text-green-700">
                    ${calculations.weeklyPayment.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">Based on 5 business days</p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <p className="text-sm text-muted-foreground">Monthly Payment</p>
                  <p className="text-xl font-bold text-purple-700">
                    ${calculations.monthlyPayment.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Cost Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={calculations.costBreakdown}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {calculations.costBreakdown.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `$${Number(value).toLocaleString()}`} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Cost Comparison</CardTitle>
              <CardDescription>Compare MCA cost to traditional financing options</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={calculations.comparisonData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" label={{ value: 'Cost (%)', position: 'insideBottom', offset: -5 }} />
                  <YAxis dataKey="type" type="category" width={150} />
                  <Tooltip formatter={(value) => `${Number(value).toFixed(2)}%`} />
                  <Bar dataKey="percentage" fill="#3b82f6" name="Total Cost %" />
                </BarChart>
              </ResponsiveContainer>
              <p className="text-sm text-muted-foreground mt-4 text-center">
                Note: Traditional loans shown for comparison over the same term period
              </p>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
