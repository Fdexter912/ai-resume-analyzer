import React from 'react';

interface Suggestion {
    type: "good" | "improve";
    tip: string;
}

interface ATSProps {
    score: number;
    suggestions: Suggestion[];
}

const ATS = ({ score, suggestions }: ATSProps) => {
    const bgColor = score > 69 ? 'from-green-100' : score > 49 ? 'from-yellow-100' : 'from-red-100';
    const icon = score > 69 ? '/icons/ats-good.svg' : score > 49 ? '/icons/ats-warning.svg' : '/icons/ats-bad.svg';

    return (
        <div className={`bg-gradient-to-br ${bgColor} to-white p-6 rounded-2xl shadow-md w-full border border-gray-100`}>
            {/* Top Section */}
            <div className="flex items-center gap-4 mb-6">
                <img src={icon} alt="ATS Icon" className="w-14 h-14" />
                <h2 className="text-2xl font-bold text-gray-800">ATS Score - {score}/100</h2>
            </div>

            {/* Description Section */}
            <div className="mb-6 px-2">
                <h3 className="text-lg font-bold text-gray-800 mb-2">ATS Compatibility</h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                    An Applicant Tracking System (ATS) is used by companies to scan resumes for keywords and formatting. Your score reflects how well your resume is optimized for these systems.
                </p>
            </div>

            {/* Suggestions List */}
            <div className="flex flex-col gap-4 px-2">
                {suggestions.map((suggestion, index) => (
                    <div key={index} className="flex items-start gap-3">
                        <img
                            src={suggestion.type === 'good' ? '/icons/check.svg' : '/icons/warning.svg'}
                            alt={suggestion.type}
                            className="w-5 h-5 mt-1 flex-shrink-0"
                        />
                        <p className="text-sm text-gray-700">{suggestion.tip}</p>
                    </div>
                ))}
            </div>

            {/* Closing Line */}
            <p className="mt-8 px-2 text-sm font-semibold text-gray-600">
                Keep improving your resume to increase your chances of getting noticed by recruiters!
            </p>
        </div>
    )
}

export default ATS;