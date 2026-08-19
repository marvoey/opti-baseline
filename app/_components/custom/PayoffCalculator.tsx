'use client';

import { useState, useMemo } from 'react';
import { Calculator, ChevronUp, ChevronDown, DollarSign, Percent } from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, PointElement, LineElement,
  Title, Tooltip, Legend, Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

// ── helpers ────────────────────────────────────────────────────────────────

const MAX_MONTHS = 360;

const fmt = (v: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(v);

function calcRequiredPayment(
  balance: number,
  monthlyRate: number,
  goalMonths: number,
  monthlyCharges: number,
) {
  if (goalMonths <= 0 || balance <= 0) return 0;
  const pmt =
    monthlyRate === 0
      ? balance / goalMonths
      : (balance * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -goalMonths));
  return pmt + monthlyCharges;
}

interface DrawInput { amount: number; month: number }

function buildSchedule(
  startBalance: number,
  apr: number,
  rateChangePerYear: number,
  payment: number,
  monthlyCharges: number,
  draws: DrawInput[],
) {
  let bal = startBalance;
  let annualRate = apr / 100;
  const rows: { month: number; payment: number; interest: number; charges: number; balance: number }[] = [];
  const balances: number[] = [bal]; // index 0 = month 0

  for (let m = 1; m <= MAX_MONTHS; m++) {
    if (m > 1 && (m - 1) % 12 === 0) {
      annualRate = Math.max(0, annualRate + rateChangePerYear / 100);
    }
    const monthlyRate = annualRate / 12;

    const draw = draws.find(d => d.month === m);
    if (draw && draw.amount > 0) bal += draw.amount;

    const interest = bal * monthlyRate;
    bal = bal + interest + monthlyCharges - payment;

    if (bal <= 0) {
      const lastPayment = payment + bal; // actual final payment (less than full pmt)
      rows.push({ month: m, payment: lastPayment > 0 ? lastPayment : 0, interest, charges: monthlyCharges, balance: 0 });
      balances.push(0);
      break;
    }

    rows.push({ month: m, payment, interest, charges: monthlyCharges, balance: bal });
    balances.push(bal);
  }

  return { rows, balances, paidOffMonth: balances[balances.length - 1] === 0 ? rows[rows.length - 1].month : -1 };
}

// ── sub-components ─────────────────────────────────────────────────────────

function SectionHeader({
  title,
  right,
  open,
  onToggle,
}: {
  title: string;
  right?: React.ReactNode;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="w-full flex items-center justify-between px-6 py-3 border-b border-gray-200 hover:bg-gray-50 transition-colors"
    >
      <span className="text-blue-800 font-semibold text-sm font-display">{title}</span>
      <span className="flex items-center gap-3 text-sm text-gray-600">
        {right}
        {open ? <ChevronUp className="h-4 w-4 text-gray-400" /> : <ChevronDown className="h-4 w-4 text-gray-400" />}
      </span>
    </button>
  );
}

