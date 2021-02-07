import { Grid, Link, Typography } from '@material-ui/core';
import { Variant } from '@material-ui/core/styles/createTypography';
import Markdown, { MarkdownToJSX } from 'markdown-to-jsx';
import React, { useEffect, useState } from 'react';
//
// imports for markdown
import { ReactComponent as ViewerLayoutDiagram } from '../../img/layout-diagram.svg';

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
>): JSX.Element => (
  <Link title={title} href={href} target="_blank">
    {children}
  </Link>
);

const mdOverrides: MarkdownToJSX.Overrides = {
  a: MdOverrideLink,
  h1: wrapMdOverrideTypographyHOC('h1'),
  h2: wrapMdOverrideTypographyHOC('h2'),
  p: wrapMdOverrideTypographyHOC('body1'),
  ViewerLayoutDiagram: {
    // eslint-disable-next-line react/display-name
    component: () => (
      <Grid container justify="center">
        <Grid item xs={12} sm={10}>
          <ViewerLayoutDiagram style={{ width: '100%' }} />
        </Grid>
      </Grid>
    ),
  },
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
    <Markdown options={{ wrapper: React.Fragment, overrides: mdOverrides }} {...style}>
      {infoMdText}
    </Markdown>
  );
};

export default mdOverrides;
