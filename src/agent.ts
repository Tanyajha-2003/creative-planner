import { randomUUID } from 'crypto';

export enum AgentStatus { Idle = 'idle', Busy = 'busy' }

export class AgentSimulator {
public id: string;
public name: string;
public status: AgentStatus = AgentStatus.Idle;


constructor(name: string) {
this.id = randomUUID();
this.name = name;
}


serialize() { return { id: this.id, name: this.name, status: this.status } }


async executeStep(step: string): Promise<string> {
this.status = AgentStatus.Busy;
await this.delay(500 + Math.random() * 1200);
this.status = AgentStatus.Idle;
if (step.toLowerCase().includes('test')) return 'Mock tests: 4 passing, 0 failing';
if (step.toLowerCase().includes('readme')) return 'README draft created';
if (step.toLowerCase().includes('analyze')) return 'Requirements: inputs/outputs/success criteria';
return `Agent ${this.name} completed: ${step}`;
}


private delay(ms: number) { return new Promise(res => setTimeout(res, ms)); }
}