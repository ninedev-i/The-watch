const {ipcRenderer} = require('electron');
const {saveJsonData} = require('./storage')
const {getClassListString} = require('./storage/helpers')

document.addEventListener('DOMContentLoaded', () => {
    document.addEventListener('mouseover', (ev) => {
        const styles = `cursor: pointer; outline: green dashed 3px !important; outline-offset: -2px;`;
        //@ts-ignore
        ev.target.setAttribute('style', styles);
    });
    document.addEventListener('mouseout', (ev) => {
        //@ts-ignore
        ev.target.removeAttribute('style');
    });
    document.addEventListener('click', (ev) => {
        ev.preventDefault();
        //@ts-ignore
        ev.target.removeAttribute('style')
        //@ts-ignore
        let selectedDiv = typeof ev.target.innerHTML === 'string' ? ev.target.parentNode : ev.target;

        saveJsonData('selectorData', selectedDiv.innerHTML, true);
        // FIXME: тут может и не быть класса
        const selector = `${getClassListString(selectedDiv.parentNode)} ${getClassListString(selectedDiv)}`
        saveJsonData('selector', selector);
        ipcRenderer.invoke('close-window');
    });
});
