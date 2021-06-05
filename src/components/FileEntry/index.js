import React from 'react';
import { Collapse } from 'antd';
import styles from "./styles.module.css";
import FileHeader from "../FileHeader";
import FilePanelList from "../FilePanel";

const { Panel } = Collapse;

function FileEntry({ data }) {
  return (
  <Collapse className={styles.collapse} collapsible="header">
    {/* <Panel header={<FileHeader data={data} />}>{JSON.stringify(data)}</Panel> */}
    <Panel showArrow={false} header={<FileHeader data={data} />}>
      <FilePanelList fileIds={data["Upload Files"]} />
    </Panel>
  </Collapse>
  );
}
export default FileEntry;
