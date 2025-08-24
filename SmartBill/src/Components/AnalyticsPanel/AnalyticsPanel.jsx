import React, { useMemo } from "react";
import { motion } from "framer-motion";
import "./AnalyticsPanel.css";

function AnalyticsPanel({ selectedYear, monthCounts, monthNames, jobsData }) {
  const analytics = useMemo(() => {
    const inYear = jobsData.filter(j => new Date(j.date).getFullYear() === selectedYear);
    const jobsThisMonth = inYear.filter(j => new Date(j.date).getMonth() === new Date().getMonth()).length;
    const totalJobsYear = inYear.length;
    const activeMonths = monthCounts.filter(c => c > 0).length;
    const max = Math.max(0, ...monthCounts);
    const busiestIdx = max > 0 ? monthCounts.indexOf(max) : null;
    const busiestMonth = busiestIdx != null ? monthNames[busiestIdx] : '—';
    const lastJobDate = inYear.length ? inYear.map(j => new Date(j.date)).sort((a,b)=>b-a)[0] : null;
    return { jobsThisMonth, totalJobsYear, activeMonths, busiestMonth, max, lastJobDate, inYear };
  }, [jobsData, selectedYear, monthCounts, monthNames]);

  const handleExportCsv = () => {
    const rows = [['id','title','date'], ...analytics.inYear.map(j => [j.id, j.title, j.date])];
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
