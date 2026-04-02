import { useState } from 'react';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export function ProfitabilityTab() {
  const [inputs, setInputs] = useState({
    advanceAmount: '50000',
    factorRate: '1.25',
    termMonths: '6',
    acquisitionCost: '2500',
    defaultRate: '5',
    operatingCostPerDeal: '500',
  });

  const [projections, setProjections] = useState<any[]>([]);
  const [summary, setSummary] = useState<any>(null);

  const handleInputChange = (field: string, value: string) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  const calculateProjections = () => {
    const advanceAmount = parseFloat(inputs.advanceAmount) || 0;
    const factorRate = parseFloat(inputs.factorRate) || 1;
    const termMonths = parseFloat(inputs.termMonths) || 1;
    const acquisitionCost = parseFloat(inputs.acquisitionCost) || 0;
    const defaultRate = parseFloat(inputs.defaultRate) / 100 || 0;
    const operatingCost = parseFloat(inputs.operatingCostPerDeal) || 0;

    const totalPayback = advanceAmount * factorRate;
    const monthlyPayment = totalPayback / termMonths;
    const grossProfit = totalPayback - advanceAmount;
    const totalCosts = acquisitionCost + operatingCost;
    const expectedDefault = totalPayback * defaultRate;
    const netProfit = grossProfit - totalCosts - expectedDefault;
    const roi = (netProfit / (advanceAmount + totalCosts)) * 100;

    // Monthly breakdown
    const monthlyData = [];
    let cumulativeRevenue = 0;
    let cumulativeCost = advanceAmount + totalCosts;

    for (let month = 1; month <= termMonths; month++) {
      cumulativeRevenue += monthlyPayment;
      const monthlyProfit = cumulativeRevenue - cumulativeCost;
      
      monthlyData.push({
        month: `Month ${month}`,
        revenue: Math.round(cumulativeRevenue),
        costs: Math.round(cumulativeCost),
        profit: Math.round(monthlyProfit),
      });
    }

    setProjections(monthlyData);
    setSummary({
      totalPayback,
      grossProfit,
      totalCosts,
      expectedDefault,
      netProfit,
      roi,
    });
  };

  return (
    <div className="max-w-6xl mx-auto">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Profitability Calculator</CardTitle>
          <CardDescription>Project revenue, costs, and net profit for MCA deals</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
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
              <Label htmlFor="factorRate">Factor Rate</Label>
              <Input
                id="factorRate"
                type="number"
                step="0.01"
                value={inputs.factorRate}
                onChange={(e) => handleInputChange('factorRate', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="termMonths">Term (Months)</Label>
              <Input
                id="termMonths"
                type="number"
                value={inputs.termMonths}
                onChange={(e) => handleInputChange('termMonths', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="acquisitionCost">Acquisition Cost ($)</Label>
              <Input
                id="acquisitionCost"
                type="number"
                value={inputs.acquisitionCost}
                onChange={(e) => handleInputChange('acquisitionCost', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="defaultRate">Expected Default Rate (%)</Label>
              <Input
                id="defaultRate"
                type="number"
                step="0.1"
                value={inputs.defaultRate}
                onChange={(e) => handleInputChange('defaultRate', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="operatingCostPerDeal">Operating Cost/Deal ($)</Label>
              <Input
                id="operatingCostPerDeal"
                type="number"
                value={inputs.operatingCostPerDeal}
                onChange={(e) => handleInputChange('operatingCostPerDeal', e.target.value)}
              />
            </div>
          </div>
          <Button onClick={calculateProjections} className="w-full mt-6">
            Calculate Profitability
          </Button>
        </CardContent>
      </Card>

      {summary && (
        <>
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Gross Profit</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-blue-600">
                  ${summary.grossProfit.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Payback: ${summary.totalPayback.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Net Profit</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-green-600">
                  ${summary.netProfit.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  After costs & defaults
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">ROI</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-purple-600">
                  {summary.roi.toFixed(2)}%
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Return on investment
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Cost Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 bg-orange-50 rounded-lg">
                  <p className="text-sm text-muted-foreground">Total Costs</p>
                  <p className="text-xl font-bold text-orange-700">
                    ${summary.totalCosts.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                </div>
                <div className="p-4 bg-red-50 rounded-lg">
                  <p className="text-sm text-muted-foreground">Expected Defaults</p>
                  <p className="text-xl font-bold text-red-700">
                    ${summary.expectedDefault.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                </div>
                <div className="p-4 bg-slate-50 rounded-lg">
                  <p className="text-sm text-muted-foreground">Total Expenses</p>
                  <p className="text-xl font-bold text-slate-700">
                    ${(summary.totalCosts + summary.expectedDefault).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {projections.length > 0 && (
            <>
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>Revenue vs Costs Over Time</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={projections}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value) => `$${Number(value).toLocaleString()}`} />
                      <Legend />
                      <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} name="Cumulative Revenue" />
                      <Line type="monotone" dataKey="costs" stroke="#ef4444" strokeWidth={2} name="Total Costs" />
                      <Line type="monotone" dataKey="profit" stroke="#10b981" strokeWidth={2} name="Net Profit" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Monthly Profit Progression</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={projections}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value) => `$${Number(value).toLocaleString()}`} />
                      <Legend />
                      <Bar dataKey="profit" fill="#10b981" name="Net Profit" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </>
          )}
        </>
      )}
    </div>
  );
}
