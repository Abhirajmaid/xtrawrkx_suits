import "../styles/globals.css";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

export const metadata = {
  title: "PM Dashboard - Xtrawrkx Suite",
  description: "Project Manager Dashboard",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gradient-main min-h-screen">
        <div className="flex h-screen">
          <Sidebar />
          <div className="flex-1 flex flex-col">
            <Header title="Home" />
            <main className="flex-1 p-6 overflow-auto">{children}</main>
          </div>
        </div>
      </body>
    </html>
  );
}
