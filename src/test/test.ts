import * as parkingRateService from '../parkingRate.service';
import { expect } from 'chai';

describe('Invalid Data', () => {
  it('should return Invalid Data', () => {
    const result = parkingRateService.determineTypeOfRate("2020-06-24 23:00:00","2020-06-24 16:00:00");
    expect(JSON.stringify(result)).to.equal('{"name":"","totalPrice":0}');
  });
});

describe('Early Bird Parking Rate', () => {
  it('should return object', () => {
    const result = parkingRateService.determineTypeOfRate("2020-06-24 07:00:00","2020-06-24 16:00:00");
    expect(JSON.stringify(result)).to.equal('{"name":"Early Bird","totalPrice":13}');
  });
});

describe('Night Parking Rate', () => {
  it('should return object', () => {
    const result = parkingRateService.determineTypeOfRate("2020-06-24 23:00:00","2020-06-25 16:00:00");
    expect(JSON.stringify(result)).to.equal('{"name":"Night Rate","totalPrice":6}');
  });
});

describe('Night Rate - Friday midnight entry, next day exit', () => {
  it('should return object', () => {
    const result = parkingRateService.determineTypeOfRate("2020-06-26 23:00:00","2020-06-27 17:00:00");
    expect(JSON.stringify(result)).to.equal('{"name":"Night Rate","totalPrice":6}');
  });
});

describe('Weekly Parking Rate', () => {
  it('should return object', () => {
    const result = parkingRateService.determineTypeOfRate("2020-06-27 06:00:00","2020-06-27 17:00:00");
    expect(JSON.stringify(result)).to.equal('{"name":"Weekend Rate","totalPrice":10}');
  });
});

describe('Weekly Rate - Over two days', () => {
  it('should return object', () => {
    const result = parkingRateService.determineTypeOfRate("2020-06-27 06:00:00","2020-06-28 14:00:00");
    expect(JSON.stringify(result)).to.equal('{"name":"Weekend Rate","totalPrice":10}');
  });
});

describe('Hourly Rate - 0-1 hour', () => {
  it('should return object', () => {
    const result = parkingRateService.determineTypeOfRate("2020-06-25 06:00:00","2020-06-25 07:00:00");
    expect(JSON.stringify(result)).to.equal('{"name":"Hourly Rate","totalPrice":5}');
  });
});

describe('Hourly Rate - 1-2 hours', () => {
  it('should return object', () => {
    const result = parkingRateService.determineTypeOfRate("2020-06-25 06:00:00","2020-06-25 07:40:00");
    expect(JSON.stringify(result)).to.equal('{"name":"Hourly Rate","totalPrice":10}');
  });
});

describe('Hourly Rate - 2-3 hours', () => {
  it('should return object', () => {
    const result = parkingRateService.determineTypeOfRate("2020-06-25 06:00:00","2020-06-25 08:40:00");
    expect(JSON.stringify(result)).to.equal('{"name":"Hourly Rate","totalPrice":15}');
  });
});

describe('Hourly Rate - 3+ hours', () => {
  it('should return object', () => {
    const result = parkingRateService.determineTypeOfRate("2020-06-25 06:00:00","2020-06-25 21:40:00");
    expect(JSON.stringify(result)).to.equal('{"name":"Hourly Rate","totalPrice":20}');
  });
});