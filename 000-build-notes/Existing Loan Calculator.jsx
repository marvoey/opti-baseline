import React, { useState, useMemo } from 'react';
import { Calculator, FileText, DollarSign, Calendar, Percent } from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function ExistingLoanCalculator() {
  const [loanAmount, setLoanAmount] = useState(12000);
  const [monthlyPayment, setMonthlyPayment] = useState(380);
  const [termMonths, setTermMonths] = useState(36);
  const [monthsLeft, setMonthsLeft] = useState(24);
  const [interestRate, setInterestRate] = useState(8.714);
  const [showReport, setShowReport] = useState(false);

  const calculations = useMemo(() => {
    const P_original = Number(loanAmount) || 0;
    const pmt = Number(monthlyPayment) || 0;
    const n = Number(termMonths) || 0;
    const r = (Number(interestRate) || 0) / 100 / 12;
    const left = Number(monthsLeft) || 0;
    const passed = Math.max(0, n - left);

    let currentBalance = P_original;
    const schedule = [];
    let totalInterestPaid = 0;
    let totalInterestRemaining = 0;
    let totalPaid = 0;

    for (let i = 1; i <= n; i++) {
      const interestPayment = currentBalance * r;
      let principalPayment = pmt - interestPayment;

      // Adjust last payment to not overpay
      let actualPayment = pmt;
      if (i === n || currentBalance < principalPayment) {
        principalPayment = currentBalance;
        actualPayment = principalPayment + interestPayment;
      }

      currentBalance -= principalPayment;
      if (currentBalance < 0) currentBalance = 0;

      if (i <= passed) {
        totalInterestPaid += interestPayment;
        totalPaid += actualPayment;
      } else {
        totalInterestRemaining += interestPayment;
      }

      schedule.push({
        month: i,
        payment: actualPayment,
        principal: principalPayment,
        interest: interestPayment,
        balance: currentBalance,
      });
    }

    // Chart Data mapping
    const chartData = [{ month: 0, balance: P_original, isPast: true }];
    schedule.forEach(row => {
      chartData.push({
        month: row.month,
        balance: row.balance,
        isPast: row.month <= passed
      });
    });

    const currentOutstandingBalance = passed === 0 ? P_original : (schedule[passed - 1]?.balance || 0);

    return {
      schedule,
      chartData,
      currentOutstandingBalance,
      passed,
      totalPaid,
      totalInterestPaid,
      totalInterestRemaining
    };
  }, [loanAmount, monthlyPayment, termMonths, monthsLeft, interestRate]);

  const formatCurrency = (val) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context) => formatCurrency(context.raw)
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { callback: (value) => formatCurrency(value) }
      },
      x: {
        title: { display: true, text: 'Balance by month' }
      }
    }
  };

  const chartDataConfig = {
    labels: calculations.chartData.map(d => d.month),
    datasets: [
      {
        label: 'Balance',
        data: calculations.chartData.map(d => d.balance),
        backgroundColor: calculations.chartData.map(d =>
          d.isPast ? '#3b82f6' : '#65a30d'
        ),
        borderColor: '#1e3a8a',
        borderWidth: 1,
      }
    ]
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Main Calculator Box */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
          <div className="bg-blue-600 px-6 py-4 flex justify-between items-center">
            <h1 className="text-xl font-bold text-white flex items-center">
              <Calculator className="mr-2 h-6 w-6" />
              Existing Loan Calculator
            </h1>
            <div className="space-x-4">
              <button
                onClick={() => setShowReport(!showReport)}
                className="bg-white text-blue-600 px-4 py-2 rounded-md font-semibold shadow-sm hover:bg-gray-50 transition-colors"
              >
                {showReport ? 'Hide Report' : 'View Report'}
              </button>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Inputs */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Existing loan inputs:</h3>
                <div className="space-y-4">
                  
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700">Loan amount:</label>
                    <div className="relative rounded-md shadow-sm w-1/2">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <DollarSign className="h-4 w-4 text-gray-400" />
                      </div>
                      <input
                        type="number"
                        value={loanAmount}
                        onChange={(e) => setLoanAmount(e.target.value)}
                        className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2 border"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700">Monthly payment:</label>
                    <div className="relative rounded-md shadow-sm w-1/2">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <DollarSign className="h-4 w-4 text-gray-400" />
                      </div>
                      <input
                        type="number"
                        value={monthlyPayment}
                        onChange={(e) => setMonthlyPayment(e.target.value)}
                        className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2 border"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700">Term in months:</label>
                    <div className="relative rounded-md shadow-sm w-1/2">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Calendar className="h-4 w-4 text-gray-400" />
                      </div>
                      <input
                        type="number"
                        value={termMonths}
                        onChange={(e) => setTermMonths(e.target.value)}
                        className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2 border"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700">Months left:</label>
                    <div className="relative rounded-md shadow-sm w-1/2">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Calendar className="h-4 w-4 text-gray-400" />
                      </div>
                      <input
                        type="number"
                        value={monthsLeft}
                        onChange={(e) => setMonthsLeft(e.target.value)}
                        className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2 border"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700">Interest rate:</label>
                    <div className="relative rounded-md shadow-sm w-1/2">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Percent className="h-4 w-4 text-gray-400" />
                      </div>
                      <input
                        type="number"
                        step="0.001"
                        value={interestRate}
                        onChange={(e) => setInterestRate(e.target.value)}
                        className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2 border"
                      />
                    </div>
                  </div>

                </div>
              </div>

              {/* Summary Text */}
              <div className="flex flex-col justify-center">
                <div className="bg-blue-50 rounded-lg p-5 border border-blue-100 text-blue-900 shadow-inner">
                  <h3 className="text-lg font-semibold text-center mb-3">
                    Current outstanding balance is {formatCurrency(calculations.currentOutstandingBalance)}.
                  </h3>
                  <p className="text-sm leading-relaxed text-center">
                    You have paid a total of <strong>{formatCurrency(calculations.totalPaid)}</strong> after {calculations.passed} monthly payments. 
                    This includes <strong>{formatCurrency(calculations.totalInterestPaid)}</strong> in interest. 
                    If you continue to make your regular monthly payments you will pay an additional <strong>{formatCurrency(calculations.totalInterestRemaining)}</strong> in interest over the next {monthsLeft} months.
                  </p>
                </div>
              </div>
            </div>

            {/* Chart */}
            <div className="h-80 w-full mt-4 bg-white border border-gray-100 rounded-lg p-4 shadow-sm">
              <Bar data={chartDataConfig} options={chartOptions} />
            </div>
          </div>
        </div>

        {/* Report Section */}
        {showReport && (
          <div className="space-y-6">
            {/* Loan Summary Table */}
            <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
              <div className="bg-gray-100 px-6 py-3 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 text-center">Loan summary</h3>
              </div>
              <div className="p-0">
                <table className="min-w-full divide-y divide-gray-200">
                  <tbody className="divide-y divide-gray-200">
                    <tr className="bg-white"><td className="px-6 py-3 text-sm font-medium text-gray-900 text-right w-1/2">Monthly payment:</td><td className="px-6 py-3 text-sm text-gray-700">{formatCurrency(monthlyPayment)}</td></tr>
                    <tr className="bg-gray-50"><td className="px-6 py-3 text-sm font-medium text-gray-900 text-right">Loan amount:</td><td className="px-6 py-3 text-sm text-gray-700">{formatCurrency(loanAmount)}</td></tr>
                    <tr className="bg-white"><td className="px-6 py-3 text-sm font-medium text-gray-900 text-right">Interest rate:</td><td className="px-6 py-3 text-sm text-gray-700">{interestRate}%</td></tr>
                    <tr className="bg-gray-50"><td className="px-6 py-3 text-sm font-medium text-gray-900 text-right">Term:</td><td className="px-6 py-3 text-sm text-gray-700">{termMonths} months</td></tr>
                    <tr className="bg-white"><td className="px-6 py-3 text-sm font-medium text-gray-900 text-right">Payments left:</td><td className="px-6 py-3 text-sm text-gray-700">{monthsLeft} monthly payments</td></tr>
                    <tr className="bg-gray-200"><td className="px-6 py-3 text-sm font-bold text-gray-900 text-right">Current balance:</td><td className="px-6 py-3 text-sm font-bold text-gray-900">{formatCurrency(calculations.currentOutstandingBalance)}</td></tr>
                    <tr className="bg-gray-200 border-t border-gray-300"><td className="px-6 py-3 text-sm font-bold text-gray-900 text-right">Interest paid:</td><td className="px-6 py-3 text-sm font-bold text-gray-900">{formatCurrency(calculations.totalInterestPaid)}</td></tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Payment Schedule Table */}
            <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
              <div className="bg-gray-100 px-6 py-3 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800">Payment Schedule</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-200">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-center text-xs font-bold text-gray-700 uppercase tracking-wider border-r border-gray-300 w-16">#</th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">Payment</th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">Principal</th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">Interest</th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">Loan balance</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr className="bg-gray-50">
                      <td className="px-6 py-3 text-center text-sm font-medium text-gray-900 border-r border-gray-200"></td>
                      <td className="px-6 py-3 text-right text-sm text-gray-500"></td>
                      <td className="px-6 py-3 text-right text-sm text-gray-500"></td>
                      <td className="px-6 py-3 text-right text-sm text-gray-500"></td>
                      <td className="px-6 py-3 text-right text-sm font-bold text-gray-900">{formatCurrency(loanAmount)}</td>
                    </tr>
                    {calculations.schedule.map((row) => (
                      <tr key={row.month} className="hover:bg-blue-50">
                        <td className="px-6 py-3 text-center text-sm font-medium text-gray-900 border-r border-gray-200">{row.month}:</td>
                        <td className="px-6 py-3 text-right text-sm text-gray-900">{formatCurrency(row.payment)}</td>
                        <td className="px-6 py-3 text-right text-sm text-gray-600">{formatCurrency(row.principal)}</td>
                        <td className="px-6 py-3 text-right text-sm text-gray-600">{formatCurrency(row.interest)}</td>
                        <td className="px-6 py-3 text-right text-sm text-gray-900">{formatCurrency(row.balance)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}