"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgentSimulator = exports.AgentStatus = void 0;
const crypto_1 = require("crypto");
var AgentStatus;
(function (AgentStatus) {
    AgentStatus["Idle"] = "idle";
    AgentStatus["Busy"] = "busy";
})(AgentStatus || (exports.AgentStatus = AgentStatus = {}));
class AgentSimulator {
    constructor(name) {
        this.status = AgentStatus.Idle;
        this.id = (0, crypto_1.randomUUID)();
        this.name = name;
    }
    serialize() { return { id: this.id, name: this.name, status: this.status }; }
    async executeStep(step) {
        this.status = AgentStatus.Busy;
        await this.delay(500 + Math.random() * 1200);
        this.status = AgentStatus.Idle;
        if (step.toLowerCase().includes('test'))
            return 'Mock tests: 4 passing, 0 failing';
        if (step.toLowerCase().includes('readme'))
            return 'README draft created';
        if (step.toLowerCase().includes('analyze'))
            return 'Requirements: inputs/outputs/success criteria';
        return `Agent ${this.name} completed: ${step}`;
    }
    delay(ms) { return new Promise(res => setTimeout(res, ms)); }
}
exports.AgentSimulator = AgentSimulator;
//# sourceMappingURL=agent.js.map