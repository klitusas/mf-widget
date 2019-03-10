
var assert = require('assert');
const showroom = require('showroom/puppeteer')();
import data from "../src/data/data.json";

describe('Testing Marfeel Widget', function () {
  before(async () => {
    await showroom.start()
  });
  after(async () => {
    await showroom.stop()
  });
  beforeEach(async () => {
    await showroom.setTestSubject('marfeel-widget');
  });

  it('return json that has length of 3', async () => {
    assert.equal(data.length, 3);
  });

  it('calculated sum equals 20000', async ()  => {
    // Cannot read property 'setAttribute' of undefined
    // TypeError: Failed to resolve module specifier "d3".
    // Relative references must start with either "/", "./", or "../".
    await showroom.setAttribute('type', 'revenue');
    const innerHTML = showroom.find('// div');
  });
});