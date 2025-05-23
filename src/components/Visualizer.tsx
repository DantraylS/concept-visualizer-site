"use client";

import React, { useState, useEffect, useCallback } from "react";
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
  useReactFlow,
} from "react-flow-renderer";
import { v4 as uuidv4 } from "uuid";

export default function Visualizer() {
  const [jsonInput, setJsonInput] = useState<string>("");
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [nodeType, setNodeType] = useState<"rectangle" | "circle">("rectangle");
  const [newLabel, setNewLabel] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const [initDone, setInitDone] = useState(false);

  const parseJson = useCallback(() => {
    try {
      const parsed = JSON.parse(jsonInput);

      const flowNodes: Node[] = parsed.nodes.map((n: any) => ({
        id: n.id,
        data: { label: n.label },
        position: n.position,
        style: {
          background: "white",
          border: "1px solid #ccc",
          borderRadius: n.type === "circle" ? "50%" : "8px",
          padding: 10,
          color: "black",
          width: 100,
          textAlign: "center",
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

  useEffect(() => {
    if (!initDone) {
      setJsonInput(
        JSON.stringify(
          {
            nodes: [
              {
                id: "1",
                label: "Start",
                type: "rectangle",
                position: { x: 0, y: 0 },
              },
              {
                id: "2",
                label: "Middle",
                type: "circle",
                position: { x: 200, y: 100 },
              },
              {
                id: "3",
                label: "End",
                type: "rectangle",
                position: { x: 400, y: 0 },
              },
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
      setInitDone(true);
    } else {
      parseJson();
    }
  }, [jsonInput, initDone, parseJson]);

  const updateJsonFromNodesEdges = (
    updatedNodes: Node[],
    updatedEdges: Edge[]
  ) => {
    const data = {
      nodes: updatedNodes.map((n) => ({
        id: n.id,
        label: n.data.label,
        type: n.style?.borderRadius === "50%" ? "circle" : "rectangle",
        position: n.position,
      })),
      edges: updatedEdges.map((e) => ({
        id: e.id,
        source: e.source,
        target: e.target,
      })),
    };

    setJsonInput(JSON.stringify(data, null, 2));
  };

  const handleAddNode = () => {
    const newId = uuidv4();
    const newNode: Node = {
      id: newId,
      data: { label: newLabel || `Node ${nodes.length + 1}` },
      position: { x: Math.random() * 400, y: Math.random() * 300 },
      style: {
        background: "white",
        border: "1px solid #ccc",
        borderRadius: nodeType === "circle" ? "50%" : "8px",
        padding: 10,
        color: "black",
        width: 100,
        textAlign: "center",
      },
    };

    const updatedNodes = [...nodes, newNode];
    setNodes(updatedNodes);
    updateJsonFromNodesEdges(updatedNodes, edges);
    setNewLabel("");
  };

  const handleDeleteNode = (id: string) => {
    const updatedNodes = nodes.filter((n) => n.id !== id);
    const updatedEdges = edges.filter(
      (e) => e.source !== id && e.target !== id
    );
    setNodes(updatedNodes);
    setEdges(updatedEdges);
    updateJsonFromNodesEdges(updatedNodes, updatedEdges);
  };

  const onNodesChange: OnNodesChange = (changes) =>
    setNodes((nds) => {
      const updated = applyNodeChanges(changes, nds);
      updateJsonFromNodesEdges(updated, edges);
      return updated;
    });

  const onEdgesChange: OnEdgesChange = (changes) =>
    setEdges((eds) => {
      const updated = applyEdgeChanges(changes, eds);
      updateJsonFromNodesEdges(nodes, updated);
      return updated;
    });

  const onNodeClick = (_: any, node: Node) => {
    if (window.confirm(`Delete node "${node.data.label}"?`)) {
      handleDeleteNode(node.id);
    }
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
        {error && <p className="mt-2 text-red-600 text-sm">{error}</p>}

        <div className="flex gap-2 mt-4">
          <input
            type="text"
            placeholder="Label"
            value={newLabel}
            onChange={(e) => setNewLabel(e.target.value)}
            className="border rounded px-3 py-2 text-sm"
          />
          <select
            value={nodeType}
            onChange={(e) => setNodeType(e.target.value as any)}
            className="border rounded px-3 py-2 text-sm"
          >
            <option value="rectangle">Rectangle</option>
            <option value="circle">Circle</option>
          </select>
          <button
            onClick={handleAddNode}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            ➕ Add Node
          </button>
        </div>
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
            onNodeClick={onNodeClick}
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
