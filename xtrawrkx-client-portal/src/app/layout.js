import { Inter } from "next/font/google";
import "../styles/globals.css";
import { MSWProvider } from "@/components/providers/MSWProvider";
import { QueryProvider } from "@/components/providers/QueryProvider";
import { AuthProvider } from "@/lib/auth";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
    title: "Xtrawrkx Client Portal",
    description: "Modern client portal with project management integration",
}

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <MSWProvider>
                    <QueryProvider>
                        <AuthProvider>
                            {children}
                        </AuthProvider>
                    </QueryProvider>
                </MSWProvider>
            </body>
        </html>
    )
}
