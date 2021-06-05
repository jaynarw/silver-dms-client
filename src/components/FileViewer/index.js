/* eslint-disable react/prop-types */
import React, { useState, useEffect, useContext } from 'react';
import {
  Spin, List,
} from 'antd';
import FileEntry from '../FileEntry';
import { filterAccepted } from '../../utils';
import { SocketContext } from '../Socket';
import 'antd/dist/antd.css';

function FileContainer() {
  const [loading, setLoading] = useState(true);
  const [fileArray, setFileArray] = useState([]);
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
  const { min, max } = minmax;
  const remainingFiles = filterAccepted(fileArray);
  const filteredFiles = remainingFiles.slice(min, max);

  return (
    <>
      {loading && <Spin spinning />}
      {!loading && (
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
              <List.Item key={file.id}>
                <FileEntry data={file} />
              </List.Item>
            )}
          />
        </div>
      )}
    </>
  );
}
export default FileContainer;
