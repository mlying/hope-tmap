/* eslint jsx-a11y/no-noninteractive-element-interactions: 0 */
import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import CopyToClipboard from 'react-copy-to-clipboard';
import classNames from 'classnames';
import LZString from 'lz-string';
import { Icon, Tooltip } from 'antd';
import EditButton from './EditButton';
import BrowserFrame from '../BrowserFrame';
import { getConfig } from '../utils';

function compress(string) {
  return LZString.compressToBase64(string)
    .replace(/\+/g, '-') // Convert '+' to '-'
    .replace(/\//g, '_') // Convert '/' to '_'
    .replace(/=+$/, ''); // Remove ending '='
}

export default class Demo extends React.Component {
  static contextTypes = {
    intl: PropTypes.object,
  };

  constructor(props) {
    super(props);

    this.state = {
      codeExpand: false,
      sourceCode: '',
      copied: false,
      copyTooltipVisible: false,
      objectMount: false,
    };
    this.renderLiveFirst = true;
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { highlightedCode } = nextProps;
    const div = document.createElement('div');
    div.innerHTML = highlightedCode[1].highlighted;
    this.setState({ sourceCode: div.textContent });
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      (this.state.codeExpand || this.props.expand) !== (nextState.codeExpand || nextProps.expand) ||
      this.state.copied !== nextState.copied ||
      this.state.copyTooltipVisible !== nextState.copyTooltipVisible ||
      this.state.objectMount !== nextState.objectMount
    );
  }

  componentDidMount() {
    const { meta, location } = this.props;
    if (meta.id === location.hash.slice(1)) {
      this.anchor.click();
    }
    this.UNSAFE_componentWillReceiveProps(this.props);

    this.setState({
      objectMount: true,
    });
  }

  handleCodeExpand = () => {
    this.setState({ codeExpand: !this.state.codeExpand, objectMount: true });
  };

  saveAnchor = anchor => {
    this.anchor = anchor;
  };

  handleCodeCopied = () => {
    this.setState({ copied: true });
  };

  onCopyTooltipVisibleChange = visible => {
    if (visible) {
      this.setState({
        copyTooltipVisible: visible,
        copied: false,
      });
      return;
    }
    this.setState({
      copyTooltipVisible: visible,
    });
  };

  renderLive() {
    this.renderLiveFirst = false;
    const { meta, src, preview } = this.props;
    if (this.liveDemo) {
      return this.liveDemo;
    }
    if (meta.iframe) {
      return (
        <BrowserFrame>
          <iframe src={src} height={meta.iframe} title="demo" />
        </BrowserFrame>
      );
    }
    return preview(React, ReactDOM);
  }

  render() {
    const { state } = this;
    const { props } = this;
    const { meta, content, highlightedCode, style, highlightedStyle, expand } = props;
    const codeExpand = state.codeExpand || expand;
    const codeBoxClass = classNames({
      'code-box': true,
      expand: codeExpand,
    });

    const { locale } = this.context.intl;
    const localizedTitle = meta.title[locale] || meta.title;
    const localizeIntro = content[locale] || content;
    const introChildren = props.utils.toReactComponent(['div'].concat(localizeIntro));

    const highlightClass = classNames({
      'highlight-wrapper': true,
      'highlight-wrapper-expand': codeExpand,
    });

    const prefillStyle = `@import 'antd/dist/antd.css';\n\n${style || ''}`.replace(
      new RegExp(`#${meta.id}\\s*`, 'g'),
      ''
    );
    const html = `<div id="container" style="padding: 24px"></div>
<script>
  var mountNode = document.getElementById('container');
</script>`;

    const codepenPrefillConfig = {
      title: `${localizedTitle} - ${getConfig('title')} Demo`,
      html,
      js: state.sourceCode.replace(/import\s+\{\s+(.*)\s+\}\s+from\s+'antd';/, 'const { $1 } = antd;'),
      css: prefillStyle,
      editors: '001',
      css_external: 'https://unpkg.com/antd/dist/antd.css',
      js_external: [
        'react@15.x/dist/react.js',
        'react-dom@15.x/dist/react-dom.js',
        'moment/min/moment-with-locales.js',
        'antd/dist/antd-with-locales.js',
      ]
        .map(url => `https://unpkg.com/${url}`)
        .join(';'),
      js_pre_processor: 'typescript',
    };
    const riddlePrefillConfig = {
      title: `${localizedTitle} - ${getConfig('title')} Demo`,
      js: state.sourceCode,
      css: prefillStyle,
    };
    const dependencies = state.sourceCode.split('\n').reduce(
      (acc, line) => {
        const matches = line.match(/import .+? from '(.+)';$/);
        if (matches && matches[1]) {
          acc[matches[1]] = 'latest';
        }
        return acc;
      },
      { react: 'latest', 'react-dom': 'latest' }
    );
    const codesanboxPrefillConfig = {
      files: {
        'package.json': {
          content: {
            dependencies,
          },
        },
        'index.css': {
          content: (style || '').replace(new RegExp(`#${meta.id}\\s*`, 'g'), ''),
        },
        'index.js': {
          content: `
import React from 'react';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.css';
import './index.css';
${state.sourceCode.replace('mountNode', "document.getElementById('container')")}
          `,
        },
        'index.html': {
          content: html,
        },
      },
    };
    return (
      <section className={codeBoxClass} id={meta.id}>
        <section className="code-box-demo">
          <object
            id="Web3DCtrl"
            classid="clsid:A111D79A-2879-45C4-92BA-E72B23029EBB"
            width="100%"
            height="100%"
            standby="正在加载请稍后..."
            style={{ height: 500 }}
          >
            {state.objectMount && this.renderLiveFirst && this.renderLive()}
          </object>
          {style ? <style dangerouslySetInnerHTML={{ __html: style }} /> : null}
        </section>
        <section className="code-box-meta markdown">
          <div className="code-box-title">
            <a href={`#${meta.id}`} ref={this.saveAnchor}>
              {localizedTitle}
            </a>
            <EditButton title={<FormattedMessage id="app.content.edit-page" />} filename={meta.filename} />
          </div>
          {introChildren}
          <Tooltip title={codeExpand ? 'Hide Code' : 'Show Code'}>
            <span className="code-expand-icon">
              <img
                alt="expand code"
                src="https://gw.alipayobjects.com/zos/rmsportal/wSAkBuJFbdxsosKKpqyq.svg"
                className={codeExpand ? 'code-expand-icon-hide' : 'code-expand-icon-show'}
                onClick={this.handleCodeExpand}
              />
              <img
                alt="expand code"
                src="https://gw.alipayobjects.com/zos/rmsportal/OpROPHYqWmrMDBFMZtKF.svg"
                className={codeExpand ? 'code-expand-icon-show' : 'code-expand-icon-hide'}
                onClick={this.handleCodeExpand}
              />
            </span>
          </Tooltip>
        </section>
        <section className={highlightClass} key="code">
          <div className="highlight">
            <div className="code-box-actions">
              <form action="https://codepen.io/pen/define" method="POST" target="_blank">
                <input type="hidden" name="data" value={JSON.stringify(codepenPrefillConfig)} />
                <Tooltip title={<FormattedMessage id="app.demo.codepen" />}>
                  <input type="submit" value="Create New Pen with Prefilled Data" className="code-box-codepen" />
                </Tooltip>
              </form>
              <form action="https://codesandbox.io/api/v1/sandboxes/define" method="POST" target="_blank">
                <input type="hidden" name="parameters" value={compress(JSON.stringify(codesanboxPrefillConfig))} />
                <Tooltip title={<FormattedMessage id="app.demo.codesandbox" />}>
                  <input
                    type="submit"
                    value="Create New Sandbox with Prefilled Data"
                    className="code-box-codesandbox"
                  />
                </Tooltip>
              </form>
              <CopyToClipboard text={state.sourceCode} onCopy={this.handleCodeCopied}>
                <Tooltip
                  visible={state.copyTooltipVisible}
                  onVisibleChange={this.onCopyTooltipVisibleChange}
                  title={<FormattedMessage id={`app.demo.${state.copied ? 'copied' : 'copy'}`} />}
                >
                  <Icon
                    type={state.copied && state.copyTooltipVisible ? 'check' : 'copy'}
                    className="code-box-code-copy"
                  />
                </Tooltip>
              </CopyToClipboard>
            </div>
            {props.utils.toReactComponent(highlightedCode)}
          </div>
          {highlightedStyle ? (
            <div key="style" className="highlight">
              <pre>
                <code className="css" dangerouslySetInnerHTML={{ __html: highlightedStyle }} />
              </pre>
            </div>
          ) : null}
        </section>
      </section>
    );
  }
}
