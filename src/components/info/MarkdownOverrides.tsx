import { Grid, Link, Typography } from '@material-ui/core';
import { Variant } from '@material-ui/core/styles/createTypography';
import { noop } from 'lodash';
import Markdown, { MarkdownToJSX } from 'markdown-to-jsx';
import React, { useEffect, useState } from 'react';
//
// imports for markdown
import { ReactComponent as ViewerLayoutDiagramSVG } from '../../img/layout-diagram.svg';
import ViewChanger from '../render/ViewChanger';
import { SettingsMenuButton } from '../settings/SettingsMenu';

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
  ViewerLayoutDiagram: function ViewerLayoutDiagram() {
    return (
      <Grid container justify="center" style={{ padding: '12px 0' }}>
        <Grid item xs={12} sm={9}>
          <ViewerLayoutDiagramSVG style={{ width: '100%' }} />
        </Grid>
      </Grid>
    );
  },
  ViewChangerDisplay: function ViewChangerDisplay() {
    return (
      <Grid container justify="center" alignItems="stretch">
        <Grid item>
          <Grid container direction="column">
            <Grid item>
              <ViewChanger vertical={true} changeFunc={noop} displayOnly />
            </Grid>
            <Grid item>
              <Typography align="center">Portrait</Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid item>
          <Grid container direction="column" style={{ height: '100%' }}>
            <Grid item style={{ margin: 'auto' }}>
              <ViewChanger vertical={false} changeFunc={noop} displayOnly />
            </Grid>
            <Grid item>
              <Typography align="center">Landscape</Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    );
  },
  SettingsMenuButton: function SettingsMenuButtonDisplay() {
    return (
      <Grid container justify="center">
        <Grid item>
          <SettingsMenuButton onClick={noop} displayOnly />
        </Grid>
      </Grid>
    );
  },
  SettingsInstructions: function SettingsInstructions() {
    return (
      <Grid container justify="center" direction="column">
        {/* <SettingsContext.Consumer>
          {({ setSettings, settingsWidgets }) =>
            getSettingsWidgetsGrouping(settingsWidgets).map((g) => (
              <Grid item xs container key={g.name} direction="column">
                <Grid item xs={5}>
                  <GroupDivider />
                  <GroupTitle icon={g.icon} title={g.name} />
                </Grid>
                <Grid item xs container direction="column">
                  <FormGroup>
                    {Object.entries(g.widgets).map(([k, widget]) => {
                      // widget will contain
                      // label, control, (checked or value)
                      // const {
                      return (
                        // <Grid item xs={5} key={k} style={{ display: 'flex' }}>
                        <FormControlLabel
                          key={`${k}-control`}
                          style={{ userSelect: 'none' }}
                          {...(widget as FormControlLabelProps)}
                        />
                        // <Typography>hello theer</Typography>
                        // </Grid>
                      );
                    })}
                  </FormGroup>
                </Grid>
              </Grid>
            ))
          }
        </SettingsContext.Consumer> */}
      </Grid>
    );
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
