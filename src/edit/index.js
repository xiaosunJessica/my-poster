import React, { Component } from 'react';
import { Button, Icon, Input, message } from 'antd';
import HTML5Backend from 'react-dnd-html5-backend';
import { getImgUrl } from "util/imgFileHeadUrl";
import UploadTheme from './uploadTheme';
import AddUserField from './addUserField';
import ColorAndFontSize from './colorAndFontSize';
import UploadPhoto from './uploadPhoto';
import { ajax } from 'util/ajax';
import { getUrlParam } from 'util/getUrlParams';
import Box from './box';
import Move from './move';
const { TextArea } = Input;

import {
	DropTarget,
	DragDropContext,
	ConnectDropTarget,
	DropTargetMonitor,
	XYCoord,
} from 'react-dnd'
import style from './index.less';
import 'rc-color-picker/assets/index.css';

// 0文本1图片2图文3二维码4上传区域 默认值:0
const menuDatas = [{
	name: '上传主题风格图',
	key: 'theme',
	leftComponent: UploadTheme,
	rightComponent: null
}, {
	name: '添加用户字段',
	key: 'addUserField',
	leftComponent: AddUserField,
	rightComponent: ColorAndFontSize
}, {
	name: '上传相片',
	key: 'uploadPhoto',
	leftComponent: UploadPhoto,
	rightComponent: null
}];

const boxTarget = {
	drop(
		props,
		monitor,
		component,
	) {
		if (!component) {
			return
		}
		const item = monitor.getItem()
		const delta = monitor.getDifferenceFromInitialOffset() 
		const left = Math.round(item.left + delta.x)
		const top = Math.round(item.top + delta.y)
		component.moveBox(item.id, left, top)
	},
}

@DragDropContext(HTML5Backend)
@DropTarget('box', boxTarget, (connect) => ({
	connectDropTarget: connect.dropTarget(),
}))

export default class Edit extends Component {

	state = {
		menuData: menuDatas[0],
		themeImg: '',
		boxes: [],
		fontsize: 12,
		color: '#000000',
		textBackgroundColor: '#FFFFFF',
		isMove: false,
		photos: [],
		urlKey: ''
	}

	componentDidMount = () => {
		const id = getUrlParam('id');
		if (id) {
			ajax.get({
				url: 'getDetailPoster',
				data: {
					id
				}
			}).then(res => {
				const { posterMain, posterItems } = res;
				this.setState({
					boxes: posterItems.filter((item => item.type === 0)),
					photos: posterItems.filter((item => item.type === 1)),
					color: posterMain.fontColor,
					fontsize: posterMain.fontSize,
					themeImg: posterMain.image,
					textBackgroundColor: posterMain.textBackgroundColor || '#FFFFFF',
					urlKey: posterMain.urlKey
				})
			})
		}
	}

	changeDragStatus = (status) => {
		this.setState({
			isMove: status
		})
	}

	onChangeMenu = (data) => {
		this.setState({
			menuData: data
		})
	}

	onChangeImage = (img) => {
		this.setState({
			themeImg: img
		})
	}

	onChangePhoto = (img) => {
		const image = new Image();
		image.src = getImgUrl(img);
		image.onload = () => {
			let imageWidth = image.width;
			let imageHeight = image.height;
			if (imageWidth > 300) {
				imageHeight = Math.ceil(imageHeight / imageWidth * 300)
				imageWidth = 300;
			}
			this.setState({
				photos: [{
						content: img,
						x: 35,
						y: 180,
						width: imageWidth,
						height: imageHeight,
						type: 1
					}]
			})
		}
	}

	onChangeText = (idx, content) => {
		const { boxes } = this.state;
		boxes[idx].content = content;
		this.setState({
			boxes
		})
	}

	moveBox(idx, left, top) {
		const { boxes, photos } = this.state;
		let regExp = new RegExp(/^box-(.*?)$/);
		let id = null;
		if (idx.includes('img')) {
			regExp = new RegExp(/^img-(.*?)$/);
			id = idx.match(regExp)[1]
			photos[id].x = left;
			photos[id].y = top;
			this.setState({
				photos
			})
			return
		}
		id = idx.match(regExp)[1]
		boxes[id].x = left;
		boxes[id].y = top;
		this.setState({
			boxes
		})
	}

