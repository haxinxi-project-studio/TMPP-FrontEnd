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
        case "O":
            return '办公室主任';
        default:
            return '未知角色'
    }
};
//T 教师  A 教务处  O 办公室主任
User.user_is_teacher = loginUser.userType === 'T';
User.user_is_aao = loginUser.userType === 'A';
User.user_is_office_manager = loginUser.userType === 'O';

User.install = function (Vue, options) {
    Vue.prototype.$user = User;
};

export default User;
