// ===== رفع الصورة الشخصية =====
const fileInput = document.getElementById('fileInput');
const picCircle = document.getElementById('picCircle');
const removeBtn = document.getElementById('removeBtn');

fileInput.addEventListener('change', function () {
  const file = this.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function (e) {
    picCircle.innerHTML = '<img src="' + e.target.result + '" alt="profile photo">';
    picCircle.classList.add('has-img');
    removeBtn.classList.add('show');
    localStorage.setItem('profilePhoto', e.target.result);
  };
  reader.readAsDataURL(file);
});

function removePhoto() {
  picCircle.innerHTML = '<span class="plus-icon">+</span>';
  picCircle.classList.remove('has-img');
  removeBtn.classList.remove('show');
  fileInput.value = '';
  localStorage.removeItem('profilePhoto');
}

// ===== راديو بوتونز =====
const radioGroup = document.getElementById('patientRadio');
const radioOptions = radioGroup.querySelectorAll('.radio-opt');
radioOptions.forEach(function (opt) {
  opt.addEventListener('click', function () {
    radioOptions.forEach(function (o) {
      o.classList.remove('active');
      o.querySelector('.check-icon').innerHTML = '';
    });
    this.classList.add('active');
    this.querySelector('.check-icon').innerHTML = '<span class="check-dot"></span>';
  });
});

// ===== حفظ البيانات وإرسال الفورم =====
const submitBtn = document.querySelector('.submit-btn');

submitBtn.addEventListener('click', function () {
  // جمع كل الـ inputs
  const inputs = document.querySelectorAll('.input-box input');
  const nameInput    = inputs[0];   // الاسم
  const ageInput     = inputs[1];   // العمر
  const phoneInput   = inputs[2];   // الهاتف
  const idInput      = inputs[3];   // الهوية
  const emailInput   = inputs[4];   // الإيميل
  const email2Input  = inputs[5];   // تأكيد الإيميل
  const passInput    = inputs[6];   // كلمة المرور
  const pass2Input   = inputs[7];   // تأكيد كلمة المرور

  let valid = true;

  // تحقق إن الحقول مش فاضية
  inputs.forEach(function (input) {
    if (input.value.trim() === '') {
      input.style.borderColor = '#e74c3c';
      valid = false;
    } else {
      input.style.borderColor = '';
    }
  });

  if (!valid) {
    showSignupError('من فضلك املأ جميع الحقول المطلوبة');
    return;
  }

  // تحقق إن الإيميلين متطابقين
  if (emailInput.value.trim() !== email2Input.value.trim()) {
    email2Input.style.borderColor = '#e74c3c';
    showSignupError('الإيميل وتأكيد الإيميل غير متطابقين');
    return;
  }

  // تحقق إن كلمتا المرور متطابقتان
  if (passInput.value !== pass2Input.value) {
    pass2Input.style.borderColor = '#e74c3c';
    showSignupError('كلمة المرور وتأكيدها غير متطابقين');
    return;
  }

  // ✅ حفظ بيانات المستخدم في localStorage
  const userData = {
    name:     nameInput.value.trim(),
    age:      ageInput.value.trim(),
    phone:    phoneInput.value.trim(),
    idNum:    idInput.value.trim(),
    email:    emailInput.value.trim().toLowerCase(),
    password: passInput.value
  };

  localStorage.setItem('userData', JSON.stringify(userData));
  console.log("Account created and saved:", userData.email);

  // التوجيه لصفحة تسجيل الدخول
  window.location.href = '../تسجيل الدخول/index.html';
});

// دالة عرض الخطأ
function showSignupError(msg) {
  let old = document.getElementById('signupError');
  if (old) old.remove();
  const div = document.createElement('div');
  div.id = 'signupError';
  div.style.cssText = 'background:#fff0f0;color:#c0392b;border:1px solid #f5c6cb;border-radius:10px;padding:10px 15px;margin:10px 0;font-size:14px;text-align:center;';
  div.textContent = msg;
  const btn = document.querySelector('.submit-btn');
  btn.parentNode.insertBefore(div, btn);
}