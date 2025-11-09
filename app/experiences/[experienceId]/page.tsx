import { headers } from "next/headers";
import { whopsdk } from "@/lib/whop-sdk";
import { getNotionPage } from "@/lib/get-notion-page";
import { NOTION_PAGES } from "@/lib/notion-client";
import { NotionRenderer } from "@/components/notion-renderer";

// Product IDs for different content
const PRODUCTS = {
	FREE_CHAPTER: "prod_BYEzhE8cReSD9", // Enhanced Ethics Book 1, Ch 1
	MEMBERSHIP: "prod_wxz7BAYlwrnr8", // Edeneum Membership
};

export default async function ExperiencePage({
	params,
}: {
	params: Promise<{ experienceId: string }>;
}) {
	const { experienceId } = await params;
	// Ensure the user is logged in on whop.
	const { userId } = await whopsdk.verifyUserToken(await headers());

	// Fetch the neccessary data we want from whop.
	const [experience, user, access] = await Promise.all([
		whopsdk.experiences.retrieve(experienceId),
		whopsdk.users.retrieve(userId),
		whopsdk.users.checkAccess(experienceId, { id: userId }),
	]);

	const displayName = user.name || `@${user.username}`;

	// Check which products the user has access to
	const userProducts = experience.products.map((p) => p.id);
	const hasFreeChapter = userProducts.includes(PRODUCTS.FREE_CHAPTER);
	const hasMembership = userProducts.includes(PRODUCTS.MEMBERSHIP);

	// Fetch Notion content if user has access to free chapter
	let freeChapterContent = null;
	if (hasFreeChapter) {
		try {
			freeChapterContent = await getNotionPage(NOTION_PAGES.FREE_CHAPTER);
		} catch (error) {
			console.error("Failed to fetch Notion content:", error);
		}
	}

	return (
		<div className="flex flex-col h-screen">
			{/* Header */}
			<div className="flex justify-between items-center gap-4 p-6 border-b border-gray-a4">
				<div>
					<h1 className="text-6 font-bold">Edeneum</h1>
					<p className="text-2 text-gray-10">Welcome, {displayName}</p>
				</div>
			</div>

			{/* Content Area */}
			<div className="flex-1 overflow-auto">
				{hasFreeChapter && freeChapterContent ? (
					<NotionRenderer content={freeChapterContent} />
				) : hasFreeChapter && !freeChapterContent ? (
					<div className="flex flex-col items-center justify-center h-full p-8 gap-4">
						<h2 className="text-7 font-bold">Loading...</h2>
						<p className="text-3 text-gray-10">
							Fetching your content from Notion
						</p>
					</div>
				) : hasMembership ? (
					<div className="flex flex-col items-center justify-center h-full p-8 gap-4">
						<h2 className="text-7 font-bold">Membership Resources</h2>
						<p className="text-3 text-gray-10 text-center max-w-xl">
							Welcome to your membership! Community and resources will be added
							here soon.
						</p>
					</div>
				) : (
					<div className="flex flex-col items-center justify-center h-full p-8 gap-4">
						<h2 className="text-7 font-bold">No Access</h2>
						<p className="text-3 text-gray-10 text-center max-w-xl">
							You don't have access to any content yet. Please purchase a
							product to get started.
						</p>
					</div>
				)}
			</div>
		</div>
	);
}
