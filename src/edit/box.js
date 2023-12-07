import * as React from 'react';
import { DragSource, ConnectDragSource } from 'react-dnd';
const style = {
	position: 'absolute',
	// backgroundColor: 'white',
	// border: '1px dashed gray',
	borderRadius: '4px',
	// padding: '4px 8px',
	cursor: 'move',
}

const boxSource = {
	beginDrag(props) {
		const { id, left, top } = props
		return { id, left, top }
	},
	canDrag(props) {
		const { isMove } = props;
		return !isMove
	}
}


@DragSource('box', boxSource, (connect, monitor) => ({
	connectDragSource: connect.dragSource(),
	isDragging: monitor.isDragging(),
}))
export default class Box extends React.Component {
	render() {
		const {
			hideSourceOnDrag,
			left,
			top,
			color,
			fontSize,
			connectDragSource,
			isDragging,
			isMove,
			children,
			className
		} = this.props
		if (isDragging && hideSourceOnDrag) {
			return null
		}

		return (
			connectDragSource &&
			connectDragSource(<div className={className} style={{ ...style, left, top, color,fontSize }}>{children}</div>)
		)
	}
}