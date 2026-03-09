import { motion } from 'framer-motion'

export default function SentimentArc({ arc }) {
    if (!arc || arc.length < 3) return null

    const opening = arc.find(a => a.stage === 'Opening') || arc[0]
    const middle = arc.find(a => a.stage === 'Middle') || arc[1]
    const closing = arc.find(a => a.stage === 'Closing') || arc[2]

    // Map 0-100 scores to SVG Y coordinates (160 = bottom, 20 = top)
    const getY = (score) => 160 - (score / 100) * 140

    const p1 = { x: 50, y: getY(opening.score) }
    const p2 = { x: 350, y: getY(middle.score) }
    const p3 = { x: 650, y: getY(closing.score) }

    // Rough bezier control points
    const cp1 = { x: 200, y: p1.y }
    const cp2 = { x: 200, y: p2.y }
    const cp3 = { x: 500, y: p2.y }
    const cp4 = { x: 500, y: p3.y }

    const pathD = `M ${p1.x} ${p1.y} C ${cp1.x} ${cp1.y}, ${cp2.x} ${cp2.y}, ${p2.x} ${p2.y} C ${cp3.x} ${cp3.y}, ${cp4.x} ${cp4.y}, ${p3.x} ${p3.y}`

    return (
        <div style={{ width: '100%', overflow: 'hidden' }}>
            <div className="sentiment-arc-container">
                <svg viewBox="0 0 700 180" width="100%" height="100%">
                    <defs>
                        <linearGradient id="gradient" x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0%" stopColor="var(--color-amber)" />
                            <stop offset="50%" stopColor="var(--accent-navy)" />
                            <stop offset="100%" stopColor="var(--color-green)" />
                        </linearGradient>
                    </defs>

                    <motion.path
                        d={pathD}
                        fill="none"
                        stroke="url(#gradient)"
                        strokeWidth="4"
                        strokeLinecap="round"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 1.5, ease: "easeInOut" }}
                    />

                    <circle cx={p1.x} cy={p1.y} r="5" fill="var(--bg-primary)" stroke="var(--color-amber)" strokeWidth="3" />
                    <circle cx={p2.x} cy={p2.y} r="5" fill="var(--bg-primary)" stroke="var(--accent-navy)" strokeWidth="3" />
                    <circle cx={p3.x} cy={p3.y} r="5" fill="var(--bg-primary)" stroke="var(--color-green)" strokeWidth="3" />
                </svg>
            </div>

            <div className="sentiment-labels">
                <div>Opening ({opening.score})</div>
                <div>Middle ({middle.score})</div>
                <div>Closing ({closing.score})</div>
            </div>
        </div>
    )
}
