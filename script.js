document.addEventListener("DOMContentLoaded", function() {
    const questions = [
        {
            text: "您喜欢什么类型的汽车？",
            options: [
                {
                    content: "SUV",
                    media: { type: "image", src: "media/suv.jpg" },
                    next: 1
                },
                {
                    content: "轿车",
                    media: { type: "image", src: "media/sedan.jpg" },
                    next: 2
                },
                {
                    content: "跑车",
                    media: { type: "image", src: "media/sports.jpg" },
                    next: 3
                }
            ]
        },
        {
            text: "您选择SUV的主要原因是什么？",
            options: [
                { content: "空间大", next: 4 },
                { content: "越野能力", next: 4 },
                { content: "外观", next: 4 }
            ]
        },
        {
            text: "您对轿车的偏好是？",
            options: [
                { content: "燃油车", next: 5 },
                { content: "新能源", next: 5 }
            ]
        },
        {
            text: "您对跑车的预算范围？",
            options: [
                { content: "30万以下", next: 6 },
                { content: "30-50万", next: 6 }
            ]
        }
    ];

    const results = {
        4: {
            media: { type: "image", src: "media/suv_result.jpg" },
            text: "您适合城市多功能SUV！"
        },
        5: {
            media: { type: "image", src: "media/sedan_result.jpg" },
            text: "您偏好舒适轿车！"
        },
        6: {
            media: { type: "image", src: "media/sports_result.jpg" },
            text: "您是性能爱好者！"
        }
    };

    // 全局状态变量
    window.currentQuestion = 0;
    window.path = [];
    window.historyStack = [];

    // 渲染问题页面
    window.renderQuestion = function() {
        const q = questions[window.currentQuestion];
        const html = `
            <h2 class="mb-4">${q.text}</h2>
            <div class="options-container">
                ${q.options.map((opt, i) => `
                    <div class="option" 
                        data-next="${opt.next}"
                        data-index="${i}">
                        <div class="option-text">${opt.content}</div>
                        ${opt.media ? `
                            <div class="option-media-container">
                                <img src="${opt.media.src}" class="option-media">
                            </div>
                        ` : ''}
                    </div>
                `).join('')}
            </div>
        `;
        $('#questionSection').html(html);

        // 控制"上一步"按钮显示
        $('.back-button').toggleClass('d-none', window.currentQuestion === 0);
    };

    // 处理选项选择
    window.selectOption = function(index) {
        // 记录当前问题到历史栈
        window.historyStack.push(window.currentQuestion);
        
        const selectedOption = questions[window.currentQuestion].options[index];
        window.path.push(selectedOption.next);
        
        $('.option').removeClass('selected');
        $(`.option:eq(${index})`).addClass('selected');
        
        setTimeout(() => {
            if ([4, 5, 6].some(v => window.path.includes(v))) {
                showResult(window.path[window.path.length-1]);
            } else {
                window.currentQuestion = selectedOption.next;
                window.renderQuestion();
            }
        }, 300);
    };

    // 显示结果页面
    function showResult(resultKey) {
        const result = results[resultKey];
        const html = `
            <div class="result-content">
                ${result.media ? `<img src="${result.media.src}" class="result-media">` : ''}
                <h3 class="mt-4">${result.text}</h3>
                <div class="restart-button mt-4">回到开始</div>
            </div>
        `;
        $('#resultSection').html(html);
        $('.question-section').addClass('d-none');
        $('.result-section').removeClass('d-none');
    }

    // 事件绑定
    $('#questionSection').on('click', '.option', function() {
        const index = $(this).data('index');
        window.selectOption(index);
    });

    $('#resultSection').on('click', '.restart-button', function() {
        window.restartTest();
    });

    // 初始化
    window.renderQuestion();
});

// 全局导航函数
window.goBack = function() {
    if (window.historyStack.length > 0) {
        window.currentQuestion = window.historyStack.pop();
        window.renderQuestion();
    }
};

window.restartTest = function() {
    window.currentQuestion = 0;
    window.historyStack = [];
    window.path = [];
    $('.result-section').addClass('d-none');
    $('.question-section').removeClass('d-none');
    window.renderQuestion();
};