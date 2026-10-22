
import { useCallback, useEffect, useState } from 'react';
import { useNodesState, useEdgesState } from '@xyflow/react';

import '@xyflow/react/dist/style.css';
import './App.css';

import { loadHierarchy, saveHierarchy } from './utils/storage';
import HierarchyChart from './components/HierarchyChart';

export default function App() {
  // Load saved data or the initial JSON hierarchy.
  // Загружаем сохранённую или начальную JSON-иерархию.
  const [initialData] = useState(loadHierarchy);

  const [nodes, setNodes, onNodesChange] = useNodesState(
    initialData.nodes
  );

  const [edges, setEdges, onEdgesChange] = useEdgesState(
    initialData.edges
  );

  // Form state and selected employee.
  // Состояние формы и выбранный сотрудник.
  const [employeeName, setEmployeeName] = useState('');
  const [department, setDepartment] = useState('frontend');
  const [selectedId, setSelectedId] = useState(null);
  const [editName, setEditName] = useState('');
  const [message, setMessage] = useState('');

  // Count employees only.
  // Считаем только сотрудников.
  const employeeNodes = nodes.filter((node) =>
    node.id.startsWith('employee-')
  );

  // Persist changes in localStorage.
  // Сохраняем изменения в localStorage.
  useEffect(() => {
    saveHierarchy(nodes, edges);
  }, [nodes, edges]);

  // Add a new employee to the selected team.
  // Добавляем сотрудника в выбранную команду.
  const addEmployee = useCallback(
    (event) => {
      event.preventDefault();

      const name = employeeName.trim();

      if (!name) {
        setMessage('Please enter an employee name.');
        return;
      }

      const parent = nodes.find(
        (node) => node.id === department
      );

      if (!parent) {
        setMessage('Please choose a valid team.');
        return;
      }

      const siblings = edges.filter(
        (edge) => edge.source === department
      ).length;

      const id = `employee-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 7)}`;

      const newNode = {
        id,
        type: 'default',
        position: {
          x: parent.position.x + siblings * 170,
          y: parent.position.y + 125,
        },
        data: { label: name },
        className: 'employee-node',
      };

      setNodes((current) => [...current, newNode]);

      setEdges((current) => [
        ...current,
        {
          id: `e-${department}-${id}`,
          source: department,
          target: id,
        },
      ]);

      setSelectedId(id);
      setEditName(name);
      setEmployeeName('');
      setMessage(`${name} was added successfully.`);
    },
    [employeeName, department, nodes, edges, setNodes, setEdges]
  );

  // Select a node and prepare its name for editing.
  // Выбираем узел и подставляем его имя в форму.
  const selectNode = useCallback((_, node) => {
    setSelectedId(node.id);
    setEditName(node.data.label);
    setMessage('');
  }, []);

  const selectedNode = nodes.find(
    (node) => node.id === selectedId
  );

  const selectedIsEmployee =
    selectedId?.startsWith('employee-') ?? false;

  // Update the selected employee's name.
  // Изменяем имя выбранного сотрудника.
  const updateEmployee = (event) => {
    event.preventDefault();

    const name = editName.trim();

    if (!name || !selectedIsEmployee) {
      setMessage('Select an employee and enter a valid name.');
      return;
    }

    setNodes((current) =>
      current.map((node) =>
        node.id === selectedId
          ? {
              ...node,
              data: { ...node.data, label: name },
            }
          : node
      )
    );

    setMessage('Employee name updated.');
  };

  // Delete the selected employee and its connections.
  // Удаляем сотрудника и его связи.
  const deleteEmployee = () => {
    if (!selectedIsEmployee) return;

    const name = selectedNode?.data.label ?? 'Employee';

    setNodes((current) =>
      current.filter((node) => node.id !== selectedId)
    );

    setEdges((current) =>
      current.filter(
        (edge) =>
          edge.source !== selectedId &&
          edge.target !== selectedId
      )
    );

    setSelectedId(null);
    setEditName('');
    setMessage(`${name} was deleted.`);
  };

  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="brand">
          <div className="brand-icon">
            <img
              src="/images/boss.png"
              alt="Boss Level mascot"
            />
          </div>

          <div>
            <h1>Boss Level</h1>
            <p>Company hierarchy</p>
          </div>
        </div>
      </header>

      <div className="workspace">
        <aside className="sidebar">
          <div>
            <span className="summary-label">
              Total employees
            </span>
            <strong>{employeeNodes.length}</strong>
          </div>

          <div className="sidebar-section">
            <button
              className={`team-link ${
                department === 'frontend' ? 'active' : ''
              }`}
              onClick={() => setDepartment('frontend')}
              type="button"
            >
              <span className="team-link-text">
                <strong>Frontend Team</strong>
                <small>
                  {
                    edges.filter(
                      (edge) => edge.source === 'frontend'
                    ).length
                  }{' '}
                  employees
                </small>
              </span>
            </button>

            <button
              className={`team-link ${
                department === 'backend' ? 'active' : ''
              }`}
              onClick={() => setDepartment('backend')}
              type="button"
            >
              <span className="team-link-text">
                <strong>Backend Team</strong>
                <small>
                  {
                    edges.filter(
                      (edge) => edge.source === 'backend'
                    ).length
                  }{' '}
                  employees
                </small>
              </span>
            </button>

            <button
              className={`team-link ${
                department === 'accounting' ? 'active' : ''
              }`}
              onClick={() => setDepartment('accounting')}
              type="button"
            >
              <span className="team-link-text">
                <strong>Accounting Team</strong>
                <small>
                  {
                    edges.filter(
                      (edge) => edge.source === 'accounting'
                    ).length
                  }{' '}
                  employees
                </small>
              </span>
            </button>
          </div>
        </aside>

        <section className="main-content">
          <div className="page-heading"></div>

          <section className="add-card">
            <div className="add-card-copy">
              <h3>Add a team member</h3>
              <p>
                Create a new employee in your organization.
              </p>
            </div>

            <form
              className="employee-form"
              onSubmit={addEmployee}
            >
              <input
                value={employeeName}
                onChange={(event) =>
                  setEmployeeName(event.target.value)
                }
                placeholder="Employee name"
                aria-label="Employee name"
              />

              <select
                value={department}
                onChange={(event) =>
                  setDepartment(event.target.value)
                }
                aria-label="Choose team"
              >
                <option value="frontend">Frontend Team</option>
                <option value="backend">Backend Team</option>
                <option value="accounting">
                  Accounting Team
                </option>
              </select>

              <button
                type="submit"
                className="primary-button"
              >
                <span>＋</span> Add employee
              </button>
            </form>
          </section>

          {message && (
            <div className="feedback-message" role="status">
              <span>✓</span> {message}
            </div>
          )}

          <HierarchyChart
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onNodeClick={selectNode}
          />

          <section className="edit-card">
            <div className="edit-card-heading">
              <div>
                <h3>Selected item</h3>
                <p>
                  {selectedNode
                    ? `Selected: ${selectedNode.data.label}`
                    : 'Select an employee on the chart to edit their name.'}
                </p>
              </div>

              <span className="edit-icon">✎</span>
            </div>

            <form
              className="edit-form"
              onSubmit={updateEmployee}
            >
              <input
                value={editName}
                onChange={(event) =>
                  setEditName(event.target.value)
                }
                placeholder="Select an employee first"
                aria-label="Edit employee name"
                disabled={!selectedIsEmployee}
              />

              <button
                type="submit"
                className="primary-button"
                disabled={!selectedIsEmployee}
              >
                Save name
              </button>

              <button
                type="button"
                className="delete-button"
                onClick={deleteEmployee}
                disabled={!selectedIsEmployee}
              >
                Delete employee
              </button>
            </form>
          </section>

          <footer className="page-footer">
            <span>Hierarchy Workspace</span>
            <span>Made for clear connections ✦</span>
          </footer>
        </section>
      </div>
    </main>
  );
}
