import React from 'react';

interface ScoreBadgeProps {
    score: number;
}

const ScoreBadge = ({ score }: ScoreBadgeProps) => {
    let label = "";
    let badgeClass = "";
    let textClass = "";

    if (score > 69) {
        label = "Strong";
        badgeClass = "bg-badge-green";
        textClass = "text-green-600";
    } else if (score > 49) {
        label = "Good Start";
        badgeClass = "bg-badge-yellow";
        textClass = "text-yellow-600";
    } else {
        label = "Needs Improvement";
        badgeClass = "bg-badge-red";
        textClass = "text-red-600";
    }

    return (
        <div className={`score-badge ${badgeClass}`}>
            <p className={`text-xs font-bold ${textClass}`}>{label}</p>
        </div>
    );
};

export default ScoreBadge;
