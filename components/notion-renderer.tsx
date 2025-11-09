"use client";

import type { BlockObjectResponse } from "@notionhq/client/build/src/api-endpoints";

interface NotionRendererProps {
	content: {
		page: any;
		blocks: BlockObjectResponse[];
	};
}

export function NotionRenderer({ content }: NotionRendererProps) {
	const { blocks } = content;

	return (
		<div className="notion-container max-w-2xl mx-auto px-8 py-12">
			<div className="notion-content space-y-4">
				{blocks.map((block) => (
					<NotionBlock key={block.id} block={block} />
				))}
			</div>
		</div>
	);
}

function NotionBlock({ block }: { block: any }) {
	const { type } = block;

	switch (type) {
		case "paragraph":
			return (
				<p className="text-base leading-relaxed my-2">
					<RichText content={block.paragraph.rich_text} />
					{block.children && <ChildBlocks blocks={block.children} />}
				</p>
			);

		case "heading_1":
			return (
				<h1 className="text-4xl font-bold mt-8 mb-4">
					<RichText content={block.heading_1.rich_text} />
				</h1>
			);

		case "heading_2":
			return (
				<h2 className="text-3xl font-bold mt-6 mb-3">
					<RichText content={block.heading_2.rich_text} />
				</h2>
			);

		case "heading_3":
			return (
				<h3 className="text-2xl font-bold mt-4 mb-2">
					<RichText content={block.heading_3.rich_text} />
				</h3>
			);

		case "bulleted_list_item":
			return (
				<li className="ml-6 list-disc my-1">
					<RichText content={block.bulleted_list_item.rich_text} />
					{block.children && <ChildBlocks blocks={block.children} />}
				</li>
			);

		case "numbered_list_item":
			return (
				<li className="ml-6 list-decimal my-1">
					<RichText content={block.numbered_list_item.rich_text} />
					{block.children && <ChildBlocks blocks={block.children} />}
				</li>
			);

		case "quote":
			return (
				<blockquote className="border-l-4 border-gray-300 pl-4 italic my-4 text-gray-700">
					<RichText content={block.quote.rich_text} />
					{block.children && <ChildBlocks blocks={block.children} />}
				</blockquote>
			);

		case "code":
			return (
				<pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto my-4">
					<code className="text-sm font-mono">
						<RichText content={block.code.rich_text} />
					</code>
				</pre>
			);

		case "callout":
			return (
				<div className="flex gap-3 p-4 my-4 bg-gray-50 rounded-lg border border-gray-200">
					{block.callout.icon?.emoji && (
						<span className="text-2xl">{block.callout.icon.emoji}</span>
					)}
					<div className="flex-1">
						<RichText content={block.callout.rich_text} />
						{block.children && <ChildBlocks blocks={block.children} />}
					</div>
				</div>
			);

		case "toggle":
			return (
				<details className="my-2">
					<summary className="cursor-pointer font-medium hover:text-blue-600">
						<RichText content={block.toggle.rich_text} />
					</summary>
					<div className="ml-4 mt-2">
						{block.children && <ChildBlocks blocks={block.children} />}
					</div>
				</details>
			);

		case "image":
			const imageUrl =
				block.image.type === "external"
					? block.image.external.url
					: block.image.file?.url;
			const caption = block.image.caption;

			return (
				<figure className="my-6">
					{imageUrl && (
						<img
							src={imageUrl}
							alt={caption?.[0]?.plain_text || "Image"}
							className="w-full rounded-lg"
						/>
					)}
					{caption && caption.length > 0 && (
						<figcaption className="text-sm text-gray-600 text-center mt-2 italic">
							<RichText content={caption} />
						</figcaption>
					)}
				</figure>
			);

		case "video":
			const videoUrl =
				block.video.type === "external"
					? block.video.external.url
					: block.video.file?.url;

			return (
				<div className="my-6">
					{videoUrl && (
						<video controls className="w-full rounded-lg">
							<source src={videoUrl} />
							Your browser does not support the video tag.
						</video>
					)}
				</div>
			);

		case "audio":
			const audioUrl =
				block.audio.type === "external"
					? block.audio.external.url
					: block.audio.file?.url;
			const audioCaption = block.audio.caption;

			return (
				<div className="my-6">
					{audioUrl && (
						<div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
							<audio controls className="w-full">
								<source src={audioUrl} />
								Your browser does not support the audio tag.
							</audio>
							{audioCaption && audioCaption.length > 0 && (
								<div className="text-sm text-gray-600 mt-2 text-center">
									<RichText content={audioCaption} />
								</div>
							)}
						</div>
					)}
				</div>
			);

		case "file":
			const fileUrl =
				block.file.type === "external"
					? block.file.external.url
					: block.file.file?.url;
			const fileName = block.file.name || "Download file";

			return (
				<div className="my-4">
					{fileUrl && (
						<a
							href={fileUrl}
							target="_blank"
							rel="noopener noreferrer"
							className="flex items-center gap-3 p-4 border rounded-lg hover:bg-gray-50 transition"
						>
							<svg
								className="w-6 h-6 text-gray-600"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
								/>
							</svg>
							<div>
								<div className="font-medium text-blue-600 hover:underline">
									{fileName}
								</div>
								{block.file.caption && block.file.caption.length > 0 && (
									<div className="text-sm text-gray-600">
										<RichText content={block.file.caption} />
									</div>
								)}
							</div>
						</a>
					)}
				</div>
			);

		case "embed":
			return (
				<div className="my-6">
					<iframe
						src={block.embed.url}
						className="w-full h-96 rounded-lg border"
						title="Embedded content"
						allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
					/>
				</div>
			);

		case "bookmark":
			return (
				<a
					href={block.bookmark.url}
					target="_blank"
					rel="noopener noreferrer"
					className="block my-4 p-4 border rounded-lg hover:bg-gray-50 transition"
				>
					<div className="text-blue-600 hover:underline font-medium">
						{block.bookmark.url}
					</div>
					{block.bookmark.caption && block.bookmark.caption.length > 0 && (
						<div className="text-sm text-gray-600 mt-1">
							<RichText content={block.bookmark.caption} />
						</div>
					)}
				</a>
			);

		case "divider":
			return <hr className="my-6 border-t border-gray-300" />;

		case "table_of_contents":
			return (
				<div className="my-4 p-4 bg-gray-50 rounded-lg">
					<h4 className="font-bold mb-2">Table of Contents</h4>
					<p className="text-sm text-gray-600">
						(Auto-generated table of contents)
					</p>
				</div>
			);

		case "column_list":
			return (
				<div className="grid grid-cols-2 gap-4 my-4">
					{block.children &&
						block.children.map((child: any) => (
							<div key={child.id} className="column">
								<NotionBlock block={child} />
							</div>
						))}
				</div>
			);

		case "column":
			return (
				<div>
					{block.children && <ChildBlocks blocks={block.children} />}
				</div>
			);

		case "table":
			return (
				<div className="my-6 overflow-x-auto">
					<table className="min-w-full border-collapse border border-gray-300">
						<tbody>
							{block.children &&
								block.children.map((row: any) => (
									<NotionBlock key={row.id} block={row} />
								))}
						</tbody>
					</table>
				</div>
			);

		case "table_row":
			return (
				<tr className="border-b border-gray-200">
					{block.table_row.cells.map((cell: any[], idx: number) => (
						<td
							key={idx}
							className="border border-gray-300 px-4 py-2 text-sm"
						>
							<RichText content={cell} />
						</td>
					))}
				</tr>
			);

		case "to_do":
			return (
				<div className="flex items-start gap-2 my-2">
					<input
						type="checkbox"
						checked={block.to_do.checked}
						readOnly
						className="mt-1"
					/>
					<span
						className={block.to_do.checked ? "line-through text-gray-500" : ""}
					>
						<RichText content={block.to_do.rich_text} />
					</span>
					{block.children && <ChildBlocks blocks={block.children} />}
				</div>
			);

		default:
			return (
				<div className="text-gray-500 text-sm my-2 p-2 bg-yellow-50 border border-yellow-200 rounded">
					⚠️ Unsupported block type: <code className="font-mono">{type}</code>
				</div>
			);
	}
}

