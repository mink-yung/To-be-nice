import { useEffect, useState } from 'react';
import { fetchRandomUsers, mapApiUserToLion, newLionId } from '../lionsApi.js';
import {
  isValidEmail,
  isValidPhone,
  isValidWebsiteUrl,
  parseSkills,
} from '../lionsValidation.js';

const EMPTY_FORM = {
  name: '',
  part: 'Frontend',
  skills: '',
  introLine: '',
  bio: '',
  email: '',
  phone: '',
  website: '',
  quote: '',
};

function lionToForm(lion) {
  return {
    name: lion.name || '',
    part: lion.part || 'Frontend',
    skills: (lion.skills || []).join(', '),
    introLine: lion.introLine || '',
    bio: lion.bio || '',
    email: lion.email || '',
    phone: lion.phone || '',
    website: lion.website || '',
    quote: lion.quote || '',
  };
}

function validateForm(form) {
  const err = {};
  const name = form.name.trim();
  const introLine = form.introLine.trim();
  const bio = form.bio.trim();
  const skillsRaw = form.skills.trim();
  const skills = parseSkills(form.skills);
  const email = form.email.trim();
  const phone = form.phone.trim();
  const website = form.website.trim();
  const quote = form.quote.trim();

  if (!name) err.name = '이름을 입력해 주세요.';
  if (!skillsRaw) err.skills = '관심 기술을 입력해 주세요.';
  else if (skills.length === 0) {
    err.skills = '쉼표로 구분해 최소 한 가지 이상 입력해 주세요.';
  }
  if (!introLine) err.introLine = '한 줄 소개를 입력해 주세요.';
  if (!bio) err.bio = '자기소개를 입력해 주세요.';
  if (!email) err.email = '이메일을 입력해 주세요.';
  else if (!isValidEmail(email)) {
    err.email = '올바른 이메일 형식이 아닙니다. (예: lion@example.com)';
  }
  if (!phone) err.phone = '휴대전화 번호를 입력해 주세요.';
  else if (!isValidPhone(phone)) {
    err.phone = '올바른 전화번호 형식이 아닙니다. (숫자 9~15자리)';
  }
  if (website && !isValidWebsiteUrl(website)) {
    err.website = 'URL 형식이 아닙니다. 올바른 주소를 입력하거나, 없으면 비워 두시오.';
  }
  if (!quote) err.quote = '한 마디를 입력해 주세요.';

  return err;
}

