import React, { Component } from 'react';
import { Icon } from 'antd';


const moveStyle = {
	position: 'relative', 
	transition: 'all easing .3s',
	// overflow: 'hidden',
	// textOverflow: 'ellipsis',
	// whiteSpace: 'nowrap'
}
export default class Move extends Component {

	moveRef = React.createRef();
	width = 0;
	height = 0;

	componentDidMount = () => {
		const width = this.moveRef.current.offsetWidth;
		const height = this.moveRef.current.offsetHeight;
		this.width = width;
		this.height = height;
	}

	onMouseDown = e => {
		e.stopPropagation();
		// e.persist();
		this.lastX = null;
		this.lastY = null;
		this.props.changeDragStatus(true)
		const _this = this;
		document.onmousemove = function(ev){
			//这里为什么使用document，是因为快速拖拽的话会鼠标丢失，
		const currentDom = _this.moveRef.current;
		if (!_this.props.isMove || !currentDom) return;
		if (_this.lastX && _this.lastY ) {
			const deltaX = ev.clientX - _this.lastX;
			const deltaY = ev.clientY - _this.lastY;
			_this.width = _this.width + deltaX;
			_this.height = _this.height + deltaY;
			if (_this.width > 12) {
				currentDom.style.width = _this.width + 'px';
			}
			if (_this.height > 12) {
				currentDom.style.height = _this.height + 'px';
			}
		}
		_this.lastX = ev.clientX;
		_this.lastY = ev.clientY;
		}
		document.onmouseup = function(ev){
			const {id} = _this.props;

			_this.lastX = null;
			_this.lastY = null;
			_this.props.changeDragStatus(false);
			if (_this.width > 12 && _this.height > 12) {
				_this.props.changeItemWidthAndHeight({
					idx: id,
					width: _this.width,
					height: _this.height
				})
			}
			document.onmousemove = document.onmouseup = null;
		}
	}

	render() {
		const { width, height } = this.props;
		const _width = width ? parseInt(width) : 'auto'
		const _height = height ? parseInt(height) : 'auto'
		return (
			<div 
				ref = {this.moveRef}
				style={{width: _width, height: _height, ...moveStyle}}>
				{this.props.children}
				<div 
					style={{ position: 'absolute', bottom: -10, right: -10, transform: 'rotate(-45deg)'}}
					onMouseDown={this.onMouseDown}
					>
					<Icon type="down" />
				</div>
			</div>
		)
	}
}