function SliderRow({
  label,
  value,
  min, max, step,
  prefix, suffix,
  tickLabels,
  onChange,
}: {
  label: string;
  value: number;
  min: number; max: number; step: number;
  prefix?: string; suffix?: string;
  tickLabels: string[];
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex flex-col gap-2 sm:grid sm:grid-cols-[200px_1fr] sm:gap-4 sm:items-center">
      <div className="flex items-center justify-between gap-2 sm:justify-start">
        <label className="text-sm text-gray-700 sm:text-right sm:flex-1">{label}:*</label>
        <div className="relative w-28">
          {prefix && (
            <span className="absolute inset-y-0 left-0 pl-2 flex items-center text-gray-400 text-sm pointer-events-none">
              {prefix}
            </span>
          )}
          <input
            type="number"
            value={value}
            step={step}
            onChange={e => onChange(Number(e.target.value))}
            className={`w-full border border-gray-300 rounded py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-800 focus:border-blue-800 bg-white ${prefix ? 'pl-5' : 'pl-2'} pr-2`}
          />
          {suffix && (
            <span className="absolute inset-y-0 right-0 pr-2 flex items-center text-gray-400 text-sm pointer-events-none">
              {suffix}
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-0.5">
        <input
          type="range"
          min={min} max={max} step={step}
          value={value}
          onChange={e => onChange(Number(e.target.value))}
          className="w-full accent-blue-800 cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-gray-400 px-0.5">
          {tickLabels.map(t => <span key={t}>{t}</span>)}
        </div>
      </div>
    </div>
  );
}

// ── main component ─────────────────────────────────────────────────────────

export default function PayoffCalculator() {
  const [balance, setBalance]         = useState(2000);
  const [apr, setApr]                 = useState(13.24);
  const [rateChange, setRateChange]   = useState(0);
  const [goalMonths, setGoalMonths]   = useState(24);
  const [currentPmt, setCurrentPmt]   = useState(125);
  const [addCharges, setAddCharges]   = useState(100);
  const [annualFee, setAnnualFee]     = useState(35);
  const [draws, setDraws] = useState<DrawInput[]>([
    { amount: 0, month: 0 },
    { amount: 0, month: 0 },
    { amount: 0, month: 0 },
  ]);

  const [showReport,      setShowReport]      = useState(false);
  const [openInputs,      setOpenInputs]      = useState(true);
  const [openDraws,       setOpenDraws]       = useState(false);
  const [openChart,       setOpenChart]       = useState(true);
  const [openScenarios,   setOpenScenarios]   = useState(false);

  const { requiredPmt, currentSchedule, newSchedule, monthlyCharges } = useMemo(() => {
    const monthlyCharges = addCharges + annualFee / 12;
    const monthlyRate    = apr / 100 / 12;
    const activeDraw     = draws.filter(d => d.amount > 0 && d.month > 0);

    const requiredPmt   = calcRequiredPayment(balance, monthlyRate, goalMonths, monthlyCharges);
    const currentSchedule = buildSchedule(balance, apr, rateChange, currentPmt, monthlyCharges, activeDraw);
    const newSchedule     = buildSchedule(balance, apr, rateChange, requiredPmt, monthlyCharges, activeDraw);

    return { requiredPmt, currentSchedule, newSchedule, monthlyCharges };
  }, [balance, apr, rateChange, goalMonths, currentPmt, addCharges, annualFee, draws]);

  const paidOffLabel =
    currentSchedule.paidOffMonth > 0
      ? `${currentSchedule.paidOffMonth} months`
      : 'more than 360 months';

  // ── chart ─────────────────────────────────────────────────────────────────

  const chartMonths = Math.max(currentSchedule.balances.length, newSchedule.balances.length);
  const labels      = Array.from({ length: chartMonths }, (_, i) => i);

  const padTo = (arr: number[], len: number) => [
    ...arr,
    ...Array(Math.max(0, len - arr.length)).fill(0),
  ];

  const chartData = {
    labels,
    datasets: [
      {
        label: `Current payment ${fmt(currentPmt)}`,
        data: padTo(currentSchedule.balances, chartMonths),
        borderColor: '#0057b8',
        backgroundColor: 'rgba(0,87,184,0.25)',
        fill: true,
        pointRadius: 0,
        tension: 0,
      },
      {
        label: `New payment ${fmt(requiredPmt)}`,
        data: padTo(newSchedule.balances, chartMonths),
        borderColor: '#007078',
        backgroundColor: 'transparent',
        fill: false,
        pointRadius: 0,
        tension: 0,
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: false as const,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: { usePointStyle: true, pointStyle: 'circle', font: { size: 11 } },
      },
      tooltip: { callbacks: { label: (ctx: { dataset: { label?: string }; raw: unknown }) => `${ctx.dataset.label}: ${fmt(ctx.raw as number)}` } },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { callback: (v: unknown) => fmt(v as number) },
      },
      x: {
        title: { display: true, text: 'Months' },
        ticks: {
          maxTicksLimit: 14,
          callback: (_: unknown, i: number) => labels[i],
        },
      },
    },
  };

  // ── scenarios ─────────────────────────────────────────────────────────────

  const scenarios = useMemo(() => {
    const monthlyRate = apr / 100 / 12;
    return [6, 12, 24, 36, 48, 60].map(months => ({
      months,
      payment: calcRequiredPayment(balance, monthlyRate, months, monthlyCharges),
    }));
  }, [balance, apr, monthlyCharges]);

  // ── render ────────────────────────────────────────────────────────────────

  return (
    <div className="w-full py-8 px-4 sm:px-6 font-sans">
      <div className="max-w-4xl mx-auto">

        {/* ── Calculator card ── */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">

          {/* Header */}
          <div className="bg-blue-900 px-6 py-4 flex flex-wrap items-center gap-3">
            <Calculator className="h-6 w-6 text-white/60 shrink-0" aria-hidden="true" />
            <div className="flex gap-2 flex-1 justify-center">
              <button
                onClick={() => setShowReport(false)}
                className={`px-5 py-2 rounded text-sm font-semibold transition-colors ${!showReport ? 'bg-blue-800 text-white' : 'bg-white/10 text-white hover:bg-white/20'}`}
              >
                Calculate
              </button>
              <button
                onClick={() => setShowReport(true)}
                className={`px-5 py-2 rounded text-sm font-semibold transition-colors ${showReport ? 'bg-blue-800 text-white' : 'bg-white/10 text-white hover:bg-white/20'}`}
              >
                View Report
              </button>
            </div>
          </div>

          {/* Summary bar */}
          <div className="bg-gray-50 border-b border-gray-200 px-6 py-2 text-center">
            <p className="text-sm text-gray-700">
              <strong className="text-blue-800">{fmt(requiredPmt)}</strong> per month will pay off your credit line in{' '}
              <strong className="text-blue-800">{goalMonths} months</strong>
            </p>
            <p className="text-xs text-gray-400 text-right">*indicates required.</p>
          </div>

          {/* ── Inputs section ── */}
          <SectionHeader
            title="Line of credit information:"
            open={openInputs}
            onToggle={() => setOpenInputs(v => !v)}
          />
          {openInputs && (
            <div className="px-6 py-5 space-y-4 border-b border-gray-100">
              <SliderRow label="Current balance"          value={balance}     min={0}   max={100000} step={100}   prefix="$"  tickLabels={['$0','$10k','$100k','$1m']}   onChange={setBalance} />
              <SliderRow label="Interest rate (APR)"      value={apr}         min={0}   max={30}     step={0.01}  suffix="%" tickLabels={['0%','10%','20%','30%']}       onChange={setApr} />
              <SliderRow label="Rate change (per year)"   value={rateChange}  min={-2}  max={5}      step={0.1}   suffix="%" tickLabels={['-2%','0.3%','2.6%','5%']}     onChange={setRateChange} />
              <SliderRow label="Payoff goal (in months)"  value={goalMonths}  min={1}   max={360}    step={1}     tickLabels={['1','121','240','360']}                   onChange={setGoalMonths} />
              <SliderRow label="Current monthly payment"  value={currentPmt}  min={0}   max={10000}  step={10}    prefix="$" tickLabels={['$0','$1k','$10k','$100k']}    onChange={setCurrentPmt} />
              <SliderRow label="Additional monthly charges" value={addCharges} min={0}  max={10000}  step={10}    prefix="$" tickLabels={['$0','$1k','$10k','$100k']}    onChange={setAddCharges} />
              <SliderRow label="Annual fee"               value={annualFee}   min={0}   max={200}    step={1}     prefix="$" tickLabels={['$0','$67','$133','$200']}      onChange={setAnnualFee} />
            </div>
          )}

          {/* ── Future draws section ── */}
          <SectionHeader
            title="Future draws from line:"
            right={<span className="text-gray-700 font-medium">{fmt(draws.reduce((s, d) => s + (d.amount || 0), 0))}</span>}
            open={openDraws}
            onToggle={() => setOpenDraws(v => !v)}
          />
          {openDraws && (
            <div className="px-6 py-5 border-b border-gray-100 space-y-3">
              {draws.map((draw, i) => (
                <div key={i} className="flex flex-col gap-1.5 text-sm sm:flex-row sm:items-center sm:gap-4">
                  <span className="text-gray-600 font-medium sm:w-20">Draw {['one','two','three'][i]}:</span>
                  <div className="flex items-center gap-2 flex-wrap">
                    <div className="relative w-32">
                      <DollarSign className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                      <input
                        type="number" value={draw.amount} min={0} step={100}
                        onChange={e => setDraws(prev => prev.map((d, j) => j === i ? { ...d, amount: Number(e.target.value) } : d))}
                        className="w-full pl-6 pr-2 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-800"
                      />
                    </div>
                    <span className="text-gray-500">in</span>
                    <input
                      type="number" value={draw.month} min={0} max={MAX_MONTHS} step={1}
                      onChange={e => setDraws(prev => prev.map((d, j) => j === i ? { ...d, month: Number(e.target.value) } : d))}
                      className="w-20 px-2 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-800"
                    />
                    <span className="text-gray-500">month(s) from now</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── Chart section ── */}
          <SectionHeader title="Credit Line Payoff by Month" open={openChart} onToggle={() => setOpenChart(v => !v)} />
          {openChart && (
            <div className="px-6 py-5 border-b border-gray-100">
              <div className="h-72">
                <Line data={chartData} options={chartOptions} />
              </div>
            </div>
          )}

          {/* ── Alternate scenarios ── */}
          <SectionHeader title="Alternate Payoff Scenarios" open={openScenarios} onToggle={() => setOpenScenarios(v => !v)} />
          {openScenarios && (
            <div className="px-6 py-5">
              <table className="w-full text-sm divide-y divide-gray-200">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="px-4 py-2 text-left font-semibold text-gray-700">Payoff goal</th>
                    <th className="px-4 py-2 text-right font-semibold text-gray-700">Required monthly payment</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {scenarios.map(({ months, payment }, i) => (
                    <tr key={months} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-4 py-2 text-gray-700">{months} months</td>
                      <td className="px-4 py-2 text-right font-medium text-blue-800">{fmt(payment)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* ── Report ── */}
        {showReport && (
          <div className="mt-6 space-y-6">

            {/* Warning / info */}
            <div className="bg-blue-50 border border-blue-100 rounded-lg px-6 py-4 text-sm text-blue-900 space-y-2">
              {currentSchedule.paidOffMonth < 0 && (
                <p className="font-semibold">
                  At {fmt(currentPmt)} per month you will pay off your credit line in more than 360 months.
                </p>
              )}
              <p>
                To pay off your line of credit balance of <strong>{fmt(balance)}</strong> in{' '}
                <strong>{goalMonths} months</strong> you need to pay{' '}
                <strong>{fmt(requiredPmt)}</strong> per month. This includes your additional monthly
                purchases of <strong>{fmt(addCharges)}</strong> and your future cash draws and assumes
                no additional charges such as late fees.
              </p>
              <p>
                If you keep your monthly payment at <strong>{fmt(currentPmt)}</strong> you will pay off
                your balance in <strong>{paidOffLabel}</strong>.
              </p>
            </div>

            {/* Chart (repeated in report) */}
            <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
              <div className="px-6 py-5">
                <h3 className="text-sm font-semibold text-blue-800 text-center mb-4 font-display">Credit Line Payoff by Month</h3>
                <div className="h-72">
                  <Line data={chartData} options={chartOptions} />
                </div>
              </div>
            </div>

            {/* Results summary */}
            <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
              <div className="bg-gray-100 px-6 py-3 border-b border-gray-200">
                <h3 className="text-base font-semibold text-blue-950 text-center font-display">Results Summary</h3>
              </div>
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <tbody>
                  {[
                    { label: 'Current balance',            value: fmt(balance) },
                    { label: 'Additional monthly charges', value: fmt(addCharges) },
                    { label: 'Current monthly payment',    value: fmt(currentPmt) },
                    { label: 'Annual fee',                 value: fmt(annualFee) },
                    { label: 'Interest rate (APR)',        value: `${apr}%` },
                    { label: 'Rate change (per year)',     value: `${rateChange}%` },
                    { label: 'Payoff goal (in months)',    value: String(goalMonths) },
                    ...draws.map((d, i) => ({
                      label: `Draw ${['one','two','three'][i]}`,
                      value: `${fmt(d.amount)} in ${d.month} month(s) from now`,
                    })),
                    { label: `Payoff with a ${fmt(currentPmt)} payment`,  value: paidOffLabel },
                    { label: `${fmt(currentPmt)} per month requires`,     value: fmt(requiredPmt) },
                  ].map(({ label, value }, i) => (
                    <tr key={label} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-6 py-2.5 text-right text-gray-600 w-1/2">{label}:</td>
                      <td className="px-6 py-2.5 text-gray-900 font-medium">{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Payment schedule */}
            <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
              <div className="bg-gray-100 px-6 py-3 border-b border-gray-200">
                <h3 className="text-base font-semibold text-blue-950 font-display">
                  Payment schedule with your current payment of {fmt(currentPmt)}
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 text-sm">
                  <thead className="bg-gray-200">
                    <tr>
                      {['#','Payment','Interest','Charges','Balance'].map((h, i) => (
                        <th key={h} scope="col"
                          className={`px-5 py-2.5 text-xs font-bold text-gray-700 uppercase tracking-wider ${i === 0 ? 'text-center border-r border-gray-300 w-14' : 'text-right'}`}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr className="bg-gray-50">
                      <td className="px-5 py-2 border-r border-gray-200" />
                      <td /><td /><td />
                      <td className="px-5 py-2 text-right font-bold text-gray-900">{fmt(balance)}</td>
                    </tr>
                    {currentSchedule.rows.map(row => (
                      <tr key={row.month} className="hover:bg-blue-50 transition-colors">
                        <td className="px-5 py-2 text-center font-medium text-gray-900 border-r border-gray-200">{row.month}:</td>
                        <td className="px-5 py-2 text-right text-gray-900">{fmt(row.payment)}</td>
                        <td className="px-5 py-2 text-right text-gray-600">{fmt(row.interest)}</td>
                        <td className="px-5 py-2 text-right text-gray-600">{fmt(row.charges)}</td>
                        <td className="px-5 py-2 text-right text-gray-900">{fmt(row.balance)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <p className="text-xs text-gray-400 leading-relaxed">
              Information and interactive calculators are made available as self-help tools for your independent use and are not
              intended to provide investment advice. We cannot and do not guarantee their applicability or accuracy in regards to
              your individual circumstances. All examples are hypothetical and are for illustrative purposes. We encourage you to
              seek personalized advice from qualified professionals regarding all personal finance issues.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