	onSave = () => {
		const { themeImg, fontsize, color, boxes, photos, textBackgroundColor, urlKey } = this.state;
		if (!themeImg) {
			message.warn('请上传主题风格哦!', 2)
			return;
		}
		const title = getUrlParam('title')
		const id = getUrlParam('id');
		const _boxes = boxes.map((box, idx) => {
			const textareaDom = document.querySelector(`#textarea${idx}`);
			if (textareaDom) {
				return {
					...box,
					width: textareaDom.offsetWidth,
					height: textareaDom.offsetHeight,
				}
			}
			return {...box}
		})
		if (id) {
			ajax.request({
				url: 'editPoster',
				contentType:'application/json',
				method: 'PUT',
				data: {
					poster: {
						image: themeImg,
						fontSize: fontsize,
						fontColor: color,
						textBackgroundColor,
						title,
						id,
						urlKey
					},
					items: _boxes.concat(photos)
				}
			}).then(() => {
				this.props.history.push('/poster/list');
			})
			return;
		}
		const forceUpload = getUrlParam('forceUpload')
		ajax.post({
			url: 'addPoster',
			contentType:'application/json',
			data: {
				poster: {
					image: themeImg,
					fontSize: fontsize,
					fontColor: color,
					textBackgroundColor,
					forceUpload,
					title,
				},
				items: _boxes.concat(photos)
			}
		}).then(() => {
			this.props.history.push('/poster/list');
		})
	}

	onAddText = () => {
		const { boxes } = this.state;
		const length = boxes.length;
		boxes.push({
			x: 0, 
			y: 0, 
			content: `文本${length + 1}`,
			type: 0
		})
		
		this.setState({
			boxes
		})
	}

	onDeleteText = (id, type) => {
		const { boxes, photos } = this.state;
		if (type === 'img') { 
			photos.splice(id, 1)
			this.setState({
				photos
			})
			return
		}
		boxes.splice(id, 1)
		this.setState({
			boxes
		})
	}

	onChangeColor = (e) => {
		const { boxes } = this.state;
		console.info(e, '-----')
		const { r, g, b, a} = e.rgb;
		this.setState({
			boxes: boxes.map(box => {
				return {
					...box,
					color: `rgba(${r},${g},${b},${a})`
				}
			}),
			color: `rgba(${r},${g},${b},${a})`
		})
	}

	onChangeFontSize = (val) => {
		const { boxes } = this.state;
		this.setState({
			boxes: boxes.map(box => {
				return {
					...box,
					fontSize: val
				}
			}),
			fontsize: val
		})
	}

	onChangeTextBackgroundColor = (e) => {
		const { r, g, b, a } = e.rgb;
		this.setState({
			textBackgroundColor: `rgba(${r},${g},${b},${a})`
		})
	}

	changeItemWidthAndHeight = ({ idx, width, height }) => {
		const { boxes, photos } = this.state;
		let regExp = new RegExp(/^box-(.*?)$/);
		let id = null
		if (idx.includes('img')) { 
			regExp = new RegExp(/^img-(.*?)$/);
			id = idx.match(regExp)[1]
			photos[id].width = String(width);
			photos[id].height = String(height);
			this.setState({
				photos
			})
			return
		}
		id = idx.match(regExp)[1]
		boxes[id].width = String(width);
		boxes[id].height = String(height);
		this.setState({
			boxes
		})
	}

	renderLeftCompt = () => {
		const { menuData, boxes, color, fontsize } = this.state;
		const LeftCmpt = menuData.leftComponent;
		switch(menuData.key) {
			case 'theme':
				return (
					<LeftCmpt 
						onChangeImage={this.onChangeImage} />
				)
			case 'uploadPhoto':
				return (
					<LeftCmpt 
						onChangePhoto={this.onChangePhoto} />
				)
			case 'addUserField':
				return (
					<LeftCmpt 
						onChangeText={this.onChangeText}
						boxes={boxes}
						onAddText={this.onAddText}
						onChangeColor={this.onChangeColor}
						color={color}
						fontSize={fontsize}
						onChangeFontSize={this.onChangeFontSize} />
				)
		}
	}

