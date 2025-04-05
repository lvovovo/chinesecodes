/**
 * 中国传统命理推算网站结果页面脚本
 * 实现结果展示和交互功能
 */

document.addEventListener('DOMContentLoaded', function() {
    // 从localStorage获取数据
    const birthData = JSON.parse(localStorage.getItem('birthData'));
    
    // 如果没有数据，返回首页
    if (!birthData) {
        window.location.href = 'index.html';
        return;
    }
    
    // 显示基本信息
    displayBasicInfo(birthData);
    
    // 根据用户选择的分析选项显示相应内容
    displaySelectedAnalysis(birthData);
    
    // 生成命运分析
    generateFortuneAnalysis(birthData);
    
    // 生成未来运势预测
    generateFuturePrediction(birthData);
    
    // 绑定选项卡切换事件
    bindTabEvents();
    
    // 绑定分享按钮事件
    document.getElementById('share-btn').addEventListener('click', shareResults);
});

/**
 * 显示基本信息
 */
function displayBasicInfo(data) {
    // 显示阳历日期
    const solarDate = `${data.solar.year}年${data.solar.month}月${data.solar.day}日 ${getHourText(data.solar.hour)}`;
    document.getElementById('solar-date').textContent = solarDate;
    
    // 显示农历日期
    const lunarDate = `${data.lunar.yearChinese} ${data.lunar.monthChinese} ${data.lunar.dayChinese}`;
    document.getElementById('lunar-date').textContent = lunarDate;
    
    // 显示八字
    const baZi = `${data.baZi.year.stem}${data.baZi.year.branch} ${data.baZi.month.stem}${data.baZi.month.branch} ${data.baZi.day.stem}${data.baZi.day.branch} ${data.baZi.hour.stem}${data.baZi.hour.branch}`;
    document.getElementById('bazi').textContent = baZi;
    
    // 显示性别
    document.getElementById('gender').textContent = data.gender === 'male' ? '男' : '女';
    
    // 显示日历类型
    document.getElementById('calendar-type').textContent = data.calendarType === 'solar' ? '阳历' : '农历';
}

/**
 * 根据用户选择的分析选项显示相应内容
 */
function displaySelectedAnalysis(data) {
    // 如果没有分析选项数据，则显示所有分析
    if (!data.analysisOptions) {
        return;
    }
    
    // 获取分析选项
    const options = data.analysisOptions;
    
    // 显示或隐藏基础分析
    const basicAnalysisSection = document.getElementById('basic-analysis-section');
    if (basicAnalysisSection) {
        basicAnalysisSection.style.display = options.basicAnalysis ? 'block' : 'none';
    }
    
    // 显示或隐藏事业分析
    const careerSection = document.getElementById('career-section');
    if (careerSection) {
        careerSection.style.display = options.careerAnalysis ? 'block' : 'none';
    }
    
    // 显示或隐藏财运分析
    const wealthSection = document.getElementById('wealth-section');
    if (wealthSection) {
        wealthSection.style.display = options.wealthAnalysis ? 'block' : 'none';
    }
    
    // 显示或隐藏爱情分析
    const loveSection = document.getElementById('love-section');
    if (loveSection) {
        loveSection.style.display = options.loveAnalysis ? 'block' : 'none';
    }
    
    // 显示或隐藏健康分析
    const healthSection = document.getElementById('health-section');
    if (healthSection) {
        healthSection.style.display = options.healthAnalysis ? 'block' : 'none';
    }
    
    // 显示或隐藏年度运势
    const yearlyFortuneSection = document.getElementById('yearly-fortune-section');
    if (yearlyFortuneSection) {
        yearlyFortuneSection.style.display = options.yearlyFortune ? 'block' : 'none';
    }
    
    // 更新选项卡状态
    updateTabsVisibility();
}

/**
 * 更新选项卡可见性
 */
