import './admin.css';
import React from 'react';
import ReactDOM from 'react-dom'
function Toolbar(props){
    if(props.fileEdit){
        const tools = (
            <div>
                <form>
                <label for='newname' id='lnewname'>Enter New Name:</label>
                <input id='newname'  name={'newname'} type={'text'}/>
                <button id='change'onClick={props.onChangeClick}>Change</button>
                </form> 

            </div>
        )
        return tools;
    }
    const tools = (
        <div>
            <button id ='rename' onClick={props.onRenameClick}>Rename</button>
            <button id = 'accept'>Accept</button>
            <button id='reject'>Reject</button>
            <button id='addfle' onClick={props.onAddClick} >Add File</button>
        </div>
    );
    return tools;
}
/*function FileOptions(props){
    const options = (
        <div id = 'general-options'>
            <button onClick={props.onRenameClick}>Rename</button>
            <br/>
            <button onClick={props.onViewClick}>View Upload</button>
            <br/>
        </div>
    );
    return (
        options
    );
}*/

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

class Box extends React.Component{
    constructor(props){
        super(props);
        this.state={
            fileArray:[{name:'FileDemo',size:23},{name:'File2',size:3,desc:'This file has some contents for getting A grade'}],
            fileSelected:false,
            
        };
    }
    
    handleRenameClick2(i){
        var farr = this.state.fileArray.slice();
        const input_form = (
            <div>
            <h3>
                Enter New Name
            </h3>
            <form>
                <input type="text" onChange={null} value={this.state.fileArray[i].name}/>
                <input type= "submit" onChange={null} value={'Change'}/>
            </form>

            </div>
        );
        ReactDOM.render(
            input_form,
            document.getElementById('name_input')
        );

    }
    handleChangeClick = ()=>{
        var arr = this.state.fileArray.slice();
        arr[0].name='New File';
        arr[0].name = document.getElementsById('newname').value;
        console.log(arr[0].name);
        this.setState({
            fileSelected:false,
        });
        return;
    }
    handleRenameClick = ()=>{
        const farr = this.state.fileArray.slice();
        this.setState({
            fileArray:farr,
            fileSelected:true,
        }
        );
        return;
    }
    handleAddClick = ()=>{
        var farr = this.state.fileArray.slice();
        const newFile = {
            name:'File '+ (1+farr.length),
            desc:'This is a custom made file',
            size:23,
        };
        farr.push(newFile);
        this.setState({
            fileArray:farr,
        });
        return;
    }
    handleAcceptClick(i){
        var farr = [];
        var pos = 0;
        for(let f in this.state.fileArray){
            if(pos === i){
                pos++;
                continue;
            }
                
            farr.push(f);
            pos++;
        }
        this.setState({
            fileArray:farr,
        });
        return ;
    }
    render(){
        ReactDOM.render(
            <Toolbar fileEdit={this.state.fileSelected} 
                onRenameClick={this.handleRenameClick} onChangeClick={this.handleChangeClick}
                onAddClick={this.handleAddClick}
            />,
            document.getElementById('toolbar')
        );
        const farr = this.state.fileArray.slice();
        const listItems = farr.map((file)=>
            <li><FileMenu name={file.name}
                          fileNumber={farr.indexOf(file)}  
                         onAcceptClick={()=>this.handleAcceptClick(farr.indexOf(file))}
                         onRenameClick={()=>this.handleRenameClick2(farr.indexOf(file))}
            />
            </li>)
        return (
            <ul id='files'>{listItems}</ul>
        );
    }
}
export default Box;