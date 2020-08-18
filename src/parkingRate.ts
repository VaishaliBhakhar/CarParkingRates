import * as parkingRateService from './parkingRate.service';

export const getParkingRate = async(req:any, res:any) => {
    let datas = await parkingRateService.determineTypeOfRate(req.params.entry,req.params.exit);
    res.send(datas);
}