import React, { useState, useEffect } from "react";
import { List } from "antd";
import FilePanelItem from "../FilePanelItem";

function FilePanelList({ fileIds }) {
  const initialState = {};
  fileIds.forEach((file_url) => {
    const url = new URL(file_url);
    const urlParams = new URLSearchParams(url.search);
    const id = urlParams.get('id');
    initialState[id] = null;
  });
  const [filesMetadata, setFilesMetadata] = useState(initialState);
  useEffect(() => {
    Object.keys(initialState).forEach((id) => {
      fetch(`http://localhost:5000/get/${id}`)
        .then((res) => res.json())
        .then((data) => {
        setFilesMetadata((prev) => ({...prev, [id]:data}));
      });
    })
  }, []);

  return (  
  <List
    itemLayout="vertical"
    size="large"
    dataSource={Object.keys(filesMetadata)}
    footer={
      <div>
        <b>ant design</b> footer part
      </div>
    }
    renderItem={item => (
      <FilePanelItem id={item} fileMetadata={filesMetadata[item]} />
    )}
  />)
}

export default FilePanelList;
