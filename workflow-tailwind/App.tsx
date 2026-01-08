import React, { useState } from 'react';
import { WorkflowEditor } from './components/WorkflowEditor';
import Frame1984078565 from './imports/Frame1984078565';
import { Toaster } from './components/ui/sonner';

interface WorkflowData {
  id: string;
  name: string;
  description: string;
  nodes: any[];
  connections: any[];
  createdAt: Date;
  updatedAt: Date;
}

export default function App() {
  const [showEditor, setShowEditor] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const [currentWorkflow, setCurrentWorkflow] = useState<WorkflowData | null>(null);
  const [savedWorkflows, setSavedWorkflows] = useState<WorkflowData[]>([]);

  const handleCreateWorkflow = () => {
    setShowOverlay(true);
    // Add a small delay to show the overlay effect
    setTimeout(() => {
      setShowEditor(true);
    }, 100);
  };

  const handleCloseEditor = () => {
    setShowEditor(false);
    setShowOverlay(false);
    setCurrentWorkflow(null);
  };

  const handleWorkflowCreated = (name: string, description: string) => {
    const newWorkflow: WorkflowData = {
      id: `workflow-${Date.now()}`,
      name,
      description,
      nodes: [],
      connections: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    setCurrentWorkflow(newWorkflow);
    console.log('New workflow created:', newWorkflow);
  };

  const handleWorkflowSaved = (workflowData: { nodes: any[]; connections: any[] }) => {
    if (!currentWorkflow) return;

    const updatedWorkflow: WorkflowData = {
      ...currentWorkflow,
      nodes: workflowData.nodes,
      connections: workflowData.connections,
      updatedAt: new Date()
    };

    // Update or add the workflow to saved workflows
    setSavedWorkflows(prev => {
      const existingIndex = prev.findIndex(w => w.id === updatedWorkflow.id);
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = updatedWorkflow;
        return updated;
      } else {
        return [...prev, updatedWorkflow];
      }
    });

    setCurrentWorkflow(updatedWorkflow);
    
    // Save to localStorage for persistence
    localStorage.setItem('savedWorkflows', JSON.stringify([...savedWorkflows, updatedWorkflow]));
    
    console.log('Workflow saved:', updatedWorkflow);
    console.log('All saved workflows:', savedWorkflows);
  };

  if (showEditor) {
    return (
      <WorkflowEditor 
        onClose={handleCloseEditor}
        currentWorkflow={currentWorkflow}
        onWorkflowCreated={handleWorkflowCreated}
        onWorkflowSaved={handleWorkflowSaved}
      />
    );
  }

  return (
    <div className="relative size-full">
      {/* Main Workflow Dashboard */}
      <div 
        className="size-full cursor-pointer" 
        onClick={handleCreateWorkflow}
      >
        <Frame1984078565 />
      </div>

      {/* Overlay when transitioning to editor */}
      {showOverlay && !showEditor && (
        <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
          <div className="text-white text-lg">Opening Workflow Editor...</div>
        </div>
      )}
      
      <Toaster />
    </div>
  );
}