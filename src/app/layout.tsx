import Footer from "~/components/footer";
import "~/styles/globals.css";

export const metadata = {
  title: "Weather App",
  description: "Simple weather app to get current weather and forecast",
  icons: [{ rel: "icon", url: "/favicon.jpeg" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <div className="flex h-full min-h-screen flex-col justify-between bg-gradient-to-br from-gray-400 via-black to-gray-500">
          {children}{" "}
          <div className="right-0 bottom-0 left-0">
            <Footer />
          </div>
        </div>
      </body>
    </html>
  );
}
