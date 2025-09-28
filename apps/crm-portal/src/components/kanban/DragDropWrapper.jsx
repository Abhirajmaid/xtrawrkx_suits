"use client";

import React, { useState, useEffect } from 'react';

export default function DragDropWrapper({ children }) {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return <div>Loading...</div>;
  }

  return children;
}