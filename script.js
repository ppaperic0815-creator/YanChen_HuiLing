const messages = {
  wave: {
    icon: '👋',
    text: '彥辰和惠玲見面了！兩個人笑著揮揮手，開心打招呼！',
    image: 'scene-wave.jpg',
    alt: '彥辰和惠玲在櫻花樹下微笑揮手打招呼'
  },
  handshake: {
    icon: '🤝',
    text: '彥辰和惠玲笑著雙手交握，完成溫暖又有默契的握手！',
    image: 'scene-handshake.jpg',
    alt: '彥辰和惠玲面對面微笑並雙手交握'
  },
  hug: {
    icon: '🫂',
    text: '彥辰和惠玲給彼此一個溫暖、友善的擁抱。',
    image: 'scene-hug.jpg',
    alt: '彥辰和惠玲在櫻花樹下開心擁抱'
  },
  cheer: {
    icon: '✨',
    text: '彥辰：「一起加油！」惠玲：「今天也要順利！」',
    image: 'scene-cheer.jpg',
    alt: '彥辰和惠玲開心握拳互相加油'
  }
};

const result = document.getElementById('result');
const photoWrap = document.getElementById('photoWrap');
const sceneStage = document.getElementById('sceneStage');
const sceneImage = document.getElementById('sceneImage');
const sceneEmoji = document.getElementById('sceneEmoji');
const sceneCaption = document.getElementById('sceneCaption');
const bondCount = document.getElementById('bondCount');
const bondFill = document.getElementById('bondFill');
const bondProgress = document.getElementById('bondProgress');
const bondHint = document.getElementById('bondHint');
const bonusBtn = document.getElementById('bonusBtn');

const TARGET_POINTS = 10;
let interactionPoints = 0;
let bonusUnlocked = false;

document.querySelectorAll('.action-btn').forEach((button) => {
  button.addEventListener('click', () => {
    const actionName = button.dataset.action;
    const action = messages[actionName];

    if (interactionPoints < TARGET_POINTS) {
      interactionPoints += 1;
      updateBondMeter();
    }

    showActionScene(action);

    result.innerHTML = `<span class="result-icon">${action.icon}</span><p>${action.text}</p>`;
    result.classList.remove('pop');
    void result.offsetWidth;
    result.classList.add('pop');

    makeSparkles(actionName === 'hug' ? 9 : 5);

    if (interactionPoints === TARGET_POINTS && !bonusUnlocked) {
      unlockBonusAnimation();
    }
  });
});

function showActionScene(action) {
  sceneStage.hidden = false;
  sceneEmoji.hidden = true;
  sceneImage.hidden = false;

  // 每個按鈕載入自己的圖片，確保互動畫面彼此不同。
  sceneImage.src = action.image;
  sceneImage.alt = action.alt;
  sceneCaption.textContent = action.text;

  sceneStage.classList.remove('scene-wave', 'scene-handshake', 'scene-hug', 'scene-cheer');
  void sceneStage.offsetWidth;
  sceneStage.classList.add(`scene-${Object.keys(messages).find(key => messages[key] === action)}`);

  for (let i = 0; i < 5; i++) {
    const sparkle = document.createElement('span');
    sparkle.className = 'scene-sparkle';
    sparkle.textContent = ['✦', '♡', '✨'][i % 3];
    sparkle.style.left = `${12 + i * 18}%`;
    sparkle.style.top = `${12 + (i % 2) * 60}%`;
    sceneStage.appendChild(sparkle);
    sparkle.addEventListener('animationend', () => sparkle.remove());
  }
}

function updateBondMeter() {
  bondCount.textContent = `${interactionPoints} / ${TARGET_POINTS}`;
  bondFill.style.width = `${interactionPoints / TARGET_POINTS * 100}%`;
  bondProgress.setAttribute('aria-valuenow', interactionPoints);
  bondHint.textContent = interactionPoints >= TARGET_POINTS
    ? '已達成 10 點！特別慶祝動畫已解鎖 🎉'
    : `再互動 ${TARGET_POINTS - interactionPoints} 次，就能解鎖特別動畫！`;
}

function unlockBonusAnimation() {
  bonusUnlocked = true;
  bonusBtn.hidden = false;
  result.innerHTML = '<span class="result-icon">🎊</span><p>互動累積值達到 10 點！彥辰和惠玲解鎖了特別慶祝動畫！</p>';
  playBonusAnimation();
}

function playBonusAnimation() {
  photoWrap.classList.remove('milestone');
  void photoWrap.offsetWidth;
  photoWrap.classList.add('milestone');
  makeSparkles(26);
  setTimeout(() => photoWrap.classList.remove('milestone'), 1900);
}

bonusBtn.addEventListener('click', playBonusAnimation);

function makeSparkles(amount) {
  const rect = photoWrap.getBoundingClientRect();
  for (let i = 0; i < amount; i++) {
    const sparkle = document.createElement('span');
    sparkle.className = 'floating-heart';
    sparkle.textContent = ['♡', '♥', '✦', '✨', '🌸'][Math.floor(Math.random() * 5)];
    sparkle.style.left = `${Math.max(8, Math.min(window.innerWidth - 30, rect.left + Math.random() * rect.width))}px`;
    sparkle.style.top = `${Math.max(10, rect.top + rect.height * (0.25 + Math.random() * 0.5))}px`;
    sparkle.style.color = ['#e98ba8', '#e9b4c3', '#d6a0c7'][i % 3];
    document.body.appendChild(sparkle);
    sparkle.addEventListener('animationend', () => sparkle.remove());
  }
}
