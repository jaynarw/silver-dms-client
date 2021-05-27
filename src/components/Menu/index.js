import React from 'react';

class LeftMenu extends React.Component{
  constructor(props){
      super(props);
      this.state={
          Name:["File1","File2","File3"],
          editing:false,      
      };
  }
  handleRenameClick = ()=>{
      this.setState({
          editing:true,
      }
      );
      return;
  }
  handleChangeNameClick = (e)=>{
      var fileNames = this.state.Name.slice();
   
      fileNames[this.props.fileNumber] = e.target.value;
      this.setState({
          Name:fileNames,
      });
  }
  handleChangeClick = ()=>{
      this.setState({
          editing:false,
      });
  }
  render(){
      const menu = !this.state.editing?(
          <div>
              <p>{this.state.Name[this.props.fileNumber]}</p>
              <button onClick={this.handleRenameClick}>{this.props.button1}</button>
              <button >{this.props.button2}</button>
          </div>
      ):(
          <div>
              <label for = "new_name">Enter new name: </label>
              <input minLength={1} id="new_name"type="text" value={this.state.Name[this.props.fileNumber]} onChange={this.handleChangeNameClick}/>
              <button onClick={this.handleChangeClick}>Change Name</button>
          </div>
      );
      return(
          menu
      );

  }
}
class RightMenu extends React.Component{
  constructor(props){
      super(props);
      this.state={

      };
  }
}

class FileMenu extends React.Component{
  constructor(props){
      super(props);
      this.state={
          filename:this.props.name,
          editingFile:false,
      };
  }
  render(){
      const fileBox = (
          <button id='file_info'>
          <div class='encloser'>
              
              <div class ='foption' id="left">
                  <LeftMenu button1='Rename' button2='View Upload' fileNumber={this.props.fileNumber}/>
              </div>
              <div class = 'fdesc'>
                  <p>{this.props.name}</p>
                  <p>This has the description of the file.</p>
              </div>
              <div class='decide' id = 'right'>
                  <p>Accept/Reject Button</p>
              
                  <LeftMenu button1={'Accept'} button2 = {'Reject'}/>
              </div>
              
          </div>
          </button>
      );
      return (
          fileBox
      );
  }
}

export { LeftMenu, RightMenu, FileMenu };
