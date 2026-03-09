export default function NotableQuote({ text, speaker }) {
    return (
        <div className="quote-block">
            <div className="quote-text">"{text}"</div>
            <div className="quote-speaker">— {speaker}</div>
        </div>
    )
}
