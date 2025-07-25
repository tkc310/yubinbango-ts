import { YubinBango, Address } from './index';

// Mock window.$yubin for JSONP
const mockData = {
  '1000001': ['13', '千代田区', '千代田', ''],
};

describe('YubinBango', () => {
  let yubin: YubinBango;

  beforeEach(() => {
    yubin = new YubinBango();
  });

  describe('constructor', () => {
    it('should create instance without parameters', () => {
      expect(yubin).toBeInstanceOf(YubinBango);
    });

    it('should handle invalid postal code', () => {
      const callback = jest.fn();
      new YubinBango('123', callback);

      expect(callback).toHaveBeenCalledWith({
        prefecture_id: '',
        prefecture: '',
        city: '',
        street: '',
        building: '',
      });
    });

    it('should use custom URL when provided', () => {
      const customUrl = 'https://example.com/data';
      const yubinWithCustomUrl = new YubinBango('', undefined, {
        url: customUrl,
      });
      expect(yubinWithCustomUrl.URL).toBe(customUrl);
    });

    it('should use default URL when no custom URL provided', () => {
      const yubinWithDefaultUrl = new YubinBango();
      expect(yubinWithDefaultUrl.URL).toBe(
        'https://yubinbango.github.io/yubinbango-data/data'
      );
    });
  });

  describe('chk7', () => {
    it('should return postal code if length is 7', () => {
      expect(yubin.chk7('1000001')).toBe('1000001');
    });

    it('should return undefined if length is not 7', () => {
      expect(yubin.chk7('100000')).toBeUndefined();
      expect(yubin.chk7('10000012')).toBeUndefined();
    });
  });

  describe('addrDic', () => {
    it('should return address dictionary with default values', () => {
      const result = yubin.addrDic();
      expect(result).toEqual({
        prefecture_id: '',
        prefecture: '',
        city: '',
        street: '',
        building: '',
      });
    });

    it('should return address dictionary with provided values', () => {
      const result = yubin.addrDic(
        '13',
        '東京都',
        '千代田区',
        '千代田',
        'テストビル'
      );
      expect(result).toEqual({
        prefecture_id: '13',
        prefecture: '東京都',
        city: '千代田区',
        street: '千代田',
        building: 'テストビル',
      });
    });
  });

  describe('selectAddr', () => {
    it('should return address from valid address array', () => {
      const addr = ['13', '千代田区', '千代田', 'テストビル'];
      const result = yubin.selectAddr(addr);

      expect(result).toEqual({
        prefecture_id: '13',
        prefecture: '東京都',
        city: '千代田区',
        street: '千代田',
        building: 'テストビル',
      });
    });

    it('should return default address for invalid array', () => {
      const result = yubin.selectAddr([]);
      expect(result).toEqual({
        prefecture_id: '',
        prefecture: '',
        city: '',
        street: '',
        building: '',
      });
    });
  });

  describe('PREFECTURE array', () => {
    it('should contain all 47 prefectures', () => {
      expect(yubin.PREFECTURE).toHaveLength(48); // 0-indexed
      expect(yubin.PREFECTURE[0]).toBeNull(); // 0 is null
      expect(yubin.PREFECTURE[1]).toBe('北海道');
      expect(yubin.PREFECTURE[13]).toBe('東京都');
      expect(yubin.PREFECTURE[47]).toBe('沖縄県');
    });
  });

  describe('URL property', () => {
    it('should have correct URL', () => {
      expect(yubin.URL).toBe(
        'https://yubinbango.github.io/yubinbango-data/data'
      );
    });
  });
});

describe('Address type', () => {
  it('should match expected interface', () => {
    const address: Address = {
      prefecture_id: '13',
      prefecture: '東京都',
      city: '千代田区',
      street: '千代田',
      building: '',
    };

    expect(address).toHaveProperty('prefecture_id');
    expect(address).toHaveProperty('prefecture');
    expect(address).toHaveProperty('city');
    expect(address).toHaveProperty('street');
    expect(address).toHaveProperty('building');
  });
});

describe('Environment compatibility', () => {
  it('should work in Node.js environment', () => {
    // Node.js環境での動作確認
    const yubin = new YubinBango();
    expect(yubin).toBeInstanceOf(YubinBango);
    expect(typeof yubin.getAddr).toBe('function');
  });

  it('should handle environment detection', () => {
    const yubin = new YubinBango();

    // 環境変数の確認
    expect(typeof window).toBe('object'); // Jestのjsdom環境
    expect(typeof document).toBe('object'); // Jestのjsdom環境
  });
});
