import React from 'react';
import './DesktopBg.less';
import PropTypes from 'prop-types';
import { FormattedMessage as FM, injectIntl } from 'react-intl';
import { Button, message, Select } from 'antd';
import bg1 from './assets/01.jpg';
import bg2 from './assets/02.jpg';
import bg3 from './assets/03.jpg';
import bg4 from './assets/04.jpg';
import bg5 from './assets/05.jpg';
import bg6 from './assets/06.jpg';
import bg7 from './assets/07.jpg';
import classNames from 'classnames';
const Option = Select.Option;

// 所有的背景图
const bgImages = [bg1, bg2, bg3, bg4, bg5, bg6, bg7];

// 所有背景颜色
const bgColors = [
  '#da853f',
  '#d23435',
  '#bf4342',
  '#b12854',
  '#ad2875',
  '#8c2183',
  '#7b2991',
  '#6e52a2',
  '#418649',
  '#3b792b',
  '#3c8374',
  '#477b67',
  '#467c96',
  '#6c6ccc',
  '#8d8ed1',
  '#8267b1'
];

/**
 * 更换桌面背景的组件
 */
export default class DesktopBg extends React.Component {
  static propTypes = {
    /**
     * 选中的图片（或背景色）对象
     * 默认：-
     */
    selectedBg: PropTypes.object.isRequired,
    // {
    //   bgMode: 'bgColor' // 背景模式：'image' 表示使用背景图；'bgColor' 表示使用背景颜色
    //   value: '#f00' // 背景值：当 bgMode 为 'image' 时，值为背景图地址；当 bgMode 为 'bgColor' 时，值为 背景色
    // }

    /**
     * 保存使用的背景图时的回调函数，如：(selectedBg) => void；selectedBg 表示选中的图片对象；具体属性如上
     * 默认：-
     */
    onSave: PropTypes.func
  };

  static defaultProps = {};

  constructor(props) {
    super(props);
    const previewBg = { ...props.selectedBg };
    this.state = {
      previewBg,
      selectedBgMode: previewBg.bgMode
    };
  }

  renderPreviewContent = () => {
    const { previewBg } = this.state;

    // 背景图
    if (previewBg.bgMode === 'image') {
      return (
        <img
          src={previewBg.value}
          alt="preview-bg"
          className="desktop-bg__preview-bg"
        />
      );
    }

    // 背景色
    return (
      <div
        className="desktop-bg__preview-bg-color"
        style={{ background: previewBg.value }}
      />
    );
  };

  handleUseImage = src => {
    this.setState({
      previewBg: {
        bgMode: 'image',
        value: src
      }
    });
  };

  handleUseBgColor = bgColor => {
    this.setState({
      previewBg: {
        bgMode: 'bgColor',
        value: bgColor
      }
    });
  };

  handleSave = () => {
    const { onSave } = this.props;
    onSave && onSave({ ...this.state.previewBg });
  };

  handleSelectChange = selectedBgMode => {
    this.setState({ selectedBgMode });
  };

  renderSelectBgContent = () => {
    const { previewBg, selectedBgMode } = this.state;

    // 可选的背景图片
    if (selectedBgMode === 'image') {
      return (
        <div className="desktop-bg__images-wrapper">
          {bgImages.map((src, index) => (
            <div
              className={classNames('desktop-bg__image-wrapper', {
                'desktop-bg__image-wrapper--selected': previewBg.value === src
              })}
              key={src}
            >
              <img src={src} alt={`bg-${index}`} />
              <div className="desktop-bg__image-mask">
                {previewBg.value === src ? (
                  <Button type="primary">正在浏览</Button>
                ) : (
                  <Button onClick={() => this.handleUseImage(src)}>浏览</Button>
                )}
              </div>
            </div>
          ))}
        </div>
      );
    }

    // 可选的背景图
    return (
      <div className="desktop-bg__bg-color-wrapper">
        {bgColors.map(color => (
          <div
            key={color}
            className="desktop-bg__bg-color"
            style={{ backgroundColor: color }}
          >
            <div className="desktop-bg__bg-color-mask">
              {previewBg.value === color ? (
                <Button type="primary" size="small">
                  正在浏览
                </Button>
              ) : (
                <Button
                  onClick={() => this.handleUseBgColor(color)}
                  size="small"
                >
                  浏览
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  render() {
    const { previewBg, selectedBgMode } = this.state;
    return (
      <div className="desktop-bg">
        <div className="desktop-bg__preview">
          <div className="desktop-bg__preview-title">
            <span>预览</span>
            <Button type="primary" onClick={this.handleSave}>
              保存
            </Button>
          </div>
          <div className="desktop-bg__preview-content">
            {this.renderPreviewContent()}
          </div>
        </div>
        <div className="desktop-bg__select-bg">
          <div className="desktop-bg__select-bg-title">
            <span>背景</span>
            <Select
              value={selectedBgMode}
              style={{ width: 120 }}
              onChange={this.handleSelectChange}
            >
              <Option value="image">背景图</Option>
              <Option value="bgColor">背景颜色</Option>
            </Select>
          </div>
          <div className="desktop-bg__select-bg-content">
            {this.renderSelectBgContent()}
          </div>
        </div>
      </div>
    );
  }
}
