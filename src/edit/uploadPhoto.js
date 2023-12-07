import React, { Component } from 'react'
import { Button, Upload, Spin, message } from 'antd';

export default class UploadPhoto extends Component {
	state = {
		uploadLoading: false
	}
	onChangeUpload = files => {
		let file = files.file;
		if (file.status === 'uploading') {
			this.setState({
				uploadLoading: true
			})
		}
    if (files.file.status === 'done') {
      if (files.file.response && files.file.response.code === 100000) {
				message.success('上传成功');
				this.props.onChangePhoto(files.file.response.data.url)
        this.setState({
					uploadLoading: false,
        })
      }
    }
	};
	
	render() {
		const { uploadLoading } = this.state;
		return (
			<Upload 
				name="file"
				accept="image/*"
				showUploadList={false}
				action="/api/util/fileupload"
				onChange={this.onChangeUpload}>
				<Spin spinning={uploadLoading}>
					<Button>上传相片</Button>
				</Spin>
			</Upload>
		)
	}
}
