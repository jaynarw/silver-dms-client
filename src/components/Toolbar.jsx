import React from 'react';

function Toolbar(props) {
  if (props.fileEdit) {
    const tools = (
      <div>
        <form>
          <label for='newname' id='lnewname'>Enter New Name:</label>
          <input id='newname' name={'newname'} type={'text'} />
          <button id='change' onClick={(e) => {
            e.preventDefault();
            props.onChangeClick(e);
          }}>Change</button>
        </form>

      </div>
    )
    return tools;
  }
  const tools = (
    <div>
      <button id='rename' onClick={props.onRenameClick}>Rename</button>
      <button id='accept'>Accept</button>
      <button id='reject'>Reject</button>
      <button id='addfle' onClick={props.onAddClick} >Add File</button>
    </div>
  );
  return tools;
}
export default Toolbar;
