/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import { Collapse } from 'antd';
import styles from './styles.module.css';
import FileHeader from '../FileHeader';
import FilePanelList from '../FilePanel';

const { Panel } = Collapse;

function FileEntry({ data }) {
  const [changedTitles, setChangedTitles] = useState({});
  function onChange(id, newTitle, isSame) {
    if (isSame) {
      setChangedTitles((prevState) => {
        const newState = { ...prevState };
        if (newState[id]) {
          delete newState[id];
        }
        return newState;
      });
    } else {
      setChangedTitles((prevState) => ({ ...prevState, [id]: newTitle }));
    }
  }
  return (
    <Collapse className={styles.collapse} collapsible="header">
      <Panel showArrow={false} header={<FileHeader data={data} changedTitles={changedTitles} />}>
        <FilePanelList fileIds={data['Upload Files']} onNameChange={onChange} />
      </Panel>
    </Collapse>
  );
}
export default FileEntry;
