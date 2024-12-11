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
