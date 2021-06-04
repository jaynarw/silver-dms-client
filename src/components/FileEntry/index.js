import React from 'react';
import { Collapse } from 'antd';
import styles from "./styles.module.css";
import FileHeader from "../FileHeader";

const { Panel } = Collapse;

function FileEntry({ data }) {
  return (
  <Collapse className={styles.collapse} collapsible="header">
    {/* <Panel header={<FileHeader data={data} />}>{JSON.stringify(data)}</Panel> */}
    <Panel showArrow={false} header={<FileHeader data={data} />}>{JSON.stringify(data)}</Panel>
  </Collapse>
  );
}
export default FileEntry;
