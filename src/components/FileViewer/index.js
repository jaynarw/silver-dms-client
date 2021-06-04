import React, { useState, useEffect } from 'react';
import {Spin, Space, Pagination } from "antd";
import FileEntry from "../FileEntry";
import "antd/dist/antd.css";
import styles from "./styles.module.css";

function FileContainer() {
    const [updatingData,setUpdatingData] = useState(false);
    const[updated,setUpdated] = useState([false,""]);
    const [loading, setLoading] = useState(true);
    const [fileArray, setFileArray] = useState([]);
    const [minmax, setMinMax] = useState({min: 0, max: 10});
    
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

    function handlePageChange(page,pageSize) {
      setMinMax({ min:(page-1)*pageSize, max: page*pageSize});
    }
    const { min, max } = minmax;
    const filteredFiles = fileArray.slice(min, max);

    return (
    <>
        {loading && <Spin spinning />}
        {!loading && (
            <div>
              <Space direction="vertical" style={{ display: "flex" }}>
                {filteredFiles.map((file, ind) =>
                  <FileEntry key={file.id} data={file} />
                )}
                <Pagination
                  total={fileArray.length}
                  showSizeChanger
                  showQuickJumper
                  showTotal={total => `Total ${total} items`}
                  onChange={handlePageChange}
                />
              </Space>
            </div>
        )}
    </>);
}
export default FileContainer;
