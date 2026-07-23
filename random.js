function customRandomSeed(seed) {
  let m_w = seed;
  let m_z = 987654321;

  function random() {
    m_z = (36969 * (m_z & 65535) + (m_z >>> 16)) & 0xffffffff;
    m_w = (18000 * (m_w & 65535) + (m_w >>> 16)) & 0xffffffff;
    let result = ((m_z << 16) + m_w) >>> 0;
    result /= 4294967296;

    return result;
  }

  // Generate a random integer within a range
  function randomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(random() * (max - min + 1)) + min;
  }

  // Public methods of the random number generator
  return {
    random,
    randomInt,
  };
}
