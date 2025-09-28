import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import { Providers } from "@/components/providers/SessionProvider";
import "../styles/index.css";

const manrope = Manrope({
    weight: ["300", "400", "500", "600", "700"],
    variable: "--font-manrope",
    subsets: ["latin", "cyrillic"],
    display: "swap",
});

export const metadata: Metadata = {
    title: "Sfera",
    description: "Получи свою натальную карту и получай прогнозы каждый день.",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="ru">
        <body
            className={`${manrope.className} antialiased`}
        >
        <Providers>
            {children}
        </Providers>
        </body>
        </html>
    );
}