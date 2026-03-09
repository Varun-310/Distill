import React from 'react'
import { AnimatePresence } from 'framer-motion'
import { useAnalysis } from '../hooks/useAnalysis'
import UploadStage from './UploadStage'
import ProcessingStage from './ProcessingStage'
import ReportStage from './ReportStage'

export default function App() {
    const { status, processingStage, progress, report, error, startAnalysis, reset } = useAnalysis()

    return (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <AnimatePresence mode="wait">
                {status === 'UPLOAD' && (
                    <UploadStage key="upload" onUpload={startAnalysis} error={error} />
                )}

                {status === 'PROCESSING' && (
                    <ProcessingStage key="processing" stage={processingStage} progress={progress} />
                )}

                {status === 'REPORT' && (
                    <ReportStage key="report" report={report} onReset={reset} />
                )}
            </AnimatePresence>
        </div>
    )
}
