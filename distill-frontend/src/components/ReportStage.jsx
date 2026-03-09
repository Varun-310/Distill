import { motion } from 'framer-motion'
import HealthScore from './HealthScore'
import SentimentArc from './SentimentArc'
import ActionItem from './ActionItem'
import NotableQuote from './NotableQuote'

export default function ReportStage({ report, onReset }) {
    if (!report) return null

    return (
        <motion.div
            className="report-stage"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
        >
            <header className="report-header">
                <h1 className="report-title">Meeting Debrief</h1>
                <div className="report-meta">
                    <span>{report.meeting_type || 'General Discussion'}</span>
                    <span>•</span>
                    <span>AI Generated Intelligence</span>
                </div>
            </header>

            <motion.section
                className="report-section"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
            >
                <HealthScore score={report.health_score || 0} />
            </motion.section>

            <motion.section
                className="report-section"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
            >
                <h3 className="section-title">Executive Summary</h3>
                <p className="summary-text">{report.summary}</p>
            </motion.section>

            <motion.section
                className="report-section"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
            >
                <h3 className="section-title">Key Action Items</h3>
                <div className="action-list">
                    {report.action_items?.length > 0 ? (
                        report.action_items.map((item, i) => (
                            <ActionItem key={i} {...item} />
                        ))
                    ) : (
                        <p className="text-muted">No specific action items identified.</p>
                    )}
                </div>
            </motion.section>

            <motion.section
                className="report-section"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}
            >
                <h3 className="section-title">Sentiment & Engagement Arc</h3>
                <SentimentArc arc={report.sentiment_arc} />
            </motion.section>

            <motion.section
                className="report-section"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }}
            >
                <h3 className="section-title">Key Topics</h3>
                <div className="topic-pills">
                    {report.key_topics?.map((topic, i) => (
                        <span key={i} className="topic-pill">{topic}</span>
                    ))}
                </div>
            </motion.section>

            <motion.section
                className="report-section"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.3 }}
            >
                <h3 className="section-title">Notable Quotes</h3>
                <div>
                    {report.notable_quotes?.map((quote, i) => (
                        <NotableQuote key={i} {...quote} />
                    ))}
                </div>
            </motion.section>

            <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}
            >
                <button className="new-analysis-btn" onClick={onReset}>
                    Analyze New Recording
                </button>
            </motion.div>
        </motion.div>
    )
}
