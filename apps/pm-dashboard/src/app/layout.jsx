import "../styles/globals.css";
import ConditionalLayout from "../components/shared/ConditionalLayout";
import { WorkspaceProvider } from "../contexts/WorkspaceContext";

export const metadata = {
  title: "PM Dashboard - Xtrawrkx Suite",
  description: "Project Manager Dashboard",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gradient-main min-h-screen">
        <WorkspaceProvider>
          <ConditionalLayout>{children}</ConditionalLayout>
        </WorkspaceProvider>
      </body>
    </html>
  );
}
