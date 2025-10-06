import React, { useState } from 'react';

export default function AgentPanel({ agents }: { agents: any[] }) {
  const [expandedAgentId, setExpandedAgentId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedAgentId(expandedAgentId === id ? null : id);
  };

  return (
    <div className="agent-panel">
      <h4>Agents</h4>
      {agents.map((a) => {
        const isExpanded = expandedAgentId === a.id;

        return (
          <div
            key={a.id}
            className={`agent ${isExpanded ? 'expanded' : ''}`}
            onClick={() => toggleExpand(a.id)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') toggleExpand(a.id);
            }}
          >
            <div className="avatar">{a.name.charAt(0).toUpperCase()}</div>
            <div className="meta">
              <div className="name">{a.name}</div>
              <div className={`status ${a.status}`}>
                <span className={`status-dot ${a.status}`}></span>
                {a.status.charAt(0).toUpperCase() + a.status.slice(1)}
              </div>
              {isExpanded && (
                <div className="details">
                  {/* You can expand this with more agent info */}
                  <p><strong>ID:</strong> {a.id}</p>
                  <p><strong>Status:</strong> {a.status}</p>
                  <p><em>Click to collapse</em></p>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
