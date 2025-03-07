// ==UserScript==
// @name         Ohlone College Auto Enroll
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Auto enroll in Ohlone College courses based on course name and professor
// @author       Your Name
// @match        https://selfservice.ohlone.edu:8443/student/Planning/DegreePlans
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // 选课网址存储
    let enrollUrl = localStorage.getItem('enrollUrl') || 'https://selfservice.ohlone.edu:8443/student/Planning/DegreePlans';
    let courseName = localStorage.getItem('courseName') || '';
    let professorName = localStorage.getItem('professorName') || '';

    // 创建控制面板
    const controlPanel = document.createElement('div');
    controlPanel.innerHTML = `
        <div style="position:fixed;top:10px;right:10px;background:white;padding:10px;border:1px solid black;z-index:9999;">
            <label>选课网址: </label>
            <input type="text" id="enrollUrlInput" value="${enrollUrl}" style="width:300px;"/><br>
            <label>课程名称: </label>
            <input type="text" id="courseNameInput" value="${courseName}" style="width:300px;"/><br>
            <label>教授名称: </label>
            <input type="text" id="professorNameInput" value="${professorName}" style="width:300px;"/><br>
            <button id="saveSettings">保存</button>
        </div>
    `;
    document.body.appendChild(controlPanel);

    // 保存设置
    document.getElementById('saveSettings').addEventListener('click', () => {
        enrollUrl = document.getElementById('enrollUrlInput').value;
        courseName = document.getElementById('courseNameInput').value;
        professorName = document.getElementById('professorNameInput').value;

        localStorage.setItem('enrollUrl', enrollUrl);
        localStorage.setItem('courseName', courseName);
        localStorage.setItem('professorName', professorName);

        alert('设置已保存！');
    });

    // 自动抢课函数
    function autoEnroll() {
        console.log('尝试自动抢课...');

        let courseElements = document.querySelectorAll('.course-listing'); // 课程列表元素
        courseElements.forEach(course => {
            let courseTitle = course.querySelector('.course-title')?.innerText || '';
            let professor = course.querySelector('.professor-name')?.innerText || '';
            let enrollButton = course.querySelector('button.register-button');

            if (courseTitle.includes(courseName) && professor.includes(professorName)) {
                console.log(`匹配成功: ${courseTitle} - ${professor}`);
                if (enrollButton) {
                    enrollButton.click();
                    console.log('点击了注册按钮！');
                } else {
                    console.log('未找到注册按钮');
                }
            }
        });
    }

    // 监听 URL 变化 (防止刷新后失效)
    setInterval(() => {
        if (window.location.href.includes(enrollUrl)) {
            autoEnroll();
        }
    }, 3000); // 每 3 秒检查一次
})();
