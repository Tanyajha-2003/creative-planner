"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ConsoleView;
const jsx_runtime_1 = require("react/jsx-runtime");
function ConsoleView({ logs }) {
    return ((0, jsx_runtime_1.jsxs)("div", { className: "console", children: [(0, jsx_runtime_1.jsx)("h4", { children: "Console" }), (0, jsx_runtime_1.jsx)("div", { className: "console-log", children: logs.map((l, i) => (0, jsx_runtime_1.jsx)("div", { children: l }, i)) })] }));
}
//# sourceMappingURL=ConsoleView.js.map