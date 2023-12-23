import { useState, useEffect } from 'react'
import ReactPaginate from 'react-paginate';
import {toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

var token = localStorage.getItem('token');
async function loadAllSchoolYear(){
    var url = 'http://localhost:8080/api/schoole-year/public/findAll';
    const response = await fetch(url, {
        method: 'GET'
    });
    return response;
}


async function saveSchoolyear(event){
    const payload = { 
        id:document.getElementById("idschoolyear").value,
        name:document.getElementById("name").value,
        currentYear:document.getElementById("currentyear").checked,
    }
    // console.log(payload);
    var url = 'http://localhost:8080/api/schoole-year/admin/create'
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


const AdminSchoolYear = ()=>{
    const [items, setItems] = useState([]);
    useEffect(()=>{
        const getSchoolYear = async() =>{
            const response = await loadAllSchoolYear();
            var list = await response.json();
            setItems(list)
        };
        getSchoolYear();

    }, []);

    async function loadSchoolYearById(id){
        var url = 'http://localhost:8080/api/schoole-year/public/findById?id='+id;
        const response = await fetch(url, {
            method: 'GET'
        });
        var result = await response.json();
        document.getElementById("name").value = result.name
        document.getElementById("idschoolyear").value = result.id
        if(result.currentYear){
            document.getElementById("currentyear").checked = true
        }
        else{
            document.getElementById("currentyear").checked = false
        }
    }

    function clearData(){
        document.getElementById("name").value = ""
        document.getElementById("idschoolyear").value = ""
        document.getElementById("currentyear").checked = false
    }

    async function deleteSchoolYear(id){
        var con = window.confirm("Xác nhận xóa học kỳ này?")
        if (con == false) {
            return;
        }
        var url = 'http://localhost:8080/api/schoole-year/admin/delete?id=' + id;
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

    return (
        <div>
            <div class="col-sm-12 header-sp">
                    <div class="row">
                        <div className='col-3'>
                            <button onClick={()=>clearData()} data-bs-toggle="modal" data-bs-target="#addschoolyear" className='btn btn-primary'>Thêm năm học mới</button>
                        </div>
                    </div>
                </div>
                <div class="col-sm-12">
                    <div class="wrapper">
                        <table class="table table-striped tablefix">
                            <thead class="thead-tablefix">
                                <tr>
                                    <th>id</th>
                                    <th>Tên học kỳ/ năm học</th>
                                    <th>Năm hiện tại</th>
                                    <th class="sticky-col">Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.map(item=>{
                                    return <tr>
                                        <td>{item.id}</td>
                                        <td>{item.name}</td>
                                        <td>{item.currentYear==true?<i className='namhientai fa fa-check-circle'> Năm hiện tại</i> :""}</td>
                                        <td class="sticky-col">
                                            <i onClick={()=>loadSchoolYearById(item.id)} data-bs-toggle="modal" data-bs-target="#addschoolyear" className='fa fa-edit iconaction'></i>
                                            <i onClick={()=>deleteSchoolYear(item.id)} className='fa fa-trash iconaction'></i>
                                        </td>
                                    </tr>
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>


            <div class="modal fade" id="addschoolyear" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="false">
                <div class="modal-dialog modal-md">
                    <div class="modal-content">
                        <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">Thêm/ cập nhật năm học</h5> <button id='btnclosemodal' type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button></div>
                        <div class="modal-body row modalform">
                            <input name='id' id='idschoolyear' type='hidden'/>
                            <label>Tên học kỳ, năm học</label>
                            <input name='namesc' id='name' className='form-control' />
                            <label class="checkbox-custom">Là năm học hiện tại
                                <input id="currentyear" type="checkbox" />
                                <span class="checkmark-checkbox"></span>
                            </label><br></br>
                            <button onClick={()=>saveSchoolyear()} className='btn btn-primary btnsubmit'>Thêm/ cập nhật</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminSchoolYear;