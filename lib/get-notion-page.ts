import { notionClient } from "./notion-client";
import type { BlockObjectResponse } from "@notionhq/client/build/src/api-endpoints";

async function fetchAllBlocks(blockId: string): Promise<BlockObjectResponse[]> {
	const blocks: BlockObjectResponse[] = [];
	let cursor: string | undefined = undefined;

	// Fetch all blocks with pagination
	do {
		const response = await notionClient.blocks.children.list({
			block_id: blockId,
			page_size: 100,
			start_cursor: cursor,
		});

		const blockResults = response.results.filter(
			(block): block is BlockObjectResponse => "type" in block,
		);

		blocks.push(...blockResults);
		cursor = response.has_more ? response.next_cursor ?? undefined : undefined;
	} while (cursor);

	// Recursively fetch children for blocks that have them
	for (const block of blocks) {
		if (block.has_children) {
			const children = await fetchAllBlocks(block.id);
			// @ts-ignore - Add children to block
			block.children = children;
		}
	}

	return blocks;
}

export async function getNotionPage(pageId: string) {
	try {
		// Fetch page metadata
		const page = await notionClient.pages.retrieve({
			page_id: pageId,
		});

		// Fetch all blocks recursively
		const blocks = await fetchAllBlocks(pageId);

		return {
			page,
			blocks,
		};
	} catch (error) {
		console.error("Error fetching Notion page:", error);
		throw new Error("Failed to load content from Notion");
	}
}
