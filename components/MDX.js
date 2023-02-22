import React, { useRef } from "react";

import Image from "next/image";

import { kebabCase } from "lodash/";

export const helperConvertToKebabCase = (props) => {
  if (typeof props.children !== "string") return;
  const textContent = props.children;

  return kebabCase(textContent);
};

export const helperSetAnchorTarget = (props) => {
  if (typeof props.href !== "string") return "_self";
  if (props.href.match(/http/gi) || props.title?.match(/json/gi))
    return "_blank";
  return "_self";
};

const CopyIcon = ({ ...props }) => {
  const { fill = "#fff", pathfill = "#7B94D4" } = props;
  return (
    <svg
      width="32"
      height="32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      {...props}
    >
      <rect width="32" height="32" rx="16" fill={fill} />
      <g>
        <path
          d="M20.285 10h-7.178a.108.108 0 0 0-.108.107v.75c0 .06.049.107.108.107h6.642v9.215c0 .059.049.107.108.107h.75a.107.107 0 0 0 .107-.107v-9.75a.428.428 0 0 0-.429-.429Zm-1.714 1.714h-6.857a.428.428 0 0 0-.429.429v7.107c0 .114.046.223.126.303l2.321 2.321c.03.03.063.054.1.074v.025h.055a.422.422 0 0 0 .148.027h4.536a.428.428 0 0 0 .428-.429v-9.428a.428.428 0 0 0-.428-.429ZM13.83 20.61l-1.153-1.155h1.153v1.155Zm4.205.426h-3.348v-1.902a.536.536 0 0 0-.536-.536H12.25v-5.92h5.786v8.358Z"
          fill={pathfill}
        />
      </g>
      <defs>
        <clipPath id="a">
          <path fill={fill} transform="translate(10 10)" d="M0 0h12v12H0z" />
        </clipPath>
      </defs>
    </svg>
  );
};

const Pre = (props) => {
  const codeRef = useRef(null);
  const handleClick = () => {
    if (codeRef.current?.textContent)
      navigator.clipboard.writeText(codeRef.current?.textContent);
  };
  return (
    <pre className="relative my-8 rounded-lg bg-primary p-4 text-white">
      <div className="absolute top-3 right-3">
        <button
          className="border-spacing-0 transition-transform duration-500 hover:scale-110"
          onClick={handleClick}
        >
          <CopyIcon />
        </button>
      </div>
      <div ref={codeRef}>{props.children}</div>
    </pre>
  );
};
export const Heading = {
  H1: (props) => {
    const id = helperConvertToKebabCase(props);
    return (
      <div id={id}>
        <h1 className="mb-4 text-2xl sm:text-4xl" {...props} id={id} />
      </div>
    );
  },
  H2: (props) => {
    const id = helperConvertToKebabCase(props);
    return (
      <div id={id}>
        <h2 className="mb-4 text-2xl sm:text-3xl" {...props} id={id} />
      </div>
    );
  },
  H3: (props) => {
    const id = helperConvertToKebabCase(props);
    return (
      <div id={id}>
        <h3 className="mb-4 text-xl sm:text-2xl" {...props} id={id} />
      </div>
    );
  },
  H4: (props) => {
    const id = helperConvertToKebabCase(props);
    return <h4 className="mb-4 text-base sm:text-xl" {...props} id={id} />;
  },
  H5: (props) => {
    const id = helperConvertToKebabCase(props);
    return <h5 className="mb-4 text-base" {...props} id={id} />;
  },
};

const Img = (props) => {
  const [alt = "", width, height] = props.alt?.split("|") || [];
  const imgHeight = !isNaN(parseInt(height)) ? parseInt(height) : "100%";
  const imgWidth = !isNaN(parseInt(width)) ? parseInt(width) : "100%";
  return (
    <Image
      {...props}
      width={imgWidth}
      height={imgHeight}
      alt={alt}
      layout="intrinsic"
      className="my-6"
    />
  );
};

const WarningIcon = (props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      strokeWidth="1.5"
      stroke="#262626"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 8v4M12 16h0" />
    </svg>
  );
};

const Alert = ({ description }) => {
  return (
    <div className="border-black-default flex w-full max-w-2xl flex-row items-center gap-3 rounded-md border bg-blue-100 p-4">
      <div>
        <WarningIcon />
      </div>
      <p
        className="text-black-300 [&>a]:font-bold [&>a]:text-blue-700 [&>a]:hover:underline"
        dangerouslySetInnerHTML={{ __html: description }}
      />
    </div>
  );
};

/* The code above does the following, explained in English:
1. Get the alt attribute from the props
2. Split the alt attribute on '{' to get an array of substrings
3. Get the first substring, which will be the alt text
4. Get the second substring, which will be the width and height
5. Get the width and height from the second substring
6. Return the Image component with the height, width, alt, and other props passed in */
export const mdxComponents = {
  // TEXT
  h1: Heading.H1,
  h2: Heading.H2,
  h3: Heading.H3,
  h4: Heading.H4,
  h5: Heading.H5,
  strong: (props) => (
    <strong role="strong" className="font-semibold" {...props} />
  ),
  p: (props) => (
    <p role="paragraph" className="mb-4 text-base font-light" {...props} />
  ),
  // IMAGES
  img: Img,
  // LINKS
  a: (props) => {
    const target = helperSetAnchorTarget(props);
    return (
      <a
        target={target}
        className="font-semibold text-blue-700 hover:underline "
        {...props}
      />
    );
  },
  // LISTS
  ol: (props) => (
    <ol className="mb-4 ml-6 list-decimal text-base sm:text-lg" {...props} />
  ),
  ul: (props) => (
    <ul className="mb-4 ml-6 list-disc text-base sm:text-lg" {...props} />
  ),
  li: (props) => <li className="text-base font-light" {...props} />,
  // TABLES
  thead: (props) => <thead {...props} />,
  th: (props) => (
    <th
      className="border-neutral5 min-w-[130px] border-solid py-2 px-2 text-left text-base font-semibold last-of-type:text-right md:text-xl"
      {...props}
    />
  ),
  td: (props) => (
    <td
      className="border-neutral4 min-w-[160px] border-b-2 border-solid py-2 px-2 pr-2 text-sm font-light last-of-type:text-right md:text-base"
      {...props}
    />
  ),
  tbody: (props) => <tbody {...props} />,
  table: (props) => (
    <table
      className="mb-4 block w-full max-w-[1300px] table-auto overflow-x-scroll"
      {...props}
    />
  ),
  hr: <hr />,
  code: (props) => <code className="text-sm font-normal" {...props} />,
  pre: Pre,

  // REACT COMPONENTS. Kept as a react example
  NavBlocks: (props) => <div {...props} />,
  Alert: (props) => {
    return (
      <div className="my-8 block w-full">
        <Alert {...props} />
      </div>
    );
  },
};