function updateTabsVisibility() {
    // 获取所有选项卡
    const tabs = document.querySelectorAll('.tab-item');
    const tabContents = document.querySelectorAll('.tab-content');
    
    // 检查哪些选项卡内容是可见的
    let firstVisibleTab = null;
    for (let i = 0; i < tabs.length; i++) {
        const targetId = tabs[i].getAttribute('data-target');
        const targetContent = document.getElementById(targetId);
        
        if (targetContent && targetContent.style.display !== 'none') {
            // 如果内容可见，则显示对应的选项卡
            tabs[i].style.display = 'block';
            
            // 记录第一个可见的选项卡
            if (!firstVisibleTab) {
                firstVisibleTab = tabs[i];
            }
        } else {
            // 如果内容不可见，则隐藏对应的选项卡
            tabs[i].style.display = 'none';
        }
    }
    
    // 如果有可见的选项卡，则激活第一个
    if (firstVisibleTab) {
        // 移除所有选项卡的激活状态
        tabs.forEach(tab => tab.classList.remove('active'));
        
        // 隐藏所有内容
        tabContents.forEach(content => content.classList.remove('active'));
        
        // 激活第一个可见的选项卡
        firstVisibleTab.classList.add('active');
        
        // 显示对应的内容
        const targetId = firstVisibleTab.getAttribute('data-target');
        const targetContent = document.getElementById(targetId);
        if (targetContent) {
            targetContent.classList.add('active');
        }
    }
}

/**
 * 获取时辰文本
 */
function getHourText(hour) {
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
    
    const option = timeOptions.find(opt => opt.value === hour);
    return option ? option.text : '';
}

/**
 * 生成命运分析
 */
function generateFortuneAnalysis(data) {
    // 根据八字生成命运总述
    const fortuneSummary = generateFortuneSummary(data.baZi, data.gender);
    document.getElementById('fortune-summary').innerHTML = fortuneSummary;
    
    // 检查用户选择的分析选项
    const options = data.analysisOptions || {
        basicAnalysis: true,
        careerAnalysis: true,
        loveAnalysis: true,
        wealthAnalysis: true,
        healthAnalysis: true,
        yearlyFortune: true
    };
    
    // 生成各领域分析
    if (options.careerAnalysis) {
        generateCareerAnalysis(data);
    }
    
    if (options.loveAnalysis) {
        generateLoveAnalysis(data);
    }
    
    if (options.wealthAnalysis) {
        generateWealthAnalysis(data);
    }
    
    if (options.healthAnalysis) {
        generateHealthAnalysis(data);
    }
    
    // 生成子女分析
    generateChildrenAnalysis(data);
}

/**
 * 生成命运总述
 */
function generateFortuneSummary(baZi, gender) {
    // 根据八字和性别生成命运总述
    // 这里使用一些通用的描述，实际应用中应该根据八字进行更精确的分析
    const summaries = [
        `您的八字为${baZi.year.stem}${baZi.year.branch}年、${baZi.month.stem}${baZi.month.branch}月、${baZi.day.stem}${baZi.day.branch}日、${baZi.hour.stem}${baZi.hour.branch}时，整体命局较为平衡。`,
        `您天生具有较强的分析能力和洞察力，善于发现问题的本质。`,
        `您性格温和但内心坚定，遇到困难不轻易放弃，有较强的韧性。`,
        `您的人生将经历一些波折，但每次挑战都会让您更加成熟和智慧。`,
        `您适合在${gender === 'male' ? '管理、技术或创意' : '教育、医疗或服务'}领域发展，能够充分发挥您的天赋。`
    ];
    
    return summaries.join('<br><br>');
}

/**
 * 生成事业分析
 */
