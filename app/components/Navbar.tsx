import React from 'react';
import { Link } from "react-router";
import { useThemeStore } from "~/lib/theme";

const Navbar = () => {
    const { isDark, toggleTheme } = useThemeStore();

    return (
        <nav className="navbar">
            <Link to="/">
                <p className="text-2xl font-bold text-gradient dark:from-[#AB8C95] dark:via-white dark:to-[#8E97C5]">ResumeIQ</p>
            </Link>
            <div className="flex flex-row items-center gap-4">
                <button
                    onClick={toggleTheme}
                    className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-200 dark:border-dark-border dark:bg-dark-surface hover:bg-gray-50 dark:hover:bg-[#2a2f45] transition-colors"
                    aria-label="Toggle dark mode"
                >
                    {isDark ? (
                        // Sun icon
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
                        </svg>
                    ) : (
                        // Moon icon
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
                        </svg>
                    )}
                </button>
                <Link className="primary-button w-fit" to="/upload">
                    Upload Resume
                </Link>
            </div>
        </nav>
    );
}

export default Navbar;