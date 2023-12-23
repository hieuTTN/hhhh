import { useState, useEffect } from 'react'
import ReactPaginate from 'react-paginate';
import {toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

var token = localStorage.getItem('token');
var size =10;
async function loadAllClass(page){
    var url = 'http://localhost:8080/api/classes/public/findAll?size=' + size+ '&page='+page;
    const response = await fetch(url, {
        method: 'GET'
    });
    return response;
}


async function saveClass(event){
    event.preventDefault();
    const payload = { 
        id:document.getElementById("idclass").value,
        name:document.getElementById("name").value,
    }
    // console.log(payload);
    var url = 'http://localhost:8080/api/classes/admin/create'
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
    else {
        toast.warning("Thất bại");
    }
}


const AdminClass = ()=>{
    const [items, setItems] = useState([]);
    const [pageCount, setpageCount] = useState(0);
    useEffect(()=>{
        const getClass = async(page) =>{
            const response = await loadAllClass(page);
            var result = await response.json();
            var totalPage = result.totalPages;
            setItems(result.content)
            setpageCount(totalPage);
        };
        getClass();

    }, []);

    async function loadClassById(id){
        var url = 'http://localhost:8080/api/classes/public/findById?id='+id;
        const response = await fetch(url, {
            method: 'GET'
        });
        var result = await response.json();
        document.getElementById("name").value = result.name
        document.getElementById("idclass").value = result.id
    }

    function clearData(){
        document.getElementById("name").value = ""
        document.getElementById("idclass").value = ""
    }

    async function deleteClass(id){
        var con = window.confirm("Xác nhận xóa lớp học này?")
        if (con == false) {
            return;
        }
        var url = 'http://localhost:8080/api/classes/admin/delete?id=' + id;
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

    const fetchClass = async (page) => {
        const res = await loadAllClass(page);
        var result = await res.json();
        var totalPage = result.totalPages;
        setItems(result.content)
        setpageCount(totalPage);
        return result.content;
    };

    const handlePageClick = async (data)=>{
        var currentPage = data.selected
        const listClass = await fetchClass(currentPage);
        // setItems(listClass);
    }

    return (
        <div>
            <div class="col-sm-12 header-sp">
                    <div class="row">
                        <div className='col-3'>
                            <button onClick={()=>clearData()} data-bs-toggle="modal" data-bs-target="#addclass" className='btn btn-primary'>Thêm lớp</button>
                        </div>
                    </div>
                </div>
                <div class="col-sm-12">
                    <div class="wrapper">
                        <table class="table table-striped tablefix">
                            <thead class="thead-tablefix">
                                <tr>
                                    <th>id</th>
                                    <th>Tên lớp</th>
                                    <th class="sticky-col">Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.map(item=>{
                                    return <tr>
                                        <td>{item.id}</td>
                                        <td>{item.name}</td>
                                        <td class="sticky-col">
                                            <i onClick={()=>loadClassById(item.id)} data-bs-toggle="modal" data-bs-target="#addclass" className='fa fa-edit iconaction'></i>
                                            <i onClick={()=>deleteClass(item.id)} className='fa fa-trash iconaction'></i>
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


                <div class="modal fade" id="addclass" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="false">
                <div class="modal-dialog modal-md">
                    <div class="modal-content">
                        <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">Thêm/ cập nhật lớp</h5> <button id='btnclosemodal' type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button></div>
                        <div class="modal-body row modalform">
                           <form onSubmit={saveClass} className='row' method='post'>
                                <input name='id' id='idclass' type='hidden'/>
                                <label>Tên lớp</label>
                                <input id='name' className='form-control' />
                                <button className='btn btn-primary btnsubmit'>Thêm/ cập nhật</button>
                           </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminClass;