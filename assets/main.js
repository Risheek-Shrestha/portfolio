// ---------- terminal type-in ----------
(function () {
  const el = document.getElementById('termBody');
  if (!el) return;

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const lines = [
    { k: 'name', v: '"Risheek Shrestha"' },
    { k: 'role', v: '"Full-Stack + ML Developer"' },
    { k: 'study', v: '"MCA (AI/ML), Shoolini University"' },
    { k: 'stack', v: '["Spring Boot", "Django", "React", "PyTorch"]' },
    { k: 'status', v: '"available"' }
  ];

  function render(json) {
    el.innerHTML =
      '<span class="prompt">$</span> curl /api/risheek\n' +
      '<span class="punc">{</span>\n' +
      json +
      '<span class="punc">}</span>';
  }

  if (reduced) {
    const body = lines
      .map((l, i) => `  <span class="key">"${l.k}"</span><span class="punc">:</span> <span class="str">${l.v}</span>${i < lines.length - 1 ? ',' : ''}\n`)
      .join('');
    render(body);
    return;
  }

  let doneLines = [];
  let li = 0;

  function frame(partialKey, partialVal, showCursorOnKey) {
    const doneHtml = doneLines
      .map((l, i) => `  <span class="key">"${l.k}"</span><span class="punc">:</span> <span class="str">${l.v}</span>${i < lines.length - 1 ? ',' : ''}\n`)
      .join('');
    let currentHtml = '';
    if (partialKey !== undefined) {
      currentHtml =
        '  <span class="key">"' + partialKey + (showCursorOnKey ? '<span class="cursor"></span>' : '') + '"</span>' +
        (partialVal !== undefined
          ? '<span class="punc">:</span> <span class="str">' + partialVal + '<span class="cursor"></span></span>'
          : '');
    }
    el.innerHTML =
      '<span class="prompt">$</span> curl /api/risheek\n' +
      '<span class="punc">{</span>\n' +
      doneHtml + currentHtml +
      (partialKey === undefined ? '<span class="cursor"></span>' : '') + '\n' +
      '<span class="punc">}</span>';
  }

  function typeLine() {
    if (li >= lines.length) {
      frame();
      return;
    }
    const line = lines[li];
    const keyChars = line.k.split('');
    const valChars = line.v.split('');
    let ki = 0;

    function typeKey() {
      if (ki > keyChars.length) {
        setTimeout(typeVal, 80);
        return;
      }
      frame(line.k.slice(0, ki), undefined, true);
      ki++;
      setTimeout(typeKey, 22);
    }

    let vi = 0;
    function typeVal() {
      if (vi > valChars.length) {
        doneLines.push(line);
        li++;
        setTimeout(typeLine, 160);
        return;
      }
      frame(line.k, line.v.slice(0, vi), false);
      vi++;
      setTimeout(typeVal, 16);
    }

    typeKey();
  }

  setTimeout(typeLine, 450);
})();

// ---------- mobile nav toggle ----------
(function () {
  const btn = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');
  if (!btn || !links) return;

  btn.addEventListener('click', function () {
    const open = links.classList.toggle('is-open');
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
  });

  links.querySelectorAll('a').forEach((a) => {
    a.addEventListener('click', () => {
      links.classList.remove('is-open');
      btn.setAttribute('aria-expanded', 'false');
    });
  });
})();

// ---------- scroll reveal ----------
(function () {
  const items = document.querySelectorAll('.reveal');
  if (!items.length) return;

  if (!('IntersectionObserver' in window)) {
    items.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  items.forEach((el) => io.observe(el));
})();

// ---------- contact form (Web3Forms — sends a real email) ----------
(function () {
  const form = document.getElementById('contactForm');
  const note = document.getElementById('formNote');
  if (!form) return;

  const defaultNote = note ? note.textContent : '';

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const submitBtn = form.querySelector('.form-submit');
    const formData = new FormData(form);

    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';
    if (note) { note.textContent = ''; note.classList.remove('form-note--error', 'form-note--ok'); }

    fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { Accept: 'application/json' },
      body: formData
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          form.reset();
          submitBtn.textContent = 'Send message';
          if (note) {
            note.textContent = 'Message sent — thanks, I\'ll get back to you soon.';
            note.classList.add('form-note--ok');
          }
        } else {
          throw new Error(data.message || 'Submission failed');
        }
      })
      .catch(() => {
        submitBtn.textContent = 'Send message';
        if (note) {
          note.textContent = 'Something went wrong — please email me directly at shrestharisheek@gmail.com.';
          note.classList.add('form-note--error');
        }
      })
      .finally(() => {
        submitBtn.disabled = false;
        setTimeout(() => {
          if (note) { note.textContent = defaultNote; note.classList.remove('form-note--ok', 'form-note--error'); }
        }, 6000);
      });
  });
})();


