import { useState, useEffect } from 'react'
import ReactPaginate from 'react-paginate';
import {toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AsyncSelect from 'react-select/async';
import Select from 'react-select';
import {requestGet,uploadFile} from '../../../services/request'

var token = localStorage.getItem('token');
var size =10;
var urlAll = ""
async function loadAllPerson(page, idClass){
    var url = 'http://localhost:8080/api/person/admin/all-teacher?size=' + size;
    if(idClass != null) {url+= "&id="+idClass}
    urlAll = url;
    url += '&page='+page; 
    var response = await requestGet(url);
    return response;
}


const AdminTopic = ()=>{
    const [items, setItems] = useState([]);
    const [pageCount, setpageCount] = useState(0);
    useEffect(()=>{
        const getPerson = async(page) =>{
            const response = await loadAllPerson(page, null);
            var result = await response.json();
            var totalPage = result.totalPages;
            setItems(result.content)
            setpageCount(totalPage);
        };
        getPerson(0);

    }, []);

    async function deletePerson(id){
        var con = window.confirm("Xác nhận xóa thành viên này?")
        if (con == false) {
            return;
        }
        var url = 'http://localhost:8080/api/person/admin/delete?id=' + id;
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

    async function loadAllPersonByUrl(page){
        const response = await fetch(urlAll+'&page='+page, {
            method: 'GET',
            headers: new Headers({
                'Authorization': 'Bearer ' + token,
            })
        });
        return response;
    }

    const fetchPerson = async (page) => {
        const res = await loadAllPersonByUrl(page);
        var result = await res.json();
        var totalPage = result.totalPages;
        setItems(result.content)
        setpageCount(totalPage);
        return result.content;
    };

    const handlePageClick = async (data)=>{
        var currentPage = data.selected
        const listClass = await fetchPerson(currentPage);
    }




    return (
        <div>
            <div class="col-sm-12 header-sp">
                    <div class="row">
                        <div className='col-3'>
                            <a href='add-teacher' className='btn btn-primary'>Thêm giảng viên</a>
                        </div>
                    </div>
                </div>
                <div class="col-sm-12">
                    <div class="wrapper">
                        <table class="table table-striped tablefix">
                            <thead class="thead-tablefix">
                                <tr>
                                    <th>id</th>
                                    <th>Mã</th>
                                    <th>Họ tên</th>
                                    <th>Số điện thoại</th>
                                    <th>Email</th>
                                    <th>Địa chỉ</th>
                                    <th class="sticky-col">Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.map(item=>{
                                    return <tr>
                                        <td>{item.id}</td>
                                        <td>{item.code}</td>
                                        <td>{item.fullname}</td>
                                        <td>{item.phone}</td>
                                        <td>{item.email}</td>
                                        <td>{item.address}</td>
                                        <td class="sticky-col">
                                            <a href={"add-student?id="+item.id}><i className='fa fa-edit iconaction'></i></a>
                                            <i onClick={()=>deletePerson(item.id)} className='fa fa-trash iconaction'></i>
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


        </div>
    );
}

export default AdminTopic;