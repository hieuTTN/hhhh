import {toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


async function handleLogin(event) {
    event.preventDefault();
    const payload = {
        username: event.target.elements.username.value,
        password: event.target.elements.password.value
    };
    const res = await fetch('http://localhost:8080/api/login', {
        method: 'POST',
        headers: new Headers({
            'Content-Type': 'application/json'
        }),
        body: JSON.stringify(payload)
    });
    var result = await res.json()
    console.log(result);
    if (res?.status == 417) {
        toast.error(result.errorMessage);
    }
    if(res.status < 300){
        toast.success('Đăng nhập thành công!');
        await new Promise(resolve => setTimeout(resolve, 1500));
        localStorage.setItem("token", result.token);
        localStorage.setItem("user", JSON.stringify(result.user));
        if (result.user.authorities.name === "ROLE_ADMIN") {
            window.location.href = 'admin/user';
        }
        if (result.user.authorities.name === "ROLE_TEACHER") {
            window.location.href = 'employee/student';
        }
        if (result.user.authorities.name === "ROLE_STUDENT") {
            window.location.href = 'student/topic';
        }
        if (result.user.authorities.name === "ROLE_TEACHER") {
            window.location.href = 'teacher/my-topic';
        }
    }
};

async function handleChangePass(event) {
    var token = localStorage.getItem('token');
    event.preventDefault();
    if(event.target.elements.newpass.value != event.target.elements.renewpass.value){
        toast.error("Mật khẩu mới không trùng khớp");
        return;
    }
    const payload = {
        oldPass: event.target.elements.currentpass.value,
        newPass: event.target.elements.newpass.value
    };
    const res = await fetch('http://localhost:8080/api/all/change-password', {
        method: 'POST',
        headers: new Headers({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }),
        body: JSON.stringify(payload)
    });
    if (res?.status == 417) {
        var result = await res.json()
        toast.error(result.errorMessage);
    }
    if(res?.status < 300){
        toast.success("Đổi mật khẩu thành công!");
        await new Promise(resolve => setTimeout(resolve, 1500));
        window.location.reload();
    }
};


export {handleLogin,handleChangePass}