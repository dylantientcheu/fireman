import { defineConfig } from "vitepress";

const defaultSidebar = [
				{
					text: "Guide",
					items: [
						{ text: "Getting started", link: "/guide/" },
						{
							text: "Initializing Firestore",
							link: "/guide/#firestore-instance",
						},
					],
				},
				{
					text: "Firestore",
					items: [
						{ text: "Get documents", link: "/usage/#get" },
						{ text: "Add & update documents", link: "usage/#add" },
						{ text: "Delete documents", link: "/usage/#delete" },
					],
				},
			]

export default defineConfig({
	title: "Fireman",
	description: "Firestore helper functions.",
	logo: "/logo.svg",
	head: [
		["meta", { property: "og:title", content: "Fireman" }],
		["meta", { property: "og:site_name", content: "Fireman" }],
		["meta", { property: "og:type", content: "website" }],
		["link", { rel: "icon", href: "/logo.svg", type: "image/svg+xml" }],
		[
			"meta",
			{ property: "og:description", content: "Firestore helper functions" },
		],
		[
			"meta",
			{ property: "og:url", content: "https://blurdylan.github.com/fireman" },
		],
		[
			"meta",
			{ property: "og:image", content: "https://Fireman.dev/opengraph.png" },
		],
		["meta", { property: "og:image:width", content: "600" }],
		["meta", { property: "og:image:height", content: "315" }],
		["meta", { name: "twitter:card", content: "summary_large_image" }],
	],

	themeConfig: {
		nav: [
			{ text: "Guide", link: "/guide/" },
			{ text: "Usage", link: "/usage/" },
		],
		sidebar: {
			"/guide/": defaultSidebar,
      "/usage/": defaultSidebar,
		},
		footer: {
			message: "Released under the MIT License.",
			copyright: "Copyright © 2022 Dylan Tientcheu",
		},
	},
});
