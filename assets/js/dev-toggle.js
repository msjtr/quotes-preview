/* تبديل الويب / تطبيق الجوال في صفحات الموقع والبوابة (بدون محرك المنصة) */
document.querySelectorAll('.pv-bar button[data-dev]').forEach(function(b){b.addEventListener('click',function(){document.querySelectorAll('.pv-bar button[data-dev]').forEach(function(x){x.classList.toggle('is-on',x===b)})})});
