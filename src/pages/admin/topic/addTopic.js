import {toast } from 'react-toastify';
import { useState, useEffect } from 'react'
import Select from 'react-select';
import AsyncSelect from 'react-select/async';
import 'react-toastify/dist/ReactToastify.css';
import React, { useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import {requestGet,uploadFile} from '../../../services/request'


var token = localStorage.getItem('token');

var uls = new URL(document.URL)
var id = uls.searchParams.get("id");


const AdminAddEmployee = ()=>{
    const [topic, setTopic] = useState(null);
    const [itemSchoolYear, setItemSchoolYear] = useState([]);
    const [initSchoolYear, setSchoolYear] = useState(null);
    useEffect(()=>{
        const getSchoolYear = async() =>{
            const response = await requestGet('http://localhost:8080/api/schoole-year/public/findAll');
            var list = await response.json();
            setItemSchoolYear(list);
        };
        getSchoolYear();

        const loadInit = async() =>{
            if(id != null){
                const response = await requestGet('http://localhost:8080/api/topic/public/findById?id='+id);
                var result = await response.json();
                setTopic(result)
                if(result.schoolYear != null){
                    setSchoolYear({id:result.schoolYear.id,name:result.schoolYear.name})
                }
            }
        };
        loadInit();
    },[]);

    const editorRef = useRef(null);
    async function saveTopic(event){
        event.preventDefault();
        document.getElementById("loading").style.display = 'block'
        var linkFile = await uploadFile(document.getElementById("filehuongdan"));
        const payload = { 
            id:id,
            name:event.target.elements.topicName.value,
            content:editorRef.current.getContent(),
            description:event.target.elements.description.value,
            linkFile:linkFile!=null?linkFile:event.target.elements.linkfile.value,
            schoolYear:{
                id:event.target.elements.hocky.value
            },
        }
        var url = 'http://localhost:8080/api/topic/admin/create'
        const response = await fetch(url, {
            method: 'POST',
            headers: new Headers({
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
            }),
            body: JSON.stringify(payload)
        });
        if (response.status < 300) {
            toast.success("Thành công");
            await new Promise(resolve => setTimeout(resolve, 1500));
            window.location.href = 'topic';
        }
        if (response.status == 417) {
            var result = await response.json()
            toast.warning(result.errorMessage);
        }
        document.getElementById("loading").style.display = 'none'
    }
    return(
        <form onSubmit={saveTopic} className='row' method='post'>
            <h4>Thêm/ cập nhật đề tài</h4>
            <div className="col-sm-5">
                <label className="lb-form">Tên đề tài</label>
                <input defaultValue={topic==null?"":topic.name} name="topicName" className="form-control" />
                <label className="lb-form">Mô tả</label>
                <textarea defaultValue={topic==null?"":topic.description} name='description' className="form-control" ></textarea>
                <label className="lb-form">File hướng dẫn</label>
                <input id="filehuongdan" type='file' className="form-control" />
                <input name="linkfile" defaultValue={topic==null?"":topic.linkFile} type='hidden' className="form-control" />
                <label className="lb-form">Học kỳ</label>
                <Select
                value={initSchoolYear}
                onChange={(item) => {
                    setSchoolYear(item);
                  }}
                name='hocky'
                required={true}
                options={itemSchoolYear} 
                getOptionLabel={(itemSchoolYear)=>itemSchoolYear.name} 
                getOptionValue={(itemSchoolYear)=>itemSchoolYear.id}  
                placeholder="Chọn học kỳ"/>
                <div id="loading">
                    <div class="bar1 bar"></div>
                </div><br></br>
                <button className='btn btn-primary form-control'>Thêm/ cập nhật đề tài</button>
            </div>
            <div className="col-sm-7">
                <label className="lb-form">Nội dung</label>
                <Editor required={true}
                    id='content'
                    apiKey='f6s0gxhkpepxkws8jawvfwtj0l9lv0xjgq1swbv4lgcy3au3'
                    onInit={(evt, editor) => editorRef.current = editor}
                    initialValue={topic!= null?topic.content:"<p>Nhập nội dung đề tài.</p>"}
                />
            </div>
        </form>
    );
}

export default AdminAddEmployee;