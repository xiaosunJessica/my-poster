import React, { Component } from 'react'
import { Form, Input, Button } from 'antd';
const FormItem = Form.Item;

const { TextArea } = Input;


export default class AddUserField extends Component {
	onChange = (id, e) => {
		this.props.onChangeText(id, e.target.value)
	}

	render() {
		const { boxes } = this.props;
		return (
			[<Button 
				className="btn-add" 
				type="primary" 
				key="add-button"
				onClick={this.props.onAddText}>
				添加用户填写字段
			</Button>,
			<Form key="field-form">
				{
					boxes.map((box, idx) => (
						<FormItem
							key={idx}
							label={`文本${idx + 1}名称`}>
							<TextArea 
								onChange={this.onChange.bind(this, idx)}
								value={box.content} />
						</FormItem>
					))
				}
			</Form>]
		)
	}
}
