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


const AdminAddPerson = ()=>{
    const [person, setPerson] = useState(null);
    useEffect(()=>{
    },[]);

    const editorRef = useRef(null);
    async function savePerson(event){
        event.preventDefault();
        document.getElementById("loading").style.display = 'block'
        var linkFile = await uploadFile(document.getElementById("fileavatar"));
        const payload = { 
            person:{
                id:id,
                code:event.target.elements.code.value,
                fullname:event.target.elements.fullname.value,
                phone:event.target.elements.phone.value,
                email:event.target.elements.email.value,
                address:event.target.elements.address.value,
                personType:"TEACHER",
                avatar:linkFile!=null?linkFile:event.target.elements.linkfile.value,
                description:editorRef.current.getContent(),
            },
            user:{
                id:event.target.elements.iduser.value,
                username:event.target.elements.email.value,
                avatar:linkFile!=null?linkFile:event.target.elements.linkfile.value,
            }
        }
        console.log(payload);
        var url = 'http://localhost:8080/api/person/admin/create'
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
            window.location.href = 'teacher';
        }
        if (response.status == 417) {
            var result = await response.json();
            console.log(result);
            toast.warning(result.errorMessage);
        }
        document.getElementById("loading").style.display = 'none'
    }
    return(
        <form onSubmit={savePerson} className='row' method='post'>
            <h4>Thêm/ cập nhật giảng viên</h4>
            <div className="col-sm-5">
                <label className="lb-form">Mã giảng viên</label>
                <input defaultValue={person==null?"":person.code} name="code" className="form-control" />
                <label className="lb-form">Họ tên</label>
                <input defaultValue={person==null?"":person.fullname} name='fullname' className="form-control" />
                <label className="lb-form">Số điện thoại</label>
                <input defaultValue={person==null?"":person.phone} name='phone' className="form-control" />
                <label className="lb-form">email (Tên đăng nhập)</label>
                <input required defaultValue={person==null?"":person.email} name='email' className="form-control" />
                <input defaultValue={person==null?"":person.user.id} name='iduser'type='hidden' />
                <label className="lb-form">Địa chỉ</label>
                <input defaultValue={person==null?"":person.address} name='address' className="form-control" />
                <label className="lb-form">Ảnh đại diện</label>
                <input id="fileavatar" type='file' className="form-control" />
                <input name="linkfile" defaultValue={person==null?"":person.avatar} type='hidden' className="form-control" />
            </div>
            <div className="col-sm-7">
                <label className="lb-form">Chi tiết thông tin</label>
                <Editor required={true}
                    id='content'
                    apiKey='f6s0gxhkpepxkws8jawvfwtj0l9lv0xjgq1swbv4lgcy3au3'
                    onInit={(evt, editor) => editorRef.current = editor}
                    initialValue={person!= null?person.description:"<p>Nhập chi tiết thông tin thành viên.</p>"}
                />
                <div id="loading">
                    <div class="bar1 bar"></div>
                </div><br></br>
                <button className='btn btn-primary form-control'>Thêm/ cập nhật giảng viên</button>
            </div>
        </form>
    );
}

export default AdminAddPerson;