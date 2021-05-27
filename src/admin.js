import './admin.css';
import React from 'react';
import ReactDOM from 'react-dom'
import Toolbar from './components/Toolbar';
import { LeftMenu, RightMenu, FileMenu } from './components/Menu';

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
        arr[0].name = document.getElementById('newname').value;
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
