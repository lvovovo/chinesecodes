/**
 * 中国传统命理推算网站脚本
 * 实现阳历转农历和命理推算功能
 */

document.addEventListener('DOMContentLoaded', function() {
    // 初始化表单选项
    initDateSelectors();
    
    // 绑定表单提交事件
    document.getElementById('birthdate-form').addEventListener('submit', function(e) {
        e.preventDefault();
        // 动画效果
        animateFormSubmission();
        // 计算八字并跳转到结果页面
        setTimeout(function() {
            calculateBaZi();
        }, 800);
    });
    
    // 绑定查看全报告按钮事件
    document.getElementById('view-full-report-btn').addEventListener('click', function() {
        // 动画效果
        this.classList.add('button-pressed');
        setTimeout(() => {
            window.location.href = 'result.html';
        }, 300);
    });
    
    // 动画效果
    animatePageLoad();
});

/**
 * 动画效果
 */
function animatePageLoad() {
    const header = document.querySelector('header');
    const introSection = document.querySelector('.intro-section');
    const inputSection = document.querySelector('.input-section');
    const testimonials = document.querySelector('.testimonials');
    
    // 动画效果
    [header, introSection, inputSection, testimonials].forEach(el => {
        if (el) {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        }
    });
    
    // 动画效果
    setTimeout(() => {
        if (header) {
            header.style.opacity = '1';
            header.style.transform = 'translateY(0)';
        }
    }, 100);
    
    setTimeout(() => {
        if (introSection) {
            introSection.style.opacity = '1';
            introSection.style.transform = 'translateY(0)';
        }
    }, 300);
    
    setTimeout(() => {
        if (inputSection) {
            inputSection.style.opacity = '1';
            inputSection.style.transform = 'translateY(0)';
        }
    }, 500);
    
    setTimeout(() => {
        if (testimonials) {
            testimonials.style.opacity = '1';
            testimonials.style.transform = 'translateY(0)';
        }
    }, 700);
}

/**
 * 动画效果
 */
function animateFormSubmission() {
    const submitBtn = document.querySelector('.submit-btn');
    const formInputs = document.querySelectorAll('#birthdate-form input, #birthdate-form select');
    
    // 动画效果
    if (submitBtn) {
        submitBtn.classList.add('button-pressed');
        setTimeout(() => {
            submitBtn.classList.remove('button-pressed');
        }, 300);
    }
    
    // 动画效果
    formInputs.forEach(input => {
        input.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
        input.style.transform = 'scale(0.98)';
        input.style.opacity = '0.8';
        
        setTimeout(() => {
            input.style.transform = 'scale(1)';
            input.style.opacity = '1';
        }, 300);
    });
    
    // 动画效果
    const form = document.getElementById('birthdate-form');
    const loadingIndicator = document.createElement('div');
    loadingIndicator.className = 'loading-indicator';
    loadingIndicator.innerHTML = `
        <div class="loading-spinner"></div>
        <p>正在计算...</p>
    `;
    
    form.appendChild(loadingIndicator);
    
    // 动画效果
    setTimeout(() => {
        loadingIndicator.style.opacity = '1';
    }, 10);
    
    // 动画效果
    setTimeout(() => {
        loadingIndicator.style.opacity = '0';
        setTimeout(() => {
            form.removeChild(loadingIndicator);
        }, 300);
    }, 800);
}

/**
 * 初始化日期选择器
 */
