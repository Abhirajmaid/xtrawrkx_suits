import "../styles/globals.css"

export const metadata = {
    title: "Client Portal - Xtrawrkx Suite",
    description: "Client Management Portal",
}

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body>
                {children}
            </body>
        </html>
    )
}
