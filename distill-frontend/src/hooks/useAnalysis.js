import { useState, useCallback } from 'react'

export function useAnalysis() {
    const [status, setStatus] = useState('UPLOAD') // UPLOAD | PROCESSING | REPORT
    const [processingStage, setProcessingStage] = useState('Connecting...')
    const [progress, setProgress] = useState(0)
    const [report, setReport] = useState(null)
    const [error, setError] = useState(null)

    const startAnalysis = useCallback(async (file) => {
        setStatus('PROCESSING')
        setProcessingStage('Uploading audio...')
        setProgress(5)
        setError(null)

        try {
            const formData = new FormData()
            formData.append('file', file)

            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000'
            const res = await fetch(`${apiUrl}/api/analyze/`, {
                method: 'POST',
                body: formData
            })

            if (!res.ok) throw new Error('Upload failed')

            const data = await res.json()
            if (data.error) throw new Error(data.error)

            const jobId = data.job_id

            // Connect to WebSocket
            const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
            // const wsHost = window.location.host // for prod
            const wsBaseUrl = apiUrl.replace('http://', 'ws://').replace('https://', 'wss://')
            const ws = new WebSocket(`${wsBaseUrl}/api/analyze/status/${jobId}`)

            ws.onmessage = (event) => {
                const msg = JSON.parse(event.data)

                if (msg.status === 'error') {
                    setError(msg.error)
                    setStatus('UPLOAD')
                    ws.close()
                } else if (msg.status === 'transcribing') {
                    setProcessingStage('Transcribing audio with Whisper...')
                    setProgress(30)
                } else if (msg.status === 'analyzing') {
                    setProcessingStage('Analyzing transcript with AI...')
                    setProgress(70)
                } else if (msg.status === 'complete') {
                    setProgress(100)
                    setTimeout(() => {
                        setReport(msg.report)
                        setStatus('REPORT')
                        ws.close()
                    }, 500)
                }
            }

            ws.onerror = () => {
                setError('WebSocket connection error')
                setStatus('UPLOAD')
            }

        } catch (err) {
            setError(err.message)
            setStatus('UPLOAD')
        }
    }, [])

    const reset = useCallback(() => {
        setStatus('UPLOAD')
        setReport(null)
        setProgress(0)
        setError(null)
    }, [])

    return {
        status,
        processingStage,
        progress,
        report,
        error,
        startAnalysis,
        reset
    }
}
