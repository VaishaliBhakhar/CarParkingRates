import * as parkingRateService from './parkingRate.service';

export const getParkingRate = async(req:any, res:any) => {
    let datas = await parkingRateService.determineTypeOfRate(req.params.entry,req.params.exit);
    if(datas.name === ''){
        res.send('Invalid Data');
    } else {
        res.send(datas);
    }
    
}