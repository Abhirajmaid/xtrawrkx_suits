"use client";

import { createContext, useContext, useState } from "react";

const SubSidebarContext = createContext();

export function SubSidebarProvider({ children }) {
  const [subSidebarOpen, setSubSidebarOpen] = useState(false);

  return (
    <SubSidebarContext.Provider value={{ subSidebarOpen, setSubSidebarOpen }}>
      {children}
    </SubSidebarContext.Provider>
  );
}

export function useSubSidebar() {
  const context = useContext(SubSidebarContext);
  if (context === undefined) {
    throw new Error("useSubSidebar must be used within a SubSidebarProvider");
  }
  return context;
}
