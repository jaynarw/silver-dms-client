import './admin.css';
import React from 'react';
import ReactDOM from 'react-dom'
import Toolbar from './components/Toolbar';
import { LeftMenu, RightMenu, FileMenu } from './components/Menu';
import {Layout, Input} from "antd";
import "antd/dist/antd.css";
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
            fileArray:[],
            fileSelected:false,
            
        };
    }
    componentDidMount(){
        fetch("http://localhost:5000/data")
            .then(res=>res.json())
            .then(
                (result)=>{
                    this.setState({
                        fileArray:result.uploaded_files,
                    });
                },
                (error)=>{
                    this.setState({
                        fileArray:[{name:'file1',desc:'desc1'}],
                    });
                }
                
            )
    }
    
    handleRenameClick2(i){
        var farr = this.state.fileArray.slice();
        const input_form = (
            <div>
            <h3>
                Enter New Name
            </h3>
            <form>
                <Input type="text" onChange={null} value={this.state.fileArray[i].name}/>
                <Input type= "submit" onChange={null} value={'Change'}/>
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
            <li><FileMenu name={file.Course}
                            link={file.Link}
                          fileNumber={farr.indexOf(file)}  
                         onAcceptClick={()=>this.handleAcceptClick(farr.indexOf(file))}
                         onRenameClick={()=>this.handleRenameClick2(farr.indexOf(file))}
            />
            </li>)
        return (
            <Layout>
                <ul id='files'>{listItems}</ul>
            </Layout>
            
        );
    }
}
export default Box;
