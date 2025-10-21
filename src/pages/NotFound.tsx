import { Link } from "react-router-dom";
import { Home, SearchX } from "lucide-react";

export default function NotFound() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-center p-6">
            <SearchX className="w-20 h-20 text-indigo-600 mb-4" />
            <h1 className="text-5xl font-bold mb-2">404</h1>
            <p className="text-slate-600 mb-6">Oops! The page you're looking for doesn't exist or has been moved.</p>
            <Link to="/" className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2 rounded-md hover:bg-indigo-700">
                <Home size={18} /> Go Home
            </Link>
        </div>)
}
