"use client";

import React, { createContext, useContext, useState, useCallback } from "react";

const WorkspaceContext = createContext();

export const useWorkspace = () => {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error("useWorkspace must be used within a WorkspaceProvider");
  }
  return context;
};

export const WorkspaceProvider = ({ children }) => {
  const [workspaces, setWorkspaces] = useState([
    {
      id: 1,
      name: "Fourtwo Studio",
      icon: "4",
      color: "bg-green-500",
      isActive: true,
      members: ["john@example.com", "jane@example.com"]
    },
    {
      id: 2,
      name: "Design Hub",
      icon: "D",
      color: "bg-blue-500",
      isActive: false,
      members: ["alice@example.com"]
    }
  ]);

  const [activeWorkspace, setActiveWorkspace] = useState(workspaces[0]);

  const createWorkspace = useCallback((workspaceData) => {
    const newWorkspace = {
      id: Date.now(),
      name: workspaceData.name,
      icon: workspaceData.icon ? "W" : "W", // Default icon if no custom icon
      color: "bg-purple-500", // Default color
      isActive: false,
      members: workspaceData.members || []
    };

    setWorkspaces(prev => {
      // Set all other workspaces to inactive
      const updatedWorkspaces = prev.map(ws => ({ ...ws, isActive: false }));
      return [...updatedWorkspaces, newWorkspace];
    });

    setActiveWorkspace(newWorkspace);
  }, []);

  const switchWorkspace = useCallback((workspaceId) => {
    setWorkspaces(prev => 
      prev.map(ws => ({ 
        ...ws, 
        isActive: ws.id === workspaceId 
      }))
    );
    
    const workspace = workspaces.find(ws => ws.id === workspaceId);
    if (workspace) {
      setActiveWorkspace(workspace);
    }
  }, [workspaces]);

  const updateWorkspace = useCallback((workspaceId, updates) => {
    setWorkspaces(prev => 
      prev.map(ws => 
        ws.id === workspaceId ? { ...ws, ...updates } : ws
      )
    );
  }, []);

  const deleteWorkspace = useCallback((workspaceId) => {
    setWorkspaces(prev => {
      const filtered = prev.filter(ws => ws.id !== workspaceId);
      // If we deleted the active workspace, switch to the first available one
      if (activeWorkspace.id === workspaceId && filtered.length > 0) {
        setActiveWorkspace(filtered[0]);
        filtered[0].isActive = true;
      }
      return filtered;
    });
  }, [activeWorkspace]);

  const value = {
    workspaces,
    activeWorkspace,
    createWorkspace,
    switchWorkspace,
    updateWorkspace,
    deleteWorkspace
  };

  return (
    <WorkspaceContext.Provider value={value}>
      {children}
    </WorkspaceContext.Provider>
  );
};