function initDateSelectors() {
    // 初始化Flatpickr日期选择器
    const birthdatePicker = flatpickr("#birthdate", {
        locale: "zh",
        dateFormat: "Y-m-d",
        minDate: "1900-01-01",
        maxDate: new Date(),
        defaultDate: new Date(),
        animate: true,
        disableMobile: false,
        onChange: function(selectedDates, dateStr, instance) {
            // 当日期改变时，预览八字
            previewBaZi();
        }
    });
    
    // 时辰选项，使用中国传统的十二时辰
    const hourSelect = document.getElementById('hour');
    const timeOptions = [
        { value: 1, text: '子时 (23:00-01:00)' },
        { value: 2, text: '丑时 (01:00-03:00)' },
        { value: 3, text: '寅时 (03:00-05:00)' },
        { value: 4, text: '卯时 (05:00-07:00)' },
        { value: 5, text: '辰时 (07:00-09:00)' },
        { value: 6, text: '巳时 (09:00-11:00)' },
        { value: 7, text: '午时 (11:00-13:00)' },
        { value: 8, text: '未时 (13:00-15:00)' },
        { value: 9, text: '申时 (15:00-17:00)' },
        { value: 10, text: '酉时 (17:00-19:00)' },
        { value: 11, text: '戌时 (19:00-21:00)' },
        { value: 12, text: '亥时 (21:00-23:00)' }
    ];
    
    // 清空现有选项，防止重复添加
    hourSelect.innerHTML = '<option value="" disabled selected>选择时辰</option>';
    
    timeOptions.forEach(option => {
        const optionElement = document.createElement('option');
        optionElement.value = option.value;
        optionElement.textContent = option.text;
        hourSelect.appendChild(optionElement);
    });
    
    // 监听时辰变化，预览八字
    hourSelect.addEventListener('change', function() {
        previewBaZi();
        
        // 动画效果
        this.classList.add('select-changed');
        setTimeout(() => {
            this.classList.remove('select-changed');
        }, 300);
    });
    
    // 监听日历类型变化
    const calendarTypeSelect = document.getElementById('calendar-type');
    calendarTypeSelect.addEventListener('change', function() {
        // 如果选择了农历，提示用户
        if (this.value === 'lunar') {
            showToast('注意：选择农历时，系统会自动将您的农历生日转换为阳历进行计算。');
        }
        // 预览八字
        previewBaZi();
        
        // 动画效果
        this.classList.add('select-changed');
        setTimeout(() => {
            this.classList.remove('select-changed');
        }, 300);
    });
    
    // 监听性别变化
    const genderRadios = document.querySelectorAll('input[name="gender"]');
    genderRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            previewBaZi();
        });
    });
    
    // 监听分析选项变化
    const analysisCheckboxes = document.querySelectorAll('input[type="checkbox"]');
    analysisCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            previewBaZi();
            
            // 动画效果
            const label = this.nextElementSibling;
            if (label) {
                label.classList.add('checkbox-changed');
                setTimeout(() => {
                    label.classList.remove('checkbox-changed');
                }, 300);
            }
        });
    });
}

/**
 * 显示提示信息
 */
function showToast(message) {
    // 检查是否已经存在提示信息
    let toast = document.querySelector('.toast-message');
    
    if (!toast) {
        // 创建提示信息
        toast = document.createElement('div');
        toast.className = 'toast-message';
        document.body.appendChild(toast);
    }
    
    // 设置提示信息内容
    toast.textContent = message;
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(20px)';
    
    // 动画效果
    setTimeout(() => {
        toast.style.opacity = '1';
        toast.style.transform = 'translateY(0)';
    }, 10);
    
    // 动画效果
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(-20px)';
        
        // 移除提示信息
        setTimeout(() => {
            if (toast.parentNode) {
                document.body.removeChild(toast);
            }
        }, 300);
    }, 3000);
}

/**
 * 预览八字
 */
