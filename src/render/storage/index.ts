const {writeFileSync, existsSync, mkdirSync, readFileSync} = require('fs');
import {clean} from './helpers';

const folder = 'storage';

const getSavedData = (path = `${folder}/data.txt`) => {
    if (!existsSync(path)){
        return null;
    }
    let fileData = readFileSync(path, {encoding:'utf8', flag:'r'});
    if (path.match('.json')) {
        fileData = JSON.parse(fileData);
    }
    return fileData;
}

const saveData = (fileName: string, data: any) => {
    if (!existsSync(folder)){
        mkdirSync(folder);
    }
    writeFileSync(`${folder}/${fileName}`, data);
}


const saveJsonData = (prop: string, savedData: any, isCleared: boolean) => {
    const data = getSavedData(`${folder}/data.json`) || {};

    // @ts-ignore
    data[prop] = isCleared ? clean(savedData) : savedData;
    saveData('data.json', JSON.stringify(data));
}

export {saveData, saveJsonData, getSavedData}
