function specialPartClassFor(lion) {
  return lion.id === 'seed-0' && lion.part === 'Frontend';
}

function ProfileCard({ lion }) {
  const partClassName = specialPartClassFor(lion) ? 'special-part' : 'part';
  const firstSkill = lion.skills && lion.skills[0];

  return (
    <article className="profile-card wrap" data-lion-id={lion.id}>
      <div className="image-area image-area-tagged">
        {lion.imageSrc ? (
          <img
            src={lion.imageSrc}
            alt={`${lion.name} 프로필`}
            className="profile-img"
            loading="lazy"
          />
        ) : (
          <div
            className="profile-img-placeholder"
            role="img"
            aria-label="프로필 사진"
          >
            프로필 사진
          </div>
        )}
        {firstSkill ? (
          <span className="profile-card-badge">{firstSkill}</span>
        ) : null}
      </div>
      <div className="card-content">
        <h2 className="name">{lion.name}</h2>
        <p className={partClassName}>{lion.part}</p>
        <p className="simple-intro">{lion.introLine || ''}</p>
      </div>
    </article>
  );
}

export default ProfileCard;
