// إعداد الخريطة
var map = L.map('map').setView([30.0444, 31.2357], 14);

// استخدام طبقة خرائط مجانية
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

// محاولة جلب موقع المستخدم الحقيقي
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
        var lat = position.coords.latitude;
        var lon = position.coords.longitude;
        map.setView([lat, lon], 15);

        // وضع ماركر لموقعك
        L.marker([lat, lon]).addTo(map)
            .bindPopup('موقعك الحالي - حالة طوارئ')
            .openPopup();
    });
}

// إضافة تفاعل بسيط للأزرار (مجرد تنبيه)
document.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('click', function() {
        console.log("تم الضغط على: " + this.innerText);
    });
});


// وظيفة زر الخطر
function triggerDanger() {
    document.getElementById('danger-btn').style.background = '#b71c1c';
    snack('🚨 تم إرسال نداء استغاثة!');
    if (!ambRequested) requestAmbulance();
}

// طلب الإسعاف
function requestAmbulance() {
    if (ambRequested) { cancelAmbulance(); return; }
    ambRequested = true;
    const btn = document.getElementById('amb-btn');
    btn.textContent = '❌ إلغاء الطلب';
    btn.style.background = '#fce4ec';
    btn.style.color = '#c62828';
    document.getElementById('countdown-box').classList.add('on');
    startTimer(8 * 60); // 8 دقائق
}

function cancelAmbulance() {
    ambRequested = false;
    clearInterval(countdownInterval);
    const btn = document.getElementById('amb-btn');
    btn.textContent = 'طلب إسعاف';
    btn.style.background = '#fff';
    btn.style.color = '#333';
    document.getElementById('countdown-box').classList.remove('on');
    document.getElementById('arrived-box').classList.remove('on');
    document.getElementById('danger-btn').style.background = '#e53935';
}

function startTimer(duration) {
    let timer = duration, m, s;
    countdownInterval = setInterval(() => {
        m = parseInt(timer / 60, 10);
        s = parseInt(timer % 60, 10);
        document.getElementById('countdown-num').textContent = `${m}:${s < 10 ? '0' + s : s}`;
        if (--timer < 0) {
            clearInterval(countdownInterval);
            document.getElementById('countdown-box').classList.remove('on');
            document.getElementById('arrived-box').classList.add('on');
        }
    }, 1000);
}