function generateCareerAnalysis(data) {
    const baZi = data.baZi;
    const gender = data.gender;
    
    // 根据八字和性别生成事业分析
    const analysis = [
        `<p>您的八字中${baZi.day.stem}${baZi.day.branch}日干代表事业，与${baZi.month.stem}${baZi.month.branch}月支形成良好互动，显示您在职场上有较好的发展潜力。</p>`,
        `<p>您的事业发展将经历三个阶段：初期可能面临挑战，中期逐渐稳定，后期有望取得较大成就。</p>`,
        `<p>您适合的职业方向：</p>`,
        `<ul>`,
        `<li>${gender === 'male' ? '管理咨询、项目管理' : '教育培训、人力资源'}</li>`,
        `<li>${baZi.year.stem === '甲' || baZi.year.stem === '乙' ? '创意设计、艺术领域' : '技术研发、数据分析'}</li>`,
        `<li>${baZi.day.stem === '壬' || baZi.day.stem === '癸' ? '水相关行业，如航运、饮料' : '服务业、咨询顾问'}</li>`,
        `</ul>`,
        `<p>职业发展建议：充分发挥您的${baZi.day.stem === '甲' || baZi.day.stem === '乙' ? '创造力和想象力' : '分析能力和执行力'}，定期反思和调整职业规划，保持终身学习的态度。</p>`
    ];
    
    document.getElementById('career-content').innerHTML = analysis.join('');
}

/**
 * 生成婚姻分析
 */
function generateLoveAnalysis(data) {
    const baZi = data.baZi;
    const gender = data.gender;
    
    // 根据八字和性别生成婚姻分析
    const analysis = [
        `<p>您的八字中${gender === 'male' ? '日支与时干' : '日干与时支'}代表婚姻关系，整体呈现${baZi.day.stem === '丙' || baZi.day.stem === '丁' ? '热情活泼' : '稳重踏实'}的特质。</p>`,
        `<p>您在感情中注重${baZi.hour.stem === '庚' || baZi.hour.stem === '辛' ? '真诚与沟通' : '理解与包容'}，能够建立长久稳定的关系。</p>`,
        `<p>您适合的伴侣类型：</p>`,
        `<ul>`,
        `<li>性格${gender === 'male' ? '温柔体贴、善解人意' : '成熟稳重、有责任感'}的人</li>`,
        `<li>在${baZi.year.branch === '子' || baZi.year.branch === '午' ? '事业上有一定成就' : '生活中乐观向上'}的人</li>`,
        `<li>与您在价值观和人生目标上有共鸣的人</li>`,
        `</ul>`,
        `<p>感情发展建议：保持良好的沟通习惯，学会换位思考，共同经营感情生活。</p>`
    ];
    
    document.getElementById('love-content').innerHTML = analysis.join('');
}

/**
 * 生成财运分析
 */
function generateWealthAnalysis(data) {
    const baZi = data.baZi;
    
    // 根据八字生成财运分析
    const analysis = [
        `<p>您的八字中${baZi.month.stem}${baZi.month.branch}月柱代表财运，整体财运${baZi.month.stem === '壬' || baZi.month.stem === '癸' ? '波动较大，但有较高收益可能' : '稳定增长，风险较低'}。</p>`,
        `<p>您的财富来源主要有：</p>`,
        `<ul>`,
        `<li>主业收入：${baZi.day.stem === '戊' || baZi.day.stem === '己' ? '稳定且构成主要财源' : '有一定波动，需要规划'}</li>`,
        `<li>副业收入：${baZi.hour.stem === '甲' || baZi.hour.stem === '乙' ? '有较好发展空间，可适当投入' : '可作为补充，不宜过度依赖'}</li>`,
        `<li>投资收益：${baZi.year.stem === '庚' || baZi.year.stem === '辛' ? '有独到眼光，可获得不错回报' : '宜稳健为主，避免高风险项目'}</li>`,
        `</ul>`,
        `<p>财务管理建议：建立合理的收支规划，适当储蓄和投资，避免冲动消费，关注长期财富积累。</p>`
    ];
    
    document.getElementById('wealth-content').innerHTML = analysis.join('');
}

/**
 * 生成健康分析
 */
