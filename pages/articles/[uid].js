import Head from "next/head";
import { PrismicLink, PrismicText, SliceZone } from "@prismicio/react";
import * as prismicH from "@prismicio/helpers";
import { serialize } from "next-mdx-remote/serialize";

import { createClient } from "../../prismicio";
import { components } from "../../slices";
import { Layout } from "../../components/Layout";
import { Bounded } from "../../components/Bounded";

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

const Article = ({
  article,
  latestArticles,
  navigation,
  settings,
  mdxSource,
}) => {
  const date = prismicH.asDate(
    article.data.publishDate || article.first_publication_date
  );

  console.log("article", article);

  return (
    <Layout
      withHeaderDivider={false}
      withProfile={false}
      navigation={navigation}
      settings={settings}
    >
      <Head>
        <title>
          {prismicH.asText(article.data.title)} |{" "}
          {prismicH.asText(settings.data.name)}
        </title>
      </Head>
      <Bounded>
        <PrismicLink
          href="/"
          className="font-semibold tracking-tight text-slate-400"
        >
          &larr; Back to articles
        </PrismicLink>
      </Bounded>
      <article>
        <Bounded className="pb-0">
          <h1 className="mb-3 text-3xl font-semibold tracking-tighter text-slate-800 md:text-4xl">
            <PrismicText field={article.data.title} />
          </h1>
          <p className="font-serif italic tracking-tighter text-slate-500">
            {dateFormatter.format(date)}
          </p>
        </Bounded>
        <SliceZone slices={article.data.slices} components={components} />
      </article>
    </Layout>
  );
};

export default Article;

const mapTextToMarkdown = async (article) => {
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

export async function getStaticProps({ params, previewData }) {
  const client = createClient({ previewData });
  const article = await client.getByUID("article", params.uid);
  const articleWithMarkdown = await mapTextToMarkdown(article);
  const navigation = await client.getSingle("navigation");
  const settings = await client.getSingle("settings");

  return {
    props: {
      article: articleWithMarkdown,
      navigation,
      settings,
    },
  };
}

export async function getStaticPaths() {
  const client = createClient();

  const articles = await client.getAllByType("article");

  return {
    paths: articles.map((article) => prismicH.asLink(article)),
    fallback: false,
  };
}
