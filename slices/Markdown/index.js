import * as prismicH from "@prismicio/helpers";
import { PrismicRichText } from "@prismicio/react";

import { Bounded } from "../../components/Bounded";
import { MDXRemote } from "next-mdx-remote";
import { mdxComponents } from "../../components/MDX";

const Text = ({ slice }) => {
  return (
    <Bounded as="section">
      <div className="font-serif leading-relaxed md:text-xl md:leading-relaxed">
        <MDXRemote {...slice.primary.markdown} components={mdxComponents} />
      </div>
    </Bounded>
  );
};

export default Text;
