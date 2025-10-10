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
      <body
        className="min-h-screen flex relative"
        style={{
          background:
            "linear-gradient(135deg, #f1f3f6 0%, #e8eef3 25%, #dfe7ed 50%, #d6dee7 75%, #cdd5e0 100%)",
        }}
      >
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-yellow-400/10 to-orange-500/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-gradient-to-tr from-blue-500/8 to-purple-500/5 rounded-full blur-3xl" />
          <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-gradient-to-bl from-green-400/8 to-teal-500/5 rounded-full blur-3xl" />
        </div>

        <WorkspaceProvider>
          <ConditionalLayout>{children}</ConditionalLayout>
        </WorkspaceProvider>
      </body>
    </html>
  );
}
