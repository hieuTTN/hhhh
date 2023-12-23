import { useState, useEffect } from 'react'
import ReactPaginate from 'react-paginate';
import {toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AsyncSelect from 'react-select/async';
import Select from 'react-select';
import {requestGet,uploadFile} from '../../../services/request'

var token = localStorage.getItem('token');



var idTopicSelect = null;
const MyTopic = ()=>{
    const [items, setItems] = useState([]);
    const [itemTopicPerson, setItemTopicPerson] = useState([]);
    const [itemStudent, setItemStudent] = useState([]);
    const [itemReport, setItemReport] = useState([]);
    const [itemTeacher, setItemTeacher] = useState([]);
    const [student, setStudent] = useState(null);
    const [report, setReport] = useState(null);
    const [topic, setTopic] = useState(null);
    const [leader, setLeader] = useState(false);
    const [itemCouncil, setItemCouncil] = useState([]);

    useEffect(()=>{
        const getTopic = async() =>{
            const response = await requestGet('http://localhost:8080/api/topic-person/student/MyTopicPerson');
            var list = await response.json();
            setItems(list)
        };
        getTopic();
        const getStudent = async() =>{
            const response = await requestGet('http://localhost:8080/api/person/student/all-student');
            var list = await response.json();
            setItemStudent(list)
        };
        getStudent();
        const getTeacher = async() =>{
            const response = await requestGet('http://localhost:8080/api/person/student/all-teacher');
            var list = await response.json();
            setItemTeacher(list);
        };
        getTeacher();
    }, []);
    var user = JSON.parse(window.localStorage.getItem('user'));
    const getTopicPerson = async(idTopic) =>{
        const response = await requestGet('http://localhost:8080/api/topic-person/student/findByTopic?id='+idTopic);
        var list = await response.json();
        setItemTopicPerson(list)
        idTopicSelect = idTopic;
        for(var i=0; i<list.length; i++){
            if(list[i].person.user.username == user.username && list[i].leader == true){
                setLeader(true);
            }
        }
    };

    async function addMember(){
        var con = window.confirm("Xác nhận thêm thành viên vào nhóm");
        if(con == false){return;}
        const payload = { 
            leader:false,
            person:{
                id:student.id
            },
            topic:{
                id:idTopicSelect
            },
        }
        var url = 'http://localhost:8080/api/topic-person/student/create'
        const response = await fetch(url, {
            method: 'POST',
            headers: new Headers({
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
            }),
            body: JSON.stringify(payload)
        });
        if (response.status < 300) {
            toast.success("Thêm hành công");
            getTopicPerson(idTopicSelect);
        }
        else {
            if(response.status == 417){
                var result  = await response.json();
                toast.error(result.errorMessage)
            } 
            else{
                toast.error("Thất bại")
            }
        }
    }

    async function deleteMember(id){
        var con = window.confirm("Xác nhận xóa thành viên");
        if(con == false){return;}
        var url = 'http://localhost:8080/api/topic-person/student/delete?id='+id
        const response = await fetch(url, {
            method: 'DELETE',
            headers: new Headers({
                'Authorization': 'Bearer ' + token,
            })
        });
        if (response.status < 300) {
            toast.success("Thành công");
            getTopicPerson(idTopicSelect);
        }
        else {
            toast.warning("Thất bại");
        }
    }

    const getReport = async(idTopic) =>{
        idTopicSelect = idTopic;
        const response = await requestGet('http://localhost:8080/api/report/student/findByTopic?id='+idTopic);
        var list = await response.json();
        setItemReport(list)
    };

    async function saveReport(event){
        event.preventDefault();
        document.getElementById("loading").style.display = 'block'
        var linkFile = await uploadFile(document.getElementById("chooseFile"));
        var chooseF = document.getElementById("chooseFile")
        const payload = { 
            id:event.target.elements.idreport.value,
            name:event.target.elements.reportName.value,
            note:event.target.elements.note.value,
            linkFile:linkFile!=null?linkFile:event.target.elements.linkFile.value,
            typeFile:linkFile!=null?chooseF.files[0].type:event.target.elements.typeFile.value,
            topic:{
                id:idTopicSelect
            }
        }
        console.log(payload);
        var url = 'http://localhost:8080/api/report/student/create'
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
            window.location.reload();
        }
        else{
            toast.error("Thất bại");
        }
        document.getElementById("loading").style.display = 'none'
    }

    async function deleteReport(id){
        var con = window.confirm("Xác nhận xóa báo cáo này?")
        if (con == false) {
            return;
        }
        var url = 'http://localhost:8080/api/report/student/delete?id=' + id;
        const response = await fetch(url, {
            method: 'DELETE',
            headers: new Headers({
                'Authorization': 'Bearer ' + token,
            })
        });
        if(response.status < 300){
            toast.success("Xóa thành công")
            getReport(idTopicSelect);
        }
        else{
            if(response.status == 417){
                var result  = await response.json();
                toast.error(result.errorMessage)
            } 
            else{
                toast.error("Xóa thất bại")
            }
        }
    }

    async function loadCouncil(id){
        const response = await requestGet('http://localhost:8080/api/counci/student/findByTopic?id='+id);
        var list = await response.json();
        setItemCouncil(list);
    }

    async function updateTeacher(event){
        event.preventDefault();
        var con = window.confirm("Xác nhận cập nhật giảng viên hướng dẫn");
        if(con == false){return;}
        var url = 'http://localhost:8080/api/topic/student/add-teacher?id='+topic.id+"&idperson="+event.target.elements.giangvienhd.value
        const response = await fetch(url, {
            method: 'POST',
            headers: new Headers({
                'Authorization': 'Bearer ' + token
            })
        });
        if (response.status < 300) {
            toast.success("Thành công");
            await new Promise(resolve => setTimeout(resolve, 1500));
            window.location.reload();
        }
        else {
            if(response.status == 417){
                var result  = await response.json();
                toast.error(result.errorMessage)
            } 
            else{
                toast.error("Thất bại")
            }
        }
    }

    return (
        <div>
            <div class="col-sm-12 header-sp">
                    <div class="row">
                        <div className='col-md-4 col-sm-6 col-6'>
                            <h4>Danh sách đề tài đã đăng ký</h4>
                        </div>
                    </div>
                </div>
                <div class="col-sm-12">
                    <div class="wrapper">
                        <table class="table table-striped tablefix">
                            <thead class="thead-tablefix">
                                <tr>
                                    <th>Học kỳ</th>
                                    <th>Tên đề tài</th>
                                    <th>Mô tả</th>
                                    <th>Cập nhật</th>
                                    <th>File hướng dẫn</th>
                                    <th>Giảng viên hướng dẫn</th>
                                    <th class="sticky-col">Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.map(item=>{
                                    return <tr>
                                        <td>{item.topic.schoolYear.currentYear==true?<span className='text-green'>{item.topic.schoolYear.name}</span>:item.topic.schoolYear.name}</td>
                                        <td>{item.topic.name}</td>
                                        <td>{item.topic.description}</td>
                                        <td>{item.topic.createdDate}</td>
                                        <td>{item.topic.linkFile != null ? <a href={item.topic.linkFile}>Xem file hướng dẫn</a>:""}</td>
                                        <td>
                                            {item.topic.teacher!= null?item.topic.teacher.code+" - "+item.topic.teacher.fullname:"Chưa có giảng viên hd"}
                                            <br/><i onClick={()=>setTopic(item.topic)} data-bs-toggle="modal" data-bs-target="#modalTeacher" className='fa fa-edit iconaction'></i>
                                        </td>
                                        <td class="sticky-col">
                                            <i onClick={()=>getTopicPerson(item.topic.id)} data-bs-toggle="modal" data-bs-target="#membermodal" className='fa fa-users pointer'> Thành viên</i>
                                            <i onClick={()=>getReport(item.topic.id)} data-bs-toggle="modal" data-bs-target="#reportmodal" className='fa fa-file pointer'> Báo cáo</i>
                                            <i onClick={()=>loadCouncil(item.topic.id)} data-bs-toggle="modal" data-bs-target="#modalhd" className='fa fa-users pointer'> Hội đồng</i>
                                        </td>
                                    </tr>
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>

            <div class="modal fade" id="reportmodal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="false">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">Danh sách báo cáo</h5> <button id='btnclosemodal' type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button></div>
                        <div class="modal-body row">
                            <form onSubmit={saveReport} method='post' className='divaddreport'>
                                <h4>Thêm báo cáo</h4>
                                <div className='row'>
                                    <div className='col-sm-5'>
                                        <label>Tên báo cáo</label>
                                        <input defaultValue={report==null?"":report.name} name='reportName' className='form-control'/>
                                        <label>Chọn file</label>
                                        <input id='chooseFile' type='file' className='form-control'/>
                                        <input defaultValue={report==null?"":report.id} name='idreport' type='hidden' className='form-control'/>
                                        <input defaultValue={report==null?"":report.linkFile} name='linkFile' type='hidden' className='form-control'/>
                                        <input defaultValue={report==null?"":report.typeFile} name='typeFile' type='hidden' className='form-control'/>
                                    </div>
                                    <div className='col-sm-7'>
                                        <label>Ghi chú</label>
                                        <textarea name='note' defaultValue={report==null?"":report.note} className='form-control'></textarea>
                                        <div id="loading">
                                            <div class="bar1 bar"></div>
                                        </div><br></br>
                                        <button className='btn btn-primary form-control'>Thêm/ cập nhật báo cáo</button>
                                    </div>
                                </div>
                            </form>
                            <table class="table table-striped tablefix">
                                <thead class="thead-tablefix">
                                    <tr>
                                        <th>Tên báo cáo</th>
                                        <th>Ngày tạo</th>
                                        <th>Loại file</th>
                                        <th>Ghi chú</th>
                                        <th>Người đăng</th>
                                        <th class="sticky-col">Hành động</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {itemReport.map(itemReport=>{
                                        return <tr>
                                            <td><a href={itemReport.linkFile} target='_blank'>{itemReport.name}</a></td>
                                            <td>{itemReport.createTime +", "+itemReport.createdDate}</td>
                                            <td>{itemReport.typeFile}</td>
                                            <td>{itemReport.note}</td>
                                            <td>{itemReport.person.fullname}</td>
                                            <td class="sticky-col">
                                                {itemReport.isTrue==false?"":
                                                <i onClick={()=>deleteReport(itemReport.id)} className='fa fa-trash pointer'></i>}
                                                {itemReport.isTrue==false?"":
                                                <i onClick={()=>setReport(itemReport)} className='fa fa-edit pointer'></i>}
                                            </td>
                                        </tr>
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal fade" id="membermodal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="false">
                <div class="modal-dialog modal-xl">
                    <div class="modal-content">
                        <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">Danh sách thành viên</h5> <button id='btnclosemodal' type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button></div>
                        <div class="modal-body row">
                            <div className='paddingmodal'>
                                <div className='row'>
                                    <div className='col-5'>
                                        <Select
                                        onChange={(item) => {
                                            setStudent(item);
                                        }}
                                        options={itemStudent} 
                                        getOptionLabel={(itemStudent)=>"MSV: "+itemStudent.code+", email: "+itemStudent.email+", "+ itemStudent.fullname} 
                                        getOptionValue={(itemStudent)=>itemStudent.id}  
                                        placeholder="Chọn sinh viên"/>
                                    </div>
                                    <div className='col-3'>
                                        <button onClick={()=>addMember()} className='btn btn-primary'>Thêm sinh viên</button>
                                    </div>
                                </div>
                                <table class="table table-striped tablefix">
                                    <thead class="thead-tablefix">
                                        <tr>
                                            <th>Mã sinh viên</th>
                                            <th>Họ tên</th>
                                            <th>Email</th>
                                            <th>Số điện thoại</th>
                                            <th>Lớp</th>
                                            <th class="sticky-col">Hành động</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {itemTopicPerson.map(itemTopicPerson=>{
                                            return <tr>
                                                <td>{itemTopicPerson.person.code}</td>
                                                <td>{itemTopicPerson.person.fullname}</td>
                                                <td>{itemTopicPerson.person.email}</td>
                                                <td>{itemTopicPerson.person.phone}</td>
                                                <td>{itemTopicPerson.person.classes== null?"":itemTopicPerson.person.classes.name}</td>
                                                <td class="sticky-col">
                                                    {leader==true&& itemTopicPerson.person.user.username != user.username?
                                                    <i onClick={()=>deleteMember(itemTopicPerson.id)} className='fa fa-trash iconaction'></i>:""}
                                                </td>
                                            </tr>
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="modal fade" id="modalTeacher" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="false">
                <div class="modal-dialog modal-xl">
                    <div class="modal-content">
                        <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">Chọn giảng viên</h5> <button id='btnclosemodal' type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button></div>
                        <div class="modal-body row">
                            <div className='paddingmodal'>
                                <form onSubmit={updateTeacher} className='row' method='post'>
                                    <div className='col-5'>
                                        <Select
                                        options={itemTeacher} 
                                        name='giangvienhd'
                                        getOptionLabel={(itemTeacher)=>"MGV: "+itemTeacher.code+", email: "+itemTeacher.email+", "+ itemTeacher.fullname} 
                                        getOptionValue={(itemTeacher)=>itemTeacher.id}  
                                        placeholder="Chọn giảng viên"/>
                                    </div>
                                    <div className='col-4'>
                                        <button className='btn btn-primary'>Cập nhật giảng viên hướng dẫn</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="modal fade" id="modalhd" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="false">
                <div class="modal-dialog modal-fullscreen">
                    <div class="modal-content">
                        <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">Hội đồng</h5> <button id='btnclosemodal' type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button></div>
                        <div class="modal-body row modalform">
                            <table class="table table-striped tablefix">
                                <thead class="thead-tablefix">
                                    <tr>
                                        <th>Id</th>
                                        <th>Tên hội đồng</th>
                                        <th>Ngày tạo</th>
                                        <th>Ngày báo cáo</th>
                                        <th>Giờ báo cáo</th>
                                        <th>Thành viên hội đồng</th>
                                    </tr>
                                </thead>
                                <tbody>
                                {itemCouncil.map(item=>{
                                    return <tr>
                                        <td>{item.id}</td>
                                        <td>{item.name}</td>
                                        <td>{item.createdDate}</td>
                                        <td>{item.dayReport}</td>
                                        <td>{item.timeReport}</td>
                                        <td>
                                            <table className='table table-border'>
                                            <tr>
                                                <th>Mã giảng viên</th>
                                                <th>Họ tên</th>
                                                <th>Điểm</th>
                                                <th>Ghi chú</th>
                                            </tr>
                                            {item.councilPersons.map(itemperson=>{
                                                return <tr>
                                                    <td>{itemperson.person.code}</td>
                                                    <td>{itemperson.person.fullname}</td>
                                                    <th>{itemperson.mark}</th>
                                                    <td>{itemperson.note}</td>
                                                </tr>
                                                })}
                                            </table>
                                        </td>
                                    </tr>
                                })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MyTopic;