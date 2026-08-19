'use client';

import { useState, useMemo } from 'react';
import { Calculator, DollarSign, Calendar, Percent } from 'lucide-react';
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

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function ExistingLoanCalculator() {
  const [loanAmount, setLoanAmount]       = useState(12000);
  const [monthlyPayment, setMonthlyPayment] = useState(380);
  const [termMonths, setTermMonths]       = useState(36);
  const [monthsLeft, setMonthsLeft]       = useState(24);
  const [interestRate, setInterestRate]   = useState(8.714);
  const [showReport, setShowReport]       = useState(false);

  const calculations = useMemo(() => {
    const P_original = Number(loanAmount) || 0;
    const pmt   = Number(monthlyPayment) || 0;
    const n     = Number(termMonths) || 0;
    const r     = (Number(interestRate) || 0) / 100 / 12;
    const left  = Number(monthsLeft) || 0;
    const passed = Math.max(0, n - left);

    let currentBalance = P_original;
    const schedule: { month: number; payment: number; principal: number; interest: number; balance: number }[] = [];
    let totalInterestPaid      = 0;
    let totalInterestRemaining = 0;
    let totalPaid              = 0;

    for (let i = 1; i <= n; i++) {
      const interestPayment = currentBalance * r;
      let principalPayment  = pmt - interestPayment;
      let actualPayment     = pmt;

      if (i === n || currentBalance < principalPayment) {
        principalPayment = currentBalance;
        actualPayment    = principalPayment + interestPayment;
      }

      currentBalance -= principalPayment;
      if (currentBalance < 0) currentBalance = 0;

      if (i <= passed) {
        totalInterestPaid += interestPayment;
        totalPaid         += actualPayment;
      } else {
        totalInterestRemaining += interestPayment;
      }

      schedule.push({ month: i, payment: actualPayment, principal: principalPayment, interest: interestPayment, balance: currentBalance });
    }

    const chartData = [{ month: 0, balance: P_original, isPast: true }];
    schedule.forEach(row => chartData.push({ month: row.month, balance: row.balance, isPast: row.month <= passed }));

    const currentOutstandingBalance = passed === 0 ? P_original : (schedule[passed - 1]?.balance ?? 0);

    return { schedule, chartData, currentOutstandingBalance, passed, totalPaid, totalInterestPaid, totalInterestRemaining };
  }, [loanAmount, monthlyPayment, termMonths, monthsLeft, interestRate]);

  const fmt = (val: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { callbacks: { label: (ctx: { raw: unknown }) => fmt(ctx.raw as number) } },
    },
    scales: {
      y: { beginAtZero: true, ticks: { callback: (v: unknown) => fmt(v as number) } },
      x: { title: { display: true, text: 'Balance by month' } },
    },
  };

  const chartDataConfig = {
    labels: calculations.chartData.map(d => d.month),
    datasets: [{
      label: 'Balance',
      data: calculations.chartData.map(d => d.balance),
      backgroundColor: calculations.chartData.map(d => d.isPast ? '#0057b8' : '#f5821f'),
      borderColor: '#002855',
      borderWidth: 1,
    }],
  };

  const inputClass =
    'block w-full pl-10 pr-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-800 focus:border-blue-800 bg-white';

  return (
    <div className="w-full py-8 px-4 sm:px-6 font-sans">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* ── Calculator card ── */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">

          {/* Header */}
          <div className="bg-blue-900 px-6 py-4 flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center">
            <h2 className="text-xl font-bold text-white flex items-center gap-2 font-display">
              <Calculator className="h-6 w-6 shrink-0" aria-hidden="true" />
              Existing Loan Calculator
            </h2>
            <button
              onClick={() => setShowReport(v => !v)}
              className="self-start sm:self-auto bg-white text-blue-800 px-4 py-2 rounded font-semibold text-sm shadow-sm hover:bg-blue-50 transition-colors"
            >
              {showReport ? 'Hide Report' : 'View Report'}
            </button>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">

              {/* ── Inputs ── */}
              <div>
                <h3 className="text-base font-semibold text-blue-950 mb-4 border-b border-gray-200 pb-2 font-display">
                  Existing loan inputs
                </h3>
                <div className="space-y-4">
                  {[
                    { label: 'Loan amount',     icon: <DollarSign className="h-4 w-4 text-gray-400" />, value: loanAmount,     setter: setLoanAmount,     step: undefined },
                    { label: 'Monthly payment', icon: <DollarSign className="h-4 w-4 text-gray-400" />, value: monthlyPayment, setter: setMonthlyPayment, step: undefined },
                    { label: 'Term in months',  icon: <Calendar    className="h-4 w-4 text-gray-400" />, value: termMonths,     setter: setTermMonths,     step: undefined },
                    { label: 'Months left',     icon: <Calendar    className="h-4 w-4 text-gray-400" />, value: monthsLeft,     setter: setMonthsLeft,     step: undefined },
                    { label: 'Interest rate',   icon: <Percent     className="h-4 w-4 text-gray-400" />, value: interestRate,   setter: setInterestRate,   step: '0.001' },
                  ].map(({ label, icon, value, setter, step }) => (
                    <div key={label} className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                      <label className="text-sm font-medium text-gray-700">{label}:</label>
                      <div className="relative w-full sm:w-1/2">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          {icon}
                        </div>
                        <input
                          type="number"
                          value={value}
                          step={step}
                          onChange={e => setter(e.target.value as unknown as number)}
                          className={inputClass}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* ── Summary callout ── */}
              <div className="flex flex-col justify-center">
                <div className="bg-blue-50 rounded-lg p-5 border border-blue-100 shadow-inner">
                  <p className="text-lg font-semibold text-blue-950 text-center mb-3 font-display">
                    Current outstanding balance is{' '}
                    <span className="text-blue-800">{fmt(calculations.currentOutstandingBalance)}</span>
                  </p>
                  <p className="text-sm leading-relaxed text-blue-900 text-center">
                    You have paid a total of{' '}
                    <strong>{fmt(calculations.totalPaid)}</strong> after{' '}
                    {calculations.passed} monthly payments, including{' '}
                    <strong>{fmt(calculations.totalInterestPaid)}</strong> in interest.
                    Continuing regular payments, you will pay an additional{' '}
                    <strong>{fmt(calculations.totalInterestRemaining)}</strong> in interest
                    over the next {monthsLeft} months.
                  </p>
                </div>
              </div>
            </div>

            {/* ── Chart ── */}
            <div className="h-80 w-full bg-white border border-gray-100 rounded-lg p-4 shadow-sm">
              <Bar data={chartDataConfig} options={chartOptions} />
            </div>

            {/* Chart legend */}
            <div className="flex items-center gap-6 mt-3 justify-center text-xs text-gray-500">
              <span className="flex items-center gap-1.5">
                <span className="inline-block w-3 h-3 rounded-sm bg-blue-800" />
                Payments made
              </span>
              <span className="flex items-center gap-1.5">
                <span className="inline-block w-3 h-3 rounded-sm bg-orange-500" />
                Payments remaining
              </span>
            </div>
          </div>
        </div>

        {/* ── Report ── */}
        {showReport && (
          <div className="space-y-6">

            {/* Loan summary table */}
            <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
              <div className="bg-gray-100 px-6 py-3 border-b border-gray-200">
                <h3 className="text-base font-semibold text-blue-950 text-center font-display">Loan summary</h3>
              </div>
              <table className="min-w-full divide-y divide-gray-200">
                <tbody className="divide-y divide-gray-200 text-sm">
                  {[
                    { label: 'Monthly payment', value: fmt(monthlyPayment),       bold: false },
                    { label: 'Loan amount',     value: fmt(loanAmount),           bold: false },
                    { label: 'Interest rate',   value: `${interestRate}%`,        bold: false },
                    { label: 'Term',            value: `${termMonths} months`,    bold: false },
                    { label: 'Payments left',   value: `${monthsLeft} monthly payments`, bold: false },
                    { label: 'Current balance', value: fmt(calculations.currentOutstandingBalance), bold: true },
                    { label: 'Interest paid',   value: fmt(calculations.totalInterestPaid),         bold: true },
                  ].map(({ label, value, bold }, i) => (
                    <tr key={label} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className={`px-6 py-3 text-right w-1/2 ${bold ? 'font-bold text-blue-950' : 'font-medium text-gray-700'}`}>{label}:</td>
                      <td className={`px-6 py-3 ${bold ? 'font-bold text-blue-950' : 'text-gray-700'}`}>{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Payment schedule table */}
            <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
              <div className="bg-gray-100 px-6 py-3 border-b border-gray-200">
                <h3 className="text-base font-semibold text-blue-950 font-display">Payment Schedule</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 text-sm">
                  <thead className="bg-gray-200">
                    <tr>
                      {['#', 'Payment', 'Principal', 'Interest', 'Loan balance'].map((h, i) => (
                        <th key={h} scope="col" className={`px-6 py-3 text-xs font-bold text-gray-700 uppercase tracking-wider ${i === 0 ? 'text-center border-r border-gray-300 w-16' : 'text-right'}`}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr className="bg-gray-50">
                      <td className="px-6 py-3 border-r border-gray-200" />
                      <td className="px-6 py-3" />
                      <td className="px-6 py-3" />
                      <td className="px-6 py-3" />
                      <td className="px-6 py-3 text-right font-bold text-gray-900">{fmt(loanAmount)}</td>
                    </tr>
                    {calculations.schedule.map(row => (
                      <tr key={row.month} className="hover:bg-blue-50 transition-colors">
                        <td className="px-6 py-3 text-center font-medium text-gray-900 border-r border-gray-200">{row.month}</td>
                        <td className="px-6 py-3 text-right text-gray-900">{fmt(row.payment)}</td>
                        <td className="px-6 py-3 text-right text-gray-600">{fmt(row.principal)}</td>
                        <td className="px-6 py-3 text-right text-gray-600">{fmt(row.interest)}</td>
                        <td className="px-6 py-3 text-right text-gray-900">{fmt(row.balance)}</td>
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
