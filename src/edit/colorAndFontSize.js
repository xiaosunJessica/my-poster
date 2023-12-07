import React, { Component } from 'react';
import { Select, Icon } from 'antd';
import { SketchPicker } from 'react-color';
const Option = Select.Option;

const fontSizeDatas = [12, 14, 16, 18, 20, 22, 24, 26, 28, 30];

import style from './index.less';

export default class ColorAndFontSize extends Component {
	state = {
		showItem: ''
	}

	onSwitchItem = (val) => {
		const { showItem } = this.state;
		this.setState({
			showItem: showItem === val ? '' : val
		})
	}
	render() {
		const { fontSize } = this.props;
		const { showItem } = this.state;
		return (
			<div className={style.colorFontSize}>
				<div className="item">
					<div 
						className={`title ${showItem === 'fontSize' ? 'active' : ''}`}
						onClick={this.onSwitchItem.bind(this, 'fontSize')}>
						<Icon className="icon-arrow" type={showItem === 'fontSize' ? 'caret-down': 'caret-left'} />
						字段大小
					</div>
					{
						showItem === 'fontSize' && 
						<Select 
								defaultValue={`${fontSize}px`}
								style={{ width: '100%' }}
								onChange={this.props.onChangeFontSize}>
							{
								fontSizeDatas.map(font => <Option value={font} key={`fontsize${font}`}>{font}px</Option>)
							}
						</Select>
					}
				</div>
				<div className="item">
					<div 
						className={`title ${showItem === 'color' ? 'active' : ''}`}
						onClick={this.onSwitchItem.bind(this, 'color')}>
						<Icon className="icon-arrow" type={showItem === 'color' ? 'caret-down': 'caret-left'} />
						字段颜色
					</div>
					{
						showItem === 'color' && 
						<SketchPicker
							color={ this.props.color }
							onChangeComplete={ this.props.onChangeColor } />
					}
				</div>
				<div className="item">
					<div 
						className={`title ${showItem === 'text_bg_color' ? 'active' : ''}`}
						onClick={this.onSwitchItem.bind(this, 'text_bg_color')}>
						<Icon className="icon-arrow" type={showItem === 'text_bg_color' ? 'caret-down': 'caret-left'} />
						字段背景颜色
					</div>
					{
						showItem === 'text_bg_color' && 
						<SketchPicker
							color={ this.props.textBackgroundColor }
							onChangeComplete={ this.props.onChangeTextBackgroundColor } />
					}
				</div>
			</div>
		)
	}
}
