import { defineConfig } from "vitepress";

const defaultSidebar = [
	{
		text: "Guide",
		items: [
			{ text: "Getting started", link: "/guide/" },
		],
	},
	{
		text: "@fireman/web",
		collapsible: true,
		items: [
			{
				text: "Firestore",
				link: "/usage/firestore/",
			},
		],
	},
	{
		text: "@fireman/admin",
		collapsible: true,
		collapsed: true,
		items: [
			{
				text: "Firestore",
				link: "/usage/firestore/server#managing-data",
			},
			{
				text: "Auth",
				link: "/usage/auth/",
			},
		],
	},
];

export default defineConfig({
	title: "Fireman",
	description:
		"Comprehensive Firebase helper functions. Fireman abstracts the complexity of Firebase functions and make them easy to use on both the client and server.",

	head: [
		["meta", { property: "og:title", content: "Fireman" }],
		["meta", { property: "og:site_name", content: "Fireman" }],
		["meta", { property: "og:type", content: "website" }],
		["link", { rel: "icon", href: "/logo.svg", type: "image/svg+xml" }],
		[
			"meta",
			{
				property: "og:description",
				content:
					"Comprehensive Firebase helper functions. Fireman abstracts the complexity of Firebase functions and make them easy to use on both the client and server.",
			},
		],
		[
			"meta",
			{ property: "og:url", content: "https://fireman-fns.netlify.app/" },
		],
		[
			"meta",
			{
				property: "og:image",
				content: "https://fireman-fns.netlify.app/opengraph.png",
			},
		],
		["meta", { property: "og:image:width", content: "600" }],
		["meta", { property: "og:image:height", content: "301" }],
		["meta", { name: "twitter:card", content: "summary_large_image" }],
	],
	lastUpdated: true,

	themeConfig: {
		logo: "/logo.svg",
		nav: [
			{ text: "Guide", link: "/guide/" },
			{ text: "Usage", link: "/usage/firestore/" },
		],
		sidebar: {
			"/guide/": defaultSidebar,
			"/usage/": defaultSidebar,
		},
		footer: {
			message: "Released under the MIT License.",
			copyright: "Copyright © 2022-present Dylan Tientcheu",
		},
		socialLinks: [
			{ icon: "github", link: "https://github.com/blurdylan/fireman" },
		],
	},
});
