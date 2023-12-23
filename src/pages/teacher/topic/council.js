import { useState, useEffect } from 'react'
import ReactPaginate from 'react-paginate';
import {toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AsyncSelect from 'react-select/async';
import Select from 'react-select';
import {requestGet} from '../../../services/request'

var token = localStorage.getItem('token');

const AdminTopic = ()=>{
    const [items, setItems] = useState([]);
    const [itemReport, setItemReport] = useState([]);
    const [itemTopicPerson, setItemTopicPerson] = useState([]);
    useEffect(()=>{
        const getTopic = async() =>{
            const response = await requestGet('http://localhost:8080/api/council-person/teacher/my-councilperson');
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

    async function updateMark(id){
        var mark = document.getElementById("mark"+id).value
        var note = document.getElementById("note"+id).value
        var url = 'http://localhost:8080/api/council-person/teacher/updateMark?id='+id+'&mark='+mark+'&note='+note
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
            toast.error("Có lỗi xảy ra");
        }
    }

    const getTopicPerson = async(idTopic) =>{
        const response = await requestGet('http://localhost:8080/api/topic-person/teacher/findByTopic?id='+idTopic);
        var list = await response.json();
        setItemTopicPerson(list)
    };

    return (
        <div>
            <div class="col-sm-12 header-sp">
                    <h4>Danh sách đề tài là thành viên hội đồng</h4>
                </div>
                <div class="col-sm-12">
                    <div class="wrapper">
                        <table class="table table-striped tablefix">
                            <thead class="thead-tablefix">
                                <tr>
                                    <th>id</th>
                                    <th>Học kỳ</th>
                                    <th>Tên đề tài</th>
                                    <th>Hội đồng</th>
                                    <th>Giờ báo cáo</th>
                                    <th>Ngày báo cáo</th>
                                    <th>Điểm số</th>
                                    <th>Ghi chú</th>
                                    <th>Thành viên hội đồng</th>
                                    <th class="sticky-col">Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.map(item=>{
                                    return <tr>
                                        <td>{item.id}</td>
                                        <td>{item.council.topic.schoolYear.name}</td>
                                        <td>{item.council.topic.name}</td>
                                        <td>{item.council.name}</td>
                                        <td>{item.council.timeReport}</td>
                                        <td>{item.council.dayReport}</td>
                                        <td><input id={"mark"+item.id} defaultValue={item.mark} className='form-control'/></td>
                                        <td><textarea id={"note"+item.id} defaultValue={item.note} className='form-control notegh'></textarea></td>
                                        <td>
                                            <table className='table table-border'>
                                            <tr>
                                                <th>Mã giảng viên</th>
                                                <th>Họ tên</th>
                                                <th>Điểm</th>
                                            </tr>
                                            {item.council.councilPersons.map(itemperson=>{
                                                return <tr>
                                                    <td>{itemperson.person.code}</td>
                                                    <td>{itemperson.person.fullname}</td>
                                                    <th>{itemperson.mark}</th>
                                                </tr>
                                                })}
                                            </table>
                                        </td>
                                        <td class="sticky-col">
                                            <i onClick={()=>getReport(item.council.topic.id)} data-bs-toggle="modal" data-bs-target="#reportmodal" className='fa fa-file pointer' > Xem báo cáo</i>
                                            <i onClick={()=>getTopicPerson(item.council.topic.id)} data-bs-toggle="modal" data-bs-target="#membermodal" className='fa fa-users pointer' > Ds sinh viên</i>
                                            <button onClick={()=>updateMark(item.id)} className='btn btn-primary fontsm'>Cập nhật điểm</button>
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

            <div class="modal fade" id="membermodal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="false">
                <div class="modal-dialog modal-xl">
                    <div class="modal-content">
                        <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">Danh sách thành viên</h5> <button id='btnclosemodal' type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button></div>
                        <div class="modal-body row">
                            <div className='paddingmodal'>
                                <table class="table table-striped tablefix">
                                    <thead class="thead-tablefix">
                                        <tr>
                                            <th>Mã sinh viên</th>
                                            <th>Họ tên</th>
                                            <th>Email</th>
                                            <th>Số điện thoại</th>
                                            <th>Lớp</th>
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
                                            </tr>
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminTopic;