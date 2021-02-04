import { Link, Typography } from '@material-ui/core';
import { Variant } from '@material-ui/core/styles/createTypography';
import Markdown, { MarkdownToJSX } from 'markdown-to-jsx';
import React, { useEffect, useState } from 'react';

// higher-order-component for variable typography "variants"
function wrapMdOverrideTypographyHOC(variant?: Variant | 'inherit') {
  return function variableMdOverrideTypographyHOC({
    children,
  }: React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLParagraphElement>,
    HTMLParagraphElement
  >): JSX.Element {
    return (
      <Typography variant={variant} paragraph>
        {children}
      </Typography>
    );
  };
}

const MdOverrideLink = ({
  children,
  title,
  href,
}: // ...props
React.DetailedHTMLProps<
  React.AnchorHTMLAttributes<HTMLAnchorElement>,
  HTMLAnchorElement
  // JSX.IntrinsicElements.a
>): JSX.Element => (
  // <a></a>
  <Link title={title} href={href} target="_blank">
    {children}
  </Link>
);

const mdOverrides: MarkdownToJSX.Overrides = {
  a: MdOverrideLink,
  h1: wrapMdOverrideTypographyHOC('h1'),
  h2: wrapMdOverrideTypographyHOC('h2'),
  p: wrapMdOverrideTypographyHOC('body1'),
};

export const MarkdownFromFile = ({
  f,
  style,
}: {
  f: string;
  style?: React.CSSProperties;
}): JSX.Element => {
  const [infoMdText, setInfoMdText] = useState('');

  // https://github.com/facebook/create-react-app/issues/2961#issuecomment-322916352
  useEffect(() => {
    console.log(`loaded md: ${f}`);
    fetch(f)
      .then((response) => response.text())
      .then((text) => {
        // Logs a string of Markdown content.
        // Now you could use e.g. <rexxars/react-markdown> to render it.
        // console.log(text);
        setInfoMdText(text);
      });
  }, [f]);

  return (
    <Markdown
      options={{ wrapper: React.Fragment, overrides: mdOverrides }}
      {...style}
      // style={{
      //   height: 'auto',
      // }}
    >
      {infoMdText}
    </Markdown>
  );
};

export default mdOverrides;
