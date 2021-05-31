import React, { useState, useEffect } from 'react';
import {Table, Space, Button, Spin} from "antd";
import "antd/dist/antd.css";

function FileContainer() {
    const [loading, setLoading] = useState(true);
    const [fileArray, setFileArray] = useState([]);

    useEffect(() => {
        fetch('http://localhost:5000/data').then((res) => res.json()).then((files) => {
            console.log(files);
            setFileArray(files);
            setLoading(false);
        });
        return () => {
            console.log("This will be called when unmounted");
        };
    }, []);
    
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
    return (<>
    {loading && <Spin spinning />}
    {!loading && <Table columns={columns} dataSource={fileArray}/>}
    </>);
}
export default FileContainer;
