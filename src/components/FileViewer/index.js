/* eslint-disable react/prop-types */
import React, {
  useState, useEffect, useContext,
} from 'react';
import {
  Spin, List, Row, Col, Tag,
} from 'antd';
import FileEntry from '../FileEntry';
import { filterAccepted } from '../../utils';
import { SocketContext } from '../Socket';
import filterByTag from './filterByTag';
import styles from './styles.module.css';
import 'antd/dist/antd.css';

const { CheckableTag } = Tag;
const tagsData = ['Assignment', 'Quiz', 'Endsem', 'Midsem', 'Lecture Notes'];

function FileContainer() {
  const [loading, setLoading] = useState(true);
  const [fileArray, setFileArray] = useState([]);
  const [selectedTags, setSelectedTags] = useState(tagsData);
  const [minmax, setMinMax] = useState({ min: 0, max: 10 });
  const socket = useContext(SocketContext);

  useEffect(() => {
    function processData(files) {
      files.forEach((element) => {
        // eslint-disable-next-line no-param-reassign
        element['Upload Files'] = element['Upload Files'].split(', ');
      });
      setFileArray(files);
      setLoading(false);
    }
    // fetch('http://localhost:5000/data').then((res) => res.json()).then(processData);
    socket.on('data', processData);
    socket.emit('loaddata');
    return () => socket.off('data', processData);
  }, []);

  function handlePageChange(page, pageSize) {
    setMinMax({ min: (page - 1) * pageSize, max: page * pageSize });
  }

  function handleChange(tag, checked) {
    const nextSelectedTags = checked ? [...selectedTags, tag] : selectedTags.filter((t) => t !== tag);
    setSelectedTags(nextSelectedTags);
  }
  const { min, max } = minmax;
  const remainingFiles = filterByTag(filterAccepted(fileArray), selectedTags);
  const filteredFiles = remainingFiles.slice(min, max);

  return (
    <>
      {loading && <Spin spinning />}
      {!loading && (
        <>
          <Row>
            <Col span={24}>
              <h1 className={styles.h1}>Files</h1>
              {tagsData.map((tag) => (
                <CheckableTag
                  key={tag}
                  checked={selectedTags.indexOf(tag) > -1}
                  onChange={(checked) => handleChange(tag, checked)}
                >
                  {tag}
                </CheckableTag>
              ))}
            </Col>
          </Row>
          <div>
            <List
              dataSource={filteredFiles}
              pagination={{
                total: remainingFiles.length,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total) => `Total ${total} items`,
                onChange: handlePageChange,
              }}
              renderItem={(file) => (
                <List.Item key={file.ID}>
                  <FileEntry data={file} />
                </List.Item>
              )}
            />
          </div>
        </>
      )}
    </>
  );
}
export default FileContainer;
