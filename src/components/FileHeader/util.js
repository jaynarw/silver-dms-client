import React from 'react';
import { Tooltip } from 'antd';


function GetTitle({ data }) {
  return (<Tooltip title={data.Timestamp}>
  <span style={{
    fontSize: "17px",
    fontWeight: "600",
    marginRight: "4px",
  }}>{data['Course Code']}</span>
   <span style={{
    fontSize: "13px",
    fontWeight: "normal",
    color: "rgba(0,0,0,0.6)",
  }}>{`${data['Academic Session']}`}</span></Tooltip>);
}
export { GetTitle };
