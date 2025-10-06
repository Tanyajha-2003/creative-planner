import React from 'react';

export default function ConsoleView({ logs }: any) {
return (
<div className="console">
<h4>Console</h4>
<div className="console-log">
{logs.map((l:string,i:number) => <div key={i}>{l}</div>)}
</div>
</div>
);
}