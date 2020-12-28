import { Link, Typography } from '@material-ui/core';
import { MarkdownToJSX } from 'markdown-to-jsx';
import React, { useEffect, useState } from 'react';
import infoTextMarkdown from './info.md';

const MdOverrideTypography = ({
  children,
}: // ...props
React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLParagraphElement>,
  HTMLParagraphElement
>): JSX.Element => <Typography paragraph>{children}</Typography>;

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
  p: MdOverrideTypography,
  a: MdOverrideLink,
};

export const DialogInfoMarkdown = () => {
  const [infoMdText, setInfoMdText] = useState('');

  // https://github.com/facebook/create-react-app/issues/2961#issuecomment-322916352
  useEffect(() => {
    fetch(infoTextMarkdown)
      .then((response) => response.text())
      .then((text) => {
        // Logs a string of Markdown content.
        // Now you could use e.g. <rexxars/react-markdown> to render it.
        // console.log(text);
        setInfoMdText(text);
      });
  }, []);

  return (
    <Markdown options={{ wrapper: React.Fragment, overrides: mdOverrides }}>
      {infoMdText}
    </Markdown>
  );
};

export default mdOverrides;
