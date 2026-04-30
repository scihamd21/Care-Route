function sendMessage() {
    const input = document.getElementById('userInput');
    const chatbox = document.getElementById('chatbox');

    if (input.value.trim() === "") return;

    // 1. إضافة رسالة المستخدم
    const userDiv = document.createElement('div');
    userDiv.className = 'user-msg';
    userDiv.innerText = input.value;
    chatbox.appendChild(userDiv);

    const userText = input.value;
    input.value = "";

    // 2. محاكاة تفكير الذكاء الاصطناعي
    setTimeout(() => {
        const aiDiv = document.createElement('div');
        aiDiv.className = 'ai-msg';
        
        // منطق ردود ذكية بسيطة
        if (userText.includes("صداع")) {
            aiDiv.innerText = "بناءً على سجلك الطبي، قد يكون الصداع ناتجاً عن إجهاد. هل تشعر بأعراض أخرى؟";
        } else {
            aiDiv.innerText = "أنا أقوم بتحليل استفسارك الطبي الآن... كيف يمكنني مساعدتك بشكل أدق؟";
        }
        
        chatbox.appendChild(aiDiv);
        chatbox.scrollTop = chatbox.scrollHeight;
    }, 1000);
}