function previewBaZi() {
    // 获取表单数据
    const birthdateStr = document.getElementById('birthdate').value;
    const hour = parseInt(document.getElementById('hour').value);
    
    // 检查是否所有必要数据都已填写
    if (!birthdateStr || !hour) {
        return; // 如果数据不完整，则不进行计算
    }
    
    // 获取性别和日历类型
    const genderRadio = document.querySelector('input[name="gender"]:checked');
    if (!genderRadio) {
        return; // 如果性别未选择，则不进行计算
    }
    const gender = genderRadio.value;
    const calendarType = document.getElementById('calendar-type').value;
    
    // 解析日期字符串
    const dateParts = birthdateStr.split('-');
    const year = parseInt(dateParts[0]);
    const month = parseInt(dateParts[1]);
    const day = parseInt(dateParts[2]);
    
    // 获取分析选项
    const analysisOptions = {
        basicAnalysis: document.getElementById('basic-analysis').checked,
        careerAnalysis: document.getElementById('career-analysis').checked,
        wealthAnalysis: document.getElementById('wealth-analysis').checked,
        loveAnalysis: document.getElementById('love-analysis').checked,
        healthAnalysis: document.getElementById('health-analysis').checked,
        yearlyFortune: document.getElementById('yearly-fortune').checked
    };
    
    // 根据日历类型计算农历日期
    let lunarDate;
    if (calendarType === 'solar') {
        // 阳历转农历
        const calendar = new LunarCalendar();
        lunarDate = calendar.solar2lunar(year, month, day);
    } else {
        // 如果是农历，直接使用输入的农历日期
        lunarDate = {
            year: year,
            month: month,
            day: day,
            leap: false, // 假设非闰月，实际应用中需要更精确判断
            yearChinese: year + '年',
            monthChinese: month + '月',
            dayChinese: day + '日'
        };
    }
    
    // 计算八字
    const baZi = calculateBaZiFromLunar(lunarDate.year, lunarDate.month, lunarDate.day, hour);
    
    // 计算五行
    const wuxing = calculateWuXing(baZi);
    
    // 显示预览结果
    document.getElementById('result-preview').style.display = 'block';
    
    // 显示预览结果
    document.getElementById('preview-solar-date').textContent = `${year}年${month}月${day}日 ${getHourText(hour)}`;
    document.getElementById('preview-lunar-date').textContent = `${lunarDate.yearChinese} ${lunarDate.monthChinese} ${lunarDate.dayChinese}`;
    document.getElementById('preview-bazi').textContent = `${baZi.year.stem}${baZi.year.branch} ${baZi.month.stem}${baZi.month.branch} ${baZi.day.stem}${baZi.day.branch} ${baZi.hour.stem}${baZi.hour.branch}`;
    document.getElementById('preview-wuxing').textContent = wuxing.join('、');
    
    // 显示八字表
    document.getElementById('year-stem').textContent = baZi.year.stem;
    document.getElementById('year-branch').textContent = baZi.year.branch;
    document.getElementById('month-stem').textContent = baZi.month.stem;
    document.getElementById('month-branch').textContent = baZi.month.branch;
    document.getElementById('day-stem').textContent = baZi.day.stem;
    document.getElementById('day-branch').textContent = baZi.day.branch;
    document.getElementById('hour-stem').textContent = baZi.hour.stem;
    document.getElementById('hour-branch').textContent = baZi.hour.branch;
    
    // 显示五行元素
    document.getElementById('year-element').textContent = getStemElement(baZi.year.stem);
    document.getElementById('month-element').textContent = getStemElement(baZi.month.stem);
    document.getElementById('day-element').textContent = getStemElement(baZi.day.stem);
    document.getElementById('hour-element').textContent = getStemElement(baZi.hour.stem);
    
    // 生成简单的运势摘要
    const summary = generateSimpleFortuneSummary(baZi, gender);
    document.getElementById('preview-summary').innerHTML = summary;
    
    // 将数据存储到 localStorage 中，供结果页面使用
    localStorage.setItem('birthData', JSON.stringify({
        solar: { year, month, day, hour },
        lunar: lunarDate,
        baZi: baZi,
        gender: gender,
        calendarType: calendarType,
        analysisOptions: analysisOptions
    }));
}

/**
 * 获取时辰文本
 */
function getHourText(hour) {
    const hourTexts = [
        '子时 (23:00-01:00)',
        '丑时 (01:00-03:00)',
        '寅时 (03:00-05:00)',
        '卯时 (05:00-07:00)',
        '辰时 (07:00-09:00)',
        '巳时 (09:00-11:00)',
        '午时 (11:00-13:00)',
        '未时 (13:00-15:00)',
        '申时 (15:00-17:00)',
        '酉时 (17:00-19:00)',
        '戌时 (19:00-21:00)',
        '亥时 (21:00-23:00)'
    ];
    
    return hourTexts[hour - 1] || '';
}

/**
 * 根据农历计算八字
 */
