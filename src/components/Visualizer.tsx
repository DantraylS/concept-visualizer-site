"use client";

import React, { useState, useEffect } from "react";
import ReactFlow, {
  Background,
  Node,
  Edge,
  Controls,
  applyNodeChanges,
  applyEdgeChanges,
  OnNodesChange,
  OnEdgesChange,
  addEdge,
} from "react-flow-renderer";

export default function Visualizer() {
  const [jsonInput, setJsonInput] = useState<string>(() =>
    JSON.stringify(
      {
        nodes: [
          { id: "1", label: "Start", position: { x: 0, y: 0 } },
          { id: "2", label: "Process", position: { x: 200, y: 100 } },
          { id: "3", label: "End", position: { x: 400, y: 0 } },
        ],
        edges: [
          { id: "e1-2", source: "1", target: "2" },
          { id: "e2-3", source: "2", target: "3" },
        ],
      },
      null,
      2
    )
  );

  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Parse JSON live as user types
  useEffect(() => {
    try {
      const parsed = JSON.parse(jsonInput);

      const flowNodes: Node[] = parsed.nodes.map((n: any) => ({
        id: n.id,
        data: { label: n.label },
        position: n.position,
        style: {
          color: "black",
          background: "white",
          border: "1px solid #ccc",
        },
      }));

      const flowEdges: Edge[] = parsed.edges.map((e: any) => ({
        id: e.id,
        source: e.source,
        target: e.target,
      }));

      setNodes(flowNodes);
      setEdges(flowEdges);
      setError(null);
    } catch (err: any) {
      setError("❌ Invalid JSON: " + err.message);
    }
  }, [jsonInput]);

  const onNodesChange: OnNodesChange = (changes) =>
    setNodes((nds) => applyNodeChanges(changes, nds));
  const onEdgesChange: OnEdgesChange = (changes) =>
    setEdges((eds) => applyEdgeChanges(changes, eds));

  const handleExport = () => {
    const data = {
      nodes: nodes.map((n) => ({
        id: n.id,
        label: n.data.label,
        position: n.position,
      })),
      edges: edges.map((e) => ({
        id: e.id,
        source: e.source,
        target: e.target,
      })),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "diagram.json";
    link.click();
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setJsonInput(reader.result);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
      {/* Left Panel */}
      <div className="flex flex-col">
        <h2 className="text-xl font-bold mb-2">📝 JSON Input</h2>
        <textarea
          value={jsonInput}
          onChange={(e) => setJsonInput(e.target.value)}
          className="w-full h-80 p-3 border border-gray-300 rounded font-mono text-sm text-black bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Paste or type your JSON here"
        />
        <div className="flex gap-2 mt-3">
          <label className="bg-gray-600 px-4 py-2 rounded cursor-pointer hover:bg-gray-300">
            📥 Import
            <input
              type="file"
              accept=".json"
              className="hidden"
              onChange={handleImport}
            />
          </label>
          <button
            onClick={handleExport}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
          >
            📤 Export
          </button>
        </div>
        {error && (
          <p className="mt-2 text-red-600 text-sm whitespace-pre-line">
            {error}
          </p>
        )}
      </div>

      {/* Right Panel */}
      <div className="h-[32rem] border rounded shadow-sm bg-white">
        <h2 className="text-xl font-bold mb-2 px-4 pt-4">🧠 Diagram Preview</h2>
        <div className="h-[calc(100%-2.5rem)]">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            fitView
          >
            <Background />
            <Controls />
          </ReactFlow>
        </div>
      </div>
    </div>
  );
}
