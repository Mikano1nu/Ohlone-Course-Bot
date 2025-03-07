// ==UserScript==
// @name         Ohlone College Auto Enroll
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Auto enroll in Ohlone College courses based on course name and professor
// @author       Your Name
// @match        https://selfservice.ohlone.edu:8443/student/Planning/DegreePlans
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    let enrollUrl = localStorage.getItem('enrollUrl') || 'https://selfservice.ohlone.edu:8443/student/Planning/DegreePlans';
    let courseName = localStorage.getItem('courseName') || '';
    let professorName = localStorage.getItem('professorName') || '';
    
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

    document.getElementById('saveSettings').addEventListener('click', () => {
        enrollUrl = document.getElementById('enrollUrlInput').value;
        courseName = document.getElementById('courseNameInput').value;
        professorName = document.getElementById('professorNameInput').value;
        
        localStorage.setItem('enrollUrl', enrollUrl);
        localStorage.setItem('courseName', courseName);
        localStorage.setItem('professorName', professorName);
        
        alert('设置已保存！');
        autoEnroll();
    });

    function autoEnroll() {
        console.log('尝试自动抢课...');

        let courseElements = document.querySelectorAll('.course-listing');
        if (courseElements.length === 0) {
            console.log('课程列表未加载，稍后重试...');
            setTimeout(autoEnroll, 2000);
            return;
        }

        let found = false;
        courseElements.forEach(course => {
            let courseTitle = course.querySelector('.course-title')?.innerText || '';
            if (courseTitle.includes(courseName)) {
                found = true;
                let viewSectionsButton = course.querySelector('button.view-sections');
                if (viewSectionsButton) {
                    viewSectionsButton.click();
                    setTimeout(() => {
                        selectProfessor();
                    }, 2000);
                } else {
                    console.log('未找到查看选项按钮');
                }
            }
        });
        if (!found) alert('未找到匹配的课程');
    }

    function selectProfessor() {
        let sections = document.querySelectorAll('.section-listing');
        let found = false;
        sections.forEach(section => {
            let professor = section.querySelector('.instructor-name')?.innerText || '';
            if (professor.includes(professorName)) {
                found = true;
                let enrollButton = section.querySelector('button.register-button');
                if (enrollButton) {
                    enrollButton.click();
                    console.log('已点击注册按钮');
                } else {
                    console.log('未找到注册按钮');
                }
            }
        });
        if (!found) alert('未找到匹配的教授');
    }
    
    window.onload = function() {
        console.log("页面加载完成，启动自动选课...");
        setTimeout(autoEnroll, 2000);
    };

    setInterval(() => {
        console.log("当前网址:", window.location.href);
        console.log("目标选课网址:", enrollUrl);
        if (window.location.href.includes(enrollUrl)) {
            console.log("匹配成功，执行抢课逻辑...");
            autoEnroll();
        } else {
            console.log("当前页面不匹配选课网址，等待...");
        }
    }, 300);
})();
