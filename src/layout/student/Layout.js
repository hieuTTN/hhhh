import styles from './layout.scss';
import stylecus from './stylecus.scss';
import {handleChangePass} from '../../services/auth'

function header({ children }){
    checkStudent();
    return(
        <div class="sb-nav-fixed">
            <nav id="top" class="sb-topnav navbar navbar-expand navbar-dark bg-dark">
                <a class="navbar-brand ps-3" href="#">Student</a>
                <button class="btn btn-link btn-sm order-1 order-lg-0 me-4 me-lg-0" id="sidebarToggle" href="#!"><i class="fas fa-bars"></i></button>
                <form class="d-none d-md-inline-block form-inline ms-auto me-0 me-md-3 my-2 my-md-0"></form>
                <ul id="menuleft" class="navbar-nav ms-auto ms-md-0 me-3 me-lg-4">
                </ul>
            </nav>
            
            <div id="layoutSidenav">
                <div id="layoutSidenav_nav">
                    <nav class="sb-sidenav accordion sb-sidenav-dark" id="sidenavAccordion">
                        <div class="sb-sidenav-menu">
                            <div class="nav">
                                <a class="nav-link" href="topic">
                                    <div class="sb-nav-link-icon"><i class="fa fa-file iconmenu"></i></div>
                                    Đề tài
                                </a>
                                <a class="nav-link" href="my-topic">
                                    <div class="sb-nav-link-icon"><i class="fa fa-list iconmenu"></i></div>
                                    Đề tài đăng ký
                                </a>
                                <a data-bs-toggle="modal" data-bs-target="#changepassword" class="nav-link" href="#">
                                    <div class="sb-nav-link-icon"><i class="fa fa-key iconmenu"></i></div>
                                    Mật khẩu
                                </a>
                                <a onClick={logout} class="nav-link" href="#">
                                    <div class="sb-nav-link-icon"><i class="fas fa-sign-out-alt iconmenu"></i></div>
                                    Đăng xuất
                                </a>
                            </div>
                        </div>
                    </nav>
                </div>
                <div id="layoutSidenav_content">
                    <main class="main">
                        {children}
                    </main>
                </div>
            </div>

            <div class="modal fade" id="changepassword" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="false">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">Đổi mật khẩu</h5> <button id='btnclosemodal' type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button></div>
                        <div class="modal-body row">
                            <form method='post' onSubmit={handleChangePass}>
                                <label class="lbacc">Mật khẩu hiện tại *</label>
                                <input required name='currentpass' type="password" class="form-control" />
                                <label class="lbacc">Mật khẩu mới *</label>
                                <input required name='newpass' type="password" class="form-control"/>
                                <label class="lbacc">Xác nhận mật khẩu mới *</label>
                                <input required name='renewpass' type="password" class="form-control"/>
                                <button type="submit" class="btntt">LƯU</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

async function checkStudent(){
    var token = localStorage.getItem("token");
    var url = 'http://localhost:8080/api/student/check-role-student';
    const response = await fetch(url, {
        headers: new Headers({
            'Authorization': 'Bearer ' + token
        })
    });
    if (response.status > 300) {
        window.location.replace('../login')
    }
}


function logout(){
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.replace('../login')
}

export default header;