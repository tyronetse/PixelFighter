/* Pixel Fighter — Ember (player) vs Frost (CPU).
   Original characters, code-drawn pixel sprites, no external assets.
   Canvas is 960x540 internally; CSS scales it to fit while keeping aspect. */
(function () {
  'use strict';

  var W = 960, H = 540, GROUND = 460, PS = 5;
  var WALK_SPEED = 240, JUMP_V = 640, GRAVITY = 1500;
  var ROUNDS_TO_WIN = 2, ROUND_TIME = 60;
  var PUNCH = { range: 82, dmg: 6, chip: 1, startup: 0.08, active: 0.12, total: 0.35 };
  var KICK = { range: 96, dmg: 9, chip: 2, startup: 0.12, active: 0.14, total: 0.45 };
  var FIRE = { dmg: 7, chip: 2, startup: 0.18, total: 0.45, speed: 430, cooldown: 1.2 };

  /* ---- pixel sprites: '.' = transparent. All standing maps are 16 wide x 20 tall.
     KO map is 22 wide x 8 tall (lying down). Maps face RIGHT; Frost is flipped. ---- */
  var IDLE_A = [
    '................',
    '.....HHHHHH.....',
    '....HHHHHHHH....',
    '....HSSSSSSH....',
    '....HSESSESH....',
    '.....SSSSSS.....',
    '....CCCCCCCC....',
    '...CCCCCCCCCC...',
    '..CC.CCCCCCC.CC.',
    '..CC.CCCCCCC.CC.',
    '..CC..CCCCCC.CC.',
    '.....CCCCCC.....',
    '.....DDDDDD.....',
    '....DDDDDDDD....',
    '....DD....DD....',
    '....DD....DD....',
    '....DD....DD....',
    '....DD....DD....',
    '...DDD....DDD...',
    '...DDD....DDD...'
  ];
  var IDLE_B = [
    '................',
    '.....HHHHHH.....',
    '....HHHHHHHH....',
    '....HSSSSSSH....',
    '....HSESSESH....',
    '.....SSSSSS.....',
    '....CCCCCCCC....',
    '...CCCCCCCCCC...',
    '.CC..CCCCCC..CC.',
    '.CC..CCCCCC..CC.',
    '..CC..CCCCCC.CC.',
    '.....CCCCCC.....',
    '.....DDDDDD.....',
    '....DDDDDDDD....',
    '....DD....DD....',
    '....DD....DD....',
    '....DD....DD....',
    '....DD....DD....',
    '...DDD....DDD...',
    '...DDD....DDD...'
  ];
  var WALK_A = [
    '................',
    '.....HHHHHH.....',
    '....HHHHHHHH....',
    '....HSSSSSSH....',
    '....HSESSESH....',
    '.....SSSSSS.....',
    '....CCCCCCCC....',
    '...CCCCCCCCCC...',
    '..CC.CCCCCCC.CC.',
    '..CC.CCCCCCC.CC.',
    '..CC..CCCCCC.CC.',
    '.....CCCCCC.....',
    '.....DDDDDD.....',
    '....DDDDDDDD....',
    '...DD.....DD....',
    '..DDD.....DDD...',
    '..DD.......DD...',
    '.DDD.......DDD..',
    '.DDD.......DDD..',
    '.DDD.......DDD..'
  ];
  var WALK_B = [
    '................',
    '.....HHHHHH.....',
    '....HHHHHHHH....',
    '....HSSSSSSH....',
    '....HSESSESH....',
    '.....SSSSSS.....',
    '....CCCCCCCC....',
    '...CCCCCCCCCC...',
    '..CC.CCCCCCC.CC.',
    '..CC.CCCCCCC.CC.',
    '..CC..CCCCCC.CC.',
    '.....CCCCCC.....',
    '.....DDDDDD.....',
    '....DDDDDDDD....',
    '....DD...DD.....',
    '....DDD.DDD.....',
    '....DD...DD.....',
    '....DD...DD.....',
    '...DDD...DDD....',
    '...DDD...DDD....'
  ];
  var WALK_C = [
    '................',
    '.....HHHHHH.....',
    '....HHHHHHHH....',
    '....HSSSSSSH....',
    '....HSESSESH....',
    '.....SSSSSS.....',
    '....CCCCCCCC....',
    '...CCCCCCCCCC...',
    '..CC.CCCCCCC.CC.',
    '..CC.CCCCCCC.CC.',
    '..CC..CCCCCC.CC.',
    '.....CCCCCC.....',
    '.....DDDDDD.....',
    '....DDDDDDDD....',
    '....DD....DD....',
    '....DD.....DD...',
    '...DDD......DD..',
    '..DDD........DD.',
    '..DD.........DDD',
    '..DD.........DDD'
  ];
  var WALK_D = [
    '................',
    '.....HHHHHH.....',
    '....HHHHHHHH....',
    '....HSSSSSSH....',
    '....HSESSESH....',
    '.....SSSSSS.....',
    '....CCCCCCCC....',
    '...CCCCCCCCCC...',
    '..CC.CCCCCCC.CC.',
    '..CC.CCCCCCC.CC.',
    '..CC..CCCCCC.CC.',
    '.....CCCCCC.....',
    '.....DDDDDD.....',
    '....DDDDDDDD....',
    '.....DD..DD.....',
    '.....DD..DD.....',
    '.....DD..DD.....',
    '.....DD..DD.....',
    '....DDD..DDD....',
    '....DDD..DDD....'
  ];
  var PUNCH_WINDUP = [
    '................',
    '.....HHHHHH.....',
    '....HHHHHHHH....',
    '....HSSSSSSH....',
    '....HSESSESH....',
    '.....SSSSSS.....',
    '....CCCCCCCC....',
    '...CCCCCCCCCC...',
    'FFCC.CCCCCCC.CC.',
    'FFCC.CCCCCCC.CC.',
    '..CC..CCCCCC.CC.',
    '.....CCCCCC.....',
    '.....DDDDDD.....',
    '....DDDDDDDD....',
    '....DD....DD....',
    '....DD....DD....',
    '....DD....DD....',
    '....DD....DD....',
    '...DDD....DDD...',
    '...DDD....DDD...'
  ];
  var PUNCH_MAP = [
    '................',
    '.....HHHHHH.....',
    '....HHHHHHHH....',
    '....HSSSSSSH....',
    '....HSESSESH....',
    '.....SSSSSS.....',
    '....CCCCCCCC....',
    '...CCCCCCCCCC...',
    '..CC.CCCCCCCCCCF',
    '..CC.CCCCCCCCCC.',
    '..CC..CCCCCC....',
    '.....CCCCCC.....',
    '.....DDDDDD.....',
    '....DDDDDDDD....',
    '....DD....DD....',
    '....DD....DD....',
    '....DD....DD....',
    '....DD....DD....',
    '...DDD....DDD...',
    '...DDD....DDD...'
  ];
  var KICK_LIFT = [
    '................',
    '.....HHHHHH.....',
    '....HHHHHHHH....',
    '....HSSSSSSH....',
    '....HSESSESH....',
    '.....SSSSSS.....',
    '....CCCCCCCC....',
    '...CCCCCCCCCC...',
    '..CC.CCCCCCC.CC.',
    '..CC.CCCCCCC.CC.',
    '..CC..CCCCCC.CC.',
    '.....CCCCCC.....',
    '.....DDDDDD.....',
    '....DDDDDDDD....',
    '....DD....DD....',
    '....DD....DDDD..',
    '....DD....DDDD..',
    '....DD..........',
    '...DDD..........',
    '...DDD..........'
  ];
  var KICK_MAP = [
    '................',
    '.....HHHHHH.....',
    '....HHHHHHHH....',
    '....HSSSSSSH....',
    '....HSESSESH....',
    '.....SSSSSS.....',
    '....CCCCCCCC....',
    '...CCCCCCCCCC...',
    '..CC.CCCCCCC.CC.',
    '..CC.CCCCCCC.CC.',
    '..CC..CCCCCC.CC.',
    '.....CCCCCC.....',
    '.....DDDDDD.....',
    '....DDDDDDDD....',
    '....DD....DDDDDF',
    '....DD....DDD...',
    '....DD..........',
    '....DD..........',
    '...DDD..........',
    '...DDD..........'
  ];
  var FIRE_MAP = [
    '................',
    '.....HHHHHH.....',
    '....HHHHHHHH....',
    '....HSSSSSSH....',
    '....HSESSESH....',
    '.....SSSSSS.....',
    '....CCCCCCCC....',
    '...CCCCCCCCCC...',
    '..CC.CCCCCCCCCFF',
    '..CC.CCCCCCCCCFF',
    '..CC..CCCCCC....',
    '.....CCCCCC.....',
    '.....DDDDDD.....',
    '....DDDDDDDD....',
    '....DD....DD....',
    '....DD....DD....',
    '....DD....DD....',
    '....DD....DD....',
    '...DDD....DDD...',
    '...DDD....DDD...'
  ];
  var CROUCH_MAP = [
    '................',
    '.....HHHHHH.....',
    '....HHHHHHHH....',
    '....HSSSSSSH....',
    '....HSESSESH....',
    '.....SSSSSS.....',
    '....CCCCCCCC....',
    '...CCCCCCCCCC...',
    '..CC.CCCCCCC.CC.',
    '.....CCCCCC.....',
    '....DDDDDDDD....',
    '...DDDDDDDDDD...',
    '..DDD......DDD..',
    '.DDDD......DDDD.'
  ];
  var JUMP_MAP = [
    '................',
    '.....HHHHHH.....',
    '....HHHHHHHH....',
    '....HSSSSSSH....',
    '....HSESSESH....',
    '.....SSSSSS.....',
    '....CCCCCCCC....',
    '...CCCCCCCCCC...',
    '..CC.CCCCCCC.CC.',
    '..CC.CCCCCCC.CC.',
    '..CC..CCCCCC.CC.',
    '.....CCCCCC.....',
    '.....DDDDDD.....',
    '....DDDDDDDD....',
    '....DDD..DDD....',
    '....DDDDDDDD....',
    '....DD....DD....',
    '....DD....DD....',
    '................',
    '................'
  ];
  var HIT_MAP = [
    '................',
    '......HHHHHH....',
    '.....HHHHHHHH...',
    '.....HSSSSSSH...',
    '.....HSESSESH...',
    '......SSSSSS....',
    '....CCCCCCCC....',
    '...CCCCCCCCCC...',
    '.CC..CCCCCC..CC.',
    '.CC..CCCCCC..CC.',
    '..CC..CCCCCC.CC.',
    '.....CCCCCC.....',
    '.....DDDDDD.....',
    '....DDDDDDDD....',
    '....DD....DD....',
    '...DD.....DD....',
    '..DD.......DD...',
    '..DD.......DD...',
    '.DDD.......DDD..',
    '.DDD.......DDD..'
  ];
  var BLOCK_MAP = [
    '................',
    '.....HHHHHH.....',
    '....HHHHHHHH....',
    '....HSSSSSSH....',
    '....HSESSESH....',
    '.....SSSSSS.....',
    '....CCCCCCCC....',
    '...CCCCCCCCCC...',
    '..CC.CCCCCCCCCCC',
    '..CC.CCCCCCCCCCC',
    '..CC..CCCCCC....',
    '.....CCCCCC.....',
    '.....DDDDDD.....',
    '....DDDDDDDD....',
    '....DD....DD....',
    '....DD....DD....',
    '....DD....DD....',
    '....DD....DD....',
    '...DDD....DDD...',
    '...DDD....DDD...'
  ];
  var KO_MAP = [
    '......................',
    '....HHHHHH............',
    '...HHHHHHHH...........',
    '...HSSSSSSH...........',
    '...HSESSESH...........',
    '...CCCCCCCCCC.........',
    '..CCCCCCCCCCCCCC......',
    '..DDDDDDDDDDDDDDDDDD..'
  ];

  var PALETTES = {
    ember: { H: '#e8a33d', S: '#f2c297', C: '#e8492d', D: '#7a2a1a', E: '#202020', F: '#ffcc33' },
    frost: { H: '#dff3ff', S: '#e8d8c0', C: '#3fa7e8', D: '#1c4e79', E: '#202020', F: '#bfeaff' }
  };

  /* ---- DOM ---- */
  var canvas = document.getElementById('game');
  var ctx = canvas.getContext('2d');
  var startBtn = document.getElementById('startBtn');
  var rematchBtn = document.getElementById('rematchBtn');
  var muteBtn = document.getElementById('muteBtn');

  /* ---- audio: tiny WebAudio bleeps, created only after a user gesture ---- */
  var audioCtx = null, muted = false;
  function unlockAudio() {
    if (!audioCtx) {
      try { audioCtx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { audioCtx = null; }
    }
    if (audioCtx && audioCtx.state === 'suspended') { audioCtx.resume(); }
  }
  function tone(freq, dur, type, vol, slideTo) {
    if (!audioCtx || muted) return;
    try {
      var o = audioCtx.createOscillator(), g = audioCtx.createGain();
      o.type = type || 'square'; o.frequency.setValueAtTime(freq, audioCtx.currentTime);
      if (slideTo) { o.frequency.exponentialRampToValueAtTime(slideTo, audioCtx.currentTime + dur); }
      g.gain.setValueAtTime(vol || 0.12, audioCtx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + dur);
      o.connect(g); g.connect(audioCtx.destination);
      o.start(); o.stop(audioCtx.currentTime + dur);
    } catch (e) { /* audio is decorative; never break the game */ }
  }
  var SFX = {
    punch: function () { tone(170, 0.08, 'square', 0.14); },
    kick: function () { tone(115, 0.12, 'square', 0.16); },
    fire: function () { tone(700, 0.18, 'sawtooth', 0.10, 180); },
    jump: function () { tone(280, 0.12, 'square', 0.08, 520); },
    block: function () { tone(90, 0.05, 'square', 0.08); },
    ko: function () { tone(70, 0.5, 'sawtooth', 0.18, 40); },
    win: function () {
      if (!audioCtx || muted) return;
      var notes = [523, 659, 784], i = 0;
      notes.forEach(function (f) {
        setTimeout(function () { tone(f, 0.16, 'square', 0.12); }, i++ * 140);
      });
    }
  };

  /* ---- input: keyboard + touch share one state object ---- */
  var keys = { left: false, right: false, up: false, down: false, punch: false, kick: false, fire: false, block: false };
  var prev = {};
  function copyKeys() { var k; for (k in keys) { prev[k] = keys[k]; } }
  var KEYMAP = {
    KeyA: 'left', ArrowLeft: 'left', KeyD: 'right', ArrowRight: 'right',
    KeyW: 'up', ArrowUp: 'up', KeyS: 'down', ArrowDown: 'down',
    KeyJ: 'punch', KeyK: 'kick', KeyL: 'fire'
  };
  document.addEventListener('keydown', function (e) {
    unlockAudio();
    if (e.code === 'Enter') { onConfirm(); return; }
    if (e.code === 'KeyM') { toggleMute(); return; }
    var k = KEYMAP[e.code];
    if (k) { keys[k] = true; if (e.code.indexOf('Arrow') === 0) e.preventDefault(); }
  });
  document.addEventListener('keyup', function (e) {
    var k = KEYMAP[e.code];
    if (k) { keys[k] = false; }
  });
  document.addEventListener('pointerdown', unlockAudio, { once: false });

  function bindTouch() {
    var btns = document.querySelectorAll('#touch button');
    btns.forEach(function (b) {
      var k = b.getAttribute('data-k');
      function on(e) { e.preventDefault(); unlockAudio(); keys[k] = true; }
      function off(e) { e.preventDefault(); keys[k] = false; }
      b.addEventListener('touchstart', on, { passive: false });
      b.addEventListener('touchend', off, { passive: false });
      b.addEventListener('touchcancel', off, { passive: false });
      b.addEventListener('mousedown', on);
      b.addEventListener('mouseup', off);
      b.addEventListener('mouseleave', off);
    });
  }
  bindTouch();

  function toggleMute() {
    muted = !muted;
    if (muteBtn) { muteBtn.textContent = muted ? '🔇' : '🔊'; }
  }
  if (muteBtn) { muteBtn.addEventListener('click', function () { unlockAudio(); toggleMute(); }); }

  /* ---- fighters ---- */
  function makeFighter(name, palette, x, facing) {
    return {
      name: name, palette: PALETTES[palette], x: x, y: 0, vx: 0, vy: 0,
      facing: facing, hp: 100, roundsWon: 0, state: 'idle', t: 0,
      atk: null, atkHitDone: false, fireCd: 0, aiT: 0, aiMove: 0, aiBlock: 0
    };
  }
  var player = makeFighter('EMBER', 'ember', 300, 1);
  var cpu = makeFighter('FROST', 'frost', 660, -1);
  var fighters = [player, cpu];

  var phase = 'title'; // title | intro | fight | roundEnd | matchEnd
  var phaseT = 0, round = 1, timer = ROUND_TIME, banner = '', bannerSub = '';
  var fireballs = [], sparks = [];
  var shake = 0, koPause = 0; // screen shake magnitude; KO drama-pause timer
  var aiEnabled = true;

  function other(f) { return f === player ? cpu : player; }
  function canAct(f) { return f.state === 'idle' || f.state === 'walk' || f.state === 'crouch' || f.state === 'block'; }

  function startAttack(f, kind) {
    var data = kind === 'punch' ? PUNCH : kind === 'kick' ? KICK : FIRE;
    f.state = kind; f.t = 0; f.atk = data; f.atkHitDone = false;
    if (kind === 'fire') { f.fireCd = FIRE.cooldown; }
  }

  function chestY(f) { return GROUND - f.y - 55; }

  function applyHit(att, def, dmg, chip, knock) {
    var blocking = def.state === 'block';
    if (blocking) {
      def.hp = Math.max(0, def.hp - chip);
      sparks.push({ x: def.x - def.facing * 20, y: chestY(def), t: 0.15, color: '#7fd4ff' });
      SFX.block();
      if (def.hp <= 0) { endRound(att); }
    } else {
      def.hp = Math.max(0, def.hp - dmg);
      def.state = 'hit'; def.t = 0; def.atk = null;
      def.vx = (def.x >= att.x ? 1 : -1) * knock;
      sparks.push({ x: def.x - def.facing * 20, y: chestY(def), t: 0.15, color: '#ffe066' });
      if (dmg >= 9) { shake = 8; } /* heavy hits shake the screen */
      else if (dmg >= 7) { shake = 5; }
      if (def.hp <= 0) { endRound(att); }
    }
  }

  function endRound(winner) {
    var loser = other(winner);
    loser.state = 'ko'; loser.t = 0; loser.vx = 0;
    winner.roundsWon += 1;
    phase = 'roundEnd'; phaseT = 0;
    banner = 'K.O.!'; bannerSub = winner.name + ' TAKES THE ROUND';
    shake = 14; koPause = 0.7; /* drama pause: action freezes on the KO */
    SFX.ko();
    if (winner.roundsWon >= ROUNDS_TO_WIN) {
      banner = winner === player ? 'YOU WIN!' : 'YOU LOSE';
      bannerSub = winner === player ? 'Ember takes the match!' : 'Frost takes the match!';
    }
  }

  function endRoundTimeout() {
    phase = 'roundEnd'; phaseT = 0;
    if (player.hp === cpu.hp) {
      banner = 'DRAW'; bannerSub = 'No round awarded — go again!';
      return;
    }
    var winner = player.hp > cpu.hp ? player : cpu;
    winner.roundsWon += 1;
    banner = 'TIME UP'; bannerSub = winner.name + ' TAKES THE ROUND';
    if (winner.roundsWon >= ROUNDS_TO_WIN) {
      banner = winner === player ? 'YOU WIN!' : 'YOU LOSE';
      bannerSub = winner === player ? 'Ember takes the match!' : 'Frost takes the match!';
    }
  }

  function resetRound() {
    player.x = 300; cpu.x = 660;
    fighters.forEach(function (f) {
      f.y = 0; f.vx = 0; f.vy = 0; f.hp = 100; f.state = 'idle'; f.t = 0;
      f.atk = null; f.atkHitDone = false; f.fireCd = 0; f.aiT = 0; f.aiMove = 0; f.aiBlock = 0;
    });
    player.facing = 1; cpu.facing = -1;
    fireballs = []; sparks = [];
    timer = ROUND_TIME;
  }

  function startMatch() {
    player.roundsWon = 0; cpu.roundsWon = 0; round = 1;
    resetRound();
    phase = 'intro'; phaseT = 0;
    banner = 'ROUND 1'; bannerSub = 'EMBER vs FROST';
    if (startBtn) { startBtn.classList.add('hidden'); }
    if (rematchBtn) { rematchBtn.classList.add('hidden'); }
  }

  function onConfirm() {
    if (phase === 'title') { startMatch(); }
    else if (phase === 'matchEnd') { startMatch(); }
  }
  if (startBtn) { startBtn.addEventListener('click', function () { unlockAudio(); startMatch(); }); }
  if (rematchBtn) { rematchBtn.addEventListener('click', function () { unlockAudio(); startMatch(); }); }

  /* ---- CPU AI: fair, beatable — decides every 0.16s, blocks only sometimes ---- */
  function aiDecide(dt) {
    var f = cpu, o = player;
    f.aiT -= dt;
    if (f.aiBlock > 0) { f.aiBlock -= dt; }
    if (f.aiT > 0 || !canAct(f) || phase !== 'fight') { return; }
    f.aiT = 0.16;
    var dist = Math.abs(o.x - f.x);
    var toward = o.x > f.x ? 1 : -1;
    f.aiMove = 0;
    if (o.atk && dist < 130 && Math.random() < 0.35) { f.aiBlock = 0.35; return; }
    if (dist > 300) {
      if (f.fireCd <= 0 && Math.random() < 0.45) { startAttack(f, 'fire'); }
      else { f.aiMove = toward; }
    } else if (dist > 110) {
      var r = Math.random();
      if (r < 0.78) { f.aiMove = toward; }
      else if (r < 0.86 && f.y === 0) { f.vy = JUMP_V; f.state = 'jump'; f.t = 0; SFX.jump(); }
      else if (f.fireCd <= 0) { startAttack(f, 'fire'); }
    } else {
      var q = Math.random();
      if (q < 0.42) { startAttack(f, 'punch'); }
      else if (q < 0.70) { startAttack(f, 'kick'); }
      else if (q < 0.82) { f.aiBlock = 0.3; }
      else { f.aiMove = -toward; }
    }
  }

  function fighterInput(f, isPlayer, dt) {
    if (f.state === 'ko') { return; }
    if (f.y === 0 && f.state === 'jump') { f.state = 'idle'; }
    if (!canAct(f)) { return; }
    var o = other(f);
    var away = f.facing === 1 ? 'left' : 'right';
    var toward = f.facing === 1 ? 'right' : 'left';
    if (isPlayer) {
      if (keys.block || keys[away]) { f.state = 'block'; f.vx = 0; return; }
      if (keys.down) { f.state = 'crouch'; f.vx = 0; return; }
      if (keys.up && !prev.up && f.y === 0) { f.vy = JUMP_V; f.state = 'jump'; f.t = 0; SFX.jump(); return; }
      if (keys.punch && !prev.punch) { startAttack(f, 'punch'); return; }
      if (keys.kick && !prev.kick) { startAttack(f, 'kick'); return; }
      if (keys.fire && !prev.fire && f.fireCd <= 0) { startAttack(f, 'fire'); return; }
      if (keys[toward]) { f.state = 'walk'; f.vx = (o.x > f.x ? 1 : -1) * WALK_SPEED; return; }
      if (f.state !== 'idle') { f.state = 'idle'; }
      f.vx = 0;
    } else {
      if (f.aiBlock > 0) { f.state = 'block'; f.vx = 0; return; }
      if (f.aiMove !== 0) { f.state = 'walk'; f.vx = f.aiMove * WALK_SPEED; return; }
      if (f.state !== 'idle') { f.state = 'idle'; }
      f.vx = 0;
    }
  }

  function updateFighter(f, dt) {
    f.t += dt;
    if (f.fireCd > 0) { f.fireCd -= dt; }
    if (f.state === 'punch' || f.state === 'kick' || f.state === 'fire') {
      var data = f.atk;
      if (data && !f.atkHitDone && f.t >= data.startup && f.t <= data.startup + data.active) {
        var o = other(f), range = f.state === 'punch' ? PUNCH.range : f.state === 'kick' ? KICK.range : 0;
        if (range > 0 && o.state !== 'ko' && Math.abs(o.x - f.x) <= range && Math.abs(o.y - f.y) < 45) {
          f.atkHitDone = true;
          applyHit(f, o, data.dmg, data.chip, 260);
          if (f.state === 'punch') { SFX.punch(); } else { SFX.kick(); }
        }
      }
      if (f.state === 'fire' && !f.atkHitDone && f.t >= FIRE.startup) {
        f.atkHitDone = true;
        fireballs.push({ x: f.x + f.facing * 42, y: chestY(f), vx: f.facing * FIRE.speed, owner: f, alive: true });
        SFX.fire();
      }
      if (f.t >= data.total) { f.state = 'idle'; f.atk = null; }
    } else if (f.state === 'hit') {
      if (f.t >= 0.28) { f.state = 'idle'; }
    }
    /* physics */
    if (f.y > 0 || f.vy !== 0) {
      f.y += f.vy * dt;
      f.vy -= GRAVITY * dt;
      if (f.y <= 0) { f.y = 0; f.vy = 0; if (f.state === 'jump') { f.state = 'idle'; } }
    }
    f.x += f.vx * dt;
    if (f.state === 'hit') { f.vx *= Math.max(0, 1 - 6 * dt); }
    if (f.x < 50) { f.x = 50; }
    if (f.x > 910) { f.x = 910; }
    if (f.state !== 'ko') {
      var o2 = other(f);
      f.facing = f.x < o2.x ? 1 : -1;
    }
  }

  function updateFireballs(dt) {
    fireballs.forEach(function (fb) {
      if (!fb.alive) { return; }
      fb.x += fb.vx * dt;
      var o = other(fb.owner);
      if (o.state !== 'ko' && Math.abs(fb.x - o.x) < 36 && Math.abs(fb.y - chestY(o)) < 50) {
        fb.alive = false;
        applyHit(fb.owner, o, FIRE.dmg, FIRE.chip, 200);
        return;
      }
      fireballs.forEach(function (other2) {
        if (other2 !== fb && other2.alive && other2.owner !== fb.owner && Math.abs(other2.x - fb.x) < 20) {
          other2.alive = false; fb.alive = false;
          sparks.push({ x: fb.x, y: fb.y, t: 0.15, color: '#ffffff' });
        }
      });
      if (fb.x < 0 || fb.x > W) { fb.alive = false; }
    });
    fireballs = fireballs.filter(function (fb) { return fb.alive; });
    sparks.forEach(function (s) { s.t -= dt; });
    sparks = sparks.filter(function (s) { return s.t > 0; });
  }

  function update(dt) {
    if (shake > 0) { shake = Math.max(0, shake - dt * 28); }
    if (phase === 'intro') {
      phaseT += dt;
      if (phaseT >= 1.4) { phase = 'fight'; phaseT = 0; banner = 'FIGHT!'; bannerSub = ''; }
      return;
    }
    if (phase === 'roundEnd') {
      if (koPause > 0) { koPause -= dt; return; } /* frozen KO beat, then banner timing runs */
      phaseT += dt;
      fighters.forEach(function (f) { if (f.state !== 'ko') { f.state = 'idle'; } });
      if (phaseT >= 1.8) {
        var pw = player.roundsWon >= ROUNDS_TO_WIN, cw = cpu.roundsWon >= ROUNDS_TO_WIN;
        if (pw || cw) {
          phase = 'matchEnd'; phaseT = 0;
          banner = pw ? 'YOU WIN!' : 'YOU LOSE';
          bannerSub = pw ? 'Ember takes the match!' : 'Frost takes the match!';
          if (pw) { SFX.win(); }
          if (rematchBtn) { rematchBtn.classList.remove('hidden'); }
        } else if (banner === 'DRAW') {
          resetRound();
          phase = 'intro'; phaseT = 0;
          banner = 'ROUND ' + round; bannerSub = 'EMBER vs FROST';
        } else {
          round += 1;
          resetRound();
          phase = 'intro'; phaseT = 0;
          banner = 'ROUND ' + round; bannerSub = 'EMBER vs FROST';
        }
      }
      return;
    }
    if (phase !== 'fight') { return; }
    timer -= dt;
    if (timer <= 0) { timer = 0; endRoundTimeout(); copyKeys(); return; }
    if (phaseT < 0.6) { phaseT += dt; } /* FIGHT! banner lingers briefly */
    if (aiEnabled) { aiDecide(dt); }
    fighterInput(player, true, dt);
    fighterInput(cpu, false, dt);
    updateFighter(player, dt);
    updateFighter(cpu, dt);
    updateFireballs(dt);
    copyKeys();
  }

  /* ---- drawing ---- */
  function drawSprite(map, palette, cx, bottom, flip) {
    var rows = map.length, cols = map[0].length;
    var left = cx - (cols * PS) / 2;
    var top = bottom - rows * PS;
    for (var r = 0; r < rows; r++) {
      for (var c = 0; c < cols; c++) {
        var ch = map[r][flip ? cols - 1 - c : c];
        if (ch === '.') { continue; }
        ctx.fillStyle = palette[ch] || '#ff00ff';
        ctx.fillRect(left + c * PS, top + r * PS, PS, PS);
      }
    }
  }
  function spriteFor(f) {
    if (f.state === 'ko') { return KO_MAP; }
    if (f.state === 'hit') { return HIT_MAP; }
    if (f.state === 'block') { return BLOCK_MAP; }
    if (f.state === 'crouch') { return CROUCH_MAP; }
    if (f.state === 'jump' || f.y > 0) { return JUMP_MAP; }
    if (f.state === 'punch') { return f.t < PUNCH.startup ? PUNCH_WINDUP : PUNCH_MAP; }
    if (f.state === 'fire') { return FIRE_MAP; }
    if (f.state === 'kick') { return f.t < KICK.startup ? KICK_LIFT : KICK_MAP; }
    if (f.state === 'walk') {
      var frames = [WALK_A, WALK_B, WALK_C, WALK_D];
      return frames[Math.floor(f.t / 0.12) % 4];
    }
    return Math.floor(f.t / 0.4) % 2 === 0 ? IDLE_A : IDLE_B;
  }

  function drawBackground() {
    /* sky, drawn oversized so screen shake never reveals an edge */
    ctx.fillStyle = '#1a1a2e'; ctx.fillRect(-20, -20, W + 40, H + 40);
    ctx.fillStyle = '#f5e9a8'; ctx.fillRect(770, 60, 56, 56); /* pixel sun */
    /* blocky clouds */
    ctx.fillStyle = '#3a3a5e';
    ctx.fillRect(90, 70, 90, 16); ctx.fillRect(110, 58, 50, 12);
    ctx.fillRect(520, 110, 110, 16); ctx.fillRect(545, 98, 60, 12);
    /* distant skyline silhouettes with lit windows */
    var skyline = [[40, 300, 110, 160], [180, 330, 80, 130], [300, 290, 100, 170],
                   [600, 310, 90, 150], [720, 290, 120, 170], [870, 330, 70, 130]];
    skyline.forEach(function (b) {
      ctx.fillStyle = '#2a2a4a'; ctx.fillRect(b[0], b[1], b[2], b[3]);
      ctx.fillStyle = '#ffd97a';
      for (var wy = b[1] + 18; wy < b[1] + b[3] - 14; wy += 26) {
        for (var wx = b[0] + 12; wx < b[0] + b[2] - 12; wx += 26) {
          if ((wx + wy) % 52 === 0) { ctx.fillRect(wx, wy, 10, 12); }
        }
      }
    });
    /* streetlamp */
    ctx.fillStyle = '#44445e'; ctx.fillRect(500, 330, 6, 130);
    ctx.fillStyle = '#ffe066'; ctx.fillRect(492, 318, 22, 14);
    /* street: sidewalk strip, then road with a dashed center line */
    ctx.fillStyle = '#6b6b7a'; ctx.fillRect(-20, GROUND, W + 40, 18);
    ctx.fillStyle = '#23232e'; ctx.fillRect(-20, GROUND + 18, W + 40, H - GROUND);
    ctx.fillStyle = '#c9a227';
    for (var dx = 0; dx < W + 40; dx += 64) { ctx.fillRect(dx - 20, GROUND + 52, 34, 5); }
    ctx.fillStyle = '#3f7a35'; ctx.fillRect(-20, GROUND, W + 40, 4);
  }

  function drawBar(x, y, w, frac, color, flip) {
    ctx.fillStyle = '#400'; ctx.fillRect(x, y, w, 22);
    ctx.fillStyle = color;
    var fw = Math.max(0, w * frac);
    if (flip) { ctx.fillRect(x + w - fw, y, fw, 22); } else { ctx.fillRect(x, y, fw, 22); }
    ctx.fillStyle = '#fff'; ctx.strokeStyle = '#fff';
    ctx.strokeRect(x, y, w, 22);
  }
  function drawPips(x, y, won, color) {
    for (var i = 0; i < ROUNDS_TO_WIN; i++) {
      ctx.fillStyle = i < won ? color : '#333';
      ctx.beginPath(); ctx.arc(x + i * 22, y, 8, 0, Math.PI * 2); ctx.fill();
    }
  }

  function drawHUD() {
    ctx.textAlign = 'left'; ctx.font = 'bold 20px monospace';
    ctx.fillStyle = '#ffb347'; ctx.fillText('EMBER', 30, 32);
    ctx.textAlign = 'right'; ctx.fillStyle = '#7fd4ff'; ctx.fillText('FROST', W - 30, 32);
    drawBar(30, 40, 380, player.hp / 100, '#ffb347', false);
    drawBar(W - 410, 40, 380, cpu.hp / 100, '#7fd4ff', true);
    drawPips(30, 78, player.roundsWon, '#ffb347');
    ctx.textAlign = 'right'; drawPips(W - 30 - 22, 78, cpu.roundsWon, '#7fd4ff');
    ctx.textAlign = 'center'; ctx.font = 'bold 34px monospace';
    ctx.fillStyle = '#fff'; ctx.fillText(String(Math.ceil(timer)), W / 2, 66);
  }

  function drawBanner() {
    if (phase === 'fight' && phaseT >= 0.6) { return; }
    if (phase === 'title' || !banner) { return; }
    ctx.textAlign = 'center';
    ctx.font = 'bold 72px monospace';
    ctx.fillStyle = '#000'; ctx.fillText(banner, W / 2 + 4, 214);
    ctx.fillStyle = '#ffe066'; ctx.fillText(banner, W / 2, 210);
    if (bannerSub) {
      ctx.font = 'bold 24px monospace';
      ctx.fillStyle = '#fff'; ctx.fillText(bannerSub, W / 2, 260);
    }
  }

  function draw() {
    ctx.save();
    if (shake > 0) {
      ctx.translate((Math.random() * 2 - 1) * shake, (Math.random() * 2 - 1) * shake);
    }
    drawBackground();
    /* shadow + fighters (loser drawn first so winner overlaps on KO) */
    var order = player.state === 'ko' ? [player, cpu] : [cpu, player];
    order.forEach(function (f) {
      var map = spriteFor(f);
      ctx.fillStyle = 'rgba(0,0,0,0.35)';
      ctx.fillRect(f.x - 32, GROUND - 4, 64, 6);
      var bob = f.state === 'idle' && Math.floor(f.t / 0.4) % 2 === 1 ? -PS : 0;
      drawSprite(map, f.palette, f.x, GROUND - f.y + bob, f.facing === -1);
    });
    fireballs.forEach(function (fb) {
      var c = fb.owner === player ? '#ff9a3d' : '#7fd4ff';
      ctx.fillStyle = c;
      ctx.fillRect(fb.x - 15, fb.y - 10, 30, 20);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(fb.x - 5, fb.y - 5, 10, 10);
    });
    sparks.forEach(function (s) {
      /* chunky plus-shaped impact spark */
      ctx.fillStyle = s.color;
      var a = Math.max(5, s.t * 60);
      ctx.fillRect(s.x - a, s.y - a / 3, a * 2, (a * 2) / 3);
      ctx.fillRect(s.x - a / 3, s.y - a, (a * 2) / 3, a * 2);
    });
    ctx.restore();
    drawHUD();
    if (phase === 'title') {
      ctx.textAlign = 'center';
      ctx.font = 'bold 84px monospace';
      ctx.fillStyle = '#000'; ctx.fillText('PIXEL FIGHTER', W / 2 + 4, 174);
      ctx.fillStyle = '#ff5a3c'; ctx.fillText('PIXEL FIGHTER', W / 2, 170);
      ctx.font = 'bold 30px monospace';
      ctx.fillStyle = '#fff'; ctx.fillText('EMBER  vs  FROST', W / 2, 230);
      ctx.font = '20px monospace';
      ctx.fillStyle = '#ccc'; ctx.fillText('Press ENTER or tap START FIGHT', W / 2, 300);
      ctx.fillText('A/D move · W jump · S crouch · J punch · K kick · L fireball', W / 2, 330);
      ctx.fillText('Hold AWAY from your opponent to block', W / 2, 356);
    } else {
      drawBanner();
    }
  }

  var last = 0;
  function loop(ts) {
    requestAnimationFrame(loop);
    if (!last) { last = ts; }
    var dt = Math.min(0.05, (ts - last) / 1000);
    last = ts;
    update(dt);
    draw();
  }

  /* expose internals for the verification harness */
  window.PF = {
    fighters: fighters, player: player, cpu: cpu,
    update: update, startMatch: startMatch, keys: keys, prev: prev,
    get phase() { return phase; },
    get phaseT() { return phaseT; },
    get shake() { return shake; },
    get koPause() { return koPause; },
    get round() { return round; },
    get timer() { return timer; },
    set aiEnabled(v) { aiEnabled = v; },
    get aiEnabled() { return aiEnabled; },
    sprites: { IDLE_A: IDLE_A, IDLE_B: IDLE_B, WALK_A: WALK_A, WALK_B: WALK_B,
      WALK_C: WALK_C, WALK_D: WALK_D, PUNCH_WINDUP: PUNCH_WINDUP, PUNCH_MAP: PUNCH_MAP,
      KICK_LIFT: KICK_LIFT, KICK_MAP: KICK_MAP, FIRE_MAP: FIRE_MAP,
      CROUCH_MAP: CROUCH_MAP, JUMP_MAP: JUMP_MAP, HIT_MAP: HIT_MAP, BLOCK_MAP: BLOCK_MAP, KO_MAP: KO_MAP }
  };

  draw();
  requestAnimationFrame(loop);
})();
