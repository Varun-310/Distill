import { motion } from 'framer-motion'
import { useState, useRef } from 'react'

export default function UploadStage({ onUpload, error }) {
    const [isDragActive, setIsDragActive] = useState(false)
    const fileInputRef = useRef(null)

    const handleDrag = (e) => {
        e.preventDefault()
        e.stopPropagation()
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setIsDragActive(true)
        } else if (e.type === 'dragleave') {
            setIsDragActive(false)
        }
    }

    const handleDrop = (e) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragActive(false)

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            onUpload(e.dataTransfer.files[0])
        }
    }

    const handleChange = (e) => {
        e.preventDefault()
        if (e.target.files && e.target.files[0]) {
            onUpload(e.target.files[0])
        }
    }

    return (
        <motion.div
            className="upload-stage"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
        >
            <h1 className="distill-title">Distill</h1>
            <p className="distill-tagline">Turn conversations into clarity.</p>

            <div
                className={`upload-zone ${isDragActive ? 'drag-active' : ''}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
            >
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleChange}
                    style={{ display: 'none' }}
                    accept="audio/*"
                />

                <svg className="upload-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                    <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                    <line x1="12" y1="19" x2="12" y2="22" />
                </svg>

                <h3 className="upload-text">Drop your meeting recording here</h3>
                <p className="upload-hint">or click to select file (MP3, WAV, M4A, etc.)</p>

                {error && <p style={{ color: 'var(--color-red)', marginTop: '1rem', fontSize: '14px' }}>{error}</p>}
            </div>
        </motion.div>
    )
}
