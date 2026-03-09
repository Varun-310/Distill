export default function ActionItem({ task, owner, priority }) {
    const pClass = priority.toLowerCase() === 'high' ? 'priority-high'
        : priority.toLowerCase() === 'medium' ? 'priority-medium'
            : 'priority-low'

    return (
        <div className="action-item">
            <div className="action-bullet" />
            <div className="action-content">
                <h4 className="action-task">{task}</h4>
                <div className="action-meta">
                    <span className={`priority-badge ${pClass}`}>{priority}</span>
                    <span>Assignee: {owner}</span>
                </div>
            </div>
        </div>
    )
}
