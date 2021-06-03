import React, { useState, useEffect } from 'react';
import {Collapse, Spin, Space} from "antd";
import "antd/dist/antd.css";

const { Panel } = Collapse;

function FileContainer() {
    const [updatingData,setUpdatingData] = useState(false);
    const[updated,setUpdated] = useState([false,""]);
    const [loading, setLoading] = useState(true);
    const [fileArray, setFileArray] = useState([]);
    
    useEffect(() => {
        fetch('http://localhost:5000/data').then((res) => res.json()).then((files) => {
            //console.log(files);
            files.forEach(element => {
                element['Upload Files'] = element['Upload Files'].split(",");
            });
            setFileArray(files);
            console.log(files);
            setLoading(false);
        });
        return () => {
            console.log("This will be called when unmounted");
        };
    }, []);

    return (
    <>
        {loading && <Spin spinning />}
        {!loading && (
            <Space direction="vertical">
              {fileArray.map((file, ind) =>
                <Collapse class>
                  <Panel header={`${ind}`}>{JSON.stringify(file)}</Panel>
                </Collapse>
              )}
            </Space>
        )}
    </>);
}
export default FileContainer;