function generateHealthAnalysis(data) {
    const baZi = data.baZi;
    
    // 根据八字生成健康分析
    const analysis = [
        `<p>您的八字中${baZi.day.stem}${baZi.day.branch}日柱代表健康状况，整体健康状况${baZi.day.stem === '丙' || baZi.day.stem === '丁' ? '较好，但需注意心脑血管' : '中等，应加强日常保健'}。</p>`,
        `<p>需要关注的健康方面：</p>`,
        `<ul>`,
        `<li>${baZi.year.stem === '甲' || baZi.year.stem === '乙' ? '肝胆系统：注意情绪管理，避免过度紧张' : '消化系统：注意饮食规律，避免辛辣刺激'}</li>`,
        `<li>${baZi.month.stem === '壬' || baZi.month.stem === '癸' ? '泌尿系统：多喝水，保持良好排泄习惯' : '呼吸系统：注意保暖，避免受凉感冒'}</li>`,
        `<li>${baZi.hour.stem === '庚' || baZi.hour.stem === '辛' ? '骨骼关节：适当运动，避免过度劳累' : '免疫系统：增强体质，预防疾病'}</li>`,
        `</ul>`,
        `<p>健康管理建议：保持规律作息，均衡饮食，适当运动，定期体检，保持乐观心态。</p>`
    ];
    
    document.getElementById('health-content').innerHTML = analysis.join('');
}

/**
 * 生成子女分析
 */
function generateChildrenAnalysis(data) {
    const baZi = data.baZi;
    const gender = data.gender;
    
    // 根据八字和性别生成子女分析
    const analysis = [
        `<p>您的八字中${baZi.hour.stem}${baZi.hour.branch}时柱代表子女，显示您与子女的缘分${baZi.hour.stem === '甲' || baZi.hour.stem === '乙' ? '较深，关系融洽' : '中等，需要用心经营'}。</p>`,
        `<p>子女特质预测：</p>`,
        `<ul>`,
        `<li>性格特点：${baZi.year.stem === '丙' || baZi.year.stem === '丁' ? '活泼开朗，富有创造力' : '稳重踏实，做事专注'}</li>`,
        `<li>学习能力：${baZi.month.stem === '壬' || baZi.month.stem === '癸' ? '思维灵活，接受能力强' : '勤奋努力，善于钻研'}</li>`,
        `<li>与父母关系：${gender === 'male' ? '与父亲亲近，尊重父亲的意见' : '与母亲沟通顺畅，情感交流丰富'}</li>`,
        `</ul>`,
        `<p>亲子关系建议：尊重子女个性，引导而不强制，建立良好沟通，共同成长。</p>`
    ];
    
    // 将分析内容添加到对应的HTML元素中
    document.getElementById('children-content').innerHTML = analysis.join('');
}

/**
 * 生成未来运势预测
 */
function generateFuturePrediction(data) {
    const baZi = data.baZi;
    const gender = data.gender;
    const currentYear = new Date().getFullYear();
    
    // 生成时间线
    const timeline = document.querySelector('.timeline');
    if (!timeline) return;
    
    // 清空现有内容
    timeline.innerHTML = '';
    
    // 生成未来5年的运势预测
    for (let i = 0; i < 5; i++) {
        const year = currentYear + i;
        const luck = generateYearLuck(year, baZi);
        
        const timelineItem = document.createElement('div');
        timelineItem.className = 'timeline-item';
        
        const yearElement = document.createElement('div');
        yearElement.className = 'timeline-year';
        yearElement.textContent = `${year}年运势`;
        
        const contentElement = document.createElement('div');
        contentElement.className = 'timeline-content';
        contentElement.innerHTML = luck;
        
        timelineItem.appendChild(yearElement);
        timelineItem.appendChild(contentElement);
        
        timeline.appendChild(timelineItem);
    }
}

/**
 * 生成年度运势
 */
