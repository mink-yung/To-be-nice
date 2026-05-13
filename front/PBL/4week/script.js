(function () {
    var RANDOM_USER_API = 'https://randomuser.me/api/';
    var TECH_POOL = ['TypeScript', 'React', 'Vue', 'Node.js', 'GraphQL', 'CSS Grid', 'Figma', 'Docker', 'REST API', 'Web Accessibility', 'Typography'];

    var summarySection = document.getElementById('lion-summary-section');
    var detailSection = document.getElementById('lion-detail-section');
    var countEl = document.getElementById('lion-count');
    var btnAdd = document.getElementById('btn-add-lion');
    var btnRemove = document.getElementById('btn-remove-lion');
    var formWrap = document.getElementById('lion-add-form-wrap');
    var form = document.getElementById('lion-add-form');
    var fieldName = document.getElementById('lion-field-name');
    var fieldPart = document.getElementById('lion-field-part');
    var fieldSkills = document.getElementById('lion-field-skills');
    var fieldIntroLine = document.getElementById('lion-field-intro-line');
    var fieldBio = document.getElementById('lion-field-bio');
    var fieldEmail = document.getElementById('lion-field-email');
    var fieldPhone = document.getElementById('lion-field-phone');
    var fieldWebsite = document.getElementById('lion-field-website');
    var fieldQuote = document.getElementById('lion-field-quote');
    var btnCancel = document.getElementById('lion-form-cancel');
    var btnFormRandomFill = document.getElementById('btn-form-random-fill');
    var btnRandom1 = document.getElementById('btn-random-1');
    var btnRandom5 = document.getElementById('btn-random-5');
    var btnRefreshAll = document.getElementById('btn-refresh-all');
    var statusEl = document.getElementById('lion-async-status');
    var btnRetry = document.getElementById('btn-async-retry');
    var filterPart = document.getElementById('filter-part');
    var sortOrder = document.getElementById('sort-order');
    var searchName = document.getElementById('search-name');
    var emptyState = document.getElementById('lion-empty-state');

    var lions = buildInitialLions();
    var loadState = 'idle';
    var lastErrorMessage = '';
    var lastFailedRunner = null;

    function buildInitialLions() {
        var imgs = ['assets/3.jfif', 'assets/1.jpg', 'assets/4.png', 'assets/2.png'];
        var parts = ['Design', 'Backend', 'Frontend'];
        var designSkills = ['Figma', 'UI/UX', 'Adobe Photoshop', 'Prototype'];
        var backendSkills = ['Node.js', 'Java', 'Python', 'REST API'];
        var feSkills = ['HTML', 'CSS', 'JavaScript', 'React'];
        var list = [
            {
                id: 'seed-0',
                name: '박민경',
                part: 'Frontend',
                introLine: '14기 아기사자 박민경 입니다! 잘 부탁드립니다!٩(⌯˃ ▾ ˂⌯)‎و',
                bio: '안녕하세요! 저는 멋쟁이사자처럼 14기 프론트엔드 파트에 속한 박민경입니다.나이는 25살,MBTI는 ENFP입니당(˶˚ ᗨ ˚˶) 귀여운 것을 좋아하고, 무언가를 만드는걸 좋아합니다! 이번 학기에는 HTML, CSS, JavaScript 등 다양한 웹 기술을 배우며 성장하고자 합니다. 아직은 초보 개발자이지만, 열심히 노력하여 멋진 웹 개발자로 성장하겠습니다! 잘 부탁드립니다!₍₍⚞(˶˃ ꒳ ˂˶)⚟⁾⁾',
                skills: feSkills.slice(),
                email: 'hearang3180@naver.com',
                phone: '010-4261-4416',
                website: 'https://luminous-our-life.tistory.com/',
                quote: '아직은 모르는게 더 많은 초보 개발자 이지만 열심히 배우겠습니다!＞⩌＜',
                imageSrc: 'assets/profile.jpg',
                addedAt: 1
            }
        ];
        var bios = [
            '사용자 경험을 고민하며 성장하는 디자이너가 되고 싶습니다.',
            '서버와 데이터를 다루는 실력을 쌓아가겠습니다.',
            '웹 화면을 만지며 사용자에게 닿는 개발을 배우고 있습니다.',
            '안정적인 서비스를 만드는 데 기여하고 싶습니다.',
            '보기 좋고 쓰기 편한 화면을 만드는 연습을 하고 있습니다.',
            '인터랙션과 레이아웃을 배우며 재미있는 웹을 만들고 싶습니다.',
            'API와 데이터 처리를 익히며 성장 중입니다.',
            '브랜드와 화면을 함께 고민하는 디자이너가 되고 싶습니다.',
            '웹 접근성과 반응형 레이아웃에 관심이 많습니다.'
        ];
        for (var i = 1; i <= 9; i++) {
            var part = parts[(i - 1) % 3];
            var skills = part === 'Design' ? designSkills.slice() : part === 'Backend' ? backendSkills.slice() : feSkills.slice();
            var pLabel = part === 'Design' ? '디자인' : part === 'Backend' ? '백엔드' : '프론트엔드';
            var bioExtra = bios[i - 1] || '잘 부탁드립니다.';
            list.push({
                id: 'seed-' + i,
                name: '아무개' + i,
                part: part,
                introLine: '아무개' + i + '입니다. 잘부탁드립니다',
                bio:
                    '안녕하세요! 저는 멋쟁이사자처럼 14기 ' +
                    pLabel +
                    ' 파트의 아무개' +
                    i +
                    '입니다. 아무개' +
                    i +
                    '입니다. 잘부탁드립니다. ' +
                    bioExtra,
                skills: skills,
                email: 'amugae' + i + '@example.com',
                phone: '010-0000-000' + i,
                website: '',
                quote: '아무개' + i + '입니다. 잘부탁드립니다. ' + part + ' 파트에서 최선을 다하겠습니다!',
                imageSrc: imgs[(i - 1) % 4],
                addedAt: 1 + i
            });
        }
        return list;
    }

    function newLionId() {
        return 'lion-' + Date.now() + '-' + Math.random().toString(36).slice(2, 9);
    }

    function shuffleCopy(arr) {
        var a = arr.slice();
        for (var i = a.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var t = a[i];
            a[i] = a[j];
            a[j] = t;
        }
        return a;
    }

    function pickRandomSkills() {
        var pool = shuffleCopy(TECH_POOL);
        var n = 3 + Math.floor(Math.random() * 2);
        return pool.slice(0, n);
    }

    function mapApiUserToLion(u, idx) {
        var parts = ['Frontend', 'Backend', 'Design'];
        var part = parts[Math.floor(Math.random() * parts.length)];
        var first = (u.name && u.name.first) || '';
        var last = (u.name && u.name.last) || '';
        var name = (first + ' ' + last).trim() || (u.login && u.login.username) || '이름 없음';
        var city = (u.location && u.location.city) || '';
        var age = u.dob && u.dob.age;
        var skills = pickRandomSkills();
        var introLine = city ? city + '에서 활동 중인 아기 사자입니다.' : '새로 합류한 아기 사자입니다.';
        var bio =
            '안녕하세요! 저는 ' +
            name +
            '입니다. ' +
            (age ? '나이는 ' + age + '살, ' : '') +
            '멋쟁이사자처럼 14기 ' +
            part +
            ' 파트에서 함께 성장하고 싶습니다.';
        return {
            id: newLionId(),
            name: name,
            part: part,
            introLine: introLine,
            bio: bio,
            skills: skills,
            email: u.email || '',
            phone: String((u.cell || u.phone || '').replace(/\D/g, '') || '01000000000'),
            website: '',
            quote: '오늘도 한 걸음씩!',
            imageSrc: (u.picture && (u.picture.large || u.picture.medium)) || '',
            addedAt: Date.now() + idx
        };
    }

    function fetchRandomUsers(results) {
        var url = RANDOM_USER_API + '?results=' + results + '&nat=kr,us,gb';
        return fetch(url).then(function (res) {
            if (!res.ok) throw new Error('서버 응답 ' + res.status);
            return res.json();
        }).then(function (data) {
            if (!data.results || data.results.length === 0) throw new Error('사용자 데이터가 비어 있습니다.');
            return data.results;
        });
    }

    function setLoadState(state, message) {
        loadState = state;
        if (state === 'error') lastErrorMessage = message || '알 수 없는 오류';
        updateAsyncUi();
    }

    function updateAsyncUi() {
        var loading = loadState === 'loading';
        btnRandom1.disabled = loading;
        btnRandom5.disabled = loading;
        btnRefreshAll.disabled = loading;
        btnFormRandomFill.disabled = loading;
        if (loadState === 'loading') {
            statusEl.textContent = '불러오는 중...';
            btnRetry.hidden = true;
        } else if (loadState === 'error') {
            statusEl.textContent = '실패: ' + lastErrorMessage;
            btnRetry.hidden = !lastFailedRunner;
        } else {
            statusEl.textContent = '준비 완료';
            btnRetry.hidden = true;
        }
    }

    function runExternalRequest(runner) {
        if (loadState === 'loading') return;
        lastFailedRunner = null;
        setLoadState('loading');
        runner()
            .then(function () {
                lastFailedRunner = null;
                setLoadState('idle');
                render();
            })
            .catch(function (err) {
                lastFailedRunner = function () {
                    runExternalRequest(runner);
                };
                setLoadState('error', err && err.message ? err.message : String(err));
            });
    }

    btnRetry.addEventListener('click', function () {
        if (typeof lastFailedRunner === 'function') lastFailedRunner();
    });

    btnRandom1.addEventListener('click', function () {
        runExternalRequest(function () {
            return fetchRandomUsers(1).then(function (users) {
                users.forEach(function (u, i) {
                    lions.push(mapApiUserToLion(u, i));
                });
            });
        });
    });

    btnRandom5.addEventListener('click', function () {
        runExternalRequest(function () {
            return fetchRandomUsers(5).then(function (users) {
                users.forEach(function (u, i) {
                    lions.push(mapApiUserToLion(u, i));
                });
            });
        });
    });

    btnRefreshAll.addEventListener('click', function () {
        runExternalRequest(function () {
            var n = lions.length;
            if (n < 1) n = 9;
            return fetchRandomUsers(Math.min(Math.max(n, 1), 20)).then(function (users) {
                lions = users.map(function (u, i) {
                    return mapApiUserToLion(u, i);
                });
            });
        });
    });

    function getFilteredSortedLions() {
        var partVal = filterPart.value;
        var q = (searchName.value || '').trim().toLowerCase();
        var sortVal = sortOrder.value;
        var filtered = lions.filter(function (lion) {
            if (partVal && lion.part !== partVal) return false;
            if (q && String(lion.name).toLowerCase().indexOf(q) === -1) return false;
            return true;
        });
        filtered.sort(function (a, b) {
            if (sortVal === 'name') {
                return String(a.name).localeCompare(String(b.name), 'ko');
            }
            return (b.addedAt || 0) - (a.addedAt || 0);
        });
        return filtered;
    }

    function updateCount() {
        var n = lions.length;
        countEl.textContent = '총 ' + n + '명';
        btnRemove.disabled = n <= 1;
    }

    function openForm() {
        formWrap.hidden = false;
        clearAllFieldMessages();
        fieldName.focus();
    }

    function closeForm() {
        formWrap.hidden = true;
        form.reset();
        clearAllFieldMessages();
    }

    function fieldMessageEl(field) {
        return document.getElementById(field.id.replace('lion-field-', 'lion-msg-'));
    }

    function setFieldMessage(field, message) {
        var el = fieldMessageEl(field);
        if (el) el.textContent = message || '';
        if (message) field.setAttribute('aria-invalid', 'true');
        else field.removeAttribute('aria-invalid');
    }

    function clearAllFieldMessages() {
        [fieldName, fieldSkills, fieldIntroLine, fieldBio, fieldEmail, fieldPhone, fieldWebsite, fieldQuote].forEach(function (f) {
            setFieldMessage(f, '');
        });
    }

    function isValidEmail(s) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
    }

    function isValidPhone(s) {
        var digits = String(s).replace(/\D/g, '');
        return digits.length >= 9 && digits.length <= 15;
    }

    function isValidWebsiteUrl(raw) {
        var s = (raw || '').trim();
        if (!s) return true;
        try {
            var u = new URL(normalizeWebsiteHref(s));
            if (u.protocol !== 'http:' && u.protocol !== 'https:') return false;
            return Boolean(u.hostname && u.hostname.length > 0);
        } catch (err) {
            return false;
        }
    }

    function normalizeWebsiteHref(raw) {
        var s = (raw || '').trim();
        if (!s) return '';
        if (/^https?:\/\//i.test(s)) return s;
        return 'https://' + s;
    }

    function parseSkills(csv) {
        return (csv || '')
            .split(',')
            .map(function (t) {
                return t.trim();
            })
            .filter(Boolean);
    }

    function useSpecialPartClass(lion) {
        return lion.id === 'seed-0' && lion.part === 'Frontend';
    }

    function buildProfileCard(lion) {
        var article = document.createElement('article');
        article.className = 'profile-card wrap';
        article.dataset.lionId = lion.id;
        var imgWrap = document.createElement('div');
        imgWrap.className = 'image-area image-area-tagged';
        if (lion.imageSrc) {
            var img = document.createElement('img');
            img.src = lion.imageSrc;
            img.alt = lion.name + ' 프로필';
            img.className = 'profile-img';
            img.loading = 'lazy';
            imgWrap.appendChild(img);
        } else {
            var placeholder = document.createElement('div');
            placeholder.className = 'profile-img-placeholder';
            placeholder.setAttribute('role', 'img');
            placeholder.setAttribute('aria-label', '프로필 사진');
            placeholder.textContent = '프로필 사진';
            imgWrap.appendChild(placeholder);
        }
        if (lion.skills && lion.skills[0]) {
            var badge = document.createElement('span');
            badge.className = 'profile-card-badge';
            badge.textContent = lion.skills[0];
            imgWrap.appendChild(badge);
        }
        var content = document.createElement('div');
        content.className = 'card-content';
        var h2 = document.createElement('h2');
        h2.className = 'name';
        h2.textContent = lion.name;
        var pPart = document.createElement('p');
        pPart.className = useSpecialPartClass(lion) ? 'special-part' : 'part';
        pPart.textContent = lion.part;
        var pIntro = document.createElement('p');
        pIntro.className = 'simple-intro';
        pIntro.textContent = lion.introLine || '';
        content.appendChild(h2);
        content.appendChild(pPart);
        content.appendChild(pIntro);
        article.appendChild(imgWrap);
        article.appendChild(content);
        return article;
    }

    function buildDetailContent(lion) {
        var name = lion.name;
        var part = lion.part;
        var bio = lion.bio || '';
        var skills = lion.skills || [];
        var email = lion.email;
        var phone = lion.phone;
        var websiteRaw = lion.website;
        var quote = lion.quote || '';

        var root = document.createElement('div');
        root.className = 'detail-content';
        root.dataset.lionId = lion.id;

        var h2 = document.createElement('h2');
        h2.className = 'detail-name';
        h2.textContent = name;
        var pPart = document.createElement('p');
        pPart.className = 'detail-part';
        pPart.textContent = part;
        var club = document.createElement('p');
        club.className = 'club-name';
        club.textContent = '멋쟁이사자처럼 14기';
        root.appendChild(h2);
        root.appendChild(pPart);
        root.appendChild(club);

        var g1 = document.createElement('div');
        g1.className = 'info-group';
        var h31 = document.createElement('h3');
        h31.textContent = '자기소개 한문단';
        var pBio = document.createElement('p');
        pBio.textContent = bio;
        g1.appendChild(h31);
        g1.appendChild(pBio);
        root.appendChild(g1);

        var g2 = document.createElement('div');
        g2.className = 'info-group';
        var h32 = document.createElement('h3');
        h32.textContent = '관심 기술 불렛 포인트 목록';
        var ul = document.createElement('ul');
        skills.forEach(function (skill) {
            var li = document.createElement('li');
            li.textContent = skill;
            ul.appendChild(li);
        });
        g2.appendChild(h32);
        g2.appendChild(ul);
        root.appendChild(g2);

        var g3 = document.createElement('div');
        g3.className = 'info-group';
        var h33 = document.createElement('h3');
        h33.textContent = '연락처';
        var ul3 = document.createElement('ul');
        var liEmail = document.createElement('li');
        liEmail.textContent = '이메일: ' + (email || '(없음)');
        var liWeb = document.createElement('li');
        liWeb.appendChild(document.createTextNode('웹사이트: '));
        var siteTrim = (websiteRaw || '').trim();
        if (siteTrim) {
            var a = document.createElement('a');
            a.className = 'part';
            a.href = normalizeWebsiteHref(siteTrim);
            a.target = '_blank';
            a.rel = 'noopener noreferrer';
            a.textContent = siteTrim;
            liWeb.appendChild(a);
        } else {
            liWeb.appendChild(document.createTextNode('준비 중'));
        }
        var liPhone = document.createElement('li');
        liPhone.textContent = '휴대전화 번호: ' + (phone || '(없음)');
        ul3.appendChild(liEmail);
        ul3.appendChild(liWeb);
        ul3.appendChild(liPhone);
        g3.appendChild(h33);
        g3.appendChild(ul3);
        root.appendChild(g3);

        var g4 = document.createElement('div');
        g4.className = 'info-group';
        var h34 = document.createElement('h3');
        h34.textContent = '각오 한 마디';
        var pQuote = document.createElement('p');
        pQuote.textContent = quote;
        g4.appendChild(h34);
        g4.appendChild(pQuote);
        root.appendChild(g4);

        return root;
    }

    function render() {
        var visible = getFilteredSortedLions();
        summarySection.innerHTML = '';
        detailSection.innerHTML = '';
        visible.forEach(function (lion) {
            summarySection.appendChild(buildProfileCard(lion));
            detailSection.appendChild(buildDetailContent(lion));
        });
        emptyState.hidden = visible.length > 0;
        updateCount();
    }

    btnAdd.addEventListener('click', function () {
        openForm();
    });

    btnCancel.addEventListener('click', function () {
        closeForm();
    });

    [fieldName, fieldSkills, fieldIntroLine, fieldBio, fieldEmail, fieldPhone, fieldWebsite, fieldQuote].forEach(function (f) {
        f.addEventListener('input', function () {
            setFieldMessage(f, '');
        });
    });

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        clearAllFieldMessages();

        var name = fieldName.value.trim();
        var introLine = fieldIntroLine.value.trim();
        var bio = fieldBio.value.trim();
        var skillsRaw = fieldSkills.value.trim();
        var skills = parseSkills(fieldSkills.value);
        var email = fieldEmail.value.trim();
        var phone = fieldPhone.value.trim();
        var website = fieldWebsite.value.trim();
        var quote = fieldQuote.value.trim();
        var part = fieldPart.value;

        var firstInvalid = null;

        if (!name) {
            setFieldMessage(fieldName, '이름을 입력해 주세요.');
            firstInvalid = firstInvalid || fieldName;
        }
        if (!skillsRaw) {
            setFieldMessage(fieldSkills, '관심 기술을 입력해 주세요.');
            firstInvalid = firstInvalid || fieldSkills;
        } else if (skills.length === 0) {
            setFieldMessage(fieldSkills, '쉼표로 구분해 최소 한 가지 이상 입력해 주세요.');
            firstInvalid = firstInvalid || fieldSkills;
        }
        if (!introLine) {
            setFieldMessage(fieldIntroLine, '한 줄 소개를 입력해 주세요.');
            firstInvalid = firstInvalid || fieldIntroLine;
        }
        if (!bio) {
            setFieldMessage(fieldBio, '자기소개를 입력해 주세요.');
            firstInvalid = firstInvalid || fieldBio;
        }
        if (!email) {
            setFieldMessage(fieldEmail, '이메일을 입력해 주세요.');
            firstInvalid = firstInvalid || fieldEmail;
        } else if (!isValidEmail(email)) {
            setFieldMessage(fieldEmail, '올바른 이메일 형식이 아닙니다. (예: lion@example.com)');
            firstInvalid = firstInvalid || fieldEmail;
        }
        if (!phone) {
            setFieldMessage(fieldPhone, '휴대전화 번호를 입력해 주세요.');
            firstInvalid = firstInvalid || fieldPhone;
        } else if (!isValidPhone(phone)) {
            setFieldMessage(fieldPhone, '올바른 전화번호 형식이 아닙니다. (숫자 9~15자리)');
            firstInvalid = firstInvalid || fieldPhone;
        }
        if (website && !isValidWebsiteUrl(website)) {
            setFieldMessage(fieldWebsite, 'URL 형식이 아닙니다. 올바른 주소를 입력하거나, 없으면 비워 두시오.');
            firstInvalid = firstInvalid || fieldWebsite;
        }
        if (!quote) {
            setFieldMessage(fieldQuote, '한 마디를 입력해 주세요.');
            firstInvalid = firstInvalid || fieldQuote;
        }

        if (firstInvalid) {
            firstInvalid.focus();
            if (firstInvalid === fieldWebsite) fieldWebsite.select();
            return;
        }

        lions.push({
            id: newLionId(),
            name: name,
            part: part,
            introLine: introLine,
            bio: bio,
            skills: skills,
            email: email,
            phone: phone,
            website: website,
            quote: quote,
            imageSrc: '',
            addedAt: Date.now()
        });
        closeForm();
        render();
    });

    btnRemove.addEventListener('click', function () {
        if (lions.length <= 1) return;
        lions.pop();
        render();
    });

    function fillFormFromLion(lion) {
        fieldName.value = lion.name || '';
        fieldPart.value = lion.part || 'Frontend';
        fieldSkills.value = (lion.skills || []).join(', ');
        fieldIntroLine.value = lion.introLine || '';
        fieldBio.value = lion.bio || '';
        fieldEmail.value = lion.email || '';
        fieldPhone.value = lion.phone || '';
        fieldWebsite.value = lion.website || '';
        fieldQuote.value = lion.quote || '';
        clearAllFieldMessages();
    }

    btnFormRandomFill.addEventListener('click', function () {
        if (loadState === 'loading') return;
        runExternalRequest(function () {
            return fetchRandomUsers(1).then(function (users) {
                fillFormFromLion(mapApiUserToLion(users[0], 0));
            });
        });
    });

    filterPart.addEventListener('change', render);
    sortOrder.addEventListener('change', render);
    searchName.addEventListener('input', render);

    render();
    updateAsyncUi();
})();
