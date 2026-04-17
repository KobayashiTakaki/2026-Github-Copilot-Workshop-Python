
// タイマー設定
const WORK_MINUTES = 25;
const BREAK_MINUTES = 5;
let timer = null;
let remainingSeconds = WORK_MINUTES * 60;
let isRunning = false;
let isWork = true;


// 要素取得
const timerTime = document.querySelector('.timer-time');
const startBtn = document.querySelector('.start-btn');
const resetBtn = document.querySelector('.reset-btn');
const timerState = document.querySelector('.timer-state');
const progressCircle = document.querySelectorAll('.timer-circle svg circle')[1];
const FULL_DASH_ARRAY = 502; // 2πr (r=80)


// 時間表示とプログレスバーを更新
function updateDisplay() {
	const min = String(Math.floor(remainingSeconds / 60)).padStart(2, '0');
	const sec = String(remainingSeconds % 60).padStart(2, '0');
	timerTime.textContent = `${min}:${sec}`;

	// プログレスバー更新
	const total = isWork ? WORK_MINUTES * 60 : BREAK_MINUTES * 60;
	const percent = 1 - (remainingSeconds / total);
	progressCircle.setAttribute('stroke-dashoffset', FULL_DASH_ARRAY * percent);
}

// タイマー開始
function startTimer() {
	if (isRunning) return;
	isRunning = true;
	timer = setInterval(() => {
		if (remainingSeconds > 0) {
			remainingSeconds--;
			updateDisplay();
		} else {
			clearInterval(timer);
			isRunning = false;
			// 状態切り替え
			isWork = !isWork;
			timerState.textContent = isWork ? '作業中' : '休憩中';
			remainingSeconds = isWork ? WORK_MINUTES * 60 : BREAK_MINUTES * 60;
			updateDisplay();
		}
	}, 1000);
}

// タイマーリセット
function resetTimer() {
	clearInterval(timer);
	isRunning = false;
	remainingSeconds = isWork ? WORK_MINUTES * 60 : BREAK_MINUTES * 60;
	timerState.textContent = isWork ? '作業中' : '休憩中';
	updateDisplay();
}


// ボタンイベント
startBtn.addEventListener('click', startTimer);
resetBtn.addEventListener('click', resetTimer);

// 初期表示
timerState.textContent = isWork ? '作業中' : '休憩中';
updateDisplay();
