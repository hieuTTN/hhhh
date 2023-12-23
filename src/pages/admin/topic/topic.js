import { useState, useEffect } from 'react'
import ReactPaginate from 'react-paginate';
import {toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AsyncSelect from 'react-select/async';
import Select from 'react-select';
import {requestGet} from '../../../services/request'

var token = localStorage.getItem('token');
var size =10;
var urlAll = ""
async function loadAllTopic(page, idSchoolYear){
    var url = 'http://localhost:8080/api/topic/public/findAll?size=' + size;
    if(idSchoolYear != null) {url+= "&id="+idSchoolYear}
    urlAll = url;
    url += '&page='+page; 
    const response = await fetch(url, {
        method: 'GET',
        headers: new Headers({
            'Authorization': 'Bearer ' + token
        })
    });
    return response;
}


async function loadAllSchoolYear(){
    var url = 'http://localhost:8080/api/schoole-year/public/findAll';
    const response = await fetch(url, {
        method: 'GET'
    });
    return response;
}

async function confirmRequest(id){
    var url = 'http://localhost:8080/api/request-topic/admin/accept?id='+id;
    const response = await fetch(url, {
        method: 'POST',
        headers: new Headers({
            'Authorization': 'Bearer ' + token
        })
    });
    if(response.status < 300){
        toast.success("Thành công")
        await new Promise(resolve => setTimeout(resolve, 1500));
        window.location.reload();
    }
    else{
        if(response.status == 417){
            var result  = await response.json();
            toast.error(result.errorMessage)
        } 
        else{
            toast.error("Thất bại")
        }
    }
}

async function cancelRequest(id){
    var url = 'http://localhost:8080/api/request-topic/admin/cancel?id='+id;
    const response = await fetch(url, {
        method: 'DELETE',
        headers: new Headers({
            'Authorization': 'Bearer ' + token
        })
    });
    if(response.status < 300){
        toast.success("Thành công")
        await new Promise(resolve => setTimeout(resolve, 1500));
        window.location.reload();
    }
    else{
        if(response.status == 417){
            var result  = await response.json();
            toast.error(result.errorMessage)
        } 
        else{
            toast.error("Thất bại")
        }
    }
}

async function deleteRequest(id){
    var con = window.confirm("xác nhận xóa");
    if(con == false){return;}
    var url = 'http://localhost:8080/api/request-topic/admin/delete?id='+id;
    const response = await fetch(url, {
        method: 'DELETE',
        headers: new Headers({
            'Authorization': 'Bearer ' + token
        })
    });
    if(response.status < 300){
        toast.success("Thành công")
        await new Promise(resolve => setTimeout(resolve, 1500));
        window.location.reload();
    }
    else{
        if(response.status == 417){
            var result  = await response.json();
            toast.error(result.errorMessage)
        } 
        else{
            toast.error("Thất bại")
        }
    }
}

async function deleteCouncilPerson(id){
    var con = window.confirm("xác nhận xóa");
    if(con == false){return;}
    var url = 'http://localhost:8080/api/council-person/admin/delete?id='+id;
    const response = await fetch(url, {
        method: 'DELETE',
        headers: new Headers({
            'Authorization': 'Bearer ' + token
        })
    });
    if(response.status < 300){
        toast.success("Thành công")
        await new Promise(resolve => setTimeout(resolve, 1500));
        window.location.reload();
    }
    else{
        if(response.status == 417){
            var result  = await response.json();
            toast.error(result.errorMessage)
        } 
        else{
            toast.error("Thất bại")
        }
    }
}


const AdminTopic = ()=>{
    const [items, setItems] = useState([]);
    const [itemRequest, setItemRequest] = useState([]);
    const [itemSchoolYear, setItemSchoolYear] = useState([]);
    const [itemCouncil, setItemCouncil] = useState([]);
    const [itemTeacher, setItemTeacher] = useState([]);
    const [pageCount, setpageCount] = useState(0);
    useEffect(()=>{
        const getTopic = async(page) =>{
            const response = await loadAllTopic(page, null);
            var result = await response.json();
            var totalPage = result.totalPages;
            setItems(result.content)
            setpageCount(totalPage);
        };
        getTopic(0);

        const getSchoolYear = async() =>{
            var first = [{id:"",name:"Tất cả học kỳ"}]
            const response = await loadAllSchoolYear();
            var list = await response.json();
            setItemSchoolYear(first.concat(list));
        };
        getSchoolYear();

        const getTeacher = async() =>{
            const response = await requestGet('http://localhost:8080/api/person/admin/all-teacher');
            var result = await response.json();
            setItemTeacher(result.content);
        };
        getTeacher();
    }, []);

    async function loadRequest(id){
        const response = await requestGet('http://localhost:8080/api/request-topic/admin/findByTopic?id='+id);
        var list = await response.json();
        setItemRequest(list);
    }

    async function deleteTopic(id){
        var con = window.confirm("Xác nhận xóa đề tài này?")
        if (con == false) {
            return;
        }
        var url = 'http://localhost:8080/api/topic/admin/delete?id=' + id;
        const response = await fetch(url, {
            method: 'DELETE',
            headers: new Headers({
                'Authorization': 'Bearer ' + token,
            })
        });
        if(response.status < 300){
            toast.success("Xóa thành công")
            await new Promise(resolve => setTimeout(resolve, 1500));
            window.location.reload();
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

    async function loadAllTopicByUrl(page){
        const response = await fetch(urlAll+'&page='+page, {
            method: 'GET',
            headers: new Headers({
                'Authorization': 'Bearer ' + token,
            })
        });
        return response;
    }

    const fetchTopic = async (page) => {
        const res = await loadAllTopicByUrl(page);
        var result = await res.json();
        var totalPage = result.totalPages;
        setItems(result.content)
        setpageCount(totalPage);
        return result.content;
    };

    const handlePageClick = async (data)=>{
        var currentPage = data.selected
        const listClass = await fetchTopic(currentPage);
    }

    async function loadBySchoolYear(e){
        var id = e.id==""?null:e.id;
        const response = await loadAllTopic(0, id);
        var result = await response.json();
        console.log(result);
        var totalPage = result.totalPages;
        setItems(result.content)
        setpageCount(totalPage);
    }

    async function loadCouncil(id){
        const response = await requestGet('http://localhost:8080/api/counci/admin/findByTopic?id='+id);
        var list = await response.json();
        setItemCouncil(list);
    }

    async function saveCouncilPerson(event){
        event.preventDefault();
        const payload = { 
            person:{id:event.target.elements.personid.value},
            council:{id:event.target.elements.councilid.value},
        }
        var url = 'http://localhost:8080/api/council-person/admin/create'
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
        if (response.status == 417) {
            var result = await response.json()
            toast.warning(result.errorMessage);
        }
    }

    async function updateTime(id){
        var dates = document.getElementById("date"+id).value
        var times = document.getElementById("time"+id).value
        var url = 'http://localhost:8080/api/counci/admin/updateTime?id='+id+'&date='+dates+'&time='+times
        const response = await requestGet(url);
        if (response.status < 300) {
            toast.success("Thành công");
            await new Promise(resolve => setTimeout(resolve, 1500));
            window.location.reload();
        }
        if (response.status == 417) {
            var result = await response.json()
            toast.warning(result.errorMessage);
        }
    }

    return (
        <div>
            <div class="col-sm-12 header-sp">
                    <div class="row">
                        <div className='col-3'>
                            <a href='add-topic' className='btn btn-primary'>Thêm đề tài</a>
                        </div>
                        <div className='col-md-4 col-sm-6 col-6'>
                            <Select
                            onChange={(item) => {
                                loadBySchoolYear(item);
                            }}
                            options={itemSchoolYear} 
                            getOptionLabel={(itemSchoolYear)=>itemSchoolYear.name} 
                            getOptionValue={(itemSchoolYear)=>itemSchoolYear.id}  
                            placeholder="Lọc theo học kỳ"/>
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
                                            <a href={"add-topic?id="+item.id}><i className='fa fa-edit iconaction'></i></a>
                                            <i onClick={()=>deleteTopic(item.id)} className='fa fa-trash iconaction'></i>
                                            <span onClick={()=>loadRequest(item.id)} data-bs-toggle="modal" data-bs-target="#addschoolyear" className='fontsm'> Xem yêu cầu</span>
                                            <span onClick={()=>loadCouncil(item.id)} data-bs-toggle="modal" data-bs-target="#modalhd" className='fontsm'> Xem hội đồng</span>
                                        </td>
                                    </tr>
                                })}
                            </tbody>
                        </table>
                    </div>
                    <ReactPaginate 
                    marginPagesDisplayed={2} 
                    pageCount={pageCount} 
                    onPageChange={handlePageClick}
                    containerClassName={'pagination'} 
                    pageClassName={'page-item'} 
                    pageLinkClassName={'page-link'}
                    previousClassName='page-item'
                    previousLinkClassName='page-link'
                    nextClassName='page-item'
                    nextLinkClassName='page-link'
                    breakClassName='page-item'
                    breakLinkClassName='page-link'  
                    activeClassName='active'/>
                </div>

            <div class="modal fade" id="addschoolyear" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="false">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">Danh sách yêu cầu</h5> <button id='btnclosemodal' type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button></div>
                        <div class="modal-body row modalform">
                            <table class="table table-striped tablefix">
                                <thead class="thead-tablefix">
                                    <tr>
                                        <th>Chủ đề</th>
                                        <th>Ngày gửi</th>
                                        <th>Người gửi</th>
                                        <th class="sticky-col">Hành động</th>
                                    </tr>
                                </thead>
                                <tbody id='listrequest'>
                                    {itemRequest.map(item=>{
                                        return <tr>
                                            <td>{item.topic.name}</td>
                                            <td>{item.createdDate}</td>
                                            <td>{item.person.fullname}<br/>{item.person.email}</td>
                                            <td class="sticky-col">
                                                {item.accept == true?
                                                <button onClick={()=>cancelRequest(item.id)} className='btn btn-danger'>Hủy</button>:
                                                <button onClick={()=>confirmRequest(item.id)} className='btn btn-primary'>Đồng ý</button>
                                                }
                                                {item.accept == true?"":
                                                <button onClick={()=>deleteRequest(item.id)} className='btn btn-danger'>Xóa</button>
                                                }
                                            </td>
                                        </tr>
                                    })}
                                </tbody>
                            </table>
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
                            <form onSubmit={saveCouncilPerson} method='post' className='headermodal row'>
                                <div className='col-sm-4'>
                                    <Select
                                    name='councilid'
                                    options={itemCouncil} 
                                    getOptionLabel={(itemCouncil)=>itemCouncil.name} 
                                    getOptionValue={(itemCouncil)=>itemCouncil.id}  
                                    placeholder="Chọn hội đồng"/>
                                </div>
                                <div className='col-sm-4'>
                                    <Select
                                    name='personid'
                                    options={itemTeacher} 
                                    getOptionLabel={(itemTeacher)=>itemTeacher.code+", "+itemTeacher.fullname+", "+itemTeacher.email} 
                                    getOptionValue={(itemTeacher)=>itemTeacher.id}  
                                    placeholder="Chọn giảng viên"/>
                                </div>
                                <div className='col-sm-4'>
                                    <button className='btn btn-primary'>Thêm vào hội đồng</button>
                                </div>
                            </form>
                            <table class="table table-striped tablefix">
                                <thead class="thead-tablefix">
                                    <tr>
                                        <th>Id</th>
                                        <th>Tên hội đồng</th>
                                        <th>Ngày tạo</th>
                                        <th>Ngày báo cáo</th>
                                        <th>Giờ báo cáo</th>
                                        <th>Thành viên hội đồng</th>
                                        <th class="sticky-col">Hành động</th>
                                    </tr>
                                </thead>
                                <tbody>
                                {itemCouncil.map(item=>{
                                    return <tr>
                                        <td>{item.id}</td>
                                        <td>{item.name}</td>
                                        <td>{item.createdDate}</td>
                                        <td><input id={"date"+item.id} type='date' defaultValue={item.dayReport} className='form-control'/></td>
                                        <td><input id={"time"+item.id} type='time' defaultValue={item.timeReport} className='form-control'/></td>
                                        <td>
                                        {item.councilPersons.map(itemperson=>{
                                            return <span>{itemperson.person.code+" - " +itemperson.person.fullname+" " }
                                                    <i onClick={()=>deleteCouncilPerson(itemperson.id)} className='fa fa-trash pointer'></i><br/>
                                                    </span>
                                        })}
                                        </td>
                                        <td class="sticky-col">
                                            <button onClick={()=>updateTime(item.id)} className='btn btn-primary fontsm'>Cập nhật thời gian báo cáo</button>
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

export default AdminTopic;