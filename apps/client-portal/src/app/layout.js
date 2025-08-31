import "../styles/globals.css"
import Header from "../components/Header"

export const metadata = {
    title: "Client Portal - Xtrawrkx Suite",
    description: "Client Management Portal",
}

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body>
                <Header title="Client Portal" />
                {children}
            </body>
        </html>
    )
}
