import React from 'react';
import {Table, Space, Button} from "antd";
import "antd/dist/antd.css";
class FileContainer extends React.Component{
    constructor(props){
        super(props);
        this.state={
            fileArray:[
                {

                    providerName:'Harshit',
                    course:'MTH101',
                    files:['file1','file2'],
                    editing:false,
                    
                },
                {

                    providerName:'Harshit',
                    course:'MTH101',
                    files:['file1','file2'],
                    editing:false,
                },
                {

                    providerName:'Harshit',
                    course:'MTH101',
                    files:['file1','file2'],
                    editing:false,
                },
                {

                    providerName:'Harshit',
                    course:'MTH101',
                    files:['file1','file2'],
                    editing:false,
                },

            ],
        };
    }
    render(){
        const columns=[
            {
                title: 'Uploaded By',
                dataIndex:'providerName',
                key:'name',
    
            },
            {
                title: 'Course',
                dataIndex:'course',
                key:'course',
            },
            {
                title:'Uploaded Files',
                dataIndex:'files',
                key:'files',
                render:(files) => files.map((file, index)=>
                    <li><a href={file}>View File {index}</a></li>
                ),
            },
            {
                title:'Edit File',
                dataIndex:'edit-file',
                key:'edit-file',
                render:()=>(
                    <Button type="primary">Rename</Button>
                ),
            },
            {
                title:'Actions',
                dataIndex:'actions',
                key:'actions',
                render:()=>(
                    <Space size="small">
                        <Button type="link" >Accept</Button>
                        <Button type="link">Reject</Button>
                    </Space>
                ),
            
            },
        ];



        return(
            <Table columns={columns} dataSource={this.state.fileArray}/>
        );
    }
}
export default FileContainer;