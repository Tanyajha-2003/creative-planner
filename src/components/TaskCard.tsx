import React from 'react';

export default function TaskCard({ task, agents, onRunTask }: any) {
return (
<div className="task-card">
<div className="task-title">{task}</div>
<div className="task-actions">
<select onChange={e=>onRunTask(task, e.target.value)}>
<option value="">Run with...</option>
{agents.map((a:any) => <option key={a.id} value={a.id}>{a.name}</option>)}
</select>
</div>
</div>
);
}