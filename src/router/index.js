import layoutAdmin from '../layout/admin/Layout'
import layoutStudent from '../layout/student/Layout'
import layoutTeacher from '../layout/teacher/Layout'


//admin
import userAdmin from '../pages/admin/user/user'
import schoolYearAdmin from '../pages/admin/schoolYear/schoolYear'
import classAdmin from '../pages/admin/classes/classes'
import topicAdmin from '../pages/admin/topic/topic'
import addTopicAdmin from '../pages/admin/topic/addTopic'
import studentAdmin from '../pages/admin/student/student'
import addStudentAdmin from '../pages/admin/student/addStudent'
import teachertAdmin from '../pages/admin/teacher/teacher'
import addTeachertAdmin from '../pages/admin/teacher/addTeacher'

//public
import login from '../pages/public/login'

//student
import topicStudent from '../pages/student/topic/topic'
import myTopicStudent from '../pages/student/topic/mytopic'

//student
import myTopicTeacher from '../pages/teacher/topic/mytopic'
import councilTeacher from '../pages/teacher/topic/council'




const publicRoutes = [
    { path: "/", component: login},
    { path: "/login", component: login},
];

const adminRoutes = [
    { path: "/admin/user", component: userAdmin, layout: layoutAdmin },
    { path: "/admin/school-year", component: schoolYearAdmin, layout: layoutAdmin },
    { path: "/admin/class", component: classAdmin, layout: layoutAdmin },
    { path: "/admin/topic", component: topicAdmin, layout: layoutAdmin },
    { path: "/admin/add-topic", component: addTopicAdmin, layout: layoutAdmin },
    { path: "/admin/student", component: studentAdmin, layout: layoutAdmin },
    { path: "/admin/add-student", component: addStudentAdmin, layout: layoutAdmin },
    { path: "/admin/teacher", component: teachertAdmin, layout: layoutAdmin },
    { path: "/admin/add-teacher", component: addTeachertAdmin, layout: layoutAdmin },
];

const studentRoutes = [
    { path: "/student/topic", component: topicStudent, layout: layoutStudent },
    { path: "/student/my-topic", component: myTopicStudent, layout: layoutStudent },
];
const teacherRoutes = [
    { path: "/teacher/my-topic", component: myTopicTeacher, layout: layoutTeacher },
    { path: "/teacher/council", component: councilTeacher, layout: layoutTeacher },
];

export { publicRoutes, adminRoutes, studentRoutes, teacherRoutes };