import { serialize } from "next-mdx-remote/serialize";

export const mapTextToMarkdown = async (article) => {
  const slices = await Promise.all(
    article.data.slices.map(async (slice) => {
      if (slice.slice_type === "text") {
        const markdown = await serialize(slice?.primary?.text?.[0]?.text);
        return {
          ...slice,
          primary: {
            ...slice.primary,
            markdown,
          },
        };
      }
      return slice;
    })
  );
  return {
    ...article,
    data: {
      ...article.data,
      slices,
    },
  };
};
