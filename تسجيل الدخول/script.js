import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

// إعدادات Firebase الخاصة بك
const firebaseConfig = {
    apiKey: "AIzaSyA_DtPAMCins40W5EaN1I4s6GX68t6iEFU",
    authDomain: "medfind-ba87d.firebaseapp.com",
    projectId: "medfind-ba87d",
    storageBucket: "medfind-ba87d.firebasestorage.app",
    messagingSenderId: "651794989320",
    appId: "1:651794989320:web:e1beeb71d9d5af1d2c6cbd"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// ✅ تأمين المسار باستخدام encodeURI لضمان عمل الحروف العربية والمسافات
const HOME_PAGE = encodeURI("../الصفحه الرايسيه التانيه/index.html");[cite: 2]

// ===== فورم تسجيل الدخول العادي =====
const authForm = document.getElementById('authForm');[cite: 2]

if (authForm) {
    authForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // سحب البيانات وتنظيفها من المسافات الزائدة
        const emailVal = document.getElementById('emailInput').value.trim().toLowerCase();[cite: 2]
        const passVal  = document.getElementById('passwordInput').value.trim();

        if (!emailVal || !passVal) {
            showError('من فضلك أدخل الإيميل وكلمة المرور');[cite: 2]
            return;
        }

        const btn = document.getElementById('mainBtn');
        btn.textContent = 'جاري تسجيل الدخول...';[cite: 2]
        btn.disabled = true;

        // ✅ التحقق من البيانات المحفوظة في localStorage
        const savedRaw = localStorage.getItem('userData');[cite: 2]

        if (savedRaw) {
            const saved = JSON.parse(savedRaw);[cite: 2]
            
            // المقارنة بدقة مع تحويل الإيميل لحروف صغيرة للطرفين
            if (
                saved.email.toLowerCase() === emailVal &&[cite: 2]
                saved.password === passVal[cite: 2]
            ) {
                console.log("Login Success:", saved.email);[cite: 2]
                window.location.assign(HOME_PAGE);[cite: 2]
                return;
            }
        }

        // في حال كانت البيانات خاطئة
        btn.textContent = 'تسجيل الدخول';[cite: 2]
        btn.disabled = false;
        showError('الإيميل أو كلمة المرور غير صحيحة');[cite: 2]
    });
}

// ===== زر تسجيل الدخول عبر جوجل =====
const googleBtn = document.querySelector('.google-btn');[cite: 2]

if (googleBtn) {
    googleBtn.onclick = () => {
        const provider = new GoogleAuthProvider();
        signInWithPopup(auth, provider)[cite: 2]
            .then((result) => {
                console.log("Google Login Success:", result.user);[cite: 2]

                // حفظ بيانات جلسة العمل في localStorage
                localStorage.setItem('userName', result.user.displayName || '');[cite: 2]
                if (result.user.photoURL) {
                    localStorage.setItem('profilePhoto', result.user.photoURL);[cite: 2]
                }

                // التوجيه للصفحة الرئيسية
                window.location.assign(HOME_PAGE);[cite: 2]
            })
            .catch(err => {
                console.error("Google Error:", err.code);[cite: 2]
                if (err.code !== 'auth/popup-closed-by-user') {[cite: 2]
                    showError('فشل تسجيل الدخول بجوجل');[cite: 2]
                }
            });
    };
}

// ===== دالة عرض رسائل الخطأ =====
function showError(message) {[cite: 2]
    const old = document.getElementById('errorMsg');
    if (old) old.remove();

    const errDiv = document.createElement('div');
    errDiv.id = 'errorMsg';
    errDiv.style.cssText = `
        background: #fff0f0;
        color: #c0392b;
        border: 1px solid #f5c6cb;
        border-radius: 10px;
        padding: 10px 15px;
        margin: 10px 0;
        font-size: 14px;
        text-align: center;
    `;
    errDiv.textContent = message;

    const btn = document.getElementById('mainBtn');
    if (btn) btn.parentNode.insertBefore(errDiv, btn);
}