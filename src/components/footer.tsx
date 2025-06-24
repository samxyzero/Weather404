import { Cloud, Github, Heart, Mail } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className={`right-0 bottom-0 left-0 mt-8 border-t border-white/20 bg-white/10 backdrop-blur-md`}
    >
      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* Main Footer Content */}
        <div className="mb-6 grid grid-cols-1 gap-8 md:grid-cols-2">
          <div className="text-center md:text-left">
            <div className="mb-3 flex items-center justify-center md:justify-start">
              <Cloud className="mr-2 text-white/80" size={24} />
              <h3 className="text-xl font-bold text-white">WeatherApp</h3>
            </div>
          </div>

          {/* Contact/Social */}
          <div className="text-center md:text-right">
            <h4 className="mb-3 font-semibold text-white">Connect</h4>
            <div className="flex justify-center space-x-4 md:justify-end">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/70 transition-colors hover:text-white"
                aria-label="GitHub"
              >
                <Github size={20} />
              </a>
              <a
                href="mailto:hello@weatherapp.com"
                className="text-white/70 transition-colors hover:text-white"
                aria-label="Email"
              >
                <Mail size={20} />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/20 pt-6">
          <div className="flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0">
            <div className="flex items-center text-sm text-white/70">
              <span>© {currentYear} WeatherApp. Made with</span>
              <Heart className="mx-1 text-red-400" size={14} />
              <span>
                by{" "}
                <Link
                  href="www.gsamir.com.np"
                  className="font-medium text-white/90 transition-colors hover:text-white"
                >
                  Samir Gautam
                </Link>
              </span>
            </div>

            <div className="text-sm text-white/70">
              <span>Powered by </span>
              <a
                href="https://weatherapi.com"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-white/90 transition-colors hover:text-white"
              >
                WeatherAPI
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