	render() {
		const { menuData, themeImg, boxes, photos, color, fontsize, isMove, textBackgroundColor } = this.state;
		const { hideSourceOnDrag, connectDropTarget } = this.props
		const RightCmpt = menuData.rightComponent;
		const forceUpload = getUrlParam('forceUpload');
		return (
			<div className={`${style.edit} border-radius-4 pd-24`}>
				<div className="menu-wrapper">
					<div className="menu">
						<ul>
							{
								menuDatas.map(menu => {
									if (menu.key === 'uploadPhoto' && (!themeImg || forceUpload === '0')) {
										return null;
									}
									return (
										<li 
											key={menu.key}
											className={menu.key === menuData.key ? 'active' :'' }
											onClick={this.onChangeMenu.bind(this, menu)}
											>
										{menu.name}
										</li>
									)
								})
							}
						</ul>
						<div className="btn-group">
							<Button type="primary" onClick={this.onSave}>保存</Button>
						</div>
					</div>
					<div className="menu-res">
					 {this.renderLeftCompt()}
					</div>
				</div>
				<div className="content">
					{connectDropTarget && connectDropTarget
					(<div className="bg-img"  id="img-container">
						{boxes.map((box, idx) => {
							const { x, y, content, width, height } = box
							return (
								<Box
									key={idx}
									id={`box-${idx}`}
									isMove={isMove}
									left={parseInt(x)}
									top={parseInt(y)}
									color={color}
									fontSize={parseInt(fontsize)}
									hideSourceOnDrag={hideSourceOnDrag}
									className="drag-box"
								>	
								<TextArea 
									value={content} 
									className="textarea"
									id={`textarea${idx}`}
									readOnly="readOnly"
									style={{ 
										width: parseInt(width) || 55, 
										height: parseInt(height) || 35,
										background: textBackgroundColor 
									}} />
									<Icon type="close-circle-o" onClick={this.onDeleteText.bind(this, idx, 'box')} />	
									{/* <Move 
										id={idx} 
										isMove={isMove}
										width={width}
										height={height}
										changeDragStatus={this.changeDragStatus}
										changeItemWidthAndHeight={this.changeItemWidthAndHeight}>
										 <div className="text" dangerouslySetInnerHTML={{__html: content.replace(/ /g, "\u00a0")}}></div> 
										<TextArea value={content} />
										<Icon type="close-circle-o" onClick={this.onDeleteText.bind(this, idx)} />
									</Move>							 */}
								</Box>
							)
						})}
						{
							photos.map((photo, idx) => {
								const { x, y, content, width, height } = photo;
								return (
									<Box
										key={content}
										id={`img-${idx}`}
										isMove={isMove}
										left={parseInt(x)}
										top={parseInt(y)}
										color={color}
										fontSize={parseInt(fontsize)}
										hideSourceOnDrag={hideSourceOnDrag}
										className="drag-img"
									>	
										<Move 
											id={`img-${idx}`}
											isMove={isMove}
											width={width}
											height={height}
											changeDragStatus={this.changeDragStatus}
											changeItemWidthAndHeight={this.changeItemWidthAndHeight}>
											<img src={content ? getImgUrl(content) : ''} alt="" />
											<Icon type="close-circle-o" onClick={this.onDeleteText.bind(this, idx, 'img')} />
										</Move>							
									</Box>
								)
							})
						}
						<img src={themeImg ? getImgUrl(themeImg) : ''} alt="" />
					</div>
					)}
					{RightCmpt && <RightCmpt 
								onChangeColor={this.onChangeColor}
								color={this.state.color}
								fontSize={this.state.fontsize}
								textBackgroundColor={this.state.textBackgroundColor}
								onChangeFontSize={this.onChangeFontSize}
								onChangeTextBackgroundColor={this.onChangeTextBackgroundColor} />}
				</div>
			</div>
		)
	}
}
