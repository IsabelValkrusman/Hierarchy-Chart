
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
} from '@xyflow/react';

// Interactive organization chart.
// Интерактивная схема организации.
export default function HierarchyChart({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onNodeClick,
}) {
  return (
    <section className="chart-card">
      <div className="chart-header">
        <div>
          <h3>Organization map</h3>
          <p>Click an employee to manage their details.</p>
        </div>

        <div className="chart-legend">
          <span>
            <i className="legend-dot purple-dot" /> Teams
          </span>
          <span>
            <i className="legend-dot green-dot" /> Employees
          </span>
        </div>
      </div>

      <div className="chart">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={onNodeClick}
          fitView
          fitViewOptions={{ padding: 0.25 }}
          minZoom={0.2}
          maxZoom={2}
          panOnDrag
          zoomOnScroll
          zoomOnPinch
          nodesConnectable={false}
          proOptions={{ hideAttribution: false }}
        >
          <Background color="#e9e4f5" gap={22} />

          <Controls />

          <MiniMap
            nodeColor={(node) => {
              if (node.id === 'company') return '#8b5cf6';
              if (node.id.startsWith('employee-')) return '#34b88a';
              if (node.id === 'finance') return '#f0ad58';
              return '#a78bfa';
            }}
          />
        </ReactFlow>
      </div>

      <div className="chart-footer">
        <span>Drag to explore · Scroll to zoom</span>
        <span>
          {nodes.length} nodes · {edges.length} connections
        </span>
      </div>
    </section>
  );
}
