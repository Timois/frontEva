// useSidebar.js
import { useState } from "react";
export const useSidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);
  const closeSidebar = () => setIsSidebarOpen(false);
  return { isSidebarOpen, toggleSidebar, closeSidebar };
};