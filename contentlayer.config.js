import { defineDocumentType, makeSource } from "contentlayer/source-files";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";

/** @type {import('contentlayer/source-files').ComputedFields} */
const computedFields = {
    slug: {
        type: "string",
        resolve: (doc) => `/${doc._raw.flattenedPath}`,
    },
    slugAsParams: {
        type: "string",
        resolve: (doc) => doc._raw.flattenedPath.split("/").slice(1).join("/"),
    },
    readTimeMinutes: {
        type: "number",
        resolve: (doc) =>
            ((text) => {
                const wordsPerMinute = 200;
                const noOfWords = text.split(/\s/g).length;
                const minutes = noOfWords / wordsPerMinute;
                const readTime = Math.ceil(minutes);
                return `${readTime} min read`;
            })(doc.body.raw),
    },
};

export const Page = defineDocumentType(() => ({
    name: "Page",
    filePathPattern: `pages/**/*.mdx`,
    contentType: "mdx",
    fields: {
        title: {
            type: "string",
            required: true,
        },
        description: {
            type: "string",
        },
    },
    computedFields,
}));

export const Guides = defineDocumentType(() => ({
    name: "Guides",
    filePathPattern: `guides/**/*.mdx`,
    contentType: "mdx",
    fields: {
        title: {
            type: "string",
            required: true,
        },
        description: {
            type: "string",
        },
        date: {
            type: "date",
            required: true,
        },
        tags: {
            type: "list",
            of: {
                type: "string",
            },
        },
        draft: {
            type: "boolean",
        },
        archived: {
            type: "boolean",
            default: false,
        },
    },
    computedFields,
}));

export default makeSource({
    contentDirPath: "./content",
    documentTypes: [Page, Guides],
    mdx: {
        remarkPlugins: [remarkMath],
        rehypePlugins: [rehypeKatex],
    },
});
