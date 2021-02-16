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
import { ChevronRightSharp } from '@material-ui/icons';
import Alert from '@material-ui/lab/Alert';
import { noop } from 'lodash';
import Markdown, { MarkdownToJSX } from 'markdown-to-jsx';
import React, { useEffect, useState } from 'react';
import { settingsWidgetType } from '../../common/settings';
//
// imports for markdown
import { ReactComponent as ViewerLayoutDiagramSVG } from '../../img/layout-diagram.svg';
import { verylightBoxShadow } from '../../theme/theme';
import ViewChanger from '../render/ViewChanger';
import { SettingsContext } from '../settings/SettingsContext';
import { getSettingsWidgetsGrouping } from '../settings/SettingsDefinitions';
import {
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
  return (
    <Typography
      variant="body2"
      // paragraph
      style={{
        padding: '8px 12px',
        // centre help text vertically
        marginTop: 'auto',
        marginBottom: 'auto',
      }}
    >
      {children}
    </Typography>
  );
}

const baseMdOverrides = {
  a: MdOverrideLink,
  h1: wrapMdOverrideTypographyHOC('h1'),
  h2: wrapMdOverrideTypographyHOC('h2'),
  p: wrapMdOverrideTypographyHOC('body1'),
};

const mdOverrides: MarkdownToJSX.Overrides = {
  ...baseMdOverrides,
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
      <Grid container justify="space-evenly">
        <Grid item>
          <Grid container direction="column">
            <Grid item>
              <ViewChanger vertical={true} changeFunc={noop} displayOnly />
            </Grid>
            <Grid item>
              <Typography variant="body2" align="center">
                Portrait
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid item>
          <Grid container direction="column" style={{ height: '100%' }}>
            <Grid item style={{ margin: 'auto' }}>
              <ViewChanger vertical={false} changeFunc={noop} displayOnly />
            </Grid>
            <Grid item style={{ marginLeft: 'auto', marginRight: 'auto' }}>
              <Typography variant="body2" align="center">
                Landscape
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    );
  },

  HelpBreadcrumbs: function HelpBreadcrumbs() {
    return (
      <Grid container justify="center" alignItems="center">
        <Grid item>
          <SettingsMenuButton onClick={noop} displayOnly />
        </Grid>
        <Grid item style={{ lineHeight: 1, textAlign: 'center' }}>
          {/* line height messes up alignment otherwise */}
          <ChevronRightSharp />
        </Grid>
        <Grid item>
          <SettingsHelpButton onClick={noop} />
        </Grid>
      </Grid>
    );
  },

  SettingsMenuButton: function SettingsMenuButtonDisplay() {
    return (
      <Grid container justify="center">
        <Grid item style={{ marginBottom: 12 }}>
          <SettingsMenuButton onClick={noop} />
        </Grid>
      </Grid>
    );
  },

  SettingsInstructions: function SettingsInstructions() {
    const theme = useTheme();

    return (
      <SettingsContext.Consumer>
        {({ setSettings, settingsWidgets }) =>
          getSettingsWidgetsGrouping(settingsWidgets).map((g, i) => (
            <Grid container direction="column" alignItems="flex-end" key={g.name}>
              <Grid item xs={5} container style={{ userSelect: 'none', marginTop: 12 }}>
                <Grid item xs>
                  <GroupTitle icon={g.icon} title={g.name} />
                </Grid>
              </Grid>
              {Object.entries(g.widgets).map(([k, widgetUnchecked], j) => {
                // widget will contain
                // label, control, (checked or value), ...
                // helptext
                const { helptext, ...widget } = widgetUnchecked as settingsWidgetType;
                return (
                  <Grid
                    container
                    direction="row"
                    justify="space-between"
                    // align center shrinks to content
                    // alignItems="center"
                    key={k}
                    style={{
                      marginTop: 6,
                      marginBottom: 6,
                      borderRadius: theme.shape.borderRadius,
                      backgroundColor: theme.palette.grey[50],
                      boxShadow: verylightBoxShadow,
                    }}
                  >
                    <Grid item xs={6} sm={7}>
                      <div
                        style={{
                          // fill the available vertical space
                          height: '100%',
                          borderTopLeftRadius: theme.shape.borderRadius,
                          borderBottomLeftRadius: theme.shape.borderRadius,
                          // https://github.com/mui-org/material-ui/blob/master/packages/material-ui-lab/src/Alert/Alert.js#L16
                          backgroundColor: lighten(theme.palette.info.main, 0.9),
                          color: darken(theme.palette.info.main, 0.6),
                          display: 'flex',
                          flexDirection: 'column',
                        }}
                      >
                        <Markdown
                          options={{
                            wrapper: React.Fragment,
                            forceBlock: true,
                            overrides: {
                              ...baseMdOverrides,
                              p: SettingsInstructionBlock,
                            },
                          }}
                        >
                          {
                            // default if no description is provided
                            helptext?.trim() || '(no description)'
                          }
                        </Markdown>
                      </div>
                    </Grid>
                    <Grid
                      item
                      xs={6}
                      sm={5}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        userSelect: 'none',
                      }}
                    >
                      <FormGroup
                        style={{
                          height: '100%',
                        }}
                      >
                        <FormControlLabel
                          key={`${k}-control`}
                          {...widget}
                          style={{
                            // make the entire area selectable
                            height: '100%',
                            padding: '10px 12px',
                            // if this is a "top" label, tweak the margins
                            ...(widget.labelPlacement === 'top'
                              ? {
                                  margin: 8,
                                  // correctly centres iteration slider
                                  justifyContent: 'center',
                                }
                              : {}),
                          }}
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
