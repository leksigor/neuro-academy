function activate(kind, z) {
  if (kind === "sigmoid") return 1 / (1 + Math.exp(-z));
  if (kind === "tanh") return Math.tanh(z);
  if (kind === "relu") return Math.max(0, z);
  return z >= 0 ? 1 : 0;
}
function sigmoid(z) { return 1 / (1 + Math.exp(-z)); }
function xorForward(x1, x2, p) {
  const h1z = p.w11 * x1 + p.w12 * x2 + p.b1;
  const h2z = p.w21 * x1 + p.w22 * x2 + p.b2;
  const h1 = sigmoid(h1z);
  const h2 = sigmoid(h2z);
  const yz = p.wo1 * h1 + p.wo2 * h2 + p.bo;
  const y = sigmoid(yz);
  return { h1, h2, y };
}
