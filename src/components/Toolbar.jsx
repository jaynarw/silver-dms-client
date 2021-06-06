import React from 'react';
import {Button} from "antd";
import "antd/dist/antd.css"
function Toolbar(props) {
  if (props.fileEdit) {
    const tools = (
      <div>
        <form>
          <label for='newname' id='lnewname'>Enter New Name:</label>
          <input id='newname' name={'newname'} type={'text'} />
          <Button id='change' type = "default" onClick={(e) => {
            e.preventDefault();
            props.onChangeClick(e);
          }}>Change</Button>
        </form>

      </div>
    )
    return tools;
  }
  const tools = (
    <div>
      <Button  type = "ghost" id='rename' onClick={props.onRenameClick}>Rename</Button>
      <Button type = "dashed" id='accept'>Accept</Button>
      <Button type = "link" id='reject'>Reject</Button>
      <Button type = "text" id='addfle' onClick={props.onAddClick} >Add File</Button>
    </div>
  );
  return tools;
}
export default Toolbar;