function LionAddFormShell({ open, onClose, onAddLion, runExternalRequest, asyncBusy }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!open) {
      setForm({ ...EMPTY_FORM });
      setErrors({});
    }
  }, [open]);

  function updateField(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: '' }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    const err = validateForm(form);
    if (Object.keys(err).length > 0) {
      setErrors(err);
      return;
    }
    const skills = parseSkills(form.skills);
    onAddLion({
      id: newLionId(),
      name: form.name.trim(),
      part: form.part,
      introLine: form.introLine.trim(),
      bio: form.bio.trim(),
      skills,
      email: form.email.trim(),
      phone: form.phone.trim(),
      website: form.website.trim(),
      quote: form.quote.trim(),
      imageSrc: '',
      addedAt: Date.now(),
    });
    onClose();
  }

  function handleRandomFill() {
    runExternalRequest(async () => {
      const users = await fetchRandomUsers(1);
      setForm(lionToForm(mapApiUserToLion(users[0], 0)));
      setErrors({});
    });
  }

  return (
    <div className="lion-add-form-wrap" hidden={!open}>
      <form className="lion-add-form" onSubmit={handleSubmit} noValidate>
        <div className="lion-form-grid">
          <label className="lion-field lion-field-half">
            <span className="lion-label">
              이름 <span className="lion-req" aria-hidden="true">*</span>
            </span>
            <input
              type="text"
              name="name"
              placeholder="예: 홍아기사자"
              autoComplete="name"
              aria-describedby="lion-msg-name"
              aria-invalid={errors.name ? 'true' : undefined}
              value={form.name}
              onChange={(e) => updateField('name', e.target.value)}
            />
            <span className="lion-field-msg" id="lion-msg-name" role="alert">
              {errors.name || ''}
            </span>
          </label>
          <label className="lion-field lion-field-half">
            <span className="lion-label">파트</span>
            <select
              name="part"
              value={form.part}
              onChange={(e) => updateField('part', e.target.value)}
            >
              <option value="Frontend">Frontend</option>
              <option value="Backend">Backend</option>
              <option value="Design">Design</option>
            </select>
          </label>
          <label className="lion-field lion-field-full">
            <span className="lion-label">
              관심 기술 (쉼표로 구분){' '}
              <span className="lion-req" aria-hidden="true">*</span>
            </span>
            <input
              type="text"
              name="skills"
              placeholder="예: JavaScript, React, HTML/CSS"
              aria-describedby="lion-msg-skills"
              aria-invalid={errors.skills ? 'true' : undefined}
              value={form.skills}
              onChange={(e) => updateField('skills', e.target.value)}
            />
            <span className="lion-field-msg" id="lion-msg-skills" role="alert">
              {errors.skills || ''}
            </span>
          </label>
          <label className="lion-field lion-field-full">
            <span className="lion-label">
              한 줄 소개 (요약 카드){' '}
              <span className="lion-req" aria-hidden="true">*</span>
            </span>
            <input
              type="text"
              name="introLine"
              placeholder="예: 5주차 React UI 렌더링 연습 중!"
              aria-describedby="lion-msg-intro-line"
              aria-invalid={errors.introLine ? 'true' : undefined}
              value={form.introLine}
              onChange={(e) => updateField('introLine', e.target.value)}
            />
            <span className="lion-field-msg" id="lion-msg-intro-line" role="alert">
              {errors.introLine || ''}
            </span>
          </label>
          <label className="lion-field lion-field-full">
            <span className="lion-label">
              자기소개 (상세 카드){' '}
              <span className="lion-req" aria-hidden="true">*</span>
            </span>
            <textarea
              name="bio"
              rows={5}
              placeholder="예: mock 데이터로 카드만 그리는 연습을 하고 있습니다."
              aria-describedby="lion-msg-bio"
              aria-invalid={errors.bio ? 'true' : undefined}
              value={form.bio}
              onChange={(e) => updateField('bio', e.target.value)}
            />
            <span className="lion-field-msg" id="lion-msg-bio" role="alert">
              {errors.bio || ''}
            </span>
          </label>
          <label className="lion-field lion-field-half">
            <span className="lion-label">
              Email <span className="lion-req" aria-hidden="true">*</span>
            </span>
            <input
              type="text"
              name="email"
              placeholder="예: lion@example.com"
              autoComplete="email"
              inputMode="email"
              aria-describedby="lion-msg-email"
              aria-invalid={errors.email ? 'true' : undefined}
              value={form.email}
              onChange={(e) => updateField('email', e.target.value)}
            />
            <span className="lion-field-msg" id="lion-msg-email" role="alert">
              {errors.email || ''}
            </span>
          </label>
          <label className="lion-field lion-field-half">
            <span className="lion-label">
              Phone <span className="lion-req" aria-hidden="true">*</span>
            </span>
            <input
              type="tel"
              name="phone"
              placeholder="예: 010-1234-5678"
              autoComplete="tel"
              aria-describedby="lion-msg-phone"
              aria-invalid={errors.phone ? 'true' : undefined}
              value={form.phone}
              onChange={(e) => updateField('phone', e.target.value)}
            />
            <span className="lion-field-msg" id="lion-msg-phone" role="alert">
              {errors.phone || ''}
            </span>
          </label>
          <label className="lion-field lion-field-full">
            <span className="lion-label">Website</span>
            <input
              type="text"
              name="website"
              placeholder="예: https://example.com"
              aria-describedby="lion-msg-website"
              aria-invalid={errors.website ? 'true' : undefined}
              value={form.website}
              onChange={(e) => updateField('website', e.target.value)}
            />
            <span className="lion-field-msg" id="lion-msg-website" role="alert">
              {errors.website || ''}
            </span>
          </label>
          <label className="lion-field lion-field-full">
            <span className="lion-label">
              한 마디 <span className="lion-req" aria-hidden="true">*</span>
            </span>
            <input
              type="text"
              name="quote"
              placeholder="예: 다음 주차에 상호작용을 붙인다!"
              aria-describedby="lion-msg-quote"
              aria-invalid={errors.quote ? 'true' : undefined}
              value={form.quote}
              onChange={(e) => updateField('quote', e.target.value)}
            />
            <span className="lion-field-msg" id="lion-msg-quote" role="alert">
              {errors.quote || ''}
            </span>
          </label>
        </div>
        <div className="lion-form-actions">
          <button
            type="button"
            className="lion-btn-secondary"
            disabled={asyncBusy}
            onClick={handleRandomFill}
          >
            랜덤 값 채우기
          </button>
          <span className="lion-form-actions-spacer" />
          <button type="button" className="lion-btn-text" onClick={onClose}>
            취소
          </button>
          <button type="submit" className="lion-btn-primary">
            추가하기
          </button>
        </div>
      </form>
    </div>
  );
}

export default LionAddFormShell;
