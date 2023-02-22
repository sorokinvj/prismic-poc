import * as prismicH from "@prismicio/helpers";
import { PrismicRichText } from "@prismicio/react";

import { Bounded } from "../../components/Bounded";

const htmlSerializer = (type, element, content, children, key) => {
  if (type === "heading2") {
    var id = element.text.replace(/\W+/g, "-").toLowerCase();
    return '<h2 id="' + id + '">' + children.join("") + "</h2>";
  }
};

const components = {
  h2: ({ children }) => {
    var id = element.text.replace(/\W+/g, "-").toLowerCase();
    return (
      <h1
        id={id}
        className="text-2xl font-bold leading-tight md:text-3xl md:leading-tight"
      >
        {children}
      </h1>
    );
  },
};

const RichText = ({ slice }) => {
  return (
    <Bounded as="section">
      {prismicH.isFilled.richText(slice.primary.rich_text) && (
        <div className="font-serif leading-relaxed md:text-xl md:leading-relaxed">
          <PrismicRichText
            field={slice.primary.rich_text}
            components={components}
          />
        </div>
      )}
    </Bounded>
  );
};

export default RichText;
