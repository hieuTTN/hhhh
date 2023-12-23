import { ToastContainer, toast } from 'react-toastify';
import {Routes, Route,BrowserRouter as Router} from 'react-router-dom'
import { publicRoutes,adminRoutes, studentRoutes, teacherRoutes } from './router/index';
import AdminLayout from './layout/admin/Layout'
import StudentLayout from './layout/student/Layout'
import TeacherLayout from './layout/teacher/Layout'
import DefaultLayout from './layout/public/defaultLayout/defaultLayout'

function App() {
  // let checkAdmin = window.location.pathname.startsWith("/admin")
  // let checkEmployee = window.location.pathname.startsWith("/employee")
  return (
    <Router>
      <div className="App">
          <Routes>

            {publicRoutes.map((route, index) => {
              const Layout = route.layout || DefaultLayout
              const Page = route.component
              return <Route key={index} path={route.path} element={
                <Layout>
                  <Page/>
                </Layout>
              }/>
            })}

            {adminRoutes.map((route, index) => {
              const Layout = route.layout || AdminLayout
              const Page = route.component
              return <Route key={index} path={route.path} element={
                <Layout>
                  <Page/>
                </Layout>
              }/>
            })}
            
            {studentRoutes.map((route, index) => {
              const Layout = route.layout || StudentLayout
              const Page = route.component
              return <Route key={index} path={route.path} element={
                <Layout>
                  <Page/>
                </Layout>
              }/>
            })}

            {teacherRoutes.map((route, index) => {
              const Layout = route.layout || TeacherLayout
              const Page = route.component
              return <Route key={index} path={route.path} element={
                <Layout>
                  <Page/>
                </Layout>
              }/>
            })}

          </Routes>
      </div>
      <ToastContainer/>
    </Router>

);

}

export default App;