function ChildBlocks({ blocks }: { blocks: any[] }) {
	return (
		<div className="ml-4 mt-2">
			{blocks.map((block) => (
				<NotionBlock key={block.id} block={block} />
			))}
		</div>
	);
}

function RichText({ content }: { content: any[] }) {
	if (!content || content.length === 0) return null;

	return (
		<>
			{content.map((text, index) => {
				const { annotations } = text;
				let element: any = text.plain_text;

				if (annotations.bold) {
					element = <strong key={index}>{element}</strong>;
				}
				if (annotations.italic) {
					element = <em key={index}>{element}</em>;
				}
				if (annotations.code) {
					element = (
						<code
							key={index}
							className="bg-gray-100 px-1.5 py-0.5 rounded text-sm font-mono text-red-600"
						>
							{element}
						</code>
					);
				}
				if (annotations.strikethrough) {
					element = <s key={index}>{element}</s>;
				}
				if (annotations.underline) {
					element = <u key={index}>{element}</u>;
				}

				// Color support
				if (annotations.color && annotations.color !== "default") {
					const colorClass = getColorClass(annotations.color);
					element = (
						<span key={index} className={colorClass}>
							{element}
						</span>
					);
				}

				if (text.href) {
					return (
						<a
							key={index}
							href={text.href}
							className="text-blue-600 hover:underline"
							target="_blank"
							rel="noopener noreferrer"
						>
							{element}
						</a>
					);
				}

				return <span key={index}>{element}</span>;
			})}
		</>
	);
}

function getColorClass(color: string): string {
	const colorMap: Record<string, string> = {
		gray: "text-gray-600",
		brown: "text-amber-700",
		orange: "text-orange-600",
		yellow: "text-yellow-600",
		green: "text-green-600",
		blue: "text-blue-600",
		purple: "text-purple-600",
		pink: "text-pink-600",
		red: "text-red-600",
		gray_background: "bg-gray-100 px-1",
		brown_background: "bg-amber-100 px-1",
		orange_background: "bg-orange-100 px-1",
		yellow_background: "bg-yellow-100 px-1",
		green_background: "bg-green-100 px-1",
		blue_background: "bg-blue-100 px-1",
		purple_background: "bg-purple-100 px-1",
		pink_background: "bg-pink-100 px-1",
		red_background: "bg-red-100 px-1",
	};
	return colorMap[color] || "";
}
