import {
  darken,
  FormControlLabel,
  FormGroup,
  Grid,
  lighten,
  Link,
  Typography,
  useTheme,
} from '@material-ui/core';
import { Variant } from '@material-ui/core/styles/createTypography';
import Alert from '@material-ui/lab/Alert';
import { noop } from 'lodash';
import Markdown, { MarkdownToJSX } from 'markdown-to-jsx';
import React, { useEffect, useState } from 'react';
import { settingsWidgetType } from '../../common/settings';
//
// imports for markdown
import { ReactComponent as ViewerLayoutDiagramSVG } from '../../img/layout-diagram.svg';
import ViewChanger from '../render/ViewChanger';
import { SettingsContext } from '../settings/SettingsContext';
import { getSettingsWidgetsGrouping } from '../settings/SettingsDefinitions';
import {
  GroupDivider,
  GroupTitle,
  SettingsHelpButton,
  SettingsMenuButton,
} from '../settings/SettingsMenu';

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

function SettingsInstructionBlock({
  children,
}: React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLParagraphElement>,
  HTMLParagraphElement
>): JSX.Element {
  const theme = useTheme();

  return (
    <Typography
      variant="body2"
      paragraph
      style={{
        // https://github.com/mui-org/material-ui/blob/master/packages/material-ui-lab/src/Alert/Alert.js#L16
        backgroundColor: lighten(theme.palette.info.main, 0.9),
        color: darken(theme.palette.info.main, 0.6),
        padding: '6px 10px',
        margin: '4px 0',
        borderRadius: theme.shape.borderRadius,
      }}
    >
      {children}
    </Typography>
  );
}

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
  SettingsHelpButton: function SettingsHelpButtonDisplay() {
    return <SettingsHelpButton onClick={noop} />;
  },
  SettingsInstructions: function SettingsInstructions() {
    return (
      <SettingsContext.Consumer>
        {({ setSettings, settingsWidgets }) =>
          getSettingsWidgetsGrouping(settingsWidgets).map((g) => (
            <Grid container direction="column" alignItems="flex-end" key={g.name}>
              <Grid item container>
                <Grid item xs>
                  <GroupDivider />
                </Grid>
              </Grid>
              <Grid item xs={5} container>
                <Grid item xs>
                  <GroupTitle icon={g.icon} title={g.name} />
                </Grid>
              </Grid>
              {Object.entries(g.widgets).map(([k, widgetUnchecked], i) => {
                const { helptext, ...widget } = widgetUnchecked as settingsWidgetType;
                // widget will contain
                // label, control, (checked or value)
                // helptext
                return (
                  <Grid
                    item
                    xs
                    container
                    direction="row"
                    justify="space-between"
                    alignItems="center"
                    key={k}
                  >
                    <Grid item xs={7} style={{ paddingRight: 12 }}>
                      <Markdown
                        options={{
                          wrapper: React.Fragment,
                          forceBlock: true,
                          overrides: {
                            p: SettingsInstructionBlock,
                          },
                        }}
                      >
                        {/* default if no description is provided */}
                        {helptext?.trim() || '(no description)'}
                      </Markdown>
                    </Grid>
                    <Grid item xs={5}>
                      <FormGroup>
                        <FormControlLabel
                          key={`${k}-control`}
                          style={{ userSelect: 'none' }}
                          {...widget}
                          onChange={(...e) => {
                            // the value is the last element of the "e" array
                            // https://stackoverflow.com/a/12099341/9184658
                            // > using destructuring is nice too:
                            // > const [lastItem] = arr.slice(-1)
                            // > – diachedelic Mar 11 '19 at 6:30
                            const [val] = e.slice(-1);
                            console.debug(`${k} ->`, val);
                            // TODO: updating state like this seems to be very slow
                            // either have individual useState pairs, or use a Map?
                            setSettings((prevState) => ({
                              ...prevState,
                              [k]: val,
                            }));
                          }}
                        />
                      </FormGroup>
                    </Grid>
                  </Grid>
                );
              })}
              {/* </FormGroup> */}
              {/* </Grid> */}
            </Grid>
          ))
        }
      </SettingsContext.Consumer>
    );
  },
  Alert: function AlertMd(props) {
    return <Alert {...props} style={{ marginBottom: 16 }} />;
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
