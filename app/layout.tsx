import "./globals.css";

export const metadata = {
  title: "Solvy",
  description: "Small steps. Real change.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body>{children}</body></html>;
}
