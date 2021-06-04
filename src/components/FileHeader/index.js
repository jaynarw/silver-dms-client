import React from "react";
import {Grid, Tag, Button } from 'antd';
import { GetTitle } from "./util";
import { MdArrowDropDown } from "react-icons/md";
import styles from "./styles.module.css";

const { Row, Col } = Grid;

const colorCodes = {
  "Midsem": "blue",
  "Endsem": "magenta",
  "Quiz": "purple",
  "Assignment": "green",
  "Lecture Notes": "volcano",
}

function FileHeader({ data }) {
  return (
    <div className={styles.Header}>
      <div className={styles.title} onClick={(e) => e.stopPropagation()}><GetTitle data={data} /></div>
      <div className={styles.type} onClick={(e) => e.stopPropagation()}>
        {data["Type of material"].split(', ').map((type) => (<Tag color={colorCodes[type]}>{type}</Tag>))}
      </div>
      <div className={styles.fileContainer} onClick={(e) => e.stopPropagation()}>
        <span className={styles.files}>{data["Upload Files"].length}</span>
      </div>
      <div className={styles.accept} onClick={(e) => e.stopPropagation()}>
        <Button type="primary" block className={styles.primary}>Accept All</Button>
      </div>
      <div className={styles.reject} onClick={(e) => e.stopPropagation()}>
        <Button type="text" className={styles.secondary}>Reject All</Button>
      </div>
      <div className={styles.openbutton}>
        <Button type="text" bordered={false} ><MdArrowDropDown size={24} /></Button>
      </div>
    </div>
  );
}
export default FileHeader;
