import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

export default function HealthScore({ score }) {
    const [displayScore, setDisplayScore] = useState(0)

    useEffect(() => {
        // Animate up to the score
        let current = 0
        const inc = score / 60 // 60 frames ~ 1s
        const timer = setInterval(() => {
            current += inc
            if (current >= score) {
                setDisplayScore(score)
                clearInterval(timer)
            } else {
                setDisplayScore(Math.floor(current))
            }
        }, 16)
        return () => clearInterval(timer)
    }, [score])

    const radius = 70
    const circumference = 2 * Math.PI * radius
    const strokeDashoffset = circumference - (score / 100) * circumference

    const color = score > 80 ? 'var(--color-green)' : score > 50 ? 'var(--color-amber)' : 'var(--color-red)'

    return (
        <div className="health-score-container">
            <div className="health-score-circle">
                <svg width="160" height="160" style={{ transform: 'rotate(-90deg)' }}>
                    <circle cx="80" cy="80" r={radius} fill="transparent" stroke="var(--bg-tertiary)" strokeWidth="6" />
                    <motion.circle
                        cx="80" cy="80" r={radius} fill="transparent" stroke={color} strokeWidth="6" strokeLinecap="round"
                        initial={{ strokeDashoffset: circumference }}
                        animate={{ strokeDashoffset }}
                        transition={{ duration: 1.2, ease: "easeOut" }}
                        strokeDasharray={circumference}
                    />
                </svg>
                <div className="health-score-text" style={{ color }}>{displayScore}</div>
            </div>

            <div className="health-score-desc">
                Overall Meeting Health Score based on participant engagement, sentiment stability, and clarity of action items established.
            </div>
        </div>
    )
}
