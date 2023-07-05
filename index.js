// Pig Game
// https://en.wikipedia.org/wiki/Pig_(dice_game)

G = () => new Proxy(
  {
    // (p)layers
    p: [{ n: "Human", s: 0}, { n: "AI", s: 0}],
    // current player (i)ndex
    // 0 = Human
    // 1 = AI
    i: 0,
    // current player (r)olls
    r: [],
    // rollin(g)
    g: 0,
    // (l)ost turn
    l: 0,
    // (w)inner
    w: 0,
    // (t)urn total
    t: 0,
  },
  {
    // a = target
    // b = prop
    // c = value
    set: (a, b, c) => !D(a[b] = c),
  }
);

// (N)ext player
N = () => {
  // Empty rolls
  s.r = [];
  s.t = 0;
  // Game is hardcoded with 2 players
  // Use `s.p.length` to support a dynamic number of players
  s.i = (s.i + 1) % 2;
  // Player 2 is AI
  // IRL playAsAI would only be called if the player is actually
  // an AI player. However, to save bytes, it is always called,
  // and the `while` condition makes it a no-op for the human player.
  /*
  if (s.i > 0) {
    // Play as AI
    A(s.i);
  }
  */
  A();
};

// (E)nd turn
E = (a) => {
  // a = player
  a = s.p[s.i];
  // Add turn total to player score
  // a.s += S();
  a.s += s.t;
  // Target score is 100
  // Go to next player if score is less than 100.
  // Set the current player as the winner if their
  // score is 100 or more when they end their turn.
  a.s < 100 ? N() : (s.w = a);
};

// Play (T)urn
T = async (a) => {
  // a = result of roll
  // Set "rolling" flag for UI updates
  s.g = 1;
  await new Promise((a) => setTimeout(a, 1e3));
  // Unset "rolling" flag
  s.g = 0;
  // Roll dice
  a = ~~(Math.random() * 6) + 1;
  
  // Add roll to turn, note reassigning the array
  // will trigger the proxy's set handler.
  s.r = [...s.r, a];
  s.t += a;

  if (a < 2) {
    // Lose turn if roll is 1
    // a < 2 is fewer bytes than b == 1
    // Set "lose turn" flag for UI updates
    s.l = 1;
    await new Promise((a) => setTimeout(a, 1e3));
    // Unset "lose turn" flag
    s.l = 0;
    // Next player
    N();
  }
};

// Play (A)s AI
A = async () => {
  // Play as AI until it's the human's turn,
  // or the AI wins.
  while (!(s.i < 1 || s.w)) {
    // AI will roll if the score for turn is
    // less than 20. Otherwise, they will hold
    // and end their turn.
    // if (S() < 20) {
    if (s.t < 20) {
      await T();
    } else {
      await new Promise((a) => setTimeout(a, 1e3));
      E();
    }
  }
};

// (D)raw
D = (a, b, c) => {
  a = `<div>${s.p[0].n}: ${s.p[0].s}</div><div>${s.p[1].n}: ${s.p[1].s}</div><div id="x"><p>${s.p[s.i].n}</p><p class="${s.g ? 'g' : 'd'}">${s.g < 1 && s.r.length ? s.r[s.r.length - 1] : ''}</p><p>${s.l ? 'LOSE TURN' : s.r.join("+") || ''}</p></div>`;
  b = !(s.i || s.g || s.l) ? `<div><button onclick="T()">ROLL</button></div><div><button onclick="E()">HOLD</button></div>` : '';
  c = s.w ? `<div id="x"><p>${s.w.n} Wins</p><button onclick="R()">PLAY</button></div>` : '';
  m.innerHTML = c || `${a}${b}`;
};

y.innerHTML = `<style>*{font:1em monospace}div{width:50%;float:left;text-align:center}#x{width:100%;font:2em monospace}@keyframes r{100%{transform:rotate(360deg)}}.d,.g{margin:auto;width:4em;height:4em;line-height:4em;background:red}.g{animation:r 1s}</style>`

// (R)eset
// s = (s)tate
R = () => D(s = G());

R();