function generateYearLuck(year, baZi) {
    // 根据八字和年份生成年度运势
    const yearStem = (year - 1924) % 10; // 天干序号（0-9）
    const yearBranch = (year - 1924) % 12; // 地支序号（0-11）
    
    // 天干和地支数组
    const stems = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
    const branches = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
    
    // 当年天干地支
    const currentStem = stems[yearStem];
    const currentBranch = branches[yearBranch];
    
    // 五行属性
    const stemElements = {
        '甲': '木', '乙': '木',
        '丙': '火', '丁': '火',
        '戊': '土', '己': '土',
        '庚': '金', '辛': '金',
        '壬': '水', '癸': '水'
    };
    
    const branchElements = {
        '子': '水', '丑': '土',
        '寅': '木', '卯': '木',
        '辰': '土', '巳': '火',
        '午': '火', '未': '土',
        '申': '金', '酉': '金',
        '戌': '土', '亥': '水'
    };
    
    // 当年五行
    const yearElement = stemElements[currentStem];
    
    // 与日柱的五行关系
    const dayElement = stemElements[baZi.day.stem];
    
    // 判断五行关系
    let relationship = '';
    if (yearElement === dayElement) {
        relationship = '相同，运势较为平稳';
    } else if (
        (yearElement === '木' && dayElement === '火') ||
        (yearElement === '火' && dayElement === '土') ||
        (yearElement === '土' && dayElement === '金') ||
        (yearElement === '金' && dayElement === '水') ||
        (yearElement === '水' && dayElement === '木')
    ) {
        relationship = '相生，运势较为有利';
    } else if (
        (yearElement === '火' && dayElement === '木') ||
        (yearElement === '土' && dayElement === '火') ||
        (yearElement === '金' && dayElement === '土') ||
        (yearElement === '水' && dayElement === '金') ||
        (yearElement === '木' && dayElement === '水')
    ) {
        relationship = '被生，运势较为消耗';
    } else if (
        (yearElement === '木' && dayElement === '金') ||
        (yearElement === '火' && dayElement === '水') ||
        (yearElement === '土' && dayElement === '木') ||
        (yearElement === '金' && dayElement === '火') ||
        (yearElement === '水' && dayElement === '土')
    ) {
        relationship = '相克，运势较为不利';
    } else {
        relationship = '被克，运势较为挑战';
    }
    
    // 生成各领域运势
    const careerLuck = generateFieldLuck(yearElement, baZi, 'career');
    const loveLuck = generateFieldLuck(yearElement, baZi, 'love');
    const wealthLuck = generateFieldLuck(yearElement, baZi, 'wealth');
    const healthLuck = generateFieldLuck(yearElement, baZi, 'health');
    
    // 生成HTML内容
    return `
        <p><strong>${year}年（${currentStem}${currentBranch}年）</strong>五行属性为<strong>${yearElement}</strong>，与您的日柱五行关系为<strong>${relationship}</strong>。</p>
        <div class="luck-fields">
            <div class="luck-field">
                <span class="field-name">事业：</span>
                <span class="field-value">${careerLuck}</span>
            </div>
            <div class="luck-field">
                <span class="field-name">感情：</span>
                <span class="field-value">${loveLuck}</span>
            </div>
            <div class="luck-field">
                <span class="field-name">财运：</span>
                <span class="field-value">${wealthLuck}</span>
            </div>
            <div class="luck-field">
                <span class="field-name">健康：</span>
                <span class="field-value">${healthLuck}</span>
            </div>
        </div>
    `;
}

/**
 * 生成各领域运势
 */
