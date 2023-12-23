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


const AdminTopic = ()=>{
    const [items, setItems] = useState([]);
    const [itemReport, setItemReport] = useState([]);
    useEffect(()=>{
        const getTopic = async() =>{
            const response = await requestGet('http://localhost:8080/api/topic/teacher/my-topic');
            var list = await response.json();
            setItems(list)
        };
        getTopic();
    }, []);


    const getReport = async(idTopic) =>{
        const response = await requestGet('http://localhost:8080/api/report/teacher/findByTopic?id='+idTopic);
        var list = await response.json();
        setItemReport(list)
    };

    return (
        <div>
            <div class="col-sm-12 header-sp">
                    <h4>Danh sách đề tài là giảng viên hướng dẫn</h4>
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
                                        <td>{item.schoolYear.currentYear==true?<span className='text-green'>{item.schoolYear.name}</span>:item.schoolYear.name}</td>
                                        <td>{item.name}</td>
                                        <td>{item.description}</td>
                                        <td>{item.createdDate}</td>
                                        <td>{item.linkFile != null ? <a href={item.linkFile}>Xem file hướng dẫn</a>:""}</td>
                                        <td class="sticky-col">
                                            <i onClick={()=>getReport(item.id)} data-bs-toggle="modal" data-bs-target="#reportmodal" className='fa fa-file pointer' > Xem báo cáo</i>
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

            <div class="modal fade" id="reportmodal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="false">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">Danh sách báo cáo</h5> <button id='btnclosemodal' type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button></div>
                        <div class="modal-body row">
                            <table class="table table-striped tablefix">
                                <thead class="thead-tablefix">
                                    <tr>
                                        <th>Tên báo cáo</th>
                                        <th>Ngày tạo</th>
                                        <th>Loại file</th>
                                        <th>Ghi chú</th>
                                        <th>Người đăng</th>
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

export default AdminTopic;