import { useState, useEffect } from 'react'
import ReactPaginate from 'react-paginate';
import {toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AsyncSelect from 'react-select/async';
import Select from 'react-select';
import {requestGet} from '../../../services/request'

var token = localStorage.getItem('token');

async function loadTopicById(id){
    const response = await requestGet('http://localhost:8080/api/topic/public/findById?id='+id);
    var obj = await response.json();
    document.getElementById("contenttopic").innerHTML = obj.content
}

async function cancelRequest(id){
    var con = window.confirm("Xác nhận hủy yêu cầu đăng ký");
    if(con == false){return;}
    var url = 'http://localhost:8080/api/request-topic/student/delete?id='+id
    const response = await fetch(url, {
        method: 'DELETE',
        headers: new Headers({
            'Authorization': 'Bearer ' + token,
        })
    });
    if (response.status < 300) {
        toast.success("Hủy yêu cầu thành công");
        await new Promise(resolve => setTimeout(resolve, 1500));
        window.location.reload();
    }
    else {
        toast.warning("Thất bại");
    }
}


async function sendRequest(id){
    var con = window.confirm("Xác nhận gửi yêu cầu đăng ký");
    if(con == false){return;}
    const payload = { 
        topic:{
            id:id
        }
    }
    var url = 'http://localhost:8080/api/request-topic/student/create'
    const response = await fetch(url, {
        method: 'POST',
        headers: new Headers({
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
        }),
        body: JSON.stringify(payload)
    });
    if (response.status < 300) {
        toast.success("Gửi yêu cầu thành công");
        await new Promise(resolve => setTimeout(resolve, 1500));
        window.location.reload();
    }
    else {
        toast.warning("Thất bại");
    }
}

const AdminTopic = ()=>{
    const [items, setItems] = useState([]);
    useEffect(()=>{
        const getTopic = async() =>{
            const response = await requestGet('http://localhost:8080/api/topic/public/topic-current-scyear');
            var list = await response.json();
            setItems(list)
        };
        getTopic();
    }, []);




    return (
        <div>
            <div class="col-sm-12 header-sp">
                    <div class="row">
                        <div className='col-md-4 col-sm-6 col-6'>
                            <h4>Danh sách đề tài</h4>
                        </div>
                    </div>
                </div>
                <div class="col-sm-12">
                    <div class="wrapper">
                        <table class="table table-striped tablefix">
                            <thead class="thead-tablefix">
                                <tr>
                                    <th>id</th>
                                    <th>Học kỳ</th>
                                    <th>Tên đề tài</th>
                                    <th>Mô tả</th>
                                    <th>Cập nhật</th>
                                    <th>File hướng dẫn</th>
                                    <th class="sticky-col">Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.map(item=>{
                                    return <tr>
                                        <td>{item.id}</td>
                                        <td>{item.schoolYear.name}</td>
                                        <td>{item.name}</td>
                                        <td>{item.description}</td>
                                        <td>{item.createdDate}</td>
                                        <td>{item.linkFile != null ? <a href={item.linkFile}>Xem file hướng dẫn</a>:""}</td>
                                        <td class="sticky-col">
                                            {item.required == true ?
                                            <span onClick={()=>cancelRequest(item.id)} className='text-green pointer'>Hủy gửi yêu cầu</span>:
                                            <i onClick={()=>sendRequest(item.id)} className='fa fa-edit pointer'> Gửi yêu cầu</i>}<br/>
                                            <i onClick={()=>loadTopicById(item.id)} data-bs-toggle="modal" data-bs-target="#contentdiv" className='fa fa-eye iconaction'></i>
                                        </td>
                                    </tr>
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div class="modal fade" id="contentdiv" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="false">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">Nội dung đề tài</h5> <button id='btnclosemodal' type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button></div>
                        <div class="modal-body row">
                            <div id='contenttopic'>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminTopic;