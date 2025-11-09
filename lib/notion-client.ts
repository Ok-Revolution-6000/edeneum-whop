import { Client } from "@notionhq/client";
import { NotionAPI } from "notion-client";

// Official Notion client for metadata
export const notionClient = new Client({
	auth: process.env.NOTION_API_KEY,
});

// Unofficial client for page rendering
export const notionRenderer = new NotionAPI();

// Page IDs for different content
// Format: add dashes to match Notion's UUID format
export const NOTION_PAGES = {
	FREE_CHAPTER: "2a2dd145-6da8-80f6-8233-e2684dfbf7d3",
	// Add more page IDs as you create them
	// MEMBERSHIP_RESOURCES: "page-id-here",
	// NICOMACHEAN_ETHICS_FULL: "page-id-here",
};
