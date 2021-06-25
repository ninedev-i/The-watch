const clean = (data: string) => {
    return data.replace(/(\s|")/gi, '');
}

const getClassListString = (selector: Element) => {
    let output = selector.classList.value;
    output = `.${output}`;
    output = output.replace(/\s+/i, '.');
    return output;
}

export {getClassListString, clean}
