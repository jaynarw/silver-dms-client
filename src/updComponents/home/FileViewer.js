import React, { useState, useEffect } from 'react';
import {Table, Space, Button, Spin,Alert} from "antd";
import "antd/dist/antd.css";

function FileContainer() {
    const [updatingData,setUpdatingData] = useState(false);
    const[updated,setUpdated] = useState([false,""]);
    const [loading, setLoading] = useState(true);
    const [fileArray, setFileArray] = useState([
        // {
        //     name:["name1","name2"],
        //     course:"",
        //     files:["file1","file2"],

            
        // },
         {"Academic Session": "2019-20",
          "Course Code": "CS425", 
          "ID": 0, 
         "Resource Accepted?": "Yes",
          "Timestamp": "12/01/2021 09:06:01",
           "Type of material": "Midsem",
            "Upload Files": ["https://drive.google.com/open?id=12saV3Dhw_vMpOQ7IWx-qPQP_7NthSB_4"]},

            {"Academic Session": "2019-20",
             "Course Code": "PHY473", 
             "ID": 1,
             "Resource Accepted?": "Yes, Yes", 
             "Timestamp": "14/01/2021 09:44:33", "Type of material": "Midsem", 
             "Upload Files": ["https://drive.google.com/open?id=15M_Wd3R2wQ4sujyM9Kc0s0Cenp-xL1xu", "https://drive.google.com/open?id=10yQn-9JM-Zx5ptAkf6X4tkvqsRdyfCTs"]},

    ]);
    
    useEffect(() => {
        fetch('http://localhost:5000/data').then((res) => res.json()).then((files) => {
            //console.log(files);
            files.forEach(element => {
                element['Upload Files'] = element['Upload Files'].split(",");
                element['responded'] = 
                console.log(element['Upload Files']);
            });
            setFileArray(files);
            console.log(files);
            setLoading(false);
        });
        return () => {
            console.log("This will be called when unmounted");
        };
    }, []);

     var renderedFileArray = fileArray.map((file,index)=>
         
            // <DataRow key={"f"+index} filename={"Demo"} course={file['Course Code']} 
            //         files={file['Upload Files']} mType={file['Type of material']}/>
            ({
                Id:file['ID'],
                name:'demo',
                session:file['Academic Session'],
                course:file['Course Code'],
                fileLinks:file['Upload Files'].map((file,index)=>
                <><li><a href = {file} target="_blank">View File {index +1}</a></li></>
                ),
                renameButtons:file['Upload Files'].map((f)=><><Button type='default' size='small'>Rename</Button><br/></>),
                actions:[file['ID'],file['Upload Files'].map((f,i)=>
                    <>
                    <Space size="small">
                        <Button type="link" onClick={()=>handleOnAcceptClick(index,i)}>Accept</Button>
                        <Button type="link" onClick={()=>handleOnRejectClick(index,i)}>Reject</Button>
                    </Space> 
                    <br/>
                    </>
                    
                  
                )]
            })
      
     );
    function handleOnAcceptClick(index, subIndex){
        if(!updatingData){
            setUpdated([false,""])
            setUpdatingData(true)
            var farr = fileArray.slice();
            farr[index]['Upload Files'].splice(subIndex,1);
            if(farr[index]['Upload Files'].length == 0){
                farr.splice(index,1);
            }
            fetch('http://localhost:5000/file-accepted/'+index+'&'+subIndex).then((res)=>
               setUpdated([true,res]) 
            )
            setUpdatingData(false);
            setFileArray(farr);

        }
        
    }
    function handleOnRejectClick(index,subIndex){
        if(!updatingData){
            setUpdated([false,""])
            setUpdatingData(true)
            var farr = fileArray.slice();
            farr[index]['Upload Files'].splice(subIndex,1);
            if(farr[index]['Upload Files'].length == 0){
                farr.splice(index,1);
            }
            fetch('http://localhost:5000/file-rejected/'+index+'&'+subIndex).then((res)=>{
                setUpdated([true,res]) 
                console.log(res);
            }
               
            )
            setUpdatingData(false);
            setFileArray(farr);

        }
    }
    function handleOnAcceptAllClick(index){
        var farr = fileArray.slice();
        farr.splice(index,1);
        setFileArray(farr);
    }
    function handleOnRejectAllClick(index){
        var farr = fileArray.slice();
        farr.splice(index,1);
        setFileArray(farr);
    }
    
    const columns=[
        {
            title: 'Uploaded By',
            dataIndex:'name',
            key:'name',
            

        },
        {
            title:'Academic Session',
            dataIndex:'session',
            key:'session',
        },
        {
            title: 'Course',
            dataIndex:'course',
            key:'course',
        },
        {
            title:'Uploaded Files',
            dataIndex:'fileLinks',
            key:'files',
            //  render:(files) => files.map((file, index)=>
            //      <li><a href={file}>View File {index}</a></li>
            //  ),
        },
        {
            title:'Edit File',
            dataIndex:'renameButtons',
            key:'editFile',
        //     render:()=>(
        //         <Button type="primary">Rename</Button>
        //     ),
         },
        {
            title:'Actions',
            dataIndex:['actions'],
            key:'actions',
            
            render:(b)=>(
                <>
                
                {b[1]}
                <Space size="small">
                    {!updatingData}?(
                        <Button type="dashed" size='small'
                     onClick={()=>handleOnAcceptAllClick(b[0])}>Accept All</Button>
                    <Button type="dashed" size="small"
                     onClick={()=>handleOnRejectAllClick(b[0])}>Reject All</Button>
                    ):
                    (   {!updated[0]}?
                        <Alert message='Updating...' type='warning' size='small'/>
                        :
                        <Alert message={updated[1]} type='success' size='small'/>
                    )
                    
                </Space>
                </>
            ),
        
        },
    ];
    var dispalyTable = (<Table columns={columns} dataSource={renderedFileArray} scroll={{y:650}}/>)
    console.log(renderedFileArray);
    return (<>
    {loading && <Spin spinning />}
    {!loading && dispalyTable}
    </>);
}
export default FileContainer;
