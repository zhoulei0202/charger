let dateUtil = {
    transFormat(origin, fromFlag, toFlag) {
        let tempDate = new Date();
        switch (fromFlag) {
            case "":
                tempDate.setFullYear(parseInt(origin.substr(0, 4)));
                tempDate.setMonth(parseInt(origin.substr(4, 2)) - 1);
                tempDate.setDate(parseInt(origin.substr(6, 2)));
                break;
            case "-":
                return origin.split("-").join("/");
            default:
        }
        return dateUtil.dateFormat(tempDate, toFlag);
    },
    dateFormat(date, flag) {
        let dateArr = [];
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        dateArr.push(year);
        dateArr.push(month < 10 ? ("0" + month) : month);
        dateArr.push(day < 10 ? ("0" + day) : day);
        return dateArr.join(flag);
    },
    weekStrMap(index) {
        const weekMap = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
        return weekMap[index];
    },
    dateToNowZh(date) {
        const nowDate = new Date();
        const year = nowDate.getFullYear() - date.getFullYear();
        const month = nowDate.getMonth() - date.getMonth();
        if (year < 0 || (year === 0 && month < 0)) {
            return "--";
        }
        return (year * 12 + month) + "个月";
        // const day = nowDate.getDate() - date.getDate();
        // let result = "";
        // if (year >= 0) {
        //     if (month >= 0) {

        //     } else if (year > 0) {
        //         if ((year - 1) > 0) {
        //             result += (year - 1) + "年";
        //         }
        //         result += (12 + month) + "月";
        //     } else {
        //         return "";
        //     }
        // } else {
        //     return "";
        // }
    },
    addDate(date, days, _separate) {
        const d = new Date(date); 
        let separate = _separate;
        d.setDate(d.getDate() + days); 
        let month = d.getMonth() + 1; 
        let day = d.getDate(); 
        if (month < 10) { 
            month = "0" + month; 
        } 
        if (day < 10) { 
            day = "0" + day; 
        } 
        if (!separate) {
            separate = "-";
        }
        const val = d.getFullYear() + separate + month + separate + day; 
        return val; 
    },
    dateCompare(a, b) {
        let aDate = new Date(a);
        let bDate = new Date(b);
        if (aDate.toDateString() === bDate.toDateString()) {
            return 0;
        } else {
            return aDate.getTime() - bDate.getTime();
        }
    },
    //时间转字符串
    timeToSting(date) {
        let val = new Date(date);
        return val.getFullYear() + '-' + (val.getMonth() + 1) + '-' + val.getDate() + ' ' + val.getHours() + ':' + val.getMinutes() + ':' + val.getSeconds();
    },
    //日期转字符串
    dateToSting(date) {
        let val = new Date(date);
        //如果小于10则加个0
        let monthStr = (val.getMonth() + 1) + '';
        let monthDay = monthStr.padStart(2, '0');
        // return val.getFullYear() + '-' + (val.getMonth() + 1) + '-' + val.getDate();
        let dayStr = val.getDate() + '';
        let dayTime = dayStr.padStart(2, '0');
        return val.getFullYear() + '-' + monthDay + '-' + dayTime;
    },
    //n天前的日期
    getDateFromToday(n) {
        let val = new Date();
        let newDate = val.getTime() - 1000 * 60 * 60 * 24 * parseInt(n);
        return (this.dateToSting(newDate));
    }
};

export default dateUtil;