function calculateBaZiFromLunar(lunarYear, lunarMonth, lunarDay, hour) {
    // 天干地支对照表
    const heavenlyStems = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
    const earthlyBranches = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
    
    // 计算年柱
    const yearStemIndex = (lunarYear - 4) % 10;
    const yearBranchIndex = (lunarYear - 4) % 12;
    
    // 计算月柱
    // 月干 = (年干 * 2 + 月数) % 10
    const monthStemIndex = (yearStemIndex * 2 + lunarMonth) % 10;
    // 月支 = 月数 + 2 (如果大于12则减12)
    let monthBranchIndex = lunarMonth + 2;
    if (monthBranchIndex > 12) monthBranchIndex -= 12;
    monthBranchIndex = monthBranchIndex - 1; // 调整为0-11的索引
    
    // 计算日柱
    // 使用基姆拉尔森计算公式计算日期的天干地支
    // 这里使用简化算法，实际应用中需要更精确的算法
    const dayStemIndex = (lunarYear * 5 + Math.floor(lunarYear / 4) + lunarDay - 1) % 10;
    const dayBranchIndex = (lunarYear * 5 + Math.floor(lunarYear / 4) + lunarDay + 1) % 12;
    
    // 计算时柱
    // 时干 = (日干 * 2 + 时辰) % 10
    const hourStemIndex = (dayStemIndex * 2 + hour) % 10;
    // 时支就是时辰对应的地支
    const hourBranchIndex = hour - 1; // 时辰值1-12对应地支索引0-11
    
    return {
        year: {
            stem: heavenlyStems[yearStemIndex],
            branch: earthlyBranches[yearBranchIndex]
        },
        month: {
            stem: heavenlyStems[monthStemIndex],
            branch: earthlyBranches[monthBranchIndex]
        },
        day: {
            stem: heavenlyStems[dayStemIndex],
            branch: earthlyBranches[dayBranchIndex]
        },
        hour: {
            stem: heavenlyStems[hourStemIndex],
            branch: earthlyBranches[hourBranchIndex]
        }
    };
}

/**
 * 阳历转农历的算法
 */
