import {Base64} from 'js-base64';

let User = {};
let loginUser = init();

function init() {
    if (window.localStorage.getItem('authorization_token') === null) {
        return {};
    }
    try {
        return JSON.parse(JSON.parse(
            Base64.decode(
                window.localStorage.getItem('authorization_token')
                    .split('.')[1]
            )
        ).loginUser);
    } catch (e) {
        window.localStorage.removeItem('authorization_token');
        return {};
    }
}

User.loginUser = loginUser;
User.loginName = loginUser.name;
User.userTypeName = function () {
    switch (loginUser.userType) {
        case "T":
            return '教师';
        case "A":
            return '教务处';
        case "O1":
            return "软件学院";
        case "O2":
            return "电子工程学院";
        case "O3":
            return "艺术设计学院";
        case "O4":
            return "商学院";
        case "O5":
            return "基础部";
        case "O6":
            return "素质教育中心";
        case "O7":
            return "体育教研室";
        default:
            return '未知角色'
    }
};
//T 教师  A 教务处  O 办公室主任
User.user_is_teacher = loginUser.userType === 'T';
User.user_is_aao = loginUser.userType === 'A';
User.user_is_office_manager = ['O1', 'O2', 'O3', 'O4', 'O5', 'O6', 'O7'].indexOf(loginUser.userType) !== -1;

User.install = function (Vue, options) {
    Vue.prototype.$user = User;
};

export default User;