function generateFieldLuck(yearElement, baZi, field) {
    // 日干五行
    const dayElement = getStemElement(baZi.day.stem);
    
    // 关系
    let relationship = '';
    
    // 相生
    if ((yearElement === '木' && dayElement === '火') ||
        (yearElement === '火' && dayElement === '土') ||
        (yearElement === '土' && dayElement === '金') ||
        (yearElement === '金' && dayElement === '水') ||
        (yearElement === '水' && dayElement === '木')) {
        relationship = '相生';
    }
    // 相克
    else if ((yearElement === '木' && dayElement === '土') ||
             (yearElement === '土' && dayElement === '水') ||
             (yearElement === '水' && dayElement === '火') ||
             (yearElement === '火' && dayElement === '金') ||
             (yearElement === '金' && dayElement === '木')) {
        relationship = '相克';
    }
    // 相合
    else if (yearElement === dayElement) {
        relationship = '相合';
    }
    // 相冲
    else {
        relationship = '相冲';
    }
    
    // 运势描述
    let luckDescription = '';
    
    // 事业
    if (field === 'career') {
        if (relationship === '相生') {
            luckDescription = '事业发展顺利，有晋升或加薪机会。';
        } else if (relationship === '相克') {
            luckDescription = '事业遇到瓶颈，需要调整策略。';
        } else if (relationship === '相合') {
            luckDescription = '事业稳定，需要继续努力。';
        } else {
            luckDescription = '事业有波动，需要谨慎决策。';
        }
    }
    // 爱情
    else if (field === 'love') {
        if (relationship === '相生') {
            luckDescription = '爱情运势良好，有结婚或恋爱机会。';
        } else if (relationship === '相克') {
            luckDescription = '爱情遇到挑战，需要沟通和理解。';
        } else if (relationship === '相合') {
            luckDescription = '爱情稳定，需要继续维护。';
        } else {
            luckDescription = '爱情有波动，需要谨慎决策。';
        }
    }
    // 财运
    else if (field === 'wealth') {
        if (relationship === '相生') {
            luckDescription = '财运良好，有投资或理财机会。';
        } else if (relationship === '相克') {
            luckDescription = '财运遇到风险，需要谨慎投资。';
        } else if (relationship === '相合') {
            luckDescription = '财运稳定，需要继续管理。';
        } else {
            luckDescription = '财运有波动，需要谨慎决策。';
        }
    }
    // 健康
    else if (field === 'health') {
        if (relationship === '相生') {
            luckDescription = '健康状况良好，有康复或保健机会。';
        } else if (relationship === '相克') {
            luckDescription = '健康状况有风险，需要谨慎保健。';
        } else if (relationship === '相合') {
            luckDescription = '健康状况稳定，需要继续保健。';
        } else {
            luckDescription = '健康状况有波动，需要谨慎决策。';
        }
    }
    
    return luckDescription;
}

/**
 * 获取天干五行
 */
function getStemElement(stem) {
    const stemElements = {
        '甲': '木', '乙': '木',
        '丙': '火', '丁': '火',
        '戊': '土', '己': '土',
        '庚': '金', '辛': '金',
        '壬': '水', '癸': '水'
    };
    
    return stemElements[stem];
}

/**
 * 绑定选项卡切换事件
 */
function bindTabEvents() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            // 移除所有活动状态
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanes.forEach(pane => pane.classList.remove('active'));
            
            // 添加当前活动状态
            this.classList.add('active');
            const tabId = this.getAttribute('data-tab');
            document.getElementById(`${tabId}-content`).classList.add('active');
        });
    });
}

/**
 * 分享结果
 */
function shareResults() {
    // 获取基本信息
    const birthData = JSON.parse(localStorage.getItem('birthData'));
    if (!birthData) return;
    
    const baZi = birthData.baZi;
    const baZiText = `${baZi.year.stem}${baZi.year.branch} ${baZi.month.stem}${baZi.month.branch} ${baZi.day.stem}${baZi.day.branch} ${baZi.hour.stem}${baZi.hour.branch}`;
    
    // 创建分享文本
    const shareText = `我的八字是：${baZiText}，快来看看我的命理分析结果！`;
    
    // 如果支持原生分享API
    if (navigator.share) {
        navigator.share({
            title: '命理分析结果',
            text: shareText,
            url: window.location.href
        })
        .catch(error => {
            alert('分享失败，请手动复制分享。');
            console.error('分享失败:', error);
        });
    } else {
        // 不支持原生分享API，提示用户复制
        const textArea = document.createElement('textarea');
        textArea.value = shareText + ' ' + window.location.href;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        alert('分享内容已复制到剪贴板，您可以粘贴发送给好友。');
    }
}
