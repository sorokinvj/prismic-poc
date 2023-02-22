import Head from "next/head";
import { PrismicLink, PrismicText, SliceZone } from "@prismicio/react";
import * as prismicH from "@prismicio/helpers";

import { createClient } from "../../prismicio";
import { components } from "../../slices";
import { Layout } from "../../components/Layout";
import { Bounded } from "../../components/Bounded";
import { mapTextToMarkdown } from "../../utils";
import { useRouter } from "next/router";

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

const ArticleNavigaiton = ({ article, articleUrl }) => {
  const richTextSlices = article.data.slices.filter(
    (slice) => slice.slice_type === "rich_text"
  );

  const h2 = richTextSlices.reduce((acc, slice) => {
    const h2 = slice.primary?.rich_text?.filter(
      (text) => text.type === "heading2"
    );
    acc = [...acc, ...h2];
    return acc;
  }, []);

  return (
    <div className="mx-auto w-full max-w-3xl px-4 md:px-0 lg:py-12">
      <ul>
        <li className="py-2 text-sm font-bold tracking-tight text-slate-400 hover:text-slate-500">
          Article navigation
        </li>
        {h2.map((heading, index) => (
          <li key={index}>
            <PrismicLink
              href={`${articleUrl}#${heading.text
                .toLowerCase()
                .replace(/\W+/g, "-")}`}
              className="py-2 text-sm tracking-tight text-slate-400 hover:text-slate-500"
            >
              {heading.text}
            </PrismicLink>
          </li>
        ))}
      </ul>
    </div>
  );
};

const Article = ({ article, navigation, settings }) => {
  const date = prismicH.asDate(
    article.data.publishDate || article.first_publication_date
  );

  const router = useRouter();
  const articleUrl = router.pathname.replace("[uid]", router.query.uid);

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
      <ArticleNavigaiton article={article} articleUrl={articleUrl} />
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

export async function getServerSideProps({ params, previewData }) {
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