class LunarCalendar {
    constructor() {
        // 农历数据
        this.lunarInfo = [
            0x04bd8, 0x04ae0, 0x0a570, 0x054d5, 0x0d260, 0x0d950, 0x16554, 0x056a0, 0x09ad0, 0x055d2,
            0x04ae0, 0x0a5b6, 0x0a4d0, 0x0d250, 0x1d255, 0x0b540, 0x0d6a0, 0x0ada2, 0x095b0, 0x14977,
            0x04970, 0x0a4b0, 0x0b4b5, 0x06a50, 0x06d40, 0x1ab54, 0x02b60, 0x09570, 0x052f2, 0x04970,
            0x06566, 0x0d4a0, 0x0ea50, 0x06e95, 0x05ad0, 0x02b60, 0x186e3, 0x092e0, 0x1c8d7, 0x0c950,
            0x0d4a0, 0x1d8a6, 0x0b550, 0x056a0, 0x1a5b4, 0x025d0, 0x092d0, 0x0d2b2, 0x0a950, 0x0b557,
            0x06ca0, 0x0b550, 0x15355, 0x04da0, 0x0a5d0, 0x14573, 0x052d0, 0x0a9a8, 0x0e950, 0x06aa0,
            0x0aea6, 0x0ab50, 0x04b60, 0x0aae4, 0x0a570, 0x05260, 0x0f263, 0x0d950, 0x05b57, 0x056a0,
            0x096d0, 0x04dd5, 0x04ad0, 0x0a4d0, 0x0d4d4, 0x0d250, 0x0d558, 0x0b540, 0x0b5a0, 0x195a6,
            0x095b0, 0x049b0, 0x0a974, 0x0a4b0, 0x0b27a, 0x06a50, 0x06d40, 0x0af46, 0x0ab60, 0x09570,
            0x04af5, 0x04970, 0x064b0, 0x074a3, 0x0ea50, 0x06b58, 0x055c0, 0x0ab60, 0x096d5, 0x092e0,
            0x0c960, 0x0d954, 0x0d4a0, 0x0da50, 0x07552, 0x056a0, 0x0abb7, 0x025d0, 0x092d0, 0x0cab5,
            0x0a950, 0x0b4a0, 0x0baa4, 0x0ad50, 0x055d9, 0x04ba0, 0x0a5b0, 0x15176, 0x052b0, 0x0a930,
            0x07954, 0x06aa0, 0x0ad50, 0x05b52, 0x04b60, 0x0a6e6, 0x0a4e0, 0x0d260, 0x0ea65, 0x0d530,
            0x05aa0, 0x076a3, 0x096d0, 0x04bd7, 0x04ad0, 0x0a4d0, 0x1d0b6, 0x0d250, 0x0d520, 0x0dd45,
            0x0b5a0, 0x056d0, 0x055b2, 0x049b0, 0x0a577, 0x0a4b0, 0x0aa50, 0x1b255, 0x06d20, 0x0ada0
        ];
        
        // 天干
        this.heavenlyStems = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
        // 地支
        this.earthlyBranches = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
        // 生肖
        this.animals = ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪'];
        // 农历月份
        this.lunarMonths = ['正月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '冬月', '腊月'];
        // 农历日期
        this.lunarDays = [
            '初一', '初二', '初三', '初四', '初五', '初六', '初七', '初八', '初九', '初十',
            '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十',
            '廿一', '廿二', '廿三', '廿四', '廿五', '廿六', '廿七', '廿八', '廿九', '三十'
        ];
    }
    
    /**
     * 阳历转农历
     */
    solar2lunar(year, month, day) {
        // 验证输入
        if (year < 1900 || year > 2100) {
            return { error: '年份超出范围(1900-2100)' };
        }
        if (month < 1 || month > 12) {
            return { error: '月份无效' };
        }
        
        // 获取该年农历数据
        const yearData = this.lunarInfo[year - 1900];
        
        // 计算农历年
        const lunarYear = year;
        
        // 计算农历月日
        let lunarMonth = 0;
        let lunarDay = 0;
        
        // 计算春节日期
        const springFestivalDate = this.getSpringFestival(year);
        const inputDate = new Date(year, month - 1, day);
        
        // 计算与春节的天数差
        const dayDiff = Math.floor((inputDate - springFestivalDate) / (24 * 60 * 60 * 1000));
        
        // 如果在春节前，则属于上一年的农历
        if (dayDiff < 0) {
            return this.solar2lunar(year - 1, month, day);
        }
        
        // 计算农历月份和日期
        let temp = 0;
        for (let i = 1; i <= 12; i++) {
            // 获取每个月的天数
            const monthDays = this.getMonthDays(lunarYear, i);
            temp += monthDays;
            if (dayDiff < temp) {
                lunarMonth = i;
                lunarDay = monthDays - (temp - dayDiff) + 1;
                break;
            }
        }
        
        // 计算农历年的天干地支
        const yearGanZhi = this.getYearGanZhi(lunarYear);
        
        // 返回结果
        return {
            year: lunarYear,
            month: lunarMonth,
            day: lunarDay,
            yearChinese: yearGanZhi + '年 ' + this.animals[(lunarYear - 4) % 12] + '年',
            monthChinese: this.lunarMonths[lunarMonth - 1],
            dayChinese: this.lunarDays[lunarDay - 1]
        };
    }
    
    /**
     * 获取农历年的天干地支
     */
    getYearGanZhi(year) {
        const stemIndex = (year - 4) % 10;
        const branchIndex = (year - 4) % 12;
        return this.heavenlyStems[stemIndex] + this.earthlyBranches[branchIndex];
    }
    
    /**
     * 获取某年春节的日期
     */
    getSpringFestival(year) {
        // 这里使用简化算法，实际应用中需要更精确的算法
        // 春节通常在1月21日至2月20日之间
        const springFestivalDates = {
            1900: new Date(1900, 0, 31), // 1900年1月31日
            // ... 此处应有1900-2100年的春节日期数据
            2025: new Date(2025, 0, 29)  // 2025年1月29日
        };
        
        // 如果有确切数据，直接返回
        if (springFestivalDates[year]) {
            return springFestivalDates[year];
        }
        
        // 否则使用估算值
        // 这里使用一个简单的估算公式，实际应用中需要更精确的算法
        const estimatedDay = Math.floor(21.6 + ((year - 1900) * 0.2));
        const estimatedMonth = estimatedDay > 31 ? 1 : 0; // 0表示1月，1表示2月
        const day = estimatedDay > 31 ? estimatedDay - 31 : estimatedDay;
        
        return new Date(year, estimatedMonth, day);
    }
    
    /**
     * 获取农历某年某月的天数
     */
    getMonthDays(year, month) {
        // 这里使用简化算法，实际应用中需要更精确的算法
        // 农历月份天数通常为29或30天
        // 简单起见，这里假设单数月30天，双数月29天
        return month % 2 === 1 ? 30 : 29;
    }
}

/**
 * 获取天干对应的五行元素
 */
function getStemElement(stem) {
    const elements = {
        '甲': '木', '乙': '木',
        '丙': '火', '丁': '火',
        '戊': '土', '己': '土',
        '庚': '金', '辛': '金',
        '壬': '水', '癸': '水'
    };
    return elements[stem] || '';
}

/**
 * 计算八字的五行元素
 */
function calculateWuXing(baZi) {
    const wuxing = [];
    const stems = [baZi.year.stem, baZi.month.stem, baZi.day.stem, baZi.hour.stem];
    
    // 统计每个五行元素的数量
    const counts = {
        '木': 0, '火': 0, '土': 0, '金': 0, '水': 0
    };
    
    // 计算天干的五行元素
    stems.forEach(stem => {
        const element = getStemElement(stem);
        if (element) {
            counts[element]++;
        }
    });
    
    // 构造五行元素数组
    for (const element in counts) {
        if (counts[element] > 0) {
            wuxing.push(`${element}(${counts[element]})`);
        }
    }
    
    return wuxing;
}

/**
 * 生成简单的运势摘要
 */
function generateSimpleFortuneSummary(baZi, gender) {
    // 根据八字和性别生成运势摘要
    const summaries = [
        `您的八字是${baZi.year.stem}${baZi.year.branch}年 ${baZi.month.stem}${baZi.month.branch}月 ${baZi.day.stem}${baZi.day.branch}日 ${baZi.hour.stem}${baZi.hour.branch}时，您的性别是${gender}，您的运势如下：`,
        `您天生丽质，具有很强的领导能力和创造力，您的职业生涯将会非常成功。`,
        `您具有很强的沟通能力和团队合作精神，您的职业生涯将会非常顺利。`,
        `您具有很强的分析能力和解决问题的能力，您的职业生涯将会非常成功。`,
        `您具有很强的创造力和艺术才能，您的职业生涯将会非常成功。`,
        `您具有很强的领导能力和管理才能，您的职业生涯将会非常成功。`
    ];
    
    return summaries.join('<br><br>');
}

/**
 * 计算八字并跳转到结果页面
 */
function calculateBaZi() {
    // 获取表单数据
    const birthdateStr = document.getElementById('birthdate').value;
    const hour = parseInt(document.getElementById('hour').value);
    const gender = document.querySelector('input[name="gender"]:checked').value;
    
    // 解析日期字符串
    const dateParts = birthdateStr.split('-');
    const year = parseInt(dateParts[0]);
    const month = parseInt(dateParts[1]);
    const day = parseInt(dateParts[2]);
    
    // 根据日历类型计算农历日期
    let lunarDate;
    const calendarType = document.getElementById('calendar-type').value;
    if (calendarType === 'solar') {
        // 阳历转农历
        const calendar = new LunarCalendar();
        lunarDate = calendar.solar2lunar(year, month, day);
    } else {
        // 如果是农历，直接使用输入的农历日期
        lunarDate = {
            year: year,
            month: month,
            day: day,
            leap: false, // 假设非闰月，实际应用中需要更精确判断
            yearChinese: year + '年',
            monthChinese: month + '月',
            dayChinese: day + '日'
        };
    }
    
    // 计算八字
    const baZi = calculateBaZiFromLunar(lunarDate.year, lunarDate.month, lunarDate.day, hour);
    
    // 计算五行
    const wuxing = calculateWuXing(baZi);
    
    // 生成简单的运势摘要
    const summary = generateSimpleFortuneSummary(baZi, gender);
    
    // 将数据存储到 localStorage 中，供结果页面使用
    localStorage.setItem('birthData', JSON.stringify({
        solar: { year, month, day, hour },
        lunar: lunarDate,
        baZi: baZi,
        gender: gender,
        calendarType: calendarType
    }));
    
    // 跳转到结果页面
    window.location.href = 'result.html';
}
