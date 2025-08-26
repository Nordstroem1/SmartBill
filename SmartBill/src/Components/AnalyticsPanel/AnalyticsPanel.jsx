import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import "./AnalyticsPanel.css";

function AnalyticsPanel({ selectedYear, monthCounts, monthNames, jobsData }) {
  const analytics = useMemo(() => {
    const inYear = jobsData.filter(j => new Date(j.date).getFullYear() === selectedYear);
    const now = new Date();
    const jobsThisMonth = inYear.filter(j => new Date(j.date).getMonth() === now.getMonth()).length;
    const totalJobsYear = inYear.length;
    const activeMonths = monthCounts.filter(c => c > 0).length;
    const max = Math.max(0, ...monthCounts);
    const busiestIdx = max > 0 ? monthCounts.indexOf(max) : null;
    const busiestMonth = busiestIdx != null ? monthNames[busiestIdx] : '—';
    const lastJobDate = inYear.length ? inYear.map(j => new Date(j.date)).sort((a,b)=>b-a)[0] : null;

    // Job status metrics (gracefully handle when status is absent)
    const statusCounts = inYear.reduce(
      (acc, j) => {
        const s = String(j.status || '').toLowerCase();
        if (s === 'paid' || s === 'sent' || s === 'waiting') acc[s] += 1;
        else acc.other += 1;
        return acc;
      },
      { paid: 0, sent: 0, waiting: 0, other: 0 }
    );

    // Invoice presence metrics
    const withInvoice = inYear.filter(j => j.hasInvoice).length;
    const withoutInvoice = Math.max(0, totalJobsYear - withInvoice);
    const invoiceCoverage = totalJobsYear > 0 ? withInvoice / totalJobsYear : 0;

    // Revenue metrics (only sum numeric amounts)
    const revenueJobs = inYear.filter(j => typeof j.amount === 'number' && !Number.isNaN(j.amount));
    const revenueYear = revenueJobs.reduce((sum, j) => sum + j.amount, 0);
    const avgJobValue = revenueJobs.length > 0 ? revenueYear / revenueJobs.length : 0;

    return {
      jobsThisMonth,
      totalJobsYear,
      activeMonths,
      busiestMonth,
      max,
      lastJobDate,
      inYear,
      statusCounts,
      withInvoice,
      withoutInvoice,
      invoiceCoverage,
      revenueYear,
      avgJobValue,
    };
  }, [jobsData, selectedYear, monthCounts, monthNames]);

  const handleExportCsv = () => {
    // Include common optional fields if present
    const header = ["id","title","date","status","amount","hasInvoice","invoiceUrl"]; 
    const rows = [header, ...analytics.inYear.map(j => [
      j.id,
      j.title,
      j.date,
      j.status ?? '',
      typeof j.amount === 'number' ? j.amount : '',
      j.hasInvoice === true ? 'true' : j.hasInvoice === false ? 'false' : '',
      j.invoiceUrl ?? ''
    ])];
    const csv = rows.map(r => r.map(v => `"${String(v ?? '').replaceAll('"','""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `jobs-${selectedYear}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <motion.section
      id="analytics-section"
      className="analytics"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      <div className="analytics-cards">
        <div className="analytics-card">
          <div className="card-label">Jobs this month</div>
          <div className="card-value">{analytics.jobsThisMonth}</div>
        </div>
        <div className="analytics-card">
          <div className="card-label">Jobs in {selectedYear}</div>
          <div className="card-value">{analytics.totalJobsYear}</div>
        </div>
        <div className="analytics-card">
          <div className="card-label">Active months</div>
          <div className="card-value">{analytics.activeMonths}</div>
        </div>
        <div className="analytics-card">
          <div className="card-label">Busiest month</div>
          <div className="card-value">{analytics.busiestMonth}</div>
        </div>
      </div>

      {/* Job metrics */}
      <div className="analytics-section-title">Job metrics</div>
      {/* Donut chart for status breakdown (Recharts) */}
      {(() => {
        const base = analytics.statusCounts;
        const sum = base.paid + base.sent + base.waiting;
        const counts = sum === 0 ? { paid: 5, sent: 3, waiting: 2 } : base;
        const data = [
          { name: 'Paid', key: 'paid', value: counts.paid, color: '#10b981' },
          { name: 'Sent', key: 'sent', value: counts.sent, color: '#3b82f6' },
          { name: 'Waiting', key: 'waiting', value: counts.waiting, color: '#f59e0b' },
        ]
          .filter(d => d.value > 0)
          .sort((a, b) => b.value - a.value);
        const total = data.reduce((s, d) => s + d.value, 0);
        return (
          <div className="donut-wrap" aria-label="Job status breakdown" role="img">
            <div style={{ width: 180, height: 180 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={60}
                    outerRadius={80}
                    startAngle={90}
                    endAngle={-270}
                    paddingAngle={1}
                    isAnimationActive={false}
                  >
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v, n) => [v, n]} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="donut-legend" aria-hidden="true">
              {data.map(d => (
                <div key={d.key} className="legend-item">
                  <span className={`dot ${d.key}`} style={{ background: d.color }} />
                  {d.name} ({d.value})
                </div>
              ))}
            </div>
          </div>
        );
      })()}
  {/* Removed individual status cards in favor of donut + legend */}

      {/* Invoice metrics */}
      <div className="analytics-section-title">Invoices</div>
      <div className="analytics-cards">
        <div className="analytics-card">
          <div className="card-label">With invoice</div>
          <div className="card-value">{analytics.withInvoice}</div>
        </div>
        <div className="analytics-card">
          <div className="card-label">Missing invoice</div>
          <div className="card-value">{analytics.withoutInvoice}</div>
        </div>
        <div className="analytics-card">
          <div className="card-label">Invoice coverage</div>
          <div className="card-value">{Math.round(analytics.invoiceCoverage * 100)}%</div>
        </div>
        <div className="analytics-card">
          <div className="card-label">Revenue ({selectedYear})</div>
          <div className="card-value">{analytics.revenueYear.toLocaleString('en-SE')} SEK</div>
        </div>
        <div className="analytics-card">
          <div className="card-label">Avg job value</div>
          <div className="card-value">{analytics.avgJobValue.toLocaleString('en-SE')} SEK</div>
        </div>
      </div>
      <div className="analytics-footer">
        <div className="sparkline" aria-label="Jobs per month">
          {monthCounts.map((c, i) => {
            const pct = analytics.max > 0 ? Math.round((c / analytics.max) * 100) : 0;
            return (
              <div
                key={i}
                className={`spark-bar ${c === 0 ? 'is-zero' : ''}`}
                style={{ height: `${Math.max(8, pct)}%` }}
                title={`${monthNames[i]}: ${c} jobs`}
                aria-hidden="true"
              />
            );
          })}
        </div>
        <div className="analytics-actions">
          <button className="export-btn" onClick={handleExportCsv}>Export CSV</button>
        </div>
      </div>
    </motion.section>
  );
}

export default AnalyticsPanel;
