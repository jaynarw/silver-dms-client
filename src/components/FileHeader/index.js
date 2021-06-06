/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import { message, Tag, Button } from 'antd';
import { MdArrowDropDown } from 'react-icons/md';
import { GetTitle } from './util';
import styles from './styles.module.css';
import { getFileId } from '../../utils';

const colorCodes = {
  Midsem: 'blue',
  Endsem: 'magenta',
  Quiz: 'purple',
  Assignment: 'green',
  'Lecture Notes': 'volcano',
};

function FileHeader({ data, changedTitles }) {
  const [loading, setLoading] = useState(false);

  async function acceptAll() {
    setLoading(true);
    const reqBody = {
      row_id: `${data.ID}`,
      ids: data['Upload Files'].map((url) => getFileId(url)),
      course_code: data['Course Code'],
    };
    if (Object.keys(changedTitles).length > 0) {
      reqBody.updated_title_obj = changedTitles;
    }
    try {
      const res = await fetch('http://localhost:5000/acceptMultipleFiles', {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reqBody),
      });
      const parsedRes = await res.text();
      message.success({ content: 'Successfully Accepted files!' });
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  }

  return (
    <div className={styles.Header}>
      <div className={styles.title} onClick={(e) => e.stopPropagation()}><GetTitle data={data} /></div>
      <div className={styles.type} onClick={(e) => e.stopPropagation()}>
        {data['Type of material'].split(', ').map((type) => (<Tag key={type} color={colorCodes[type]}>{type}</Tag>))}
      </div>
      <div className={styles.fileContainer} onClick={(e) => e.stopPropagation()}>
        <span className={styles.files}>{data['Upload Files'].length}</span>
      </div>
      <div
        className={styles.accept}
        onClick={(e) => {
          e.stopPropagation();
          acceptAll();
        }}
      >
        <Button type="primary" block className={styles.primary} disabled={loading}>Accept All</Button>
      </div>
      <div className={styles.reject} onClick={(e) => e.stopPropagation()}>
        <Button type="text" className={styles.secondary} disabled={loading}>Reject All</Button>
      </div>
      <div className={styles.openbutton}>
        <Button type="text" bordered={false}><MdArrowDropDown size={24} /></Button>
      </div>
    </div>
  );
}
export default FileHeader;
