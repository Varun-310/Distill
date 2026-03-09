import { motion } from 'framer-motion'

export default function ProcessingStage({ stage, progress }) {
    const radius = 90
    const circumference = 2 * Math.PI * radius
    const strokeDashoffset = circumference - (progress / 100) * circumference

    return (
        <motion.div
            className="processing-stage"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <div className="progress-container">
                <svg className="progress-ring" width="200" height="200">
                    <circle
                        className="progress-ring-circle-bg"
                        cx="100" cy="100" r={radius}
                    />
                    <circle
                        className="progress-ring-circle"
                        cx="100" cy="100" r={radius}
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                    />
                </svg>
                <div className="progress-text">{progress}%</div>
            </div>

            <motion.h3
                key={stage}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="processing-label"
            >
                {stage}
            </motion.h3>
            <p className="processing-hint">This usually takes about a minute depending on audio length.</p>
        </motion.div>
    )
}
