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
    // is current player rollin(g)?
    g: 0,
    // (l)ose turn
    l: 0,
    // (w)inner
    w: 0,
    // (t)urn total
    // While the turn total could be calculated from the
    // rolls, storing it as a separate value means it does
    // not need to be calculated, e.g. using `reduce`, which
    // saves bytes.
    t: 0,
    d: ''
  },
  {
    // a = target
    // b = prop
    // c = value
    // Call D() to update UI after setting value
    set: (a, b, c) => !D(a[b] = c),
  }
);

// (N)ext player
N = () => {
  // Empty rolls
  s.r = [];
  // Reset turn total
  s.t = 0;
  // Reset dice face
  s.d = '';
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
  a.s += s.t;
  // Target score is 100
  // Set the current player as the winner if their
  // score is 100 or more when they end their turn.
  // Go to next player if score is less than 100.
  a.s > 99 ? (s.w = a) : N();
};

// Play (T)urn
T = async (a) => {
  // a = result of roll
  // Set "is rolling" flag for UI updates
  s.g = 1;
  // Reset dice face
  s.d = '';
  // Roll dice animation
  while (s.d != '...') {
    s.d += '.';
    await new Promise((a) => setTimeout(a, 99));
  }
  // Unset "is rolling" flag
  s.g = 0;
  // Get dice value
  a = ~~(Math.random() * 6) + 1;
  // Add roll to turn, note reassigning the array
  // will trigger the proxy's set handler.
  s.r = [...s.r, a];
  // Add roll to turn total
  s.t += a;
  // Set dice face for UI updates
  s.d = `&#${9855 + a};`;

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
  // Assumes AI has index of 1
  while (s.i > 0 && !s.w) {
    // Add delay to AI actions
    await new Promise((a) => setTimeout(a, s.t < 20 ? 300 : 1e3));
    // AI will stop rolling if their turn total is 20 or more,
    // or if they will win the game.
    if (s.t > 19 || s.p[s.i].s + s.t > 99) {
      E();
    } else {
      await T();
    }
  }
};

// (D)raw
D = (a, b, c) => {
  // Render main UI
  a = `<div>${s.p[0].n}: ${s.p[0].s}</div><div>${s.p[1].n}: ${s.p[1].s}</div><div id="x"><p>${s.p[s.i].n}</p><b class="d ${s.g || 'z'}">${s.d || '?'}</b><p>${s.l ? 'Lose Turn!' : s.r.join("+") || '&nbsp;'}</p></div>`;
  // Show as if it's the human's turn, and they're not rolling, and they haven't lost their turn
  b = !(s.i || s.g || s.l) ? `<div><a onclick="T()"><u>ROLL</u></a></div><div><a onclick="E()"><u>HOLD</u></a></div>` : '';
  // Show winner if set
  c = s.w ? `<div id="x"><p>${s.w.n} Wins!</p><a onclick="R()"><u>PLAY</u></a></div>` : '';
  m.innerHTML = c || `${a}${b}`;
};
// Set meta viewport tag and styles
// It's a real shame how expensive it is to set the viewport,
// however the mobile experience is important!
// Note, while it might seem counterintuitive to use `font:<size>/1 monospace`
// for multiple elements, it takes advantage of regpack's string compression. 
y.innerHTML = `<meta name="viewport" content="width=device-width"><style>*{font:1rem/1 monospace;text-align:center}div{width:50%;float:left}#x{width:100%}p,u{font:2em/1 monospace}.d{font:2em/4 monospace}.z{font:8em/1 monospace}</style>`

// (R)eset
// s = (s)tate
R = () => D(s = G());

R();
