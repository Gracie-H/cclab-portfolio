document.addEventListener("DOMContentLoaded", () => {
    const projectCircles = document.querySelectorAll('.project-circle');
    const containerWidth = window.innerWidth;
    const containerHeight = window.innerHeight;

    projectCircles.forEach(circle => {
        // 生成随机位置
        const randomX = Math.random() * (containerWidth - 150); // 减去卡片宽度
        const randomY = Math.random() * (containerHeight - 150); // 减去卡片高度

        // 设置项目的随机位置
        circle.style.left = `${randomX}px`;
        circle.style.top = `${randomY}px`;

        // 点击效果 (可选)
        circle.addEventListener("click", () => {
            console.log(`Navigating to: ${circle.href}`);
        });
    });
});


document.addEventListener("DOMContentLoaded", () => {
    const containerWidth = window.innerWidth;
    const containerHeight = window.innerHeight;
    const existingCircles = document.querySelectorAll('.project-circle');
    const bubbleCount = 50; // 额外生成的 bubbles 数量

    // 为原有的 project-circle 设置随机大小
    existingCircles.forEach(circle => {
        const size = Math.random() * 100 + 120; // 随机大小 (120px 到 220px)
        circle.style.width = `${size}px`;
        circle.style.height = `${size}px`;
        circle.style.lineHeight = `${size}px`; // 确保文本居中
    });

    // 检查新 bubble 与现有元素是否重叠
    function isOverlapping(newX, newY, size) {
        for (const circle of existingCircles) {
            const rect = circle.getBoundingClientRect();
            if (
                newX < rect.right &&
                newX + size > rect.left &&
                newY < rect.bottom &&
                newY + size > rect.top
            ) {
                return true; // 有重叠
            }
        }
        return false; // 无重叠
    }

    // 创建额外的 bubbles
    function createBubble() {
        const bubble = document.createElement('div');
        bubble.classList.add('bubble'); // 新增 bubble 类
        const size = Math.random() * 100 + 40; // 随机大小 (80px 到 180px)

        let randomX, randomY;
        do {
            randomX = Math.random() * (containerWidth - size);
            randomY = Math.random() * (containerHeight - size);
        } while (isOverlapping(randomX, randomY, size));

        // 设置 bubble 样式
        bubble.style.position = "absolute";
        bubble.style.width = `${size}px`;
        bubble.style.height = `${size}px`;
        bubble.style.borderRadius = "50%";
        bubble.style.background = "rgba(255, 0, 0, 0.4)";
        bubble.style.left = `${randomX}px`;
        bubble.style.top = `${randomY}px`;
        bubble.style.animation = "float 4s infinite ease-in-out alternate";
        bubble.style.pointerEvents = "none"; // 纯装饰，不干扰鼠标事件

        document.body.appendChild(bubble);
    }

    // 批量生成 bubbles
    for (let i = 0; i < bubbleCount; i++) {
        createBubble();
    }

    // 移除 project-circle 的白色边框
    existingCircles.forEach(circle => {
        circle.style.border = "none";
    });
});

document.getElementById("learnMoreButton").addEventListener("click", function() {
    alert("Hi! I'm Gracie, exploring interactive and experimental design with passion!");
});
