import React, { useState } from "react";
import { List, Input, Skeleton, Space, Button, Tag, Divider } from "antd";
import { AiOutlineEdit, AiOutlineLike, AiOutlineDislike } from 'react-icons/ai';
import { formatDate } from "../../utils";
import fileSize from "filesize";

const Suffix = (<AiOutlineEdit
style={{
  fontSize: 16,
  color: 'rgba(0,0,0,0.6)',
}}
/>);

const IconText = ({ icon, text }) => (
  <Space>
    <Button type="text" size="small">
    {React.createElement(icon)}
    {text}
    </Button>
  </Space>
);

function PreviewIframe({ src, title }) {
  const [showPreview, setShowPreview] = useState(false);
  return (showPreview ? (<iframe src={src} title={title} />) : (<div onClick={() => setShowPreview(true)}>Click to preview file</div>));
}

function FileDesc({ data }) {
  if (!data) {
    return null;
  }
  const { quotaBytesUsed, fileExtension, mimeType, createdDate, modifiedDate, sharingUser} = data;
  // const { displayName } = sharingUser;
  return (
  <>
    <Tag>{fileExtension}</Tag>
    <Tag>{mimeType}</Tag>
    {sharingUser && <Tag>{sharingUser.displayName}</Tag>}
    <Tag>{fileSize(quotaBytesUsed)}</Tag>
    <Divider type="vertical"/>
    <span style={{ marginRight: 8 }}>Created Date:</span>
    <Tag>{formatDate(createdDate)}</Tag>
    <Divider type="vertical"/>
    <span style={{ marginRight: 8 }}>Modified Date:</span>
    <Tag>{formatDate(modifiedDate)}</Tag>
  </>)
}

function FilePanelItem({ id, fileMetadata }) {
  return (<List.Item
    key={id}
    actions={[
      <IconText icon={AiOutlineLike} text="Accept" key="list-vertical-like-o" />,
      <IconText icon={AiOutlineDislike} text="Reject" key="list-vertical-dislike-o" />,
    ]}
    extra={
      (fileMetadata !== null) && (<PreviewIframe src={fileMetadata.embedLink} title={fileMetadata.title} />)
    }
  >
    <Skeleton loading={fileMetadata === null} active avatar>
      {(fileMetadata !== null) && (
        <>
          <List.Item.Meta
          title={<Input value={fileMetadata.title} suffix={Suffix} />}
          description={<FileDesc data={fileMetadata} />}
          />
        </>
        )
      }
    </Skeleton>
  </List.Item>);
}
export default FilePanelItem;