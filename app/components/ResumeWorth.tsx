import React from "react";

interface ResumeWorthProps {
	resumeWorth: string
}

const ResumeWorth: React.FC<ResumeWorthProps> = ({ resumeWorth }) => {
	const estimatedWorthMatch = resumeWorth.match(/<Estimated Worth>\$(.+?)<\/Estimated Worth>/);
	const explanationMatch = resumeWorth.match(/<Explanation>([\s\S]*?)<\/Explanation>/);
	const improvementsMatch = resumeWorth.match(/<Improvement>([\s\S]*?)<\/Improvement>/);

	const estimatedWorth = estimatedWorthMatch ? estimatedWorthMatch[1] : 'N/A';
	const explanation = explanationMatch ? explanationMatch[1] : '';
	const improvements = improvementsMatch ? improvementsMatch[1] : '';

	const explanationItems = explanation.match(/<li>(.+?)(\/li)/g);
	const improvementsItems = improvements.match(/<li>(.+?)(\/li)/g);

	return (
		<div className="p-6 space-y-6 text-black">
			<div className="overflow-hidden rounded-lg bg-white shadow">
				<div className="px-4 py-5 sm:p-6">
					<h1 className="text-4xl font-bold mb-4">Estimated Worth: ${estimatedWorth}</h1>
				</div>
			</div>

			<div className="overflow-hidden rounded-lg bg-white shadow">
				<div className="px-4 py-5 sm:p-6">
					<h2 className="text-2xl font-semibold mb-4">Positives</h2>
					{explanationItems && (
						<ul className="list-disc list-inside">
							{explanationItems.map((item, index) => (
								<li key={index} className="mb-2">{item.replace(/<\/?li>/g, '').replace(/<\/?[^>]+(>|$)/g, '')}</li>
							))}
						</ul>
					)}
				</div>
			</div>

			<div className="overflow-hidden rounded-lg bg-white shadow">
				<div className="px-4 py-5 sm:p-6">
					<h2 className="text-2xl font-semibold mb-4">Improvements</h2>
					{improvementsItems && (
						<ul className="list-disc list-inside">
							{improvementsItems.map((item, index) => (
								<li key={index} className="mb-2">{item.replace(/<\/?li>/g, '').replace(/<\/?[^>]+(>|$)/g, '')}</li>
							))}
						</ul>
					)}
				</div>
			</div>
		</div>
	);






}

export default ResumeWorth